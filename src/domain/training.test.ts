import { describe, expect, it } from 'vitest';
import {
  answer,
  backText,
  currentCard,
  flip,
  frontText,
  isFinished,
  restartWithWrongOnly,
  startSession,
  summarize,
} from './training';
import type { FlashCard } from '../types';

const cards: FlashCard[] = [
  { id: 'c1', lessonId: 'l1', ru: 'вода', vi: 'nước' },
  { id: 'c2', lessonId: 'l1', ru: 'кофе', vi: 'cà phê' },
  { id: 'c3', lessonId: 'l1', ru: 'мотобайк', vi: 'xe máy' },
];

describe('startSession', () => {
  it('сохраняет порядок карточек при sequential', () => {
    const state = startSession(cards, 'ru-vi', 'sequential');
    expect(state.queue).toEqual(['c1', 'c2', 'c3']);
  });

  it('содержит все карточки при shuffled (порядок может отличаться)', () => {
    const state = startSession(cards, 'ru-vi', 'shuffled');
    expect([...state.queue].sort()).toEqual(['c1', 'c2', 'c3']);
  });

  it('для пустого списка карточек сразу завершена', () => {
    const state = startSession([], 'ru-vi', 'sequential');
    expect(isFinished(state)).toBe(true);
    expect(currentCard(state)).toBeNull();
  });
});

describe('flip', () => {
  it('переключает флаг flipped', () => {
    const state = startSession(cards, 'ru-vi', 'sequential');
    const flipped = flip(state);
    expect(flipped.flipped).toBe(true);
    const unflipped = flip(flipped);
    expect(unflipped.flipped).toBe(false);
  });

  it('ничего не делает, если тренировка завершена', () => {
    const state = startSession([], 'ru-vi', 'sequential');
    const result = flip(state);
    expect(result).toBe(state);
  });
});

describe('answer', () => {
  it('фиксирует результат, продвигает индекс и сбрасывает flipped', () => {
    let state = startSession(cards, 'ru-vi', 'sequential');
    state = flip(state);
    state = answer(state, 'remembered');
    expect(state.index).toBe(1);
    expect(state.flipped).toBe(false);
    expect(state.results.c1).toBe('remembered');
  });

  it('доходит до конца очереди и переводит isFinished в true', () => {
    let state = startSession(cards, 'ru-vi', 'sequential');
    state = answer(state, 'remembered');
    state = answer(state, 'not-remembered');
    state = answer(state, 'remembered');
    expect(isFinished(state)).toBe(true);
    expect(currentCard(state)).toBeNull();
  });
});

describe('summarize', () => {
  it('считает вспомненные и невспомненные карточки', () => {
    let state = startSession(cards, 'ru-vi', 'sequential');
    state = answer(state, 'remembered');
    state = answer(state, 'not-remembered');
    state = answer(state, 'remembered');
    const summary = summarize(state);
    expect(summary.total).toBe(3);
    expect(summary.remembered).toBe(2);
    expect(summary.notRemembered).toBe(1);
    expect(summary.wrongCardIds).toEqual(['c2']);
  });
});

describe('restartWithWrongOnly', () => {
  it('возвращает null, если ошибок не было', () => {
    let state = startSession(cards, 'ru-vi', 'sequential');
    state = answer(state, 'remembered');
    state = answer(state, 'remembered');
    state = answer(state, 'remembered');
    expect(restartWithWrongOnly(state, 'sequential')).toBeNull();
  });

  it('создаёт новую сессию только из невспомненных карточек', () => {
    let state = startSession(cards, 'ru-vi', 'sequential');
    state = answer(state, 'remembered');
    state = answer(state, 'not-remembered');
    state = answer(state, 'not-remembered');
    const retry = restartWithWrongOnly(state, 'sequential');
    expect(retry).not.toBeNull();
    expect(retry?.queue).toEqual(['c2', 'c3']);
    expect(retry?.results).toEqual({});
  });
});

describe('frontText / backText', () => {
  it('ru-vi: спереди русский, сзади вьетнамский', () => {
    expect(frontText(cards[0], 'ru-vi')).toBe('вода');
    expect(backText(cards[0], 'ru-vi')).toBe('nước');
  });

  it('vi-ru: спереди вьетнамский, сзади русский', () => {
    expect(frontText(cards[0], 'vi-ru')).toBe('nước');
    expect(backText(cards[0], 'vi-ru')).toBe('вода');
  });

  it('listening: спереди пусто, сзади оба языка', () => {
    expect(frontText(cards[0], 'listening')).toBe('');
    expect(backText(cards[0], 'listening')).toBe('nước — вода');
  });
});
