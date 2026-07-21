"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A row of slightly-tilted polaroids that get "tossed onto the table" one at a
 * time — each flies in from above with a spin and slaps down into a rest tilt.
 * The loop never ends: on a stagger it re-throws one slot at a time, cycling a
 * fresh photo onto the table. Honors prefers-reduced-motion (static row).
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

// per-slot resting tilt (degrees) — a lazy scatter, not a clean grid
const TILTS = [-6, 5, -4, 6, -5, 4, -3, 6];

const DEAL_MS = 1150; // time between tosses

type Cell = { idx: number; z: number };

export function PolaroidTable() {
  const [slots, setSlots] = useState(5);
  const [reduced, setReduced] = useState(false);
  const [cells, setCells] = useState<Cell[]>([]);
  const zc = useRef(0); // ever-incrementing z so the newest toss lands on top
  const tick = useRef(0); // round-robin cursor over the slots

  // responsive slot count (+ reduced motion), re-seed the row on resize
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seed = () => {
      const n = mqMobile.matches ? 3 : 5;
      zc.current = n;
      tick.current = 0;
      setSlots(n);
      setCells(Array.from({ length: n }, (_, i) => ({ idx: i % PHOTOS.length, z: i })));
    };
    seed();
    setReduced(mqReduce.matches);
    mqMobile.addEventListener("change", seed);
    return () => mqMobile.removeEventListener("change", seed);
  }, []);

  // the endless deal — re-throw one slot at a time
  useEffect(() => {
    if (reduced || cells.length === 0) return;
    const id = window.setInterval(() => {
      const slot = tick.current % slots;
      tick.current += 1;
      setCells((prev) =>
        prev.map((c, i) =>
          i === slot ? { idx: (c.idx + slots) % PHOTOS.length, z: ++zc.current } : c,
        ),
      );
    }, DEAL_MS);
    return () => window.clearInterval(id);
  }, [reduced, slots, cells.length]);

  return (
    <div className="relative mx-auto flex min-h-[260px] items-center justify-center overflow-hidden px-2 sm:min-h-[320px]">
      {cells.map((c, i) => (
        <div key={i} className={i > 0 ? "relative -ml-5 sm:-ml-7" : "relative"} style={{ zIndex: c.z }}>
          <AnimatePresence mode="popLayout" initial={!reduced}>
            <motion.figure
              key={c.idx}
              initial={reduced ? false : { y: -160, x: 32, rotate: 22, scale: 1.12, opacity: 0 }}
              animate={{ y: 0, x: 0, rotate: TILTS[i % TILTS.length], scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.92, y: 14, transition: { duration: 0.25, ease: "easeIn" } }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 19,
                opacity: { duration: 0.2 },
                delay: reduced ? 0 : i * 0.08,
              }}
              className="w-[132px] rounded-[7px] bg-white p-[7px] pb-[22px] shadow-[0_16px_36px_-14px_rgba(20,17,13,0.55)] sm:w-[176px]"
              style={{ willChange: "transform" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTOS[c.idx]} alt="" className="block aspect-square w-full rounded-[3px] object-cover" />
            </motion.figure>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
