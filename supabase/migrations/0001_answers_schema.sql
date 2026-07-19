-- 0001_answers_schema.sql
-- One submission = one row: song + email + school together.
-- The wall_ranking view powers the live reveal counts.

create table public.answers (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null    default now(),
  song_name        text        not null,
  artist           text,
  album_art_url    text,
  spotify_track_id text,                    -- NULL = free-text pick (excluded from ranking)
  isrc             text,
  is_freetext      boolean     not null default false,
  email            text        not null,   -- collected at the reveal step
  school           text,
  is_seed          boolean     not null default false
);

-- fast aggregation for the wall (only real, track-matched picks are ranked)
create index answers_track_id_idx
  on public.answers (spotify_track_id)
  where spotify_track_id is not null;

create index answers_school_idx on public.answers (school);

-- The wall: an all-time chart, counts MERGED per spotify_track_id so the same
-- track = one ranked entry. Free-text picks (spotify_track_id IS NULL) are
-- excluded from the ranking here but remain stored in `answers`.
-- Per-track display metadata = the earliest submission's values (deterministic).
create or replace view public.wall_ranking as
select
  spotify_track_id,
  (array_agg(song_name     order by created_at))[1] as song_name,
  (array_agg(artist        order by created_at))[1] as artist,
  (array_agg(album_art_url order by created_at))[1] as album_art_url,
  count(*)::int                                      as pick_count
from public.answers
where spotify_track_id is not null
group by spotify_track_id
order by pick_count desc, song_name asc;
