"use client";

import { useEffect } from "react";

const DEEP_LINK = "ligo://notifications";
const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";

export default function NotificationsRedirect() {
  useEffect(() => {
    window.location.href = DEEP_LINK;
    const t = setTimeout(() => {
      // Only fall back if the app didn't take over the screen.
      if (!document.hidden) window.location.href = APP_STORE;
    }, 1800);
    const cancel = () => clearTimeout(t);
    document.addEventListener("visibilitychange", cancel);
    window.addEventListener("pagehide", cancel);
    return () => {
      clearTimeout(t);
      document.removeEventListener("visibilitychange", cancel);
      window.removeEventListener("pagehide", cancel);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        backgroundColor: "#FAF6EF",
        color: "#171717",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "Gelica, Georgia, 'Times New Roman', serif",
          fontWeight: 500,
          fontSize: "34px",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
          margin: 0,
        }}
      >
        Opening Ligo&hellip;
      </h1>
      <p style={{ fontSize: "16px", lineHeight: 1.6, margin: 0, maxWidth: "420px" }}>
        Taking you to your notification settings. If nothing happens, tap the
        button below.
      </p>
      <a
        href={DEEP_LINK}
        style={{
          display: "inline-block",
          backgroundColor: "#F97316",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          textDecoration: "none",
          padding: "14px 32px",
          borderRadius: "999px",
        }}
      >
        Open Ligo
      </a>
      <p style={{ fontSize: "13px", color: "#8A857E", margin: 0 }}>
        Don&rsquo;t have the app yet?{" "}
        <a href={APP_STORE} style={{ color: "#8A857E", textDecoration: "underline" }}>
          Get Ligo on the App Store
        </a>
      </p>
    </main>
  );
}
