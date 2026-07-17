import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Ligo",
  description: "Questions from students, investors, local businesses, and clubs — answered.",
};

export default function FaqPage() {
  return (
    <main className="animate-riseIn">
      <section className="mx-auto max-w-[820px] px-[26px] pb-5 pt-[60px]">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">faq</div>
        <h1 className="mt-3 font-display text-page-title font-semibold">Questions, answered.</h1>
      </section>
      <section className="mx-auto max-w-[820px] px-[26px] pb-10 pt-[14px]">
        <FaqAccordion />
      </section>
    </main>
  );
}
