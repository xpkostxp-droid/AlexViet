import { expect, it } from 'vitest';
import { dialogueSentences, dialogueTokens, dialogueWordGroups } from './dialogues';
it('provides every required word, repeatable words and unused distractors in ordered groups', () => {
  expect(dialogueSentences).toHaveLength(17);
  for (const sentence of dialogueSentences) {
    const words = dialogueTokens(sentence.vi);
    const bank = dialogueWordGroups(sentence.vi).flatMap(group => group.words);
    for (const word of words) expect(bank).toContain(word);
    expect(new Set(bank).size).toBe(bank.length);
    expect(bank.some(word => !words.includes(word))).toBe(true);
  }
  expect(dialogueTokens(dialogueSentences[8].vi).filter(word => word === 'anh')).toHaveLength(2);
});
