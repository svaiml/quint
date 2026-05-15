# PRD: A/B Testing Harness — Claude Code Skill Stacks × SWE-Bench

**Status**: Spec-Light  
**Assessment ref**: docs-ot99 (score 13.7/30)  
**Research ref**: docs-u0iu  
**Date**: 2026-05-06

---

## 1. Executive Summary

### Problem

No empirical data exists on whether adversarial/multi-LLM skill stacks (claude-octopus + Superpowers) outperform role-governed/lifecycle stacks (GSD v1 + gstack + wshobson) on real software engineering tasks. Current guidance is anecdotal. Decisions about which stack to deploy for RSTMDB ingestion (docs-1nu) and octopus validation (docs-sqvf) are being made without evidence.

### Solution

A minimal Python harness that:
1. Runs both skill stacks against a 50-task corpus, scoring outputs with a blind Comparator agent (Phase 1)
2. Runs the Phase 1 winner against SWE-Bench Verified to produce an externally comparable result (Phase 2)

This is a Machine A vs Machine B comparison — stack-vs-stack, not human-vs-machine.

### Success Metrics

- Phase 1 produces a statistically significant winner (p < 0.05, Mann-Whitney U) or a clear no-difference result on at least 40 of 50 tasks
- Phase 2 produces a resolve-rate number on SWE-Bench Verified that can be compared to the published leaderboard
- The harness is reproducible: re-running from the same inputs produces scores within ±2 pts on rubric dimensions

### Assessment Score Reference

Total score 13.7/30 → Spec-Light band. Primary feasibility unknown: **headless skill activation** (see Section 4 and Section 7). Spike must complete before implementation.

---

## 2. User Stories

**As a researcher** evaluating Claude Code skill stacks, I want to run a repeatable A/B test so that stack selection for production use is evidence-based rather than impressionistic.

**As a developer** choosing between GSD and claude-octopus for a new project, I want benchmark results on tasks matching my specialization (backend/security/architecture) so that I can pick the stack with the best track record on tasks like mine.

**As a project maintainer** deciding whether to invest in claude-octopus multi-LLM setup costs, I want a security-adversarial sub-score showing whether the multi-LLM adversarial approach actually catches more seeded vulnerabilities.

---

## 3. DVF+V Risk Assessment

| Risk Dimension | Rating | Notes |
|---|---|---|
| **Desirability** | Low risk | User explicitly requested; downstream decisions (docs-1nu, docs-sqvf) are waiting |
| **Viability** | Low risk | Internal research tool; no ROI uncertainty |
| **Feasibility** | HIGH RISK | Headless skill activation in automated Claude Code sessions is **unproven**. Superpowers activates behaviorally based on conversation context; GSD writes `.planning/` state. Neither is documented for non-interactive use. This is the primary blocker. |
| **Value** | Low risk | Clear purpose; findings feed concrete downstream decisions |

**Feasibility details**: Three known approaches to explore in the spike (docs-iepc):
1. `claude code --non-interactive` with skill CLAUDE.md pre-loaded into system prompt
2. Pi SDK programmatic session control (the mechanism GSD v2 uses)
3. MCP tool injection to simulate skill activation without interactive session

If none of the three approaches works, the harness design must pivot to a different invocation model. Do not begin implementation until the spike resolves this.

**Secondary feasibility risk**: SWE-bench sandbox setup has known environment complexity (Docker, per-repo test harnesses). Scoped to Phase 2; blocked until Phase 1 validates the approach.

---

## 4. Functional Requirements

### 4.1 Stack Definitions

Stack configuration lives in `skill_stacks/stack_a.yml` and `skill_stacks/stack_b.yml`.

Required fields per stack definition:

```yaml
name: stack_a
label: "Multi-LLM Adversarial"
model: claude-sonnet-4-5   # pinned model version
skills:
  - name: claude-octopus
    install_cmd: "claude code plugin install ..."
    invoke_skill: "/octo:factory"
  - name: superpowers
    install_cmd: "..."
    invoke_skill: "test-driven-development"
activation_mode: headless   # result of spike: non-interactive | pi-sdk | mcp-injection
```

