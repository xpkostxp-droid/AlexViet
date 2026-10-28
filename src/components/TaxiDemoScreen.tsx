import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { Action, DESTINATIONS, Drive, WORDS } from '../games/taxi/drive';
import type { createTaxiGame } from '../games/taxi/TaxiScene';
import './TaxiDemoScreen.css';

type Engine = ReturnType<typeof createTaxiGame>;
export function TaxiDemoScreen({ onBack }: { onBack: () => void }) {
 const mount = useRef<HTMLDivElement>(null), engine = useRef<Engine>();
 const voice = useRef<SpeechSynthesisUtterance>();
 const [view, setView] = useState(new Drive().snapshot()), [ready, setReady] = useState(false), [error, setError] = useState(''), [audioError, setAudioError] = useState(''), [textMode, setTextMode] = useState(true);
 const speak = (text: string) => {
  if (!('speechSynthesis' in window)) { setAudioError('Озвучка недоступна в этом браузере.'); return; }
  try {
   const synth = window.speechSynthesis; synth.cancel(); synth.resume();
   const u = new SpeechSynthesisUtterance(text); voice.current = u; u.lang = 'vi-VN'; u.rate = .9;
   u.voice = synth.getVoices().find(v => v.lang.toLowerCase().startsWith('vi')) || null;
   u.onerror = e => { if (e.error !== 'canceled' && e.error !== 'interrupted') setAudioError('Не удалось озвучить команду. Проверь звук и вьетнамский голос на устройстве.'); };
   u.onstart = () => setAudioError(''); synth.speak(u);
  } catch { setAudioError('Не удалось включить озвучку. Нажми 🔊 для повтора.'); }
 };
 useEffect(() => {
  let disposed = false;
  if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  // Phaser is loaded only for Taxi; all lessons and other games keep their bundle.
  import('../games/taxi/TaxiScene').then(({ createTaxiGame }) => {
   if (disposed || !mount.current) return;
   engine.current = createTaxiGame(mount.current, snapshot => { if (!disposed) setView(snapshot); }, speak, () => { if (!disposed) setReady(true); });
  }).catch(() => { if (!disposed) setError('Не удалось загрузить игру. Обнови страницу и попробуй снова.'); });
  return () => { disposed = true; engine.current?.game.destroy(true); engine.current = undefined; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
 }, []);
 const active = view.phase === 'driving' || view.phase === 'waiting', ended = view.phase === 'finished';
 const instruction = WORDS[view.instruction];
 const actions: Action[] = ['left', 'straight', 'right', 'uturn'];
 const destination = DESTINATIONS.find(d => d.id === view.goal)!;
 return <div className="screen taxi-demo">
  <BackButton onClick={onBack} label="К дополнительным играм"/>
  <div className="taxi-heading"><div><h1 className="screen-title">🚕 Такси Нячанг</h1><p className="taxi-subtitle">Навигатор · доедь до цели</p></div></div>
  {!active && !ended && <label className="taxi-destination">Куда едем? <select value={view.goal} disabled={!ready} onChange={e => engine.current?.scene.selectGoal(e.target.value)}>{DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}</select></label>}
  <div className="taxi-stage">
   <div ref={mount} className="taxi-engine" role="img" aria-label="Постоянная карта кварталов с маршрутом от отеля до цели"/>
   <div className="taxi-hud"><span>{destination.icon} {destination.name}</span><span>{Math.round(view.remaining)} м до цели</span></div>
   {active && <div className="taxi-navigation"><b aria-label={instruction.ru}>{instruction.arrow}</b><div><strong>{view.phase === 'waiting' ? 'Выбери направление' : `Через ${Math.round(view.metresToTurn)} м`}</strong><span>{instruction.ru}</span></div></div>}
   {ended && <div className="taxi-result"><strong>🏁 Вы приехали!</strong><span>{destination.name} · {Math.round(view.travelled)} м пути</span></div>}
   <button className="taxi-map-button" onClick={() => engine.current?.scene.toggleMap()} disabled={!ready}>🗺 Вся карта / ближе</button>
  </div>
  <div className="taxi-panel">
   <p role="status">{error || view.message}</p>
   {!active ? <button className="taxi-start" disabled={!ready || !!error} onClick={() => engine.current?.scene.startRide()}>{!ready ? 'Загружаем карту…' : ended ? '🚕 Ещё одна поездка' : '🚕 Поехали'}</button> : <div className="taxi-actions taxi-navigator-actions">{actions.map(action => <button key={action} onClick={() => engine.current?.scene.action(action)} aria-pressed={view.queued === action}><span>{WORDS[action].vi}</span>{textMode && <small>{WORDS[action].ru}</small>}</button>)}</div>}
   {active && <p className="taxi-queued">{view.queued ? `Выбрано: ${WORDS[view.queued].vi}` : 'Без выбора едем прямо'}</p>}
   <label className="taxi-mode"><input type="checkbox" checked={textMode} onChange={e => setTextMode(e.target.checked)}/> Русские подсказки на кнопках</label>
   <button className="taxi-voice" onClick={() => engine.current?.scene.repeat()} disabled={!active}>🔊 Озвучить ближайший манёвр</button>
   {audioError && <p className="taxi-audio-error" role="alert">{audioError}</p>}
  </div>
  <p className="taxi-disclaimer">Пропустил поворот — маршрут перестроится. Если прямо дороги нет, такси ждёт выбора. Можно ездить сколько угодно: поездка закончится у цели.</p>
 </div>;
}
