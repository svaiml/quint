# Sync Tasks + ADRs

Sync tasks and Architecture Decision Records into beads.

```bash
# Tasks: beads issue sync
flowspec sync adrs

# ADRs: all nested repos → beads (idempotent, with dep links)
flowspec sync adrs
```
