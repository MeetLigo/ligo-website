"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Polaroids tossed onto a table, on an endless loop. Each flies in from above
 * with a spin and slaps down into a scattered rest spot — varied angle, height
 * and overlap, so the pile reads as thrown, not arranged. On a stagger it keeps
 * re-throwing one slot at a time, cycling a fresh photo in. Honors reduced-motion.
 *
 * PENDING LICENSE (Death to Stock) — VINYL_TASTE (Ivan Resnik), DIVE_BAR /
 * BEHIND_THE_SCENES / BEDROOM_DJ / LAST_PERIOD (Agustín Farías / Shauna Summers),
 * SUITE_TALK, Young_Latin. Swap / add prints in /public/home + this list.
 */
const PHOTOS = [
  "/home/po-records-flip.jpg",
  "/home/po-friends-laugh.jpg",
  "/home/po-dj-hands.jpg",
  "/home/po-bar-friends.jpg",
  "/home/po-ice-cream.jpg",
  "/home/po-record-pull.jpg",
  "/home/po-camera-grass.jpg",
  "/home/po-boombox.jpg",
  "/home/po-turntable.jpg",
  "/home/po-camera-guy.jpg",
  "/home/po-pink-wall.jpg",
  "/home/po-red-car.jpg",
];

// Scattered rest spots (deterministic — no hydration jitter). left = horizontal
// center, top = px down the "table", rot = resting tilt. Deliberately uneven.
const DESKTOP = [
  { left: "15%", top: 40, rot: -11 },
  { left: "33%", top: 8, rot: 8 },
  { left: "50%", top: 58, rot: -5 },
  { left: "67%", top: 16, rot: 13 },
  { left: "85%", top: 46, rot: -9 },
];
const MOBILE = [
  { left: "24%", top: 34, rot: -12 },
  { left: "52%", top: 8, rot: 9 },
  { left: "77%", top: 40, rot: -7 },
];

const DEAL_MS = 1150; // time between tosses

type Cell = { idx: number; z: number };

export function PolaroidTable() {
  const [pos, setPos] = useState(DESKTOP);
  const [reduced, setReduced] = useState(false);
  const [cells, setCells] = useState<Cell[]>([]);
  const zc = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seed = () => {
      const layout = mqMobile.matches ? MOBILE : DESKTOP;
      zc.current = layout.length;
      tick.current = 0;
      setPos(layout);
      setCells(layout.map((_, i) => ({ idx: i % PHOTOS.length, z: i })));
    };
    seed();
    setReduced(mqReduce.matches);
    mqMobile.addEventListener("change", seed);
    return () => mqMobile.removeEventListener("change", seed);
  }, []);

  useEffect(() => {
    if (reduced || cells.length === 0) return;
    const n = cells.length;
    const id = window.setInterval(() => {
      const slot = tick.current % n;
      tick.current += 1;
      setCells((prev) =>
        prev.map((c, i) => (i === slot ? { idx: (c.idx + n) % PHOTOS.length, z: ++zc.current } : c)),
      );
    }, DEAL_MS);
    return () => window.clearInterval(id);
  }, [reduced, cells.length]);

  return (
    <div className="relative mx-auto h-[280px] w-full max-w-[880px] sm:h-[320px]">
      {cells.map((c, i) => {
        const p = pos[i];
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2"
            style={{ left: p.left, top: p.top, zIndex: c.z }}
          >
            <AnimatePresence mode="popLayout" initial={!reduced}>
              <motion.figure
                key={c.idx}
                initial={reduced ? false : { y: -170, x: p.rot > 0 ? 46 : -46, rotate: p.rot > 0 ? 26 : -26, scale: 1.14, opacity: 0 }}
                animate={{ y: 0, x: 0, rotate: p.rot, scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.92, y: 14, transition: { duration: 0.25, ease: "easeIn" } }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  opacity: { duration: 0.2 },
                  delay: reduced ? 0 : i * 0.09,
                }}
                className="w-[128px] rounded-[7px] bg-white p-[7px] pb-[22px] shadow-[0_18px_38px_-14px_rgba(20,17,13,0.6)] sm:w-[172px]"
                style={{ willChange: "transform" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS[c.idx]} alt="" className="block aspect-square w-full rounded-[3px] object-cover" />
              </motion.figure>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
