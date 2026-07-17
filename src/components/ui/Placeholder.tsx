/**
 * On-brand stand-in for images the Design export left as <image-slot>
 * placeholders (team headshots, news thumbnails, done-state polaroids).
 * No real asset existed for these in the export.
 */
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-mist/60 via-photo-bg-2 to-gold/25 ${className}`}
    >
      <span className="flex items-center gap-[6px] px-3 text-center font-hand text-[17px] font-semibold leading-tight text-ink/45">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none opacity-70">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <circle cx="12" cy="13" r="3.4" />
          <path d="M8 6l1.4-2h5.2L16 6" />
        </svg>
        {label}
      </span>
    </div>
  );
}
