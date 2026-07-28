import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image as SanityImageSource } from "sanity";

export const sanityClient = createClient({
projectId: "yvrdd92h",
dataset: "production",
apiVersion: "2024-01-01",
useCdn: true,
perspective: "published",
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
projectId: "yvrdd92h",
dataset: "production",
apiVersion: "2024-01-01",
useCdn: true,
perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
return builder.image(source);
}

export interface SanityPost {
_id: string;
title: string;
slug: string;
publishedAt: string;
excerpt?: string;
tags?: string[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
image?: any;
}

export interface SanityPostDetail extends SanityPost {
author?: string;
body?: unknown;
}

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...24]{
_id,
title,
"slug": slug.current,
publishedAt,
excerpt,
tags,
image
}`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
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
return await sanityClient.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } });
} catch (err) {
console.error("Failed to fetch news posts from Sanity", err);
return [];
}
}

export async function getPostBySlug(slug: string): Promise<SanityPostDetail | null> {
try {
return await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
} catch (err) {
console.error("Failed to fetch post from Sanity", err);
return null;
}
}

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

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...24]{
_id,
title,
"slug": slug.current,
publishedAt,
excerpt,
tags,
image
}`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
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
return await sanityClient.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } });
} catch (err) {
console.error("Failed to fetch news posts from Sanity", err);
return [];
}
}

export async function getPostBySlug(slug: string): Promise<SanityPostDetail | null> {
try {
return await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
} catch (err) {
console.error("Failed to fetch post from Sanity", err);
return null;
}
}
