import { HomeHero } from "@/components/home/HomeHero";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeFaq } from "@/components/faq/FaqList";

/**
 * The homepage flow: hero ("Meet people through music" → name a song) → the
 * board (paper chart + polaroid anthem) → the students' FAQ strip → footer.
 */
export default function HomePage() {
  return (
    <main className="bg-[#130F0A]">
      <HomeHero />
      <HomeFaq />
      <HomeFooter />
    </main>
  );
}
