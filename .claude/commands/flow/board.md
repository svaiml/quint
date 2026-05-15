---
description: Project board — bv-powered 3-section view (Epics → Per-epic tasks → Top 10 cross-project)
---

# Project Board

Live project board powered by **bv graph analytics** (PageRank, Betweenness, HITS,
eigenvector, critical path). Shows three sections for a top-to-bottom strategic view.

## Execution

```bash
# Full board — default 2 tasks per epic
uv run python .flowspec/scripts/board.py

# More tasks per epic
uv run python .flowspec/scripts/board.py 3

# More tasks per epic + more standalone
uv run python .flowspec/scripts/board.py 3 12
```

**Always use `uv run python`, never `python3`.**

## What It Shows

### Section 1 — EPICS (strategic overview)
Sorted by bv `impact_score` descending.

| Column | Meaning |
|--------|---------|
| `Cur` | Current manual priority (P1–P4) |
| `Sug` | bv suggested priority based on graph metrics |
| `Δ` | `▲` raise · `▼` lower · `·` keep |
| `Impact` | bv composite score: PageRank + Betweenness + HITS + staleness + urgency + risk |
| `Children` | done/total child tasks |

### Section 2 — TOP TASKS PER EPIC (tactical)
Each epic shows its top N open tasks sorted by `impact_score`.
Includes bv's action hint (e.g. "Work on X first to unblock this").
`⚠ no child tasks` means the epic needs breakdown.

### Section 3 — TOP 10 TASKS ACROSS ALL PROJECTS (cross-project priority)
Unified ranking by `impact_score` regardless of epic.
Shows `PRank` (PageRank) and `Btwn` (Betweenness) columns so you can see
WHY a task ranks where it does.

## Epic Triage (assigning orphan tasks to epics)

```bash
uv run python .flowspec/scripts/epic_triage.py              # dry-run, show proposals + scores
uv run python .flowspec/scripts/epic_triage.py --auto       # wire confident single-match tasks
uv run python .flowspec/scripts/epic_triage.py --verbose    # also show ambiguous + no-match
uv run python .flowspec/scripts/epic_triage.py --threshold 0.05  # tune confidence cutoff
```

The triage uses **graph-neighborhood + text-recall scoring** — reads epics
dynamically from `br`, builds the dependency graph via `br graph --all --json`,
and scores tasks by shared graph neighbors + term overlap against epic descriptions.
No hardcoded keyword lists; works with new epics automatically.

## Direct bv queries for deeper analysis

```bash
# Top 3 picks for immediate work
bv --robot-triage | jq '.triage.quick_ref.top_picks[:3]'

# High-confidence priority changes
bv --robot-priority | jq '.recommendations[] | select(.confidence > 0.7) | {id:.issue_id, score:.impact_score, dir:.direction}'

# Blockers with highest downstream impact
bv --robot-triage | jq '.triage.blockers_to_clear | map({id,unblocks:.unblocks_count})'

# What-if cascade for a specific task
bv --robot-priority | jq '.recommendations[] | select(.issue_id == "PROJECT-ID") | .what_if'
```

## Reading the Priority Signal

| bv `direction` | Meaning | Action |
|----------------|---------|--------|
| `increase` + high confidence | Task is more important than its label says | Raise priority with `br update <id> --priority <n>` |
| `decrease` + high confidence | Task is blocking nothing, stale | Consider deferring or lowering |
| `none` | bv agrees with current priority | No change needed |
