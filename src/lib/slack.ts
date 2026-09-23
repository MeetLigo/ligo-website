import "server-only";

// Slack Incoming Webhook for the careers channel. Set in the Amplify console
// and copied into the runtime by amplify.yml; see the note at the top of that
// file for why the copy is required. Unset is a supported state: the site runs
// exactly as it did before, minus the Slack post.
const WEBHOOK = () => process.env.SLACK_CAREERS_WEBHOOK;

// Slack's own caps. A section's text tops out at 3000 characters and a field's
// at 2000; going over is a 400, not a truncation, so the clamping happens here.
const SECTION_MAX = 2900;
const FIELD_MAX = 1900;

/**
 * Slack mrkdwn escaping. Only these three characters are special, and only
 * these three: escaping more mangles ordinary text. Applicant-supplied strings
 * (names, links, free text) all go through this.
 */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clamp(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function field(label: string, value: string) {
  return { type: "mrkdwn", text: clamp(`*${label}*\n${esc(value) || "(not given)"}`, FIELD_MAX) };
}

export interface CareersSlackPost {
  roleTitle: string;
  name: string;
  /** already validated against the route's address regex */
  email: string;
  phone: string;
  year: string;
  availability: string;
  motivation: string;
  referralSource: string;
  workAuthorized: string;
  /** [label, value] in display order; empty values are dropped by the caller */
  links: [string, string][];
  whyRole: string;
  stored: boolean;
  requestId: string;
  storeError: string;
}

/**
 * Posts an application to the careers Slack channel.
 *
 * This is the third notification, alongside the platform record and the email.
 * It deliberately carries NO self-identification answers: those live in their
 * own collection with nothing linking them to a person, and a channel anyone on
 * the team can scroll is the opposite of that.
 *
 * Returns false when no webhook is configured. Throws on a failed post, which
 * the caller is expected to swallow — a candidate is never lost over a
 * notification.
 */
export async function postCareersSlack(p: CareersSlackPost) {
  const url = WEBHOOK();
  if (!url) return false;

  const linkText = p.links.length
    ? p.links.map(([label, value]) => `*${label}:* ${esc(value)}`).join("\n")
    : "_(none given)_";

  const blocks: unknown[] = [
    {
      type: "header",
      // A header is plain_text, so it takes the raw string, not escaped mrkdwn.
      text: { type: "plain_text", text: clamp(`New application: ${p.roleTitle}`, 150), emoji: true },
    },
    {
      type: "section",
      fields: [
        field("Name", p.name),
        // The route's address regex is `[^@\s]+@[^@\s]+\.[^@\s]+`, which admits a
        // pipe. Inside Slack's <...> a pipe separates the URL from its label, so
        // <mailto:weird|pipe@x.com> links to "mailto:weird" and labels it with
        // the rest. An address carrying one is printed, not linked.
        p.email.includes("|")
          ? field("Email", p.email)
          : { type: "mrkdwn", text: `*Email*\n<mailto:${p.email}>` },
        field("Year", p.year),
        field("Phone", p.phone),
        field("Availability", p.availability),
        field("Drawn to it by", p.motivation),
        field("Heard about us", p.referralSource),
        field("Authorized to work in the US", p.workAuthorized),
      ],
    },
    { type: "section", text: { type: "mrkdwn", text: clamp(`*Links*\n${linkText}`, SECTION_MAX) } },
  ];

  if (p.whyRole) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: clamp(`*In their words*\n>${esc(p.whyRole).replace(/\n/g, "\n>")}`, SECTION_MAX) },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: p.stored
          ? `:white_check_mark: In the admin panel · \`${esc(p.requestId)}\``
          : `:warning: *NOT in the admin panel* (${esc(clamp(p.storeError, 200))}). The email is the only copy.`,
      },
    ],
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Fallback text for notifications and any surface that cannot render blocks.
    body: JSON.stringify({ text: `New application: ${p.roleTitle} · ${p.name}`, blocks }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`slack ${res.status}: ${body.slice(0, 300)}`);
    throw new Error("slack_failed");
  }
  return true;
}
