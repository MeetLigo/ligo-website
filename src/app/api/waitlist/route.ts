import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";
import { cap, emailAllowed, noteSend, parseJsonBody, preflight, sendBudget, HOUR, TEN_MIN, DAY } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "waitlist";

// POST /api/waitlist → the homepage other-campus waitlist (email only).
export async function POST(req: Request) {
  // ADDED 2026-09-16: a refusal here is a SILENT 200, not a 429. Landing.tsx's
  // StudentPanel is `if (res.ok) setSent(true)` with no error branch and no
  // failure copy, so a 429 would produce complete silence and a re-enabled
  // button. It is also the honest answer: the per-email tier only fires on a
  // third submission from one address in a day, and that person is already on
  // the waitlist. Log the drop, do not tell them.
  const pre = await preflight(req, {
    route: ROUTE,
    maxBytes: 8 * 1024,
    global: [{ windowMs: TEN_MIN, max: 40 }, { windowMs: HOUR, max: 150 }],
    perIp: [{ windowMs: TEN_MIN, max: 8 }, { windowMs: HOUR, max: 30 }],
    limited: () => {
      console.warn("guard: waitlist submission dropped silently");
      return NextResponse.json({ ok: true });
    },
  });
  if (!pre.ok) return pre.response;

  const body = parseJsonBody(pre.bytes);
  if (!body) return NextResponse.json({ error: "bad_json" }, { status: 400 });

  const email = cap(body.email, 254).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!emailAllowed(ROUTE, email, [{ windowMs: DAY, max: 2 }])) {
    console.warn("guard: waitlist per-email tier tripped");
    return NextResponse.json({ ok: true });
  }

  // The email IS the only record here, so this route stops at the reserve line
  // and leaves the last of the day's budget to the routes that queue a club or
  // a candidate on the platform.
  if (!sendBudget("email_only")) {
    console.error("guard: daily send budget exhausted; waitlist signup not emailed:", email);
    return NextResponse.json({ ok: true });
  }

  try {
    await sendNotificationEmail({
      to: "mekhi@meetligo.com",
      subject: "New campus waitlist signup",
      text: `New waitlist signup from meetligo.com:\n\nEmail: ${email}`,
      replyTo: email,
    });
    noteSend();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/waitlist POST]", message);
    // No `message` field: it used to carry SendGrid's own response body, which
    // told a flooder exactly when the quota ran out.
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
