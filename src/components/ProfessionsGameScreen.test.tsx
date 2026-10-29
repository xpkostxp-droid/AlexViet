import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ProfessionsGameScreen } from './ProfessionsGameScreen';
import { professionWords, workBlitzTasks, workBlitzOptions, workBlitzAnswer } from '../content/games/professions';
const sounds = vi.hoisted(() => ({ ready: vi.fn(), beep: vi.fn(), close: vi.fn() }));
vi.mock('./gameSounds', () => ({ makeGameSound: () => sounds }));
vi.mock('../domain/speech', () => ({ speakVietnamese: vi.fn(), stopSpeaking: vi.fn() }));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot>;
let host: HTMLDivElement;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'performance'] });
  vi.clearAllMocks(); localStorage.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  act(() => root.render(<ProfessionsGameScreen onBack={() => {}} />));
});
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers(); });
function click(text: string) { act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.trim() === text || b.querySelector('strong')?.textContent === text)!.click()); }
function start(group = 'Профессии') { click(group); click('Начать блиц'); }
function correctAnswer() {
  const prompt = host.querySelector('.work-prompt h2')!.textContent;
  const reverse = host.querySelector('.work-prompt h2')!.getAttribute('lang') === 'vi';
  const word = professionWords.find(w => w[reverse ? 1 : 2] === prompt)!;
  return word[reverse ? 2 : 1];
}
it('has two groups, every word twice, three options and only question distractors for questions', () => {
  expect(host.querySelectorAll('.work-group-list button')).toHaveLength(2);
  expect(host.textContent).not.toContain('Обучение');
  for (const group of ['professions', 'work'] as const) {
    const tasks = workBlitzTasks(group);
    expect(tasks).toHaveLength(group === 'professions' ? 30 : 28);
    expect(new Set(tasks.map(t => `${t.index}:${t.reverse}`)).size).toBe(tasks.length);
    for (const task of tasks) {
      const options = workBlitzOptions(task, group);
      expect(new Set(options).size).toBe(3); expect(options).toContain(workBlitzAnswer(task));
      if (professionWords[task.index][0].startsWith('ask-')) expect(options.every(o => o.endsWith('?'))).toBe(true);
    }
  }
});
it('continues after mistakes and timeout, locks double answers, stores isolated best with correct response time', () => {
  start();
  for (let i = 0; i < 30; i++) {
    const correct = correctAnswer();
    if (i === 0) {
      act(() => vi.advanceTimersByTime(1000));
      const wrong = Array.from(host.querySelectorAll<HTMLButtonElement>('.work-options button')).find(b => b.textContent !== correct)!;
      act(() => { wrong.click(); wrong.click(); });
      expect(host.querySelectorAll('.family-correct')).toHaveLength(1);
    } else if (i === 1) {
      act(() => vi.advanceTimersByTime(5000)); expect(host.textContent).toContain('Время вышло');
    } else {
      act(() => vi.advanceTimersByTime(1000)); click(correct);
    }
    act(() => vi.advanceTimersByTime(1600));
  }
  expect(host.textContent).toContain('Правильно: 28 из 30');
  expect(host.textContent).toContain('Ошибок: 2');
  expect(host.textContent).toContain('28,00 сек');
  expect(JSON.parse(localStorage.getItem('alexViet.test.work-blitz.v1.professions')!)).toEqual({ correct: 28, time: 28000 });
  expect(localStorage.getItem('work-blitz.v1.professions')).toBeNull();
});
it('pauses a hidden question until explicit resume and excludes the pause from time', () => {
  start('Места, действия и вопросы');
  act(() => vi.advanceTimersByTime(1000));
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  act(() => vi.advanceTimersByTime(15000)); expect(host.textContent).toContain('Игра на паузе');
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  click('Продолжить'); act(() => vi.advanceTimersByTime(1000)); click(correctAnswer());
  expect(host.textContent).toContain('Верно!');
  act(() => vi.advanceTimersByTime(1600)); expect(host.querySelector('.work-status')!.textContent).toContain('2/28 · ✓ 1');
});

it('beeps once on 3, 2, 1 and stops after an answer', () => {
  start(); expect(sounds.ready).toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(4000));
  expect(sounds.beep.mock.calls.map(c => c[0])).toEqual([3, 2, 1]);
  click(correctAnswer());
  act(() => vi.advanceTimersByTime(1500));
  expect(sounds.beep).toHaveBeenCalledTimes(3);
});
