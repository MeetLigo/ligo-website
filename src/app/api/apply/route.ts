import { NextResponse } from "next/server";
import { sendNotificationEmail, type EmailAttachment } from "@/lib/sendgrid";
import { postCareersSlack } from "@/lib/slack";
import { getRole } from "@/lib/careers";
import {
  emailAllowed, noteSend, preflight, sendBudget, subjectSafe, tooMany, DAY, HOUR,
} from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Micah's careers intake on the platform. Same shape as the club intake:
// POST only, gated on a shared secret sent as x-ligo-careers-key. The key
// lives in the Amplify env and is listed in amplify.yml so the build copies
// it into the runtime; it is never in the repo.
const INTAKE_URL = "https://careers-intake-ligo.nyc.appwrite.run/";

// The platform is the record. Email is the notification, so the team hears
// about a candidate without opening the admin panel. An application that
// reaches the platform counts as received even if the email then fails.
const APPLICATIONS_TO = "mekhi@meetligo.com";
const APPLICATIONS_CC = ["micah@meetligo.com", "tj@meetligo.com"];

// Self-identification goes in the same POST under its own key. Micah's side
// files it in a separate collection with nothing linking it to a person, so
// it stays out of anything a reviewer opens.
const SELF_ID_FIELDS = ["sid_gender", "sid_gender_self", "sid_ethnicity", "sid_disability", "sid_veteran"] as const;

const REQUIRED: [string, string][] = [
  ["first_name", "missing_first_name"],
  ["last_name", "missing_last_name"],
  ["year", "missing_year"],
  ["motivation", "missing_motivation"],
  ["elig_work_auth", "missing_elig_work_auth"],
  ["role", "missing_role"],
  ["availability", "missing_availability"],
];

/** Supabase errors are plain objects, not Error instances; read a message off either. */
function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return String(e);
}

function str(fd: FormData, key: string, max = 4000) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// ADDED 2026-09-16. Per-field caps, matched to what careers-intake already
// clamps to so the website is never the looser side. Anything not listed keeps
// str()'s 4000 default.
const CAPS: Record<string, number> = {
  email: 254, first_name: 120, last_name: 120, phone: 40, year: 40,
  referral_source: 200, motivation: 200, availability: 200, why_role: 4000,
  link_instagram: 200, link_linkedin: 200, link_tiktok: 200, link_portfolio: 200,
};
const f = (fd: FormData, key: string) => str(fd, key, CAPS[key] ?? 4000);

const ROUTE = "apply";

