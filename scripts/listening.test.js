import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { listeningLessons } from '../src/content/listening/lessons';
describe('listening audio sources', () => {
  it('includes the audio file for every lesson', () => {
    for (const lesson of listeningLessons) expect(existsSync(`public/${lesson.audio}`)).toBe(true);
  });
  it('keeps every source cut within the original recording', () => {
    const manifest = JSON.parse(readFileSync('scripts/listening/source-manifest.json', 'utf8'));
    expect(manifest).toHaveLength(17);
    manifest.forEach((lesson, i) => {
      expect(lesson.phrases.length).toBe(listeningLessons[i].phrases.length);
      for (const p of lesson.phrases) {
        expect(p.sourceStart).toBeGreaterThan(0);
        expect(p.sourceEnd).toBeLessThan(lesson.sourceDuration);
        expect(p.sourceEnd).toBeGreaterThan(p.sourceStart);
      }
    });
  });
});
