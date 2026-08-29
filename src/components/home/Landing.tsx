"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { clubLogos } from "@/lib/content";

/**
 * Broad-ethos landing (ported from the design export "Ligo Landing v3").
 * Audience-split hero over the ambient photo slideshow: students get the App
 * Store pill (+ other-campus waitlist), club leaders get the claim form.
 * Below it, just the club logo strip. No music framing on this page (8/28).
 */

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.bardsai.ligoapp&hl=en_US";

// Ambient hero slideshow, the pre-graded originals only (8/28: keep the
// pictures that were already on the site).
const SLIDES = ["/hero/slide-1.jpg", "/hero/slide-2.jpg", "/hero/slide-3.jpg", "/hero/slide-4.jpg"];
const SLIDE_MS = 4000;

type Mode = null | "student" | "club";

export function Landing() {
  const [mode, setMode] = useState<Mode>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="relative flex min-h-[94vh] w-full flex-col overflow-hidden">
        {/* slideshow + scrim */}
        {SLIDES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0, objectPosition: "center 35%" }}
          />
        ))}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent to-[#130F0A]" />

        <SiteHeader />

        <div className="relative z-10 mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 pt-12 text-center sm:px-10">
          <div className="font-serif text-[14px] font-medium uppercase tracking-eyebrow text-[#EDB264]">For college students</div>
          <h1 className="font-serif text-[clamp(44px,6.4vw,84px)] font-medium leading-[1.06] tracking-[-0.02em] text-[#EFE8DB]">
            Your social scene <span className="italic text-[#E8A24C]">starts&nbsp;here.</span>
          </h1>
          <p className="max-w-[52ch] font-serif text-[18px] leading-[1.5] text-[#EFE8DB]/[0.85] sm:text-[21px]">
            Every club and event on your campus, in one place.
          </p>

          <div className="mt-1 flex flex-col items-center gap-4">
            <div className="flex gap-3">
              <AudienceCard
                selected={mode === "student"}
                onClick={() => setMode("student")}
                title="I'm a student"
                sub="Find your nights out"
              />
              <AudienceCard
                selected={mode === "club"}
                onClick={() => setMode("club")}
                title="I run a club"
                sub="Fill your next event"
              />
            </div>

            {mode === "student" && <StudentPanel />}
            {mode === "club" && <ClubClaimForm />}

          </div>
        </div>
      </section>

      {/* club strip — categories keep it broad; Georgetown is "initial launch" */}
      <section className="w-full px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.01em] text-[#EFE8DB] sm:text-[32px]">
            Live at Georgetown, expanding to universities throughout the DMV soon.
          </h2>
          <p className="max-w-[54ch] text-[15px] leading-[1.55] text-[#EFE8DB]/[0.6]">
            Greek life, pre-professional, cultural and sports clubs are already on Ligo.
          </p>
          <div className="flex max-w-[760px] flex-wrap items-center justify-center gap-x-11 gap-y-9">
            {clubLogos.map((c) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c.src}
                src={`/clubs/${c.src}`}
                alt={c.name}
                title={c.name}
                className="h-[60px] w-auto max-w-[130px] object-contain"
              />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

function AudienceCard({ selected, onClick, title, sub }: { selected: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 rounded-[18px] border px-6 py-3 transition-colors sm:px-7 ${
        selected
          ? "border-[#E8A24C] bg-[#F3D9AF] text-[#5C3A10]"
          : "border-white/25 bg-white/10 text-[#EFE8DB] hover:bg-white/[0.16]"
      }`}
    >
      <span className="text-[16px] font-semibold">{title}</span>
      <span className="text-[13px] opacity-75">{sub}</span>
    </button>
  );
}

function StudentPanel() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function joinWaitlist(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // TODO(backend): POST { email } to the campus-waitlist endpoint
    setSent(true);
  }

  return (
    <div className="mt-1 flex flex-col items-center gap-3.5">
      <a
        href={APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="inline-flex h-[56px] items-center gap-3 rounded-[14px] bg-white px-[22px] text-[#130F0A] transition-[filter] hover:brightness-95"
      >
        <svg width="22" height="26" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span className="flex flex-col text-left leading-[1.15]">
          <span className="text-[11px]">Download on the</span>
          <span className="text-[19px] font-semibold tracking-[-0.01em]">App Store</span>
        </span>
      </a>
      <span className="text-[13px] text-[#EFE8DB]/[0.7]">
        Free for students. Live at Georgetown for our launch, with more DMV schools soon.{" "}
        <a href={GOOGLE_PLAY} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-[#EFE8DB]">
          also on Google Play
        </a>
        .
      </span>
      {sent ? (
        <span className="text-[14px] font-medium text-[#EFE8DB]">You&rsquo;re on the list. We&rsquo;ll email you when your campus opens.</span>
      ) : (
        <form onSubmit={joinWaitlist} className="flex flex-col items-center gap-2">
          <span className="text-[13px] text-[#EFE8DB]/[0.6]">Somewhere else? We&rsquo;ll tell you when Ligo lands.</span>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="h-[44px] w-[230px] rounded-full border border-white/[0.22] bg-white/10 px-4 text-[14px] text-[#EFE8DB] placeholder:text-white/45 focus:border-[#E8A24C] focus:bg-white/[0.14] focus:outline-none"
            />
            <button type="submit" className="h-[44px] rounded-full bg-white/[0.14] px-[18px] text-[14px] font-semibold text-[#EFE8DB] transition-[filter] hover:brightness-125">
              Join waitlist
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ClubClaimForm() {
  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !club.trim() || !email.includes("@")) {
      setHint("Fill in all three fields (school email needs an @).");
      return;
    }
    // TODO(backend): POST { name, club, email } to the club-claims endpoint
    setSent(true);
    setHint("");
  }

  if (sent) {
    return (
      <div className="mt-1 flex flex-col items-center gap-2 py-1.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A24C] text-[#130F0A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5 10-11" />
          </svg>
        </span>
        <span className="font-serif text-[22px] font-medium text-[#EFE8DB]">You&rsquo;re in.</span>
        <span className="max-w-[40ch] text-[15px] leading-[1.5] text-[#EFE8DB]/[0.8]">
          We&rsquo;ll email you within a day to set up your club before your next event.
        </span>
      </div>
    );
  }

  const inputCls =
    "h-[49px] rounded-[14px] border border-white/[0.22] bg-white/10 px-4 text-[15px] text-[#EFE8DB] placeholder:text-white/45 focus:border-[#E8A24C] focus:bg-white/[0.14] focus:outline-none";
  return (
    <form onSubmit={submit} className="mt-1 flex w-[min(400px,86vw)] flex-col gap-2.5 text-left">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
      <input type="text" value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club name" className={inputCls} />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="School email" className={inputCls} />
      <button type="submit" className="mt-0.5 h-[52px] rounded-full bg-[#E8A24C] text-[15px] font-semibold text-[#130F0A] transition-[filter] hover:brightness-95 active:scale-[0.97]">
        Claim your club
      </button>
      <span className={`text-[12px] ${hint ? "text-[#FCA5A5]" : "text-white/[0.55]"}`}>
        {hint || "We only use this to set up your club. No spam."}
      </span>
    </form>
  );
}
