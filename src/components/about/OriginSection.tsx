import Image from "next/image";

/**
 * Section 1 — The Origin (founder story). The fullest band: heading, then a
 * shrunk tilted photo beside the opening paragraphs, then the story continues
 * as one centered ~65ch column. Cream, generous whitespace.
 */
export function OriginSection() {
  return (
    <section className="bg-gradient-to-b from-mist/70 to-cream px-6 pb-16 pt-[76px] sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">the origin</div>
        <h1 className="mt-3 text-balance font-display text-page-title font-semibold text-ink">
          How Ligo started.
        </h1>

        {/* photo beside the opening paragraphs */}
        <div className="mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
          <div className="mx-auto w-[300px] max-w-full -rotate-[4deg] overflow-hidden rounded-[18px] shadow-[0_30px_55px_-24px_rgba(20,17,13,0.5)] sm:w-[320px]">
            <div className="relative aspect-[0.92]">
              <Image src="/founder.webp" alt="Ligo founder Micah" fill sizes="320px" className="object-cover" priority />
            </div>
          </div>

          <div className="text-[18px] leading-[1.7] text-ink/[0.72]">
            <p className="mb-5">
              It&apos;s 3am. I&apos;m standing in line at a burger spot in the East Village, half asleep. I&apos;d been
              fired from my first job out of college, laid off from my second, and was going through a breakup with
              someone who meant a lot to me.
            </p>
            <p className="m-0">
              The guy in front of me starts humming. I know the song immediately. Chanel, Frank Ocean. Before I knew
              it we were both singing it. An hour later we were still outside on the street talking. Not about jobs or
              school or any of the usual stuff. Just music. What it means to us. Where we were when we first heard it.
            </p>
          </div>
        </div>

        {/* the story continues, centered, ~65ch measure */}
        <div className="mx-auto mt-12 max-w-[62ch] text-[18px] leading-[1.7] text-ink/[0.72]">
          <p className="mb-5">That guy is one of my closest friends today. That was 2½ years ago.</p>
          <p className="m-0">
            I went home that night and couldn&apos;t stop thinking about it. How many times does that not happen? How many people
            walk past each other every day who would actually connect, if they just had a reason to say something?
            That question is Ligo.
          </p>
        </div>
      </div>
    </section>
  );
}
