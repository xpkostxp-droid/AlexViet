import { useMemo, useRef, useState } from 'react';
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
 const [angle,setAngle]=useState(-18);
 const [tilt,setTilt]=useState(58);
 const [zoom,setZoom]=useState(1);
 const drag=useRef<{x:number;y:number;a:number;t:number}|null>(null);
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
  <p className="island-subtitle">3D-концепт · 10 слов · построено {built.length}/10</p>
  <div className="island-viewport" onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,a:angle,t:tilt};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(!drag.current)return;setAngle(drag.current.a+(e.clientX-drag.current.x)*.55);setTilt(Math.max(38,Math.min(76,drag.current.t-(e.clientY-drag.current.y)*.25)))}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
   <div className="island-sky"><span>☁️</span><span>☁️</span></div>
   <div className="island-water"/>
   <div className="island-world" style={{transform:`translate(-50%,-50%) scale(${zoom}) rotateX(${tilt}deg) rotateZ(${angle}deg)`, '--camera-angle': `${angle}deg`, '--camera-tilt': `${tilt}deg`} as React.CSSProperties}>
    <div className="island-shadow"/><div className="island-sand"/><div className="island-grass"/>
    <div className="island-path"/>
    <div className="island-decoration island-rock" style={{left:'14%',top:'55%'}}>🪨</div>
    <div className="island-decoration" style={{left:'78%',top:'44%'}}>🌴</div>
    <div className="island-decoration" style={{left:'13%',top:'18%'}}>🌴</div>
    {words.map((w,i)=><div key={w.vi} className={'island-object '+(built.includes(i)?'island-object-built':'island-object-ghost')} style={{left:w.x+'%',top:w.y+'%'}}><span className="island-object-art">{built.includes(i)?w.object:'✧'}</span>{built.includes(i)&&<span className="island-object-label">{w.vi}</span>}</div>)}
   </div>
   <div className="island-controls"><button onPointerDown={e=>e.stopPropagation()} onClick={()=>setZoom(z=>Math.min(1.6,z+.15))} aria-label="Приблизить">＋</button><button onPointerDown={e=>e.stopPropagation()} onClick={()=>setZoom(z=>Math.max(.7,z-.15))} aria-label="Отдалить">−</button><button onPointerDown={e=>e.stopPropagation()} onClick={()=>{setAngle(-18);setTilt(58);setZoom(1)}} aria-label="Сбросить камеру">⟳</button></div>
   <div className="island-hint">Проведи пальцем, чтобы повернуть остров</div>
  </div>
  <div className="island-question"><div className="island-prompt">Как по-вьетнамски «{words[current].ru}»?</div><div className="island-options">{answerOptions.map((i,k)=><button key={k} onClick={()=>choose(i)}>{words[i].vi}</button>)}</div><div className="island-feedback" role="status">{message}</div></div>
  <p className="island-footnote">Прогресс сохраняется на этом устройстве. Правильный ответ строит объект, ошибка убирает его.</p>
 </div>
}
