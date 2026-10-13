import { expect, it } from 'vitest';
import { hotelNumberBank, hotelNumbers } from './hotel';
import { russianNumber, vietnameseNumber } from './ranges';
import { initialCubes, nextCubeNumber, recordCubeAnswer, refillCubes } from './cubes';
it('draws fifty unique hotel numbers with all required categories and special endings', () => {
  expect(new Set(hotelNumberBank).size).toBe(hotelNumberBank.length);
  for (let run = 0; run < 40; run++) {
    const values = hotelNumbers();
    expect(new Set(values).size).toBe(50);
    expect(values.every(n => n >= 100 && n <= 999 && hotelNumberBank.includes(n))).toBe(true);
    expect(values.filter(n => n % 100 === 0)).toHaveLength(9);
    expect(values.filter(n => n % 100 > 0 && n % 100 < 10)).toHaveLength(12);
    expect(values.filter(n => n % 100 !== 0 && n % 10 === 0)).toHaveLength(9);
    expect(values.filter(n => n % 100 >= 10 && n % 10 > 0)).toHaveLength(20);
    expect(values.filter(n => n % 100 === 5).length).toBeGreaterThanOrEqual(3);
    expect(values.some(n => n % 100 === 5 && Math.floor(n / 100) % 2 === 0)).toBe(true);
    expect(values.some(n => n % 100 === 5 && Math.floor(n / 100) % 2 === 1)).toBe(true);
    expect(values.filter(n => n % 100 >= 10 && n % 10 === 5).length).toBeGreaterThanOrEqual(4);
    expect(values.filter(n => n % 100 >= 20 && n % 10 === 1).length).toBeGreaterThanOrEqual(4);
  }
});
it('reads hundreds, zeros, and five correctly', () => {
  expect(vietnameseNumber(300)).toBe('ba trăm');
  expect(vietnameseNumber(205)).toBe('hai trăm lẻ năm');
  expect(vietnameseNumber(105)).toBe('một trăm linh năm');
  expect(vietnameseNumber(125)).toBe('một trăm hai mươi lăm');
  expect(vietnameseNumber(321)).toBe('ba trăm hai mươi mốt');
  expect(russianNumber(999)).toBe('девятьсот девяносто девять');
});
it('replaces only the selected plaque and completes fifty clean answers with mistake retries', () => {
  const values = hotelNumbers(); let board = initialCubes(values), mastered: number[] = [], retry: Record<number,number> = {}, turn = 0;
  while (mastered.length < 50 && turn < 100) {
    const target = nextCubeNumber(board, mastered, retry, turn, 1);
    const cube = board.find(c => c.value === target)!;
    const result = recordCubeAnswer(mastered, retry, target, turn === 0, turn, 1);
    mastered = result.mastered; retry = result.retryAfter;
    const next = refillCubes(board, cube.id, turn + 6, mastered, retry, turn + 1, values, 1, false);
    for (const other of board.filter(c => c.id !== cube.id)) expect(next.find(c => c.id === other.id)).toEqual(other);
    expect(next.find(c => c.id === turn + 6)?.row).toBe(cube.row);
    expect(new Set(next.map(c => c.value)).size).toBe(6);
    board = next; turn++;
  }
  expect(new Set(mastered).size).toBe(50); expect(mastered).toHaveLength(50);
});
