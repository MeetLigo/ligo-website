import type { Config } from "tailwindcss";

/**
 * Design tokens extracted from the Claude Design export (Ligo Website.dc.html).
 * Components reference these names — never raw hex.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7E9", // page background
        ink: "#14110D", // primary text, drawer, footer, dark cards
        flame: "#F97316", // primary / CTA orange
        ember: "#EA580C", // links, eyebrows (deeper orange)
        gold: "#F5D783", // highlights, ::selection, "now playing"
        amber: "#EBBE4E", // gold gradients, logo glow
        sky: "#9BD8EC", // light blue (hero, partner gradient)
        "sky-deep": "#4FA6CB", // blue category / icon
        mist: "#B9E4F1", // hero gradient top
        mint: "#DCEFE9", // hero gradient mid
        grass: "#71C07F", // check marks, "local business"
        grape: "#A13D99", // blog / clubs category
        blush: "#EA8CE1", // Google Play accent
        // neutral surfaces used inside polaroids / placeholders
        "photo-bg": "#ECE9E2",
        "photo-bg-2": "#F3EFE7",
      },
      fontFamily: {
        // display headings + captions + body
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
        sans: ["-apple-system", "SF Pro Display", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.16em",
        wordmark: "-0.045em",
        tightest: "-0.03em",
      },
      fontSize: {
        // clamp-based type scale from the export
        hero: ["clamp(38px,6vw,66px)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "page-title": ["clamp(34px,5vw,54px)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "page-title-lg": ["clamp(34px,5.2vw,56px)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "section-title": ["clamp(28px,4vw,40px)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "done-title": ["clamp(30px,5vw,48px)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        eyebrow: ["11px", { lineHeight: "1", letterSpacing: "0.16em" }],
      },
      boxShadow: {
        polaroid: "0 18px 34px -18px rgba(20,17,13,0.5)",
        "polaroid-lg": "0 22px 42px -18px rgba(20,17,13,0.6)",
        cta: "0 12px 28px -8px rgba(249,115,22,0.55)",
        card: "0 6px 18px -12px rgba(20,17,13,0.15)",
        modal: "0 40px 80px -30px rgba(20,17,13,0.5)",
        logo: "0 4px 14px -6px rgba(233,190,78,0.9)",
      },
      keyframes: {
        tossIn: {
          "0%": { opacity: "0", transform: "translateY(-70px) scale(.82) rotate(10deg)" },
          "55%": { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1) rotate(0)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseDot: {
          "0%": { transform: "scale(1)", opacity: ".85" },
          "70%": { transform: "scale(2.4)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        eq: {
          "0%,100%": { height: "4px" },
          "50%": { height: "15px" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        floatY: "floatY 7s ease-in-out infinite",
        pulseDot: "pulseDot 1.8s ease-out infinite",
        riseIn: "riseIn .45s cubic-bezier(.2,.7,.2,1) both",
        eq: "eq .9s ease-in-out infinite",
        marquee: "marquee 16s linear infinite",
        "marquee-slow": "marquee 34s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
