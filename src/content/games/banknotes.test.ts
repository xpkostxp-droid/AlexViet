import { expect, it } from 'vitest';
import { banknotes } from './banknotes';
import { initialCubes, nextCubeNumber, recordCubeAnswer, refillCubes } from './cubes';
it('masters all twelve denominations three times and repeats mistakes', () => {
  const values = banknotes.map(note => note.value);
  let board = initialCubes(values), mastered: number[] = [], retry: Record<number,number> = {}, turn = 0;
  while(mastered.length < 36 && turn < 70) {
    const target = nextCubeNumber(board, mastered, retry, turn, 3);
    const result = recordCubeAnswer(mastered, retry, target, turn === 0, turn, 3);
    mastered = result.mastered; retry = result.retryAfter;
    if(turn === 0) expect(mastered).toHaveLength(0);
    board = refillCubes(board, board.find(cube => cube.value === target)!.id, 6 + turn, mastered, retry, turn + 1, values, 3, false);
    expect(new Set(board.map(cube => cube.value)).size).toBe(6); turn++;
  }
  expect(mastered).toHaveLength(36);
  for(const value of values) expect(mastered.filter(n => n === value)).toHaveLength(3);
});
