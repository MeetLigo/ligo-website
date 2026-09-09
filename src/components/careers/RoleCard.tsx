import Link from "next/link";
import type { Role } from "@/lib/careers";

/**
 * One open role in the list: title, one line of what it is, the facts, and a
 * single button to the job page. No expanding in place. The full posting and
 * the application live together on /careers/apply/[slug].
 */
export function RoleCard({ role }: { role: Role }) {
  const href = `/careers/apply/${role.slug}`;
  return (
    <article className="border-b border-ink/[0.14]">
      <Link href={href} className="group block py-7 text-ink hover:text-ink">
        <h3 className="font-serif text-[26px] font-medium leading-[1.08] tracking-[-0.01em] text-ink transition-colors group-hover:text-[#EA580C] sm:text-[30px]">
          {role.title}
        </h3>
        <p className="mt-2 max-w-[640px] text-[15.5px] leading-[1.5] text-ink/[0.75]">{role.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/[0.5]">
          <span>{role.lane}</span>
          <span>{role.openings}</span>
          <span>Paid</span>
          <span>{role.hours}</span>
        </div>
        <span className="mt-5 inline-flex items-center gap-[9px] rounded-full border border-ink/[0.4] px-6 py-[12px] text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-all group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-[#241603]">
          Learn more and apply
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </span>
      </Link>
    </article>
  );
}
