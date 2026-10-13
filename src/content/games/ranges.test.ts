import { describe, expect, it } from 'vitest';
import { numberGameRanges, vietnameseNumber, russianNumber } from './ranges';
import { initialCubes, nextCubeNumber, recordCubeAnswer, refillCubes } from './cubes';

describe('numbers 11–99', () => {
  it('reads teens, tens, and special endings correctly', () => {
    for (const [number, word] of [[11,'mười một'],[15,'mười lăm'],[20,'hai mươi'],[21,'hai mươi mốt'],[25,'hai mươi lăm'],[41,'bốn mươi mốt'],[99,'chín mươi chín']] as const) expect(vietnameseNumber(number)).toBe(word);
    expect(russianNumber(11)).toBe('одиннадцать');
    expect(russianNumber(45)).toBe('сорок пять');
    expect(russianNumber(99)).toBe('девяносто девять');
  });
  it('covers all 89 numbers once and repeats an error without awarding mastery', () => {
    const values = numberGameRanges['11-99'].values;
    let board = initialCubes(values), mastered: number[] = [], retryAfter: Record<number,number> = {};
    let turn = 0;
    while (mastered.length < 89 && turn < 250) {
      const target = nextCubeNumber(board, mastered, retryAfter, turn, 1);
      expect(mastered).not.toContain(target);
      expect(target).toBeGreaterThanOrEqual(11); expect(target).toBeLessThanOrEqual(99);
      const result = recordCubeAnswer(mastered, retryAfter, target, turn === 0, turn, 1);
      mastered = result.mastered; retryAfter = result.retryAfter;
      if (turn === 0) expect(mastered).toHaveLength(0);
      board = refillCubes(board, board.find(c => c.value === target)!.id, 6 + turn, mastered, retryAfter, turn + 1, values, 1);
      expect(new Set(board.map(c => c.value)).size).toBe(6);
      turn++;
    }
    expect(mastered).toHaveLength(89);
    for (const value of values) expect(mastered.filter(number => number === value)).toHaveLength(1);
  });
});
