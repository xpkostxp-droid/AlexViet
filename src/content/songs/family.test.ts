import { describe, it, expect } from 'vitest';
import { songLines, songVerses, songVocabulary } from './family';
describe('family song content', () => {
  it('defines every unique lyric word exactly once in the dictionary', () => {
    const words = new Set(songVerses.flatMap(line => line.vi.toLocaleLowerCase('vi').match(/[\p{L}]+/gu) ?? []));
    const dictionary = songVocabulary.map(([word]) => word);
    expect(new Set(dictionary).size).toBe(dictionary.length);
    expect(new Set(dictionary)).toEqual(words);
  });
  it('has all 24 measured non-overlapping lines, translations, and real interludes', () => {
    expect(songLines).toHaveLength(24);
    for (let i = 0; i < songLines.length; i++) {
      const line = songLines[i];
      expect(line.end).toBeGreaterThan(line.start);
      expect(line.end).toBeLessThan(134.49);
      expect(line.ru.length).toBeGreaterThan(0);
      if (i) expect(line.start).toBeGreaterThanOrEqual(songLines[i - 1].end);
    }
    expect(songLines[8].start - songLines[7].end).toBeGreaterThan(5);
    expect(songLines[16].start - songLines[15].end).toBeGreaterThan(5);
  });
});
