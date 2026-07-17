"use client";

import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface NewCard {
  img: string;
  caption: string;
}

interface SubmitModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (card: NewCard) => void;
}

/**
 * "Pin it to the wall" — student photo submission.
 *
 * UI ONLY. The design gates this to .edu students, but nothing here persists
 * or verifies anything: the preview is a local FileReader data URL and the
 * card is dropped onto the wall in local state only.
 *
 * TODO(backend): gate on a verified .edu email, then upload the file to
 * storage and create the submission server-side. The `onAdd` optimistic drop
 * can stay, but the real flow replaces the seam marked below.
 */
export function SubmitModal({ open, onClose, onAdd }: SubmitModalProps) {
  const [img, setImg] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  function reset() {
    setImg(null);
    setCaption("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview only — no upload.
    const reader = new FileReader();
    reader.onload = () => setImg(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!img) return;
    // TODO(backend): verify .edu email + POST { file, caption } to the
    // submissions API here. For now we just drop it on the wall locally.
    onAdd({ img, caption: caption || "my song" });
    reset();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-[22px]">
          <motion.div
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40"
          />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative w-full max-w-[380px] rounded-3xl bg-white p-6 shadow-modal"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">
                pin it to the wall
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink/5 text-[15px] text-ink"
              >
                ✕
              </button>
            </div>

            <h3 className="my-2 mb-[18px] font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
              Add your photo
            </h3>

            <label className="mx-auto mb-4 block w-[190px] -rotate-3 cursor-pointer rounded-lg border border-dashed border-flame/55 bg-white px-[10px] pb-2 pt-[10px] shadow-[0_16px_30px_-18px_rgba(20,17,13,0.4)]">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-photo-bg-2">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-ink/40">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <rect x="3" y="6" width="18" height="14" rx="2" />
                      <circle cx="12" cy="13" r="3.4" />
                      <path d="M8 6l1.4-2h5.2L16 6" />
                    </svg>
                    <div className="mt-[6px] text-xs">tap to choose a photo</div>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <div className="mt-[6px] min-h-[22px] text-center font-hand text-[20px] font-semibold leading-tight text-ink">
                {caption}
              </div>
            </label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={26}
              placeholder="caption it — keep it short"
              className="mb-[14px] w-full rounded-[14px] border border-ink/10 bg-cream px-4 py-3 text-[15px] text-ink"
            />

            <button
              onClick={handleSubmit}
              className="h-[50px] w-full rounded-[14px] bg-flame font-display text-base font-semibold text-white shadow-cta transition-transform active:scale-[0.97]"
            >
              toss it on the wall →
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
