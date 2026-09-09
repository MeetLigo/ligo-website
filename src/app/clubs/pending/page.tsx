import type { Metadata } from "next";
import Link from "next/link";
import { ClubSheet } from "@/components/clubs/ClubSheet";
import { CLUB_PORTAL } from "@/lib/clubs";

export const metadata: Metadata = {
  title: "Under review · Ligo for Clubs",
  description: "Your club's Ligo account request is under review.",
  robots: { index: false },
};

const STEPS = [
  "Someone on the team reads your request. Usually same day, always within one.",
  "You get an email from hello@meetligo.com when your club is live, or with a question if we have one.",
  "Sign in at the portal with the club email you gave us. You land as the club's admin.",
];

export default function ClubPendingPage() {
  return (
    <ClubSheet>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#71C07F]/[0.18]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3E8A4B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </span>
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EA580C]">request received</div>
      </div>
      <h1 className="mt-4 font-serif text-[clamp(30px,4vw,40px)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
        Your account is <span className="italic text-[#EA580C]">under review.</span>
      </h1>
      <p className="mt-3 text-[16px] leading-[1.55] text-ink/[0.7]">Here&apos;s what happens next.</p>

      <ol className="mt-6 flex flex-col gap-4">
        {STEPS.map((s, i) => (
          <li key={s} className="grid grid-cols-[28px_1fr] gap-3 text-[15px] leading-[1.5] text-ink/[0.82]">
            <span className="font-serif text-[14px] font-medium tabular-nums text-[#EA580C]">0{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex flex-1 items-center justify-center rounded-[14px] border border-ink/[0.3] px-5 py-[13px] text-[14px] font-semibold text-ink transition-colors hover:border-ink hover:text-ink"
        >
          Back to meetligo.com
        </Link>
        <a
          href={CLUB_PORTAL}
          className="flex flex-1 items-center justify-center rounded-[14px] bg-[#F97316] px-5 py-[13px] text-[14px] font-semibold text-[#241603] shadow-cta transition-transform hover:text-[#241603] active:scale-[0.97]"
        >
          Go to the portal
        </a>
      </div>
      <p className="mt-4 text-center text-[12.5px] text-ink/[0.5]">The portal works once your account is approved.</p>
    </ClubSheet>
  );
}
