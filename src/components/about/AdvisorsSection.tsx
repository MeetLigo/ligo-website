import { advisors } from "@/lib/content";
import { PersonCard } from "./PersonCard";

/**
 * Section 3 — Advisors & Backers. The lightest band: plain cream, compact
 * circular avatars. Reads as credibility without competing with the team.
 */
export function AdvisorsSection() {
  if (advisors.length === 0) return null;
  return (
    <section className="border-t border-[#D7CCBC]/[0.08] bg-[#130F0A] px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-14">
      <div className="mx-auto max-w-[1100px] text-center">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EDB264]">advisors &amp; backers</div>
        <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-[-0.01em] text-[#EFE8DB]">
          In our corner.
        </h2>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-6 sm:gap-8">
          {advisors.map((p) => (
            <PersonCard key={p.name} person={p} variant="advisor" />
          ))}
        </div>
      </div>
    </section>
  );
}
