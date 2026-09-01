import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import type { Database } from "./database.js";

export const defaultMigrationsFolder = fileURLToPath(new URL("../migrations", import.meta.url));

export function runMigrations(database: Database, migrationsFolder = defaultMigrationsFolder): void {
  migrate(database.db, { migrationsFolder });
}
