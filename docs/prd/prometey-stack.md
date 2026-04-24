# PRD: Prometey Stack — 10-Layer Ecosystem Architecture

## 1. Overview

The **Prometey Stack** is the curated dependency taxonomy powering the zombo-sash-eco Zero-Human AI Company. It organizes 33+ repositories into 10 layers where **lower layers provide services to higher layers** — nothing at layer N depends on layer N+1.

This is a living document. The original 8-layer draft has been superseded by this 10-layer model based on actual ecosystem growth.

## 2. Layer Model

```
              )
           ) ) \  )
          ( ( ) \/
     ) ) ) )\|/(  ( (
    ( ( ( ( [FIRE] ) )
     ) ) ) /|\ ( ( (
          / | \
         /  |  \
        '   |   '
            |
    ════════╪════════════════════════════════
            │         P R O M E T E Y
            │    stealing fire · giving agents
    ════════╪════════════════════════════════
            │
    ┌───────┴──────────────────────────────────────┐
    │  00 ── KERNEL-FORGE                          │
    │        bfc · bfcfs-linux · bfc-httpd         │
    │        pure C · zero deps · binary portable  │
    └───────┬──────────────────────────────────────┘
            │  ▲ provides container runtime
    ┌───────┴──────────────────────────────────────┐
    │  01 ── INFRA                                 │
    │        o2l · npd-cipher · ctop               │
    │        inferense · invariantis               │
    └───────┬──────────────────────────────────────┘
            │  ▲ provides compute substrate
    ┌───────┴──────────────────────────────────────┐
    │  02 ── FORMAL                                │
    │        pctl-rs · obstruct · zz-notation      │
    │        pure math · probabilistic · logic     │
    └───────┬──────────────────────────────────────┘
            │  ▲ provides mathematical substrate
    ┌───────┴──────────────────────────────────────┐
    │  03 ── MEMORY                                │
    │        rstmdb · rstmdb-studio                │
    │        WAL · guards · WATCH semantics        │
    └───────┬──────────────────────────────────────┘
            │  ▲ provides persistent state
    ┌───────┴──────────────────────────────────────┐
    │  04 ── KNOWLEDGE                             │
    │        graphify · codegraph-rust             │
    │        codebase-memory-mcp                   │
    └───────┬──────────────────────────────────────┘
            │  ▲ provides semantic understanding
    ┌───────┴──────────────────────────────────────┐
    │  05 ── REASONING                             │
    │        infer · axiomvm · aivm                │
    │        craftegy-algo · criterium             │
    │        epistemic-game                        │
    └───────┬──────────────────────────────────────┘
            │  ▲ proves specs are logically sound
    ════════╪═══════════════════════════════════════
            │  intelligence stack ──► agentic stack
    ════════╪═══════════════════════════════════════
            │
    ┌───────┴──────────────────────────────────────┐
    │  06 ── SPEC                                  │
    │        flowspec · FPF · haft · quint         │
    │        intent · governance · formal spec     │
    └───────┬──────────────────────────────────────┘
            │  ▲ defines what agents must do
    ┌───────┴──────────────────────────────────────┐
    │  07 ── BRIDGE                                │
    │        AllBeads · beads_rust                 │
    │        beads_viewer_rust                     │
    └───────┬──────────────────────────────────────┘
            │  ▲ coordinates agents & tasks
    ┌───────┴──────────────────────────────────────┐
    │  08 ── EXECUTION                             │
    │        code-catalyst · grace-marketplace     │
    │        grace-skills · fpf-skill             │
    └───────┬──────────────────────────────────────┘
            │  ▲ agents acting on specs
    ┌───────┴──────────────────────────────────────┐
    │  09 ── APPS                                  │
    │        reasoning-apps                        │
    │        Polymarket · Three-Layer Proven Map   │
    └───────┬──────────────────────────────────────┘
            │  ▲ analytical products
    ┌───────┴──────────────────────────────────────┐
    │  10 ── PRODUCTS                              │
    │        craftegy-design (Rust/Tauri)          │
    │        AgentOS · DesignOS · open-codesign    │
    └──────────────────────────────────────────────┘
```

