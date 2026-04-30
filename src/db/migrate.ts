import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "./client";

await migrate(db, {
  migrationsFolder: "./drizzle",
});
