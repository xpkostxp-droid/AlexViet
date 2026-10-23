import { describe, expect, it } from 'vitest';
import { courseLesson11 } from './course11';

describe('lesson 11 recording', () => {
  it('provides the uploaded dialogue with timed words and translations within the recording', () => {
    expect(courseLesson11.phrases).toHaveLength(12);
    let previousEnd = 0;
    for (const phrase of courseLesson11.phrases) {
      expect(phrase.start).toBeGreaterThanOrEqual(previousEnd);
      expect(phrase.end).toBeLessThan(22.99);
      expect(phrase.ru).not.toBe('');
      expect(phrase.words?.map(word => word.text).join(' ')).toBe(phrase.vi);
      let wordEnd = phrase.start;
      for (const word of phrase.words!) {
        expect(word.start).toBeGreaterThanOrEqual(wordEnd);
        expect(word.end).toBeGreaterThan(word.start);
        expect(word.end).toBeLessThanOrEqual(phrase.end);
        wordEnd = word.end;
      }
      previousEnd = phrase.end;
    }
  });
});
