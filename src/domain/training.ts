// Логика тренировки карточек — чистые функции без обращения к DOM и localStorage.
// Это позволяет проверять их модульными тестами и переиспользовать
// в интерфейсе через простой useState в React.

import type { CardId, CardOrder, Direction, FlashCard, TrainingResult } from '../types';

export interface SessionState {
  direction: Direction;
  order: CardOrder;
  cardsById: Record<CardId, FlashCard>;
  queue: CardId[];
  index: number;
  flipped: boolean;
  results: Partial<Record<CardId, TrainingResult>>;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function startSession(cards: FlashCard[], direction: Direction, order: CardOrder): SessionState {
  const ordered = order === 'shuffled' ? shuffle(cards) : [...cards];
  const cardsById: Record<CardId, FlashCard> = {};
  for (const card of cards) {
    cardsById[card.id] = card;
  }
  return {
    direction,
    order,
    cardsById,
    queue: ordered.map((c) => c.id),
    index: 0,
    flipped: false,
    results: {},
  };
}

export function currentCard(state: SessionState): FlashCard | null {
  if (state.index >= state.queue.length) return null;
  const id = state.queue[state.index];
  return state.cardsById[id] ?? null;
}

export function isFinished(state: SessionState): boolean {
  return state.index >= state.queue.length;
}

export function flip(state: SessionState): SessionState {
  if (isFinished(state)) return state;
  return { ...state, flipped: !state.flipped };
}

export function answer(state: SessionState, result: TrainingResult): SessionState {
  if (isFinished(state)) return state;
  const card = currentCard(state);
  if (!card) return state;
  return {
    ...state,
    results: { ...state.results, [card.id]: result },
    index: state.index + 1,
    flipped: false,
  };
}

export interface SessionSummary {
  total: number;
  remembered: number;
  notRemembered: number;
  wrongCardIds: CardId[];
}

export function summarize(state: SessionState): SessionSummary {
  let remembered = 0;
  let notRemembered = 0;
  const wrongCardIds: CardId[] = [];
  for (const id of state.queue) {
    const result = state.results[id];
    if (result === 'remembered') {
      remembered += 1;
    } else if (result === 'not-remembered') {
      notRemembered += 1;
      wrongCardIds.push(id);
    }
  }
  return { total: state.queue.length, remembered, notRemembered, wrongCardIds };
}

// Новая тренировка только по карточкам с ответом «Не вспомнил».
// Возвращает null, если повторять нечего.
export function restartWithWrongOnly(state: SessionState, order: CardOrder): SessionState | null {
  const { wrongCardIds } = summarize(state);
  if (wrongCardIds.length === 0) return null;
  const cards = wrongCardIds
    .map((id) => state.cardsById[id])
    .filter((c): c is FlashCard => Boolean(c));
  return startSession(cards, state.direction, order);
}

export function frontText(card: FlashCard, direction: Direction): string {
  if (direction === 'listening') return '';
  return direction === 'ru-vi' ? card.ru : card.vi;
}

export function backText(card: FlashCard, direction: Direction): string {
  if (direction === 'listening') return `${card.vi} — ${card.ru}`;
  return direction === 'ru-vi' ? card.vi : card.ru;
}
