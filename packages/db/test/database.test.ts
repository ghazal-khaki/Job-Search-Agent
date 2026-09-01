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

  it("models the complete job-search record and exact application documents", () => {
    const database = createDatabase(temporaryDatabasePath());
    try {
      runMigrations(database);
      const now = Date.now();
      database.sqlite.prepare("INSERT INTO companies (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)").run("company-1", "Synthetic GmbH", now, now);
      database.sqlite.prepare("INSERT INTO jobs (id, company_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run("job-1", "company-1", "Platform Engineer", now, now);
      database.sqlite.prepare("INSERT INTO resume_versions (id, label, storage_kind, external_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run("resume-1", "Backend résumé", "link", "https://example.test/resume", now, now);
      database.sqlite.prepare("INSERT INTO cover_letter_versions (id, label, storage_kind, upload_path, original_filename, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run("letter-1", "Platform letter", "upload", "documents/letter-1.pdf", "letter.pdf", now, now);
      database.sqlite.prepare("INSERT INTO applications (id, job_id, resume_version_id, cover_letter_version_id, applied_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run("application-1", "job-1", "resume-1", "letter-1", now, now, now);
      database.sqlite.prepare("INSERT INTO application_status_events (id, application_id, status, occurred_at, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)").run("status-1", "application-1", "submitted", now, "Submitted by user", now);
      database.sqlite.prepare("INSERT INTO decisions (id, job_id, outcome, reason, decided_at, created_at) VALUES (?, ?, ?, ?, ?, ?)").run("decision-1", "job-1", "apply", "Meets hard constraints", now, now);
      database.sqlite.prepare("INSERT INTO follow_ups (id, application_id, due_at, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run("follow-up-1", "application-1", now + 86_400_000, "Check for a response", now, now);

      const application = database.sqlite.prepare("SELECT resume_version_id, cover_letter_version_id FROM applications WHERE id = ?").get("application-1") as { resume_version_id: string; cover_letter_version_id: string };
      expect(application).toEqual({ resume_version_id: "resume-1", cover_letter_version_id: "letter-1" });
      expect(database.sqlite.prepare("SELECT outcome FROM decisions WHERE job_id = ?").get("job-1")).toEqual({ outcome: "apply" });
      expect(database.sqlite.prepare("SELECT status FROM application_status_events WHERE application_id = ?").get("application-1")).toEqual({ status: "submitted" });
    } finally {
      database.close();
    }
  });

  it("rejects invalid document sources and ambiguous status timestamps", () => {
    const database = createDatabase(temporaryDatabasePath());
    try {
      runMigrations(database);
      const now = Date.now();
      expect(() => database.sqlite.prepare("INSERT INTO resume_versions (id, label, storage_kind, external_url, upload_path, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run("bad-resume", "Invalid", "link", "https://example.test/resume", "also-uploaded.pdf", now, now)).toThrow();

      database.sqlite.prepare("INSERT INTO companies (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)").run("company-1", "Synthetic GmbH", now, now);
      database.sqlite.prepare("INSERT INTO jobs (id, company_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run("job-1", "company-1", "Engineer", now, now);
      database.sqlite.prepare("INSERT INTO applications (id, job_id, created_at, updated_at) VALUES (?, ?, ?, ?)").run("application-1", "job-1", now, now);
      database.sqlite.prepare("INSERT INTO application_status_events (id, application_id, status, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)").run("status-1", "application-1", "submitted", now, now);
      expect(() => database.sqlite.prepare("INSERT INTO application_status_events (id, application_id, status, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)").run("status-2", "application-1", "interview", now, now)).toThrow();
      expect(() => database.sqlite.prepare("INSERT INTO application_status_events (id, application_id, status, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)").run("status-3", "application-1", "invented", now + 1, now)).toThrow();
    } finally {
      database.close();
    }
  });
});
