"use client";

import Link from "next/link";
import Image from "next/image";
import { useDrawer } from "./DrawerProvider";

/**
 * Floats top-left over the page — no header bar, no background strip.
 * Ligo wordmark + logo, hamburger beside them.
 */
export function FloatingLogo() {
  const { openDrawer } = useDrawer();
  return (
    <header className="absolute left-0 right-0 top-0 z-[60] flex items-center gap-[14px] bg-transparent px-[26px] py-5">
      <Link href="/" className="flex items-center gap-[10px]">
        <Image
          src="/logo-mark.svg"
          alt="Ligo"
          width={34}
          height={34}
          priority
          className="block rounded-[9px] shadow-logo"
        />
        <span className="font-display text-[26px] font-semibold leading-none tracking-wordmark text-ink">
          ligo
        </span>
      </Link>
      <button
        onClick={openDrawer}
        aria-label="Open menu"
        className="ml-[2px] flex flex-col gap-1 rounded-xl p-[10px] transition-colors hover:bg-ink/5"
      >
        <span className="block h-[2px] w-[22px] rounded-[2px] bg-ink" />
        <span className="block h-[2px] w-[22px] rounded-[2px] bg-ink" />
        <span className="block h-[2px] w-[15px] rounded-[2px] bg-flame" />
      </button>
    </header>
  );
}
