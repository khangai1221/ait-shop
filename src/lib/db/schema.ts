import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id"),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  isAdmin: boolean("is_admin").notNull().default(false),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
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
  rating: doublePrecision("rating").default(4.0),
  slug: text("slug"),
  status: text("status").notNull().default("published"), // 'draft' | 'published'
  featured: boolean("featured").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Normalised size records created for every imported product
export const productSizes = pgTable(
  "product_sizes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    available: boolean("available").notNull().default(true),
  },
  (table) => [unique().on(table.productId, table.size)],
);

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderDate: timestamp("order_date", { withTimezone: true }).notNull().defaultNow(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").default("card"),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
});
