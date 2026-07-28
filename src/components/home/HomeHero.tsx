"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ResolvedPick, SearchTrack, WallEntry } from "@/lib/pick";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Tape } from "@/components/ui/Tape";

/**
 * Charcoal homepage (ported from the design export, "Ligo Homepage.dc.html").
 * Full-bleed cool friends photo, numbered nav, "Meet people through music" hero,
 * and an in-place answer zone that swaps the search prompt for the live "Ligo
 * chart" leaderboard + a school-email board-lock. Wired to the real Spotify
 * search (/api/search) and the real board (/api/answers → Supabase).
 */

const CHIPS = ["Espresso", "Saturn", "Good Luck, Babe!", "Self Control"];
const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";

// Ambient hero slideshow — each photo is pre-graded per-photo (in /public/hero)
// to a matched warm, medium-dark tone so the cream headline + search read the
// same on every slide, whatever the source photo's brightness was.
const SLIDES = ["/hero/slide-1.jpg", "/hero/slide-2.jpg", "/hero/slide-3.jpg", "/hero/slide-4.jpg"];
const SLIDE_POS = ["center 32%", "center 40%", "center 44%", "center 30%"];
const SLIDE_MS = 4000; // hold per slide (crossfade is ~1s)

function deriveSchool(email: string) {
  const domain = (email.split("@")[1] || "").toLowerCase();
  if (domain.includes("georgetown")) return "Georgetown";
  if (domain.includes("howard")) return "Howard";
  const label = domain.split(".")[0] || "your school";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function HomeHero() {
  const [song, setSong] = useState("");
  const [pick, setPick] = useState<ResolvedPick | null>(null);
  const [slide, setSlide] = useState(0);

  // ambient crossfade slideshow (honors reduced-motion → holds slide 1)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  // typeahead
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | undefined>(undefined);
  const reqRef = useRef(0);

  // board / leaderboard
  const [wall, setWall] = useState<WallEntry[]>([]);
  const [email, setEmail] = useState("");
  const [boardError, setBoardError] = useState("");
  const [boardPosted, setBoardPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  // the board is public social proof — load the live chart immediately on
  // mount so the pre-pick sheet and polaroid always show real data
  useEffect(() => {
    fetchWall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchWall() {
    try {
      const j = await fetch("/api/answers").then((r) => r.json());
      setWall(j.wall ?? []);
    } catch {
      /* leave as-is */
    }
  }

  async function runSearch(q: string) {
    const id = ++reqRef.current;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (id !== reqRef.current) return;
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

  function doReveal(next: ResolvedPick) {
    setPick(next);
    setOpen(false);
    setBoardPosted(false);
    setBoardError("");
    fetchWall();
    // the glide: walk the user down to the board — a slow, eased scroll
    // (~900ms). Reduced motion: instant jump. (setTimeout, not rAF, so the
    // glide still fires if the tab is occluded; React has re-rendered by then.)
    window.setTimeout(() => glideToBoard(), 30);
  }

  function glideToBoard() {
    const el = document.getElementById("board");
    if (!el) return;
    const targetY = el.getBoundingClientRect().top + window.scrollY - 6;
    // instant jump when motion is reduced — or when the page isn't visible,
    // where rAF (which drives the eased scroll) wouldn't tick anyway
    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.scrollY;
    const dist = targetY - startY;
    const dur = 900;
    const t0 = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function selectTrack(t: SearchTrack) {
    setSong(t.song_name);
    doReveal({ ...t, is_freetext: false });
  }

  function revealTyped() {
    const value = song.trim();
    if (!value) return;
    // if a result is highlighted, use it; otherwise reveal as free text
    if (open && activeIndex >= 0 && results[activeIndex]) {
      selectTrack(results[activeIndex]);
      return;
    }
    doReveal({ song_name: value, artist: null, album_art_url: null, spotify_track_id: null, isrc: null, is_freetext: true });
  }

  async function pickChip(label: string) {
    setSong(label);
    // Resolve the chip through the real search so it carries actual album art +
    // a track id (like a typed pick), then reveal. Fall back to free text if the
    // lookup fails or returns nothing.
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(label)}`);
      const json = await res.json();
      const top = res.ok ? (json.tracks ?? [])[0] : null;
      if (top) {
        doReveal({ ...top, is_freetext: false });
        return;
      }
    } catch {
      /* fall through to free text */
    }
    doReveal({ song_name: label, artist: null, album_art_url: null, spotify_track_id: null, isrc: null, is_freetext: true });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    revealTyped();
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
    }
  }

  async function submitBoard() {
    if (!pick || submitting) return;
    const raw = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.edu$/.test(raw)) {
      setBoardError("Enter your school email (ends in .edu). The board is verified students only.");
      return;
    }
    setSubmitting(true);
    setBoardError("");
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pick, email: raw, school: deriveSchool(raw) }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || j.error || `HTTP ${res.status}`);
      await fetchWall();
      setBoardPosted(true);
    } catch (err) {
      setBoardError(`Couldn't lock it. ${err instanceof Error ? err.message : "Try again"}.`);
    } finally {
      setSubmitting(false);
    }
  }

  const showDropdown = open && song.trim().length > 0;

  // real leaderboard, fully ranked — RevealChart shows the top 7 and always
  // extends to the user's own row if it ranks lower
  const chart = wall
    .map((w) => ({ ...w }))
    .sort((a, b) => b.pick_count - a.pick_count)
    .map((w, i) => ({ ...w, rank: i + 1 }));

  return (
    <>
      <section className="relative flex min-h-[94vh] w-full flex-col">
      {/* the party — ambient crossfade slideshow. In the hero state it's pinned to
          the top 94vh; in the reveal state it goes FIXED full-viewport and eases to
          dimmed + just barely softened — the people stay recognizable behind the
          paper artifacts, like a wall the posters are taped to. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[94vh] overflow-hidden">
        <div className="absolute inset-0">
          {SLIDES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] ease-in-out motion-reduce:transition-none"
              style={{ opacity: i === slide ? 1 : 0, objectPosition: SLIDE_POS[i] }}
            />
          ))}
        </div>
        {/* legibility scrim — top-weighted, sits behind the text then fades out so the
            lower photo stays clearly visible (no wash over the bottom half) */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(19,15,10,0.58) 0%,rgba(19,15,10,0.44) 22%,rgba(19,15,10,0.4) 52%,rgba(19,15,10,0.14) 70%,rgba(19,15,10,0) 84%)" }} />
        {/* tall bottom fade — the photo eases into the espresso base over ~260px
            so the hand-off to the board section has no detectable edge */}
        <div className="absolute inset-x-0 bottom-0 h-[260px]" style={{ background: "linear-gradient(180deg,rgba(19,15,10,0) 0%,rgba(19,15,10,0.45) 40%,rgba(19,15,10,0.85) 72%,#130F0A 100%)" }} />
        <div className="absolute -left-28 top-[6%] h-[480px] w-[480px] rounded-full" style={{ background: "radial-gradient(circle,rgba(232,162,76,0.14),transparent 66%)" }} />
        <div className="absolute -right-20 top-[40%] h-[440px] w-[440px] rounded-full" style={{ background: "radial-gradient(circle,rgba(90,166,224,0.13),transparent 66%)" }} />
      </div>

      {/* nav — the one shared header (see chrome/SiteHeader) overlaying the hero photo */}
      <SiteHeader />

      {/* hero content — always present; picking a song glides the page down to
          the board section below rather than swapping states */}
      <div className="relative z-10 flex flex-1 animate-riseIn flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">For college students</div>
        <h1 className="max-w-[900px] font-serif text-[clamp(38px,6.4vw,66px)] font-medium leading-[1.0] tracking-[-0.015em] text-[#EFE8DB]">
          Meet people <span className="italic text-[#E8A24C]">through music.</span>
        </h1>
        <p className="max-w-[560px] text-[15px] leading-[1.5] text-[#EFE8DB]/[0.74] sm:text-[18px]">
          Ligo connects college students who love the same music. Start with one song and meet people near you.
        </p>

        {/* the search — always present */}
        <div className="mt-2 flex w-full max-w-[940px] flex-col items-center">
          <div className="flex w-full flex-col items-center gap-4">
              <div className="relative w-full max-w-[500px]">
                <form
                  onSubmit={onSubmit}
                  className="flex h-[76px] items-center gap-3 rounded-[18px] border border-[#D7CCBC]/[0.22] bg-[#D7CCBC]/[0.08] px-[11px] pl-[22px] shadow-[inset_0_1px_0_rgba(239,232,219,0.14),0_18px_40px_-14px_rgba(0,0,0,0.55)] backdrop-blur-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(215,204,188,0.72)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                    <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M9 18V5l12-2v13" />
                  </svg>
                  <input
                    name="song"
                    value={song}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => song.trim() && setOpen(true)}
                    onBlur={() => setOpen(false)}
                    autoComplete="off"
                    aria-label="What's your favorite song?"
                    placeholder="What's your favorite song?"
                    className="min-w-0 flex-1 border-none bg-transparent text-[18px] text-[#EFE8DB] placeholder:text-[#EFE8DB]/40"
                  />
                  <button
                    type="submit"
                    aria-label="Reveal"
                    className="flex h-14 w-14 flex-none items-center justify-center rounded-[14px] text-[#241603] shadow-[0_8px_22px_-6px_rgba(232,162,76,0.65),inset_0_1px_0_rgba(255,244,230,0.4)] transition-transform active:scale-95"
                    style={{ background: "linear-gradient(140deg,#EDB264,#E8A24C 55%,#C77A2E)" }}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="#241603"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                </form>

                {showDropdown && (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[16px] border border-[#D7CCBC]/15 bg-[#1B150E] text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]"
                  >
                    {searching && results.length === 0 && <div className="px-4 py-3 text-[13px] text-[#EFE8DB]/40">Searching…</div>}
                    {results.map((t, i) => (
                      <button
                        key={t.spotify_track_id ?? i}
                        type="button"
                        onClick={() => selectTrack(t)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left ${i === activeIndex ? "bg-[#E8A24C]/15" : "hover:bg-white/[0.04]"}`}
                      >
                        {t.album_art_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.album_art_url} alt="" className="h-9 w-9 flex-none rounded-[6px] object-cover" />
                        ) : (
                          <span className="h-9 w-9 flex-none rounded-[6px] bg-white/10" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium text-[#EFE8DB]">{t.song_name}</span>
                          {t.artist && <span className="block truncate text-[13px] text-[#EFE8DB]/50">{t.artist}</span>}
                        </span>
                      </button>
                    ))}
                    <button type="button" onClick={revealTyped} className="flex w-full items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-left text-[13px] text-[#EDB264] hover:bg-white/[0.04]">
                      {searchError ? "Search hiccup, " : !searching && results.length === 0 ? "No matches, " : "Can't find it? "}
                      <span className="font-semibold">reveal &ldquo;{song.trim()}&rdquo; anyway →</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {CHIPS.map((c) => (
                  <button key={c} type="button" onClick={() => pickChip(c)} className="rounded-full border border-[#D7CCBC]/[0.18] bg-[#D7CCBC]/[0.08] px-[14px] py-2 text-[13px] font-semibold text-[#EFE8DB]/[0.82] transition-colors hover:bg-[#D7CCBC]/[0.16]">
                    {c}
                  </button>
                ))}
              </div>

              <div className="mt-1 flex items-center gap-[7px] text-[13px] text-[#EFE8DB]/[0.58]">
                <span>Ligo is a free app.</span>
                <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#EDB264]">Download on the App Store →</a>
              </div>
          </div>
        </div>

      </div>
      </section>

      {/* THE BOARD — a permanent section below the hero: the paper chart +
          polaroid on their own espresso wall. Always present, linkable at
          #board; picking a song glides the page down here. */}
      <section id="board" className="relative w-full overflow-hidden px-6 pb-12 pt-16 sm:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* ambient wash of the CURRENT hero slide, just below the seam: same
              image, same crossfade, driven by the very same `slide` state so it
              can never drift — but abstracted past recognition (heavy blur, deep
              dim) so it reads as the photo's colour and light filling the room,
              not imagery. Same fade-in/out mask, so the boundary stays seamless.
              Sources are the hero's own images (cached + decoded, no extra
              network); the inner scale hides the blur's edge bleed. */}
          <div
            className="absolute inset-x-0 top-0 h-[320px] overflow-hidden"
            style={{
              opacity: 0.5,
              maskImage: "linear-gradient(180deg,transparent 0px,black 110px,rgba(0,0,0,0.85) 180px,transparent 300px)",
              WebkitMaskImage: "linear-gradient(180deg,transparent 0px,black 110px,rgba(0,0,0,0.85) 180px,transparent 300px)",
            }}
          >
            <div className="absolute inset-0 scale-125" style={{ filter: "brightness(0.32) saturate(0.9) blur(34px)" }}>
              {SLIDES.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  fetchPriority="low"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] ease-in-out motion-reduce:transition-none"
                  style={{ opacity: i === slide ? 1 : 0, objectPosition: SLIDE_POS[i] }}
                />
              ))}
            </div>
            {/* amber espresso grade over the reflection */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(199,122,46,0.10),rgba(19,15,10,0.28))" }} />
          </div>
          {/* soft amber vignette on the wall */}
          <div className="absolute left-1/2 top-[14%] h-[560px] w-[920px] -translate-x-1/2" style={{ background: "radial-gradient(ellipse,rgba(232,162,76,0.07),transparent 66%)" }} />
          <div className="absolute -bottom-44 -left-40 h-[540px] w-[540px] rounded-full" style={{ background: "radial-gradient(circle,rgba(199,122,46,0.05),transparent 65%)" }} />
          {/* film grain */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              opacity: 0.05,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>
        <div className="relative flex w-full justify-center">
          <RevealChart
            pick={pick}
            chart={chart}
            email={email}
            setEmail={(v) => { setEmail(v); setBoardError(""); }}
            submitBoard={submitBoard}
            boardError={boardError}
            boardPosted={boardPosted}
            submitting={submitting}
          />
        </div>
      </section>
    </>
  );
}

/* ---- the board: the printed chart + polaroid anthem + board lock ---- */
function RevealChart({
  pick,
  chart,
  email,
  setEmail,
  submitBoard,
  boardError,
  boardPosted,
  submitting,
}: {
  pick: ResolvedPick | null;
  chart: (WallEntry & { rank: number })[];
  email: string;
  setEmail: (v: string) => void;
  submitBoard: () => void;
  boardError: string;
  boardPosted: boolean;
  submitting: boolean;
}) {
  // does a chart row correspond to the user's pick?
  const matchesPick = (s: WallEntry) =>
    !!pick &&
    ((!!pick.spotify_track_id && s.spotify_track_id === pick.spotify_track_id) ||
      s.song_name.trim().toLowerCase() === pick.song_name.trim().toLowerCase());

  const top7 = chart.slice(0, 7);
  const mineRow = chart.find(matchesPick) || null; // the user's row, wherever it ranks
  const anthem = chart[0] || null; // the #1 song — always mirrors the live chart
  const anthemIsYours = !!anthem && matchesPick(anthem);

  // The pick's own art if we have it (Spotify search picks), otherwise borrow the
  // cover from its matching chart row (quick-pick chips resolve no art of their own).
  const pickArt = pick?.album_art_url || mineRow?.album_art_url || null;

  // one row of the printed sheet: ink on paper. Serif rank numeral + title, small
  // printed thumbnail, quiet sans artist/count. The user's row gets a hand-drawn
  // marker circle + a handwritten "your pick" note (rendered inside the row, so
  // it lands exactly on their rank wherever it sits).
  const row = (s: WallEntry & { rank: number }) => {
    const mine = matchesPick(s);
    return (
      <div key={s.spotify_track_id || s.song_name} className="relative flex items-center gap-3 border-b border-ink/[0.08] py-[9px] last:border-b-0">
        {mine && <PickMarker label="your pick" />}
        <span className="w-6 flex-none text-right font-serif text-[19px] font-medium leading-none text-ink/[0.45]">{s.rank}</span>
        {s.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.album_art_url} alt="" className="aspect-square h-8 w-8 flex-none rounded-[3px] object-cover ring-1 ring-ink/10" />
        ) : (
          <span className="flex aspect-square h-8 w-8 flex-none items-center justify-center rounded-[3px] ring-1 ring-ink/10" style={{ background: "linear-gradient(150deg,rgba(199,122,46,0.3),rgba(232,162,76,0.16))" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(122,74,20,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-serif text-[16.5px] font-medium leading-snug tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">{s.song_name}</div>
          {s.artist && <div className="mt-[1px] text-[11.5px] text-ink/[0.55]">{s.artist}</div>}
        </div>
        <span className="flex-none text-[11.5px] text-ink/[0.5]">
          {s.pick_count} {s.pick_count === 1 ? "pick" : "picks"}
        </span>
      </div>
    );
  };

  return (
    <div className="relative flex w-full max-w-[940px] flex-col items-stretch gap-7 text-left">
      {/* above the paper: pre-pick, a quiet invitation; post-pick, the email
          capture fades in. Scrolling up to the hero input is how you pick again. */}
      <div className="relative flex flex-col gap-[14px]">
        {!pick ? (
          <p className="mx-auto max-w-[440px] text-center font-serif text-[19px] italic leading-[1.5] text-[#EFE8DB]/[0.72]">
            Name a song above to put yours up.
          </p>
        ) : boardPosted ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-[9px] rounded-full border border-[#71C07F]/[0.42] bg-[#130F0A]/[0.72] px-[18px] py-[11px] backdrop-blur-xl">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#71C07F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              <span className="text-[14px] font-semibold text-[#EFE8DB]">&ldquo;{pick?.song_name}&rdquo; is locked onto the Ligo board.</span>
            </div>
            <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#E8A24C] px-6 py-[13px] text-[15px] font-semibold text-[#241603] shadow-[0_12px_28px_-8px_rgba(232,162,76,0.55)]">
              Get Ligo to find your people →
            </a>
          </div>
        ) : (
          /* compact conversion strip — one line of copy + the glass pill (the pill
             matches the hero search; no framing box). Fades in with each new pick. */
          <div key={pick.spotify_track_id || pick.song_name} className="mx-auto flex w-full max-w-[480px] animate-revealFade flex-col items-stretch gap-[10px] text-center motion-reduce:animate-none">
            <p className="text-[14px] leading-[1.5] text-[#EFE8DB]/[0.82] [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
              Drop your school email and &ldquo;{pick?.song_name}&rdquo; counts permanently. Verified students only. One pick each.
            </p>
            <div className="flex items-center gap-[9px] rounded-full border border-[#E8A24C]/[0.26] bg-[#14100C]/[0.55] py-[6px] pl-4 pr-[6px] shadow-[inset_0_1px_0_rgba(232,162,76,0.12),0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(237,178,100,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <path d="M4 4h16v16H4z" /><path d="M4 7l8 6 8-6" />
              </svg>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitBoard()}
                type="email"
                placeholder="you@school.edu"
                aria-label="School email"
                className="min-w-0 flex-1 border-none bg-transparent text-[14px] text-[#EFE8DB] placeholder:text-[#EFE8DB]/40"
              />
              <button onClick={submitBoard} disabled={submitting} className="flex-none rounded-full bg-[#E8A24C] px-4 py-[9px] text-[13px] font-semibold text-[#241603] shadow-[0_8px_20px_-6px_rgba(232,162,76,0.55)] transition-transform active:scale-[0.97] disabled:opacity-70">
                {submitting ? "…" : "Lock it in →"}
              </button>
            </div>
            {boardError && <span className="text-[13px] text-[#ED9A6A] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">{boardError}</span>}
          </div>
        )}
      </div>

      {/* the wall — a printed chart sheet taped up over the photo, with the #1
          record's polaroid pinned beside it. Slightly offset heights, like a real
          wall arrangement. Record first on mobile. */}
      <div className="relative flex flex-col items-center gap-9 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
        {/* THE PAPER — cream sheet, tape, grain, ink typography */}
        <div className="w-full max-w-[500px]">
          <div className="relative -rotate-[1deg] rounded-[2px] bg-cream px-6 pb-6 pt-5 shadow-[0_34px_60px_-22px_rgba(0,0,0,0.65),0_16px_44px_-18px_rgba(232,162,76,0.3)] sm:px-8">
            <Tape className="-top-[11px] left-7 -rotate-[5deg]" />
            <Tape className="-top-[11px] right-9 rotate-[4deg]" />
            <Tape className="-bottom-[11px] left-1/2 -translate-x-1/2 rotate-[2deg]" />

            {/* letterhead — the heading lives ON the sheet, in ink */}
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/[0.55]">The Ligo chart · today</div>
            <h2 className="mb-[22px] mt-[6px] font-serif text-[24px] font-medium leading-[1.08] tracking-[-0.015em] text-ink">What people are picking</h2>

            {chart.length === 0 ? (
              <div className="py-4 text-[13px] text-ink/[0.55]">The chart&rsquo;s just getting started. Be the first to lock a pick.</div>
            ) : (
              <div className="flex flex-col">
                {top7.map(row)}
                {/* the user's row is always findable: if it ranks below the visible
                    rows, the list extends to it past an ellipsis */}
                {mineRow && mineRow.rank > 7 && (
                  <>
                    <div className="py-[3px] text-center text-[14px] leading-none tracking-[0.3em] text-ink/30">···</div>
                    {row(mineRow)}
                  </>
                )}
              </div>
            )}

            {/* pick not on the board yet (email not locked): a pending line, same marker */}
            {pick && !mineRow && (
              <div className="relative flex items-center gap-3 border-t border-ink/[0.08] py-[9px]">
                <PickMarker label="your pick · new" />
                <span className="w-6 flex-none text-right font-serif text-[19px] font-medium leading-none text-ink/[0.35]">–</span>
                {pickArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pickArt} alt="" className="aspect-square h-8 w-8 flex-none rounded-[3px] object-cover ring-1 ring-ink/10" />
                ) : (
                  <span className="flex aspect-square h-8 w-8 flex-none items-center justify-center rounded-[3px] ring-1 ring-ink/10" style={{ background: "linear-gradient(150deg,rgba(199,122,46,0.3),rgba(232,162,76,0.16))" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(122,74,20,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-[16.5px] font-medium leading-snug tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">{pick.song_name}</div>
                  {pick.artist && <div className="mt-[1px] text-[11.5px] text-ink/[0.55]">{pick.artist}</div>}
                </div>
                <span className="flex-none text-[11.5px] text-ink/[0.5]">—</span>
              </div>
            )}

            {/* paper fiber — a whisper of grain so the cream reads as stock, not pixels */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2px] mix-blend-multiply"
              style={{
                opacity: 0.055,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E\")",
              }}
            />
          </div>
        </div>

        {/* THE RECORD — the #1's art as a taped-up polaroid beside the sheet */}
        <div className="max-lg:order-first lg:mt-16">
          <AnthemPanel anthem={anthem} isYours={anthemIsYours} />
        </div>
      </div>
    </div>
  );
}

/* the handwritten pointer for the user's row: a soft marker-swipe highlight
   behind the row (uneven edges, ~10% orange) plus the "your pick" note with a
   small hand-drawn arrow whose tip lands at the row's edge — nothing covers the
   title or thumbnail. The highlight fades in and the arrow DRAWS ON as the
   glide arrives; reduced motion shows both instantly. Remounts per pick (rows
   are keyed), so re-picking re-points at the new row. */
function PickMarker({ label }: { label: string }) {
  return (
    <>
      {/* marker-swipe wash — slightly uneven edges, bleeding a touch past the row */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 inset-y-[2px] -rotate-[0.5deg] animate-revealFade [animation-delay:700ms] motion-reduce:animate-none"
        style={{ background: "rgba(232,162,76,0.10)", borderRadius: "10px 5px 12px 6px / 7px 12px 5px 10px" }}
      />
      {/* handwritten note, above-right of the row */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[13px] right-9 -rotate-[4deg] animate-revealFade font-hand text-[17px] font-semibold leading-none text-[#C96F14] [animation-delay:1.05s] motion-reduce:animate-none"
      >
        {label}
      </span>
      {/* hand-drawn arrow, tip landing at the row's top edge */}
      <svg aria-hidden width="26" height="30" viewBox="0 0 26 30" fill="none" className="pointer-events-none absolute -top-[9px] right-2">
        <path
          d="M22 2 C14 6, 9 14, 11 25 M11 25 l-5.5-4.5 M11 25 l6.5-2.5"
          stroke="#C96F14"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-arrowDraw motion-reduce:animate-none"
          style={{ strokeDasharray: 60 }}
        />
      </svg>
    </>
  );
}

/* ---- Ligo's Anthem: the chart's #1 as a polaroid taped up beside the sheet —
        white border, its own tape, handwritten label. Small and charming. ---- */
function AnthemPanel({ anthem, isYours }: { anthem: (WallEntry & { rank: number }) | null; isYours: boolean }) {
  const art = anthem?.album_art_url || null;
  return (
    <div className="relative w-[220px] rotate-[2deg] rounded-[2px] bg-white p-[9px] pb-[10px] shadow-[0_28px_54px_-20px_rgba(0,0,0,0.65),0_14px_40px_-16px_rgba(232,162,76,0.3)]">
      <Tape className="-top-[11px] left-1/2 -translate-x-1/2 -rotate-[3deg]" />

      {/* the record — a perfect 1:1 square, cropped never stretched */}
      <div className="aspect-square w-full overflow-hidden">
        {art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art} alt={anthem ? `${anthem.song_name} album art` : ""} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(150deg,rgba(232,162,76,0.35),#E9DFCC 70%)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C77A2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </div>
        )}
      </div>

      {/* handwritten label on the polaroid's bottom margin */}
      <div className="px-[3px] pt-[9px] font-hand leading-tight">
        <div className={`text-[15px] ${isYours ? "text-[#C96F14]" : "text-ink/[0.6]"}`}>
          {isYours ? "your pick is today's anthem!" : "Ligo's anthem · today"}
        </div>
        {anthem ? (
          <div className="mt-[2px] text-[19px] text-ink [overflow-wrap:anywhere]">
            {anthem.song_name}
            {anthem.artist && <span className="text-ink/[0.55]"> — {anthem.artist}</span>}
          </div>
        ) : (
          <div className="mt-[2px] text-[16px] text-ink/[0.55]">waiting on the first pick</div>
        )}
        {anthem && (
          <div className="mt-[2px] text-[14px] text-ink/[0.45]">
            {anthem.pick_count} {anthem.pick_count === 1 ? "pick" : "picks"} today · #1
          </div>
        )}
      </div>
    </div>
  );
}
