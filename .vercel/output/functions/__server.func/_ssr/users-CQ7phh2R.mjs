import { c as createServerRpc, r as requireAdmin, e as ensureReady, d as db, u as users, f as checkRateLimit, g as clientIP } from "./server-auth-C33rXQjW.mjs";
import { b as createServerFn } from "./server-BMY1Y0f7.mjs";
import "../_libs/clerk__backend.mjs";
import "../_libs/postgres.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as sql, d as desc, e as eq } from "../_libs/drizzle-orm.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const checkAdminAccess_createServerFn_handler = createServerRpc({
  id: "8df9de6de2a59d7c3702aac406e4b2c5ac17713f7222465a6cc0c92e6c45335c",
  name: "checkAdminAccess",
  filename: "src/lib/api/users.ts"
}, (opts) => checkAdminAccess.__executeServer(opts));
const checkAdminAccess = createServerFn({
  method: "GET"
}).handler(checkAdminAccess_createServerFn_handler, async () => {
  try {
    await requireAdmin();
    return {
      isAdmin: true
    };
  } catch {
    return {
      isAdmin: false
    };
  }
});
const getAllUsers_createServerFn_handler = createServerRpc({
  id: "072a656888d2fe65f1bb5c7197d3704bb20707043c90746fb109d8a4cb22bfba",
  name: "getAllUsers",
  filename: "src/lib/api/users.ts"
}, (opts) => getAllUsers.__executeServer(opts));
const getAllUsers = createServerFn({
  method: "GET"
}).handler(getAllUsers_createServerFn_handler, async () => {
  await requireAdmin();
  await ensureReady();
  const rows = await db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
    isAdmin: users.isAdmin,
    createdAt: users.createdAt,
    orderCount: sql`(select count(*) from orders where orders.user_id = users.id)`,
    totalSpent: sql`(select coalesce(sum(total_amount), 0) from orders where orders.user_id = users.id)`
  }).from(users).orderBy(desc(users.createdAt));
  return rows;
});
const getOrCreateUser_createServerFn_handler = createServerRpc({
  id: "e8c74c55881c87d3f2647e4851fc3c3276c5ff44520fbf7c0e143668b2c6d050",
  name: "getOrCreateUser",
  filename: "src/lib/api/users.ts"
}, (opts) => getOrCreateUser.__executeServer(opts));
const getOrCreateUser = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  email: stringType().email(),
  clerkId: stringType().optional(),
  displayName: stringType().optional()
})).handler(getOrCreateUser_createServerFn_handler, async ({
  data
}) => {
  checkRateLimit(`getuser:${clientIP()}`, 30, 6e4);
  await ensureReady();
  let [user] = await db.select().from(users).where(eq(users.email, data.email));
  if (!user) {
    [user] = await db.insert(users).values({
      email: data.email,
      clerkId: data.clerkId ?? null,
      displayName: data.displayName ?? null
    }).returning();
  } else if (data.clerkId && !user.clerkId) {
    [user] = await db.update(users).set({
      clerkId: data.clerkId,
      displayName: data.displayName ?? user.displayName
    }).where(eq(users.id, user.id)).returning();
  }
  return user;
});
export {
  checkAdminAccess_createServerFn_handler,
  getAllUsers_createServerFn_handler,
  getOrCreateUser_createServerFn_handler
};
