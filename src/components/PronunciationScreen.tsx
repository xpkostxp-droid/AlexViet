import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { activeSyllable, pronunciationRows, vowels } from '../content/phonetics/lesson1';

type Segment = { start: number; end: number };

export function PronunciationScreen({ onBack }: { onBack: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const segmentRef = useRef<Segment | null>(null);
  const repeatRef = useRef(false);
  const requestRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [time, setTime] = useState(0);
  const [error, setError] = useState('');
  const active = activeSyllable(time);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const fullSegment = { start: Math.max(0, pronunciationRows[0].starts[0] - 0.025), end: pronunciationRows[pronunciationRows.length - 1].end };

  useEffect(() => {
    if (playing && active) rowRefs.current[active.row]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active?.row, playing]);

  useEffect(() => {
    const audio = audioRef.current!;
    let frame = 0;
    const update = () => {
      const segment = segmentRef.current;
      if (!audio.paused && segment && audio.currentTime >= segment.end) {
        if (repeatRef.current) audio.currentTime = segment.start;
        else audio.pause();
      }
      setTime(audio.currentTime);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      requestRef.current++;
      audio.pause();
    };
  }, []);

  async function playSegment(segment: Segment) {
    const audio = audioRef.current!;
    const request = ++requestRef.current;
    audio.pause();
    segmentRef.current = segment;
    setError('');
    audio.currentTime = segment.start;
    setTime(segment.start);
    try {
      await audio.play();
    } catch {
      if (request === requestRef.current) setError('Не удалось включить запись. Попробуйте ещё раз.');
    }
  }

  function togglePlayback() {
    const audio = audioRef.current!;
    if (!audio.paused) {
      requestRef.current++;
      audio.pause();
      return;
    }
    const segment = segmentRef.current;
    if (segment && audio.currentTime < segment.end && audio.currentTime >= segment.start) {
      setError('');
      void audio.play().catch(() => setError('Не удалось включить запись. Попробуйте ещё раз.'));
    } else {
      void playSegment(fullSegment);
    }
  }

  return (
    <div className="screen screen-pronunciation">
      <BackButton onClick={onBack} />
      <span className="badge">Произношение · Урок 1</span>
      <h1 className="screen-title">Начальные согласные.<br />Слогообразующие гласные</h1>
      <p className="theory-note">Сводная таблица возможных инициалей и открытых слогов вьетнамского языка. Инициаль — начальная согласная слога.</p>
      <p className="theory-note">Слушайте и повторяйте. Подсветка показывает текущий слог и остаётся на паузе, чтобы вы успели его произнести. Нажмите на слог, чтобы послушать отдельно.</p>
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}audio/phonetics-07.mp3`} preload="auto"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onError={() => { setPlaying(false); setError('Запись не загрузилась. Проверьте подключение и откройте урок ещё раз.'); }} />
      <div className="pronunciation-controls">
        <button className="big-button" onClick={togglePlayback}>{playing ? 'Ⅱ Пауза' : '▶ Слушать'}</button>
        <button className="secondary-button" onClick={() => void playSegment(fullSegment)}>Сначала</button>
        <label className="pronunciation-repeat"><input type="checkbox" checked={repeat} onChange={(event) => { setRepeat(event.target.checked); repeatRef.current = event.target.checked; }} />Повторять по кругу</label>
      </div>
      {error && <p role="alert" className="pronunciation-error">{error}</p>}
      <div className="pronunciation-rows">
        {pronunciationRows.map((row, rowIndex) => (
          <section className="pronunciation-row" key={row.consonant} ref={(element) => { rowRefs.current[rowIndex] = element; }}>
            <div className="pronunciation-row-heading">
              <h2>Согласная <span lang="vi">{row.consonant}</span></h2>
              <button className="secondary-button" aria-label={`Слушать строку ${row.consonant}`} onClick={() => void playSegment({ start: Math.max(0, row.starts[0] - 0.025), end: row.end })}>▶ Строка</button>
            </div>
            <div className="pronunciation-syllables">
              {vowels.map((vowel, column) => {
                const selected = active?.row === rowIndex && active.column === column;
                return <button key={vowel} lang="vi" className={`pronunciation-syllable${row.syllables[column].length >= 4 ? ' pronunciation-syllable-long' : ''}${selected ? ' is-current' : ''}`} aria-current={selected ? 'true' : undefined}
                  aria-label={`Послушать ${row.syllables[column].replace(/[()]/g, '')}`}
                  onClick={() => void playSegment({ start: Math.max(0, row.starts[column] - 0.025), end: row.ends[column] + 0.02 })}>
                  <span className="pronunciation-vowel">{vowel}</span>
                  <span>{row.syllables[column]}</span>
                </button>;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
