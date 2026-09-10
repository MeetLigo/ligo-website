import { sanityClient, urlFor } from "./sanity";
import type { Image as SanityImage } from "sanity";

/**
 * The one place the site talks to the CMS.
 *
 * Every page reads posts through here, never through the Sanity client
 * directly, so the CMS behind it can change without touching a page. Today
 * that is Sanity project yvrdd92h; swapping it later means editing this file.
 *
 * Two kinds of content, one feed, one field to tell them apart:
 *   update  short product and company news; surfaces on the homepage
 *   story   blog posts and essays; lives on /news only
 */

export type PostKind = "update" | "story";

export interface Post {
  id: string;
  title: string;
  slug: string;
  kind: PostKind;
  publishedAt: string;
  excerpt?: string;
  tags?: string[];
  image?: SanityImage;
  author?: string;
  /** press coverage: the card links out instead of to a post page */
  externalUrl?: string;
}

export interface PostDetail extends Post {
  body?: unknown;
  seo?: { metaTitle?: string; metaDescription?: string };
}

// Music-era posts stay hidden until the back catalog is triaged (8/30, Mekhi).
// This is a patch, not a system: the plan in Ligo/Website/CMS-AND-NEWS-PLAN.md
// section 5 lists which posts get rewritten, kept, or unpublished, and once
// that is done in the Studio this allowlist goes away.
const VISIBLE_POSTS = ["building-for-the-world"];

const FIELDS = `
  "id": _id,
  title,
  "slug": slug.current,
  "kind": coalesce(kind, "story"),
  publishedAt,
  excerpt,
  tags,
  image,
  author,
  externalUrl
`;

const REVALIDATE = { next: { revalidate: 60 } };

export async function getPosts(opts: { kind?: PostKind; limit?: number } = {}): Promise<Post[]> {
  const limit = opts.limit ?? 24;
  const kindFilter = opts.kind ? `&& coalesce(kind, "story") == $kind` : "";
  const query = `*[_type == "post" && defined(slug.current) && slug.current in $visible ${kindFilter}] | order(publishedAt desc)[0...${limit}]{${FIELDS}}`;
  try {
    return await sanityClient.fetch(query, { visible: VISIBLE_POSTS, kind: opts.kind ?? "" }, REVALIDATE);
  } catch (err) {
    console.error("[posts] getPosts failed", err);
    return [];
  }
}

/** Short product and company news, newest first. What the homepage rail shows. */
export function getUpdates(limit = 8) {
  return getPosts({ kind: "update", limit });
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const query = `*[_type == "post" && slug.current == $slug && slug.current in $visible][0]{${FIELDS}, body, seo}`;
  try {
    return await sanityClient.fetch(query, { slug, visible: VISIBLE_POSTS }, REVALIDATE);
  } catch (err) {
    console.error("[posts] getPostBySlug failed", err);
    return null;
  }
}

/** A sized, cropped URL for a post image. */
export function postImage(image: SanityImage, width: number, height?: number) {
  const b = urlFor(image).width(width);
  return (height ? b.height(height).fit("crop") : b).url();
}

export { urlFor };
