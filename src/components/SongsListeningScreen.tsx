import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './listening.css';

const vocabulary = [
  ['ba', 'папа'], ['mẹ', 'мама'], ['con', 'ребёнок; сын или дочь'],
  ['thương', 'любить, нежно заботиться'], ['vì', 'потому что'],
  ['giống', 'похож на'], ['cả', 'весь, все'], ['nhà', 'дом; семья'],
  ['ta', 'мы, наш'], ['cùng', 'вместе'], ['yêu', 'любить'],
  ['nhau', 'друг друга'], ['xa', 'далеко; в разлуке'],
  ['là', 'быть; здесь связывает части фразы'], ['nhớ', 'скучать; помнить'],
  ['gần', 'близко; рядом'], ['cười', 'смеяться, улыбаться'],
  ['ba thương con', 'папа любит ребёнка'],
  ['con giống mẹ', 'ребёнок похож на маму'],
  ['mẹ thương con', 'мама любит ребёнка'],
  ['con giống ba', 'ребёнок похож на папу'],
  ['cả nhà ta', 'вся наша семья'],
  ['cùng thương yêu nhau', 'все любят друг друга'],
  ['xa là nhớ', 'в разлуке скучаем'],
  ['gần nhau là cười', 'когда вместе — улыбаемся'],
] as const;

const verses = [
  { vi: 'Ba thương con vì con giống mẹ', ru: 'Папа любит ребёнка, потому что он похож на маму' },
  { vi: 'Mẹ thương con vì con giống ba', ru: 'Мама любит ребёнка, потому что он похож на папу' },
  { vi: 'Cả nhà ta cùng thương yêu nhau', ru: 'Вся наша семья любит друг друга' },
  { vi: 'Xa là nhớ, gần nhau là cười', ru: 'В разлуке скучаем, а вместе улыбаемся' },
] as const;

// Approximate positions for this 2:14 recording; refine against the uploaded master audio.
const starts = [13, 19, 25, 31, 39, 45, 51, 57, 74, 80, 86, 92, 100, 106, 112, 118] as const;
const lines = starts.map((start, index) => ({ ...verses[index % 4], start, end: starts[index + 1] ?? 124 }));

export default function SongsListeningScreen({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<'words' | 'song'>('words');
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [showRussian, setShowRussian] = useState(true);
  const [time, setTime] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = lines.findIndex(line => time >= line.start && time < line.end);
  useEffect(() => {
    if (stage === 'song' && current >= 0 && !audioRef.current?.paused) {
      document.getElementById('song-line-' + current)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [current, stage]);
  function seek(seconds: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setTime(seconds);
    void audioRef.current.play().catch(() => setAudioError(true));
  }
  return <div className="screen screen-listening">
    <BackButton onClick={() => stage === 'song' ? setStage('words') : onBack()} label={stage === 'song' ? 'К словам песни' : 'К разделам аудирования'} />
    <span className="badge">Песня 1 · Семья</span>
    <h1 className="screen-title">Cả nhà thương nhau</h1>
    <p className="hint-text">Вся семья любит друг друга</p>
    {stage === 'words' ? <>
      <h2 className="listening-heading">Слова и выражения перед песней</h2>
      <p className="hint-text">Сначала познакомьтесь со словами, затем слушайте и узнавайте их в мелодии.</p>
      <dl className="listening-vocabulary">{vocabulary.map(([vi, ru]) => <div key={vi}><dt lang="vi">{vi}</dt><dd>{ru}</dd></div>)}</dl>
      <div className="listening-start"><button className="big-button" onClick={() => { setStage('song'); window.scrollTo(0, 0); }}>Перейти к песне →</button></div>
    </> : <>
      <p className="hint-text">Следите за подсветкой строки. Нажмите на строку, чтобы перейти к ней. Таймкоды пока приблизительные.</p>
      <div className="course-audio-player">
        <audio ref={audioRef} controls preload="metadata" src={`${import.meta.env.BASE_URL}audio/songs/ca-nha-thuong-nhau.m4a`}
          onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
          onError={() => setAudioError(true)} onCanPlay={() => setAudioError(false)} />
        {audioError && <p role="alert">Аудиофайл пока не опубликован. Текст и перевод доступны ниже, а запись можно послушать по ссылке.</p>}
        <a href="https://www.youtube.com/results?search_query=Ca+nha+thuong+nhau+karaoke" target="_blank" rel="noopener noreferrer">Слушать песню на YouTube ↗</a>
      </div>
      <div className="listening-controls" style={{ marginBottom: 16 }}>
        <button type="button" className="listening-choice" aria-pressed={showVietnamese} onClick={() => setShowVietnamese(v => !v)}>{showVietnamese ? '✓ ' : ''}Вьетнамский текст</button>
        <button type="button" className="listening-choice" aria-pressed={showRussian} onClick={() => setShowRussian(v => !v)}>{showRussian ? '✓ ' : ''}Русский перевод</button>
      </div>
      <div className="course-dialogue">{lines.map((line, index) => <button key={index} id={'song-line-' + index} type="button"
        className={`course-dialogue-line${current === index ? ' is-current' : ''}`} onClick={() => seek(line.start)}>
        <span className="lesson-meta">Куплет {Math.floor(index / 4) + 1} · {Math.floor(line.start / 60)}:{String(line.start % 60).padStart(2, '0')}</span>
        {showVietnamese && <span lang="vi" className="course-dialogue-vi">{line.vi}</span>}
        {showRussian && <span lang="ru" className="course-dialogue-ru">{line.ru}</span>}
        {!showVietnamese && !showRussian && <span>♪ Строка {index + 1} — нажмите, чтобы прослушать</span>}
      </button>)}</div>
    </>}
  </div>;
}
