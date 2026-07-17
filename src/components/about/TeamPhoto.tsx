"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Team headshot. Renders the real photo when present, and gracefully falls
 * back to the on-brand Placeholder tile if the file is missing (e.g. before
 * the team/advisor photos are dropped into /public/team).
 *
 * Plain <img>, not next/image: a missing static file returns a real 404 so we
 * can detect failure. next/image routes through the optimizer, which for a
 * missing source hangs instead of erroring, so its fallback never triggers.
 *
 * The onError handler alone isn't enough: the img is server-rendered, so the
 * 404 can fire before React hydrates and attaches the handler. The effect
 * re-checks on mount (complete && naturalWidth === 0 === already failed).
 */
export function TeamPhoto({
  src,
  alt,
  placeholderLabel,
}: {
  src?: string;
  alt: string;
  placeholderLabel: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) return <Placeholder label={placeholderLabel} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
