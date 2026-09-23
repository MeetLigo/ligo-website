import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GONE 2026-09-16.
 *
 * This was the homepage "I run a club" form (name, club, email), emailed
 * straight to micah@meetligo.com. The form was removed from the homepage and
 * nothing in src/ has called this route since; a repo-wide search finds only
 * this file and one comment in lib/sendgrid.ts. What was left was a public,
 * unauthenticated POST that put an uncapped attacker-supplied string into a
 * mail subject line and sent it to the founder, with no rate limit, no
 * honeypot and no caps.
 *
 * It answers 410 rather than being deleted outright: if some link, QR code or
 * old client does still point here, a clear refusal is a better failure than a
 * 404 that looks like a deploy problem, and the abuse surface is closed either
 * way. Delete the file once that is confirmed. /clubs/create is the live path
 * for a club that wants an account.
 */
export function POST() {
  return NextResponse.json({ error: "gone" }, { status: 410 });
}
