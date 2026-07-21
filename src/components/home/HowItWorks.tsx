import { PolaroidTable } from "./PolaroidTable";

/** The "vibe" section below the hero — polaroids tossed onto a table, on a loop. */
export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[76px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1040px]">
        <PolaroidTable />
      </div>
    </section>
  );
}
