-- Voluntary self-identification answers from the careers application.
-- Run once in the Supabase SQL editor.
--
-- Deliberately anonymous: no name, no email, no request id, nothing that ties
-- a row back to an applicant. It exists only to answer "is our hiring fair
-- across everyone who applied," in aggregate. Nobody screening candidates
-- sees it, and these answers are never emailed.
create table if not exists public.application_demographics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role_slug text not null,
  gender text,
  gender_self_described text,
  ethnicity text,
  disability text,
  veteran text
);
create index if not exists application_demographics_role_idx on public.application_demographics (role_slug, created_at desc);
alter table public.application_demographics enable row level security;
-- No policies on purpose: only the service-role key (server routes) can write.

-- Aggregate view: counts only, never individual rows.
create or replace view public.application_demographics_summary as
select role_slug, gender, ethnicity, disability, veteran, count(*) as applicants
from public.application_demographics
group by role_slug, gender, ethnicity, disability, veteran;
