import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Drive, UTURN } from '../games/taxi/drive';
import { TaxiDemoScreen } from './TaxiDemoScreen';
const mock = vi.hoisted(() => ({ startRide: vi.fn(), action: vi.fn(), repeat: vi.fn(), destroy: vi.fn(), publish: undefined as undefined | ((view: ReturnType<Drive['snapshot']>) => void) }));
vi.mock('../games/taxi/TaxiScene', () => ({ createTaxiGame: (_parent: HTMLElement, publish: typeof mock.publish, _speak: unknown, ready: () => void) => { mock.publish = publish; ready(); return { game: { destroy: mock.destroy }, scene: { startRide: mock.startRide, action: mock.action, repeat: mock.repeat } }; } }));
it('loads Phaser only for Taxi, forwards every control and destroys the engine on exit', async () => {
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
 vi.stubGlobal('speechSynthesis', { getVoices: () => [], cancel: vi.fn() });
 const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
 const click = (text: string) => act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes(text))!.click());
 try {
  await act(async () => { root.render(<TaxiDemoScreen onBack={() => {}} />); }); click('Начать поездку'); expect(mock.startRide).toHaveBeenCalledOnce();
  const d = new Drive(); d.start(); act(() => mock.publish!(d.snapshot()));
  click('Налево'); expect(mock.action).toHaveBeenCalledWith('left');
  d.accepted = true; act(() => mock.publish!(d.snapshot())); click('Стоп'); expect(mock.action).toHaveBeenCalledWith('stop');
  expect(host.textContent).not.toContain('Разворот'); d.distance = UTURN - 250; act(() => mock.publish!(d.snapshot()));
  click('Разворот'); expect(mock.action).toHaveBeenCalledWith('uturn');
  d.step = 1; d.distance = 850; act(() => mock.publish!(d.snapshot())); expect(host.querySelector('.taxi-signal')?.textContent).toContain('КРАСНЫЙ');
  d.green = true; act(() => mock.publish!(d.snapshot())); expect(host.querySelector('.taxi-signal')?.textContent).toContain('ЗЕЛЁНЫЙ');
 } finally { act(() => root.unmount()); expect(mock.destroy).toHaveBeenCalledWith(true); host.remove(); vi.unstubAllGlobals(); }
});
