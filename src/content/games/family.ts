export const familyWords = [
  ['family', 'gia đình', 'Семья'],
  ['grandpa-dad', 'ông nội', 'Дедушка по папиной линии'],
  ['grandma-dad', 'bà nội', 'Бабушка по папиной линии'],
  ['grandpa-mom', 'ông ngoại', 'Дедушка по маминой линии'],
  ['grandma-mom', 'bà ngoại', 'Бабушка по маминой линии'],
  ['dad', 'bố', 'Папа'], ['mom', 'mẹ', 'Мама'],
  ['brother-older', 'anh trai', 'Старший брат'], ['brother-younger', 'em trai', 'Младший брат'],
  ['sister-older', 'chị gái', 'Старшая сестра'], ['sister-younger', 'em gái', 'Младшая сестра'],
  ['wife', 'vợ', 'Жена'], ['husband', 'chồng', 'Муж'],
  ['son', 'con trai', 'Сын'], ['daughter', 'con gái', 'Дочь'], ['children', 'con', 'Ребёнок / дети'],
  ['who', 'ai', 'Кто'], ['who-this', 'Đây là ai?', 'Кто это?'], ['all-family', 'cả nhà', 'Вся семья'],
] as const;
export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function familyOptions(index: number): number[] {
  return shuffled([index, ...shuffled(familyWords.map((_, i) => i).filter(i => i !== index)).slice(0, 5)]);
}
// A failed card returns after other cards; learning requires two clean recalls.
export function advanceFamily(queue: number[], wins: Record<number, number>, failed: boolean, learning: boolean) {
  const index = queue[0];
  const count = failed ? 0 : (wins[index] ?? 0) + 1;
  const next = queue.slice(1);
  if (learning && count < 2) next.splice(Math.min(3, next.length), 0, index);
  return { queue: next, wins: { ...wins, [index]: count } };
}
