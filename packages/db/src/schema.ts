import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
};

/** Small system-level records used to verify and version the persistence layer. */
export const appMetadata = sqliteTable("app_metadata", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const companies = sqliteTable("companies", { id: text("id").primaryKey(), name: text("name").notNull(), websiteUrl: text("website_url"), notes: text("notes"), ...timestamps }, (table) => [uniqueIndex("companies_name_unique").on(table.name)]);

export const jobs = sqliteTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "restrict", onUpdate: "cascade" }),
    title: text("title").notNull(), location: text("location"), description: text("description"),
    sourceName: text("source_name"), sourceUrl: text("source_url"), sourceExternalId: text("source_external_id"),
    postedAt: integer("posted_at", { mode: "timestamp_ms" }), closedAt: integer("closed_at", { mode: "timestamp_ms" }), ...timestamps,
  },
  (table) => [index("jobs_company_id_idx").on(table.companyId), uniqueIndex("jobs_source_identity_unique").on(table.sourceName, table.sourceExternalId)],
);

export const resumeVersions = sqliteTable(
  "resume_versions",
  { id: text("id").primaryKey(), label: text("label").notNull(), storageKind: text("storage_kind").notNull(), externalUrl: text("external_url"), uploadPath: text("upload_path"), originalFilename: text("original_filename"), notes: text("notes"), ...timestamps },
  (table) => [check("resume_versions_storage_kind_valid", sql`${table.storageKind} in ('link', 'upload')`), check("resume_versions_source_matches_kind", sql`(${table.storageKind} = 'link' and ${table.externalUrl} is not null and ${table.uploadPath} is null) or (${table.storageKind} = 'upload' and ${table.uploadPath} is not null and ${table.externalUrl} is null)`)],
);

export const coverLetterVersions = sqliteTable(
  "cover_letter_versions",
  { id: text("id").primaryKey(), label: text("label").notNull(), storageKind: text("storage_kind").notNull(), externalUrl: text("external_url"), uploadPath: text("upload_path"), originalFilename: text("original_filename"), notes: text("notes"), ...timestamps },
  (table) => [check("cover_letter_versions_storage_kind_valid", sql`${table.storageKind} in ('link', 'upload')`), check("cover_letter_versions_source_matches_kind", sql`(${table.storageKind} = 'link' and ${table.externalUrl} is not null and ${table.uploadPath} is null) or (${table.storageKind} = 'upload' and ${table.uploadPath} is not null and ${table.externalUrl} is null)`)],
);

export const applications = sqliteTable(
  "applications",
  {
    id: text("id").primaryKey(), jobId: text("job_id").notNull().references(() => jobs.id, { onDelete: "restrict", onUpdate: "cascade" }),
    resumeVersionId: text("resume_version_id").references(() => resumeVersions.id, { onDelete: "restrict", onUpdate: "cascade" }),
    coverLetterVersionId: text("cover_letter_version_id").references(() => coverLetterVersions.id, { onDelete: "restrict", onUpdate: "cascade" }),
    appliedAt: integer("applied_at", { mode: "timestamp_ms" }), channel: text("channel"), notes: text("notes"), ...timestamps,
  },
  (table) => [index("applications_job_id_idx").on(table.jobId)],
);

export const applicationStatusEvents = sqliteTable(
  "application_status_events",
  { id: text("id").primaryKey(), applicationId: text("application_id").notNull().references(() => applications.id, { onDelete: "cascade", onUpdate: "cascade" }), status: text("status").notNull(), occurredAt: integer("occurred_at", { mode: "timestamp_ms" }).notNull(), reason: text("reason"), createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull() },
  (table) => [uniqueIndex("application_status_events_timeline_unique").on(table.applicationId, table.occurredAt), check("application_status_events_status_valid", sql`${table.status} in ('planned', 'submitted', 'interview', 'offer', 'rejected', 'withdrawn', 'closed')`)],
);

/** Human assessment history; deliberately separate from application progress. */
export const decisions = sqliteTable(
  "decisions",
  { id: text("id").primaryKey(), jobId: text("job_id").notNull().references(() => jobs.id, { onDelete: "cascade", onUpdate: "cascade" }), outcome: text("outcome").notNull(), reason: text("reason").notNull(), decidedAt: integer("decided_at", { mode: "timestamp_ms" }).notNull(), createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull() },
  (table) => [index("decisions_job_id_decided_at_idx").on(table.jobId, table.decidedAt), check("decisions_outcome_valid", sql`${table.outcome} in ('apply', 'skip', 'save_for_later', 'needs_review')`)],
);

export const followUps = sqliteTable(
  "follow_ups",
  { id: text("id").primaryKey(), applicationId: text("application_id").notNull().references(() => applications.id, { onDelete: "cascade", onUpdate: "cascade" }), dueAt: integer("due_at", { mode: "timestamp_ms" }).notNull(), completedAt: integer("completed_at", { mode: "timestamp_ms" }), note: text("note").notNull(), ...timestamps },
  (table) => [index("follow_ups_application_due_at_idx").on(table.applicationId, table.dueAt)],
);
