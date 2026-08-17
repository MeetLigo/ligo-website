import type { ReactNode } from "react";

/**
 * Shared layout for the three legal documents (Terms, Privacy, Community
 * Guidelines) - deliberately plain, no photo hero. Other pages use PageHero's
 * photo band, but a legal document reads better as text-first; forcing a
 * decorative hero in here would work against the actual job of this page.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="animate-riseIn">
      <div className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-40 sm:px-10">
        <h1 className="font-serif text-[clamp(30px,4.5vw,44px)] font-medium leading-[1.05] tracking-[-0.02em] text-[#EFE8DB]">
          {title}
        </h1>
        <p className="mt-3 text-[14px] text-[#EFE8DB]/60">Last updated {updated}</p>
        <div className="legal-prose mt-10 text-[16px] leading-[1.7] text-[#EFE8DB]/[0.82]">{children}</div>
      </div>
    </main>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 font-serif text-[22px] font-medium leading-[1.2] text-[#EFE8DB] first:mt-0">{children}</h2>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mt-4">{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>;
}
