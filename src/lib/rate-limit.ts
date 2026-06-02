import type { NextRequest } from "next/server";

/**
 * Minimal fixed-window rate limiter. In-memory, so it resets on restart and is
 * per-instance only — fine for a single-node app. Swap for Redis/Upstash if you
 * ever run multiple instances.
 */
type Window = { count: number; resetAt: number };
const buckets = new Map<string, Window>();

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult = { ok: boolean; retryAfter: number };

/**
 * @param key      unique bucket key (e.g. `post:${ip}`)
 * @param limit    max requests allowed per window
 * @param windowMs window length in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfter: 0 };
}
