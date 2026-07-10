import { c as createServerRpc, r as requireAdmin, e as ensureReady, d as db, u as users, o as orders, a as requireAuth, b as orderItems, f as checkRateLimit, s as sanitize } from "./server-auth-0zDEtOvT.mjs";
import { b as createServerFn, g as getCookie } from "./server-iErPJQYh.mjs";
import { v as verifyToken2, c as createClerkClient } from "../_libs/clerk__backend.mjs";
import "../_libs/postgres.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as eq, d as desc, n as ne } from "../_libs/drizzle-orm.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "node:crypto";
import "os";
import "fs";
import "net";
import "tls";
import "perf_hooks";
async function getAuthenticatedEmail(userId) {
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
  });
  const clerkUser = await clerk.users.getUser(userId);
  return clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null;
}
const getAllOrders_createServerFn_handler = createServerRpc({
  id: "ddea7dedf7aeb56939525f151d85ba03b2a6b8728289055c4a2a4d194a23165b",
  name: "getAllOrders",
  filename: "src/lib/api/orders.ts"
}, (opts) => getAllOrders.__executeServer(opts));
const getAllOrders = createServerFn({
  method: "GET"
}).handler(getAllOrders_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  const rows = await db.select({
    id: orders.id,
    userId: orders.userId,
    orderDate: orders.orderDate,
    totalAmount: orders.totalAmount,
    status: orders.status,
    paymentMethod: orders.paymentMethod,
    shippingAddress: orders.shippingAddress,
    userEmail: users.email,
    userName: users.displayName
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).orderBy(desc(orders.orderDate));
  return rows;
});
const getOrdersByEmail_createServerFn_handler = createServerRpc({
  id: "7e47be6cd2f89737ce0d1a7c8d98374de1d36799dfa994ee5ec0817792106cb1",
  name: "getOrdersByEmail",
  filename: "src/lib/api/orders.ts"
}, (opts) => getOrdersByEmail.__executeServer(opts));
const getOrdersByEmail = createServerFn({
  method: "GET"
}).handler(getOrdersByEmail_createServerFn_handler, async () => {
  const {
    userId
  } = await requireAuth();
  await ensureReady();
  const email = await getAuthenticatedEmail(userId);
  if (!email) return [];
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return [];
  const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.orderDate));
  const ordersWithItems = await Promise.all(userOrders.map(async (order) => {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return {
      ...order,
      items
    };
  }));
  return ordersWithItems;
});
const createOrder_createServerFn_handler = createServerRpc({
  id: "00e828a7cbd00d568d07bebe5f5c0e6c24a84ec46880352adb787cb183a1f079",
  name: "createOrder",
  filename: "src/lib/api/orders.ts"
}, (opts) => createOrder.__executeServer(opts));
const createOrder = createServerFn({
  method: "POST"
}).validator(objectType({
  email: stringType().email().max(254),
  displayName: stringType().max(200).optional(),
  totalAmount: numberType().positive().max(1e9),
  paymentMethod: enumType(["cash", "bank_transfer", "pickup"]),
  shippingAddress: stringType().max(500).optional(),
  items: arrayType(objectType({
    productId: numberType().nullable().optional(),
    productName: stringType().max(200),
    quantity: numberType().int().positive().max(100),
    unitPrice: numberType().positive().max(1e8)
  })).min(1).max(50)
})).handler(createOrder_createServerFn_handler, async ({
  data
}) => {
  await ensureReady();
  const sessionCookie = getCookie("__session") ?? getCookie("__client_uat") ?? "anon";
  checkRateLimit(`order:${sessionCookie.slice(-16)}`, 5, 6e4);
  let email = data.email;
  const sessionToken = getCookie("__session");
  if (sessionToken && process.env.CLERK_SECRET_KEY) {
    try {
      const claims = await verifyToken2(sessionToken, {
        secretKey: process.env.CLERK_SECRET_KEY
      });
      const clerkEmail = await getAuthenticatedEmail(claims.sub);
      if (clerkEmail) email = clerkEmail;
    } catch {
    }
  }
  let [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    [user] = await db.insert(users).values({
      email,
      displayName: data.displayName ? sanitize(data.displayName) : null
    }).returning();
  }
  const [order] = await db.insert(orders).values({
    userId: user.id,
    totalAmount: data.totalAmount,
    paymentMethod: data.paymentMethod,
    shippingAddress: data.shippingAddress ? sanitize(data.shippingAddress) : null,
    status: "confirmed"
  }).returning();
  await db.insert(orderItems).values(data.items.map((item) => ({
    orderId: order.id,
    productId: item.productId ?? null,
    productName: sanitize(item.productName),
    quantity: item.quantity,
    unitPrice: item.unitPrice
  })));
  return order;
});
const getSalesStats_createServerFn_handler = createServerRpc({
  id: "5162dc70fd7b74aaf9915fdb574f1a7c3532e19076d1519f663c17aa7320a4a3",
  name: "getSalesStats",
  filename: "src/lib/api/orders.ts"
}, (opts) => getSalesStats.__executeServer(opts));
const getSalesStats = createServerFn({
  method: "GET"
}).handler(getSalesStats_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  const now = /* @__PURE__ */ new Date();
  const startOf = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const todayStart = startOf(now);
  const weekDay = now.getDay();
  const diffToMon = weekDay === 0 ? -6 : 1 - weekDay;
  const thisWeekStart = startOf(now);
  thisWeekStart.setDate(now.getDate() + diffToMon);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
  const allOrders = await db.select({
    id: orders.id,
    orderDate: orders.orderDate,
    totalAmount: orders.totalAmount,
    status: orders.status
  }).from(orders).where(ne(orders.status, "cancelled")).orderBy(desc(orders.orderDate));
  const inPeriod = (start, end) => allOrders.filter((o) => {
    const d = new Date(o.orderDate);
    return d >= start && (!end || d < end);
  });
  const sum = (list) => list.reduce((s, o) => s + o.totalAmount, 0);
  const todayList = inPeriod(todayStart);
  const thisWeekList = inPeriod(thisWeekStart);
  const lastWeekList = inPeriod(lastWeekStart, thisWeekStart);
  const thisMonthList = inPeriod(thisMonthStart);
  const lastMonthList = inPeriod(lastMonthStart, lastMonthEnd);
  const dailyRevenue = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = startOf(new Date(now));
    dayStart.setDate(now.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayList = inPeriod(dayStart, dayEnd);
    dailyRevenue.push({
      date: dayStart.toISOString().slice(0, 10),
      revenue: sum(dayList),
      orderCount: dayList.length
    });
  }
  const itemRows = await db.select({
    productName: orderItems.productName,
    quantity: orderItems.quantity,
    unitPrice: orderItems.unitPrice
  }).from(orderItems).innerJoin(orders, eq(orderItems.orderId, orders.id)).where(ne(orders.status, "cancelled"));
  const productMap = /* @__PURE__ */ new Map();
  for (const item of itemRows) {
    const e = productMap.get(item.productName) ?? {
      revenue: 0,
      quantity: 0
    };
    productMap.set(item.productName, {
      revenue: e.revenue + item.unitPrice * item.quantity,
      quantity: e.quantity + item.quantity
    });
  }
  const topProducts = [...productMap.entries()].map(([name, d]) => ({
    name,
    ...d
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  return {
    today: {
      revenue: sum(todayList),
      orders: todayList.length
    },
    thisWeek: {
      revenue: sum(thisWeekList),
      orders: thisWeekList.length
    },
    lastWeek: {
      revenue: sum(lastWeekList),
      orders: lastWeekList.length
    },
    thisMonth: {
      revenue: sum(thisMonthList),
      orders: thisMonthList.length
    },
    lastMonth: {
      revenue: sum(lastMonthList),
      orders: lastMonthList.length
    },
    allTime: {
      revenue: sum(allOrders),
      orders: allOrders.length
    },
    dailyRevenue,
    topProducts
  };
});
const exportOrdersCsv_createServerFn_handler = createServerRpc({
  id: "bc938985a892da101dea0cd2ddf1adf5900173531666d110bf37df52938e199e",
  name: "exportOrdersCsv",
  filename: "src/lib/api/orders.ts"
}, (opts) => exportOrdersCsv.__executeServer(opts));
const exportOrdersCsv = createServerFn({
  method: "GET"
}).handler(exportOrdersCsv_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  const rows = await db.select({
    id: orders.id,
    orderDate: orders.orderDate,
    totalAmount: orders.totalAmount,
    status: orders.status,
    paymentMethod: orders.paymentMethod,
    shippingAddress: orders.shippingAddress,
    userEmail: users.email,
    userName: users.displayName
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).orderBy(desc(orders.orderDate));
  const esc = (v) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const header = "Order ID,Customer,Email,Date,Amount (₮),Status,Payment,Shipping Address";
  const lines = rows.map((r) => [r.id, esc(r.userName), esc(r.userEmail), new Date(r.orderDate).toISOString().slice(0, 10), r.totalAmount, r.status, r.paymentMethod ?? "", esc(r.shippingAddress)].join(","));
  return [header, ...lines].join("\n");
});
const exportAnalyticsCsv_createServerFn_handler = createServerRpc({
  id: "6fbcd6d4a4da69acbe8f931e964a09d3fd49e184bf98f98e26f2fc3102938031",
  name: "exportAnalyticsCsv",
  filename: "src/lib/api/orders.ts"
}, (opts) => exportAnalyticsCsv.__executeServer(opts));
const exportAnalyticsCsv = createServerFn({
  method: "GET"
}).handler(exportAnalyticsCsv_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  const stats = await getSalesStats();
  const esc = (v) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = [];
  lines.push("SALES ANALYTICS EXPORT");
  lines.push(`Generated,${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("PERIOD SUMMARY");
  lines.push("Period,Revenue (₮),Orders");
  const periods = [["Today", stats.today], ["This Week", stats.thisWeek], ["Last Week", stats.lastWeek], ["This Month", stats.thisMonth], ["Last Month", stats.lastMonth], ["All Time", stats.allTime]];
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
const deleteAllOrders_createServerFn_handler = createServerRpc({
  id: "e419d7605752167513f58ba13d3aeea1d6a5c874834f97990d1ba19cb14a3542",
  name: "deleteAllOrders",
  filename: "src/lib/api/orders.ts"
}, (opts) => deleteAllOrders.__executeServer(opts));
const deleteAllOrders = createServerFn({
  method: "POST"
}).handler(deleteAllOrders_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  await db.delete(orderItems);
  await db.delete(orders);
  return {
    success: true
  };
});
const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
const updateOrderStatus_createServerFn_handler = createServerRpc({
  id: "71ba35fe1e2894bed0322b01cf9bb0c0002c0bcc1b426a2ace29db6fd7299996",
  name: "updateOrderStatus",
  filename: "src/lib/api/orders.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
const updateOrderStatus = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType(),
  status: enumType(VALID_STATUSES)
})).handler(updateOrderStatus_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await ensureReady();
  const [order] = await db.update(orders).set({
    status: data.status
  }).where(eq(orders.id, data.id)).returning();
  return order;
});
export {
  createOrder_createServerFn_handler,
  deleteAllOrders_createServerFn_handler,
  exportAnalyticsCsv_createServerFn_handler,
  exportOrdersCsv_createServerFn_handler,
  getAllOrders_createServerFn_handler,
  getOrdersByEmail_createServerFn_handler,
  getSalesStats_createServerFn_handler,
  updateOrderStatus_createServerFn_handler
};
