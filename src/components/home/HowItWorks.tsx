/** The "vibe" collage below the hero — records, the room, the people. */
const PHOTOS = [
  { src: "/home/friends-bar.jpg", alt: "Friends out together at a bar", rot: "-rotate-[1.5deg]" },
  { src: "/home/record-pull.jpg", alt: "Hands pulling a record from a crate", rot: "rotate-[1.2deg]" },
  { src: "/home/dj-mixer.jpg", alt: "Hands working a DJ mixer", rot: "-rotate-[0.8deg]" },
];

export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[70px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1040px]">
        {/* PENDING LICENSE (Death to Stock): DIVE_BAR, BEHIND_THE_SCENES, BEDROOM_DJ
            (Agustín Farías / Shauna Summers), VINYL_TASTE (Ivan Resnik).
            Swappable via /public/home. */}
        <div className="columns-2 gap-4 sm:columns-3 [&>figure]:mb-4">
          {PHOTOS.map((p) => (
            <figure
              key={p.src}
              className={`break-inside-avoid overflow-hidden rounded-[16px] shadow-card ring-1 ring-ink/[0.06] transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.02] ${p.rot}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" className="block w-full" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
