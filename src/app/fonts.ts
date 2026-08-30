import { Caveat, Inter } from "next/font/google";

// Body / UI font for the charcoal homepage redesign.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Handwritten polaroid captions, served via next/font instead of a CDN link.
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});
