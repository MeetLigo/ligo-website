import "server-only";

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";
// Verified single sender / authenticated domain in the SendGrid account —
// SendGrid rejects Mail Send calls from anything that isn't verified.
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "hello@meetligo.com";
const FROM_NAME = "Ligo";
// These are internal notifications, not marketing. Click tracking rewrites
// every link (an applicant's LinkedIn, a club's Instagram) into a SendGrid
// redirect, which is exactly what the team does not want to see.
const TRACKING_OFF = { click_tracking: { enable: false, enable_text: false }, open_tracking: { enable: false } };
const TO_EMAIL = "micahmcneil2@gmail.com";

/**
 * Fire-and-forget lead notification email — used by /api/partner-lead.
 * Server only; throws if SENDGRID_API_KEY isn't set at runtime.
 */
export async function sendLeadEmail(params: { org: string; school: string; email: string }) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) throw new Error("SendGrid env vars are not set");

  const { org, school, email } = params;
  const text = `New partner lead from meetligo.com/partner:\n\nOrg: ${org}\nSchool: ${school}\nEmail: ${email}`;

  const res = await fetch(SENDGRID_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: TO_EMAIL }], subject: `New partner lead: ${org}` }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      reply_to: { email },
      content: [{ type: "text/plain", value: text }],
      tracking_settings: TRACKING_OFF,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 300)}`);
  }
}

/** Same transport, generic subject/body. Used by /api/club-claim, /api/waitlist, and /api/apply (with attachments). */
export interface EmailAttachment {
  /** base64-encoded file contents */
  content: string;
  filename: string;
  type: string;
}

export async function sendNotificationEmail(params: {
  to?: string | string[];
  cc?: string[];
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) throw new Error("SendGrid env vars are not set");

  const res = await fetch(SENDGRID_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: (Array.isArray(params.to) ? params.to : [params.to || TO_EMAIL]).map((email) => ({ email })),
          ...(params.cc && params.cc.length > 0 ? { cc: params.cc.map((email) => ({ email })) } : {}),
          subject: params.subject,
        },
      ],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      ...(params.replyTo ? { reply_to: { email: params.replyTo } } : {}),
      content: [{ type: "text/plain", value: params.text }],
      tracking_settings: TRACKING_OFF,
      ...(params.attachments && params.attachments.length > 0
        ? { attachments: params.attachments.map((a) => ({ ...a, disposition: "attachment" })) }
        : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 300)}`);
  }
}