// POST /api/apply → multipart form from /careers/apply. Validates, emails the
// application, and writes self-ID answers anonymously (never emailed).
export async function POST(req: Request) {
  // ADDED 2026-09-16. The guard runs on headers only, then the body is read
  // through a byte cap BEFORE any multipart parsing: parsing first would mean
  // doing the expensive work on a hostile payload, which is the point of
  // sending one. 256 KB is generous for a form with no file upload.
  const pre = await preflight(req, {
    route: ROUTE,
    maxBytes: 256 * 1024,
    global: [{ windowMs: HOUR, max: 25 }, { windowMs: DAY, max: 60 }],
    perIp: [{ windowMs: HOUR, max: 10 }],
    limited: tooMany,
  });
  if (!pre.ok) return pre.response;

  let fd: FormData;
  try {
    // Reusing the original headers keeps the multipart boundary, so this parses
    // exactly as req.formData() did.
    fd = await new Response(pre.bytes, { headers: req.headers }).formData();
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }

  // honeypot: real users never fill this. RENAMED 2026-09-16 from "website",
  // which password managers fill on their own; every trip here is a silently
  // discarded application, so it is logged now rather than vanishing.
  if (str(fd, "ligo_ref2", 100)) {
    console.warn("guard: apply honeypot tripped:", f(fd, "email"));
    return NextResponse.json({ ok: true });
  }

  for (const [key, err] of REQUIRED) {
    if (!f(fd, key)) return NextResponse.json({ error: err }, { status: 400 });
  }

  const email = f(fd, "email").toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (f(fd, "motivation") === "Something else" && !f(fd, "why_role")) {
    return NextResponse.json({ error: "missing_why_role" }, { status: 400 });
  }

  const roleSlug = str(fd, "role");
  const role = getRole(roleSlug);
  if (!role) return NextResponse.json({ error: "invalid_role" }, { status: 400 });

  // Three applications from one address a day. A real candidate applying for
  // every open role is two or three; a script is not.
  if (!emailAllowed(ROUTE, email, [{ windowMs: DAY, max: 3 }])) {
    return tooMany(3600);
  }

  const attachments: EmailAttachment[] = [];
  const name = `${f(fd, "first_name")} ${f(fd, "last_name")}`;

  // Hoisted out of `lines` so the email and the Slack post render the same set
  // from one source instead of two copies that drift.
  const LINK_FIELDS: [string, string][] = [
    ["Instagram", "link_instagram"],
    ["LinkedIn", "link_linkedin"],
    ["TikTok", "link_tiktok"],
    ["Portfolio", "link_portfolio"],
  ];
  const links: [string, string][] = LINK_FIELDS
    .map(([label, k]) => [label, str(fd, k)] as [string, string])
    .filter(([, value]) => Boolean(value));

  const lines: string[] = [
    `New application from meetligo.com/careers`,
    ``,
    `ROLE: ${role.title}`,
    `NAME: ${name}`,
    `EMAIL: ${email}`,
    `PHONE: ${f(fd, "phone") || "(not given)"}`,
    `YEAR: ${f(fd, "year")}`,
    `AVAILABILITY: ${f(fd, "availability")}`,
    `DRAWN TO IT BY: ${f(fd, "motivation")}`,
    `HEARD ABOUT US: ${f(fd, "referral_source") || "(not given)"}`,
    ``,
    `AUTHORIZED TO WORK IN THE US: ${str(fd, "elig_work_auth")}`,
    `--- Links ---`,
    ...(links.length ? links.map(([label, value]) => `${label}: ${value}`) : ["(none given)"]),
    ``,
    ...(f(fd, "why_role") ? [`--- In their words ---`, f(fd, "why_role"), ``] : []),

  ];

  // 1. the record: the platform's review queue
  const key = process.env.LIGO_CAREERS_KEY;
  let requestId = "";
  let storeError = "";

  if (key) {
    try {
      const payload: Record<string, string> = {
        role_slug: role.slug,
        role_title: role.title,
        first_name: f(fd, "first_name"),
        last_name: f(fd, "last_name"),
        email,
        phone: f(fd, "phone"),
        year: f(fd, "year"),
        referral_source: f(fd, "referral_source"),
        work_authorized: str(fd, "elig_work_auth"),
        motivation: f(fd, "motivation"),
        why_role: f(fd, "why_role"),
        availability: f(fd, "availability"),
        link_instagram: f(fd, "link_instagram"),
        link_linkedin: f(fd, "link_linkedin"),
        link_tiktok: f(fd, "link_tiktok"),
        link_portfolio: f(fd, "link_portfolio"),
      };
      // only send self-ID when something was actually answered
      const selfId: Record<string, string> = {};
      for (const f of SELF_ID_FIELDS) {
        const v = str(fd, f);
        if (v && v !== "Prefer not to say") selfId[f] = v;
      }

      const res = await fetch(INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ligo-careers-key": key },
        body: JSON.stringify({ ...payload, ...(Object.keys(selfId).length ? { self_id: selfId } : {}) }),
        cache: "no-store",
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; requestId?: string; error?: string };
      if (!res.ok || json.ok === false) throw new Error(`intake ${res.status}: ${json.error ?? "unknown"}`);
      requestId = json.requestId ?? "";
    } catch (e) {
      storeError = errMsg(e);
      console.error("[/api/apply] intake failed:", storeError);
    }
  } else {
    storeError = "LIGO_CAREERS_KEY not set";
    console.error("[/api/apply] LIGO_CAREERS_KEY not set; email is the only record");
  }

  const stored = Boolean(requestId);
  if (stored) lines.push(`In the admin panel. Request id: ${requestId}`, ``);
  else lines.push(`NOT IN THE ADMIN PANEL (${storeError}). This email is the only copy.`, ``);

  // 2. the fast notification: Slack. Placed ahead of the email on purpose.
  // The email has two paths that end in nobody being told (the send budget runs
  // out, or SendGrid fails), and those are exactly the applications most likely
  // to be missed. Slack posting first means the channel hears about every
  // application that gets this far, email or no email.
  //
  // Wrapped and swallowed: a webhook that 404s or a channel that was archived
  // must never turn a submitted application into an error for the candidate.
  // No self-ID answers are passed; see the note on SELF_ID_FIELDS above.
  try {
    await postCareersSlack({
      roleTitle: role.title,
      name,
      email,
      phone: f(fd, "phone"),
      year: f(fd, "year"),
      availability: f(fd, "availability"),
      motivation: f(fd, "motivation"),
      referralSource: f(fd, "referral_source"),
      workAuthorized: str(fd, "elig_work_auth"),
      links,
      whyRole: f(fd, "why_role"),
      stored,
      requestId,
      storeError,
    });
  } catch (e) {
    console.error("[/api/apply] slack failed:", errMsg(e));
  }

  // 3. the slow notification. When the day's send budget is gone and the
  // application IS in the queue, skip the email and return the shape the
  // client already treats as success. Burn the notification, never the
  // candidate.
  if (stored && !sendBudget("queued")) {
    console.error(`guard: daily send budget exhausted; application ${requestId} is in the queue but nobody was emailed`);
    return NextResponse.json({ ok: true, stored: true, emailed: false });
  }

  try {
    await sendNotificationEmail({
      to: APPLICATIONS_TO,
      cc: APPLICATIONS_CC,
      // subjectSafe: a typed name reaches a mail header, which cannot carry
      // newlines.
      subject: `${stored ? "" : "[NOT IN QUEUE] "}Application: ${role.title} · ${subjectSafe(name)}`,
      text: lines.join("\n"),
      replyTo: email,
      attachments,
    });
    noteSend();
    return NextResponse.json({ ok: true, stored });
  } catch (e) {
    const message = errMsg(e);
    console.error("[/api/apply] email failed:", message);
    // on the platform but unannounced: the candidate is safe either way
    if (stored) {
      console.error(`[/api/apply] APPLICATION ${requestId} IS IN THE QUEUE BUT NOBODY WAS EMAILED`);
      return NextResponse.json({ ok: true, stored: true, emailed: false });
    }
    // No `message` field: it carried SendGrid's own response text to the
    // visitor, which told a flooder exactly when the quota ran out.
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
