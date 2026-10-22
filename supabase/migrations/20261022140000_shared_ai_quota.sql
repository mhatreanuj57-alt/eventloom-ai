create table public.ai_request_quota (
  bucket_start timestamptz not null,
  scope text not null,
  requests integer not null check (requests >= 0),
  primary key (bucket_start, scope)
);
alter table public.ai_request_quota enable row level security;
revoke all on public.ai_request_quota from public, anon, authenticated;

create function public.reserve_ai_request() returns integer language plpgsql security definer set search_path = '' as $$
declare
  bucket timestamptz := date_trunc('hour', now() at time zone 'UTC') at time zone 'UTC';
  owner uuid := auth.uid();
  total integer;
  personal integer;
begin
  if owner is null then raise exception 'Sign in required'; end if;
  perform pg_advisory_xact_lock(hashtextextended('eventloom-ai-requests', 0));
  select requests into total from public.ai_request_quota where bucket_start = bucket and scope = 'studio';
  select requests into personal from public.ai_request_quota where bucket_start = bucket and scope = owner::text;
  if coalesce(personal, 0) >= 5 then return -1; end if;
  if coalesce(total, 0) >= 20 then return 21; end if;
  insert into public.ai_request_quota (bucket_start, scope, requests) values (bucket, 'studio', 1), (bucket, owner::text, 1)
    on conflict (bucket_start, scope) do update set requests = public.ai_request_quota.requests + 1;
  delete from public.ai_request_quota where bucket_start < bucket - interval '1 day';
  return coalesce(total, 0) + 1;
end;
$$;
revoke all on function public.reserve_ai_request() from public, anon;
grant execute on function public.reserve_ai_request() to authenticated;
