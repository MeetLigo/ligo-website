import type { Metadata } from "next";
import { partners } from "@/lib/content";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { PartnerFaq } from "@/components/faq/FaqList";
import { PartnerCTA } from "@/components/partner/PartnerCTA";

export const metadata: Metadata = {
  title: "Become a Partner · Ligo",
  description: "Fill the room with your people. Ligo for student clubs and organizations.",
};

export default function PartnerPage() {
  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow="become a partner"
        title={<>Fill the room with <Accent>your people.</Accent></>}
        sub={
          <>
            Clubs and orgs fill their shows, mixers, and meetings with the people who already vibe with
            their sound.
          </>
        }
        image="/hero/slide-1.jpg"
        position="center 32%"
        width="max-w-[900px]"
      />

      {/* clubs & orgs only for now — the three things Ligo does for them, each
          given its own block in the existing card styling */}
      <section className="mx-auto grid max-w-[900px] grid-cols-1 gap-[18px] px-6 pb-5 pt-9 sm:px-10 md:grid-cols-3">
        {partners[0].points.map((pt) => (
          <div key={pt} className="rounded-[22px] border border-[#D7CCBC]/10 bg-[#1B150E] p-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71C07F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
            <div className="mt-4 font-serif text-[19px] font-medium leading-snug tracking-[-0.01em] text-[#EFE8DB]">{pt}</div>
          </div>
        ))}
      </section>

      {/* objections handled right before the ask */}
      <PartnerFaq />

      <section className="mx-auto max-w-[900px] px-6 pb-[34px] pt-[14px] sm:px-10">
        {/* the CTA as a cream sheet taped over the dark — the page's artifact moment */}
        <PartnerCTA />
      </section>
    </main>
  );
}
