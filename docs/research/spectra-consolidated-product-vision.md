# Consolidated Product Vision: Spectra — SDD Intelligence Platform

**Date**: 2026-05-15 | **Tracked**: zombo-sash-eco-5xqu
**Status**: Draft for review

---

## 1. Product Definition

### Name Candidates

1. **Spectra** — "spectrum" of specs across all agents + spectral analysis of code impact (RECOMMENDED)
2. **Aegis** — protective shield for spec integrity
3. **Praxis** — Greek for "practice/action"; spec-driven practice made real
4. **Forja** — Spanish for "forge"; forging specs into verified implementations
5. **Meridian** — the line connecting specification to implementation
6. **Arcanis** — from "arcane knowledge"; the intelligence layer agents lack
7. **Spectra-RS** — explicit Rust identity

### One-Liner

**Spectra is a Rust-native SDD intelligence engine that normalizes specs from any agent framework, tracks their impact on code, and governs the full specify-plan-implement-validate lifecycle with epistemic rigor.**

### What It IS vs What It IS NOT

| It IS | It IS NOT |
|-------|-----------|
| Rust library + CLI any agent platform can invoke | An IDE or agent runtime |
| Spec normalization layer (read Kiro, Cursor, SpecKit, etc.) | A spec authoring tool |
| Impact analysis engine (spec change -> affected code/tests) | A test runner or CI system |
| Cognitive governor (drift detection, evidence-gated promotion) | An LLM provider or model router |
| Workflow state machine (assess/specify/plan/implement/validate) | A project management tool |
| Built on epistemic ecosystem (criterium, infer, zz-notation) | A standalone product |

### How It Differs

| Dimension | Cronus | FlowSpec | contextflow-forge | **Spectra** |
|-----------|--------|----------|-------------------|-------------|
| Language | Python (AGPL) | Python | TypeScript | **Rust (MIT)** |
| Spec input | 9 adapters (SpecIR) | Single format | MD transform | **N adapters (SpecIR-RS)** |
| Intelligence | SpecImpact graph, vector search | None | Vision shift detect | **SpecImpact + epistemic scoring** |
| Workflow | BAML/DSPy pipeline | /flow: state machine | Stage migration | **Compiled state machine + Rig agents** |
| Governance | None | Rigor rules | Spiral Governor | **Spiral Governor + Dempster-Shafer evidence gates** |
| Task tracking | Beads-native | Beads-native | AllBeads adapter | **Beads-native (Rust FFI)** |
| Reasoning | None | None | None | **criterium loop (abduction/deduction/induction)** |
| Embeddable | No | No | No | **Yes (Rust crate + MCP + CLI)** |

**Key differentiator**: Only tool combining multi-framework spec normalization with epistemic reasoning (Dempster-Shafer assurance levels, Belnap truth values, PCTL model checking). No competitor has formal evidence gates between "spec written" and "spec verified."

---

## 2. Feature Scope Matrix

| # | Feature | Source | Ecosystem Lib | POC | MVP | Alpha |
|---|---------|--------|---------------|-----|-----|-------|
| 1 | SpecIR-RS: canonical spec representation | Cronus | spectra-ir (new) | X | X | X |
| 2 | Spec adapters: Claude Code, Kiro, SpecKit | Cronus | spectra-adapters (new) | X(3) | X(6) | X(9+) |
| 3 | SpecImpact graph: spec <-> code <-> test | Cronus | craftegy-graph | X | X | X |
| 4 | Vector semantic search over specs | Cronus | lancedb-rs / rig | | X | X |
| 5 | SDD state machine | FlowSpec | spectra-workflow (new) | X | X | X |
| 6 | Slash command templates for agents | FlowSpec | spectra-commands (new) | X(CC) | X(3) | X(all) |
| 7 | Spiral Governor (PAUSE/DOC/UPDATE/TEST/IMPL/VERIFY) | cf-forge | spectra-governor (new) | | X | X |
| 8 | Drift detection (spec hash + temporal diff) | Cronus+cf | spectra-governor | | X | X |
| 9 | Evidence-gated assurance levels (L0-L3) | NEW | criterium-core | | X | X |
| 10 | Dempster-Shafer belief intervals | NEW | criterium-core | | | X |
| 11 | CausalSupportBasis enum (FPF C.28) | NEW | criterium-core | | | X |
| 12 | Deductive validation on specs | NEW | infer-core + zz-core | | | X |
| 13 | PCTL model checking on spec coverage | NEW | pctl-core | | | X |
| 14 | Beads-rust native task dispatch | FlowSpec+Cronus | beads_rust | X | X | X |
| 15 | AllBeads cross-repo federation | AllBeads | allbeads | | | X |
| 16 | gm workspace awareness | NEW | gm-core | | X | X |
| 17 | MCP server | Cronus+cf | spectra-mcp (new) | X | X | X |
| 18 | Code Graph RAG | Cronus | tree-sitter-rs + rig | | X | X |
| 19 | TOON output format | cf-forge | spectra-ir | | | X |
| 20 | Web UI dashboard | Cronus | spectra-ui (separate) | | | X |
| 21 | GitHub Action (CI gates) | Cronus | spectra-action (new) | | | X |
| 22 | Multi-agent templates | FlowSpec | spectra-commands | | X | X |
| 23 | AutonomyEnvelope (scope guards) | Haft v7 | spectra-governor | | | X |
| 24 | KnowledgeStore bridge | NEW | zz-core | | | X |

