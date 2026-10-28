import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './QuestionTowerGameScreen.css';
const words: [string,string][] = [['Ai','Кто'],['Gì','Что'],['Ở đâu','Где'],['Từ đâu','Откуда'],['Khi nào','Когда'],['Mấy giờ','Во сколько'],['Tại sao','Почему'],['Thế nào','Как'],['Bao nhiêu','Сколько'],['Mấy','Сколько (до 12)'],['Nào','Какой'],['Của ai','Чей'],['Với ai','С кем'],['Bao lâu','Как долго'],['Để làm gì','Зачем']];
const mix = (a:number[]) => [...a].sort(()=>Math.random()-.5);
function speak(s:string){if(!('speechSynthesis' in window))return; window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='vi-VN';u.rate=.85;const v=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('vi'));u.voice=v.find(v=>/north|hanoi/i.test(v.name))||v[0]||null;window.speechSynthesis.speak(u)}
export function QuestionTowerGameScreen({onBack}:{onBack:()=>void}){
 const [mode,setMode]=useState<'learn'|'record'|null>(null);
 const [counts,setCounts]=useState<number[]>(Array(15).fill(0));
 const [blocks,setBlocks]=useState<number[]>([]);
 const [q,setQ]=useState(0);const [options,setOptions]=useState<number[]>([0,1,2]);
 const [reverse,setReverse]=useState(false);const [feedback,setFeedback]=useState<'right'|'wrong'|null>(null);
 const [done,setDone]=useState(false);
 const [remaining,setRemaining]=useState(3);
 const [crashed,setCrashed]=useState(false);
 const [endReason,setEndReason]=useState<'wrong'|'timeout'|null>(null);
 const deadline=useRef<number|null>(null);
 const [best,setBest]=useState(()=>Number(localStorage.getItem('alexviet-question-tower-best')||0));
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const lock=useRef(false);
 const total=counts.reduce((a,b)=>a+b,0);
 const next=(c:number[],previous:number,record:boolean)=>{
  const group=Array.from({length:5},(_,i)=>i).find(g=>c.slice(g*3,g*3+3).some(x=>x<3))??4;
  const pool=record?words.map((_,i)=>i):[group*3,group*3+1,group*3+2];
  const needed=record?pool:pool.filter(i=>c[i]<3);
  const candidates=needed.filter(i=>i!==previous);
  const target=mix(candidates.length?candidates:needed)[0];
  if(record){setRemaining(3);deadline.current=Date.now()+3000;}setQ(target);setOptions(mix(pool.filter(i=>i!==target)).slice(0,2).concat(target).sort(()=>Math.random()-.5));
 };
 const start=(m:'learn'|'record')=>{if(timer.current)clearTimeout(timer.current);lock.current=false;deadline.current=null;setCrashed(false);setEndReason(null);setRemaining(3);setMode(m);setCounts(Array(15).fill(0));setBlocks([]);setDone(false);setFeedback(null);setReverse(false);next(Array(15).fill(0),-1,m==='record')};
 const answer=(i:number)=>{
  if(lock.current||done||!mode)return;
  if(i!==q){setFeedback('wrong');if(mode==='record'){deadline.current=null;lock.current=true;setCrashed(true);setEndReason('wrong');setDone(true)}else{if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setFeedback(null),650)}return}
  lock.current=true;deadline.current=null;setFeedback('right');speak(words[q][0]);const newBlocks=[...blocks,q];setBlocks(newBlocks);
  if(mode==='record'){if(newBlocks.length>best){setBest(newBlocks.length);localStorage.setItem('alexviet-question-tower-best',String(newBlocks.length))}}
  const updated=counts.map((n,j)=>j===q?Math.min(3,n+1):n);if(mode==='learn')setCounts(updated);
  timer.current=setTimeout(()=>{if(mode==='learn'&&updated.every(n=>n>=3))setDone(true);else{next(updated,q,mode==='record');if(mode==='record')setReverse(newBlocks.length%2===0)}setFeedback(null);lock.current=false},1500);
 };
 useEffect(()=>{if(mode!=='record'||done)return;const id=setInterval(()=>{if(deadline.current===null||lock.current)return;const left=Math.max(0,(deadline.current-Date.now())/1000);setRemaining(left);if(left<=0){deadline.current=null;lock.current=true;setFeedback('wrong');setEndReason('timeout');setCrashed(true);setDone(true)}},50);return()=>clearInterval(id)},[mode,done]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);window.speechSynthesis?.cancel()},[]);
 return <div className="screen qt-screen"><BackButton onClick={onBack} label="К дополнительным играм"/><h1 className="screen-title">🏗️ Башня вопросов</h1>
 {!mode?<div className="qt-start"><p>15 вопросительных слов · кубики подпрыгивают, башня качается</p><button className="big-button" onClick={()=>start('learn')}>📚 Обучение</button><button className="big-button" onClick={()=>start('record')}>⚡ Блиц · Башня на выживание</button><p>Лучший результат: {best} кубиков</p></div>:<>
 <div className="qt-top"><span>{mode==='learn'?'Обучение · '+(Math.min(5,Math.floor(total/9)+1))+'/5' :'Блиц · 3 секунды'}</span><span>{mode==='learn'?total+'/45':blocks.length+' кубиков'}</span></div>
 {mode==='record'&&!done&&<div className="qt-timer" aria-label={'Осталось '+Math.ceil(remaining)+' секунды'}><strong>{Math.ceil(remaining)}</strong><div className="qt-timer-track"><div className="qt-timer-fill" style={{width:(remaining/3*100)+'%'}}/></div></div>}
 <div className="qt-question"><small>{done?'Результат':reverse?'Выбери перевод':'Переведи на вьетнамский'}</small><strong>{done?(mode==='learn'?'Башня построена! 🎉':(endReason==='timeout'?'Время вышло!':'Ошибка!')+' · '+blocks.length+' кубиков'):words[q][reverse?0:1]}</strong></div>
 <div className={'qt-scene '+(crashed?'qt-crashed':'')}><div className="qt-cloud">☁️</div><div className={'qt-stack '+(crashed?'qt-collapse':'')}>{blocks.slice(-9).reverse().map((index,i)=><div className={'qt-block qt-color-'+Math.floor(index/3)+(i===0&&feedback==='right'?' qt-new':'')} key={blocks.length-1-i}>{words[index][0]}</div>)}<div className="qt-ground"/></div><div className="qt-floor">{mode==='learn'?'Золотых этажей: '+Math.floor(counts.filter(n=>n===3).length/3):'Рекорд: '+best}</div></div>
 {done&&mode==='record'&&<p className="qt-result">{endReason==='timeout'?'⏰ Время вышло!':'💥 Башня рухнула!'} Рекорд: {best} кубиков</p>}
 {done?<button className="big-button" onClick={()=>start(mode)}>Играть снова</button>:<div className="qt-options">{options.map(i=><button className={'qt-option '+(feedback==='right'&&i===q?'qt-correct':'')} key={i} disabled={feedback==='right'} onClick={()=>answer(i)}>{words[i][reverse?1:0]}</button>)}<p className={'qt-feedback '+(feedback||'')}>{feedback==='right'?'Кубик на месте!':feedback==='wrong'?'Мимо! Попробуй ещё раз':''}</p></div>}
 <button className="secondary-button" onClick={()=>{if(timer.current)clearTimeout(timer.current);deadline.current=null;lock.current=false;setMode(null)}}>Выбор режима</button></>}
 </div>;
}
