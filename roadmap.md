# Roadmap

The stages preserve the useful progression in the supplied planning notes while adding explicit architecture, privacy, and evaluation gates.

## Stage 0 - Tool-calling foundation

Estimated effort: 6-10 hours.

- Create the TypeScript workspace, documentation skeleton, environment validation, and secret-safe configuration.
- Add a provider adapter and one minimal tool-calling loop.
- Log the full control flow without logging credentials.
- Test at least one malformed tool request and one provider failure.
- Document what the application, model, and tool each control.

Exit criterion: a repeatable script completes a tool call and its follow-up response through the provider adapter.

## Stage 1 - MCP job store

Estimated effort: 15-25 hours.

- Define the posting, assessment, application, status-history, follow-up, and preference contracts.
- Select the persistence architecture, then implement storage and migrations.
- Implement MCP tools for save, list, retrieve, and update, including human-confirmed application transitions.
- Test tools with an MCP inspection client and automated integration tests.
- Document tool contracts and error behavior.

Exit criterion: the MCP server works without an LLM and safely persists a realistic fixture dataset.

## Stage 2 - Retrieval and RAG

Estimated effort: 15-25 hours.

- Select and benchmark a local embedding option.
- Define chunking, embedding metadata, and re-index behavior.
- Add semantic search as an MCP capability.
- Retrieve preference and résumé evidence as distinct document types.
- Create retrieval-quality examples and record failure cases.

Exit criterion: representative semantic queries return relevant, traceable evidence more reliably than a simple baseline.

## Stage 3 - Orchestrated agent

Estimated effort: 25-40 hours.

- Choose a framework based on a compatibility spike, not familiarity alone.
- Build the explicit workflow and its state transitions.
- Implement controlled file/paste ingestion.
- Separate deterministic constraints from model judgment.
- Connect to the MCP server as a client.
- Add evidence-based explanations and human review.
- Record a complete local demo.

Exit criterion: a bounded batch runs end to end and produces reviewable, evidence-backed recommendations.

## Stage 4 - Evaluation

Estimated effort: 15-25 hours.

- Label a representative evaluation dataset.
- Measure extraction factuality, positive-match precision/recall, and overall agreement.
- Add adversarial and missing-information examples.
- Record unsupported claims separately from recommendation disagreements.
- Turn failures into regression tests.
- Publish an honest evaluation report using synthetic or redistributable examples.

Exit criterion: results are reproducible and the report shows both strengths and failure modes.

## Stage 5 - Portfolio release

Estimated effort: 20-35 hours.

- Add a minimal UI only if it materially improves the demonstration.
- Include a useful application pipeline view if UI work is selected.
- Complete Docker, CI/CD, security, and documentation workflows.
- Produce architecture diagrams and a short demo.
- Publish sanitized example data and a one-command local setup.
- Tag a release and prepare concise portfolio/resume material.

Exit criterion: a reviewer can understand, run, inspect, and evaluate the project without private data or oral explanation.

## Immediate next steps

1. Confirm the actual job-search preferences, application statuses, and MVP input format.
2. Research current free/local model and embedding options.
3. Run a small provider/framework compatibility spike.
4. Freeze the Stage 0 and Stage 1 technology choices.
5. Decide whether the MVP interface is CLI-only or includes a small review UI.
