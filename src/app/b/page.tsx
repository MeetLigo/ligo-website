import { Landing } from "@/components/home/Landing";
import { HomeFooter } from "@/components/home/HomeFooter";

/**
 * Version B of the homepage for async comparison (Micah, 8/29): same page,
 * campus-connector hero copy instead of "Your social scene starts here."
 * Unlinked and noindex; delete this route once a winner is picked.
 */
export const metadata = {
  title: "Ligo · Everything happening on your campus.",
  robots: { index: false },
};

const CONNECTOR_COPY = {
  pre: "Everything happening",
  accent: "on your campus.",
  sub: "Every club, every event, and everyone going. One app.",
};

export default function HomePageB() {
  return (
    <main className="bg-[#171717]">
      <Landing copy={CONNECTOR_COPY} />
      <HomeFooter />
    </main>
  );
}
