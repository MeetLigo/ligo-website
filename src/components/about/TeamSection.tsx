import { team } from "@/lib/content";
import { PersonCard } from "./PersonCard";

/**
 * Section 2 — The Team. A full-width band with a subtle warm tonal shift so it
 * reads as its own chapter. Photo-forward cards in a centered, wrapping row →
 * single column on mobile.
 */
export function TeamSection() {
  return (
    <section
      id="team"
      className="px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-14"
      style={{ background: "linear-gradient(180deg,#130F0A,#1B150E 55%,#130F0A)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EDB264]">the team</div>
          <h2 className="mt-3 font-serif text-section-title font-semibold text-[#EFE8DB]">The people building it.</h2>
        </div>

        {/* five cards don't fit one row at the standard card size, so at 5+ the
            row is capped to wrap as a centered 3 + 2 — card size never changes */}
        <div className={`mx-auto mt-10 flex flex-wrap justify-center gap-6 sm:gap-8 ${team.length >= 5 ? "max-w-[840px]" : ""}`}>
          {team.map((p) => (
            <PersonCard key={p.name} person={p} variant="team" />
          ))}
        </div>
      </div>
    </section>
  );
}
