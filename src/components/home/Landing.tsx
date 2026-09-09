"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { PlayIcon } from "@/components/chrome/StoreIcons";
import { clubLogos } from "@/lib/content";

/**
 * Broad-ethos landing (ported from the design export "Ligo Landing v3").
 * Audience-split hero over the ambient photo slideshow: students get the App
 * Store pill (+ other-campus waitlist), club leaders get the claim form.
 * Below it, just the club logo strip. No music framing on this page (8/28).
 */

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.bardsai.ligo&hl=en_US";

// Ambient hero slideshow (8/29 reshoot: all of college life, no class, no
// going out). Interim Pinterest picks until clubs send real photos:
// movie night, dance team, club booth, speaker event. Per-slide crop
// keeps the PEOPLE in frame, not sky/screens.
const SLIDES = ["/hero/slide-1.jpg", "/hero/slide-2.jpg", "/hero/slide-3.jpg", "/hero/slide-4.jpg"];
const SLIDE_POS = ["center 72%", "center 45%", "center 45%", "center 62%"];
const SLIDE_MS = 4000;

type Mode = null | "student";

export interface HeroCopy {
  /** upright part of the H1 */
  pre: string;
  /** italic orange part of the H1 */
  accent: string;
  sub: string;
}

// The winner of the 8/30 A/B/C copy comparison: the category claim.
export const HERO_COPY: HeroCopy = {
  pre: "The first",
  accent: "campus connector app.",
  sub: "Every club, every event, and everyone going. One app.",
};

export function Landing({ copy = HERO_COPY }: { copy?: HeroCopy }) {
  const [mode, setMode] = useState<Mode>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        {/* slideshow + scrim, pinned to viewport height so the crop never
            changes when a panel below pushes the section taller */}
        <div className="absolute inset-x-0 top-0 h-screen overflow-hidden">
          {SLIDES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === slide ? 1 : 0, objectPosition: SLIDE_POS[i] }}
            />
          ))}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent to-[#171717]" />
        </div>

        <SiteHeader />

        <div className="relative z-10 mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center gap-6 px-6 py-14 text-center sm:px-10">
          <div className="font-serif text-[14px] font-medium uppercase tracking-eyebrow text-[#F97316]">For college students</div>
          <h1 className="font-serif text-[clamp(44px,6.4vw,84px)] font-normal leading-[1.06] tracking-[-0.02em] text-[#FAF6EF]">
            {copy.pre} <span className="italic text-[#F97316]">{copy.accent}</span>
          </h1>
          <p className="max-w-[52ch] font-serif text-[18px] leading-[1.5] text-[#FAF6EF]/[0.85] sm:text-[21px]">
            {copy.sub}
          </p>

          <div className="mt-1 flex flex-col items-center gap-4">
            <div className="grid w-[min(440px,92vw)] grid-cols-2 gap-3">
              <AudienceCard
                selected={mode === "student"}
                onClick={() => {
                  // phones go straight to their store; desktop shows both store buttons
                  const ua = navigator.userAgent;
                  if (/android/i.test(ua)) window.location.assign(GOOGLE_PLAY);
                  else if (/iphone|ipad|ipod/i.test(ua)) window.location.assign(APP_STORE);
                  else setMode("student");
                }}
                title="I'm a student"
                sub="See what's happening"
              />
              <AudienceLink href="/clubs" title="I run a club" sub="Set up your club" />
            </div>

            {mode === "student" && <StudentPanel />}

          </div>
        </div>
      </section>

      {/* club strip — categories keep it broad; Georgetown is "initial launch" */}
      <section className="w-full px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 text-center">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.01em] text-[#FAF6EF] sm:text-[32px]">
            Live at Georgetown, expanding to universities throughout the DMV soon.
          </h2>
          <p className="max-w-[54ch] text-[15px] leading-[1.55] text-[#FAF6EF]/[0.6]">
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

/** Same look as AudienceCard, but a link to the clubs page (which hands off to the portal). */
function AudienceLink({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link
      href={href}
      className="flex w-full flex-col items-center gap-0.5 rounded-[18px] border border-white/25 bg-white/10 px-3 py-3 text-[#FAF6EF] transition-colors hover:bg-white/[0.16] hover:text-[#FAF6EF]"
    >
      <span className="text-[16px] font-semibold">{title}</span>
      <span className="text-[13px] opacity-75">{sub}</span>
    </Link>
  );
}

function AudienceCard({ selected, onClick, title, sub }: { selected: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-center gap-0.5 rounded-[18px] border px-3 py-3 transition-colors ${
        selected
          ? "border-[#F97316] bg-[#FFEDD5] text-[#7C2D12]"
          : "border-white/25 bg-white/10 text-[#FAF6EF] hover:bg-white/[0.16]"
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
  const [busy, setBusy] = useState(false);

  async function joinWaitlist(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className="inline-flex h-[56px] w-[192px] items-center justify-center gap-3 whitespace-nowrap rounded-[14px] bg-white text-[#171717] transition-[filter] hover:brightness-95"
        >
          <svg width="22" height="26" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          <span className="flex flex-col text-left leading-[1.15]">
            <span className="text-[11px]">Download on the</span>
            <span className="text-[19px] font-semibold tracking-[-0.01em]">App Store</span>
          </span>
        </a>
        <a
          href={GOOGLE_PLAY}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className="inline-flex h-[56px] w-[192px] items-center justify-center gap-3 whitespace-nowrap rounded-[14px] bg-white text-[#171717] transition-[filter] hover:brightness-95"
        >
          <PlayIcon size={24} />
          <span className="flex flex-col text-left leading-[1.15]">
            <span className="text-[11px] uppercase tracking-[0.04em]">Get it on</span>
            <span className="text-[19px] font-semibold tracking-[-0.01em]">Google Play</span>
          </span>
        </a>
      </div>
      <span className="text-[13px] text-[#FAF6EF]/[0.7]">
        Free for students. Live at Georgetown for our launch, with more DMV schools soon.
      </span>
      {sent ? (
        <span className="text-[14px] font-medium text-[#FAF6EF]">You&rsquo;re on the list. We&rsquo;ll email you when your campus opens.</span>
      ) : (
        <form onSubmit={joinWaitlist} className="flex flex-col items-center gap-3">
          <span className="text-[13px] text-[#FAF6EF]/[0.6]">Somewhere else? We&rsquo;ll tell you when Ligo lands.</span>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="h-[44px] w-[230px] rounded-full border border-white/[0.22] bg-white/10 px-4 text-[14px] text-[#FAF6EF] placeholder:text-white/45 focus:border-[#F97316] focus:bg-white/[0.14] focus:outline-none"
            />
            <button type="submit" className="h-[44px] rounded-full bg-white/[0.14] px-[18px] text-[14px] font-semibold text-[#FAF6EF] transition-[filter] hover:brightness-125">
              Join waitlist
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
