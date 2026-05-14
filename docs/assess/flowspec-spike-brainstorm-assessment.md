# Feature Assessment: flowspec /flow:spike + /flow:brainstorm

**Date**: 2026-05-13
**Assessed By**: Claude AI Agent
**Status**: Assessed

## Feature Overview

Add two new slash commands to the flowspec toolkit, completing a **research trichotomy**:

1. **`/flow:spike`** -- Rename/promote the existing `.agents/researcher.md` into the `/flow:` namespace as a focused, single-agent technical investigation tool. Produces `docs/research/<slug>.md` artifacts. Does NOT advance workflow state.

2. **`/flow:brainstorm`** -- Brand-new divergent ideation command powered by the Verbalized Sampling (VS) technique (arxiv:2510.01171). Generates k candidate solutions inline. Ephemeral by default, `--save` flag for `docs/brainstorm/`. Does NOT advance workflow state.

Both sit alongside the existing **`/flow:research`** (heavy, multi-agent, workflow-gating: Specified -> Researched).

### Cognitive Trichotomy

| Command | Intent | State Transition | Artifact |
|---------|--------|------------------|----------|
| `/flow:research` (existing) | Convergent -- business + tech validation | Specified -> Researched | docs/research/ + docs/assess/ |
| `/flow:spike` (new) | Convergent -- focused tech deep-dive | None (tool, not stage) | docs/research/<slug>.md |
| `/flow:brainstorm` (new) | Divergent -- candidate expansion | None (tool, not stage) | Inline (optional docs/brainstorm/) |

### Academic Basis

Verbalized Sampling (VS) -- Stanford NLP, arxiv:2510.01171 -- demonstrates 1.6-2.1x quality improvement when LLMs generate multiple hypotheses then collapse to best candidate, vs. single-shot prompting. `/flow:brainstorm` operationalizes this technique.

## Scoring Analysis

### Complexity Score: 3.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 3/10 | /flow:spike is mostly renaming existing researcher agent into /flow: namespace + multi-agent templates. /flow:brainstorm is a new prompt template + optional file save. Total: 1-2 days. |
| Component Count | 3/10 | Touches: Claude commands, Gemini toml, Codex prompts, GitHub prompts, AGENTS.md (x2), README, CHANGELOG, version. All template files, no core CLI code changes. |
| Integration Points | 3/10 | No external integrations. Uses existing br CLI for task tracking. VS prompt is self-contained. |
| **Average** | **3.0/10** | |

### Risk Score: 1.3/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 1/10 | No security concerns. Prompt templates only -- no code execution, no data access beyond existing tools. |
| Compliance Requirements | 1/10 | No compliance requirements. Internal dev tooling. |
| Data Sensitivity | 2/10 | Brainstorm output is ephemeral by default. Optional --save writes to local docs/ directory. No PII, no external data. |
| **Average** | **1.3/10** | |

### Architecture Impact Score: 2.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 4/10 | /flow:brainstorm introduces a new "non-workflow-gating tool" pattern in /flow: namespace. Needs clear documentation that spike/brainstorm don't advance state. Minor conceptual novelty. |
| Breaking Changes | 1/10 | No breaking changes. /flow:research unchanged. Researcher agent preserved (aliased). Additive only. |
| Dependencies Affected | 3/10 | Downstream: all projects using flowspec templates get new commands on next `flowspec init`. Existing commands unaffected. AGENTS.md tables need new rows. |
| **Average** | **2.7/10** | |

### DVF+V Preliminary Risk

| Risk Type | Present? | Score | Rationale |
|-----------|----------|-------|-----------|
| Value Risk | No | 0 | VS technique proven (arxiv:2510.01171). User teaches this on trainings -- immediate demo value. |
| Usability Risk | No | 0 | Simple slash command UX, consistent with existing /flow: commands. |
| Feasibility Risk | No | 0 | Template-only work. No unknown technical unknowns. |
| Viability Risk | No | 0 | Zero cost beyond prompt engineering time. |
| **DVF+V Bonus** | | **0** | |

