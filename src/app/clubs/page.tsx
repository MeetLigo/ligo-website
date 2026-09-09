import type { Metadata } from "next";
import Link from "next/link";
import { ClubSheet } from "@/components/clubs/ClubSheet";
import { CLUB_PORTAL } from "@/lib/clubs";

export const metadata: Metadata = {
  title: "Ligo for Clubs",
  description: "Create your club's account on Ligo and put your events in front of every Georgetown student.",
};

const PERKS = [
  "Your events go in front of every Georgetown student on Ligo.",
  "A club page, schedule, RSVPs, and a club-wide chat, in one place.",
  "Setup takes about two minutes. We review every request by hand.",
];

export default function ClubsPage() {
  return (
    <ClubSheet>
      <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EA580C]">ligo for clubs</div>
      <h1 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
        Create your club&apos;s <span className="italic text-[#EA580C]">account.</span>
      </h1>
      <p className="mt-3 text-[16px] leading-[1.55] text-ink/[0.7]">You already post your events. We make sure everyone sees them.</p>

      <ul className="mt-6 flex flex-col gap-[10px]">
        {PERKS.map((p) => (
          <li key={p} className="grid grid-cols-[14px_1fr] gap-2 text-[15px] leading-[1.5] text-ink/[0.82]">
            <span aria-hidden className="mt-[9px] block h-[5px] w-[5px] rounded-full bg-[#F97316]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/clubs/create"
        className="mt-8 flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#F97316] px-5 py-[15px] text-[15px] font-semibold text-[#241603] shadow-cta transition-transform hover:text-[#241603] active:scale-[0.97]"
      >
        Create an account
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241603" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
      </Link>

      <p className="mt-4 text-center text-[14px] text-ink/[0.6]">
        Already on Ligo?{" "}
        <a href={CLUB_PORTAL} className="font-medium text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline">
          Log in instead
        </a>
      </p>
    </ClubSheet>
  );
}
