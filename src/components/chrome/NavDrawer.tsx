"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/lib/content";
import { useDrawer } from "./DrawerProvider";

/**
 * Left drawer overlaying the page, styled as a tracklist:
 * nav items are numbered "songs" with durations. Real routing via <Link>.
 */
export function NavDrawer() {
  const { open, closeDrawer } = useDrawer();
  const pathname = usePathname();

  return (
    <>
      {/* scrim */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      {/* drawer */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? "0%" : "-100%",
          // only cast the shadow while open, so it doesn't bleed onto the
          // page's left edge when the drawer is parked off-screen
          boxShadow: open ? "30px 0 60px -20px rgba(0,0,0,0.6)" : "0px 0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
        className="fixed bottom-0 left-0 top-0 z-[90] flex w-[min(380px,86vw)] flex-col bg-ink text-white"
        aria-hidden={!open}
      >
        {/* ambient glows */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(420px 300px at 12% 8%,rgba(249,115,22,0.16),transparent 70%),radial-gradient(420px 320px at 88% 96%,rgba(155,216,236,0.14),transparent 70%)",
          }}
        />

        {/* now playing header */}
        <div className="relative flex items-center justify-between px-6 pb-[18px] pt-[26px]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-eyebrow text-gold">
              now playing
            </div>
            <div className="mt-1 font-display text-[22px] font-semibold tracking-[-0.02em]">
              The Ligo Mixtape
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/[0.08] transition-colors hover:bg-white/[0.16]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* tracklist */}
        <nav className="relative flex flex-col px-3 py-[6px]">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDrawer}
                className="flex w-full items-center gap-4 rounded-[14px] px-3 py-[14px] text-left transition-colors hover:bg-white/[0.06]"
              >
                {active ? (
                  <span className="flex h-5 w-5 items-end justify-center gap-[2px]">
                    <i className="w-[3px] rounded-[2px] bg-flame animate-eq" />
                    <i className="w-[3px] rounded-[2px] bg-flame animate-eq [animation-delay:0.3s]" />
                    <i className="w-[3px] rounded-[2px] bg-flame animate-eq [animation-delay:0.6s]" />
                  </span>
                ) : (
                  <span className="w-5 text-center font-display text-sm font-semibold tabular-nums text-white/35">
                    {item.n}
                  </span>
                )}
                <span
                  className="flex-1 font-display text-[19px] font-semibold tracking-[-0.02em]"
                  style={{ color: active ? "#F5D783" : "#fff" }}
                >
                  {item.title}
                </span>
                <span className="text-xs tabular-nums text-white/35">{item.dur}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* footer: live-on + store buttons */}
        <div className="relative border-t border-white/[0.08] px-6 pb-[26px] pt-[18px]">
          <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40">
            live on · georgetown · howard
          </div>
          <div className="flex gap-[10px]">
            <a
              href="#"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white p-[11px] text-[13px] font-semibold text-ink"
            >
              App Store
            </a>
            <a
              href="#"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 p-[11px] text-[13px] font-semibold text-white"
            >
              Google Play
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
