"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Deepest ambient layer behind the hero: one faded, blurred, muted montage that
 * loops — DJ + dancing clips cut into ~3s beats and edited together. Texture and
 * warmth, not a feature: low opacity, heavily blurred, plays at 0.75x so it never
 * competes with the waveform or text.
 *
 * PENDING LICENSE — Death to Stock ("Room Sessions", Agustín Farías clips
 * ID506 / ID515 / ID516), cut + concatenated to /public/hero/room-montage.mp4.
 * Swappable: replace that file if the rights change.
 *
 * Reduced-motion: no video at all (the warm gradient carries).
 */
const SOURCE = "/hero/room-montage.mp4";
const LAYER_OPACITY = 0.47;

export function AmbientVideo({ start = true }: { start?: boolean }) {
  const [ready, setReady] = useState(false); // ease the whole layer in
  const [reduced, setReduced] = useState(false);
  const decided = useRef(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    decided.current = true;
  }, []);

  // Fade the layer in only once the intro/load-in has resolved (so they don't
  // fight). `start` flips true when the intro is done (or immediately if skipped).
  useEffect(() => {
    if (!start) return;
    const t = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(t);
  }, [start]);

  if (reduced && decided.current) return null; // reduced motion → warm gradient only

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-[1200ms]"
      style={{ opacity: ready ? LAYER_OPACITY : 0 }}
    >
      <video
        src={SOURCE}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = 0.75; // calmer, less chaotic
        }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: "blur(14px) saturate(1.05)",
          transform: "scale(1.12)", // hide blurred edges
        }}
      />
    </div>
  );
}
