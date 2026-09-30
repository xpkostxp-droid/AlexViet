import { beforeEach, describe, expect, it } from 'vitest';
import { loadLastActivity, saveLastActivity } from './lastActivity';

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadLastActivity', () => {
  it('возвращает null, если ничего не сохранено', () => {
    expect(loadLastActivity()).toBeNull();
  });

  it('не падает на повреждённых данных', () => {
    window.localStorage.setItem('vietCards.lastActivity.v1', '{не json');
    expect(loadLastActivity()).toBeNull();
  });

  it('игнорирует данные без нужных полей', () => {
    window.localStorage.setItem('vietCards.lastActivity.v1', JSON.stringify({ foo: 'bar' }));
    expect(loadLastActivity()).toBeNull();
  });

  it('игнорирует некорректное значение mode', () => {
    window.localStorage.setItem(
      'vietCards.lastActivity.v1',
      JSON.stringify({ version: 1, lessonId: 'demo-lesson-1', mode: 'wrong', updatedAt: '' })
    );
    expect(loadLastActivity()).toBeNull();
  });

  it('сбрасывается при несовпадении версии формата', () => {
    window.localStorage.setItem(
      'vietCards.lastActivity.v1',
      JSON.stringify({ version: 999, lessonId: 'demo-lesson-1', mode: 'cards', updatedAt: '' })
    );
    expect(loadLastActivity()).toBeNull();
  });
});

describe('saveLastActivity', () => {
  it('сохраняет и читает обратно (переживает "перезагрузку")', () => {
    saveLastActivity('demo-lesson-1', 'cards');
    const activity = loadLastActivity();
    expect(activity?.lessonId).toBe('demo-lesson-1');
    expect(activity?.mode).toBe('cards');
  });

  it('новый вызов перезаписывает предыдущий урок', () => {
    saveLastActivity('demo-lesson-1', 'theory');
    saveLastActivity('demo-lesson-2', 'cards');
    const activity = loadLastActivity();
    expect(activity?.lessonId).toBe('demo-lesson-2');
    expect(activity?.mode).toBe('cards');
  });
});
