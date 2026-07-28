import "server-only";

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";
// Verified single sender / authenticated domain in the SendGrid account —
// SendGrid rejects Mail Send calls from anything that isn't verified.
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "hello@meetligo.com";
const FROM_NAME = "Ligo";
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
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 300)}`);
  }
}
