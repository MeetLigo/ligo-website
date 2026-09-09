import Link from "next/link";
import { roles } from "@/lib/careers";

/**
 * Sticky rail beside a job posting: every open role, the current one marked,
 * so someone reading one job can jump to another without going back. Desktop
 * only; on narrow screens the "see all roles" link at the foot of the page
 * does the same job without eating the top of the screen.
 */
export function RoleNav({ current }: { current: string }) {
  return (
    <nav aria-label="Open roles" className="hidden lg:sticky lg:top-10 lg:block lg:self-start">
      <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ink/[0.45]">Open roles</div>
      <ul className="mt-4 flex flex-col border-l border-ink/[0.14]">
        {roles.map((r) => {
          const active = r.slug === current;
          return (
            <li key={r.slug} className="-ml-px">
              <Link
                href={`/careers/apply/${r.slug}`}
                aria-current={active ? "page" : undefined}
                className={`block border-l-2 py-[9px] pl-4 text-[14.5px] leading-snug transition-colors ${
                  active
                    ? "border-[#F97316] font-semibold text-ink"
                    : "border-transparent text-ink/[0.58] hover:border-ink/[0.3] hover:text-ink"
                }`}
              >
                {r.title}
              </Link>
            </li>
          );
        })}
      </ul>

      <a
        href="#apply"
        className="mt-6 inline-flex w-full items-center justify-center gap-[8px] rounded-full bg-[#F97316] px-5 py-[11px] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#241603] shadow-cta transition-all hover:bg-[#FB923C] hover:text-[#241603] active:scale-[0.97]"
      >
        Apply
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13M6 13l6 6 6-6" /></svg>
      </a>

      <Link href="/careers" className="mt-4 block text-[13.5px] text-ink/[0.55] transition-colors hover:text-ink">
        All careers
      </Link>
    </nav>
  );
}
