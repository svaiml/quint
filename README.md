# ZomboCraftEco

> One repo to rule them all. 55+ repos across 5 orgs, managed as a single workspace.

## Quick Start

```bash
# 1. Clone this repo
git clone git@github.com:svaiml/ZomboCraftEco.git ~/zombo-sash-eco
cd ~/zombo-sash-eco

# 2. Bootstrap (installs gm + clones all 64 repos + tools)
./bin/bootstrap
```

That's it. Bootstrap downloads the `gm` binary from GitHub Releases (or builds from source), then `gm sync` clones all 64 repos.

**Prerequisites**: `git`, `gh` (GitHub CLI, authenticated — [install](https://cli.github.com))

```bash
# IMPORTANT: set HTTPS protocol before first run (avoids SSH passphrase prompts)
gh auth login                      # authenticate with GitHub
gh config set git_protocol https   # use OAuth tokens, not SSH keys

# Or minimal (just gm + repos, skip flowspec/br/bv)
./bin/bootstrap --minimal
```

### Windows (Git Bash)

```bash
git clone https://github.com/svaiml/ZomboCraftEco.git ~/zombo-sash-eco
cd ~/zombo-sash-eco
gh config set git_protocol https --host github.com
./bin/bootstrap
```

## Daily Workflow

```bash
gm status                          # 64 repos: 28 clean, 6 dirty, 0 behind
gm pull                            # fetch + merge all repos
gm push --plan                     # show dependency-ordered push plan
gm push --apply                    # push in order, abort on failure

gm lock                            # snapshot exact state → .gm/workspace.lock
gm lock --diff                     # what changed since lock?
gm sync --locked                   # restore exact locked state

gm exec "cargo test" --group reasoning   # run tests in all reasoning repos
gm checkout feature/hotfix --group reasoning --create
gm graph --dot | dot -Tpng -o deps.png   # visualize dependency graph

gm worktree add feature/agent-b --group reasoning   # parallel workspace
gm worktree list
gm worktree remove feature/agent-b
```

## Ecosystem Structure

```
zombo-sash-eco/
├── apps/                         Applications & platforms
│   ├── code-catalyst               svaiml    Code Reasoning Platform
│   ├── reasoning-apps              zombocoder Polymarket, Catalyst, CMH
│   ├── episteme-platform           sashml    Knowledge extraction pipeline
│   └── research-scaffold           svaiml    Research template
│
├── epistemic-universe/           Epistemic reasoning (bridge + R&D)
│   ├── criterium                   svaiml    Inductive↔Deductive bridge + HITL
│   ├── epistemic-game              svaiml    Multi-agent epistemic reasoning
│   ├── episteme-lab                AITechCraft Python R&D (belnap-gpt, Randers)
│   ├── pbelnap                     AITechCraft Belnap bilattice types for LLMs
│   ├── bilattice-relabeler         AITechCraft Multi-model consensus relabeling
│   └── _external/nanoGPT          AITechCraft GPT training base (fork)
│
├── reasoning-universe/           Core reasoning engines (Rust)
│   ├── infer                       zombocoder Logic programming (22 crates, 11 verbs)
│   ├── pctl-rs                     zombocoder Probabilistic model checking
│   ├── zz-notation                 zombocoder Meta-reasoning language
│   ├── obstruct                    zombocoder NP structural complexity DSL
│   ├── craftegy-algo               svaiml    Algorithm substrate
│   ├── fpf-cards                   svaiml    FPF card types
│   ├── aivm                        zombocoder WASM agent runtime
│   └── axiomvm                     zombocoder Deterministic Lisp VM
│
├── infra-eco/                    Infrastructure
│   ├── rstmdb / rstmdb-studio     State Machine Database + UI
│   ├── inferense                   Infer-as-a-Service HTTP API
│   ├── invariantis                 Distributed proof ledger
│   ├── o2l                         Language toolkit + Rune DSL
│   └── bfc, ctop, myria, npd-cipher, go-freebsd-pf
│
├── tools/
│   ├── ai-tools/codegraph-rust    Code knowledge graph (our fork)
│   ├── ai-tools/_external/        FPF, haft, quint, graphify, grace-*, ...
│   ├── orchestrator/flowspec      Spec-driven dev CLI
│   ├── orchestrator/_external/    beads_rust, AllBeads, PaperClip, gsd-2
│   └── sysutils/
│       ├── gm                      Git workspace orchestrator (this tool)
│       ├── ghdash                  GitHub dashboard
│       ├── zacta, vaultura
│
├── prodx/craftegy-design          Tauri desktop design app
├── kernel-forge/                  Binary primitives (C): bfc, bfcfs-linux
└── research/                      Research projects + _external/
```

Convention: repos we don't own live under `_external/` ([ADR-008](docs/adr/ADR-008-external-repo-convention.md)).

## Key Tools

| Tool | What | Install |
|------|------|---------|
| **gm** | Git workspace orchestrator | `./bin/bootstrap` (automatic) |
| **flowspec** | Spec-driven dev CLI | `cd tools/orchestrator/flowspec && uv tool install -e .` |
| **br** | Beads issue tracker | `cargo install beads-rust` |
| **bv** | Beads viewer (graph triage) | `cargo install beads-viewer-rust` |

## Configuration

| File | What |
|------|------|
| `.gm/workspace.yaml` | Repo manifest: 64 repos, 9 groups, 8 dependency edges |
| `.gm/workspace.lock` | Deterministic state snapshot (run `gm lock`) |
| `ECOSYSTEM.md` | Prometey Stack 10-layer architecture |
| `AGENTS.md` | Agent onboarding with directory map |

## Orgs

| Org | Role |
|-----|------|
| `zombocoder` | Primary — core reasoning/infra |
| `svaiml` | Personal — private repos, tools, forks |
| `sashml` | Secondary — o2l, flowspec, episteme-platform |
| `rstmdb` | RSTMDB org |
| `AITechCraft` | Python R&D — episteme-lab, pbelnap, bilattice-relabeler |

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Linux (Ubuntu 22.04+) | Full | Native shell scripts |
| macOS 14+ | Full | Native shell scripts |
| Windows 10/11 | Supported | Requires Git Bash for `.sh` scripts; `gm` works natively |
| FreeBSD 14 | Supported | See ADR-005 |

## Troubleshooting

### SSH passphrase prompted for every repo

`gm sync` uses `gh repo clone` which respects your `gh` protocol setting. If you're getting SSH prompts:

```bash
# Fix: switch to HTTPS (uses OAuth token, zero prompts)
gh config set git_protocol https --host github.com

# Verify
gh auth status
# Should show: Git operations protocol: https
```

### Repos not cloning (access denied)

`gm` uses the active `gh` account. If some repos belong to a different org:

```bash
# Check active account
gh auth status

# Switch account (if you have multiple)
gh auth switch --user USER

# Re-run sync
gm sync
```

Use the account that has access to all 5 orgs (`zombocoder`, `svaiml`, `sashml`, `rstmdb`, `AITechCraft`).

### Windows-specific

- Run `./bin/bootstrap` from **Git Bash** (not PowerShell or CMD)
- `gm.exe` works natively in any terminal
- If `gm` not found after bootstrap: add `%LOCALAPPDATA%\Programs\bin` to PATH
