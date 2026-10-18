import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadContent } from './load-content.mjs';
import { buildGameData } from './game-data.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(root, 'public/game-data');
const check = process.argv.includes('--check');
const data = buildGameData(loadContent(root));
const files = new Map();
const entries = data.map(lesson => {
  const file = `lesson-${String(lesson.number).padStart(2, '0')}.json`;
  const json = JSON.stringify(lesson, null, 2) + '\n';
  files.set(file, json);
  return { lessonId: lesson.lessonId, number: lesson.number, title: lesson.title, file,
    sha256: createHash('sha256').update(json).digest('hex'),
    counts: Object.fromEntries(['cards', 'words', 'grammar', 'examples', 'dialogues'].map(key => [key, lesson[key].length])) };
});
files.set('index.json', JSON.stringify({ schemaVersion: 1, lessons: entries }, null, 2) + '\n');
if (!check) fs.mkdirSync(directory, { recursive: true });
const stale = fs.existsSync(directory) ? fs.readdirSync(directory).filter(name => /^lesson-\d+\.json$/.test(name) && !files.has(name)) : [];
const differences = [];
for (const [name, json] of files) {
  const filename = path.join(directory, name);
  if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf8') !== json) {
    differences.push(name);
    if (!check) fs.writeFileSync(filename, json);
  }
}
for (const name of stale) {
  differences.push(name);
  if (!check) fs.unlinkSync(path.join(directory, name));
}
if (check && differences.length) {
  console.error(`Game data is outdated: ${differences.join(', ')}. Run npm run build.`);
  process.exitCode = 1;
} else console.log(`${check ? 'Verified' : 'Generated'} game data for ${data.length} lessons (${differences.length} changed files).`);
