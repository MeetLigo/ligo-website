"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import type { ResolvedPick, SearchTrack, WallEntry } from "@/lib/pick";

/**
 * Charcoal homepage (ported from the design export, "Ligo Homepage.dc.html").
 * Full-bleed cool friends photo, numbered nav, "Meet people through music" hero,
 * and an in-place answer zone that swaps the search prompt for the live "Ligo
 * chart" leaderboard + a school-email board-lock. Wired to the real Spotify
 * search (/api/search) and the real board (/api/answers → Supabase).
 */

const NAV = [
  { n: "01", label: "Home", href: "/" },
  { n: "02", label: "About", href: "/about" },
  { n: "03", label: "News", href: "/news" },
  { n: "04", label: "Partners", href: "/partner" },
  { n: "05", label: "FAQ", href: "/faq" },
];
const CHIPS = ["Espresso", "Saturn", "Good Luck, Babe!", "Self Control"];
const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";

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
  const [revealed, setRevealed] = useState(false);

  // typeahead
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | undefined>(undefined);
  const reqRef = useRef(0);
  const revealRef = useRef<HTMLElement | null>(null);

  // board / leaderboard
  const [wall, setWall] = useState<WallEntry[]>([]);
  const [email, setEmail] = useState("");
  const [boardError, setBoardError] = useState("");
  const [boardPosted, setBoardPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  // once the reveal appears (or the pick changes), glide down to it
  useEffect(() => {
    if (revealed && revealRef.current) {
      revealRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [revealed, pick]);

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
    setRevealed(true);
    fetchWall();
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

  function pickChip(label: string) {
    setSong(label);
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

  function reset() {
    setRevealed(false);
    setPick(null);
    setSong("");
    setResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // real leaderboard, ranked
  const chart = wall
    .map((w) => ({ ...w }))
    .sort((a, b) => b.pick_count - a.pick_count)
    .slice(0, 7)
    .map((w, i) => ({ ...w, rank: i + 1 }));
  const maxPicks = chart[0]?.pick_count || 1;
  const myRank = pick && !pick.is_freetext ? chart.find((c) => c.spotify_track_id === pick.spotify_track_id)?.rank : undefined;
  const rankText = myRank ? `#${myRank} on the Ligo chart today` : "New on the chart today";
  const lbLeft = chart.slice(0, 4);
  const lbRight = chart.slice(4);

  return (
    <>
      <section className="relative flex min-h-[94vh] w-full flex-col bg-[#0E1216]">
      {/* full-bleed cool friends photo — pinned to a fixed viewport height so its
          framing never changes when the reveal grows the section (no zoom). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[94vh] overflow-hidden">
        <img src="/hero/hero-friends-cool.jpg" alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 34%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(14,18,22,0.52) 0%,rgba(14,18,22,0.32) 32%,rgba(14,18,22,0.58) 70%,rgba(14,18,22,0.9) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-[340px]" style={{ background: "linear-gradient(180deg,rgba(14,18,22,0) 0%,rgba(14,18,22,0.5) 58%,#0E1216 100%)" }} />
        <div className="absolute -left-28 top-[6%] h-[480px] w-[480px] rounded-full" style={{ background: "radial-gradient(circle,rgba(232,162,76,0.14),transparent 66%)" }} />
        <div className="absolute -right-20 top-[40%] h-[440px] w-[440px] rounded-full" style={{ background: "radial-gradient(circle,rgba(90,166,224,0.13),transparent 66%)" }} />
      </div>

      {/* nav */}
      <div className="relative z-20 flex items-center justify-between gap-5 px-6 pt-7 sm:px-10">
        <Link href="/" className="flex flex-shrink-0 items-center gap-[11px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="Ligo" width={40} height={40} className="block rounded-[10px] [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[24px] font-semibold tracking-[-0.01em] text-[#ECEBE6] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Ligo</span>
            <span className="mt-1 hidden text-[11px] font-medium text-[#CBD3DB] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] sm:block">Connect through music</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-[3px] rounded-2xl border border-[#CBD3DB]/[0.14] bg-[#0E1216]/40 px-2 py-[7px] backdrop-blur-xl md:flex">
          {NAV.map((l, i) => (
            <Link
              key={l.n}
              href={l.href}
              className={`flex items-center gap-[7px] rounded-[11px] px-[11px] py-2 transition-colors ${
                i === 0 ? "border border-[#E8A24C]/40 bg-[#E8A24C]/[0.16]" : "border border-transparent hover:bg-[#CBD3DB]/10"
              }`}
            >
              <span className={`font-mono text-[11px] ${i === 0 ? "text-[#EDB264]" : "text-[#ECEBE6]/40"}`}>{l.n}</span>
              <span className={`whitespace-nowrap text-[13.5px] font-semibold ${i === 0 ? "text-[#ECEBE6]" : "text-[#ECEBE6]/[0.78]"}`}>{l.label}</span>
            </Link>
          ))}
          <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="ml-1 whitespace-nowrap rounded-[11px] bg-[#E8A24C] px-[13px] py-2 text-[13.5px] font-semibold text-[#241603]">
            Get the app →
          </a>
        </nav>
        <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-[11px] bg-[#E8A24C] px-[13px] py-2 text-[13px] font-semibold text-[#241603] md:hidden">
          Get the app
        </a>
      </div>

      {/* hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        {/* the hero pitch — stays intact; the reveal is appended below, never replaces this */}
        <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">For college students</div>
        <h1 className="max-w-[900px] font-serif text-[clamp(38px,6.4vw,66px)] font-medium leading-[1.0] tracking-[-0.015em] text-[#ECEBE6]">
          Meet people <span className="italic text-[#E8A24C]">through music.</span>
        </h1>
        <p className="max-w-[560px] text-[15px] leading-[1.5] text-[#ECEBE6]/[0.74] sm:text-[18px]">
          Ligo connects college students who love the same music. Start with one song and meet people near you.
        </p>

        {/* the search — always present */}
        <div className="mt-2 flex w-full max-w-[940px] flex-col items-center">
          <div className="flex w-full flex-col items-center gap-4">
              <div className="relative w-full max-w-[500px]">
                <form
                  onSubmit={onSubmit}
                  className="flex h-[76px] items-center gap-3 rounded-[18px] border border-[#CBD3DB]/[0.22] bg-[#CBD3DB]/[0.08] px-[11px] pl-[22px] shadow-[inset_0_1px_0_rgba(236,235,230,0.14),0_18px_40px_-14px_rgba(0,0,0,0.55)] backdrop-blur-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(203,211,219,0.72)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
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
                    className="min-w-0 flex-1 border-none bg-transparent text-[18px] text-[#ECEBE6] placeholder:text-[#ECEBE6]/40"
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
                    className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[16px] border border-[#CBD3DB]/15 bg-[#141A20] text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]"
                  >
                    {searching && results.length === 0 && <div className="px-4 py-3 text-[13px] text-[#ECEBE6]/40">Searching…</div>}
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
                          <span className="block truncate text-[15px] font-medium text-[#ECEBE6]">{t.song_name}</span>
                          {t.artist && <span className="block truncate text-[13px] text-[#ECEBE6]/50">{t.artist}</span>}
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
                  <button key={c} type="button" onClick={() => pickChip(c)} className="rounded-full border border-[#CBD3DB]/[0.18] bg-[#CBD3DB]/[0.08] px-[14px] py-2 text-[13px] font-semibold text-[#ECEBE6]/[0.82] transition-colors hover:bg-[#CBD3DB]/[0.16]">
                    {c}
                  </button>
                ))}
              </div>

              <div className="mt-1 flex items-center gap-[7px] text-[13px] text-[#ECEBE6]/[0.58]">
                <span>Ligo is a free app.</span>
                <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#EDB264]">Download on the App Store →</a>
              </div>
          </div>
        </div>

        {/* anticipation nudge (only before a reveal) */}
        {!revealed && (
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 pb-16 pt-4 text-center">
            <div className="font-serif text-[21px] font-medium tracking-[-0.01em] text-[#ECEBE6]/[0.72]">Name a song to see who shares your taste.</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(232,162,76,0.72)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-floatY">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </div>
        )}
      </div>
      </section>

      {/* reveal — appended BELOW the intact hero; the page grows and we glide down to it */}
      {revealed && pick && (
        <section ref={revealRef} className="relative flex w-full justify-center scroll-mt-0 bg-[#0E1216] px-6 pb-24 pt-8 sm:px-10">
          <RevealChart
            pick={pick}
            rankText={rankText}
            lbLeft={lbLeft}
            lbRight={lbRight}
            maxPicks={maxPicks}
            email={email}
            setEmail={(v) => { setEmail(v); setBoardError(""); }}
            submitBoard={submitBoard}
            boardError={boardError}
            boardPosted={boardPosted}
            submitting={submitting}
            reset={reset}
          />
        </section>
      )}
    </>
  );
}

/* ---- the reveal: your pick + board lock + live Ligo chart ---- */
function RevealChart({
  pick,
  rankText,
  lbLeft,
  lbRight,
  maxPicks,
  email,
  setEmail,
  submitBoard,
  boardError,
  boardPosted,
  submitting,
  reset,
}: {
  pick: ResolvedPick | null;
  rankText: string;
  lbLeft: (WallEntry & { rank: number })[];
  lbRight: (WallEntry & { rank: number })[];
  maxPicks: number;
  email: string;
  setEmail: (v: string) => void;
  submitBoard: () => void;
  boardError: string;
  boardPosted: boolean;
  submitting: boolean;
  reset: () => void;
}) {
  const row = (s: WallEntry & { rank: number }) => (
    <div key={s.spotify_track_id || s.song_name} className="flex items-center gap-3 border-b border-[#CBD3DB]/[0.08] px-1 py-[9px]">
      <span className="w-[18px] flex-none text-center font-serif text-[15px] font-semibold text-[#ECEBE6]/[0.42]">{s.rank}</span>
      {s.album_art_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.album_art_url} alt="" className="h-[46px] w-[46px] flex-none rounded-[10px] object-cover" />
      ) : (
        <span className="h-[46px] w-[46px] flex-none rounded-[10px] bg-white/10" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-[7px]">
          <span className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#ECEBE6]">{s.song_name}</span>
          {s.artist && <span className="truncate text-[11px] text-[#ECEBE6]/50">{s.artist}</span>}
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#CBD3DB]/10">
          <div className="h-full rounded-full" style={{ width: `${Math.round((s.pick_count / maxPicks) * 100)}%`, background: "linear-gradient(90deg,#E8A24C,#EDB264)" }} />
        </div>
      </div>
      <span className="flex-none font-mono text-[12px] text-[#ECEBE6]/55">{s.pick_count}</span>
    </div>
  );

  return (
    <div className="flex w-full max-w-[860px] animate-riseIn flex-col items-stretch gap-[18px] text-left">
      <button onClick={reset} className="self-center px-2 py-1 text-[13px] text-[#ECEBE6]/60 transition-colors hover:text-[#ECEBE6]">← Name another song</button>

      {/* board lock */}
      {boardPosted ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-[9px] rounded-full border border-[#71C07F]/[0.42] bg-[#71C07F]/[0.14] px-[18px] py-[11px]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#71C07F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            <span className="text-[14px] font-semibold text-[#ECEBE6]">&ldquo;{pick?.song_name}&rdquo; is locked onto the Ligo board.</span>
          </div>
          <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#E8A24C] px-7 py-[15px] text-[16px] font-semibold text-[#241603] shadow-[0_12px_28px_-8px_rgba(232,162,76,0.55)]">
            Get Ligo to find your people →
          </a>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-stretch gap-3 text-center">
          <div className="flex flex-col gap-[6px]">
            <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264]">Lock it onto the board</div>
            <p className="text-[15px] leading-[1.5] text-[#ECEBE6]/[0.72]">
              Drop your school email and &ldquo;{pick?.song_name}&rdquo; counts permanently. Verified students only. One pick each.
            </p>
          </div>
          <div className="flex items-center gap-[9px] rounded-[14px] border border-[#CBD3DB]/[0.22] bg-[#CBD3DB]/[0.08] py-[7px] pl-4 pr-[7px] shadow-[inset_0_1px_0_rgba(236,235,230,0.12)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(203,211,219,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M4 4h16v16H4z" /><path d="M4 7l8 6 8-6" />
            </svg>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitBoard()}
              type="email"
              placeholder="you@georgetown.edu"
              aria-label="School email"
              className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-[#ECEBE6] placeholder:text-[#ECEBE6]/40"
            />
            <button onClick={submitBoard} disabled={submitting} className="flex-none rounded-[10px] bg-[#E8A24C] px-[18px] py-[11px] text-[14px] font-semibold text-[#241603] shadow-[0_8px_20px_-6px_rgba(232,162,76,0.55)] transition-transform active:scale-[0.97] disabled:opacity-70">
              {submitting ? "…" : "Lock it in →"}
            </button>
          </div>
          {boardError && <span className="text-[13px] text-[#ED9A6A]">{boardError}</span>}
        </div>
      )}

      {/* the Ligo chart */}
      <div className="rounded-[22px] border border-[#CBD3DB]/10 bg-[#0E1216]/[0.66] p-[22px_24px] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-[10px]">
          <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264]">The Ligo chart · today</div>
        </div>
        <h2 className="mb-3 font-serif text-[28px] font-semibold tracking-[-0.01em] text-[#ECEBE6]">What people are picking</h2>

        {/* your pick */}
        <div className="mb-[18px] flex flex-wrap items-center gap-[11px] rounded-[12px] border border-[#E8A24C]/[0.32] bg-[#E8A24C]/10 px-[14px] py-[10px]">
          <span className="inline-flex h-4 w-[15px] flex-none items-end gap-[2px]">
            <span className="w-[2.5px] animate-eq rounded-[1px] bg-[#E8A24C]" />
            <span className="w-[2.5px] animate-eq rounded-[1px] bg-[#E8A24C] [animation-delay:.15s]" />
            <span className="w-[2.5px] animate-eq rounded-[1px] bg-[#E8A24C] [animation-delay:.3s]" />
            <span className="w-[2.5px] animate-eq rounded-[1px] bg-[#E8A24C] [animation-delay:.45s]" />
          </span>
          <span className="flex-none text-[10px] font-bold uppercase tracking-eyebrow text-[#EDB264]">Your pick</span>
          <span className="font-serif text-[16px] font-semibold tracking-[-0.01em] text-[#ECEBE6]">{pick?.song_name}</span>
          {pick?.artist && <span className="text-[13px] text-[#ECEBE6]/60">{pick.artist}</span>}
          <span className="ml-auto text-[12px] font-semibold text-[#CBD3DB]">{rankText}</span>
        </div>

        {lbLeft.length === 0 ? (
          <div className="py-4 text-center text-[13px] text-[#ECEBE6]/40">The chart&rsquo;s just getting started. Be the first to lock a pick.</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-9 sm:grid-cols-2">
            <div className="flex flex-col">{lbLeft.map(row)}</div>
            <div className="flex flex-col">{lbRight.map(row)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
