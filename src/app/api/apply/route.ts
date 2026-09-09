import { NextResponse } from "next/server";
import { sendNotificationEmail, type EmailAttachment } from "@/lib/sendgrid";
import { supabaseAdmin } from "@/lib/supabase";
import { getRole } from "@/lib/careers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Applications go to Mekhi with Micah copied until careers@meetligo.com exists;
// then swap APPLICATIONS_TO to that inbox.
//
// Voluntary self-identification is NOT emailed and never reaches a reviewer.
// It is written to Supabase application_demographics with no name, email, or
// any other link back to the applicant, purely so the aggregate can be checked
// later. See supabase/application_demographics.sql.
const APPLICATIONS_TO = "mekhi@meetligo.com";
const APPLICATIONS_CC = ["micah@meetligo.com"];

const REQUIRED: [string, string][] = [
  ["first_name", "missing_first_name"],
  ["last_name", "missing_last_name"],
  ["year", "missing_year"],
  ["motivation", "missing_motivation"],
  ["elig_work_auth", "missing_elig_work_auth"],
  ["role", "missing_role"],
  ["why_role", "missing_why_role"],
  ["availability", "missing_availability"],
  ["desired_pay", "missing_desired_pay"],
];

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
    `DESIRED PAY: ${str(fd, "desired_pay")}`,
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
    `--- Why this role ---`,
    str(fd, "why_role"),
    ``,

  ];

  // Voluntary self-identification, detached from the application on purpose:
  // written anonymously, never emailed, best effort so it can never block a
  // submission.
  try {
    const gender = str(fd, "sid_gender");
    const ethnicity = str(fd, "sid_ethnicity");
    const disability = str(fd, "sid_disability");
    const veteran = str(fd, "sid_veteran");
    const answered = [gender, ethnicity, disability, veteran].some((v) => v && v !== "Prefer not to say");
    if (answered) {
      const { error } = await supabaseAdmin().from("application_demographics").insert({
        role_slug: role.slug,
        gender: gender || null,
        gender_self_described: gender === "Prefer to self-describe" ? str(fd, "sid_gender_self") || null : null,
        ethnicity: ethnicity || null,
        disability: disability || null,
        veteran: veteran || null,
      });
      if (error) throw error;
    }
  } catch (e) {
    console.error("[/api/apply] demographics write skipped:", e instanceof Error ? e.message : e);
  }

  try {
    await sendNotificationEmail({
      to: APPLICATIONS_TO,
      cc: APPLICATIONS_CC,
      subject: `Application: ${role.title} · ${name}`,
      text: lines.join("\n"),
      replyTo: email,
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/apply POST]", message);
    return NextResponse.json({ error: "send_failed", message }, { status: 502 });
  }
}
