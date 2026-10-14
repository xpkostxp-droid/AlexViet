import { shuffled } from './numbers';
const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
export const bigNumberTiles = [...digits, 'mười', 'mươi', 'mốt', 'lăm', 'trăm', 'nghìn', 'ngàn', 'triệu', 'tỷ', 'lẻ', 'linh'];
function groupWords(value: number, padded: boolean): string {
  const hundreds = Math.floor(value / 100), tens = Math.floor(value % 100 / 10), units = value % 10;
  const words: string[] = [];
  if (hundreds || padded) words.push(digits[hundreds], 'trăm');
  if (tens === 1) words.push('mười');
  else if (tens > 1) words.push(digits[tens], 'mươi');
  else if (units && (hundreds || padded)) words.push('lẻ');
  if (units) words.push(units === 5 && tens ? 'lăm' : units === 1 && tens > 1 ? 'mốt' : digits[units]);
  return words.join(' ');
}
export function bigNumberWords(value: number): string[] {
  const parts: string[] = [];
  for (const [scale, name] of [[1e9, 'tỷ'], [1e6, 'triệu'], [1e3, 'nghìn'], [1, '']] as const) {
    const group = Math.floor(value / scale) % 1000;
    if (!group) continue;
    parts.push(groupWords(group, parts.length > 0 && group < 100));
    if (name) parts.push(name);
  }
  return parts.join(' ').split(' ');
}
export function matchesNumberWord(actual: string, expected: string): boolean {
  return actual === expected || (expected === 'nghìn' && actual === 'ngàn') || (expected === 'lẻ' && actual === 'linh');
}
export function bigNumbers(): number[] {
  const digit = () => 1 + Math.floor(Math.random() * 9);
  const full = () => 100 + Math.floor(Math.random() * 900);
  const values = [digit()*1000, full()*1000, digit()*1e6, full()*1e6, digit()*1e9,
    digit()*1e9 + digit()*100*1e6, digit()*1e6 + full()*1000,
    digit()*1e9 + full()*1e6 + full()*1000,
    full()*1e6 + full()*1000 + digit()*100 + 21,
    digit()*1e9 + full()*1e6 + full()*1000 + digit()*100 + 15];
  return shuffled(values);
}
