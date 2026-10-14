import { expect, it } from 'vitest';
import { getCardsForLesson } from './cards';
import { cardLessons, getLessonById, getTheoryForLesson } from './lessons';
it('splits lesson 9 into complete disjoint groups without changing card identities', () => {
  const all = getCardsForLesson('lesson-9');
  const numbers = getCardsForLesson('lesson-9-numbers');
  const age = getCardsForLesson('lesson-9-age');
  expect(numbers).toHaveLength(35); expect(age).toHaveLength(33);
  expect([...numbers, ...age].map(c => c.id)).toEqual(all.map(c => c.id));
  expect(new Set([...numbers, ...age].map(c => c.id)).size).toBe(68);
  expect(age.slice(0, 19).map(c => c.vi)).toEqual(['tuổi', 'năm', 'năm nay', 'sinh', 'sinh năm', 'gốc', 'gốc Việt', 'gốc Nga', 'Việt kiều', 'Nga kiều', 'mấy', 'bao nhiêu', 'sang', 'bây giờ', 'quốc gia', 'Anh sinh năm bao nhiêu?', 'Anh sinh năm 91.', 'Năm nay anh bao nhiêu tuổi?', 'Năm nay anh 39 tuổi.']);
  expect(age.some(c => c.vi.includes('bao nhiêu tuổi'))).toBe(true);
  expect(getLessonById('lesson-9-age')?.title).toBe('Возраст');
  expect(cardLessons.filter(l => l.number === 9)).toHaveLength(2);
  expect(getTheoryForLesson('lesson-9')).not.toBeNull();
});
