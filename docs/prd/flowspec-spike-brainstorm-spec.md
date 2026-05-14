# PRD: flowspec Research Trichotomy — /flow:brainstorm + /flow:spike

**Date**: 2026-05-13
**Author**: @pm-planner
**Status**: Specified
**Assessment**: 7.0/30 — Skip SDD (direct implementation)
**Version Target**: 0.8.0

## 1. Executive Summary

### Problem Statement

flowspec provides `/flow:research` for heavy, multi-agent business+technical validation that advances workflow state (Specified -> Researched). But two common cognitive operations have no dedicated tool:

1. **Divergent ideation** — "Give me 7 options for X" — currently done ad-hoc in conversation, losing the VS (Verbalized Sampling) structure that produces 1.6-2.1x quality improvement (arxiv:2510.01171).
2. **Focused technical spike** — "Investigate paper X / evaluate tech Y" — currently uses the `.agents/researcher.md` agent directly, which is not discoverable in the `/flow:` namespace and lacks multi-agent template coverage.

### Proposed Solution

Add two new `/flow:` commands that complete a **research trichotomy**:

| Command | Cognitive Mode | Workflow State | Cost |
|---------|---------------|----------------|------|
| `/flow:research` (existing) | Convergent — deep dive into tech + map into workspace | Specified -> Researched | High (multi-agent) |
| **`/flow:brainstorm`** (new, P1) | **Divergent** — candidate expansion | None (tool) | Low (~30s) |
| **`/flow:spike`** (new, P2) | Convergent — more sci-focused (papers, formal methods) | None (tool) | Medium (single-agent) |

### Success Metrics

- **North Star**: Every ideation/research session uses the right tool (not `/flow:research` for naming tasks)
- **Adoption**: `/flow:brainstorm` invoked in >50% of sessions involving naming, design choices, or option generation within 30 days
- **Quality**: Users report brainstorm outputs are more creative/useful than freeform prompting (qualitative, training feedback)

### Business Value

- Immediate training demo value: "Stanford NLP proved it, here's the live demo"
- Reduced token waste: brainstorm ~30s vs. /flow:research ~10min for ideation tasks
- Complete cognitive toolkit: every problem-solving phase has a dedicated tool

## 2. User Stories and Use Cases

### Primary Persona: AI-Augmented Developer/Architect

Uses flowspec daily for feature planning, implementation, and research across the zombo-sash-eco ecosystem.

### User Stories

**US-1: Divergent Ideation**
> As a developer, I want to run `/flow:brainstorm "name for our new CLI tool"` and get 7 diverse candidates with rationales and quality scores, so I can pick the best name without over-researching.

**US-2: Saved Brainstorm**
> As a developer, I want to run `/flow:brainstorm "architecture approaches for event sourcing" --save` and have the candidates preserved in `docs/brainstorm/`, so I can reference them later in planning.

**US-3: Focused Technical Spike**
> As a developer, I want to run `/flow:spike "Dempster-Shafer belief intervals for epistemic reasoning"` and get a focused research doc in `docs/research/`, so I can inform my design without triggering full business validation.

**US-4: Decision Tree**
> As a developer, when I'm unsure which research tool to use, I want clear differentiation in AGENTS.md and `--help` output, so I pick the right one immediately.

### Edge Cases

- Empty arguments: prompt user for topic
- `--save` on brainstorm creates `docs/brainstorm/` if it doesn't exist
- `/flow:spike` on a topic that already has a `docs/research/<slug>.md`: ask whether to append or create new

## 3. DVF+V Risk Assessment

| Risk | Level | Rationale | Mitigation |
|------|-------|-----------|------------|
| **Value** | None | VS proven by Stanford NLP (arxiv:2510.01171). User teaches technique. | N/A |
| **Usability** | None | Follows existing /flow: command UX patterns | N/A |
| **Feasibility** | None | Template-only work, no CLI code changes | N/A |
| **Viability** | None | Zero cost beyond prompt engineering | N/A |

## 4. Functional Requirements

### FR-1: /flow:brainstorm Command

**Core Behavior:**
1. Accept topic/problem as `$ARGUMENTS`
2. Apply Verbalized Sampling prompt template:
   - Phase 1 (Superposition): Generate k candidates (default k=7) with diverse approaches
   - Phase 2 (Self-rating): Each candidate gets quality/probability score with rationale
   - Phase 3 (Collapse): Select best candidate with synthesis explanation
