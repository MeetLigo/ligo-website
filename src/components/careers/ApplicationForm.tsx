"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { process as hiringSteps, type Role } from "@/lib/careers";

/**
 * The Georgetown campus team application, one per role
 * (/careers/apply/[role]). The role is fixed by the page above it, so this is
 * only the questions: about you, the ones everyone answers, the role's own
 * optional links, and voluntary self-identification. Role-specific questions
 * moved to the first call on 9/9; the form stays short on purpose.
 * Posts multipart to /api/apply.
 *
 * Self-identification is stored anonymously and never emailed. See the route.
 */

const INPUT =
  "min-w-0 w-full rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[15px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/60";
const TEXTAREA = `${INPUT} min-h-[120px] resize-y leading-[1.5]`;
const SELECT = `${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2314110D%22 stroke-width=%222.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat pr-10`;

const YEARS = ["First-year", "Sophomore", "Junior", "Senior", "Graduate student"];
const MOTIVATIONS = [
  "I want the internship experience",
  "I like the idea and want to help build it",
  "I think what Ligo is doing matters",
  "A friend or a club told me about it",
  "Something else",
];
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
        {required && (
          <span aria-hidden className="ml-1 text-[#C0512B]">
            *
          </span>
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
  optional = false,
  first = false,
  children,
}: {
  n: string;
  title: string;
  sub?: React.ReactNode;
  /** every field in here is optional, said once beside the heading */
  optional?: boolean;
  /** the first section sits under the required-field key, so it needs no rule */
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={first ? "" : "border-t border-ink/[0.12] pt-8"}>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[13px] font-medium tabular-nums text-[#EA580C]">{n}</span>
        <h3 className="font-serif text-[24px] font-medium leading-tight tracking-[-0.01em] text-ink">{title}</h3>
        {optional && <span className="text-[14px] text-ink/[0.45]">optional</span>}
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
          {`Your application for the ${role.title} role is in. Here’s what happens from here.`}
        </p>

        <ol className="mt-8 flex flex-col gap-4 border-t border-ink/[0.12] pt-8">
          {hiringSteps.map((step, i) => {
            const done = i === 0;
            return (
              <li key={step.title} className="grid grid-cols-[30px_1fr] gap-3">
                {done ? (
                  <span className="mt-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#71C07F]/[0.2]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3E8A4B" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                ) : (
                  <span className="font-serif text-[13px] font-medium tabular-nums text-[#EA580C]">0{i + 1}</span>
                )}
                <span className={`text-[15.5px] leading-[1.6] ${done ? "text-ink/[0.45]" : "text-ink/[0.82]"}`}>
                  <span className={done ? "font-semibold" : "font-semibold text-ink"}>{step.title}.</span> {step.body}
                </span>
              </li>
            );
          })}
        </ol>

        <Link href="/careers#roles" className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[#EA580C]">
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
            <Field label="How did you hear about this?" htmlFor="referral_source" required={false}>
              <select id="referral_source" name="referral_source" defaultValue="" className={SELECT}>
                <option value="">Select...</option>
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Are you authorized to work in the US?"
              htmlFor="elig_work_auth"
              hint="These roles are paid, so we have to ask. Not sure is a fine answer."
            >
              <select id="elig_work_auth" name="elig_work_auth" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {WORK_AUTH.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
        </Part>

        {/* 02 why you */}
        <Part n="02" title="Why you">
          <Field label="What's drawing you to this?" htmlFor="motivation">
            <select id="motivation" name="motivation" required defaultValue="" className={SELECT}>
              <option value="" disabled>
                Select...
              </option>
              {MOTIVATIONS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Why this role?" htmlFor="why_role" hint="A few sentences is plenty.">
            <textarea id="why_role" name="why_role" required rows={4} className={TEXTAREA} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Weekly availability" htmlFor="availability" hint="Hours you can commit during the term.">
              <select id="availability" name="availability" required defaultValue="" className={SELECT}>
                <option value="" disabled>
                  Select...
                </option>
                {AVAILABILITY.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Desired pay" htmlFor="desired_pay" hint="No set rate yet. Say what you'd want.">
              <input id="desired_pay" name="desired_pay" required placeholder="A monthly number, or per project" className={INPUT} />
            </Field>
          </div>
        </Part>

        {/* 03 links */}
        <Part n="03" title="Links" optional sub="Useful for us to see. Whatever is relevant to the role.">
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

        {/* 04 self-ID */}
        <Part
          n="04"
          title="Voluntary self-identification"
          optional
          sub={
            <>
              Every question here defaults to prefer not to say. Your answers are saved separately from your
              application, with nothing attached that could identify you. Nobody reading applications sees them.
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
