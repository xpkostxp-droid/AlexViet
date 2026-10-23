import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { phrasebook2Lessons as allPhrasebook2Lessons } from '../src/content/listening/phrasebook2';
import { phrasebook2PublishedLessons } from '../src/content/listening/release';
import { listeningLessons } from '../src/content/listening/lessons';
import { courseListeningLessons } from '../src/content/listening/course';
import { listeningChoices } from '../src/domain/listening';

const phrasebook2Lessons = allPhrasebook2Lessons.filter(lesson => lesson.number <= phrasebook2PublishedLessons);
const source = JSON.parse(fs.readFileSync(path.resolve('scripts/listening/phrasebook2/source-manifest.json'), 'utf8'));
describe('three listening collections', () => {
  it('keeps existing identities and gives every new lesson a separate identity', () => {
    expect(listeningLessons).toHaveLength(17);
    expect(courseListeningLessons.map(lesson => lesson.number)).toEqual([10, 11]);
    for (const lesson of courseListeningLessons) expect(fs.existsSync(path.resolve('public', lesson.audio))).toBe(true);
    expect(phrasebook2Lessons).toHaveLength(phrasebook2PublishedLessons);
    expect(listeningLessons.map(x => x.id)).toEqual(Array.from({ length: 17 }, (_, i) => `listening-${String(i + 1).padStart(2, '0')}`));
    const ids = [...listeningLessons, ...courseListeningLessons, ...phrasebook2Lessons].map(x => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('retains all reviewed source phrases and vocabulary and provides safe audio boundaries', () => {
    expect(phrasebook2Lessons.reduce((count, x) => count + x.phrases.length, 0)).toBe(source.slice(0, phrasebook2PublishedLessons).reduce((count, lesson) => count + lesson.phrases.length, 0));
    for (const lesson of phrasebook2Lessons) {
      const original = source[lesson.number - 1];
      expect(lesson.vocabulary).toEqual(original.vocabulary);
      expect(lesson.phrases.map(({ vi, ru }) => ({ vi, ru }))).toEqual(original.phrases.map(({ vi, ru }) => ({ vi, ru })));
      expect(fs.existsSync(path.resolve('public', lesson.audio))).toBe(true);
      expect(lesson.vocabulary.length).toBeGreaterThan(0);
      for (let i = 0; i < lesson.phrases.length; i++) {
        const phrase = lesson.phrases[i];
        expect(phrase.end).toBeGreaterThan(phrase.start);
        expect(phrase.vi).not.toMatch(/[А-Яа-я]/);
        expect(original.phrases[i].sourceEnd).toBeGreaterThan(original.phrases[i].sourceStart);
        if (i) expect(phrase.start - lesson.phrases[i - 1].end).toBeCloseTo(1, 4);
      }
    }
  });
  it('offers four distinct answers and keeps build-only game JSON out of runtime imports', () => {
    for (const lesson of [...courseListeningLessons, ...phrasebook2Lessons]) for (const phrase of lesson.phrases) {
      const choices = listeningChoices(lesson, phrase);
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(phrase.ru);
    }
    function visit(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) visit(file);
        else if (/\.[jt]sx?$/.test(file) && !file.includes('.test.')) expect(fs.readFileSync(file, 'utf8')).not.toMatch(/game-data/);
      }
    }
    visit('src');
  });
});
