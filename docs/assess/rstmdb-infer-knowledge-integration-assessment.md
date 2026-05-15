# Feature Assessment: RSTMDB × Infer — Knowledge-Rule WAL Integration

**Date**: 2026-04-10
**Assessed By**: Claude AI Agent
**Status**: Assessed

---

## Feature Overview

Position RSTMDB as the natural Write-Ahead Log (WAL) for formal knowledge systems by adding first-class integration with the Infer engine. Concretely:

1. **knowledge-rule state machine template** — a built-in template where states map to proof stages and transitions map to rule applications (derivation steps, axiom firings, constraint resolutions).
2. **WATCH_ALL --filter knowledge-rule preset** — a real-time observation mode that streams all knowledge-rule state transitions across a system, enabling reactive architectures built on *proven* facts.

The strategic claim: no existing workflow engine is designed for formal knowledge systems. RSTMDB + Infer would own that niche.

---

## Tool Landscape — Where RSTMDB Sits

Before scoring, the comparison context matters. These tools operate at fundamentally different abstraction levels:

| Tool | Paradigm | Primary User | Core Metaphor | Weakness |
|---|---|---|---|---|
| **Camunda** | BPMN diagram engine | Business analyst / ops | Workflow as *swimlane diagram* | Heavy JVM stack, BPMN is lossy for code-centric flows |
| **Flowable** | BPMN/CMMN/DMN engine | Java devs, embedded use | Workflow as *standard* | Lighter than Camunda but same fundamental paradigm |
| **Temporal.io** | Durable execution platform | Backend engineers | Workflow as *code* (replayed deterministically) | No native concept of proof/logic — just retry semantics |
| **RSTMDB** | State machine database | Systems / AI engineers | Workflow as *state transition record* | Currently no formal knowledge-system affordances |

### The Gap All Four Miss

Camunda/Flowable model *human + system business processes*. Temporal models *long-running distributed computations*. None of them have a first-class concept of a **provable state transition** — one where the transition itself carries a machine-verifiable justification (a rule, a proof step, an axiom application).

This is the niche: **workflow as proof**.

| Capability | Camunda | Flowable | Temporal | RSTMDB+Infer |
|---|---|---|---|---|
| Audit trail | ✅ | ✅ | ✅ | ✅ |
| Deterministic replay | ❌ | ❌ | ✅ | ✅ (WAL) |
| Proof-backed transitions | ❌ | ❌ | ❌ | ✅ (killer feature) |
| Knowledge-rule templates | ❌ | ❌ | ❌ | ✅ (proposed) |
| Talk-to-data integration | ❌ | ❌ | ❌ | ✅ (via Infer RSI) |
| Retro/gap analysis | ❌ | ❌ | ❌ | ✅ (Infer RSI) |

---

## Scoring Analysis

### Complexity Score: 6.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 7/10 | ~1–2 weeks: new template type, new CLI filter preset, Infer integration layer, schema for proof-annotated transitions |
| Component Count | 6/10 | RSTMDB core engine, template registry, CLI/WATCH subsystem, Infer adapter, documentation |
| Integration Points | 7/10 | Infer engine (existing), RSTMDB state machine runtime, CLI, SDK surface area, potentially streaming/pub-sub for WATCH_ALL |
| **Average** | **6.7/10** | |

### Risk Score: 1.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 2/10 | Developer tooling, no user PII, no external exposure; proof payloads are internal logic |
| Compliance Requirements | 1/10 | None — this is infrastructure tooling |
| Data Sensitivity | 2/10 | Knowledge rules and state transitions are not sensitive data |
| **Average** | **1.7/10** | |

### Architecture Impact Score: 5.3/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 8/10 | "Proof-backed state transition" is a genuinely novel architectural primitive — no existing tool has this first-class. WAL-as-knowledge-log is a new pattern in this domain. |
| Breaking Changes | 3/10 | Purely additive — new template type, new CLI flag. Existing RSTMDB users unaffected. |
| Dependencies Affected | 5/10 | Creates a deliberate coupling between RSTMDB and Infer. Other systems consuming RSTMDB events need to understand the new transition schema if they want to act on proofs. |
| **Average** | **5.3/10** | |

