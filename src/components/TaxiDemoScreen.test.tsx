import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { TaxiDemoScreen } from './TaxiDemoScreen';

it('keeps one journey, stops for a second, accelerates, finishes and restarts', () => {
 let frame: FrameRequestCallback = () => {}, time = 0;
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
 vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frame = callback; return 1; });
 vi.stubGlobal('cancelAnimationFrame', vi.fn());
 vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak: vi.fn() });
 vi.stubGlobal('SpeechSynthesisUtterance', class {});
 const ctx = new Proxy({}, { get: () => vi.fn(), set: () => true });
 vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as CanvasRenderingContext2D);
 const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
 const tick = (seconds: number) => { act(() => { for (let i = 0; i < seconds * 20; i++) { time += 50; frame(time); } }); };
 const click = (text: string) => act(() => { const button = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes(text)); expect(button).toBeTruthy(); button!.click(); });
 const until = (text: string) => { for (let i = 0; i < 600 && !host.textContent?.includes(text); i++) tick(.1); expect(host.textContent).toContain(text); };
 try {
  act(() => root.render(<TaxiDemoScreen onBack={() => {}} />)); click('Начать поездку');
  until('Rẽ phải!'); click('Налево'); expect(host.textContent).toContain('Ошибок: 1');
  tick(6); expect(host.textContent).toContain('Rẽ phải!'); click('Направо');
  until('Dừng lại!'); click('Стоп'); until('Стоим перед светофором');
  tick(.15); expect(host.textContent).toContain('0 км/ч'); tick(.5); expect(host.textContent).toContain('Стоим перед светофором');
  until('Зелёный!'); until('Đi thẳng!'); click('Прямо');
  until('Đi nhanh lên!'); click('Быстрее'); tick(1); expect(host.textContent).toContain('50 км/ч');
  until('Rẽ trái!'); click('Налево'); until('Поездка завершена');
  expect(host.textContent).toContain('100% пути'); expect(host.textContent).toContain('⭐ 5');
  click('Ещё одна поездка'); expect(host.textContent).toContain('Ошибок: 0'); expect(host.textContent).toContain('0% пути');
 } finally { act(() => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); }
});
