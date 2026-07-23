import Link from "next/link";

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const MENU: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Ligo News", "/news"],
  ["Become a Partner", "/partner"],
  ["FAQ", "/faq"],
  ["Playground", "/"],
];

/** Charcoal footer (ported from the design export). */
export function HomeFooter() {
  return (
    <footer className="w-full border-t border-[#CBD3DB]/[0.08] bg-[#080A0D] px-6 pb-[18px] pt-[34px] sm:px-10">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-x-10 gap-y-10 sm:grid-cols-[1.7fr_1fr_1fr]">
        {/* brand */}
        <div className="flex max-w-[360px] flex-col gap-[11px]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="Ligo" width={36} height={36} className="rounded-[9px]" />
            <span className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-[#ECEBE6]">Ligo</span>
          </div>
          <p className="font-serif text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-[#ECEBE6]">
            Connect through <span className="italic text-[#E8A24C]">music.</span>
          </p>
          <p className="text-[13px] leading-[1.5] text-[#ECEBE6]/[0.42]">
            Ligo is where college students who love the same music actually meet.
          </p>
        </div>

        {/* menu — one clean column */}
        <div className="flex flex-col gap-[11px]">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#ECEBE6]/40">Menu</div>
          <nav className="flex flex-col gap-[9px]">
            {MENU.map(([label, href]) => (
              <Link key={label} href={href} className="text-[15px] text-[#ECEBE6]/[0.72] transition-colors hover:text-[#ECEBE6]">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* get ligo — column sits right, items left-aligned for a clean left edge */}
        <div className="flex flex-col items-start gap-[11px] sm:justify-self-end">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#ECEBE6]/40">Get Ligo</div>
          <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="text-[15px] text-[#ECEBE6]/[0.82] transition-colors hover:text-[#ECEBE6]">
            Download on the App Store →
          </a>
          {/* Google Play: placeholder until the Play Store link exists — not a live link yet. */}
          <span className="border-b border-dashed border-[#E8A24C]/50 pb-[1px] text-[15px] text-[#ECEBE6]/[0.72]">Get it on Google Play →</span>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1080px] flex-wrap justify-between gap-3 border-t border-[#CBD3DB]/[0.08] pt-3">
        <span className="font-mono text-[12px] text-[#ECEBE6]/35">meetligo.com · 2026</span>
        <span className="font-mono text-[12px] text-[#ECEBE6]/35">Georgetown · Howard</span>
      </div>
    </footer>
  );
}
