# FlowSpec Agent Instructions

This project uses **FlowSpec** for Spec-Driven Development (SDD).

## Skills System

Codex loads skills from `.agents/skills/`. Use `/skills` to browse available skills or
invoke them inline using `$<skill-name>` syntax. Codex may also trigger skills implicitly
when a task description matches a skill's description.

| Command | Skill Name | Purpose |
|---------|-----------|---------|
| `$flow-assess` | `flow-assess` | Evaluate feature complexity and SDD fit |
| `$flow-specify` | `flow-specify` | Create PRD / feature spec |
| `$flow-plan` | `flow-plan` | Architecture and platform planning |
| `$flow-implement` | `flow-implement` | Guided implementation with agents |
| `$flow-validate` | `flow-validate` | QA, security, docs validation |
| `$flow-gate` | `flow-gate` | Quality gate before implementation |
| `$flow-triage` | `flow-triage` | Session-start project triage via bv |
| `$flow-intake` | `flow-intake` | Process INITIAL feature docs |
| `$flow-research` | `flow-research` | Business validation and research (workflow stage) |
| `$flow-spike` | `flow-spike` | Scientific investigation — papers, formal methods (tool, anytime) |
| `$flow-brainstorm` | `flow-brainstorm` | Divergent ideation — VS-powered candidates (tool, anytime) |
| `$flow-init` | `flow-init` | Initialize SDD constitution |
| `$flow-reset` | `flow-reset` | Reset workflow configuration |
| `$flow-generate-prp` | `flow-generate-prp` | Generate PRP context bundle |
| `$flow-map-codebase` | `flow-map-codebase` | Map codebase for context |
| `$flow-security_workflow` | `flow-security_workflow` | Security scanning workflow |
| `$flow-sync` | `flow-sync` | Sync beads tasks |
| `$flow-board` | `flow-board` | Project board — epic summary table + top tasks |
| `$vibe-vibe` | `vibe-vibe` | Casual mode — just code it |

## How to Execute a Skill

Three ways to invoke a skill:

1. **Browse**: Type `/skills` to open the skills menu and select interactively.
2. **Inline explicit**: Type `$flow-gate docs/prd/my-feature-spec.md --threshold 95`
   in the chat — Codex invokes the `flow-gate` skill with those arguments.
3. **Implicit**: Codex may automatically trigger a skill when your task description
   matches the skill's description (e.g., asking to "assess" a feature triggers
   `flow-assess`).

## SDD Workflow Order

```
WORKFLOW STAGES (sequential, gated):
  $flow-assess → $flow-specify → [$flow-research] → $flow-plan → $flow-implement → $flow-validate
                                   ↑ optional

TOOLS (run anytime, no gate, no state transition):
  $flow-brainstorm  — whenever you need ideas (VS-powered divergent ideation)
  $flow-spike       — whenever you need to read a paper (scientific investigation)
```

### Which research tool?

```
Gating a feature decision? → $flow-research (heavy, multi-agent, advances state)
Need to understand a paper/science? → $flow-spike (single-agent, sci-focused)
Need ideas, not facts? → $flow-brainstorm (k candidates, inline, no sources)
```

Run `$flow-gate` before implementation to validate spec quality.
Run `$flow-triage` at session start for project context.

## Task Tracking — Beads-rust

| System | CLI | When to use |
|--------|-----|-------------|
| Beads-rust | `br ...` | All issue and task tracking |

```bash
br list                                        # list all open issues
br update <id> --status in_progress            # valid statuses: open/in_progress/blocked/deferred/closed
br close <id>                                  # close a completed issue
```

## Project Intelligence (bv)

`bv` is the graph analytics engine. It computes **PageRank, betweenness centrality, HITS,
eigenvector centrality, critical path, k-core, and articulation points** over the dependency
graph — use its scores, not manual priority labels, for decisions.

```bash
bv --robot-triage                # Full scored triage (impact_score, blocked_by, unblocks)
bv --robot-priority              # Per-task: current vs suggested priority + direction (▲▼)
bv --robot-next                  # Single top recommendation for next task
bv --robot-alerts                # Blockers and risks
bv --robot-insights              # High-level project health
bv --robot-search "query"        # Semantic task search
bv --robot-impact <id>           # what-if cascade analysis for one task
```

All `--robot-*` flags output JSON and work **without a TTY** (safe in scripts/agents).

### Board and triage scripts (always use `uv run python`)

```bash
# 3-section board: Epics → Per-epic tasks → Top 10 cross-project
uv run python .flowspec/scripts/board.py [top_n_per_epic] [top_n_standalone]

# Adaptive epic triage — matches unassigned tasks to epics via graph neighborhood
# (65% graph-neighborhood + 35% text-recall; reads epics dynamically from br)
uv run python .flowspec/scripts/epic_triage.py              # dry-run, show proposals + scores
uv run python .flowspec/scripts/epic_triage.py --auto       # wire confident matches
uv run python .flowspec/scripts/epic_triage.py --verbose    # show ambiguous + no-match

# Never use python3 directly — always uv run python
```

### Reading bv output

Key fields from `bv --robot-priority`:
- `impact_score` — composite graph score (PageRank + betweenness + blocker_ratio + staleness + urgency + risk)
- `suggested_priority` / `direction` — bv's recommended priority change (`increase`/`decrease`/`none`)
- `confidence` — how certain bv is (0–1); trust `> 0.7`
- `what_if.direct_unblocks` — how many tasks complete if this one does

```bash
# Useful jq queries
bv --robot-triage | jq '.triage.quick_ref.top_picks[:3]'
bv --robot-priority | jq '.recommendations[] | select(.confidence > 0.7) | {id:.issue_id, score:.impact_score, dir:.direction}'
bv --robot-triage | jq '.triage.blockers_to_clear | map(.id)'
```
