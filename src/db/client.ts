import { drizzle } from "drizzle-orm/bun-sql";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no esta configurada");
}

const client = new Bun.SQL(databaseUrl);

export const db = drizzle({
  client,
  schema,
});

export const executeUnsafeSelect = async (query: string) => {
  return db.execute(sql.raw(query));
};
