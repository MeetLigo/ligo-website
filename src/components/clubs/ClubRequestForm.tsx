"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CLUB_CATEGORIES, CLUB_PORTAL, CLUB_ROLES } from "@/lib/clubs";

const INPUT =
  "min-w-0 w-full rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[15px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/60";
const SELECT = `${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2314110D%22 stroke-width=%222.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat pr-10`;

const ERRORS: Record<string, string> = {
  missing_club_name: "What's your club called?",
  missing_contact_name: "Tell us your name.",
  missing_contact_role: "Pick your role in the club.",
  invalid_email: "Enter a valid email.",
};

function Field({ label, htmlFor, hint, optional, children }: { label: string; htmlFor: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14.5px] font-semibold leading-snug text-ink">
        {label}
        {optional && <span className="ml-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink/[0.45]">optional</span>}
      </label>
      {hint && <div className="-mt-1 text-[13px] leading-snug text-ink/[0.55]">{hint}</div>}
      {children}
    </div>
  );
}

/** The create-account request. Posts JSON to /api/club-request, then goes to /clubs/pending. */
export function ClubRequestForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState<{ reason: "club_exists" | "request_pending"; clubName: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/club-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) {
        const key = typeof j.error === "string" ? j.error : "";
        throw new Error(ERRORS[key] || (key === "intake_failed" ? "Our end hiccuped. Try again in a minute." : j.message || "Couldn't send that. Try again."));
      }
      if (j.accepted === false) {
        // the platform already knows this club (or this email is waiting on review)
        setBlocked({ reason: j.reason === "request_pending" ? "request_pending" : "club_exists", clubName: String(j.clubName || fd.get("club_name") || "your club") });
        setSubmitting(false);
        return;
      }
      router.push("/clubs/pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that. Try again.");
      setSubmitting(false);
    }
  }

  if (blocked) {
    const exists = blocked.reason === "club_exists";
    return (
      <div className="rounded-[14px] border border-ink/[0.12] bg-white/60 p-6">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EA580C]">{exists ? "already on ligo" : "already requested"}</div>
        <h2 className="mt-2 font-serif text-[24px] font-medium leading-tight text-ink">
          {exists ? `Looks like ${blocked.clubName} is already on Ligo.` : "Someone already asked for this account."}
        </h2>
        <p className="mt-3 text-[15px] leading-[1.55] text-ink/[0.72]">
          {exists
            ? "Your club has an account. Sign in at the portal with the club's Georgetown email and you'll land as admin."
            : "A request with this email is already in our queue. We review by hand and reply from hello@meetligo.com, usually the same day. No need to send another."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {exists && (
            <a
              href={CLUB_PORTAL}
              className="flex flex-1 items-center justify-center rounded-[14px] bg-[#F97316] px-5 py-[13px] text-[14px] font-semibold text-[#241603] shadow-cta transition-transform hover:text-[#241603] active:scale-[0.97]"
            >
              Log in instead
            </a>
          )}
          <button
            type="button"
            onClick={() => setBlocked(null)}
            className="flex flex-1 items-center justify-center rounded-[14px] border border-ink/[0.3] px-5 py-[13px] text-[14px] font-semibold text-ink transition-colors hover:border-ink"
          >
            {exists ? "That's not my club" : "Back to the form"}
          </button>
        </div>
        {!exists && (
          <p className="mt-4 text-center text-[13px] text-ink/[0.55]">
            Think that's a mistake? Email <a href="mailto:hello@meetligo.com" className="font-medium text-[#2563EB]">hello@meetligo.com</a>.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Club name" htmlFor="club_name">
        <input id="club_name" name="club_name" required autoComplete="organization" className={INPUT} />
      </Field>

      <Field label="Club's Georgetown email" htmlFor="club_email" hint="This is the email your club will sign in with. Use the club's shared inbox if it has one.">
        <input id="club_email" name="club_email" type="email" required placeholder="yourclub@georgetown.edu" className={INPUT} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact_name">
          <input id="contact_name" name="contact_name" required autoComplete="name" className={INPUT} />
        </Field>
        <Field label="Your role" htmlFor="contact_role">
          <select id="contact_role" name="contact_role" required defaultValue="" className={SELECT}>
            <option value="" disabled>
              Pick one
            </option>
            {CLUB_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Category" htmlFor="category" optional>
          <select id="category" name="category" defaultValue="" className={SELECT}>
            <option value="">Pick one</option>
            {CLUB_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Instagram" htmlFor="instagram" optional>
          <input id="instagram" name="instagram" placeholder="@yourclub" className={INPUT} />
        </Field>
      </div>

      <Field label="Anything we should know?" htmlFor="notes" optional hint="Upcoming events, who else should have admin access, questions.">
        <textarea id="notes" name="notes" rows={3} className={`${INPUT} resize-y`} />
      </Field>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#F97316] px-5 py-[15px] text-[15px] font-semibold text-[#241603] shadow-cta transition-transform active:scale-[0.97] disabled:opacity-70"
        >
          {submitting ? "Sending" : "Create an account"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241603" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </button>
        {error && <span className="text-center text-[13px] text-[#C0512B]">{error}</span>}
        <p className="text-center text-[12.5px] leading-snug text-ink/[0.5]">
          We review every request by hand and reply within a day from hello@meetligo.com.
        </p>
      </div>
    </form>
  );
}
