import type { ReactNode } from "react";

/**
 * Shared inner-page hero band — carries the homepage's identity through the
 * site: the same warm-graded photography, a dark legibility scrim that fades
 * into the charcoal canvas, the letterspaced amber eyebrow, and a big serif
 * headline with an italic amber accent phrase (use <Accent>).
 *
 * ~45vh tall. The shared SiteHeader overlays the top of the band (Chrome
 * absolutely positions it), so the content clears it with generous top padding.
 * `width` should match the page body's container so left edges line up.
 */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  position = "center 35%",
  width = "max-w-[900px]",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  image: string;
  position?: string;
  width?: string;
}) {
  return (
    <section className="relative flex min-h-[45vh] w-full flex-col justify-end overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
      {/* legibility scrim — same charcoal family as the home hero's */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(19,15,10,0.66) 0%,rgba(19,15,10,0.38) 40%,rgba(19,15,10,0.56) 72%,rgba(19,15,10,0.9) 100%)" }}
      />
      {/* bottom edge dissolves into the page canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[84px]" style={{ background: "linear-gradient(180deg,rgba(19,15,10,0),#130F0A)" }} />

      <div className={`relative z-10 mx-auto w-full ${width} px-6 pb-11 pt-32 sm:px-10`}>
        <div className="text-[12px] font-bold uppercase tracking-eyebrow text-[#EDB264] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{eyebrow}</div>
        <h1 className="mt-3 max-w-[840px] text-balance font-serif text-[clamp(34px,4.8vw,54px)] font-medium leading-[1.04] tracking-[-0.015em] text-[#EFE8DB]">
          {title}
        </h1>
        {sub && (
          <p className="mt-4 max-w-[560px] text-[16px] leading-[1.55] text-[#EFE8DB]/[0.78] sm:text-[18px]">{sub}</p>
        )}
      </div>
    </section>
  );
}

/** The italic amber accent phrase, exactly as the home headline does it. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="italic text-[#E8A24C]">{children}</span>;
}
