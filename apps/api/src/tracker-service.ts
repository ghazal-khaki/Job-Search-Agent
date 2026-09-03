import { randomUUID } from "node:crypto";
import type { Database } from "@job-search-agent/db";
import type { ResourceName } from "@job-search-agent/contracts";

type Value = string | number | null;
type RecordValue = Record<string, unknown>;

const configs = {
  companies: { table: "companies", fields: ["name", "websiteUrl", "notes"], mutable: true },
  jobs: { table: "jobs", fields: ["companyId", "title", "location", "description", "sourceName", "sourceUrl", "sourceExternalId", "postedAt", "closedAt"], mutable: true },
  applications: { table: "applications", fields: ["jobId", "resumeVersionId", "coverLetterVersionId", "appliedAt", "channel", "notes"], mutable: true },
  statuses: { table: "application_status_events", fields: ["applicationId", "status", "occurredAt", "reason"], mutable: false },
  decisions: { table: "decisions", fields: ["jobId", "outcome", "reason", "decidedAt"], mutable: false },
  "follow-ups": { table: "follow_ups", fields: ["applicationId", "dueAt", "completedAt", "note"], mutable: true },
  "resume-versions": { table: "resume_versions", fields: ["label", "storageKind", "externalUrl", "uploadPath", "originalFilename", "notes"], mutable: true },
  "cover-letter-versions": { table: "cover_letter_versions", fields: ["label", "storageKind", "externalUrl", "uploadPath", "originalFilename", "notes"], mutable: true },
} as const satisfies Record<ResourceName, { table: string; fields: readonly string[]; mutable: boolean }>;

const toSnake = (value: string) => value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toCamel = (value: string) => value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
const toStorage = (value: unknown): Value => value instanceof Date ? value.getTime() : value === undefined ? null : value as Value;

function fromRow(row: Record<string, Value>): RecordValue {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => {
    const camelKey = toCamel(key);
    return [camelKey, key.endsWith("_at") && value !== null ? new Date(value as number).toISOString() : value];
  }));
}


export class TrackerService {
  constructor(private readonly database: Database) {}

  list(resource: ResourceName): RecordValue[] {
    const { table } = configs[resource];
    const rows = this.database.sqlite.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC, id ASC`).all() as Record<string, Value>[];
    return rows.map(fromRow);
  }

  get(resource: ResourceName, id: string): RecordValue | undefined {
    const { table } = configs[resource];
    const row = this.database.sqlite.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id) as Record<string, Value> | undefined;
    return row && fromRow(row);
  }

  create(resource: ResourceName, input: RecordValue): RecordValue {
    const config = configs[resource];
    const now = Date.now();
    const id = randomUUID();
    const fields = config.fields.filter((field) => input[field] !== undefined);
    const timestampColumns = resource === "statuses" || resource === "decisions" ? ["created_at"] : ["created_at", "updated_at"];
    const columns = ["id", ...fields.map(toSnake), ...timestampColumns];
    const values = [id, ...fields.map((field) => toStorage(input[field])), ...timestampColumns.map(() => now)];
    this.database.sqlite.prepare(`INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`).run(...values);
    return this.get(resource, id)!;
  }

  update(resource: ResourceName, id: string, input: RecordValue): RecordValue | undefined {
    const config = configs[resource];
    const existing = this.get(resource, id);
    if (!existing) return undefined;
    const fields = config.fields.filter((field) => input[field] !== undefined);
    if (fields.length === 0) return existing;
    const assignments = fields.map((field) => `${toSnake(field)} = ?`);
    const values: Value[] = fields.map((field) => toStorage(input[field]));
    if (config.mutable) { assignments.push("updated_at = ?"); values.push(Date.now()); }
    this.database.sqlite.prepare(`UPDATE ${config.table} SET ${assignments.join(", ")} WHERE id = ?`).run(...values, id);
    return this.get(resource, id)!;
  }
}
