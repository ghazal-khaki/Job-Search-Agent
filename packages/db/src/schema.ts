import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Small system-level records used to verify and version the persistence layer. */
export const appMetadata = sqliteTable("app_metadata", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
