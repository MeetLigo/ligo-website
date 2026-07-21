"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Deepest ambient layer behind the hero: two faded, blurred, muted video loops
 * that slowly crossfade into each other. Texture and warmth, not a feature —
 * low opacity, heavily blurred, never competing with the waveform or text.
 *
 * PENDING LICENSE — Death to Stock ("Get Down", Seth Dunlop clips ID274 / ID278),
 * processed to seamless 5s / 540p loops in /public/hero. Swappable: replace
 * ambient-a.mp4 / ambient-b.mp4 if the rights change.
 *
 * Mobile: drops to a single video (half the bytes) — still ambient motion, but
 * lighter on data. Reduced-motion: no video at all (the warm gradient carries).
 */
const SOURCES = ["/hero/ambient-a.mp4", "/hero/ambient-b.mp4"];
const LAYER_OPACITY = 0.47;

export function AmbientVideo({ start = true }: { start?: boolean }) {
  const [ready, setReady] = useState(false); // ease the whole layer in
  const [active, setActive] = useState(0); // which clip is currently shown
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const decided = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMobile(mq.matches);
    setReduced(rm.matches);
    decided.current = true;
    const onMq = () => setMobile(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  // Fade the layer in only once the intro/load-in has resolved (so they don't
  // fight). `start` flips true when the intro is done (or immediately if skipped).
  useEffect(() => {
    if (!start) return;
    const t = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(t);
  }, [start]);

  // slow crossfade between the two clips (desktop only)
  useEffect(() => {
    if (mobile || reduced) return;
    const iv = window.setInterval(() => setActive((a) => (a === 0 ? 1 : 0)), 7000);
    return () => window.clearInterval(iv);
  }, [mobile, reduced]);

  if (reduced && decided.current) return null; // reduced motion → warm gradient only

  const list = mobile ? SOURCES.slice(0, 1) : SOURCES;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-[1200ms]"
      style={{ opacity: ready ? LAYER_OPACITY : 0 }}
    >
      {list.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.75; // calmer, less chaotic loop
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms]"
          style={{
            opacity: mobile ? 1 : i === active ? 1 : 0,
            filter: "blur(14px) saturate(1.05)",
            transform: "scale(1.12)", // hide blurred edges
          }}
        />
      ))}
    </div>
  );
}
