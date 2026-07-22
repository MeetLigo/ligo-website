"use client";

import { useEffect, useState } from "react";
import { getTourDates, type TourDate } from "@/lib/tour";

/**
 * Album-art + tour-dates payoff beat. Left: the album art from the person's
 * Spotify pick (real). Right: tour dates near them (MOCK today — see lib/tour.ts).
 * Handles both states — dates present, and the intentional no-dates fallback —
 * so a real API (Ticketmaster → Bandsintown) is a drop-in later.
 */
export function TourModule({
  artist,
  albumArt,
}: {
  artist: string | null;
  albumArt: string | null;
}) {
  const [dates, setDates] = useState<TourDate[] | null>(null); // null = still checking

  useEffect(() => {
    let alive = true;
    getTourDates(artist).then((d) => alive && setDates(d));
    return () => {
      alive = false;
    };
  }, [artist]);

  const who = artist?.trim() || "your artist";
  const hasDates = (dates?.length ?? 0) > 0;

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div className="text-center text-[11px] font-bold uppercase tracking-eyebrow text-ember">
        {hasDates ? "They're playing near you" : "Near you"}
      </div>
      <h3 className="mx-auto mt-2 max-w-[520px] text-balance text-center font-serif text-[clamp(24px,3.4vw,34px)] font-medium leading-[1.08] tracking-[-0.01em] text-ink">
        {hasDates ? (
          <>
            It&rsquo;s not too late to go <em className="italic text-ember">together.</em>
          </>
        ) : (
          <>
            No shows near you yet — but <em className="italic text-ember">your people are.</em>
          </>
        )}
      </h3>

      <div className="mt-6 overflow-hidden rounded-[24px] shadow-[0_40px_90px_-40px_rgba(60,20,6,0.6)]">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,300px)_1fr]">
          {/* album art (real, from the Spotify pick) */}
          <div className="relative aspect-square w-full sm:aspect-auto">
            {albumArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={albumArt} alt={`${who} album art`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7A2E12] to-[#3A1A0C]">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FFC978" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
          </div>

          {/* right column: warm panel with dates or the fallback */}
          <div
            className="flex flex-col justify-center gap-5 px-7 py-8 sm:px-9"
            style={{
              background:
                "radial-gradient(120% 100% at 90% 0%,rgba(255,150,50,0.22),transparent 55%),linear-gradient(150deg,#2A1207 0%,#4A1F0D 55%,#63290F 100%)",
            }}
          >
            {dates === null ? (
              <div className="text-[14px] text-[#FFEEDE]/60">Checking shows near you…</div>
            ) : hasDates ? (
              <>
                <ul className="flex flex-col divide-y divide-white/10">
                  {dates.map((d) => (
                    <li key={d.id} className="flex items-baseline gap-4 py-[10px] first:pt-0">
                      <span className="w-[92px] flex-none font-serif text-[15px] font-medium text-[#FFC978]">{d.date}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium text-[#FFF3E2]">{d.venue}</span>
                        <span className="block truncate text-[13px] text-[#FFEEDE]/55">{d.city}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="text-[14px] leading-[1.5] text-[#FFEEDE]/80">
                    Get Ligo to find someone near you who loves{" "}
                    <span className="font-semibold text-[#FFF3E2]">{who}</span> too.
                  </p>
                  <a
                    href="#waitlist"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-[14px] font-semibold text-white shadow-cta transition-transform active:scale-[0.97]"
                  >
                    Find your +1
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </>
            ) : (
              // intentional fallback — no dates, still a warm invitation forward
              <>
                <p className="text-[16px] leading-[1.55] text-[#FFF3E2]">
                  No upcoming shows near you yet — but here&rsquo;s who shares your taste.
                </p>
                <p className="text-[14px] leading-[1.5] text-[#FFEEDE]/70">
                  We&rsquo;ll ping you the moment {who} announces a date near campus.
                </p>
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-flame px-6 py-3 text-[14px] font-semibold text-white shadow-cta transition-transform active:scale-[0.97]"
                >
                  See who shares your taste
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
