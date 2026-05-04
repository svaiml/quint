# Feature Assessment: Quint Type System Integration

**Date**: 2026-04-24
**Assessed By**: Claude AI Agent
**Status**: Assessed
**Beads Issue**: zombo-sash-eco-37m
**Upstream ADR**: zombo-sash-eco-41l → quint/ADR005

## Feature Overview

Quint (Layer 06 SPEC) has a constraint-based type system (ADR005): equality
constraint generation over an IR visitor, unification-based solving, type
schemes for parametric polymorphism, and row types for records/tuples. This
mirrors Apalache's type system extended for Quint's stricter no-recursion,
no-ad-hoc-polymorphism design.

**Our question is not** "implement the type system" — that is upstream's work
(informalsystems/quint). **Our question is:**

> **Strategy (updated 2026-05-03):** Bridge first via `zz-bridge-quint`, not
> direct reimplementation. Use quint as-is, map its typed output into ZZ
> entities. Same pattern as `zz-bridge-infer` and `infer-pctl`.

> How does Quint's type system change what we need to build in flowspec and
> what contracts infer/criterium/zz-notation expect from Quint specs?

Three integration surfaces:

1. **flowspec → quint**: `flowspec gate` should invoke `quint typecheck` on
   `.qnt` spec files before allowing workflow progression. Type errors block
   the gate.
2. **quint → infer**: Typed Quint specs need a bridge that emits typed facts
   into infer's Datalog-style declarations. Types constrain which infer
   predicates are valid.
3. **zz-notation ↔ quint**: zz-notation's meta-reasoning strategy composition
   uses type-tagged terms. Quint row types for records map naturally onto
   zz-notation's annotated propositions.

## Scoring Analysis

### Complexity Score: 4.3/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 5/10 | 3–5 days: study ADR005 constraint system; add `quint typecheck` call to flowspec gate; define typed infer bridge contract |
| Component Count | 4/10 | quint CLI, flowspec gate, infer bridge, zz-notation type tags |
| Integration Points | 4/10 | quint typecheck (external binary), flowspec gate hook, infer fact generator |
| **Average** | **4.3/10** | |

### Risk Score: 1.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 1/10 | Formal spec tooling — no credentials or PII |
| Compliance Requirements | 1/10 | None |
| Data Sensitivity | 1/10 | Spec files are internal design artifacts |
| **Average** | **1.0/10** | |

### Architecture Impact Score: 4.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 6/10 | Type-checked formal specs gating workflow is new — flowspec currently has no type validation step |
| Breaking Changes | 3/10 | Existing `.qnt` spec files may fail typecheck — internal only, no public API |
| Dependencies Affected | 5/10 | Quint feeds flowspec (Layer 06) → infer (Layer 05) → criterium (Layer 05) → epistemic-game (Layer 05) |
| **Average** | **4.7/10** | |

## DVF+V Preliminary Risk

| Risk Type | Present? | Score |
|-----------|----------|-------|
| Value Risk — unclear if users want this? | Yes — do we need typed specs NOW or later? | +3 |
| Usability Risk — type errors in formal specs hard to debug? | Yes — constraint unification errors are cryptic | +2 |
| Feasibility Risk — unknown unknowns in type→infer bridge? | Yes — row types ↔ infer predicate arity mapping untested | +2 |
| Viability Risk — uncertain ROI? | No — unblocks infer/criterium spec validation | 0 |
| **DVF+V Bonus** | | **+7** |

## Overall Assessment

**Total Score**: 4.3 + 1.0 + 4.7 + 7 = **17.0/30**
**Recommendation**: Spec-Light
**Confidence**: Medium

### Rationale

Total (17.0) is just below Full SDD threshold (18). Architecture Impact (4.7)
and DVF+V bonus (7) push this well past Skip SDD. The DVF+V bonus is almost
entirely feasibility and usability risk — the type→infer bridge has design
unknowns and type errors in Quint are non-obvious to non-experts.

Spec-Light is appropriate: write a one-page integration spec covering the three
surfaces, then implement incrementally. No need for a full ADR cycle since
upstream ADR005 already makes the type system decisions; we only need to specify
**how we consume it**.

### Key Factors

- **Complexity**: Moderate. The hard part is the typed-infer bridge — mapping
  Quint row types to infer predicate signatures.
- **Risk**: Negligible. Pure internal tooling, no security or compliance surface.
- **Impact**: Elevated. Quint type checking gates all formal spec work in
  flowspec, which cascades to infer and criterium. Getting this wrong breaks the
  whole Layer 05→06 bridge.

### What the spec must answer

1. Which Quint type errors block the flowspec gate (all? only top-level?)
2. How do Quint row types map to infer fact schemas?
3. How do zz-notation type annotations align with Quint type schemes?

## Next Steps — Spec-Light Path

```bash
# Create lightweight spec
# docs/prd/quint-type-system-integration.md
# Sections: problem, 3 integration surfaces, type→infer mapping table,
#            acceptance criteria (gate blocks on type error, bridge emits typed facts)
# Then implement flowspec gate hook + typed infer bridge
```

### Immediate action (unblocks everything)

```bash
# Test quint typecheck on an existing .qnt file
cd tools/ai-tools/quint
quint typecheck examples/booleans.qnt 2>/dev/null || npx @informalsystems/quint typecheck examples/booleans.qnt
```

## Override

```bash
/flow:assess quint-type-system --mode full   # if bridge unknowns are worse than expected
/flow:assess quint-type-system --mode skip   # if we decide to defer type integration
```

---

*Assessment generated by /flow:assess workflow*
