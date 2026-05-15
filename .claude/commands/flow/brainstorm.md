---
description: Divergent ideation using Verbalized Sampling — generate k candidate solutions with self-rated probabilities, collapse to best.
loop: inner
# Loop Classification: INNER LOOP (tool, not workflow stage)
# This is a TOOL, not a workflow stage. It can be invoked at any point in the pipeline.
# It does NOT advance workflow state. No prerequisites, no gates.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Argument Parsing

Parse `$ARGUMENTS` for:
- `--save` flag: write output to `docs/brainstorm/<slug>-<date>.md`
- `--k N`: override number of candidates (default 7)
- Everything else is the topic/problem description

## Pipeline Position

`/flow:brainstorm` is a **TOOL**, not a workflow stage. It can be invoked at any time:

```
WORKFLOW STAGES (sequential, gated):
  assess → specify → [research] → plan → implement → validate

TOOLS (run anytime, no gate):
  /flow:brainstorm  — whenever you need ideas     ← YOU ARE HERE
  /flow:spike       — whenever you need to read a paper
```

No state check needed. No prerequisites. Just run it.

## Execution Instructions

### Step 1: Verbalized Sampling — Superposition Phase

Generate **k** diverse candidate solutions for the given topic/problem (default k=7).

For EACH candidate, provide:
1. **Name/Title**: Short, memorable label
2. **Approach**: 2-3 sentence description of the approach
3. **Rationale**: Why this could be the best solution
4. **Novelty angle**: What makes this different from the others

**CRITICAL DIVERSITY RULE**: At least 3 candidates MUST take fundamentally different approaches. Do not generate variations of the same idea. Explore orthogonal angles: different paradigms, scales, trade-offs, user mental models.

### Step 2: Self-Rating Phase

Rate each candidate on three dimensions (0.0–1.0):

| # | Candidate | Feasibility | Originality | Impact | Combined |
|---|-----------|-------------|-------------|--------|----------|
| 1 | ... | 0.X | 0.X | 0.X | 0.X |
| ... | | | | | |

**Combined** = (Feasibility × 0.4) + (Originality × 0.3) + (Impact × 0.3)

Be honest in ratings — an obvious choice rated 0.9 across the board signals insufficient diversity.

### Step 3: Collapse Phase

Select the **best candidate** based on combined scores and provide:

1. **Winner**: Which candidate and why it won
2. **Synthesis**: What elements from other candidates could strengthen it
3. **Confidence**: How confident are you in this selection (Low / Medium / High)
4. **Runner-up**: Second best option if the winner has hidden risks

### Step 4: Save (if --save flag)

If `--save` is present in arguments:

```bash
mkdir -p docs/brainstorm
# Write the full brainstorm output to docs/brainstorm/<slug>-YYYY-MM-DD.md
```

Include metadata header in saved file:
```markdown
# Brainstorm: <topic>
**Date**: YYYY-MM-DD
**Candidates**: k
**Winner**: <candidate name>
**Confidence**: <level>
**Method**: Verbalized Sampling (arxiv:2510.01171)
```

## Output Format

Present results inline. No beads task creation. No workflow state change.

```
## Brainstorm: <topic>

### Candidates (k=7)

| # | Candidate | Approach | Feasibility | Originality | Impact | Score |
|---|-----------|----------|-------------|-------------|--------|-------|
| 1 | ... | ... | 0.X | 0.X | 0.X | 0.X |
| ... | | | | | | |

### Winner: <name> (score: 0.XX)

<Why this candidate won>

### Synthesis

<Elements from other candidates that could strengthen the winner>

### Runner-up: <name> (score: 0.XX)

<When to prefer this over the winner>
```

## Method Reference

Based on Verbalized Sampling (VS) — Stanford NLP, arxiv:2510.01171.
VS demonstrates 1.6-2.1x quality improvement when LLMs generate multiple hypotheses with self-rated probabilities, then collapse to best candidate, vs. single-shot prompting.
