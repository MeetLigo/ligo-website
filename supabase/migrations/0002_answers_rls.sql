-- 0002_answers_rls.sql
-- Row-Level Security + the EMAIL LOCK.
--
-- IMPORTANT: RLS gates ROWS, not COLUMNS. The email lock is enforced by the
-- column-level GRANT below (grant SELECT on only the safe columns to `anon`;
-- never grant `email`). RLS on its own would NOT hide the email column.

alter table public.answers enable row level security;

-- 1. strip Supabase's default blanket grants from the browser roles
revoke all on table public.answers from anon, authenticated;

-- 2. grant SELECT on ONLY the safe columns to the browser (publishable key).
--    email, isrc, is_seed, and id are intentionally NOT granted, so they can
--    never be read with the publishable key — not even via `select *`.
grant select
  (song_name, artist, album_art_url, spotify_track_id, is_freetext, school, created_at)
  on table public.answers to anon;

-- 3. row policy so the browser can read those columns across all rows.
--    No INSERT/UPDATE/DELETE is granted or policied → the publishable key
--    cannot write. All writes go through the server route (secret key).
create policy answers_public_read
  on public.answers for select
  to anon
  using (true);

-- 4. keep the aggregate view server-only; the API route serves it to the browser.
revoke all on public.wall_ranking from anon, authenticated;

-- service_role (the SECRET key, used only by the server route) bypasses RLS and
-- has full table privileges → it performs every insert and reads the view.


-- ── Verification (run after the two migrations; not part of the migration) ──
-- Expect the first SELECT to ERROR ("permission denied for column email"),
-- and the second to succeed.
--
--   set role anon;
--   select email from public.answers limit 1;                 -- expected: ERROR
--   select song_name, school from public.answers limit 1;     -- expected: OK
--   reset role;
