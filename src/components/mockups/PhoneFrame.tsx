/**
 * Reusable iPhone-style frame for app-preview mockups (site sections, the v3
 * split hero, and later Remotion animations — these are plain React
 * components, so Remotion can render them directly).
 *
 * Sizes are real CSS widths; everything inside scales off `--pw` (phone width)
 * so any screen renders correctly at any size.
 */

const SIZES = { sm: 240, md: 310, lg: 380 } as const;
export type PhoneSize = keyof typeof SIZES;

export function PhoneFrame({
  size = "md",
  children,
  chrome = true,
  className = "",
}: {
  size?: PhoneSize;
  children: React.ReactNode;
  /** false = the screen content already includes its own UI chrome
      (e.g. a full-screen SVG exported from the real app in Figma) */
  chrome?: boolean;
  className?: string;
}) {
  const w = SIZES[size];
  return (
    <div
      className={`flex flex-col rounded-[calc(var(--pw)*0.142)] border border-black/[0.08] bg-white shadow-[0_24px_60px_rgba(23,23,23,0.18)] ${className}`}
      style={{ width: w, padding: w * 0.039, ["--pw" as string]: `${w}px` }}
    >
      <div className="flex min-h-[calc(var(--pw)*1.85)] flex-col overflow-hidden rounded-[calc(var(--pw)*0.11)] bg-[#F6F5F4]">
        <div className="flex flex-1 flex-col">{children}</div>
        {chrome && <BottomNav />}
      </div>
    </div>
  );
}

/** Drop-in screen for exact app exports: give it an SVG/PNG of a full screen
    (from the Figma app file) and it fills the frame edge to edge. Use with
    <PhoneFrame chrome={false}>. Files live in /public/mockups/. */
export function ScreenImage({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full flex-1 object-cover object-top" />
  );
}

function BottomNav() {
  return (
    <div className="flex flex-col gap-[calc(var(--pw)*0.026)] border-t border-black/[0.06] bg-white px-[calc(var(--pw)*0.084)] pb-[calc(var(--pw)*0.032)] pt-[calc(var(--pw)*0.039)]">
      <div className="flex items-center justify-between text-[#171717]/[0.4]">
        <NavIcon d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4.5v-5.5h-5V21H5a1 1 0 01-1-1v-9.5z" active />
        <NavIcon d="M20 20l-4.2-4.2 M11 11 m-6.5 0 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0" />
        <NavIcon d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H9l-5 4v-14.5z" />
      </div>
      <span className="h-1 w-[35%] self-center rounded-full bg-black" />
    </div>
  );
}

function NavIcon({ d, active }: { d: string; active?: boolean }) {
  return (
    <svg
      style={{ width: "calc(var(--pw) * 0.077)", height: "calc(var(--pw) * 0.077)" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#171717" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
