import { eq } from "drizzle-orm";

import type { Database } from "../database.js";
import { appMetadata } from "../schema.js";

export function createAppMetadataRepository(database: Database) {
  return {
    set(key: string, value: string): void {
      database.db.insert(appMetadata).values({ key, value, updatedAt: new Date() }).onConflictDoUpdate({ target: appMetadata.key, set: { value, updatedAt: new Date() } }).run();
    },
    get(key: string): string | undefined {
      return database.db.select({ value: appMetadata.value }).from(appMetadata).where(eq(appMetadata.key, key)).get()?.value;
    },
  };
}
