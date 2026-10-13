import { shuffled } from './numbers';
export const NUMBER_REPETITIONS = 2;
export const NUMBER_GAME_GOAL = 10 * NUMBER_REPETITIONS;
export function successfulAttempts(mastered: number[], value: number): number {
  return mastered.filter(number => number === value).length;
}
export interface NumberCube { id: number; value: number; column: number; row: number }
export function initialCubes(values: readonly number[] = Array.from({ length: 10 }, (_, i) => i + 1)): NumberCube[] {
  return shuffled(values).slice(0, 6)
    .map((value, id) => ({ id, value, column: id % 2, row: Math.floor(id / 2) }));
}
export function refillCubes(board: NumberCube[], removedId: number, newId: number, mastered: number[], retryAfter: Record<number, number> = {}, turn = 0, values: readonly number[] = Array.from({ length: 10 }, (_, i) => i + 1), repetitions = NUMBER_REPETITIONS, gravity = true): NumberCube[] {
  const removed = board.find(cube => cube.id === removedId)!;
  const remaining = board.filter(cube => cube.id !== removedId);
  const candidates = values.filter(value => !remaining.some(cube => cube.value === value));
  const eligible = candidates.filter(value => (retryAfter[value] ?? 0) <= turn);
  const available = eligible.length ? eligible : candidates;
  const fresh = available.filter(value => successfulAttempts(mastered, value) < repetitions);
  const pending = repetitions === 1 ? candidates.filter(value => successfulAttempts(mastered, value) < repetitions) : [];
  const value = shuffled(fresh.length ? fresh : pending.length ? pending : available)[0];
  return [...remaining.map(cube => gravity && cube.column === removed.column && cube.row < removed.row ? { ...cube, row: cube.row + 1 } : cube),
    { id: newId, value, column: removed.column, row: gravity ? 0 : removed.row }];
}
export function nextCubeNumber(board: NumberCube[], mastered: number[], retryAfter: Record<number, number> = {}, turn = 0, repetitions = NUMBER_REPETITIONS): number {
  const available = board.filter(cube => (retryAfter[cube.value] ?? 0) <= turn);
  const fresh = available.filter(cube => successfulAttempts(mastered, cube.value) < repetitions);
  const pending = repetitions === 1 ? board.filter(cube => successfulAttempts(mastered, cube.value) < repetitions) : [];
  return shuffled(fresh.length ? fresh : pending.length ? pending : available.length ? available : board)[0].value;
}
export function recordCubeAnswer(mastered: number[], retryAfter: Record<number, number>, value: number, hadMistake: boolean, turn: number, repetitions = NUMBER_REPETITIONS) {
  const nextRetry = { ...retryAfter };
  if (hadMistake) {
    nextRetry[value] = turn + 3;
    return { mastered, retryAfter: nextRetry };
  }
  delete nextRetry[value];
  return { mastered: successfulAttempts(mastered, value) >= repetitions ? mastered : [...mastered, value], retryAfter: nextRetry };
}
