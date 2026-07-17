import type { Metadata } from "next";
import Image from "next/image";
import { TeamGrid } from "@/components/about/TeamGrid";
import { team, management } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Ligo",
  description: "The origin story behind Ligo, and the band making it.",
};

export default function AboutPage() {
  return (
    <main className="animate-riseIn">
      <section className="bg-gradient-to-b from-mist to-cream px-14 pb-[50px] pt-[70px]">
        <div className="mx-auto max-w-[820px]">
          <h1 className="text-balance font-display text-page-title font-semibold">The Origin</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-14 pb-6 pt-[52px]">
        <div className="mb-12 flex justify-center">
          <div className="w-[520px] max-w-full -rotate-[4deg] overflow-hidden rounded-[18px] shadow-[0_34px_60px_-22px_rgba(20,17,13,0.5)]">
            <Image
              src="/founder.webp"
              alt="Ligo founder"
              width={520}
              height={565}
              className="block h-full w-full object-cover"
              style={{ aspectRatio: "0.92" }}
              priority
            />
          </div>
        </div>
        <div className="mx-auto max-w-[78ch] text-[18px] leading-[1.7] text-ink/[0.72]">
          <p className="mb-5">
            It&apos;s 3am. I&apos;m standing in line at a burger spot in the East Village, half asleep. I&apos;d been
            fired from my first job out of college, laid off from my second, and was going through a breakup with
            someone who meant a lot to me.
          </p>
          <p className="mb-5">
            The guy in front of me starts humming. I know the song immediately — Chanel, Frank Ocean. Before I knew it
            we were both singing it. An hour later we were still outside on the street talking — not about jobs or
            school or any of the usual stuff. Just music. What it means to us. Where we were when we first heard it.
          </p>
          <p className="mb-5">That guy is one of my closest friends today. That was 2½ years ago.</p>
          <p className="m-0">
            I went home that night and could not stop thinking — how many times does that not happen? How many people
            walk past each other every day who would actually connect, if they just had a reason to say something?
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-14 pb-5 pt-10">
        <h2 className="mb-[26px] font-display text-[32px] font-semibold tracking-[-0.02em]">The Band</h2>
        <TeamGrid members={team} />
      </section>

      <section className="mx-auto max-w-[1240px] px-14 pb-6 pt-10">
        <h2 className="mb-[26px] font-display text-[32px] font-semibold tracking-[-0.02em]">Management</h2>
        <TeamGrid members={management} />
      </section>
    </main>
  );
}
