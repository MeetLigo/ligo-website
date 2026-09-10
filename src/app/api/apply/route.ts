import { NextResponse } from "next/server";
import { sendNotificationEmail, type EmailAttachment } from "@/lib/sendgrid";
import { getRole } from "@/lib/careers";

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

// POST /api/apply → multipart form from /careers/apply. Validates, emails the
// application, and writes self-ID answers anonymously (never emailed).
export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }

  // honeypot: real users never fill this
  if (str(fd, "website")) return NextResponse.json({ ok: true });

  for (const [key, err] of REQUIRED) {
    if (!str(fd, key)) return NextResponse.json({ error: err }, { status: 400 });
  }

  const email = str(fd, "email").toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (str(fd, "motivation") === "Something else" && !str(fd, "why_role")) {
    return NextResponse.json({ error: "missing_why_role" }, { status: 400 });
  }

  const roleSlug = str(fd, "role");
  const role = getRole(roleSlug);
  if (!role) return NextResponse.json({ error: "invalid_role" }, { status: 400 });

  const attachments: EmailAttachment[] = [];
  const name = `${str(fd, "first_name")} ${str(fd, "last_name")}`;
  const lines: string[] = [
    `New application from meetligo.com/careers`,
    ``,
    `ROLE: ${role.title}`,
    `NAME: ${name}`,
    `EMAIL: ${email}`,
    `PHONE: ${str(fd, "phone") || "(not given)"}`,
    `YEAR: ${str(fd, "year")}`,
    `AVAILABILITY: ${str(fd, "availability")}`,
    `DRAWN TO IT BY: ${str(fd, "motivation")}`,
    `HEARD ABOUT US: ${str(fd, "referral_source") || "(not given)"}`,
    ``,
    `AUTHORIZED TO WORK IN THE US: ${str(fd, "elig_work_auth")}`,
    `--- Links ---`,
    ...(
      [
        ["Instagram", "link_instagram"],
        ["LinkedIn", "link_linkedin"],
        ["TikTok", "link_tiktok"],
        ["Portfolio", "link_portfolio"],
      ] as [string, string][]
    )
      .map(([label, k]) => (str(fd, k) ? `${label}: ${str(fd, k)}` : ""))
      .filter(Boolean)
      .concat([["link_instagram", "link_linkedin", "link_tiktok", "link_portfolio"].every((k) => !str(fd, k)) ? "(none given)" : ""])
      .filter(Boolean),
    ``,
    ...(str(fd, "why_role") ? [`--- In their words ---`, str(fd, "why_role"), ``] : []),

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
        first_name: str(fd, "first_name"),
        last_name: str(fd, "last_name"),
        email,
        phone: str(fd, "phone"),
        year: str(fd, "year"),
        referral_source: str(fd, "referral_source"),
        work_authorized: str(fd, "elig_work_auth"),
        motivation: str(fd, "motivation"),
        why_role: str(fd, "why_role"),
        availability: str(fd, "availability"),
        link_instagram: str(fd, "link_instagram"),
        link_linkedin: str(fd, "link_linkedin"),
        link_tiktok: str(fd, "link_tiktok"),
        link_portfolio: str(fd, "link_portfolio"),
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

  // 2. the notification
  try {
    await sendNotificationEmail({
      to: APPLICATIONS_TO,
      cc: APPLICATIONS_CC,
      subject: `${stored ? "" : "[NOT IN QUEUE] "}Application: ${role.title} · ${name}`,
      text: lines.join("\n"),
      replyTo: email,
      attachments,
    });
    return NextResponse.json({ ok: true, stored });
  } catch (e) {
    const message = errMsg(e);
    console.error("[/api/apply] email failed:", message);
    // on the platform but unannounced: the candidate is safe either way
    if (stored) {
      console.error(`[/api/apply] APPLICATION ${requestId} IS IN THE QUEUE BUT NOBODY WAS EMAILED`);
      return NextResponse.json({ ok: true, stored: true, emailed: false });
    }
    return NextResponse.json({ error: "send_failed", message: `${message}; store: ${storeError}` }, { status: 502 });
  }
}
