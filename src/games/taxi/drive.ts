export type Action = 'left' | 'right' | 'straight' | 'stop' | 'go' | 'fast' | 'uturn';
export type Threat = 'left' | 'right' | 'rear' | 'cross';
export type Point = { x: number; y: number; heading: number };
const R = 80, ARC = Math.PI * R / 2;
export const RIGHT = 520;
export const EAST = RIGHT + ARC;
export const STOP = EAST + 320;
export const LEFT = EAST + 940;
export const NORTH = LEFT + ARC;
export const UTURN = NORTH + 520;
export const SOUTH = UTURN + Math.PI * 75;
export const FINISH = SOUTH + 650;
export function roadPose(s: number): Point {
 if (s < RIGHT) return { x: 0, y: 600 - s, heading: 0 };
 if (s < EAST) { const a = (s - RIGHT) / R; return { x: 80 - 80 * Math.cos(a), y: 80 - 80 * Math.sin(a), heading: a }; }
 if (s < LEFT) return { x: 80 + s - EAST, y: 0, heading: Math.PI / 2 };
 if (s < NORTH) { const a = (s - LEFT) / R; return { x: 1020 + 80 * Math.sin(a), y: -80 + 80 * Math.cos(a), heading: Math.PI / 2 - a }; }
 if (s < UTURN) return { x: 1100, y: -80 - (s - NORTH), heading: 0 };
 if (s < SOUTH) { const a = (s - UTURN) / 75; return { x: 1175 - 75 * Math.cos(a), y: -600 - 75 * Math.sin(a), heading: a }; }
 return { x: 1250, y: -600 + s - SOUTH, heading: Math.PI };
}
export const COMMANDS = [
 { at: 0, end: EAST + 45, action: 'right', vi: 'Rẽ phải!', ru: 'На перекрёстке направо', mark: RIGHT },
 { at: EAST + 110, end: STOP, action: 'stop', vi: 'Dừng lại!', ru: 'Остановись перед красным светофором', mark: STOP },
 { at: STOP, end: STOP + 55, action: 'go', vi: 'Đi tiếp!', ru: 'Зелёный! Вперёд — одна секунда на старт', mark: STOP },
 { at: STOP + 100, end: STOP + 200, action: 'straight', vi: 'Đi thẳng!', ru: 'Продолжай прямо', mark: STOP + 210 },
 { at: STOP + 260, end: STOP + 360, action: 'fast', vi: 'Đi nhanh lên!', ru: 'Ускорься', mark: STOP + 380 },
 { at: LEFT - 180, end: NORTH + 25, action: 'left', vi: 'Rẽ trái!', ru: 'На перекрёстке налево', mark: LEFT },
 { at: UTURN - 250, end: SOUTH + 40, action: 'uturn', vi: 'Quay đầu!', ru: 'Развернись в обозначенном месте', mark: UTURN },
] as const;
export type DriveView = ReturnType<Drive['snapshot']>;
/** Road decisions and speed control; collisions are reported by Phaser Arcade Physics. */
export class Drive {
 phase: 'ready' | 'driving' | 'crashing' | 'gameover' | 'finished' = 'ready';
 distance = 0; speed = 0; targetSpeed = 90; step = 0; accepted = false; score = 0;
 green = false; stoppedFor = 0; greenElapsed = 0; threat: Threat | null = null;
 deviation: Action | null = null; deviationTime = 0; deviationHeading = 0;
 message = 'Слушай пассажира. Кнопки управляют машиной: ошибка может закончиться аварией.';
 get command() { return COMMANDS[this.step]; }
 get prompt() { return this.phase === 'driving' && !this.accepted && this.distance >= this.command.at; }
 start() { Object.assign(this, new Drive()); this.phase = 'driving'; this.speed = 90; this.message = this.command.ru; }
 fail(threat: Threat, action: Action, message: string) {
  if (this.phase !== 'driving') return;
  this.phase = 'crashing'; this.threat = threat; this.deviation = action;
  this.deviationHeading = roadPose(this.distance).heading; this.deviationTime = 0; this.message = message;
 }
 input(action: Action) {
  if (this.phase !== 'driving') return;
  // Buttons never silently ignore a dangerous manoeuvre, even between commands.
  if (!this.prompt || action !== this.command.action) {
   if (action === 'stop') this.fail('rear', action, 'Резкая остановка в потоке: машина сзади не успевает затормозить.');
   else if (action === 'left' || action === 'right' || action === 'uturn') this.fail(action === 'left' ? 'left' : 'right', action, 'Опасный манёвр вне маршрута: столкновение с соседней машиной.');
   else if (this.command.action === 'stop' || (this.command.action === 'go' && !this.green)) this.fail('cross', action, 'Проезд на красный: поперечный поток.');
   else this.fail('right', action, 'Неверная команда: пересечение с соседним потоком.');
   return;
  }
  if (action === 'stop' && this.distance > STOP + 8) { this.fail('cross', action, 'Слишком поздно: стоп-линия уже позади.'); return; }
  this.accepted = true; this.score++;
  if (action === 'fast') this.targetSpeed = 135;
  if (action === 'go') this.targetSpeed = 90;
  this.message = action === 'stop' ? 'Тормозим к стоп-линии…' : action === 'fast' ? 'Ускоряемся.' : action === 'go' ? 'Трогаемся на зелёный.' : 'Принято. Следи за дорогой.';
 }
 update(seconds: number) {
  if (this.phase === 'crashing') { this.deviationTime += seconds; this.speed = this.deviation === 'stop' || this.threat === 'rear' ? Math.max(0, this.speed - seconds * 300) : Math.max(65, this.speed); return; }
  if (this.phase !== 'driving') return;
  const c = this.command; let target = this.targetSpeed;
  if (c.action === 'stop' && this.accepted) target = Math.min(target, Math.sqrt(Math.max(0, STOP - this.distance) * 130));
  if (c.action === 'go' && !this.accepted) target = 0;
  const curve = (this.distance >= RIGHT - 65 && this.distance < EAST) || (this.distance >= LEFT - 65 && this.distance < NORTH) || (this.distance >= UTURN - 65 && this.distance < SOUTH);
  if (curve) target = Math.min(target, 70);
  this.speed += Math.sign(target - this.speed) * Math.min(Math.abs(target - this.speed), seconds * 85);
  this.distance += this.speed * seconds;
  if (c.action === 'stop' && this.accepted && this.distance >= STOP - .5) {
   this.distance = STOP; this.speed = 0; this.stoppedFor += seconds; this.message = 'Красный. Стоим перед стоп-линией.';
   if (this.stoppedFor >= 1) { this.green = true; this.step++; this.accepted = false; this.greenElapsed = 0; this.message = this.command.ru; }
   return;
  }
  if (c.action === 'go' && !this.accepted) { this.greenElapsed += seconds; if (this.greenElapsed > 1) this.fail('rear', 'stop', 'Не тронулся на зелёный за секунду: машина сзади приближается.'); }
  if (!this.accepted && this.distance >= c.mark + (c.action === 'stop' ? 35 : 2)) {
   this.fail(c.action === 'stop' ? 'cross' : 'right', 'straight', c.action === 'stop' ? 'Проезд на красный: поперечный поток.' : 'Пропущен манёвр: выезд в другой поток.');
  }
  if (this.phase === 'driving' && this.accepted && this.distance >= c.end && this.step < COMMANDS.length - 1) { this.step++; this.accepted = false; this.message = this.distance >= this.command.at ? this.command.ru : 'Едем дальше. Следующая команда появится по дороге.'; }
  if (this.phase === 'driving' && this.distance >= FINISH) { this.distance = FINISH; this.phase = 'finished'; this.speed = 0; this.message = '🏖 Приехали на пляж!'; }
 }
 collide() { if (this.phase === 'driving' || this.phase === 'crashing') { this.phase = 'gameover'; this.speed = 0; this.message = '💥 Авария. ' + this.message; } }
 snapshot() { return { phase: this.phase, distance: this.distance, speed: this.speed, step: this.step, prompt: this.prompt, accepted: this.accepted, score: this.score, green: this.green, reaction: Math.max(0, 1 - this.greenElapsed), message: this.message, uturnVisible: this.distance >= UTURN - 330 }; }
}
