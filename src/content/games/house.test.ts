import { describe, expect, it } from 'vitest';
import { adjectiveLearning, advanceHouse, houseBlitz, houseLearning } from './house';

describe('lesson 11 house game', () => {
  it('splits learning into house and adjectives', () => {
    expect(houseLearning).toHaveLength(18);
    expect(adjectiveLearning).toHaveLength(19);
  });

  it('uses only learned words in blitz phrases', () => {
    const learned = new Set([...houseLearning, ...adjectiveLearning].map(item => item[1]));
    const vocabulary = new Set([...houseLearning, ...adjectiveLearning].flatMap(item => item[1].split(/\s+/u)));
    for (const [, vi] of houseBlitz) {
      for (const token of vi.split(/\s+/u)) {
        expect(vocabulary.has(token) || learned.has(token)).toBe(true);
      }
    }
  });

  it('requires two clean recalls in learning mode', () => {
    const first = advanceHouse([0, 1, 2, 3], {}, false, true);
    expect(first.wins[0]).toBe(1);
    expect(first.queue).toContain(0);
    const failed = advanceHouse([0, 1, 2], first.wins, true, true);
    expect(failed.wins[0]).toBe(0);
  });

  it('does not requeue clean blitz answers', () => {
    const result = advanceHouse([0, 1, 2], {}, false, false);
    expect(result.queue).toEqual([1, 2]);
  });
});