---

## 3. Architecture

```
+==========================================================================+
|                        SPECTRA ARCHITECTURE                               |
+==========================================================================+
|                                                                           |
|  CLIENT LAYER                                                             |
|  +---------------------------------------------------------------------+ |
|  | Claude Code | Gemini CLI | Kiro CLI | SpecKit | BMAD | Codex | ...  | |
|  |  /spec:*    |  /spec:*   | /spec:*  |  MCP    | MCP  | MCP   |      | |
|  +------+------+-----+------+----+-----+---+-----+-+----+--+----+      | |
|         |            |           |         |       |       |            | |
|  +------v------------v-----------v---------v-------v-------v------+     | |
|  | spectra-mcp (MCP Server)        | spectra-cli (CLI binary)    |     | |
|  | 15+ tools                       | spectra assess / impact /   |     | |
|  +----------------+----------------+  search / dispatch / check  |     | |
|                   |                +-----------------------------+     | |
|  WORKFLOW LAYER   v                                                    | |
|  +---------------------------------------------------------------------+ |
|  | spectra-workflow: state machine                                      | |
|  |   ToDo → Assessed → Specified → Planned → InProgress → Validated    | |
|  |                                                                      | |
|  | spectra-governor: Spiral Governor + drift + AutonomyEnvelope         | |
|  |   PAUSE → DOCUMENT → UPDATE → TEST → IMPLEMENT → VERIFY             | |
|  +-------------------+--------------------------------------------------+ |
|                      |                                                    |
|  INTELLIGENCE LAYER  v                                                    |
|  +---------------------------------------------------------------------+ |
|  | spectra-ir: SpecIR-RS canonical representation + adapter registry    | |
|  |   Adapters: claude_code | kiro | speckit | cursor | gemini | tessl  | |
|  |                                                                      | |
|  | spectra-impact: SpecImpact graph          [craftegy-graph]           | |
|  |   Bidirectional: specs ↔ code ↔ tests (39 graph algos)              | |
|  |                                                                      | |
|  | spectra-search: vector semantic search     [lancedb-rs / rig]        | |
|  |   Embed specs + code, k-NN retrieval, Code Graph RAG                 | |
|  +-------------------+--------------------------------------------------+ |
|                      |                                                    |
|  EPISTEMIC LAYER     v     ← THE MOAT                                    |
|  +---------------------------------------------------------------------+ |
|  | criterium-core: L0→L1→L2→L3, Dempster-Shafer [Bel,Pl], R-cap gates | |
|  | infer-core: abduction/deduction engine, invariant checking           | |
|  | zz-core: KnowledgeStore, Belnap truth, persistent epistemic state    | |
|  | pctl-core: probabilistic model checking, NINE bilattice              | |
|  +-------------------+--------------------------------------------------+ |
|                      |                                                    |
|  INTEGRATION LAYER   v                                                    |
|  +---------------------------------------------------------------------+ |
|  | beads_rust: issue tracking  | gm-core: workspace | allbeads: fedtn  | |
|  | Task dispatch/close/AC      | Multi-repo awareness| Cross-repo graph | |
|  +---------------------------------------------------------------------+ |
+==========================================================================+
```

