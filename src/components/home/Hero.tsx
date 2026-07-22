"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResolvedPick, SearchTrack } from "@/lib/pick";
import { IntroOverlay } from "./IntroOverlay";
import { Payoff } from "./Payoff";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Emotional, photo-first hero. A single warm full-bleed face carries the feeling;
 * one aching line names it; the "Name a song you love" prompt is the hook. As you
 * type, a debounced Spotify typeahead shows matches; pick one (or "type it anyway")
 * and a filmic fade swaps the moment for the payoff/reveal. No scroll-jacking.
 */
export function Hero() {
  const [stage, setStage] = useState<"problem" | "payoff">("problem");
  const [song, setSong] = useState("");
  const [pick, setPick] = useState<ResolvedPick | null>(null);

  // entry/load-in animation — once per session; content settles in as it lifts.
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useRef(() => setIntroDone(true)).current;

  // typeahead
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | undefined>(undefined);
  const reqRef = useRef(0);
  const lockedRef = useRef(false); // guards against double-submit during the transition

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  async function runSearch(q: string) {
    const id = ++reqRef.current;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (id !== reqRef.current) return; // a newer request superseded this one
      if (!res.ok) {
        setSearchError(true);
        setResults([]);
      } else {
        setSearchError(false);
        setResults((json.tracks ?? []).slice(0, 6));
      }
    } catch {
      if (id !== reqRef.current) return;
      setSearchError(true);
      setResults([]);
    } finally {
      if (id === reqRef.current) setSearching(false);
    }
  }

  function onChange(value: string) {
    setSong(value);
    setActiveIndex(-1);
    window.clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      setSearching(false);
      setSearchError(false);
      return;
    }
    setOpen(true);
    setSearching(true);
    debounceRef.current = window.setTimeout(() => runSearch(value.trim()), 250);
  }

  // Lock in a pick and resolve into the reveal.
  function commit(next: ResolvedPick) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPick(next);
    setOpen(false);
    window.setTimeout(() => setStage("payoff"), 320);
  }

  function selectTrack(t: SearchTrack) {
    commit({ ...t, is_freetext: false });
  }

  function submitFreeText() {
    const value = song.trim();
    if (!value) return;
    commit({
      song_name: value,
      artist: null,
      album_art_url: null,
      spotify_track_id: null,
      isrc: null,
      is_freetext: true,
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitFreeText(); // Enter-on-a-highlighted-result is handled in onKeyDown
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && open && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      selectTrack(results[activeIndex]);
    }
  }

  const showDropdown = open && song.trim().length > 0;

  return (
    <section className="relative z-20">
      {/* load-in: face → smirk → dissolves into our logo, then lifts (once per session) */}
      <IntroOverlay onDone={onIntroDone} />

      <AnimatePresence mode="wait">
        {stage === "problem" ? (
          <motion.div
            key="problem"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex min-h-[100svh] w-full flex-col justify-end bg-[#160b05]"
          >
            {/* media layer — clipped so the slow zoom never overflows (the search
                dropdown lives outside this, so it's never clipped). */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* full-bleed warm face — the feeling, in one look. Slow drift for life. */}
            <motion.div
              aria-hidden
              className="absolute inset-0"
              initial={{ scale: 1.02 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 26, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/hero-face.jpg"
                alt="A student at a house party, caught in a quiet warm moment"
                className="h-full w-full object-cover"
                style={{ objectPosition: "60% 16%" }}
                fetchPriority="high"
              />
            </motion.div>

            {/* warm wash to pull the frame toward golden hour */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#ff7d22] mix-blend-soft-light opacity-40" />
            {/* legibility + mood: dark at very top (logo) and bottom (text), warm glow on the face */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(19,7,3,0.5) 0%,transparent 22%,rgba(42,18,8,0.28) 52%,rgba(56,25,11,0.9) 78%,rgba(150,82,40,0.72) 92%,#F6DFB4 100%),radial-gradient(120% 100% at 76% 14%,rgba(255,150,50,0.24),transparent 54%)",
              }}
            />
            </div>

            {/* content, lower-left — settles in as the intro lifts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="relative z-10 mx-auto w-full max-w-[1180px] px-7 pb-[clamp(72px,13vh,150px)] sm:px-12"
            >
              <div className="mb-5 inline-flex items-center gap-[10px] text-[11px] font-bold uppercase tracking-eyebrow text-[#FFC978]">
                <span className="relative h-[7px] w-[7px]">
                  <span className="absolute inset-0 rounded-full bg-flame" />
                  <span className="absolute inset-0 rounded-full bg-flame animate-pulseDot" />
                </span>
                Meet people through music
              </div>

              <h1 className="max-w-[840px] font-serif text-[clamp(36px,6vw,64px)] font-medium leading-[1.02] tracking-[-0.015em] text-[#FFF3E2]">
                You&rsquo;ve got people who&rsquo;d go.{" "}
                <em className="italic text-[#FFC26B]">You just haven&rsquo;t met them yet.</em>
              </h1>

              <p className="mt-5 max-w-[430px] text-[15px] leading-[1.55] text-[#FFEEDE]/75 sm:text-[17px]">
                Start with one song — and meet the people who&rsquo;d go.
              </p>

              {/* the hook — live typeahead */}
              <div className="relative z-20 mt-8 max-w-[480px]">
                <form
                  onSubmit={onSubmit}
                  className="flex gap-2 rounded-full bg-[#FFF8EE] py-[7px] pl-[24px] pr-[7px] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)]"
                >
                  <input
                    name="song"
                    value={song}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => {
                      if (song.trim()) setOpen(true);
                    }}
                    onBlur={() => setOpen(false)}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
                    placeholder="Name a song you love"
                    aria-label="Name a song you love"
                    className="min-w-0 flex-1 border-none bg-transparent text-base text-ink placeholder:text-[#8a6a54]"
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

                {showDropdown && (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[20px] border border-ink/10 bg-white text-left shadow-[0_24px_50px_-20px_rgba(20,17,13,0.5)]"
                  >
                    {searching && results.length === 0 && (
                      <div className="px-4 py-3 text-[13px] text-ink/40">Searching…</div>
                    )}

                    {results.map((t, i) => (
                      <button
                        key={t.spotify_track_id ?? i}
                        type="button"
                        onClick={() => selectTrack(t)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                          i === activeIndex ? "bg-gold/25" : "hover:bg-ink/[0.04]"
                        }`}
                      >
                        {t.album_art_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.album_art_url} alt="" className="h-9 w-9 flex-none rounded-[5px] object-cover" />
                        ) : (
                          <span className="h-9 w-9 flex-none rounded-[5px] bg-photo-bg" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium text-ink">{t.song_name}</span>
                          {t.artist && <span className="block truncate text-[13px] text-ink/50">{t.artist}</span>}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={submitFreeText}
                      className="flex w-full items-center gap-2 border-t border-ink/[0.06] px-4 py-3 text-left text-[13px] text-ember hover:bg-ink/[0.04]"
                    >
                      {searchError
                        ? "Search hiccup — "
                        : !searching && results.length === 0
                          ? "No matches — "
                          : "Can’t find it? "}
                      <span className="font-semibold">type &ldquo;{song.trim()}&rdquo; anyway →</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="payoff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.1 } }}
            className="relative"
          >
            {pick && <Payoff pick={pick} />}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
