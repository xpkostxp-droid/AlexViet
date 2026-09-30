// Общие безопасные обёртки над localStorage.
// Используются progress.ts и lastActivity.ts, чтобы не дублировать
// обработку отсутствующего/недоступного хранилища и повреждённых данных.

export function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function readJSON(key: string): unknown {
  if (!hasLocalStorage()) return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Хранилище недоступно (например, приватный режим) — тихо игнорируем.
  }
}