## Overall Assessment

**Total Score**: 7.0/30 (Complexity 3.0 + Risk 1.3 + Architecture 2.7 + DVF+V 0)
**Recommendation**: Skip SDD
**Confidence**: High

### Rationale

All three dimension scores are well below threshold (max individual: 3.0, total: 7.0 vs threshold 18 for Full SDD, 10 for Spec-Light). This is template engineering -- no core CLI changes, no external integrations, no state machine modifications. The existing `/flow:research` command and `.agents/researcher.md` provide proven patterns to follow.

### Key Factors

- **Complexity**: Low -- template files across 4 agent formats (Claude/Gemini/Codex/GitHub Copilot) + documentation updates. No Python code changes to `flowspec_cli`.
- **Risk**: Minimal -- no security, compliance, or data sensitivity concerns.
- **Impact**: Additive only -- no breaking changes. Extends existing command taxonomy.

## Deliverables Checklist

### /flow:spike (promote researcher to flow namespace)

- [ ] `.claude/commands/flow/spike.md` -- Claude Code command
- [ ] `src/flowspec_cli/templates/commands/flow/spike.md` -- Template for init
- [ ] `.gemini/commands/flow/spike.toml` -- Gemini CLI
- [ ] `src/flowspec_cli/templates/.gemini/commands/flow/spike.toml` -- Template
- [ ] `.codex/prompts/flow.spike.md` -- Codex prompt
- [ ] `.github/prompts/flowspec.spike.prompt.md` -- GitHub Copilot
- [ ] AGENTS.md (root + template) -- add /flow:spike row
- [ ] README.md -- add to command reference table
- [ ] CHANGELOG.md -- document addition
- [ ] CLAUDE.md -- add to slash commands table

### /flow:brainstorm (new VS-powered ideation)

- [ ] `.claude/commands/flow/brainstorm.md` -- Claude Code command
- [ ] `src/flowspec_cli/templates/commands/flow/brainstorm.md` -- Template for init
- [ ] `.gemini/commands/flow/brainstorm.toml` -- Gemini CLI
- [ ] `src/flowspec_cli/templates/.gemini/commands/flow/brainstorm.toml` -- Template
- [ ] `.codex/prompts/flow.brainstorm.md` -- Codex prompt
- [ ] `.github/prompts/flowspec.brainstorm.prompt.md` -- GitHub Copilot
- [ ] `templates/docs/brainstorm/README.md` -- brainstorm artifact directory template
- [ ] AGENTS.md (root + template) -- add /flow:brainstorm row
- [ ] README.md -- add to command reference table + cognitive workflow diagram
- [ ] CHANGELOG.md -- document addition
- [ ] CLAUDE.md -- add to slash commands table

### Shared

- [ ] Version bump: 0.7.78 -> 0.8.0 (`__init__.py` + `pyproject.toml`)
- [ ] GitHub issues created on sashml/flowspec for external refs
- [ ] beads tasks linked to GH issues

## Implementation Order

**1. `/flow:brainstorm` FIRST** (flo-477, sashml/flowspec#5)
- Immediate value: every brainstorm session, training demos
- Zero dependencies, zero validation needed
- "Stanford NLP proved it, here's the live demo"

**2. `/flow:spike` SECOND** (flo-z6j, sashml/flowspec#4)
- Promotes existing researcher agent -- lower novelty
- More science/research focused positioning
- Completes the trichotomy

```bash
# Skip SDD -- proceed directly to implementation
# 1. Create feature branch
git checkout -b feature/flow-spike-brainstorm

# 2. Implement brainstorm first, then spike
# 3. Update version 0.7.78 -> 0.8.0, CHANGELOG, README, AGENTS.md
# 4. Create PR
```

## Override

If this assessment doesn't match your needs:

```bash
/flow:assess flowspec-spike-brainstorm --mode full    # Force full SDD
/flow:assess flowspec-spike-brainstorm --mode light   # Force spec-light
```

---

*Assessment generated by /flow:assess workflow*
