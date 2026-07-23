"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResolvedPick, SearchTrack } from "@/lib/pick";
import { IntroOverlay } from "./IntroOverlay";
import { Payoff } from "./Payoff";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// suggestion chips — tap to drop a song into the search and run it
const CHIPS = ["Espresso", "Saturn", "Good Luck, Babe!", "Self Control"];

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

  // tapping a chip fills the input and runs the live search (same as typing it)
  function pickChip(label: string) {
    onChange(label);
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
            className="relative flex min-h-[100svh] w-full flex-col items-center justify-center bg-[#0A0907] px-6 py-24 text-center"
          >
            {/* media layer — clipped so the slow drift never overflows */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* full-bleed golden-hour friends — the show you skipped, the people you couldn't find */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.03 }}
                animate={{ scale: 1.11 }}
                transition={{ duration: 28, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/hero-friends.jpg"
                  alt="Three friends laughing together at golden hour"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 34%" }}
                  fetchPriority="high"
                />
              </motion.div>
              {/* night-cinema wash — legible over the warm photo, resolves to near-black */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(10,9,7,0.55) 0%,rgba(10,9,7,0.4) 32%,rgba(10,9,7,0.86) 78%,rgba(10,9,7,0.98) 100%)",
                }}
              />
              {/* warm stage glows */}
              <div className="absolute -left-28 top-[6%] h-[460px] w-[460px] rounded-full" style={{ background: "radial-gradient(circle,rgba(249,115,22,0.28),transparent 66%)" }} />
              <div className="absolute -right-24 top-[40%] h-[420px] w-[420px] rounded-full" style={{ background: "radial-gradient(circle,rgba(245,215,131,0.2),transparent 66%)" }} />
            </div>

            {/* centered content — settles in as the intro lifts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col items-center gap-5"
            >
              <div className="inline-flex items-center gap-[10px] text-[11px] font-bold uppercase tracking-eyebrow text-[#F5D783] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                <span className="relative h-[7px] w-[7px]">
                  <span className="absolute inset-0 rounded-full bg-flame" />
                  <span className="absolute inset-0 rounded-full bg-flame animate-pulseDot" />
                </span>
                Georgetown · they were three rows back
              </div>

              <h1 className="max-w-[860px] font-display text-[clamp(38px,6.6vw,66px)] font-semibold leading-[1.01] tracking-[-0.03em] text-[#FAFAF8]">
                You didn&rsquo;t miss it because no one would go.{" "}
                <span className="italic text-[#F5D783]">You just couldn&rsquo;t find them.</span>
              </h1>

              <p className="max-w-[540px] text-[15px] leading-[1.5] text-white/65 sm:text-[18px]">
                Name a song you love — see who on your campus is already going to the same show.
              </p>

              {/* the hook — dark-glass typeahead + suggestion chips */}
              <div className="relative z-20 mt-2 flex w-full max-w-[520px] flex-col items-center gap-4">
                <div className="text-[11px] font-bold uppercase tracking-eyebrow text-white/45">Name a song you love</div>

                <div className="relative w-full">
                  <form
                    onSubmit={onSubmit}
                    className="flex w-full items-center gap-2 rounded-full border border-white/[0.16] bg-white/[0.08] py-[8px] pl-[20px] pr-[8px] shadow-[0_0_0_6px_rgba(249,115,22,0.1),0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                      <path d="M9 18V5l12-2v13" />
                    </svg>
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
                      placeholder="Espresso, Saturn, Good Luck Babe…"
                      aria-label="Name a song you love"
                      className="min-w-0 flex-1 border-none bg-transparent text-base text-white placeholder:text-white/40"
                    />
                    <button
                      type="submit"
                      className="flex flex-none items-center gap-[7px] rounded-full bg-flame px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(249,115,22,0.55)] transition-transform active:scale-95"
                    >
                      Reveal
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h13M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </form>

                  {showDropdown && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[20px] border border-ink/10 bg-white text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
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

                {/* suggestion chips — tap to search that song */}
                <div className="flex flex-wrap justify-center gap-2">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickChip(c)}
                      className="rounded-full border border-white/[0.16] bg-white/[0.08] px-[14px] py-2 text-[13px] font-semibold text-white/85 backdrop-blur-sm transition-colors hover:bg-white/[0.16]"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* free app note */}
                <div className="mt-1 flex items-center gap-[6px] text-[13px] text-white/55">
                  <span>Ligo is a free app.</span>
                  <a
                    href="https://apps.apple.com/us/app/ligo/id6753926105"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#F5D783]"
                  >
                    Download on the App Store →
                  </a>
                </div>
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
