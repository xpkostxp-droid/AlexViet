import { bigNumberAudio } from '../content/games/bigNumberAudio';
import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { bigNumbers, bigNumberWords, bigNumberTiles, matchesNumberWord } from '../content/games/bigNumbers';
export function BigNumbersGameScreen({ onBack, reverse = false }: { onBack: () => void; reverse?: boolean }) {
  const [numbers, setNumbers] = useState(bigNumbers);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);
  const lock = useRef(false);
  const [audioError, setAudioError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const voiceRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const voiceBusy = useRef(false);
  const voiceDone = useRef<Promise<void>>(Promise.resolve());
  const phraseRef = useRef<HTMLAudioElement>(null);
  const [phraseReady, setPhraseReady] = useState(false);
  const sound = useRef<HTMLAudioElement>(null);
  const words = index < numbers.length ? bigNumberWords(numbers[index]) : [];
  const tokens = reverse && index < numbers.length ? String(numbers[index]).split('') : words;
  const tiles = reverse ? ['1','2','3','4','5','6','7','8','9','0'] : bigNumberTiles;
  useEffect(() => {
    if (!complete) return;
    let cancelled = false;
    let timer: number | undefined;
    void voiceDone.current.then(() => {
      if (cancelled) return;
      const audio = sound.current;
      if (audio) { audio.currentTime = 0; void audio.play().catch(() => {}); }
      timer = window.setTimeout(() => { setIndex(n => n + 1); setAnswer([]); setComplete(false); lock.current = false; }, 800);
    });
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [complete]);
  useEffect(() => {
    if (!wrong) return;
    const timer = window.setTimeout(() => setWrong(null), 400);
    return () => window.clearTimeout(timer);
  }, [wrong]);
  useEffect(() => { const audio = sound.current; const voices = voiceRefs.current; return () => { audio?.pause(); voices.forEach(voice => voice?.pause()); }; }, []);
  useEffect(() => {
    if (!reverse || index >= numbers.length) return;
    const audio = phraseRef.current!;
    let cancelled = false, url: string | undefined;
    setPhraseReady(false); setAudioError('');
    void bigNumberAudio(bigNumberWords(numbers[index])).then(async source => {
      if (cancelled) { URL.revokeObjectURL(source); return; }
      url = source; audio.src = source; setPhraseReady(true);
      try { await audio.play(); }
      catch { if (!cancelled) setAudioError('Нажми «Послушать число», чтобы включить звук.'); }
    }).catch(() => { if (!cancelled) setAudioError('Не удалось загрузить озвучку числа. Обнови страницу.'); });
    return () => { cancelled = true; audio.pause(); audio.removeAttribute('src'); if (url) URL.revokeObjectURL(url); };
  }, [reverse, index, numbers]);
  function choose(word: string) {
    if (voiceBusy.current || lock.current || index >= numbers.length) return;
    if (!(reverse ? word === tokens[answer.length] : matchesNumberWord(word, tokens[answer.length]))) { setWrong(word); setMistakes(n => n + 1); return; }
    setWrong(null);
    if (!reverse) {
      const voice = voiceRefs.current[bigNumberTiles.indexOf(word)];
      if (voice) {
        setAudioError(''); voiceBusy.current = true; setSpeaking(true); voice.currentTime = 0;
        voiceDone.current = new Promise<void>(resolve => {
          const finish = () => { window.clearTimeout(timeout); voice.removeEventListener('ended', finish); voice.removeEventListener('error', finish); voiceBusy.current = false; setSpeaking(false); resolve(); };
          const timeout = window.setTimeout(() => { voice.pause(); finish(); }, 5000);
          voice.addEventListener('ended', finish, { once: true }); voice.addEventListener('error', finish, { once: true });
          void voice.play().catch(() => { setAudioError('Не удалось включить озвучку слова. Обнови страницу и попробуй снова.'); finish(); });
        });
      }
    }
    const next = [...answer, word];
    setAnswer(next);
    if (next.length === tokens.length) {
      lock.current = true; setComplete(true);
    }
  }
  return <div className="screen screen-big-numbers">
    <BackButton onClick={onBack} label="К выбору направления" />
    <span className="badge">Урок 9 · Числа и возраст</span>
    <h1 className="screen-title">Большие числа</h1>
    <audio ref={sound} src={`${import.meta.env.BASE_URL}audio/games/effects/number-complete.wav`} preload="auto" />
    {reverse && <audio ref={phraseRef} preload="auto" />}
    {!reverse && bigNumberTiles.map((word, i) => <audio key={word} ref={element => { voiceRefs.current[i] = element; }} src={`${import.meta.env.BASE_URL}audio/games/number-words/${i}.mp3?v=all-words-2`} preload="auto" />)}
    {index >= numbers.length ? <div className="summary-box"><h2>Все 10 чисел собраны!</h2><p>Ошибок: {mistakes}</p><button className="big-button" onClick={() => { setNumbers(bigNumbers()); setIndex(0); setAnswer([]); setMistakes(0); setWrong(null); }}>Ещё 10 чисел</button></div> : <>
      <div className="big-number-progress">Число {index + 1} из 10</div>
      <div className={`big-number-value${reverse ? ' big-number-value-words' : ''}`} lang={reverse ? 'vi' : undefined}>{reverse ? words.join(' ') : numbers[index].toLocaleString('ru-RU')}</div>
      {reverse && <button className="secondary-button" disabled={!phraseReady} onClick={() => { const audio = phraseRef.current; if (audio) { audio.currentTime = 0; setAudioError(''); void audio.play().catch(() => setAudioError('Не удалось включить звук. Попробуй ещё раз.')); } }}>Послушать число</button>}
      <p className="hint-text">{reverse ? 'Собери число цифрами — выбирай по порядку.' : 'Собери число по-вьетнамски — выбирай слова по порядку.'}</p>
      <div className={`big-number-answer${reverse ? ' big-number-answer-digits' : ''}${complete ? ' big-number-complete' : ''}`} aria-label="Ответ" aria-live="polite">{tokens.map((_, i) => <span key={i} className={`big-number-slot${reverse ? ' big-number-digit-slot' : ''}${reverse && i > 0 && (tokens.length - i) % 3 === 0 ? ' big-number-group-start' : ''}${i === answer.length ? ' big-number-next' : ''}`}>{answer[i] || (reverse ? '·' : '···')}</span>)}</div>
      <p className="big-number-feedback" role="status">{complete ? '✓ Верно!' : wrong ? (reverse ? 'Не та цифра — попробуй другую' : 'Не то слово — попробуй другое') : '\u00a0'}</p>
      {audioError && <p role="alert" className="pronunciation-error">{audioError}</p>}
      <div className={`big-number-tiles${reverse ? ' big-number-digit-tiles' : ''}`}>{tiles.map(word => <button key={word} lang={reverse ? undefined : 'vi'} disabled={complete || speaking} className={`big-number-tile${wrong === word ? ' big-number-wrong' : ''}`} onClick={() => choose(word)}>{word}</button>)}</div>
    </>}
  </div>;
}
