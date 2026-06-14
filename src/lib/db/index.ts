import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url =
  process.env.NODE_ENV === "production"
    ? "file:/tmp/stride_showcase.db"
    : "file:./stride_showcase.db";

const client = createClient({ url });

export const db = drizzle(client, { schema });
