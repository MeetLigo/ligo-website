import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/answers → the live wall (all-time, ranked, merged per track).
export async function GET() {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("wall_ranking")
      .select("spotify_track_id, song_name, artist, album_art_url, pick_count")
      .order("pick_count", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ wall: data ?? [] });
  } catch (e) {
    console.error("[/api/answers GET]", e);
    return NextResponse.json({ wall: [], error: "wall_failed" }, { status: 502 });
  }
}

// POST /api/answers → complete a submission: one row with song + email + school.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const song_name = String(body.song_name ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!song_name) {
    return NextResponse.json({ error: "missing_song" }, { status: 400 });
  }

  const spotify_track_id = body.spotify_track_id ? String(body.spotify_track_id) : null;
  const school = body.school ? String(body.school) : schoolFromEmail(email);

  try {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from("answers").insert({
      song_name,
      artist: body.artist ? String(body.artist) : null,
      album_art_url: body.album_art_url ? String(body.album_art_url) : null,
      spotify_track_id,
      isrc: body.isrc ? String(body.isrc) : null,
      is_freetext: spotify_track_id === null, // free-text = no resolved track
      email,
      school,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/answers POST]", e);
    return NextResponse.json({ error: "insert_failed" }, { status: 502 });
  }
}

// Basic campus derivation from the email domain (school column is nullable).
function schoolFromEmail(email: string): string | null {
  const domain = email.split("@")[1] ?? "";
  if (domain.includes("georgetown")) return "Georgetown";
  if (domain.includes("howard")) return "Howard";
  return null;
}
