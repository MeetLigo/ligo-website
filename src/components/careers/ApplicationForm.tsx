"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Role } from "@/lib/careers";

/**
 * The Georgetown campus team application, one per role
 * (/careers/apply/[role]). The role is fixed by the page above it, so this is
 * only the questions: about you, the ones everyone answers, the role's own
 * set from careers.ts, an optional resume, and voluntary self-identification.
 * Posts multipart to /api/apply.
 *
 * Self-identification is stored anonymously and never emailed. See the route.
 */

const INPUT =
  "min-w-0 w-full rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[15px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/60";
const TEXTAREA = `${INPUT} min-h-[120px] resize-y leading-[1.5]`;
const SELECT = `${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2314110D%22 stroke-width=%222.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat pr-10`;

const YEARS = ["First-year", "Sophomore", "Junior", "Senior", "Graduate student"];
const GRAD_YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"];
const YES_NO = ["Yes", "No"];
const WORK_AUTH = ["Yes", "No", "Not sure"];
const AVAILABILITY = ["Under 4 hours a week", "4 to 6 hours a week", "6 to 8 hours a week", "8 or more hours a week"];
const SOURCES = ["Instagram", "A friend or classmate", "A club or org", "The Ligo app", "LinkedIn", "Somewhere else"];

const GENDER = ["Woman", "Man", "Non-binary", "Prefer to self-describe", "Prefer not to say"];
const ETHNICITY = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Middle Eastern or North African",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or more races or ethnicities",
  "Prefer not to say",
];
const DISABILITY = ["Yes, I have a disability or have had one in the past", "No, I do not have a disability", "Prefer not to say"];
const VETERAN = ["I am a veteran", "I am not a veteran", "Prefer not to say"];

const ERRORS: Record<string, string> = {
  invalid_email: "Enter a valid email.",
  invalid_role: "That role isn't open right now.",
  missing_resume: "Attach your resume to finish.",
  resume_too_large: "Resume needs to be under 5 MB.",
  resume_bad_type: "Resume needs to be a PDF or Word doc.",
};

function Field({
  label,
  hint,
  htmlFor,
  required = true,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    // h-full + mt-auto keeps controls on the same baseline across a grid row,
    // even when one field carries a hint and its neighbour doesn't
    <div className="flex h-full flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14.5px] font-semibold leading-snug text-ink">
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-[#C0512B]">
            *
          </span>
        ) : (
          <span className="ml-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink/[0.45]">optional</span>
        )}
      </label>
      {hint && <div className="-mt-1 text-[13px] leading-snug text-ink/[0.55]">{hint}</div>}
      <div className="mt-auto">{children}</div>
    </div>
  );
}

