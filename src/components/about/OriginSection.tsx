import Image from "next/image";
import { Tape } from "@/components/ui/Tape";
import { Accent } from "@/components/chrome/PageHero";

/**
 * The Origin — ONE continuous composition, not a hero stacked on a story.
 * Eyebrow, headline, italic lede and the story paragraphs share one container
 * and one left edge; the lede IS paragraph one, with the body following two
 * paragraph-spaces below. One background world: espresso base, soft amber
 * glows, the ghost "3 AM" bleeding down behind the start of the story, and
 * uniform grain across the whole section. Snapshots ride alongside the body
 * (photo column ~45%), inline at their chapter points on mobile.
 */

function Snapshot({
  src,
  alt,
  width,
  height,
  caption,
  tilt,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  tilt: "left" | "right";
  priority?: boolean;
}) {
  return (
    <figure
      className={`relative m-0 rounded-[3px] bg-cream p-[8px] pb-[6px] shadow-[0_18px_44px_-18px_rgba(232,162,76,0.28),0_28px_55px_-24px_rgba(0,0,0,0.65)] ${
        tilt === "left" ? "-rotate-[1.5deg]" : "rotate-[1.5deg]"
      }`}
    >
      <Tape className={`-top-[11px] ${tilt === "left" ? "left-8 -rotate-[4deg]" : "right-8 rotate-[5deg]"}`} />
      <Image src={src} alt={alt} width={width} height={height} priority={priority} className="h-auto w-full rounded-[2px]" />
      <figcaption className="px-[4px] pb-[2px] pt-[8px] font-hand text-[18px] leading-snug text-ink/[0.68]">{caption}</figcaption>
    </figure>
  );
}

export function OriginSection() {
  // the two snapshots, shared between the mobile inline flow and the desktop collage
  const barPhoto = (
    <Snapshot
      src="/founder.webp"
      alt="Ligo founder Micah with a friend at the bar where the idea started"
      width={512}
      height={427}
      caption="The night it started."
      tilt="left"
      priority
    />
  );
  const parkPhoto = (
    <Snapshot
      src="/micah-ligo-research.png"
      alt="Micah at a folding table in Washington Square Park with a pink 'What's your hidden love language?' banner and a crowd"
      width={1100}
      height={620}
      caption="Field research, Washington Square Park."
      tilt="right"
    />
  );

  return (
    <section className="relative overflow-hidden px-6 pb-12 sm:px-10">
      {/* one background world for the whole composition */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 top-[-8%] h-[560px] w-[560px] rounded-full" style={{ background: "radial-gradient(circle,rgba(232,162,76,0.10),transparent 65%)" }} />
        <div className="absolute right-[-10%] top-[38%] h-[640px] w-[640px] rounded-full" style={{ background: "radial-gradient(circle,rgba(199,122,46,0.07),transparent 65%)" }} />
        {/* ghost motif — bleeds down BEHIND the start of the story, cropped by the
            section, watermark-faint, so the backdrop never changes character */}
        {/* nudged up + slightly fainter so the raised photo column slides over its
            tail cleanly — it reads in the open zone beside the headline */}
        <div
          className="absolute right-[-5%] top-[120px] select-none whitespace-nowrap font-serif font-semibold leading-none tracking-[-0.02em] text-[#E8A24C]"
          style={{ fontSize: "26vw", opacity: 0.038 }}
        >
          3 AM
        </div>
        {/* uniform film grain, top of page through the end of the story — no mask,
            no fade, no seam */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.05,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1100px] pt-36">
        {/* the opening — same container, same left edge as everything below */}
        <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264]">the origin</div>
        <h1 className="mt-3 font-serif text-[clamp(34px,4.8vw,54px)] font-medium leading-[1.04] tracking-[-0.015em] text-[#EFE8DB]">
          How Ligo <Accent>started.</Accent>
        </h1>
        {/* the story grid starts AT the lede, so the photo column rides beside it
            from the very first line — no empty top-right */}
        <div className="mt-6 grid grid-cols-1 items-start gap-y-7 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-x-12">
          <div className="space-y-[27px] text-[18px] leading-[1.65] text-[#EFE8DB]/[0.8]">
            {/* the lede — paragraph one of the story, in the deck voice */}
            <p className="max-w-[34ch] font-serif text-[22px] italic leading-[1.6] text-[#EFE8DB]/[0.85] sm:text-[25px]">
              It&apos;s 3am. I&apos;m standing in line at a burger spot in the East Village, half asleep. I&apos;d been
              fired from my first job out of college, laid off from my second, and was going through a breakup with
              someone who meant a lot to me.
            </p>
            <div className="w-full !mt-[34px] lg:hidden">{barPhoto}</div>
            {/* the body follows two paragraph-spaces after the lede on desktop */}
            <p className="lg:!mt-[72px]">
              The guy in front of me starts humming. I know the song immediately. Chanel, Frank Ocean. Before I knew
              it we were both singing it. An hour later we were still outside on the street talking. Not about jobs or
              school or any of the usual stuff. Just music. What it means to us. Where we were when we first heard it.
            </p>
            <div className="w-full pt-1 lg:hidden">{parkPhoto}</div>
            <p>That guy is one of my closest friends today. That was 2½ years ago.</p>
            <p>
              I went home that night and couldn&apos;t stop thinking about it. How many times does that not happen? How many people
              walk past each other every day who would actually connect, if they just had a reason to say something?
              That question is Ligo.
            </p>

            {/* the thesis, pinned up as a cream pull-quote card — ink serif on paper */}
            <blockquote className="relative !mt-11 -rotate-[0.8deg] rounded-[3px] bg-cream px-8 py-7 text-center shadow-[0_26px_50px_-20px_rgba(0,0,0,0.6),0_14px_40px_-16px_rgba(232,162,76,0.3)] sm:px-10">
              <Tape className="-top-[11px] left-9 -rotate-[4deg]" />
              <Tape className="-top-[11px] right-9 rotate-[3deg]" />
              <p className="m-0 font-serif text-[21px] font-medium leading-[1.4] tracking-[-0.01em] text-ink sm:text-[23px]">
                &ldquo;How many people walk past each other every day who would actually connect, if they just had a
                reason to say something?&rdquo;
              </p>
              <footer className="mt-3 font-hand text-[18px] text-ink/[0.55]">— that question is Ligo</footer>
            </blockquote>
          </div>

          {/* desktop: the snapshots at full weight — bar photo top-aligned with the
              first sans paragraph, park photo following with clear separation */}
          <div id="research" className="hidden scroll-mt-24 lg:block lg:pt-7">
            <div className="w-[480px] max-w-full">{barPhoto}</div>
            <div className="ml-4 mt-[76px] w-[480px] max-w-full">{parkPhoto}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
