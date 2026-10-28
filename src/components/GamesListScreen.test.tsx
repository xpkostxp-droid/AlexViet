import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { GamesListScreen, type GamesCategory } from './GamesListScreen';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
it('shows lesson buttons and opens family without number games', () => {
 const host=document.createElement('div');const root=createRoot(host);const family=vi.fn();const house=vi.fn();const numbers=vi.fn();
 function Menu(){const [category,setCategory]=useState<GamesCategory>(null);return <GamesListScreen category={category} onCategoryChange={setCategory} onOpenRestaurant={()=>{}} onOpenQuestionTower={()=>{}} onOpenPeople={()=>{}} onBack={()=>{}} onOpenTravel={()=>{}} onOpenProfessions={()=>{}} onOpenFamily={family} onOpenHouse={house} onOpenLesson9={numbers}/>;}
 act(()=>root.render(<Menu/>));
 expect(host.querySelectorAll('.game-menu-item')).toHaveLength(2);
 expect(host.textContent).not.toContain('Урок 10');
 act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent==='Дополнительные')!.click());
 expect(host.textContent).toContain('Ресторан');
 expect(host.textContent).not.toContain('Урок 10');
 act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent?.includes('К разделам игр'))!.click());
 act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent==='Игры по урокам')!.click());
 expect(host.querySelectorAll('.game-menu-item')).toHaveLength(6);
 expect(host.textContent).not.toContain('Большие числа');expect(host.textContent).not.toContain('Диалоги');expect(host.querySelector('details')).toBeNull();
 act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent?.includes('Урок 10'))!.click());
 expect(family).toHaveBeenCalledOnce();expect(house).not.toHaveBeenCalled();expect(numbers).not.toHaveBeenCalled();act(()=>root.unmount());
});
