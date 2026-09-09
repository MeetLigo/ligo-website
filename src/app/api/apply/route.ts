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

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const REQUIRED: [string, string][] = [
  ["first_name", "missing_first_name"],
  ["last_name", "missing_last_name"],
  ["year", "missing_year"],
  ["grad_year", "missing_grad_year"],
  ["major", "missing_major"],
  ["elig_georgetown", "missing_elig_georgetown"],
  ["elig_on_campus", "missing_elig_on_campus"],
  ["elig_work_auth", "missing_elig_work_auth"],
  ["elig_18", "missing_elig_18"],
  ["role", "missing_role"],
  ["why_role", "missing_why_role"],
  ["why_fit", "missing_why_fit"],
  ["orgs", "missing_orgs"],
  ["availability", "missing_availability"],
  ["desired_pay", "missing_desired_pay"],
  ["got_students_to_do", "missing_got_students_to_do"],
  ["fifty_users", "missing_fifty_users"],
];

function str(fd: FormData, key: string, max = 4000) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// POST /api/apply → multipart form from /careers/apply. Validates, emails the
// application (resume attached if given), and emails self-ID answers separately.
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

  for (const q of role.questions) {
    if (q.required !== false && !str(fd, q.id)) return NextResponse.json({ error: `missing_${q.id}` }, { status: 400 });
  }

  // resume, required
  const attachments: EmailAttachment[] = [];
  const resume = fd.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "missing_resume" }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_BYTES) return NextResponse.json({ error: "resume_too_large" }, { status: 400 });
  const ext = RESUME_TYPES[resume.type];
  if (!ext) return NextResponse.json({ error: "resume_bad_type" }, { status: 400 });
  {
    const buf = Buffer.from(await resume.arrayBuffer());
    const safeName = `${str(fd, "last_name")}-${str(fd, "first_name")}-resume.${ext}`.replace(/[^\w.-]+/g, "_");
    attachments.push({ content: buf.toString("base64"), filename: safeName, type: resume.type });
  }

  const name = `${str(fd, "first_name")} ${str(fd, "last_name")}`;
  const lines: string[] = [
    `New application from meetligo.com/careers`,
    ``,
    `ROLE: ${role.title}`,
    `NAME: ${name}`,
    `EMAIL: ${email}`,
    `PHONE: ${str(fd, "phone") || "(not given)"}`,
    `YEAR: ${str(fd, "year")}, ${str(fd, "major")}, graduating ${str(fd, "grad_year")}`,
    `AVAILABILITY: ${str(fd, "availability")}${str(fd, "availability_notes") ? ` (${str(fd, "availability_notes")})` : ""}`,
    `DESIRED PAY: ${str(fd, "desired_pay")}`,
    `HEARD ABOUT US: ${str(fd, "referral_source") || "(not given)"}`,
    `RESUME: ${attachments.length ? attachments[0].filename : "(none)"}`,
    ``,
    `--- Eligibility ---`,
    `Current Georgetown student: ${str(fd, "elig_georgetown")}`,
    `On campus for the full term: ${str(fd, "elig_on_campus")}`,
    `Authorized to work in the US: ${str(fd, "elig_work_auth")}`,
    `18 or older: ${str(fd, "elig_18")}`,
    ``,
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
    `--- Why you're a fit ---`,
    str(fd, "why_fit"),
    ``,
    `--- Organizations and communities ---`,
    str(fd, "orgs"),
    ``,
    `--- Something you got other students to do ---`,
    str(fd, "got_students_to_do"),
    ``,
    `--- A week to get 50 new users ---`,
    str(fd, "fifty_users"),
    ``,
    `=== ${role.title}: role-specific ===`,
  ];
  for (const q of role.questions) {
    lines.push(``, `--- ${q.label} ---`, str(fd, q.id) || "(skipped)");
  }

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
