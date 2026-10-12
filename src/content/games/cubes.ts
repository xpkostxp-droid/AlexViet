import { shuffled } from './numbers';
export interface NumberCube { id: number; value: number; column: number; row: number }
export function initialCubes(): NumberCube[] {
  return shuffled(Array.from({ length: 10 }, (_, i) => i + 1)).slice(0, 6)
    .map((value, id) => ({ id, value, column: id % 2, row: Math.floor(id / 2) }));
}
export function refillCubes(board: NumberCube[], removedId: number, newId: number, mastered: number[], retryAfter: Record<number, number> = {}, turn = 0): NumberCube[] {
  const removed = board.find(cube => cube.id === removedId)!;
  const remaining = board.filter(cube => cube.id !== removedId);
  const candidates = Array.from({ length: 10 }, (_, i) => i + 1).filter(value => !remaining.some(cube => cube.value === value));
  const eligible = candidates.filter(value => (retryAfter[value] ?? 0) <= turn);
  const available = eligible.length ? eligible : candidates;
  const fresh = available.filter(value => !mastered.includes(value));
  const value = shuffled(fresh.length ? fresh : available)[0];
  return [...remaining.map(cube => cube.column === removed.column && cube.row < removed.row ? { ...cube, row: cube.row + 1 } : cube),
    { id: newId, value, column: removed.column, row: 0 }];
}
export function nextCubeNumber(board: NumberCube[], mastered: number[], retryAfter: Record<number, number> = {}, turn = 0): number {
  const available = board.filter(cube => (retryAfter[cube.value] ?? 0) <= turn);
  const fresh = available.filter(cube => !mastered.includes(cube.value));
  return shuffled(fresh.length ? fresh : available.length ? available : board)[0].value;
}
export function recordCubeAnswer(mastered: number[], retryAfter: Record<number, number>, value: number, hadMistake: boolean, turn: number) {
  const nextRetry = { ...retryAfter };
  if (hadMistake) {
    nextRetry[value] = turn + 3;
    return { mastered: mastered.filter(number => number !== value), retryAfter: nextRetry };
  }
  delete nextRetry[value];
  return { mastered: mastered.includes(value) ? mastered : [...mastered, value], retryAfter: nextRetry };
}
