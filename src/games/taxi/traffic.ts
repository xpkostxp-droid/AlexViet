import { Drive, FINISH, roadPose } from './drive';
export type Position = { x: number; y: number };
export const AGENTS = [
 { role: 'left', offset: -10, lane: -58, texture: 'coral' },
 { role: 'right', offset: -10, lane: 58, texture: 'white' },
 { role: 'rear', offset: -125, lane: 0, texture: 'blue' },
 { role: 'cross', offset: 0, lane: 0, texture: 'coral' },
] as const;
export type AgentSpec = typeof AGENTS[number];
export function pursue(from: Position, target: Position, max: number) {
 const dx = target.x - from.x, dy = target.y - from.y, length = Math.hypot(dx, dy), speed = Math.min(max, length * 7);
 return { x: length ? dx / length * speed : 0, y: length ? dy / length * speed : 0 };
}
export function taxiMotion(d: Drive, position: Position) {
 if (d.phase === 'crashing') {
  const turn = d.deviation === 'left' ? -Math.PI / 2 : d.deviation === 'right' ? Math.PI / 2 : d.deviation === 'uturn' ? Math.PI : 0;
  const heading = d.deviationHeading + turn * Math.min(1, d.deviationTime / .55);
  return { x: Math.sin(heading) * d.speed, y: -Math.cos(heading) * d.speed, heading };
 }
 const p = roadPose(d.distance);
 const velocity = d.phase === 'driving' && d.speed > .1 ? pursue(position, roadPose(Math.min(FINISH, d.distance + d.speed * .07)), d.speed * 1.3) : { x: 0, y: 0 };
 return { ...velocity, heading: p.heading };
}
export function agentSpawn(agent: AgentSpec) {
 if (agent.role === 'cross') return { x: 480, y: -220 };
 const p = roadPose(agent.offset); return { x: p.x + agent.lane, y: p.y };
}
export function agentMotion(d: Drive, agent: AgentSpec, position: Position, taxi: Position, heading: number, elapsed: number) {
 if (d.phase === 'crashing' && d.threat === agent.role) {
  const velocity = pursue(position, { x: taxi.x + Math.sin(heading) * d.speed * .12, y: taxi.y - Math.cos(heading) * d.speed * .12 }, 290);
  return { ...velocity, heading: Math.atan2(velocity.x, -velocity.y) };
 }
 if (agent.role === 'cross') return { ...pursue(position, { x: 480, y: d.green ? -235 : -240 + Math.sin(elapsed * .7) * 30 }, 65), heading: Math.PI };
 const p = roadPose(d.distance + agent.offset);
 return { ...pursue(position, { x: p.x + Math.cos(p.heading) * agent.lane, y: p.y + Math.sin(p.heading) * agent.lane }, d.targetSpeed * 1.5), heading: p.heading };
}
