# Zombo-Sash-Eco: Ecosystem Guide

## Prometey Stack — Layer Model

The ecosystem is organized as a **10-layer dependency stack**. Lower layers provide services to higher layers. Nothing at layer N depends on layer N+1.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  10 — PRODUCTS     prodx/craftegy-design                                    ║
║  09 — APPS         apps/{reasoning-apps, code-catalyst,                     ║
║                          episteme-platform, research-scaffold}              ║
║  08 — EXECUTION    tools/orchestrator/_external/{grace-*, PaperClip}        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  07 — BRIDGE       tools/orchestrator/{flowspec,                            ║
║                                        _external/beads_rust, _external/bv}  ║
║  06 — SPEC         tools/ai-tools/_external/{FPF, haft, quint}              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  05 — REASONING    reasoning-universe/{infer, axiomvm, aivm,                ║
║                                        craftegy-algo, fpf-cards}            ║
║                    epistemic-universe/{criterium, epistemic-game,            ║
║                                        episteme-lab, pbelnap,               ║
║                                        bilattice-relabeler}                 ║
║  04 — KNOWLEDGE    tools/ai-tools/{codegraph-rust,                          ║
║                          _external/graphify, _external/codebase-memory-mcp} ║
║  03 — MEMORY       infra-eco/{rstmdb, rstmdb-studio}                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  02 — FORMAL       reasoning-universe/{pctl-rs, obstruct, zz-notation}      ║
║  01 — INFRA        infra-eco/{o2l, npd-cipher, ctop, inferense,             ║
║                               invariantis, bfc, myria}                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  00 — KERNEL-FORGE kernel-forge/{bfc, bfcfs-linux}                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
║  SYSUTILS          tools/sysutils/{ghdash, zacta, vaultura}                  ║
║  OPTIMIZATION      tools/optimization/_external/{baml, dspy, promptfoo,     ║
║                                                  sammo, dspy-code}          ║
║  SCIENCE-LIBS      tools/science-libs/_external/{naproche,                  ║
║                                       algorithmic-algebras-embedding}       ║
╚══════════════════════════════════════════════════════════════════════════════╝

Convention: repos we don't own live under `_external/` within their category.
Our repos (zombocoder, svaiml, sashml, rstmdb, AITechCraft) sit at the category root.
```

**Two sub-stacks feed into each other:**
- **Intelligence Stack** (01→05): Makes reasoning possible
- **Agentic Stack** (06→10): Makes agents act on that reasoning

The crossover point is Layer 05→06: `infer` proves that specs satisfy architectural invariants before agents execute them.

---

## Repository Structure

### Layer 00 — KERNEL-FORGE
*Binary primitives. Pure C, zero dependencies. The fire itself — portable, self-contained, runs anywhere.*

```
kernel-forge/
├── bfc          — Binary File Container: lightweight append-only single-file container (C)
├── bfcfs-linux  — Linux kernel module: mount .bfc read-only, no FUSE, Zstd compression
└── bfc-httpd    — HTTP server: serve frontend directly from a .bfc binary container
```

### Layer 01 — INFRA
*Compute substrate, cryptography, runtime DSLs. Everything runs on this.*

```
infra-eco/
├── o2l              — Language toolkit + Rune DSL runtime
├── npd-cipher       — Cryptographic primitives
├── ctop             — Container topology tool
├── inferense        — Infer-as-a-Service (HTTP API wrapper around infer)
└── invariantis      — Distributed ledger for immutable proof records
```

### Layer 02 — FORMAL
*Pure mathematics. No runtime dependencies. Provides the mathematical substrate for reasoning.*

```
reasoning-universe/
├── pctl-rs          — Probabilistic model checking (DTMC/MDP/CTMC, Belnap logic)
│                      Crates: pctl-core, pctl-belnap, pctl-parser, belnap CLI
├── obstruct         — Structural complexity DSL for NP problems
└── zz-notation      — Meta-reasoning language and strategy composition
```

### Layer 03 — MEMORY
*Persistent state. Sits on Infra, provides stateful storage to all upper layers.*

```
infra-eco/
├── rstmdb           — State Machine Database (WAL, guards, WATCH semantics)
└── rstmdb-studio    — rstmdb web UI
```

### Layer 04 — KNOWLEDGE
*Semantic indexing and code understanding. Needs Memory to cache graphs.*

```
tools/ai-tools/
├── graphify             — Multimodal knowledge graph (code + docs + images)
├── codegraph-rust       — LSP-grade code knowledge graph
└── codebase-memory-mcp  — Fast code indexer (66 langs, MCP server)
```

### Layer 05 — REASONING
*Logic programming, inference, and algorithmic reasoning. Uses Formal + Knowledge + Memory.*

```
reasoning-universe/
├── infer            — Logic programming + advisory reasoning (22 crates, 11 verbs)
│                      Verbs: DEDUCE, ABDUCE, DETECT, STRESS, MONITOR, ...
├── axiomvm          — Deterministic execution VM for verified computation
├── aivm             — Agent runtime (WASM-based)
└── craftegy-algo    — Structural optimization algorithms for artifact generation
                       Crates: craftegy-graph, craftegy-sets,
                               craftegy-ordering, craftegy-probability

