import "server-only";
import { NextResponse } from "next/server";

/**
 * Abuse guard for the public form endpoints (2026-09-16).
 *
 * WHAT THIS IS, SAID PLAINLY. Amplify Hosting runs this site as serverless
 * execution instances: storage is "shared among subsequent invocations within
 * the same execution instance" and explicitly "not shared between execution
 * instances", with a 15 minute ceiling and no published instance count, cap or
 * affinity. So every counter below lives in ONE warm instance, is duplicated
 * across however many instances are running, and is wiped by every deploy and
 * every cold start.
 *
 * That makes this a flood guard, not a rate limiter. It stops one person
 * running a sequential curl loop, which is the realistic case here, because a
 * sequential loop keeps landing on whichever instance is warm. It leaks in
 * proportion to concurrency against anything parallel, and a slow drip walks
 * straight past it. The control that actually bounds a flood is an AWS WAF
 * rate based rule at the CloudFront edge, which lives in Micah's AWS account.
 * See Ligo/Admin portal/SECURITY-AND-BUGS-FOR-MICAH.md.
 *
 * The daily send budget below is the piece aimed at the stated worst outcome,
 * a burned SendGrid quota that silently blocks genuine club submissions.
 *
 * NOT IN proxy.ts ON PURPOSE. Next 16 renamed middleware.ts to proxy.ts and
 * its build output leaves middleware-manifest.json empty. Amplify's adapter is
 * closed source and documented only through Next 15 while this app is on 16.2,
 * so a proxy.ts could compile, deploy and never run with no error anywhere. A
 * helper called explicitly from each route handler cannot fail that way.
 */

/* ---------------------------------------------------------------- client IP */

/**
 * CloudFront APPENDS the viewer's IP to the END of whatever x-forwarded-for
 * the caller sent, and Amplify's own reverse proxy (see the
 * x-amplify-isreverseproxy header) appends at least one more. Next hands a
 * forged header to the handler verbatim, so the LEFTMOST entry is entirely
 * attacker controlled and the usual xff.split(",")[0] recipe is defeated by
 * one rotating value. Counting from the RIGHT is immune to prepending:
 * however many entries an attacker puts in front, the trailing offset is
 * unchanged.
 *
 * MEASURE THIS ONCE after the first deploy: GET /api/health reports
 * xff.count and xff.tail. count 1 means 0 hops, count 2 means 1. Re-measure
 * after any Amplify platform change.
 */
const XFF_TRAILING_HOPS = 1;
const XFF_MAX_CHARS = 2048;

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function isPublicIp(ip: string): boolean {
  const v4 = IPV4.exec(ip);
  if (v4) {
    const o = v4.slice(1).map(Number);
    if (o.some((n) => Number.isNaN(n) || n > 255)) return false;
    if (o[0] === 10 || o[0] === 127 || o[0] === 0) return false;
    if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return false;
    if (o[0] === 192 && o[1] === 168) return false;
    if (o[0] === 169 && o[1] === 254) return false;
    return true;
  }
  // Loose IPv6: hex groups and colons only, and not loopback or unique local.
  if (!/^[0-9a-f:]+$/i.test(ip) || !ip.includes(":")) return false;
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return false;
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return false;
  if (/^fe80:/.test(lower)) return false;
  return true;
}

/**
 * The caller's IP, or null when it cannot be trusted. Null means the per IP
 * tier is SKIPPED, never bucketed under a shared "unknown" key: one attacker
 * sending no header would otherwise lock out every other header-less visitor.
 * The global tier and the per email tier still apply, so nothing is unguarded.
 */
export function clientIp(req: Request): string | null {
  const raw = req.headers.get("x-forwarded-for");
  if (!raw) return null;
  const parts = raw
    .slice(0, XFF_MAX_CHARS)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  // Only the forged entry is present, so there is nothing observed to trust.
  if (parts.length <= XFF_TRAILING_HOPS) return null;
  const candidate = parts[parts.length - 1 - XFF_TRAILING_HOPS];
  return candidate && isPublicIp(candidate) ? candidate : null;
}

