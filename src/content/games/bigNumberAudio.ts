import { bigNumberTiles } from './bigNumbers';
let recordings: Promise<AudioBuffer[]> | undefined;
function loadRecordings(): Promise<AudioBuffer[]> {
  if (!recordings) {
    recordings = (async () => {
      const context = new AudioContext();
      try {
        return await Promise.all(bigNumberTiles.map(async (_, i) => {
          const response = await fetch(`${import.meta.env.BASE_URL}audio/games/number-words/${i}.mp3?v=all-words-2`);
          if (!response.ok) throw new Error('Word recording unavailable');
          return context.decodeAudioData(await response.arrayBuffer());
        }));
      } finally { await context.close(); }
    })().catch(error => { recordings = undefined; throw error; });
  }
  return recordings;
}
// Assemble one recording so mobile browsers do not switch media between words.
export async function bigNumberAudio(words: string[]): Promise<string> {
  const buffers = await loadRecordings();
  const rate = buffers[0].sampleRate;
  const gap = Math.round(rate * .035);
  const chunks = words.map(word => {
    const buffer = buffers[bigNumberTiles.indexOf(word)];
    return buffer.getChannelData(0).slice(Math.round(rate * .07), buffer.length - Math.round(rate * .06));
  });
  const count = chunks.reduce((n, chunk) => n + chunk.length + gap, 0);
  const wav = new ArrayBuffer(44 + count * 2), view = new DataView(wav);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + count * 2, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, count * 2, true);
  let offset = 0;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) view.setInt16(44 + (offset + i) * 2, Math.round(Math.max(-1, Math.min(1, chunk[i])) * 32767), true);
    offset += chunk.length + gap;
  }
  return URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
}
