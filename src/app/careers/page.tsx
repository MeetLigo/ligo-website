import type { Metadata } from "next";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { roles, program } from "@/lib/careers";
import { RoleCard } from "@/components/careers/RoleCard";
import { ProcessSteps } from "@/components/careers/ProcessSteps";
import { SectionLabel } from "@/components/careers/SectionLabel";

export const metadata: Metadata = {
  title: "Careers · Ligo",
  description:
    "Ligo is hiring its Georgetown campus team. Paid, part-time roles for current Georgetown students: partnerships, field growth, and content.",
};

const SHELL = "mx-auto w-full max-w-[1300px] px-6 sm:px-10";

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
        image="/hero/slide-1.jpg"
        position="center 62%"
        width="max-w-[1300px]"
        fadeTo="#FAF6EF"
        fadeHeight="h-[14px]"
      />

      {/* everything under the hero is one cream page, same as a job page */}
      <div className="bg-cream text-ink">
        <div className={SHELL}>
          {/* who we are, first thing under the hero */}
          <section className="pt-10 sm:pt-12">
            <h2 className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">
              The Georgetown campus team
            </h2>
            <div className="mt-5 grid gap-7 md:grid-cols-[1.15fr_1fr] md:gap-14">
              <p className="max-w-[640px] text-[17px] leading-[1.6] text-ink/[0.8] sm:text-[19px]">
                We&apos;re a small team building the app that brings people together on campus, and Georgetown is where
                it starts. We&apos;re not hiring &ldquo;ambassadors&rdquo; to vaguely spread the word. We&apos;re hiring
                three people with three clear jobs, each with a number they own.
              </p>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-5 self-start">
                {(
                  [
                    ["Campus", program.campus],
                    ["Term", program.term],
                    ["Pay", program.pay],
                    ["Who", program.who],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EA580C]">{k}</dt>
                    <dd className="mt-1 text-[14.5px] leading-snug text-ink/[0.82]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* open roles */}
          <section id="roles" className="scroll-mt-6 pt-12 sm:pt-14">
            <SectionLabel tone="cream">Open roles</SectionLabel>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-serif text-[clamp(32px,4.4vw,48px)] font-medium leading-[1.04] tracking-[-0.015em] text-ink">
                Pick the one that&apos;s <span className="italic text-[#EA580C]">already you.</span>
              </h2>
              <div className="text-[14px] text-ink/[0.55]">Reviewed on a rolling basis.</div>
            </div>
            <div className="mt-5 border-t border-ink/[0.14]">
              {roles.map((r, i) => (
                <RoleCard key={r.slug} role={r} index={i + 1} />
              ))}
            </div>
          </section>

          {/* how hiring works */}
          <section className="pb-20 pt-12 sm:pb-24 sm:pt-14">
            <h2 className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">
              Application process
            </h2>
            <ProcessSteps />
          </section>
        </div>
      </div>
    </main>
  );
}
