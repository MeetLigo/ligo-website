-- Every careers application, stored before any email is attempted.
-- Run once in the Supabase SQL editor.
--
-- Email is the notification; this table is the record. If SendGrid is down
-- or its key is missing from the hosting env, the application still lands
-- here and the applicant still sees success. Check it whenever the inbox
-- looks quiet.
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role_slug text not null,
  role_title text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  year text,
  referral_source text,
  work_authorized text,
  motivation text,
  why_role text,
  availability text,
  links jsonb,
  emailed boolean not null default false,
  email_error text,
  status text not null default 'new' -- new | contacted | interviewing | offered | closed
);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_role_idx on public.applications (role_slug, status);
alter table public.applications enable row level security;
-- No policies on purpose: only the service-role key (server routes) can read or write.
