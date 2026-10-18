// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lessons, theoryMaterials } from '../src/content/lessons';
import { flashCards } from '../src/content/cards';
import { dialogueSentences } from '../src/content/games/dialogues';
import { loadContent } from './load-content.mjs';
import { buildGameData, tokensFor } from './game-data.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = loadContent(root);
const output = buildGameData(input);
const fixture = sections => ({ lessons: [{ id: 'lesson-10', number: 10, title: 'Новый урок' }],
  flashCards: [], theoryMaterials: [{ lessonId: 'lesson-10', sections }] });

describe('game data export', () => {
  it('loads exactly the same theory, lessons and dialogues as Vite', () => {
    expect(input.lessons).toEqual(lessons);
    expect(input.theoryMaterials).toEqual(theoryMaterials);
    expect(input.dialogueSets[0].sentences).toEqual(dialogueSentences);
    expect(input.flashCards).toEqual(flashCards.map(card => ({ ...card,
      ...(card.imageUrl ? { imageUrl: card.imageUrl.replace(import.meta.env.BASE_URL, './') } : {}) })));
  });
  it('exports every lesson and preserves every theory section and card', () => {
    expect(output).toHaveLength(lessons.length);
    for (const lesson of output) {
      expect(lesson.theory).toEqual(theoryMaterials.find(m => m.lessonId === lesson.lessonId).sections);
      expect(lesson.cards).toEqual(input.flashCards.filter(c => c.lessonId === lesson.lessonId));
      for (const [i, block] of lesson.theory.entries()) {
        if (block.kind === 'vocab') for (const [j, item] of block.items.entries()) {
          expect(lesson.words).toContainEqual({ ...item,
            source: { file: `src/content/theory/lesson${lesson.number}.ts`, pointer: `/sections/${i}/items/${j}` } });
        }
      }
    }
  });
  it('includes both lesson 9 card groups and every game dialogue sentence', () => {
    const ninth = output.find(l => l.number === 9);
    expect(ninth.cards).toHaveLength(flashCards.filter(c => c.lessonId === 'lesson-9').length);
    expect(ninth.dialogues.find(d => d.kind === 'sentence-bank').lines.map(({ vi, ru }) => ({ vi, ru }))).toEqual(dialogueSentences);
    expect(output.filter(l => l.number !== 9).flatMap(l => l.dialogues).some(d => d.kind === 'sentence-bank')).toBe(false);
  });
  it('extracts bilingual table and prose examples, and grammar tables', () => {
    expect(output[3].examples.some(e => e.vi === 'Anh đang học tiếng Việt.' && e.ru === 'Ты сейчас учишь вьетнамский.')).toBe(true);
    expect(output[4].examples.some(e => e.vi === 'Tôi tên là Minh.' && e.ru === 'Меня зовут Минь.')).toBe(true);
    expect(output[4].grammar.some(g => g.kind === 'table' && g.heading === 'Основные конструкции')).toBe(true);
    expect(output[0].words.some(w => w.vi === 'ba' && w.ru === 'папа')).toBe(true);
  });
  it('preserves speakers, order, notes and all pattern examples', () => {
    for (const lesson of output) for (const block of lesson.theory) {
      if (block.kind === 'dialogue') expect(lesson.dialogues.map(({ source, ...d }) => d)).toContainEqual(block);
      if (block.kind === 'pattern') {
        expect(lesson.grammar.map(({ source, ...g }) => g)).toContainEqual(block);
        for (const item of block.examples) expect(lesson.examples.some(e => e.vi === item.vi && e.ru === item.ru)).toBe(true);
      }
    }
  });
  it('keeps homonyms with different translations', () => {
    const meanings = output[8].words.filter(w => w.vi === 'năm').map(w => w.ru);
    expect(meanings).toContain('год');
    expect(meanings).toContain('5 — пять');
  });
  it('creates punctuation-free tokens without losing duplicates or diacritics', () => {
    expect(tokensFor('Tôi, tôi… học tiếng Việt?!')).toEqual(['Tôi', 'tôi', 'học', 'tiếng', 'Việt']);
    for (const item of output.flatMap(l => l.examples)) {
      expect(item.tokens.length).toBeGreaterThan(0);
      expect(item.tokens.every(t => /^[\p{L}\p{M}\p{N}]+$/u.test(t))).toBe(true);
    }
  });
  it('reflects source edits and new lessons without an exporter allowlist', () => {
    const source = fixture([{ kind: 'vocab', items: [{ vi: 'mới', ru: 'новый' }] }]);
    expect(buildGameData(source)[0].words[0].ru).toBe('новый');
    source.theoryMaterials[0].sections[0].items[0].ru = 'обновлённый';
    expect(buildGameData(source)[0].words[0].ru).toBe('обновлённый');
  });
  it('does not invent content for lessons without cards/theory/dialogues', () => {
    expect(buildGameData(fixture(null))[0]).toMatchObject({ cards: [], words: [], grammar: [], examples: [], dialogues: [], theory: null });
  });
  it('rejects orphan cards, missing translations, duplicate IDs and unknown block kinds', () => {
    expect(() => buildGameData({ ...fixture(null), flashCards: [{ id: 'x', lessonId: 'missing' }] })).toThrow('Unknown lesson');
    expect(() => buildGameData(fixture([{ kind: 'vocab', items: [{ vi: 'mới', ru: '' }] }]))).toThrow('non-empty');
    expect(() => buildGameData({ ...input, lessons: [...input.lessons, input.lessons[0]] })).toThrow('Duplicate lesson');
    expect(() => buildGameData(fixture([{ kind: 'unknown' }]))).toThrow('Unsupported theory');
    expect(() => buildGameData(fixture([{ kind: 'table', columns: ['A'], rows: [['a', 'b']] }]))).toThrow('Ragged table');
  });
  it('is deterministic and matches all committed JSON files', () => {
    expect(buildGameData(input)).toEqual(output);
    for (const lesson of output) {
      const filename = `lesson-${String(lesson.number).padStart(2, '0')}.json`;
      expect(JSON.parse(readFileSync(`${root}/public/game-data/${filename}`, 'utf8'))).toEqual(lesson);
    }
  });
});
