// Учебные материалы: список уроков.
// Здесь константин будет добавлять новые уроки по мере занятий.
// ID уроков — постоянные, их нельзя менять после публикации, иначе
// гостевой прогресс участников потеряет связь с уроком.

import type { Lesson, TheoryMaterial } from '../types';
import { lesson1Theory } from './theory/lesson1';
import { lesson2Theory } from './theory/lesson2';
import { lesson3Theory } from './theory/lesson3';
import { lesson4Theory } from './theory/lesson4';
import { lesson5Theory } from './theory/lesson5';

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'Алфавит и звуки',
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Согласные, тона, обращения и местоимения',
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Знакомство (Giới thiệu)',
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Время глаголов, профессии и места',
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Профессия, место работы и семья',
  },
];

// Материалы теории по урокам. У урока без содержимого — sections: null,
// тогда экран теории показывает заглушку «Материалы скоро появятся».
const theoryByLessonId: Record<string, TheoryMaterial['sections']> = {
  'lesson-1': lesson1Theory,
  'lesson-2': lesson2Theory,
  'lesson-3': lesson3Theory,
  'lesson-4': lesson4Theory,
  'lesson-5': lesson5Theory,
};

export const theoryMaterials: TheoryMaterial[] = lessons.map((lesson) => ({
  lessonId: lesson.id,
  sections: theoryByLessonId[lesson.id] ?? null,
}));

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId);
}

export function getTheoryForLesson(lessonId: string): TheoryMaterial['sections'] {
  return theoryMaterials.find((m) => m.lessonId === lessonId)?.sections ?? null;
}
