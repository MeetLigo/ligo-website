import { Hero } from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main>
      {/* Hero owns the flow: face + "Name a song" → reveal (with the album-art +
          tour-dates payoff beat). The old polaroid "pictures" section was removed —
          the tour module in the reveal is the payoff now. Components kept in the
          repo (HowItWorks / PolaroidTable) in case they move to a Playground. */}
      <Hero />
    </main>
  );
}
