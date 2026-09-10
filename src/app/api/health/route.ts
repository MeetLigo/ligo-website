import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health → which secrets the RUNNING server can see. Presence only,
 * never values. Exists so a deploy can be checked without submitting a form,
 * since every form on the site ends in an email to a person.
 */
export function GET() {
  const has = (k: string) => Boolean(process.env[k] && process.env[k]!.trim());
  return NextResponse.json({
    sendgrid: has("SENDGRID_API_KEY"),
    intake: has("LIGO_INTAKE_KEY"),
    careers: has("LIGO_CAREERS_KEY"),
    checkedAt: new Date().toISOString(),
  });
}
