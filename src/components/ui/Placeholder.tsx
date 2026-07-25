/**
 * On-brand stand-in for images the Design export left as <image-slot>
 * placeholders (team headshots, news thumbnails, done-state polaroids).
 * No real asset existed for these in the export.
 */
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#241C13] to-[#130F0A] ${className}`}
    >
      <span className="flex items-center gap-[6px] px-3 text-center text-[13px] font-semibold leading-tight text-[#EFE8DB]/40">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A24C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none opacity-80">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <circle cx="12" cy="13" r="3.4" />
          <path d="M8 6l1.4-2h5.2L16 6" />
        </svg>
        {label}
      </span>
    </div>
  );
}
