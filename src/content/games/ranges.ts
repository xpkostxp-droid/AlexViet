import { banknotes } from './banknotes';
import { numberWords } from './numbers';
import { hotelNumberBank } from './hotel';
export type NumberGameRange = '1-10' | '11-99' | '100-999' | 'banknotes' | 'phone';
export const numberGameRanges = {
  phone: { title: 'Номер телефона', values: [] as number[] },
  banknotes: { title: 'Купюры', values: banknotes.map(note => note.value) },
  '1-10': { title: 'Цифры 1–10', values: Array.from({ length: 10 }, (_, i) => i + 1) },
  '100-999': { title: 'Числа 100–999', values: hotelNumberBank },
  '11-99': { title: 'Числа 11–99', values: Array.from({ length: 89 }, (_, i) => i + 11) },
};
export function vietnameseNumber(value: number): string {
  if (value >= 100) {
    const hundreds = Math.floor(value / 100), rest = value % 100;
    const prefix = `${numberWords[hundreds - 1]} trăm`;
    if (!rest) return prefix;
    if (rest < 10) return `${prefix} ${hundreds % 2 ? 'linh' : 'lẻ'} ${numberWords[rest - 1]}`;
    return `${prefix} ${vietnameseNumber(rest)}`;
  }
  if (value <= 10) return numberWords[value - 1];
  const tens = Math.floor(value / 10), units = value % 10;
  const prefix = tens === 1 ? 'mười' : `${numberWords[tens - 1]} mươi`;
  if (!units) return prefix;
  const suffix = units === 5 ? 'lăm' : units === 1 && tens > 1 ? 'mốt' : numberWords[units - 1];
  return `${prefix} ${suffix}`;
}
export function russianNumber(value: number): string {
  if (value >= 100) {
    const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
    const rest = value % 100;
    return `${hundreds[Math.floor(value / 100)]}${rest ? ` ${russianNumber(rest)}` : ''}`;
  }
  const units = ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  if (value < 10) return units[value - 1];
  if (value < 20) return teens[value - 10];
  return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${units[value % 10 - 1]}` : ''}`;
}
