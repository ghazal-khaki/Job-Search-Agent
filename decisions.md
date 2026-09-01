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
- Decision: Prefer local embeddings and minimize transmission of private job-search data. The database technology is not yet selected.
- Reason: This supports privacy, reproducibility, and minimal model cost without prematurely fixing the persistence architecture.

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

- Status: Open
- Options: CLI-first MVP; a minimal review dashboard in the MVP; web UI after evaluation works.
- Decision driver: whether the UI improves actual daily use enough to justify delaying the agent-learning milestones.

## D-008: Application tracker

- Status: Accepted
- Decision: Track where the user has applied, application history, and follow-ups as a first-class but human-controlled part of the product.
- Reason: It makes the project useful during the actual job search and provides the durable state the agent needs without allowing it to invent external actions.

## D-009: Persistence architecture

- Status: Open
- Decision: Decide the database, local/hosted boundary, optional modes, and Docker role in a dedicated architecture discussion.
- Decision drivers: user skill level, MCP process boundary, privacy, vector retrieval, offline behavior, backup/export, deployment cost, and implementation scope.

## Open questions

- What are the confirmed role, location, salary, language, and working-model preferences?
- How should missing salary or ambiguous location be handled?
- Which résumé information may be sent to hosted models?
- Which job sources are permitted and technically stable?
- Should user corrections update rules, retrieval memory, evaluation labels, or all three?
- What is the minimum useful explanation shown for every recommendation?
- Which application statuses and follow-up fields match Ghazaleh's current workflow?
- Is a nontechnical user an actual initial target or a later distribution goal?
- Does the first release need local-only, hosted, or multiple operating modes?