function Part({
  n,
  title,
  sub,
  first = false,
  children,
}: {
  n: string;
  title: string;
  sub?: React.ReactNode;
  /** the first section sits under the required-field key, so it needs no rule */
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={first ? "" : "border-t border-ink/[0.12] pt-8"}>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[13px] font-medium tabular-nums text-[#EA580C]">{n}</span>
        <h3 className="font-serif text-[24px] font-medium leading-tight tracking-[-0.01em] text-ink">{title}</h3>
      </div>
      {sub && <p className="mt-2 max-w-[620px] text-[14px] leading-[1.55] text-ink/[0.6]">{sub}</p>}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function ApplicationForm({ role }: { role: Role }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [genderSelf, setGenderSelf] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/apply", { method: "POST", body: new FormData(form) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) {
        const key = typeof j.error === "string" ? j.error : "";
        throw new Error(
          ERRORS[key] ||
            (key.startsWith("missing_")
              ? "Looks like something's blank. Check the form and try again."
              : j.message || `HTTP ${res.status}`),
        );
      }
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[14px] border border-ink/[0.14] bg-white/60 p-8 text-ink sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#71C07F]/[0.18]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3E8A4B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <h3 className="font-serif text-[28px] font-medium leading-tight text-ink">Got it. Thank you.</h3>
        </div>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink/[0.75]">
          Your application for the {role.title} role is in. A person on the team reads every one. If it looks like a fit,
          you&apos;ll hear from us about a short call. Either way, we&apos;ll let you know.
        </p>
        <Link href="/careers#roles" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[#EA580C]">
          Back to careers
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative text-ink">
      {/* the role this form is for, and the required-field key */}
      <input type="hidden" name="role" value={role.slug} />
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-9">
        <div className="text-[13px] text-ink/[0.55]">
          <span aria-hidden className="text-[#C0512B]">
            *
          </span>{" "}
          indicates a required field
        </div>

        {/* 01 about you */}
        <Part n="01" title="About you" first>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="First name" htmlFor="first_name">
              <input id="first_name" name="first_name" required autoComplete="given-name" className={INPUT} />
            </Field>
            <Field label="Last name" htmlFor="last_name">
              <input id="last_name" name="last_name" required autoComplete="family-name" className={INPUT} />
            </Field>
            <Field label="Georgetown email" htmlFor="email">
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@georgetown.edu" className={INPUT} />
            </Field>
            <Field label="Phone" htmlFor="phone" required={false}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={INPUT} />
            </Field>
            <Field label="Year" htmlFor="year">
              <select id="year" name="year" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label="Expected graduation" htmlFor="grad_year">
              <select id="grad_year" name="grad_year" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {GRAD_YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label="Major" htmlFor="major">
              <input id="major" name="major" required placeholder="Government, or undeclared" className={INPUT} />
            </Field>
            <Field label="How did you hear about this?" htmlFor="referral_source" required={false}>
              <select id="referral_source" name="referral_source" defaultValue="" className={SELECT}>
                <option value="">Select...</option>
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </Part>

        {/* 02 eligibility */}
        <Part n="02" title="Eligibility" sub="These roles are paid work with a for-profit company in Washington, D.C., so we have to ask.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Are you a current Georgetown student?" htmlFor="elig_georgetown">
              <select id="elig_georgetown" name="elig_georgetown" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {YES_NO.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Will you be on campus for the full term?" htmlFor="elig_on_campus" hint="Roughly ten weeks this fall.">
              <select id="elig_on_campus" name="elig_on_campus" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {YES_NO.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Are you authorized to work in the United States?" htmlFor="elig_work_auth" hint="Not sure is a fine answer. If you're on a student visa we'll work out what's possible.">
              <select id="elig_work_auth" name="elig_work_auth" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {WORK_AUTH.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Are you 18 or older?" htmlFor="elig_18">
              <select id="elig_18" name="elig_18" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {YES_NO.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
        </Part>

        {/* 03 everyone answers */}
        <Part n="03" title="A few questions for everyone">
          <Field label="Why are you interested in this role?" htmlFor="why_role">
            <textarea id="why_role" name="why_role" required className={TEXTAREA} />
          </Field>
          <Field label="Why are you a fit for it?" htmlFor="why_fit" hint="Specifics beat adjectives. Tell us what you've actually done.">
            <textarea id="why_fit" name="why_fit" required className={TEXTAREA} />
          </Field>
          <Field label="What organizations and communities are you part of at Georgetown?" htmlFor="orgs" hint="Clubs, teams, jobs, group chats, whatever you're actually in.">
            <textarea id="orgs" name="orgs" required className={TEXTAREA} />
          </Field>
          <Field label="Tell us about something you personally got other students to do." htmlFor="got_students_to_do">
            <textarea id="got_students_to_do" name="got_students_to_do" required className={TEXTAREA} />
          </Field>
          <Field label="If you had a week to get 50 new users for us, how would you do it?" htmlFor="fifty_users">
            <textarea id="fifty_users" name="fifty_users" required className={TEXTAREA} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Weekly availability" htmlFor="availability">
              <select id="availability" name="availability" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {AVAILABILITY.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Anything we should know about your schedule?" htmlFor="availability_notes" required={false}>
              <input id="availability_notes" name="availability_notes" placeholder="Tuesdays and Thursdays are tough" className={INPUT} />
            </Field>
          </div>
          <Field label="Desired pay range" htmlFor="desired_pay" hint="Hourly. Roles are paid a base rate plus bonuses for what you deliver.">
            <input id="desired_pay" name="desired_pay" required placeholder="$20 to $23 an hour" className={`${INPUT} sm:max-w-[320px]`} />
          </Field>
        </Part>

        {/* 04 resume and links */}
        <Part n="04" title="Resume and links">
          <Field label="Resume" hint="PDF or Word, under 5 MB." htmlFor="resume">
            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-[12px] border border-dashed border-ink/[0.3] bg-white px-5 py-4 transition-colors hover:border-[#F97316]"
            >
              <span className="text-[14.5px] text-ink/[0.75]">{resumeName || "Choose a file"}</span>
              <span className="rounded-full border border-ink/[0.3] px-4 py-[7px] text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">
                {resumeName ? "Change" : "Attach"}
              </span>
              <input
                id="resume"
                name="resume"
                type="file"
                required
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Instagram" htmlFor="link_instagram" required={false}>
              <input id="link_instagram" name="link_instagram" placeholder="@you" className={INPUT} />
            </Field>
            <Field label="LinkedIn" htmlFor="link_linkedin" required={false}>
              <input id="link_linkedin" name="link_linkedin" placeholder="linkedin.com/in/you" className={INPUT} />
            </Field>
            <Field label="TikTok" htmlFor="link_tiktok" required={false}>
              <input id="link_tiktok" name="link_tiktok" placeholder="@you" className={INPUT} />
            </Field>
            <Field label="Portfolio or website" htmlFor="link_portfolio" required={false}>
              <input id="link_portfolio" name="link_portfolio" placeholder="yoursite.com" className={INPUT} />
            </Field>
          </div>
        </Part>

        {/* 05 the role's own questions */}
        <Part n="05" title={`For the ${role.title}`} sub="These matter more than anything else on the form.">
          {role.questions.map((q) => {
            const req = q.required !== false;
            return (
              <Field key={q.id} label={q.label} htmlFor={q.id} hint={q.hint} required={req}>
                {q.kind === "yesno" ? (
                  <select id={q.id} name={q.id} required={req} defaultValue="" className={`${SELECT} sm:max-w-[320px]`}>
                    <option value="" disabled>
                      Select...
                    </option>
                    <option>Yes</option>
                    <option>Mostly, with a little practice</option>
                    <option>No</option>
                  </select>
                ) : q.kind === "select" ? (
                  <select id={q.id} name={q.id} required={req} defaultValue="" className={`${SELECT} sm:max-w-[420px]`}>
                    <option value="" disabled={req}>
                      Select...
                    </option>
                    {(q.options ?? []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : q.kind === "text" ? (
                  <input id={q.id} name={q.id} required={req} className={INPUT} />
                ) : (
                  <textarea id={q.id} name={q.id} required={req} className={TEXTAREA} />
                )}
              </Field>
            );
          })}
        </Part>

        {/* 06 self-ID */}
        <Part
          n="06"
          title="Voluntary self-identification"
          sub={
            <>
              Every question here is optional and defaults to prefer not to say. Your answers are saved separately from
              your application, with nothing attached that could identify you. Nobody reading applications sees them.
              We use the totals to check that our hiring is fair across everyone who applies, and they have no effect on
              your chances.
            </>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Gender" htmlFor="sid_gender" required={false}>
              <select
                id="sid_gender"
                name="sid_gender"
                defaultValue="Prefer not to say"
                onChange={(e) => setGenderSelf(e.target.value === "Prefer to self-describe")}
                className={SELECT}
              >
                {GENDER.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            {genderSelf && (
              <Field label="Self-describe" htmlFor="sid_gender_self" required={false}>
                <input id="sid_gender_self" name="sid_gender_self" className={INPUT} />
              </Field>
            )}
            <Field label="Race or ethnicity" htmlFor="sid_ethnicity" required={false}>
              <select id="sid_ethnicity" name="sid_ethnicity" defaultValue="Prefer not to say" className={SELECT}>
                {ETHNICITY.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Disability status" htmlFor="sid_disability" required={false}>
              <select id="sid_disability" name="sid_disability" defaultValue="Prefer not to say" className={SELECT}>
                {DISABILITY.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Veteran status" htmlFor="sid_veteran" required={false}>
              <select id="sid_veteran" name="sid_veteran" defaultValue="Prefer not to say" className={SELECT}>
                {VETERAN.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>
        </Part>

        {/* submit */}
        <div className="flex flex-col gap-4 border-t border-ink/[0.12] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[460px] text-[13px] leading-[1.5] text-ink/[0.55]">
            Ligo is an equal opportunity employer. We don&apos;t discriminate on the basis of race, color, religion, sex,
            sexual orientation, gender identity, national origin, disability, veteran status, or any other protected
            characteristic.
          </p>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-[9px] rounded-full bg-[#F97316] px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#241603] shadow-cta transition-all hover:bg-[#FB923C] active:scale-[0.97] disabled:opacity-70"
            >
              {submitting ? "Sending" : "Submit application"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </button>
            {error && <span className="text-[13px] text-[#C0512B]">{error}</span>}
          </div>
        </div>
      </div>
    </form>
  );
}
