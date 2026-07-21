import { PolaroidTable } from "./PolaroidTable";

/** The "vibe" section below the hero — polaroids tossed onto a table, on a loop. */
export function HowItWorks() {
  return (
    <section className="relative bg-[#F6DFB4] px-[26px] pb-[76px] pt-20">
      {/* soft warm seam from the hero's warm-dark bottom into the honey section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[110px] bg-gradient-to-b from-[#3A1A0C]/18 to-transparent" />
      <div className="mx-auto max-w-[1040px]">
        <PolaroidTable />
      </div>
    </section>
  );
}
