// Урок 4: Время глаголов, профессии и места.
// В PDF этот урок дан в двух оформлениях — объединено без повторов,
// со словарём профессий и мест из обеих версий.

import type { TheoryBlock } from '../../types';

export const lesson4Theory: TheoryBlock[] = [
  {
    kind: 'table',
    heading: 'Время глаголов',
    note: 'Во вьетнамском глагол не изменяется по временам — время показывает маркер перед глаголом.',
    columns: ['Время', 'Маркер', 'Значение', 'Пример'],
    rows: [
      ['Прошедшее', 'đã', 'уже; действие завершено', 'Anh đã đi Mũi Né rồi. — Ты уже ездил в Муйне.'],
      ['Настоящее', 'đang', 'сейчас; действие продолжается', 'Anh đang học tiếng Việt. — Ты сейчас учишь вьетнамский.'],
      ['Будущее', 'sẽ', 'буду; план, намерение', 'Chị sẽ đi An Viên vào ngày mai. — Вы поедете в Ан Вьен завтра.'],
    ],
  },
  {
    kind: 'table',
    heading: 'Полезные примеры с глаголами',
    note: 'В примерах будущего времени — слово «ngày mai» (завтра).',
    columns: ['Глагол', 'Прошедшее', 'Настоящее', 'Будущее (завтра)'],
    rows: [
      [
        'uống (пить)',
        'Anh đã uống cà phê. — Я уже пил кофе.',
        'Anh đang uống cà phê. — Я сейчас пью кофе.',
        'Anh sẽ uống cà phê vào ngày mai. — Я буду пить кофе завтра.',
      ],
      [
        'đi (ехать)',
        'Anh đã đi Cam Ranh. — Я уже ездил в Камрань.',
        'Anh đang đi chợ. — Я сейчас иду на рынок.',
        'Anh sẽ đi Cam Ranh vào ngày mai. — Я поеду в Камрань завтра.',
      ],
      [
        'ăn (есть)',
        'Anh đã ăn phở bò. — Я уже ел фо бо.',
        'Anh đang ăn cơm. — Я сейчас ем рис.',
        'Anh sẽ ăn phở bò vào ngày mai. — Я буду есть фо бо завтра.',
      ],
      [
        'thích (нравиться)',
        'Anh đã thích xe máy. — Раньше мне нравились мотоциклы.',
        'Anh đang thích bóng đá. — Сейчас мне нравится футбол.',
        'Anh sẽ thích đi biển vào ngày mai. — Завтра мне понравится поехать на море.',
      ],
      [
        'muốn (хотеть)',
        'Anh đã muốn mua xe. — Я уже хотел купить мотоцикл.',
        'Anh đang muốn học tiếng Việt. — Сейчас я хочу учить вьетнамский.',
        'Anh sẽ muốn mua xe máy vào ngày mai. — Завтра я захочу купить мотоцикл.',
      ],
      [
        'mua (покупать)',
        'Anh đã mua điện thoại. — Я уже купил телефон.',
        'Anh đang mua quà. — Я сейчас покупаю подарок.',
        'Anh sẽ mua quà vào ngày mai. — Я куплю подарок завтра.',
      ],
    ],
  },
  {
    kind: 'vocab',
    heading: 'Профессии (nghề nghiệp)',
    items: [
      { vi: 'bác sĩ', pronunciation: 'бак си', ru: 'врач' },
      { vi: 'y tá', pronunciation: 'и та', ru: 'медсестра' },
      { vi: 'giám đốc', pronunciation: 'зям док', ru: 'директор' },
      { vi: 'thư ký', pronunciation: 'ты ки', ru: 'секретарь' },
      { vi: 'sếp', pronunciation: 'сэп', ru: 'начальник, босс' },
      { vi: 'nhân viên', pronunciation: 'нян виен', ru: 'сотрудник' },
      { vi: 'quản lý', pronunciation: 'куан ли', ru: 'менеджер, управляющий' },
      { vi: 'công an', pronunciation: 'кон ан', ru: 'полиция, полицейский' },
      { vi: 'cảnh sát', pronunciation: 'кань сат', ru: 'полицейский' },
      { vi: 'cảnh sát giao thông', pronunciation: 'кань сат зяо тхонг', ru: 'дорожная полиция (ДПС)' },
      { vi: 'sinh viên', pronunciation: 'син виен', ru: 'студент' },
      { vi: 'giáo viên', pronunciation: 'зяо виен', ru: 'учитель, преподаватель' },
      { vi: 'cô giáo', pronunciation: 'ко зяо', ru: 'учительница' },
      { vi: 'thầy giáo', pronunciation: 'тхай зяо', ru: 'учитель' },
    ],
  },
  {
    kind: 'vocab',
    heading: 'Вопросы о профессии и работе',
    items: [
      { vi: 'Anh làm nghề gì?', ru: 'Кем вы работаете? / Какая у вас профессия?' },
      { vi: 'Anh làm việc ở đâu?', ru: 'Где вы работаете?' },
      { vi: 'Anh Mikhail là kỹ sư.', ru: 'Михаил — инженер.' },
      { vi: 'Chị là y tá.', ru: 'Она медсестра.' },
      { vi: 'Chị làm việc ở bệnh viện.', ru: 'Она работает в больнице.' },
      { vi: 'Tôi là nhân viên công ty.', ru: 'Я сотрудник компании.' },
      { vi: 'Tôi làm việc ở ngân hàng.', ru: 'Я работаю в банке.' },
    ],
  },
  {
    kind: 'vocab',
    heading: 'Места (địa điểm)',
    items: [
      { vi: 'bệnh viện', ru: 'больница' },
      { vi: 'công ty', ru: 'компания, офис' },
      { vi: 'nhà hàng', ru: 'ресторан' },
      { vi: 'trường', ru: 'школа / учебное заведение' },
      { vi: 'trường đại học', ru: 'университет' },
      { vi: 'ngân hàng', ru: 'банк' },
    ],
  },
  {
    kind: 'pattern',
    heading: 'Вопрос «где?» — ở đâu?',
    formula: '[место] + ở đâu?',
    examples: [
      { vi: 'Bệnh viện ở đâu?', ru: 'Где больница?' },
      { vi: 'Công ty ở đâu?', ru: 'Где компания?' },
      { vi: 'Nhà hàng ở đâu?', ru: 'Где ресторан?' },
      { vi: 'Trường đại học ở đâu?', ru: 'Где университет?' },
    ],
  },
  {
    kind: 'vocab',
    heading: 'Полезные выражения',
    items: [
      { vi: 'Còn em?', ru: 'А ты? / Как насчёт тебя?' },
      { vi: 'Còn em thế nào?', ru: 'А ты как? / Как у тебя дела?' },
      { vi: 'cũng', ru: 'также / тоже' },
      { vi: 'Anh cũng khỏe.', ru: 'Я тоже здоров.' },
      { vi: 'Anh thích xe máy.', ru: 'Мне нравится мотобайк.' },
      { vi: 'Em cũng vậy.', ru: 'Я тоже / у меня также.' },
    ],
  },
  {
    kind: 'tip',
    heading: 'Коротко запомнить',
    items: [
      'đã = уже / прошлое',
      'đang = сейчас',
      'sẽ = будущее',
      'ngày mai = завтра',
      'làm nghề gì? = какая профессия?',
      'làm việc ở đâu? = где работаете?',
      'ở đâu? = где?',
    ],
  },
];
