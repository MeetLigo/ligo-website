/**
 * Subtle animated waveform behind the landing hero — the motion that keeps the
 * clean problem-statement state from reading dead. Health-tech "vital-sign"
 * feel: layered audio lines plus an ECG pulse, scrolling horizontally.
 *
 * Pure SVG + CSS (no JS at runtime). Paths are computed so they tile seamlessly
 * (start y === end y), then drawn twice side by side and marquee-scrolled.
 */

const W = 1200; // logical width of one tile; viewBox stretches to the hero

// A smooth sine line. wavelength must divide W so the tile seam is continuous.
function sine(baseline: number, amp: number, wavelength: number): string {
  let d = `M0 ${baseline}`;
  for (let x = 0; x <= W; x += 6) {
    const y = baseline + amp * Math.sin((x / wavelength) * Math.PI * 2);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d;
}

// A flat line with periodic heartbeat spikes.
function pulse(baseline: number, gap: number): string {
  let d = `M0 ${baseline}`;
  for (let x = 0; x < W; x += gap) {
    const s = x + gap * 0.42;
    d +=
      ` L${s} ${baseline}` +
      ` L${(s + gap * 0.04).toFixed(1)} ${baseline - 7}` +
      ` L${(s + gap * 0.08).toFixed(1)} ${baseline - 64}` +
      ` L${(s + gap * 0.12).toFixed(1)} ${baseline + 34}` +
      ` L${(s + gap * 0.16).toFixed(1)} ${baseline}`;
  }
  return d + ` L${W} ${baseline}`;
}

const LINES = [
  { d: sine(210, 34, 300), stroke: "#F97316", opacity: 0.16, width: 2 },
  { d: pulse(305, 300), stroke: "#4FA6CB", opacity: 0.14, width: 2 },
  { d: sine(420, 26, 240), stroke: "#EA580C", opacity: 0.1, width: 2 },
];

function Tile() {
  return (
    <svg
      className="h-full w-1/2 flex-none"
      viewBox={`0 0 ${W} 600`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LINES.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill="none"
          stroke={l.stroke}
          strokeOpacity={l.opacity}
          strokeWidth={l.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function Waveform() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* slower, fainter parallax layer */}
      <div className="absolute inset-0 flex w-[200%] animate-marquee-slow opacity-60">
        <Tile />
        <Tile />
      </div>
      {/* primary layer */}
      <div className="absolute inset-0 flex w-[200%] animate-marquee">
        <Tile />
        <Tile />
      </div>
    </div>
  );
}
