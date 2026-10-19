import type { FlashCard } from '../types';

// Согласованный конспект урока 10. Ключи постоянные: на них опирается прогресс.
export const familyWords = [
  {
    "key": "family",
    "group": "parents",
    "vi": "gia đình",
    "ru": "семья"
  },
  {
    "key": "grandfather",
    "group": "parents",
    "vi": "ông",
    "ru": "дедушка"
  },
  {
    "key": "grandmother",
    "group": "parents",
    "vi": "bà",
    "ru": "бабушка"
  },
  {
    "key": "maternal-grandfather",
    "group": "parents",
    "vi": "ông ngoại",
    "ru": "дедушка по маминой линии"
  },
  {
    "key": "maternal-grandmother",
    "group": "parents",
    "vi": "bà ngoại",
    "ru": "бабушка по маминой линии"
  },
  {
    "key": "paternal-grandfather",
    "group": "parents",
    "vi": "ông nội",
    "ru": "дедушка по папиной линии"
  },
  {
    "key": "paternal-grandmother",
    "group": "parents",
    "vi": "bà nội",
    "ru": "бабушка по папиной линии"
  },
  {
    "key": "mother",
    "group": "parents",
    "vi": "mẹ",
    "ru": "мама"
  },
  {
    "key": "father",
    "group": "parents",
    "vi": "bố",
    "ru": "папа"
  },
  {
    "key": "older-brother-part",
    "group": "siblings",
    "vi": "anh",
    "ru": "старший брат; обращение к мужчине"
  },
  {
    "key": "older-sister-part",
    "group": "siblings",
    "vi": "chị",
    "ru": "старшая сестра; обращение к женщине"
  },
  {
    "key": "younger-part",
    "group": "siblings",
    "vi": "em",
    "ru": "младший брат или младшая сестра"
  },
  {
    "key": "male",
    "group": "siblings",
    "vi": "trai",
    "ru": "мужской пол (в сочетаниях о родственниках)"
  },
  {
    "key": "female",
    "group": "siblings",
    "vi": "gái",
    "ru": "женский пол (в сочетаниях о родственниках)"
  },
  {
    "key": "older-brother",
    "group": "siblings",
    "vi": "anh trai",
    "ru": "старший брат"
  },
  {
    "key": "younger-brother",
    "group": "siblings",
    "vi": "em trai",
    "ru": "младший брат"
  },
  {
    "key": "older-sister",
    "group": "siblings",
    "vi": "chị gái",
    "ru": "старшая сестра"
  },
  {
    "key": "younger-sister",
    "group": "siblings",
    "vi": "em gái",
    "ru": "младшая сестра"
  },
  {
    "key": "wife",
    "group": "own",
    "vi": "vợ",
    "ru": "жена"
  },
  {
    "key": "husband",
    "group": "own",
    "vi": "chồng",
    "ru": "муж"
  },
  {
    "key": "child",
    "group": "own",
    "vi": "con",
    "ru": "ребёнок; дети"
  },
  {
    "key": "son",
    "group": "own",
    "vi": "con trai",
    "ru": "сын"
  },
  {
    "key": "daughter",
    "group": "own",
    "vi": "con gái",
    "ru": "дочь"
  },
  {
    "key": "who",
    "group": "use",
    "vi": "ai",
    "ru": "кто"
  },
  {
    "key": "possession",
    "group": "use",
    "vi": "của",
    "ru": "принадлежность: чей-либо; кого-либо"
  },
  {
    "key": "age",
    "group": "use",
    "vi": "tuổi",
    "ru": "возраст в годах; лет"
  },
  {
    "key": "how-many",
    "group": "use",
    "vi": "bao nhiêu",
    "ru": "сколько"
  },
  {
    "key": "now",
    "group": "use",
    "vi": "bây giờ",
    "ru": "сейчас"
  },
  {
    "key": "live",
    "group": "use",
    "vi": "sống",
    "ru": "жить"
  },
  {
    "key": "study",
    "group": "use",
    "vi": "học",
    "ru": "учиться"
  },
  {
    "key": "school",
    "group": "use",
    "vi": "trường",
    "ru": "школа"
  },
  {
    "key": "local",
    "group": "use",
    "vi": "địa phương",
    "ru": "местный; местность"
  },
  {
    "key": "class",
    "group": "use",
    "vi": "lớp",
    "ru": "класс"
  },
  {
    "key": "work",
    "group": "use",
    "vi": "làm việc",
    "ru": "работать"
  },
  {
    "key": "bank",
    "group": "use",
    "vi": "ngân hàng",
    "ru": "банк"
  },
  {
    "key": "marry",
    "group": "use",
    "vi": "kết hôn",
    "ru": "вступать в брак"
  }
];

