export const numberWords = ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'] as const;
export function shuffled<T>(values: readonly T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function numberOptions(answer: number): number[] {
  return shuffled([answer, ...shuffled(numberWords.map((_, i) => i + 1).filter(n => n !== answer)).slice(0, 3)]);
}
export function firstNumberRound(): number[] {
  return shuffled(numberWords.map((_, i) => i + 1));
}
