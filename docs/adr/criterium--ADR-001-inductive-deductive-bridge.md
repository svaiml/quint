# ADR-001: Inductive ↔ Deductive Bridge Design

## Status

Accepted

## Context

Two traditions of reasoning have remained largely separate in software systems:

- **Deductive** (symbolic AI): Logic rules + facts → certain conclusions.
  Engines: Prolog, Datalog, infer. Strength: explainability, soundness.
  Weakness: closed-world assumption, brittle to incomplete data.

- **Inductive** (statistical AI): Data patterns → probable conclusions.
  Engines: ML models, probabilistic model checkers (pctl-rs). Strength: handles
  uncertainty, learns from data. Weakness: opaque, can't explain *why*.

A third mode is needed to connect them:

- **Abductive** (hypothesis generation): Given observations, infer the most plausible
  explanation. This is how humans actually reason: not from axioms, not from data alone,
  but by forming hypotheses and testing them against both logic and evidence.

The problem: there is no standard way to structure this cycle in software. Most systems
either pick one mode or glue them together ad hoc, losing the provenance trail and making
human oversight impossible to implement properly.

---

## Decision: Abduction-First Bridge with Assurance Levels

### The bridge is an ordered cycle, not a pipeline

The three modes are NOT a linear pipeline (abduct → deduce → induce, done).
They form a **cycle** where:
- Induction results surface gaps → trigger new abductive prompts
- Deductive contradictions → hypothesis refinement (back to abduction)
- Human judgment closes the loop at each level

### Abduction is the entry point, not deduction

Most logic systems start with facts → rules → conclusions (deduction-first). This works
only when the problem is well-defined. Real-world problems start with observations and
uncertainty. Abduction is the correct entry point because it generates the hypothesis
that deduction then validates.

**Options considered:**

| Option | Description | Problem |
|--------|-------------|---------|
| A. Deduction-first | Start with rules, derive conclusions | Requires complete initial facts; brittle |
| B. Induction-first | Start with data, derive patterns | No logical validation; opaque |
| C. Abduction-first (chosen) | Start with hypothesis, validate both ways | Requires HITL to select hypothesis; expensive |
| D. Parallel | Run all three simultaneously, merge results | Contradictions unresolvable without ordering |

**Decision: Option C** — abduction-first, with deduction as validation and induction as
evidence scoring. The human selects at abduction and reviews at induction.

### AssuranceLevel tracks position in the cycle

Rather than a binary "proven / not proven", every claim has a graded assurance:

```
L0 (Abduced)   → human selected this hypothesis; not yet validated
L1 (Deduced)   → rules fire; no contradictions; logically coherent
L2 (Induced)   → evidence confirms with p ≥ domain threshold
L3 (Operational) → deployed, monitored, drift triggers new loop
```

This is a **monotonic ordering** — assurance can only increase through the loop, or reset
to L0 if a contradiction is found. Humans can override at any level.

---

## Decision: HITL is Structural, Not Optional

Human-in-the-loop is implemented as a **structural constraint** in the loop state machine:

1. The loop **cannot advance past abduction** without human hypothesis selection
2. The loop **cannot mark a claim as L3** without human review of the L2 evidence
3. Every human action is **recorded in the KnowledgeStore** with full attribution

This means criterium is not "AI that humans can optionally check." It is a system that
**requires human judgment** at defined points and cannot proceed without it.

**Rationale**: The problem of inductive-deductive integration is fundamentally a problem of
trust calibration. Humans provide the domain knowledge that neither infer nor pctl-rs has.
The criterion (the standard for "good enough") cannot be computed — it must be set by humans
familiar with the domain stakes.

---

## Decision: Shared KnowledgeStore as the Integration Layer

The KnowledgeStore (zz-notation ADR-002, TASK-16) serves as the **shared memory** that
connects all three reasoning modes:

- Abduction reads existing knowledge to generate informed hypotheses
- Deduction asserts new facts with `source="infer"` and `TruthValue`
- Induction updates `confidence` fields on existing facts
- Human annotations stored with `source="human"`

All three modes write to the same store, with full provenance. When induction discovers
that a deductively-validated claim has low probability, the KnowledgeStore records the
conflict (Belnap `Conflicted`) and surfaces it to the human.

**Consequence**: criterium does NOT have its own database. It uses the KnowledgeStore
as its single source of truth. rstmdb provides persistence. This is intentional —
criterium's value is the loop orchestration, not data storage.

---

## Consequences

### Positive
- Every claim has a provenance trail: who abduced it, what infer said, what pctl-rs scored,
  what the human decided
- HITL is impossible to bypass — the loop state machine enforces it structurally
- AssuranceLevel gives stakeholders a single number to assess claim confidence
- The KnowledgeStore accumulates institutional knowledge across sessions
- Contradictions are first-class: surfaced via Belnap `Conflicted`, not silently discarded

### Negative
- Abduction-first is slower than deduction-first for well-defined problems
- Mandatory HITL at abduction means criterium cannot run fully autonomously
- Shared KnowledgeStore creates a coupling point between criterium and zz-notation

### Neutral
- criterium is an orchestrator, not an engine — it adds no new reasoning capability,
  only the loop that connects existing engines
- L3 (Operational) monitoring requires rstmdb WAL and a daemon — deferred to v0.3+

## References

- [FPF Canonical Reasoning Cycle](../../tools/ai-tools/fpf-problem-solving-skill/) — abductive loop origin
- [infer 5-verb framework](../../reasoning-universe/infer/docs/adr/ADR-THEORY-002-5verb-reasoning-framework.md)
- [zz-notation ADR-002](../../reasoning-universe/zz-notation/docs/adr/ADR-002-knowledge-store-architecture.md) — KnowledgeStore
- [Unified Reasoning Architecture](../../reasoning-universe/infer/docs/prd/unified-reasoning-logical-architecture-spec.md)

---

*Michael Nygard format.*
