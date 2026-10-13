export const banknotes = [
  { value: 100, vi: 'một trăm đồng', ru: 'сто донгов' },
  { value: 200, vi: 'hai trăm đồng', ru: 'двести донгов' },
  { value: 500, vi: 'năm trăm đồng', ru: 'пятьсот донгов' },
  { value: 1000, vi: 'một nghìn đồng', ru: 'одна тысяча донгов' },
  { value: 2000, vi: 'hai nghìn đồng', ru: 'две тысячи донгов' },
  { value: 5000, vi: 'năm nghìn đồng', ru: 'пять тысяч донгов' },
  { value: 10000, vi: 'mười nghìn đồng', ru: 'десять тысяч донгов' },
  { value: 20000, vi: 'hai mươi nghìn đồng', ru: 'двадцать тысяч донгов' },
  { value: 50000, vi: 'năm mươi nghìn đồng', ru: 'пятьдесят тысяч донгов' },
  { value: 100000, vi: 'một trăm nghìn đồng', ru: 'сто тысяч донгов' },
  { value: 200000, vi: 'hai trăm nghìn đồng', ru: 'двести тысяч донгов' },
  { value: 500000, vi: 'năm trăm nghìn đồng', ru: 'пятьсот тысяч донгов' },
];
export function banknoteWord(value: number): string { return banknotes.find(note => note.value === value)!.vi; }
