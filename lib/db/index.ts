import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let sql: ReturnType<typeof neon> | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  }
} catch (error) {
  console.warn("Database not configured. Running in demo mode.");
}

export { db, sql };
export * from "./schema";
