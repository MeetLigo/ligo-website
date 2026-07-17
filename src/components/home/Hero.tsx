"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { AppleIcon, PlayIcon } from "@/components/chrome/StoreIcons";

type Stage = "ask" | "email" | "done";

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const },
};

/**
 * The center prompt. Flows ask → email → done entirely in local state —
 * nothing is persisted. Two stub seams are marked below.
 */
export function Hero() {
  const [stage, setStage] = useState<Stage>("ask");

  function submitSong(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(backend): POST the song answer here before advancing.
    // const song = new FormData(e.currentTarget).get("song");
    setStage("email");
  }

  function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(backend): POST the email capture here before advancing.
    // const email = new FormData(e.currentTarget).get("email");
    setStage("done");
  }

  return (
    <div className="relative z-30 mx-auto flex min-h-[calc(100vh-148px)] max-w-[640px] flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {stage === "ask" && (
          <motion.div key="ask" {...rise}>
            <div className="mb-[18px] inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-eyebrow text-ember">
              <span className="relative h-[7px] w-[7px]">
                <span className="absolute inset-0 rounded-full bg-flame" />
                <span className="absolute inset-0 rounded-full bg-flame animate-pulseDot" />
              </span>
              Ligo sneak peek
            </div>
            <h1 className="text-balance font-display text-hero font-semibold text-ink">
              What&apos;s the best song you&apos;ve
              <br />
              ever heard?
            </h1>
            <form
              onSubmit={submitSong}
              className="mx-auto mt-8 flex max-w-[480px] gap-2 rounded-full border border-ink/[0.09] bg-white py-[7px] pl-[22px] pr-[7px] shadow-[0_20px_44px_-20px_rgba(20,17,13,0.3)]"
            >
              <input
                name="song"
                placeholder="Type the song. Be honest."
                className="min-w-0 flex-1 border-none bg-transparent text-base text-ink"
              />
              <button
                type="submit"
                aria-label="Submit"
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-flame shadow-cta transition-transform active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <div className="mt-[14px] text-[13px] text-ink/45">no login. no bio. just the song.</div>
          </motion.div>
        )}

        {stage === "email" && (
          <motion.div
            key="email"
            {...rise}
            className="relative max-w-[460px] overflow-hidden rounded-[28px] border border-ink/[0.06] bg-white px-[34px] py-[38px] text-ink shadow-[0_30px_60px_-24px_rgba(20,17,13,0.28)]"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(320px 220px at 85% 10%,rgba(155,216,236,0.30),transparent 70%)" }}
            />
            <div className="relative">
              <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">
                logged · 848 answers so far
              </div>
              <h2 className="my-2 mt-3 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.02em]">
                Decent pick. We&apos;re revealing the results at the end of the month.
              </h2>
              <p className="mb-[22px] mt-2 text-[15px] leading-[1.5] text-ink/60">
                Drop your email — we&apos;ll tell you the second the results drop.
              </p>
              <form
                onSubmit={submitEmail}
                className="flex gap-2 rounded-full border border-ink/10 bg-cream py-[6px] pl-5 pr-[6px]"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="you@georgetown.edu"
                  className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink"
                />
                <button
                  type="submit"
                  className="h-11 flex-none rounded-full bg-flame px-5 text-[14px] font-semibold text-white transition-transform active:scale-[0.96]"
                >
                  Notify me
                </button>
              </form>
              <button
                onClick={() => setStage("done")}
                className="mt-4 text-[13px] text-ink/45 underline"
              >
                skip →
              </button>
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" {...rise}>
            <div className="mb-[26px] flex justify-center">
              <div className="-mr-[18px] w-[130px] -rotate-[9deg] rounded-[6px] bg-white px-2 pb-[22px] pt-2 shadow-polaroid">
                <div className="aspect-square overflow-hidden rounded-[3px]">
                  <Placeholder label="a face" />
                </div>
              </div>
              <div className="z-[2] w-[150px] rotate-[3deg] rounded-[6px] bg-white px-[9px] pb-[26px] pt-[9px] shadow-polaroid-lg">
                <div className="aspect-square overflow-hidden rounded-[3px]">
                  <Placeholder label="the crowd" />
                </div>
              </div>
              <div className="-ml-[18px] w-[130px] rotate-[10deg] rounded-[6px] bg-white px-2 pb-[22px] pt-2 shadow-polaroid">
                <div className="aspect-square overflow-hidden rounded-[3px]">
                  <Placeholder label="a face" />
                </div>
              </div>
            </div>
            <h2 className="text-balance font-display text-done-title font-semibold text-ink">
              That&apos;s the vibe.
              <br />
              The rest of campus is inside.
            </h2>
            <div className="mt-[26px] flex flex-wrap justify-center gap-3">
              <a href="#" className="flex items-center gap-[9px] rounded-[14px] bg-ink px-5 py-[13px] text-[14px] font-semibold text-white">
                <AppleIcon size={18} fill="#fff" /> App Store
              </a>
              <a href="#" className="flex items-center gap-[9px] rounded-[14px] border border-ink/[0.12] bg-white px-5 py-[13px] text-[14px] font-semibold text-ink">
                <PlayIcon size={17} /> Google Play
              </a>
            </div>
            <button onClick={() => setStage("ask")} className="mt-[18px] text-[13px] text-ink/45 underline">
              replay the moment ↺
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
