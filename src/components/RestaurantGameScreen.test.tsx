import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { RestaurantGameScreen } from './RestaurantGameScreen';
import { restaurantWords as familyWords, restaurantIndices, restaurantOptions } from '../content/games/restaurant';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot>;
let host: HTMLDivElement;
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers(); });
it('finishes blitz, records first-attempt mistakes and repeats only failed cards', () => {
  vi.useFakeTimers(); host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  act(() => root.render(<RestaurantGameScreen onBack={() => {}} />));
  expect(restaurantIndices('all')).toHaveLength(60);
  for (const category of ['all', 'items', 'order', 'phrases'] as const) {
    const pool = restaurantIndices(category);
    for (const index of pool) { const options = restaurantOptions(index, pool); expect(new Set(options).size).toBe(6); expect(options).toContain(index); expect(options.every(i => pool.includes(i))).toBe(true); }
  }
  act(() => (Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('⚡ Блиц'))!).click());
  for (let i = 0; i < 60; i++) {
    const ru = host.querySelector('.family-card h2')!.textContent;
    const viWord = familyWords.find(w => w[2] === ru)![1];
    const choices = Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button'));
    if (i === 0) { const wrong = choices.find(b => b.textContent !== viWord)!; act(() => wrong.click()); expect(wrong.disabled).toBe(true); }
    act(() => choices.find(b => b.textContent === viWord)!.click());
    act(() => vi.advanceTimersByTime(1800));
  }
  expect(host.textContent).toContain('С первой попытки: 59 из 60');
  act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Повторить ошибки'))!.click());
  expect(host.textContent).toContain('Осталось в повторе: 1');
  const ru = host.querySelector('.family-card h2')!.textContent;
  act(() => Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b => b.textContent === familyWords.find(w => w[2] === ru)![1])!.click());
  act(() => vi.advanceTimersByTime(1800));
  expect(host.textContent).toContain('Повтор завершён!');
});

it('starts each learning section with choices from its own section', () => {
 vi.useFakeTimers(); host = document.createElement('div'); document.body.append(host); root = createRoot(host);
 act(() => root.render(<RestaurantGameScreen onBack={() => {}} />));
 act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Посуда и предметы'))!.click());
 expect(host.textContent).toContain('из 16');
 for (const b of host.querySelectorAll('.family-choices button')) expect(familyWords.filter(w => w[3] === 'items').some(w => w[1] === b.textContent)).toBe(true);
});