export const familyExamples = [
  {
    "key": "family-live",
    "vi": "Gia đình tôi sống ở Việt Nam.",
    "ru": "Моя семья живёт во Вьетнаме."
  },
  {
    "key": "mother",
    "vi": "Đây là mẹ tôi.",
    "ru": "Это моя мама."
  },
  {
    "key": "father",
    "vi": "Đây là bố tôi.",
    "ru": "Это мой папа."
  },
  {
    "key": "maternal-grandfather",
    "vi": "Đây là ông ngoại tôi.",
    "ru": "Это мой дедушка по маминой линии."
  },
  {
    "key": "maternal-grandmother",
    "vi": "Đây là bà ngoại tôi.",
    "ru": "Это моя бабушка по маминой линии."
  },
  {
    "key": "paternal-grandfather",
    "vi": "Đây là ông nội tôi.",
    "ru": "Это мой дедушка по папиной линии."
  },
  {
    "key": "paternal-grandmother",
    "vi": "Đây là bà nội tôi.",
    "ru": "Это моя бабушка по папиной линии."
  },
  {
    "key": "older-brother",
    "vi": "Đây là anh trai tôi.",
    "ru": "Это мой старший брат."
  },
  {
    "key": "younger-brother",
    "vi": "Đây là em trai tôi.",
    "ru": "Это мой младший брат."
  },
  {
    "key": "older-sister",
    "vi": "Đây là chị gái tôi.",
    "ru": "Это моя старшая сестра."
  },
  {
    "key": "younger-sister",
    "vi": "Đây là em gái tôi.",
    "ru": "Это моя младшая сестра."
  },
  {
    "key": "wife",
    "vi": "Đây là vợ tôi.",
    "ru": "Это моя жена."
  },
  {
    "key": "husband",
    "vi": "Đây là chồng tôi.",
    "ru": "Это мой муж."
  },
  {
    "key": "possessive-daughter",
    "vi": "Đây là con gái của tôi.",
    "ru": "Это моя дочь."
  }
];

