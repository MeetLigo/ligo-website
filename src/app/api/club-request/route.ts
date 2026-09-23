import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";
import { CLUB_CATEGORIES, CLUB_ROLES } from "@/lib/clubs";
import {
  cap, emailAllowed, noteSend, parseJsonBody, preflight, sendBudget, subjectSafe, tooMany, HOUR, TEN_MIN,
} from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Micah's club intake on the platform (see Ligo/Website/MICAH-HANDOFF.md and
// his "Platform to Website" reply). Gated on a shared secret sent as
// x-ligo-intake-key; the key lives in the hosting env, never in the repo.
const INTAKE_URL = "https://club-intake-ligo.nyc.appwrite.run/";
const TEAM = ["micah@meetligo.com", "mekhi@meetligo.com"];
// When the intake key is missing, the request is Micah's to enter by hand
// and the fix is his env var, so only he hears about it. Mekhi got 62 of
// these in one afternoon from key-check tests; the website has no way to
// tell a test from a club until the key is live.
const FALLBACK_TO = ["micah@meetligo.com"];

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
/** Supabase errors are plain objects, not Error instances; read a message off either. */
function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return String(e);
}

// ADDED 2026-09-16. This is the tightest-limited route on the site, and not
// because of SendGrid: one POST here costs two Appwrite function executions,
// and club-intake pages the whole clubs collection into memory on each of
// them. Appwrite bills reads per row and throttles the whole project at the
// free cap, so a flood here degrades the mobile app and the admin panel too,
// not just the website. That blast radius is wider than the inbox.
const ROUTE = "club-request";

export async function POST(req: Request) {
  const pre = await preflight(req, {
    route: ROUTE,
    maxBytes: 32 * 1024,
    global: [{ windowMs: TEN_MIN, max: 20 }, { windowMs: HOUR, max: 60 }],
    perIp: [{ windowMs: TEN_MIN, max: 5 }, { windowMs: HOUR, max: 15 }],
    limited: tooMany,
  });
  if (!pre.ok) return pre.response;

  const body = parseJsonBody(pre.bytes);
  if (!body) return NextResponse.json({ error: "bad_json" }, { status: 400 });

  // honeypot. RENAMED 2026-09-16 from "website", which password managers fill
  // on their own, silently eating real submissions. It still answers with the
  // success shape: an error would tell a bot it had been caught.
  if (cap(body.ligo_ref2, 100)) {
    console.warn("guard: club-request honeypot tripped:", cap(body.club_email, 254));
    return NextResponse.json({ ok: true, accepted: true });
  }

  // Caps match what careers-intake already clamps to, so the website is never
  // the looser side. club-intake does NOT clamp before its write, so these are
  // load-bearing for that document.
  const clubName = cap(body.club_name, 120);
  const contactName = cap(body.contact_name, 120);
  const contactRole = cap(body.contact_role, 80);
  const clubEmail = cap(body.club_email, 254).toLowerCase();
  const instagram = cap(body.instagram, 30).replace(/^@/, "");
  const category = cap(body.category, 80);
  const notes = cap(body.notes, 2000);

  if (!clubName) return NextResponse.json({ error: "missing_club_name" }, { status: 400 });
  if (!contactName) return NextResponse.json({ error: "missing_contact_name" }, { status: 400 });
  if (!CLUB_ROLES.includes(contactRole)) return NextResponse.json({ error: "missing_contact_role" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clubEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (category && !CLUB_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }

  // One club, three tries an hour. Runs after validation so a malformed body
  // never spends someone's allowance, and before the Appwrite calls, which are
  // the expensive part.
  if (!emailAllowed(ROUTE, clubEmail, [{ windowMs: HOUR, max: 3 }])) {
    return tooMany(600);
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
      const message = errMsg(e);
      console.error("[/api/club-request] intake failed:", message);
      // No `message` field: it carried the upstream response text straight to
      // the visitor.
      return NextResponse.json({ error: "intake_failed" }, { status: 502 });
    }
  } else {
    console.error("[/api/club-request] LIGO_INTAKE_KEY not set; email to Micah is the only record");
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

  // The club is already in the review queue at this point, so a skipped or
  // failed notification costs a heads-up and not a club. When the day's send
  // budget is gone, drop the email and keep the submission.
  if (!sendBudget("queued")) {
    console.error(`guard: daily send budget exhausted; club request ${requestId || "(no id)"} queued but nobody emailed:`, clubName);
    return NextResponse.json({ ok: true, accepted: true, requestId });
  }

  try {
    await sendNotificationEmail({
      to: key ? TEAM : FALLBACK_TO,
      // subjectSafe: a club name reaches a mail header, which cannot carry
      // newlines.
      subject: `${key ? "" : "[NO INTAKE KEY] "}Club account request: ${subjectSafe(clubName)}`,
      text,
      replyTo: clubEmail,
    });
    noteSend();
  } catch (e) {
    console.error("[/api/club-request] notify failed:", errMsg(e));
    // queued on the platform, or at least stored: the club is safe either way
    // without the key the platform never saw it and the email was the only copy
    if (!key) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, accepted: true, requestId });
}
