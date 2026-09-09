import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/chrome/PageHero";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { RoleDetail, PostingHeading } from "@/components/careers/RoleDetail";
import { RoleNav } from "@/components/careers/RoleNav";
import { roles, getRole, program } from "@/lib/careers";

const SHELL = "mx-auto w-full max-w-[1300px] px-6 sm:px-10";
/** sticky rail on the left, readable measure on the right, both inside the hero's gutters */
const GRID = "grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16";
const PROSE = "max-w-[760px]";

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
        width="max-w-[1300px]"
        fadeTo="#FAF6EF"
        fadeHeight="h-[14px]"
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

      {/* everything below the hero is one cream page, on the hero's gutters */}
      <div className="bg-cream text-ink">
        <div className={`${SHELL} ${GRID} pb-20 pt-10 sm:pt-12`}>
          <RoleNav current={role.slug} />

          <div className={PROSE}>
            <article>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/[0.5]">
            <span>{program.campus}</span>
            <span>{role.openings}</span>
            <span>Paid</span>
            <span>{role.hours}</span>
            <span>{program.term}</span>
          </div>

          <div className="mt-6">
            <RoleDetail role={role} />
          </div>

          <div className="mt-6">
            <PostingHeading>The details</PostingHeading>
            <dl className="mt-2 flex flex-col divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
              {(
                [
                  ["Campus", `${program.campus}, ${program.where}`],
                  ["Openings", role.openingsShort],
                  ["Commitment", `${role.hours}, ${program.term}`],
                  ["Pay", program.pay],
                  ["Who can apply", program.who],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-[7px]">
                  <dt className="text-[13.5px] text-ink/[0.5]">{k}</dt>
                  <dd className="text-[14.5px] leading-[1.5] text-ink/[0.8]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 text-[13.5px] leading-[1.6] text-ink/[0.6]">
            This is a paid position. Pay is tied to the deliverables outlined above and is agreed on before hire. Ligo
            is an equal opportunity employer and does not discriminate on the basis of race, color, religion, sex,
            sexual orientation, gender identity, national origin, disability, veteran status, or any other protected
            characteristic.
          </p>
        </article>

            {/* the application, straight after the posting */}
            <section id="apply" className="scroll-mt-10 pt-12">
              <div className="border-t border-ink/[0.14] pt-10">
                <h2 className="font-serif text-[clamp(28px,3.4vw,36px)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
                  Apply for this role
                </h2>
                <p className="mt-2 text-[15px] text-ink/[0.6]">Under five minutes. No resume needed.</p>
                <div className="mt-8">
                  <ApplicationForm role={role} />
                </div>
              </div>
            </section>

            <div className="pt-12 lg:hidden">
              <Link href="/careers#roles" className="text-[15px] font-medium text-[#EA580C] hover:text-[#C2410C]">
                Not the right role? See all roles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
