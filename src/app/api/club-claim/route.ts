import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/club-claim → the homepage "I run a club" form (name, club, email);
// the lead is emailed to the team for follow-up.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const club = String(body.club ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!name) return NextResponse.json({ error: "missing_name" }, { status: 400 });
  if (!club) return NextResponse.json({ error: "missing_club" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await sendNotificationEmail({
      to: "micah@meetligo.com",
      subject: `New club claim: ${club}`,
      text: `New club claim from meetligo.com:\n\nName: ${name}\nClub: ${club}\nEmail: ${email}`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/club-claim POST]", message);
    return NextResponse.json({ error: "send_failed", message }, { status: 502 });
  }
}
