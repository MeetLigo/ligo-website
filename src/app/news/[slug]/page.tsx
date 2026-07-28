import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, urlFor } from "@/lib/sanity";
import { PageHero } from "@/components/chrome/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Ligo News" };
  return {
    title: `${post.title} · Ligo News`,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const tag = post.tags?.[0] ?? "Announcement";
  const heroImage = post.image
    ? urlFor(post.image).width(1600).height(900).url()
    : "/hero/slide-3.jpg";

  return (
    <main className="animate-riseIn">
      <PageHero
        eyebrow={tag}
        title={post.title}
        sub={post.author ? `By ${post.author} · ${date}` : date}
        image={heroImage}
        position="center 44%"
        width="max-w-[720px]"
      />

      <article className="mx-auto max-w-[720px] px-6 pb-24 pt-10 sm:px-10">
        {!post.image && (
          <div className="mb-8 aspect-[1.8] overflow-hidden rounded-[14px]">
            <Placeholder label={tag} />
          </div>
        )}

        {post.excerpt && (
          <p className="mb-6 text-balance text-[19px] leading-[1.5] text-[#EFE8DB]/80">
            {post.excerpt}
          </p>
        )}

        {post.body ? (
          <div className="space-y-5 text-[16px] leading-[1.7] text-[#EFE8DB]/85">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PortableText value={post.body as any} />
          </div>
        ) : (
          <p className="text-[16px] leading-[1.7] text-[#EFE8DB]/60">
            Full story coming soon.
          </p>
        )}

        <a
          href="/news"
          className="mt-12 inline-block text-sm font-semibold text-[#E8A24C] hover:opacity-75"
        >
          ← Back to all news
        </a>
      </article>
    </main>
  );
}