### Crate Dependency Graph

```
spectra (facade, feature-gated)
├── spectra-core        # Common types: SpecId, SpecNode, AssuranceLevel
├── spectra-ir          # SpecIR-RS + adapter trait
│   ├── spectra-adapter-claude-code
│   ├── spectra-adapter-kiro
│   └── spectra-adapter-speckit (+ more)
├── spectra-impact      # SpecImpact graph engine
│   └── craftegy-graph
├── spectra-search      # Vector search + Code Graph RAG
│   └── lancedb / rig-lancedb
├── spectra-workflow    # SDD state machine
├── spectra-governor    # Spiral Governor + drift
├── spectra-mcp        # MCP server (stdio + SSE)
├── spectra-cli        # CLI binary
├── criterium-core     # Assurance levels, Dempster-Shafer (optional)
├── infer-core         # Deductive validation (optional)
├── zz-core            # KnowledgeStore bridge (optional)
└── pctl-core          # Probabilistic model checking (optional)
```

---

## 4. Roadmap

### POC (Weeks 1-4): "Can specs flow through the system?"

| # | Deliverable | Lib |
|---|-------------|-----|
| 1 | spectra-ir crate: SpecIR-RS types | NEW |
| 2 | 3 adapters: Claude Code, Kiro, SpecKit | NEW |
| 3 | spectra-impact: basic DAG via craftegy-graph | craftegy-graph |
| 4 | spectra-workflow: state machine | NEW |
| 5 | spectra-cli: `ingest`, `impact`, `workflow status` | NEW |
| 6 | spectra-mcp: 5 tools | NEW |
| 7 | beads-rust integration: `spectra dispatch` | beads_rust |

**Clients**: Claude Code only. **Success**: ingest 3 formats → unified SpecIR → impact analysis → beads tasks.

### MVP (Weeks 5-10): "Daily driver"

| # | Deliverable | Lib |
|---|-------------|-----|
| 1 | 3 more adapters: Cursor, Gemini, Tessl | NEW |
| 2 | Vector semantic search | lancedb-rs |
| 3 | Code Graph RAG (tree-sitter) | tree-sitter-rs + rig |
| 4 | Spiral Governor + drift detection | NEW |
| 5 | Evidence-gated L0-L2 assurance | criterium-core |
| 6 | Multi-agent slash commands | NEW |
| 7 | gm workspace awareness | gm-core |

**Clients**: Claude Code + Gemini CLI + Kiro CLI. **Success**: search specs across 10 repos, detect drift, promote assurance levels.

### Alpha (Weeks 11-20): "Production-grade with epistemic moat"

| # | Deliverable | Lib |
|---|-------------|-----|
| 1 | All adapters (9+ total) | NEW |
| 2 | Dempster-Shafer belief intervals | criterium-core |
| 3 | CausalSupportBasis (FPF C.28) | criterium-core |
| 4 | Deductive spec validation | infer-core |
| 5 | KnowledgeStore bridge | zz-core |
| 6 | PCTL model checking | pctl-core |
| 7 | AllBeads cross-repo federation | allbeads |
| 8 | AutonomyEnvelope | spectra-governor |
| 9 | TOON output | spectra-ir |
| 10 | GitHub Action CI gates | spectra-action |
| 11 | Web UI dashboard | spectra-ui |
| 12 | SpecDiff timeline | spectra-governor |

**Clients**: All Tier 1-2 + Tier 3 via MCP. **Success**: full L0→L3 pipeline, cross-repo impact, GH Action gates.

---

## 5. Competitive Moat

### The Defensible Layer

```
+--------------------------------------------------+
|  WHAT COMPETITORS CAN REPLICATE (weeks)          |
|  - Spec adapters (parsing is boring work)        |
|  - State machine (finite states are trivial)     |
|  - CLI + MCP server (standard plumbing)          |
+--------------------------------------------------+
|  WHAT COMPETITORS CANNOT REPLICATE (years)       |
|  - criterium: Dempster-Shafer assurance levels   |
|  - infer: 23-crate reasoning engine              |
|  - zz-notation: KnowledgeStore + Belnap truth    |
|  - pctl-rs: NINE bilattice model checker         |
|  - craftegy-algo: 39 graph algorithms            |
|                                                   |
|  = THE EPISTEMIC LAYER                            |
|  Multi-year R&D. 123+ tests in criterium alone.  |
|  No competitor has formal evidence gates.         |
+--------------------------------------------------+
```

