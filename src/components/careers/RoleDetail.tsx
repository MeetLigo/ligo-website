import type { Role } from "@/lib/careers";

/**
 * The full write-up for one role, top to bottom in a single column the way a
 * job posting reads. Shared by the /careers list and the job page so the two
 * can never drift. Deliberately not a grid: one thing after another, each
 * section the same shape, so the eye always knows where to go next.
 */
export function RoleDetail({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-9">
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
        <p className="text-[15.5px] leading-[1.6] text-ink/[0.82]">{role.measuredOn}</p>
      </Section>

      <Section title="What this role isn't">
        <p className="text-[15.5px] leading-[1.6] text-ink/[0.82]">
          Someone else owns {joinList(role.notThisRole.map((n) => n.toLowerCase()))}.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-serif text-[21px] font-medium leading-tight tracking-[-0.01em] text-ink">{title}</h3>
      {note && <p className="mt-1 text-[13.5px] text-ink/[0.5]">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[10px]">
      {items.map((it) => (
        <li key={it} className="grid grid-cols-[16px_1fr] gap-1 text-[15.5px] leading-[1.6] text-ink/[0.82]">
          <span aria-hidden className="mt-[10px] block h-[5px] w-[5px] rounded-full bg-[#F97316]" />
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
