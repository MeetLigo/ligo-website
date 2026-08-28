import localFont from "next/font/local";
import { Caveat, Inter } from "next/font/google";

// Body / UI font for the charcoal homepage redesign.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// THE brand display face (8/28: on brand is Gelica + Inter, nothing else).
// Self-hosted from the design-system export. CAUTION: two files are mislabeled
// on disk; the weights/styles below follow each file's INTERNAL name table
// (Gelica-Extra-Light.otf = ExtraLight Italic, Gelica-Medium.otf = Medium
// Italic), verified with fontTools.
export const gelica = localFont({
  src: [
    { path: "../fonts/Gelica-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/Gelica-Regular.otf", weight: "400 500", style: "normal" },
    { path: "../fonts/Gelica-Bold.otf", weight: "600 700", style: "normal" },
    { path: "../fonts/Gelica-Extra-Light.otf", weight: "200 300", style: "italic" },
    { path: "../fonts/Gelica-Italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/Gelica-Medium.otf", weight: "500 700", style: "italic" },
  ],
  variable: "--font-gelica",
  display: "swap",
});

// Handwritten polaroid captions, served via next/font instead of a CDN link.
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});
