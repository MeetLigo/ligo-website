import Image from "next/image";
import type { Person } from "@/lib/content";

/**
 * A person's card — one treatment for team AND advisors so mismatched source
 * photos (candids, corporate headshots, white/navy backdrops) read as one set:
 * - strict 3/4 crop (aspect-ratio + object-cover, never stretched)
 * - unifying warm/desaturated filter that eases back to full colour on hover
 * - bottom dark gradient carrying the name (serif) + role (letterspaced amber)
 * - 1px low-opacity warm border + gentle lift on hover, matching the news cards
 * The advisor variant is simply a smaller card.
 */
export function PersonCard({ person, variant = "team" }: { person: Person; variant?: "team" | "advisor" }) {
  const team = variant === "team";
  return (
    <div className={team ? "w-full sm:w-[230px]" : "w-[150px] sm:w-[168px]"}>
      <div className="group relative aspect-[3/4] overflow-hidden rounded-[18px] border border-[#E8A24C]/[0.13] bg-[#1E1710] transition-all duration-300 hover:-translate-y-[3px] hover:border-[#E8A24C]/[0.26]">
        <Image
          src={person.img}
          alt={person.name}
          fill
          sizes={team ? "(max-width: 640px) 90vw, 230px" : "168px"}
          className="object-cover transition-[filter] duration-300 [filter:grayscale(35%)_sepia(12%)_contrast(1.05)] group-hover:[filter:grayscale(0%)_sepia(0%)_contrast(1)]"
        />
        {/* bottom gradient the caption sits on */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[64%]" style={{ background: "linear-gradient(180deg,transparent,rgba(10,13,16,0.4) 42%,rgba(10,13,16,0.9))" }} />
        <div className={`absolute inset-x-0 bottom-0 flex flex-col ${team ? "gap-[4px] p-4" : "gap-[3px] p-3"}`}>
          <div className={`font-serif font-semibold leading-tight text-[#EFE8DB] ${team ? "text-[19px]" : "text-[14px]"}`}>{person.name}</div>
          <div className={`font-bold uppercase leading-snug tracking-[0.13em] text-[#EDB264] ${team ? "text-[10.5px]" : "text-[8.5px]"}`}>{person.role}</div>
        </div>
      </div>
    </div>
  );
}
