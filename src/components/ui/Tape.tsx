/** A small piece of translucent tape — part of the site's "artifact" language
 *  (the printed chart sheet, taped polaroids, cream notes on the dark wall). */
export function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-[22px] w-[62px] rounded-[1px] border border-white/[0.28] bg-[#F7F0DC]/[0.55] shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-[1px] ${className}`}
    />
  );
}
