/** The "vibe" collage below the hero — a scatter of horizontal prints. */
const PHOTOS = [
  { src: "/home/record-shop.jpg", alt: "Flipping through records at a record shop", rot: "-rotate-[5deg]", z: "z-10" },
  { src: "/home/behind-scenes.jpg", alt: "Two friends laughing at a house party", rot: "rotate-[3deg]", z: "z-20" },
  { src: "/home/dj-mixer.jpg", alt: "Hands working a DJ mixer", rot: "-rotate-[3deg]", z: "z-10" },
  { src: "/home/boombox.jpg", alt: "Dancing with a boombox at a bar", rot: "rotate-[4deg]", z: "z-20" },
  { src: "/home/ice-cream.jpg", alt: "Friends sharing dessert on the floor", rot: "-rotate-[4deg]", z: "z-10" },
  { src: "/home/camera-grass.jpg", alt: "A friend with a camera out on the grass", rot: "rotate-[5deg]", z: "z-20" },
  { src: "/home/bedroom-phone.jpg", alt: "Hanging out on a bedroom floor", rot: "-rotate-[2deg]", z: "z-10" },
];

export function HowItWorks() {
  return (
    <section className="relative bg-cream px-[26px] pb-[76px] pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-[110px] z-[2] h-[110px] bg-gradient-to-b from-cream/0 to-cream" />
      <div className="mx-auto max-w-[1000px]">
        {/* Scattered prints. PENDING LICENSE (Death to Stock): VINYL_TASTE (Ivan Resnik),
            BEHIND_THE_SCENES / BEDROOM_DJ (Shauna Summers / Agustín Farías).
            Swappable via /public/home. */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-x-0 sm:gap-y-7">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.src}
              className={`${p.rot} ${p.z} block w-[45%] rounded-[10px] bg-white p-[6px] shadow-[0_20px_44px_-18px_rgba(20,17,13,0.5)] transition-transform duration-300 ease-out hover:z-30 hover:rotate-0 hover:scale-[1.04] sm:w-[280px] ${
                i > 0 ? "sm:-ml-9" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="block aspect-[4/3] w-full rounded-[5px] object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
