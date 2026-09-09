import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";
import { CLUB_CATEGORIES, CLUB_ROLES } from "@/lib/clubs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Micah's club intake on the platform (see Ligo/Website/MICAH-HANDOFF.md and
// his "Platform to Website" reply). Gated on a shared secret sent as
// x-ligo-intake-key; the key lives in the hosting env, never in the repo.
const INTAKE_URL = "https://club-intake-ligo.nyc.appwrite.run/";
const TEAM = ["micah@meetligo.com", "mekhi@meetligo.com"];

type IntakeCheck = { ok: boolean; exists?: boolean; reason?: "club_exists" | "request_pending"; clubName?: string; status?: string };
type IntakeSubmit = { ok: boolean; accepted?: boolean; requestId?: string; reason?: string; error?: string };

async function intake<T>(key: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(INTAKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-ligo-intake-key": key },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(`intake ${res.status}: ${json.error ?? "unknown"}`);
  return json;
}

// POST /api/club-request → the "Create an account" form on /clubs/create.
// 1. dedupe check on the platform (club_exists / request_pending)
// 2. submit to the platform's review queue (shows up on the admin Activity page)
// 3. heads-up email to the team (best effort)
// Without LIGO_INTAKE_KEY in the env it falls back to email-only so the form
// never dead-ends, and the subject line says so loudly.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const s = (k: string, max = 500) => String(body[k] ?? "").trim().slice(0, max);

  // honeypot
  if (s("website")) return NextResponse.json({ ok: true, accepted: true });

  const clubName = s("club_name");
  const contactName = s("contact_name");
  const contactRole = s("contact_role");
  const clubEmail = s("club_email").toLowerCase();
  const instagram = s("instagram").replace(/^@/, "");
  const category = s("category");
  const notes = s("notes", 2000);

  if (!clubName) return NextResponse.json({ error: "missing_club_name" }, { status: 400 });
  if (!contactName) return NextResponse.json({ error: "missing_contact_name" }, { status: 400 });
  if (!CLUB_ROLES.includes(contactRole)) return NextResponse.json({ error: "missing_contact_role" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clubEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (category && !CLUB_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }

  const key = process.env.LIGO_INTAKE_KEY;
  let requestId = "";
  let existingName = "";

  if (key) {
    try {
      // 1. dedupe: an existing club or a pending request never reaches the queue
      const check = await intake<IntakeCheck>(key, { action: "check", clubName, clubEmail });
      if (check.exists) {
        return NextResponse.json({ ok: true, accepted: false, reason: check.reason, clubName: check.clubName ?? clubName });
      }
      // 2. submit
      const sub = await intake<IntakeSubmit>(key, {
        action: "submit",
        clubName,
        contactName,
        clubEmail,
        contactRole,
        instagram,
        category,
        notes,
      });
      if (!sub.accepted) {
        return NextResponse.json({ ok: true, accepted: false, reason: sub.reason ?? "club_exists", clubName });
      }
      requestId = sub.requestId ?? "";
      existingName = check.clubName ?? "";
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("[/api/club-request] intake failed:", message);
      return NextResponse.json({ error: "intake_failed", message }, { status: 502 });
    }
  } else {
    console.error("[/api/club-request] LIGO_INTAKE_KEY not set; email-only fallback");
  }

  // 3. heads-up to the team (best effort; the platform queue is the source of truth)
  const text = [
    key
      ? `New club account request is in the admin panel (Activity page). Request id: ${requestId || "(none returned)"}`
      : `New club account request. NOT sent to the platform: LIGO_INTAKE_KEY is missing from the website env. Add it and ask the club to resubmit, or enter it by hand.`,
    ``,
    `CLUB: ${clubName}${existingName ? ` (matched: ${existingName})` : ""}`,
    `CATEGORY: ${category || "(not given)"}`,
    `INSTAGRAM: ${instagram ? "@" + instagram : "(not given)"}`,
    `CONTACT: ${contactName}, ${contactRole}`,
    `CLUB EMAIL (they will sign in with this): ${clubEmail}`,
    ``,
    `NOTES:`,
    notes || "(none)",
  ].join("\n");

  try {
    await sendNotificationEmail({
      to: TEAM,
      subject: `${key ? "" : "[NO INTAKE KEY] "}Club account request: ${clubName}`,
      text,
      replyTo: clubEmail,
    });
  } catch (e) {
    console.error("[/api/club-request] notify failed:", e instanceof Error ? e.message : e);
    // the request is already queued on the platform; without a key, though, the email was the only record
    if (!key) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, accepted: true, requestId });
}
