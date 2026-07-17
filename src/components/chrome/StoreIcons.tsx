/** Shared App Store / Google Play glyphs, ported from the export. */

export function AppleIcon({ size = 16, fill = "#14110D" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.2zM14.2 5.9c.6-.7 1-1.7.9-2.7-.9.04-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .07 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

export function PlayIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3.6 2.4l10 9.6-10 9.6c-.4-.2-.6-.6-.6-1.1V3.5c0-.5.2-.9.6-1.1z" fill="#F97316" />
      <path d="M17 8.9l-3.4 3.1 3.4 3.1 3-1.7c.8-.5.8-1.6 0-2.1L17 8.9z" fill="#EBBE4E" />
      <path d="M13.6 12L3.6 2.4c.1-.05.3-.08.5-.02L16 9.2 13.6 12z" fill="#9BD8EC" />
      <path d="M13.6 12l2.4 2.8L4.1 21.6c-.2.06-.4.03-.5-.02L13.6 12z" fill="#EA8CE1" />
    </svg>
  );
}
