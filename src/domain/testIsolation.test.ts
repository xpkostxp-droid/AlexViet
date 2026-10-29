import {expect,it} from 'vitest';
import {readJSON,writeJSON} from './storage';
it('keeps test progress separate from legacy and main-site records',()=>{
 localStorage.clear();localStorage.setItem('vietCards.progress.v1',JSON.stringify({main:true}));writeJSON('vietCards.progress.v1',{test:true});
 expect(readJSON('vietCards.progress.v1')).toEqual({test:true});expect(JSON.parse(localStorage.getItem('vietCards.progress.v1')!)).toEqual({main:true});
});
