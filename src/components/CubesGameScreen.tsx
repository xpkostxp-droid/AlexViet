import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { initialCubes, nextCubeNumber, refillCubes, recordCubeAnswer } from '../content/games/cubes';
import { numberWords } from '../content/games/numbers';
import type { NumberGameDirection } from './GameDirectionScreen';

type Phase = 'idle' | 'ready' | 'clearing' | 'falling' | 'complete';
function initialGame() {
  const board = initialCubes();
  return { board, target: nextCubeNumber(board, []), mastered: [] as number[], retryAfter: {} as Record<number, number>, score: 0, nextId: 6, phase: 'idle' as Phase, selectedId: -1 };
}
export function CubesGameScreen({ onBack, direction }: { onBack: () => void; direction: NumberGameDirection }) {
  const [game, setGame] = useState(initialGame);
  const [heard, setHeard] = useState(false);
  const [wrongId, setWrongId] = useState(-1);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const confirmationRef = useRef<HTMLAudioElement>(null);
  const confirmationDoneRef = useRef<Promise<void>>(Promise.resolve());
  const choiceLockedRef = useRef(false);
  const hadMistakeRef = useRef(false);

  async function listen() {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    audio.pause(); audio.currentTime = 0; setError('');
    try {
      await audio.play();
      if (request === requestRef.current) {
        setHeard(true);
        setGame(current => current.phase === 'idle' ? { ...current, phase: 'ready' } : current);
      }
    } catch { if (request === requestRef.current) setError('Не удалось включить звук. Нажми «Слушать ещё раз».'); }
  }
  useEffect(() => {
    if (game.phase === 'clearing') {
      let cancelled = false;
      const timer = window.setTimeout(async () => {
        await confirmationDoneRef.current;
        if (cancelled) return;
        setHeard(false); setWrongId(-1);
        setGame(current => {
          if (current.mastered.length === 10) return { ...current, phase: 'complete' };
          const board = refillCubes(current.board, current.selectedId, current.nextId, current.mastered, current.retryAfter, current.score);
          return { ...current, board, nextId: current.nextId + 1, target: nextCubeNumber(board, current.mastered, current.retryAfter, current.score), phase: 'falling' };
        });
      }, direction === 'vi-ru' ? 750 : 300);
      return () => { cancelled = true; window.clearTimeout(timer); };
    }
    if (game.phase === 'falling') {
      const timer = window.setTimeout(() => setGame(current => ({ ...current, phase: 'ready' })), 450);
      return () => window.clearTimeout(timer);
    }
    if (game.phase === 'ready' && !heard) { choiceLockedRef.current = false; hadMistakeRef.current = false; void listen(); }
  }, [game.phase]);
  useEffect(() => {
    if (wrongId < 0) return;
    const timer = window.setTimeout(() => setWrongId(-1), 500);
    return () => window.clearTimeout(timer);
  }, [wrongId]);
  useEffect(() => {
    const audio = audioRef.current;
    const confirmation = confirmationRef.current;
    return () => { requestRef.current++; audio?.pause(); confirmation?.pause(); };
  }, []);

  function choose(id: number) {
    if (!heard || game.phase !== 'ready' || choiceLockedRef.current) return;
    const cube = game.board.find(cube => cube.id === id)!;
    if (cube.value !== game.target) { hadMistakeRef.current = true; setWrongId(id); return; }
    choiceLockedRef.current = true;
    if (direction === 'ru-vi' && confirmationRef.current) {
      const confirmation = confirmationRef.current;
      audioRef.current?.pause();
      confirmation.currentTime = 0;
      confirmationDoneRef.current = new Promise<void>(resolve => {
        const finish = () => {
          window.clearTimeout(timeout);
          confirmation.removeEventListener('ended', finish);
          confirmation.removeEventListener('error', finish);
          resolve();
        };
        const timeout = window.setTimeout(() => { confirmation.pause(); finish(); }, 5000);
        confirmation.addEventListener('ended', finish, { once: true });
        confirmation.addEventListener('error', finish, { once: true });
        void confirmation.play().catch(() => {
          setError('Не удалось озвучить ответ по-вьетнамски.'); finish();
        });
      });
    } else confirmationDoneRef.current = Promise.resolve();
    const hadMistake = hadMistakeRef.current;
    setGame(current => current.phase !== 'ready' ? current : {
      ...current, score: current.score + 1, selectedId: id, phase: 'clearing',
      ...recordCubeAnswer(current.mastered, current.retryAfter, cube.value, hadMistake, current.score),
    });
  }
  function restart() {
    requestRef.current++; audioRef.current?.pause(); confirmationRef.current?.pause();
    choiceLockedRef.current = false; hadMistakeRef.current = false;
    setHeard(false); setWrongId(-1); setError(''); setGame(initialGame());
  }
  const busy = game.phase === 'clearing' || game.phase === 'falling';
  return <div className="screen screen-cubes-game">
    <BackButton onClick={onBack} label="К выбору направления" />
    <span className="badge">Урок 9 · Цифры 1–10</span>
    <h1 className="screen-title">Кубики на слух</h1>
    <p className="cube-game-direction">{direction === 'ru-vi' ? 'Русский → Вьетнамский' : 'Вьетнамский → Русский'}</p>
    <audio ref={audioRef} src={game.phase !== 'complete' ? `${import.meta.env.BASE_URL}audio/games/${direction === 'ru-vi' ? 'numbers-ru' : 'numbers'}/${game.target}.mp3` : undefined} preload="auto"
      onError={() => setError('Запись не загрузилась. Попробуй послушать ещё раз.')} />
    {direction === 'ru-vi' && <audio ref={confirmationRef} src={game.phase !== 'complete' ? `${import.meta.env.BASE_URL}audio/games/numbers/${game.target}.mp3` : undefined} preload="auto" />}
    {game.phase === 'complete' ? <div className="summary-box">
      <h2>Все 10 цифр закреплены!</h2><p>Баллы: {game.score}</p>
      <button className="big-button" onClick={restart}>Сыграть ещё раз</button>
    </div> : <>
      <div className="cube-game-score"><span>Баллы: {game.score}</span>{direction === 'ru-vi' && <span className="cube-current-number" aria-label="Текущая цифра">{game.phase !== 'idle' ? game.target : '—'}</span>}<span>Закреплено: {game.mastered.length} / 10</span></div>
      <p className="cube-game-instruction">{game.phase === 'idle' ? 'Начни игру и нажми кубик с услышанной цифрой.' : 'Слушай и находи нужный кубик'}</p>
      <div className="cube-well" aria-label="Стакан с шестью кубиками">
        {game.board.map(cube => <div key={cube.id} className="cube-position" style={{ left: `${cube.column * 50}%`, transform: `translateY(${cube.row * 104}px)` }}>
          <button className={`number-cube${direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? ' cube-word' : ''} cube-color-${cube.value % 4}${cube.id === game.selectedId && game.phase === 'clearing' ? ` cube-clearing${direction === 'vi-ru' ? ' cube-show-word' : ''}` : ''}${cube.id === wrongId ? ' cube-wrong' : ''}${cube.id === game.nextId - 1 && game.phase === 'falling' ? ' cube-entering' : ''}`}
            disabled={!heard || game.phase !== 'ready'} lang={direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? 'vi' : undefined} data-value={cube.value} aria-label={`Кубик ${direction === 'ru-vi' ? numberWords[cube.value - 1] : cube.value}`} onClick={() => choose(cube.id)}>{direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? numberWords[cube.value - 1] : cube.value}</button>
        </div>)}
      </div>
      <p className="cube-game-feedback" role="status">{game.phase === 'clearing' ? `✓ ${game.target} — ${numberWords[game.target - 1]} · +1 балл${hadMistakeRef.current ? ' · Повторим позже' : ''}` : wrongId >= 0 ? 'Попробуй другой кубик' : '\u00a0'}</p>
      <button className="big-button" disabled={busy} onClick={() => void listen()}>{game.phase === 'idle' ? 'Начать игру' : 'Слушать ещё раз'}</button>
      {error && <p className="pronunciation-error" role="alert">{error}</p>}
      <p className="hint-text">Без таймера. После ошибки цифра вернётся позже. Закрепляем только ответы с первой попытки.</p>
    </>}
  </div>;
}
