import { z } from "zod";

const id = z.string().trim().min(1).max(100);
const optionalText = z.string().trim().max(20_000).nullable().optional();
const optionalUrl = z.url().nullable().optional();
const optionalDate = z.coerce.date().nullable().optional();

export const companyInput = z.object({ name: z.string().trim().min(1).max(200), websiteUrl: optionalUrl, notes: optionalText }).strict();
export const jobInput = z.object({ companyId: id, title: z.string().trim().min(1).max(300), location: optionalText, description: optionalText, sourceName: optionalText, sourceUrl: optionalUrl, sourceExternalId: optionalText, postedAt: optionalDate, closedAt: optionalDate }).strict();
export const applicationInput = z.object({ jobId: id, resumeVersionId: id.nullable().optional(), coverLetterVersionId: id.nullable().optional(), appliedAt: optionalDate, channel: optionalText, notes: optionalText }).strict();
export const statusInput = z.object({ applicationId: id, status: z.enum(["planned", "submitted", "interview", "offer", "rejected", "withdrawn", "closed"]), occurredAt: z.coerce.date(), reason: optionalText }).strict();
export const decisionInput = z.object({ jobId: id, outcome: z.enum(["apply", "skip", "save_for_later", "needs_review"]), reason: z.string().trim().min(1).max(20_000), decidedAt: z.coerce.date() }).strict();
export const followUpInput = z.object({ applicationId: id, dueAt: z.coerce.date(), completedAt: optionalDate, note: z.string().trim().min(1).max(20_000) }).strict();
export const documentVersionInput = z.discriminatedUnion("storageKind", [
  z.object({ label: z.string().trim().min(1).max(200), storageKind: z.literal("link"), externalUrl: z.url(), uploadPath: z.never().optional(), originalFilename: optionalText, notes: optionalText }).strict(),
  z.object({ label: z.string().trim().min(1).max(200), storageKind: z.literal("upload"), uploadPath: z.string().trim().min(1).max(1_000), externalUrl: z.never().optional(), originalFilename: optionalText, notes: optionalText }).strict(),
]);

export const resourceSchemas = { companies: companyInput, jobs: jobInput, applications: applicationInput, statuses: statusInput, decisions: decisionInput, "follow-ups": followUpInput, "resume-versions": documentVersionInput, "cover-letter-versions": documentVersionInput } as const;
export type ResourceName = keyof typeof resourceSchemas;
