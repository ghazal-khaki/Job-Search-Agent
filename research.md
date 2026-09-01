# Research

Record findings with dates and primary-source links. Provider availability, free tiers, SDK compatibility, and model names are time-sensitive and must be rechecked before implementation.

## Observations from the supplied roadmap

- The progression from tool calling to MCP, RAG, orchestration, and evals is retained.
- The notes first recommend free local embeddings, then mention a paid embeddings API in Stage 2. The baseline decision here is local embeddings; paid providers may be optional comparisons.
- The notes suggest a particular hosted provider, free model route, and model names. These are research leads, not durable guarantees.
- The notes suggest an agent SDK associated with one model ecosystem while also suggesting an OpenAI-compatible third-party endpoint. Compatibility must be proven before selecting either.
- A manually pasted dataset is a valid and desirable first ingestion path because it isolates agent learning from scraping complexity.
- Accuracy alone is insufficient for imbalanced match decisions; evaluation should include positive-match precision/recall and factuality checks.

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