/* ------------------------------------------------------------------- origin */

const ALLOWED_HOSTS = new Set(["meetligo.com", "www.meetligo.com", "localhost:3000", "127.0.0.1:3000"]);

/**
 * A CSRF and embedding control, not an anti flood one. Request.json() ignores
 * Content-Type, so without this an attacker's page can post CORS-simple JSON
 * to these routes with no preflight: the response is unreadable to them but
 * the email and the Appwrite write still happen.
 *
 * Absent Origin passes. Browsers attach it to same-origin POSTs, so a real
 * form always sends one; curl sends none and could just send the right one
 * anyway, so rejecting absence buys nothing and risks a real person behind a
 * header-stripping middlebox. Referer is ignored, and Sec-Fetch-Site is not
 * required because students on older iOS do not send it.
 */
export function originOk(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const { host } = new URL(origin);
    return ALLOWED_HOSTS.has(host) || host.endsWith(".amplifyapp.com");
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------- body limit */

/**
 * Next 16 does not cap Route Handler bodies (the 1 MB limit is a Pages Router
 * and Server Action thing) and CloudFront's request body quota is enormous, so
 * without this a multi megabyte POST is fully buffered before any validation
 * runs. Reading with a running byte count and cancelling past the cap costs
 * almost nothing by comparison.
 */
export async function readCapped(req: Request, maxBytes: number): Promise<Uint8Array<ArrayBuffer> | null> {
  // A hint only. It is attacker controlled and absent under chunked encoding,
  // so it is never the enforcement.
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;

  const body = req.body;
  if (!body) return new Uint8Array(new ArrayBuffer(0));

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  // Allocated over an explicit ArrayBuffer so the result is a BodyInit: a
  // plain `new Uint8Array(n)` widens to ArrayBufferLike, which Response rejects.
  const out = new Uint8Array(new ArrayBuffer(total));
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  return out;
}

/* ------------------------------------------------------------------ counters */

export const MIN = 60_000;
export const TEN_MIN = 600_000;
export const HOUR = 3_600_000;
export const DAY = 86_400_000;

export interface Tier {
  windowMs: number;
  max: number;
}

const counters = new Map<string, number[]>();
const MAX_KEYS = 5000;

/** Fail open, loudly: 512 MB of ephemeral storage and this Map is what fills it. */
function sweep(now: number) {
  if (counters.size <= MAX_KEYS) return;
  for (const [k, stamps] of counters) {
    if (stamps.length === 0 || now - stamps[stamps.length - 1] > DAY) counters.delete(k);
  }
  if (counters.size > MAX_KEYS) {
    counters.clear();
    console.warn("guard: counter map cleared");
  }
}

/** One sliding window. Returns seconds until the oldest hit in the window ages out. */
export function hit(key: string, tier: Tier, now = Date.now()): { ok: boolean; retryAfter: number } {
  const stamps = (counters.get(key) ?? []).filter((t) => now - t < tier.windowMs);
  if (stamps.length >= tier.max) {
    counters.set(key, stamps);
    const retryAfter = Math.max(1, Math.ceil((tier.windowMs - (now - stamps[0])) / 1000));
    return { ok: false, retryAfter };
  }
  stamps.push(now);
  counters.set(key, stamps);
  sweep(now);
  return { ok: true, retryAfter: 0 };
}

/** Every tier has to pass. The first refusal decides Retry-After. */
export function hitAll(key: string, tiers: Tier[], now = Date.now()): { ok: boolean; retryAfter: number } {
  let worst = 0;
  for (let i = 0; i < tiers.length; i++) {
    const r = hit(`${key}#${i}`, tiers[i], now);
    if (!r.ok) return r;
    worst = Math.max(worst, r.retryAfter);
  }
  return { ok: true, retryAfter: worst };
}

/* -------------------------------------------------------------- send budget */

/**
 * A per instance daily ceiling on outbound SendGrid calls, aimed squarely at
 * the worst outcome: a burned quota that blocks genuine club submissions.
 *
 * Routes that also store the submission somewhere durable (club-request with
 * an intake key, apply with a careers key) may spend the whole budget, because
 * a dropped email there costs a notification and nothing else. Routes whose
 * only record IS the email stop early, leaving the reserve for the ones where
 * a lost email is a lost club or a lost candidate.
 *
 * CHECK THE REAL CEILING: if the SendGrid account is on the post-2025 trial
 * the cap is 100 credits per day and DAILY_SEND_BUDGET should drop to 60.
 */
const DAILY_SEND_BUDGET = 250;
const RESERVED_FOR_QUEUED_ROUTES = 100;

let sendCount = 0;
let sendDay = "";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function sendBudget(priority: "queued" | "email_only"): boolean {
  const day = today();
  if (day !== sendDay) {
    sendDay = day;
    sendCount = 0;
  }
  const ceiling = priority === "queued" ? DAILY_SEND_BUDGET : DAILY_SEND_BUDGET - RESERVED_FOR_QUEUED_ROUTES;
  return sendCount < ceiling;
}

export function noteSend() {
  const day = today();
  if (day !== sendDay) {
    sendDay = day;
    sendCount = 0;
  }
  sendCount += 1;
}

/* ------------------------------------------------------------ field readers */

/**
 * Reject a non-string rather than coercing it. String(body[k]).slice(0, n) on
 * a large array materializes the whole joined string before the slice runs, so
 * the cap would bound the output but not the work. An empty result surfaces
 * through the route's existing missing_* code.
 */
export function cap(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Mail headers cannot carry newlines, and these values reach a subject line. */
export function subjectSafe(v: string): string {
  return v.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

/* ----------------------------------------------------------------- preflight */

export interface PreflightOptions {
  /** Namespace for the counter keys. */
  route: string;
  maxBytes: number;
  global: Tier[];
  perIp: Tier[];
  /** What a refusal looks like. waitlist returns a silent 200; the rest 429. */
  limited: (retryAfter: number) => NextResponse;
}

export type Preflight = { ok: true; bytes: Uint8Array<ArrayBuffer>; ip: string | null } | { ok: false; response: NextResponse };

let lastNoIpLog = 0;

/**
 * Steps 1 to 4, in order, all header-only except the body cap. A guard that
 * had to parse the body to identify the caller would first have to parse the
 * hostile payload, which is the expensive work the attacker wants done.
 */
export async function preflight(req: Request, opts: PreflightOptions): Promise<Preflight> {
  if (!originOk(req)) {
    return { ok: false, response: NextResponse.json({ error: "bad_origin" }, { status: 403 }) };
  }

  const now = Date.now();

  const g = hitAll(`g:${opts.route}`, opts.global, now);
  if (!g.ok) {
    console.warn(`guard: ${opts.route} global tier tripped`);
    return { ok: false, response: opts.limited(g.retryAfter) };
  }

  const ip = clientIp(req);
  if (ip) {
    const r = hitAll(`ip:${opts.route}:${ip}`, opts.perIp, now);
    if (!r.ok) return { ok: false, response: opts.limited(r.retryAfter) };
  } else if (now - lastNoIpLog > MIN) {
    lastNoIpLog = now;
    console.warn("guard: no usable client ip; per-IP tier skipped. Check XFF_TRAILING_HOPS against /api/health.");
  }

  const bytes = await readCapped(req, opts.maxBytes);
  if (!bytes) {
    return { ok: false, response: NextResponse.json({ error: "too_large" }, { status: 413 }) };
  }

  return { ok: true, bytes, ip };
}

/** The standard refusal. Retry-After is advisory and honest about the window. */
export function tooMany(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

/** Per-email tier, run after parsing and before any outbound call. */
export function emailAllowed(route: string, email: string, tiers: Tier[]): boolean {
  if (!email) return true;
  return hitAll(`em:${route}:${email}`, tiers).ok;
}

export function parseJsonBody(bytes: Uint8Array<ArrayBuffer>): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
