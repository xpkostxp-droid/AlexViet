import { useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { Action, COMMANDS, Drive, EAST, FINISH, STOP } from '../games/taxi/drive';
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
 const command = COMMANDS[view.step];
 const active = view.phase === 'driving', ended = view.phase === 'gameover' || view.phase === 'finished';
 const signalVisible = view.distance > EAST + 65 && view.distance < STOP + 170;
 const actions: [Action, string, string][] = [['left', '←', 'Налево'], ['straight', '↑', 'Прямо'], ['right', '→', 'Направо'], ['stop', '■', 'Стоп'], ['go', '▶', 'Вперёд'], ['fast', '»', 'Быстрее']];
 if (view.uturnVisible) actions.push(['uturn', '↶', 'Разворот']);
 return <div className="screen taxi-demo">
  <BackButton onClick={onBack} label="К дополнительным играм"/>
  <div className="taxi-heading"><div><h1 className="screen-title">🚕 Такси Нячанг</h1><p className="taxi-subtitle">Отель → Пляж · слушай и управляй</p></div><span className="taxi-engine-tag">Phaser</span></div>
  <div className="taxi-stage">
   <div ref={mount} className="taxi-engine" role="img" aria-label="Дорога, такси, соседние машины и светофоры"/>
   <div className="taxi-hud"><span>{Math.round(view.distance / FINISH * 100)}% пути</span><span>⭐ {view.score}</span><span>{Math.round(view.speed * .4)} км/ч</span></div>
   {signalVisible && <div className={'taxi-signal ' + (view.green ? 'green' : 'red')}><i/>{view.green ? 'ЗЕЛЁНЫЙ' : 'КРАСНЫЙ'}{view.green && command.action === 'go' && !view.accepted && active && <b>{view.reaction.toFixed(1)} с</b>}</div>}
   {(ended || view.phase === 'crashing') && <div className="taxi-result"><strong>{view.phase === 'finished' ? '🏖 Приехали!' : view.phase === 'crashing' ? '⚠ Опасный манёвр' : '💥 Авария'}</strong><span>{view.message}</span></div>}
  </div>
  <div className="taxi-panel">
   <div className="taxi-prompt"><span>{active && view.prompt ? 'Пассажир просит' : active ? 'В пути' : ended ? 'Поездка завершена' : 'Готов к поездке?'}</span><button onClick={() => engine.current?.scene.repeat()} disabled={!active || !view.prompt} aria-label="Повторить команду">🔊</button></div>
   <strong>{active && view.prompt ? textMode ? command.vi : '🎧 Слушай команду' : active ? '🚕 Следи за дорогой' : view.phase === 'finished' ? 'Доехали до пляжа' : view.phase === 'gameover' ? 'Попробуем ещё раз?' : 'Поехали?'}</strong>
   <p role="status">{error || view.message}</p>{audioError && <p className="taxi-audio-error" role="alert">{audioError}</p>}
   {!active && view.phase !== 'crashing' ? <button className="taxi-start" disabled={!ready || !!error} onClick={() => engine.current?.scene.startRide()}>{!ready ? 'Загружаем игру…' : ended ? '🚕 Новая поездка' : '🚕 Начать поездку'}</button> : <div className="taxi-actions">{actions.map(([action, icon, label]) => <button key={action} disabled={!active} onClick={() => engine.current?.scene.action(action)}><span>{icon}</span><small>{label}</small></button>)}</div>}
   <label className="taxi-mode"><input type="checkbox" checked={!textMode} onChange={e => setTextMode(!e.target.checked)}/> Только аудирование — скрыть команду</label>
  </div>
  <p className="taxi-disclaimer">Кнопки управляют машиной. Повороты — на перекрёстках, разворот — у знака. На красный остановись, на зелёный тронься за секунду.</p>
 </div>;
}
