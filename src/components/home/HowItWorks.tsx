import { PolaroidTable } from "./PolaroidTable";

/** The "vibe" section below the hero — polaroids tossed onto a table, on a loop. */
export function HowItWorks() {
  return (
    <section className="relative bg-[#F6DFB4] px-[26px] pb-[76px] pt-20">
      {/* the hero's bottom already ramps into this honey, so the seam is a true fade */}
      <div className="mx-auto max-w-[1180px]">
        <PolaroidTable />
      </div>
    </section>
  );
}