```
╔══════════════════════════════════════════════════════════════════════════╗
║  10 — PRODUCTS     User-facing products built with the full stack        ║
║  09 — APPS         Deployed analytical products                          ║
║  08 — EXECUTION    Coding agents and code generation                     ║
╠══════════════════════════════════════════════════════════════════════════╣
║  07 — BRIDGE       Task tracking and agent coordination                  ║
║  06 — SPEC         Specification, governance, formal intent              ║
╠══════════════════════════════════════════════════════════════════════════╣
║  05 — REASONING    Logic inference, optimization algorithms              ║
║  04 — KNOWLEDGE    Semantic indexing and code understanding              ║
║  03 — MEMORY       Persistent state and reactive storage                 ║
╠══════════════════════════════════════════════════════════════════════════╣
║  02 — FORMAL       Pure mathematics — probabilistic/formal logic         ║
║  01 — INFRA        Compute substrate, cryptography, DSL runtimes         ║
╠══════════════════════════════════════════════════════════════════════════╣
║  00 — KERNEL-FORGE Binary containers · filesystem drivers · zero deps    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 3. Layer-by-Layer Breakdown

### Layer 00 — KERNEL-FORGE
*Binary primitives. Pure C, zero dependencies. The fire itself — portable, self-contained, runs anywhere.*

| Repo | Purpose |
|------|---------|
| `kernel-forge/bfc` | Binary File Container — lightweight append-only single-file container filesystem |
| `kernel-forge/bfcfs-linux` | Linux kernel module: mount .bfc images read-only (no FUSE, fast random I/O, Zstd) |
| `kernel-forge/bfc-httpd` | HTTP server: serve frontend assets directly from a .bfc container |

**Use case chain**: `craftegy-design build` → pack into `.bfc` → `bfc-httpd` serves it. Single portable binary, zero runtime deps.

### Layer 01 — INFRA
*Foundation compute. No dependencies on other layers. Everything runs on this.*

| Repo | Purpose |
|------|---------|
| `infra-eco/o2l` | Language toolkit + Rune DSL runtime |
| `infra-eco/npd-cipher` | Cryptographic primitives |
| `infra-eco/ctop` | Container topology tool |
| `infra-eco/inferense` | Infer-as-a-Service HTTP API |
| `infra-eco/invariantis` | Distributed ledger for immutable proof records |

### Layer 02 — FORMAL
*Pure mathematics. No runtime dependencies. Provides mathematical substrate for Reasoning.*

| Repo | Purpose |
|------|---------|
| `reasoning-universe/pctl-rs` | Probabilistic model checking — DTMC/MDP/CTMC, Belnap 4-valued logic |
| `reasoning-universe/obstruct` | Structural complexity DSL for NP problems |
| `reasoning-universe/zz-notation` | Meta-reasoning language and strategy composition |

### Layer 03 — MEMORY
*Persistent state. Depends on Infra. Serves Knowledge and Reasoning.*

| Repo | Purpose |
|------|---------|
| `infra-eco/rstmdb` | State Machine Database — WAL, transition guards, WATCH semantics |
| `infra-eco/rstmdb-studio` | Web UI for rstmdb |

### Layer 04 — KNOWLEDGE
*Semantic indexing and code graph construction. Depends on Memory.*

| Repo | Purpose |
|------|---------|
| `tools/ai-tools/graphify` | Multimodal knowledge graph (code + docs + images) |
| `tools/ai-tools/codegraph-rust` | LSP-grade code knowledge graph |
| `tools/ai-tools/codebase-memory-mcp` | Fast code indexer (66 langs, MCP server) |

### Layer 05 — REASONING
*Logic programming, inference engines, optimization algorithms. Depends on Formal + Knowledge + Memory.*

| Repo | Purpose |
|------|---------|
| `reasoning-universe/infer` | Logic programming + advisory reasoning (22 crates, 11 verbs) |
| `reasoning-universe/axiomvm` | Deterministic execution VM for verified computation |
| `reasoning-universe/aivm` | Agent runtime (WASM-based) |
| `reasoning-universe/craftegy-algo` | Structural optimization (graph, sets, ordering, probability crates) |
| `epistemic-universe/criterium` | Epistemic reasoning platform — abduction-first loop with mandatory HITL, AssuranceLevel (L0→L3), Belnap truth states, shared KnowledgeStore |

### Layer 06 — SPEC
*Specification and governance. Uses Reasoning to prove specs are logically sound before execution.*

| Repo | Purpose |
|------|---------|
| `tools/ai-tools/flowspec` | Spec-driven dev workflow CLI (SDD, ADR sync, triage) |
| `tools/ai-tools/FPF` | Foundational Problem Framework specification |
| `tools/ai-tools/haft` | Engineering governance enforcement |
| `tools/ai-tools/quint` | Formal specification language (TLA+ successor) |

### Layer 07 — BRIDGE
*Coordination layer. Connects agents, tasks, and repos.*

| Repo | Purpose |
|------|---------|
| `tools/orchestrator/AllBeads` | Multi-repo agent orchestration hub |
| `tools/orchestrator/beads_rust` | Local-first issue tracker (`br` CLI) |
| `tools/orchestrator/beads_viewer_rust` | Graph-aware triage TUI (`bv`, 26 algorithms) |

### Layer 08 — EXECUTION
*Agents acting on specs and knowledge to produce code.*

| Repo | Purpose |
|------|---------|
| `apps/code-catalyst` | Code Reasoning Intelligence Platform |
| `tools/ai-tools/grace-marketplace` | GRACE contract-driven code generation |
| `tools/ai-tools/grace-skills` | 13 Claude Code skills for GRACE |
| `tools/ai-tools/fpf-problem-solving-skill` | FPF as a Claude skill |

### Layer 09 — APPS
*Deployed analytical products. First real applications of the Intelligence Stack.*

| Repo | Purpose |
|------|---------|
| `apps/reasoning-apps` | Polymarket confidence analysis + Three-Layer Proven Map (rstmdb + infer) |

### Layer 10 — PRODUCTS
*User-facing products. Integrates craftegy-algo (layout), rstmdb (state), infer (invariants).*

| Repo | Purpose |
|------|---------|
| `prodx/craftegy-design` | ZomboDesign — Rust/Tauri rewrite of open-codesign |
| `prodx/external/open-codesign` | Original TS/Electron artifact generation (reference) |
| `prodx/external/AgentOS` | Agent operating system reference implementation |
| `prodx/external/DesignOS` | Design operating system reference implementation |

## 4. The Two Sub-Stacks

The 10 layers split into two interleaved sub-stacks:

```
Intelligence Stack (01→05)        Agentic Stack (06→10)
─────────────────────────         ─────────────────────
01 INFRA                          06 SPEC
02 FORMAL          ──────────►    07 BRIDGE
03 MEMORY          crossover      08 EXECUTION
04 KNOWLEDGE       at 05→06       09 APPS
05 REASONING                      10 PRODUCTS
```

The crossover is the **Logic Proof Gate**: `infer` (Layer 05) validates that specs (Layer 06) satisfy architectural invariants before agents (Layer 08) execute. This is the "Spiral SDD" governance mechanism.

## 5. What Changed from the Original 8-Layer Draft

| Change | Reason |
|--------|--------|
| INFRA moved from #7 → #1 | It's the physical foundation; everything depends on it |
| Added FORMAL as #2 | pctl-rs/obstruct/zz-notation are pure math with no runtime deps |
| Renamed Orchestration → REASONING | We don't use LangGraph; infer IS our reasoning orchestration |
| RESEARCH removed as a layer | Not a layer — it's an output produced by APPS |
| Added PRODUCTS as #10 | craftegy-design + prodx/* is a distinct product layer above analytics APPS |
| craftegy-algo placed in REASONING | It's algorithmic core (graph/probability), not a product |
| criterium placed in REASONING | Inductive↔Deductive bridge is a reasoning component |

## 6. Acceptance Criteria

- [ ] All 33 repos are assigned to exactly one Prometey layer
- [ ] `ECOSYSTEM.md` reflects the 10-layer model
- [ ] `eco-sync` supports the `prodx` group (craftegy-design, external/*)
- [ ] No circular layer dependencies exist
- [ ] Each layer's repos are documented with their upstream dependencies
