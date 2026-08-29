import type { Metadata } from "next";
import { LegalPage, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Community Guidelines · Ligo",
  description: "What we expect from everyone on Ligo.",
};

const UPDATED = "August 17, 2026";
const CONTACT_EMAIL = "support@meetligo.com";

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines" updated={UPDATED}>
      <LegalP>
        Ligo only works if people feel safe using it. These guidelines are the ground rules — on top of our{" "}
        <a href="/terms" className="text-[#F97316] underline underline-offset-2">Terms of Service</a>{" "}
        — for what we expect from everyone in the community. Break them and we&apos;ll act on it, up to and
        including a permanent ban.
      </LegalP>

      <LegalH2>Be a real person, be yourself</LegalH2>
      <LegalP>
        Use your real school email, your real photos, and your real school affiliation. No fake accounts, no
        pretending to be someone else, no using photos that aren&apos;t actually you.
      </LegalP>

      <LegalH2>No harassment</LegalH2>
      <LegalP>
        This covers a lot of ground: no repeated unwanted contact, no threats, no stalking, no doxxing
        (sharing someone&apos;s private info without permission), no bullying — in a chat, in a DM, or after
        you take it off the app. If someone tells you to stop, stop.
      </LegalP>

      <LegalH2>No hate</LegalH2>
      <LegalP>
        No content that attacks, demeans, or excludes people based on race, ethnicity, national origin,
        religion, gender, gender identity, sexual orientation, disability, or age.
      </LegalP>

      <LegalH2>Keep it legal</LegalH2>
      <LegalP>
        No illegal activity, no promoting or facilitating it, and absolutely nothing sexually explicit
        involving a minor — that gets reported to the appropriate authorities, no exceptions.
      </LegalP>

      <LegalH2>Respect people&apos;s consent</LegalH2>
      <LegalP>
        Don&apos;t share screenshots, private messages, or photos of someone else without their permission.
        Don&apos;t pressure anyone into meeting up, sharing anything, or continuing a conversation they want
        out of.
      </LegalP>

      <LegalH2>Clubs &amp; events</LegalH2>
      <LegalUl>
        <li>Club and event details need to be accurate — no fake events, no misrepresenting what a club actually is.</li>
        <li>Club chat and event chat are for the people actually in that club or going to that event — don&apos;t use them to spam or advertise something unrelated.</li>
        <li>If you&apos;re running a club or event on Ligo, you&apos;re responsible for what happens in your own group chat and at your own event.</li>
      </LegalUl>

      <LegalH2>What happens if you break these</LegalH2>
      <LegalP>
        Depending on what happened, we&apos;ll warn you, temporarily suspend your account, or ban you
        permanently. Anything involving a minor, a real threat to someone&apos;s safety, or illegal activity
        gets escalated immediately — we won&apos;t just warn and move on.
      </LegalP>

      <LegalH2>Report something</LegalH2>
      <LegalP>
        See a message, profile, or event that crosses a line? Use the report button right where you see it —
        on a profile, a message, or an event. We look at every report. If it&apos;s urgent or you&apos;d
        rather reach us directly, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#F97316] underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </LegalP>
    </LegalPage>
  );
}
