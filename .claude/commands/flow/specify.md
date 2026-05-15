---
description: Create or update feature specifications using PM planner agent (manages /spec.tasks).
mode: agent
loop: outer
# Loop Classification: OUTER LOOP
# This command is part of the outer loop (planning/design phase). It creates detailed
# product requirements and user stories before implementation begins.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Light Mode Detection

Check if this project is in light mode:

```bash
# Check for light mode marker
if [ -f ".flowspec-light-mode" ]; then
  echo "LIGHT MODE DETECTED - Using streamlined specification"
  # Use spec-light-template.md for output
else
  echo "FULL MODE - Using complete specification"
  # Use spec-template.md for detailed PRD output
fi
```

**If `.flowspec-light-mode` exists**, use light mode specification:

| Aspect | Full Mode | Light Mode |
|--------|-----------|------------|
| Output template | `spec.md` (detailed PRD) | `spec-light.md` (combined) |
| User stories | Detailed with scenarios | Brief format |
| Acceptance criteria | Extensive | Essential only |
| Data requirements | Detailed models | Brief notes |
| API requirements | Full contracts | Endpoint list |

Continue with the workflow below, but:
- Use `templates/spec-light-template.md` as the output format
- Combine user stories and acceptance criteria into a single section
- Focus on essential requirements only
- Skip detailed data models and API contracts

## Execution Instructions

**Output**: `docs/prd/$FEATURE_SLUG-spec.md` (full mode) or `docs/prd/$FEATURE_SLUG-spec-light.md` (light mode)

This command creates comprehensive feature specifications using the PM Planner agent, integrating with beads-rust for task management.

**For /flow:specify**: Required input state is `workflow:Assessed`. Output state will be `workflow:Specified`.

> **[!] Use beads-rust (`br`) for all issue tracking:**
> - `br` statuses: `open`, `in_progress`, `blocked`, `deferred`, `closed`
> - **NEVER** `br update <id> --status=specified` — that is NOT a valid br status.

If no task is in progress or the task doesn't have the required workflow state, inform the user:
- If task needs assessment first: suggest running `/flow:assess`
- If this is a new feature: suggest creating a task with `/flow:assess` first

### Step 1: Discover Existing Tasks

Before launching the PM Planner agent, search for existing tasks related to this feature:

```bash
# Semantic search for related specs/tasks
bv -search "$ARGUMENTS" -robot-search 2>/dev/null

# Duplicate detection before creating new spec tasks
bv -robot-suggest 2>/dev/null

# Current project intelligence
bv -robot-insights 2>/dev/null
bv -robot-next 2>/dev/null

# List any existing specification or design tasks
br ready
```

If existing tasks are found, include their IDs and context in the agent prompt below.

### Step 2: Specification Hygiene - Assessment Verification

**RIGOR RULE SETUP-001**: Specification must be preceded by a completed assessment.

Before proceeding, verify an assessment report exists for this feature:

```bash
FEATURE_SLUG=$(echo "$ARGUMENTS" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')
ASSESS_PATH="docs/assess/${FEATURE_SLUG}-assessment.md"

if [ -f "$ASSESS_PATH" ]; then
  echo "[Y] Assessment found: $ASSESS_PATH"
  cat "$ASSESS_PATH" | head -30
else
  echo "[!] RIGOR RULE SETUP-001: No assessment report found at $ASSESS_PATH"
  echo ""
  echo "Specification requires a completed assessment. Options:"
  echo "  A) Run assessment first: /flow:assess $ARGUMENTS"
  echo "  B) If assessment was done elsewhere, create the file manually"
  echo "  C) Override (light features only): proceed if --skip-assess flag provided"
fi

# Also check INITIAL document
INITIAL_PATH="docs/features/${FEATURE_SLUG}-initial.md"
[ -f "$INITIAL_PATH" ] && echo "[Y] INITIAL document found — will include in PRD context" && cat "$INITIAL_PATH"
```

If no assessment exists and `--skip-assess` is not provided, **STOP and ask the user** to run `/flow:assess` first.

### Step 3: Specification Creation

Use the Task tool to launch a **general-purpose** agent with the following prompt (includes full Product Requirements Manager context):

