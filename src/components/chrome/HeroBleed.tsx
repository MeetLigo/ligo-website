/**
 * Carries the hero's darkness down into the section beneath it.
 *
 * The hero fades to the canvas dark at its own bottom edge, so the boundary
 * itself is invisible; this strip picks that dark up on the far side and
 * releases it into whatever the section's background is. The photo keeps its
 * full frame, and the next section's colour never washes up over it.
 *
 * Render it as the first child of the section that follows a PageHero.
 */
export function HeroBleed({ height = "h-[120px]", from = "#171717" }: { height?: string; from?: string }) {
  return (
    <div
      aria-hidden
      className={`${height} w-full`}
      style={{ background: `linear-gradient(180deg,${from} 0%,${from}00 100%)` }}
    />
  );
}
