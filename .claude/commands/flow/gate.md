---
description: Run quality gate validation on spec documents before implementation. Supports --threshold XX to override minimum score.
loop: inner
# Loop Classification: INNER LOOP
# This command validates spec quality as a gate before implementation begins.
---

## User Input

```text
$ARGUMENTS
```

Parse arguments for optional flags:
- `--threshold XX` — override minimum quality score (default: 70)
- `--force` — bypass gate even if quality check fails (requires user approval)

## Execution Instructions

This command validates spec quality before implementation can proceed. It ensures PRDs and specifications meet minimum quality thresholds before engineering work begins.

### Quality Gate Validation

**CRITICAL**: Spec quality must pass before implementation begins.

```bash
# Auto-discover spec in docs/prd/ (works when only one .md exists)
flowspec gate

# Explicit path — required when multiple specs exist, or filename isn't spec.md
flowspec gate docs/prd/${FEATURE_SLUG}-spec.md

# Custom threshold (e.g., /flow:gate --threshold 95)
flowspec gate docs/prd/${FEATURE_SLUG}-spec.md --threshold ${THRESHOLD:-95}

# Emergency bypass — NOT RECOMMENDED, requires explicit user approval
# flowspec gate docs/prd/${FEATURE_SLUG}-spec.md --force
```

**Quality Gate Exit Codes:**
- `0` = PASSED — Proceed to implementation
- `1` = FAILED — Spec quality below threshold
- `2` = ERROR — Missing spec.md or validation error

### If Gate PASSES (exit code 0)

```
[Y] Quality gate passed (score: XX/100, threshold: YY)
Spec quality is sufficient — implementation can proceed.
Next step: /flow:implement
```

### If Gate FAILS (exit code 1)

```
[X] Quality gate failed: Spec quality is X/100 (minimum: 70)

Recommendations:
  - Add missing section: ## Description
  - Add missing section: ## User Story
  - Reduce vague terms (currently: Y instances)
  - Add measurable acceptance criteria

Action Required:
1. Improve spec quality using the recommendations above
2. Re-run quality check: flowspec quality docs/prd/<feature>-spec.md
3. When quality >= threshold, re-run: /flow:gate

OR lower the threshold (if appropriate):
  /flow:gate --threshold 60

OR bypass (only with explicit user approval):
  flowspec gate --force
```

### --threshold Override

Use `--threshold XX` to set a custom minimum score:

```bash
# Examples:
flowspec gate --threshold 95   # High quality bar (recommended)
flowspec gate --threshold 80   # Strict — enterprise/regulated environments
flowspec gate --threshold 70   # Moderate — recommended minimum
flowspec gate --threshold 60   # Relaxed — early-stage or prototype work
flowspec gate --threshold 50   # Minimal — spike or throwaway work only
```

### --force Bypass

The `--force` flag:
- **Only use with explicit user approval** — ask before bypassing
- Warns that bypassing quality checks may lead to unclear requirements
- Logs the bypass decision for audit trail

### Also Check with bv

After gate passes, check for blockers before implementation:

```bash
# Check blockers on the implementation task
bv -robot-blocker-chain <TASK_ID> 2>/dev/null

# ETA forecast
bv -robot-forecast <TASK_ID> 2>/dev/null
```

### Output

Report the gate status:

| Result | Score | Action |
|--------|-------|--------|
| PASSED | >= threshold | Report success, suggest `/flow:implement` |
| FAILED | < threshold | Report issues and recommendations |
| BYPASSED | any | Log bypass with reason, warn about risks |

### Composability

This command can be invoked:
- Standalone: `/flow:gate` or `/flow:gate --threshold 80` for manual quality checks
- As part of `/flow:implement` orchestration (runs automatically)
- In CI pipelines for automated quality enforcement
- With custom thresholds per project or per feature complexity
