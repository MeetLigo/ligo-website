import type { TeamMember } from "@/lib/content";
import { TeamPhoto } from "./TeamPhoto";

/** A grid of team/advisor cards. Photos fall back to placeholders if missing. */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
      {members.map((m, i) => (
        <div
          key={`${m.name}-${i}`}
          className="rounded-[22px] border border-ink/[0.06] bg-white p-[14px] shadow-card transition-transform hover:-translate-y-1"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <TeamPhoto src={m.img} alt={m.name} placeholderLabel={m.role} />
          </div>
          <div className="mt-3 font-display text-[17px] font-semibold">{m.name}</div>
          <div className="mt-[2px] text-[13px] text-ink/50">{m.role}</div>
          {m.song && (
            <div className="mt-[10px] inline-flex items-center gap-[6px] rounded-full bg-flame/10 px-[10px] py-1 text-xs text-ember">
              ♪ {m.song}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
