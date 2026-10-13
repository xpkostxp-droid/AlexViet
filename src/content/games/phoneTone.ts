// One recording avoids the delay between separate media loads on mobile Safari.
export function phoneToneUrl(phone: string): string {
  const rate = 22050, step = 0.095, tone = 0.075;
  const count = Math.ceil((phone.length * step + 1.9) * rate);
  const buffer = new ArrayBuffer(44 + count * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + count * 2, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, count * 2, true);
  const frequencies = [[941,1336],[697,1209],[697,1336],[697,1477],[770,1209],[770,1336],[770,1477],[852,1209],[852,1336],[852,1477]];
  for (let i = 0; i < count; i++) {
    const time = i / rate, index = Math.floor(time / step), t = time - index * step;
    if (index >= phone.length) {
      const ringTime = time - phone.length * step;
      const cycle = ringTime % .85;
      if (cycle < .55) {
        const envelope = Math.min(1, cycle / .015, (.55 - cycle) / .025);
        view.setInt16(44 + i * 2, Math.round(.11 * 32767 * envelope * (Math.sin(2 * Math.PI * 440 * ringTime) + Math.sin(2 * Math.PI * 480 * ringTime))), true);
      }
      continue;
    }
    if (t >= tone) continue;
    const [a,b] = frequencies[Number(phone[index])];
    const envelope = Math.min(1, t / .006, (tone - t) / .008);
    view.setInt16(44 + i * 2, Math.round(.12 * 32767 * envelope * (Math.sin(2 * Math.PI * a * t) + Math.sin(2 * Math.PI * b * t))), true);
  }
  return URL.createObjectURL(new Blob([buffer], {type: 'audio/wav'}));
}
