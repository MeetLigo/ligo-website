/** "Answer a song. Meet your people." — the 3-step explainer below the hero. */
export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[70px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1000px] text-center">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">how it works</div>
        <h2 className="my-3 mb-10 text-balance font-display text-section-title font-semibold">
          Answer a song. Meet your people.
        </h2>
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* dashed connector line */}
          <div
            className="absolute left-[16%] right-[16%] top-9 z-0 hidden h-[2px] sm:block"
            style={{
              background:
                "repeating-linear-gradient(90deg,rgba(249,115,22,0.4) 0 8px,transparent 8px 16px)",
            }}
          />
          <Step
            gradient="linear-gradient(150deg,#F5D783,#EBBE4E)"
            shadow="0 12px 26px -12px rgba(233,190,78,0.9)"
            stroke="#14110D"
            title="Answer the daily question"
            body="One music question. The whole campus answers it too."
            icon={
              <>
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </>
            }
          />
          <Step
            gradient="linear-gradient(150deg,#9BD8EC,#4FA6CB)"
            shadow="0 12px 26px -12px rgba(79,166,203,0.8)"
            stroke="#fff"
            title="See who matches your taste"
            body="The people on your campus who answered like you."
            icon={
              <>
                <circle cx="9" cy="8" r="3.2" />
                <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                <path d="M16 5.5a3.2 3.2 0 0 1 0 5.6M18.5 20a6.5 6.5 0 0 0-4-6" />
              </>
            }
          />
          <Step
            gradient="linear-gradient(150deg,#F97316,#EA580C)"
            shadow="0 12px 28px -8px rgba(249,115,22,0.55)"
            stroke="#fff"
            title="Meet up in person"
            body="The concert, the café, the crew. Actually show up."
            icon={
              <>
                <path d="M12 21s-7-5.2-7-10a7 7 0 0 1 14 0c0 4.8-7 10-7 10z" />
                <circle cx="12" cy="11" r="2.4" />
              </>
            }
          />
        </div>

        {/* the vibe — records, the room, the people. PENDING LICENSE (Death to Stock):
            VINYL_TASTE (Ivan Resnik), ROOM_SESSIONS (Agustin Farias),
            Staycation (Mathew Addington). Swappable via /public/home. */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="overflow-hidden rounded-[18px] shadow-card sm:translate-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/vinyl-crate.jpg"
              alt="Two students flipping through vinyl at a record shop"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[18px] shadow-card">
            <video
              src="/home/room-session.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[18px] shadow-card sm:translate-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/turntable.jpg"
              alt="A student dropping the needle on a record"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  gradient,
  shadow,
  stroke,
  title,
  body,
  icon,
}: {
  gradient: string;
  shadow: string;
  stroke: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative z-[1]">
      <div
        className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-[20px]"
        style={{ background: gradient, boxShadow: shadow }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <div className="mt-[18px] font-display text-[19px] font-semibold tracking-[-0.01em]">{title}</div>
      <div className="mx-auto mt-[6px] max-w-[240px] text-sm leading-[1.5] text-ink/55">{body}</div>
    </div>
  );
}
