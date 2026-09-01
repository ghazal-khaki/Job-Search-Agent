# Implementation Handoff

Last updated: 2026-09-01

Read this file, then `doc/README.md`, `doc/decisions.md`, and `doc/roadmap.md` before changing scope or scaffolding code.

## Repository

- GitHub remote: `git@github.com:ghazal-khaki/Job-Search-Agent.git`
- Planning documents are being consolidated under `doc/`; implementation has not started.
- Licence: PolyForm Noncommercial 1.0.0; source-available and noncommercial by default.
- Check Git status: `LICENSE`, this handoff, and recent documentation changes may still need committing and pushing.

## Goal

Build and evaluate one integrated, human-in-the-loop job-search agent that:

1. ingests controlled job-posting inputs;
2. normalizes and preserves source evidence;
3. applies deterministic hard constraints;
4. uses RAG to retrieve preferences, résumé evidence, and similar postings;
5. produces evidence-backed assessments with uncertainty;
6. lets the user confirm or correct decisions;
7. tracks applications, status history, and follow-ups;
8. exposes the job store through MCP;
9. records and evaluates factuality and recommendation quality.

## Explicit first-MVP non-goals

- No automatic application submission.
- No arbitrary job-site scraping.
- No automated prohibited LinkedIn or XING access.
- No attempt to index every German company.
- No assumption that free hosted models/services remain available.
- No premature database decision; persistence remains open.

## Accepted direction

- TypeScript primary stack.
- One staged project; every stage remains runnable.
- MCP, RAG, orchestration, and evals each need a functional role.
- Human confirmation before external actions or application-status claims.
- Controlled ingestion first.
- Local embeddings preferred; model/orchestration providers replaceable.
- Assessment and application progress are separate concepts.
- Later automation uses a bounded employer watchlist and public/approved ATS connectors.
- Apify is optional infrastructure, not permission to access a source or a mandatory dependency.

## Open decisions

- Persistence and local/hosted runtime boundary.
- CLI-first versus minimal review UI.
- Exact application statuses and personal workflow.
- Model provider and orchestration approach after a compatibility spike.
- Local embedding model and vector store.
- Package manager, monorepo tooling, validation library, testing stack, and Node version.

## Recommended project start

1. Consolidate all planning and instruction documents under `doc/`.
2. Review the documents for contradictions, open decisions, and missing product boundaries.
3. Define GitHub milestones from the roadmap.
4. Define GitHub issues from the milestone work items, with acceptance criteria.
5. Push milestones and issues through GitHub MCP if the connector is available.
6. Start implementation only after the first milestone and issue queue are agreed.

## Later source-monitoring direction

Start with tens of selected employers. Prefer public/approved ATS feeds, job-alert emails or exports, user-triggered capture, then permission-based career-page adapters. Use stable IDs and meaningful content hashes to emit new/changed/closed events and avoid reassessing unchanged jobs. Treat disappearance as ambiguous until source health is known.

## Privacy reminders

- Keep real postings, application history, contacts, résumé derivatives, embeddings, traces, and private evaluation labels out of the public repository.
- Use synthetic or redistributable fixtures.
- Never log API keys or unnecessary personal data.
- Preserve source attribution and record the permission/terms basis for automated connectors.
