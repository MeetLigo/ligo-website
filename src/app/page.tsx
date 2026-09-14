import { Landing } from "@/components/home/Landing";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * The homepage: audience-split hero over the campus slideshow, then the club
 * logo strip, then the footer.
 */
export default function HomePage() {
  return (
    <main className="bg-[#171717]">
      <Landing />
      <HomeFooter />
    </main>
  );
}
