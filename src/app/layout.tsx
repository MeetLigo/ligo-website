import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { caveat, inter } from "./fonts";
import { DrawerProvider } from "@/components/chrome/DrawerProvider";
import { Chrome } from "@/components/chrome/Chrome";
import { NavDrawer } from "@/components/chrome/NavDrawer";

const TITLE = "Ligo · The first campus connector app.";
const DESCRIPTION =
  "Ligo is the first campus connector app. Every club, every event, and everyone going. One app.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://meetligo.com"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://meetligo.com",
    siteName: "Ligo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * GA4, gated on the measurement ID (2026-09-16). The site had no analytics at
 * all, so the baseline is zero and the counter has to be running before the
 * blog back catalog or any campaign points people here. The property lives
 * under the Ligo Google Workspace (mekhi@meetligo.com); its ID goes into the
 * Amplify console as NEXT_PUBLIC_GA_MEASUREMENT_ID (see amplify.yml) and this
 * renders nothing until it is there.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caveat.variable} ${inter.variable}`}>
      {/* Gelica, licensed via Micah's Adobe Fonts kit (weights 300-700 + italics) */}
      <link rel="stylesheet" href="https://use.typekit.net/tjf6yyv.css" precedence="default" />
      <body className="font-sans">
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        <DrawerProvider>
          <div className="relative min-h-screen overflow-x-clip bg-[#171717] text-[#FAF6EF]">
            <Chrome>{children}</Chrome>
          </div>
          <NavDrawer />
        </DrawerProvider>
      </body>
    </html>
  );
}
