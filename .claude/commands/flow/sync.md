---
description: Sync tasks and ADRs between backlog.md, beads, and the ecosystem ADR index
---

# Sync Tasks + ADRs

This command synchronizes the workspace across three dimensions:
1. **Tasks**: backlog.md ↔ beads issue tracker (bidirectional)
2. **ADRs**: All Architecture Decision Records across nested repos → beads tasks with dependencies
3. **Verification**: Confirm both systems are consistent

## Execution

```bash
# Step 1: Sync backlog tasks ↔ beads
flowspec sync tasks --direction bidirectional

# Step 2: Import ADRs from all nested repos into beads (idempotent — skips already-tracked)
flowspec sync adrs

# Step 3: Dry-run to preview any remaining drift
flowspec sync adrs --dry-run
```

## ADR Sync Options

```bash
# Preview without writing
flowspec sync adrs --dry-run

# Limit to one repo
flowspec sync adrs --repo pctl-rs

# Specify workspace root explicitly (e.g. from a nested repo)
flowspec sync adrs --workspace /path/to/workspace-root
```

## What `sync adrs` does

- Discovers every `*.md` file under any `docs/adr/`, `adrs/`, or `architecture-decision-records/` directory in nested repos
- Parses title, status (accepted/proposed/deprecated/superseded), decision summary, and context
- Creates a beads issue per ADR with labels `adr`, `{repo-name}`, `{status}`
- Sets priority from status: proposed=2, accepted=3, deprecated/superseded=4
- Deduplicates via `external-ref adr:{repo}/{filename}` — safe to re-run
- Wires same-repo ADR cross-references as `br dep add` dependency links

## Post-Sync

After sync, triage reflects the full task + ADR graph:

```bash
bv --robot-triage
bv --robot-plan
br stats
```
