import { describe, expect, it } from 'vitest';
import { advanceFamily, familyOptions, familyWords } from './family';
describe('family games', () => {
  it('offers six unique choices including the correct answer for all 19 cards', () => {
    expect(familyWords).toHaveLength(19);
    familyWords.forEach((_, i) => { const choices = familyOptions(i); expect(choices).toHaveLength(6); expect(new Set(choices).size).toBe(6); expect(choices).toContain(i); });
    expect(familyWords.find(w => w[0] === 'who-this')?.[1]).toBe('Đây là ai?');
  });
  it('requires two clean learning answers and resets after a mistake', () => {
    expect(advanceFamily([0, 1, 2, 3, 4], {}, false, true).queue).toEqual([1, 2, 3, 0, 4]);
    expect(advanceFamily([0, 1], { 0: 1 }, false, true).queue).toEqual([1]);
    const failed = advanceFamily([0, 1], { 0: 1 }, true, true);
    expect(failed.wins[0]).toBe(0); expect(failed.queue).toEqual([1, 0]);
  });
  it('never repeats cards during the main blitz, even after a mistake', () => {
    expect(advanceFamily([0, 1], {}, true, false).queue).toEqual([1]);
  });
});
