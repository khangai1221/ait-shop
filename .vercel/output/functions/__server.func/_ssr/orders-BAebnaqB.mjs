import { c as createServerRpc, r as requireAdmin, e as ensureReady, d as db, u as users, o as orders, a as requireAuth, b as orderItems, f as checkRateLimit, s as sanitize } from "./server-auth-C33rXQjW.mjs";
import { b as createServerFn, g as getCookie } from "./server-BMY1Y0f7.mjs";
import { c as createClerkClient } from "../_libs/clerk__backend.mjs";
import "../_libs/postgres.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as eq, d as desc } from "../_libs/drizzle-orm.mjs";
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
}).inputValidator(objectType({
  email: stringType().email().max(254),
  displayName: stringType().max(200).optional(),
  totalAmount: numberType().positive().max(1e9),
  paymentMethod: enumType(["qpay", "pickup"]),
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
  let [user] = await db.select().from(users).where(eq(users.email, data.email));
  if (!user) {
    [user] = await db.insert(users).values({
      email: data.email,
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
const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
const updateOrderStatus_createServerFn_handler = createServerRpc({
  id: "71ba35fe1e2894bed0322b01cf9bb0c0002c0bcc1b426a2ace29db6fd7299996",
  name: "updateOrderStatus",
  filename: "src/lib/api/orders.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
const updateOrderStatus = createServerFn({
  method: "POST"
}).inputValidator(objectType({
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
  getAllOrders_createServerFn_handler,
  getOrdersByEmail_createServerFn_handler,
  updateOrderStatus_createServerFn_handler
};