**Stack A** (adversarial/multi-LLM): claude-octopus (`/octo:debate`, `/octo:security`, `/octo:factory`) + Superpowers (TDD enforcement, systematic-debugging, requesting-code-review)

**Stack B** (role-governed/lifecycle): GSD v1 (`/gsd-execute-phase`, `/gsd-plan-phase`, `/gsd-verify-work`) + gstack (`/autoplan`, `/plan-eng-review`, `/cso`) + wshobson (`/tools:api-scaffold`, `/tools:security-scan`, `/tools:tdd-red/green/refactor`)

### 4.2 Task Corpus Format

Tasks live in `task_corpus/` organized by specialization. YAML schema:

```yaml
id: task-0042
tier: 2
specialization: backend
title: "Add webhook delivery with retry and DLQ"
description: |
  ...full task description...
acceptance_tests:
  - "POST /webhooks/{id}/retry returns 200 for failed delivery"
  - "DLQ entry created after 3 consecutive failures"
  - "Idempotency key prevents duplicate delivery"
seeded_vulnerability: null   # or: "sql_injection | hardcoded_secret | ssrf"
session_split: false         # true for Tier 3 cross-session tasks
session_1_context_file: null # path to session 1 output for Tier 3 tasks
```

**Corpus composition (50 tasks)**:
- Tier 1 — Simple atomic (20 tasks): single-file, well-scoped; split across backend/security/architecture
- Tier 2 — Multi-file feature (15 tasks): cross-concern, 3-5 files, requires coherent plan
- Tier 3 — Cross-session (10 tasks): session 2 starts with session 1 output as context artifact
- Security adversarial (5 tasks): spec contains seeded vulnerabilities; scored on detection, not just fix rate

### 4.3 Harness Runner

`harness.py` — entry point for a single run:

```
harness.py --stack stack_a.yml --task task-0042.yml --output results/run_001.json
```

Execution sequence per task:
1. Install skill stack (or verify already installed)
2. Build system prompt: task description + skill CLAUDE.md contents + activation instructions
3. Invoke model (Claude API or Gemini API) with pinned version
4. Capture: response text, token count (input + output), wall-clock duration
5. Write JSON output

Output schema per run:
```json
{
  "run_id": "run_001",
  "task_id": "task-0042",
  "stack_id": "stack_a",
  "model": "claude-sonnet-4-5",
  "model_version_pinned": true,
  "response_text": "...",
  "token_count_input": 4200,
  "token_count_output": 1800,
  "duration_ms": 12400,
  "timestamp_utc": "2026-05-06T14:22:00Z"
}
```

### 4.4 Comparator Evaluator

`evaluator.py` — takes two run outputs for the same task and scores them blind.

Scoring split:
- **Functional correctness (40 pts)**: run the `acceptance_tests` from the task YAML against the generated code. Binary per test, sum normalized to 40. Not rubric-scored.
- **Comparator rubric (60 pts)**: separate Claude instance receives task description + both outputs with stack labels stripped ("Output 1" / "Output 2") + the rubric below.

Rubric dimensions:
| Dimension | Points | What the Comparator checks |
|---|---|---|
| Spec adherence | 20 | All acceptance criteria addressed; no scope creep |
| Code quality | 15 | Naming, structure, no obvious dead code |
| Edge case handling | 15 | Boundary conditions, error paths, empty inputs |
| Security soundness | 10 | No injection vectors, no hardcoded secrets, correct auth patterns |

For Tier 3 cross-session tasks: a separate **Consistency Judge** pass checks whether session 2 output contradicts session 1 architectural decisions (binary pass/fail, recorded separately from quality score).

Statistical test: Mann-Whitney U (non-parametric) on per-task total scores across the corpus. Report: U-statistic, p-value, effect size (rank-biserial r).

Output schema per evaluation:
```json
{
  "task_id": "task-0042",
  "stack_a_functional": 32,
  "stack_b_functional": 36,
  "stack_a_rubric": {"spec": 17, "quality": 12, "edges": 11, "security": 8, "total": 48},
  "stack_b_rubric": {"spec": 18, "quality": 13, "edges": 13, "security": 9, "total": 53},
  "comparator_run_id": "cmp_001",
  "consistency_pass": null
}
```

