CREATE TABLE `companies` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `website_url` text, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_name_unique` ON `companies` (`name`);
--> statement-breakpoint
CREATE TABLE `jobs` (`id` text PRIMARY KEY NOT NULL, `company_id` text NOT NULL REFERENCES `companies`(`id`) ON UPDATE cascade ON DELETE restrict, `title` text NOT NULL, `location` text, `description` text, `source_name` text, `source_url` text, `source_external_id` text, `posted_at` integer, `closed_at` integer, `created_at` integer NOT NULL, `updated_at` integer NOT NULL);
--> statement-breakpoint
CREATE INDEX `jobs_company_id_idx` ON `jobs` (`company_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_source_identity_unique` ON `jobs` (`source_name`,`source_external_id`);
--> statement-breakpoint
CREATE TABLE `resume_versions` (`id` text PRIMARY KEY NOT NULL, `label` text NOT NULL, `storage_kind` text NOT NULL, `external_url` text, `upload_path` text, `original_filename` text, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL, CONSTRAINT `resume_versions_storage_kind_valid` CHECK (`storage_kind` in ('link', 'upload')), CONSTRAINT `resume_versions_source_matches_kind` CHECK ((`storage_kind` = 'link' and `external_url` is not null and `upload_path` is null) or (`storage_kind` = 'upload' and `upload_path` is not null and `external_url` is null)));
--> statement-breakpoint
CREATE TABLE `cover_letter_versions` (`id` text PRIMARY KEY NOT NULL, `label` text NOT NULL, `storage_kind` text NOT NULL, `external_url` text, `upload_path` text, `original_filename` text, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL, CONSTRAINT `cover_letter_versions_storage_kind_valid` CHECK (`storage_kind` in ('link', 'upload')), CONSTRAINT `cover_letter_versions_source_matches_kind` CHECK ((`storage_kind` = 'link' and `external_url` is not null and `upload_path` is null) or (`storage_kind` = 'upload' and `upload_path` is not null and `external_url` is null)));
--> statement-breakpoint
CREATE TABLE `applications` (`id` text PRIMARY KEY NOT NULL, `job_id` text NOT NULL REFERENCES `jobs`(`id`) ON UPDATE cascade ON DELETE restrict, `resume_version_id` text REFERENCES `resume_versions`(`id`) ON UPDATE cascade ON DELETE restrict, `cover_letter_version_id` text REFERENCES `cover_letter_versions`(`id`) ON UPDATE cascade ON DELETE restrict, `applied_at` integer, `channel` text, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL);
--> statement-breakpoint
CREATE INDEX `applications_job_id_idx` ON `applications` (`job_id`);
--> statement-breakpoint
CREATE TABLE `application_status_events` (`id` text PRIMARY KEY NOT NULL, `application_id` text NOT NULL REFERENCES `applications`(`id`) ON UPDATE cascade ON DELETE cascade, `status` text NOT NULL, `occurred_at` integer NOT NULL, `reason` text, `created_at` integer NOT NULL, CONSTRAINT `application_status_events_status_valid` CHECK (`status` in ('planned', 'submitted', 'interview', 'offer', 'rejected', 'withdrawn', 'closed')));
--> statement-breakpoint
CREATE UNIQUE INDEX `application_status_events_timeline_unique` ON `application_status_events` (`application_id`,`occurred_at`);
--> statement-breakpoint
CREATE TABLE `decisions` (`id` text PRIMARY KEY NOT NULL, `job_id` text NOT NULL REFERENCES `jobs`(`id`) ON UPDATE cascade ON DELETE cascade, `outcome` text NOT NULL, `reason` text NOT NULL, `decided_at` integer NOT NULL, `created_at` integer NOT NULL, CONSTRAINT `decisions_outcome_valid` CHECK (`outcome` in ('apply', 'skip', 'save_for_later', 'needs_review')));
--> statement-breakpoint
CREATE INDEX `decisions_job_id_decided_at_idx` ON `decisions` (`job_id`,`decided_at`);
--> statement-breakpoint
CREATE TABLE `follow_ups` (`id` text PRIMARY KEY NOT NULL, `application_id` text NOT NULL REFERENCES `applications`(`id`) ON UPDATE cascade ON DELETE cascade, `due_at` integer NOT NULL, `completed_at` integer, `note` text NOT NULL, `created_at` integer NOT NULL, `updated_at` integer NOT NULL);
--> statement-breakpoint
CREATE INDEX `follow_ups_application_due_at_idx` ON `follow_ups` (`application_id`,`due_at`);
