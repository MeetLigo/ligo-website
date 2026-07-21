/** The "vibe" band below the hero — records, the room, the people. */
export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[70px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1000px]">
        {/* the people, the room, the music. PENDING LICENSE (Death to Stock):
            DIVE_BAR & ROOM_SESSIONS (Agustín Farías), VINYL_TASTE (Ivan Resnik).
            Swappable via /public/home. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="overflow-hidden rounded-[18px] shadow-card sm:translate-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/friends-bar.jpg"
              alt="Friends out together at a bar"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[center_12%]"
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
              src="/home/record-pull.jpg"
              alt="Hands pulling a record from a crate"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
