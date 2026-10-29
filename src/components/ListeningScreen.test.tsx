import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ListeningScreen from './ListeningScreen';
import { listeningLessons } from '../content/listening/lessons';

class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  ontimeupdate: (() => void) | null = null; onended: (() => void) | null = null; onpause: (() => void) | null = null; onerror: (() => void) | null = null;
  dispatchEvent(event: Event) { const handler = this[`on${event.type}` as 'onerror']; handler?.(); return super.dispatchEvent(event); }
  src = ''; preload = ''; currentTime = 0; readyState = 1;
  play = vi.fn(async () => {});
  pause = vi.fn(() => this.dispatchEvent(new Event('pause')));
  load = vi.fn();
  removeAttribute() { this.src = ''; }
  constructor() { super(); FakeAudio.instances.push(this); }
}
let host: HTMLDivElement, root: Root;
function button(text: string) { return [...host.querySelectorAll('button')].find(b => b.textContent?.includes(text))!; }
async function click(b: HTMLButtonElement) { await act(async () => { b.click(); }); }
async function heard() {
  await act(async () => {
    const a = FakeAudio.instances[FakeAudio.instances.length - 1]!;
    a.currentTime = 10000;
    a.dispatchEvent(new Event('timeupdate'));
  });
}
beforeEach(async () => {
  vi.useFakeTimers();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('Audio', FakeAudio);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  window.localStorage.clear(); FakeAudio.instances = [];
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  await act(async () => root.render(<ListeningScreen onBack={vi.fn()} />));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('listening flow', () => {
  it('loads no audio in the menu or vocabulary, then checks answers and advances', async () => {
    expect(host.querySelectorAll('.lesson-item')).toHaveLength(17);
    await click(button('Приветствия'));
    expect(host.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(FakeAudio.instances).toHaveLength(0);
    await click(button('Воспроизвести и начать'));
    expect(button('Здравствуйте!').disabled).toBe(true);
    expect(FakeAudio.instances[0].play).toHaveBeenCalled();
    await heard();
    const wrong = [...host.querySelectorAll<HTMLButtonElement>('.listening-choice')].find(b => b.textContent !== listeningLessons[0].phrases[0].ru)!;
    await click(wrong);
    expect(wrong.classList.contains('is-wrong')).toBe(true);
    expect(host.textContent).toContain('Фраза 1 из');
    await click(button('Здравствуйте!'));
    await act(async () => vi.advanceTimersByTime(700));
    expect(host.textContent).toContain('Фраза 2 из');
    expect(FakeAudio.instances[0].currentTime).toBe(listeningLessons[0].phrases[1].start);
    await click(button('К урокам аудирования'));
    expect(FakeAudio.instances[0].src).toBe('');
    expect(host.querySelectorAll('.lesson-item')).toHaveLength(17);
  });
  it('reveals the whole Vietnamese text after all phrases and saves completion', async () => {
    await click(button('Деньги')); await click(button('Воспроизвести и начать'));
    for (const p of listeningLessons[9].phrases) {
      await heard();
      await click([...host.querySelectorAll<HTMLButtonElement>('.listening-choice')].find(b => b.textContent === p.ru)!);
      await act(async () => vi.advanceTimersByTime(700));
    }
    expect(host.textContent).toContain('Урок пройден!');
    expect(host.querySelectorAll('.listening-transcript li')).toHaveLength(8);
    expect(JSON.parse(localStorage.getItem('alexViet.test.alexviet-listening-completed-v1')!)).toEqual(['listening-10']);
  });
  it('does not advance after a loading error or after leaving with a pending answer', async () => {
    await click(button('Приветствия')); await click(button('Воспроизвести и начать'));
    await act(async () => FakeAudio.instances[0].dispatchEvent(new Event('error')));
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Не удалось');
    expect(host.textContent).toContain('Фраза 1 из');
    await click(button('Повторить фразу')); await heard(); await click(button('Здравствуйте!'));
    await click(button('К урокам аудирования'));
    await act(async () => vi.advanceTimersByTime(1000));
    expect(host.querySelectorAll('.lesson-item')).toHaveLength(17);
    expect(host.textContent).not.toContain('Фраза 2 из');
  });
});

describe('multiple listening collections and device voice', () => {
  it('preserves completion from other collections and completes a course with device speech', async () => {
    const fixture = { id: 'course-test', number: 1, title: 'Тест озвучки', audio: '', vocabulary: [{ vi: 'gia đình', ru: 'семья' }], phrases: [
      { id: 't1', vi: 'gia đình', ru: 'семья', start: 0, end: 0 },
      { id: 't2', vi: 'con', ru: 'ребёнок', start: 0, end: 0 },
      { id: 't3', vi: 'vợ', ru: 'жена', start: 0, end: 0 },
      { id: 't4', vi: 'chồng', ru: 'муж', start: 0, end: 0 },
    ] };
    class Utterance { text: string; constructor(text: string) { this.text = text; } }
    vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
    const utterances: { onend?: () => void; text: string }[] = [];
    const cancel = vi.fn();
    vi.stubGlobal('speechSynthesis', { getVoices: () => [{ lang: 'vi-VN', name: 'Vietnamese' }], speak: (u: { text: string }) => utterances.push(u), cancel });
    await act(async () => root.unmount());
    localStorage.setItem('alexViet.test.alexviet-listening-completed-v1', JSON.stringify(['listening-01', 'phrasebook2-13']));
    root = createRoot(host);
    await act(async () => root.render(<ListeningScreen onBack={vi.fn()} lessons={[fixture]} title="Наш курс" />));
    await click(button('Тест озвучки'));
    expect(FakeAudio.instances).toHaveLength(0);
    await click(button('Воспроизвести и начать'));
    for (const p of fixture.phrases) {
      expect(utterances[utterances.length - 1].text).toBe(p.vi);
      const choice = [...host.querySelectorAll<HTMLButtonElement>('.listening-choice')].find(b => b.textContent === p.ru)!;
      expect(choice.disabled).toBe(true);
      await act(async () => utterances[utterances.length - 1].onend?.());
      await click(choice);
      await act(async () => vi.advanceTimersByTime(700));
    }
    expect(host.querySelectorAll('.listening-transcript li')).toHaveLength(4);
    expect(JSON.parse(localStorage.getItem('alexViet.test.alexviet-listening-completed-v1')!)).toEqual(['listening-01', 'phrasebook2-13', 'course-test']);
    expect(cancel).toHaveBeenCalled();
  });
});
