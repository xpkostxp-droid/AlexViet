import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import './TaxiDemoScreen.css';

type Action = 'left' | 'right' | 'straight' | 'stop' | 'go' | 'fast';
const commands: { at: number; end: number; action: Action; vi: string; ru: string }[] = [
 { at: 80, end: 410, action: 'right', vi: 'Rẽ phải!', ru: 'На перекрёстке направо' },
 { at: 480, end: 650, action: 'stop', vi: 'Dừng lại!', ru: 'Остановись перед светофором' },
 { at: 730, end: 800, action: 'straight', vi: 'Đi thẳng!', ru: 'Продолжай прямо' },
 { at: 850, end: 970, action: 'fast', vi: 'Đi nhanh lên!', ru: 'Ускорься' },
 { at: 1030, end: 1320, action: 'left', vi: 'Rẽ trái!', ru: 'На перекрёстке налево' },
];
const R = 70, ARC = Math.PI * R / 2, TURN2 = 300 + ARC + 800, FINISH = TURN2 + ARC + 450;
// One world-space route. Camera and taxi share its position; neither resets at junctions.
function pose(distance: number) {
 if (distance < 300) return { x: 0, y: 300 - distance, angle: 0 };
 if (distance < 300 + ARC) { const a = (distance - 300) / R; return { x: R - R * Math.cos(a), y: -R * Math.sin(a), angle: a }; }
 if (distance < TURN2) return { x: R + distance - 300 - ARC, y: -R, angle: Math.PI / 2 };
 if (distance < TURN2 + ARC) { const a = (distance - TURN2) / R; return { x: 870 + R * Math.sin(a), y: -140 + R * Math.cos(a), angle: Math.PI / 2 - a }; }
 return { x: 940, y: -140 - (distance - TURN2 - ARC), angle: 0 };
}
// Keep the utterance alive, select the Vietnamese voice once voices load, and
// unlock speech from the Start gesture (required by mobile browsers).
let utterance: SpeechSynthesisUtterance | undefined;
function say(text: string, failed: () => void) {
 if (!('speechSynthesis' in window)) { failed(); return; }
 try {
  const synth = window.speechSynthesis; synth.cancel(); synth.resume();
  utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'vi-VN'; utterance.rate = .9;
  utterance.voice = synth.getVoices().find(v => v.lang.toLowerCase().startsWith('vi')) || null;
  utterance.onerror = e => { if (e.error !== 'canceled' && e.error !== 'interrupted') failed(); };
  synth.speak(utterance);
 } catch { failed(); }
}
type Ride = { distance: number; speed: number; target: number; active: boolean; step: number; accepted: boolean; stopTime: number; green: boolean; score: number; mistakes: number; go: boolean; greenTime: number; greenSince: number; crash: 'side' | 'rear' | null; crashTime: number; trafficTime: number };
const newRide = (): Ride => ({ distance: 0, speed: 75, target: 75, active: false, step: -1, accepted: false, stopTime: 0, green: false, score: 0, mistakes: 0, go: false, greenTime: 0, greenSince: 0, crash: null, crashTime: 0, trafficTime: 0 });
function render(ctx: CanvasRenderingContext2D, ride: Ride) {
 const p = pose(ride.distance);
 ctx.fillStyle = '#83c56f'; ctx.fillRect(0, 0, 390, 490);
 ctx.save(); ctx.translate(195, 340); ctx.rotate(-p.angle); ctx.translate(-p.x, -p.y);
 // Fixed buildings and streets remain in the same world throughout the ride.
 for (let x = -550; x <= 1500; x += 230) for (let y = -950; y <= 850; y += 230) {
  if (Math.abs(x) < 130 || Math.abs(x - 940) < 130 || Math.abs(y + 70) < 150) continue;
  ctx.fillStyle = '#e9dfbc'; ctx.fillRect(x - 76, y - 76, 152, 152);
  ctx.fillStyle = ['#e7b27e', '#78b8c8', '#d5a5c8'][Math.abs(x + y) % 3]; ctx.fillRect(x - 60, y - 60, 110, 100);
  ctx.fillStyle = '#d7f1ef'; for (let k = 0; k < 3; k++) ctx.fillRect(x - 45 + k * 30, y - 40, 17, 24);
  ctx.fillStyle = '#26895c'; ctx.beginPath(); ctx.arc(x + 60, y + 55, 19, 0, Math.PI * 2); ctx.fill();
 }
 const road = (width: number, color: string) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(0, -1000); ctx.moveTo(-1000, -70); ctx.lineTo(1800, -70); ctx.moveTo(940, 1000); ctx.lineTo(940, -1200); ctx.stroke(); };
 road(170, '#d4d1bb'); road(150, '#4d5a63');
 ctx.strokeStyle = '#e7d69b'; ctx.lineWidth = 2; ctx.setLineDash([25, 25]);
 for (const offset of [-25, 25]) { ctx.beginPath(); ctx.moveTo(offset, 900); ctx.lineTo(offset, 20); ctx.moveTo(offset, -160); ctx.lineTo(offset, -900); ctx.moveTo(100, -70 + offset); ctx.lineTo(840, -70 + offset); ctx.moveTo(940 + offset, -170); ctx.lineTo(940 + offset, -1000); ctx.stroke(); } ctx.setLineDash([]);
 const signalX = pose(650).x + 40;
 ctx.fillStyle = '#fff5d6'; ctx.fillRect(signalX, -141, 5, 142);
 ctx.fillStyle = '#273b40'; ctx.fillRect(signalX + 12, -181, 46, 22);
 ctx.fillStyle = ride.green ? '#5c2e2e' : '#ff5050'; ctx.beginPath(); ctx.arc(signalX + 24, -170, 7, 0, 7); ctx.fill();
 ctx.fillStyle = ride.green ? '#40ee88' : '#285b40'; ctx.beginPath(); ctx.arc(signalX + 46, -170, 7, 0, 7); ctx.fill();
 ctx.fillStyle = '#173f4b'; ctx.font = 'bold 18px system-ui'; ctx.fillText('ОТЕЛЬ', -220, 320); ctx.fillText('ПЛЯЖ 🏖', 1010, -580);
 // Neighbouring cars follow the same route in adjacent lanes.
 const traffic = (x: number, y: number, angle: number, color: string) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.fillStyle = '#25374155'; ctx.fillRect(-14, -26, 31, 58);
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-14, -28, 28, 56, 7); ctx.fill();
  ctx.fillStyle = '#b8e5ef'; ctx.fillRect(-10, -18, 20, 14); ctx.fillRect(-10, 12, 20, 10); ctx.restore();
 };
 for (const [offset, lane, color] of [[100, 50, '#e4e8ec'], [-110, -50, '#db6675'], [300, -50, '#72b6dc']] as const) {
  const t = pose(Math.max(0, ride.distance + offset + Math.sin(ride.trafficTime * .3) * 30));
  traffic(t.x + Math.cos(t.angle) * lane, t.y + Math.sin(t.angle) * lane, t.angle, color);
 }
 const crossing = pose(690);
 // Cross street and crossing traffic at the signal are fixed world objects.
 ctx.fillStyle = '#4d5a63'; ctx.fillRect(crossing.x - 65, -430, 130, 720);
 const sideProgress = ride.crash === 'side' ? Math.min(1, ride.crashTime / .6) : 0;
 const sideY = ride.crash === 'side' ? -250 + sideProgress * 145 : -290 + (ride.trafficTime * 45 % 100);
 traffic(crossing.x, sideY, Math.PI, '#d35d64');
 const rearGap = ride.crash === 'rear' ? 155 - Math.min(1, ride.crashTime / .6) * 96 : ride.green && !ride.go ? 155 - ride.greenTime * 70 : 180;
 const rear = pose(Math.max(0, ride.distance - rearGap)); traffic(rear.x, rear.y, rear.angle, '#669bdf');
 // Taxi stays in camera focus while the real map rotates around it.
 ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
 ctx.fillStyle = '#263c4666'; ctx.fillRect(-15, -27, 34, 64);
 ctx.fillStyle = '#f5bd2b'; ctx.beginPath(); ctx.roundRect(-16, -31, 32, 62, 8); ctx.fill();
 ctx.fillStyle = '#286f86'; ctx.fillRect(-11, -18, 22, 17); ctx.fillRect(-11, 15, 22, 10);
 ctx.fillStyle = '#fff8d6'; ctx.fillRect(-11, -29, 8, 4); ctx.fillRect(3, -29, 8, 4); ctx.fillRect(-11, 2, 22, 10);
 ctx.fillStyle = '#263e48'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('TAXI', 0, 10);
 ctx.restore(); ctx.restore();
 if (ride.crash && ride.crashTime >= .6) { ctx.fillStyle = '#351b21bb'; ctx.fillRect(0, 0, 390, 490); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 28px system-ui'; ctx.fillText('💥 Авария', 195, 200); ctx.font = '17px system-ui'; ctx.fillText(ride.crash === 'side' ? 'Проезд на красный' : 'Не тронулся на зелёный', 195, 235); }
}
export function TaxiDemoScreen({ onBack }: { onBack: () => void }) {
 const canvas = useRef<HTMLCanvasElement>(null), ride = useRef(newRide());
 const [audioError, setAudioError] = useState(false);
 const speak = (text: string) => say(text, () => setAudioError(true));
 const [view, setView] = useState(newRide()), [textMode, setTextMode] = useState(true), [status, setStatus] = useState('Команды появляются по пути. Выбери действие — такси выполнит его на дороге.');
 useEffect(() => {
  const ctx = canvas.current?.getContext('2d'); if (!ctx) return;
  if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  let raf = 0, last = 0, uiTime = 0;
  const frame = (now: number) => {
   const dt = Math.min((now - last) / 1000 || 0, .05); last = now; const r = ride.current;
   if (r.crash && r.crashTime < .6) r.crashTime += dt;
   if (r.active) {
    r.trafficTime += dt;
    const crash = (kind: 'side' | 'rear') => { r.crash = kind; r.crashTime = 0; r.active = false; r.speed = 0; setStatus(kind === 'side' ? '💥 Не остановился на красный: удар сбоку. Игра окончена.' : '💥 Не тронулся за секунду: удар сзади. Игра окончена.'); };
    const command = commands[r.step];
    let target = r.target;
    // Brake to the actual stop point, and wait for an answer without skipping the road event.
    const limit = command && !r.accepted ? command.action === 'stop' ? Infinity : command.action === 'right' ? 295 : command.action === 'left' ? TURN2 - 5 : command.end : Infinity;
    const stopAt = command?.action === 'stop' && r.accepted && (!r.green || !r.go) ? 650 : limit;
    target = Math.min(target, Math.sqrt(Math.max(0, stopAt - r.distance) * 110));
    r.speed += Math.sign(target - r.speed) * Math.min(Math.abs(target - r.speed), dt * 70);
    r.distance = Math.min(stopAt, r.distance + r.speed * dt);
    if (command?.action === 'stop' && !r.accepted && r.distance >= 690) crash('side');
    if (command?.action === 'stop' && r.accepted && r.distance >= 649.9 && !r.green) {
     r.speed = 0; r.stopTime += dt;
     setStatus('Стоим перед светофором…');
     if (r.stopTime >= 1) { r.green = true; r.greenTime = 0; r.greenSince = now; setStatus('Зелёный! Нажми «Вперёд» за секунду.'); speak('Đi tiếp!'); }
    }
    if (r.green && !r.go && r.active) { r.greenTime = (now - r.greenSince) / 1000; if (r.greenTime > 1) crash('rear'); }
    const complete = command && r.accepted && (command.action === 'stop' ? r.go : r.distance >= command.end);
    const next = r.step + 1;
    if ((!command || complete) && next < commands.length && r.distance >= commands[next].at) {
     r.step = next; r.accepted = false; setStatus(commands[next].ru); speak(commands[next].vi);
    }
    if (r.distance >= FINISH) { r.active = false; r.speed = 0; setStatus('🏁 Приехали на пляж! Поездка завершена.'); }
   }
   render(ctx, r);
   if (now - uiTime > 100) { setView({ ...r }); uiTime = now; }
   raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
 }, []);
 const start = () => { setAudioError(false); ride.current = { ...newRide(), active: true, step: 0 }; speak(commands[0].vi); setView({ ...ride.current }); setStatus('Выезжаем. На первом перекрёстке поверни направо.'); };
 const act = (action: Action) => {
  const r = ride.current, command = commands[r.step]; if (!r.active || !command) return;
  if (r.green && !r.go) { if (action === 'go') { r.go = true; setStatus('Едем!'); setView({ ...r }); } return; }
  if (r.accepted) return;
  if (action === 'stop' && command.action === 'stop' && r.distance > 650) {
   r.crash = 'side'; r.crashTime = 0; r.active = false; r.speed = 0;
   setStatus('💥 Слишком поздно: проезд стоп-линии на красный, удар сбоку. Игра окончена.'); setView({ ...r }); return;
  }
  if (action !== command.action) { r.mistakes++; setStatus('Попробуй ещё раз: ' + command.ru); }
  else { r.accepted = true; r.score++; if (action === 'fast') r.target = 125; setStatus(action === 'stop' ? 'Тормозим перед стоп-линией…' : action === 'right' || action === 'left' ? 'Принято. Поворачиваем на ближайшем перекрёстке.' : action === 'fast' ? 'Ускоряемся — следи за движением карты.' : 'Едем прямо.'); }
  setView({ ...r });
 };
 const command = commands[view.step], greenPrompt = view.green && !view.go, waiting = view.active && !!command && (!view.accepted || greenPrompt);
 return <div className="screen taxi-demo"><BackButton onClick={onBack} label="К дополнительным играм"/><h1 className="screen-title">🚕 Такси Нячанг</h1><p className="taxi-subtitle">Одна поездка · Отель → Пляж</p>
  <div className="taxi-stage"><canvas ref={canvas} width={390} height={490} aria-label="Непрерывная поездка такси по карте города"/><div className="taxi-hud"><span>{Math.round(Math.min(100, view.distance / FINISH * 100))}% пути</span><span>⭐ {view.score}</span><span>{Math.round(view.active ? view.speed * .4 : 0)} км/ч</span></div></div>
  <div className="taxi-panel"><div className="taxi-prompt"><span>{view.active ? waiting ? 'Пассажир просит' : 'В пути' : 'Отель → Пляж'}</span><button onClick={() => command && speak(greenPrompt ? 'Đi tiếp!' : command.vi)} disabled={!waiting} aria-label="Повторить команду">🔊</button></div><strong>{waiting ? textMode ? greenPrompt ? 'Đi tiếp!' : command.vi : '🎧 Слушай команду' : view.active ? '🚕 Едем…' : view.crash ? '💥 Игра окончена' : view.distance >= FINISH ? '🏖 Приехали!' : 'Готов ехать?'}</strong><p role="status">{status}</p>{audioError && <p role="alert">Озвучка недоступна. Проверь звук и наличие вьетнамского голоса на устройстве; нажми 🔊 для повтора.</p>}
  {!view.active ? <button className="taxi-start" onClick={start}>🚕 {view.distance ? 'Ещё одна поездка' : 'Начать поездку'}</button> : <div className="taxi-actions">{([['left','←','Налево'],['straight','↑','Прямо'],['right','→','Направо'],['stop','■','Стоп'],[greenPrompt ? 'go' : 'fast',greenPrompt ? '▶' : '»',greenPrompt ? 'Вперёд' : 'Быстрее']] as const).map(([action, icon, label]) => <button key={action} disabled={!waiting} onClick={() => act(action)}>{icon}<small>{label}</small></button>)}</div>}
  <label className="taxi-mode"><input type="checkbox" checked={!textMode} onChange={e => setTextMode(!e.target.checked)}/> Только аудирование (скрыть текст)</label></div><p className="taxi-disclaimer">Поворот выполняется на перекрёстке. На красном остановись. После команды на зелёный нажми «Вперёд» за секунду, иначе авария. Ошибок: {view.mistakes}.</p></div>;
}
