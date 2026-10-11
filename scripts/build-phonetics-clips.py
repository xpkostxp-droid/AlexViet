"""Build self-contained clips; avoid browser seeking within long MP3 recordings.
Requires ffmpeg. Boundaries are the middle of each annotated inter-syllable pause.
"""
import array, concurrent.futures, io, json, math, re, subprocess, wave
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
FFMPEG = 'ffmpeg'
report = []
def build_track(test):
    text = (ROOT / f'src/content/phonetics/test{test}.ts').read_text()
    items = [json.loads(m.group(1)) for m in re.finditer(r'  (\{.+\}),', text)]
    assert len(items) == 50
    decoded = subprocess.run([FFMPEG, '-v', 'error', '-i', str(ROOT / f'public/audio/phonetics-test-{test+43}.mp3'), '-ar', '22050', '-ac', '1', '-f', 'wav', '-'], check=True, capture_output=True).stdout
    with wave.open(io.BytesIO(decoded)) as source:
        rate = source.getframerate(); pcm = source.readframes(source.getnframes())
    duration = len(pcm) / (2 * rate)
    dest = ROOT / f'public/audio/phonetics-clips/{test}'
    dest.mkdir(parents=True, exist_ok=True)
    decoded_values = array.array('h', pcm)
    boundaries = [0]
    for previous, following in zip(items, items[1:]):
        middle = (previous['end'] + following['start']) / 2
        # For tightly spaced sounds, split at the quietest 10 ms near the pause.
        if following['start'] - previous['end'] < .15:
            candidates = range(int((middle-.12)*rate), int((middle+.08)*rate), int(.002*rate))
            half = int(.005*rate)
            middle = min(candidates, key=lambda center: sum(v*v for v in decoded_values[center-half:center+half])) / rate
        boundaries.append(middle)
    boundaries.append(duration)
    for index, item in enumerate(items):
        assert 0 <= item['start'] < item['end'] <= duration
        assert index == 0 or item['start'] > items[index-1]['start'], (test, index)
        start = boundaries[index]
        end = boundaries[index+1]
        assert start <= item['start'] + .06 + .005, (test, index, 'Missing onset')
        assert end >= item['end'] - .1 - .005, (test, index, 'Missing ending')
        samples = pcm[int(start*rate)*2:int(end*rate)*2]
        values = array.array('h', samples)
        peak = max(abs(v) for v in values)
        assert peak > 500, (test,index,'Silent clip')
        # Retain the complete pause around the sound, plus a small playback lead-in.
        lead = bytes(int(.12*rate)*2); tail = bytes(int(.12*rate)*2)
        wav = io.BytesIO()
        with wave.open(wav,'wb') as output:
            output.setnchannels(1);output.setsampwidth(2);output.setframerate(rate);output.writeframes(lead+samples+tail)
        subprocess.run([FFMPEG,'-v','error','-y','-i','pipe:0','-codec:a','libmp3lame','-b:a','64k',str(dest/f'{index+1}.mp3')],input=wav.getvalue(),check=True)
        edge = int(.04*rate)
        rms = lambda seq: math.sqrt(sum(v*v for v in seq)/len(seq)) / 32768
        report.append({'test':test,'question':index+1,'syllable':item['syllable'],'start':round(start,3),'end':round(end,3),'peak':peak,'startRms':rms(values[:edge]),'endRms':rms(values[-edge:])})
    print(f'Test {test}: 50 complete clips', flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    list(pool.map(build_track,range(1,34)))
Path('/private/tmp/phonetics-clip-audit.json').write_text(json.dumps(sorted(report,key=lambda x:(x['test'],x['question'])),ensure_ascii=False,indent=2))
print(f'Checked {len(report)} non-silent clips. Edges above -40 dB: {sum(max(x["startRms"],x["endRms"])>.01 for x in report)}')
