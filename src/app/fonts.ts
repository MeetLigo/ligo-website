import localFont from "next/font/local";
import { Caveat } from "next/font/google";

// Display font — self-hosted from the export (weights 400–700).
export const bricolage = localFont({
  src: [
    { path: "../fonts/BricolageGrotesque-latin.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/BricolageGrotesque-latin-ext.woff2", weight: "400 700", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

// Handwritten polaroid captions — was a Google Fonts CDN <link>, now via next/font.
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});
