import type { Role } from "@/lib/careers";

/**
 * The posting body, set the way a job board sets it: small sans headings,
 * 14px copy, tight bullets, no decoration. Reads as a document rather than a
 * marketing page. Every role uses the same sections, so the three postings are
 * comparable; anything genuinely specific to a role lives inside them.
 *
 * The application below it keeps the larger type. This part is for scanning.
 */
export function RoleDetail({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="About the role">
        <p className="text-[14.5px] leading-[1.6] text-ink/[0.78]">{role.summary}</p>
      </Section>

      <Section title="What you'll do">
        <Bullets items={role.whatYouDo} />
      </Section>

      <Section title="A typical week" note="Starting targets. We recalibrate after two weeks.">
        <Bullets items={role.typicalWeek} />
      </Section>

      <Section title="Who we're looking for">
        <Bullets items={role.lookingFor} />
      </Section>

      <Section title="What you're measured on">
        <p className="text-[14.5px] leading-[1.6] text-ink/[0.78]">{role.measuredOn}</p>
      </Section>

      <Section title="What this role isn't">
        <p className="text-[14.5px] leading-[1.6] text-ink/[0.78]">
          Someone else owns {joinList(role.notThisRole.map((n) => n.toLowerCase()))}.
        </p>
      </Section>
    </div>
  );
}

export function PostingHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[15px] font-semibold leading-snug text-ink">{children}</h2>;
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section>
      <PostingHeading>{title}</PostingHeading>
      {note && <p className="mt-[3px] text-[13px] leading-snug text-ink/[0.5]">{note}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[7px]">
      {items.map((it) => (
        <li key={it} className="grid grid-cols-[14px_1fr] text-[14.5px] leading-[1.6] text-ink/[0.78]">
          <span aria-hidden className="mt-[9px] block h-[4px] w-[4px] rounded-full bg-ink/[0.38]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** "a, b, and c" */
function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
