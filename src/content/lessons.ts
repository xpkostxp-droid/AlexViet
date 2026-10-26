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
import { lesson6Theory } from './theory/lesson6';
import { lesson7Theory } from './theory/lesson7';
import { lesson8Theory } from './theory/lesson8';
import { lesson9Theory } from './theory/lesson9';
import { lesson10Theory } from './theory/lesson10';
import { lesson11Theory } from './theory/lesson11';

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
  {
    id: 'lesson-6',
    number: 6,
    title: 'Вопросы «верно?» и «не является»',
  },
  {
    id: 'lesson-7',
    number: 7,
    title: 'Страны, города и путешествия',
  },
  {
    id: 'lesson-8',
    number: 8,
    title: 'Как говорить «мы», «они» и «все»',
  },
  { id: 'lesson-9', number: 9, title: 'Числа, большие числа и возраст' },
  { id: 'lesson-10', number: 10, title: 'Семья (Gia đình)' },
  { id: 'lesson-11', number: 11, title: 'Дом и прилагательные (Nhà)' },
];

// Материалы теории по урокам. У урока без содержимого — sections: null,
// тогда экран теории показывает заглушку «Материалы скоро появятся».
const theoryByLessonId: Record<string, TheoryMaterial['sections']> = {
  'lesson-1': lesson1Theory,
  'lesson-2': lesson2Theory,
  'lesson-3': lesson3Theory,
  'lesson-4': lesson4Theory,
  'lesson-5': lesson5Theory,
  'lesson-6': lesson6Theory,
  'lesson-7': lesson7Theory,
  'lesson-8': lesson8Theory,
  'lesson-9': lesson9Theory,
  'lesson-10': lesson10Theory,
  'lesson-11': lesson11Theory,
};

export const theoryMaterials: TheoryMaterial[] = lessons.map((lesson) => ({
  lessonId: lesson.id,
  sections: theoryByLessonId[lesson.id] ?? null,
}));

export const cardLessons: Lesson[] = lessons.flatMap(lesson => lesson.id === 'lesson-9' ? [
  { id: 'lesson-9-numbers', number: 9, title: 'Числа и большие числа' },
  { id: 'lesson-9-age', number: 9, title: 'Возраст' },
] : [lesson]);

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId) ?? cardLessons.find((l) => l.id === lessonId);
}

export function getTheoryForLesson(lessonId: string): TheoryMaterial['sections'] {
  return theoryMaterials.find((m) => m.lessonId === lessonId)?.sections ?? null;
}
