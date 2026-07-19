import "server-only";
import type { ResolvedPick } from "./pick";

/**
 * Spotify Web API — SERVER ONLY, Client-Credentials flow (no user login).
 * Token is cached in-process until shortly before it expires.
 */
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 5000) return cached.token;
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Spotify env vars are not set");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`);
  const json = await res.json();
  cached = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

/** Search tracks; returns them shaped for the `answers` row / reveal. */
export async function searchTracks(query: string, limit = 6): Promise<Omit<ResolvedPick, "is_freetext">[]> {
  const q = query.trim();
  if (!q) return [];
  const token = await getAccessToken();
  const url = `https://api.spotify.com/v1/search?type=track&limit=${limit}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Spotify search error: ${res.status}`);
  const json = await res.json();
  const items: unknown[] = json.tracks?.items ?? [];

  return items.map((raw) => {
    const t = raw as {
      id: string;
      name: string;
      artists?: { name: string }[];
      album?: { images?: { url: string }[] };
      external_ids?: { isrc?: string };
    };
    return {
      spotify_track_id: t.id,
      song_name: t.name,
      artist: (t.artists ?? []).map((a) => a.name).join(", ") || null,
      album_art_url: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? null,
      isrc: t.external_ids?.isrc ?? null,
    };
  });
}
