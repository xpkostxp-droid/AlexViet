import { describe, expect, it } from 'vitest';
import { initialCubes, nextCubeNumber, refillCubes } from './cubes';

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
