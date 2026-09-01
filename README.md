# Job Search Agent

## Summary

Job Search Agent is a learning and portfolio project that applies MCP, retrieval-augmented generation (RAG), multi-step orchestration, and evaluation to a real problem: reviewing and organizing job opportunities.

The product is a decision-support copilot. It ingests job postings from user-provided or explicitly permitted sources, stores them through an MCP server, retrieves relevant postings semantically, evaluates them against configurable preferences, and explains its recommendations. A human remains responsible for decisions and applications.

## Learning goals

- Understand the complete model tool-calling loop.
- Design and implement an MCP server rather than only consuming one.
- Build a local embedding and vector-retrieval pipeline.
- Orchestrate a multi-step agent workflow with observable state.
- Create an evaluation dataset and measure usefulness, factuality, and reliability.
- Ship the system with tests, Docker, GitHub Actions, documentation, and a low-cost deployment story.

## Proposed end-to-end workflow

```text
approved input source
        |
        v
parse and normalize posting
        |
        v
deterministic eligibility checks
        |
        v
retrieve preferences and similar postings (RAG)
        |
        v
model-assisted assessment with evidence
        |
        v
human review -> save, reject, or follow up
        |
        v
MCP-backed job store and evaluation logs
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

The MVP accepts postings through controlled inputs such as paste, file, or a supported export. It normalizes them, applies deterministic filters, retrieves relevant evidence, produces an evidence-backed assessment, and stores the human-confirmed decision and application history.

## What it does not initially solve

The MVP does not log into or comprehensively crawl StepStone, Indeed, Glassdoor, XING, LinkedIn, and every employer site. Those sources differ in APIs, authentication, page structure, automation rules, and terms. Later acquisition options may include permitted APIs or feeds, email alerts, user-triggered browser capture, structured exports, and explicitly approved connectors.

The product must remain useful without universal source automation. Otherwise its value depends on the most fragile and externally controlled part of the system.

## Current decisions

- Working name and directory: `job-search-agent`.
- Build one integrated project in stages; every stage must remain runnable.
- Use TypeScript for the primary application and MCP implementation.
- Prefer local embeddings and local storage to minimize cost and protect data.
- Use MCP, RAG, orchestration, and evals because each has a defined learning role—not merely as résumé keywords.
- Begin with pasted files or explicitly supported feeds rather than scraping arbitrary job sites.
- Do not auto-submit applications in the MVP.
- Keep model providers behind an adapter; free model availability is not a stable architectural assumption.

## Current stage

Discovery. The supplied roadmap has been converted into project requirements and phases. Provider, framework, ingestion, and UI choices still need validation.

## Effort estimate

- Learning proof of concept: 20-35 hours.
- Portfolio-quality local MVP: 80-130 hours.
- Polished public release with UI, eval reporting, and deployment: 140-220 hours.
- At 10-15 hours per week, expect roughly 2-3 months for a strong MVP and 3-5 months for the polished version while continuing job applications.

The estimates assume small, representative datasets and no production-grade web scraping or automatic application submission.

See [roadmap.md](./roadmap.md) for phases and [decisions.md](./decisions.md) for open choices.
