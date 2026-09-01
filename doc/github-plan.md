# GitHub Milestones and Issues

This file is the local source of truth for GitHub setup until milestones and issues are pushed.

## Milestone 0 - Product definition, milestones, and issues

Goal: agree what the app does and turn that into an implementation queue before code starts.

Issues:

### 0.1 Consolidate and review project documents

Acceptance criteria:

- All planning and instruction documents live under `doc/`.
- The root `README.md` points to the document folder.
- The documents no longer claim that an implementation scaffold exists.
- Any contradiction or unresolved assumption is captured in `doc/decisions.md`.

### 0.2 Define the product thesis

Acceptance criteria:

- The product is described as a local-first web app and MCP-powered agent for complex job searches.
- The first useful workflow is clear: track jobs, applications, documents, responses, decisions, and follow-ups.
- The agent's role is clear: evaluate jobs, classify updates, retrieve memory, and suggest next actions while the user remains in control.
- Non-goals include automatic application submission and prohibited LinkedIn/XING/job-board automation.

### 0.3 Decide the first persistence direction

Acceptance criteria:

- SQLite, MongoDB through Docker, and browser-only storage are compared for local-first use.
- The selected Stage 1 persistence choice is recorded in `doc/decisions.md`.
- The fallback behavior when Docker or a database service is unavailable is explicit.

### 0.4 Create GitHub milestones and first issue queue

Acceptance criteria:

- Roadmap stages have matching GitHub milestones.
- Stage 1 and Stage 2 issues are small enough to complete independently.
- Each issue has acceptance criteria and privacy/test notes.

## Milestone 1 - Local job tracker MVP

Goal: let a user run the app locally and track a real job search without AI.

Issues:

### 1.1 Choose app architecture and tooling

Acceptance criteria:

- Frontend, backend, package manager, monorepo approach, validation library, test framework, and CI baseline are chosen.
- The decision explains whether the repo uses a Turborepo-style monorepo.
- The choice is recorded in `doc/decisions.md`.

### 1.2 Implement local persistence baseline

Acceptance criteria:

- The app can run locally with the selected database.
- Setup works from a fresh clone.
- Private user data is excluded from Git.
- Backup/export strategy is documented at a basic level.

### 1.3 Model core job-search data

Acceptance criteria:

- The database can represent companies, jobs, applications, status events, decisions, follow-ups, resume versions, and cover-letter versions.
- Resume and cover-letter records support both links and uploads.
- One application can reference the exact resume and cover letter used.

### 1.4 Build tracker screens

Acceptance criteria:

- Users can create, view, edit, and list jobs and applications.
- Users can record status changes, decision reasons, follow-up dates, resume versions, and cover-letter versions.
- The UI works without any AI provider configured.

## Milestone 2 - Agentic job assessment

Goal: help the user evaluate a pasted job against preferences and save the result into the tracker.

Issues:

### 2.1 Define user preferences and hard constraints

Acceptance criteria:

- Preferences cover role, location, remote/hybrid policy, language, salary, industry, seniority, and dealbreakers.
- Nuanced rules such as "hybrid once a month counts as remote" can be represented.
- Missing or uncertain facts are handled without guessing.

### 2.2 Implement provider adapter and deterministic test double

Acceptance criteria:

- Model access is behind a small adapter interface.
- A deterministic test double can simulate normal, malformed, and failed provider responses.
- No provider-specific API details leak into domain logic.

### 2.3 Extract structured facts from pasted jobs

Acceptance criteria:

- The agent extracts company, title, location, remote policy, language requirement, salary hints, seniority, and tech stack.
- Extracted facts are editable before saving.
- Unsupported or ambiguous claims are marked uncertain.

### 2.4 Generate evidence-backed fit assessment

Acceptance criteria:

- The agent recommends apply, skip, save for later, or needs review.
- The recommendation includes evidence and uncertainty.
- The user confirms before the result changes tracker state.

## Milestone 3 - MCP tool layer

Goal: expose the local tracker through safe MCP tools.

Issues:

### 3.1 Implement tracker MCP server

Acceptance criteria:

- MCP tools can create, search, retrieve, and update jobs, applications, documents, preferences, and follow-ups.
- Tool inputs are validated.
- The MCP server can be tested without an LLM.

### 3.2 Connect agent workflow through MCP

Acceptance criteria:

- The agent uses MCP tools for tracker operations.
- External actions and status changes remain human-confirmed.
- Tool errors are handled clearly in the UI or logs.

## Milestone 4 - RAG memory

Goal: make recommendations use stored preferences, past decisions, similar jobs, and document history.

Issues:

### 4.1 Add semantic memory index

Acceptance criteria:

- Preferences, job notes, past decisions, resume evidence, and cover-letter history can be searched semantically.
- Retrieved items include source IDs and evidence metadata.
- Private data boundaries are documented.

### 4.2 Use memory in assessment

Acceptance criteria:

- New job assessments compare against relevant past decisions and similar jobs.
- Recommendations cite retrieved evidence or mark uncertainty.
- Retrieval failures are visible and testable.

## Milestone 5 - Google and email integrations

Goal: connect documents and updates while keeping integrations optional.

Issues:

### 5.1 Add Google Docs document support

Acceptance criteria:

- Resume and cover-letter records can store Google Docs links.
- If live Google integration is available, metadata can be fetched with user authorization.
- The app still works with plain links and uploads.

### 5.2 Add email update import or classification

Acceptance criteria:

- The app can classify job-search emails as interview, rejection, follow-up, recruiter message, offer, or unknown.
- The first version may use user-controlled import before live Gmail.
- Classified updates can be attached to applications.

## Milestone 6 - Evaluation and reliability

Goal: prove the agent is useful, factual, and appropriately uncertain.

Issues:

### 6.1 Build evaluation dataset

Acceptance criteria:

- Examples are synthetic or explicitly redistributable.
- Labels cover extraction, recommendations, missing information, duplicates, and adversarial postings.

### 6.2 Add evaluation report

Acceptance criteria:

- The report shows extraction factuality, recommendation agreement, retrieval quality, and unsupported claims.
- Failures become regression tests.

## Milestone 7 - Permitted source monitoring

Goal: monitor selected employers or approved feeds after the core tracker and agent work.

Issues:

### 7.1 Define employer watchlist model

Acceptance criteria:

- Watchlist entries capture owner, career URL, source type, permission/terms basis, schedule, health, and connector version.

### 7.2 Implement first approved source connector

Acceptance criteria:

- One public or approved ATS feed is supported.
- New, changed, and closed jobs are detected with stable IDs and content hashes.
- Prohibited LinkedIn/XING/job-board automation remains excluded.

## Milestone 8 - Public portfolio release

Goal: make the project easy to run, inspect, and understand from a public repo.

Issues:

### 8.1 Prepare local setup and demo data

Acceptance criteria:

- A reviewer can run the app locally from a fresh clone.
- Sanitized demo data is included.
- Docker/local setup and CI are documented.

### 8.2 Prepare portfolio materials

Acceptance criteria:

- Architecture diagrams, demo notes, privacy notes, and limitations are complete.
- The release honestly explains what integrations are supported and what is intentionally excluded.
