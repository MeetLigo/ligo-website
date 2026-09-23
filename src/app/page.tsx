import { Landing } from "@/components/home/Landing";
import { LatestPosts } from "@/components/home/LatestPosts";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * The homepage: audience-split hero over the campus slideshow, then the club
 * logo strip, then the latest posts, then the footer.
 *
 * LatestPosts fetches on the server and renders nothing when there is nothing
 * to show, so this stays a plain composition. It cannot live inside Landing,
 * which is a client component - see its own header.
 */
export default async function HomePage() {
  return (
    <main className="bg-[#171717]">
      <Landing />
      <LatestPosts />
      <HomeFooter />
    </main>
  );
}
