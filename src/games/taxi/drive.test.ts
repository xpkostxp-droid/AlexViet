import { describe, expect, it } from 'vitest';
import { Drive, EAST, FINISH, LEFT, NORTH, RIGHT, STOP, UTURN, SOUTH, roadPose } from './drive';
const advance = (d: Drive, until: () => boolean, limit = 100) => { for (let i = 0; i < limit * 60 && !until(); i++) d.update(1 / 60); expect(until()).toBe(true); };
function toRed() { const d = new Drive(); d.start(); d.input('right'); advance(d, () => d.step === 1 && d.prompt); return d; }
function toGreen() { const d = toRed(); d.input('stop'); advance(d, () => d.green); return d; }
describe('taxi road controller', () => {
 it('keeps position and heading continuous through both junctions and the U-turn', () => {
  for (const s of [RIGHT, EAST, LEFT, NORTH, UTURN, SOUTH]) {
   const a = roadPose(s - .001), b = roadPose(s + .001);
   expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(.003);
   expect(Math.abs(a.heading - b.heading)).toBeLessThan(.001);
  }
  expect(roadPose(SOUTH).heading).toBe(Math.PI);
 });
 it('completes the physical route including red, green, acceleration and U-turn', () => {
  const d = toGreen(); expect(d.speed).toBe(0); expect(d.distance).toBe(STOP); expect(d.stoppedFor).toBeGreaterThanOrEqual(1);
  d.update(.7); d.input('go'); expect(d.phase).toBe('driving');
  for (const action of ['straight', 'fast', 'left', 'uturn'] as const) {
   advance(d, () => d.prompt && d.command.action === action); d.input(action);
   expect(d.phase).toBe('driving');
  }
  advance(d, () => d.phase === 'finished'); expect(d.distance).toBe(FINISH); expect(d.score).toBe(7);
 });
 it('executes a wrong turn immediately and waits for a physics collision to end', () => {
  const d = new Drive(); d.start(); d.input('left');
  expect(d.phase).toBe('crashing'); expect(d.threat).toBe('left'); expect(d.deviation).toBe('left');
  d.update(3); expect(d.phase).toBe('crashing'); d.collide(); expect(d.phase).toBe('gameover');
 });
 it('brakes on an incorrect Stop, exposing the taxi to rear traffic', () => {
  const d = new Drive(); d.start(); d.input('stop'); d.update(.5);
  expect(d.speed).toBe(0); expect(d.threat).toBe('rear'); expect(d.phase).toBe('crashing');
 });
 it('does not auto-stop a taxi that drives through the red light', () => {
  const d = toRed(); advance(d, () => d.phase === 'crashing');
  expect(d.distance).toBeGreaterThan(STOP); expect(d.speed).toBeGreaterThan(0); expect(d.threat).toBe('cross');
 });
 it('allows one second on green and creates a rear-end hazard after the deadline', () => {
  const d = toGreen(); d.update(.99); expect(d.phase).toBe('driving'); d.update(.02);
  expect(d.phase).toBe('crashing'); expect(d.threat).toBe('rear');
  d.collide(); d.start(); expect(d.phase).toBe('driving'); expect(d.distance).toBe(0); expect(d.green).toBe(false); expect(d.threat).toBe(null);
 });
 it('never treats a wrong turn during a Straight command as a retry', () => {
  const d = toGreen(); d.input('go'); advance(d, () => d.prompt && d.command.action === 'straight'); d.input('right');
  expect(d.threat).toBe('right'); expect(d.phase).toBe('crashing');
 });
});
