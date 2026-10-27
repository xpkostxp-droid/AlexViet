export type HouseGameItem = readonly [id: string, vi: string, ru: string];

export const houseLearning: readonly HouseGameItem[] = [
  ['house', 'nhà', 'Дом'],
  ['hotel', 'khách sạn', 'Отель'],
  ['apartment', 'chung cư', 'Многоквартирный дом / жилой комплекс'],
  ['private-house', 'nhà riêng', 'Частный дом'],
  ['rent', 'thuê', 'Арендовать'],
  ['landlord', 'chủ nhà', 'Хозяин дома / арендодатель'],
  ['land', 'đất', 'Земля'],
  ['cheap', 'rẻ', 'Дешёвый / недорогой'],
  ['floor', 'tầng', 'Этаж'],
  ['stairs', 'thang bộ', 'Лестница'],
  ['elevator', 'thang máy', 'Лифт'],
  ['room', 'phòng', 'Комната'],
  ['bedroom', 'phòng ngủ', 'Спальня'],
  ['bathroom', 'phòng vệ sinh', 'Туалет / ванная'],
  ['kitchen', 'phòng bếp', 'Кухня'],
  ['living-room', 'phòng khách', 'Гостиная'],
  ['office', 'phòng làm việc', 'Кабинет / рабочая комната'],
  ['balcony', 'ban công', 'Балкон'],
];

export const adjectiveLearning: readonly HouseGameItem[] = [
  ['big', 'to', 'Большой'],
  ['small', 'nhỏ', 'Маленький'],
  ['high', 'cao', 'Высокий'],
  ['low', 'thấp', 'Низкий'],
  ['long', 'dài', 'Длинный'],
  ['short', 'ngắn', 'Короткий'],
  ['many', 'nhiều', 'Много'],
  ['few', 'ít', 'Мало'],
  ['beautiful', 'đẹp', 'Красивый'],
  ['ugly', 'xấu', 'Некрасивый / плохой'],
  ['good', 'tốt', 'Хороший'],
  ['poor', 'kém', 'Плохой / низкого качества'],
  ['substance', 'chất', 'Вещество / материал'],
  ['amount', 'lượng', 'Количество / объём'],
  ['quality', 'chất lượng', 'Качество / качественный'],
  ['quality-good', 'chất lượng tốt', 'Хорошее качество'],
  ['quality-poor', 'chất lượng kém', 'Плохое качество'],
  ['quality-high', 'chất lượng cao', 'Высокое качество'],
  ['product-quality-high', 'sản phẩm chất lượng cao', 'Продукт высокого качества'],
];

export const houseBlitz: readonly HouseGameItem[] = [
  ['blitz-apartment-high', 'chung cư cao', 'Высокий многоквартирный дом'],
  ['blitz-apartment-many-floors', 'chung cư nhiều tầng', 'Многоквартирный дом с большим количеством этажей'],
  ['blitz-private-big', 'nhà riêng to', 'Большой частный дом'],
  ['blitz-private-beautiful', 'nhà riêng đẹp', 'Красивый частный дом'],
  ['blitz-house-small', 'nhà nhỏ', 'Маленький дом'],
  ['blitz-house-cheap', 'nhà rẻ', 'Недорогой дом'],
  ['blitz-many-rooms', 'nhiều phòng', 'Много комнат'],
  ['blitz-few-rooms', 'ít phòng', 'Мало комнат'],
  ['blitz-bedroom-small', 'phòng ngủ nhỏ', 'Маленькая спальня'],
  ['blitz-bathroom-small', 'phòng vệ sinh nhỏ', 'Маленькая ванная / туалет'],
  ['blitz-kitchen-beautiful', 'phòng bếp đẹp', 'Красивая кухня'],
  ['blitz-living-ugly', 'phòng khách xấu', 'Некрасивая гостиная'],
  ['blitz-office-big', 'phòng làm việc to', 'Большой кабинет'],
  ['blitz-balcony-long', 'ban công dài', 'Длинный балкон'],
  ['blitz-balcony-short', 'ban công ngắn', 'Короткий балкон'],
  ['blitz-hotel-high', 'khách sạn cao', 'Высокий отель'],
  ['blitz-land-cheap', 'đất rẻ', 'Недорогая земля'],
  ['blitz-quality-good', 'chất lượng tốt', 'Хорошее качество'],
  ['blitz-quality-poor', 'chất lượng kém', 'Плохое качество'],
  ['blitz-quality-high', 'chất lượng cao', 'Высокое качество'],
];

export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function optionsFor(items: readonly HouseGameItem[], index: number): number[] {
  return shuffled([index, ...shuffled(items.map((_, i) => i).filter(i => i !== index)).slice(0, 5)]);
}

export function advanceHouse(queue: number[], wins: Record<number, number>, failed: boolean, learning: boolean) {
  const index = queue[0];
  const count = failed ? 0 : (wins[index] ?? 0) + 1;
  const next = queue.slice(1);
  if (learning && count < 2) next.splice(Math.min(3, next.length), 0, index);
  return { queue: next, wins: { ...wins, [index]: count } };
}


export const ADJECTIVE_BLOCK_SIZE = 3;
export function adjectiveBlock(start: number, total = adjectiveLearning.length): number[] {
  return Array.from({ length: total }, (_, i) => i).slice(start, start + ADJECTIVE_BLOCK_SIZE);
}
export function advanceAdjectiveBlock(queue: number[], wins: Record<number, number>, failed: boolean, blockStart: number, total = adjectiveLearning.length) {
  const index = queue[0];
  const count = failed ? 0 : (wins[index] ?? 0) + 1;
  const remaining = queue.slice(1);
  if (count < 3) remaining.push(index);
  const next = { queue: remaining, wins: { ...wins, [index]: count } };
  if (next.queue.length === 0 && adjectiveBlock(blockStart, total).every(i => (next.wins[i] ?? 0) >= 3)) {
    const following = blockStart + ADJECTIVE_BLOCK_SIZE;
    if (following < total) return { ...next, queue: adjectiveBlock(following, total), blockStart: following };
  }
  return { ...next, blockStart };
}

// Keep up to three unfinished words, replacing each mastered word immediately.
export function advanceHouseLearning(queue: number[], wins: Record<number, number>, failed: boolean, nextWord: number, total: number) {
  const index = queue[0];
  const count = failed ? 0 : (wins[index] ?? 0) + 1;
  const remaining = queue.slice(1);
  if (count < 3) remaining.push(index);
  else if (nextWord < total) remaining.push(nextWord++);
  return { queue: remaining, wins: { ...wins, [index]: count }, nextWord };
}
