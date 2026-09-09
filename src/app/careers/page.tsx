import type { Metadata } from "next";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { roles, program, process } from "@/lib/careers";
import { RoleCard } from "@/components/careers/RoleCard";
import { SectionLabel } from "@/components/careers/SectionLabel";

export const metadata: Metadata = {
  title: "Careers · Ligo",
  description:
    "Ligo is hiring its Georgetown campus team. Three paid, part-time roles for current Georgetown students: partnerships, field growth, and content.",
};

const WIDTH = "max-w-[1300px]";

export default function CareersPage() {
  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow="careers"
        title={
          <>
            Careers at <Accent>Ligo.</Accent>
          </>
        }
        sub="Paid, part-time roles for current Georgetown students. Real work with a number you own."
        image="/hero/hero-friends-cool.jpg"
        position="center 40%"
        width={WIDTH}
      />

      {/* short intro + facts */}
      <section className={`mx-auto ${WIDTH} px-6 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-10`}>
        <SectionLabel>The Georgetown campus team</SectionLabel>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
          <p className="text-[17px] leading-[1.6] text-[#FAF6EF]/[0.8] sm:text-[19px]">
            We&apos;re a small team building the app that brings people together on campus, and Georgetown is where it
            starts. We&apos;re not hiring &ldquo;ambassadors&rdquo; to vaguely spread the word. We&apos;re hiring three
            people with three clear jobs, each with a number they own.
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-start border-t border-[#FAF6EF]/[0.14] pt-5 md:border-t-0 md:pt-1">
            {(
              [
                ["Campus", program.campus],
                ["Term", program.term],
                ["Pay", program.pay],
                ["Who", program.who],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-bold uppercase tracking-eyebrow text-[#F97316]">{k}</dt>
                <dd className="mt-1 text-[14px] leading-snug text-[#FAF6EF]/[0.85]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* open roles on cream */}
      <section id="roles" className="bg-cream text-ink">
        <div className={`mx-auto ${WIDTH} px-6 pb-20 pt-12 sm:px-10 sm:pb-28 sm:pt-16`}>
          <SectionLabel tone="cream">Open roles</SectionLabel>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-[clamp(32px,4.4vw,48px)] font-medium leading-[1.04] tracking-[-0.015em] text-ink">
              Pick the one that&apos;s <span className="italic text-[#EA580C]">already you.</span>
            </h2>
            <div className="text-[14px] text-ink/[0.55]">Reviewed on a rolling basis.</div>
          </div>
          <div className="mt-6 border-t border-ink/[0.14]">
            {roles.map((r, i) => (
              <RoleCard key={r.slug} role={r} index={i + 1} />
            ))}
          </div>

          {/* application process, right under the last job */}
          <div className="mt-12 sm:mt-14">
            <h3 className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">Application process</h3>
            <ol className="mt-4 flex max-w-[760px] flex-col gap-3">
              {process.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[28px_1fr] gap-3">
                  <span className="font-serif text-[13px] font-medium tabular-nums text-[#EA580C]">0{i + 1}</span>
                  <span className="text-[15.5px] leading-[1.6] text-ink/[0.82]">
                    <span className="font-semibold text-ink">{step.title}.</span> {step.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
