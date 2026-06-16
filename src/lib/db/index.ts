import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

// Lazily created so a missing DATABASE_URL throws only when a query actually
// runs (inside a handler's try/catch), not at module-import time — which
// would otherwise crash every server function that imports this file.
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Go to Supabase → Project Settings → Database → Connection string (Transaction pooler) and add it to your .env and Vercel environment variables."
      );
    }
    // prepare: false is required for Supabase's PgBouncer connection pooler
    const client = postgres(url, { prepare: false });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

let _initPromise: Promise<void> | undefined;

export function ensureReady(): Promise<void> {
  if (!_initPromise) {
    _initPromise = createTablesIfNeeded();
  }
  return _initPromise;
}

async function createTablesIfNeeded(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      clerk_id TEXT,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      shipping_address TEXT,
      billing_address TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      old_price DOUBLE PRECISION,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      image_urls TEXT,
      category TEXT,
      badge TEXT,
      colors TEXT,
      sizes TEXT,
      rating DOUBLE PRECISION DEFAULT 4.0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      total_amount DOUBLE PRECISION NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      payment_method TEXT DEFAULT 'card',
      shipping_address TEXT,
      billing_address TEXT
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price DOUBLE PRECISION NOT NULL
    )
  `);
}
