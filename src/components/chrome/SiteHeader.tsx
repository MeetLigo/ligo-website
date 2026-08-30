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
];

const FOCUS =
  "rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]";

export function SiteHeader() {
  const path = usePathname();
  const { openDrawer } = useDrawer();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <div className="relative z-20 flex items-center justify-between gap-5 px-6 pt-7 sm:px-10">
      <Link href="/" className={`flex flex-shrink-0 items-center gap-[12px] ${FOCUS}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width={34} height={34} className="block [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]" />
        <span className="font-serif text-[30px] font-medium italic leading-none tracking-[-0.01em] text-[#FAF6EF] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Ligo</span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex">
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`whitespace-nowrap font-serif text-[16px] font-medium [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] transition-colors ${FOCUS} ${
              isActive(l.href) ? "text-[#F97316]" : "text-[#FAF6EF]/[0.62] hover:text-[#FAF6EF]"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5 md:hidden">
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Open menu"
          className={`flex h-[38px] w-[38px] flex-shrink-0 flex-col justify-center gap-[5px] rounded-[10px] bg-white/10 px-[10px] backdrop-blur-sm transition-colors hover:bg-white/[0.16] ${FOCUS}`}
        >
          <span className="block h-[2px] w-[18px] rounded-[2px] bg-[#FAF6EF]" />
          <span className="block h-[2px] w-[18px] rounded-[2px] bg-[#FAF6EF]" />
          <span className="block h-[2px] w-[11px] rounded-[2px] bg-[#F97316]" />
        </button>
      </div>
    </div>
  );
}
