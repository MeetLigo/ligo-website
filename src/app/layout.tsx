import type { Metadata } from "next";
import "./globals.css";
import { bricolage, caveat } from "./fonts";
import { DrawerProvider } from "@/components/chrome/DrawerProvider";
import { FloatingLogo } from "@/components/chrome/FloatingLogo";
import { NavDrawer } from "@/components/chrome/NavDrawer";
import { Footer } from "@/components/chrome/Footer";

export const metadata: Metadata = {
  title: "Ligo — Events bring the room. Music tells you who.",
  description:
    "Answer a song, meet your people. Ligo connects students on campus through music taste — no login, no bio, just the song.",
  metadataBase: new URL("https://meetligo.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${caveat.variable}`}>
      <body className="font-sans">
        <DrawerProvider>
          <div className="relative min-h-screen overflow-x-hidden bg-cream text-ink">
            <FloatingLogo />
            <NavDrawer />
            {children}
            <Footer />
          </div>
        </DrawerProvider>
      </body>
    </html>
  );
}
