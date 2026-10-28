import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './TaxiDemoScreen.css';

type Action='left'|'right'|'straight'|'stop'|'go';
type Stage={label:string;vi:string;ru:string;correct:Action;type:'turn'|'light'|'drive'};
const stages:Stage[]=[
 {label:'Перекрёсток',vi:'Rẽ phải!',ru:'Направо',correct:'right',type:'turn'},
 {label:'Красный светофор',vi:'Dừng lại!',ru:'Остановись',correct:'stop',type:'light'},
 {label:'Зелёный свет',vi:'Đi tiếp!',ru:'Продолжай',correct:'go',type:'light'},
 {label:'Следующий перекрёсток',vi:'Rẽ trái!',ru:'Налево',correct:'left',type:'turn'},
 {label:'Дорога к пляжу',vi:'Đi thẳng!',ru:'Прямо',correct:'straight',type:'drive'}
];
function say(s:string){try{const u=new SpeechSynthesisUtterance(s);u.lang='vi-VN';u.rate=.82;const v=speechSynthesis.getVoices();u.voice=v.find(x=>x.lang.toLowerCase().startsWith('vi')&&/north|hanoi/i.test(x.name))||v.find(x=>x.lang.toLowerCase().startsWith('vi'))||null;speechSynthesis.cancel();speechSynthesis.speak(u)}catch{}}
type Car={x:number;y:number;angle:number;speed:number;targetAngle:number;crash:number;turning:boolean};
const W=390,H=490;
function draw(ctx:CanvasRenderingContext2D,car:Car,time:number,stage:number,light:boolean){
 ctx.clearRect(0,0,W,H);
 ctx.fillStyle='#83c56f';ctx.fillRect(0,0,W,H);
 // Tropical city blocks with tiled walkways.
 const scroll=(time*.025)%260;
 for(let j=-2;j<4;j++)for(let i=-2;i<4;i++){
  const x=i*190+15,y=j*260+scroll-60;
  ctx.fillStyle='#d6d5b0';ctx.fillRect(x,y,150,190);
  ctx.fillStyle='#e9e4bf';ctx.fillRect(x+6,y+6,138,178);
  const colors=['#f3a675','#e3b7d6','#79b9c6','#edcb7c'];
  ctx.fillStyle='#596e75';ctx.fillRect(x+17,y+21,105,117);
  ctx.fillStyle=colors[((i+6)*3+(j+12))%4];ctx.fillRect(x+14,y+14,105,117);
  ctx.fillStyle='#f9e5ba';ctx.fillRect(x+21,y+23,91,13);
  ctx.fillStyle='#80c8d4';
  for(let a=0;a<3;a++)for(let b=0;b<2;b++)ctx.fillRect(x+27+a*28,y+49+b*31,16,19);
  ctx.fillStyle='#548b51';ctx.fillRect(x+15,y+147,115,24);
  for(let k=0;k<3;k++){const px=x+22+k*44,py=y+156;ctx.fillStyle='#835d3a';ctx.fillRect(px-3,py-2,6,22);ctx.fillStyle='#2c9859';ctx.beginPath();ctx.arc(px,py-5,17,0,Math.PI*2);ctx.fill();ctx.fillStyle='#50b66a';ctx.beginPath();ctx.arc(px-5,py-10,9,0,Math.PI*2);ctx.fill()}
 }
 // Road: moving dashed markings give continuous driving sensation.
 ctx.fillStyle='#c5c6b6';ctx.fillRect(139,0,112,H);ctx.fillStyle='#4d5a63';ctx.fillRect(146,0,98,H);
 ctx.fillStyle='#f6efce';ctx.fillRect(148,0,3,H);ctx.fillRect(240,0,3,H);
 ctx.fillStyle='#e7d69b';for(let y=-48+(scroll%65);y<H;y+=65)ctx.fillRect(193,y,4,32);
 // Cross road at active intersection, approaching then passing.
 const crossY=160+((time*.035)%700)-360;
 if(stage!==2 && crossY>-110&&crossY<H+110){
  ctx.fillStyle='#bfc4b9';ctx.fillRect(0,crossY-66,W,132);
  ctx.fillStyle='#4d5a63';ctx.fillRect(0,crossY-58,W,116);
  ctx.fillStyle='#f3ebc5';for(let i=0;i<7;i++){ctx.fillRect(151+i*13,crossY-68,7,23);ctx.fillRect(151+i*13,crossY+45,7,23)}
  ctx.fillStyle='#e7d69b';for(let x=0;x<W;x+=57)ctx.fillRect(x,crossY-2,28,4);
 }
 // Stop line and signal ahead of taxi, when active.
 if(stage===1||stage===2){ctx.fillStyle='#f6f3e8';ctx.fillRect(146,113,98,7);ctx.fillStyle='#333b40';ctx.fillRect(259,61,15,50);ctx.fillStyle=light?'#ff484b':'#5a2727';ctx.beginPath();ctx.arc(266,74,5,0,7);ctx.fill();ctx.fillStyle=light?'#26533c':'#36f08b';ctx.beginPath();ctx.arc(266,98,5,0,7);ctx.fill()}
 // Other traffic: soft shadow and cars.
 function traffic(x:number,y:number,color:string){ctx.save();ctx.translate(x,y);ctx.fillStyle='#27373a55';ctx.fillRect(-13,-23,30,51);ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-13,-25,26,49,6);ctx.fill();ctx.fillStyle='#bce5ef';ctx.fillRect(-9,-14,18,12);ctx.fillRect(-9,7,18,9);ctx.fillStyle='#ffe0a1';ctx.fillRect(-10,-24,7,3);ctx.fillRect(3,-24,7,3);ctx.restore()}
 traffic(171,((time*.07+100)%650)-100,'#d85e6a');
 traffic(224,H-((time*.04+130)%680),'#e8e8e3');
 // Taxi shadow and detailed overhead car.
 ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.angle);
 if(car.crash>0)ctx.translate(Math.sin(time*.25)*car.crash*2,Math.cos(time*.2)*car.crash);
 ctx.fillStyle='#22333a66';ctx.beginPath();ctx.ellipse(4,6,20,34,0,0,7);ctx.fill();
 ctx.fillStyle='#303d45';for(const x of [-18,13])for(const y of [-21,15])ctx.fillRect(x,y,5,15);
 ctx.fillStyle='#f3bd27';ctx.beginPath();ctx.roundRect(-16,-31,32,62,9);ctx.fill();
 ctx.fillStyle='#ffe176';ctx.beginPath();ctx.roundRect(-12,-28,24,54,6);ctx.fill();
 ctx.fillStyle='#2b778d';ctx.beginPath();ctx.roundRect(-12,-16,24,19,4);ctx.fill();
 ctx.fillStyle='#7fc4d5';ctx.fillRect(-9,-13,18,11);
 ctx.fillStyle='#24586b';ctx.beginPath();ctx.roundRect(-12,13,24,10,3);ctx.fill();
 ctx.fillStyle='#faf4d2';ctx.fillRect(-11,-29,8,5);ctx.fillRect(3,-29,8,5);
 ctx.fillStyle='#d33b39';ctx.fillRect(-11,26,8,4);ctx.fillRect(3,26,8,4);
 ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(-10,-3,20,11,2);ctx.fill();ctx.fillStyle='#262c31';ctx.font='bold 7px sans-serif';ctx.textAlign='center';ctx.fillText('TAXI',0,5);
 if(car.crash>0){ctx.strokeStyle='#fff2a1';ctx.lineWidth=3;for(let i=0;i<8;i++){const a=i*Math.PI/4+time*.02;ctx.beginPath();ctx.moveTo(Math.cos(a)*28,Math.sin(a)*36);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*52);ctx.stroke()}}
 ctx.restore();
 // Minimal heads-up street labels.
 ctx.fillStyle='#0d3443aa';ctx.beginPath();ctx.roundRect(10,12,135,30,8);ctx.fill();ctx.fillStyle='white';ctx.font='bold 12px system-ui';ctx.fillText('NHA TRANG  •  TAXI',20,31);
}
export function TaxiDemoScreen({onBack}:{onBack:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),car=useRef<Car>({x:196,y:330,angle:0,speed:1,targetAngle:0,crash:0,turning:false});
 const [remaining,setRemaining]=useState(4),[mistakes,setMistakes]=useState(0);
 const deadline=useRef(0),actRef=useRef<(a:Action)=>void>(()=>{});\n const [stage,setStage]=useState(0),[status,setStatus]=useState('Нажми «Начать поездку»'),[running,setRunning]=useState(false),[busy,setBusy]=useState(false),[textMode,setTextMode]=useState(true),[score,setScore]=useState(0);
 const clock=useRef(0),timeout=useRef<number|undefined>(undefined),runningRef=useRef(false),stageRef=useRef(0),busyRef=useRef(false);
 useEffect(()=>{const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;let raf=0,last=0;const frame=(t:number)=>{const dt=Math.min(40,t-last||16);last=t;if(runningRef.current){clock.current+=dt*car.current.speed;const c=car.current;c.angle+=(c.targetAngle-c.angle)*Math.min(1,dt*.006);if(c.crash>0)c.crash=Math.max(0,c.crash-dt*.004);c.speed+=(busyRef.current?0.45:0.82-c.speed)*.025}if(runningRef.current&&!busyRef.current){const seconds=Math.max(0,(deadline.current-t)/1000);setRemaining(v=>Math.ceil(seconds)===v?v:Math.ceil(seconds));if(seconds===0)actRef.current('timeout' as Action)}draw(ctx,car.current,clock.current,stageRef.current,stageRef.current===1);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf)},[]);
 useEffect(()=>()=>{if(timeout.current)window.clearTimeout(timeout.current);runningRef.current=false},[]);
 const start=()=>{if(timeout.current)clearTimeout(timeout.current);clock.current=0;car.current={x:196,y:330,angle:0,speed:1,targetAngle:0,crash:0,turning:false};setStage(0);stageRef.current=0;setScore(0);setMistakes(0);deadline.current=performance.now()+5500;setRemaining(6);setRunning(true);runningRef.current=true;setBusy(false);busyRef.current=false;setStatus('Слушай пассажира!');say(stages[0].vi)};
 const act=(a:Action)=>{if(!runningRef.current||busyRef.current)return;busyRef.current=true;setBusy(true);const s=stages[stageRef.current],correct=a===s.correct;const c=car.current;
  if(correct){setScore(n=>n+1);setStatus('✓ Верно! '+s.ru);if(a==='left'||a==='right'){c.targetAngle=a==='left'?-Math.PI/2:Math.PI/2}else if(a==='stop'){c.speed=0}else if(a==='go'){c.speed=1}}
  else{setMistakes(n=>n+1);if(s.type==='light'){c.crash=10;setStatus('💥 Авария! Надо было: '+s.ru)}else{c.targetAngle=a==='left'?-Math.PI/2:a==='right'?Math.PI/2:0;setStatus('↪ Не туда! Машина свернула на соседнюю улицу. Возвращаемся.');}}
  timeout.current=window.setTimeout(()=>{c.targetAngle=0;c.crash=0;if(stageRef.current>=stages.length-1){runningRef.current=false;setRunning(false);setStatus('🏁 Поездка завершена! Можно попробовать ещё раз.');setBusy(false);busyRef.current=false;return}stageRef.current++;setStage(stageRef.current);setStatus('Слушай следующую команду');deadline.current=performance.now()+4500;setRemaining(5);busyRef.current=false;setBusy(false);say(stages[stageRef.current].vi)},correct?1450:2300);
 };
 actRef.current=act;
 const current=stages[stage];
 return <div className="screen taxi-demo"><BackButton onClick={onBack} label="К дополнительным играм"/><h1 className="screen-title">🚕 Такси Нячанг</h1><p className="taxi-subtitle">Пробная поездка · Отель → Пляж</p>
 <div className="taxi-stage"><canvas ref={canvas} width={W} height={H} aria-label="Вид сверху на движущееся такси и улицы города"/><div className="taxi-hud"><span>Этап {stage+1}/{stages.length}</span><span>⭐ {score}</span><span>⏱ {running&&!busy?remaining:'—'}</span></div></div>
 <div className="taxi-panel"><div className="taxi-prompt"><span>{running?current.label:'Пробная поездка'}</span><button onClick={()=>say(current.vi)} disabled={!running} aria-label="Повторить команду">🔊</button></div><strong>{running?(textMode?current.vi:'🎧 Слушай команду'):'Готов ехать?'}</strong><p>{status}</p>
 {!running?<button className="taxi-start" onClick={start}>🚕 Начать поездку</button>:<div className="taxi-actions"><button disabled={busy} onClick={()=>act('left')}>←<small>Налево</small></button><button disabled={busy} onClick={()=>act('straight')}>↑<small>Прямо</small></button><button disabled={busy} onClick={()=>act('right')}>→<small>Направо</small></button><button disabled={busy} onClick={()=>act('stop')}>■<small>Стоп</small></button><button disabled={busy} onClick={()=>act('go')}>▶<small>Ехать</small></button></div>}
 <label className="taxi-mode"><input type="checkbox" checked={!textMode} onChange={e=>setTextMode(!e.target.checked)}/> Только аудирование (скрыть текст)</label></div>
 <p className="taxi-disclaimer">Пять дорожных ситуаций. На ответ есть несколько секунд. Ошибок: {mistakes}. Это пока прототип, без полноценной карты улиц.</p></div>;
}
