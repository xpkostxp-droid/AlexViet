import { expect, it } from 'vitest';
import { phoneNumbers, phoneDigitWords } from './phone';
it('creates ten distinct ten-digit training numbers with Vietnamese mobile prefixes', () => {
  const numbers=phoneNumbers(); expect(numbers).toHaveLength(10);expect(new Set(numbers).size).toBe(10);
  for(const number of numbers) expect(number).toMatch(/^0[35789]\d{8}$/);
  expect(phoneDigitWords).toHaveLength(10);expect(phoneDigitWords[0]).toBe('không');
});
