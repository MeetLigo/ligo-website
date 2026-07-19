import { advisors } from "@/lib/content";
import { PersonCard } from "./PersonCard";

/**
 * Section 3 — Advisors & Backers. The lightest band: plain cream, compact
 * circular avatars. Reads as credibility without competing with the team.
 */
export function AdvisorsSection() {
  if (advisors.length === 0) return null;
  return (
    <section className="border-t border-ink/[0.06] bg-cream px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1100px] text-center">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">advisors &amp; backers</div>
        <h2 className="mt-3 font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">
          In our corner.
        </h2>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
          {advisors.map((p) => (
            <PersonCard key={p.name} person={p} variant="advisor" />
          ))}
        </div>
      </div>
    </section>
  );
}
