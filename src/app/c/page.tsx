import { Landing } from "@/components/home/Landing";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * Version C of the homepage for async comparison: category-claim hero
 * ("The first campus connector app.") with version B's subline.
 * Unlinked and noindex; delete this route once a winner is picked.
 */
export const metadata = {
  title: "Ligo · The first campus connector app.",
  robots: { index: false },
};

const CONNECTOR_CLAIM_COPY = {
  pre: "The first",
  accent: "campus connector app.",
  sub: "Every club, every event, and everyone going. One app.",
};

export default function HomePageC() {
  return (
    <main className="bg-[#171717]">
      <Landing copy={CONNECTOR_CLAIM_COPY} />
      <HomeFooter />
    </main>
  );
}
