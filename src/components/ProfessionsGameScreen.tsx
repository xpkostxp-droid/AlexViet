import { useEffect, useRef, useState } from 'react';
import { professionWords, workBlitzGroups, workBlitzTasks, workBlitzAnswer, workBlitzOptions, type WorkBlitzGroup, type WorkTask } from '../content/games/professions';
import { readJSON, writeJSON } from '../domain/storage';
import { speakVietnamese, stopSpeaking } from '../domain/speech';
import { BackButton } from './BackButton';
import { ProfessionPicture } from './ProfessionPicture';
import './ProfessionsGameScreen.css';
type Result = { correct: number; time: number };
const formatTime = (ms: number) => (ms / 1000).toFixed(2).replace('.', ',');
function savedBest(group: WorkBlitzGroup): Result | null {
  const value = readJSON('work-blitz.v1.' + group) as Result | undefined;
  return value && Number.isFinite(value.correct) && Number.isFinite(value.time) ? value : null;
}
export function ProfessionsGameScreen({ onBack }: { onBack: () => void }) {
  const [group, setGroup] = useState<WorkBlitzGroup | null>(null);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [position, setPosition] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'feedback' | 'result'>('intro');
  const [remaining, setRemaining] = useState(5000);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<Result>({ correct: 0, time: 0 });
  const [best, setBest] = useState<Result | null>(null);
  const elapsed = useRef(0);
  const started = useRef(0);
  const locked = useRef(true);
  const current = tasks[position];
  const word = current && professionWords[current.index];
  const answer = current && workBlitzAnswer(current);
  const title = workBlitzGroups.find(g => g.id === group);
  const prepare = (next: WorkTask[], at: number, category: WorkBlitzGroup) => {
    setPosition(at); setOptions(workBlitzOptions(next[at], category)); setSelected(null);
    elapsed.current = 0; started.current = performance.now(); locked.current = false;
    setRemaining(5000); setPaused(document.hidden); setPhase('playing');
  };
  const start = () => {
    if (!group) return;
    stopSpeaking(); const next = workBlitzTasks(group); setTasks(next);
    setScore({ correct: 0, time: 0 }); prepare(next, 0, group);
  };
  const finishAnswer = (choice: string | null) => {
    if (locked.current || paused || !current) return;
    locked.current = true;
    const time = Math.min(5000, elapsed.current + performance.now() - started.current);
    if (time >= 5000) choice = null;
    setRemaining(Math.max(0, 5000 - time)); setSelected(choice);
    if (choice === answer) setScore(s => ({ correct: s.correct + 1, time: s.time + time }));
    setPhase('feedback'); speakVietnamese(professionWords[current.index][1]);
  };
  useEffect(() => {
    if (phase !== 'playing' || paused) return;
    const tick = () => {
      const left = Math.max(0, 5000 - elapsed.current - (performance.now() - started.current));
      setRemaining(left); if (left === 0) finishAnswer(null);
    };
    const timer = setInterval(tick, 40);
    const hide = () => {
      if (document.hidden && !locked.current) {
        elapsed.current += performance.now() - started.current;
        setPaused(true); stopSpeaking();
      }
    };
    document.addEventListener('visibilitychange', hide);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', hide); };
  }, [phase, paused, position]);
  useEffect(() => {
    if (phase !== 'feedback' || !group) return;
    const timer = setTimeout(() => {
      if (position + 1 < tasks.length) prepare(tasks, position + 1, group);
      else {
        const old = savedBest(group);
        const improved = !old || score.correct > old.correct || (score.correct === old.correct && score.time < old.time);
        if (improved) writeJSON('work-blitz.v1.' + group, score);
        setBest(improved ? score : old); setPhase('result'); stopSpeaking();
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, [phase, position, group, tasks, score]);
  useEffect(() => () => { stopSpeaking(); }, []);
  const back = () => {
    stopSpeaking(); locked.current = true; setPhase('intro'); setTasks([]); setPaused(false);
    if (phase === 'intro') { if (group) setGroup(null); else onBack(); }
  };
  return <div className="screen family-screen work-blitz">
    <BackButton onClick={back} label={group ? 'Назад' : 'К играм'} />
    <span className="badge">Урок 5 · Профессии и работа</span>
    <h1 className="screen-title">{title?.label ?? 'Профессии и работа'}</h1>
    {!group ? <div className="work-group-list">{workBlitzGroups.map(g => <button className="big-button" key={g.id} onClick={() => { setGroup(g.id); setBest(savedBest(g.id)); }}><strong>{g.label}</strong><span>{g.words} слов и выражений · {g.words * 2} заданий</span></button>)}</div>
      : phase === 'intro' ? <div className="family-result">
        <p>{title!.words * 2} заданий · Два направления · 5 секунд на ответ</p>
        {best && <p>🏆 Рекорд: {best.correct} из {title!.words * 2} · {formatTime(best.time)} сек</p>}
        <button className="big-button" onClick={start}>Начать блиц</button>
      </div> : phase === 'result' ? <div className="family-result" role="status">
        <h2>Блиц завершён!</h2><p>Правильно: {score.correct} из {tasks.length}</p>
        <p>Ошибок: {tasks.length - score.correct}</p><p>Время правильных ответов: {formatTime(score.time)} сек</p>
        {best && <p>🏆 Рекорд: {best.correct} из {tasks.length} · {formatTime(best.time)} сек</p>}
        <button className="big-button" onClick={start}>Сыграть ещё</button>
      </div> : word && <>
        <div className="work-status"><strong>{position + 1}/{tasks.length} · ✓ {score.correct}</strong><span className="work-clock" aria-label="Осталось секунд">{Math.ceil(remaining / 1000)}</span></div>
        <div className="work-timebar"><div style={{ width: `${remaining / 50}%` }} /></div>
        <div className={'family-card work-prompt ' + (current.reverse ? 'work-prompt-text' : '')}>
          {!current.reverse && <ProfessionPicture id={word[0]} />}
          <h2 lang={current.reverse ? 'vi' : 'ru'}>{current.reverse ? word[1] : word[2]}</h2>
        </div>
        {paused ? <button className="big-button" onClick={() => { started.current = performance.now(); setPaused(false); }}>Продолжить</button> : <div className="family-choices work-options">{options.map(option => <button key={option} lang={current.reverse ? 'ru' : 'vi'} disabled={phase !== 'playing'} className={'choice-button ' + (phase === 'feedback' ? option === answer ? 'family-correct' : option === selected ? 'family-wrong' : '' : '')} onClick={() => finishAnswer(option)}>{option}</button>)}</div>}
        <p className="family-feedback work-feedback" role="status">{paused ? 'Игра на паузе' : phase === 'feedback' ? selected === answer ? 'Верно!' : `${selected === null ? 'Время вышло.' : 'Неверно.'} ${answer}` : 'Выбери перевод'}</p>
      </>}
    <p className="family-note">🧪 Тестовая игра · без общего рейтинга</p>
  </div>;
}
