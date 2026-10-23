import { shuffled } from './family';
export type PeopleCategory = 'all' | 'pronouns' | 'phrases';
export const peopleCategories: [PeopleCategory,string][] = [['all','Всё вместе'],['pronouns','Я, мы, они и все'],['phrases','Ответы и фразы']];
export const peopleWords = [
 [
  "l8-03",
  "hội thoại",
  "диалог",
  "phrases"
 ],
 [
  "l8-04",
  "vâng",
  "Да — вежливый ответ",
  "phrases"
 ],
 [
  "l8-05",
  "dạ",
  "Да — вежливый ответ",
  "phrases"
 ],
 [
  "l8-06",
  "có",
  "Да — ответ на có … không?",
  "phrases"
 ],
 [
  "l8-07",
  "Anh là người Nga, phải không?",
  "Ты из России, верно?",
  "phrases"
 ],
 [
  "l8-08",
  "Vâng, tôi là người Nga.",
  "Да, я из России.",
  "phrases"
 ],
 [
  "l8-09",
  "Có phải anh là giáo viên không?",
  "Правда ли, что ты учитель?",
  "phrases"
 ],
 [
  "l8-10",
  "Dạ, em là giáo viên.",
  "Да, я учитель.",
  "phrases"
 ],
 [
  "l8-11",
  "Anh có làm việc ở đây không?",
  "Ты работаешь здесь?",
  "phrases"
 ],
 [
  "l8-12",
  "Có, tôi làm việc ở đây.",
  "Да, я работаю здесь.",
  "phrases"
 ],
 [
  "l8-13",
  "tôi",
  "Я — нейтрально / официально",
  "pronouns"
 ],
 [
  "l8-14",
  "mình",
  "Я — мягко, по-дружески",
  "pronouns"
 ],
 [
  "l8-15",
  "tớ",
  "Я — с друзьями и ровесниками",
  "pronouns"
 ],
 [
  "l8-16",
  "tao",
  "Я — очень фамильярно / грубо",
  "pronouns"
 ],
 [
  "l8-17",
  "mày",
  "Ты — очень фамильярно / грубо",
  "pronouns"
 ],
 [
  "l8-18",
  "Mình học tiếng Việt.",
  "Я учу вьетнамский.",
  "phrases"
 ],
 [
  "l8-19",
  "Tớ cũng học tiếng Việt.",
  "Я тоже учу вьетнамский.",
  "phrases"
 ],
 [
  "l8-20",
  "Tao đúng, mày sai!",
  "Я прав, ты неправ!",
  "phrases"
 ],
 [
  "l8-21",
  "Mày sai, không phải tao!",
  "Ты неправ, а не я!",
  "phrases"
 ],
 [
  "l8-22",
  "anh ấy",
  "Он — о мужчине",
  "pronouns"
 ],
 [
  "l8-23",
  "chị ấy",
  "Она — о старшей / ровеснице",
  "pronouns"
 ],
 [
  "l8-24",
  "cô ấy",
  "Она — о женщине",
  "pronouns"
 ],
 [
  "l8-25",
  "em ấy",
  "Он / она — о младшем",
  "pronouns"
 ],
 [
  "l8-26",
  "Anh ấy là người Pháp.",
  "Он из Франции.",
  "phrases"
 ],
 [
  "l8-27",
  "Cô ấy là giáo viên.",
  "Она учительница.",
  "phrases"
 ],
 [
  "l8-28",
  "họ",
  "они",
  "pronouns"
 ],
 [
  "l8-29",
  "Họ là người Mỹ.",
  "Они из США.",
  "phrases"
 ],
 [
  "l8-30",
  "Họ sống ở Hà Nội.",
  "Они живут в Ханое.",
  "phrases"
 ],
 [
  "l8-31",
  "chúng ta",
  "Мы — включая собеседника",
  "pronouns"
 ],
 [
  "l8-32",
  "Chúng ta ở Hà Nội.",
  "Мы с тобой находимся в Ханое.",
  "phrases"
 ],
 [
  "l8-33",
  "Chúng ta học tiếng Việt.",
  "Мы с тобой учим вьетнамский.",
  "phrases"
 ],
 [
  "l8-34",
  "chúng tôi",
  "Мы — без собеседника",
  "pronouns"
 ],
 [
  "l8-35",
  "Chúng tôi học ở trường Hòa Bình.",
  "Мы учимся в школе «Хоа Бинь».",
  "phrases"
 ],
 [
  "l8-36",
  "Chúng tôi là người Nga.",
  "Мы из России.",
  "phrases"
 ],
 [
  "l8-37",
  "đều",
  "Все / оба — о группе",
  "pronouns"
 ],
 [
  "l8-38",
  "Chúng ta đều là người Hàn Quốc.",
  "Мы все / оба из Южной Кореи.",
  "phrases"
 ],
 [
  "l8-39",
  "Họ đều là người Mỹ.",
  "Они все из США.",
  "phrases"
 ],
 [
  "l8-40",
  "Chúng tôi đều học tiếng Việt.",
  "Мы все учим вьетнамский.",
  "phrases"
 ]
] as const;
export function peopleIndices(category: PeopleCategory) { return peopleWords.map((_,i)=>i).filter(i=>category==='all'||peopleWords[i][3]===category); }
const equivalents = [['vâng','dạ'],['chị ấy','cô ấy']];
export function peopleAccepts(expected: number, selected: number) { return expected === selected || equivalents.some(g => g.includes(peopleWords[expected][1]) && g.includes(peopleWords[selected][1])); }
export function peopleOptions(index: number,pool: number[]) { return shuffled([index,...shuffled(pool.filter(i=>!peopleAccepts(index,i))).slice(0,5)]); }
