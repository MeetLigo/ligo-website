-- seed.sql
-- A SMALL, clearly-marked placeholder wall so the reveal isn't empty pre-launch.
-- These are REAL Spotify tracks (real ids/art/isrc), inserted with is_seed = true.
-- Replace with actual team picks before launch.
--
-- Remove the whole seed anytime with:
--   delete from public.answers where is_seed;

insert into public.answers
  (song_name, artist, album_art_url, spotify_track_id, isrc, is_freetext, email, school, is_seed)
select v.song_name, v.artist, v.album_art_url, v.track_id, v.isrc,
       false, 'seed@meetligo.com', null, true
from (values
  ('Ivy',         'Frank Ocean',              'https://i.scdn.co/image/ab67616d00001e02c5649add07ed3720be9d5526', '2ZWlPOoWh0626oTaHrnl2a', 'QZ5C81600002', 3),
  ('Money Trees', 'Kendrick Lamar, Jay Rock', 'https://i.scdn.co/image/ab67616d00001e02d28d2ebdedb220e479743797', '2HbKqm4o0w5wEeEFXm2sD4', 'USUM71210785', 2),
  ('Not Like Us', 'Kendrick Lamar',           'https://i.scdn.co/image/ab67616d00001e021ea0c62b2339cbf493a999ad', '6AI3ezQ4o3HUoP6Dhudph3', 'USUG12400910', 2),
  ('Snooze',      'SZA',                      'https://i.scdn.co/image/ab67616d00001e02bc18bdade69ec5ef0bb25b17', '4iZ4pt7kvcaH6Yo8UoZ4s2', 'USRC12204591', 1),
  ('Espresso',    'Sabrina Carpenter',        'https://i.scdn.co/image/ab67616d00001e02255ec9ddd8af81fd9aba2ced', '1vLqigPHwiFnXsfrLMehV1', 'USUM72404979', 1),
  ('Nights',      'Frank Ocean',              'https://i.scdn.co/image/ab67616d00001e02c5649add07ed3720be9d5526', '7eqoqGkKwgOaWNNHx90uEZ', 'QZ5C81600009', 1)
) as v(song_name, artist, album_art_url, track_id, isrc, cnt)
cross join lateral generate_series(1, v.cnt);
-- 3+2+2+1+1+1 = 10 rows total.
