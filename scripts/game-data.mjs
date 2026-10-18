import assert from 'node:assert/strict';

const cyrillic = /\p{Script=Cyrillic}/u;
const isVi = value => typeof value === 'string' && /\p{L}/u.test(value) && !cyrillic.test(value);
const sentence = value => /[.!?]$/.test(value) && !/\.{2,}|…/.test(value);
export const tokensFor = text => text.normalize('NFC').match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
const requireText = (value, label) => assert(typeof value === 'string' && value.trim(), `${label}: expected non-empty text`);

// Parse only explicit bilingual notation. Ambiguous prose remains in theory.
function inlinePair(text) {
  const match = text.match(/^(.+?)\s+(?:—|=)\s+(.+)$/u) ?? text.match(/^([^()]+)\s+\(([^()]+)\)$/u);
  if (!match || !isVi(match[1]) || !cyrillic.test(match[2])) return null;
  return { vi: match[1].trim(), ru: match[2].trim() };
}

export function buildGameData({ lessons, flashCards, theoryMaterials, dialogueSets = [] }) {
  const lessonIds = new Set(lessons.map(l => l.id));
  assert.equal(lessonIds.size, lessons.length, 'Duplicate lesson id');
  assert.equal(new Set(lessons.map(l => l.number)).size, lessons.length, 'Duplicate lesson number');
  assert.equal(new Set(flashCards.map(c => c.id)).size, flashCards.length, 'Duplicate card id');
  for (const item of [...flashCards, ...theoryMaterials, ...dialogueSets]) {
    assert(lessonIds.has(item.lessonId), `Unknown lesson: ${item.lessonId}`);
  }
  assert.equal(new Set(theoryMaterials.map(m => m.lessonId)).size, theoryMaterials.length, 'Duplicate theory material');
  return lessons.map(lesson => {
    assert(Number.isSafeInteger(lesson.number) && lesson.number > 0, 'Invalid lesson number');
    requireText(lesson.title, `${lesson.id}.title`);
    const cards = flashCards.filter(c => c.lessonId === lesson.id);
    const theory = theoryMaterials.find(m => m.lessonId === lesson.id)?.sections ?? null;
    const words = [], grammar = [], examples = [], dialogues = [];
    const source = (pointer, file = `src/content/theory/lesson${lesson.number}.ts`) => ({ file, pointer });
    function pair(item, origin, target = words) {
      requireText(item.vi, `${origin.pointer}.vi`);
      requireText(item.ru, `${origin.pointer}.ru`);
      target.push({ ...item, source: origin });
    }
    function example(item, origin) {
      requireText(item.vi, `${origin.pointer}.vi`);
      if (item.ru != null) requireText(item.ru, `${origin.pointer}.ru`);
      examples.push({ ...item, ru: item.ru ?? null, tokens: tokensFor(item.vi), source: origin });
    }
    cards.forEach(card => {
      const origin = source(card.id, 'src/content/cards.ts');
      pair(card, origin);
      if (sentence(card.vi)) example({ vi: card.vi, ru: card.ru }, origin);
    });
    (theory ?? []).forEach((block, i) => {
      const base = `/sections/${i}`;
      const origin = source(base);
      switch (block.kind) {
        case 'vocab':
          block.items.forEach((item, j) => {
            const ref = source(`${base}/items/${j}`);
            pair(item, ref);
            if (sentence(item.vi)) example({ vi: item.vi, ru: item.ru }, ref);
            if (item.example) {
              if (item.exampleRu) example({ vi: item.example, ru: item.exampleRu }, source(`${ref.pointer}/example`));
              else item.example.split(/,\s*/).forEach((part, k) => {
                const parsed = inlinePair(part);
                if (parsed) { pair(parsed, source(`${ref.pointer}/example/${k}`)); example(parsed, source(`${ref.pointer}/example/${k}`)); }
              });
            }
          });
          break;
        case 'pattern':
          requireText(block.formula, `${base}.formula`);
          grammar.push({ ...block, source: origin });
          block.examples.forEach((item, j) => example(item, source(`${base}/examples/${j}`)));
          break;
        case 'dialogue':
          block.lines.forEach((line, j) => {
            requireText(line.speaker, `${base}/lines/${j}.speaker`);
            pair(line, source(`${base}/lines/${j}`), []);
            example(line, source(`${base}/lines/${j}`));
          });
          dialogues.push({ ...block, source: origin });
          break;
        case 'table': {
          block.rows.forEach(row => assert.equal(row.length, block.columns.length, `Ragged table: ${lesson.id}${base}`));
          const formulaColumn = block.columns.findIndex(col => /схема|маркер/i.test(col));
          if (formulaColumn >= 0) grammar.push({ ...block, source: origin });
          const viColumn = block.columns.findIndex(col => /^(вьетнамский|вопрос)$/i.test(col));
          const ruColumn = block.columns.findIndex(col => /^(перевод|что спрашиваем)$/i.test(col));
          block.rows.forEach((row, r) => {
            if (viColumn >= 0 && ruColumn >= 0) {
              const item = { vi: row[viColumn], ru: row[ruColumn] };
              pair(item, source(`${base}/rows/${r}`)); example(item, source(`${base}/rows/${r}`));
            }
            row.forEach((cell, c) => {
              const parsed = inlinePair(cell);
              if (parsed) {
                pair(parsed, source(`${base}/rows/${r}/${c}`));
                example(parsed, source(`${base}/rows/${r}/${c}`));
              }
              if (/примеры слов/i.test(block.columns[c])) {
                const parts = cell.split(/,\s*(?![^()]*\))/u);
                const meaningsColumn = block.columns.findIndex(col => col === 'Значение');
                const meanings = meaningsColumn >= 0 ? row[meaningsColumn].split(/,\s*(?![^()]*\))/u) : [];
                parts.forEach((part, k) => {
                  const item = inlinePair(part) ?? (parts.length === meanings.length && isVi(part)
                    ? { vi: part.trim(), ru: meanings[k].trim() } : null);
                  if (item) pair(item, source(`${base}/rows/${r}/${c}/${k}`));
                });
              }
            });
          });
          break;
        }
        case 'text':
        case 'tip':
          (block.paragraphs ?? block.items).forEach((text, j) => {
            requireText(text, `${base}/${j}`);
            const parsed = inlinePair(text);
            if (parsed) { pair(parsed, source(`${base}/${j}`)); example(parsed, source(`${base}/${j}`)); }
          });
          break;
        default: throw new Error(`Unsupported theory block: ${block.kind}`);
      }
    });
    dialogueSets.filter(set => set.lessonId === lesson.id).forEach(set => {
      // The game stores independent sentences, not speaker-labelled conversations.
      // Preserve its order without inventing speakers or question/answer pairs.
      const lines = set.sentences.map((item, j) => {
        const origin = source(`/dialogueSentences/${j}`, set.source);
        pair(item, origin, []); example(item, origin);
        return { ...item, tokens: tokensFor(item.vi) };
      });
      dialogues.push({ kind: 'sentence-bank', heading: set.heading, lines, source: source('/dialogueSentences', set.source) });
    });
    return { schemaVersion: 1, lessonId: lesson.id, number: lesson.number, title: lesson.title,
      cards, words, grammar, examples, dialogues, theory };
  });
}
