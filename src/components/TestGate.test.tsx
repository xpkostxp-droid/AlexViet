// @vitest-environment jsdom
import {act} from 'react';import {createRoot,type Root} from 'react-dom/client';import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {TestGate} from './TestGate';
const auth=vi.hoisted(()=>({getSession:vi.fn(),onAuthStateChange:vi.fn(()=>({data:{subscription:{unsubscribe:vi.fn()}}})),signOut:vi.fn()}));
const request=vi.hoisted(()=>vi.fn());const login=vi.hoisted(()=>vi.fn());
vi.mock('../domain/testAuth',()=>({testAuth:{auth},testerRequest:request,signInTester:login}));
vi.mock('../App',()=>({default:()=> <div>Игры тестовой площадки</div>}));
let node:HTMLDivElement,root:Root;
beforeEach(()=>{vi.clearAllMocks();auth.getSession.mockResolvedValue({data:{session:null}});node=document.createElement('div');root=createRoot(node);Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});});
afterEach(async()=>{await act(async()=>root.unmount());});
it('does not render games before a server-approved password login',async()=>{
 await act(async()=>root.render(<TestGate/>));expect(node.textContent).not.toContain('Игры тестовой площадки');
 const input=node.querySelector('input')!;await act(async()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,'test-password');input.dispatchEvent(new Event('input',{bubbles:true}));});
 login.mockRejectedValueOnce(new Error('Неверный пароль'));await act(async()=>node.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));expect(node.textContent).toContain('Неверный пароль');expect(node.textContent).not.toContain('Игры тестовой площадки');
 login.mockResolvedValueOnce({id:'konstantin'});await act(async()=>node.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));expect(node.textContent).toContain('Игры тестовой площадки');expect(node.textContent).toContain('без рейтинга');
});
it('restores a remembered session only after the server confirms tester access',async()=>{
 auth.getSession.mockResolvedValue({data:{session:{access_token:'token'}}});request.mockResolvedValue({profile:{id:'konstantin'}});
 await act(async()=>root.render(<TestGate/>));expect(request).toHaveBeenCalledWith({action:'profile'});expect(node.textContent).toContain('Игры тестовой площадки');
});
it('blocks a saved session that has no tester permission',async()=>{
 auth.getSession.mockResolvedValue({data:{session:{access_token:'student-token'}}});request.mockRejectedValue(new Error('Нет доступа'));
 await act(async()=>root.render(<TestGate/>));expect(node.textContent).not.toContain('Игры тестовой площадки');expect(node.querySelector('input[type=password]')).toBeTruthy();
});
