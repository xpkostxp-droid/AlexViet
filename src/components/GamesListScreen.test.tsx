import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { GamesListScreen } from './GamesListScreen';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
it('shows lesson buttons and opens family without number games', () => {
 const host=document.createElement('div');const root=createRoot(host);const family=vi.fn();const house=vi.fn();const numbers=vi.fn();
 act(()=>root.render(<GamesListScreen onOpenRestaurant={()=>{}} onOpenPeople={()=>{}} onBack={()=>{}} onOpenTravel={()=>{}} onOpenProfessions={()=>{}} onOpenFamily={family} onOpenHouse={house} onOpenLesson9={numbers}/>));
 expect(host.querySelectorAll('.game-menu-item')).toHaveLength(7);
 expect(host.textContent).not.toContain('Большие числа');expect(host.textContent).not.toContain('Диалоги');expect(host.querySelector('details')).toBeNull();
 act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent?.includes('Урок 10'))!.click());
 expect(family).toHaveBeenCalledOnce();expect(house).not.toHaveBeenCalled();expect(numbers).not.toHaveBeenCalled();act(()=>root.unmount());
});