### 4.5 SWE-Bench Adapter

`swebench_adapter.py` — maps SWE-Bench Verified issues to harness task format and runs them through the winning stack.

- Use `SWE-bench/SWE-bench` repo as the execution environment (Docker-based per-repo sandboxes)
- Map: GitHub issue text → `description` field; existing test suite → `acceptance_tests`
- Metric reported: **resolve rate** (fraction of instances where all acceptance tests pass after stack output applied as a patch)
- Compare to SWE-Bench Verified leaderboard published baselines
- Gate: Phase 2 only runs after Phase 1 identifies a winner (or after 40+ tasks scored and a clear leader exists)

---

## 5. Non-Functional Requirements

### Reproducibility
- Pin model versions in stack YAML; do not use `latest` aliases
- Log full API request/response metadata including model version returned by API
- Results directory: one JSON file per run, never overwritten (append `_v2` if rerun)
- Corpus YAML files are immutable after the corpus build task completes; tracked in git

### Performance
- Phase 1 (50 tasks × 2 stacks = 100 runs): target completion within 4 hours wall-clock at standard API throughput
- Parallelize runs where tasks are independent (Tier 1 and Tier 2 are embarrassingly parallel; Tier 3 must be sequential within a task)
- SWE-bench Phase 2: expect 8-12 hours for a subset of 50 instances; plan for overnight run

### Python Environment
- Use `uv` workspaces; never isolated `.venv` or bare `pip install`
- All dependencies declared in `pyproject.toml`; lockfile committed

### API Key Management
- Keys loaded from environment variables only: `ANTHROPIC_API_KEY`, `GOOGLE_GEMINI_API_KEY`
- Never hardcoded; never logged; `.env` in `.gitignore`

---

## 6. Task Breakdown

Tasks created in br. Dependencies are set (see dependency graph at end of section).

| br ID | Title | Priority | Blocks |
|---|---|---|---|
| **docs-iepc** | Spike: headless Claude Code skill activation (Superpowers, GSD, gstack in non-interactive session) | P1 | docs-imks, docs-h53t |
| **docs-imks** | Build: A/B test task corpus (50 tasks, 3 tiers, 3 specializations) | P2 | docs-hz3g |
| **docs-h53t** | Implement: harness runner (install stack, run task, collect output) | P2 | docs-xvq0 |
| **docs-xvq0** | Implement: Comparator evaluator (blind scoring, functional correctness) | P2 | docs-hz3g |
| **docs-hz3g** | Implement: SWE-Bench Verified adapter (hold-out phase 2) | P3 | — |

**Dependency graph**:
```
docs-iepc (spike)
  ├── docs-imks (corpus)   ─────────────────────┐
  └── docs-h53t (harness)                        │
        └── docs-xvq0 (evaluator) ───────────────┤
                                                  └── docs-hz3g (swebench adapter)
```

The spike (docs-iepc) is the critical path. Nothing else starts until the headless activation question is resolved.

---

## 7. Discovery and Validation Plan

### Phase 0: Spike (docs-iepc) — 1 day, blocks everything

Deliverable: a working proof-of-concept that activates at least one skill (Superpowers `test-driven-development` or GSD `/gsd-execute-phase`) in a non-interactive Claude Code session.

Approach order:
1. `claude code --non-interactive` with CLAUDE.md containing skill content prepended as system context
2. Pi SDK (TypeScript; same mechanism GSD v2 uses internally) — programmatic session
3. MCP tool injection — mount skill behaviors as MCP tools accessible to the agent

Spike exit criterion: one approach produces verifiably different output on a test task (e.g., TDD-enforced output with failing-test-first structure vs. unconstrained output).

If none works: spike output must include a concrete alternative design (e.g., reduce scope to model-only comparison without skill stacks, or reframe as prompt-injection comparison).

### Phase 1: Internal Validation — 2-3 days after spike

