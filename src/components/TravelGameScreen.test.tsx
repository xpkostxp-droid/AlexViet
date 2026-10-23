import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { TravelGameScreen } from './TravelGameScreen';
import { travelWords as familyWords, travelIndices, travelOptions } from '../content/games/travel';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot>;
let host: HTMLDivElement;
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers(); });
it('finishes blitz, records first-attempt mistakes and repeats only failed cards', () => {
  vi.useFakeTimers(); host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  act(() => root.render(<TravelGameScreen onBack={() => {}} />));
  expect(travelIndices('all')).toHaveLength(35);
  for (const category of ['all', 'countries', 'geography', 'words'] as const) {
    const pool = travelIndices(category);
    for (const index of pool) { const options = travelOptions(index, pool); expect(new Set(options).size).toBe(6); expect(options).toContain(index); expect(options.every(i => pool.includes(i))).toBe(true); }
  }
  act(() => (Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('⚡ Блиц'))!).click());
  for (let i = 0; i < 35; i++) {
    const ru = host.querySelector('.family-card h2')!.textContent;
    const viWord = familyWords.find(w => w[2] === ru)![1];
    const choices = Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button'));
    if (i === 0) { const wrong = choices.find(b => b.textContent !== viWord)!; act(() => wrong.click()); expect(wrong.disabled).toBe(true); }
    act(() => choices.find(b => b.textContent === viWord)!.click());
    act(() => vi.advanceTimersByTime(1800));
  }
  expect(host.textContent).toContain('С первой попытки: 34 из 35');
  act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Повторить ошибки'))!.click());
  expect(host.textContent).toContain('Осталось в повторе: 1');
  const ru = host.querySelector('.family-card h2')!.textContent;
  act(() => Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b => b.textContent === familyWords.find(w => w[2] === ru)![1])!.click());
  act(() => vi.advanceTimersByTime(1800));
  expect(host.textContent).toContain('Повтор завершён!');
});
