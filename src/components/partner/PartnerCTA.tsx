"use client";

import { useState, type FormEvent } from "react";
import { Tape } from "@/components/ui/Tape";

/**
 * The Partner page's cream CTA sheet — collects org, school, and email so we
 * can follow up directly instead of linking nowhere. Posts to
 * /api/partner-lead, which emails the lead to the team.
 */
export function PartnerCTA() {
  const [org, setOrg] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const org_ = org.trim();
    const school_ = school.trim();
    const email_ = email.trim().toLowerCase();
    if (!org_) return setError("Tell us your club or org's name.");
    if (!school_) return setError("Which school are you at?");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email_)) return setError("Enter a valid email.");

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/partner-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org: org_, school: school_, email: email_ }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || j.error || `HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      setError(`Couldn't send that. ${err instanceof Error ? err.message : "Try again"}.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative -rotate-[0.6deg] rounded-[3px] bg-cream p-[34px] text-ink shadow-[0_30px_58px_-22px_rgba(0,0,0,0.6),0_16px_44px_-18px_rgba(232,162,76,0.3)]">
      <Tape className="-top-[11px] left-10 -rotate-[4deg]" />
      <Tape className="-top-[11px] right-12 rotate-[3deg]" />

      <div className="relative">
        <div className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink">Let&apos;s get your room full.</div>
        <div className="mt-[6px] text-[15px] text-ink/[0.62]">
          Tell us who you are. We&apos;ll set you up in a day.
        </div>

        {sent ? (
          <div className="mt-6 flex items-center gap-[9px] rounded-[14px] border border-[#71C07F]/40 bg-[#71C07F]/[0.1] px-5 py-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3E8A4B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="flex-none"><path d="M20 6L9 17l-5-5" /></svg>
            <span className="text-[14px] font-medium text-ink/80">Got it — we&apos;ll reach out within a day.</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Club or org name"
                aria-label="Club or org name"
                className="min-w-0 rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[14px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#E8A24C]/60"
              />
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="School"
                aria-label="School"
                className="min-w-0 rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[14px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#E8A24C]/60"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="min-w-0 rounded-[12px] border border-ink/[0.14] bg-white px-4 py-[11px] text-[14px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-[#E8A24C]/60"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {error ? <span className="text-[13px] text-[#C0512B]">{error}</span> : <span />}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-[9px] rounded-[14px] bg-[#E8A24C] px-6 py-[14px] text-[15px] font-semibold text-[#241603] shadow-[0_10px_24px_-8px_rgba(199,122,46,0.55)] transition-transform active:scale-[0.97] disabled:opacity-70"
              >
                {submitting ? "Sending…" : "Get started"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241603" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
