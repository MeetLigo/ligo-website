"use client";

import { usePathname } from "next/navigation";
import { FloatingLogo } from "./FloatingLogo";
import { NavDrawer } from "./NavDrawer";
import { Footer } from "./Footer";

/**
 * The homepage ("/") ships its own charcoal nav + footer (HomeHero / HomeFooter),
 * so the shared warm chrome is suppressed there and rendered on every other page.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <>
      {!isHome && <FloatingLogo />}
      {!isHome && <NavDrawer />}
      {children}
      {!isHome && <Footer />}
    </>
  );
}
