# PRD: gm — Git Workspace Orchestrator

**Repo**: svaiml/gm (private)
**Location**: tools/sysutils/gm
**Language**: Rust
**Created**: 2026-05-05
**Research**: `docs/research/git-workspace-orchestrator-research.md`

---

## Implementation Status

**All spec requirements implemented.** 20/20 functional + 5 bonuses.

| Gap | Status |
|---|---|
| ~~exec --ordered~~ | ✅ Implemented — wires push_order() DAG |
| ~~--repo filter~~ | ✅ Implemented — all commands accept --repo |
| ~~Profiles~~ | ✅ Bonus — dev/full/minimal/ci/research |
| ~~Windows~~ | ✅ Bonus — cross-platform from day 1 |
| ~~gh auth~~ | ✅ Bonus — uses gh CLI for private repos |

29 tests (19 unit + 10 integration), 3 platform binaries.

---

## 1. Executive Summary

### Problem

Managing 55+ repos across 5 GitHub orgs requires 3 separate tools (`eco-sync`, `gita`, `clone-ecosystem.sh`) none of which provide deterministic state, dependency-aware operations, or cross-repo worktrees. No existing tool in the market combines all three.

### Solution

`gm` — a single Rust CLI that replaces all three tools with a unified, dependency-aware, lockable workspace orchestrator.

### North Star

**Single command to reproduce any workspace state**: `gm sync --locked` restores exact commits across all 55 repos in under 30 seconds.

---

## 2. Architecture

### Crate Structure

```
gm/
├── Cargo.toml              # workspace
├── crates/
│   ├── gm-core/            # manifest parser, DAG, lock manager, repo discovery
│   │   ├── manifest.rs     # workspace.yaml parser
│   │   ├── lock.rs         # workspace.lock read/write/diff
│   │   ├── graph.rs        # dependency DAG, topological sort, cycle detection
│   │   ├── repo.rs         # RepoUnit: path, remote, branch, group, dirty state
│   │   └── discover.rs     # scan filesystem for git repos
│   │
│   ├── gm-git/             # git operations abstraction
│   │   ├── ops.rs          # clone, pull, push, checkout, status, worktree
│   │   ├── parallel.rs     # rayon/tokio parallel execution across repos
│   │   └── adapter.rs      # subprocess git CLI adapter
│   │
│   └── gm-cli/             # CLI entry point (clap)
│       └── main.rs         # command dispatch
│
├── workspace.yaml           # example manifest
└── tests/
    └── integration/         # E2E tests with temp git repos
```

### Key Dependencies

```toml
[workspace.dependencies]
clap = { version = "4", features = ["derive"] }
serde = { version = "1", features = ["derive"] }
serde_yaml = "0.9"
serde_json = "1"
chrono = { version = "0.4", features = ["serde"] }
rayon = "1"                # parallel repo operations
thiserror = "2"
```

---

## 3. Command Specification

### Milestone 1: Bootstrap (replace clone-ecosystem.sh)

```bash
gm init [--from <workspace.yaml>]     # create .gm/ + workspace.yaml
gm add <name> <remote> [--path PATH] [--group GROUP] [--branch BRANCH]
gm remove <name>
gm sync                                # clone missing, checkout correct branches
gm status                              # per-repo: branch, dirty, ahead/behind
```

**`gm init`** creates:
```
.gm/
├── workspace.yaml    # manifest (repos, groups, dependencies)
└── workspace.lock    # lock file (commit SHAs, branches)
```

**`gm status`** output:
```
gm status
  apps/
    code-catalyst          main        clean   ↑0 ↓0
    reasoning-apps         develop     dirty   ↑2 ↓0
  reasoning-universe/
    infer                  develop     clean   ↑0 ↓3
    zz-notation            feat/kb-v2  dirty   ↑1 ↓0

  55 repos: 48 clean, 7 dirty, 3 behind remote
```

### Milestone 2: Git Operations (replace gita)

```bash
gm pull [--group GROUP] [--parallel N]
gm push [--group GROUP]
gm checkout <branch> [--group GROUP] [--all] [--create]
gm exec "<command>" [--group GROUP] [--parallel N]
gm fetch [--group GROUP]
```

