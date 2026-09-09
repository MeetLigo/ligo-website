import type { Metadata } from "next";
import { ClubSheet } from "@/components/clubs/ClubSheet";
import { ClubRequestForm } from "@/components/clubs/ClubRequestForm";
import { CLUB_PORTAL } from "@/lib/clubs";

export const metadata: Metadata = {
  title: "Create your club's account · Ligo",
  description: "Request a Ligo account for your Georgetown club. We review every request within a day.",
};

export default function ClubCreatePage() {
  return (
    <ClubSheet width="max-w-[600px]">
      <div className="text-[11px] font-bold uppercase tracking-eyebrow text-[#EA580C]">ligo for clubs</div>
      <h1 className="mt-3 font-serif text-[clamp(28px,3.6vw,36px)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
        Tell us about <span className="italic text-[#EA580C]">your club.</span>
      </h1>
      <p className="mt-3 text-[15px] leading-[1.55] text-ink/[0.7]">
        Two minutes. We&apos;ll review it and email you when your club is live.
      </p>
      <div className="relative mt-7">
        <ClubRequestForm />
      </div>
      <p className="mt-6 text-center text-[14px] text-ink/[0.6]">
        Already on Ligo?{" "}
        <a href={CLUB_PORTAL} className="font-medium text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline">
          Log in instead
        </a>
      </p>
    </ClubSheet>
  );
}
