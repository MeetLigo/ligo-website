import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Ligo — Connect through music.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social share card for meetligo.com — shown on iMessage/Slack/Twitter/etc.
 * when the bare domain (or any page without its own opengraph-image) is shared.
 * Kept intentionally simple: brand mark, wordmark, one-line tagline, domain —
 * matches the site's ink/amber palette without depending on custom fonts.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#130F0A",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(232,162,76,0.22), transparent 55%), radial-gradient(circle at 85% 85%, rgba(90,166,224,0.16), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 30,
            background: "linear-gradient(135deg, #F5D783, #F97316)",
            marginBottom: 36,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#EFE8DB",
            letterSpacing: "-0.02em",
          }}
        >
          Ligo
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 34,
            color: "#E8A24C",
            fontStyle: "italic",
          }}
        >
          Connect through music.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 24,
            color: "rgba(239,232,219,0.5)",
            letterSpacing: "0.08em",
          }}
        >
          MEETLIGO.COM
        </div>
      </div>
    ),
    { ...size }
  );
}
