import { describe, expect, it } from 'vitest';
import { listeningLessons } from '../content/listening/lessons';
import { listeningChoices } from './listening';

describe('listening course', () => {
  it('has 17 complete lessons and 412 playable Vietnamese phrases', () => {
    expect(listeningLessons).toHaveLength(17);
    expect(listeningLessons.reduce((n, l) => n + l.phrases.length, 0)).toBe(412);
    for (const lesson of listeningLessons) {
      expect(lesson.vocabulary.length).toBeGreaterThan(0);
      expect(new Set(lesson.vocabulary.map(w => w.vi)).size).toBe(lesson.vocabulary.length);
      expect(new Set(lesson.phrases.map(p => p.id)).size).toBe(lesson.phrases.length);
      let previousEnd = -1;
      for (const phrase of lesson.phrases) {
        expect(phrase.start - previousEnd).toBeGreaterThanOrEqual(.99);
        expect(phrase.end - phrase.start).toBeGreaterThan(.25);
        expect(phrase.vi.trim()).not.toBe('');
        expect(phrase.ru.trim()).not.toBe('');
        expect(phrase.vi).not.toMatch(/[А-Яа-яЁё]/);
        previousEnd = phrase.end;
      }
    }
  });
  it('always offers four distinct translations including the correct answer', () => {
    for (const lesson of listeningLessons) for (const phrase of lesson.phrases) {
      const choices = listeningChoices(lesson, phrase, () => .25);
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(phrase.ru);
      // Identical Vietnamese prompts cannot have competing translations.
      expect(new Set(lesson.phrases.filter(p => p.vi === phrase.vi).map(p => p.ru)).size).toBe(1);
    }
  });

});
