/** The "vibe" band below the hero — records, the room, the people. */
export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[70px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1000px]">
        {/* records, the room, the people. PENDING LICENSE (Death to Stock):
            VINYL_TASTE (Ivan Resnik), ROOM_SESSIONS (Agustin Farias),
            Staycation (Mathew Addington). Swappable via /public/home. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
