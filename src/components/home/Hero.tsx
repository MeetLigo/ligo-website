"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Waveform } from "./Waveform";
import { Payoff } from "./Payoff";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Problem-first hero. Landing shows a problem statement + search bar over an
 * animated waveform (no photos). On submit, a filmic fade swaps the statement
 * for the payoff — photos rain down and the reveal plays out. The transition
 * fires on submit, never on scroll (no scroll-jacking).
 */
export function Hero() {
  const [stage, setStage] = useState<"problem" | "payoff">("problem");
  const [song, setSong] = useState("");
  const [focused, setFocused] = useState(false);
  const [pulseSignal, setPulseSignal] = useState(0); // bumps the waveform per keystroke
  const [surgeSignal, setSurgeSignal] = useState(0); // fires the waveform burst on submit

  function submitSong(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Read straight from the form so the guard never races the controlled state.
    const value = ((new FormData(e.currentTarget).get("song") as string) ?? "").trim();
    if (!value) return;
    setSong(value);
    // TODO(backend): POST the song answer here before revealing the payoff.
    // Fire the amplitude burst, then let it resolve into the reveal transition.
    setSurgeSignal((n) => n + 1);
    window.setTimeout(() => setStage("payoff"), 320);
  }

  return (
    <section className="relative overflow-hidden">
      {/* soft base wash — the waveform carries the motion */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg,#EAF6FB 0%,#FFF7E9 60%)" }}
      />

      <AnimatePresence mode="wait">
        {stage === "problem" ? (
          <motion.div
            key="problem"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex min-h-[calc(100vh-68px)] flex-col items-center justify-center px-6 text-center"
          >
            <Waveform focused={focused} pulseSignal={pulseSignal} surgeSignal={surgeSignal} />

            <div className="relative z-10 mx-auto max-w-[720px]">
              <div className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-eyebrow text-ember">
                <span className="relative h-[7px] w-[7px]">
                  <span className="absolute inset-0 rounded-full bg-flame" />
                  <span className="absolute inset-0 rounded-full bg-flame animate-pulseDot" />
                </span>
                Ligo · meet people through music
              </div>

              {/* PLACEHOLDER — final line coming from the pitch deck */}
              <h1 className="text-balance font-display text-hero font-semibold text-ink">
                Every day you pass ~100 people who share your music taste.
              </h1>

              <form
                onSubmit={submitSong}
                className="mx-auto mt-9 flex max-w-[480px] gap-2 rounded-full border border-ink/[0.09] bg-white py-[7px] pl-[22px] pr-[7px] shadow-[0_20px_44px_-20px_rgba(20,17,13,0.3)]"
              >
                <input
                  name="song"
                  value={song}
                  onChange={(e) => {
                    setSong(e.target.value);
                    setPulseSignal((n) => n + 1);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Name a song you love."
                  aria-label="Name a song you love."
                  className="min-w-0 flex-1 border-none bg-transparent text-base text-ink"
                />
                <button
                  type="submit"
                  aria-label="Reveal"
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-flame shadow-cta transition-transform active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>

              {/* PLACEHOLDER — supporting line so a cold visitor gets it before acting */}
              <div className="mt-[14px] text-[13px] text-ink/45">
                Name a song. Meet the people on your campus who picked it too.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="payoff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.1 } }}
            className="relative"
          >
            <Payoff song={song} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
