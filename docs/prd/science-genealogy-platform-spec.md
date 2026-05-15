# PRD: Science Genealogy Platform -- Provable Facts Engine

**Spec ID**: science-genealogy-platform
**Date**: 2026-03-29
**Author**: PM Planner Agent (revised)
**Status**: Draft
**North Star Metric**: Provable Answers Delivered (internally, then externally)

---

## Description

A platform that proves claims about technology lineage by producing auditable evidence chains traced through a curated genealogy graph of 10 Soviet/Eastern European science schools (91+ verified connections). Built on the Infer engine, which distinguishes this platform from every competitor: every answer includes a structured proof chain with typed transmission paths (Direct/Reformulation/Convergent/Indirect), per-link confidence scores, and cited evidence. The first customer is the company itself -- the internal team uses the platform to verify research claims, find new connections, and compute Research Strength Index scores before any external release.

## User Story

As a researcher or technology practitioner, I want to ask "How does [modern technology X] trace back to [foundational theory Y]?" and receive a **provable answer** -- not an LLM-generated guess, but a structured evidence chain with typed transmission paths, confidence scores, and citations I can independently verify -- so that I can trust the lineage, cite it in publications, and use it for patent prior-art analysis.

## Acceptance Criteria

- [ ] AC1: Infer engine accepts natural language queries about technology lineage and returns structured proof chain objects (not free-text responses)
- [ ] AC2: Every proof chain link carries a typed transmission path (Direct, Reformulation, Convergent, or Indirect) and a confidence score (0.0--1.0)
- [ ] AC3: Every proof chain link cites at least one evidence source (paper, book, verified connection from the genealogy graph)
- [ ] AC4: Users can inspect the full proof chain, drilling into any individual link to see its evidence and confidence rationale
- [ ] AC5: Graph data import pipeline ingests all 10 school markdown documents and the cross-reference map into Neo4j with 95%+ accuracy validated against source documents
- [ ] AC6: Internal verification tool accepts a markdown research document, extracts factual claims, and reports verified/unverified status with confidence scores
- [ ] AC7: Platform computes RSI (Research Strength Index, 0--100 scale) for each tracked lineage using citation velocity, GitHub activity, and patent filings
- [ ] AC8: Gap detector identifies school pairs with potential but undocumented connections, producing a Gap Score (0--100) per intersection
- [ ] AC9: CLI tooling uses typer for commands and rich for formatted terminal output
- [ ] AC10: All proof chains are reproducible -- running the same query twice against the same graph version produces identical results
- [ ] AC11: Proof chain latency under 5 seconds (p95) for queries traversing up to 6 hops
- [ ] AC12: Internal dogfood: team members can query "How is [modern tech X] connected to [Soviet school Y]?" and receive a provable answer against the 10-school knowledge base

## Technical Requirements

- **Testing**: pytest for all unit and integration tests
- **Linting**: ruff for code quality enforcement
- **Dependency management**: uv for reproducible environments
- **CLI framework**: typer for command-line interfaces
- **Terminal output**: rich for formatted, colored output
- **Commits**: DCO sign-off required on every commit (`git commit -s`)
- **Graph database**: Neo4j for native graph traversal
- **Inference engine**: Infer (existing) for fact-proving and query processing
- **Embeddings**: sentence-transformers for query-to-node similarity matching
- **Data integration**: RSTMDB ecosystem for external data feeds (citations, repos, patents)

---

## The Provable Facts Advantage

This section defines the core differentiator. Everything else in the platform builds on provable facts.

### 1. What "Provable" Means Here

A claim is "provable" when ALL of the following conditions hold:

1. **Evidence chain exists**: An ordered list of sources links the claim's starting point to its endpoint through the genealogy graph. No gaps. No unsupported jumps.
2. **Every link carries a type**: Each connection in the chain carries one of four transmission path types from the taxonomy defined in ADR-002:
   - **Direct**: Theory adopted as-is in the modern technology (highest confidence)
   - **Reformulation**: Theory adapted to a new context (high confidence)
   - **Convergent**: Similar ideas developed independently, later connected (medium confidence)
   - **Indirect**: Theory influenced a field that later fed into the technology (lower confidence)
