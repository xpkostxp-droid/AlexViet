-- Test access is independent of a participant's competition/admin role.
create table app_private.test_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 password_hash text not null,
 active boolean not null default true,
 failures integer not null default 0,
 locked_until timestamptz
);
alter table app_private.test_access enable row level security;
revoke all on app_private.test_access from public,anon,authenticated;
grant all on app_private.test_access to service_role;
create policy test_access_service_only on app_private.test_access for all to service_role using (true) with check (true);
create function public.verify_tester_password(p_password text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare t app_private.test_access%rowtype; c app_private.credentials%rowtype;
begin
 select a.* into t from app_private.test_access a join public.participants p on p.user_id=a.user_id where p.id='konstantin' and p.active and a.active for update of a;
 if not found then return jsonb_build_object('error','invalid'); end if;
 if t.locked_until>now() then return jsonb_build_object('error','locked'); end if;
 if t.locked_until is not null then t.failures:=0; end if;
 if octet_length(p_password)>72 or extensions.crypt(p_password,t.password_hash)<>t.password_hash then
  update app_private.test_access set failures=t.failures+1,locked_until=case when t.failures+1>=5 then now()+interval '15 minutes' else null end where user_id=t.user_id;
  return jsonb_build_object('error',case when t.failures+1>=5 then 'locked' else 'invalid' end);
 end if;
 update app_private.test_access set failures=0,locked_until=null where user_id=t.user_id;
 select c1.* into c from app_private.credentials c1 where c1.participant_id='konstantin';
 return jsonb_build_object('email',c.email,'password',c.auth_password);
end $$;
revoke all on function public.verify_tester_password(text) from public,anon,authenticated;
grant execute on function public.verify_tester_password(text) to service_role;
create function public.tester_profile(p_user uuid)
returns jsonb language sql security invoker set search_path='' as $$
 select jsonb_build_object('id',p.id,'display_name',p.display_name,'user_id',p.user_id)
 from public.participants p join app_private.test_access t on t.user_id=p.user_id
 where p.user_id=p_user and p.active and t.active;
$$;
revoke all on function public.tester_profile(uuid) from public,anon,authenticated;
grant execute on function public.tester_profile(uuid) to service_role;
