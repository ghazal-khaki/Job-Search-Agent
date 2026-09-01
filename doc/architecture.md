# Architecture

## Proposed components

```text
React/Vite web UI -> Fastify HTTP API -> application core -> SQLite + uploads
                                             |
future agent -> MCP client -> MCP server -----+
      |                                      |
      +-> model provider adapter             +-> retrieval/evaluation services
```

The Stage 1 web path calls application services through the HTTP API. The exact boundary between the future orchestrator and MCP client still needs prototyping. To demonstrate genuine MCP use, the orchestrator should consume the job-store server through an MCP client in at least one supported runtime path. Domain logic shared by the HTTP and MCP transports lives in packages beneath both interfaces.

## Accepted Stage 1 repository layout

```text
apps/
|-- api/                 # Fastify HTTP API and local file handling
`-- web/                 # React/Vite local tracker
packages/
|-- contracts/
|-- core/
`-- db/                  # SQLite, Drizzle schema, and migrations
data/                    # ignored local database and uploads
fixtures/                # synthetic or licensed public test data
doc/
```

This is a pnpm workspace without Turborepo for Stage 1. Future capabilities extend
the layout instead of changing its boundaries: `apps/mcp-server` reuses the
contracts, application services, and repositories; an agent application consumes
the MCP interface; and retrieval, provider, evaluation, ingestion, configuration,
and test-support packages are added only when their stages need them. See D-016 in
[`decisions.md`](./decisions.md) for the complete tooling baseline and rationale.

## Agent design

Prefer an explicit state machine or graph with bounded steps:

1. ingest and validate input;
2. extract structured facts;
3. run deterministic eligibility checks;
4. retrieve relevant evidence;
5. assess match and uncertainty;
6. validate that claims are supported;
7. request human review;
8. persist the decision and trace.

The model must not be the source of truth for values already present in structured data.

## Source acquisition architecture

```text
EmployerWatchlist
        |
        v
SourceScheduler ---- optional Apify runner
        |
        v
SourceConnector
  |-- public ATS API/feed
  |-- email/export import
  |-- user-triggered capture
  `-- approved website adapter
        |
        v
RawPostingSnapshot -> normalize -> deduplicate -> change events
```

Each source configuration should record its owner, career URL, source/ATS type, permission or terms review, schedule, last successful check, failure state, and connector version.

### Preferred source ladder

1. User paste/file and test fixtures.
2. Public or explicitly enabled employer/ATS feeds.
3. Job-alert email or structured export controlled by the user.
4. User-triggered browser capture after policy review.
5. Permission-based career-site adapters.
6. Broad job-board automation only through an authorized API or agreement.

Do not build the core product around scraping LinkedIn or XING. A third-party actor may be technically capable of fetching a site while its use still violates the site's terms or risks account restriction. Proxies and anti-blocking techniques are not substitutes for permission.

### Change detection

- Prefer stable upstream job IDs plus canonical employer and source identifiers.
- Store a normalized content hash and a permitted raw snapshot or extract for replay.
- Compare meaningful fields so cosmetic HTML changes do not trigger reassessment.
- Emit immutable discovery, change, and closure events.
- Treat disappearance cautiously: it may mean closure, source failure, or a reduced feed window.
- Re-evaluate only when relevant content changes or the user requests it.

### Why not every German company

The population is too large and mostly irrelevant to one candidate. Discovering every company, finding its real career site, detecting its ATS, maintaining parsers, and checking it responsibly would turn the project into a separate job-search engine and crawling operation. The first automated version should monitor tens of selected employers and expand through reusable ATS connectors.

## RAG design

Candidate corpora:

- original and normalized job postings;
- explicit job-search preferences;
- a privacy-reviewed résumé representation;
- user corrections and decision rationales.

Each chunk needs a stable source ID, text, document type, embedding model/version, creation time, and enough location metadata to present evidence. Secrets and unnecessary identifying data must not be embedded.

## Storage

The application is local-first. SQLite is the accepted Stage 1 persistence choice because it can run as a single local file without Docker or a separate database process. Drizzle owns the schema and checked-in SQL migrations. Browser-only storage such as IndexedDB may be useful for caching or offline UI behavior, but it is not the system of record.

Uploaded document metadata lives in SQLite and file contents live under a configurable, ignored local data directory. The API owns those paths, enforces upload limits and allowed document types, and never accepts arbitrary client filesystem paths. Backup/export must account for both the SQLite file and upload directory.

The initial backup/export contract must include both the database and upload directory. Vector retrieval details and whether multiple local users share one installation remain later design questions.

## Application tracking model

Keep job-posting assessment and job-application progress separate:

- `Opportunity`: normalized posting and source evidence.
- `Assessment`: agent/user match decision, score, explanation, and model/rule versions.
- `Application`: the user's application-specific record and current status.
- `ApplicationStatusEvent`: immutable timestamped transition with optional note and actor.
- `Contact`: optional recruiter or company contact with minimal personal data.
- `FollowUp`: due date, state, and note.

This prevents `good match`, `saved`, `applied`, and `rejected` from becoming one ambiguous status field.

## Model and framework portability

Model access must sit behind a small adapter. Free hosted model names, quotas, tool-calling behavior, and availability can change. The orchestration framework should be selected after a thin experiment proves:

- compatibility with the chosen provider;
- reliable structured output and tool calls;
- usable tracing and testability;
- no mandatory paid hosted service;
- reasonable local-development ergonomics.

## Privacy and safety

- Keep private data local where practical; document any hosted-data boundary explicitly.
- Keep real job data and personal evaluation data out of the public repository.
- Use synthetic or explicitly redistributable fixtures in tests and demos.
- Never send secrets or irrelevant personal information to a model provider.
- Require human approval for external actions.
