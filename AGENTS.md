# FlowSpec Agent Instructions

This project uses **FlowSpec** for Spec-Driven Development (SDD).

## Skills System

Codex loads skills from `.agents/skills/`. Use `/skills` to browse available skills or
invoke them inline using `$<skill-name>` syntax. Codex may also trigger skills implicitly
when a task description matches a skill's description.

| Command | Skill Name | Purpose |
|---------|-----------|---------|
| `$flow-assess` | `flow-assess` | Evaluate feature complexity and SDD fit |
| `$flow-specify` | `flow-specify` | Create PRD / feature spec |
| `$flow-plan` | `flow-plan` | Architecture and platform planning |
| `$flow-implement` | `flow-implement` | Guided implementation with agents |
| `$flow-validate` | `flow-validate` | QA, security, docs validation |
| `$flow-gate` | `flow-gate` | Quality gate before implementation |
| `$flow-triage` | `flow-triage` | Session-start project triage via bv |
| `$flow-intake` | `flow-intake` | Process INITIAL feature docs |
| `$flow-research` | `flow-research` | Business validation and research |
| `$flow-init` | `flow-init` | Initialize SDD constitution |
| `$flow-reset` | `flow-reset` | Reset workflow configuration |
| `$flow-generate-prp` | `flow-generate-prp` | Generate PRP context bundle |
| `$flow-map-codebase` | `flow-map-codebase` | Map codebase for context |
| `$flow-security_workflow` | `flow-security_workflow` | Security scanning workflow |
| `$flow-sync` | `flow-sync` | Sync beads tasks |
| `$flow-board` | `flow-board` | Project board — epic summary table + top tasks |
| `$vibe-vibe` | `vibe-vibe` | Casual mode — just code it |

## How to Execute a Skill

Three ways to invoke a skill:

1. **Browse**: Type `/skills` to open the skills menu and select interactively.
2. **Inline explicit**: Type `$flow-gate docs/prd/my-feature-spec.md --threshold 95`
   in the chat — Codex invokes the `flow-gate` skill with those arguments.
3. **Implicit**: Codex may automatically trigger a skill when your task description
   matches the skill's description (e.g., asking to "assess" a feature triggers
   `flow-assess`).

## SDD Workflow Order

```
$flow-assess -> $flow-specify -> $flow-plan -> $flow-implement -> $flow-validate
```

Run `$flow-gate` before implementation to validate spec quality.
Run `$flow-triage` at session start for project context.

<<<<<<< HEAD
## Ecosystem Directory Map

```
zombo-sash-eco/
├── apps/                          Applications & platforms
│   ├── code-catalyst                svaiml    Code Reasoning Platform
│   ├── reasoning-apps               zombocoder Polymarket, Catalyst, CMH
│   ├── research-scaffold            svaiml    Research project template
│   └── episteme-platform            sashml    Knowledge extraction pipeline (TBD)
│
├── epistemic-universe/            Epistemic reasoning (bridge + R&D)
│   ├── criterium                    svaiml    Inductive↔Deductive bridge + HITL
│   ├── epistemic-game               svaiml    Multi-agent epistemic reasoning
│   ├── episteme-lab                 AITechCraft Python R&D: belnap-gpt, Randers loss
│   ├── pbelnap                      AITechCraft Belnap bilattice types for LLMs
│   ├── bilattice-relabeler          AITechCraft Multi-model consensus relabeling
│   └── _external/nanoGPT           AITechCraft GPT training base (fork)
│
├── reasoning-universe/            Core reasoning engines (Rust)
│   ├── infer                        zombocoder Logic programming (22 crates, 11 verbs)
│   ├── pctl-rs                      zombocoder Probabilistic model checking
│   ├── zz-notation                  zombocoder Meta-reasoning language
│   ├── obstruct                     zombocoder NP structural complexity DSL
│   ├── craftegy-algo                svaiml    Algorithm substrate (graph/sets/prob)
│   ├── fpf-cards                    svaiml    FPF card types (CSC/DRR/EFP)
│   ├── aivm                         zombocoder WASM agent runtime
│   └── axiomvm                      zombocoder Deterministic Lisp VM
│
├── infra-eco/                     Infrastructure
│   ├── rstmdb                       rstmdb    State Machine Database
│   ├── rstmdb-studio                rstmdb    rstmdb web UI
│   ├── inferense                    zombocoder Infer-as-a-Service HTTP API
│   ├── invariantis                  zombocoder Distributed proof ledger
│   ├── o2l                          sashml    Language toolkit + Rune DSL
│   ├── bfc                          zombocoder Binary File Container
│   ├── ctop                         zombocoder Compact Token-Oriented Protocol
│   ├── myria, npd-cipher, go-freebsd-pf
│
├── prodx/                         Product experiences
│   ├── craftegy-design              svaiml    Tauri desktop design app
│   └── _external/                   Reference projects (AgentOS, DesignOS, open-codesign)
│
├── tools/
│   ├── ai-tools/
│   │   ├── codegraph-rust           sashml    Code knowledge graph (our fork)
│   │   └── _external/              FPF, haft, quint, graphify, grace-*, codebase-memory-mcp
│   ├── orchestrator/
│   │   ├── flowspec                 sashml    Spec-driven dev CLI
│   │   └── _external/              AllBeads, beads_rust, beads_viewer_rust, PaperClip, gsd-2
│   ├── sysutils/
│   │   ├── ghdash                   zombocoder GitHub dashboard
│   │   ├── zacta                    zombocoder
│   │   └── vaultura                 zombocoder
│   ├── optimization/_external/     baml, dspy, dspy-code, promptfoo, sammo
│   └── science-libs/_external/     naproche, algorithmic-algebras-embedding
│
├── kernel-forge/                  Binary primitives (C)
│   ├── bfc                          zombocoder Binary File Container
│   └── bfcfs-linux                  zombocoder Linux kernel module for .bfc
│
└── research/                      Research projects
    ├── CoreFoundation, feature-factory, folder-sync
    └── _external/                  contextflow-forge, cronus, specmem
```

Convention: repos we don't own live under `_external/` within their category.
Our orgs: `zombocoder`, `svaiml`, `sashml`, `rstmdb`, `AITechCraft`.

=======
>>>>>>> 408d07a (docs: ecosystem scaffold — ADRs, PRDs, research, assessments, config)
## Task Tracking — Beads-rust

| System | CLI | When to use |
|--------|-----|-------------|
| Beads-rust | `br ...` | All issue and task tracking |

```bash
br list                                        # list all open issues
br update <id> --status in_progress            # valid statuses: open/in_progress/blocked/deferred/closed
br close <id>                                  # close a completed issue
```

## Project Intelligence (bv)

```bash
bv -agent-brief /tmp/bv-brief   # Full session context export
bv -robot-next                  # Recommended next task
bv -robot-triage                # Full triage report
bv -robot-alerts                # Blockers and risks
bv -robot-suggest               # Duplicate/related issue detection
bv -robot-blocker-chain <id>    # Blocker chain for a task
bv -robot-forecast <id>         # ETA forecast
```