---

## Overall Assessment

**Total Score**: 13.7/30
**Recommendation**: Spec-Light
**Confidence**: Medium-High

### Rationale

The total (13.7) and multiple dimension averages ≥ 4 put this firmly in Spec-Light territory. It is NOT Full SDD because:
- Risk is negligible (pure developer tooling)
- No breaking changes
- The implementation, once designed, is straightforward extension of existing RSTMDB primitives

It is NOT Skip SDD because:
- The "proof-backed transition" pattern is novel and needs design-level thinking before code
- The Infer adapter interface must be defined carefully to remain decoupled
- The WATCH_ALL preset semantics need spec (what exactly does a consumer receive? proof hash? rule ID? full derivation tree?)

### Key Factors

- **Complexity**: Moderate — the engineering is not hard, but the *interface design* requires care
- **Risk**: Minimal — internal tooling, additive only
- **Impact**: High strategic signal — the "workflow as proof" position is unoccupied and defensible

### The Killer Feature Verdict

**Yes, this is a meaningful differentiator.** Specifically:

1. **alphaXIV and similar tools** can chat about research but cannot prove claims or audit derivation steps. RSTMDB with proof-backed transitions makes the derivation history *machine-auditable*.

2. **The WAL metaphor is correct and powerful.** A database WAL gives you durability + replay. A knowledge WAL gives you *epistemic durability* — you can replay exactly how a conclusion was reached, step by step, with the rules that justified each transition. No workflow engine offers this.

3. **The template + preset combo is the right surface area.** Don't expose raw proof APIs — expose opinionated templates. `knowledge-rule` template = sensible defaults for proof stage states. `WATCH_ALL --filter knowledge-rule` = one-liner to stream the "what just got proven" feed. This is the Temporal philosophy applied to formal knowledge: *workflow as code* → *workflow as proof*.

4. **Network effect within the ecosystem.** Once the Science Genealogy platform, RSI index, and any other Infer consumers use RSTMDB as their WAL, the dataset of proof traces becomes itself a knowledge artifact — queryable, cross-referenceable, gap-analyzable.

### What Needs Speccing (Spec-Light scope)

Before implementation:
- Define the `knowledge-rule` state schema: what fields does a proof-annotated transition carry? (rule_id, proof_hash, derivation_depth, confidence_score, source axioms?)
- Define the Infer adapter interface: push vs pull? event callback vs polling?
- Define WATCH_ALL payload contract: what does a consumer receive per event?
- Define template lifecycle: which states are mandatory (e.g., `UNPROVEN → CANDIDATE → PROVEN → RETRACTED`)?

---

## Next Steps

### Spec-Light Path (Recommended)

```bash
# 1. Create lightweight spec
# ./docs/prd/rstmdb-infer-knowledge-integration-spec.md
# Include: state schema, adapter interface, WATCH_ALL contract, template lifecycle

# 2. Proceed to implementation
/flow:specify rstmdb-infer-knowledge-integration
```

### Suggested Spec Structure

```
1. Problem Statement
   - Why existing WALs are insufficient for formal knowledge systems
2. knowledge-rule State Machine Template
   - Required states and valid transitions
   - Proof annotation schema per transition
3. Infer Adapter Interface
   - Event contract (push/pull, payload structure)
4. WATCH_ALL --filter knowledge-rule Preset
   - Consumer payload spec
   - Filtering semantics
5. Acceptance Criteria
6. Out of Scope (v1)
```

### Override

```bash
# Force full SDD (if the Infer adapter turns out more complex)
/flow:assess rstmdb-infer-knowledge-integration --mode full

# Force skip SDD (if prototyping first)
/flow:assess rstmdb-infer-knowledge-integration --mode skip
```

---

*Assessment generated by /flow:assess workflow*