**Parallel execution**: `rayon` thread pool, default = num_cpus. `--parallel N` overrides.

**`gm exec`** example:
```bash
gm exec "cargo test" --group reasoning    # run tests in all reasoning repos
gm exec "git log --oneline -3" --all      # recent commits everywhere
```

### Milestone 3: Lock System (deterministic state)

```bash
gm lock                     # capture current state → workspace.lock
gm lock --show              # print lock without saving
gm lock --diff              # compare current state vs locked
gm sync --locked            # restore exact locked state
gm sync --locked --verify   # verify after restore (checksums match)
```

**workspace.lock** format:
```json
{
  "version": 1,
  "locked_at": "2026-05-05T10:30:00Z",
  "locked_by": "sash@machine",
  "repos": {
    "reasoning-universe/infer": {
      "commit": "2f539a7c5409b474a19b35ef0e62a244bba81270",
      "branch": "develop",
      "remote": "git@github.com:zombocoder/infer.git",
      "dirty": false
    }
  }
}
```

**`gm lock --diff`** output:
```
Drift since lock (2026-05-05T10:30:00Z):
  reasoning-universe/infer     +3 commits (2f539a7 → 8bc4e12)
  reasoning-universe/zz-notation  branch changed (develop → feature/kb-v2)
  45 repos unchanged
```

### Milestone 4: Push Plan (dependency-aware)

```bash
gm push --plan               # show dependency-ordered push plan
gm push --plan --group reasoning
gm push --apply              # execute the plan
gm push --apply --dry-run    # show what would happen
gm graph                     # print dependency graph (DOT or ASCII)
gm graph --dot | dot -Tpng -o deps.png
```

**Reads `dependencies:` from workspace.yaml**:
```yaml
dependencies:
  reasoning-universe/zz-notation:
    - reasoning-universe/infer
  epistemic-universe/criterium:
    - reasoning-universe/zz-notation
    - reasoning-universe/infer
    - reasoning-universe/pctl-rs
  apps/episteme-platform:
    - reasoning-universe/infer
    - reasoning-universe/zz-notation
    - epistemic-universe/criterium
```

**`gm push --plan`** output:
```
Push plan (4 repos with unpushed commits):

  Phase 1 (no deps):
    1. reasoning-universe/infer          develop  ↑2
    2. reasoning-universe/pctl-rs        develop  ↑1

  Phase 2 (depends on phase 1):
    3. reasoning-universe/zz-notation    feat/kb  ↑1  ← depends on: infer

  Phase 3 (depends on phase 2):
    4. epistemic-universe/criterium      develop  ↑3  ← depends on: infer, zz-notation, pctl-rs

  Execute: gm push --apply
```

**DAG implementation**: Kahn's algorithm. Cycle detection. Repos with no deps pushed in parallel (phase 1). Each subsequent phase waits for its deps.

### Milestone 5: Worktree Orchestration

```bash
gm worktree add <branch> [--group GROUP] [--repo REPO]
gm worktree list
gm worktree remove <branch>
```

**`gm worktree add feature/hotfix --group reasoning`**:
- Creates `../zombo-sash-eco--feature-hotfix/reasoning-universe/infer` etc.
- Each repo gets `git worktree add` with the specified branch
- If branch doesn't exist: `--create` flag auto-creates from current HEAD

**Use case**: Agent A works in main workspace, Agent B works in worktree workspace — both compile independently.

### Milestone 6: Migrate eco-sync

```bash
# eco-sync becomes a thin shim:
eco-sync status    → gm status
eco-sync sync      → gm fetch && gm pull
eco-sync lock      → gm lock
eco-sync delta     → gm lock --diff
eco-sync report    → gm status --verbose --repo <name>
eco-sync tree      → gm status --tree
eco-sync fix-remotes → gm exec "git remote set-url origin $(gm manifest remote {})"
```

eco-sync stays as a Python wrapper for backward compat during transition. Eventually deprecated.

---

## 4. workspace.yaml Full Schema

