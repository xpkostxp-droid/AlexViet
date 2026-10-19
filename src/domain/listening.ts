import type { ListeningLesson, ListeningPhrase } from '../content/listening/types';

export function listeningChoices(lesson: ListeningLesson, phrase: ListeningPhrase, random = Math.random): string[] {
  const pool = [...new Set(lesson.phrases.map(item => item.ru))].filter(ru => ru !== phrase.ru);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const choices = [phrase.ru, ...pool.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
