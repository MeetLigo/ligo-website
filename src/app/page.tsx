import { PolaroidCollage } from "@/components/home/PolaroidCollage";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main>
      {/* hero: prompt over the polaroid wall */}
      <section className="relative min-h-[calc(100vh-68px)] overflow-hidden px-[22px] py-10">
        {/* blurred festival backdrop + wash */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-[-24px] scale-[1.06] bg-[url('/festival-bg.png')] bg-cover bg-[center_22%] bg-no-repeat"
            style={{ filter: "blur(6px) saturate(1.15)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(185,228,241,0.42) 0%,rgba(224,238,231,0.40) 40%,rgba(255,247,233,0.72) 88%)",
            }}
          />
        </div>
        {/* base sky gradient behind the backdrop */}
        <div
          className="absolute inset-0 z-[-1]"
          style={{ background: "linear-gradient(180deg,#B9E4F1 0%,#DCEFE9 34%,#FFF7E9 72%)" }}
        />
        {/* sun */}
        <div className="absolute -right-20 -top-[120px] z-0 h-[340px] w-[340px] animate-floatY rounded-full opacity-90"
          style={{ background: "radial-gradient(circle,#F5D783,#EBBE4E)", filter: "blur(2px)" }}
        />

        <PolaroidCollage />
        <Hero />

        {/* bottom fade into the cream section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[150px] bg-gradient-to-b from-cream/0 to-cream" />
      </section>

      <HowItWorks />
    </main>
  );
}
