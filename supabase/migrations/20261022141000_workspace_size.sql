create or replace function public.check_event_limit() returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if not exists (select 1 from public.events where user_id = new.user_id and id = new.id)
     and (select count(*) from public.events where user_id = new.user_id) >= 50 then
    raise exception 'Account event limit reached';
  end if;
  if (select coalesce(sum(octet_length(payload::text)), 0) from public.events where user_id = new.user_id and id <> new.id)
      + octet_length(new.payload::text) > 3999000 then
    raise exception 'Workspace size limit reached';
  end if;
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
