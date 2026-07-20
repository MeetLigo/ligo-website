-- 0003_answers_email_unique.sql
-- One answer per email. After this, /api/answers upserts on `email`, so a
-- resubmit UPDATES that person's row instead of adding a new one.
--
-- SEED HANDLING: the 10 seed rows all share seed@meetligo.com, so a plain
-- UNIQUE(email) would collapse them to one. We give each seed row a DISTINCT
-- email first (a partial "WHERE NOT is_seed" index would preserve them but
-- breaks supabase-js .upsert(onConflict:'email'), which can't target a partial
-- index — so we keep a full unique constraint and make the seed emails unique).

-- 1. distinct email per seed row (keeps all 10 placeholder rows)
update public.answers
set email = 'seed+' || id || '@meetligo.com'
where is_seed and email = 'seed@meetligo.com';

-- 2. dedup real duplicate emails — keep the most recent row per email
delete from public.answers
where id not in (
  select distinct on (email) id
  from public.answers
  order by email, created_at desc, id desc
);

-- 3. enforce one row per email (required by the upsert)
alter table public.answers
  add constraint answers_email_unique unique (email);
