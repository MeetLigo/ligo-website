import type { Metadata } from "next";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { roles, program } from "@/lib/careers";
import { RoleCard } from "@/components/careers/RoleCard";
import { ProcessSteps } from "@/components/careers/ProcessSteps";
import { PageNav } from "@/components/careers/PageNav";

export const metadata: Metadata = {
  title: "Careers · Ligo",
  description:
    "Ligo is hiring its Georgetown campus team. Paid, part-time roles for current Georgetown students: partnerships, field growth, and content.",
};

/** same shell and rail as a job page, so the two read as one system */
const SHELL = "mx-auto w-full max-w-[1300px] px-6 sm:px-10";
const GRID = "grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16";
const PROSE = "max-w-[880px]";

const SECTIONS = [
  { id: "team", label: "The campus team" },
  { id: "roles", label: "Open roles" },
  { id: "process", label: "Application process" },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">{children}</h2>;
}

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

      <div className="bg-cream text-ink">
        <div className={`${SHELL} ${GRID} pb-24 pt-10 sm:pt-12`}>
          <PageNav sections={SECTIONS} />

          <div className={PROSE}>
            {/* who we are */}
            <section id="team" className="scroll-mt-10">
              <Heading>The Georgetown campus team</Heading>
              <p className="mt-4 max-w-[680px] text-[16.5px] leading-[1.6] text-ink/[0.8] sm:text-[18px]">
                We&apos;re a small team building the app that brings people together on campus, and Georgetown is where
                it starts. We&apos;re not hiring &ldquo;ambassadors&rdquo; to vaguely spread the word. We&apos;re hiring
                three people with three clear jobs, each with a number they own.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
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
                    <dd className="mt-1 text-[14px] leading-snug text-ink/[0.82]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* open roles */}
            <section id="roles" className="scroll-mt-10 pt-14 sm:pt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Heading>
                  Open roles
                </Heading>
                <div className="text-[14px] text-ink/[0.55]">Reviewed on a rolling basis.</div>
              </div>
              <div className="mt-4 border-t border-ink/[0.14]">
                {roles.map((r) => (
                  <RoleCard key={r.slug} role={r} />
                ))}
              </div>
            </section>

            {/* how hiring works */}
            <section id="process" className="scroll-mt-10 pt-14 sm:pt-16">
              <Heading>Application process</Heading>
              <ProcessSteps />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
