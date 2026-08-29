import { Landing } from "@/components/home/Landing";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * The homepage: broad-ethos landing (audience-split hero over the slideshow →
 * club strip → club benefits → claim band) → footer. The music-era hero
 * (HomeHero) and home FAQ strip are retired from this page but kept in the
 * tree for reference.
 */
export default function HomePage() {
  return (
    <main className="bg-[#171717]">
      <Landing />
      <HomeFooter />
    </main>
  );
}
