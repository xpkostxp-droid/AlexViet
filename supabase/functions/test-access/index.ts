import { createClient } from 'npm:@supabase/supabase-js@2.95.0';
const url=Deno.env.get('SUPABASE_URL')!;
const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const cors={'Access-Control-Allow-Origin':'https://xpkostxp-droid.github.io','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return reply({error:'method'},405);
 try{
  const text=await req.text();if(text.length>2000)return reply({error:'size'},413);
  const body=JSON.parse(text);
  if(body.action==='login'){
   if(typeof body.password!=='string'||body.password.length<1||body.password.length>72)return reply({error:'Неверный пароль'},401);
   const {data:c,error}=await admin.rpc('verify_tester_password',{p_password:body.password});
   if(error)throw error;
   if(c.error)return reply({error:c.error==='locked'?'Слишком много попыток. Подожди 15 минут.':'Неверный пароль'},c.error==='locked'?429:401);
   const auth=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
   const {data,error:authError}=await auth.auth.signInWithPassword({email:c.email,password:c.password});
   if(authError||!data.session)return reply({error:'Не удалось войти'},503);
   const {data:profile,error:profileError}=await admin.rpc('tester_profile',{p_user:data.user.id});
   if(profileError)throw profileError;
   if(!profile)return reply({error:'Нет доступа'},403);
   return reply({session:{access_token:data.session.access_token,refresh_token:data.session.refresh_token},profile});
  }
  if(body.action!=='profile')return reply({error:'action'},400);
  const token=req.headers.get('Authorization')?.replace(/^Bearer /i,'');
  if(!token)return reply({error:'Нужен вход'},401);
  const {data:{user},error:authError}=await admin.auth.getUser(token);
  if(authError||!user)return reply({error:'Войди снова'},401);
  const {data:profile,error}=await admin.rpc('tester_profile',{p_user:user.id});if(error)throw error;
  if(!profile)return reply({error:'Нет доступа'},403);
  return reply({profile});
 }catch{return reply({error:'Сервис временно недоступен'},500);}
});
