"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResolvedPick, SearchTrack } from "@/lib/pick";
import { Waveform } from "./Waveform";
import { Payoff } from "./Payoff";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Problem-first hero. As you type, a debounced Spotify typeahead shows matches;
 * pick one for an exact track, or "type it anyway" for a free-text pick. Either
 * way a filmic fade swaps the statement for the payoff. No scroll-jacking.
 */
export function Hero() {
  const [stage, setStage] = useState<"problem" | "payoff">("problem");
  const [song, setSong] = useState("");
  const [pick, setPick] = useState<ResolvedPick | null>(null);

  // typeahead
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | undefined>(undefined);
  const reqRef = useRef(0);
  const lockedRef = useRef(false); // guards against double-submit during the transition

  // waveform reactivity
  const [focused, setFocused] = useState(false);
  const [pulseSignal, setPulseSignal] = useState(0);
  const [surgeSignal, setSurgeSignal] = useState(0);

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
    setPulseSignal((n) => n + 1);
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

  // Lock in a pick, fire the surge, and resolve into the reveal.
  function commit(next: ResolvedPick) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPick(next);
    setOpen(false);
    setSurgeSignal((n) => n + 1);
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
    <section className="relative overflow-hidden">
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

              {/* search + typeahead */}
              <div className="relative z-20 mx-auto mt-9 max-w-[480px]">
                <form
                  onSubmit={onSubmit}
                  className="flex gap-2 rounded-full border border-ink/[0.09] bg-white py-[7px] pl-[22px] pr-[7px] shadow-[0_20px_44px_-20px_rgba(20,17,13,0.3)]"
                >
                  <input
                    name="song"
                    value={song}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => {
                      setFocused(true);
                      if (song.trim()) setOpen(true);
                    }}
                    onBlur={() => {
                      setFocused(false);
                      setOpen(false); // dropdown items use onMouseDown so their click still registers
                    }}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
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

                {showDropdown && (
                  <div
                    // keep focus on the input so a click here registers before blur closes it
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[20px] border border-ink/10 bg-white text-left shadow-[0_24px_50px_-20px_rgba(20,17,13,0.4)]"
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

                    {/* free-text fallback — always available, never blocks the user */}
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
            {pick && <Payoff pick={pick} />}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
