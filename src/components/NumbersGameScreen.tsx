import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { SpeakerOnIcon } from './icons';
import { firstNumberRound, numberOptions, numberWords, shuffled } from '../content/games/numbers';

export function NumbersGameScreen({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(firstNumberRound);
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [mastered, setMastered] = useState(0);
  const [firstScore, setFirstScore] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [heard, setHeard] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const autoplayRef = useRef(false);
  const number = round[index];
  const [options, setOptions] = useState(() => numberOptions(number));

  async function listen() {
    const audio = audioRef.current;
    if (!audio || !number) return;
    const request = ++requestRef.current;
    audio.pause(); audio.currentTime = 0;
    setError('');
    try {
      await audio.play();
      if (request === requestRef.current) { setHeard(true); setStarted(true); }
    } catch {
      if (request === requestRef.current) setError('Не удалось включить звук. Нажми «Слушать ещё раз».');
    }
  }

  function next() {
    requestRef.current++;
    audioRef.current?.pause();
    setAnswer(null); setHeard(false); setError('');
    autoplayRef.current = true;
    if (index + 1 < round.length) {
      setOptions(numberOptions(round[index + 1])); setIndex(i => i + 1);
    } else {
      if (roundNumber === 1) setFirstScore(mastered);
      if (missed.length) {
        const remaining = shuffled(missed);
        setRound(remaining); setIndex(0); setOptions(numberOptions(remaining[0]));
        setMissed([]); setRoundNumber(n => n + 1);
      } else { autoplayRef.current = false; setIndex(round.length); }
    }
  }

  useEffect(() => {
    if (autoplayRef.current && number) { autoplayRef.current = false; void listen(); }
  }, [round, index]);

  useEffect(() => {
    if (answer !== number || answer === null) return;
    const timer = window.setTimeout(next, 800);
    return () => window.clearTimeout(timer);
  }, [answer, number]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => { requestRef.current++; audio?.pause(); };
  }, []);

  function choose(value: number) {
    if (!heard || answer !== null) return;
    setAnswer(value);
    if (value === number) setMastered(n => n + 1);
    else setMissed(numbers => [...numbers, number]);
  }

  function restart() {
    const numbers = firstNumberRound();
    requestRef.current++; audioRef.current?.pause(); autoplayRef.current = false;
    setRound(numbers); setOptions(numberOptions(numbers[0])); setIndex(0);
    setMissed([]); setRoundNumber(1); setMastered(0); setFirstScore(null);
    setAnswer(null); setHeard(false); setStarted(false); setError('');
  }

  return <div className="screen screen-number-game">
    <BackButton onClick={onBack} label="К играм" />
    <span className="badge">Урок 9 · Игра</span>
    <h1 className="screen-title">Цифры 1–10</h1>
    <audio ref={audioRef} src={number ? `${import.meta.env.BASE_URL}audio/games/numbers/${number}.mp3` : undefined} preload="auto"
      onError={() => setError('Запись не загрузилась. Попробуй послушать ещё раз.')} />
    {number ? <>
      <div className="number-game-progress">
        <span>Закреплено: {mastered} / 10</span><span>Круг {roundNumber}</span>
        <progress max={10} value={mastered} aria-label="Закреплённые цифры" />
      </div>
      <div className="number-game-stage">
        <SpeakerOnIcon className="number-game-speaker" />
        <p className="number-game-word" lang="vi">{answer !== null ? `${number} — ${numberWords[number - 1]}` : 'Слушай внимательно'}</p>
        {!started && <p>Прозвучит число по-вьетнамски. Выбери его цифру.</p>}
        {roundNumber > 1 && <p>Повторяем ошибки · осталось {10 - mastered}</p>}
        <button className="big-button" onClick={() => void listen()}>{started ? 'Слушать ещё раз' : 'Начать игру'}</button>
      </div>
      {error && <p role="alert" className="pronunciation-error">{error}</p>}
      {started && <div className="number-game-options">
        {options.map(value => <button key={value} className={`secondary-button${answer !== null && value === number ? ' number-game-correct' : ''}${answer === value && value !== number ? ' number-game-wrong' : ''}`}
          disabled={!heard || answer !== null} onClick={() => choose(value)}>{value}</button>)}
      </div>}
      <p className="number-game-feedback" role="status">{answer === null ? '' : answer === number ? '✓ Верно! +1 балл' : `Правильный ответ: ${number}`}</p>
      {answer !== null && answer !== number && <button className="big-button" onClick={next}>Следующая цифра</button>}
    </> : <div className="summary-box">
      <h2>Все 10 цифр закреплены!</h2>
      <p>С первого раза: {firstScore ?? mastered} из 10</p>
      <p>Баллы: {mastered} · Пройдено кругов: {roundNumber}</p>
      <button className="big-button" onClick={restart}>Сыграть ещё раз</button>
    </div>}
  </div>;
}