3. **Every link has a confidence score**: Scored 0.0--1.0 based on evidence quality:
   - 0.90--1.0: Primary source citation (original paper, book by school member)
   - 0.70--0.89: Secondary source (survey article, mathematical encyclopedia, peer-reviewed biography)
   - 0.40--0.69: Tertiary source (Wikipedia, popular science account) -- flagged as "needs stronger evidence"
   - 0.0--0.39: Speculative or debated connection -- flagged as "unverified"
4. **Users can inspect the FULL proof chain**: Not a summary. Not a paraphrase. The actual ordered list of (source, target, link_type, evidence, confidence) tuples.
5. **Proof chains are auditable**: Any third party can follow the same chain, check the cited sources, and arrive at the same conclusion.
6. **Proof chains are reproducible**: Given the same graph version and the same query, the engine produces the same proof chain. No stochastic LLM variation.

**What "provable" does NOT mean:**
- It does not mean "mathematically proven in the formal logic sense."
- It means "supported by a traceable, typed, scored evidence chain that a domain expert can independently verify."

### 2. How This Differs from AlphaXIV and Similar Platforms

| Capability | AlphaXIV | Semantic Scholar | Google Scholar | Our Platform |
|---|---|---|---|---|
| Talk to papers | Yes | No | No | Yes (talk to the genealogy graph) |
| Prove claims with evidence chains | No -- LLM generates plausible-sounding text with no proof structure | No | No | Yes -- every claim backed by ordered evidence chain |
| Lineage tracing | No | Citation graphs (who cited whom) | Citation counts only | Full genealogy with typed transmission paths (Direct/Reformulation/Convergent/Indirect) |
| Confidence scores per claim | No | No | No | Yes -- per-link confidence (0.0--1.0) plus aggregate chain confidence |
| Reproducible proofs | No -- same question yields different LLM outputs | No | No | Yes -- deterministic traversal against versioned graph |
| Transmission path taxonomy | No | No | No | Yes -- 4-type classification on every edge |
| Gap detection (what's missing) | No | No | No | Yes -- whitespace detection across school intersections |
| Research momentum tracking | No | Citation counts (lagging indicator) | h-index (lagging) | RSI (real-time momentum combining citations + GitHub + patents) |

**The fundamental gap we fill**: AlphaXIV, Semantic Scholar, and Google Scholar tell you WHAT exists. We prove HOW things connect and WHERE the gaps are. They generate answers; we derive ours from evidence.

### 3. Infer Integration Architecture

The Infer engine is the runtime that converts a user query into a provable answer. The architecture operates in six sequential stages:

**Stage 1 -- Query Processing**: Infer receives a natural language query (e.g., "How does reinforcement learning trace back to Soviet-era control theory?"). It extracts key entities and concepts using NLP (named entity recognition, keyword extraction).

**Stage 2 -- Graph Node Mapping**: The engine maps extracted entities to genealogy graph nodes using a two-pass strategy:
- Pass 1: Exact and fuzzy string matching against node names and aliases (fast, high precision)
- Pass 2: Embedding similarity using sentence-transformers against node descriptions (broader recall)
- Result: ranked list of candidate start and end nodes with match confidence

**Stage 3 -- Graph Traversal**: For each (start_node, end_node) pair, the engine traverses the Neo4j graph to find all paths up to 6 hops. Traversal uses Cypher shortest-path queries with transmission-type-aware weighting (Direct paths preferred over Indirect paths).

**Stage 4 -- Evidence Attachment**: For each link in each candidate path, the engine attaches evidence from the graph's edge properties:
- Paper citations stored on graph edges
- Cross-reference map entries
- Verified personal connections (teacher-student, colleague, collaborator)

**Stage 5 -- Confidence Computation**: Per-link confidence computed based on:
- Evidence quality tier (primary/secondary/tertiary source)
- Transmission path type (Direct > Reformulation > Convergent > Indirect)
- Number of independent evidence sources supporting the link
- Aggregate chain confidence = product of per-link confidences (weakest link dominates)

**Stage 6 -- Proof Chain Assembly**: Engine selects the highest-confidence complete path and returns a structured ProofChain object. If multiple paths exist, returns the top 3 ranked by aggregate confidence.

```
User Query --> [Stage 1: NLP] --> [Stage 2: Node Mapping] --> [Stage 3: Traversal]
                                                                     |
                                                                     v
Proof Chain <-- [Stage 6: Assembly] <-- [Stage 5: Scoring] <-- [Stage 4: Evidence]
```

### 4. Proof Chain Schema

```json
{
  "query": "How does reinforcement learning descend from Pontryagin's optimal control?",
  "proof_chains": [
    {
      "claim": "Reinforcement learning descends from Pontryagin's optimal control theory via a Direct transmission path through Bellman's dynamic programming.",
      "aggregate_confidence": 0.95,
      "chain_length": 3,
      "chain": [
        {
          "from": {
            "id": "pontryagin-maximum-principle-1956",
            "label": "Pontryagin Maximum Principle (1956)",
            "school": "Pontryagin"
          },
          "to": {
            "id": "bellman-dynamic-programming-1957",
            "label": "Bellman Dynamic Programming (1957)",
            "school": null
          },
          "link_type": "Convergent",
          "confidence": 0.90,
          "evidence": [
            {
              "source": "Bellman, R. (1957). Dynamic Programming. Princeton University Press.",
              "type": "primary",
              "note": "Bellman developed DP independently but the Hamilton-Jacobi-Bellman equation directly parallels Pontryagin's Hamiltonian structure."
            },
            {
              "source": "Pontryagin, L.S. et al. (1962). Mathematical Theory of Optimal Processes. Wiley.",
              "type": "primary",
              "note": "Establishes the relationship between PMP and Bellman's DP approach as complementary methods for the same class of problems."
            }
          ]
        },
        {
          "from": {
            "id": "bellman-dynamic-programming-1957",
            "label": "Bellman Dynamic Programming (1957)",
            "school": null
          },
          "to": {
            "id": "sutton-barto-rl-1998",
            "label": "Sutton & Barto Reinforcement Learning (1998)",
            "school": null
          },
          "link_type": "Direct",
          "confidence": 0.98,
          "evidence": [
            {
              "source": "Sutton, R.S. & Barto, A.G. (1998). Reinforcement Learning: An Introduction. MIT Press. Chapter 1.7.",
              "type": "primary",
              "note": "Explicit citation of both Bellman's DP and Pontryagin's optimal control as founding traditions of RL."
            }
          ]
        },
        {
          "from": {
            "id": "sutton-barto-rl-1998",
            "label": "Sutton & Barto RL (1998)",
            "school": null
          },
          "to": {
            "id": "modern-rl-frameworks",
            "label": "Modern RL Frameworks (OpenAI Gym, Stable-Baselines, RLlib)",
            "school": null
          },
          "link_type": "Direct",
          "confidence": 0.99,
          "evidence": [
            {
              "source": "All major RL frameworks cite Sutton & Barto as foundational reference.",
              "type": "secondary",
              "note": "Direct implementation of algorithms defined in Sutton & Barto."
            }
          ]
        }
      ],
      "graph_version": "v1.0.0-10schools",
      "computed_at": "2026-03-29T14:22:00Z"
    }
  ],
  "alternative_paths_available": 2,
  "total_computation_time_ms": 1420
}
```

### 5. Concrete Example: What We Say vs. What AlphaXIV Says

**User asks**: "How is reinforcement learning connected to Soviet-era science?"

**AlphaXIV says** (hypothetical): "Reinforcement learning draws influence from control theory, which has roots in Soviet mathematics, particularly Pontryagin's work on optimal control. Dynamic programming and the Maximum Principle form the connection."

*No evidence. No confidence score. No typed path. No way to verify. Different answer next time.*

**We say**: "Reinforcement learning descends from Pontryagin's Maximum Principle (1956) via a Direct transmission path through Bellman's Dynamic Programming. PROOF: [Pontryagin et al., 1962, 'Mathematical Theory of Optimal Processes'] -> [Bellman, 1957, Dynamic Programming; Convergent path, confidence 0.90] -> [Sutton & Barto, 1998, explicit citation Chapter 1.7; Direct path, confidence 0.98] -> [Modern RL frameworks, Direct path, confidence 0.99]. Aggregate confidence: 0.95. Evidence chain: 3 verified links, 4 primary sources. Graph version: v1.0.0-10schools. [Click any link to inspect evidence.]"

*Full evidence. Typed paths. Scored. Reproducible. Auditable.*

---

## Dogfood-First Strategy (Phase 0 -- FIRST MILESTONE)

The company itself is the first and most demanding customer. No external release until the internal team validates that the platform delivers provable answers against its own research.

### Internal Use Cases

**Use Case 1 -- Verify Existing Research Claims**: The team has produced 10 school research documents and a cross-reference map with 91+ connections. Run every factual claim in those documents through the proof engine. Flag any claim that lacks a provable evidence chain. Fix gaps before external release.

*Measurable outcome*: 100% of claims in the 10 school documents and cross-reference map pass through the proof engine. Target: 90%+ verified at confidence >= 0.70.

**Use Case 2 -- Find New Connections Automatically**: When adding a new school to the graph, use the platform's gap detector to identify intersections with existing schools. Replace the manual cross-referencing process (Phase 5 in ADR-002) with automated detection + human validation.

*Measurable outcome*: Gap detector identifies at least 3 genuine undocumented connections per new school added. Human validation confirms 70%+ of detected gaps as real.

**Use Case 3 -- Generate Provable Lineage Reports**: When presenting the project to stakeholders, generate proof chains for flagship connections (e.g., "Kolmogorov -> Diffusion Models", "Pontryagin -> Reinforcement Learning", "Kantorovich -> Wasserstein GANs"). Each report is a concrete demonstration of the platform's value.

*Measurable outcome*: Generate 10 flagship lineage reports, each with aggregate confidence >= 0.85 and at least 2 primary source citations per chain.

**Use Case 4 -- RSI + GAP for Research Direction Evaluation**: Use RSI to rank the research strength of lineages the team tracks. Use GAP to identify the highest-opportunity intersections. Together, these inform which schools to research next and which connections to prioritize.

*Measurable outcome*: RSI computed for 20+ modern technology lineages. GAP scores computed for all 45 school-pair intersections (10 choose 2). Top-10 gap opportunities identified and ranked.

**Use Case 5 -- Quality Gate for New Research**: Every new claim added to the knowledge base must pass through the proof engine before merging. If the engine cannot produce a proof chain with confidence >= 0.50, the claim requires additional evidence before inclusion.

*Measurable outcome*: 100% of new claims submitted through the verification tool before graph merge. Zero unverified claims enter the production graph.

### Success Criteria for Internal MVP (Phase 0)

| Criterion | Target | How to Measure |
|---|---|---|
| Query answering | Can query "How is [modern tech X] connected to [Soviet school Y]?" and get a provable answer | 50 representative queries answered with proof chains, 90%+ at confidence >= 0.70 |
| Claim verification | Can verify existing research document claims | Verification tool runs against all 10 school docs; produces report |
| Gap detection | Can detect knowledge graph gaps | Gap detector identifies 45 school-pair intersections; top-10 ranked |
| RSI computation | Can compute RSI for tracked lineages | RSI scores computed for 20+ lineages with citation and GitHub data |
| Reproducibility | Same query against same graph version yields same result | Automated test suite runs each query 3 times; 100% identical outputs |
| Latency | Proof chains returned within 5 seconds (p95) | Load test with 50 concurrent queries |

---

## Killer Features Ranked by Defensibility

Ranked from hardest to replicate (highest moat) to easiest to replicate (lowest moat):

### Rank 1: Provable Facts Engine (HARDEST -- Layer 0)

**What it requires to replicate**: A fact-proving inference engine (Infer) + a curated genealogy graph with typed transmission paths + evidence chain metadata on every edge + confidence scoring system + deterministic proof assembly.

**Why competitors cannot replicate quickly**: No existing tool combines all five components. Semantic Scholar has citations but no transmission typing. AlphaXIV has LLM chat but no proof structure. Building the curated graph alone took 6+ months of expert research. The Infer engine is proprietary. The proof chain schema is original work.

**Estimated time to replicate from scratch**: 18--24 months.

### Rank 2: RSI -- Research Strength Index (HARD)

**What it requires to replicate**: Real-time data feeds (arXiv citations, GitHub API, patent filings, funding announcements) + the genealogy graph (to know WHICH lineages to track) + a proprietary formula weighting multiple signals into a single momentum score + time-series tracking infrastructure.

**Why competitors cannot replicate quickly**: The RSI formula is a trade secret. Computing RSI requires both the genealogy graph (to define lineages) AND the real-time feeds (to measure momentum). Neither alone produces the metric.

**Estimated time to replicate from scratch**: 12--18 months.

### Rank 3: Gap Analysis / Convergence Radar (HARD)

**What it requires to replicate**: Complete genealogy graph + whitespace detection algorithm + convergence signal detection across citation patterns, GitHub activity, and patent filings.

**Why competitors cannot replicate quickly**: Finding what DOES NOT exist in a graph is computationally and intellectually harder than finding what does. The whitespace detection algorithm is novel computer science. Convergence radar requires correlating signals across three domains (papers, code, patents) -- no existing tool does this.

**Estimated time to replicate from scratch**: 12--18 months.

### Rank 4: Transmission Path Taxonomy (MEDIUM)

**What it requires to replicate**: The 4-type classification (Direct/Reformulation/Convergent/Indirect) + systematic application to every edge + expert validation of classifications.

**Defense strategy**: Publish the taxonomy academically to establish priority. If a competitor adopts our taxonomy, that validates our framework and creates a citation obligation. Trademark the certification format.

**Estimated time to replicate from scratch**: 6--12 months (the framework is simple, but applying it at scale requires domain expertise).

### Rank 5: Innovation Triangle (MEDIUM)

**What it requires to replicate**: Paper + Patent + Code integration across three separate data domains. Lens.org has papers + patents. GitHub has code. No one connects all three through a genealogy graph.

**Estimated time to replicate from scratch**: 9--12 months.

### Rank 6: Interactive Explorer (EASY to copy)

**What it requires to replicate**: D3.js or Three.js graph visualization + graph API + standard web engineering. Many graph visualization tools exist.

**Defense strategy**: First-mover advantage. Brand association. The explorer is the acquisition channel, not the moat. The moat is the data and proof engine behind it.

**Estimated time to replicate from scratch**: 2--4 months.

---

## IP Protection (7+1 Layers)

### Layer 0: Provable Facts Engine (FOUNDATION -- everything builds on this)

**Asset**: The Infer engine's ability to produce structured, auditable, reproducible proof chains from a knowledge graph.

**Protection**:
- Infer engine source code is proprietary (trade secret)
- Proof chain schema is original work (copyright)
- The 6-stage architecture (query -> mapping -> traversal -> evidence -> scoring -> assembly) is a patentable process
- File provisional patent covering "Method and system for producing evidence-backed proof chains from a typed knowledge graph"

### Layer 1: Data Moat (Curated Graph)
- 10 schools, 91+ connections, typed transmission paths with evidence
- 6+ months of expert research to produce; scraping cannot replicate this
- Community validation adds trust that AI generation cannot match

### Layer 2: RSI Algorithm (Trade Secret + Patent Candidate)
- Formula: `RSI = f(citation_velocity, github_activity, patent_filings, funding_signals, conference_momentum)`
- Patent the method of computing research momentum from multi-source signals applied to a genealogy graph
- Keep exact weights and decay functions as trade secret

### Layer 3: Gap Detection Algorithm (Patent Candidate)
- Whitespace detection in knowledge graphs: novel computer science
- Convergence radar: cross-domain signal correlation
- File provisional patent; publish academic paper establishing priority

### Layer 4: Transmission Path Taxonomy (Academic Priority)
- Direct / Reformulation / Convergent / Indirect classification
- Publish in peer-reviewed venue to establish priority
- Trademark the certification format

### Layer 5: Novelty Certificate (Brand + Format)
- Automated originality scoring for papers/repos/patents
- Provenance Certificate format with evidence chain
- Trademark the certificate format and scoring methodology

### Layer 6: Innovation Triangle (Integration Complexity)
- Paper + Patent + Code unified view through the genealogy graph
- Integration complexity is its own moat

### Layer 7: Data Flywheel (Network Effects)
- Real-time ingestion from arXiv, GitHub, patent databases
- Community contributions validated by experts
- Every new data point improves RSI accuracy and GAP predictions

---

## Freemium Model

### Phase 0 (Internal Dogfood -- Current Milestone)

No external users. The company team uses the platform through CLI tools and internal APIs. Success here gates external release.

### Phase 1 (External Free Tier)

After internal validation succeeds:

| Tier | Access | Price |
|---|---|---|
| Free | 3 schools visible, 2 provable queries/month, view-only proof chains | $0 |
| Researcher | All schools, 15 provable queries/month, full proof chain inspection, PDF export, API (100 calls/month) | $29/mo |
| Enterprise | Unlimited API, custom proof reports, patent lineage reports, SSO, SLA | $499+/mo |

### Conversion Triggers

- **Free -> Researcher**: "You've used your 2 free provable queries. Upgrade for full proof chain access and PDF certificates."
- **Researcher -> Enterprise**: "Your team has 4 members using individual accounts. Enterprise gives shared access and unlimited API for less per-seat."
- **Free -> Contributor**: "This graph area has gaps. Your expertise fills them. Contribute and earn from every proof chain that uses your connections."

---

## Task Breakdown -- MVP Phase 0 (Internal Dogfood)

Six tasks for the internal dogfood milestone. These are the backlog tasks to create:

### Task 1: Infer Integration -- Connect Proof Engine to Genealogy Graph
**Priority**: High
**Description**: Connect the Infer fact-proving engine to the Neo4j genealogy graph. Enable provable queries against the 10-school knowledge base.
**Acceptance Criteria**:
- Infer engine accepts natural language queries about tech lineage
- Engine maps queries to genealogy graph nodes via embedding similarity (sentence-transformers)
- Engine returns structured proof chains matching the ProofChain schema defined in this spec
- Proof chains follow the transmission path taxonomy (Direct/Reformulation/Convergent/Indirect)
- Same query against same graph version produces identical proof chains (deterministic)

### Task 2: Graph Data Import -- Markdown Research Docs to Neo4j
**Priority**: High
**Description**: Import all 10 school research documents and cross-reference map into Neo4j graph database.
**Acceptance Criteria**:
- All 10 school documents parsed and imported as graph nodes (persons, theories, publications, institutions, modern technologies) and edges
- Cross-reference map connections imported with typed edges (Layer 1: personal, Layer 2: theoretical, Layer 3: convergence)
- Evidence citations preserved as edge properties
- Import achieves 95%+ accuracy validated against source documents
- Import pipeline is idempotent (re-running does not create duplicates)
- Graph contains 34+ personal connections, 20+ theoretical connections, 37+ convergence points after import

### Task 3: Internal Verification Tool -- Validate Research Claims
**Priority**: High
**Description**: Build a CLI tool that validates claims in existing research documents against the proof engine.
**Acceptance Criteria**:
- Tool accepts a markdown document path and extracts factual claims about technology lineage
- The proof engine verifies each extracted claim against the genealogy graph
- Tool reports: verified claims (with proof chains), unverified claims (with reason), and confidence scores
- Tool uses typer for CLI and rich for formatted output (color-coded verified/unverified/low-confidence)
- Tool produces a machine-readable JSON report alongside the terminal output

### Task 4: RSI Computation for Tracked Lineages
**Priority**: Medium
**Description**: Implement Research Strength Index calculation for genealogy lineages using Infer's existing RSI capabilities and RSTMDB data feeds.
**Acceptance Criteria**:
- RSI computed for each modern tech prototype lineage on a 0--100 scale
- RSI factors include citation velocity (arXiv/Semantic Scholar), GitHub activity (star growth, new repos), and patent filings
- Time-series tracking stores RSI values monthly, enabling trend visualization
- RSI categorization: >70 "High Momentum", 30--70 "Active", <30 "Underexplored"

### Task 5: Gap Detector -- Find Unexplored Intersections
**Priority**: Medium
**Description**: Implement whitespace detection to find unexplored connections between schools/theories in the genealogy graph.
**Acceptance Criteria**:
- Algorithm identifies school pairs with potential but undocumented connections (using embedding proximity of school descriptions + absence of graph edges)
- Gap Score (0--100) computed for each of the 45 school-pair intersections (10 choose 2)
- Results ranked by likelihood of genuine connection (combining embedding similarity, citation co-occurrence, and shared keyword density)
- Report distinguishes "no connection found" (low embedding similarity) from "connection likely but undocumented" (high embedding similarity, no graph edge)

### Task 6: Talk-to-Data Interface -- Provable Q&A Over Genealogy
**Priority**: High
**Description**: Build the conversational CLI interface where users ask questions and receive provable answers with evidence chains.
**Acceptance Criteria**:
- Natural language input accepted (e.g., "How does modern compiler optimization trace to Soviet-era work?")
- Response includes the full proof chain with typed transmission paths, rendered in rich terminal formatting
- Response includes aggregate confidence score and per-link evidence citations
- User can drill into any proof chain link by index for detailed evidence view
- Interactive mode supports follow-up queries (e.g., "Show me alternative paths" or "What about the Kolmogorov connection?")

---

## Dependencies and Constraints

### Dependencies

| Dependency | Status | Impact |
|---|---|---|
| 10 school research documents | COMPLETED | Seed data for graph import |
| Cross-reference map (91+ connections) | COMPLETED | Edge data for graph import |
| Transmission Path Taxonomy (ADR-002) | COMPLETED | Classification system for graph edges |
| Infer engine | EXISTS (internal) | Core proof-generation runtime |
| RSTMDB ecosystem | EXISTS (internal) | Data feeds for RSI computation |
| Neo4j instance | REQUIRED | Graph database for genealogy storage |
| sentence-transformers models | AVAILABLE (open source) | Embedding similarity for query-to-node mapping |

### Constraints

1. **No external release before internal validation**: Phase 0 dogfood must pass all success criteria before any external user access.
2. **Proof chains must be deterministic**: No stochastic LLM generation in the proof chain assembly path. LLMs may assist in query parsing (Stage 1) but the traversal, evidence attachment, and scoring stages must be deterministic.
3. **Evidence quality floor**: No proof chain link with confidence below 0.40 can appear in a user-facing response without an explicit "unverified" warning.
4. **Graph versioning required**: Every proof chain references the graph version it ran against, enabling reproducibility audits.
5. **RSTMDB rate limits**: RSI computation depends on external API calls; rate limiting and caching required to avoid throttling.

---

## Success Metrics

### Phase 0 (Internal Dogfood) -- Target: Complete within 8 weeks

| Metric | Target | Measurement Method |
|---|---|---|
| Provable query success rate | 90%+ of 50 representative queries return proof chains with confidence >= 0.70 | Test suite of 50 curated queries |
| Graph import accuracy | 95%+ of source document facts present in Neo4j | Automated comparison of source markdown vs. graph nodes/edges |
| Claim verification coverage | 100% of claims in 10 school docs processed by verification tool | Verification tool run report |
| RSI computation | RSI scores for 20+ modern tech lineages | RSI computation batch job output |
| Gap detection | 45 school-pair intersections scored | Gap detector output report |
| Latency (p95) | < 5 seconds per proof chain query | Load test with 50 concurrent queries |
| Reproducibility | 100% identical results for repeated queries | Automated determinism test suite (3 runs per query) |

### Phase 1 (External Free Tier) -- Target: 3 months after Phase 0

| Metric | Target |
|---|---|
| Free users registered | 1,000 in first 3 months |
| Provable queries executed | 5,000 total |
| Shared proof chain URLs | 500 |
| Researcher tier conversions | 50 (5% conversion rate) |

### Phase 2 (Monetization) -- Target: 6 months after Phase 1

| Metric | Target |
|---|---|
| Researcher subscribers | 200 |
| Enterprise contracts | 3 |
| MRR | $8,000 |
| Graph coverage | 15+ schools, 150+ connections |

---

*Spec generated by PM Planner Agent. Revision: Provable Facts Engine focus with dogfood-first strategy.*
