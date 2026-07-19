// Client-safe shared types (no server-only imports).

/** A song resolved on the landing (Spotify top match, or a free-text fallback). */
export interface ResolvedPick {
  song_name: string;
  artist: string | null;
  album_art_url: string | null;
  spotify_track_id: string | null;
  isrc: string | null;
  is_freetext: boolean;
}

/** One ranked entry from the wall_ranking view (all-time, merged per track). */
export interface WallEntry {
  spotify_track_id: string;
  song_name: string;
  artist: string | null;
  album_art_url: string | null;
  pick_count: number;
}
