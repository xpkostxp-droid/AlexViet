// Гостевой прогресс тренировок, хранится в localStorage браузера устройства.
// Прогресс привязан к постоянному ID карточки и направлению перевода —
// изменение порядка карточек или текста урока его не ломает.
//
// Формат данных версионирован (version). Повреждённые или неожиданные
// данные не приводят к падению — вместо них используется пустое хранилище.
//
// На будущее: когда появятся аккаунты, этот же формат записи
// (cardId + direction + счётчики) можно будет перенести в облако —
// здесь только гостевое хранение, без имитации регистрации.

import type { CardId, Direction, TrainingResult } from '../types';
import { readJSON, writeJSON } from './storage';

const STORAGE_KEY = 'vietCards.progress.v1';
const CURRENT_VERSION = 1;

export interface CardProgressRecord {
  cardId: CardId;
  direction: Direction;
  timesRemembered: number;
  timesNotRemembered: number;
  lastResult: TrainingResult;
  lastReviewedAt: string;
}

export interface ProgressStore {
  version: number;
  updatedAt: string;
  records: Record<string, CardProgressRecord>;
}

export function emptyStore(): ProgressStore {
  return { version: CURRENT_VERSION, updatedAt: new Date().toISOString(), records: {} };
}

function recordKey(cardId: CardId, direction: Direction): string {
  return `${cardId}__${direction}`;
}

function isValidStore(data: unknown): data is ProgressStore {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== 'number') return false;
  if (typeof d.records !== 'object' || d.records === null) return false;
  return true;
}

export function loadProgress(): ProgressStore {
  const parsed = readJSON(STORAGE_KEY);
  if (!isValidStore(parsed)) return emptyStore();
  if (parsed.version !== CURRENT_VERSION) {
    // Будущее: здесь появится миграция между версиями формата.
    return emptyStore();
  }
  return parsed;
}

export function saveProgress(store: ProgressStore): void {
  writeJSON(STORAGE_KEY, store);
}

export function getRecord(
  store: ProgressStore,
  cardId: CardId,
  direction: Direction
): CardProgressRecord | undefined {
  return store.records[recordKey(cardId, direction)];
}

// Чистая функция: не трогает localStorage, удобна для тестов.
export function withResult(
  store: ProgressStore,
  cardId: CardId,
  direction: Direction,
  result: TrainingResult
): ProgressStore {
  const key = recordKey(cardId, direction);
  const existing = store.records[key];
  const updated: CardProgressRecord = {
    cardId,
    direction,
    timesRemembered: (existing?.timesRemembered ?? 0) + (result === 'remembered' ? 1 : 0),
    timesNotRemembered: (existing?.timesNotRemembered ?? 0) + (result === 'not-remembered' ? 1 : 0),
    lastResult: result,
    lastReviewedAt: new Date().toISOString(),
  };
  return {
    version: store.version,
    updatedAt: new Date().toISOString(),
    records: { ...store.records, [key]: updated },
  };
}

// Загружает текущее хранилище, применяет результат и сохраняет обратно.
export function recordResult(cardId: CardId, direction: Direction, result: TrainingResult): ProgressStore {
  const store = loadProgress();
  const updated = withResult(store, cardId, direction, result);
  saveProgress(updated);
  return updated;
}

// Компактная сводка прогресса по уроку в одном направлении перевода.
// "Попробовал" — число уникальных карточек, на которые уже был дан хоть один
// ответ. "Нужно повторить" — число карточек, чей последний ответ был
// «Не вспомнил». Один правильный ответ не считается освоением слова —
// здесь просто отражается факт последнего ответа, без оценки "выучено".
export interface LessonDirectionSummary {
  direction: Direction;
  total: number;
  attempted: number;
  needsRepeat: number;
}

export function summarizeLessonDirection(
  store: ProgressStore,
  cardIds: CardId[],
  direction: Direction
): LessonDirectionSummary {
  let attempted = 0;
  let needsRepeat = 0;
  for (const cardId of cardIds) {
    const record = getRecord(store, cardId, direction);
    if (!record) continue;
    attempted += 1;
    if (record.lastResult === 'not-remembered') {
      needsRepeat += 1;
    }
  }
  return { direction, total: cardIds.length, attempted, needsRepeat };
}
