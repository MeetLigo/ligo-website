"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PolaroidProps {
  pos: { left?: string; right?: string; top?: string; bottom?: string };
  width: number;
  rotate: number;
  delay?: number;
  z?: number;
  small?: boolean;
  draggable?: boolean;
  caption: ReactNode;
  captionClassName?: string;
  /** photo area contents */
  children: ReactNode;
  /** dashed CTA styling for the "add yours" tile */
  dashed?: boolean;
  onClick?: () => void;
  className?: string;
}

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * A single polaroid: tosses in like a snapshot dropped on a table, straightens
 * and lifts on hover, and can be dragged around the wall.
 */
export function Polaroid({
  pos,
  width,
  rotate,
  delay = 0,
  z = 6,
  small = false,
  draggable = true,
  caption,
  captionClassName = "",
  children,
  dashed = false,
  onClick,
  className = "",
}: PolaroidProps) {
  return (
    <motion.div
      className={`absolute touch-none ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{ ...pos, width, zIndex: z }}
      initial={{ opacity: 0, y: -70, scale: 0.82, rotate: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate }}
      transition={{ delay, duration: 0.7, ease: EASE }}
      whileHover={{ rotate: 0, y: -8, zIndex: 26, transition: { duration: 0.18 } }}
      drag={draggable}
      dragMomentum={false}
      whileDrag={{ zIndex: 70, scale: 1.03 }}
    >
      <button
        type={onClick ? "button" : undefined}
        onClick={onClick}
        disabled={!onClick}
        className={`block w-full rounded-[6px] bg-white shadow-polaroid ${
          small ? "px-2 pb-[5px] pt-2" : "px-[9px] pb-[6px] pt-[9px]"
        } ${dashed ? "border border-dashed border-flame/55 transition-transform active:scale-95" : ""} ${
          onClick ? "cursor-pointer" : "cursor-inherit"
        }`}
      >
        <div className="relative aspect-square overflow-hidden rounded-[3px] bg-photo-bg">{children}</div>
        <div
          className={`mt-[6px] text-center font-hand font-semibold leading-tight ${
            small ? "text-[19px]" : "text-[20px]"
          } ${captionClassName}`}
        >
          {caption}
        </div>
      </button>
    </motion.div>
  );
}
