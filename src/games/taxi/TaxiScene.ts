import Phaser from 'phaser';
import { Action, Drive, DriveView } from './drive';
import { AGENTS, AgentSpec, agentSpawn, agentMotion, taxiMotion } from './traffic';

type Agent = { sprite: Phaser.Physics.Arcade.Image; spec: AgentSpec };
export class TaxiScene extends Phaser.Scene {
 readonly drive = new Drive();
 private taxi!: Phaser.Physics.Arcade.Image;
 private traffic: Agent[] = [];
 private redLights: Phaser.GameObjects.Arc[] = [];
 private greenLights: Phaser.GameObjects.Arc[] = [];
 private greenShown = false;
 private cameraHeading = 0;
 private lastUi = 0;
 private lastPrompt = '';
 private elapsed = 0;
 private crashReported = false;
 constructor(private publish: (view: DriveView) => void, private speak: (text: string) => void, private ready: () => void) { super('taxi'); }
 create() {
  this.drawWorld(); this.makeCarTexture('taxi', 0xf5bd2b, true); this.makeCarTexture('coral', 0xe06e6b); this.makeCarTexture('blue', 0x62a5d4); this.makeCarTexture('white', 0xe6ece7);
  this.taxi = this.car(0, 600, 'taxi').setDepth(20);
  this.traffic = AGENTS.map(spec => { const p = agentSpawn(spec); return { sprite: this.car(p.x, p.y, spec.texture), spec }; });
  for (const agent of this.traffic) this.physics.add.overlap(this.taxi, agent.sprite, () => this.impact());
  this.cameras.main.setBackgroundColor('#82b993'); this.followCamera(1);
  this.publish(this.drive.snapshot()); this.ready();
 }
 private car(x: number, y: number, texture: string) {
  const sprite = this.physics.add.image(x, y, texture).setDepth(18);
  sprite.setCircle(18, 6, 20); sprite.setBounce(.1); sprite.body!.onCollide = true; return sprite;
 }
 private makeCarTexture(key: string, color: number, taxi = false) {
  const g = this.add.graphics();
  g.fillStyle(0x1d3745, .25).fillRoundedRect(7, 10, 36, 64, 10);
  g.fillStyle(0x263b49).fillRect(3, 17, 6, 14).fillRect(39, 17, 6, 14).fillRect(3, 48, 6, 14).fillRect(39, 48, 6, 14);
  g.fillStyle(color).fillRoundedRect(7, 5, 34, 64, 9);
  g.fillStyle(0xffffff, .25).fillRoundedRect(11, 8, 26, 57, 6);
  g.fillStyle(0x28677e).fillRoundedRect(11, 18, 26, 16, 4).fillRoundedRect(12, 49, 24, 11, 3);
  g.fillStyle(0xadd8df).fillRect(14, 20, 20, 8);
  g.fillStyle(0xfff6cc).fillRect(10, 7, 9, 4).fillRect(29, 7, 9, 4);
  g.fillStyle(0xdc5751).fillRect(11, 64, 8, 3).fillRect(29, 64, 8, 3);
  if (taxi) { g.fillStyle(0xffffff).fillRoundedRect(12, 37, 24, 10, 2); g.fillStyle(0x263b49).fillRect(15, 40, 3, 4).fillRect(20, 40, 3, 4).fillRect(25, 40, 3, 4).fillRect(30, 40, 3, 4); }
  g.generateTexture(key, 48, 76); g.destroy();
 }
 private drawWorld() {
  const g = this.add.graphics().setDepth(0);
  g.fillStyle(0x88bf90).fillRect(-1600, -1800, 4000, 3600);
  // Sea and beach remain fixed in the world, as do the streets and buildings.
  g.fillStyle(0xefd9a3).fillRect(1410, -1000, 180, 2100); g.fillStyle(0x77cbd2).fillRect(1590, -1200, 1000, 2500);
  for (let x = -650; x < 1400; x += 220) for (let y = -1200; y < 1100; y += 240) {
   if (Math.abs(x) < 165 || Math.abs(y) < 160 || (x > 920 && y < 250) || (Math.abs(x - 480) < 145 && Math.abs(y) < 450)) continue;
   g.fillStyle(0xdcdcc0).fillRoundedRect(x - 70, y - 75, 155, 170, 8);
   g.fillStyle(0x305761, .25).fillRoundedRect(x - 45, y - 47, 111, 117, 8);
   g.fillStyle([0xf1bb8e, 0x89b9c5, 0xdab1c4][Math.abs(x + y) % 3]).fillRoundedRect(x - 52, y - 55, 110, 115, 7);
   g.fillStyle(0xffedcf).fillRect(x - 43, y - 45, 92, 12); g.fillStyle(0xccebed);
   for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) g.fillRect(x - 40 + a * 30, y - 18 + b * 32, 18, 20);
   for (let k = 0; k < 3; k++) { g.fillStyle(0x4b8b5b).fillCircle(x - 50 + k * 52, y + 82, 18); g.fillStyle(0x68aa70).fillCircle(x - 55 + k * 52, y + 77, 11); }
  }
  const road = (width: number, color: number) => {
   g.lineStyle(width, color); g.beginPath(); g.moveTo(0, 1150); g.lineTo(0, -650); g.moveTo(-750, 0); g.lineTo(1500, 0); g.moveTo(480, -450); g.lineTo(480, 450); g.moveTo(1100, 250); g.lineTo(1100, -600); g.moveTo(1250, 250); g.lineTo(1250, -600); g.strokePath();
   g.fillStyle(color).fillCircle(1175, -600, width / 2 + 75);
  };
  road(176, 0xd8d8c2); road(160, 0x475c68);
  g.fillStyle(0xf5e3ae);
  for (let y = -460; y < 1000; y += 62) if (Math.abs(y) > 100) for (const x of [-27, 27]) g.fillRect(x, y, 3, 30);
  for (let x = 120; x < 1000; x += 62) if (Math.abs(x - 480) > 90) for (const y of [-27, 27]) g.fillRect(x, y, 30, 3);
  for (let y = -500; y < -100; y += 62) { g.fillRect(1127, y, 3, 30); g.fillRect(1223, y, 3, 30); }
  // Stop line and zebra are painted BEFORE the lights, never on top of them.
  g.fillStyle(0xfff6dc).fillRect(435, -77, 6, 154);
  for (let i = 0; i < 7; i++) g.fillRect(452, -72 + i * 23, 18, 12);
  for (const y of [-110, 110]) {
   this.add.rectangle(440, y, 34, 84, 0x172f3a).setStrokeStyle(3, 0xe6e0c5).setDepth(30);
   const red = this.add.circle(440, y - 20, 12, 0xff4444).setStrokeStyle(4, 0xffbbbb, .7).setDepth(31);
   const green = this.add.circle(440, y + 20, 12, 0x26483c).setDepth(31);
   this.redLights.push(red); this.greenLights.push(green);
  }
  this.label(-140, 640, 'ОТЕЛЬ', 24); this.label(1410, 100, 'ПЛЯЖ', 28);
  this.label(1175, -745, '↶', 68); this.label(1175, -820, 'РАЗВОРОТ', 20);
  this.label(0, 170, '→', 42); this.label(940, 0, '←', 42);
 }
 private label(x: number, y: number, text: string, size: number) { this.add.text(x, y, text, { fontFamily: 'system-ui', fontSize: size, color: '#fff4ce', stroke: '#254e5c', strokeThickness: 3 }).setOrigin(.5).setDepth(3); }
 startRide() {
  this.physics.resume(); this.drive.start(); this.crashReported = false; this.lastPrompt = ''; this.elapsed = 0;
  this.taxi.clearTint(); this.taxi.body!.reset(0, 600); this.taxi.setRotation(0).setVelocity(0, 0);
  for (const agent of this.traffic) { const p = agentSpawn(agent.spec); agent.sprite.body!.reset(p.x, p.y); agent.sprite.setVelocity(0, 0).clearTint(); }
  this.setSignal(false); this.followCamera(1); this.speak(this.drive.command.vi); this.lastPrompt = '0'; this.publish(this.drive.snapshot());
 }
 action(action: Action) { this.drive.input(action); this.publish(this.drive.snapshot()); }
 repeat() { if (this.drive.prompt) this.speak(this.drive.command.vi); }
 private setSignal(green: boolean) {
  this.greenShown = green;
  for (const lamp of this.redLights) lamp.setFillStyle(green ? 0x582f32 : 0xff3636).setStrokeStyle(green ? 1 : 5, 0xffad9e, .7);
  for (const lamp of this.greenLights) lamp.setFillStyle(green ? 0x38ff94 : 0x26483c).setStrokeStyle(green ? 5 : 1, 0xb4ffd0, .7);
 }
 private followCamera(blend: number) {
  const heading = this.taxi.rotation; const camera = this.cameras.main;
  const wanted = -heading; this.cameraHeading += Phaser.Math.Angle.Wrap(wanted - this.cameraHeading) * blend; camera.setRotation(this.cameraHeading);
  camera.centerOn(this.taxi.x + Math.sin(heading) * 90, this.taxi.y - Math.cos(heading) * 90);
 }
 private impact() {
  if (this.crashReported || (this.drive.phase !== 'driving' && this.drive.phase !== 'crashing')) return;
  this.crashReported = true; this.drive.collide(); this.taxi.setTint(0xffa49a); this.physics.pause(); this.taxi.setVelocity(0, 0);
  for (const agent of this.traffic) agent.sprite.setVelocity(0, 0);
  this.cameras.main.shake(260, .012);
  const sparks = this.add.graphics().setDepth(40); sparks.lineStyle(4, 0xffefac);
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; sparks.lineBetween(this.taxi.x + Math.cos(a) * 25, this.taxi.y + Math.sin(a) * 25, this.taxi.x + Math.cos(a) * 47, this.taxi.y + Math.sin(a) * 47); }
  this.time.delayedCall(600, () => sparks.destroy()); this.publish(this.drive.snapshot());
 }
 update(_time: number, delta: number) {
  if (!this.taxi) return;
  const d = this.drive, dt = Math.min(delta / 1000, .1); this.elapsed += dt;
  if (d.phase === 'driving' && d.command.action === 'go' && !d.accepted) d.greenElapsed += Math.max(0, this.game.loop.rawDelta / 1000 - dt);
  // Small fixed substeps keep braking and route decisions stable on slower phones.
  let remaining = dt; while (remaining > 0) { const step = Math.min(remaining, 1 / 60); d.update(step); remaining -= step; }
  if (d.green !== this.greenShown) this.setSignal(d.green);
  const motion = taxiMotion(d, this.taxi);
  this.taxi.setRotation(motion.heading).setVelocity(motion.x, motion.y);
  if (d.phase === 'driving' || d.phase === 'crashing') {
   for (const agent of this.traffic) {
    const velocity = agentMotion(d, agent.spec, agent.sprite, this.taxi, this.taxi.rotation, this.elapsed);
    agent.sprite.setVelocity(velocity.x, velocity.y).setRotation(velocity.heading);
   }
  }
  this.followCamera(1 - Math.exp(-dt * 8));
  const prompt = d.prompt ? String(d.step) : '';
  if (prompt && prompt !== this.lastPrompt) { this.lastPrompt = prompt; this.speak(d.command.vi); }
  if (_time - this.lastUi > 80) { this.publish(d.snapshot()); this.lastUi = _time; }
  if (d.phase === 'finished') this.physics.pause();
 }
}
export function createTaxiGame(parent: HTMLElement, publish: (view: DriveView) => void, speak: (text: string) => void, ready: () => void) {
 const scene = new TaxiScene(publish, speak, ready);
 const game = new Phaser.Game({ type: Phaser.AUTO, parent, width: 420, height: 520, backgroundColor: '#82b993', scene: [scene], physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false, fps: 60 } }, render: { antialias: true, roundPixels: false }, audio: { noAudio: true }, banner: false, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH } });
 return { game, scene };
}
