# Zombo-Sash-Eco: Ecosystem Guide

## Repository Structure

```
zombo-sash-eco/
├── apps/                    — Applications
│   ├── code-catalyst        — Code Reasoning Intelligence Platform
│   └── reasoning-apps       — Research catalyst, Polymarket analysis
│
├── infra-eco/               — Infrastructure
│   ├── ctop                 — Container topology tool
│   ├── inferense            — Infer-as-a-Service (HTTP API)
│   ├── invariantis          — Distributed ledger
│   ├── npd-cipher           — Cryptographic tools
│   ├── o2l                  — Language toolkit + Rune DSL
│   ├── rstmdb               — State Machine Database (WAL, guards, WATCH)
│   └── rstmdb-studio        — rstmdb web UI
│
├── reasoning-universe/      — Core reasoning engines
│   ├── infer                — Logic programming + advisory reasoning (22 crates, 11 verbs)
│   ├── pctl-rs              — Probabilistic model checking (DTMC/MDP/CTMC)
│   ├── obstruct             — Structural complexity DSL for NP problems
│   ├── zz-notation          — Meta-reasoning language
│   ├── aivm                 — Agent runtime (WASM)
│   └── axiomvm              — Deterministic execution VM
│
├── tools/ai-tools/          — AI coding & analysis tools
│   ├── codegraph-rust       — LSP-grade code knowledge graph
│   ├── codebase-memory-mcp  — Fast code indexer (66 langs, C, MCP)
│   ├── graphify             — Multimodal knowledge graph (code+docs+images)
│   ├── flowspec             — Spec-driven dev workflow CLI
│   ├── haft                 — Engineering governance (FPF)
│   ├── FPF                  — Foundational Problem Framework spec
│   ├── fpf-problem-solving-skill — FPF as Claude skill
│   ├── grace-marketplace    — GRACE contract-driven code generation
│   ├── grace-skills         — 13 Claude Code skills for GRACE
│   └── quint                — Formal specification language (TLA+)
│
├── tools/orchestrator/      — Task & agent orchestration
│   ├── AllBeads             — Multi-repo agent orchestration
│   ├── beads_rust           — Local-first issue tracker
│   └── beads_viewer_rust    — Graph-aware triage TUI (26 algorithms)
│
└── bin/                     — Ecosystem binaries & tools
    ├── eco-sync             — Ecosystem management script
    ├── infer                — Infer CLI
    ├── infer-repl           — Interactive REPL
    ├── pctl                 — PCTL model checker
    ├── rstmdb-server        — State machine database
    ├── rstmdb-cli           — rstmdb client
    └── lazygit              — Terminal git UI
```

## Managing Repos with Gita

[gita](https://github.com/nosarthur/gita) manages all 28+ repos as a single workspace with named groups.

### Setup (one time)

```bash
eco-sync setup-gita
```

This registers all repos and configures 5 groups:
- `apps` — code-catalyst, reasoning-apps
- `infra` — ctop, inferense, invariantis, npd-cipher, o2l, rstmdb, rstmdb-studio
- `reasoning` — aivm, axiomvm, infer, obstruct, pctl-rs, zz-notation
- `ai-tools` — FPF, codebase-memory-mcp, codegraph-rust, flowspec, fpf-problem-solving-skill, grace-marketplace, grace-skills, graphify, haft, quint
- `orchestrator` — AllBeads, beads_rust, beads_viewer_rust

### Daily Commands

```bash
# Status — see all repos at a glance
gita ll                         # all 28 repos
gita ll reasoning               # just reasoning group
gita ll infra                   # just infra group

# Fetch — pull latest from all origins
gita fetch                      # fetch all repos
gita fetch reasoning            # fetch only reasoning group

# Run any git command across a group
gita super reasoning pull       # pull all reasoning repos
gita super infra status         # git status for all infra repos
gita super ai-tools branch --show-current  # current branch per repo

# Run across ALL repos
gita super pull                 # pull everything
gita super branch -a            # list all branches everywhere
```

### Useful Patterns

```bash
# Which repos have unpushed commits?
gita super log --oneline @{u}..HEAD

# Which repos are on feature branches (not main/develop)?
gita super branch --show-current | grep -v "main\|develop"

# Fetch + show what's changed
gita fetch && gita ll

# Check if reasoning repos build
gita super reasoning cargo check
```

## Eco-Sync Commands

`eco-sync` handles things gita can't:

```bash
eco-sync scan           # discover all git repos in ecosystem
eco-sync sync           # fetch + pull + auto-fix HTTPS→SSH remotes
eco-sync status         # compact table: repo | branch | dirty | remote
eco-sync tree           # visual tree with GitHub URLs
eco-sync fix-remotes    # convert all HTTPS remotes to SSH
eco-sync setup-gita     # register repos + configure groups
eco-sync lg infer       # open lazygit for a specific repo
```

## Lazygit

For interactive git work on a specific repo:

```bash
eco-sync lg infer       # open lazygit for infer
eco-sync lg rstmdb      # open lazygit for rstmdb
eco-sync lg pctl-rs     # open lazygit for pctl-rs
```

Or directly:

```bash
lazygit -p reasoning-universe/infer
```

## Branch Conventions

- `main` — default branch for most repos
- `develop` — primary branch for: infer, pctl-rs, zz-notation, reasoning-apps, flowspec
- Feature branches: `feature/<name>` from develop (or current HEAD)

## Quick Reference

| What | Command |
|---|---|
| See everything | `gita ll` |
| See one group | `gita ll reasoning` |
| Fetch all | `gita fetch` |
| Pull reasoning | `gita super reasoning pull` |
| Fix SSH remotes | `eco-sync fix-remotes` |
| Ecosystem tree | `eco-sync tree` |
| Open lazygit | `eco-sync lg infer` |
| Register new repo | `gita add /path/to/repo` then `gita group add -n <group> <repo-name>` |
