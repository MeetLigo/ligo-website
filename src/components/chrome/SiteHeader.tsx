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
      <Link href="/" className={`flex flex-shrink-0 items-center gap-[11px] ${FOCUS}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="Ligo" width={40} height={40} className="block rounded-[10px] [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]" />
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[24px] font-semibold tracking-[-0.01em] text-[#EFE8DB] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Ligo</span>
          <span className="mt-1 hidden text-[11px] font-medium text-[#D7CCBC] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] sm:block">Connect through music</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex">
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`whitespace-nowrap text-[14px] font-semibold [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] transition-colors ${FOCUS} ${
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
          className={`whitespace-nowrap text-[14px] font-semibold text-[#E8A24C] [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] transition-colors hover:text-[#F5D783] ${FOCUS}`}
        >
          Get the app →
        </a>
      </nav>
      <div className="flex items-center gap-2.5 md:hidden">
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className={`whitespace-nowrap text-[13px] font-semibold text-[#E8A24C] ${FOCUS}`}
        >
          Get the app
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
