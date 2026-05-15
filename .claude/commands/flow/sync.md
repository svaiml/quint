---
description: Sync tasks and ADRs between beads and the ecosystem ADR index
---

# Sync ADRs

Synchronizes Architecture Decision Records across all nested repositories into beads issues.

## Execution

```bash
# Import ADRs from all nested repos into beads (idempotent)
flowspec sync adrs
```

## ADR Sync Options

```bash
flowspec sync adrs --dry-run             # Preview without writing
flowspec sync adrs --repo pctl-rs        # One repo only
flowspec sync adrs --workspace /path/to/root  # Explicit workspace root
flowspec sync adrs --update-existing     # Update descriptions and external refs
```


## What `sync adrs` does

- Scans all `docs/adr/` directories across nested repos
- Creates a beads issue per ADR (title, status, decision summary)
- Labels: `adr`, `{repo-name}`, `{status}` — priority from status
- Deduplicates via `external-ref adr:{repo}/{file}` — safe to re-run
- Wires same-repo ADR cross-references as `br dep add` dependency links
