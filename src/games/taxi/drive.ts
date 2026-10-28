export type Action = 'left' | 'right' | 'straight' | 'uturn';
export type Node = { id: string; x: number; y: number };
export const SIZE = 5, BLOCK = 300;
export const NODES: Node[] = Array.from({ length: SIZE * SIZE }, (_, i) => ({ id: `${i % SIZE},${Math.floor(i / SIZE)}`, x: i % SIZE * BLOCK, y: Math.floor(i / SIZE) * BLOCK }));
export const START = '0,4';
export const DESTINATIONS = [{ id: '4,0', name: 'Пляж', icon: '🏖' }, { id: '3,2', name: 'Рынок', icon: '🛍' }, { id: '1,0', name: 'Храм', icon: '⛩' }];
export const WORDS: Record<Action, { vi: string; ru: string; arrow: string }> = {
 left: { vi: 'Rẽ trái', ru: 'Налево', arrow: '←' }, right: { vi: 'Rẽ phải', ru: 'Направо', arrow: '→' }, straight: { vi: 'Đi thẳng', ru: 'Прямо', arrow: '↑' }, uturn: { vi: 'Quay đầu', ru: 'Разворот', arrow: '↶' },
};
export const node = (id: string) => NODES.find(n => n.id === id)!;
export function neighbours(id: string) {
 const p = node(id);
 // Every street is bidirectional. Boundary junctions are real T-junctions.
 return [[BLOCK, 0], [0, -BLOCK], [-BLOCK, 0], [0, BLOCK]].map(([x, y]) => NODES.find(n => n.x === p.x + x && n.y === p.y + y)).filter((n): n is Node => !!n).map(n => n.id);
}
export function shortestPath(from: string, goal: string): string[] {
 const queue = [from], previous = new Map<string, string | null>([[from, null]]);
 for (let i = 0; i < queue.length; i++) {
  const id = queue[i]; if (id === goal) break;
  for (const next of neighbours(id)) if (!previous.has(next)) { previous.set(next, id); queue.push(next); }
 }
 if (!previous.has(goal)) return [];
 const path: string[] = []; let id: string | null = goal;
 while (id !== null) { path.unshift(id); id = previous.get(id) ?? null; } return path;
}
export const headingBetween = (a: string, b: string) => { const p = node(a), q = node(b); return (Math.round(Math.atan2(q.x - p.x, p.y - q.y) / (Math.PI / 2)) + 4) % 4; };
export const turnFor = (incoming: number, outgoing: number): Action => (['straight', 'right', 'uturn', 'left'] as const)[(outgoing - incoming + 4) % 4];
export class Drive {
 phase: 'ready' | 'driving' | 'waiting' | 'finished' = 'ready';
 from = START; to = '0,3'; progress = 0; heading = 0; queued: Action | null = null;
 goal = DESTINATIONS[0].id; travelled = 0; reroutes = 0; revision = 0;
 message = 'Посмотри маршрут на карте. Выбери направление кнопкой перед перекрёстком.';
 get junction() { return this.phase === 'waiting' ? this.from : this.to; }
 get route() { return shortestPath(this.junction, this.goal); }
 get instruction(): Action { const path = this.route; return path.length > 1 ? turnFor(this.heading, headingBetween(path[0], path[1])) : 'straight'; }
 get remaining() { if (this.phase === 'finished') return 0; return (this.phase === 'waiting' ? 0 : BLOCK - this.progress) + Math.max(0, this.route.length - 1) * BLOCK; }
 get position() { const a = node(this.from), b = node(this.to), t = this.progress / BLOCK; return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, heading: this.heading * Math.PI / 2 }; }
 selectGoal(goal: string) { if (this.phase !== 'ready' || !DESTINATIONS.some(d => d.id === goal)) return; this.goal = goal; this.revision++; }
 start() { const goal = this.goal; Object.assign(this, new Drive()); this.goal = goal; this.phase = 'driving'; this.message = 'Едем к цели. Стрелка показывает ближайший манёвр.'; this.revision++; }
 input(action: Action) {
  if (this.phase !== 'driving' && this.phase !== 'waiting') return;
  if (this.phase === 'waiting') this.depart(action);
  else { this.queued = action; this.message = `${WORDS[action].vi} — выполняем на ближайшем перекрёстке.`; }
 }
 private depart(action: Action) {
  const current = this.from, incoming = this.heading;
  const outgoing = (incoming + ({ straight: 0, right: 1, uturn: 2, left: 3 }[action])) % 4;
  const next = neighbours(current).find(id => headingBetween(current, id) === outgoing);
  if (!next) { this.phase = 'waiting'; this.queued = null; this.message = 'В этом направлении дороги нет. Выбери другой поворот.'; this.revision++; return; }
  const preferred = shortestPath(current, this.goal)[1];
  this.to = next; this.heading = outgoing; this.progress = 0; this.queued = null; this.phase = 'driving'; this.revision++;
  if (next !== preferred) { this.reroutes++; this.message = 'Маршрут перестроен. Продолжаем к той же цели.'; }
  else this.message = 'Едем дальше. Следующий манёвр — на стрелке.';
 }
 update(seconds: number) {
  if (this.phase !== 'driving') return;
  let distance = Math.max(0, seconds) * 100;
  while (distance > 0 && this.phase === 'driving') {
   const step = Math.min(distance, BLOCK - this.progress); this.progress += step; this.travelled += step; distance -= step;
   if (this.progress < BLOCK) break;
   const chosen = this.queued ?? 'straight'; this.from = this.to; this.progress = 0;
   if (this.from === this.goal) { this.to = this.from; this.phase = 'finished'; this.message = '🏁 Вы приехали! Цель достигнута.'; this.revision++; break; }
   this.phase = 'waiting'; this.to = this.from; this.depart(chosen);
   if (this.phase === 'waiting' && chosen === 'straight') this.message = 'Прямо дороги нет. Выбери поворот — такси подождёт.';
  }
 }
 snapshot() { return { phase: this.phase, position: this.position, goal: this.goal, remaining: this.remaining, travelled: this.travelled, reroutes: this.reroutes, instruction: this.instruction, queued: this.queued, message: this.message, route: this.phase === 'waiting' ? this.route : [this.from, ...this.route], junction: this.junction, metresToTurn: this.phase === 'waiting' ? 0 : BLOCK - this.progress, revision: this.revision }; }
}
export type DriveView = ReturnType<Drive['snapshot']>;
