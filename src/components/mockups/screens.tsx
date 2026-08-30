/* eslint-disable @next/next/no-img-element */

/**
 * Stylized app-screen mockups, one per marketed feature (from the Figma
 * App Store frames): Explore feed, event detail with one-tap RSVP, per-event
 * group chat, club page with follow, and create-your-club. Brand tokens
 * throughout: canvas #F6F5F4, ink #171717, orange #F97316, peach #FFEDD5.
 * All measurements scale off the PhoneFrame's --pw variable.
 */

const pw = (f: number) => `calc(var(--pw) * ${f})`;

function Pad({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col" style={{ gap: pw(0.045), padding: `${pw(0.071)} ${pw(0.052)} ${pw(0.032)}` }}>
      {children}
    </div>
  );
}

function ScreenTitle({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="font-serif font-medium leading-[1.3] tracking-[-0.01em] text-[#171717]" style={{ fontSize: pw(0.071) }}>
      {line1}
      <br />
      <span className="text-[#171717]/[0.4]">{line2}</span>
    </div>
  );
}

/** Banner-shaped tab pair (the Ligo pennant shape from the design export). */
function BannerTabs({ active, tabs }: { active: number; tabs: [string, string] }) {
  return (
    <div className="flex items-end" style={{ gap: pw(0.026) }}>
      {tabs.map((t, i) => (
        <span key={t} className="relative inline-flex flex-shrink-0 items-center justify-center" style={{ height: pw(0.123), width: pw(i === 0 ? 0.31 : 0.284) }}>
          <svg viewBox="0 0 96 38" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M47.16 0.179C47.72 0.061 48.28 0.061 48.84 0.179L86.93 7.133C88.1 7.384 89.1 8.15 89.65 9.217L95.71 21.011C96.69 22.929 95.98 25.283 94.1 26.333L74.03 37.513C73.44 37.845 72.77 38.019 72.1 38.019H23.9C23.23 38.019 22.56 37.845 21.97 37.513L1.9 26.333C0.02 25.283 -0.69 22.929 0.29 21.011L6.35 9.217C6.9 8.15 7.9 7.384 9.07 7.133L47.16 0.179Z"
              fill={i === active ? "#FFEDD5" : "#FFFFFF"}
            />
          </svg>
          <span className="relative font-medium tracking-[-0.01em]" style={{ fontSize: pw(0.045), color: i === active ? "#7C2D12" : "rgba(23,23,23,0.55)" }}>
            {t}
          </span>
        </span>
      ))}
    </div>
  );
}

function EventCard({ img, title, pos = "center" }: { img: string; title: string; pos?: string }) {
  return (
    <div className="relative overflow-hidden" style={{ height: pw(0.58), borderRadius: pw(0.065) }}>
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: pos }} />
      <span className="absolute inset-0 bg-gradient-to-b from-transparent to-black/55" />
      <span className="absolute font-serif font-medium tracking-[-0.01em] text-white" style={{ bottom: pw(0.039), left: pw(0.045), fontSize: pw(0.061) }}>
        {title}
      </span>
      <span
        className="absolute flex items-center justify-center rounded-full bg-white leading-none text-[#171717]"
        style={{ bottom: pw(0.032), right: pw(0.045), width: pw(0.13), height: pw(0.13), fontSize: pw(0.071) }}
      >
        +
      </span>
    </div>
  );
}

function Meta({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex flex-col" style={{ gap: pw(0.003), padding: `0 ${pw(0.006)}` }}>
      <span style={{ fontSize: pw(0.042) }} className="text-[#171717]/[0.72]">{a}</span>
      <span style={{ fontSize: pw(0.042) }} className="text-[#171717]/[0.5]">{b}</span>
    </div>
  );
}

