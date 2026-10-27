import { useEffect, useRef, useState } from 'react';
import { adjectiveBlock, advanceHouseLearning, adjectiveLearning, advanceHouse, houseBlitz, houseLearning, optionsFor, shuffled, type HouseGameItem } from '../content/games/house';
import { hasVietnameseVoice, onVoicesChanged, speakVietnamese, stopSpeaking } from '../domain/speech';
import { BackButton } from './BackButton';
import { HousePicture } from './HousePicture';

type Mode = 'house' | 'adjectives' | 'blitz';

function itemsFor(mode: Mode): readonly HouseGameItem[] {
  return mode === 'house' ? houseLearning : mode === 'adjectives' ? adjectiveLearning : houseBlitz;
}

function titleFor(mode: Mode | null, review: boolean) {
  if (mode === 'house') return 'Обучение · Дом';
  if (mode === 'adjectives') return 'Обучение · Прилагательные';
  if (mode === 'blitz') return review ? 'Повтор ошибок' : 'Блиц · Дом + прилагательные';
  return 'Дом и прилагательные';
}

export function HouseGameScreen({ onBack }: { onBack: () => void }) {
  const [nextWord, setNextWord] = useState(3);
  const [mode, setMode] = useState<Mode | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [wins, setWins] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<number[]>([]);
  const [review, setReview] = useState(false);
  const [firstCorrect, setFirstCorrect] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [correct, setCorrect] = useState(false);
  const [voice, setVoice] = useState(hasVietnameseVoice);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const locked = useRef(false);
  const introduced = useRef(2);

  useEffect(() => {
    const off = onVoicesChanged(() => setVoice(hasVietnameseVoice()));
    return () => { off(); clearTimeout(timer.current); stopSpeaking(); };
  }, []);

  const items = mode ? itemsFor(mode) : houseLearning;
  const index = queue[0];
  const current = items[index];

  const prepare = (next: number[], source: readonly HouseGameItem[], learning = false, blockLearning = mode !== 'blitz') => {
    setQueue(next);
    if (learning && next.length) introduced.current = Math.max(introduced.current, next[0] + 1);
    if (blockLearning && next.length) {
      const candidates = next.filter(i => i < introduced.current);
      // At the end, retain familiar distractors without requeueing learned words.
      for (let i = introduced.current - 1; candidates.length < Math.min(3, introduced.current) && i >= 0; i--) {
        if (!candidates.includes(i)) candidates.push(i);
      }
      setOptions(shuffled(candidates));
    } else setOptions(next.length ? optionsFor(learning ? source.slice(0, introduced.current) : source, next[0]) : []);
    setWrong([]);
    setCorrect(false);
    locked.current = false;
  };

  const start = (value: Mode) => {
    clearTimeout(timer.current);
    stopSpeaking();
    const source = itemsFor(value);
    setMode(value);
    setNextWord(Math.min(3, source.length));
    introduced.current = 2;
    setWins({});
    setErrors([]);
    setReview(false);
    setFirstCorrect(0);
    prepare(value === 'blitz' ? shuffled(source.map((_, i) => i)) : adjectiveBlock(0, source.length), source, value !== 'blitz', value !== 'blitz');
  };

  const exit = () => {
    clearTimeout(timer.current);
    stopSpeaking();
    locked.current = false;
    setMode(null);
  };

  const answer = (selected: number) => {
    if (!mode || locked.current || wrong.includes(selected)) return;
    if (selected !== index) {
      setWrong(w => [...w, selected]);
      setErrors(e => e.includes(index) ? e : [...e, index]);
      return;
    }
    locked.current = true;
    setCorrect(true);
    speakVietnamese(current[1]);
    if (mode === 'blitz' && !review && wrong.length === 0) setFirstCorrect(n => n + 1);
    const next = mode !== 'blitz'
      ? advanceHouseLearning(queue, wins, wrong.length > 0, nextWord, items.length)
      : { ...advanceHouse(queue, wins, wrong.length > 0, mode !== 'blitz'), nextWord };
    timer.current = setTimeout(() => {
      setWins(next.wins);
      setNextWord(next.nextWord);
      prepare(next.queue, items, mode !== 'blitz');
    }, 1800);
  };

  const required = 3;
  const mastered = Object.values(wins).filter(n => n >= required).length;
  const total = items.length;

  return <div className="screen family-screen">
    <BackButton onClick={mode ? exit : onBack} label={mode ? 'К выбору режима' : 'К играм'} />
    <span className="badge">Урок 11 · Дом и прилагательные</span>
    <h1 className="screen-title">{titleFor(mode, review)}</h1>

    {!mode ? <>
      <p>Два режима обучения и общий блиц · Картинки · Без таймера</p>
      <HousePicture id="blitz-private-beautiful" />
      <button className="lesson-item family-mode" onClick={() => start('house')}>
        <strong>🏠 Обучение · Дом</strong>
        <span>18 слов, по три за раз. После трёх чистых ответов слово заменяется следующим. Не больше трёх вариантов ответа.</span>
      </button>
      <button className="lesson-item family-mode" onClick={() => start('adjectives')}>
        <strong>🎨 Обучение · Прилагательные</strong>
        <span>19 слов и выражений, по три за раз. Трижды вспомни слово без ошибки — его сразу заменит следующее. Качество — в конце. Не больше трёх вариантов ответа.</span>
      </button>
      <button className="lesson-item family-mode" onClick={() => start('blitz')}>
        <strong>⚡ Блиц · Всё вместе</strong>
        <span>20 сочетаний только из изученных слов: высокий дом, мало комнат, длинный балкон, красивая кухня и т. д.</span>
      </button>
    </> : current ? <>
      <p className="family-counter">
        {mode !== 'blitz'
          ? `Закреплено: ${mastered} из ${total}`
          : review
            ? `Осталось в повторе: ${queue.length}`
            : `Карточка ${total - queue.length + 1} из ${total}`} · Без таймера
      </p>
      {mode !== 'blitz' && <p className="family-counter" data-testid="adjective-block">Сейчас учим: {queue.map(i => items[i][1]).join(' · ')}</p>}
      <div className="family-card house-game-card">
        <HousePicture id={current[0]} />
        <h2>{current[2]}</h2>
      </div>
      <div className="family-choices">
        {options.map(i => <button
          key={i}
          disabled={correct || wrong.includes(i)}
          className={'choice-button ' + (wrong.includes(i) ? 'family-wrong' : correct && i === index ? 'family-correct' : '')}
          onClick={() => answer(i)}
        >{items[i][1]}</button>)}
      </div>
      <p className="family-feedback" role="status">
        {correct ? `Верно! ${current[1]}` : wrong.length ? 'Попробуй другой вариант. Это задание добавлено в повтор.' : 'Выбери правильный вариант'}
      </p>
      {correct && <button className="secondary-button" disabled={!voice} onClick={() => speakVietnamese(current[1])}>🔊 Послушать ещё</button>}
    </> : <div className="family-result">
      <HousePicture id="blitz-private-beautiful" />
      <h2>{mode === 'blitz' ? review ? 'Повтор завершён!' : 'Блиц завершён!' : 'Раздел выучен!'}</h2>
      <p>{mode !== 'blitz'
        ? `Все ${total} слов и выражений угаданы трижды без ошибки.`
        : review
          ? 'Все выбранные сочетания пройдены.'
          : `С первой попытки: ${firstCorrect} из ${total}`}</p>
      {mode === 'blitz' && errors.length > 0 && <>
        <p>Для повторения: {errors.map(i => items[i][2].toLowerCase()).join(', ')}.</p>
        <button className="big-button" onClick={() => {
          const next = shuffled(errors);
          setErrors([]);
          setReview(true);
          prepare(next, items);
        }}>Повторить ошибки · {errors.length}</button>
      </>}
      <button className="big-button" onClick={() => start(mode)}>Сыграть заново</button>
      <button className="secondary-button" onClick={exit}>К выбору режима</button>
    </div>}
    {mode && !voice && <p className="family-note">Для озвучки нужен вьетнамский голос на устройстве. Играть можно без звука.</p>}
  </div>;
}

