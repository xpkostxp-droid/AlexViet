import { useEffect, useMemo, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './IslandGameScreen.css';

type Word = { vi: string; ru: string; object: string; x: number; y: number };
const words: Word[] = [
 {vi:'nhà',ru:'дом',object:'🏠',x:32,y:42},
 {vi:'cây',ru:'дерево',object:'🌳',x:17,y:31},
 {vi:'biển',ru:'море',object:'⛵',x:78,y:78},
 {vi:'đẹp',ru:'красивый',object:'🌺',x:52,y:67},
 {vi:'to',ru:'большой',object:'🌴',x:74,y:28},
 {vi:'nhỏ',ru:'маленький',object:'🏡',x:58,y:34},
 {vi:'trường',ru:'школа',object:'🏫',x:43,y:21},
 {vi:'xe',ru:'машина',object:'🚙',x:37,y:72},
 {vi:'gia đình',ru:'семья',object:'👨‍👩‍👧',x:25,y:66},
 {vi:'khách sạn',ru:'отель',object:'🏨',x:66,y:53},
];
const shuffle = <T,>(a:T[]) => [...a].sort(()=>Math.random()-.5);
const savedKey='alexviet-island-v1';
function load():number[]{try{const a=JSON.parse(localStorage.getItem(savedKey)||'[]');return Array.isArray(a)?a.filter((n):n is number=>Number.isInteger(n)&&n>=0&&n<words.length):[]}catch{return []}}
function speak(s:string){try{const u=new SpeechSynthesisUtterance(s);u.lang='vi-VN';u.rate=.82;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang.toLowerCase().startsWith('vi')&&/northern|north|hanoi/i.test(v.name))||voices.find(v=>v.lang.toLowerCase().startsWith('vi'))||null;speechSynthesis.cancel();speechSynthesis.speak(u)}catch{/* speech not supported */}}
export function IslandGameScreen({onBack}:{onBack:()=>void}){
 const [built,setBuilt]=useState<number[]>(load);
 const [current,setCurrent]=useState(()=>Math.floor(Math.random()*words.length));
 const [turn,setTurn]=useState(0);
 const [message,setMessage]=useState('Выбирай перевод — и строй остров!');
 const canvas=useRef<HTMLCanvasElement>(null);
 const sceneApi=useRef<{setBuilt:(ids:number[])=>void;zoom:(d:number)=>void;reset:()=>void;dispose:()=>void}|null>(null);
 const [sceneError,setSceneError]=useState('');
 useEffect(()=>{let cancelled=false;let cleanup:(()=>void)|undefined;import('./islandThree').then(m=>{if(!canvas.current||cancelled)return;return m.mountIsland(canvas.current,built)}).then(api=>{if(!api)return;if(cancelled){api.dispose();return}sceneApi.current=api;cleanup=()=>api.dispose()}).catch(()=>{if(!cancelled)setSceneError('Не удалось загрузить 3D-движок. Проверь интернет и обнови страницу.')});return()=>{cancelled=true;cleanup?.();sceneApi.current=null}},[]);
 useEffect(()=>{sceneApi.current?.setBuilt(built)},[built]);
 const locked=useRef(false);
 const shown=useMemo(()=>[current,...shuffle(words.map((_,i)=>i).filter(i=>i!==current)).slice(0,2)], [current,turn]);
 const choices=useMemo(()=>shuffle(shown),[shown]);
 // Use stable per-question choices, not a new shuffle on each render.
 const [order,setOrder]=useState<number[]>(()=>shuffle([0,1,2]));
 const choose=(idx:number)=>{
  if(locked.current)return;
  locked.current=true;
  const correct=idx===current;
  const next=correct?Array.from(new Set([...built,current])):built.filter(n=>n!==current);
  setBuilt(next);try{localStorage.setItem(savedKey,JSON.stringify(next))}catch{/* private browsing */}
  setMessage(correct?'Отлично! Новый объект на острове.':'Ошибка! Объект исчез с острова.');
  if(correct)speak(words[current].vi);
  window.setTimeout(()=>{const pool=shuffle(words.map((_,i)=>i).filter(i=>i!==current));setCurrent(pool[0]);setTurn(t=>t+1);setOrder(shuffle([0,1,2]));locked.current=false;setMessage('Продолжаем строить остров!')},1100);
 };
 const answerOptions=order.map(i=>choices[i]);
 return <div className="screen island-screen">
  <BackButton onClick={onBack} label="К дополнительным играм"/>
  <h1 className="screen-title">🏝️ Остров знаний</h1>
  <p className="island-subtitle">Three.js · 10 слов · построено {built.length}/10</p>
  <div className="island-viewport island-viewport-3d">
   <canvas ref={canvas} className="island-canvas" aria-label="Трёхмерный тропический остров, вращается пальцем"/>
   {sceneError && <div className="island-scene-error">{sceneError}</div>}
   <div className="island-controls"><button onClick={()=>sceneApi.current?.zoom(-2)} aria-label="Приблизить">＋</button><button onClick={()=>sceneApi.current?.zoom(2)} aria-label="Отдалить">−</button><button onClick={()=>sceneApi.current?.reset()} aria-label="Сбросить камеру">⟳</button></div>
   <div className="island-hint">Проведи пальцем, чтобы повернуть настоящий 3D-остров</div>
  </div>
  <div className="island-question"><div className="island-prompt">Как по-вьетнамски «{words[current].ru}»?</div><div className="island-options">{answerOptions.map((i,k)=><button key={k} onClick={()=>choose(i)}>{words[i].vi}</button>)}</div><div className="island-feedback" role="status">{message}</div></div>
  <p className="island-footnote">Прогресс сохраняется на этом устройстве. Правильный ответ строит объект, ошибка убирает его.</p>
 </div>
}