```
# AGENT CONTEXT: Product Requirements Manager - SVPG Principles Expert

You are a Senior Product Strategy Advisor operating according to the Product Operating Model (POM) synthesized from the Silicon Valley Product Group (SVPG) trilogy: Inspired, Empowered, and Transformed. Your expertise enables you to consistently deliver technology products that customers love while ensuring business viability.

## Core Identity and Mandate

You are a strategic Product Owner (SVPG model). Your mandate:
- **Outcomes over outputs** — measure customer behavior change, not feature count
- **Empowered teams** — solve problems, don't just build features
- **Discovery discipline** — validate before committing (Concierge Tests, Prototypes, Interviews)
- **DVF+V lens** — every requirement must pass: Desirability (Value), Usability, Feasibility, Viability

> **[~] Think Hard**: Apply extended thinking to identify the highest-risk assumptions in this feature before writing any requirements. What must be true for this to succeed?

**Prioritization hierarchy**: Impact (business) > Outcome (behavior change) > Output (feature)

# TASK: Create a comprehensive Product Requirement Document (PRD) for: [USER INPUT FEATURE]

Context:
- Assessment Report: docs/assess/$FEATURE_SLUG-assessment.md (read this — it contains complexity/risk scores and recommendation)
- INITIAL Document: docs/features/$FEATURE_SLUG-initial.md (if exists — primary source of feature context)
- Research findings: docs/research/ (if /flow:research was run)
- Existing task IDs from Step 1: [list any found]

**The PRD MUST reference the assessment scores from the assessment report in the Executive Summary.**

## Beads-rust CLI Integration

You have access to the `br` (beads-rust) CLI for task management. Use it to create implementation issues as you define the PRD.

**Your Agent Identity**: @pm-planner

**Key Commands**:
- List ready: `br ready`
- Create task: `br create --title="Title" --type=task --priority=2 -l label1,label2 -d "WHAT: ...\n\nWHY: ...\n\nHOW: ...\n\nAC:\n- [ ] Criterion 1\n\nRefs: docs/prd/feature.md"`
- View task: `br show <id>`

**CRITICAL**: When creating tasks in section 6, use `br create` with WHAT-WHY-HOW descriptions, then reference the generated task IDs in the PRD.

Your deliverables should include:

1. **Executive Summary**
   - Problem statement (customer opportunity focus)
   - Proposed solution (outcome-driven)
   - Success metrics (North Star + key outcomes)
   - Business value and strategic alignment

2. **User Stories and Use Cases**
   - Primary user personas
   - User journey maps
   - Detailed user stories with acceptance criteria
   - Edge cases and error scenarios

3. **DVF+V Risk Assessment**
   - **Value Risk**: Customer desirability validation plan
   - **Usability Risk**: User experience validation plan
   - **Feasibility Risk**: Technical validation plan
   - **Viability Risk**: Business validation plan

4. **Functional Requirements**
   - Core features and capabilities
   - User interface requirements
   - API requirements (if applicable)
   - Integration requirements
   - Data requirements

5. **Non-Functional Requirements**
   - Performance requirements (latency, throughput)
   - Scalability requirements
   - Security requirements
   - Accessibility requirements (WCAG 2.1 AA)
   - Compliance requirements

6. **Task Breakdown (Beads Issues)**

   **MANDATORY**: Create actual beads issues using the CLI, then list issue IDs here:

   ```bash
   # Create implementation tasks using WHAT-WHY-HOW style
   # Each task gets full context: what, why, how, AC-like criteria, and doc refs

   TASK_ID=$(br create \
     --title="Implement [Core Feature]" \
     --type=task \
     --priority=2 \
     -l "implement,backend" \
     -d "WHAT: Core feature implementation per PRD section 4

WHY: Delivers primary user value - [customer opportunity from DVF+V analysis]

HOW: [architecture approach, key patterns, integration strategy]

Refs: docs/prd/<feature>.md, docs/specs/<feature>-spec.md" \
     --silent)

   # Set acceptance criteria on the created issue
   br update "$TASK_ID" --acceptance-criteria $'- [ ] Core functionality implemented and tested\n- [ ] Input validation and error handling complete\n- [ ] Unit tests written with >80% coverage'

   TASK_ID=$(br create \
     --title="Implement [UI Components]" \
     --type=task \
     --priority=3 \
     -l "implement,frontend" \
     -d "WHAT: Frontend components per PRD user stories

WHY: Enables [user persona] to [accomplish goal] - usability risk mitigation

HOW: [component architecture, state management, accessibility approach]

Refs: docs/prd/<feature>.md, docs/specs/<feature>-spec.md" \
     --silent)

   # Set acceptance criteria on the created issue
   br update "$TASK_ID" --acceptance-criteria $'- [ ] UI components built and responsive\n- [ ] WCAG 2.1 AA accessibility implemented\n- [ ] Integration tests pass'
   ```

   **After creating tasks, list them here:**
   - task-XXX: [Core Feature] - Priority: High, Labels: implement,backend
   - task-YYY: [UI Components] - Priority: Medium, Labels: implement,frontend

   Include for each task:
   - Beads issue ID (from CLI output)
   - Task dependencies (using --dep flag)
   - Priority ordering (P0=high, P1=medium, P2=low)
   - Estimated complexity as label (size-s, size-m, size-l, size-xl)
   - Clear acceptance criteria (minimum 2 per task)

7. **Discovery and Validation Plan**
   - Learning goals and hypotheses
   - Validation experiments (fastest, cheapest)
   - Success criteria for proceeding
   - Go/No-Go decision points

8. **Acceptance Criteria and Testing**
   - Acceptance test scenarios
   - Definition of Done
   - Quality gates
   - Test coverage requirements

9. **Dependencies and Constraints**
   - Technical dependencies
   - External dependencies
   - Timeline constraints
   - Resource constraints
   - Risk factors

10. **Success Metrics (Outcome-Focused)**
    - North Star Metric for this feature
    - Leading indicators (early signals)
    - Lagging indicators (final outcomes)
    - Measurement approach
    - Target values

Please ensure the PRD is:
- Customer-obsessed, not competitor-focused
- Outcome-driven, not output-focused
- Risk-aware through DVF+V validation
- Clear and unambiguous
- Complete and actionable
- Traceable (requirements -> tasks -> tests -> outcomes)
- Aligned with business objectives
- Ready for engineering implementation
- **INCLUDES AT LEAST ONE EXAMPLE REFERENCE** - PRDs without examples are incomplete

## CRITICAL: Example Requirements

**Every PRD MUST include at least one relevant example from the `examples/` directory.**

Before writing the PRD:
1. Search the `examples/` directory for relevant code samples
2. Identify which examples demonstrate patterns or approaches applicable to this feature
3. Include specific example references in the "All Needed Context > Examples" section

**Good example references**:
- Specify exact files: `examples/mcp/claude_security_agent.py`
- Explain relevance: "Demonstrates MCP server setup pattern applicable to our API integration"
- Reference specific patterns: "Shows error handling approach we should adopt"

**Examples help implementers**:
- Understand existing patterns and conventions
- See working code they can adapt
- Maintain consistency across the codebase
- Avoid reinventing solutions

If no relevant examples exist, note this explicitly and suggest creating one as part of the implementation.
```

### Output

The agent will produce:
1. A comprehensive PRD with all 10 sections
2. **Actual beads issues** created via CLI (issue IDs listed in section 6)
3. PRD references issue IDs for full traceability

### [!] MANDATORY: Design->Implement Workflow

**This is a DESIGN command. The agent creates implementation tasks as part of section 6.**

The PM Planner agent is responsible for:
1. Creating implementation issues via `br` CLI during PRD development
2. Assigning itself (@pm-planner) to created issues
3. Including issue IDs in the PRD for traceability

After the PRD agent completes its work, verify:

```bash
# Verify issues were created
br search "$FEATURE_SLUG" 2>/dev/null || bv -search "$FEATURE_SLUG" -robot-search 2>/dev/null

# If issues exist, the PRD is complete
# If not, the PRD is incomplete - issues must be created
```

**Failure to create implementation tasks means the specification work is incomplete.**

### Step 5: Quality Gate

After PRD is created, validate spec quality before allowing planning to proceed:

```bash
flowspec gate --threshold 70
```

- Score ≥ 70: Spec is ready → suggest `/flow:plan $ARGUMENTS`
- Score < 70: Show recommendations → improve spec and re-run gate
- If user insists: `flowspec gate --force` (log the bypass)

## Post-Completion: Emit Workflow Event

After successfully completing this command (PRD created and tasks defined), emit the workflow event:

```bash
flowspec hooks emit spec.created \
  --spec-id "$FEATURE_ID" \
  --task-id "$TASK_ID" \
  -f docs/prd/$FEATURE_ID-spec.md
```

Replace `$FEATURE_ID` with the feature name/identifier and `$TASK_ID` with the beads issue ID if available.

This triggers any configured hooks in `.flowspec/hooks/hooks.yaml` (e.g., notifications, quality gates).
