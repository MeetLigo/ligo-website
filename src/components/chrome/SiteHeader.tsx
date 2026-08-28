"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawer } from "./DrawerProvider";

/**
 * THE site header — extracted verbatim from the homepage hero nav and shared by
 * every page so the layouts can never drift again. Structure, gutters, spacing,
 * type sizes and button styling are identical everywhere; the only per-page
 * difference is what sits behind it (home: hero photo, inner: dark background).
 *
 * Active link = warm amber, no box. Keyboard users get a visible focus ring
 * (focus-visible only — it does not appear on mere click/navigation).
 *
 * Below md, the inline nav links give way to a hamburger button that opens
 * the shared NavDrawer (mounted once in layout.tsx) — same destinations,
 * drawer styling.
 */
const NAV = [
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Partners", href: "/partner" },
];
const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";

const FOCUS =
  "rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-[#E8A24C]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#130F0A]";

export function SiteHeader() {
  const path = usePathname();
  const { openDrawer } = useDrawer();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <div className="relative z-20 flex items-center justify-between gap-5 px-6 pt-7 sm:px-10">
      <Link href="/" className={`flex flex-shrink-0 items-center gap-[12px] ${FOCUS}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width={34} height={34} className="block [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]" />
        <span className="font-serif text-[30px] font-medium italic leading-none tracking-[-0.01em] text-[#EFE8DB] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Ligo</span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex">
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`whitespace-nowrap font-serif text-[16px] font-medium [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] transition-colors ${FOCUS} ${
              isActive(l.href) ? "text-[#E8A24C]" : "text-[#EFE8DB]/[0.62] hover:text-[#EFE8DB]"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className={`inline-flex h-[40px] items-center gap-[7px] rounded-[9px] border border-white/25 bg-black px-[12px] text-white transition-colors hover:border-white/45 ${FOCUS}`}
        >
          <svg width="17" height="20" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          <span className="flex flex-col text-left leading-[1.1]">
            <span className="text-[9px]">Download on the</span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">App Store</span>
          </span>
        </a>
      </nav>
      <div className="flex items-center gap-2.5 md:hidden">
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className={`inline-flex h-[40px] items-center gap-[7px] rounded-[9px] border border-white/25 bg-black px-[12px] text-white transition-colors hover:border-white/45 ${FOCUS}`}
        >
          <svg width="17" height="20" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          <span className="flex flex-col text-left leading-[1.1]">
            <span className="text-[9px]">Download on the</span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">App Store</span>
          </span>
        </a>
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Open menu"
          className={`flex h-[38px] w-[38px] flex-shrink-0 flex-col justify-center gap-[5px] rounded-[10px] bg-white/10 px-[10px] backdrop-blur-sm transition-colors hover:bg-white/[0.16] ${FOCUS}`}
        >
          <span className="block h-[2px] w-[18px] rounded-[2px] bg-[#EFE8DB]" />
          <span className="block h-[2px] w-[18px] rounded-[2px] bg-[#EFE8DB]" />
          <span className="block h-[2px] w-[11px] rounded-[2px] bg-[#E8A24C]" />
        </button>
      </div>
    </div>
  );
}
