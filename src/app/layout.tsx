import type { Metadata } from "next";
import "./globals.css";
import { caveat, inter } from "./fonts";
import { DrawerProvider } from "@/components/chrome/DrawerProvider";
import { Chrome } from "@/components/chrome/Chrome";
import { NavDrawer } from "@/components/chrome/NavDrawer";

const TITLE = "Ligo · Your social scene starts here.";
const DESCRIPTION =
  "Ligo is a social app for college campuses. Every club and event in one place. See what's on tonight, who's going, and walk in with a plan.";

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
          <div className="relative min-h-screen overflow-x-hidden bg-[#130F0A] text-[#EFE8DB]">
            <Chrome>{children}</Chrome>
          </div>
          <NavDrawer />
        </DrawerProvider>
      </body>
    </html>
  );
}
