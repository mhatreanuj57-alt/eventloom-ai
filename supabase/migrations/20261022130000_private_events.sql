-- Ownership is enforced independently of the existing JSON event contract.
create table public.events (
  id text not null check (id ~ '^[a-zA-Z0-9_-]{1,100}$'),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and payload ->> 'id' = id and octet_length(payload::text) <= 100000),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.events enable row level security;
revoke all on public.events from anon;
grant select, insert, update, delete on public.events to authenticated;
create policy "Read own events" on public.events for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own events" on public.events for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own events" on public.events for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own events" on public.events for delete to authenticated using ((select auth.uid()) = user_id);

create function public.check_event_limit() returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if not exists (select 1 from public.events where user_id = new.user_id and id = new.id)
     and (select count(*) from public.events where user_id = new.user_id) >= 50 then
    raise exception 'Account event limit reached';
  end if;
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
create trigger enforce_event_limit before insert or update on public.events for each row execute function public.check_event_limit();
revoke all on function public.check_event_limit() from public, anon, authenticated;

-- Restore/reset is atomic; RLS applies to every row in this invoker function.
create function public.replace_event_workspace(items jsonb) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) > 50 or octet_length(items::text) > 4000000 then
    raise exception 'Invalid workspace';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text, 0));
  delete from public.events where user_id = auth.uid();
  insert into public.events (id, user_id, payload)
    select item ->> 'id', auth.uid(), item from jsonb_array_elements(items) item;
end;
$$;
revoke all on function public.replace_event_workspace(jsonb) from public, anon;
grant execute on function public.replace_event_workspace(jsonb) to authenticated;
