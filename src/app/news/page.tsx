import type { Metadata } from "next";
import { getNewsPosts, urlFor } from "@/lib/sanity";
import { Placeholder } from "@/components/ui/Placeholder";
import { PageHero, Accent } from "@/components/chrome/PageHero";
import { Tape } from "@/components/ui/Tape";

export const metadata: Metadata = {
  title: "Ligo News",
  description: "Product drops, campus launches, and the occasional hot take.",
};

export default async function NewsPage() {
  const rawPosts = await getNewsPosts();

  const posts = rawPosts.map((p) => ({
    tag: p.tags?.[0] ?? "Announcement",
    tagColor: p.tags && p.tags.length > 0 ? "#A13D99" : "#EA580C",
    date: new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    title: p.title,
    excerpt: p.excerpt ?? "",
    href: `/news/${p.slug}`,
    imageUrl: p.image ? urlFor(p.image).width(480).height(370).fit("crop").url() : null,
  }));

  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow="ligo news"
        title={<>What we&apos;ve <Accent>been up to.</Accent></>}
        sub="Product drops, campus launches, and the occasional hot take."
        image="/hero/slide-3.jpg"
        position="center 44%"
        width="max-w-[840px]"
      />

      <section className="mx-auto flex max-w-[840px] flex-col gap-[18px] px-6 pb-[30px] pt-6 sm:px-10">
        {posts.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink/60">More stories coming soon.</p>
        ) : (
          posts.map((post, i) =>
            i === 0 ? (
              /* the latest story runs as a cream press clipping taped over the dark —
              the page's one artifact moment */
              <a
                key={post.href}
                href={post.href}
                className="relative mb-2 grid -rotate-[0.7deg] grid-cols-[180px_1fr] gap-5 rounded-[3px] bg-cream p-5 text-ink shadow-[0_28px_54px_-20px_rgba(0,0,0,0.6),0_14px_40px_-16px_rgba(232,162,76,0.3)] transition-transform hover:-translate-y-[3px] max-sm:grid-cols-1"
              >
                <Tape className="-top-[11px] left-8 -rotate-[4deg]" />
                <Tape className="-top-[11px] right-10 rotate-[3deg]" />
                <div className="aspect-[1.3] overflow-hidden rounded-[2px] ring-1 ring-ink/10">
                  {post.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Placeholder label={post.tag} />
                  )}
                </div>
                <div className="self-center">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/[0.55]">
                    {post.tag} · {post.date}
                  </div>
                  <div className="my-2 mb-[6px] text-balance font-serif text-[23px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
                    {post.title}
                  </div>
                  <div className="text-sm leading-[1.5] text-ink/[0.62]">{post.excerpt}</div>
                </div>
              </a>
            ) : (
              <a
                key={post.href}
                href={post.href}
                className="grid grid-cols-[180px_1fr] gap-5 rounded-[22px] border border-[#D7CCBC]/10 bg-[#1B150E] p-4 text-[#EFE8DB] transition-transform hover:-translate-y-[3px] hover:border-[#D7CCBC]/20"
              >
                <div className="aspect-[1.3] overflow-hidden rounded-[14px]">
                  {post.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Placeholder label={post.tag} />
                  )}
                </div>
                <div className="self-center">
                  <div
                    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: post.tagColor }}
                  >
                    {post.tag} · {post.date}
                  </div>
                  <div className="my-2 mb-[6px] text-balance font-serif text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#EFE8DB]">
                    {post.title}
                  </div>
                  <div className="text-sm leading-[1.5] text-[#EFE8DB]/55">{post.excerpt}</div>
                </div>
              </a>
            ),
          )
        )}
      </section>
    </main>
  );
}
