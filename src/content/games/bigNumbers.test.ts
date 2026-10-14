import { expect, it } from 'vitest';
import { bigNumbers, bigNumberWords, matchesNumberWord, bigNumberTiles } from './bigNumbers';
it('builds large numbers with scales and final-unit variants', () => {
  expect(bigNumberWords(1250000).join(' ')).toBe('một triệu hai trăm năm mươi nghìn');
  expect(bigNumberWords(2000021).join(' ')).toBe('hai triệu không trăm hai mươi mốt');
  expect(bigNumberWords(1000000015).join(' ')).toBe('một tỷ không trăm mười lăm');
  expect(matchesNumberWord('linh', 'lẻ')).toBe(true);
  expect(matchesNumberWord('ngàn', 'nghìn')).toBe(true);
  expect(matchesNumberWord('năm', 'lăm')).toBe(false);
});
it('creates ten unique numbers with thousands, millions and billions and available answer tiles', () => {
  for (let i = 0; i < 30; i++) {
    const numbers = bigNumbers();
    expect(new Set(numbers).size).toBe(10);
    expect(numbers.some(n => n >= 1e9)).toBe(true);
    expect(numbers.some(n => n >= 1e6 && n < 1e9)).toBe(true);
    expect(numbers.some(n => n < 1e6)).toBe(true);
    for (const number of numbers) for (const word of bigNumberWords(number)) expect(bigNumberTiles).toContain(word);
  }
});
