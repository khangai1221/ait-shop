import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClerkClient } from "@clerk/backend";
import { db, ensureReady } from "../db";
import { users, orders } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin, requireAuth, sanitize, checkRateLimit } from "../server-auth";

export const setUserAdmin = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.number(), isAdmin: z.boolean() }))
  .handler(async ({ data }) => {
    const { userId: callerId } = await requireAdmin();
    await ensureReady();
    // Prevent self-demotion
    const [caller] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, callerId))
      .limit(1);
    if (caller?.id === data.userId && !data.isAdmin) {
      throw new Error("You cannot remove your own admin access.");
    }
    await db.update(users).set({ isAdmin: data.isAdmin }).where(eq(users.id, data.userId));
    return { success: true };
  });

export const checkAdminAccess = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await requireAdmin();
    return { isAdmin: true };
  } catch {
    return { isAdmin: false };
  }
});

export const getAllUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  await ensureReady();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      orderCount: sql<number>`(select count(*) from orders where orders.user_id = users.id)`,
      totalSpent: sql<number>`(select coalesce(sum(total_amount), 0) from orders where orders.user_id = users.id)`,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
  return rows;
});

// Syncs the authenticated Clerk user into the local DB. Email and clerkId
// are always taken from Clerk — never trusted from the client.
export const getOrCreateUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      displayName: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = await requireAuth();
    checkRateLimit(`getuser:${userId}`, 10, 60_000);
    await ensureReady();

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser = await clerk.users.getUser(userId);
    const email =
      clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) throw new Error("No verified email on Clerk account");

    const resolvedName =
      (data.displayName ? sanitize(data.displayName, 200) : null) ??
      clerkUser.fullName ??
      clerkUser.firstName ??
      null;

    let [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      [user] = await db
        .insert(users)
        .values({ email, clerkId: userId, displayName: resolvedName })
        .returning();
    } else if (!user.clerkId) {
      [user] = await db
        .update(users)
        .set({ clerkId: userId, displayName: resolvedName ?? user.displayName })
        .where(eq(users.id, user.id))
        .returning();
    }
    return user;
  });
