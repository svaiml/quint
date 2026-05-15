---
description: Session-start triage using bv (beads-viewer) to surface priorities, blockers, alerts, and generate an actionable work plan.
loop: outer
# Loop Classification: OUTER LOOP
# Triage is a planning activity that precedes implementation.
---

## User Input

```text
$ARGUMENTS
```

If arguments provided, use as filter (e.g., label, assignee, issue ID for deep dive).

## Execution Instructions

Run at the start of every work session before picking up tasks.

### Step 1: Session Brief

```bash
# Single command — runs all bv+br queries in parallel and renders a Rich summary
flowspec triage --session
```

### Step 2: Optional — Deep Dive

If `$ARGUMENTS` contains an issue ID:

```bash
bv --robot-blocker-chain "$ARGUMENTS" --format json 2>/dev/null
bv --robot-forecast "$ARGUMENTS" --format json 2>/dev/null
bv --robot-related "$ARGUMENTS" --format json 2>/dev/null
```

### Step 3: Optional — Filters

```bash
flowspec triage --next                        # single top pick only
flowspec triage --by-label adr                # scoped to label
flowspec triage --by-assignee @me             # personal queue
flowspec triage --spec-gaps                   # include spec gap analysis
```


## Post-Triage: Claim Work

```bash
# Claim top task atomically
br update <id> --claim
```
