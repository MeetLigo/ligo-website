"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqGroups } from "@/lib/content";

/**
 * Ligo's accordion language — not a SaaS widget: serif questions, hairline
 * separators at low opacity, a bare +/× toggle in amber, quiet sans answers.
 * One open at a time.
 */
export function FaqList({ items, defaultOpen = -1 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      {items.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div key={qa.q} className="border-b border-[#EFE8DB]/[0.08] last:border-b-0">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-[13px] text-left"
            >
              <span className="flex-1 font-serif text-[18px] font-medium leading-snug tracking-[-0.01em] text-[#EFE8DB]">{qa.q}</span>
              <span
                aria-hidden
                className={`flex-none font-serif text-[22px] font-light leading-none text-[#EDB264] transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 pr-9 text-[14.5px] leading-[1.6] text-[#EFE8DB]/[0.62]">{qa.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Home page strip — students' questions only, first one open. Linkable at /#faq. */
export function HomeFaq() {
  const students = faqGroups.find((g) => /student/i.test(g.name));
  if (!students) return null;
  return (
    <section id="faq" className="relative w-full scroll-mt-16 px-6 pb-20 pt-2 sm:px-10">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-eyebrow text-[#EDB264]">Questions</div>
        <h2 className="mb-4 font-serif text-[26px] font-medium leading-[1.1] tracking-[-0.01em] text-[#EFE8DB]">
          Frequently asked questions.
        </h2>
        <FaqList items={students.items} defaultOpen={0} />
      </div>
    </section>
  );
}

/** Partner page strip — clubs only while the page targets clubs & orgs.
 *  (Add /business/ back to the filter when the local-business audience returns;
 *  its questions are preserved in faqGroups.) */
export function PartnerFaq() {
  const groups = faqGroups.filter((g) => /club/i.test(g.name));
  if (groups.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-[900px] px-6 pb-2 pt-10 sm:px-10">
      <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EDB264]">Questions</div>
      {groups.map((g) => (
        <div key={g.name} className="mt-5">
          <div className="mb-1 flex items-center gap-[10px]">
            <span className="h-[8px] w-[8px] rounded-full" style={{ background: g.color }} />
            <h3 className="font-serif text-[20px] font-medium tracking-[-0.01em] text-[#EFE8DB]">{g.name}</h3>
          </div>
          <FaqList items={g.items} />
        </div>
      ))}
    </section>
  );
}
