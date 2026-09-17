import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health → which secrets the RUNNING server can see. Presence only,
 * never values. Exists so a deploy can be checked without submitting a form,
 * since every form on the site ends in an email to a person.
 */
export function GET(req: Request) {
  const has = (k: string) => Boolean(process.env[k] && process.env[k]!.trim());
  // TEMPORARY 2026-09-16. lib/guard.ts counts x-forwarded-for from the RIGHT,
  // because CloudFront appends the real viewer IP after whatever the caller
  // sent and Amplify's proxy appends at least one more. How many trailing hops
  // there are is not documented, so it has to be measured on the real deploy
  // rather than assumed: read `count` here and set XFF_TRAILING_HOPS to
  // count - 1. No IP is returned, only the last hops, which are our own
  // infrastructure. Delete this block once the constant is confirmed.
  const parts = (req.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return NextResponse.json({
    sendgrid: has("SENDGRID_API_KEY"),
    intake: has("LIGO_INTAKE_KEY"),
    careers: has("LIGO_CAREERS_KEY"),
    xff: { count: parts.length, tail: parts.slice(-3) },
    checkedAt: new Date().toISOString(),
  });
}
