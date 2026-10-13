import { shuffled } from './numbers';
const hundreds = Array.from({ length: 9 }, (_, i) => (i + 1) * 100);
const middleZero = hundreds.flatMap(h => [h + 1, h + 5, h + 9]);
const lastZero = hundreds.flatMap(h => [h + 20, h + 50, h + 90]);
const full = hundreds.flatMap((h, i) => [h + 15, h + 25, h + 75, h + 21, h + 61, h + ((i % 7) + 2) * 10 + ((i % 6) + 2)]);
// A balanced recording bank; each game draws a fresh 50-number selection.
export const hotelNumberBank = [...hundreds, ...middleZero, ...lastZero, ...full];
export function hotelNumbers(): number[] {
  const fiveCandidates = middleZero.filter(n => n % 10 === 5);
  const zeroFives = [shuffled(fiveCandidates.filter(n => Math.floor(n / 100) % 2 === 0))[0], shuffled(fiveCandidates.filter(n => Math.floor(n / 100) % 2 === 1))[0]];
  zeroFives.push(shuffled(fiveCandidates.filter(n => !zeroFives.includes(n)))[0]);
  const otherMiddle = shuffled(middleZero.filter(n => !zeroFives.includes(n))).slice(0, 9);
  const fives = shuffled(full.filter(n => n % 10 === 5)).slice(0, 4);
  const ones = shuffled(full.filter(n => n % 10 === 1)).slice(0, 4);
  const otherFull = shuffled(full.filter(n => !fives.includes(n) && !ones.includes(n))).slice(0, 12);
  return shuffled([...hundreds, ...zeroFives, ...otherMiddle, ...shuffled(lastZero).slice(0, 9), ...fives, ...ones, ...otherFull]);
}
