import type { Metadata } from "next";
import { LegalPage, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service · Ligo",
  description: "The terms that govern your use of Ligo.",
};

const UPDATED = "August 17, 2026";
const CONTACT_EMAIL = "support@meetligo.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated={UPDATED}>
      <LegalP>
        These Terms of Service (&quot;Terms&quot;) govern your use of the Ligo mobile app and meetligo.com
        (together, the &quot;Service&quot;), operated by Ligo Inc. (&quot;Ligo,&quot; &quot;we,&quot;
        &quot;us&quot;). By creating an account or otherwise using the Service, you agree to these Terms. If
        you don&apos;t agree, don&apos;t use the Service.
      </LegalP>

      <LegalH2>Eligibility</LegalH2>
      <LegalP>
        Ligo is built for college students. To use it, you must be at least 17 years old, currently enrolled
        at (or otherwise affiliated with) a supported school, and able to verify that with a valid school
        email address. By creating an account, you confirm all of that is true.
      </LegalP>

      <LegalH2>Your account</LegalH2>
      <LegalUl>
        <li>You&apos;re responsible for keeping your account credentials secure and for everything that happens under your account.</li>
        <li>Your profile should be accurate — no impersonating another person, and no fake or duplicate accounts.</li>
        <li>You must be the one actually using your account. Don&apos;t let someone else log in as you.</li>
      </LegalUl>

      <LegalH2>Acceptable use</LegalH2>
      <LegalP>You agree not to:</LegalP>
      <LegalUl>
        <li>Harass, threaten, stalk, or abuse other users, in the app or in person after connecting through it.</li>
        <li>Post or send content that&apos;s illegal, hateful, sexually explicit involving a minor, or that infringes someone else&apos;s rights.</li>
        <li>Use the Service to advertise, solicit, or run a commercial operation without our permission.</li>
        <li>Attempt to access another user&apos;s account, or any part of the Service you&apos;re not authorized to access.</li>
        <li>Reverse-engineer, scrape, or use automated tools against the Service.</li>
        <li>Misrepresent your identity, age, or school affiliation.</li>
      </LegalUl>
      <LegalP>
        See our <a href="/community-guidelines" className="text-[#F97316] underline underline-offset-2">Community Guidelines</a>{" "}
        for more on what we expect from the community.
      </LegalP>

      <LegalH2>Reporting &amp; enforcement</LegalH2>
      <LegalP>
        If you see something that violates these Terms or our Community Guidelines, report it in the app. We
        review reports and may warn, suspend, or permanently ban an account that violates our policies, at
        our discretion, with or without notice.
      </LegalP>

      <LegalH2>Clubs, events &amp; third-party activities</LegalH2>
      <LegalP>
        Ligo helps you discover and join campus clubs and events, but we don&apos;t organize, host, or run
        them ourselves unless explicitly stated. Any club, event, ticket purchase, or in-person activity you
        engage with through the Service is between you and the organizing club or third party — Ligo isn&apos;t
        responsible for what happens there. Where an event links out to an external ticketing or booking
        page, that transaction and any refund is handled entirely by that third party, not Ligo.
      </LegalP>

      <LegalH2>Content you post</LegalH2>
      <LegalP>
        You retain ownership of content you post (like chat messages and photos), but you grant Ligo a
        license to host, display, and transmit it as needed to operate the Service — for example, showing
        your club chat messages to other members of that club. You&apos;re solely responsible for content you
        post.
      </LegalP>

      <LegalH2>Termination</LegalH2>
      <LegalP>
        You can delete your account at any time. We may suspend or terminate your access to the Service at
        any time, for any reason, including violating these Terms — particularly for safety-related
        violations like harassment or impersonation.
      </LegalP>

      <LegalH2>Disclaimers</LegalH2>
      <LegalP>
        The Service is provided &quot;as is,&quot; without warranties of any kind. We don&apos;t guarantee
        the Service will be uninterrupted, error-free, or that any particular outcome (like meeting someone
        compatible, or an event going as planned) will occur. Your interactions with other users, on or off
        the app, are at your own risk — please use good judgment, especially when meeting someone in person
        for the first time.
      </LegalP>

      <LegalH2>Limitation of liability</LegalH2>
      <LegalP>
        To the fullest extent permitted by law, Ligo is not liable for any indirect, incidental, or
        consequential damages arising from your use of the Service, including anything arising from your
        interactions with other users or third-party clubs/events.
      </LegalP>

      <LegalH2>Changes to these Terms</LegalH2>
      <LegalP>
        We may update these Terms from time to time. If we make material changes, we&apos;ll notify you
        through the app or by email before they take effect. Continuing to use the Service after that means
        you accept the updated Terms.
      </LegalP>

      <LegalH2>Contact us</LegalH2>
      <LegalP>
        Questions about these Terms? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#F97316] underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </LegalP>
    </LegalPage>
  );
}