3. Output inline (ephemeral by default)
4. `--save` flag: write to `docs/brainstorm/<slug>-<date>.md`
5. `--k N` flag: override number of candidates (default 7)
6. No workflow state transition
7. No external I/O (WebSearch/WebFetch) — uses latent knowledge only
8. No beads task creation (lightweight tool, not tracked)

**Agent Coverage:**
- Claude Code: `.claude/commands/flow/brainstorm.md`
- Gemini CLI: `.gemini/commands/flow/brainstorm.toml`
- Codex: `.codex/prompts/flow.brainstorm.md`
- GitHub Copilot: `.github/prompts/flowspec.brainstorm.prompt.md`
- Templates (for `flowspec init`): all above in `src/flowspec_cli/templates/`

### FR-2: /flow:spike Command

**Core Behavior:**
1. Accept topic/paper/technology as `$ARGUMENTS`
2. Create beads task with `research,spike` labels
3. Conduct focused single-agent investigation using WebSearch/WebFetch
4. Produce `docs/research/<slug>.md` artifact
5. Create follow-up tasks from findings
6. Close beads task on completion
7. No workflow state transition (not a stage, a tool)

**Differentiation from /flow:research:**
- Single-agent (not Researcher + Validator)
- No business validation phase
- No workflow state advancement
- Lighter output: one research doc, not research + assessment
- **More sci-focused**: academic papers, formal methods, scientific foundations
- /flow:research = "deep dive into tech + map into workspace" (business + technical)
- /flow:spike = "understand the science" (papers, proofs, formal methods)

**Agent Coverage:**
Same 4-agent pattern as brainstorm (Claude/Gemini/Codex/GH Copilot + templates).

### FR-3: Pipeline vs Tools Vision

Only `/flow:research` is a workflow **stage** (Specified -> Researched). Brainstorm and spike are **tools** — run anytime, no gate, no state transition.

```
WORKFLOW STAGES (sequential, gated):
  assess → specify → [research] → plan → implement → validate
                      ↑ optional

TOOLS (run anytime, no gate):
  /flow:brainstorm  — whenever you need ideas
  /flow:spike       — whenever you need to read a paper
```

All three can run in any order, at any pipeline phase. Valid examples:
- brainstorm → spike → research
- spike → brainstorm → skip research → plan
- mid-implement: brainstorm for naming, spike for a paper

This vision MUST appear in: AGENTS.md, README.md, each command prompt header, and CLAUDE.md.

### FR-4: Documentation Updates

- AGENTS.md (root + template): add both commands + pipeline-vs-tools section + decision tree
- README.md: add to command reference table + cognitive trichotomy diagram + tools-vs-stages
- CLAUDE.md: add to slash commands table with "tool (anytime)" annotation
- CHANGELOG.md: document under v0.8.0
- Version bump: `__init__.py` + `pyproject.toml` -> 0.8.0

### FR-4: Cognitive Decision Tree in AGENTS.md

Add a decision tree to help users pick the right tool:

```
Am I gating a feature decision?
├─ YES → /flow:research (business val + tech, advances state)
└─ NO →
   Do I need facts/sources from outside?
   ├─ YES → /flow:spike (focused investigation, produces docs/research/)
   └─ NO →
      Do I need ideas, not facts?
      └─ YES → /flow:brainstorm (k candidates, inline, no sources)
```

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Performance | Brainstorm: <60s response. Spike: <5min for typical topic. |
| Compatibility | All 4 agents: Claude Code, Gemini CLI, Codex, GitHub Copilot |
| Consistency | Follow existing /flow: command patterns (frontmatter, $ARGUMENTS, step structure) |
| Zero-config | Work immediately after `flowspec init` without additional setup |

## 6. Task Breakdown

### Implementation Order: Brainstorm FIRST, Spike SECOND

Existing beads tasks from assessment:
- **flo-477** (P1): `/flow:brainstorm` — sashml/flowspec#5
- **flo-z6j** (P2): `/flow:spike` — sashml/flowspec#4

### Acceptance Criteria

#### flo-477: /flow:brainstorm

