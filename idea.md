# Idea

## Problem

Job searching requires repeatedly reading inconsistent postings, checking hard constraints, comparing roles with personal preferences, detecting duplicates, and remembering why a role was accepted or rejected. Generic keyword filters miss semantic matches, while unconstrained LLM recommendations can invent facts or hide their reasoning.

## Proposed solution

Build a human-in-the-loop agent that:

1. accepts job postings from controlled inputs;
2. extracts and normalizes facts while retaining the original text;
3. applies deterministic hard constraints;
4. retrieves relevant preferences, résumé evidence, and similar postings;
5. produces a cited match assessment;
6. lets the user approve, reject, or correct the result;
7. stores outcomes through MCP tools;
8. evaluates performance on a manually labeled dataset.

## Intended user

The initial user is Ghazaleh, a senior frontend engineer with full-stack capability seeking suitable software-engineering opportunities in Germany. The architecture may become configurable for other users later, but generic multi-user SaaS behavior is outside the MVP.

## Why this is a strong portfolio project

- The domain is real and personally useful.
- MCP has a clear boundary around the job repository and its operations.
- RAG has a measurable purpose: retrieving preferences, résumé evidence, and semantically similar jobs.
- Orchestration combines deterministic logic, retrieval, tools, and model judgment.
- Evals demonstrate engineering maturity and make improvement visible.
- Provider adapters, local models, and documented trade-offs show cost-aware architecture.

## Scope boundaries

The first release is not:

- an autonomous application-submission system;
- an arbitrary job-site scraper;
- a recruiter outreach bot;
- a promise that an LLM can determine career fit without human judgment;
- a large-scale multi-user recruitment platform.
