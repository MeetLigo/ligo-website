import { Tape } from "@/components/ui/Tape";

/** The cream card every /clubs page sits on, centered on the charcoal canvas. */
export function ClubSheet({ children, width = "max-w-[520px]" }: { children: React.ReactNode; width?: string }) {
  return (
    <main className="animate-riseIn">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1300px] items-center justify-center px-6 pb-24 pt-32 sm:px-10">
        <div className={`relative w-full ${width} rounded-[3px] bg-cream p-8 text-ink shadow-[0_30px_58px_-22px_rgba(0,0,0,0.6),0_16px_44px_-18px_rgba(232,162,76,0.3)] sm:p-10`}>
          <Tape className="-top-[11px] left-10 -rotate-[4deg]" />
          <Tape className="-top-[11px] right-12 rotate-[3deg]" />
          {children}
        </div>
      </section>
    </main>
  );
}
