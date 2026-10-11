import { useEffect, useRef, useState } from 'react';
import { phoneticsTests, type PhoneticsTestId } from '../content/phonetics/tests';
import { BackButton } from './BackButton';

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
function makeRound(questions: readonly { syllable: string; start: number; end: number }[], useSourceOptions = false) {
  const vowels = ['u', 'i', 'ư', 'ơ', 'ô', 'ê', 'a', 'e', 'o'];
  return questions.map(item => ({
    ...item,
    options: shuffle([item.syllable, ...shuffle(
      (useSourceOptions ? [...new Set(questions.map(question => question.syllable))] : item.syllable.length === 1 ? vowels : vowels.map(vowel => item.syllable.replace(/[uiươôêaeo]+$/, vowel)))
        .filter(value => value !== item.syllable)).slice(0, 3)]),
  }));
}

export function PhoneticaTestScreen({ onBack, testId }: { onBack: () => void; testId: PhoneticsTestId }) {
  const test = phoneticsTests.find(test => test.id === testId)!;
  const questions = test.questions;
  const [round, setRound] = useState(() => makeRound(questions, testId >= 7));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<ReturnType<typeof makeRound>>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [firstPassScore, setFirstPassScore] = useState<number | null>(null);
  const [heard, setHeard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopRef = useRef(0);
  const requestRef = useRef(0);
  const autoplayRef = useRef(false);
  const item = round[index];

  useEffect(() => {
    if (item) return;
    if (roundNumber === 1) setFirstPassScore(score);
    if (missed.length > 0) {
      setRound(missed.map(question => ({ ...question, options: shuffle(question.options) })));
      setMissed([]);
      setIndex(0);
      setRoundNumber(current => current + 1);
      setAnswer(null);
      setHeard(false);
      setError('');
      autoplayRef.current = true;
    } else {
      autoplayRef.current = false;
    }
  }, [item, missed, roundNumber, score]);

  useEffect(() => {
    if (!item || answer !== item.syllable) return;
    const timer = window.setTimeout(() => {
      requestRef.current++;
      audioRef.current?.pause();
      autoplayRef.current = true;
      setIndex(current => current + 1);
      setAnswer(null);
      setHeard(false);
      setError('');
    }, 800);
    return () => window.clearTimeout(timer);
  }, [answer, item]);

  useEffect(() => {
    if (!autoplayRef.current || !item) return;
    autoplayRef.current = false;
    void listen();
  }, [index, item]);

  useEffect(() => {
    const audio = audioRef.current!;
    let frame = 0;
    function tick() {
      if (!audio.paused && audio.currentTime >= stopRef.current) audio.pause();
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => { requestRef.current++; cancelAnimationFrame(frame); audio.pause(); };
  }, []);

  async function listen() {
    if (!item) return;
    const audio = audioRef.current!;
    const request = ++requestRef.current;
    audio.pause();
    setError('');
    audio.currentTime = item.start;
    stopRef.current = item.end;
    try {
      await audio.play();
      if (request === requestRef.current) setHeard(true);
    } catch {
      if (request === requestRef.current) setError('Не удалось включить запись. Нажмите «Слушать» ещё раз.');
    }
  }

  function choose(value: string) {
    if (answer !== null || !heard) return;
    setAnswer(value);
    audioRef.current?.pause();
    if (value === item.syllable) setScore(current => current + 1);
    else setMissed(current => [...current, item]);
  }

  function next() {
    requestRef.current++;
    audioRef.current?.pause();
    autoplayRef.current = true;
    setIndex(current => current + 1);
    setAnswer(null);
    setHeard(false);
    setError('');
  }

  return <div className="screen">
    <BackButton onClick={onBack} />
    <h1 className="screen-title">Фонетика тест</h1>
    <span className="badge">Тест {testId} · {test.title}</span>
    <audio ref={audioRef} src={`${import.meta.env.BASE_URL}audio/phonetics-test-${test.track}.mp3`} preload="auto"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setError('Запись не загрузилась. Проверьте подключение.'); }} />
    {item ? <>
      <p className="counter">Слог {index + 1} из {round.length}</p>
      {roundNumber > 1 && <p className="counter">Повтор ошибок · круг {roundNumber}<br />Осталось закрепить: {questions.length - score}</p>}
      <p className="theory-note">Послушайте слог и выберите, что прозвучало. Запись можно включать сколько угодно раз.</p>
      <button className="big-button" onClick={() => void listen()}>{playing ? '↻ Ещё раз' : '▶ Слушать'}</button>
      {error && <p role="alert" className="pronunciation-error">{error}</p>}
      <div className="phonetics-test-options">
        {item.options.map(value => <button key={value} lang="vi" disabled={!heard || answer !== null}
          className={`secondary-button${answer !== null && value === item.syllable ? ' is-correct' : ''}${answer === value && value !== item.syllable ? ' is-wrong' : ''}`}
          onClick={() => choose(value)}>{value}</button>)}
      </div>
      <p className="phonetics-test-feedback" role="status">{answer === null ? (heard ? 'Какой слог вы услышали?' : 'Сначала нажмите «Слушать».') : answer === item.syllable ? '✓ Верно!' : `Правильный ответ: ${item.syllable}`}</p>
      {answer !== null && answer !== item.syllable && <button className="big-button" onClick={next}>Следующий слог</button>}
    </> : <>
      <div className="summary-box">
        <p><strong>Все {questions.length} звуков закреплены!</strong></p>
        <p>С первого раза: {firstPassScore ?? score} из {questions.length}</p>
        <p>Пройдено кругов: {roundNumber}. Осталось ошибок: 0.</p>
      </div>
      <button className="big-button" onClick={() => { autoplayRef.current = false; setRound(makeRound(questions, testId >= 7)); setIndex(0); setScore(0); setMissed([]); setRoundNumber(1); setFirstPassScore(null); setAnswer(null); setHeard(false); setError(''); }}>Попробовать ещё раз</button>
    </>}
  </div>;
}
