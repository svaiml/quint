# Assessment: FPF v7.0 Keyword Integration into Reasoning Stack

**Date**: 2026-05-02
**Beads**: zse-osc
**Status**: Assessed

## Feature Overview

FPF-Spec.md received +7,978 lines across 8 commits introducing 6 new major patterns. This assessment maps each new FPF concept to our ecosystem components and identifies integration opportunities.

## New FPF v7.0 Keywords → Ecosystem Map

### 1. Temporal Claim Adequacy (C.27)

**FPF concept**: Separates state readings, rate readings (trends), and intervention-sensitive temporal change. Prevents conflating "speed" with "improvement" — demands explicit temporal typing for any claim about change over time.

**Keywords**: temporal claim, state reading, rate reading, temporal trend, intervention-sensitive change, effort window, resistance/inertia, rhythm/cadence, throughput, recovery, braking, stabilization, dynamic benchmark.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **infer** | New `temporal_claim` predicate type — classify evidence as state/rate/intervention-sensitive | HIGH |
| **pctl-rs** | Bounded-until already models temporal properties; C.27 gives semantic categories for what the bounds mean | MEDIUM |
| **criterium** | Inductive-deductive bridge needs temporal claim typing to distinguish "X is true now" from "X is improving" | MEDIUM |
| **reasoning-apps** | Polymarket confidence engine: classify market signals as state vs trend vs intervention-response | HIGH |

### 2. Quantum-Like Modeling Lens (C.26)

**FPF concept**: Mathematical lens (not physical quantum claim) for handling probe-order effects, incompatible measurements, and instrument-updated states. Prevents treating "the boundary is quantum-like" as one unrouted claim — forces split into probe/order/frame/export pieces.

**Keywords**: quantum-like, QL-lite, QL-NQ, probe frame, order effect, incompatible probes, instrument update, state export, supported coarsening, weakest supported output.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **zz-notation** | QL probe frames map directly to ZZ's meta-reasoning positions — each "probe" is a reasoning stance | HIGH |
| **infer** | Argumentation frameworks already model incompatible positions; QL adds formal probe-order semantics | MEDIUM |
| **pctl-rs** | Belnap four-value logic already handles conflicting evidence; QL lens formalizes why order matters | LOW |

### 3. Controlled Semantic Coarsening (A.6.3.CSC)

**FPF concept**: Disciplined weakening from a stronger source into a narrower-use rendering. Not "simplification as style" but "simplification under a source, use, loss, and reopen card." Every coarsened view must declare: stronger source, weaker rendering, narrower supported use, unsupported heavier use, reopen trigger.

**Keywords**: controlled coarsening, stronger source, weaker rendering, narrower supported use, unsupported heavier use, reopen trigger, redaction, dashboard tile, state-representation shortcut.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **reasoning-apps** | Dashboard tiles in Metabase are exactly CSC — each tile is a coarsened view of the underlying proof envelope | HIGH |
| **ctop** | Token pruning IS controlled semantic coarsening — the "Minimum Sufficient Context" pattern maps 1:1 | HIGH |
| **flowspec** | Assessment reports (like this one) are CSC of the full research — need explicit "reopen trigger" links | MEDIUM |

### 4. Design-Rationale Record (DRR, E.9)

**FPF concept**: Formalized method for recording design decisions with context, consequences, and conceptual auditability. Major update — now constrains ALL normative changes.

**Keywords**: DRR, design rationale, decision record, context, consequences, conceptual auditability.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **flowspec** | Our ADRs are proto-DRRs — align ADR template with E.9 structure (add conceptual auditability field) | MEDIUM |
| **beads** | Issue descriptions should carry DRR-style context/consequences metadata | LOW |

### 5. Discoverability + Recognizability (E.11, A.6.RSIG)

**FPF concept**: First-practical entry discipline — which pattern to use first, "first honest burden," avoiding the "tempting wrong pattern." Description-recognition signatures help users find the right pattern through controlled cues rather than synonym stuffing.

