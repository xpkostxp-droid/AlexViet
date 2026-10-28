import Phaser from 'phaser';
import { Action, BLOCK, DESTINATIONS, Drive, DriveView, NODES, SIZE, WORDS, node } from './drive';
export class TaxiScene extends Phaser.Scene {
 readonly drive = new Drive();
 private taxi!: Phaser.GameObjects.Image;
 private routeLine!: Phaser.GameObjects.Graphics;
 private cameraHeading = 0;
 private lastUi = 0;
 private lastRevision = -1;
 private overview = true;
 constructor(private publish: (view: DriveView) => void, private speak: (text: string) => void, private ready: () => void) { super('taxi'); }
 create() {
  this.drawMap(); this.makeTaxi();
  const p = this.drive.position; this.taxi = this.add.image(p.x, p.y, 'taxi').setDepth(20);
  this.routeLine = this.add.graphics().setDepth(5); this.drawRoute(); this.camera(true); this.publish(this.drive.snapshot()); this.ready();
 }
 private drawMap() {
  const g = this.add.graphics(); g.fillStyle(0x8dbb98).fillRect(-400, -400, 2300, 2300);
  g.fillStyle(0xf1dba8).fillRect(1320, -300, 120, 2000); g.fillStyle(0x77cbd2).fillRect(1440, -400, 800, 2200);
  const colors = [0xf1bb8e, 0x8ebaca, 0xdab1c4, 0xe9d497];
  for (let row = 0; row < SIZE - 1; row++) for (let col = 0; col < SIZE - 1; col++) {
   const x = col * BLOCK + 80, y = row * BLOCK + 80;
   g.fillStyle(0xdadbc3).fillRoundedRect(x - 12, y - 12, 164, 164, 12);
   g.fillStyle(colors[(col + row) % 4]).fillRoundedRect(x, y, 140, 110, 8);
   g.fillStyle(0xe4f0e8); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) g.fillRect(x + 12 + i * 31, y + 18 + j * 39, 18, 22);
   for (let i = 0; i < 3; i++) { g.fillStyle(0x397f59).fillCircle(x + i * 57 + 10, y + 138, 17); g.fillStyle(0x60a16c).fillCircle(x + i * 57 + 5, y + 133, 10); }
  }
  for (const [width, color] of [[110, 0xd7dac6], [96, 0x4a606d]]) {
   g.lineStyle(width, color); g.beginPath();
   for (let i = 0; i < SIZE; i++) { g.moveTo(0, i * BLOCK); g.lineTo(1200, i * BLOCK); g.moveTo(i * BLOCK, 0); g.lineTo(i * BLOCK, 1200); }
   g.strokePath();
   for (const n of NODES) g.fillStyle(color).fillCircle(n.x, n.y, width / 2);
  }
  g.fillStyle(0xe6deaf);
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - 1; j++) for (let k = 72; k < 260; k += 52) { g.fillRect(j * BLOCK + k, i * BLOCK - 1, 26, 2); g.fillRect(i * BLOCK - 1, j * BLOCK + k, 2, 26); }
  this.add.text(-50, 1260, 'ОТЕЛЬ', { fontSize: '22px', color: '#194654', backgroundColor: '#f9ebcc', padding: { x: 8, y: 5 } });
  for (const d of DESTINATIONS) { const p = node(d.id); this.add.circle(p.x, p.y, 27, 0xf5c349).setStrokeStyle(4, 0xffffff).setDepth(8); this.add.text(p.x + 58, p.y - 18, `${d.icon} ${d.name}`, { fontSize: '22px', color: '#194654', backgroundColor: '#fff1d2', padding: { x: 6, y: 4 } }).setDepth(9); }
 }
 private makeTaxi() {
  const g = this.add.graphics(); g.fillStyle(0x243c4c, .25).fillRoundedRect(7, 9, 34, 63, 8);
  g.fillStyle(0x243c4c).fillRect(3, 17, 6, 13).fillRect(39, 17, 6, 13).fillRect(3, 48, 6, 13).fillRect(39, 48, 6, 13);
  g.fillStyle(0xf4bc2b).fillRoundedRect(7, 5, 34, 64, 8); g.fillStyle(0xffdf72).fillRoundedRect(11, 8, 26, 56, 6);
  g.fillStyle(0x28677e).fillRoundedRect(11, 18, 26, 16, 4).fillRoundedRect(12, 49, 24, 11, 3); g.fillStyle(0xb0dde5).fillRect(14, 20, 20, 8);
  g.fillStyle(0xffffff).fillRect(12, 38, 24, 9); g.fillStyle(0x254553).fillRect(15, 40, 3, 4).fillRect(21, 40, 3, 4).fillRect(27, 40, 3, 4);
  g.generateTexture('taxi', 48, 76); g.destroy();
 }
 private drawRoute() {
  const ids = this.drive.phase === 'ready' ? [this.drive.from, ...this.drive.route] : [this.drive.junction, ...this.drive.route.slice(1)];
  const g = this.routeLine; g.clear(); const p = this.drive.position;
  g.lineStyle(12, 0x183e6b, .35).beginPath(); g.moveTo(p.x, p.y); for (const id of ids) { const n = node(id); g.lineTo(n.x, n.y); } g.strokePath();
  g.lineStyle(7, 0x51b9ff).beginPath(); g.moveTo(p.x, p.y); for (const id of ids) { const n = node(id); g.lineTo(n.x, n.y); } g.strokePath();
  const goal = node(this.drive.goal); g.fillStyle(0xff854b).fillCircle(goal.x, goal.y, 18); g.lineStyle(4, 0xffffff).strokeCircle(goal.x, goal.y, 22);
 }
 private camera(immediate = false) {
  const c = this.cameras.main;
  if (this.overview) { c.setZoom(.265).setRotation(0).centerOn(600, 620); return; }
  const p = this.drive.position;
  this.cameraHeading += Phaser.Math.Angle.Wrap(-p.heading - this.cameraHeading) * (immediate ? 1 : .12);
  c.setZoom(.95).setRotation(this.cameraHeading).centerOn(p.x + Math.sin(p.heading) * 75, p.y - Math.cos(p.heading) * 75);
 }
 startRide() { this.drive.start(); this.overview = false; this.taxi.setPosition(0, 1200).setRotation(0); this.cameraHeading = 0; this.drawRoute(); this.camera(true); this.publish(this.drive.snapshot()); }
 selectGoal(goal: string) { this.drive.selectGoal(goal); this.drawRoute(); this.publish(this.drive.snapshot()); }
 toggleMap() { this.overview = !this.overview; this.camera(true); }
 action(action: Action) { this.drive.input(action); this.publish(this.drive.snapshot()); }
 repeat() { this.speak(WORDS[this.drive.instruction].vi); }
 update(time: number, delta: number) {
  if (!this.taxi) return;
  this.drive.update(Math.min(delta / 1000, .1)); const p = this.drive.position;
  this.taxi.setPosition(p.x, p.y); this.taxi.rotation += Phaser.Math.Angle.Wrap(p.heading - this.taxi.rotation) * .15;
  if (this.drive.revision !== this.lastRevision) { this.lastRevision = this.drive.revision; this.drawRoute(); }
  else if (this.drive.phase === 'driving') this.drawRoute();
  this.camera();
  if (time - this.lastUi > 100) { this.publish(this.drive.snapshot()); this.lastUi = time; }
 }
}
export function createTaxiGame(parent: HTMLElement, publish: (view: DriveView) => void, speak: (text: string) => void, ready: () => void) {
 const scene = new TaxiScene(publish, speak, ready);
 const game = new Phaser.Game({ type: Phaser.AUTO, parent, width: 420, height: 520, backgroundColor: '#8dbb98', scene: [scene], render: { antialias: true }, audio: { noAudio: true }, banner: false, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH } }); return { game, scene };
}
