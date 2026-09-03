import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDatabase, runMigrations, type Database } from "@job-search-agent/db";
import { buildApp } from "../src/app.js";

let database: Database;
let directory: string;

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "job-search-agent-api-"));
  database = createDatabase(join(directory, "test.sqlite"));
  runMigrations(database);
});

afterEach(() => { database.close(); rmSync(directory, { recursive: true, force: true }); });

describe("tracker API", () => {
  it("creates, lists, views, and updates a company", async () => {
    const app = buildApp(database);
    const created = await app.inject({ method: "POST", url: "/api/companies", payload: { name: "Synthetic GmbH", websiteUrl: "https://example.test" } });
    expect(created.statusCode).toBe(201);
    const company = created.json().data;
    expect(company).toMatchObject({ name: "Synthetic GmbH", websiteUrl: "https://example.test" });

    const listed = await app.inject({ method: "GET", url: "/api/companies" });
    expect(listed.json().data).toHaveLength(1);
    expect((await app.inject({ method: "GET", url: `/api/companies/${company.id}` })).json().data.id).toBe(company.id);

    const updated = await app.inject({ method: "PATCH", url: `/api/companies/${company.id}`, payload: { notes: "Priority employer" } });
    expect(updated.json().data.notes).toBe("Priority employer");

    const rejectedField = await app.inject({ method: "PATCH", url: `/api/companies/${company.id}`, payload: { invented: true } });
    expect(rejectedField.statusCode).toBe(400);
    expect(rejectedField.json().error.code).toBe("VALIDATION_ERROR");
    await app.close();
  });

  it("supports the complete tracker resource flow", async () => {
    const app = buildApp(database);
    const create = async (resource: string, payload: object) => {
      const response = await app.inject({ method: "POST", url: `/api/${resource}`, payload });
      expect(response.statusCode, response.body).toBe(201);
      return response.json().data;
    };
    const company = await create("companies", { name: "Example AG" });
    const job = await create("jobs", { companyId: company.id, title: "Platform Engineer" });
    const resume = await create("resume-versions", { label: "Backend CV", storageKind: "link", externalUrl: "https://example.test/cv" });
    const letter = await create("cover-letter-versions", { label: "Platform letter", storageKind: "upload", uploadPath: "documents/letter.pdf" });
    const updatedLetter = await app.inject({ method: "PATCH", url: `/api/cover-letter-versions/${letter.id}`, payload: { notes: "Tailored" } });
    expect(updatedLetter.statusCode, updatedLetter.body).toBe(200);
    expect(updatedLetter.json().data.notes).toBe("Tailored");
    const application = await create("applications", { jobId: job.id, resumeVersionId: resume.id, coverLetterVersionId: letter.id });
    await create("statuses", { applicationId: application.id, status: "submitted", occurredAt: "2026-09-03T09:00:00Z" });
    await create("decisions", { jobId: job.id, outcome: "apply", reason: "Good fit", decidedAt: "2026-09-03T08:00:00Z" });
    await create("follow-ups", { applicationId: application.id, dueAt: "2026-09-10T09:00:00Z", note: "Check in" });

    for (const resource of ["jobs", "applications", "statuses", "decisions", "follow-ups", "resume-versions", "cover-letter-versions"]) {
      const response = await app.inject({ method: "GET", url: `/api/${resource}` });
      expect(response.statusCode).toBe(200);
      expect(response.json().data).toHaveLength(1);
    }
    await app.close();
  });

  it("returns predictable validation, reference, and missing-record errors", async () => {
    const app = buildApp(database);
    const invalid = await app.inject({ method: "POST", url: "/api/companies", payload: { name: "" } });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().error.code).toBe("VALIDATION_ERROR");

    const badReference = await app.inject({ method: "POST", url: "/api/jobs", payload: { companyId: "missing", title: "Engineer" } });
    expect(badReference.statusCode).toBe(409);
    expect(badReference.json().error.code).toBe("INVALID_REFERENCE");

    const missing = await app.inject({ method: "PATCH", url: "/api/jobs/missing", payload: { title: "Other" } });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error.code).toBe("NOT_FOUND");
    await app.close();
  });
});
