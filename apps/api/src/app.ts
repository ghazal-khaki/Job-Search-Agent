import Fastify, { type FastifyInstance } from "fastify";
import { resourceSchemas, type ResourceName } from "@job-search-agent/contracts";
import type { Database } from "@job-search-agent/db";
import { ZodError } from "zod";
import { TrackerService } from "./tracker-service.js";

const resources = Object.keys(resourceSchemas) as ResourceName[];
const allowedFields: Record<ResourceName, readonly string[]> = {
  companies: ["name", "websiteUrl", "notes"],
  jobs: ["companyId", "title", "location", "description", "sourceName", "sourceUrl", "sourceExternalId", "postedAt", "closedAt"],
  applications: ["jobId", "resumeVersionId", "coverLetterVersionId", "appliedAt", "channel", "notes"],
  statuses: ["applicationId", "status", "occurredAt", "reason"],
  decisions: ["jobId", "outcome", "reason", "decidedAt"],
  "follow-ups": ["applicationId", "dueAt", "completedAt", "note"],
  "resume-versions": ["label", "storageKind", "externalUrl", "uploadPath", "originalFilename", "notes"],
  "cover-letter-versions": ["label", "storageKind", "externalUrl", "uploadPath", "originalFilename", "notes"],
};

export function buildApp(database: Database): FastifyInstance {
  const app = Fastify({ logger: false });
  const service = new TrackerService(database);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) return reply.status(400).send({ error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: error.issues } });
    if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_FOREIGNKEY") return reply.status(409).send({ error: { code: "INVALID_REFERENCE", message: "A referenced record does not exist" } });
    if ((error as { code?: string }).code?.startsWith("SQLITE_CONSTRAINT")) return reply.status(409).send({ error: { code: "CONFLICT", message: "The record conflicts with existing data" } });
    app.log.error(error);
    return reply.status(500).send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } });
  });

  for (const resource of resources) {
    const schema = resourceSchemas[resource];
    app.get(`/api/${resource}`, async () => ({ data: service.list(resource) }));
    app.get<{ Params: { id: string } }>(`/api/${resource}/:id`, async (request, reply) => {
      const record = service.get(resource, request.params.id);
      return record ? { data: record } : reply.status(404).send({ error: { code: "NOT_FOUND", message: `${resource} record not found` } });
    });
    app.post(`/api/${resource}`, async (request, reply) => {
      const input = schema.parse(request.body) as Record<string, unknown>;
      return reply.status(201).send({ data: service.create(resource, input) });
    });
    app.patch<{ Params: { id: string } }>(`/api/${resource}/:id`, async (request, reply) => {
      const current = service.get(resource, request.params.id);
      if (!current) return reply.status(404).send({ error: { code: "NOT_FOUND", message: `${resource} record not found` } });
      const body = request.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new ZodError([{ code: "custom", path: [], message: "Expected an object" }]);
      const allowed = new Set(allowedFields[resource]);
      for (const key of Object.keys(body)) if (!allowed.has(key)) throw new ZodError([{ code: "unrecognized_keys", keys: [key], path: [], message: `Unrecognized key: ${key}` }]);
      const merged = { ...current, ...body };
      for (const key of ["id", "createdAt", "updatedAt"]) delete merged[key];
      if (resource === "resume-versions" || resource === "cover-letter-versions") {
        if (merged.storageKind === "link") delete merged.uploadPath;
        if (merged.storageKind === "upload") delete merged.externalUrl;
      }
      const input = schema.parse(merged) as Record<string, unknown>;
      return { data: service.update(resource, request.params.id, input) };
    });
  }

  return app;
}
