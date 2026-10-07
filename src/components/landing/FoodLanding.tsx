"use client";

import Link from "next/link";
import { PlayIcon } from "@/components/chrome/StoreIcons";

/**
 * meetligo.com/food, the page the food flyer points at (Mekhi, Oct 7: "find
 * events with free food on ligo, similar idea as what we have for the
 * website"). Same build as the homepage redesign on the hero-carousel branch
 * (its pieces copied in so this page ships on its own): the header (logo
 * left, nav right), a centred two-line headline with the second line muted, one line of copy, then the
 * grainy orange panel, here holding a fan of real food-event flyers from the
 * launch video's content pull, each tagged with what it served. Unlike the
 * homepage hero it keeps the store buttons (App Store and Google Play): people
 * arrive from a QR code on a phone, so the next step has to be right there.
 *
 * The page ends with the panel (Mekhi, Oct 7), then the legal links.
 */

const CONTACT = "mailto:support@meetligo.com";

const TABS: [string, string][] = [
  ["About", "/about"],
  ["News", "/news"],
  ["Careers", "/careers"],
];

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.bardsai.ligo&hl=en_US";

// Real flyers with the food each one listed (launch-video content.json,
// foodNote), fanned left to right; the middle one is on top. Phones show the
// middle three, a little wider apart, so the cards and tags stay readable.
const FLYERS: { src: string; title: string; tag: string; r: number; x: number; y: number; z: number }[] = [
  { src: "gsp-transfer-dinner", title: "GSP Transfer Dinner", tag: "Dinner", r: -12, x: -140, y: 26, z: 1 },
  { src: "presidents-tea", title: "President's Tea", tag: "Free refreshments", r: -6, x: -72, y: 8, z: 2 },
  { src: "donuts-with-the-deans", title: "Donuts With the Deans", tag: "Donuts", r: 0, x: 0, y: 0, z: 3 },
  { src: "gspicnic", title: "GSPicnic", tag: "Free lunch", r: 6, x: 72, y: 8, z: 2 },
  { src: "pride-pumpkin-painting", title: "Pumpkin Painting October Social", tag: "Treats", r: 12, x: 140, y: 26, z: 1 },
];

// Film grain for the hero panel (the RoarOS panel's speckle), as an SVG noise tile.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.92 0 0 0 0 0.35 0 0 0 0 0.05 0 0 0 1.1 -0.35'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// The fade-and-rise on load, in CSS (not JS), so the page shows even before
// (or without) hydration, and reduced motion simply skips it.
const RISE_CSS = `
  @keyframes ligo-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  .ligo-rise { animation: ligo-rise .8s cubic-bezier(.2,.7,.2,1) both; }
  @media (prefers-reduced-motion: reduce) { .ligo-rise { animation: none; } }
`;

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center ${small ? "gap-2" : "gap-2.5"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.svg" alt="" className={small ? "h-7 w-7" : "h-9 w-9"} />
      <span className={`font-serif italic leading-none tracking-[-0.02em] text-[#EA580C] ${small ? "text-[28px]" : "text-[36px]"}`}>Ligo</span>
    </div>
  );
}

/** The header (Mekhi, Oct 7: the centred tab bar gone, the Ligo logo top
 *  left, the nav top right). Shared with the other landing pages. */