**Keywords**: pattern-entry discoverability, first honest burden, tempting wrong pattern, lawful entry stop, description-recognition signature, thin echo, controlled lexeme.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **flowspec** | `/flow:assess` is literally a discoverability gate — "which workflow do I use first?" Align scoring rubric with E.11 | MEDIUM |
| **fpf-problem-solving-skill** | The skill's router needs updating for new E.11 entry points and A.6.RSIG cues | HIGH |
| **codegraph-rust** | Auto-generated skills (from gap analysis) should use RSIG-style description-recognition cues | LOW |

### 6. ExplanationFaithfulnessProfile (E.17.EFP)

**FPF concept**: Classification of explanation-facing renderings: source-pinned, reconstruction, didactic retelling, speculative retelling. Each type has different evidence-binding strength.

**Keywords**: explanation, rendering, source-pinned, reconstruction, didactic retelling, speculative retelling, evidence binding, admissible faces.

**Eco mapping**:
| Component | Integration | Priority |
|-----------|------------|----------|
| **infer** | Argumentation evidence already has "support" types — EFP adds classification of explanation quality | MEDIUM |
| **reasoning-apps/catalyst** | Legal reasoning needs to distinguish source-pinned evidence from speculative retelling | HIGH |

---

## Scoring Analysis

### Complexity Score: 4.3/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 5/10 | 6 concepts × ~2 days each for integration design |
| Component Count | 5/10 | Touches infer, pctl-rs, zz-notation, reasoning-apps, flowspec, ctop |
| Integration Points | 3/10 | All internal — no external APIs |
| **Average** | **4.3/10** | |

### Risk Score: 1.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security | 1/10 | Pure conceptual/type-system work |
| Compliance | 1/10 | No regulatory implications |
| Data Sensitivity | 3/10 | Reasoning about evidence quality touches data classification |
| **Average** | **1.7/10** | |

### Architecture Impact Score: 5.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 6/10 | Temporal claim typing and QL probe frames are new for the team |
| Breaking Changes | 3/10 | Additive — new predicate types, not API changes |
| Dependencies Affected | 6/10 | Cross-cutting: infer, pctl-rs, zz-notation, reasoning-apps all need alignment |
| **Average** | **5.0/10** | |

### DVF+V
- Value Risk: No (+0) — directly enriches existing reasoning stack
- Usability Risk: No (+0) — developer-facing, not end-user
- Feasibility Risk: Yes (+2) — QL probe semantics are novel
- Viability Risk: No (+0) — internal tooling

**Total Score**: 4.3 + 1.7 + 5.0 + 2.0 = **13.0/30**

## Recommendation: **Spec-Light**

**Confidence**: Medium

Architecture impact (5.0) crosses the threshold. The QL and temporal claim patterns are novel enough to need lightweight specs before implementation, but not complex enough for full SDD.

---

## Vision: New Keywords as Ecosystem Primitives

```
                    FPF v7.0 Keywords
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    TEMPORAL CLAIM    QUANTUM-LIKE    CONTROLLED
     ADEQUACY (C.27)  LENS (C.26)    COARSENING (CSC)
          │               │               │
          ▼               ▼               ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │ infer   │     │ zz-nota │     │ ctop    │
    │temporal_│     │QL probe │     │MSC = CSC│
    │claim()  │     │frames   │     │formalized│
    └────┬────┘     └────┬────┘     └────┬────┘
         │               │               │
         └───────┬───────┘               │
                 ▼                        ▼
           ┌──────────┐           ┌──────────┐
           │ pctl-rs  │           │reasoning │
           │bounded-  │           │-apps     │
           │until +   │           │dashboard │
           │temporal  │           │tiles =   │
           │categories│           │CSC cards │
           └──────────┘           └──────────┘
```

## Next Steps

Create lightweight specs for the top 3 integrations:

1. **infer temporal_claim predicate** — `docs/prd/infer-temporal-claims-spec.md`
2. **ctop ↔ CSC formalization** — document MSC as controlled coarsening
3. **fpf-problem-solving-skill v7.0 update** — align router with E.11 entry points

---

*Assessment generated by /flow:assess workflow*
