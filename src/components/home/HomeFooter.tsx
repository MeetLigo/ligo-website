import Link from "next/link";
import { AppleIcon, PlayIcon } from "@/components/chrome/StoreIcons";

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.bardsai.ligo&hl=en_US";
const MENU: [string, string][] = [
  ["About", "/about"],
  ["Ligo News", "/news"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Community Guidelines", "/community-guidelines"],
];

/** Charcoal footer (ported from the design export). */
export function HomeFooter() {
  return (
    <footer className="w-full border-t border-[#D7CCBC]/[0.08] bg-[#101010] px-6 pb-[18px] pt-[34px] sm:px-10">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-x-10 gap-y-10 sm:grid-cols-[1.7fr_1fr_1fr]">
        {/* brand */}
        <div className="flex max-w-[360px] flex-col gap-[11px]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="Ligo" width={30} height={30} />
            <span className="font-serif text-[26px] font-medium italic tracking-[-0.01em] text-[#FAF6EF]">Ligo</span>
          </div>
          <p className="font-serif text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-[#FAF6EF]">
            The first <span className="italic text-[#F97316]">campus connector app.</span>
          </p>
          <p className="text-[13px] leading-[1.5] text-[#FAF6EF]/[0.42]">
            Every club, every event, and everyone going. One app.
          </p>
          <p className="font-mono text-[12px] text-[#FAF6EF]/35">Launched at Georgetown. Expanding across the DMV soon.</p>
        </div>

        {/* menu — one clean column */}
        <div className="flex flex-col gap-[11px]">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#FAF6EF]/40">Menu</div>
          <nav className="flex flex-col gap-[9px]">
            {MENU.map(([label, href]) => (
              <Link key={label} href={href} className="text-[15px] text-[#FAF6EF]/[0.72] transition-colors hover:text-[#FAF6EF]">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* get ligo — column sits right, items left-aligned for a clean left edge */}
        <div className="flex flex-col items-start gap-[11px] sm:justify-self-end">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#FAF6EF]/40">Get Ligo</div>
          <a
            href={APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            className="inline-flex h-[46px] w-[156px] items-center gap-[9px] rounded-[10px] border border-white/25 bg-black px-[14px] text-white transition-colors hover:border-white/45"
          >
            <AppleIcon size={22} fill="#FFFFFF" />
            <span className="flex flex-col text-left leading-[1.15]">
              <span className="text-[10px]">Download on the</span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">App Store</span>
            </span>
          </a>
          <a
            href={GOOGLE_PLAY}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            className="inline-flex h-[46px] w-[156px] items-center gap-[9px] rounded-[10px] border border-white/25 bg-black px-[14px] text-white transition-colors hover:border-white/45"
          >
            <PlayIcon size={20} />
            <span className="flex flex-col text-left leading-[1.15]">
              <span className="text-[10px] uppercase tracking-[0.04em]">Get it on</span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Google Play</span>
            </span>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1080px] flex-wrap justify-between gap-3 border-t border-[#D7CCBC]/[0.08] pt-3">
        <span className="font-mono text-[12px] text-[#FAF6EF]/35">meetligo.com · 2026</span>
      </div>
    </footer>
  );
}
