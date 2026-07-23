import { HomeHero } from "@/components/home/HomeHero";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * Charcoal homepage (ported from the design export). The hero owns the flow —
 * "Meet people through music" → name a song → the live Ligo chart reveal + board
 * lock — over the shared Spotify search + Supabase board wiring.
 */
export default function HomePage() {
  return (
    <main className="bg-[#0E1216]">
      <HomeHero />
      <HomeFooter />
    </main>
  );
}