/** 1 — Explore feed: every club event on campus, one place. */
export function ExploreScreen() {
  return (
    <Pad>
      <ScreenTitle line1="Everything happening" line2="at Georgetown." />
      <BannerTabs active={0} tabs={["Events", "Clubs"]} />
      <div className="flex flex-col" style={{ gap: pw(0.026) }}>
        <EventCard img="/hero/slide-1.jpg" title="Movie night" pos="center 70%" />
        <Meta a="Copley Lawn" b="Sat · 8:00 PM" />
      </div>
      <div className="flex items-center" style={{ gap: pw(0.039), padding: `0 ${pw(0.006)}` }}>
        <img src="/hero/slide-2.jpg" alt="" className="flex-shrink-0 object-cover" style={{ width: pw(0.168), height: pw(0.168), borderRadius: pw(0.039) }} />
        <div className="flex min-w-0 flex-col" style={{ gap: pw(0.003) }}>
          <span className="font-medium text-[#171717]" style={{ fontSize: pw(0.045) }}>Beginners salsa night</span>
          <span className="text-[#171717]/[0.5]" style={{ fontSize: pw(0.042) }}>Tonight · 7:00 PM</span>
        </div>
      </div>
    </Pad>
  );
}

/** 2 — Event detail: say you are going in one tap. */
export function EventDetailScreen() {
  return (
    <Pad>
      <EventCard img="/hero/slide-4.jpg" title="Speaker night" pos="center 62%" />
      <div className="flex flex-col" style={{ gap: pw(0.01), padding: `0 ${pw(0.006)}` }}>
        <span className="font-serif font-medium text-[#171717]" style={{ fontSize: pw(0.065) }}>Gaston Hall · Thu 6 PM</span>
        <span className="text-[#171717]/[0.55]" style={{ fontSize: pw(0.042) }}>Hosted by Lecture Fund</span>
      </div>
      <div className="flex items-center" style={{ gap: pw(0.026), padding: `0 ${pw(0.006)}` }}>
        <span className="inline-flex">
          {["AR", "DP", "MC"].map((n, i) => (
            <span
              key={n}
              className={`flex items-center justify-center rounded-full border-2 border-[#F6F5F4] font-semibold text-[#171717] ${i > 0 ? "-ml-[calc(var(--pw)*0.026)]" : ""}`}
              style={{ width: pw(0.084), height: pw(0.084), fontSize: pw(0.032), background: ["#E3D9F6", "#F6ECC8", "#FFEDD5"][i] }}
            >
              {n}
            </span>
          ))}
        </span>
        <span className="font-semibold text-[#171717]" style={{ fontSize: pw(0.042) }}>
          42 going
        </span>
      </div>
      <button
        type="button"
        className="mt-auto w-full rounded-full bg-[#F97316] font-semibold text-white"
        style={{ height: pw(0.155), fontSize: pw(0.048) }}
      >
        I&rsquo;m going
      </button>
    </Pad>
  );
}

