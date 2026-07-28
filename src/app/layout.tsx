import type { Metadata } from "next";
import "./globals.css";
import { bricolage, caveat, fraunces, inter } from "./fonts";
import { DrawerProvider } from "@/components/chrome/DrawerProvider";
import { Chrome } from "@/components/chrome/Chrome";
import { NavDrawer } from "@/components/chrome/NavDrawer";

export const metadata: Metadata = {
  title: "Ligo · Events bring the room. Music tells you who.",
  description:
    "Answer a song, meet your people. Ligo connects students on campus through music taste. No login, no bio, just the song.",
  metadataBase: new URL("https://meetligo.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${caveat.variable} ${fraunces.variable} ${inter.variable}`}>
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
