"use client";

import { useState } from "react";
import Image from "next/image";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Team headshot. Renders the real photo when present, and gracefully falls
 * back to the on-brand Placeholder tile if the file is missing (e.g. before
 * the advisor photos are dropped into /public/team).
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
  if (!src || failed) return <Placeholder label={placeholderLabel} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="240px"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
