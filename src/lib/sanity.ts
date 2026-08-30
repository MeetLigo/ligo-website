import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image as SanityImageSource } from "sanity";

export const sanityClient = createClient({
  projectId: "yvrdd92h",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  tags?: string[];
  image?: SanityImageSource;
}

export interface SanityPostDetail extends SanityPost {
  author?: string;
  body?: unknown;
}

// Music-era posts are hidden while the site repositions (8/30, Mekhi): only
// the posts named here appear. Widen or remove once Sanity is cleaned up.
const VISIBLE_POSTS = ["building-for-the-world"];

const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && slug.current in $visible] | order(publishedAt desc)[0...24]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  tags,
  image
}`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug && slug.current in $visible][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  tags,
  image,
  author,
  body
}`;

export async function getNewsPosts(): Promise<SanityPost[]> {
  try {
    return await sanityClient.fetch(POSTS_QUERY, { visible: VISIBLE_POSTS }, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Failed to fetch news posts from Sanity", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<SanityPostDetail | null> {
  try {
    return await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug, visible: VISIBLE_POSTS }, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Failed to fetch post from Sanity", err);
    return null;
  }
}
