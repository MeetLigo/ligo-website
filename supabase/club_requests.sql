-- Fallback store for club account requests, used ONLY when the website
-- cannot reach Micah's intake (LIGO_INTAKE_KEY missing from the hosting env).
-- Run once in the Supabase SQL editor.
--
-- Micah's platform is the source of truth. Rows land here only so a club
-- that applies during an outage is not lost; anything in here has to be
-- entered into the platform by hand.
create table if not exists public.club_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  club_name text not null,
  contact_name text not null,
  contact_role text not null,
  club_email text not null,
  instagram text,
  category text,
  notes text,
  emailed boolean not null default false,
  transferred_to_platform boolean not null default false
);
create index if not exists club_requests_created_idx on public.club_requests (created_at desc);
alter table public.club_requests enable row level security;
-- No policies on purpose: only the service-role key (server routes) can read or write.
