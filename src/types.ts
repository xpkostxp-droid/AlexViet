// Общие типы данных проекта.
// ID уроков и карточек — постоянные строковые идентификаторы.
// Прогресс и связи между материалами опираются именно на них,
// а не на позицию в списке или текст карточки.

export type LessonId = string;
export type CardId = string;

// Направление перевода на тренировке. 'listening' — режим аудирования:
// карточка спереди пустая, слово озвучивается по нажатию кнопки, а не
// показывается текстом, на обороте — сразу оба языка.
export type Direction = 'ru-vi' | 'vi-ru' | 'listening';

// Порядок показа карточек в тренировке.
export type CardOrder = 'sequential' | 'shuffled';

export interface Lesson {
  id: LessonId;
  number: number;
  title: string;
  // Пометка демонстрационного урока (см. заданные примеры).
  isDemo?: boolean;
}

// Материал теории для урока — список блоков разных видов, которые
// экран теории отрисовывает по порядку. Формат специально сделан гибким,
// чтобы под него ложился обычный конспект урока (таблицы, списки слов,
// шаблоны фраз, диалоги, короткие подсказки), без изобретения контента —
// сюда переносится только то, что реально есть в материалах.
//
// content: null — у урока пока нет теории (показывается заглушка).

export interface VocabItem {
  vi: string;
  pronunciation?: string;
  ru: string;
  // Необязательный пример употребления слова.
  example?: string;
  exampleRu?: string;
}

export type TheoryBlock =
  | {
      kind: 'text';
      heading?: string;
      paragraphs: string[];
    }
  | {
      kind: 'table';
      heading?: string;
      note?: string;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: 'vocab';
      heading?: string;
      note?: string;
      items: VocabItem[];
    }
  | {
      kind: 'pattern';
      heading?: string;
      formula: string;
      formulaNote?: string;
      examples: { vi: string; ru: string }[];
    }
  | {
      kind: 'dialogue';
      heading?: string;
      lines: { speaker: string; vi: string; ru: string }[];
    }
  | {
      kind: 'tip';
      heading?: string;
      items: string[];
    };

export interface TheoryMaterial {
  lessonId: LessonId;
  sections: TheoryBlock[] | null;
}

export interface FlashCard {
  id: CardId;
  lessonId: LessonId;
  ru: string;
  vi: string;
}

export type TrainingResult = 'remembered' | 'not-remembered';
