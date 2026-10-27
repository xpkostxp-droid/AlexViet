import { describe, expect, it } from 'vitest';
import { adjectiveLearning, advanceHouseLearning, advanceHouse, houseBlitz, houseLearning } from './house';

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

it('replaces each mastered word immediately and keeps a failed word rotating', () => {
 const next=advanceHouseLearning([0,1,2],{0:2,1:2,2:0},false,3,6);
 expect(next.queue).toEqual([1,2,3]);expect(next.nextWord).toBe(4);
 const second=advanceHouseLearning(next.queue,next.wins,false,next.nextWord,6);
 expect(second.queue).toEqual([2,3,4]);
 const failed=advanceHouseLearning(second.queue,{...second.wins,2:2},true,second.nextWord,6);
 expect(failed.queue).toEqual([3,4,2]);expect(failed.wins[2]).toBe(0);
 expect(failed.nextWord).toBe(5);
});
