import { describe, expect, it } from 'vitest';
import { Drive, NODES, START, DESTINATIONS, shortestPath, neighbours, headingBetween, turnFor, node } from './drive';
describe('navigator street network', () => {
 it('connects every destination from every block in both directions', () => {
  for (const n of NODES) for (const d of DESTINATIONS) { const path = shortestPath(n.id, d.id); expect(path[0]).toBe(n.id); expect(path[path.length - 1]).toBe(d.id); for (let i = 1; i < path.length; i++) expect(neighbours(path[i - 1])).toContain(path[i]); }
 });
 it('starts with a route preview and finishes only at the actual goal', () => {
  const d = new Drive(); expect(d.phase).toBe('ready'); expect(d.snapshot().route[0]).toBe(START); d.start();
  for (let i = 0; i < 40 && d.phase !== 'finished'; i++) { d.input(d.instruction); d.update(3); }
  expect(d.phase).toBe('finished'); expect(d.from).toBe(d.goal); expect(d.reroutes).toBe(0);
 });
 it('continues straight on a missed turn and recalculates from its real street', () => {
  const d = new Drive(); d.start(); expect(d.instruction).toBe('right'); d.update(3);
  expect(d.from).toBe('0,3'); expect(d.to).toBe('0,2'); expect(d.reroutes).toBe(1); expect(d.message).toContain('перестроен'); expect(d.instruction).toBe('right');
 });
 it('waits at a T-junction with no road straight ahead, without losing', () => {
  const d = new Drive(); d.start(); d.update(12); expect(d.phase).toBe('waiting'); expect(d.from).toBe('0,0'); const p = d.position; d.update(1000); expect(d.position).toEqual(p);
  d.input('right'); expect(d.phase).toBe('driving'); expect(d.to).toBe('1,0');
 });
 it('executes a wrong valid turn and finds a new route, including U-turns', () => {
  const d = new Drive(); d.start(); d.input('uturn'); d.update(3); expect(d.to).toBe(START); expect(d.reroutes).toBe(1); expect(d.instruction).toBe('left');
  d.input('uturn'); d.update(3); expect(d.to).toBe('0,3'); expect(d.phase).toBe('driving');
 });
 it('can circle the same fixed blocks indefinitely and still navigate home', () => {
  const d = new Drive(); d.start(); d.update(3); d.input('right'); d.update(3);
  for (let i = 0; i < 160; i++) { d.input('right'); d.update(3); expect(d.phase).toBe('driving'); expect(NODES.some(n => n.id === d.from)).toBe(true); }
  expect(d.travelled).toBeGreaterThan(40000); expect(d.reroutes).toBeGreaterThan(10);
  for (let i = 0; i < 40 && d.phase !== 'finished'; i++) { d.input(d.instruction); d.update(3); } expect(d.phase).toBe('finished');
 });
 it('keeps movement on streets and only applies queued turns at junctions', () => {
  const d = new Drive(); d.start(); d.update(1); const p = d.position; d.input('right'); expect(d.position).toEqual(p); d.update(2); expect(d.heading).toBe(1); expect(d.position.x).toBe(0); expect(d.position.y).toBe(900); d.update(1); expect(d.position.x).toBe(100); expect(d.position.y).toBe(900);
 });
 it('supports all relative instructions and destination selection', () => {
  expect(turnFor(0, 3)).toBe('left'); expect(turnFor(3, 0)).toBe('right'); expect(turnFor(2, 0)).toBe('uturn'); expect(headingBetween('0,0','1,0')).toBe(1);
  const backwards = new Drive(); backwards.start(); backwards.goal = '1,0'; backwards.from = '1,2'; backwards.to = '1,3'; backwards.heading = 2; expect(backwards.instruction).toBe('uturn');
  const d = new Drive(); d.selectGoal('3,2'); d.start(); expect(d.goal).toBe('3,2'); expect(node(d.goal).x).toBe(900);
 });
});
