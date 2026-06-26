import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { db, ensureReady } from "../db";
import { orders, orderItems, users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireAuth, checkRateLimit, sanitize } from "../server-auth";
import { getCookie } from "@tanstack/react-start/server";

async function getAuthenticatedEmail(userId: string): Promise<string | null> {
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const clerkUser = await clerk.users.getUser(userId);
  return (
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null
  );
}

export const getAllOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  await ensureReady();
  const rows = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      orderDate: orders.orderDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      shippingAddress: orders.shippingAddress,
      userEmail: users.email,
      userName: users.displayName,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.orderDate));
  return rows;
});

export const getOrdersByEmail = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await requireAuth();
  await ensureReady();
  const email = await getAuthenticatedEmail(userId);
  if (!email) return [];
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return [];
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.orderDate));
  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }),
  );
  return ordersWithItems;
});

export const createOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email().max(254),
      displayName: z.string().max(200).optional(),
      totalAmount: z.number().positive().max(1_000_000_000),
      paymentMethod: z.enum(["qpay", "pickup"]),
      shippingAddress: z.string().max(500).optional(),
      items: z
        .array(
          z.object({
            productId: z.number().nullable().optional(),
            productName: z.string().max(200),
            quantity: z.number().int().positive().max(100),
            unitPrice: z.number().positive().max(100_000_000),
          }),
        )
        .min(1)
        .max(50),
    }),
  )
  .handler(async ({ data }) => {
    await ensureReady();

    // 5 orders per minute per session to prevent spam
    const sessionCookie = getCookie("__session") ?? getCookie("__client_uat") ?? "anon";
    checkRateLimit(`order:${sessionCookie.slice(-16)}`, 5, 60_000);

    // For authenticated users, override the client-supplied email with the
    // Clerk-verified address so an authenticated user can't place orders under
    // a different account's email.
    let email = data.email;
    const sessionToken = getCookie("__session");
    if (sessionToken && process.env.CLERK_SECRET_KEY) {
      try {
        const claims = await verifyToken(sessionToken, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        const clerkEmail = await getAuthenticatedEmail(claims.sub);
        if (clerkEmail) email = clerkEmail;
      } catch {
        // Invalid / expired session — fall through to guest checkout
      }
    }

    let [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email,
          displayName: data.displayName ? sanitize(data.displayName) : null,
        })
        .returning();
    }

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress ? sanitize(data.shippingAddress) : null,
        status: "confirmed",
      })
      .returning();

    await db.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId ?? null,
        productName: sanitize(item.productName),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );

    return order;
  });

const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      status: z.enum(VALID_STATUSES),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureReady();
    const [order] = await db
      .update(orders)
      .set({ status: data.status })
      .where(eq(orders.id, data.id))
      .returning();
    return order;
  });
