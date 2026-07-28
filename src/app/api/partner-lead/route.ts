import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/sendgrid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/partner-lead → a club/org fills out the Partner page CTA
// (org, school, email); we email the lead to the team so they can follow up.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const org = String(body.org ?? "").trim();
  const school = String(body.school ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!org) return NextResponse.json({ error: "missing_org" }, { status: 400 });
  if (!school) return NextResponse.json({ error: "missing_school" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await sendLeadEmail({ org, school, email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/partner-lead POST]", message);
    return NextResponse.json({ error: "send_failed", message }, { status: 502 });
  }
}