1. Build corpus (docs-imks): 50 tasks authored to spec, reviewed for unambiguity
2. Build harness (docs-h53t): run one sample task end-to-end before building all 50
3. Build evaluator (docs-xvq0): validate Comparator rubric consistency on 5 pilot tasks before full run
4. Full run: 100 total runs; collect scores; run Mann-Whitney U

### Phase 2: SWE-Bench Hold-Out — 2-3 days after Phase 1 winner identified

Gate: Phase 1 must produce a clear winner (p < 0.05 or effect size r > 0.3). If no winner, Phase 2 is skipped or deferred.

---

## 8. Acceptance Criteria

The harness is done when:

1. `harness.py` runs a single task end-to-end (install stack → invoke model → write JSON output) without manual intervention
2. `evaluator.py` produces blind Comparator scores for a pair of outputs; functional tests run against generated code mechanically
3. The 50-task corpus covers all tiers and specializations as specified; each task has at least 3 acceptance tests
4. A full Phase 1 run completes for both stacks; results JSON is committed to `results/phase1/`
5. Statistical analysis (Mann-Whitney U) is included in the results report
6. For Phase 2: `swebench_adapter.py` runs at least 25 SWE-Bench Verified instances and reports a resolve rate that can be compared to a published leaderboard entry

**Out of scope**: web UI, persistent results database, CI integration, multi-turn interactive debugging of task outputs.

---

## 9. Dependencies

### External Tools and Repos

| Dependency | Used for | Install mechanism | Known risk |
|---|---|---|---|
| `obra/superpowers` | Stack A skill | Claude Code plugin install | Headless activation unproven — spike target |
| `nyldn/claude-octopus` | Stack A skill | Claude Code plugin install | Multi-LLM requires Gemini API key; single-provider degrades |
| `gsd-build/get-shit-done` | Stack B skill | `npx gsd@latest install` | `.planning/` state write behavior in headless session unclear |
| `garrytan/gstack` | Stack B skill | `git clone + ./setup` | Role-based commands need explicit invocation; slash-command routing unclear headless |
| `wshobson/commands` | Stack B skill | `cd ~/.claude && git clone` | Explicit invocation only; lowest activation risk |
| `SWE-bench/SWE-bench` | Phase 2 benchmark | Python package + Docker | Docker per-repo sandboxes add setup complexity; scoped to Phase 2 |

### API Keys Required

- `ANTHROPIC_API_KEY` — Claude API (both stacks; Comparator evaluator)
- `GOOGLE_GEMINI_API_KEY` — Gemini API (Stack A multi-LLM; optional if focusing on Claude-only comparison first)

### Internal Dependencies

- docs-ot99 (assessment) — context source, closed
- docs-u0iu (skill inventory research) — context source, closed
- docs-1nu (RSTMDB ingestion pipeline) — downstream consumer of Phase 1 results
- docs-sqvf (claude-octopus install spike) — downstream; Phase 1 security sub-scores inform this

---

## 10. Success Metrics

### Minimum bar (framework is working)

- Phase 1 completes with ≥ 40 tasks scored for both stacks
- Functional correctness measurement is mechanically reproducible (same output scores same every time)
- Comparator rubric variance: same output scored twice by Comparator diverges by ≤ 3 pts on total (100 pt scale)

### Research value (framework produces publishable insight)

- Phase 1 reveals a statistically significant quality difference (p < 0.05) between stacks on at least one specialization (backend / security / architecture)
- Security adversarial sub-corpus (5 tasks): Stack A seeded-vulnerability detection rate is measurable and differs from Stack B by ≥ 20 percentage points (directional hypothesis: adversarial stack wins here)
- Cross-session Tier 3 tasks: Stack B consistency rate is measurable (directional hypothesis: GSD `.planning/` artifacts improve session 2 coherence)

### Phase 2 bar (externally comparable result)

- Resolve rate on SWE-Bench Verified ≥ 30 instances is reported with sufficient metadata to appear credibly on the leaderboard
- Result is better than a no-skill-stack baseline (Claude API direct, no CLAUDE.md skill context) on the same instances

---

*Generated from assessment docs-ot99, research docs-u0iu. br tasks: docs-iepc, docs-imks, docs-h53t, docs-xvq0, docs-hz3g*
