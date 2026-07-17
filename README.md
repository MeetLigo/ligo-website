# Ligo Website

Next.js (App Router, TypeScript, Tailwind) rebuild of the Ligo marketing site,
faithful to the Claude Design export in [`/reference`](./reference).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Structure

- `src/app` — routes: `/` (home), `/about`, `/news`, `/partner`, `/faq`
- `src/components/chrome` — floating logo, tracklist drawer, footer (global)
- `src/components/home` — hero flow, polaroid collage, submit modal, how-it-works
- `src/components/{about,news,partner,faq,ui}` — per-page pieces
- `src/lib/content.ts` — all copy/data, ported from the export's `DCLogic`
- `tailwind.config.ts` — palette + type scale tokens (no hex in components)

## Design tokens

Palette and type scale were extracted from the export into
[`tailwind.config.ts`](./tailwind.config.ts). Fonts: **Bricolage Grotesque**
(self-hosted, `src/fonts`) and **Caveat** (via `next/font/google`).

## Interactive stubs — backend comes later

All three are UI-only and persist nothing. Search for `TODO(backend)`:

- **Song input** (`src/components/home/Hero.tsx`) — advances to the email step
  in local state; POST seam marked.
- **Email capture** (`src/components/home/Hero.tsx`) — advances to the done
  state in local state; POST seam marked.
- **Photo upload** (`src/components/home/SubmitModal.tsx`) — local FileReader
  preview only; the `.edu` gate + upload is a marked TODO. (The export's modal
  never actually collected an `.edu` email — left as a seam, not invented UI.)

## Assets & known gaps

- Homepage collage photos, `festival-bg`, and `logo-mark` came from the export.
- The founder photo was recovered from `.image-slots.state.json`
  (the `uuid-*.jpeg` in the export was 0 bytes) → `public/founder.webp`.
- Team headshots, news thumbnails, and the done-state polaroids had **no** real
  images in the export — they render as on-brand `Placeholder` tiles.
- The export's A/B/C "concept switcher" was a design-time control (only Concept
  A was built); it is intentionally omitted.
