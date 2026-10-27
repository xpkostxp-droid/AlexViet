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
it('keeps all seven blocks in order, needs three clean recalls, and resets a failed word',()=>{
 mount();clickText('Обучение · Прилагательные');
 const wins:Record<number,number>={};let lastBlock=0;let failures=0;
 while(host.querySelector('.family-card')){
  const i=currentIndex();const block=Math.floor(i/3);
  expect(block).toBeGreaterThanOrEqual(lastBlock);expect(block).toBeLessThanOrEqual(lastBlock+1);
  if(block>lastBlock)for(let j=lastBlock*3;j<Math.min(lastBlock*3+3,19);j++)expect(wins[j]).toBe(3);
  lastBlock=block;
  // Fail word 0 after its first clean recall; it must need three fresh successes.
  if(i===0&&wins[0]===1&&failures===0){
   const bad=Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button')).find(b=>b.textContent!==adjectiveLearning[i][1])!;
   act(()=>bad.click());expect(bad.disabled).toBe(true);wins[0]=0;failures++;
   answer();expect(host.querySelector('[data-testid="adjective-block"]')?.textContent).toContain('Блок 1 из 7');
  }else{answer();wins[i]=(wins[i]??0)+1;}
  expect(Object.values(wins).reduce((a,b)=>a+b,0)).toBeLessThanOrEqual(57);
 }
 expect(failures).toBe(1);expect(lastBlock).toBe(6);expect(Object.values(wins)).toHaveLength(19);expect(Object.values(wins).every(n=>n===3)).toBe(true);expect(host.textContent).toContain('Раздел выучен!');
});
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
  const start=Math.floor(i/3)*3;
  const allowed=start===18?adjectiveLearning.slice(16,19):adjectiveLearning.slice(start,start===0?Math.min(3,highest+1):start+3);
  for(const b of buttons)expect(allowed.some(w=>w[1]===b.textContent)).toBe(true);
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

it('teaches house in six sequential triples with three clean answers and reset on mistakes',()=>{
 mount();clickText('Обучение · Дом');const scores:Record<number,number>={};let block=0;let failed=false;
 while(host.querySelector('.family-card')){
  const i=houseLearning.findIndex(w=>w[2]===host.querySelector('.family-card h2')?.textContent);const nextBlock=Math.floor(i/3);
  if(nextBlock>block){for(let j=block*3;j<block*3+3;j++)expect(scores[j]).toBe(3);expect(nextBlock).toBe(block+1);block=nextBlock;}
  const buttons=Array.from(host.querySelectorAll<HTMLButtonElement>('.family-choices button'));expect(buttons.length).toBeLessThanOrEqual(3);
  expect(buttons.every(b=>houseLearning.slice(block*3,block*3+3).some(w=>w[1]===b.textContent))).toBe(true);
  let miss=false;if(i===0&&scores[0]===2&&!failed){act(()=>buttons.find(b=>b.textContent!==houseLearning[i][1])!.click());scores[0]=0;failed=true;miss=true;}
  act(()=>buttons.find(b=>b.textContent===houseLearning[i][1])!.click());expect(speakVietnamese).toHaveBeenLastCalledWith(houseLearning[i][1]);act(()=>vi.advanceTimersByTime(1800));if(!miss)scores[i]=(scores[i]??0)+1;
 }
 expect(block).toBe(5);expect(failed).toBe(true);expect(Object.values(scores)).toHaveLength(18);expect(Object.values(scores).every(n=>n===3)).toBe(true);
});
