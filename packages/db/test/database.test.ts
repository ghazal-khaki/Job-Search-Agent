import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { createAppMetadataRepository, createDatabase, runMigrations } from "../src/index.js";

const temporaryDirectories: string[] = [];
function temporaryDatabasePath(): string {
  const directory = mkdtempSync(join(tmpdir(), "job-search-agent-db-"));
  temporaryDirectories.push(directory);
  return join(directory, "test.sqlite");
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("SQLite persistence", () => {
  it("applies migrations to a new database and is repeatable", () => {
    const database = createDatabase(temporaryDatabasePath());
    try {
      runMigrations(database);
      runMigrations(database);
      const table = database.sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("app_metadata") as { name: string } | undefined;
      expect(table?.name).toBe("app_metadata");
    } finally {
      database.close();
    }
  });

  it("persists a minimal write and read across connections", () => {
    const path = temporaryDatabasePath();
    const first = createDatabase(path);
    runMigrations(first);
    createAppMetadataRepository(first).set("installation", "local");
    first.close();
    const second = createDatabase(path);
    try {
      expect(createAppMetadataRepository(second).get("installation")).toBe("local");
    } finally {
      second.close();
    }
  });
});
