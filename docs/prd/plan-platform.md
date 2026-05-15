# Implementation Plan: Science Genealogy Platform -- Provable Facts Engine

## Spec Reference

This plan implements the requirements defined in [science-genealogy-platform-spec.md](science-genealogy-platform-spec.md). The spec contains the user story, acceptance criteria, proof chain schema, and dogfood-first strategy.

## User Story

As a researcher or technology practitioner, I want to ask "How does [modern technology X] trace back to [foundational theory Y]?" and receive a **provable answer** -- a structured evidence chain with typed transmission paths, confidence scores, and citations I can independently verify.

## Approach

Build in three phases, with Phase 0 (internal dogfood) as the gate for all subsequent work.

### Phase 0: Internal Dogfood (Weeks 1--8)

**Objective**: Prove that the platform delivers provable answers to the company's own team. No external users.

1. **Graph Data Import Pipeline** (Week 1--2)
   - Parse 10 school markdown documents into Neo4j nodes (persons, theories, publications, institutions, modern technologies)
   - Import cross-reference map as typed edges (personal, theoretical, convergence)
   - Preserve evidence citations as edge properties
   - Validate: 34+ personal connections, 20+ theoretical connections, 37+ convergence points
   - Idempotent import (re-running does not create duplicates)

2. **Infer Engine Integration** (Week 2--4)
   - Connect Infer to Neo4j graph via Cypher queries
   - Implement 6-stage proof chain pipeline: query processing -> node mapping -> traversal -> evidence attachment -> confidence scoring -> proof assembly
   - Embedding similarity (sentence-transformers) for query-to-node mapping
   - Deterministic proof chain output (no stochastic variation)
   - ProofChain JSON schema matching the spec

3. **Internal Verification Tool** (Week 4--5)
   - CLI tool (typer + rich) that accepts a markdown document path
   - Extracts factual claims about technology lineage
   - Verifies each claim against the proof engine
   - Reports: verified (with proof chain), unverified (with reason), confidence scores
   - JSON report output for automated processing

4. **RSI Computation** (Week 5--6)
   - Connect to RSTMDB data feeds (citations, GitHub, patents)
   - Implement RSI formula for each tracked lineage
   - Monthly time-series storage
   - Batch computation for 20+ lineages

5. **Gap Detector** (Week 6--7)
   - Compute embedding similarity for all 45 school-pair intersections
   - Compare against existing graph edges
   - Produce Gap Score (0--100) per intersection
   - Rank by likelihood of genuine undocumented connection

6. **Talk-to-Data CLI Interface** (Week 7--8)
   - Interactive CLI for provable Q&A
   - Full proof chain rendering with rich formatting
   - Drill-down into individual chain links
   - Follow-up query support

### Phase 1: External Free Tier (Months 3--5 after Phase 0)

**Objective**: Open the platform to external users with a free tier.

1. Basic web UI with genealogy explorer (React + D3.js)
2. Free tier user management (auth, query counting, sessions)
3. Shareable proof chain URLs
4. Search across graph nodes
5. Researcher tier subscription (Stripe)

### Phase 2: Monetization (Months 6--9 after Phase 0)

**Objective**: Validate willingness to pay.

1. PDF Provenance Certificate export
2. Enterprise API (rate-limited)
3. Advanced search and filtering
4. Patent prior-art report generation
5. Time slider on explorer
6. RSI dashboard for subscribers

### Phase 3: Scale (Months 9--18 after Phase 0)

**Objective**: Enterprise revenue and marketplace.

1. Enterprise tier + SSO
2. Marketplace contribution and validation workflows
3. Fine-tuned embeddings on genealogy data
4. Innovation Triangle (paper + patent + code)
5. Convergence Radar dashboard
6. Marketplace payouts (Stripe Connect)

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Graph DB | Neo4j | Native graph traversal with Cypher; shortest-path queries for lineage tracing |
| Inference | Infer (internal engine) | Core differentiator; deterministic proof chains |
| Embeddings | sentence-transformers | Open source, fine-tunable, adequate for Phase 0 |
| CLI framework | typer + rich | Python ecosystem; matches tech requirements |
| Data feeds | RSTMDB ecosystem | Existing infrastructure for citations, GitHub, patents |
| Backend | Python (FastAPI for Phase 1+) | AI/ML ecosystem compatibility |
| Testing | pytest | Standard Python testing; required by tech requirements |
| Linting | ruff | Fast, comprehensive Python linter |
| Dependencies | uv | Reproducible dependency management |

## Risk Mitigations

| Risk | Mitigation |
|---|---|
| Infer accuracy on genealogy queries | Curated test suite of 50 queries; iterate on node mapping and traversal before Phase 1 |
| Graph import accuracy | Automated comparison script: source markdown vs. graph content |
| RSI data feed reliability | Cache RSTMDB responses; graceful degradation if feeds are unavailable |
| Determinism requirement | No LLM in proof chain assembly path; LLM only in query parsing (Stage 1) |
| Latency at scale | Neo4j index optimization; precomputed embeddings for all nodes |

## Dependencies

| Dependency | Status |
|---|---|
| 10 school research documents | COMPLETED |
| Cross-reference map (91+ connections) | COMPLETED |
| Transmission Path Taxonomy (ADR-002) | COMPLETED |
| Infer engine | EXISTS (internal) |
| RSTMDB ecosystem | EXISTS (internal) |
| Neo4j instance | REQUIRED (provision in Week 1) |

---

*Plan generated by PM Planner Agent. Revision: Provable Facts Engine focus with dogfood-first strategy.*
