"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * THE site header — extracted verbatim from the homepage hero nav and shared by
 * every page so the layouts can never drift again. Structure, gutters, spacing,
 * type sizes and button styling are identical everywhere; the only per-page
 * difference is what sits behind it (home: hero photo, inner: dark background).
 *
 * Active link = warm amber, no box. Keyboard users get a visible focus ring
 * (focus-visible only — it does not appear on mere click/navigation).
 */
const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Partners", href: "/partner" },
];
const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";

const FOCUS =
  "rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-[#E8A24C]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#130F0A]";

export function SiteHeader() {
  const path = usePathname();
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
          className={`whitespace-nowrap rounded-[11px] bg-[#E8A24C] px-[15px] py-[9px] text-[13.5px] font-semibold text-[#241603] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] ${FOCUS}`}
        >
          Get the app →
        </a>
      </nav>
      <a
        href={APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        className={`whitespace-nowrap rounded-[11px] bg-[#E8A24C] px-[13px] py-2 text-[13px] font-semibold text-[#241603] md:hidden ${FOCUS}`}
      >
        Get the app
      </a>
    </div>
  );
}
