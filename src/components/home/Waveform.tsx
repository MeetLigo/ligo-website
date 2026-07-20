"use client";

import { useEffect, useRef } from "react";

interface WaveformProps {
  /** search bar focused → intensify (more amplitude + quicker motion) */
  focused: boolean;
  /** increments on each keystroke → a subtle pulse */
  pulseSignal: number;
  /** increments on submit → a single amplitude burst across the field */
  surgeSignal: number;
}

const TAU = Math.PI * 2;

/**
 * Two tiers so it reads as a live audio signal, not flat wallpaper:
 * fine, dense background ripples + bold foreground lines whose amplitude is
 * shaped by a slowly-drifting envelope (real peaks and quiet valleys). Warm
 * palette, saturated enough to actually show. Reactivity changes motion and
 * amplitude only, never opacity, so the black headline keeps contrast.
 */
interface Line {
  rgb: string;
  baseline: number; // vertical position (fraction of height)
  amp: number;
  carrier: number; // fine oscillation wavelength (smaller = denser)
  env: number; // amplitude-envelope wavelength (the "loudness" peaks)
  envSpeed: number; // how fast peaks drift
  envFloor: number; // min amplitude fraction (lower = more dynamic range)
  envPow: number; // >1 sharpens peaks
  speed: number;
  phase: number;
  alpha: number;
  width: number;
}

const LINES: Line[] = [
  // background — dense, fine, faint ripples (sky + gold)
  { rgb: "155,216,236", baseline: 0.3, amp: 15, carrier: 110, env: 520, envSpeed: 0.5, envFloor: 0.5, envPow: 1, speed: 0.9, phase: 0.0, alpha: 0.2, width: 1.3 },
  { rgb: "245,215,131", baseline: 0.36, amp: 13, carrier: 88, env: 600, envSpeed: 0.4, envFloor: 0.55, envPow: 1, speed: -0.85, phase: 1.1, alpha: 0.18, width: 1.2 },
  { rgb: "155,216,236", baseline: 0.64, amp: 17, carrier: 130, env: 560, envSpeed: 0.6, envFloor: 0.5, envPow: 1, speed: 0.7, phase: 2.0, alpha: 0.18, width: 1.3 },
  { rgb: "235,190,78", baseline: 0.72, amp: 14, carrier: 100, env: 640, envSpeed: 0.45, envFloor: 0.55, envPow: 1, speed: -0.6, phase: 0.5, alpha: 0.16, width: 1.2 },
  // foreground — bold, saturated, with real amplitude peaks (flame / ember / amber)
  { rgb: "249,115,22", baseline: 0.46, amp: 64, carrier: 300, env: 470, envSpeed: 0.75, envFloor: 0.16, envPow: 2.3, speed: 0.5, phase: 0.2, alpha: 0.52, width: 3.6 },
  { rgb: "234,88,12", baseline: 0.56, amp: 54, carrier: 250, env: 520, envSpeed: 0.6, envFloor: 0.2, envPow: 2.0, speed: -0.42, phase: 1.6, alpha: 0.44, width: 3.1 },
  { rgb: "245,215,131", baseline: 0.4, amp: 44, carrier: 340, env: 560, envSpeed: 0.55, envFloor: 0.26, envPow: 1.8, speed: 0.6, phase: 2.4, alpha: 0.38, width: 2.6 },
];

const CURSOR_SIGMA = 150; // px — how tight the cursor's influence is
const MAX_AMP = 150; // clamp so bursts never fill the hero

export function Waveform({ focused, pulseSignal, surgeSignal }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable interaction state read by the rAF loop (no re-renders per frame).
  const mouse = useRef({ x: 0, y: 0, activity: 0, target: 0 });
  const focusCur = useRef(0);
  const focusTarget = useRef(0);
  const pulse = useRef(0);
  const surge = useRef(0);

  useEffect(() => {
    focusTarget.current = focused ? 1 : 0;
  }, [focused]);

  useEffect(() => {
    if (pulseSignal > 0) pulse.current = Math.min(1.5, pulse.current + 0.6);
  }, [pulseSignal]);

  useEffect(() => {
    if (surgeSignal > 0) surge.current = 1;
  }, [surgeSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let t = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.current.x = x;
      mouse.current.y = y;
      const inside = x >= -80 && x <= rect.width + 80 && y >= -80 && y <= rect.height + 80;
      mouse.current.target = inside ? 1 : 0;
    };
    const onLeave = () => {
      mouse.current.target = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const STEP = 5;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;

      focusCur.current += (focusTarget.current - focusCur.current) * Math.min(1, dt * 6);
      mouse.current.activity += (mouse.current.target - mouse.current.activity) * Math.min(1, dt * 6);
      pulse.current *= Math.pow(0.12, dt);
      surge.current *= Math.pow(0.18, dt);

      const focusF = focusCur.current;
      const ampMul = 1 + focusF * 0.5 + pulse.current * 0.7 + surge.current * 1.5;
      const speedMul = 1 + focusF * 0.85 + surge.current * 1.4;
      t += reduced ? 0 : dt * speedMul;

      const act = mouse.current.activity;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (const line of LINES) {
        const baseY = line.baseline * H;
        ctx.lineWidth = line.width;
        ctx.strokeStyle = `rgba(${line.rgb},${line.alpha})`;
        ctx.beginPath();
        for (let x = 0; x <= W; x += STEP) {
          let bump = 0;
          let bendY = 0;
          if (act > 0.002) {
            const dx = x - mx;
            bump = Math.exp(-(dx * dx) / (2 * CURSOR_SIGMA * CURSOR_SIGMA)) * act;
            bendY = (my - baseY) * bump * 0.32; // pull the line toward the cursor nearby
          }
          // moving amplitude envelope → real peaks and quiet valleys
          const shaped = Math.pow(
            0.5 + 0.5 * Math.sin((x / line.env) * TAU - t * line.envSpeed + line.phase * 0.6),
            line.envPow,
          );
          const envelope = line.envFloor + (1 - line.envFloor) * shaped;
          let amp = line.amp * ampMul * envelope * (1 + bump * 1.7);
          if (amp > MAX_AMP) amp = MAX_AMP;
          const y = baseY + bendY + amp * Math.sin((x / line.carrier) * TAU - t * line.speed + line.phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
