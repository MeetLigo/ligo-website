-- Club account requests from meetligo.com/clubs/create.
-- Run once in the Supabase SQL editor. /api/club-request inserts here
-- (best effort) and always emails the team, so a missing table never
-- blocks a request.
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
  status text not null default 'pending', -- pending | approved | denied
  reviewed_at timestamptz,
  reviewed_by text
);
create index if not exists club_requests_status_idx on public.club_requests (status, created_at desc);
alter table public.club_requests enable row level security;
-- No policies on purpose: only the service-role key (server routes) can read or write.
