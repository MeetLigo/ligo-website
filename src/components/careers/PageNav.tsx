"use client";

import { useEffect, useState } from "react";

export interface PageSection {
  id: string;
  label: string;
}

/**
 * Sticky rail for a long page: the page's sections as anchor links, the one
 * currently on screen marked. Same shape as the roles rail on a job page, so
 * the two pages feel like one system. Desktop only; on narrow screens the
 * page is short enough to scroll.
 */
export function PageNav({ sections }: { sections: PageSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    // whichever section's top is closest to (but above) a line a third of
    // the way down the viewport counts as current
    const pick = () => {
      const line = window.innerHeight * 0.33;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page" className="hidden lg:sticky lg:top-10 lg:block lg:self-start">
      <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ink/[0.45]">On this page</div>
      <ul className="mt-4 flex flex-col border-l border-ink/[0.14]">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="-ml-px">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-[9px] pl-4 text-[14.5px] leading-snug transition-colors ${
                  isActive
                    ? "border-[#F97316] font-semibold text-ink"
                    : "border-transparent text-ink/[0.58] hover:border-ink/[0.3] hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
