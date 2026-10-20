import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { courseListeningLessons } from '../content/listening/course';
import './listening.css';

export default function CourseListeningScreen({ onBack }: { onBack: () => void }) {
  const [opened, setOpened] = useState(false);
  const [time, setTime] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lesson = courseListeningLessons[0];
  const current = lesson?.phrases.findIndex(line => time >= line.start && time < line.end) ?? -1;
  useEffect(() => {
    if (current >= 0 && audioRef.current && !audioRef.current.paused) {
      document.getElementById(`family-line-${current}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [current]);
  function seek(start: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = start;
    setTime(start);
    void audio.play().then(() => setError(false)).catch(() => setError(true));
  }
  return <div className="screen screen-listening">
    <BackButton onClick={() => opened ? setOpened(false) : onBack()} label={opened ? 'К нашим урокам' : 'К разделам аудирования'} />
    <h1 className="screen-title">{opened ? 'Урок 10 — Семья' : 'Аудирование по нашим урокам'}</h1>
    {!opened ? <div className="listening-lessons">
      <button className="lesson-item" onClick={() => setOpened(true)}>
        <span className="lesson-number">Урок 10</span><span className="lesson-title">Семья</span>
        <span className="lesson-meta">Диалог с подсветкой и переводом</span>
      </button>
    </div> : lesson && <>
      <p className="hint-text">Слушайте диалог и следите за подсветкой. Нажмите на реплику, чтобы прослушать её снова.</p>
      <div className="course-audio-player">
        <audio ref={audioRef} controls preload="metadata" src={`${import.meta.env.BASE_URL}${lesson.audio}`}
          onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
          onSeeked={event => setTime(event.currentTarget.currentTime)}
          onPlay={() => setError(false)} onError={() => setError(true)} />
        {error && <p role="alert">Не удалось воспроизвести запись. Проверьте соединение и повторите попытку.</p>}
      </div>
      <div className="course-dialogue">
        {lesson.phrases.map((line, i) => <button type="button" id={`family-line-${i}`} key={line.id}
          className={`course-dialogue-line${current === i ? ' is-current' : ''}`}
          aria-current={current === i ? 'true' : undefined} onClick={() => seek(line.start)}>
          <span lang="vi" className="course-dialogue-vi">{line.vi}</span>
          <span lang="ru" className="course-dialogue-ru">{line.ru}</span>
        </button>)}
      </div>
    </>}
  </div>;
}
