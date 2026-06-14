import { getCookie, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { db, ensureReady } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// ── Errors ────────────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ── Rate limiting (in-memory sliding window) ──────────────────────────────────

interface Bucket {
  count: number;
  resetAt: number;
}

const rlStore = new Map<string, Bucket>();

setInterval(
  () => {
    const now = Date.now();
    for (const [k, v] of rlStore) if (v.resetAt < now) rlStore.delete(k);
  },
  5 * 60_000,
);

export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = rlStore.get(key);
  if (!bucket || bucket.resetAt < now) {
    rlStore.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count++;
  if (bucket.count > limit) {
    const retry = Math.ceil((bucket.resetAt - now) / 1000);
    throw new Error(`Too many requests. Retry after ${retry}s.`);
  }
}

function clientIP(): string {
  try {
    const fwd = getRequestHeader("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return getRequestIP() ?? "unknown";
  } catch {
    return "unknown";
  }
}

// ── Input sanitization ────────────────────────────────────────────────────────

export function sanitize(value: string, maxLen = 500): string {
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function getVerifiedUserId(): Promise<string> {
  const token = getCookie("__session");
  if (!token) throw new AuthError(401, "Unauthorized");

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new AuthError(401, "Server misconfigured");

  try {
    const claims = await verifyToken(token, { secretKey });
    return claims.sub;
  } catch {
    throw new AuthError(401, "Invalid or expired session");
  }
}

export async function requireAuth(): Promise<{ userId: string }> {
  checkRateLimit(`auth:${clientIP()}`, 120, 60_000);
  return { userId: await getVerifiedUserId() };
}

export async function requireAdmin(): Promise<{ userId: string }> {
  checkRateLimit(`admin:${clientIP()}`, 60, 60_000);

  const userId = await getVerifiedUserId();

  await ensureReady();

  // Fast path: check DB via Clerk user ID
  const [dbUser] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (dbUser?.isAdmin) return { userId };

  // Slow path: check ADMIN_EMAILS env var via Clerk API
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    if (adminEmails.includes(email)) return { userId };
  }

  throw new AuthError(403, "Forbidden");
}
