# Architecture

## Proposed components

```text
CLI or future web UI
        |
        v
workflow orchestrator ---- model provider adapter
        |                         |
        |                         v
        |                   tool selection and judgment
        v
application core
   |        |          |
   |        |          `---- evaluation recorder
   |        `--------------- retrieval/embedding service
   `------------------------ MCP client or shared MCP operations
                                  |
                                  v
                         MCP job-store server
                                  |
                                  v
                         SQLite + vector extension
```

The exact boundary between the orchestrator and MCP client needs prototyping. To demonstrate genuine MCP use, the orchestrator should consume the job-store server through an MCP client in at least one supported runtime path. Domain logic that must be shared can live in packages beneath both interfaces.

## Proposed repository layout

```text
apps/
|-- agent-cli/
|-- mcp-server/
`-- web/                 # later unless needed for the MVP demo
packages/
|-- core/
|-- contracts/
|-- ingestion/
|-- retrieval/
|-- providers/
|-- evaluation/
`-- test-support/
data/                    # ignored private working data
fixtures/                # synthetic or licensed public test data
docs/
```

This layout is proposed, not yet frozen.

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

## RAG design

Candidate corpora:

- original and normalized job postings;
- explicit job-search preferences;
- a privacy-reviewed résumé representation;
- user corrections and decision rationales.

Each chunk needs a stable source ID, text, document type, embedding model/version, creation time, and enough location metadata to present evidence. Secrets and unnecessary identifying data must not be embedded.

## Storage

The persistence architecture is deliberately open. Local use, nontechnical installation, MCP access, vector retrieval, privacy, backups, and possible multi-device use must be considered together before selecting a database or defining multiple storage modes. Avoid committing to MongoDB, IndexedDB, SQLite, or synchronization behavior until the product workflow and runtime boundary are agreed.

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

- Default to local storage.
- Keep real job data and personal evaluation data out of the public repository.
- Use synthetic or explicitly redistributable fixtures in tests and demos.
- Never send secrets or irrelevant personal information to a model provider.
- Require human approval for external actions.
