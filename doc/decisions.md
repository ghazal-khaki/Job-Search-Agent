# Decisions

`Accepted` decisions are current. `Proposed` decisions require validation or approval.

## D-001: One integrated learning project

- Status: Accepted
- Decision: Build MCP, RAG, orchestration, and evals as stages of one useful job-search agent.
- Reason: Integration creates a stronger learning path and portfolio narrative than unrelated demos.

## D-002: Human-in-the-loop scope

- Status: Accepted
- Decision: The agent recommends and organizes; it does not autonomously submit applications in the MVP.
- Reason: Human review improves safety, accuracy, and the usefulness of evaluation.

## D-003: Controlled ingestion first

- Status: Accepted
- Decision: Begin with pasted text, files, or explicitly supported sources.
- Reason: Scraping introduces legal, terms-of-service, reliability, and maintenance concerns unrelated to the initial learning goal.

## D-004: Local-first embeddings and private data

- Status: Accepted
- Decision: Build local-first and minimize transmission of private job-search data. Prefer local embeddings when they are good enough.
- Reason: Job applications, resumes, cover letters, emails, and decision notes are sensitive. The public repo should remain useful without requiring a hosted service.

## D-005: Provider abstraction

- Status: Accepted
- Decision: Do not hard-code the application to one free hosted model or provider.
- Reason: Free model availability, quotas, and tool-calling quality are unstable.

## D-006: Orchestration framework

- Status: Proposed
- Decision: Select the framework only after testing it with the chosen model provider and MCP client path.
- Candidates: a small custom state machine, LangGraph, or a compatible agent SDK.
- Selection criteria: explicit state, testability, tracing, provider compatibility, local operation, and low cost.

## D-007: User interface

- Status: Accepted
- Decision: Build a web app as the primary user experience.
- Reason: Application tracking, statuses, document links, follow-ups, and review workflows are easier to understand and use in a frontend than in a CLI.

## D-008: Application tracker

- Status: Accepted
- Decision: Track where the user has applied, application history, and follow-ups as a first-class but human-controlled part of the product.
- Reason: It makes the project useful during the actual job search and provides the durable state the agent needs without allowing it to invent external actions.

## D-009: Persistence architecture

- Status: Accepted
- Decision: Use SQLite for the local-first database.
- Reason: SQLite works as a single local file, needs no Docker or server process, is easy to back up/export, and fits a public repo that people can run locally. The project should still demonstrate strong full-stack engineering through schema design, migrations, backend APIs, file handling, MCP tools, agent workflows, tests, and evaluation.

## D-010: Source acquisition strategy

- Status: Accepted
- Decision: Begin with controlled inputs, then add a curated employer watchlist and public/approved ATS connectors.
- Reason: This delivers useful recurring discovery without making fragile, prohibited, or nationwide scraping the foundation.

## D-011: Apify role

- Status: Proposed as optional
- Decision: Apify may provide scheduled execution, crawling infrastructure, datasets, monitoring, or prototype actors behind the connector interface.
- Reason: It can reduce infrastructure work, but free usage is limited, Store actors may charge separately, and technical capability does not establish source permission.

## D-012: LinkedIn and XING automation

- Status: Excluded without authorization
- Decision: Do not automate prohibited LinkedIn/XING access in the baseline project. Accept user-controlled inputs and investigate official or explicitly permitted access only.
- Reason: Both services publish restrictions on crawlers, scripts, copying, or automated access.

## D-013: Employer universe

- Status: Accepted for initial automation
- Decision: Monitor a bounded user-selected employer list rather than attempting to enumerate every German company.
- Reason: Relevance, freshness, and connector quality matter more than nominal coverage.

## D-014: Resume and cover-letter tracking

- Status: Accepted
- Decision: Track which resume version and cover-letter version were used for each application. Support both local uploads and external links.
- Reason: Users often tailor documents per company. Recording the exact materials sent makes follow-ups, interviews, and later analysis much more useful.

## D-015: Google integrations

- Status: Proposed
- Decision: Support Google Docs and email as later integrations, while the first tracker works with pasted links and uploaded files.
- Reason: Google Docs and Gmail are highly useful, but OAuth and connector setup can slow the first local MVP. Links/uploads preserve the workflow now and leave a clean path to integrations later.

