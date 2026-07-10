import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { db, ensureReady } from "../db";
import { orders, orderItems, users } from "../db/schema";
import { eq, desc, ne } from "drizzle-orm";
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
      paymentMethod: z.enum(["cash", "bank_transfer", "pickup"]),
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

// ── Sales analytics ───────────────────────────────────────────────────────────

export const getSalesStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  await ensureReady();

  const now = new Date();

  const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

  const todayStart = startOf(now);

  const weekDay = now.getDay(); // 0=Sun
  const diffToMon = weekDay === 0 ? -6 : 1 - weekDay;
  const thisWeekStart = startOf(now);
  thisWeekStart.setDate(now.getDate() + diffToMon);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd  = new Date(now.getFullYear(), now.getMonth(), 1);

  const allOrders = await db
    .select({ id: orders.id, orderDate: orders.orderDate, totalAmount: orders.totalAmount, status: orders.status })
    .from(orders)
    .where(ne(orders.status, "cancelled"))
    .orderBy(desc(orders.orderDate));

  const inPeriod = (start: Date, end?: Date) =>
    allOrders.filter((o) => {
      const d = new Date(o.orderDate);
      return d >= start && (!end || d < end);
    });

  const sum = (list: typeof allOrders) => list.reduce((s, o) => s + o.totalAmount, 0);

  const todayList     = inPeriod(todayStart);
  const thisWeekList  = inPeriod(thisWeekStart);
  const lastWeekList  = inPeriod(lastWeekStart, thisWeekStart);
  const thisMonthList = inPeriod(thisMonthStart);
  const lastMonthList = inPeriod(lastMonthStart, lastMonthEnd);

  // Daily revenue — last 30 days
  const dailyRevenue: { date: string; revenue: number; orderCount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = startOf(new Date(now));
    dayStart.setDate(now.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayList = inPeriod(dayStart, dayEnd);
    dailyRevenue.push({ date: dayStart.toISOString().slice(0, 10), revenue: sum(dayList), orderCount: dayList.length });
  }

  // Top products by revenue (non-cancelled orders only)
  const itemRows = await db
    .select({ productName: orderItems.productName, quantity: orderItems.quantity, unitPrice: orderItems.unitPrice })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(ne(orders.status, "cancelled"));

  const productMap = new Map<string, { revenue: number; quantity: number }>();
  for (const item of itemRows) {
    const e = productMap.get(item.productName) ?? { revenue: 0, quantity: 0 };
    productMap.set(item.productName, { revenue: e.revenue + item.unitPrice * item.quantity, quantity: e.quantity + item.quantity });
  }
  const topProducts = [...productMap.entries()]
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    today:     { revenue: sum(todayList),     orders: todayList.length },
    thisWeek:  { revenue: sum(thisWeekList),  orders: thisWeekList.length },
    lastWeek:  { revenue: sum(lastWeekList),  orders: lastWeekList.length },
    thisMonth: { revenue: sum(thisMonthList), orders: thisMonthList.length },
    lastMonth: { revenue: sum(lastMonthList), orders: lastMonthList.length },
    allTime:   { revenue: sum(allOrders),     orders: allOrders.length },
    dailyRevenue,
    topProducts,
  };
});

export const exportOrdersCsv = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  await ensureReady();

  const rows = await db
    .select({
      id: orders.id,
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

  const esc = (v: string | null | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;

  const header = "Order ID,Customer,Email,Date,Amount (₮),Status,Payment,Shipping Address";
  const lines = rows.map((r) =>
    [
      r.id,
      esc(r.userName),
      esc(r.userEmail),
      new Date(r.orderDate).toISOString().slice(0, 10),
      r.totalAmount,
      r.status,
      r.paymentMethod ?? "",
      esc(r.shippingAddress),
    ].join(","),
  );

  return [header, ...lines].join("\n");
});

export const exportAnalyticsCsv = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  await ensureReady();

  const stats = await getSalesStats();

  const esc = (v: string | null | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines: string[] = [];

  lines.push("SALES ANALYTICS EXPORT");
  lines.push(`Generated,${new Date().toISOString().slice(0, 10)}`);
  lines.push("");

  lines.push("PERIOD SUMMARY");
  lines.push("Period,Revenue (₮),Orders");
  const periods = [
    ["Today", stats.today],
    ["This Week", stats.thisWeek],
    ["Last Week", stats.lastWeek],
    ["This Month", stats.thisMonth],
    ["Last Month", stats.lastMonth],
    ["All Time", stats.allTime],
  ] as const;
  for (const [label, data] of periods) {
    lines.push(`${label},${data.revenue},${data.orders}`);
  }
  lines.push("");

  lines.push("DAILY REVENUE (Last 30 Days)");
  lines.push("Date,Revenue (₮),Orders");
  for (const d of stats.dailyRevenue) {
    lines.push(`${d.date},${d.revenue},${d.orderCount}`);
  }
  lines.push("");

  lines.push("TOP PRODUCTS");
  lines.push("Product,Revenue (₮),Quantity Sold");
  for (const p of stats.topProducts) {
    lines.push(`${esc(p.name)},${p.revenue},${p.quantity}`);
  }

  return lines.join("\n");
});

export const deleteAllOrders = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  await ensureReady();
  await db.delete(orderItems);
  await db.delete(orders);
  return { success: true };
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
