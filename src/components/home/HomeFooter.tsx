import Link from "next/link";

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const MENU: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Ligo News", "/news"],
  ["Become a Partner", "/partner"],
  ["FAQ", "/#faq"],
];

/** Charcoal footer (ported from the design export). */
export function HomeFooter() {
  return (
    <footer className="w-full border-t border-[#D7CCBC]/[0.08] bg-[#0D0A06] px-6 pb-[18px] pt-[34px] sm:px-10">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-x-10 gap-y-10 sm:grid-cols-[1.7fr_1fr_1fr]">
        {/* brand */}
        <div className="flex max-w-[360px] flex-col gap-[11px]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="Ligo" width={36} height={36} className="rounded-[9px]" />
            <span className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-[#EFE8DB]">Ligo</span>
          </div>
          <p className="font-serif text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-[#EFE8DB]">
            Connect through <span className="italic text-[#E8A24C]">music.</span>
          </p>
          <p className="text-[13px] leading-[1.5] text-[#EFE8DB]/[0.42]">
            Ligo is where college students who love the same music actually meet.
          </p>
        </div>

        {/* menu — one clean column */}
        <div className="flex flex-col gap-[11px]">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EFE8DB]/40">Menu</div>
          <nav className="flex flex-col gap-[9px]">
            {MENU.map(([label, href]) => (
              <Link key={label} href={href} className="text-[15px] text-[#EFE8DB]/[0.72] transition-colors hover:text-[#EFE8DB]">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* get ligo — column sits right, items left-aligned for a clean left edge */}
        <div className="flex flex-col items-start gap-[11px] sm:justify-self-end">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EFE8DB]/40">Get Ligo</div>
          <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="text-[15px] text-[#EFE8DB]/[0.82] transition-colors hover:text-[#EFE8DB]">
            Download on the App Store →
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1080px] flex-wrap justify-between gap-3 border-t border-[#D7CCBC]/[0.08] pt-3">
        <span className="font-mono text-[12px] text-[#EFE8DB]/35">meetligo.com · 2026</span>
        <span className="font-mono text-[12px] text-[#EFE8DB]/35">Georgetown · Howard</span>
      </div>
    </footer>
  );
}
