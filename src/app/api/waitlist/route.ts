import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/waitlist → the homepage other-campus waitlist (email only).
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await sendNotificationEmail({
      to: "mekhi@meetligo.com",
      subject: "New campus waitlist signup",
      text: `New waitlist signup from meetligo.com:\n\nEmail: ${email}`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/waitlist POST]", message);
    return NextResponse.json({ error: "send_failed", message }, { status: 502 });
  }
}
