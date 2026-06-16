import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Go to Supabase → Project Settings → Database → Connection string (Transaction pooler) and add it to your .env and Vercel environment variables."
    );
  }
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}

export const db = getDb();

export function ensureReady(): Promise<void> {
  return Promise.resolve();
}
