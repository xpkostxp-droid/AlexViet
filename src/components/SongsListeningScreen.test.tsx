import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import SongsListeningScreen from './SongsListeningScreen';
import { songLines } from '../content/songs/family';
let host: HTMLDivElement, root: Root;
const click = async (text: string) => { const button = [...host.querySelectorAll('button')].find(b => b.textContent?.includes(text)); expect(button).toBeDefined(); await act(async () => button!.click()); };
beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  await act(async () => root.render(<SongsListeningScreen onBack={vi.fn()} />));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('song listening', () => {
  it('opens with vocabulary, then supports independent language toggles including both hidden', async () => {
    expect(host.querySelector('audio')).toBeNull();
    expect(host.querySelectorAll('dt').length).toBeGreaterThan(17);
    await click('Перейти к песне');
    expect(host.querySelector('source[type="audio/mp4"]')?.getAttribute('src')).toContain('ca-nha-thuong-nhau.m4a');
    expect(host.querySelector('source[type="audio/mpeg"]')).not.toBeNull();
    await click('Вьетнамский текст');
    expect(host.querySelector('.course-dialogue-vi')).toBeNull();
    expect(host.querySelector('.course-dialogue-ru')).not.toBeNull();
    await click('Русский перевод');
    expect(host.querySelector('.course-dialogue-ru')).toBeNull();
    expect(host.querySelectorAll('.course-dialogue-line')).toHaveLength(songLines.length);
    await click('Вьетнамский текст');
    expect(host.querySelector('.course-dialogue-vi')).not.toBeNull();
    expect(host.querySelector('.course-dialogue-ru')).toBeNull();
  });
  it('highlights the actual line on seek and clears the highlight in an interlude', async () => {
    await click('Перейти к песне');
    const audio = host.querySelector('audio')!;
    await act(async () => { audio.currentTime = songLines[5].start + .1; audio.dispatchEvent(new Event('seeked', { bubbles: true })); });
    expect(host.querySelector('[aria-current="true"]')?.id).toBe('song-line-5');
    await act(async () => { audio.currentTime = 48; audio.dispatchEvent(new Event('timeupdate', { bubbles: true })); });
    expect(host.querySelector('[aria-current="true"]')).toBeNull();
  });
  it('retains a requested seek until metadata is ready and provides a retry on failure', async () => {
    await click('Перейти к песне');
    const audio = host.querySelector('audio')!;
    await act(async () => (host.querySelector('#song-line-7') as HTMLButtonElement).click());
    expect(audio.play).toHaveBeenCalled();
    await act(async () => audio.dispatchEvent(new Event('loadedmetadata', { bubbles: true })));
    expect(audio.currentTime).toBe(songLines[7].start);
    await act(async () => audio.dispatchEvent(new Event('error', { bubbles: true })));
    expect(host.querySelector('[role="alert"]')).not.toBeNull();
    await click('Повторить загрузку');
    expect(audio.load).toHaveBeenCalled();
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });
});