## D-016: Stage 1 application architecture and tooling

- Status: Accepted
- Runtime and language: Node.js 24 LTS with strict TypeScript and ECMAScript modules across browser, server, shared packages, scripts, and tests. Pin the Node major in the repository and use Corepack to select the package-manager version.
- Package manager and workspace: pnpm with a `pnpm-workspace.yaml` workspace. Keep one lockfile at the repository root and use workspace packages for shared code.
- Applications: `apps/web` is a React single-page application built with Vite; `apps/api` is a Fastify HTTP API. During development Vite proxies `/api` and `/uploads` to Fastify. For a local production-style run, Fastify serves the built web assets as well as the API so the user starts one process and opens one origin.
- Shared packages: `packages/contracts` owns Zod schemas and inferred TypeScript types shared at API boundaries. `packages/core` contains framework-independent domain rules. `packages/db` owns the SQLite connection, Drizzle schema, repositories, and checked-in SQL migrations. Tooling configuration can move to `packages/config` when sharing it is useful.
- Persistence and files: use a local SQLite file through Drizzle ORM and its migration tooling. Store upload metadata in SQLite and file contents in a configurable local data directory; do not store uploads in the Git worktree or expose arbitrary filesystem paths. Database and upload paths are server-owned configuration and remain ignored by Git.
- Validation and API contract: Zod validates environment variables, API inputs, and domain boundaries. The API returns explicit JSON errors. Multipart handling is limited by size and allowed document types. HTTP routes call application services rather than embedding persistence rules, allowing the same services to be reused behind a future MCP server.
- Testing: Vitest covers unit and server integration tests, React Testing Library covers components, and Playwright covers a small number of end-to-end tracker flows. Integration tests use an isolated temporary SQLite database and temporary upload directory. Synthetic fixtures are the only committed job-search data.
- Code quality: ESLint with type-aware TypeScript rules and Prettier are the linting and formatting baseline. Vite transpiles the web app, while `tsc --noEmit` remains a separate required type-check.
- CI: GitHub Actions runs on Ubuntu with a pinned Node 24 major and pnpm version. The initial required workflow performs a frozen install, formatting check, lint, type-check, unit/integration tests, and production build. Add Playwright browser installation and end-to-end execution with the first end-to-end flow; add container and secret-scanning jobs when those artifacts are introduced.
- Monorepo decision: use a small pnpm workspace, but do not add Turborepo in Stage 1. The workspace initially has only two applications and a few packages, so pnpm filtering and package scripts provide enough orchestration without another configuration and cache layer. Reconsider Turborepo when CI time or a larger task graph creates a measured need for remote caching or dependency-aware parallel execution.
- Extension boundaries: a future `apps/mcp-server` consumes `contracts`, `core`, and `db`; a future `apps/agent` consumes `contracts` and reaches tracker operations through MCP in its supported runtime path. Provider, retrieval, and evaluation packages stay outside the web and database layers. This keeps SQLite and uploads local while preventing either the HTTP API or future agent from becoming the only path to domain behavior.
- Reason: this is a modest, fully TypeScript local stack with one install and one workspace, while retaining explicit browser/server boundaries. Fastify supports uploads and a future MCP process better than a browser-only design; shared contracts and framework-independent services prevent transport concerns from leaking into domain logic; pnpm workspaces provide the useful monorepo properties without premature build-system overhead.

## Open questions

- What are the confirmed role, location, salary, language, and working-model preferences?
- How should missing salary or ambiguous location be handled?
- Which résumé information may be sent to hosted models?
- Which job sources are permitted and technically stable?
- Should user corrections update rules, retrieval memory, evaluation labels, or all three?
- What is the minimum useful explanation shown for every recommendation?
- Which application statuses and follow-up fields match the first user workflow?
- Is a nontechnical user an actual initial target or a later distribution goal?
- Does the first release need local-only, hosted, or multiple operating modes?
- How many target employers are enough for the first useful monitoring pilot?
- Which ATS families dominate Ghazaleh's selected German employers?
- Should scheduling run locally, in GitHub Actions, through Apify, or through a later hosted service?
