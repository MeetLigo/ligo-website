"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqGroups } from "@/lib/content";

/** Four audience groups, each a set of accordion dropdowns. */
export function FaqAccordion() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));

  return (
    <>
      {faqGroups.map((g, gi) => (
        <div key={g.name} className="mb-[34px]">
          <div className="mb-3 flex items-center gap-[10px]">
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: g.color }} />
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{g.name}</h2>
          </div>
          <div className="flex flex-col gap-2">
            {g.items.map((qa, qi) => {
              const id = `${gi}-${qi}`;
              const isOpen = !!open[id];
              return (
                <div key={id} className="overflow-hidden rounded-2xl border border-ink/[0.07] bg-white">
                  <button
                    onClick={() => toggle(id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-[14px] px-[18px] py-4 text-left"
                  >
                    <span className="flex-1 font-display text-base font-semibold text-ink">{qa.q}</span>
                    <span
                      className="flex-none transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(20,17,13,0.4)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
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
                        <div className="px-[18px] pb-[18px] text-[15px] leading-[1.6] text-ink/[0.62]">
                          {qa.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
