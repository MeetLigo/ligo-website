import Image from "next/image";
import type { Person } from "@/lib/content";

/**
 * A person's card. Consistent treatment (object-cover + fixed aspect) so
 * mismatched source photos still render as a clean, uniform row.
 * - team: rectangular portrait card
 * - advisor: smaller circular avatar (lighter, reads as credibility)
 */
export function PersonCard({ person, variant = "team" }: { person: Person; variant?: "team" | "advisor" }) {
  if (variant === "advisor") {
    return (
      <div className="flex w-[150px] flex-col items-center text-center">
        <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full ring-1 ring-ink/10">
          <Image src={person.img} alt={person.name} fill sizes="84px" className="object-cover" />
        </div>
        <div className="mt-3 font-display text-[15px] font-semibold text-ink">{person.name}</div>
        <div className="mt-[2px] text-[12px] leading-tight text-ink/50">{person.role}</div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[210px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-photo-bg shadow-card">
        <Image
          src={person.img}
          alt={person.name}
          fill
          sizes="(max-width: 640px) 90vw, 210px"
          className="object-cover"
        />
      </div>
      <div className="mt-[14px]">
        <div className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">{person.name}</div>
        <div className="mt-[2px] text-[13px] leading-snug text-ink/55">{person.role}</div>
      </div>
    </div>
  );
}
