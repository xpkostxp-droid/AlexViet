// @vitest-environment node
import { describe, expect, it } from 'vitest';
import World from 'phaser/src/physics/arcade/World';
import Body from 'phaser/src/physics/arcade/Body';
import { Drive, COMMANDS } from './drive';
import { AGENTS, agentMotion, agentSpawn, taxiMotion } from './traffic';

// Real Phaser Arcade bodies and world, without a renderer. The same steering
// functions drive the browser scene. Game-over must come from world.overlap.
function simulation(decide) {
 const world = new World({ sys: { scale: { width: 420, height: 520 } } }, { debug: false, gravity: { x: 0, y: 0 } });
 const body = (point) => { const b = new Body(world); b.setCircle(18); b.position.set(point.x - 18, point.y - 18); b.updateCenter(); world.add(b); return b; };
 const taxi = body({ x: 0, y: 600 }), traffic = AGENTS.map(spec => ({ spec, body: body(agentSpawn(spec)) }));
 const d = new Drive(); d.start(); let collision = null, minGap = Infinity;
 try {
  for (let i = 0; i < 120 * 60; i++) {
   decide(d, i / 60); d.update(1 / 60);
   const m = taxiMotion(d, taxi.center); taxi.velocity.set(m.x, m.y);
   for (const a of traffic) { const v = agentMotion(d, a.spec, a.body.center, taxi.center, m.heading, i / 60); a.body.velocity.set(v.x, v.y); }
   world.step(1 / 60);
   for (const a of traffic) {
    minGap = Math.min(minGap, Math.hypot(a.body.center.x - taxi.center.x, a.body.center.y - taxi.center.y));
    if (world.overlap(taxi, a.body)) { collision = a.spec.role; d.collide(); break; }
   }
   if (d.phase === 'gameover' || d.phase === 'finished') break;
  }
  return { phase: d.phase, collision, minGap, score: d.score, step: d.step };
 } finally { world.destroy(); }
}
const correct = d => { if (d.prompt) d.input(d.command.action); };
describe('real Phaser Arcade collisions', () => {
 it('completes every manoeuvre without touching neighbouring cars', () => {
  const result = simulation(correct); expect(result).toMatchObject({ phase: 'finished', collision: null, score: COMMANDS.length }); expect(result.minGap).toBeGreaterThan(36);
 });
 it.each(['left', 'right'])('collides with the %s neighbour after a wrong turn', direction => {
  const result = simulation((d, t) => { if (direction === 'left' && t === 0) d.input('left'); else if (direction === 'right' && d.prompt && d.command.action === 'straight') d.input('right'); else correct(d); });
  expect(result.phase).toBe('gameover'); expect(result.collision).toBe(direction);
 });
 it('stops physically and is hit by the following car after a wrong Stop', () => {
  const result = simulation((d, t) => { if (t === 0) d.input('stop'); }); expect(result).toMatchObject({ phase: 'gameover', collision: 'rear' });
 });
 it('is hit by cross traffic after running red', () => {
  const result = simulation(d => { if (d.prompt && d.command.action !== 'stop') d.input(d.command.action); }); expect(result).toMatchObject({ phase: 'gameover', collision: 'cross' });
 });
 it('is hit from behind if it fails to start on green', () => {
  const result = simulation(d => { if (d.prompt && d.command.action !== 'go') d.input(d.command.action); }); expect(result).toMatchObject({ phase: 'gameover', collision: 'rear' });
 });
});
