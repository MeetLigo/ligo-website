"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Polaroids getting roughly tossed onto a table, on an endless loop. One at a
 * time, a print spins in from above and slaps down at a fresh random spot and
 * angle — never the same place twice — while the whole table stays filled. Under
 * the hood it's a jittered grid (so coverage stays even) with big random jitter +
 * spin (so it reads as thrown, not arranged). Honors reduced-motion.
 *
 * PENDING LICENSE (Death to Stock) — Agustín Farías / Ivan Resnik / Shauna Summers
 * / Seth Dunlop clips + stills. Add/swap prints in /public/home (po-NN.jpg) and
 * bump PHOTO_COUNT.
 */
const PHOTO_COUNT = 38;
const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => `/home/po-${String(i + 1).padStart(2, "0")}.jpg`);

const DEAL_MS = 1500;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Slot = { key: number; src: string; x: number; y: number; rot: number; spin: number; dx: number; dy: number; z: number; delay: number };

export function PolaroidTable() {
  const [grid, setGrid] = useState({ cols: 6, rows: 4 });
  const [reduced, setReduced] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const keyc = useRef(0);
  const zc = useRef(0);
  const pc = useRef(0);
  const tick = useRef(0);

  // toss a print into cell (col,row): random spot within/around the cell, random
  // angle + spin. Math.random only runs in effects/handlers (never SSR render).
  function toss(col: number, row: number, cols: number, rows: number, delay = 0): Slot {
    const cw = 100 / cols;
    const ch = 100 / rows;
    const cx = (col + 0.5) * cw;
    const cy = (row + 0.5) * ch;
    const dir = Math.random() < 0.5 ? -1 : 1; // slides in from left or right
    return {
      key: ++keyc.current,
      src: PHOTOS[pc.current++ % PHOTOS.length],
      x: clamp(cx + (Math.random() - 0.5) * cw * 1.3, 5, 95),
      y: clamp(cy + (Math.random() - 0.5) * ch * 1.3, 7, 93),
      rot: Math.random() * 30 - 15,
      spin: dir * (90 + Math.random() * 160), // spins the way it's thrown
      dx: dir * (340 + Math.random() * 240), // travels across the table...
      dy: (Math.random() - 0.5) * 300, // ...with some drift
      z: ++zc.current,
      delay,
    };
  }

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mqReduce.matches);
    const seed = () => {
      const cols = mqMobile.matches ? 4 : 6;
      const rows = mqMobile.matches ? 3 : 4;
      keyc.current = 0;
      zc.current = 0;
      pc.current = 0;
      tick.current = 0;
      setGrid({ cols, rows });
      setSlots(
        Array.from({ length: cols * rows }, (_, i) => toss(i % cols, Math.floor(i / cols), cols, rows, (i % 12) * 0.09)),
      );
    };
    seed();
    mqMobile.addEventListener("change", seed);
    return () => mqMobile.removeEventListener("change", seed);
  }, []);

  // the endless toss — re-throw one cell at a time, round-robin
  useEffect(() => {
    if (reduced || slots.length === 0) return;
    const { cols, rows } = grid;
    const n = cols * rows;
    const id = window.setInterval(() => {
      const idx = tick.current % n;
      tick.current += 1;
      setSlots((prev) => prev.map((s, i) => (i === idx ? toss(idx % cols, Math.floor(idx / cols), cols, rows) : s)));
    }, DEAL_MS);
    return () => window.clearInterval(id);
  }, [reduced, grid, slots.length]);

  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[1140px] sm:h-[480px]">
      {slots.map((s, i) => (
        <AnimatePresence key={i} mode="popLayout">
          <motion.figure
            key={s.key}
            initial={reduced ? false : { opacity: 0, scale: 1.06, x: s.dx, y: s.dy, rotate: s.rot + s.spin }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: s.rot }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.6, ease: "easeOut" } }}
            // slides across the surface and skids to a stop — a friction-style decel, no bounce
            transition={{ duration: 1.15, ease: [0.19, 0.86, 0.24, 1], opacity: { duration: 0.3 }, delay: s.delay }}
            className="absolute w-[100px] rounded-[7px] bg-white p-[6px] pb-[17px] shadow-[0_18px_38px_-14px_rgba(20,17,13,0.6)] sm:w-[148px]"
            style={{ left: `${s.x}%`, top: `${s.y}%`, translate: "-50% -50%", zIndex: s.z, willChange: "transform" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" loading="lazy" className="block aspect-square w-full rounded-[3px] object-cover" />
          </motion.figure>
        </AnimatePresence>
      ))}
    </div>
  );
}
