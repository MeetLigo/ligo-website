import type { Metadata } from "next";
import { LegalPage, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Ligo",
  description: "How Ligo collects, uses, and protects your information.",
};

const UPDATED = "August 17, 2026";
const CONTACT_EMAIL = "support@meetligo.com";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={UPDATED}>
      <LegalP>
        This Privacy Policy explains how Ligo Inc. (&quot;Ligo,&quot; &quot;we,&quot; &quot;us&quot;) collects,
        uses, shares, and protects information when you use the Ligo mobile app and meetligo.com (together,
        the &quot;Service&quot;). By using the Service, you agree to the practices described here. If you
        don&apos;t agree, please don&apos;t use the Service.
      </LegalP>

      <LegalH2>Who this applies to</LegalH2>
      <LegalP>
        Ligo is built for college students. You must be enrolled at (or otherwise affiliated with) a
        supported school and use a valid school email address to create an account. The Service is not
        directed to children, and we don&apos;t knowingly collect information from anyone under 13.
      </LegalP>

      <LegalH2>Information we collect</LegalH2>
      <LegalP>We collect information in three ways: what you give us, what we collect automatically, and what we get from services you connect.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Account &amp; profile information.</strong> Your school email, name, pronouns, gender, class year, and profile photo. If you choose to answer optional profile prompts, we store those answers too.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Location.</strong> With your permission, we collect your device&apos;s location — including in the background when the app isn&apos;t open — to power features that depend on knowing where you are relative to other students on or near campus, and to show you relevant nearby events. You can disable location access at any time in your device settings, though some features won&apos;t work without it.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Motion &amp; fitness data.</strong> With your permission, we use your device&apos;s motion sensors to detect a physical gesture (a &quot;bump&quot; of two phones) that triggers certain in-app moments. We do not use motion data for any other purpose, and we don&apos;t use it to infer your broader physical activity or health.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Music listening data.</strong> If you connect Apple Music, we access a limited set of your listening data (such as top artists and genres) to power music-compatibility features. We do not receive your Apple ID credentials — that connection is handled by Apple&apos;s own authorization flow, and we only receive the specific data Apple Music&apos;s API returns for the scopes you approve.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Content you create.</strong> Messages you send in club and event group chats, event RSVPs, club memberships, reports you file, and any content (like photos) you upload or share through the Service.</LegalP>

      <LegalP><strong className="text-[#EFE8DB]">Device &amp; usage information.</strong> Device type, operating system, app version, push-notification tokens, crash and error logs, and general usage data (like which features you use) collected automatically as you use the Service.</LegalP>

      <LegalH2>How we use your information</LegalH2>
      <LegalUl>
        <li>To operate core features — matching you with compatible people nearby, showing you campus events and clubs, and running group chat.</li>
        <li>To verify you&apos;re a real student at a supported school and to keep the Service safe (fraud prevention, abuse reports, moderation).</li>
        <li>To send you push notifications and emails about activity relevant to you (you can control most of these in Settings).</li>
        <li>To fix bugs, improve the Service, and understand how it&apos;s used in aggregate.</li>
        <li>To communicate with you directly if you contact support.</li>
      </LegalUl>

      <LegalH2>Who we share information with</LegalH2>
      <LegalP>We don&apos;t sell your personal information. We share it only in these situations:</LegalP>
      <LegalUl>
        <li><strong className="text-[#EFE8DB]">Other students, as intended by the feature.</strong> Your profile is visible to students you&apos;re matched or connected with; club rosters are visible to fellow members; event RSVPs and club chat messages are visible to the relevant club or event audience.</li>
        <li><strong className="text-[#EFE8DB]">Service providers.</strong> Companies that host our infrastructure, send email and push notifications, and store our data on our behalf, bound by contracts limiting their use of it to providing that service to us.</li>
        <li><strong className="text-[#EFE8DB]">Apple Music.</strong> If you connect your account, per Apple&apos;s own terms for that integration.</li>
        <li><strong className="text-[#EFE8DB]">Legal &amp; safety reasons.</strong> If required by law, or if we believe in good faith it&apos;s necessary to protect the rights, safety, or property of Ligo, our users, or the public.</li>
        <li><strong className="text-[#EFE8DB]">Business transfers.</strong> If Ligo is involved in a merger, acquisition, or sale of assets, your information may transfer as part of that deal — we&apos;ll notify you if that happens.</li>
      </LegalUl>

      <LegalH2>Your choices</LegalH2>
      <LegalUl>
        <li>Every permission (location, motion &amp; fitness, notifications, background location) can be turned off in your device&apos;s Settings app at any time.</li>
        <li>You can edit or delete profile information, and manage notification preferences, directly in the app.</li>
        <li>You can disconnect Apple Music at any time from your profile settings.</li>
        <li>You can request deletion of your account and associated data by contacting us — see below.</li>
      </LegalUl>

      <LegalH2>Data retention</LegalH2>
      <LegalP>
        We keep your information for as long as your account is active, and for a reasonable period after
        that to comply with legal obligations, resolve disputes, and enforce our agreements. You can request
        deletion at any time; some limited records (like moderation reports) may be retained longer where
        needed for safety or legal reasons.
      </LegalP>

      <LegalH2>Security</LegalH2>
      <LegalP>
        We use reasonable technical and organizational measures to protect your information. No method of
        transmission or storage is 100% secure, and we can&apos;t guarantee absolute security.
      </LegalP>

      <LegalH2>Changes to this policy</LegalH2>
      <LegalP>
        We may update this policy from time to time. If we make material changes, we&apos;ll notify you through
        the app or by email before they take effect.
      </LegalP>

      <LegalH2>Contact us</LegalH2>
      <LegalP>
        Questions about this policy or your data? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#E8A24C] underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </LegalP>
    </LegalPage>
  );
}
