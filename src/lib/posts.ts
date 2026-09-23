/**
 * The one place the site talks to the CMS.
 *
 * Every page reads posts through here, never through the CMS client directly,
 * so the CMS behind it can change without touching a page.
 *
 * ── SWAPPED OFF SANITY, 2026-09-22 ────────────────────────────────────────
 *
 * Mekhi: "no one using it, limited by the plan that we dont want to upgrade at
 * all. its not that great to use in my opinion."
 *
 * Posts now live in Appwrite (`site_posts`), written at the admin panel's
 * /news. The seven Sanity posts were migrated by ligo-backend's
 * appwrite/scripts/migrate_sanity_posts.js, Portable Text converted to
 * markdown. The header this file carried before the swap promised the CMS
 * could be changed by editing this file alone. That turned out to be true.
 *
 * ── WHY PLAIN fetch AND NOT A CLIENT LIBRARY ──────────────────────────────
 *
 * Appwrite's REST API is HTTP with a project header, and `site_posts` is
 * read("any"), so a public read needs no key, no session and no SDK. This site
 * already talks to Appwrite this way for the careers and club-request intake.
 * Adding an SDK to render a blog would be a dependency for nothing.
 *
 * ── WHERE VISIBILITY LIVES NOW ────────────────────────────────────────────
 *
 * It used to be VISIBLE_POSTS, a hardcoded allowlist naming the single post
 * allowed to show, added 8/30 to keep the music-era back catalogue hidden.
 * That list is gone. Those six posts are `draft` in Appwrite and this file
 * filters on status. The same six stay hidden and the same one shows, but the
 * intent now lives in the data, where an editor can change it, rather than in
 * a constant only a developer can reach.
 *
 * Note that a draft row IS publicly readable, because the collection is
 * read("any"). The status filter below is what keeps drafts off the site; it
 * is not a secret.
 */
import "server-only";

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT = "6a5808dc001ce5e9480c";
const DATABASE = "ligo";
const COLLECTION = "site_posts";
const BUCKET = "post_images";

/** Next's own cache, 60s, matching what the Sanity client used. */
const REVALIDATE = 60;

export type PostKind = "update" | "story";

export interface Post {
  id: string;
  title: string;
  slug: string;
  kind: PostKind;
  publishedAt: string;
  excerpt?: string;
  tags?: string[];
  /** An Appwrite Storage file id. Was a Sanity image object before the swap. */
  image?: string | null;
  imageAlt?: string | null;
  author?: string;
  /** press coverage: the card links out instead of to a post page */
  externalUrl?: string;
}

export interface PostDetail extends Post {
  /** Markdown. Was Portable Text before the swap. */
  body?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

interface Row {
  $id: string;
  title: string;
  slug: string;
  kind?: string;
  status?: string;
  publishedAt?: string;
  excerpt?: string;
  tags?: string;
  coverFileId?: string | null;
  coverAlt?: string | null;
  author?: string;
  externalUrl?: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
}

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

function toPost(r: Row): PostDetail {
  return {
    id: r.$id,
    title: r.title,
    slug: r.slug,
    kind: (r.kind === "update" ? "update" : "story") as PostKind,
    publishedAt: r.publishedAt || "",
    excerpt: r.excerpt || undefined,
    tags: parseTags(r.tags),
    image: r.coverFileId || null,
    imageAlt: r.coverAlt || null,
    author: r.author || undefined,
    externalUrl: r.externalUrl || undefined,
    body: r.body || undefined,
    seo: (r.seoTitle || r.seoDescription)
      ? { metaTitle: r.seoTitle || undefined, metaDescription: r.seoDescription || undefined }
      : undefined,
  };
}

/** Appwrite queries are JSON objects passed as repeated `queries[]` params. */
function q(method: string, values: unknown[], attribute?: string) {
  return encodeURIComponent(
    JSON.stringify(attribute ? { method, attribute, values } : { method, values }),
  );
}

async function fetchRows(queries: string[]): Promise<Row[]> {
  const url = `${ENDPOINT}/databases/${DATABASE}/collections/${COLLECTION}/documents?${queries
    .map((x) => `queries[]=${x}`)
    .join("&")}`;
  const res = await fetch(url, {
    headers: { "X-Appwrite-Project": PROJECT },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`Appwrite ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { documents?: Row[] };
  return body.documents || [];
}

export async function getPosts(opts: { kind?: PostKind; limit?: number } = {}): Promise<Post[]> {
  const queries = [
    q("equal", ["published"], "status"),
    q("orderDesc", [], "publishedAt"),
    q("limit", [opts.limit ?? 24]),
  ];
  if (opts.kind) queries.splice(1, 0, q("equal", [opts.kind], "kind"));
  try {
    return (await fetchRows(queries)).map(toPost);
  } catch (err) {
    // An empty feed rather than a broken page, same as before the swap.
    console.error("[posts] getPosts failed", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const rows = await fetchRows([
      q("equal", [slug], "slug"),
      q("equal", ["published"], "status"),
      q("limit", [1]),
    ]);
    return rows[0] ? toPost(rows[0]) : null;
  } catch (err) {
    console.error("[posts] getPostBySlug failed", err);
    return null;
  }
}

/**
 * A sized, cropped URL for a post image.
 *
 * Appwrite resizes on its own /preview endpoint, so this keeps the shape the
 * Sanity version had and the calling pages barely change. `output=webp`
 * because the migrated originals are a mix of png and webp and one is 3MB.
 */
export function postImage(fileId: string, width: number, height?: number) {
  const params = new URLSearchParams({
    project: PROJECT,
    width: String(width),
    output: "webp",
  });
  if (height) {
    params.set("height", String(height));
    params.set("gravity", "center");
  }
  return `${ENDPOINT}/storage/buckets/${BUCKET}/files/${fileId}/preview?${params.toString()}`;
}
