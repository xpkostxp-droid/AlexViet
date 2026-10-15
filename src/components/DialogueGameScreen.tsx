import { useEffect, useMemo, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { dialogueSentences, dialogueTokens, dialogueWordGroups } from '../content/games/dialogues';
import type { NumberGameDirection } from './GameDirectionScreen';
export function DialogueGameScreen({ direction, onBack }: { direction: NumberGameDirection; onBack: () => void }) {
  const [index, setIndex] = useState(0), [position, setPosition] = useState(0);
  const [hint, setHint] = useState(false), [wrong, setWrong] = useState<string | null>(null);
  const [complete, setComplete] = useState(false), [error, setError] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const vi = useRef<HTMLAudioElement>(null), ru = useRef<HTMLAudioElement>(null);
  const phase = useRef<'prompt' | 'completion'>('prompt');
  const positionRef = useRef(0), locked = useRef(false), request = useRef(0);
  const nextTimer = useRef<number>();
  const sentence = dialogueSentences[index];
  const tokens = sentence ? dialogueTokens(sentence.vi) : [];
  const displayed = sentence ? sentence.vi.split(/\s+/) : [];
  const groups = useMemo(() => sentence ? dialogueWordGroups(sentence.vi) : [], [sentence]);
  async function play(language: 'vi' | 'ru', completion = false) {
    const id = ++request.current;
    vi.current?.pause(); ru.current?.pause();
    phase.current = completion ? 'completion' : 'prompt';
    const audio = (language === 'vi' ? vi : ru).current;
    if (!audio) return;
    audio.currentTime = 0; setError('');
    try { await audio.play(); } catch { if (id === request.current) setError('Не удалось включить звук. Нажми «Послушать ещё раз».'); }
  }
  useEffect(() => {
    if (!sentence) return;
    phase.current = 'prompt'; locked.current = false; positionRef.current = 0;
    setPosition(0); setHint(false); setWrong(null); setComplete(false);
    void play(direction === 'ru-vi' ? 'ru' : 'vi');
  }, [index, direction]);
  useEffect(() => {
    const a = vi.current, b = ru.current;
    return () => { request.current++; window.clearTimeout(nextTimer.current); a?.pause(); b?.pause(); };
  }, []);
  useEffect(() => { if (!wrong) return; const timer = window.setTimeout(() => setWrong(null), 400); return () => window.clearTimeout(timer); }, [wrong]);
  function next() {
    if (phase.current !== 'completion') return;
    phase.current = 'prompt';
    nextTimer.current = window.setTimeout(() => setIndex(n => n + 1), 350);
  }
  function choose(word: string) {
    if (locked.current || !sentence) return;
    if (word !== tokens[positionRef.current]) { setWrong(word); setMistakes(n => n + 1); return; }
    setWrong(null); positionRef.current++; setPosition(positionRef.current);
    if (positionRef.current === tokens.length) { locked.current = true; setComplete(true); void play('vi', true); }
  }
  return <div className="screen screen-dialogue-game">
    <BackButton onClick={onBack} label="К диалогам" />
    <span className="badge">Урок 9 · Диалоги</span><h1 className="screen-title">Собери фразу</h1>
    <audio ref={vi} src={sentence ? `${import.meta.env.BASE_URL}audio/games/dialogues/${index === 1 ? 'vi-price-430' : `vi-${index}`}.mp3?v=short-3` : undefined} preload="auto" onEnded={next} />
    <audio ref={ru} src={sentence ? `${import.meta.env.BASE_URL}audio/games/dialogues/${index === 1 ? 'ru-price-430' : `ru-${index}`}.mp3?v=short-3` : undefined} preload="auto" />
    {!sentence ? <div className="summary-box"><h2>Все 17 фраз собраны!</h2><p>Ошибок: {mistakes}</p><button className="big-button" onClick={() => { setMistakes(0); setIndex(0); }}>Начать заново</button></div> : <>
      <p className="hint-text">Фраза {index + 1} из {dialogueSentences.length} · {direction === 'vi-ru' ? 'Вьетнамский → Русский' : 'Русский → Вьетнамский'}</p>
      {(direction === 'ru-vi' || hint || complete) && <p className="dialogue-translation">{sentence.ru}</p>}
      <div className="dialogue-controls"><button className="secondary-button" onClick={() => void play(complete ? 'vi' : direction === 'ru-vi' ? 'ru' : 'vi', complete)}>Послушать ещё раз</button>{direction === 'vi-ru' && !hint && !complete && <button className="secondary-button" onClick={() => setHint(true)}>Подсказка</button>}</div>
      <div className={`big-number-answer dialogue-answer${complete ? ' big-number-complete' : ''}`} aria-label="Собранная фраза">{tokens.map((_, i) => <span key={i} className={`big-number-slot${i === position ? ' big-number-next' : ''}`} lang="vi">{i < position ? displayed[i] : '···'}</span>)}</div>
      <p className="big-number-feedback" role="status">{complete ? '✓ Верно! Слушай фразу целиком.' : wrong ? 'Не то слово — попробуй другое' : '\u00a0'}</p>
      {error && <div><p className="pronunciation-error" role="alert">{error}</p>{complete && <button className="secondary-button" onClick={next}>Следующая фраза</button>}</div>}
      <div className="dialogue-word-groups">{groups.map(group => <section key={group.label}><h2>{group.label}</h2><div className="big-number-tiles">{group.words.map(word => <button key={word} lang="vi" disabled={complete} className={`big-number-tile${wrong === word ? ' big-number-wrong' : ''}`} onClick={() => choose(word)}>{word}</button>)}</div></section>)}</div>
    </>}
  </div>;
}
