"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Load-in animation (adapted from the v2 mockup, no audio): a line-art listener
 * face appears, throws a small smirk, dissolves into OUR pinwheel logo, and that
 * logo then flies up to the top-left and lands exactly on the site's header logo
 * — a seamless handoff — before the overlay lifts to reveal the hero.
 *
 * Once per browser session (sessionStorage) — skips on internal navigation,
 * replays only on a fresh session. Honors prefers-reduced-motion (skips).
 * Calls onDone as the overlay starts lifting, so the hero + ambient video begin
 * revealing in the same beat.
 */
const SEEN_KEY = "ligo:introSeen";

// Face mouth shapes — neutral → smirk (from the mockup's theater() morph).
const MOUTH_TOP = { rest: "M 93,145 Q 105,146 117,145", smirk: "M 93,146 Q 103,146 117,139" };
const MOUTH_BOT = { rest: "M 99,150 Q 105,152 111,150", smirk: "M 99,151 Q 105,152 112,146" };

// how much bigger the logo is at center-screen vs. its landed (header) size
const CENTER_SCALE = 1.7;

export function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"cover" | "playing" | "gone">("cover");
  const [faceIn, setFaceIn] = useState(false);
  const [smirk, setSmirk] = useState(false);
  const [dissolve, setDissolve] = useState(false); // face out, logo in
  const [lift, setLift] = useState(false); // overlay fades away

  // logo flight: hidden → centered (big) → landed (on the header logo)
  const [logoStage, setLogoStage] = useState<"hidden" | "center" | "land">("hidden");
  const [tf, setTf] = useState<{ center: string; land: string }>({ center: "", land: "" });
  const logoRef = useRef<HTMLDivElement>(null);

  // Measure the logo's natural size + the real header logo, and derive the two
  // transforms: centered-and-big, and landed-on-the-header.
  function computePlacement() {
    const el = logoRef.current;
    if (!el) return;
    const prev = el.style.transform;
    el.style.transform = "none";
    const r = el.getBoundingClientRect();
    el.style.transform = prev;
    const W = r.width;
    const H = r.height;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2 - (W * CENTER_SCALE) / 2;
    const cy = vh / 2 - (H * CENTER_SCALE) / 2;
    const center = `translate(${cx}px, ${cy}px) scale(${CENTER_SCALE})`;

    // land exactly on the site's header logo (fall back to its CSS offset)
    const header = document.querySelector('header a[href="/"]') as HTMLElement | null;
    let lx = 26;
    let ly = 20;
    if (header) {
      const hr = header.getBoundingClientRect();
      lx = hr.left;
      ly = hr.top;
    }
    const land = `translate(${lx}px, ${ly}px) scale(1)`;

    setTf({ center, land });
  }

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode etc. — just play it */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("gone");
      onDone();
      return;
    }

    setPhase("playing");
    const timers = [
      window.setTimeout(() => setFaceIn(true), 40), // face fades in
      window.setTimeout(() => setSmirk(true), 700), // the smirk
      window.setTimeout(() => {
        computePlacement(); // measure before it appears
        setDissolve(true); // face out
        setLogoStage("center"); // logo appears, centered + big
      }, 1250),
      window.setTimeout(() => setLogoStage("land"), 1780), // flies to the corner
      window.setTimeout(() => {
        setLift(true);
        onDone();
      }, 2450), // overlay lifts onto the real header logo; hero + video begin
      window.setTimeout(() => setPhase("gone"), 3100), // unmount
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onDone]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden transition-opacity duration-[600ms] ease-[cubic-bezier(.2,.7,.2,1)]"
      style={{
        opacity: lift ? 0 : 1,
        pointerEvents: lift ? "none" : "auto",
        background:
          "radial-gradient(58% 48% at 84% 10%, rgba(245,215,131,0.62), transparent 68%), linear-gradient(180deg, #DCEEF6 0%, #FFF2D8 52%, #FBE1AE 100%)",
      }}
    >
      {phase === "playing" && (
        <>
          {/* the listener face, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 210"
              className="h-[min(56vw,42vh,420px)] w-[min(56vw,42vh,420px)]"
              style={{
                opacity: dissolve ? 0 : faceIn ? 1 : 0,
                transform: dissolve ? "scale(1.04)" : "scale(1)",
                transition: "opacity .5s ease, transform .5s ease",
                overflow: "visible",
              }}
            >
              <g stroke="#14110D" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 45,185 C 40,130 45,30 105,30 C 165,30 170,130 165,185" />
                <path d="M 104,33 C 78,48 70,80 72,115" />
                <path d="M 107,33 C 133,48 139,80 136,118" />
                <path d="M 102,36 C 86,52 80,78 82,98" />
                <path d="M 109,36 C 125,52 130,78 128,100" />
                <path d="M 72,115 C 72,145 90,165 105,165 C 120,165 133,145 135,125" />
                <path d="M 88,162 Q 85,185 80,190" />
                <path d="M 122,160 Q 125,185 130,190" />
                <path d="M 78,88 Q 88,83 96,86" />
                <path d="M 114,86 Q 122,83 132,88" />
                <path d="M 80,96 Q 88,99 94,95" />
                <path d="M 116,95 Q 122,99 130,96" />
                <path d="M 106,92 L 106,118 Q 106,122 101,122" />
                <path d={smirk ? MOUTH_TOP.smirk : MOUTH_TOP.rest} style={{ transition: "d .3s ease" }} />
                <path d={smirk ? MOUTH_BOT.smirk : MOUTH_BOT.rest} style={{ transition: "d .3s ease" }} />
                <path d="M 115,141 Q 118,137 118,142" style={{ opacity: smirk ? 1 : 0, transition: "opacity .3s ease" }} />
              </g>
              {/* earbuds — the listener detail, in our flame */}
              <g fill="#F97316">
                <ellipse cx="47" cy="112" rx="6.5" ry="8.5" />
                <rect x="43.5" y="118" width="6" height="13" rx="3" />
                <ellipse cx="163" cy="112" rx="6.5" ry="8.5" />
                <rect x="150.5" y="118" width="6" height="13" rx="3" />
              </g>
            </svg>
          </div>

          {/* our logo — built at the header's exact size, driven by transform so it
              can fly from center to the top-left and land on the real header logo */}
          <div
            ref={logoRef}
            className="flex items-center gap-[10px]"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              transformOrigin: "0 0",
              transform: logoStage === "land" ? tf.land : tf.center || "none",
              opacity: logoStage === "hidden" ? 0 : 1,
              transition:
                logoStage === "land"
                  ? "transform .64s cubic-bezier(.2,.7,.2,1), opacity .4s ease"
                  : "opacity .5s ease",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" width={34} height={34} className="block rounded-[9px] shadow-logo" />
            <span className="font-display text-[26px] font-semibold leading-none tracking-wordmark text-ink">ligo</span>
          </div>
        </>
      )}
    </div>
  );
}
