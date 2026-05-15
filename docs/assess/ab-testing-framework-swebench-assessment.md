# Feature Assessment: A/B Testing Framework — Claude Code Skills × Model Routing (SWE-Bench)

**Date**: 2026-05-06
**Assessed By**: Claude AI Agent
**Status**: Assessed
**br task**: docs-ot99

## Feature Overview

Build a minimal framework to A/B test combinations of Claude Code skill stacks (GSD, gstack, Superpowers, claude-octopus, wshobson — skills 1…N) against multiple model backends (Claude, Gemini). Validation proceeds in two phases:

1. **Internal validation**: run skill stack × model combinations on a held-in task corpus, score outputs with a Comparator agent (blind rubric, functional correctness via test suite)
2. **Hold-out benchmark**: run the winning stacks on SWE-Bench Verified to produce a publishable result

Machine A vs Machine B framing (per docs-u0iu research): the comparison is stack-vs-stack, not human-vs-machine.

---

## Scoring Analysis

### Complexity Score: 6.3/10

| Dimension | Score | Rationale |
|---|---|---|
| Effort Days | 6/10 | Minimal harness is ~3-5 days (task runner + skill loader + scorer). SWE-bench integration adds another 2-3 days. Total ~5-7 days. |
| Component Count | 6/10 | 4-5 components: task runner, skill installer/activator, model router (Claude API + Gemini API), Comparator evaluator, SWE-bench adapter |
| Integration Points | 7/10 | Claude API, Gemini API, SWE-bench dataset + sandbox, 4-5 skill packs (GSD/gstack/Superpowers/claude-octopus/wshobson) each with different install mechanisms |
| **Average** | **6.3/10** | |

### Risk Score: 1.7/10

| Dimension | Score | Rationale |
|---|---|---|
| Security Implications | 2/10 | API keys for 2 providers; no user data; no production system affected |
| Compliance Requirements | 1/10 | No compliance requirements — internal research tool |
| Data Sensitivity | 2/10 | Public benchmark data (SWE-bench is open), API call logs are internal |
| **Average** | **1.7/10** | |

### Architecture Impact Score: 3.7/10

| Dimension | Score | Rationale |
|---|---|---|
| New Patterns | 7/10 | LLM skill evaluation harness with blind Comparator scoring is a new pattern for this project; establishes the A/B test methodology documented in docs-u0iu |
| Breaking Changes | 1/10 | Standalone new framework; no changes to existing code |
| Dependencies Affected | 3/10 | Findings will inform: docs-1nu (RSTMDB ingestion pipeline skill choice), docs-sqvf (claude-octopus install spike), future agent routing decisions |
| **Average** | **3.7/10** | |

---

## DVF+V Bonus

| Risk | Present? | Score |
|---|---|---|
| **Value Risk**: unclear if users want this? | No — user explicitly requested it | 0 |
| **Usability Risk**: complex or novel UX? | No UX — it's a CLI/script evaluation tool | 0 |
| **Feasibility Risk**: unknown technical unknowns? | Yes — skill activation in headless/automated Claude Code context is not well-documented; SWE-bench sandbox setup has known complexity | +2 |
| **Viability Risk**: uncertain ROI? | No — research tool with clear goal | 0 |

**DVF+V Bonus: +2**

---

## Overall Assessment

**Total Score**: 6.3 + 1.7 + 3.7 + 2 (DVF+V) = **13.7 / 30**
**Recommendation**: **Spec-Light**
**Confidence**: High

### Rationale

Total score 13.7 puts this in the Spec-Light band (10–18). No individual averaged dimension exceeds 7.0. The feature is:

- **Moderately complex** (integration with 2 LLM APIs + 4-5 skill packs with different install mechanisms) but not architecturally novel at the system level
- **Low risk** (public data, no compliance, no production system impact)
- **Architecturally new within this project** (evaluation harness pattern doesn't exist here yet) but self-contained — won't break anything

The Feasibility Risk (+2 DVF+V bonus) is the live concern: **skill activation in automated / headless Claude Code context is unproven**. The primary unknown is whether skills like Superpowers (which activate based on conversation context) or GSD (which writes `.planning/` state) behave correctly when invoked programmatically rather than interactively. This should be spiked before building the full harness.

### Key Factors

- **Complexity**: Integration breadth (5+ skill packs × 2 model APIs × SWE-bench) is the main effort driver, not algorithmic difficulty
- **Risk**: Negligible — public data, isolated tool, no production exposure
- **Impact**: Self-contained new capability; findings feed docs-1nu (RSTMDB ingestion) and docs-sqvf (octopus validation)

---

## Recommended Architecture (Spec-Light)

```
┌─────────────────────────────────────────────────────────────┐
│                  MINIMAL HARNESS                             │
│                                                              │
│  task_corpus/          ← YAML task definitions              │
│    ├── backend/        ← 20 tasks per specialization        │
│    ├── security/                                            │
│    └── architecture/                                        │
│                                                              │
│  skill_stacks/         ← Stack definitions                  │
│    ├── stack_a.yml     ← claude-octopus + Superpowers       │
│    └── stack_b.yml     ← GSD v1 + gstack + wshobson        │
│                                                              │
│  harness.py            ← Runner: installs stack, runs task  │
│  evaluator.py          ← Comparator agent (blind scoring)   │
│  swebench_adapter.py   ← SWE-bench hold-out integration     │
│  results/              ← JSON output + score tables         │
└─────────────────────────────────────────────────────────────┘
```

**Phase 1 — Internal validation** (build first):
- Define 50 tasks across 3 tiers (simple/multi-file/security-adversarial)
- Run Stack A vs Stack B on each task
- Comparator agent scores outputs blind (functional correctness + spec adherence)
- Statistical test: Mann-Whitney U on quality scores

**Phase 2 — SWE-Bench hold-out** (only after Phase 1 confirms a winner):
- Run the winning stack on SWE-Bench Verified subset
- Compare to published baselines

---

## Pre-Implementation Spike Required

Before writing the full harness, resolve the primary feasibility unknown:

**Spike question**: Can Claude Code skills (Superpowers `test-driven-development`, GSD `/gsd-execute-phase`, gstack `/review`) be activated reliably in an automated / non-interactive session?

Options to explore:
1. Claude Code `--non-interactive` mode with skill CLAUDE.md pre-loaded
2. The Pi SDK approach (as used by GSD v2) — programmatic session control
3. MCP tool injection to simulate skill activation without interactive session

This spike should take 1 day and unblock the harness design entirely.

---

## Next Steps

### Spec-Light Path

```bash
# 1. Create lightweight spec
# File: docs/prd/ab-testing-harness-spec.md
# Include: task corpus format, stack definition format,
#          scoring rubric, SWE-bench integration interface

# 2. Run feasibility spike first
br create --title="Spike: headless skill activation in Claude Code automated session" \
  -l "spike,research-followup" \
  --priority=2 \
  -d "Validate that Claude Code skills (Superpowers TDD, GSD phases, gstack roles) activate correctly in non-interactive/automated sessions. Try --non-interactive mode, Pi SDK, MCP injection."

# 3. Then implement harness
```

### Override Options

```bash
# Upgrade to Full SDD if scope grows (e.g., add persistent result DB, web UI, CI integration)
/flow:assess ab-testing-harness-swebench --mode full

# Downgrade to Skip SDD if spike confirms headless activation is trivial
/flow:assess ab-testing-harness-swebench --mode skip
```

---

*Assessment generated by /flow:assess. br task: docs-ot99*
