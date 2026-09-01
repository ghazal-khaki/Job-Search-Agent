# Requirements

Status labels: **MVP**, **Later**, and **Open**.

## Functional requirements

### Posting ingestion and storage

- **MVP:** Import postings from pasted text, Markdown, JSON, or a local fixture directory.
- **MVP:** Preserve original source text alongside normalized fields.
- **MVP:** Store title, company, location, URL when present, description, salary evidence, technology evidence, source, ingestion date, and user notes.
- **MVP:** Detect likely duplicates without silently deleting either record.
- **Later:** Add a source connector only where access and automation are permitted.

### Application tracking

- **MVP:** Give each opportunity a lifecycle status separate from the agent's match recommendation.
- **MVP:** Support at least `discovered`, `reviewing`, `saved`, `applying`, `applied`, `interviewing`, `offer`, `rejected`, `withdrawn`, and `archived`.
- **MVP:** Record status changes as dated history rather than overwriting the only value.
- **MVP:** Store application date, application URL or method, role snapshot, notes, contacts, and next follow-up date when supplied.
- **MVP:** Allow the user to correct status manually; the agent must not infer that an application was submitted without confirmation.
- **MVP:** Distinguish `not applied yet`, `decided not to apply`, and `application rejected`.
- **Later:** Add reminders, interview stages, document versions, and outcome analytics.
- **Later:** Support optional export/import and backup without exposing private application data.

### MCP server

- **MVP:** Save, retrieve, list, update, and classify postings.
- **MVP:** Filter by structured fields and status.
- **MVP:** Search postings semantically.
- **MVP:** Return schemas and errors that are useful to both agents and humans debugging the system.
- **Later:** Expose evaluation runs and preference management through MCP.

### RAG

- **MVP:** Generate embeddings locally or through a replaceable provider adapter.
- **MVP:** Store document chunks and embedding metadata with version information.
- **MVP:** Retrieve relevant postings and preference or résumé evidence.
- **MVP:** Show which retrieved passages informed a recommendation.
- **MVP:** Re-embed data safely when the embedding model or chunking strategy changes.

### Agent orchestration

- **MVP:** Represent the workflow as explicit, inspectable steps rather than an opaque prompt loop.
- **MVP:** Use deterministic code for hard facts and constraints where possible.
- **MVP:** Use the model for extraction or judgment only with evidence from the posting.
- **MVP:** Require human confirmation before changing final disposition or triggering an external action.
- **MVP:** Record tool calls, decisions, model/provider version, and failure reasons with sensitive values redacted.
- **Later:** Resume interrupted runs and process bounded batches.

### Evaluation

- **MVP:** Maintain a labeled set of at least 20 representative postings, expanding beyond that when practical.
- **MVP:** Measure recommendation agreement separately from extraction factuality.
- **MVP:** Test unsupported salary, location, seniority, and technology claims.
- **MVP:** Report precision and recall for the positive-match class in addition to simple accuracy.
- **MVP:** Keep a fixed regression set and a separate exploratory set.
- **Later:** Compare prompts, models, retrieval settings, cost, and latency.

## Quality requirements

- Strict TypeScript and validated data contracts.
- Unit tests for parsing, deterministic filters, scoring, and state transitions.
- Integration tests for MCP tools, storage, embeddings, and provider adapters.
- End-to-end tests for at least one complete ingestion-to-review flow.
- Docker-based reproducible local environment.
- GitHub Actions for linting, types, tests, builds, secret scanning, and container checks.
- No committed tokens, private employer data, or unnecessary personal data.
- Free and local operation must remain possible, even if optional paid providers are later supported.
- Every recommendation must distinguish extracted facts, inferred judgment, and missing information.
- The persistence choice must preserve user control, exportability, and privacy.

## Initial configurable preferences

The exact values must be confirmed rather than copied blindly from earlier notes. The model should support:

- desired and acceptable roles;
- required, preferred, and excluded technologies;
- location, remote, hybrid, relocation, and commute rules;
- language requirements;
- seniority and responsibility preferences;
- salary floor and handling of missing salary information;
- employment type and work-authorization constraints.
