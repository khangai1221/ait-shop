import { T as TSS_SERVER_FUNCTION, e as getRequestHeader, f as getRequestIP, d as getCookie } from "./server-NH-cEY17.mjs";
import { c as createClerkClient, v as verifyToken2 } from "../_libs/clerk__backend.mjs";
import { P as Postgres } from "../_libs/postgres.mjs";
import { p as pgTable, t as timestamp, a as text, b as boolean, c as serial, f as doublePrecision, g as integer, h as drizzle, e as eq, u as unique } from "../_libs/drizzle-orm.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id"),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  isAdmin: boolean("is_admin").notNull().default(false),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  oldPrice: doublePrecision("old_price"),
  // Admin-only: never returned from the public API
  buyingPrice: doublePrecision("buying_price"),
  stock: integer("stock").notNull().default(0),
  description: text("description"),
  imageUrl: text("image_url"),
  imageUrls: text("image_urls"),
  category: text("category"),
  badge: text("badge"),
  colors: text("colors"),
  sizes: text("sizes"),
  rating: doublePrecision("rating").default(4),
  slug: text("slug"),
  status: text("status").notNull().default("published"),
  // 'draft' | 'published'
  featured: boolean("featured").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
});
const productSizes = pgTable(
  "product_sizes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    available: boolean("available").notNull().default(true)
  },
  (table) => [unique().on(table.productId, table.size)]
);
const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
});
const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull()
});
const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderDate: timestamp("order_date", { withTimezone: true }).notNull().defaultNow(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").default("card"),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address")
});
const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cartItems,
  carts,
  orderItems,
  orders,
  productSizes,
  products,
  users
}, Symbol.toStringTag, { value: "Module" }));
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Go to Supabase → Project Settings → Database → Connection string (Transaction pooler) and add it to your .env and Vercel environment variables."
    );
  }
  const client = Postgres(url, { prepare: false });
  return drizzle(client, { schema });
}
const db = getDb();
function ensureReady() {
  return Promise.resolve();
}
class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
  status;
}
const rlStore = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rlStore) if (v.resetAt < now) rlStore.delete(k);
}, 5 * 6e4);
function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = rlStore.get(key);
  if (!bucket || bucket.resetAt < now) {
    rlStore.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count++;
  if (bucket.count > limit) {
    const retry = Math.ceil((bucket.resetAt - now) / 1e3);
    throw new Error(`Too many requests. Retry after ${retry}s.`);
  }
}
function clientIP() {
  try {
    const fwd = getRequestHeader("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return getRequestIP() ?? "unknown";
  } catch {
    return "unknown";
  }
}
function sanitize(value, maxLen = 500) {
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}
async function getVerifiedUserId() {
  const token = getCookie("__session");
  if (!token) throw new AuthError(401, "Unauthorized");
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new AuthError(401, "Server misconfigured");
  try {
    const claims = await verifyToken2(token, { secretKey });
    return claims.sub;
  } catch {
    throw new AuthError(401, "Invalid or expired session");
  }
}
async function requireAuth() {
  checkRateLimit(`auth:${clientIP()}`, 120, 6e4);
  return { userId: await getVerifiedUserId() };
}
async function requireAdmin() {
  checkRateLimit(`admin:${clientIP()}`, 60, 6e4);
  const userId = await getVerifiedUserId();
  await ensureReady();
  const [dbUser] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.clerkId, userId)).limit(1);
  if (dbUser?.isAdmin) return { userId };
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (adminEmails.length > 0) {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";
    if (adminEmails.includes(primaryEmail.toLowerCase())) return { userId };
  }
  throw new AuthError(403, "Forbidden");
}
export {
  requireAuth as a,
  orderItems as b,
  createServerRpc as c,
  db as d,
  ensureReady as e,
  checkRateLimit as f,
  clientIP as g,
  productSizes as h,
  orders as o,
  products as p,
  requireAdmin as r,
  sanitize as s,
  users as u
};