### vs Each Competitor

| vs | Spectra Advantage |
|----|-------------------|
| **Cronus** | Rust (MIT) vs Python (AGPL). Same features + epistemic reasoning. 10-100x faster graph ops. |
| **Spec Kit** (75k stars) | Spec Kit creates; Spectra analyzes. Complementary. Spectra adds intelligence Spec Kit lacks. |
| **Kiro** (AWS) | Kiro locks to IDE. Spectra is agent-agnostic. Cross-agent unified view. |
| **Shotgun.sh** | Static spec files vs living objects with impact tracking + evidence gates. |

---

## 6. Risk Register

| # | Risk | Severity | Probability | Mitigation |
|---|------|----------|-------------|------------|
| 1 | Scope creep (24 features, 4 layers) | High | High | Strict POC-first. 7 deliverables only. No epistemic features until MVP. Ship in 4 weeks or cut. |
| 2 | Adapter fragility (agent formats change) | Medium | High | Thin parsers behind stable SpecIR-RS trait. Pin adapter tests against real samples. |
| 3 | Epistemic complexity barrier | High | Medium | Alpha-only. Default to simple L0/L1/L2. Power users opt into DS tuning. Progressive disclosure. |
| 4 | Rig dependency risk (pre-1.0) | Medium | Medium | Wrap behind LlmProvider trait. Swap to direct HTTP if Rig destabilizes. |
| 5 | Single-ecosystem adoption | High | Medium | MIT from day 1. Publish spectra-ir + adapters on crates.io. Blog the epistemic moat. |

---

## 7. Business Validation

**Target user**: Senior devs / tech leads managing 3-10 repos with AI agents, frustrated by spec rot, context loss, and no formal confidence in agent-generated implementations.

**Problem**: SDD tools solve spec creation but not spec intelligence. After a spec is written, no tool answers: "Which code implements this spec?", "Has it drifted?", "How confident should I be?", "What breaks if I change it?"

**GTM**: Internal dogfooding (POC) → open-source crates.io (MVP) → GitHub Action + conference talk (Alpha) → commercial cloud layer (future).

**License**: MIT open core. Commercial layer = hosted vector search, enterprise adapters, SLA-backed CI.

---

## Client Integration Matrix

| Agent Platform | Tier | Method | POC | MVP | Alpha |
|----------------|------|--------|-----|-----|-------|
| Claude Code | 1 | .claude/commands/spec/ + MCP | X | X | X |
| Gemini CLI | 1 | GEMINI.md + MCP | | X | X |
| Kiro CLI | 1 | .kiro/ + MCP | | X | X |
| SpecKit | 2 | MCP server | | X | X |
| OpenSpec | 2 | MCP server | | | X |
| BMAD-MODE | 2 | MCP server | | | X |
| Kiro (IDE) | 2 | VS Code ext + MCP | | | X |
| Codex | 3 | MCP server | | | X |
| Cursor | 3 | .cursorrules + MCP | | | X |
| ForgeCode | 3 | .forge/agents/ + MCP | | | X |
| Kilo Code | 3 | Skills + MCP | | | X |

---

## Ecosystem Library Map

| Library | Crate | Spectra Role |
|---------|-------|-------------|
| beads-rust | beads_rust | Task dispatch/close target |
| AllBeads | allbeads | Cross-repo federation |
| craftegy-algo | craftegy-graph | SpecImpact graph algorithms (39 algos) |
| infer | infer-core | Deductive spec validation, invariant checking |
| zz-notation | zz-core | KnowledgeStore, Belnap truth, persistent epistemic state |
| criterium | criterium-core | L0-L3 assurance, Dempster-Shafer, HITL |
| pctl-rs | pctl-core | Probabilistic model checking, NINE bilattice |
| gm | gm-core | Multi-repo workspace awareness |
