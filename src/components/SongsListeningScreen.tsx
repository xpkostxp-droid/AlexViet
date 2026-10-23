import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './listening.css';
import { songVocabulary, songExpressions, songLines } from '../content/songs/family';

function formatTime(time: number) { return `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`; }

export default function SongsListeningScreen({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<'words' | 'song'>('words');
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [showRussian, setShowRussian] = useState(true);
  const [time, setTime] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef(0);
  const pendingSeek = useRef<number>();
  function stopTracking() { cancelAnimationFrame(frameRef.current); }
  function track() {
    const audio = audioRef.current;
    if (!audio) return;
    setTime(audio.currentTime);
    if (!audio.paused && !audio.ended) frameRef.current = requestAnimationFrame(track);
  }
  useEffect(() => stopTracking, []);
  useEffect(() => { if (stage !== 'song') stopTracking(); }, [stage]);
  const current = songLines.findIndex(line => time >= line.start && time < line.end);
  useEffect(() => {
    if (stage === 'song' && current >= 0 && !audioRef.current?.paused) {
      document.getElementById('song-line-' + current)?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [current, stage]);
  function applySeek() {
    const audio = audioRef.current;
    if (!audio || pendingSeek.current === undefined) return;
    audio.currentTime = pendingSeek.current;
    pendingSeek.current = undefined;
  }
  function seek(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    pendingSeek.current = seconds;
    if (audio.readyState >= 1) applySeek();
    setTime(seconds);
    setAudioError(false);
    void audio.play().catch(() => setAudioError(true));
  }
  function retry() {
    audioRef.current?.load();
    seek(time);
  }
  return <div className="screen screen-listening">
    <BackButton onClick={() => stage === 'song' ? setStage('words') : onBack()} label={stage === 'song' ? 'К словам песни' : 'К разделам аудирования'} />
    <span className="badge">Песня 1 · Семья</span>
    <h1 className="screen-title">Cả nhà thương nhau</h1>
    <p className="hint-text">Вся семья любит друг друга</p>
    {stage === 'words' ? <>
      <h2 className="listening-heading">Слова и выражения перед песней</h2>
      <p className="hint-text">Сначала познакомьтесь со словами, затем слушайте и узнавайте их в мелодии.</p>
      <dl className="listening-vocabulary">{songVocabulary.map(([vi, ru]) => <div key={vi}><dt lang="vi">{vi}</dt><dd>{ru}</dd></div>)}</dl>
      <h2 className="listening-heading">Полезные выражения</h2>
      <dl className="listening-vocabulary">{songExpressions.map(([vi, ru]) => <div key={vi}><dt lang="vi">{vi}</dt><dd>{ru}</dd></div>)}</dl>
      <div className="listening-start"><button className="big-button" onClick={() => { setTime(0); setAudioError(false); setStage('song'); window.scrollTo(0, 0); }}>Перейти к песне →</button></div>
    </> : <>
      <p className="hint-text">Звучащая строка подсвечивается. Нажмите на строку, чтобы послушать её снова.</p>
      <div className="course-audio-player song-player">
        <audio ref={audioRef} controls preload="metadata" 
          aria-label="Песня Cả nhà thương nhau"
          onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
          onSeeked={event => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={applySeek}
          onPlay={() => { setAudioError(false); stopTracking(); track(); }}
          onPause={stopTracking} onEnded={() => { stopTracking(); setTime(audioRef.current?.currentTime ?? 0); }}
          onError={() => { stopTracking(); setAudioError(true); }} onCanPlay={() => setAudioError(false)}>
          <source src={`${import.meta.env.BASE_URL}audio/songs/ca-nha-thuong-nhau.m4a`} type="audio/mp4" />
          <source src={`${import.meta.env.BASE_URL}audio/songs/ca-nha-thuong-nhau.mp3`} type="audio/mpeg" />
        </audio>
        {audioError && <div role="alert"><p>Не удалось воспроизвести песню. Проверьте соединение и попробуйте ещё раз.</p><button className="listening-choice" onClick={retry}>Повторить загрузку</button></div>}
      </div>
      <div className="listening-controls" style={{ marginBottom: 16 }}>
        <button type="button" className="listening-choice" aria-pressed={showVietnamese} onClick={() => setShowVietnamese(v => !v)}>{showVietnamese ? '✓ ' : ''}Вьетнамский текст</button>
        <button type="button" className="listening-choice" aria-pressed={showRussian} onClick={() => setShowRussian(v => !v)}>{showRussian ? '✓ ' : ''}Русский перевод</button>
      </div>
      <div className="course-dialogue">{songLines.map((line, index) => <button key={index} id={'song-line-' + index} type="button"
        className={`course-dialogue-line${current === index ? ' is-current' : ''}`} aria-current={current === index ? 'true' : undefined} aria-label={`Строка ${index + 1}: слушать с ${formatTime(line.start)}`} onClick={() => seek(line.start)}>
        <span className="lesson-meta">Куплет {Math.floor(index / 4) + 1} · {formatTime(line.start)}</span>
        {showVietnamese && <span lang="vi" className="course-dialogue-vi">{line.vi}</span>}
        {showRussian && <span lang="ru" className="course-dialogue-ru">{line.ru}</span>}
        {!showVietnamese && !showRussian && <span>♪ Строка {index + 1} — нажмите, чтобы прослушать</span>}
      </button>)}</div>
    </>}
  </div>;
}
