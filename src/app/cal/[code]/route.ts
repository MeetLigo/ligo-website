export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEED = "https://calendar-feed-ligo.nyc.appwrite.run/c";

/**
 * GET /cal/<code> → a student's "Ligo" calendar (iCalendar), for Google
 * Calendar to subscribe to. The app hands Google this short link so the Add
 * calendar box reads meetligo.com/cal/<code> instead of a long server URL.
 * The calendar itself is built by the calendar-feed function in ligo-backend;
 * this only passes it through. Codes are random and unguessable.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Za-z0-9]{6,16}$/.test(code)) {
    return new Response("Not found", { status: 404 });
  }
  const res = await fetch(`${FEED}/${code}`, { cache: "no-store" });
  if (!res.ok) {
    return new Response("Not found", { status: res.status === 404 ? 404 : 502 });
  }
  return new Response(await res.text(), {
    status: 200,
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "private, max-age=300",
    },
  });
}
