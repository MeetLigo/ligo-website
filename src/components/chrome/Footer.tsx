import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/lib/content";
import { AppleIcon, PlayIcon } from "./StoreIcons";

/** Dark footer, repeated on every page. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-[26px] pb-[34px] pt-[56px] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(500px 320px at 88% 4%,rgba(245,215,131,0.14),transparent 70%),radial-gradient(500px 340px at 4% 98%,rgba(155,216,236,0.12),transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1080px]">
        <div className="flex flex-wrap items-start justify-between gap-9">
          <div className="max-w-[360px]">
            <div className="flex items-center gap-[10px]">
              <Image src="/logo-mark.svg" alt="" width={32} height={32} className="rounded-[9px]" />
              <span className="font-display text-2xl font-semibold tracking-wordmark">ligo</span>
            </div>
            <div className="mt-[18px] text-balance font-display text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-gold">
              Events bring the room. Music tells you who.
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.14em] text-white/40">
              live on · georgetown · howard
            </div>
          </div>

          <div className="flex flex-wrap gap-14">
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-bold uppercase tracking-eyebrow text-white/35">menu</div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-left text-[15px] text-white/80 transition-colors hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-bold uppercase tracking-eyebrow text-white/35">get the app</div>
              <a
                href="https://apps.apple.com/us/app/ligo/id6753926105"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[9px] rounded-xl bg-white px-4 py-[11px] text-[13px] font-semibold text-ink"
              >
                <AppleIcon size={16} /> App Store
              </a>
              <a href="#" className="flex items-center gap-[9px] rounded-xl bg-white/10 px-4 py-[11px] text-[13px] font-semibold text-white">
                <PlayIcon size={15} /> Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/40">
          <span>© 2026 Ligo · meetligo.com</span>
          <span>Not a dating app. Not an events calendar. Not a music player.</span>
        </div>
      </div>
    </footer>
  );
}
