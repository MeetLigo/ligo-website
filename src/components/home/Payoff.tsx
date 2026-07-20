"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { ResolvedPick, WallEntry } from "@/lib/pick";
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

interface Row {
  key: string;
  song_name: string;
  artist: string | null;
  album_art_url: string | null;
  count: number;
  you: boolean;
}

/**
 * The reward, shown after someone answers. Photos rain down; then the line,
 * the download CTA, the live leaderboard (all-time, ranked, merged per track,
 * your pick highlighted at its earned rank), and the email step that completes
 * the submission (one row: song + email + school).
 */
export function Payoff({ pick }: { pick: ResolvedPick }) {
  const [wall, setWall] = useState<WallEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // School: the dropdown is the source of truth. The email domain only sets a
  // default the dropdown can override (it can't be derived reliably — students
  // use personal emails). "other" reveals a free-text school field.
  const [school, setSchool] = useState("");
  const [otherSchool, setOtherSchool] = useState("");
  const schoolTouched = useRef(false);

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    if (schoolTouched.current) return; // don't fight a manual choice
    const domain = (e.target.value.split("@")[1] ?? "").toLowerCase();
    if (domain.includes("georgetown")) setSchool("Georgetown");
    else if (domain.includes("howard")) setSchool("Howard");
  }

  // Live wall from the wall_ranking view (served by /api/answers).
  useEffect(() => {
    let alive = true;
    fetch("/api/answers")
      .then((r) => r.json())
      .then((j) => {
        if (alive) setWall(j.wall ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // The wall is the REAL saved data only — no optimistic injection. The user's
  // pick is highlighted ("you") only AFTER their insert succeeds (emailDone),
  // once the re-fetched wall actually contains their row. This way the UI never
  // claims a save that didn't happen.
  const rows = useMemo<Row[]>(
    () =>
      wall.map((w) => ({
        key: w.spotify_track_id,
        song_name: w.song_name,
        artist: w.artist,
        album_art_url: w.album_art_url,
        count: w.pick_count,
        you: emailDone && !pick.is_freetext && w.spotify_track_id === pick.spotify_track_id,
      })),
    [wall, pick, emailDone],
  );

  async function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    const resolvedSchool = school === "other" ? otherSchool.trim() : school;
    if (!email || !resolvedSchool || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pick, email, school: resolvedSchool }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) {
        // Surface the real reason (server returns message/code) instead of hiding it.
        console.error("[answers] POST failed", res.status, j);
        throw new Error(j.message || j.error || `HTTP ${res.status}`);
      }
      // Only now — after a confirmed insert — re-fetch so the wall shows the
      // real saved row, then flip to the confirmed state.
      const j2 = await fetch("/api/answers").then((r) => r.json()).catch(() => null);
      if (j2?.wall) setWall(j2.wall);
      setEmailDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "failed";
      console.error("[answers] submit error:", msg);
      setError(`Couldn't save — ${msg}`);
    } finally {
      setSubmitting(false);
    }
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
        <motion.h2 {...rise(0.5)} className="text-balance font-display text-done-title font-semibold text-ink">
          These could have been your memories.
        </motion.h2>

        {/* "get the app" CTA — no live app yet, so both store buttons lead to the
            waitlist (no fake download links). Sits above the leaderboard. */}
        <motion.div {...rise(0.66)} className="flex flex-col items-center gap-[18px]">
          <p className="max-w-[360px] text-[15px] leading-[1.5] text-ink/60">
            Coming soon to iOS &amp; Android.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#waitlist"
              className="flex items-center gap-[9px] rounded-[14px] bg-ink px-6 py-[13px] text-[14px] font-semibold text-white transition-transform active:scale-[0.97]"
            >
              <AppleIcon size={18} fill="#fff" /> App Store
            </a>
            <a
              href="#waitlist"
              className="flex items-center gap-[9px] rounded-[14px] border border-ink/[0.12] bg-white px-6 py-[13px] text-[14px] font-semibold text-ink transition-transform active:scale-[0.97]"
            >
              <PlayIcon size={17} /> Google Play
            </a>
          </div>
        </motion.div>

        {/* the wall — live all-time chart ranked by pick count, your pick highlighted */}
        <motion.div
          {...rise(0.82)}
          className="w-full overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white text-left shadow-card"
        >
          <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-3">
            <span className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">leaderboard</span>
            <span className="text-[10px] uppercase tracking-eyebrow text-ink/35">all-time</span>
          </div>

          <div className="flex flex-col p-2">
            {!loaded ? (
              <div className="px-3 py-6 text-center text-[13px] text-ink/40">counting the campus…</div>
            ) : rows.length === 0 ? (
              <div className="px-3 py-6 text-center text-[13px] text-ink/40">
                The wall&rsquo;s just getting started.
              </div>
            ) : (
              rows.map((r, i) => (
                <div
                  key={r.key}
                  className={`flex items-center gap-3 px-3 py-[9px] ${r.you ? "rounded-[12px] bg-gold/25" : ""}`}
                >
                  <span
                    className={`w-5 flex-none text-center text-[13px] font-semibold tabular-nums ${
                      r.you ? "text-ember" : "text-ink/35"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {r.album_art_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.album_art_url} alt="" className="h-7 w-7 flex-none rounded-[5px] object-cover" />
                  ) : (
                    <span className="h-7 w-7 flex-none rounded-[5px] bg-photo-bg" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-[15px]">
                    <span className="font-medium text-ink">{r.song_name}</span>
                    {r.artist && <span className="text-ink/45"> · {r.artist}</span>}
                  </span>
                  {r.you && (
                    <span className="flex-none rounded-full bg-ember/[0.12] px-2 py-[2px] text-[10px] font-bold uppercase tracking-eyebrow text-ember">
                      your pick
                    </span>
                  )}
                  <span className="flex-none text-[13px] tabular-nums text-ink/50">{fmt(r.count)}</span>
                </div>
              ))
            )}
          </div>

          {emailDone && pick.is_freetext && (
            <div className="border-t border-ink/[0.06] px-5 py-3 text-[12px] text-ink/45">
              We couldn&rsquo;t match &ldquo;{pick.song_name}&rdquo; to a track, so it&rsquo;s saved but not on the chart.
            </div>
          )}
        </motion.div>

        {/* email step — completes the submission (song + email + school) */}
        <motion.div {...rise(0.98)} id="waitlist" className="w-full scroll-mt-24">
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
              <form onSubmit={submitEmail} className="mt-4 flex flex-col gap-2">
                <select
                  aria-label="Where are you?"
                  required
                  value={school}
                  onChange={(e) => {
                    schoolTouched.current = true;
                    setSchool(e.target.value);
                  }}
                  className={`w-full rounded-[16px] border border-ink/10 bg-cream px-5 py-3 text-[15px] ${
                    school ? "text-ink" : "text-ink/45"
                  }`}
                >
                  <option value="" disabled>
                    Where are you?
                  </option>
                  <option value="Georgetown">Georgetown</option>
                  <option value="Howard">Howard</option>
                  <option value="other">Somewhere else</option>
                </select>

                {school === "other" && (
                  <input
                    value={otherSchool}
                    onChange={(e) => setOtherSchool(e.target.value)}
                    required
                    placeholder="Your school"
                    className="w-full rounded-[16px] border border-ink/10 bg-cream px-5 py-3 text-[15px] text-ink"
                  />
                )}

                <div className="flex gap-2 rounded-full border border-ink/10 bg-cream py-[6px] pl-5 pr-[6px]">
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={onEmailChange}
                    placeholder="you@georgetown.edu"
                    className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-11 flex-none rounded-full bg-flame px-5 text-[14px] font-semibold text-white transition-transform active:scale-[0.96] disabled:opacity-70"
                  >
                    {submitting ? "…" : "Join the list"}
                  </button>
                </div>
              </form>
              {error && <div className="mt-2 text-[13px] text-ember">{error}</div>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
