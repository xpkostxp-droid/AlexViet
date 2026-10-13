import { useEffect, useRef, useState } from 'react';
import { phoneToneUrl } from '../content/games/phoneTone';
import { BackButton } from './BackButton';
import type { NumberGameDirection } from './GameDirectionScreen';
import { phoneDigitWords, phoneNumbers } from '../content/games/phone';

export function PhoneGameScreen({ direction, onBack }: { direction: NumberGameDirection; onBack: () => void }) {
  const [numbers, setNumbers] = useState(phoneNumbers);
  const [numberIndex, setNumberIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [started, setStarted] = useState(false);
  const [heard, setHeard] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [dialIndex, setDialIndex] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [error, setError] = useState('');
  const voiceRef = useRef<HTMLAudioElement>(null);
  const ringRef = useRef<HTMLAudioElement>(null);
  const wrongRef = useRef<HTMLAudioElement>(null);
  const toneRef = useRef<HTMLAudioElement>(null);

  const requestRef = useRef(0);
  const lockedRef = useRef(false);
  const timerRef = useRef<number>();
  const phone = numbers[numberIndex];
  const [toneUrl, setToneUrl] = useState<string>();
  useEffect(() => {
    const url = phone ? phoneToneUrl(phone) : undefined;
    setToneUrl(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [phone]);
  const digit = phone && position < 10 ? Number(phone[position]) : null;

  async function listen() {
    const audio = voiceRef.current;
    if (!audio || digit === null || ringing) return;
    const request = ++requestRef.current;
    audio.pause(); audio.currentTime = 0; setError('');
    try { await audio.play(); if(request === requestRef.current) { setHeard(true); setStarted(true); } }
    catch { if(request === requestRef.current) setError('Не удалось включить запись. Нажми «Повторить цифру».'); }
  }
  useEffect(() => {
    if(started && !ringing && digit !== null) { lockedRef.current=false; void listen(); }
  }, [numberIndex, position, ringing]);
  useEffect(() => {
    const voice=voiceRef.current, ring=ringRef.current, wrongAudio=wrongRef.current, tone=toneRef.current;
    return () => { requestRef.current++; window.clearTimeout(timerRef.current); voice?.pause(); ring?.pause(); wrongAudio?.pause(); tone?.pause(); };
  }, []);
  useEffect(() => {
    if(wrong===null) return;
    const timer=window.setTimeout(()=>setWrong(null),350);return ()=>window.clearTimeout(timer);
  }, [wrong]);

  function startRing() {
    setDialIndex(null); setRinging(true);
    const ring=ringRef.current;
    if(ring){ring.currentTime=0;void ring.play().catch(()=>setError('Номер набран! Нажми «Следующий номер».'));}
  }
  const dialing = dialIndex !== null;
  useEffect(() => {
    if (!dialing) return;
    const tone = toneRef.current;
    if (!tone) return;
    tone.currentTime = 0;
    void tone.play().catch(() => setError('Не удалось включить набор. Нажми «Позвонить».'));
    const timer = window.setInterval(() => setDialIndex(Math.min(9, Math.floor(tone.currentTime / .095))), 16);
    return () => { window.clearInterval(timer); tone.pause(); };
  }, [dialing]);

  function finishNumber() {
    if(!ringing) return;
    ringRef.current?.pause(); setRinging(false); setPosition(0); setHeard(false); setCorrect(null);
    setNumberIndex(index=>index+1); lockedRef.current=false;
  }
  function choose(value:number) {
    if(!heard || lockedRef.current || ringing || digit===null) return;
    if(value!==digit) {
      setWrong(value); setMistakes(n=>n+1);
      const audio=wrongRef.current;if(audio){audio.currentTime=0;void audio.play().catch(()=>{});}return;
    }
    lockedRef.current=true; setWrong(null);setCorrect(value);setHeard(false);voiceRef.current?.pause();
    timerRef.current=window.setTimeout(()=>{
      setPosition(current=>current+1);setCorrect(null);
      if(position===9) {
        setDialIndex(0);
      }
    },180);
  }
  function restart() {
    requestRef.current++;window.clearTimeout(timerRef.current);voiceRef.current?.pause();ringRef.current?.pause();wrongRef.current?.pause();toneRef.current?.pause();
    lockedRef.current=false;setNumbers(phoneNumbers());setNumberIndex(0);setPosition(0);setStarted(false);setHeard(false);setRinging(false);setDialIndex(null);setWrong(null);setCorrect(null);setMistakes(0);setError('');
  }
  const source=digit===null?undefined:digit===0?`${import.meta.env.BASE_URL}audio/games/phone/${direction==='vi-ru'?'vi':'ru'}-0.mp3`:`${import.meta.env.BASE_URL}audio/games/${direction==='vi-ru'?'numbers':'numbers-ru'}/${digit}.mp3?v=${direction==='vi-ru'?'vi':'ru'}-soft-2`;
  return <div className="screen screen-phone-game">
    <BackButton onClick={onBack} label="К выбору направления" />
    <span className="badge">Урок 9 · Номер телефона</span>
    <h1 className="screen-title">Номер телефона</h1>
    <p className="phone-direction">{direction==='vi-ru'?'По-вьетнамски':'По-русски'}</p>
    <audio ref={voiceRef} src={source} preload="auto" onError={()=>setError('Запись не загрузилась. Попробуй повторить цифру.')} />
    <audio ref={ringRef} src={`${import.meta.env.BASE_URL}audio/games/phone/ring.wav`} preload="auto" onEnded={finishNumber} />
    <audio ref={wrongRef} src={`${import.meta.env.BASE_URL}audio/games/phone/wrong.wav`} preload="auto" />
    <audio ref={toneRef} src={toneUrl} preload="auto" onEnded={startRing} />
    {!phone ? <div className="summary-box"><h2>Все 10 номеров набраны!</h2><p>Верных цифр: 100 · Ошибок: {mistakes}</p><button className="big-button" onClick={restart}>Ещё 10 номеров</button></div> : <>
      <div className="phone-progress"><span>Номер {numberIndex+1} из 10</span><span>Цифра {Math.min(position+1,10)} из 10</span></div>
      <div className={`phone-display${ringing?' phone-ringing':''}`}>
        <svg className="phone-handset" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 2-3 3-5 2C9 19 5 15 3 8 2 6 3 3 5 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        <div className="phone-digits" aria-label={`Набрано ${position} цифр`}>
          {Array.from({length:10},(_,i)=><span key={i} className={`${[3,6,8].includes(i)?'phone-digit-group ':''}${i===position&&!ringing?'phone-digit-current':''}${i===dialIndex?' phone-digit-dialing':''}`}>{i<position?phone[i]:'·'}</span>)}
        </div>
      </div>
      <p className="phone-feedback" role="status">{dialIndex!==null?'Тональный набор номера…':ringing?'Номер набран! Телефон звонит…':wrong!==null?'Не та цифра — попробуй ещё раз':correct!==null?'✓ Верно!':started?'Слушай и набирай по одной цифре':'Девушка назовёт номер по одной цифре.'}</p>
      <div className={`phone-keypad${direction==='ru-vi'?' phone-keypad-words':''}`}>
        {[1,2,3,4,5,6,7,8,9,0].map(value=><button key={value} data-digit={value} lang={direction==='ru-vi'?'vi':undefined} className={`phone-key${value===0?' phone-key-zero':''}${wrong===value?' phone-key-wrong':''}${correct===value?' phone-key-correct':''}`} disabled={!heard||ringing||correct!==null} onClick={()=>choose(value)}>{direction==='ru-vi'?phoneDigitWords[value]:value}</button>)}
      </div>
      {ringing?<button className="secondary-button" onClick={finishNumber}>Следующий номер</button>:<button className="big-button" onClick={()=>void listen()} disabled={correct!==null||dialIndex!==null}>{dialIndex!==null?'Набираем номер…':started?'Повторить цифру':'Начать'}</button>}
      {error && dialing && <button className="secondary-button" onClick={startRing}>Позвонить</button>}
      {error&&<p role="alert" className="pronunciation-error">{error}</p>}
      <p className="hint-text">Учебные номера. Ошибка не пропускает цифру.</p>
    </>}
  </div>;
}
