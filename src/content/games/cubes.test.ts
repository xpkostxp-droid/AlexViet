import { describe, expect, it } from 'vitest';
import { initialCubes, nextCubeNumber, refillCubes, recordCubeAnswer } from './cubes';

describe('number cubes', () => {
  it('drops only the cubes above a removed middle cube and fills the top', () => {
    const board = Array.from({ length: 6 }, (_, id) => ({ id, value: id + 1, column: id % 2, row: Math.floor(id / 2) }));
    const result = refillCubes(board, 2, 6, [3]);
    expect(result.find(c => c.id === 0)?.row).toBe(1);
    expect(result.find(c => c.id === 4)?.row).toBe(2);
    expect(result.filter(c => c.column === 1)).toEqual(board.filter(c => c.column === 1));
    expect(result.find(c => c.id === 6)?.row).toBe(0);
    expect(new Set(result.map(c => c.value)).size).toBe(6);
    expect(new Set(result.map(c => `${c.column}:${c.row}`)).size).toBe(6);
  });
  it('always offers the target and lets all ten digits be mastered', () => {
    for (let attempt = 0; attempt < 30; attempt++) {
      let board = initialCubes(); const mastered: number[] = [];
      for (let i = 0; i < 10; i++) {
        const target = nextCubeNumber(board, mastered);
        expect(mastered).not.toContain(target);
        mastered.push(target);
        board = refillCubes(board, board.find(c => c.value === target)!.id, 6 + i, mastered);
        expect(board).toHaveLength(6);
        expect(new Set(board.map(c => c.value)).size).toBe(6);
      }
      expect(new Set(mastered).size).toBe(10);
    }
  });
});

it('repeats mistaken digits only after other questions and masters them on a clean attempt', () => {
  const failed = recordCubeAnswer([1, 2], {}, 3, true, 4);
  expect(failed.mastered).toEqual([1, 2]);
  const board = [1, 2, 3].map((value, id) => ({ id, value, column: id % 2, row: 0 }));
  expect(nextCubeNumber(board, failed.mastered, failed.retryAfter, 5)).not.toBe(3);
  expect(nextCubeNumber(board, failed.mastered, failed.retryAfter, 6)).not.toBe(3);
  expect(nextCubeNumber(board, failed.mastered, failed.retryAfter, 7)).toBe(3);
  const passed = recordCubeAnswer(failed.mastered, failed.retryAfter, 3, false, 7);
  expect(passed.mastered).toEqual([1, 2, 3]);
  expect(passed.retryAfter[3]).toBeUndefined();
  expect(recordCubeAnswer(passed.mastered, {}, 3, true, 8).mastered).not.toContain(3);
});

it('does not drop a mistaken digit back into the well immediately', () => {
  const board = Array.from({ length: 6 }, (_, id) => ({ id, value: id + 1, column: id % 2, row: Math.floor(id / 2) }));
  for (let i = 0; i < 30; i++) {
    const next = refillCubes(board, 2, 6, [], { 3: 3 }, 1);
    expect(next.map(cube => cube.value)).not.toContain(3);
  }
});
