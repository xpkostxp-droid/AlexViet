const ATTEMPT_KEY = 'alexviet-update-attempt';

export function refreshApp(version = String(Date.now())) {
  const url = new URL(window.location.href);
  url.searchParams.set('app-version', version);
  window.location.replace(url.href);
}

interface UpdateOptions {
  currentVersion?: string;
  fetchVersion?: () => Promise<string | undefined>;
  reload?: (version: string) => void;
}

// A small uncached request only on launch and resume; no periodic downloads.
export function startAppUpdates({ currentVersion = __APP_VERSION__, fetchVersion = loadVersion, reload = refreshApp }: UpdateOptions = {}) {
  let checking = false;
  let stopped = false;
  let attempted: string | undefined;
  async function check() {
    if (checking || stopped || document.visibilityState === 'hidden' || !navigator.onLine) return;
    checking = true;
    try {
      const version = await fetchVersion();
      if (stopped || !version || version === currentVersion || version === attempted) return;
      // Prevent a reload loop if a CDN temporarily serves an older HTML file.
      try { if (sessionStorage.getItem(ATTEMPT_KEY) === version) return; } catch { /* private browsing */ }
      attempted = version;
      try { sessionStorage.setItem(ATTEMPT_KEY, version); } catch { /* storage is optional */ }
      reload(version);
    } catch { /* Keep the current app usable when offline or the server is unavailable. */ }
    finally { checking = false; }
  }
  const visible = () => { if (document.visibilityState === 'visible') void check(); };
  window.addEventListener('pageshow', check);
  window.addEventListener('online', check);
  document.addEventListener('visibilitychange', visible);
  void check();
  return () => {
    stopped = true;
    window.removeEventListener('pageshow', check);
    window.removeEventListener('online', check);
    document.removeEventListener('visibilitychange', visible);
  };
}

async function loadVersion() {
  const url = new URL(`${import.meta.env.BASE_URL}version.json`, document.baseURI);
  url.searchParams.set('check', String(Date.now()));
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return;
  const data: unknown = await response.json();
  if (data && typeof data === 'object' && 'version' in data && typeof data.version === 'string') return data.version;
}
