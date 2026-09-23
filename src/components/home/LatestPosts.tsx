import Link from "next/link";
import { getPosts, postImage } from "@/lib/posts";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * "Latest from Ligo" on the homepage.
 *
 * ADDED 2026-09-23 (Mekhi: "we also need to establish places on the website
 * that updates or blogs can go").
 *
 * Until this, /news was the ONLY place a post could appear. It is linked from
 * the header and the footer, so it was reachable, but nothing written ever
 * surfaced on the page almost everyone actually lands on. posts.ts carried a
 * getUpdates() helper whose comment read "What the homepage rail shows" and
 * which no file imported: the rail it described had never been built.
 *
 * ── A SERVER COMPONENT, DELIBERATELY ──────────────────────────────────────
 *
 * It cannot live inside Landing.tsx, which is "use client" for the hero
 * slideshow and the waitlist form. So it renders from page.tsx, between the
 * landing and the footer, and does its own fetch on the server. No loading
 * state, no client-side request, nothing to hydrate.
 *
 * ── WHY IT IS NOT FILTERED TO kind='update' ───────────────────────────────
 *
 * The obvious build is an updates rail. It would currently render EMPTY: all
 * seven posts in the CMS are kind='story' and not one update has ever been
 * written. A homepage section that is invisible until somebody writes a kind
 * of post nobody has written yet is not a place for posts to go, it is a
 * place for them to fail to go.
 *
 * So this shows the latest posts of any kind, newest first, which is also the
 * more honest thing for a homepage to promise. When updates start getting
 * written they appear here automatically, by being recent. If updates ever
 * earn a surface of their own, getPosts({ kind: 'update' }) is right there.
 *
 * ── AND WHY IT IS A LIST, NOT A CAROUSEL OR A THREE-UP GRID ───────────────
 *
 * Exactly ONE post is published right now; the other six are deliberately
 * draft (the music-era back catalogue, held back in the Sanity swap). A
 * three-column grid would render one card and two holes, and a carousel would
 * render a single lonely slide with arrows that do nothing. A column of wide
 * rows reads correctly at one post and at three, which is the range this will
 * actually live in for a while.
 *
 * The card is deliberately the same one /news uses for its non-featured rows,
 * so the homepage and the news page look like one system rather than two.
 */

/** Three is enough to look intentional and few enough not to push the footer down. */
const LIMIT = 3;

export async function LatestPosts() {
  const posts = await getPosts({ limit: LIMIT });

  // Renders nothing rather than an empty shell with a heading over it. getPosts
  // already swallows a failed fetch into [], so this covers the outage case too:
  // the homepage loses a section instead of breaking.
  if (posts.length === 0) return null;

  return (
    <section className="w-full px-6 pb-20 sm:px-10">
      <div className="mx-auto flex max-w-[840px] flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.01em] text-[#FAF6EF] sm:text-[32px]">
            Latest from Ligo
          </h2>
          <Link
            href="/news"
            className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FAF6EF]/[0.55] transition-colors hover:text-[#FAF6EF]"
          >
            All news
          </Link>
        </div>

        <div className="flex flex-col gap-[18px]">
          {posts.map((post) => {
            const tag = post.tags?.[0] ?? "Announcement";
            const imageUrl = post.image ? postImage(post.image, 480, 370) : null;
            return (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="grid grid-cols-[180px_1fr] gap-5 rounded-[22px] border border-[#D7CCBC]/10 bg-[#1B150E] p-4 text-[#FAF6EF] transition-transform hover:-translate-y-[3px] hover:border-[#D7CCBC]/20 max-sm:grid-cols-1"
              >
                <div className="aspect-[1.3] overflow-hidden rounded-[14px]">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Placeholder label={tag} />
                  )}
                </div>
                <div className="self-center">
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FAF6EF]/[0.45]">
                    {tag}
                    {post.publishedAt ? (
                      <>
                        {" · "}
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    ) : null}
                  </div>
                  <div className="my-2 mb-[6px] text-balance font-serif text-[21px] font-semibold leading-[1.15] tracking-[-0.01em]">
                    {post.title}
                  </div>
                  {post.excerpt ? (
                    <div className="text-sm leading-[1.5] text-[#FAF6EF]/[0.6]">{post.excerpt}</div>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
