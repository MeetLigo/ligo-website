import type { Metadata } from "next";
import { partners } from "@/lib/content";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { Tape } from "@/components/ui/Tape";
import { PartnerFaq } from "@/components/faq/FaqList";

export const metadata: Metadata = {
  title: "Become a Partner · Ligo",
  description: "Put your room in front of the whole campus. For clubs, orgs, and local businesses.",
};

export default function PartnerPage() {
  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow="become a partner"
        title={<>Put your room in front of <Accent>the whole campus.</Accent></>}
        sub={
          <>
            Clubs fill their events. Local spots fill their tables. Both reach students by the one thing they
            can&apos;t fake: their taste.
          </>
        }
        image="/hero/slide-1.jpg"
        position="center 32%"
        width="max-w-[900px]"
      />

      <section className="mx-auto grid max-w-[900px] grid-cols-1 gap-[22px] px-6 pb-5 pt-9 sm:px-10 md:grid-cols-2">
        {partners.map((p) => (
          <div
            key={p.title}
            className="rounded-[22px] border border-[#D7CCBC]/10 bg-[#1B150E] p-7"
          >
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-2xl"
              style={{ background: p.iconBg }}
            >
              {p.icon}
            </div>
            <div className="my-4 mb-[6px] font-serif text-2xl font-semibold tracking-[-0.01em] text-[#EFE8DB]">{p.title}</div>
            <div className="mb-[18px] text-[15px] leading-[1.55] text-[#EFE8DB]/[0.58]">{p.sub}</div>
            <div className="flex flex-col gap-[10px]">
              {p.points.map((pt) => (
                <div key={pt} className="flex items-start gap-[10px] text-sm text-[#EFE8DB]/90">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71C07F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-[1px] flex-none">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* objections handled right before the ask */}
      <PartnerFaq />

      <section className="mx-auto max-w-[900px] px-6 pb-[34px] pt-[14px] sm:px-10">
        {/* the CTA as a cream sheet taped over the dark — the page's artifact moment */}
        <div className="relative -rotate-[0.6deg] rounded-[3px] bg-cream p-[34px] text-ink shadow-[0_30px_58px_-22px_rgba(0,0,0,0.6),0_16px_44px_-18px_rgba(232,162,76,0.3)]">
          <Tape className="-top-[11px] left-10 -rotate-[4deg]" />
          <Tape className="-top-[11px] right-12 rotate-[3deg]" />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink">Let&apos;s get your room full.</div>
              <div className="mt-[6px] text-[15px] text-ink/[0.62]">
                Tell us who you are. We&apos;ll set you up in a day.
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-[9px] rounded-[14px] bg-[#E8A24C] px-6 py-[14px] text-[15px] font-semibold text-[#241603] shadow-[0_10px_24px_-8px_rgba(199,122,46,0.55)] transition-transform active:scale-[0.97]"
            >
              Get started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241603" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
