import { useEffect, useMemo, useRef, useState } from 'react';
import { BanknoteFaces } from './BanknoteFaces';
import { BackButton } from './BackButton';
import { initialCubes, nextCubeNumber, refillCubes, recordCubeAnswer, NUMBER_REPETITIONS } from '../content/games/cubes';
import { numberGameRanges, vietnameseNumber, type NumberGameRange } from '../content/games/ranges';
import { banknoteWord } from '../content/games/banknotes';
import { shuffled } from '../content/games/numbers';
import { hotelNumbers } from '../content/games/hotel';
import type { NumberGameDirection } from './GameDirectionScreen';

type Phase = 'idle' | 'ready' | 'clearing' | 'falling' | 'complete';
function initialGame(values: readonly number[], hotel = false) {
  values = hotel ? hotelNumbers() : values;
  const board = initialCubes(values);
  return { values, board, target: nextCubeNumber(board, []), mastered: [] as number[], retryAfter: {} as Record<number, number>, score: 0, nextId: 6, phase: 'idle' as Phase, selectedId: -1 };
}
export function CubesGameScreen({ onBack, direction, range }: { onBack: () => void; direction: NumberGameDirection; range: NumberGameRange }) {
  const config = numberGameRanges[range];
  const hotel = range === '100-999';
  const money = range === 'banknotes';
  const word = money ? banknoteWord : vietnameseNumber;
  const repetitions = money ? 3 : range === '1-10' ? NUMBER_REPETITIONS : 1;
  const [game, setGame] = useState(() => initialGame(config.values, hotel));
  const goal = game.values.length * repetitions;
  const [heard, setHeard] = useState(false);
  const [wrongId, setWrongId] = useState(-1);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const effectRef = useRef<HTMLAudioElement>(null);
  const dropRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);

  function playEffect(audio: HTMLAudioElement | null) {
    if (!audio) return;
    audio.volume = 0.28;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }
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
      const plaqueTimer = hotel ? window.setTimeout(() => playEffect(effectRef.current), direction === 'vi-ru' ? 975 : 0) : undefined;
      const timer = window.setTimeout(async () => {
        await confirmationDoneRef.current;
        if (cancelled) return;
        setHeard(false); setWrongId(-1);
        setGame(current => {
          if (current.mastered.length === goal) return { ...current, phase: 'complete' };
          const board = refillCubes(current.board, current.selectedId, current.nextId, current.mastered, current.retryAfter, current.score, current.values, repetitions, !hotel && !money);
          return { ...current, board, nextId: current.nextId + 1, target: nextCubeNumber(board, current.mastered, current.retryAfter, current.score, repetitions), phase: 'falling' };
        });
      }, money ? 1500 : direction === 'vi-ru' ? (hotel ? 1375 : 750) : 300);
      return () => { cancelled = true; window.clearTimeout(timer); window.clearTimeout(plaqueTimer); };
    }
    if (game.phase === 'falling') {
      if (!hotel) playEffect(dropRef.current);
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
    const effect = effectRef.current;
    const drop = dropRef.current;
    return () => { requestRef.current++; audio?.pause(); confirmation?.pause(); effect?.pause(); drop?.pause(); };
  }, []);

  function choose(id: number) {
    if (!heard || game.phase !== 'ready' || choiceLockedRef.current) return;
    const cube = game.board.find(cube => cube.id === id)!;
    if (cube.value !== game.target) { hadMistakeRef.current = true; setWrongId(id); return; }
    choiceLockedRef.current = true;
    if (!hotel) playEffect(effectRef.current);
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
        const timeout = window.setTimeout(() => { confirmation.pause(); finish(); }, 12000);
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
      ...recordCubeAnswer(current.mastered, current.retryAfter, cube.value, hadMistake, current.score, repetitions),
    });
  }
  function restart() {
    requestRef.current++; audioRef.current?.pause(); confirmationRef.current?.pause(); effectRef.current?.pause(); dropRef.current?.pause();
    choiceLockedRef.current = false; hadMistakeRef.current = false;
    setHeard(false); setWrongId(-1); setError(''); setGame(initialGame(config.values, hotel));
  }
  const visibleCubes = useMemo(() => money && direction === 'ru-vi' ? shuffled([game.board.find(cube => cube.value === game.target)!, ...shuffled(game.board.filter(cube => cube.value !== game.target)).slice(0, 3)]) : game.board, [money, direction, game.board, game.target]);
  const busy = game.phase === 'clearing' || game.phase === 'falling';
  return <div className={`screen screen-cubes-game${hotel ? ' screen-hotel-game' : ''}${money ? ' screen-banknotes-game' : ''}`}>
    <BackButton onClick={onBack} label="К выбору направления" />
    <audio ref={effectRef} src={`${import.meta.env.BASE_URL}audio/games/effects/${money ? 'rustle' : hotel ? 'plaque' : 'swoosh'}.wav?v=paper-4`} preload="auto" />
    <audio ref={dropRef} src={`${import.meta.env.BASE_URL}audio/games/effects/${money ? 'banknote-arrive' : 'drop'}.wav`} preload="auto" />
    <span className="badge">Урок 9 · {config.title}</span>
    <h1 className="screen-title">{money ? 'Купюры' : hotel ? 'Номера комнат' : 'Кубики на слух'}</h1>
    <p className="cube-game-direction">{direction === 'ru-vi' ? 'Русский → Вьетнамский' : 'Вьетнамский → Русский'}</p>
    <audio ref={audioRef} src={game.phase !== 'complete' ? `${import.meta.env.BASE_URL}audio/games/${money ? (direction === 'ru-vi' ? 'banknotes-ru' : 'banknotes') : direction === 'ru-vi' ? 'numbers-ru' : 'numbers'}/${game.target}.mp3${direction === 'ru-vi' ? '?v=ru-soft-2' : '?v=vi-soft-2'}` : undefined} preload="auto"
      onError={() => setError('Запись не загрузилась. Попробуй послушать ещё раз.')} />
    {direction === 'ru-vi' && <audio ref={confirmationRef} src={game.phase !== 'complete' ? `${import.meta.env.BASE_URL}audio/games/${money ? 'banknotes' : 'numbers'}/${game.target}.mp3?v=vi-soft-2` : undefined} preload="auto" />}
    {game.phase === 'complete' ? <div className="summary-box">
      <h2>Все {game.values.length} чисел закреплены{repetitions === 3 ? ' трижды' : repetitions === 2 ? ' дважды' : ''}!</h2><p>Баллы: {game.score}</p>
      <button className="big-button" onClick={restart}>Сыграть ещё раз</button>
    </div> : <>
      <div className={`cube-game-score${direction === 'ru-vi' && !money ? ' cube-game-score-with-number' : ''}`}><span>Баллы: {game.score}</span>{direction === 'ru-vi' && !money && <span className="cube-current-number" aria-label="Текущая цифра">{game.phase !== 'idle' ? game.target : '—'}</span>}<span>Закреплено: <span className="cube-score-count">{game.mastered.length} / {goal}</span></span></div>
      <p className="cube-game-instruction">{money ? (direction === 'vi-ru' ? 'Послушай сумму и выбери купюру' : 'Выбери название этой купюры') : game.phase === 'idle' ? (hotel ? 'Начни игру и найди услышанный номер комнаты.' : 'Начни игру и нажми кубик с услышанной цифрой.') : hotel ? 'Слушай и выбирай номер комнаты' : 'Слушай и находи нужный кубик'}</p>
      {money && direction === 'ru-vi' && <div key={game.target} className={`banknote-featured${game.phase === 'clearing' ? ' banknote-featured-leaving' : ''}`}><BanknoteFaces value={game.target} flipped={game.phase === 'clearing'} /></div>}
      <div className={money ? 'banknote-grid' : hotel ? 'hotel-plaques' : 'cube-well'} aria-label={hotel ? 'Шесть табличек с номерами комнат' : 'Стакан с шестью кубиками'}>
        {visibleCubes.map(cube => <div key={cube.id} className={money ? 'banknote-slot' : hotel ? 'hotel-plaque-slot' : 'cube-position'} style={money ? undefined : hotel ? { gridColumn: cube.column + 1, gridRow: cube.row + 1 } : { left: `${cube.column * 50}%`, transform: `translateY(${cube.row * 104}px)` }}>
          <button className={`number-cube${money ? ` banknote-choice${direction === 'vi-ru' ? ' banknote-photo' : ''}` : ''}${hotel ? ' hotel-plaque' : ''}${range !== '1-10' ? ' cube-long-number' : ''}${direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? ' cube-word' : ''} cube-color-${cube.value % 4}${cube.id === game.selectedId && game.phase === 'clearing' ? ` cube-clearing${direction === 'vi-ru' ? ' cube-show-word' : ''}` : ''}${cube.id === wrongId ? ' cube-wrong' : ''}${cube.id === game.nextId - 1 && game.phase === 'falling' ? ' cube-entering' : ''}`}
            disabled={!heard || game.phase !== 'ready'} lang={direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? 'vi' : undefined} data-value={cube.value} aria-label={`${money ? 'Купюра' : hotel ? 'Комната' : 'Кубик'} ${direction === 'ru-vi' ? word(cube.value) : cube.value}`} onClick={() => choose(cube.id)}>{money && direction === 'vi-ru' ? <BanknoteFaces value={cube.value} flipped={cube.id === game.selectedId && game.phase === 'clearing'} /> : direction === 'ru-vi' || (cube.id === game.selectedId && game.phase === 'clearing') ? word(cube.value) : cube.value}</button>
        </div>)}
      </div>
      <p className="cube-game-feedback" role="status">{game.phase === 'clearing' ? `✓ ${game.target} — ${word(game.target)} · +1 балл${hadMistakeRef.current ? ' · Повторим позже' : ''}` : wrongId >= 0 ? (hotel ? 'Попробуй другую табличку' : 'Попробуй другой кубик') : '\u00a0'}</p>
      <button className="big-button" disabled={busy} onClick={() => void listen()}>{game.phase === 'idle' ? 'Начать игру' : 'Слушать ещё раз'}</button>
      {error && <p className="pronunciation-error" role="alert">{error}</p>}
      <p className="hint-text">{!hotel && 'Без таймера. После ошибки цифра вернётся позже. '}{repetitions === 3 ? 'Каждый номинал закрепляем трижды — с первой попытки.' : repetitions === 1 ? 'Каждое число закрепляем один раз — с первой попытки.' : 'Каждое число закрепляем дважды — только с первой попытки.'}</p>
      {money && <a className="banknote-source" href="https://www.banknotes.com/vn.htm" target="_blank" rel="noreferrer">Фотографии купюр: Banknotes.com</a>}
    </>}
  </div>;
}
