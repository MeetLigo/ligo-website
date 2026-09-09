import { process } from "@/lib/careers";

/**
 * The five hiring steps as a horizontal run, one column each, circles linked
 * by a hairline so the order reads left to right. Stacks on narrow screens,
 * where the line drops away and the numbers carry the sequence.
 */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS = [
  // apply: a form
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" {...S} />
    <path d="M14 3v5h5M9 13h6M9 17h4" {...S} />
  </>,
  // we read it: an eye
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" {...S} />
    <circle cx="12" cy="12" r="3" {...S} />
  </>,
  // a short call: a conversation
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...S} />,
  // a paid work sample: real work
  <>
    <rect x="2.5" y="7" width="19" height="13.5" rx="2" {...S} />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" {...S} />
  </>,
  // offer and onboarding: done
  <>
    <circle cx="12" cy="12" r="9" {...S} />
    <path d="M8.4 12.4l2.5 2.5 4.7-5.3" {...S} />
  </>,
];

export function ProcessSteps() {
  return (
    <ol className="mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
      {process.map((step, i) => (
        <li key={step.title} className="relative">
          {/* hairline to the next step, desktop only */}
          {i < process.length - 1 && (
            <span aria-hidden className="absolute left-[46px] right-[-20px] top-[18px] hidden h-px bg-ink/[0.16] lg:block" />
          )}
          <span className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full border border-ink/[0.18] bg-white/70 text-[#EA580C]">
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
              {ICONS[i]}
            </svg>
          </span>
          <div className="mt-3 font-serif text-[12px] font-medium tabular-nums text-[#EA580C]">0{i + 1}</div>
          <div className="mt-[2px] font-serif text-[17px] font-medium leading-tight text-ink">{step.title}</div>
          <p className="mt-[5px] text-[13px] leading-[1.5] text-ink/[0.65]">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