epistemic-universe/
└── criterium        — Epistemic reasoning platform: abduction-first loop with HITL
                       Loop: Abduction (FPF) → Deduction (infer) → Induction (pctl-rs)
                       AssuranceLevel: L0 (hypothesis) → L1 (logical) → L2 (evidenced) → L3 (operational)
                       KnowledgeStore: shared memory via zz-notation, persisted via rstmdb
                       Belnap truth: True / False / Unknown / Conflicted
                       HITL is structural — loop cannot advance without human judgment
```

### Layer 06 — SPEC
*Specification and governance. Uses Reasoning to validate that specs are logically sound.*

```
tools/ai-tools/
├── flowspec             — Spec-driven dev workflow CLI (SDD, ADR sync, triage)
├── FPF                  — Foundational Problem Framework spec
├── haft                 — Engineering governance (FPF enforcement)
└── quint                — Formal specification language (TLA+ successor)
```

### Layer 07 — BRIDGE
*Coordination and task tracking across agents and repos.*

```
tools/orchestrator/
├── AllBeads             — Multi-repo agent orchestration hub
├── beads_rust           — Local-first issue tracker (br CLI)
└── beads_viewer_rust    — Graph-aware triage TUI (bv, 26 algorithms)
```

### Layer 08 — EXECUTION
*Agents acting on specs + knowledge to produce code.*

```
apps/
└── code-catalyst        — Code Reasoning Intelligence Platform

tools/ai-tools/
├── grace-marketplace    — GRACE contract-driven code generation
├── grace-skills         — 13 Claude Code skills for GRACE
└── fpf-problem-solving-skill — FPF as a Claude skill
```

### Layer 09 — APPS
*Deployed analytical products. First applications of the full Intelligence Stack.*

```
apps/
└── reasoning-apps       — Research catalyst + Polymarket confidence analysis
                           Implements: Three-Layer Proven Map (rstmdb + infer)
```

### Layer 10 — PRODUCTS
*User-facing products built with the full stack. Depends on all lower layers.*

```
prodx/
├── craftegy-design      — ZomboDesign: Rust/Tauri rewrite of open-codesign
│                          Uses: craftegy-algo (layout), rstmdb (state),
│                                infer (invariant validation)
└── external/            — Reference implementations & upstream sources
    ├── open-codesign    — Original TS/Electron artifact generation framework
    ├── AgentOS          — Agent operating system reference
    └── DesignOS         — Design operating system reference
```

---

## Managing Repos with Gita

[gita](https://github.com/nosarthur/gita) manages all 33+ repos as a single workspace with named groups.

### Setup (one time)

```bash
eco-sync setup-gita
```

Groups:
- `apps` — code-catalyst, reasoning-apps
- `infra` — ctop, inferense, invariantis, npd-cipher, o2l, rstmdb, rstmdb-studio
- `reasoning` — aivm, axiomvm, craftegy-algo, criterium, infer, obstruct, pctl-rs, zz-notation
- `ai-tools` — FPF, codebase-memory-mcp, codegraph-rust, flowspec, fpf-problem-solving-skill, grace-marketplace, grace-skills, graphify, haft, quint
- `orchestrator` — AllBeads, beads_rust, beads_viewer_rust
- `prodx` — craftegy-design, open-codesign, AgentOS, DesignOS

### Daily Commands

```bash
gita ll                         # all repos
gita ll reasoning               # reasoning group
gita fetch                      # fetch all
gita super reasoning pull       # pull all reasoning repos
gita super infra status         # git status for all infra repos
gita super pull                 # pull everything
```

### Useful Patterns

```bash
# Unpushed commits across all repos
gita super log --oneline @{u}..HEAD

# Repos on feature branches
gita super branch --show-current | grep -v "main\|develop"

# Check all reasoning repos compile
gita super reasoning cargo check
```

---

## Eco-Sync Commands

```bash
eco-sync scan           # discover all git repos
eco-sync sync           # fetch + pull + fix HTTPS→SSH remotes
eco-sync status         # compact table: repo | branch | dirty | remote
eco-sync tree           # visual tree with GitHub URLs
eco-sync fix-remotes    # convert all HTTPS remotes to SSH
eco-sync setup-gita     # register repos + configure groups
eco-sync lg infer       # open lazygit for a specific repo
```

---

## Branch Conventions

- `main` — stable branch for most repos
- `develop` — primary dev branch for: infer, pctl-rs, zz-notation, reasoning-apps, flowspec
- Feature branches: `feature/<name>` from current HEAD

## Quick Reference

| What | Command |
|---|---|
| See everything | `gita ll` |
| Fetch all | `gita fetch` |
| Pull reasoning group | `gita super reasoning pull` |
| Fix SSH remotes | `eco-sync fix-remotes` |
| Session triage | `flowspec triage --session` |
| Sync ADRs → beads | `flowspec sync adrs` |
| Open lazygit | `eco-sync lg infer` |
