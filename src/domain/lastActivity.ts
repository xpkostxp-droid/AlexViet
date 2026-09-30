// Запоминает последний урок, который участник открывал — для кнопки
// «Продолжить урок» на главном экране. Хранится в localStorage,
// отдельно от гостевого прогресса тренировок (progress.ts).
// Формат версионирован; повреждённые данные не ломают сайт.

import type { LessonId } from '../types';
import { readJSON, writeJSON } from './storage';

const STORAGE_KEY = 'vietCards.lastActivity.v1';
const CURRENT_VERSION = 1;

// В каком разделе был открыт урок — чтобы «Продолжить» вело туда же.
export type ActivityMode = 'theory' | 'cards';

export interface LastActivity {
  version: number;
  lessonId: LessonId;
  mode: ActivityMode;
  updatedAt: string;
}

function isValidActivity(data: unknown): data is LastActivity {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.version === 'number' &&
    typeof d.lessonId === 'string' &&
    d.lessonId.length > 0 &&
    (d.mode === 'theory' || d.mode === 'cards')
  );
}

export function loadLastActivity(): LastActivity | null {
  const parsed = readJSON(STORAGE_KEY);
  if (!isValidActivity(parsed)) return null;
  if (parsed.version !== CURRENT_VERSION) return null;
  return parsed;
}

export function saveLastActivity(lessonId: LessonId, mode: ActivityMode): void {
  const activity: LastActivity = {
    version: CURRENT_VERSION,
    lessonId,
    mode,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(STORAGE_KEY, activity);
}
