import { it, expect } from 'vitest';
import { statSync } from 'node:fs';
it('publishes playable song files for both sources used by the player', () => {
  for (const extension of ['m4a', 'mp3']) {
    expect(statSync(`public/audio/songs/ca-nha-thuong-nhau.${extension}`).size).toBeGreaterThan(100000);
  }
});
