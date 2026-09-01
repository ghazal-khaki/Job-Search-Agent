# Research

Record findings with dates and primary-source links. Provider availability, free tiers, SDK compatibility, and model names are time-sensitive and must be rechecked before implementation.

## Observations from the supplied roadmap

- The progression from tool calling to MCP, RAG, orchestration, and evals is retained.
- The notes first recommend free local embeddings, then mention a paid embeddings API in Stage 2. The baseline decision here is local embeddings; paid providers may be optional comparisons.
- The notes suggest a particular hosted provider, free model route, and model names. These are research leads, not durable guarantees.
- The notes suggest an agent SDK associated with one model ecosystem while also suggesting an OpenAI-compatible third-party endpoint. Compatibility must be proven before selecting either.
- A manually pasted dataset is a valid and desirable first ingestion path because it isolates agent learning from scraping complexity.
- Accuracy alone is insufficient for imbalanced match decisions; evaluation should include positive-match precision/recall and factuality checks.

## Source acquisition findings - 2026-09-01

### Apify

- [Apify schedules](https://docs.apify.com/actors/running/schedules) can run Actors or tasks periodically through its console or APIs.
- [Apify documentation](https://docs.apify.com/) covers crawling, storage, proxies, schedules, monitoring, integrations, and an MCP server for Actors.
- The [free plan](https://apify.com/pricing) currently advertises USD 5 of monthly platform usage; Actor Store charges may be separate. This is suitable for bounded experiments, not an assumption of free nationwide monitoring.
- Availability of a Store scraper does not prove that using it complies with the target site's terms.

### LinkedIn and XING

- [LinkedIn's help policy](https://www.linkedin.com/help/linkedin/answer/a1341387/prohibited-software-and-extensions) says it does not permit third-party crawlers, bots, browser extensions, or other software that scrapes or automates the service, and warns of account restriction.
- [LinkedIn API terms](https://www.linkedin.com/legal/l/api-terms-of-use) restrict scraped/non-official content and aggregation outside authorized APIs.
- [XING's current terms](https://www.xing.com/legal/api/pages/terms_and_conditions/xing.html) prohibit mechanisms, software, or scripts while using XING websites unless authorized, as well as copying/distributing content outside intended use.
- Baseline conclusion: do not make automated LinkedIn/XING access part of the public MVP without authorized access and a fresh terms review.

### Employer ATS feeds

- [Greenhouse's Job Board API](https://docs.greenhouse.io/job-board.html) exposes public published-job GET endpoints without authentication.
- [Personio documents an XML job feed](https://support.personio.de/hc/en-us/articles/207576365-Integrate-jobs-from-Personio-into-your-company-website-via-XML) that employers can enable for published positions and languages.
- ATS feeds are promising because many employer career pages present structured upstream job data.
- Feed availability and reuse terms must still be checked per provider and employer; public accessibility is not a universal licence.

### Employer scope

“All German companies” is not an MVP dataset. Start with a user-selected collection of relevant employers and expand through explicit discovery and reusable ATS detection. A nationwide company/career-site index has separate acquisition, crawler-operations, legal, search, and business requirements.

## Research backlog

### Providers and models

- Current free hosted model availability, quotas, privacy terms, tool-calling reliability, and structured-output support.
- Local model feasibility on the development machine.
- Provider adapter contract and deterministic test doubles.

### MCP

- Current official TypeScript SDK, transports, inspection tools, and client integration patterns.
- Schema conventions, error contracts, pagination, and server packaging.

### Retrieval

- Local embedding models suitable for English and German job text.
- SQLite vector-extension support across macOS, Linux, Docker, and CI.
- Retrieval baseline, chunking strategy, hybrid lexical/vector search, and evaluation metrics.

### Orchestration

- Compare a small explicit state machine with available agent frameworks.
- Framework/provider compatibility, MCP consumption, checkpoints, tracing, and testability.
- Cost and privacy implications of hosted tracing products.

### Job-data sources

- Permitted APIs, feeds, email exports, browser exports, and user-pasted inputs.
- Source terms, robots policies, redistribution limits, and deletion requirements.
- Synthetic or redistributable datasets for the public demo.
- Public ATS feed discovery, terms, rate limits, stable identifiers, and deletion behavior.
- Employer watchlist creation and ATS detection without indiscriminate bulk crawling.

### Evaluation

- Label schema and guidance for ambiguous postings.
- Interactions between hard filters and subjective ranking.
- Extraction factuality tests and evidence-grounding metrics.
- Regression-set versioning without publishing private job-search data.

## Unverified leads from the original discussion

- OpenRouter or another OpenAI-compatible gateway for hosted experimentation.
- Local sentence-transformer or Ollama-based embeddings.
- SQLite with a vector extension or a dedicated local vector store.
- LangGraph, a compatible agent SDK, or a custom state machine.

No lead above should become a dependency until current official documentation and a small working experiment confirm it.