```yaml
version: 1

workspace:
  name: zombo-sash-eco
  convention: _external     # ADR-008

groups:
  apps:
    path: apps
  epistemic-universe:
    path: epistemic-universe
  reasoning-universe:
    path: reasoning-universe
  infra-eco:
    path: infra-eco
  kernel-forge:
    path: kernel-forge
  prodx:
    path: prodx
  tools/ai-tools:
    path: tools/ai-tools
  tools/orchestrator:
    path: tools/orchestrator
  tools/sysutils:
    path: tools/sysutils

repositories:
  # apps
  - name: code-catalyst
    path: apps/code-catalyst
    remote: git@github.com:svaiml/code-catalyst.git
    branch: main
    group: apps

  - name: reasoning-apps
    path: apps/reasoning-apps
    remote: git@github.com:zombocoder/reasoning-apps.git
    branch: develop
    group: apps

  # ... (all 55 repos)

dependencies:
  reasoning-universe/zz-notation:
    - reasoning-universe/infer
  epistemic-universe/criterium:
    - reasoning-universe/zz-notation
    - reasoning-universe/infer
    - reasoning-universe/pctl-rs
  reasoning-universe/fpf-cards:
    - reasoning-universe/infer
  infra-eco/inferense:
    - reasoning-universe/infer
  infra-eco/rstmdb-studio:
    - infra-eco/rstmdb
  apps/reasoning-apps:
    - reasoning-universe/infer
    - infra-eco/rstmdb
    - reasoning-universe/pctl-rs
  apps/code-catalyst:
    - reasoning-universe/infer
    - tools/ai-tools/codegraph-rust
  apps/episteme-platform:
    - reasoning-universe/infer
    - reasoning-universe/zz-notation
    - epistemic-universe/criterium
    - reasoning-universe/pctl-rs
    - infra-eco/rstmdb
```

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| `gm status` (55 repos) | < 2s |
| `gm pull --parallel` (55 repos) | < 30s (network-bound) |
| `gm lock` | < 3s |
| `gm push --plan` | < 1s (no network, DAG only) |
| Binary size | < 10MB |
| Dependencies | clap, serde, rayon, chrono, thiserror — no async runtime for MVP |
| Platforms | Linux, macOS (MVP). Windows later. |
| Test coverage | > 80% on gm-core |

---

## 6. Milestone Summary

| Milestone | Commands | Replaces | Est. LOC | Priority |
|---|---|---|---|---|
| M1: Bootstrap | init, add, remove, sync, status | clone-ecosystem.sh | ~800 | P1 |
| M2: Git Ops | pull, push, checkout, exec, fetch | gita | ~600 | P1 |
| M3: Lock | lock, sync --locked, lock --diff | (new) | ~400 | P1 |
| M4: Push Plan | push --plan/--apply, graph | (new) | ~500 | P2 |
| M5: Worktree | worktree add/list/remove | (new) | ~300 | P2 |
| M6: Migrate | eco-sync shim + deprecation | eco-sync | ~200 | P3 |

**Total**: ~2800 LOC Rust

---

## 7. Task Breakdown


| Beads ID | Milestone | Priority |
|----------|-----------|----------|
| `zombo-sash-eco-9d7` | M1: Bootstrap — init, add, remove, sync, status | P1 |
| `zombo-sash-eco-bp5` | M2: Git Ops — pull, push, checkout, exec, fetch | P1 |
| `zombo-sash-eco-av6` | M3: Lock — lock, sync --locked, lock --diff | P1 |
| `zombo-sash-eco-uu7` | M4: Push Plan — push --plan/--apply, graph | P2 |
| `zombo-sash-eco-l9d` | M5: Worktree — worktree add/list/remove | P2 |
| `zombo-sash-eco-tqi` | M6: Migrate — eco-sync shim + deprecation | P3 |

Dependency order: M1 → M2 → M3 → M4 → M5 → M6 (sequential, each builds on prior)

---

## 8. Example Reference

**Existing pattern**: `bin/eco-sync` — the Python tool gm replaces. All command semantics derived from real usage patterns in eco-sync's `cmd_status()`, `cmd_sync()`, `cmd_delta()`.

**Existing pattern**: `reasoning-universe/craftegy-algo/crates/craftegy-graph/src/metrics.rs` — `topological_order()` is the same Kahn's algorithm gm M4 needs for push planning.

---

*Spec generated by /flow:specify — gm git workspace orchestrator.*
