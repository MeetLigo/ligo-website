import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/sendgrid";
import { supabaseAdmin } from "@/lib/supabase";
import { CLUB_CATEGORIES, CLUB_ROLES } from "@/lib/clubs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEAM = ["micah@meetligo.com", "mekhi@meetligo.com"];

// POST /api/club-request → the "Create an account" form on /clubs/create.
// Stores the request in Supabase (best effort) and emails the team for
// review. Approval happens on Micah's side; see Ligo/Website/MICAH-HANDOFF.md.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const s = (k: string, max = 500) => String(body[k] ?? "").trim().slice(0, max);

  // honeypot
  if (s("website")) return NextResponse.json({ ok: true });

  const club_name = s("club_name");
  const contact_name = s("contact_name");
  const contact_role = s("contact_role");
  const club_email = s("club_email").toLowerCase();
  const instagram = s("instagram").replace(/^@/, "");
  const category = s("category");
  const notes = s("notes", 2000);

  if (!club_name) return NextResponse.json({ error: "missing_club_name" }, { status: 400 });
  if (!contact_name) return NextResponse.json({ error: "missing_contact_name" }, { status: 400 });
  if (!CLUB_ROLES.includes(contact_role)) return NextResponse.json({ error: "missing_contact_role" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(club_email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (category && !CLUB_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }

  // 1. store (best effort: a missing table or env never blocks the request)
  let stored = false;
  try {
    const { error } = await supabaseAdmin()
      .from("club_requests")
      .insert({ club_name, contact_name, contact_role, club_email, instagram: instagram || null, category: category || null, notes: notes || null });
    if (error) throw error;
    stored = true;
  } catch (e) {
    console.error("[/api/club-request] supabase insert skipped:", e instanceof Error ? e.message : e);
  }

  // 2. notify the team
  const text = [
    `New club account request from meetligo.com/clubs/create`,
    ``,
    `CLUB: ${club_name}`,
    `CATEGORY: ${category || "(not given)"}`,
    `INSTAGRAM: ${instagram ? "@" + instagram : "(not given)"}`,
    `CONTACT: ${contact_name}, ${contact_role}`,
    `CLUB EMAIL (they will sign in with this): ${club_email}`,
    ``,
    `NOTES:`,
    notes || "(none)",
    ``,
    `Stored in Supabase club_requests: ${stored ? "yes" : "no (table or env missing)"}`,
    `Next: approve on the platform, assign ${club_email} as admin, reply from hello@meetligo.com.`,
  ].join("\n");

  try {
    await sendNotificationEmail({
      to: TEAM,
      subject: `Club account request: ${club_name}`,
      text,
      replyTo: club_email,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[/api/club-request POST]", message);
    // stored but not emailed is still a received request
    if (stored) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "send_failed", message }, { status: 502 });
  }
}