function SiteTabs() {
  return (
    <header className="mx-auto flex max-w-[1180px] items-center justify-between px-2 pt-5 md:px-0 md:pt-7">
      <Link href="/" aria-label="Ligo home" className="rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]">
        <Wordmark small />
      </Link>
      <nav aria-label="Site">
        <ul className="flex items-center gap-1 sm:gap-2">
          {TABS.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-full px-3 py-2 text-[15px] font-medium text-[#171717]/70 transition-colors hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] sm:px-4"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Terms, Privacy and Contact along the bottom. */
function SiteFooter() {
  return (
    <footer className="flex justify-center gap-8 pb-6 pt-2 text-[14px] md:gap-10 md:pb-7 md:text-[15px]">
      <Link href="/terms" className="text-[#5C5C5C] hover:text-[#171717]">Terms of Service</Link>
      <Link href="/privacy" className="text-[#5C5C5C] hover:text-[#171717]">Privacy Policy</Link>
      <a href={CONTACT} className="text-[#5C5C5C] hover:text-[#171717]">Contact Us</a>
    </footer>
  );
}

function AppleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.22} viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** The two store buttons side by side (Mekhi, Oct 7: "add the android
 *  one"): App Store in orange, Google Play in white. Each links straight to
 *  its store, so the choice is the visitor's. */
function GetLigo() {
  const base =
    "inline-flex h-[56px] items-center justify-center gap-2 whitespace-nowrap rounded-[16px] px-3 text-[16px] font-semibold transition-[filter,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 sm:text-[17px]";
  return (
    <div className="mx-auto grid w-full max-w-[380px] grid-cols-2 gap-3">
      <a
        href={APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-[#EA580C] text-white shadow-[0_14px_30px_-8px_rgba(234,88,12,0.55)] hover:brightness-105`}
      >
        <AppleMark />
        App Store
      </a>
      <a
        href={GOOGLE_PLAY}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-white text-[#171717] shadow-[0_1px_2px_rgba(23,23,23,0.06),0_10px_24px_-10px_rgba(23,23,23,0.25)] ring-1 ring-[rgba(23,23,23,0.1)] hover:brightness-[0.98]`}
      >
        <PlayIcon size={20} />
        Google Play
      </a>
    </div>
  );
}

/** The flyers fanned like a hand of cards, each bobbing on its own loop with
 *  its food tag pinned to the bottom. Positions are % of a card's own width
 *  from the centre, so the fan scales with the panel. */
function FlyerFan() {
  return (
    <div className="relative mx-auto h-[260px] w-full max-w-[760px] sm:h-[400px] md:h-[500px] md:max-w-[940px]" role="list" aria-label="Food events on Ligo">
      <style>{`
        @keyframes ligo-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .ligo-bob { animation: ligo-bob 6s ease-in-out infinite; }
        .ligo-fan-card { --fan-x: var(--xs); }
        @media (min-width: 640px) { .ligo-fan-card { --fan-x: var(--x); } }
        @media (prefers-reduced-motion: reduce) { .ligo-bob { animation: none; } }
      `}</style>
      {FLYERS.map((f, i) => (
        <div
          key={f.src}
          role="listitem"
          className={`ligo-fan-card absolute left-1/2 top-1/2 w-[32%] sm:w-[22%] ${f.z === 1 ? "hidden sm:block" : ""}`}
          style={
            {
              zIndex: f.z,
              "--x": `${f.x}%`,
              "--xs": `${f.x * 1.25}%`,
              transform: `translate(calc(-50% + var(--fan-x)), calc(-50% + ${f.y}px)) rotate(${f.r}deg)`,
            } as React.CSSProperties
          }
        >
          <div className="ligo-bob" style={{ animationDelay: `${-i * 1.1}s`, animationDuration: `${5.5 + (i % 3)}s` }}>
            <div className="relative overflow-hidden rounded-[12px] bg-white p-1.5 shadow-[0_2px_6px_rgba(23,23,23,0.12),0_24px_48px_-16px_rgba(124,45,18,0.5)] ring-1 ring-black/5 sm:p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/food/${f.src}.webp`} alt={f.title} className="block aspect-[4/5] w-full rounded-[8px] object-cover" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#171717] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_6px_14px_-4px_rgba(23,23,23,0.45)] sm:text-[12px]">
              {f.tag}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FoodLanding() {
  return (
    <main className="bg-[#FCF8F3]">
      <style>{RISE_CSS}</style>

      <section className="relative px-4 pb-6 md:px-10">
        <SiteTabs />

        <div className="ligo-rise mx-auto mt-12 flex max-w-[900px] flex-col items-center px-2 text-center md:mt-16">
          <h1 className="font-serif text-[40px] font-normal leading-[1.06] tracking-[-0.035em] text-[#171717] sm:text-[52px] md:text-[64px]">
            Find free food<span className="text-[#F97316]">.</span>
            <br />
            <span className="text-[#A39A92]">It&rsquo;s all on Ligo.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-balance text-[17px] leading-[1.6] text-[#5C5C5C] md:text-[19px]">
            Club dinners, donuts, picnics, tea. Every campus event serving food, in one tab.
          </p>
          <div className="mt-8">
            <GetLigo />
          </div>
        </div>

        <div className="ligo-rise relative mx-auto mt-12 max-w-[1180px] overflow-hidden rounded-[28px] border border-[#171717]/[0.08] bg-[#FFF4EA] px-2 py-10 [animation-delay:.15s] sm:py-14 md:mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 70% at 0% 0%, rgba(249,115,22,0.55), rgba(249,115,22,0) 70%), radial-gradient(55% 65% at 100% 100%, rgba(234,88,12,0.6), rgba(234,88,12,0) 70%), radial-gradient(40% 40% at 100% 0%, rgba(253,186,116,0.35), rgba(253,186,116,0) 70%)",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
          <div className="relative">
            <FlyerFan />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
