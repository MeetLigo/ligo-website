import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /kits/<slug> → the partner club kit at public/kits/<slug>.html.
 *
 * Kits are standalone pages written by
 * ligo-backend/appwrite/scripts/build_club_kit.js (its out/web/<slug>.html
 * copy is what gets committed to public/kits). The link we hand a club is
 * meetligo.com/kits/<slug>, without the .html. That used to be a rewrite in
 * next.config.mjs, but rewrites do not run on Amplify's SSR hosting, so the
 * clean link 404'd and only /kits/<slug>.html worked. A route handler does run.
 *
 * public/kits is pulled into the server bundle by outputFileTracingIncludes in
 * next.config.mjs. If the file is somehow not on disk at runtime, fall back to
 * fetching the static copy, which the CDN serves.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return new Response("Not found", { status: 404 });
  }

  let html: string | null = null;
  try {
    html = await readFile(path.join(process.cwd(), "public", "kits", `${slug}.html`), "utf8");
  } catch {
    try {
      const res = await fetch(new URL(`/kits/${slug}.html`, req.url), { cache: "no-store" });
      const type = res.headers.get("content-type") ?? "";
      if (res.ok && type.includes("text/html")) html = await res.text();
    } catch {
      /* fall through to 404 */
    }
  }

  if (html === null) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      // a kit is for the club, not for search (the page also carries a meta tag)
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
