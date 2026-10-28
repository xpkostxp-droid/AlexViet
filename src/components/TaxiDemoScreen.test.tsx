import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Drive } from '../games/taxi/drive';
import { TaxiDemoScreen } from './TaxiDemoScreen';
const mock = vi.hoisted(() => ({ startRide: vi.fn(), action: vi.fn(), repeat: vi.fn(), toggleMap: vi.fn(), selectGoal: vi.fn(), destroy: vi.fn(), publish: undefined as undefined | ((view: ReturnType<Drive['snapshot']>) => void) }));
vi.mock('../games/taxi/TaxiScene', () => ({ createTaxiGame: (_p: HTMLElement, publish: typeof mock.publish, _s: unknown, ready: () => void) => { mock.publish = publish; ready(); return { game: { destroy: mock.destroy }, scene: mock }; } }));
it('previews the map, shows the next arrow and Vietnamese controls, and cleans up Phaser', async () => {
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true); vi.stubGlobal('speechSynthesis', { getVoices: () => [], cancel: vi.fn() });
 const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
 const click = (text: string) => act(() => Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes(text))!.click());
 try {
  await act(async () => root.render(<TaxiDemoScreen onBack={() => {}} />)); expect(host.querySelector('select')).toBeTruthy(); click('Поехали'); expect(mock.startRide).toHaveBeenCalled();
  const d = new Drive(); d.start(); act(() => mock.publish!(d.snapshot())); expect(host.querySelector('.taxi-navigation b')?.getAttribute('aria-label')).toBe('Направо'); click('Rẽ phải'); expect(mock.action).toHaveBeenCalledWith('right'); click('Quay đầu'); expect(mock.action).toHaveBeenCalledWith('uturn');
  d.update(3); act(() => mock.publish!(d.snapshot())); expect(host.textContent).toContain('Маршрут перестроен'); expect(host.textContent).not.toContain('Авария'); click('Вся карта'); expect(mock.toggleMap).toHaveBeenCalled();
 } finally { act(() => root.unmount()); expect(mock.destroy).toHaveBeenCalledWith(true); host.remove(); vi.unstubAllGlobals(); }
});
