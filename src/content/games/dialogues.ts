import { shuffled } from './numbers';
export const dialogueSentences = [
  { vi: 'Bao nhiêu tiền?', ru: 'Сколько стоит?' },
  { vi: 'Bốn trăm ba mươi nghìn đồng.', ru: 'Четыреста тридцать тысяч донгов.' },
  { vi: 'Anh bao nhiêu tuổi?', ru: 'Сколько тебе лет?' },
  { vi: 'Tôi năm mươi tuổi.', ru: 'Мне пятьдесят лет.' },
  { vi: 'Năm nay anh bao nhiêu tuổi?', ru: 'Сколько тебе лет в этом году?' },
  { vi: 'Năm nay tôi năm mươi mốt tuổi.', ru: 'В этом году мне пятьдесят один год.' },
  { vi: 'Anh sinh năm bao nhiêu?', ru: 'В каком году ты родился?' },
  { vi: 'Tôi sinh năm bảy mươi lăm.', ru: 'Я родился в семьдесят пятом году.' },
  { vi: 'Anh sang Việt Nam năm anh bao nhiêu tuổi?', ru: 'Сколько тебе было лет, когда ты переехал во Вьетнам?' },
  { vi: 'Tôi sang Việt Nam năm tôi bốn mươi bảy tuổi.', ru: 'Я переехал во Вьетнам, когда мне было сорок семь лет.' },
  { vi: 'Tôi có gốc Nga.', ru: 'У меня российские корни.' },
  { vi: 'Tôi là Nga kiều.', ru: 'Я российский экспат.' },
  { vi: 'Bây giờ tôi đang học tiếng Việt ở Đại học Quốc gia.', ru: 'Сейчас я изучаю вьетнамский язык в Национальном университете.' },
  { vi: 'Bây giờ anh sống ở thành phố nào?', ru: 'В каком городе ты сейчас живёшь?' },
  { vi: 'Bây giờ tôi sống ở Nha Trang.', ru: 'Сейчас я живу в Нячанге.' },
  { vi: 'Anh sang Nha Trang năm anh bao nhiêu tuổi?', ru: 'Сколько тебе было лет, когда ты переехал в Нячанг?' },
  { vi: 'Tôi sang Nha Trang năm tôi bốn mươi chín tuổi.', ru: 'Я переехал в Нячанг, когда мне было сорок девять лет.' },
];
export function dialogueTokens(text: string): string[] { return text.toLocaleLowerCase('vi').replace(/[.,?!]/g, '').split(/\s+/); }
const pronouns = ['tôi', 'anh', 'chị', 'em', 'bạn'];
const verbs = ['sinh', 'sang', 'sống', 'học', 'là', 'có', 'làm'];
const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười', 'mươi', 'mốt', 'lăm', 'trăm', 'nghìn'];
const questions = ['bao', 'nhiêu', 'nào', 'đâu', 'mấy'];
function category(word: string): number { return pronouns.includes(word) ? 0 : verbs.includes(word) ? 1 : numbers.includes(word) ? 2 : questions.includes(word) ? 4 : 3; }
export function dialogueWordGroups(text: string): { label: string; words: string[] }[] {
  const correct = dialogueTokens(text);
  const distractors = ['chị', 'em', 'làm', 'hai', 'sáu', 'ngày', 'đâu'];
  const bank = [...new Set([...correct, ...distractors])];
  return ['Кто', 'Действия', 'Числа', 'Другие слова', 'Вопросы'].map((label, i) => ({ label, words: shuffled(bank.filter(word => category(word) === i)) })).filter(group => group.words.length);
}
