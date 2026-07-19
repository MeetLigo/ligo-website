import { NextResponse } from "next/server";
import { searchTracks } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/search?q=… → Spotify track matches (server-side Client Credentials).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ tracks: [] });
  try {
    const tracks = await searchTracks(q, 6);
    return NextResponse.json({ tracks });
  } catch (e) {
    console.error("[/api/search]", e);
    return NextResponse.json({ tracks: [], error: "search_failed" }, { status: 502 });
  }
}
