import { afterEach, describe, expect, it, vi } from 'vitest';
import { startAppUpdates } from './appUpdates';
let stop: (() => void) | undefined;
afterEach(() => { stop?.(); sessionStorage.clear(); vi.restoreAllMocks(); });
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
describe('app updates', () => {
  it('reloads a new version on launch without removing study progress', async () => {
    localStorage.setItem('alexViet.test.vietCards.progress.v1', 'saved');
    const reload = vi.fn();
    stop = startAppUpdates({ currentVersion: 'old', fetchVersion: async () => 'new', reload });
    await settle();
    expect(reload).toHaveBeenCalledWith('new');
    expect(localStorage.getItem('alexViet.test.vietCards.progress.v1')).toBe('saved');
    window.dispatchEvent(new Event('pageshow'));
    await settle();
    expect(reload).toHaveBeenCalledTimes(1);
  });
  it('checks again on resume and updates only when the version changes', async () => {
    const fetchVersion = vi.fn().mockResolvedValueOnce('same').mockResolvedValue('new');
    const reload = vi.fn();
    stop = startAppUpdates({ currentVersion: 'same', fetchVersion, reload });
    await settle();
    expect(reload).not.toHaveBeenCalled();
    document.dispatchEvent(new Event('visibilitychange'));
    await settle();
    expect(reload).toHaveBeenCalledWith('new');
  });
  it('ignores network failure and retries when the connection returns', async () => {
    const fetchVersion = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue('new');
    const reload = vi.fn();
    stop = startAppUpdates({ currentVersion: 'old', fetchVersion, reload });
    await settle();
    expect(reload).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('online'));
    await settle();
    expect(reload).toHaveBeenCalledWith('new');
  });
  it('does not loop when a previous navigation already attempted the same release', async () => {
    sessionStorage.setItem('alexviet-update-attempt', 'new');
    const reload = vi.fn();
    stop = startAppUpdates({ currentVersion: 'old', fetchVersion: async () => 'new', reload });
    await settle();
    expect(reload).not.toHaveBeenCalled();
  });
});
