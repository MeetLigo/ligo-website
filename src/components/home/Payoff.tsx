"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { wallChart } from "@/lib/content";
import { AppleIcon, PlayIcon } from "@/components/chrome/StoreIcons";
import { PhotoDrift } from "./PhotoDrift";

const fmt = (n: number) => n.toLocaleString("en-US");

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Explicit staggered fade-ups (index-based delays) rather than Framer variant
// propagation, which doesn't resolve reliably through the AnimatePresence parent.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
});

// PLACEHOLDER — real number comes from the backend reveal.
const MATCH_COUNT = 847;

/**
 * The reward, shown after someone answers. Photos rain down; then the line,
 * the download CTA (App Store + Google Play), the leaderboard wall (your pick
 * highlighted), and the launch-list email capture fade up in sequence.
 */
export function Payoff({ song }: { song: string }) {
  const pick = song.trim() || "your song";
  const [emailDone, setEmailDone] = useState(false);

  // The wall is a cumulative, all-time chart ranked by pick count. Merge the
  // user's pick in at the rank its count earns — it does NOT jump to the top.
  const rows = [
    ...wallChart.map((e) => ({ ...e, you: false })),
    { title: pick, artist: "", count: MATCH_COUNT, you: true },
  ].sort((a, b) => b.count - a.count);

  function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(backend): POST the launch-list email here before confirming.
    setEmailDone(true);
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden px-5 py-24">
      {/* festival backdrop — "the room", kept in the very back (from the previous hero) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-[-24px] scale-[1.06] bg-[url('/festival-bg.png')] bg-cover bg-[center_22%] bg-no-repeat"
          style={{ filter: "blur(7px) saturate(1.1)" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(185,228,241,0.42) 0%,rgba(224,238,231,0.40) 40%,rgba(255,247,233,0.72) 88%)",
          }}
        />
      </div>

      <PhotoDrift />

      {/* legibility wash so the reveal reads over the photos + backdrop */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(900px 620px at 50% 42%,rgba(255,247,233,0.92),rgba(255,247,233,0.4) 60%,transparent 80%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[560px] flex-col items-center gap-7 text-center">
        {/* the line over the photos — PLACEHOLDER copy */}
        <motion.h2 {...rise(0.5)} className="text-balance font-display text-done-title font-semibold text-ink">
          These could have been your memories.
        </motion.h2>

        {/* download CTA — get Ligo on every device it's on; sits above the leaderboard */}
        <motion.div {...rise(0.66)} className="flex flex-col items-center gap-[18px]">
          <p className="max-w-[360px] text-[15px] leading-[1.5] text-ink/60">
            Download Ligo and actually meet them.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://apps.apple.com/us/app/ligo/id6753926105"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[9px] rounded-[14px] bg-ink px-6 py-[13px] text-[14px] font-semibold text-white transition-transform active:scale-[0.97]"
            >
              <AppleIcon size={18} fill="#fff" /> App Store
            </a>
            {/* TODO: real Google Play listing URL */}
            <a
              href="#"
              className="flex items-center gap-[9px] rounded-[14px] border border-ink/[0.12] bg-white px-6 py-[13px] text-[14px] font-semibold text-ink transition-transform active:scale-[0.97]"
            >
              <PlayIcon size={17} /> Google Play
            </a>
          </div>
        </motion.div>

        {/* the wall — all-time chart ranked by pick count, your pick highlighted */}
        <motion.div
          {...rise(0.82)}
          className="w-full overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white text-left shadow-card"
        >
          <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-3">
            <span className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">what campus picked</span>
            <span className="text-[10px] uppercase tracking-eyebrow text-ink/35">all-time</span>
          </div>
          <div className="flex flex-col p-2">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-[10px] ${r.you ? "rounded-[12px] bg-gold/25" : ""}`}
              >
                <span
                  className={`w-5 flex-none text-center text-[13px] font-semibold tabular-nums ${
                    r.you ? "text-ember" : "text-ink/35"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[15px]">
                  <span className="font-medium text-ink">{r.title}</span>
                  {r.artist && <span className="text-ink/45"> · {r.artist}</span>}
                </span>
                {r.you && (
                  <span className="flex-none rounded-full bg-ember/[0.12] px-2 py-[2px] text-[10px] font-bold uppercase tracking-eyebrow text-ember">
                    your pick
                  </span>
                )}
                <span className="flex-none text-[13px] tabular-nums text-ink/50">{fmt(r.count)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* launch-list email capture */}
        <motion.div {...rise(0.98)} className="w-full">
          {emailDone ? (
            <div className="animate-riseIn rounded-[20px] border border-ink/[0.07] bg-white px-6 py-7 shadow-card">
              <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">you&rsquo;re on the list</div>
              <div className="mt-2 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
                We&rsquo;ll ping you the day Ligo hits your campus.
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] border border-ink/[0.07] bg-white px-6 py-7 shadow-card">
              <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
                Get the app when it hits your campus.
              </div>
              <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-[1.5] text-ink/55">
                We&rsquo;re rolling out campus by campus. Drop your email and you&rsquo;ll be first in line.
              </p>
              <form
                onSubmit={submitEmail}
                className="mt-4 flex gap-2 rounded-full border border-ink/10 bg-cream py-[6px] pl-5 pr-[6px]"
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
                  Join the list
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
