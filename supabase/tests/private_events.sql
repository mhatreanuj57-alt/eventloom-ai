begin;
insert into auth.users (id, email) values
  ('10000000-0000-4000-8000-000000000001', 'eventloom-rls-a@example.invalid'),
  ('10000000-0000-4000-8000-000000000002', 'eventloom-rls-b@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
insert into public.events (id, payload) values ('rls-a', '{"id":"rls-a"}');
do $$ begin
  assert (select count(*) = 1 from public.events), 'Owner must see their event';
end $$;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) = 0 from public.events), 'Another user must not see owner events';
  update public.events set payload = '{"id":"rls-a","changed":true}' where id = 'rls-a';
  assert not found, 'Another user must not update owner events';
  delete from public.events where id = 'rls-a';
  assert not found, 'Another user must not delete owner events';
  begin
    insert into public.events (id, user_id, payload) values ('rls-attack', '10000000-0000-4000-8000-000000000001', '{"id":"rls-attack"}');
    raise exception 'Cross-owner insert was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
select public.replace_event_workspace('[{"id":"rls-b"}]');
do $$ begin
  assert (select count(*) = 1 from public.events), 'Restore must create only current user events';
  begin
    perform public.replace_event_workspace('[{"id":"duplicate"},{"id":"duplicate"}]');
    raise exception 'Duplicate IDs were accepted';
  exception when unique_violation then null;
  end;
  assert exists(select 1 from public.events where id = 'rls-b'), 'Failed restore must preserve the previous workspace';
end $$;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
do $$ begin
  assert exists(select 1 from public.events where id = 'rls-a'), 'Other user restore must not remove owner events';
end $$;
do $$ declare n integer; reservation integer; begin
  -- The active user has five reservations, shared across all app instances.
  for n in 1..5 loop
    reservation := public.reserve_ai_request();
    assert reservation between 1 and 20, 'Valid quota reservation failed';
  end loop;
  assert public.reserve_ai_request() = -1, 'Personal hourly quota was not enforced';
end $$;
do $$ declare n integer; rejected boolean := false; begin
  for n in 1..49 loop
    insert into public.events (id, payload) values ('count-' || n, jsonb_build_object('id', 'count-' || n));
  end loop;
  begin
    insert into public.events (id, payload) values ('count-50', '{"id":"count-50"}');
  exception when raise_exception then rejected := true;
  end;
  assert rejected, 'The 50-event account ceiling was not enforced';
  delete from public.events where id like 'count-%';
  for n in 1..44 loop
    insert into public.events (id, payload) values ('size-' || n, jsonb_build_object('id', 'size-' || n, 'padding', repeat('x', 90000)));
  end loop;
  rejected := false;
  begin
    insert into public.events (id, payload) values ('size-45', jsonb_build_object('id', 'size-45', 'padding', repeat('x', 90000)));
  exception when raise_exception then rejected := true;
  end;
  assert rejected, 'Workspace size must remain within the restorable backup limit';
end $$;
set local role anon;
do $$ begin
  begin
    perform count(*) from public.events;
    raise exception 'Anonymous event access was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select 'PASS: owner isolation, anonymous denial, cross-owner writes, atomic restore, quotas and workspace limits' as verification;
rollback;