1. Claude command at `.claude/commands/flow/brainstorm.md` with VS prompt template
2. Gemini command at `.gemini/commands/flow/brainstorm.toml`
3. Codex prompt at `.codex/prompts/flow.brainstorm.md`
4. GH Copilot prompt at `.github/prompts/flowspec.brainstorm.prompt.md`
5. All templates in `src/flowspec_cli/templates/` for `flowspec init`
6. `--save` flag creates `docs/brainstorm/<slug>-<date>.md`
7. `--k N` flag overrides candidate count (default 7)
8. AGENTS.md (root + template) updated with brainstorm row + decision tree
9. README command table updated
10. CLAUDE.md slash commands table updated

#### flo-z6j: /flow:spike

1. Claude command at `.claude/commands/flow/spike.md` adapted from `.agents/researcher.md`
2. Gemini command at `.gemini/commands/flow/spike.toml`
3. Codex prompt at `.codex/prompts/flow.spike.md`
4. GH Copilot prompt at `.github/prompts/flowspec.spike.prompt.md`
5. All templates in `src/flowspec_cli/templates/` for `flowspec init`
6. Creates beads task with `research,spike` labels
7. Produces `docs/research/<slug>.md`
8. AGENTS.md (root + template) updated with spike row
9. README command table updated
10. CLAUDE.md slash commands table updated

#### Shared (both features)

1. Version bump: 0.7.78 -> 0.8.0 (`__init__.py` + `pyproject.toml`)
2. CHANGELOG.md entry under `## [0.8.0]`
3. `templates/docs/brainstorm/README.md` directory template
4. All existing tests pass (`pytest tests/ -x -q`)

## 7. Discovery and Validation Plan

No formal discovery needed (Skip SDD). Validation:

1. **Smoke test**: Run `/flow:brainstorm "name for a CLI tool"` in Claude Code — verify 7 candidates appear
2. **Save test**: Run with `--save` — verify `docs/brainstorm/` file created
3. **Spike test**: Run `/flow:spike "Dempster-Shafer intervals"` — verify research doc created
4. **Init test**: Run `flowspec init test-project --ai claude` — verify new commands appear in output
5. **Cross-agent**: Verify Gemini toml and Codex prompt files parse correctly

## 8. Acceptance Criteria and Testing

### Definition of Done

- [ ] All 4 agent formats have brainstorm + spike commands
- [ ] Templates match for `flowspec init` distribution
- [ ] AGENTS.md, README, CLAUDE.md, CHANGELOG updated
- [ ] Version 0.8.0 in `__init__.py` and `pyproject.toml`
- [ ] `pytest tests/ -x -q` passes
- [ ] `ruff check . && ruff format --check .` passes
- [ ] GitHub issues (sashml/flowspec#4, #5) referenced in commits

## 9. Dependencies and Constraints

| Dependency | Status | Impact |
|------------|--------|--------|
| `/flow:research` command | Exists | Must not break or modify |
| `.agents/researcher.md` | Exists | /flow:spike adapts from it; keep original for backward compat |
| beads-rust (`br`) | Available | Used by /flow:spike for task tracking |
| 4-agent template pattern | Established | Follow existing Claude/Gemini/Codex/GH patterns |

No external dependencies. No blocking constraints.

## 10. Success Metrics (Outcome-Focused)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **North Star**: Right tool usage | >80% correct tool selection | Qualitative — training feedback |
| Brainstorm adoption | Used in 50%+ ideation sessions | Session logs |
| Token savings | 10x reduction vs. /flow:research for ideation | Compare token counts |
| Training demo | Working live demo within 1 week | Binary: works on stage or not |

## All Needed Context

### Code Files
- `src/flowspec_cli/templates/commands/flow/research.md` — primary pattern to follow
- `src/flowspec_cli/templates/.gemini/commands/flow/research.toml` — Gemini pattern
- `.codex/prompts/flow.research.md` — Codex pattern
- `.agents/researcher.md` — researcher agent to adapt for spike
- `AGENTS.md` — command table to extend
- `README.md` — command reference to extend
- `CLAUDE.md` — slash commands table to extend
- `src/flowspec_cli/__init__.py` — version string
- `pyproject.toml` — version string

### External References
- arxiv:2510.01171 — Verbalized Sampling paper (academic basis for /flow:brainstorm)
- sashml/flowspec#5 — GH issue for brainstorm
- sashml/flowspec#4 — GH issue for spike

### Examples
- Existing `/flow:research` across all 4 agents is the structural template
- No brainstorm examples exist yet — this PRD defines the pattern

---

*PRD generated by /flow:specify workflow*
