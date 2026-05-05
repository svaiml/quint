# ADR-008: External Repository Convention (`_external/`)

## Status

Accepted

## Context

The ecosystem contains 45+ repos across 5 GitHub orgs. Some are ours (zombocoder, svaiml,
sashml, rstmdb, AITechCraft), some are external forks or references (ailev/FPF,
Dicklesworthstone/beads_rust, stanfordnlp/dspy, etc.). Without a convention, it's impossible
to tell at a glance which repos we own, maintain, and are responsible for — versus which are
read-only references we track for inspiration or interop.

## Decision

**All repos we don't own live under `_external/` within their category folder.**

### Rules

1. **Our orgs**: `zombocoder`, `svaiml`, `sashml`, `rstmdb`, `AITechCraft`
   - Repos from these orgs sit at the **category root**
   - Example: `tools/orchestrator/flowspec` (sashml — ours)

2. **External repos**: any other GitHub org
   - Must sit under `_external/` within the category
   - Example: `tools/orchestrator/_external/beads_rust` (Dicklesworthstone — not ours)

3. **The `_` prefix** is intentional:
   - Sorts last in directory listings (after our repos)
   - Visually distinct: `_external/` stands out in `ls` and tree views
   - Convention borrowed from Python (`_private`) and Node (`_internal`)

4. **No mixing**: our repos and external repos never sit side-by-side at the same directory level

### Directory structure pattern

```
category/
├── our-repo-a        ← zombocoder/svaiml/sashml/rstmdb/AITechCraft
├── our-repo-b
└── _external/
    ├── their-repo-x  ← read-only reference, fork, or dependency
    └── their-repo-y
```

### What counts as "external"

| Classification | Example | Location |
|---|---|---|
| Fork of someone else's repo | `AITechCraft/nanoGPT` (fork of karpathy) | `_external/nanoGPT` |
| Reference project we study | `ag2ai/ag2` (AgentOS) | `prodx/_external/AgentOS` |
| Tool we use but don't maintain | `Dicklesworthstone/beads_rust` | `tools/orchestrator/_external/beads_rust` |
| Our fork on our org | `sashml/codegraph-rust` (fork of Jakedismo) | `tools/ai-tools/codegraph-rust` ← category root (it's our fork) |

### Edge case: our fork of someone else's repo

If we forked a repo to our org (e.g., `sashml/codegraph-rust` forked from `Jakedismo`),
it sits at the **category root** — not under `_external/`. The fork is ours to maintain.
The upstream remote is tracked via `git remote add upstream`.

## Consequences

### Positive
- Ownership is visible at a glance from directory listing
- `find . -path '*/_external/*'` instantly lists all external deps
- No confusion about which repos we maintain vs. reference
- Clone scripts can skip `_external/` for lightweight setups

### Negative
- Submodule paths change (one-time migration cost — done)
- External repos have longer paths (`tools/ai-tools/_external/FPF` vs `tools/ai-tools/FPF`)

### Neutral
- `_external/` directories are not `.gitignore`d — they're tracked as submodules
- External repos can be promoted to "ours" by forking to our org and moving out of `_external/`

## References

- ECOSYSTEM.md — Prometey Stack layer model
- AGENTS.md — ecosystem directory map with ownership annotations

---

*Michael Nygard format.*