export const familyDialogues = [
  {
    "key": "daughter",
    "heading": "Диалог: дочь, возраст и школа",
    "lines": [
      {
        "key": "daughter-q1",
        "speaker": "Вопрос",
        "vi": "Đây là ai?",
        "ru": "Кто это?"
      },
      {
        "key": "daughter-a1",
        "speaker": "Ответ",
        "vi": "Đây là con gái tôi.",
        "ru": "Это моя дочь."
      },
      {
        "key": "daughter-q2",
        "speaker": "Вопрос",
        "vi": "Con gái anh tên là gì?",
        "ru": "Как зовут твою дочь?"
      },
      {
        "key": "daughter-a2",
        "speaker": "Ответ",
        "vi": "Con gái tôi tên là Varvara.",
        "ru": "Мою дочь зовут Варвара."
      },
      {
        "key": "daughter-q3",
        "speaker": "Вопрос",
        "vi": "Con gái anh bao nhiêu tuổi?",
        "ru": "Сколько лет твоей дочери?"
      },
      {
        "key": "daughter-a3",
        "speaker": "Ответ",
        "vi": "Con gái tôi mười hai tuổi.",
        "ru": "Моей дочери 12 лет."
      },
      {
        "key": "daughter-q4",
        "speaker": "Вопрос",
        "vi": "Con gái anh có sống ở Việt Nam không?",
        "ru": "Твоя дочь живёт во Вьетнаме?"
      },
      {
        "key": "daughter-a4",
        "speaker": "Ответ",
        "vi": "Có, con gái tôi sống ở Việt Nam và học ở một trường địa phương.",
        "ru": "Да, моя дочь живёт во Вьетнаме и ходит в местную школу."
      },
      {
        "key": "daughter-q5",
        "speaker": "Вопрос",
        "vi": "Con gái anh học lớp mấy?",
        "ru": "В каком классе учится твоя дочь?"
      },
      {
        "key": "daughter-a5",
        "speaker": "Ответ",
        "vi": "Con gái tôi học lớp sáu.",
        "ru": "Моя дочь учится в шестом классе."
      },
      {
        "key": "daughter-q6",
        "speaker": "Вопрос",
        "vi": "Con gái anh bao nhiêu tuổi?",
        "ru": "Сколько ей лет?"
      },
      {
        "key": "daughter-a6",
        "speaker": "Ответ",
        "vi": "Bây giờ con gái tôi mười hai tuổi.",
        "ru": "Сейчас моей дочери 12 лет."
      }
    ]
  },
  {
    "key": "son",
    "heading": "Диалог: сын, место жительства и работа",
    "lines": [
      {
        "key": "son-q1",
        "speaker": "Вопрос",
        "vi": "Con trai anh tên là gì?",
        "ru": "Как зовут твоего сына?"
      },
      {
        "key": "son-a1",
        "speaker": "Ответ",
        "vi": "Con trai tôi tên là Maxim.",
        "ru": "Моего сына зовут Максим."
      },
      {
        "key": "son-q2",
        "speaker": "Вопрос",
        "vi": "Bây giờ con trai anh ở đâu?",
        "ru": "Где сейчас твой сын?"
      },
      {
        "key": "son-a2",
        "speaker": "Ответ",
        "vi": "Con trai tôi sống ở Nga.",
        "ru": "Мой сын живёт в России."
      },
      {
        "key": "son-q3",
        "speaker": "Вопрос",
        "vi": "Con trai anh bao nhiêu tuổi?",
        "ru": "Сколько лет твоему сыну?"
      },
      {
        "key": "son-a3",
        "speaker": "Ответ",
        "vi": "Con trai tôi hai mươi bảy tuổi.",
        "ru": "Моему сыну 27 лет."
      },
      {
        "key": "son-q4",
        "speaker": "Вопрос",
        "vi": "Con trai anh làm nghề gì?",
        "ru": "Кем работает твой сын?"
      },
      {
        "key": "son-a4",
        "speaker": "Ответ",
        "vi": "Con trai tôi làm việc ở ngân hàng.",
        "ru": "Мой сын работает в банке."
      }
    ]
  },
  {
    "key": "marriage-woman",
    "heading": "Диалог: вопрос женщине",
    "lines": [
      {
        "key": "marriage-woman-q1",
        "speaker": "Вопрос",
        "vi": "Chị đã kết hôn chưa?",
        "ru": "Вы замужем?"
      },
      {
        "key": "marriage-woman-a1",
        "speaker": "Ответ",
        "vi": "Vâng, tôi đã kết hôn rồi. Chồng tôi tên là Nikolai.",
        "ru": "Да, я замужем. Моего мужа зовут Николай."
      }
    ]
  },
  {
    "key": "marriage-man",
    "heading": "Диалог: вопрос мужчине",
    "lines": [
      {
        "key": "marriage-man-q1",
        "speaker": "Вопрос",
        "vi": "Anh đã kết hôn chưa?",
        "ru": "Вы женаты?"
      },
      {
        "key": "marriage-man-a1",
        "speaker": "Ответ",
        "vi": "Vâng, tôi đã kết hôn rồi. Vợ tôi tên là Svetlana.",
        "ru": "Да, я женат. Мою жену зовут Светлана."
      }
    ]
  }
];

const seenPhrases = new Set<string>();
const phraseCards: FlashCard[] = [
  ...familyExamples.map(({ key, vi, ru }) => ({ id: `l10-use-${key}`, lessonId: 'lesson-10', vi, ru })),
  ...familyDialogues.flatMap(dialogue => dialogue.lines.map(({ key, vi, ru }) => ({ id: `l10-dialogue-${key}`, lessonId: 'lesson-10', vi, ru }))),
].filter(card => {
  // Повторный вопрос о возрасте сохранён в диалоге, но не дублирует карточку.
  if (seenPhrases.has(card.vi)) return false;
  seenPhrases.add(card.vi);
  return true;
});

// По просьбе автора: все слова сначала, все предложения после них.
export const lesson10Cards: FlashCard[] = [
  ...familyWords.map(({ key, vi, ru }) => ({ id: `l10-word-${key}`, lessonId: 'lesson-10', vi, ru })),
  ...phraseCards,
];
