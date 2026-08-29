import { PhoneFrame } from "@/components/mockups/PhoneFrame";
import { ClubScreen, CreateClubScreen, EventChatScreen, EventDetailScreen, ExploreScreen } from "@/components/mockups/screens";

/**
 * Internal gallery of the phone-mockup library (unlinked from the site nav).
 * One card per marketed feature, shown at the three frame sizes so we can
 * judge how each screen holds up. These components feed site sections, the
 * v3 split hero, and the future Remotion animations.
 */
export const metadata = { title: "Ligo · Mockup library", robots: { index: false } };

const SCREENS = [
  { name: "Explore feed — every club event, one place", node: <ExploreScreen /> },
  { name: "Event detail — say you're going in one tap", node: <EventDetailScreen /> },
  { name: "Event chat — a group chat for every event", node: <EventChatScreen /> },
  { name: "Club page — follow your clubs", node: <ClubScreen /> },
  { name: "Create club — set up in minutes", node: <CreateClubScreen /> },
];

export default function MockupsPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F4] px-8 py-14">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
        <h1 className="font-serif text-[34px] font-medium text-[#171717]">Mockup library</h1>
        <p className="max-w-[60ch] text-[15px] text-[#171717]/[0.6]">
          Internal reference. Each screen at the small, medium, and large frame sizes.
        </p>
        {SCREENS.map((s) => (
          <section key={s.name} className="mt-8 flex flex-col gap-5">
            <h2 className="font-serif text-[20px] font-medium text-[#171717]">{s.name}</h2>
            <div className="flex flex-wrap items-start gap-10">
              <PhoneFrame size="sm">{s.node}</PhoneFrame>
              <PhoneFrame size="md">{s.node}</PhoneFrame>
              <PhoneFrame size="lg">{s.node}</PhoneFrame>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
