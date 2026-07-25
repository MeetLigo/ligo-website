import type { Metadata } from "next";
import { OriginSection } from "@/components/about/OriginSection";
import { TeamSection } from "@/components/about/TeamSection";
import { AdvisorsSection } from "@/components/about/AdvisorsSection";
export const metadata: Metadata = {
  title: "About · Ligo",
  description: "How Ligo started, the team building it, and the advisors in our corner.",
};

export default function AboutPage() {
  return (
    <main className="animate-riseIn">
      <OriginSection />
      <TeamSection />
      <AdvisorsSection />
    </main>
  );
}
