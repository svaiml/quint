# ZomboCraftEco

**Meta scaffold for the zombo-sash-eco ecosystem.**

One repo to clone them all. Contains the tooling, scripts, and index files needed to bootstrap the full 42-repo ecosystem on any machine.

## Prerequisites

- **Git** with SSH keys configured for github.com
- **Python 3.10+** and [uv](https://docs.astral.sh/uv/) (for `eco-sync` and `flowspec`)
- **Rust/Cargo** (for `br`, `bvr`, `ghdash`)
- **Windows**: Run all shell scripts via **Git Bash** (included with [Git for Windows](https://gitforwindows.org/))

## Quick Start

```bash
git clone git@github.com:svaiml/ZomboCraftEco.git
cd ZomboCraftEco
./bin/clone-ecosystem.sh ~/zombo-sash-eco
```

This creates the full directory structure and clones all 42 repos.

### Windows (Git Bash)

```bash
git clone git@github.com:svaiml/ZomboCraftEco.git
cd ZomboCraftEco
./bin/clone-ecosystem.sh "$USERPROFILE/zombo-sash-eco"
```

## What's Inside

```
ZomboCraftEco/
├── README.md               # This file
├── ECOSYSTEM.md            # Full repo index with descriptions, owners, languages
├── AGENTS.md               # Aggregated agent onboarding across all repos
├── bin/
│   ├── clone-ecosystem.sh  # Clone all 42 repos into proper structure
│   ├── eco-sync            # Fetch/pull/delta/report across all repos
│   └── setup-tools.sh      # Install br, bv, flowspec, ghdash, zacta
├── docs/
│   ├── architecture.md     # Prometey Stack layer model
│   └── repo-map.md         # Visual dependency graph
└── tools/
    └── gita-groups.sh      # Register all repos with gita for bulk ops
```

## After Cloning

```bash
# Sync all repos
uv run python bin/eco-sync sync

# See what changed since last sync
uv run python bin/eco-sync delta

# Deep dive on one repo
uv run python bin/eco-sync report infer --latest 5

# Install tooling
./bin/setup-tools.sh

# Project board
flowspec board --top 3
```

## Repo Ownership

| Org | Role | Repos |
|-----|------|-------|
| `zombocoder` | Primary org — core reasoning/infra repos | infer, pctl-rs, zz-notation, ctop, bfc, ... |
| `svaiml` | Personal — forks, private repos, tools | flowspec, fpf-cards, criterium, craftegy-* |
| `sashml` | Secondary — o2l, flowspec upstream | o2l, flowspec |
| `rstmdb` | RSTMDB org | rstmdb, rstmdb-studio |
| External | Read-only references | quint, haft, FPF, codegraph-rust, beads_rust, ... |

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Linux (Ubuntu 22.04+) | Full | Native shell scripts |
| macOS 14+ | Full | Native shell scripts |
| Windows 10/11 | Supported | Requires Git Bash; `eco-sync` runs cross-platform via Python |
| FreeBSD 14 | Supported | See ADR-005 |

### Windows Notes

- All `.sh` scripts require **Git Bash** (ships with Git for Windows)
- `eco-sync` (Python) works natively on Windows — no Git Bash needed for `uv run python bin/eco-sync`
- `cargo install` and `uv tool install` work natively on Windows
- Install paths default to `%LOCALAPPDATA%\Programs\bin` on Windows (vs `~/.local/bin` on Unix)

## License

Private repository. Not for distribution.
