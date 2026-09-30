import { beforeEach, describe, expect, it } from 'vitest';
import {
  emptyStore,
  getRecord,
  loadProgress,
  recordResult,
  saveProgress,
  summarizeLessonDirection,
  withResult,
} from './progress';

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadProgress', () => {
  it('возвращает пустое хранилище, если ничего не сохранено', () => {
    const store = loadProgress();
    expect(store.records).toEqual({});
    expect(store.version).toBe(1);
  });

  it('не падает на повреждённых данных и возвращает пустое хранилище', () => {
    window.localStorage.setItem('vietCards.progress.v1', '{не json');
    const store = loadProgress();
    expect(store.records).toEqual({});
  });

  it('игнорирует данные без нужных полей', () => {
    window.localStorage.setItem('vietCards.progress.v1', JSON.stringify({ foo: 'bar' }));
    const store = loadProgress();
    expect(store.records).toEqual({});
  });

  it('сбрасывает хранилище при несовпадении версии формата', () => {
    window.localStorage.setItem(
      'vietCards.progress.v1',
      JSON.stringify({ version: 999, updatedAt: '', records: { x: {} } })
    );
    const store = loadProgress();
    expect(store.records).toEqual({});
  });
});

describe('withResult (чистая функция)', () => {
  it('увеличивает счётчик remembered', () => {
    const store = withResult(emptyStore(), 'c1', 'ru-vi', 'remembered');
    const rec = getRecord(store, 'c1', 'ru-vi');
    expect(rec?.timesRemembered).toBe(1);
    expect(rec?.timesNotRemembered).toBe(0);
    expect(rec?.lastResult).toBe('remembered');
  });

  it('накапливает результаты по одной и той же карточке', () => {
    let store = withResult(emptyStore(), 'c1', 'ru-vi', 'remembered');
    store = withResult(store, 'c1', 'ru-vi', 'not-remembered');
    const rec = getRecord(store, 'c1', 'ru-vi');
    expect(rec?.timesRemembered).toBe(1);
    expect(rec?.timesNotRemembered).toBe(1);
    expect(rec?.lastResult).toBe('not-remembered');
  });

  it('хранит направления перевода отдельно друг от друга', () => {
    let store = withResult(emptyStore(), 'c1', 'ru-vi', 'remembered');
    store = withResult(store, 'c1', 'vi-ru', 'not-remembered');
    expect(getRecord(store, 'c1', 'ru-vi')?.timesRemembered).toBe(1);
    expect(getRecord(store, 'c1', 'vi-ru')?.timesNotRemembered).toBe(1);
  });
});

describe('recordResult + сохранение в localStorage', () => {
  it('сохраняет и читает прогресс обратно (переживает "перезагрузку")', () => {
    recordResult('c1', 'ru-vi', 'remembered');
    const reloaded = loadProgress();
    expect(getRecord(reloaded, 'c1', 'ru-vi')?.timesRemembered).toBe(1);
  });

  it('прогресс не зависит от порядка карточек — только от ID и направления', () => {
    recordResult('cardX', 'vi-ru', 'remembered');
    // Порядок карточек в уроке мог измениться, но ключ прогресса — тот же ID.
    const reloaded = loadProgress();
    expect(getRecord(reloaded, 'cardX', 'vi-ru')?.lastResult).toBe('remembered');
  });
});

describe('saveProgress', () => {
  it('не выбрасывает исключение при обычном сохранении', () => {
    expect(() => saveProgress(emptyStore())).not.toThrow();
  });
});

describe('summarizeLessonDirection', () => {
  const cardIds = ['c1', 'c2', 'c3'];

  it('если занятий не было — attempted и needsRepeat равны 0', () => {
    const summary = summarizeLessonDirection(emptyStore(), cardIds, 'ru-vi');
    expect(summary.total).toBe(3);
    expect(summary.attempted).toBe(0);
    expect(summary.needsRepeat).toBe(0);
  });

  it('считает уникальные попробованные карточки, а не число ответов', () => {
    let store = withResult(emptyStore(), 'c1', 'ru-vi', 'remembered');
    store = withResult(store, 'c1', 'ru-vi', 'remembered'); // тот же c1 ещё раз
    store = withResult(store, 'c2', 'ru-vi', 'not-remembered');
    const summary = summarizeLessonDirection(store, cardIds, 'ru-vi');
    expect(summary.attempted).toBe(2);
  });

  it('needsRepeat считает только карточки, где последний ответ "не вспомнил"', () => {
    let store = withResult(emptyStore(), 'c1', 'ru-vi', 'not-remembered');
    store = withResult(store, 'c1', 'ru-vi', 'remembered'); // последний ответ поменялся
    store = withResult(store, 'c2', 'ru-vi', 'not-remembered');
    const summary = summarizeLessonDirection(store, cardIds, 'ru-vi');
    expect(summary.attempted).toBe(2);
    expect(summary.needsRepeat).toBe(1); // только c2
  });

  it('направления считаются независимо друг от друга', () => {
    const store = withResult(emptyStore(), 'c1', 'ru-vi', 'remembered');
    const ruVi = summarizeLessonDirection(store, cardIds, 'ru-vi');
    const viRu = summarizeLessonDirection(store, cardIds, 'vi-ru');
    expect(ruVi.attempted).toBe(1);
    expect(viRu.attempted).toBe(0);
  });
});
