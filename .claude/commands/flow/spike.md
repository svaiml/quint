---
description: Focused scientific/academic investigation — papers, formal methods, niche technologies. Single-agent, artifact-producing.
loop: inner
# Loop Classification: INNER LOOP (tool, not workflow stage)
# This is a TOOL, not a workflow stage. It can be invoked at any point in the pipeline.
# It does NOT advance workflow state. No prerequisites, no gates.
# Key difference from /flow:research: spike is more sci-focused (papers, proofs, formal methods).
# /flow:research = deep dive into tech + map into workspace (business + technical validation).
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pipeline Position

`/flow:spike` is a **TOOL**, not a workflow stage. It can be invoked at any time:

```
WORKFLOW STAGES (sequential, gated):
  assess → specify → [research] → plan → implement → validate

TOOLS (run anytime, no gate):
  /flow:brainstorm  — whenever you need ideas
  /flow:spike       — whenever you need to read a paper  ← YOU ARE HERE
```

No state check needed. No prerequisites. Just run it.

## How /flow:spike differs from /flow:research

| Aspect | /flow:spike (this command) | /flow:research |
|--------|---------------------------|----------------|
| Focus | **Scientific** — papers, formal methods, proofs, theory | **Technical + Business** — tech deep-dive mapped to workspace |
| Agents | Single-agent | Multi-agent (Researcher + Validator) |
| Business validation | No | Yes (opportunity scoring, risk register) |
| Workflow state | None (tool) | Specified -> Researched (stage) |
| Output | `docs/research/<slug>.md` | `docs/research/` + `docs/assess/` |
| Cost | Medium (~20K tokens) | High (~50K tokens) |

**Use /flow:spike when**: you need to understand a paper, formal method, scientific concept, or theoretical foundation.
**Use /flow:research when**: you need business + technical validation to gate a feature decision.

## Execution Instructions

### Step 0: Quick duplicate check

```bash
# Only check for existing spikes — skip if no matches
br search "$ARGUMENTS" 2>/dev/null | head -5
```

If an existing spike on the same topic is found, ask the user whether to continue, append, or skip.

### Step 1: Create beads tracking task

```bash
SLUG=$(echo "$ARGUMENTS" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g' | head -c 60)
TASK_ID=$(br create \
  --title="Spike: $ARGUMENTS" \
  --type=task \
  --priority=2 \
  -l "research,spike,science" \
  -d "WHAT: Scientific investigation of $ARGUMENTS

WHY: Understand theoretical foundations, formal methods, or academic research to inform design decisions

HOW: Academic papers -> formal method analysis -> synthesis into actionable knowledge

Refs: docs/research/${SLUG}.md" \
  --silent)
br update "$TASK_ID" --status=in_progress
```

### Step 2: Investigate

Conduct a focused, single-agent scientific investigation:

1. **Source identification**: Find relevant academic papers (arxiv, ACM, IEEE, Springer), formal specifications, proofs, and scientific literature.

2. **Primary source reading**: Read and analyze the key papers/sources. Focus on:
   - Core contributions and claims
   - Methodology and formal framework
   - Mathematical foundations or proof structure
   - Experimental results and validation
   - Limitations acknowledged by authors

3. **Synthesis**: Distill findings into actionable knowledge:
   - What is the core insight?
   - What are the formal guarantees (if any)?
   - What are the practical implications?
   - How does this relate to the user's context?

4. **Open questions**: What remains unclear or needs further investigation?

**KEY CONSTRAINT**: This is about understanding THE SCIENCE. Do NOT:
- Conduct business validation or market analysis
- Score opportunities or build risk registers
- Map findings to workspace architecture (that's /flow:research's job)
- Create multi-agent orchestration

### Step 3: Write artifact

Write findings to `docs/research/<slug>.md`:

```bash
mkdir -p docs/research
```

Artifact format:

```markdown
# Spike: <topic>

**Date**: YYYY-MM-DD
**Type**: Scientific Investigation
**Status**: Complete

## Summary

<1-paragraph executive summary of findings>

## Sources

| # | Source | Type | Key Contribution |
|---|--------|------|-----------------|
| 1 | arxiv:XXXX.XXXXX | Paper | ... |
| 2 | ... | ... | ... |

## Core Findings

### <Finding 1>
<Detailed analysis with citations>

### <Finding 2>
...

## Formal Framework

<Mathematical foundations, proof sketches, formal guarantees — if applicable>

## Practical Implications

<What this means for implementation decisions>

## Open Questions

- <Question 1>
- <Question 2>

## Follow-up Recommendations

<Suggested next steps: further spikes, brainstorms, or implementation tasks>
```

### Step 4: Create follow-up tasks (if warranted)

If investigation suggests actionable work:

```bash
br create --title="[Follow-up]: <description>" --type=task --priority=3 \
  -l "research-followup,spike" \
  -d "WHAT: <follow-up action>
WHY: Spike on $ARGUMENTS revealed <insight>
HOW: <approach>
Refs: docs/research/${SLUG}.md"
```

### Step 5: Close beads task

```bash
br update "$TASK_ID" --notes "Spike complete. Findings: docs/research/${SLUG}.md"
br close "$TASK_ID"
```

## Output

Research artifact at `docs/research/<slug>.md`. Beads task created and closed. No workflow state change.
