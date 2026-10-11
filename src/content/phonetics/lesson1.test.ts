import { describe, expect, it } from 'vitest';
import { activeSyllable, pronunciationRows } from './lesson1';

describe('recording highlights', () => {
  it('does not highlight pauses between rows or after the recording', () => {
    for (const time of [0, 17, 34.5, 52.5, 316, 319]) expect(activeSyllable(time)).toBeNull();
  });
  it('keeps a syllable highlighted during the repeat pause and advances with the audio', () => {
    expect(activeSyllable(0.3)).toEqual({ row: 0, column: 0 });
    expect(activeSyllable(1.3)).toEqual({ row: 0, column: 0 });
    expect(activeSyllable(1.5)).toEqual({ row: 0, column: 1 });
    expect(activeSyllable(315)).toEqual({ row: 21, column: 11 });
  });
  it('maps all 264 recording boundaries to the corresponding syllable', () => {
    expect(pronunciationRows).toHaveLength(22);
    pronunciationRows.forEach((row, rowIndex) => row.starts.forEach((time, column) => {
      expect(activeSyllable(time)).toEqual({ row: rowIndex, column });
      expect(row.ends[column]).toBeGreaterThan(time);
      if (column < 11) expect(row.ends[column]).toBeLessThan(row.starts[column + 1]);
    }));
  });
  it('preserves the special spellings in the source table', () => {
    expect(pronunciationRows.find(row => row.consonant === 'c')?.syllables[6]).toBe('ki');
    expect(pronunciationRows.find(row => row.consonant === 'ng')?.syllables[6]).toBe('nghi');
    expect(pronunciationRows.find(row => row.consonant === 'gi')?.syllables[6]).toBe('gi');
  });
});
