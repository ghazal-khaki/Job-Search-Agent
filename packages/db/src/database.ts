import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import BetterSqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema.js";

export interface Database {
  db: BetterSQLite3Database<typeof schema>;
  sqlite: InstanceType<typeof BetterSqlite3>;
  path: string;
  close: () => void;
}

export function resolveDatabasePath(databasePath = process.env.JOB_SEARCH_DATABASE_PATH): string {
  return resolve(databasePath ?? "data/job-search-agent.sqlite");
}

export function createDatabase(databasePath?: string): Database {
  const resolvedPath = resolveDatabasePath(databasePath);
  mkdirSync(dirname(resolvedPath), { recursive: true, mode: 0o700 });
  const sqlite = new BetterSqlite3(resolvedPath);
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("journal_mode = WAL");

  return {
    db: drizzle(sqlite, { schema }),
    sqlite,
    path: resolvedPath,
    close: () => sqlite.close(),
  };
}
