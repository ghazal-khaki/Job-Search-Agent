# Roadmap

The project starts with a useful local-first job-search tracker, then adds an agent, MCP tools, RAG memory, integrations, and evaluation.

## Stage 0 - Product definition, milestones, and issues

Estimated effort: 4-8 hours.

Status: In progress. Documents are consolidated under `doc/`, and the product definition is now centered on a local-first web app with an agent layer. Milestones and GitHub issues still need to be finalized and pushed.

- Define the product thesis and first useful workflow.
- Confirm what the app tracks: jobs, companies, application statuses, decisions, follow-ups, resume versions, cover-letter versions, links, and uploads.
- Explain what the agent, MCP, RAG, orchestration, and evaluation each do in this project.
- Convert the roadmap into GitHub milestones.
- Convert each milestone into focused GitHub issues with acceptance criteria.
- Push milestones and issues through GitHub MCP if available.

Exit criterion: the repository has an agreed product definition, milestone structure, and ready implementation issues, either pushed to GitHub or stored locally for pushing.

## Stage 1 - Local job tracker MVP

Estimated effort: 20-35 hours.

- Create the local-first web app and backend/API baseline.
- Choose persistence, with SQLite as the leading candidate and MongoDB/Docker evaluated only if justified.
- Track companies, jobs, applications, statuses, decisions, follow-ups, resume versions, and cover-letter versions.
- Support document links and local uploads for resumes and cover letters.
- Add import by manual entry and pasted job text.
- Keep private data local by default.

Exit criterion: a user can run the app locally, save real application history, connect documents to applications, and manage follow-ups without any AI dependency.

## Stage 2 - Agentic job assessment

Estimated effort: 15-30 hours.

- Add a model-provider adapter and deterministic test double.
- Extract structured facts from pasted job postings.
- Evaluate fit against configurable preferences and hard constraints.
- Support nuanced location and remote-work rules.
- Produce evidence-backed recommendations with uncertainty.
- Require human confirmation before saving decisions or external actions.

Exit criterion: a pasted job can be evaluated, explained, edited by the user, and saved into the tracker.

## Stage 3 - MCP tool layer

Estimated effort: 15-25 hours.

- Expose tracker operations through an MCP server.
- Implement tools for saving, searching, retrieving, and updating jobs, applications, documents, preferences, and follow-ups.
- Keep tool contracts explicit and validated.
- Test the MCP server without an LLM and through at least one MCP client path.

Exit criterion: the agent can safely operate the local job-search system through MCP tools.

## Stage 4 - RAG memory

Estimated effort: 15-30 hours.

- Add semantic search over preferences, job postings, decisions, notes, resume evidence, and cover-letter history.
- Keep source IDs and evidence metadata attached to every retrieved item.
- Compare new jobs against past decisions and similar roles.
- Use retrieval to explain recommendations and expose uncertainty.

Exit criterion: the agent can use past decisions and stored documents to improve job assessment beyond simple field filtering.

## Stage 5 - Google and email integrations

Estimated effort: 20-40 hours.

- Add Google Docs support for resume and cover-letter links if a suitable connector or user-provided OAuth setup is available.
- Add email-update ingestion or classification, starting with user-controlled import if live Gmail integration is too heavy.
- Classify updates as interview, rejection, follow-up, recruiter message, offer, or unknown.
- Keep integrations optional so the app remains useful without external accounts.

Exit criterion: users can connect or import external job-search documents and updates without making the local tracker dependent on those services.

## Stage 6 - Evaluation and reliability

Estimated effort: 15-25 hours.

- Label a representative evaluation dataset.
- Measure extraction factuality, recommendation agreement, retrieval quality, and unsupported claims.
- Add adversarial and missing-information examples.
- Turn failures into regression tests.
- Publish an honest evaluation report using synthetic or redistributable examples.

Exit criterion: results are reproducible and the report shows both strengths and failure modes.

## Stage 7 - Permitted source monitoring

Estimated only after the integrated tracker and agent work.

- Add a target-employer watchlist and source-health model.
- Implement one public or approved ATS connector, with Personio, Greenhouse, Lever, or Ashby as candidates.
- Add stable-ID/content-hash change detection and new/changed/closed events.
- Schedule bounded checks locally or through a replaceable runner.
- Exclude prohibited LinkedIn/XING/job-board automation from the baseline.

Exit criterion: selected employers are monitored reliably without prohibited account automation, and new relevant roles enter the existing human-review pipeline.

## Stage 8 - Public portfolio release

Estimated effort: 20-35 hours.

- Complete Docker/local setup, CI, security notes, and documentation workflows.
- Include sanitized demo data.
- Produce architecture diagrams and a short demo.
- Explain privacy boundaries, integration limits, and non-goals clearly.
- Tag a release and prepare concise portfolio/resume material.

Exit criterion: a reviewer can understand, run, inspect, and evaluate the project without private data or oral explanation.

## Immediate next steps

1. Finalize Stage 0 product definition and milestone names.
2. Decide whether SQLite is accepted for Stage 1 persistence.
3. Draft GitHub issues for Stage 1 and Stage 2.
4. Create milestones in GitHub, then push issues through the GitHub connector where possible.
5. Confirm the first implementation issue before creating code.
