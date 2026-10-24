import { useEffect, useRef, useState } from 'react';
import { advanceFamily, shuffled } from '../content/games/family';
import { restaurantWords as familyWords, restaurantOptions, restaurantIndices, restaurantCategories, restaurantSpeech, type RestaurantCategory } from '../content/games/restaurant';
import { hasVietnameseVoice, onVoicesChanged, speakVietnamese, stopSpeaking } from '../domain/speech';
import { BackButton } from './BackButton';
import { RestaurantPicture as FamilyPicture } from './RestaurantPicture';
type Mode = 'learn' | 'blitz';
export function RestaurantGameScreen({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<RestaurantCategory>('all');
  const pool = restaurantIndices(category);
  const total = pool.length;
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
  useEffect(() => { const off = onVoicesChanged(() => setVoice(hasVietnameseVoice())); return () => { off(); clearTimeout(timer.current); stopSpeaking(); }; }, []);
  const index = queue[0];
  const current = familyWords[index];
  const prepare = (next: number[], choicesPool = pool) => { setQueue(next); setOptions(next.length ? restaurantOptions(next[0], choicesPool) : []); setWrong([]); setCorrect(false); locked.current = false; };
  const start = (value: Mode, selectedCategory: RestaurantCategory = category) => { const selectedPool = restaurantIndices(selectedCategory); setCategory(selectedCategory); clearTimeout(timer.current); stopSpeaking(); setMode(value); setWins({}); setErrors([]); setReview(false); setFirstCorrect(0); prepare(shuffled(selectedPool), selectedPool); };
  const exit = () => { clearTimeout(timer.current); stopSpeaking(); locked.current = false; setMode(null); };
  const answer = (selected: number) => {
    if (locked.current || wrong.includes(selected)) return;
    if (selected !== index) { setWrong(w => [...w, selected]); setErrors(e => e.includes(index) ? e : [...e, index]); return; }
    locked.current = true; setCorrect(true); speakVietnamese(restaurantSpeech(index));
    if (mode === 'blitz' && !review && wrong.length === 0) setFirstCorrect(n => n + 1);
    const next = advanceFamily(queue, wins, wrong.length > 0, mode === 'learn');
    timer.current = setTimeout(() => { setWins(next.wins); prepare(next.queue); }, 1800);
  };
  const mastered = Object.values(wins).filter(n => n >= 2).length;
  return <div className="screen family-screen">
    <BackButton onClick={mode ? exit : onBack} label={mode ? 'К выбору режима' : 'К играм'} />
    <span className="badge">Ресторан</span><h1 className="screen-title">{mode === 'learn' ? 'Ресторан · Обучение' : mode === 'blitz' ? review ? 'Повтор ошибок' : 'Блиц · Ресторан' : 'Ресторан'}</h1>
    {!mode ? <>
      <p>{total} слов и выражений · Картинки с русскими подписями · Без таймера</p>
      <FamilyPicture id="restaurant-17" />
      <p>Выбери раздел для обучения. Каждое слово нужно дважды угадать без ошибки.</p>
      {restaurantCategories.map(([value,label]) => <button key={value} className="lesson-item family-mode" onClick={() => start('learn', value)}><strong>🌱 {label}</strong><span>{restaurantIndices(value).length} заданий · Обучение</span></button>)}
      <button className="lesson-item family-mode" onClick={() => start('blitz', 'all')}><strong>⚡ Блиц · Всё вперемешку</strong><span>Все 60 заданий один раз. Ошибки повторим отдельно.</span></button>
    </> : current ? <>
      <p className="family-counter">{mode === 'learn' ? `Закреплено: ${mastered} из ${total}` : review ? `Осталось в повторе: ${queue.length}` : `Карточка ${total + 1 - queue.length} из ${total}`} · Без таймера</p>
      <div className="family-card"><FamilyPicture id={current[0]} /><h2>{current[2]}</h2></div>
      <div className="family-choices">{options.map(i => <button key={i} disabled={correct || wrong.includes(i)} className={'choice-button ' + (wrong.includes(i) ? 'family-wrong' : correct && i === index ? 'family-correct' : '')} onClick={() => answer(i)}>{familyWords[i][1]}</button>)}</div>
      <p className="family-feedback" role="status">{correct ? `Верно! ${current[1]}` : wrong.length ? 'Попробуй другой вариант. Это слово добавлено в повтор.' : 'Выбери один из шести вариантов'}</p>
      {correct && <button className="secondary-button" disabled={!voice} onClick={() => speakVietnamese(restaurantSpeech(index))}>🔊 Послушать ещё</button>}
    </> : <div className="family-result">
      <FamilyPicture id="restaurant-17" /><h2>{mode === 'learn' ? 'Все слова закреплены!' : review ? 'Повтор завершён!' : 'Блиц завершён!'}</h2>
      <p>{mode === 'learn' ? `Все ${total} слов и выражений угаданы дважды без ошибки.` : review ? 'Все выбранные слова пройдены.' : `С первой попытки: ${firstCorrect} из ${total}`}</p>
      {mode === 'blitz' && errors.length > 0 && <><p>Для повторения: {errors.map(i => familyWords[i][2].toLowerCase()).join(', ')}.</p><button className="big-button" onClick={() => { const next = shuffled(errors); setErrors([]); setReview(true); prepare(next); }}>Повторить ошибки · {errors.length}</button></>}
      <button className="big-button" onClick={() => start(mode)}>Сыграть заново</button><button className="secondary-button" onClick={exit}>К выбору режима</button>
    </div>}
    {mode && !voice && <p className="family-note">Для озвучки нужен вьетнамский голос на устройстве. Играть можно без звука.</p>}
  </div>;
}
