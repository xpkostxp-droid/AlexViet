export const phoneDigitWords = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
export function phoneNumbers(): string[] {
  const prefixes = ['084', '091', '093', '098', '032', '035', '056', '070', '079'];
  return ['0867217623', ...prefixes.map(prefix => prefix + Array.from({length:7},()=>Math.floor(Math.random()*10)).join(''))];
}
