import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/chrome/PageHero";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { RoleDetail } from "@/components/careers/RoleDetail";
import { roles, getRole, program, process } from "@/lib/careers";

const HERO_WIDTH = "max-w-[1000px]";
const COLUMN = "mx-auto w-full max-w-[820px] px-6 sm:px-10";
const CREAM = "#FAF6EF";

export function generateStaticParams() {
  return roles.map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: slug } = await params;
  const role = getRole(slug);
  if (!role) return { title: "Apply · Ligo Careers" };
  return {
    title: `${role.title} · Ligo Careers`,
    description: `${role.tagline} ${role.openings}, part-time, at Georgetown.`,
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-[21px] font-medium leading-tight tracking-[-0.01em] text-ink">{children}</h2>;
}

/**
 * One page per open role: the posting and the application, one after another,
 * on a single cream page. Modeled on how a job board reads, in our type.
 */
export default async function ApplyRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow={`ligo careers · ${role.lane}`}
        title={role.title}
        sub={role.tagline}
        image="/hero/slide-2.jpg"
        position="center 30%"
        width={HERO_WIDTH}
        fadeTo={CREAM}
        action={
          <a
            href="#apply"
            className="inline-flex flex-none items-center gap-[9px] rounded-full bg-[#F97316] px-7 py-[13px] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#241603] shadow-cta transition-all hover:bg-[#FB923C] hover:text-[#241603] active:scale-[0.97]"
          >
            Apply
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13M6 13l6 6 6-6" /></svg>
          </a>
        }
      />

      {/* everything below the hero is one cream page */}
      <div className="bg-cream text-ink">
        <article className={`${COLUMN} pt-12 sm:pt-14`}>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/[0.5]">
            <span>{program.campus}</span>
            <span>{role.openings}</span>
            <span>{role.hours}</span>
            <span>{program.term}</span>
          </div>

          <p className="mt-6 font-serif text-[20px] font-medium leading-[1.4] text-ink sm:text-[23px]">{role.summary}</p>

          <div className="mt-9 border-t border-ink/[0.1] pt-9">
            <RoleDetail role={role} />
          </div>

          <div className="mt-9 border-t border-ink/[0.1] pt-9">
            <SectionHeading>The details</SectionHeading>
            <dl className="mt-3 flex flex-col divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
              {(
                [
                  ["Campus", `${program.campus}, ${program.where}`],
                  ["Openings", role.openings],
                  ["Commitment", `${role.hours}, ${program.term}`],
                  ["Pay", program.pay],
                  ["Who can apply", program.who],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-[10px]">
                  <dt className="text-[14px] text-ink/[0.55]">{k}</dt>
                  <dd className="text-[15.5px] leading-[1.5] text-ink/[0.85]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-9 border-t border-ink/[0.1] pt-9">
            <SectionHeading>How hiring works</SectionHeading>
            <ol className="mt-3 flex flex-col gap-3">
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
        </article>

        {/* the application, straight after the posting */}
        <section id="apply" className={`${COLUMN} scroll-mt-6 pt-14`}>
          <div className="border-t border-ink/[0.14] pt-10">
            <h2 className="font-serif text-[clamp(28px,3.4vw,36px)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
              Apply for this role
            </h2>
            <p className="mt-2 text-[15px] text-ink/[0.6]">About ten minutes. Have your resume ready.</p>
            <div className="mt-8">
              <ApplicationForm role={role} />
            </div>
          </div>
        </section>

        <div className={`${COLUMN} pb-20 pt-12 text-center`}>
          <Link href="/careers#roles" className="text-[15px] font-medium text-[#EA580C] hover:text-[#C2410C]">
            Not the right role? See all roles
          </Link>
        </div>
      </div>
    </main>
  );
}
