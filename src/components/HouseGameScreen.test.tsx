import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { HouseGameScreen } from './HouseGameScreen';
import { adjectiveLearning, houseBlitz, houseLearning } from '../content/games/house';
import { speakVietnamese } from '../domain/speech';
vi.mock('../domain/speech',()=>({hasVietnameseVoice:()=>true,onVoicesChanged:()=>()=>{},speakVietnamese:vi.fn(),stopSpeaking:vi.fn()}));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
let root:ReturnType<typeof createRoot>;let host:HTMLDivElement;
afterEach(()=>{act(()=>root.unmount());host.remove();vi.useRealTimers();vi.clearAllMocks();});
function mount(){vi.useFakeTimers();host=document.createElement('div');document.body.append(host);root=createRoot(host);act(()=>root.render(<HouseGameScreen onBack={()=>{}}/>));}
function clickText(text:string){act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent?.includes(text))!.click());}
function currentIndex(){return adjectiveLearning.findIndex(w=>w[2]===host.querySelector('.family-card h2')?.textContent);}
function answer(){const i=currentIndex();act(()=>Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b=>b.textContent===adjectiveLearning[i][1])!.click());expect(speakVietnamese).toHaveBeenLastCalledWith(adjectiveLearning[i][1]);act(()=>vi.advanceTimersByTime(1800));return i;}
it('keeps the 20 blitz combinations and visits each once',()=>{
 mount();clickText('Блиц · Всё вместе');const seen=new Set<string>();
 for(let i=0;i<20;i++){const ru=host.querySelector('.family-card h2')!.textContent!;expect(seen.has(ru)).toBe(false);seen.add(ru);act(()=>Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b=>b.textContent===houseBlitz.find(w=>w[2]===ru)![1])!.click());act(()=>vi.advanceTimersByTime(1800));}
 expect(seen.size).toBe(20);expect(host.textContent).toContain('С первой попытки: 20 из 20');
});
it('grows adjective choices only as words appear and never exceeds three',()=>{
 mount();clickText('Обучение · Прилагательные');let highest=1;
 while(host.querySelector('.family-card')){
  const i=currentIndex();highest=Math.max(highest,i);
  const buttons=Array.from(host.querySelectorAll('.family-choices button'));
  expect(buttons.length).toBe(Math.min(3,highest+1));
  expect(buttons.some(b=>b.textContent===adjectiveLearning[i][1])).toBe(true);
  answer();
 }
 clickText('Сыграть заново');expect(host.querySelectorAll('.family-choices button')).toHaveLength(2);
});
it('starts house learning with two choices, then three for the third word',()=>{
 mount();clickText('Обучение · Дом');
 for(const [vi,count] of [['nhà',2],['khách sạn',2],['chung cư',3]] as const){
  expect(host.querySelectorAll('.family-choices button')).toHaveLength(count);
  act(()=>Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b=>b.textContent===vi)!.click());act(()=>viTimers());
 }
 function viTimers(){vi.advanceTimersByTime(1800);}
});


for (const [label, source] of [['Обучение · Дом', houseLearning], ['Обучение · Прилагательные', adjectiveLearning]] as const) {
 it(`slides unfinished words alongside new words in ${label}`,()=>{
  mount();clickText(label);
  const scores:Record<number,number>={};let highest=2;let previous=-1;let failed=false;let turns=0;let mixed=false;
  while(host.querySelector('.family-card')) {
   const i=source.findIndex(w=>w[2]===host.querySelector('.family-card h2')?.textContent);
   expect(scores[i]??0).toBeLessThan(3);
   expect(i).toBeLessThanOrEqual(highest+1);highest=Math.max(highest,i);
   if(Object.values(scores).filter(n=>n<3).length + source.length-highest-1 > 1) expect(i).not.toBe(previous);
   const buttons=Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button'));
   expect(buttons.length).toBeLessThanOrEqual(3);expect(buttons.length).toBeGreaterThanOrEqual(2);
   let miss=false;
   if(i===2 && !failed && scores[2]===1){act(()=>buttons.find(b=>b.textContent!==source[i][1])!.click());scores[i]=0;failed=true;miss=true;}
   if(i>=3 && (scores[2]??0)<3) mixed=true;
   act(()=>buttons.find(b=>b.textContent===source[i][1])!.click());
   expect(speakVietnamese).toHaveBeenLastCalledWith(source[i][1]);
   act(()=>vi.advanceTimersByTime(1800));
   if(!miss)scores[i]=(scores[i]??0)+1;
   previous=i;expect(++turns).toBeLessThan(100);
  }
  expect(failed).toBe(true);expect(mixed).toBe(true);
  expect(Object.values(scores)).toHaveLength(source.length);
  expect(Object.values(scores).every(n=>n===3)).toBe(true);
  expect(host.textContent).toContain('Раздел выучен!');
 });
}
