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
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: "linear-gradient(180deg,rgba(235,190,78,0.16),rgba(249,115,22,0.05) 60%,#FFF7E9)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">the team</div>
          <h2 className="mt-3 font-display text-section-title font-semibold text-ink">The people building it.</h2>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-x-10 sm:gap-y-12">
          {team.map((p) => (
            <PersonCard key={p.name} person={p} variant="team" />
          ))}
        </div>
      </div>
    </section>
  );
}
