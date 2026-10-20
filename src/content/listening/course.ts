import { lessons, getTheoryForLesson } from '../lessons';
import { getCardsForLesson } from '../cards';
import type { ListeningLesson } from './types';

const alphabetWords = [
  ['ba', 'папа'], ['cá', 'рыба'], ['ăn', 'есть'], ['bạn', 'друг; ты'],
  ['đi', 'идти'], ['da', 'кожа'], ['đẹp', 'красивый'], ['làm', 'делать'],
  ['gà', 'курица'], ['con', 'ребёнок'], ['ông', 'дедушка'], ['phở', 'суп фо'],
].map(([vi, ru]) => ({ vi, ru }));
export const courseListeningLessons: ListeningLesson[] = lessons.map(lesson => {
  let items: { vi: string; ru: string }[] = lesson.number === 1 ? alphabetWords : getCardsForLesson(lesson.id);
  if (!items.length) items = (getTheoryForLesson(lesson.id) ?? []).flatMap(block => block.kind === 'vocab' ? block.items : block.kind === 'pattern' ? block.examples : []);
  const seen = new Set<string>();
  items = items.filter(item => { const key = item.vi.trim().toLocaleLowerCase('vi'); if (seen.has(key)) return false; seen.add(key); return true; });
  return {
    id: `course-${lesson.id}`, number: lesson.number, title: lesson.title, audio: '',
    vocabulary: items.filter(item => !/[.!?]/.test(item.vi)).map(({ vi, ru }) => ({ vi, ru })),
    phrases: items.map(({ vi, ru }, i) => ({ id: `course-${lesson.id}-${i + 1}`, vi, ru, start: 0, end: 0 })),
  };
});
