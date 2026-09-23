import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/sendgrid";
import { cap, emailAllowed, noteSend, parseJsonBody, preflight, sendBudget, tooMany, HOUR } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "partner-lead";

// POST /api/partner-lead → a club/org fills out the Partner page CTA
// (org, school, email); we email the lead to the team so they can follow up.
export async function POST(req: Request) {
  const pre = await preflight(req, {
    route: ROUTE,
    maxBytes: 8 * 1024,
    global: [{ windowMs: HOUR, max: 15 }],
    perIp: [{ windowMs: HOUR, max: 5 }],
    limited: tooMany,
  });
  if (!pre.ok) return pre.response;

  const body = parseJsonBody(pre.bytes);
  if (!body) return NextResponse.json({ error: "bad_json" }, { status: 400 });

  // ADDED 2026-09-16: `org` reaches the mail subject line, and all three were
  // uncapped before this.
  const org = cap(body.org, 120);
  const school = cap(body.school, 120);
  const email = cap(body.email, 254).toLowerCase();

  if (!org) return NextResponse.json({ error: "missing_org" }, { status: 400 });
  if (!school) return NextResponse.json({ error: "missing_school" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!emailAllowed(ROUTE, email, [{ windowMs: HOUR, max: 2 }])) {
    return tooMany(600);
  }

  // Email-only record, so it stops at the reserve line. See lib/guard.ts.
  if (!sendBudget("email_only")) {
    console.error("guard: daily send budget exhausted; partner lead not emailed:", email);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  try {
    await sendLeadEmail({ org, school, email });
    noteSend();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/partner-lead POST]", message);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