/** 3 — Group chat: a group chat for every event. */
export function EventChatScreen() {
  const msgs: Array<{ who: string; text: string; mine?: boolean }> = [
    { who: "Maya", text: "who's getting there early?" },
    { who: "Jordan", text: "me, saving a spot on the lawn" },
    { who: "Priya", text: "does anyone have an extra blanket" },
    { who: "You", text: "omw, bringing two", mine: true },
    { who: "Sam", text: "W. see everyone at 8" },
  ];
  return (
    <Pad>
      {/* header, anchored by a hairline so the thread reads as its own region */}
      <div className="flex items-center border-b border-black/[0.07]" style={{ gap: pw(0.032), paddingBottom: pw(0.039) }}>
        <img src="/hero/slide-1.jpg" alt="" className="flex-shrink-0 object-cover" style={{ width: pw(0.123), height: pw(0.123), borderRadius: pw(0.032), objectPosition: "center 70%" }} />
        <div className="flex flex-col" style={{ gap: pw(0.003) }}>
          <span className="font-serif font-medium text-[#171717]" style={{ fontSize: pw(0.055) }}>Movie night</span>
          <span className="text-[#171717]/[0.5]" style={{ fontSize: pw(0.039) }}>42 in the chat</span>
        </div>
      </div>
      {/* event context keeps the middle from reading as dead space */}
      <div className="flex items-center self-center rounded-full bg-white text-[#171717]/[0.6]" style={{ gap: pw(0.019), fontSize: pw(0.035), padding: `${pw(0.016)} ${pw(0.042)}` }}>
        Tonight · 8:00 PM · Copley Lawn
      </div>
      <div className="flex flex-1 flex-col justify-end" style={{ gap: pw(0.019) }}>
        <span className="self-center text-[#171717]/[0.35]" style={{ fontSize: pw(0.032), marginBottom: pw(0.013) }}>Today</span>
        {msgs.map((m) => (
          <div key={m.text} className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`} style={{ gap: pw(0.006) }}>
            {!m.mine && (
              <span className="text-[#171717]/[0.45]" style={{ fontSize: pw(0.035), paddingLeft: pw(0.032) }}>{m.who}</span>
            )}
            <span
              className={m.mine ? "bg-[#F97316] text-white" : "bg-white text-[#171717]"}
              style={{ fontSize: pw(0.042), padding: `${pw(0.026)} ${pw(0.042)}`, borderRadius: pw(0.058), maxWidth: "85%" }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center rounded-full bg-white text-[#171717]/[0.4]" style={{ height: pw(0.13), padding: `0 ${pw(0.045)}`, fontSize: pw(0.042), marginTop: pw(0.026) }}>
        Message the event…
      </div>
    </Pad>
  );
}

/** 4 — Club page: follow your clubs, catch every event. */
export function ClubScreen() {
  return (
    <Pad>
      <div className="flex items-center" style={{ gap: pw(0.039) }}>
        <img src="/clubs/lasa.png" alt="" className="flex-shrink-0 rounded-full bg-white object-contain" style={{ width: pw(0.18), height: pw(0.18), padding: pw(0.02) }} />
        <div className="flex flex-col" style={{ gap: pw(0.003) }}>
          <span className="font-serif font-medium text-[#171717]" style={{ fontSize: pw(0.058) }}>LASA</span>
          <span className="text-[#171717]/[0.5]" style={{ fontSize: pw(0.039) }}>212 followers</span>
        </div>
        <span className="ml-auto rounded-full bg-[#171717] font-semibold text-white" style={{ fontSize: pw(0.039), padding: `${pw(0.023)} ${pw(0.052)}` }}>
          Follow
        </span>
      </div>
      <div className="flex flex-col" style={{ gap: pw(0.026) }}>
        <EventCard img="/hero/slide-2.jpg" title="Salsa night" />
        <Meta a="Healy Family Student Center" b="Fri · 7:00 PM" />
      </div>
      <div className="flex flex-col rounded-[calc(var(--pw)*0.045)] bg-white" style={{ padding: pw(0.045), gap: pw(0.013) }}>
        <span className="font-medium text-[#171717]" style={{ fontSize: pw(0.045) }}>Upcoming</span>
        <span className="text-[#171717]/[0.55]" style={{ fontSize: pw(0.042) }}>Game night · Wed 8 PM</span>
        <span className="text-[#171717]/[0.55]" style={{ fontSize: pw(0.042) }}>Cooking social · Sun 5 PM</span>
      </div>
    </Pad>
  );
}

/** 5 — Create club: create your club in minutes. */
export function CreateClubScreen() {
  return (
    <Pad>
      <ScreenTitle line1="Create your club" line2="in minutes." />
      <div className="flex flex-col" style={{ gap: pw(0.026) }}>
        {["Club name", "What kind of club?", "First event (optional)"].map((label) => (
          <div key={label} className="flex items-center rounded-[calc(var(--pw)*0.045)] bg-white text-[#171717]/[0.4]" style={{ height: pw(0.15), padding: `0 ${pw(0.045)}`, fontSize: pw(0.042) }}>
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap" style={{ gap: pw(0.019) }}>
        {["Cultural", "Pre-professional", "Greek life", "Sports", "Arts"].map((c, i) => (
          <span
            key={c}
            className={i === 0 ? "rounded-full bg-[#FFEDD5] font-medium text-[#7C2D12]" : "rounded-full bg-white text-[#171717]/[0.6]"}
            style={{ fontSize: pw(0.039), padding: `${pw(0.019)} ${pw(0.042)}` }}
          >
            {c}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-auto w-full rounded-full bg-[#171717] font-semibold text-white"
        style={{ height: pw(0.155), fontSize: pw(0.048) }}
      >
        Create club
      </button>
    </Pad>
  );
}
