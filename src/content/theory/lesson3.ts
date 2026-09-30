// Урок 3: Знакомство (Giới thiệu / làm quen).
// В PDF этот урок дан в двух оформлениях с одинаковым содержанием —
// здесь объединено то и другое, без повторов.

import type { TheoryBlock } from '../../types';

export const lesson3Theory: TheoryBlock[] = [
  {
    kind: 'vocab',
    heading: 'Глаголы (повторение из урока 1)',
    items: [
      { vi: 'uống', pronunciation: 'уонг', ru: 'пить', example: 'uống cà phê', exampleRu: 'пить кофе' },
      { vi: 'đi', pronunciation: 'ди', ru: 'ехать, идти', example: 'đi Cam Ranh', exampleRu: 'ехать в Камрань' },
      { vi: 'ăn', pronunciation: 'ан', ru: 'есть, кушать', example: 'ăn phở bò', exampleRu: 'кушать фо бо' },
      { vi: 'thích', pronunciation: 'тик', ru: 'нравиться', example: 'thích chơi pickleball', exampleRu: 'нравится играть в пиклбол' },
      { vi: 'muốn', pronunciation: 'муон', ru: 'хотеть', example: 'muốn mua xe máy', exampleRu: 'хотеть купить мотобайк' },
      { vi: 'mua', pronunciation: 'муа', ru: 'покупать', example: 'mua xe máy', exampleRu: 'купить мотобайк' },
    ],
  },
  {
    kind: 'pattern',
    heading: 'Конструкция вопроса «Có ... không?» (есть / делать ...?)',
    formula: 'Em/Anh + có + [глагол / существительное] + không?',
    formulaNote: 'кто + есть + что делать / что + частица вопроса → общий вопрос «да/нет»',
    examples: [
      { vi: 'Em có uống cà phê không?', ru: 'Ты пьёшь / хочешь выпить кофе?' },
      { vi: 'Em có đi Cam Ranh không?', ru: 'Ты едешь в Камрань?' },
      { vi: 'Em có muốn ăn phở bò không?', ru: 'Ты хочешь поесть фо бо?' },
      { vi: 'Em có mua xe máy không?', ru: 'Ты покупаешь / хочешь купить мотобайк?' },
    ],
  },
  {
    kind: 'vocab',
    heading: 'Знакомство (Giới thiệu, làm quen)',
    items: [
      { vi: 'Anh tên là gì?', ru: 'Как тебя зовут? (обращение к мужчине)' },
      { vi: 'Em tên là gì?', ru: 'Как тебя зовут? (к младшему собеседнику)' },
      { vi: 'Anh tên là Kostya.', ru: 'Меня зовут Костя.' },
      { vi: 'Rất vui được làm quen.', ru: 'Очень приятно познакомиться.' },
      { vi: 'Anh có khỏe không?', ru: 'Ты здоров? / Как самочувствие?' },
      { vi: 'Có, anh khỏe.', ru: 'Да, я здоров.' },
      { vi: 'Không, anh không khỏe.', ru: 'Нет, я нездоров.' },
      { vi: 'Anh bình thường.', ru: 'Я нормально / всё нормально.' },
    ],
  },
  {
    kind: 'vocab',
    heading: '«А ты?» и «тоже»',
    items: [
      { vi: 'Còn em?', ru: 'А ты? / А как насчёт тебя?' },
      { vi: 'Còn em thế nào?', ru: 'А ты как? / Как у тебя дела?' },
      { vi: 'cũng', ru: 'тоже / также' },
      { vi: 'Anh cũng khỏe.', ru: 'Я тоже здоров.' },
      { vi: 'Em cũng vậy.', ru: 'Я тоже / У меня так же.' },
    ],
  },
  {
    kind: 'text',
    heading: 'Важное дополнение',
    paragraphs: [
      'Во вьетнамском местоимение часто одновременно является обращением. Поэтому в реальном разговоре естественнее сказать «Anh tên là gì?» или «Em tên là gì?», а не искать одно универсальное «ты».',
      'Bạn tên là gì? — Как тебя зовут? (нейтрально, но в живой речи anh/em звучит естественнее).',
      'Bạn khỏe không? — Как ты? / Ты здоров? (нейтральная форма).',
      'Rất vui được gặp anh/em. — Очень рад познакомиться / встретиться с тобой.',
    ],
  },
  {
    kind: 'dialogue',
    heading: 'Мини-диалог',
    lines: [
      { speaker: 'A', vi: 'Anh tên là gì?', ru: 'Как тебя зовут?' },
      { speaker: 'B', vi: 'Anh tên là Kostya. Còn em?', ru: 'Меня зовут Костя. А тебя?' },
      { speaker: 'A', vi: 'Em tên là Alex. Anh có khỏe không?', ru: 'Меня зовут Алекс. Ты здоров?' },
      { speaker: 'B', vi: 'Có, anh khỏe. Cảm ơn. Còn em?', ru: 'Да, я здоров. Спасибо. А ты?' },
      { speaker: 'A', vi: 'Em cũng khỏe.', ru: 'Я тоже здоров.' },
    ],
  },
];
