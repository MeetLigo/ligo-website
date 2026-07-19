"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { driftPhotos } from "@/lib/content";

/**
 * The payoff motion: campus/party/music photos rain down and settle, framing
 * the reveal. They are the reward — not wallpaper — so they only appear after
 * someone answers. Entrance = fall from above; then a gentle perpetual bob.
 */
export function PhotoDrift() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {driftPhotos.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size }}
          initial={{ opacity: 0, y: -240, rotate: p.rotate * 1.6 }}
          animate={{ opacity: 0.9, y: 0, rotate: p.rotate }}
          transition={{ delay: p.delay, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="animate-floatY rounded-[8px] bg-white px-[7px] pb-[5px] pt-[7px] shadow-polaroid" style={{ animationDelay: `${p.delay}s` }}>
            <div className="relative aspect-square overflow-hidden rounded-[5px] bg-photo-bg">
              <Image src={`/photos/${p.src}`} alt="" fill sizes="160px" className="object-cover" draggable={false} />
            </div>
            <div className="mt-[5px] text-center font-hand text-[16px] font-semibold leading-tight text-ink">
              {p.caption}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
