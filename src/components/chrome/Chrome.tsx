"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * The homepage ("/") renders SiteHeader itself inside its hero (over the photo)
 * and HomeFooter via page.tsx. Every other page gets the SAME header — absolutely
 * positioned over the page's hero band so the structure matches home exactly —
 * plus the shared footer, over the charcoal canvas.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // home draws its own header inside the hero; the Studio is a full-screen app
  if (pathname === "/" || pathname.startsWith("/studio")) return <>{children}</>;
  return (
    <div className="relative flex min-h-screen flex-col bg-[#171717] text-[#FAF6EF]">
      <header className="absolute inset-x-0 top-0 z-40">
        <SiteHeader />
      </header>
      <div className="flex-1">{children}</div>
      <HomeFooter />
    </div>
  );
}
