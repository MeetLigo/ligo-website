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

// Each line: rgb string, vertical position (fraction of height), base amplitude,
// wavelength (px), scroll speed/direction, phase offset, stroke alpha.
// Alpha is CONSTANT — reactivity changes motion/amplitude only, never opacity,
// so the black headline never loses contrast.
const LINES = [
  { rgb: "235,190,78", baseline: 0.3, amp: 16, wavelength: 360, speed: -0.3, phase: 0.6, alpha: 0.1 },
  { rgb: "249,115,22", baseline: 0.4, amp: 26, wavelength: 300, speed: 0.5, phase: 0.0, alpha: 0.16 },
  { rgb: "79,166,203", baseline: 0.5, amp: 22, wavelength: 240, speed: -0.4, phase: 1.2, alpha: 0.15 },
  { rgb: "234,88,12", baseline: 0.62, amp: 18, wavelength: 200, speed: 0.7, phase: 2.3, alpha: 0.12 },
];

const CURSOR_SIGMA = 130; // px — how tight the cursor's influence is
const MAX_AMP = 84; // clamp so bursts never fill the hero / crowd the headline

/**
 * Interaction-driven waveform. It reacts to the person rather than looping
 * indifferently: amplitude rises and lines bend toward the cursor, focus pulls
 * energy toward the input, keystrokes pulse, and submit fires one burst.
 */
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
    const STEP = 7;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;

      // smooth easing toward targets; exponential decay for transients
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
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (const line of LINES) {
        const baseY = line.baseline * H;
        ctx.beginPath();
        for (let x = 0; x <= W; x += STEP) {
          let bump = 0;
          let bendY = 0;
          if (act > 0.002) {
            const dx = x - mx;
            bump = Math.exp(-(dx * dx) / (2 * CURSOR_SIGMA * CURSOR_SIGMA)) * act;
            bendY = (my - baseY) * bump * 0.35; // pull the line toward the cursor nearby
          }
          let amp = line.amp * ampMul * (1 + bump * 1.4);
          if (amp > MAX_AMP) amp = MAX_AMP;
          const wave = Math.sin((x / line.wavelength) * Math.PI * 2 - t * line.speed + line.phase);
          const y = baseY + bendY + amp * wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${line.rgb},${line.alpha})`;
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
