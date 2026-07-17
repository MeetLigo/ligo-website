"use client";

import { useState } from "react";
import Image from "next/image";
import { polaroids } from "@/lib/content";
import { Polaroid } from "./Polaroid";
import { SubmitModal, type NewCard } from "./SubmitModal";

interface UserCard extends NewCard {
  left: string;
  top: string;
  rotate: number;
}

/**
 * The wall of polaroids behind the hero prompt. Snapshots toss in on load,
 * can be dragged, and students can pin their own via the "add yours" tile.
 */
export function PolaroidCollage() {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);

  function addCard(card: NewCard) {
    // Optimistic local drop — see SubmitModal for the backend seam.
    const rotate = +(Math.random() * 16 - 8).toFixed(1);
    const left = `${(28 + Math.random() * 44).toFixed(0)}%`;
    const top = `${(18 + Math.random() * 54).toFixed(0)}%`;
    setUserCards((prev) => [...prev, { ...card, left, top, rotate }]);
  }

  return (
    <>
      {/* base polaroids */}
      {polaroids.map((p, i) => {
        if (p.addTile) {
          return (
            <Polaroid
              key={`add-${i}`}
              pos={p.pos}
              width={p.width}
              rotate={p.rotate}
              delay={p.delay}
              z={8}
              draggable={false}
              dashed
              onClick={() => setSubmitOpen(true)}
              caption="add yours →"
              captionClassName="text-ember"
            >
              <div className="flex h-full w-full items-center justify-center bg-flame/[0.09] text-flame">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </Polaroid>
          );
        }
        return (
          <Polaroid
            key={`${p.src}-${i}`}
            pos={p.pos}
            width={p.width}
            rotate={p.rotate}
            delay={p.delay}
            small={p.small}
            caption={p.caption}
            captionClassName="text-ink"
          >
            <Image
              src={`/photos/${p.src}`}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
              draggable={false}
            />
          </Polaroid>
        );
      })}

      {/* soft glow so the center prompt stays legible over the wall */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(ellipse,rgba(255,247,233,0.86),rgba(255,247,233,0) 68%)",
        }}
      />

      {/* student-submitted cards */}
      {userCards.map((c, i) => (
        <Polaroid
          key={`user-${i}`}
          pos={{ left: c.left, top: c.top }}
          width={150}
          rotate={c.rotate}
          z={29}
          caption={c.caption}
          captionClassName="text-ink"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.img} alt="" className="pointer-events-none h-full w-full object-cover" />
        </Polaroid>
      ))}

      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} onAdd={addCard} />
    </>
  );
}
