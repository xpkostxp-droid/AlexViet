import { useEffect, useMemo, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { listeningLessons } from '../content/listening/lessons';
import type { ListeningLesson, ListeningPhrase } from '../content/listening/types';
import { listeningChoices } from '../domain/listening';
import { readJSON, writeJSON } from '../domain/storage';
import './listening.css';

const PROGRESS_KEY = 'alexviet-listening-completed-v1';
function completedLessons(): string[] {
  const saved = readJSON(PROGRESS_KEY);
  return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
}

interface Props { onBack: () => void; lessons?: ListeningLesson[]; title?: string; backLabel?: string; description?: string; }

export default function ListeningScreen({ onBack, lessons = listeningLessons, title = 'Аудирование', backLabel = 'На главную', description = 'Изучите слова, прослушайте фразу на вьетнамском и выберите её перевод.' }: Props) {
  const [lesson, setLesson] = useState<ListeningLesson>();
  const [completed, setCompleted] = useState(completedLessons);
  const [stage, setStage] = useState<'vocabulary' | 'game' | 'complete'>('vocabulary');
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [correct, setCorrect] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const boundary = useRef(0);
  const revision = useRef(0);
  const nextTimer = useRef<ReturnType<typeof setTimeout>>();
  const frame = useRef(0);
  const phrase = lesson?.phrases[index];
  const choices = useMemo(() => lesson && phrase ? listeningChoices(lesson, phrase) : [], [lesson, phrase]);

  function stop() {
    revision.current++;
    if (speechRef.current) { speechRef.current = null; window.speechSynthesis?.cancel(); }
    boundary.current = 0;
    audioRef.current?.pause();
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  }
  function dispose() {
    stop();
    clearTimeout(nextTimer.current);
    const audio = audioRef.current;
    if (audio) { audio.ontimeupdate = audio.onended = audio.onpause = audio.onerror = null; audio.removeAttribute('src'); audio.load(); }
    audioRef.current = null;
  }
  function getAudio() {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = 'none';
    audio.ontimeupdate = checkBoundary;
    audio.onended = finishAudio;
    audio.onpause = () => setPlaying(false);
    audio.onerror = () => { stop(); setError('Не удалось загрузить запись. Проверьте соединение и нажмите «Повторить фразу».'); };
    audioRef.current = audio;
    return audio;
  }
  function finishAudio() {
    stop();
    setHeard(true);
  }
  function checkBoundary() {
    const audio = audioRef.current;
    if (!audio || !boundary.current) return;
    if (audio.currentTime >= boundary.current - 0.025) finishAudio();
  }
  function tick() {
    checkBoundary();
    if (boundary.current) frame.current = requestAnimationFrame(tick);
  }
  function play(item: ListeningPhrase) {
    if (!lesson) return;
    stop();
    setError('');
    if (!lesson.audio) {
      const voice = window.speechSynthesis?.getVoices().find(v => v.lang.toLowerCase().startsWith('vi'));
      if (!voice) { setError('На устройстве нужен вьетнамский голос. Включите его в настройках озвучивания, затем нажмите «Повторить фразу».'); return; }
      const token = revision.current;
      const utterance = new SpeechSynthesisUtterance(item.vi);
      utterance.voice = voice; utterance.lang = voice.lang;
      utterance.onend = () => { if (token === revision.current) finishAudio(); };
      utterance.onerror = () => { if (token === revision.current) { stop(); setError('Не удалось озвучить фразу. Нажмите «Повторить фразу».'); } };
      speechRef.current = utterance;
      try { window.speechSynthesis.speak(utterance); setPlaying(true); } catch { stop(); setError('Не удалось включить озвучку. Нажмите «Повторить фразу».'); }
      return;
    }
    const audio = getAudio();
    const url = new URL(`${import.meta.env.BASE_URL}${lesson.audio}`, document.baseURI).href;
    if (audio.src !== url) audio.src = url;
    const token = revision.current;
    const begin = () => {
      if (token !== revision.current) return;
      audio.currentTime = item.start;
      boundary.current = item.end;
      // Called from the Start/answer gesture whenever metadata is already available.
      void audio.play().then(() => {
        if (token !== revision.current) return;
        setPlaying(true);
        frame.current = requestAnimationFrame(tick);
      }).catch(() => {
        if (token !== revision.current) return;
        stop();
        setError('Нажмите «Повторить фразу», чтобы включить звук.');
      });
    };
    // Safari can reject seeking until metadata exists. Start playback during the
    // gesture, then seek once loaded; every lesson starts with the first phrase.
    if (audio.readyState < 1) {
      audio.addEventListener('loadedmetadata', begin, { once: true });
      void audio.play().catch(() => {
        if (token === revision.current) setError('Нажмите «Повторить фразу», чтобы включить звук.');
      });
    } else begin();
  }
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) stop(); };
    const onPageHide = () => stop();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      revision.current++;
      if (speechRef.current) { speechRef.current = null; window.speechSynthesis?.cancel(); }
      clearTimeout(nextTimer.current);
      cancelAnimationFrame(frame.current);
      const audio = audioRef.current;
      if (audio) { audio.ontimeupdate = audio.onended = audio.onpause = audio.onerror = null; audio.pause(); audio.removeAttribute('src'); audio.load(); }
      audioRef.current = null;
    };
  }, []);

  function back() {
    dispose();
    setLesson(undefined);
    setStage('vocabulary');
  }
  function start() {
    if (!lesson) return;
    setIndex(0); setWrong([]); setCorrect(false); setHeard(false); setStage('game');
    play(lesson.phrases[0]);
    window.scrollTo(0, 0);
  }
  function answer(value: string) {
    if (!phrase || !lesson || correct || !heard) return;
    if (value !== phrase.ru) { setWrong(prev => [...prev, value]); return; }
    stop(); setCorrect(true);
    nextTimer.current = setTimeout(() => {
      const next = index + 1;
      if (next === lesson.phrases.length) {
        const ids = [...new Set([...completed, lesson.id])];
        writeJSON(PROGRESS_KEY, ids); setCompleted(ids); setStage('complete');
      } else {
        setIndex(next); setWrong([]); setCorrect(false); setHeard(false);
        if (!document.hidden) play(lesson.phrases[next]);
      }
    }, 650);
  }

  if (!lesson) return <div className="screen screen-listening">
    <BackButton onClick={onBack} label={backLabel} />
    <span className="badge">Слушаем и понимаем</span>
    <h1 className="screen-title">{title}</h1>
    <p className="hint-text">{description}</p>
    <div className="listening-lessons">{lessons.map(item => <button className="lesson-item" key={item.id} onClick={() => { setLesson(item); setStage('vocabulary'); window.scrollTo(0, 0); }}>
      <span className="lesson-number">Урок {item.number}{completed.includes(item.id) ? ' · ✓ Пройден' : ''}</span>
      <span className="lesson-title">{item.title}</span>
      <span className="lesson-meta">{item.phrases.length} фраз · {item.vocabulary.length} слов и выражений</span>
    </button>)}</div>
  </div>;

  return <div className="screen screen-listening">
    <BackButton onClick={back} label="К урокам аудирования" />
    <span className="badge">Аудирование · Урок {lesson.number}</span>
    <h1 className="screen-title">{lesson.title}</h1>
    {stage === 'vocabulary' && <>
      <h2 className="listening-heading">Слова перед прослушиванием</h2>
      <p className="hint-text">Прочитайте все слова и выражения из этого урока. Затем слушайте запись и выбирайте полный русский перевод.</p>
      <dl className="listening-vocabulary">{lesson.vocabulary.map(word => <div key={word.vi}><dt lang="vi">{word.vi}</dt><dd>{word.ru}</dd></div>)}</dl>
      <div className="listening-start"><button className="big-button" onClick={start}>▶ Воспроизвести и начать</button></div>
    </>}
    {stage === 'game' && phrase && <>
      <p className="counter">Фраза {index + 1} из {lesson.phrases.length}</p>
      <progress className="listening-progress" aria-label="Прогресс урока" max={lesson.phrases.length} value={index + (correct ? 1 : 0)} />
      <div className="listening-player">
        <span className={`listening-sound ${playing ? 'is-playing' : ''}`} aria-hidden="true">♫</span>
        <p>{playing ? 'Слушайте фразу…' : heard ? 'Выберите перевод' : 'Прослушайте фразу'}</p>
        <div className="listening-controls"><button className="big-button" onClick={() => play(phrase)} disabled={correct}>▶ Повторить фразу</button>
          {playing && <button className="choice-button" onClick={stop}>Ⅱ Пауза</button>}</div>
      </div>
      {error && <p role="alert" className="listening-error">{error}</p>}
      <div className="listening-feedback" aria-live="polite">{correct ? (index + 1 === lesson.phrases.length ? 'Верно! Урок завершён.' : 'Верно! Следующая фраза…') : wrong.length ? 'Пока неверно. Прослушайте ещё раз и попробуйте другой ответ.' : heard ? 'Как переводится услышанная фраза?' : 'Ответы станут доступны после прослушивания.'}</div>
      <div className="listening-choices">{choices.map(value => <button key={value} className={`listening-choice ${wrong.includes(value) ? 'is-wrong' : ''} ${correct && value === phrase.ru ? 'is-correct' : ''}`} disabled={!heard || correct || wrong.includes(value)} onClick={() => answer(value)}>{value}</button>)}</div>
    </>}
    {stage === 'complete' && <>
      <div className="summary-box"><h2>Урок пройден!</h2><p>Вы разобрали все {lesson.phrases.length} фраз. Теперь прочитайте весь текст на вьетнамском.</p></div>
      <h2 className="listening-heading">Текст прослушанного урока</h2>
      <ol className="listening-transcript" lang="vi">{lesson.phrases.map(item => <li key={item.id}>{item.vi}</li>)}</ol>
      <button className="big-button" onClick={start}>▶ Пройти ещё раз</button>
      <button className="choice-button" onClick={() => { stop(); setStage('vocabulary'); window.scrollTo(0, 0); }}>Вернуться к словам</button>
      <button className="choice-button" onClick={back}>Выбрать другой урок</button>
    </>}
  </div>;
}
