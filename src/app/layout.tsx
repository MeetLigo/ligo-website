import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caveat.variable} ${inter.variable}`}>
      {/* Gelica, licensed via Micah's Adobe Fonts kit (weights 300-700 + italics) */}
      <link rel="stylesheet" href="https://use.typekit.net/tjf6yyv.css" precedence="default" />
      <body className="font-sans">
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
