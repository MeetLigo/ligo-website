import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_STORE = "https://apps.apple.com/us/app/ligo/id6753926105";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.bardsai.ligo&hl=en_US";

/**
 * GET /download → the right store for the device. Android goes to Google
 * Play; everything else (iPhone, iPad, Mac, Windows) goes to the App Store,
 * which renders a real listing on desktop too. Use this for QR codes, bios,
 * and flyers so one link works everywhere.
 */
export function GET(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  const target = /android/i.test(ua) ? GOOGLE_PLAY : APP_STORE;
  return NextResponse.redirect(target, 302);
}
