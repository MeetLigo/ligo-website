import type { Metadata } from "next";
import { partners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Become a Partner — Ligo",
  description: "Put your room in front of the whole campus. For clubs, orgs, and local businesses.",
};

export default function PartnerPage() {
  return (
    <main className="animate-riseIn">
      <section className="px-[26px] pb-[46px] pt-[70px]" style={{ backgroundImage: "linear-gradient(165deg,#9BD8EC,#FFF7E9 75%)" }}>
        <div className="mx-auto max-w-[900px]">
          <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">become a partner</div>
          <h1 className="mt-[14px] text-balance font-display text-page-title-lg font-semibold">
            Put your room in front of the whole campus.
          </h1>
          <p className="mt-4 max-w-[520px] text-[18px] text-ink/[0.62]">
            Clubs fill their events. Local spots fill their tables. Both reach students by the one thing they
            can&apos;t fake — their taste.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[900px] grid-cols-1 gap-[22px] px-[26px] pb-5 pt-9 md:grid-cols-2">
        {partners.map((p) => (
          <div
            key={p.title}
            className="rounded-[22px] border border-ink/[0.07] bg-white p-7 shadow-[0_8px_24px_-16px_rgba(20,17,13,0.2)]"
          >
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-2xl"
              style={{ background: p.iconBg }}
            >
              {p.icon}
            </div>
            <div className="my-4 mb-[6px] font-display text-2xl font-semibold tracking-[-0.02em]">{p.title}</div>
            <div className="mb-[18px] text-[15px] leading-[1.55] text-ink/[0.58]">{p.sub}</div>
            <div className="flex flex-col gap-[10px]">
              {p.points.map((pt) => (
                <div key={pt} className="flex items-start gap-[10px] text-sm text-ink">
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

      <section className="mx-auto max-w-[900px] px-[26px] pb-[30px] pt-[10px]">
        <div className="relative overflow-hidden rounded-[26px] bg-ink p-[38px] text-white">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(360px 240px at 88% 10%,rgba(245,215,131,0.2),transparent 70%),radial-gradient(360px 240px at 6% 96%,rgba(155,216,236,0.16),transparent 70%)",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="font-display text-[26px] font-semibold tracking-[-0.02em]">Let&apos;s get your room full.</div>
              <div className="mt-[6px] text-[15px] text-white/60">
                Tell us who you are — we&apos;ll set you up in a day.
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-[9px] rounded-[14px] bg-flame px-6 py-[14px] text-[15px] font-semibold text-white shadow-cta transition-transform active:scale-[0.97]"
            >
              Get started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
