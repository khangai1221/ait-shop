import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db, ensureReady } from "../db";
import { users, orders } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin, sanitize, checkRateLimit, clientIP } from "../server-auth";

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

export const getOrCreateUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      clerkId: z.string().optional(),
      displayName: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    checkRateLimit(`getuser:${clientIP()}`, 30, 60_000);
    await ensureReady();
    let [user] = await db.select().from(users).where(eq(users.email, data.email));
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: data.email,
          clerkId: data.clerkId ?? null,
          displayName: data.displayName ?? null,
        })
        .returning();
    } else if (data.clerkId && !user.clerkId) {
      [user] = await db
        .update(users)
        .set({ clerkId: data.clerkId, displayName: data.displayName ?? user.displayName })
        .where(eq(users.id, user.id))
        .returning();
    }
    return user;
  });
