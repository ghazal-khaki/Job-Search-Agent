# Job Search Agent

## Summary

Job Search Agent is a local-first web app and MCP-powered agent for managing complex job searches.

It helps job seekers save jobs, track applications, connect resume and cover-letter versions, record decisions and responses, manage follow-ups, evaluate fit against nuanced preferences, classify updates, and build a reliable memory of decisions over time. A human remains responsible for applications and external actions.

## Learning goals

- Build a useful local-first job-search tracker before adding automation.
- Understand the complete model tool-calling loop.
- Design and implement an MCP server rather than only consuming one.
- Build a local embedding and vector-retrieval pipeline.
- Orchestrate a multi-step agent workflow with observable state.
- Create an evaluation dataset and measure usefulness, factuality, and reliability.
- Ship the system with tests, Docker, GitHub Actions, documentation, and a low-cost deployment story.

## Proposed end-to-end workflow

```text
job posting or application record
        |
        v
save company, role, documents, dates, status, and notes
        |
        v
track resume / cover-letter version used
        |
        v
retrieve preferences, resume evidence, and past decisions (RAG)
        |
        v
agent-assisted assessment or update classification
        |
        v
human review -> apply, skip, follow up, or update status
        |
        v
local database, MCP tools, and evaluation logs
```

## Problem it solves

The initial problem is not “search every job board automatically.” It is the repeated work that begins once a potentially relevant posting is found:

- copying inconsistent information into one place;
- checking hard constraints repeatedly;
- comparing the role with preferences and résumé evidence;
- spotting duplicates across sources;
- remembering why a job was saved or rejected;
- tracking whether, when, and how an application was submitted;
- keeping follow-ups and outcomes organized;
- evaluating whether an AI recommendation is actually reliable.

The MVP starts as a local application tracker: users can save a job, company, source, application date, status, decision reason, follow-up, resume version, cover-letter version, and optional document links or uploads. The agent layer then evaluates jobs and classifies updates using this data.

## What it does not initially solve

The MVP does not log into or comprehensively crawl StepStone, Indeed, Glassdoor, XING, LinkedIn, and every employer site. Those sources differ in APIs, authentication, page structure, automation rules, and terms. Later acquisition options may include permitted APIs or feeds, email alerts, user-triggered browser capture, structured exports, and explicitly approved connectors.

The product must remain useful without universal source automation. Otherwise its value depends on the most fragile and externally controlled part of the system.

## Long-term acquisition direction

The preferred automation path is a user-curated employer watchlist backed by reusable connectors for public applicant-tracking-system feeds. The agent periodically checks selected companies, detects new, changed, and closed roles, then evaluates only relevant changes.

```text
target employers + permitted job feeds
                 |
                 v
       scheduled source connectors
                 |
                 v
       new / changed / closed jobs
                 |
                 v
       normalize, deduplicate, assess
                 |
                 v
             human review
```

Apify may run connectors, schedules, or experiments, but it is an optional adapter—not the product's data-access permission, business model, or only runtime.

## Current decisions

- Working name and directory: `job-search-agent`.
- Build one integrated project in stages; every stage must remain runnable.
- Prefer a local-first web app for the primary user experience.
- Prefer local embeddings and minimize transmission of private data.
- Prefer simple local persistence first; SQLite is the leading candidate, while MongoDB via Docker is still an option to evaluate.
- Use MCP, RAG, orchestration, and evals because each has a defined learning role—not merely as résumé keywords.
- Begin with pasted files or explicitly supported feeds rather than scraping arbitrary job sites.
- Do not auto-submit applications in the MVP.
- Keep model providers behind an adapter; free model availability is not a stable architectural assumption.

## Current stage

Planning reset is in progress. The product definition is now centered on a local-first job-search tracker with an agent layer. Milestones and issues should be updated from that definition before implementation.

## Effort estimate

- Learning proof of concept: 20-35 hours.
- Portfolio-quality local MVP: 80-130 hours.
- Polished public release with UI, eval reporting, and deployment: 140-220 hours.
- At 10-15 hours per week, expect roughly 2-3 months for a strong MVP and 3-5 months for the polished version while continuing job applications.

The estimates assume small, representative datasets and no production-grade web scraping or automatic application submission.

See [roadmap.md](./roadmap.md) for phases, [github-plan.md](./github-plan.md) for the issue queue, and [decisions.md](./decisions.md) for open choices.

## License

This project is source-available under the [PolyForm Noncommercial License 1.0.0](../LICENSE).

You may use, study, modify, and redistribute it for permitted noncommercial purposes under that license. Commercial use—including offering the software or a modified version as part of a paid product or service—requires a separate written commercial licence from the copyright holder.

Required Notice: Copyright 2026 Ghazaleh Khaki.
