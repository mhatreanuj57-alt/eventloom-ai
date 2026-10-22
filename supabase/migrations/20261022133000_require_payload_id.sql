alter table public.events drop constraint events_check;
alter table public.events add constraint events_payload_check check (
  jsonb_typeof(payload) = 'object' and payload ? 'id'
  and jsonb_typeof(payload -> 'id') = 'string'
  and payload ->> 'id' = id and octet_length(payload::text) <= 100000
);
