import { lazy, Suspense, useEffect, useState } from 'react';
import { signInTester, testAuth, testerRequest } from '../domain/testAuth';
import './TestGate.css';
const TestApp=lazy(()=>import('../App'));
export function TestGate(){
 const [ready,setReady]=useState(false),[entered,setEntered]=useState(false),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{
  let alive=true;
  void(async()=>{try{const {data:{session}}=await testAuth.auth.getSession();if(session){await testerRequest({action:'profile'});if(alive)setEntered(true);}}catch{if(alive)setError('Не удалось подтвердить вход. Проверь интернет и войди снова.');}finally{if(alive)setReady(true);}})();
  const {data}=testAuth.auth.onAuthStateChange(e=>{if(e==='SIGNED_OUT'&&alive)setEntered(false);});
  return()=>{alive=false;data.subscription.unsubscribe();};
 },[]);
 if(!ready)return <main className="test-login"><p role="status">Проверяем вход…</p></main>;
 if(entered)return <div className="test-workspace"><div className="test-workspace-bar"><span>🧪 Тестовая площадка · без рейтинга</span><button onClick={()=>void testAuth.auth.signOut({scope:'local'})}>Выйти</button></div><Suspense fallback={<main className="test-login"><p role="status">Загружаем игры…</p></main>}><TestApp/></Suspense></div>;
 return <main className="test-login"><form onSubmit={async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');try{await signInTester(password);setPassword('');setEntered(true);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}><div className="test-login-icon">🧪</div><h1>Тестовая площадка</h1><p>Вход для Константина. На этом устройстве он запомнится.</p><label htmlFor="tester-password">Пароль</label><input id="tester-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} disabled={busy} autoFocus/><button className="big-button" disabled={!password||busy}>{busy?'Входим…':'Войти'}</button>{error&&<p role="alert">{error}</p>}</form></main>;
}
