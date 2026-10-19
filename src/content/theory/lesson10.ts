import type { TheoryBlock } from '../../types';
import { familyDialogues, familyExamples, familyWords } from '../family';

const words = (group: string) => familyWords.filter(word => word.group === group).map(({ vi, ru }) => ({ vi, ru }));

export const lesson10Theory: TheoryBlock[] = [
  { kind: 'text', heading: 'Gia đình — Семья', paragraphs: [
    'Учимся называть членов семьи, различать родственников по маминой и папиной линии и рассказывать о возрасте, учёбе, работе и браке.',
  ] },
  { kind: 'vocab', heading: '1. Родители, бабушки и дедушки', items: words('parents') },
  { kind: 'tip', heading: 'Мамина и папина линия', items: [
    'Ông — дедушка, bà — бабушка. Ngoại уточняет мамину линию, nội — папину.',
    'Ông ngoại и bà ngoại — родители мамы. Ông nội и bà nội — родители папы.',
  ] },
  { kind: 'vocab', heading: '2. Братья и сёстры', note: 'Старший или младший — относительно говорящего.', items: words('siblings') },
  { kind: 'tip', heading: 'Как устроены эти слова', items: [
    'Anh — старший брат, chị — старшая сестра, em — младший брат или младшая сестра.',
    'Trai уточняет мужской пол, gái — женский: em trai — младший брат, em gái — младшая сестра.',
    'Anh и chị также используются как обращения. В диалогах anh — обращение к мужчине, chị — к женщине.',
  ] },
  { kind: 'vocab', heading: '3. Своя семья', items: words('own') },
  { kind: 'tip', items: ['Con само по себе не уточняет пол и количество детей: это понятно из контекста. Con trai — сын, con gái — дочь.'] },
  { kind: 'vocab', heading: '4. Слова для вопросов и рассказа о семье', items: words('use') },
  { kind: 'pattern', heading: '5. Мой, моя: принадлежность', formula: 'Родственник + tôi / родственник + của tôi', formulaNote: 'После обозначения родственника можно сразу поставить tôi. Вариант с của тоже подходит.', examples: [
    { vi: 'mẹ tôi', ru: 'моя мама' }, { vi: 'bố tôi', ru: 'мой папа' },
    { vi: 'vợ tôi', ru: 'моя жена' }, { vi: 'con gái tôi', ru: 'моя дочь' },
    { vi: 'Đây là con gái của tôi.', ru: 'Это моя дочь.' },
  ] },
  { kind: 'pattern', heading: '6. Кто это?', formula: 'Đây là ai? — Đây là + родственник + tôi.', formulaNote: 'Đây — это; là — быть, являться; ai — кто.', examples: [
    { vi: 'Đây là ai?', ru: 'Кто это?' },
    { vi: 'Đây là mẹ tôi.', ru: 'Это моя мама.' },
    { vi: 'Đây là chị gái tôi.', ru: 'Это моя старшая сестра.' },
  ] },
  { kind: 'table', heading: '7. Вопросы о семье', columns: ['Вьетнамский', 'Русский'], rows: [
    ['Con gái anh tên là gì?', 'Как зовут твою дочь?'],
    ['Con gái anh bao nhiêu tuổi?', 'Сколько лет твоей дочери?'],
    ['Con gái anh học lớp mấy?', 'В каком классе учится твоя дочь?'],
    ['Bây giờ con trai anh ở đâu?', 'Где сейчас твой сын?'],
    ['Con trai anh làm nghề gì?', 'Кем работает твой сын?'],
  ] },
  { kind: 'pattern', heading: '8. Женат / замужем', formula: 'Anh / Chị đã kết hôn chưa? — Tôi đã kết hôn rồi.', formulaNote: 'Kết hôn — вступать в брак. Đã kết hôn rồi — уже женат / замужем. Конструкция подходит и мужчине, и женщине.', examples: [
    { vi: 'Chị đã kết hôn chưa?', ru: 'Вы замужем?' },
    { vi: 'Anh đã kết hôn chưa?', ru: 'Вы женаты?' },
    { vi: 'Vâng, tôi đã kết hôn rồi.', ru: 'Да, я женат / замужем.' },
  ] },
  { kind: 'table', heading: '9. Употребление слов в предложениях', columns: ['Вьетнамский', 'Русский'], rows: familyExamples.map(({ vi, ru }) => [vi, ru]) },
  ...familyDialogues.map(dialogue => ({
    kind: 'dialogue' as const,
    heading: dialogue.heading,
    lines: dialogue.lines.map(({ speaker, vi, ru }) => ({ speaker, vi, ru })),
  })),
  { kind: 'tip', heading: 'Обрати внимание', items: [
    'Làm nghề gì? спрашивает о профессии. Làm việc ở ngân hàng сообщает место работы — банк; конкретная должность не уточняется.',
    'Для тренировки сначала идут все слова и выражения, затем предложения с ними. Чтобы сохранить этот порядок, выбери «По порядку».',
  ] },
];
