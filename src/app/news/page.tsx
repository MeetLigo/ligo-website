import type { Metadata } from "next";
import { news } from "@/lib/content";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Ligo News",
  description: "Product drops, campus launches, and the occasional hot take.",
};

export default function NewsPage() {
  return (
    <main className="animate-riseIn">
      <section className="mx-auto max-w-[840px] px-[26px] pb-[30px] pt-[60px]">
        <div className="text-[11px] font-bold uppercase tracking-eyebrow text-ember">ligo news</div>
        <h1 className="mt-3 font-display text-page-title font-semibold">What we&apos;ve been up to.</h1>
        <p className="mt-[14px] text-[17px] text-ink/60">
          Product drops, campus launches, and the occasional hot take.
        </p>
      </section>

      <section className="mx-auto flex max-w-[840px] flex-col gap-[18px] px-[26px] pb-[30px] pt-4">
        {news.map((post, i) => (
          <a
            key={i}
            href="#"
            className="grid grid-cols-[180px_1fr] gap-5 rounded-[22px] border border-ink/[0.06] bg-white p-4 text-ink shadow-card transition-transform hover:-translate-y-[3px]"
          >
            <div className="aspect-[1.3] overflow-hidden rounded-[14px]">
              <Placeholder label={post.tag} />
            </div>
            <div className="self-center">
              <div
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{ color: post.tagColor }}
              >
                {post.tag} · {post.date}
              </div>
              <div className="my-2 mb-[6px] text-balance font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">
                {post.title}
              </div>
              <div className="text-sm leading-[1.5] text-ink/55">{post.excerpt}</div>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
