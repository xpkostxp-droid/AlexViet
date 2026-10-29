import { createClient } from '@supabase/supabase-js';
export const testAuth=createClient('https://eqdlhipzjhbzfchwjazr.supabase.co','sb_publishable_TX1Cf_ARp8EGWs37lbP3Yw_o43pfuyU',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'alexviet.tester.auth.v1'}});
export async function testerRequest(body:Record<string,unknown>){
 const {data:{session}}=await testAuth.auth.getSession();
 const r=await fetch('https://eqdlhipzjhbzfchwjazr.supabase.co/functions/v1/test-access',{method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:`Bearer ${session.access_token}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const data=await r.json();if(!r.ok)throw Object.assign(new Error(data.error??'Не удалось соединиться'),{status:r.status});return data;
}
export async function signInTester(password:string){const r=await testerRequest({action:'login',password});const {error}=await testAuth.auth.setSession(r.session);if(error)throw error;return r.profile;}
