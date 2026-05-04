# PRD: Reasoning Universe Architecture — Integration Specification

**Feature ID**: `reasoning-universe-architecture`
**Created**: 2026-05-04
**Status**: Specified
**Assessment**: `docs/assess/reasoning-universe-vision-assessment.md` (Score: 21/30 → Full SDD)
**Author**: @pm-planner

---

## 1. Executive Summary

### Problem

The reasoning-universe has 8 engines, 5 infrastructure components, and 4 tool repos — but they
are **disconnected islands**. The KnowledgeStore (ADR-002) is specified but unimplemented.
Without it, infer cannot receive facts from ZZ, criterium cannot orchestrate the loop, and
rstmdb cannot persist reasoning results. The ecosystem is a collection of tools, not a system.

### Proposed Solution

Implement the **KnowledgeStore Integration Pipeline**: a 4-session plan that wires the core
engines (infer, zz-notation, pctl-rs) through a shared knowledge layer (KnowledgeStore),
orchestrated by criterium with HITL, persisted by rstmdb.

### North Star Metric

**End-to-end loop completion**: A claim can flow from abduction (human hypothesis) → deduction
(infer validates) → KnowledgeStore (persists with provenance) → criterium (tracks assurance)
and back. Target: working demo by end of Session 4.

### Strategic Alignment

- Fills the #1 gap from the assessment: KnowledgeStore is THE bottleneck
- Turns "reasoning universe" from marketing into a demonstrable system
- Grounds MDL × Glushkov in a working integration layer
- Unlocks criterium as a product (epistemic platform)

### Assessment Scores (from assessment report)

| Dimension | Score |
|-----------|-------|
| Complexity | 8/10 |
| Risk | 4/10 |
| Architecture Impact | 9/10 |
| **Total** | **21/30** |

---

## 2. The Honest Architecture Map

### What each project IS (with analog)

```
Engine Layer:
  infer           = Prolog + defeasible + abduction     (DEDUCTION)
  pctl-rs         = PRISM probabilistic model checker   (VERIFICATION)
  zz-notation     = Alloy + Dafny + Belnap truth        (SPECIFICATION)
  obstruct        = SageMath for NP complexity           (ANALYSIS)
  craftegy-algo   = Boost.Graph algorithm batteries      (COMPUTATION)

Epistemic Layer:
  criterium       = Scientific Method as Software        (ORCHESTRATION + HITL)
  FPF             = TRIZ structured invention            (ABDUCTIVE FRAMEWORK)

Infrastructure Layer:
  rstmdb          = Event Store + Temporal durable state  (PERSISTENCE)
  inferense       = Prolog-as-a-Service HTTP API          (API)
  invariantis     = Certificate Transparency log          (AUDIT)
  aivm/axiomvm    = Sandboxed agent runtimes              (EXECUTION)
```

### The philosophical grounding

```
Spinoza  → Deduction   → infer (DEDUCE)        → "What follows logically?"
Peirce   → Abduction   → criterium + HITL       → "What could explain this?"
Hume     → Induction   → Human + pctl-rs verify → "Does evidence match?"
```

**Honest caveat**: The human IS the inductive engine. pctl-rs verifies models — it doesn't
learn from data. This is philosophically coherent with Peirce's pragmatism: knowledge emerges
from the cycle of hypothesis → test → revision, and the human provides empirical grounding.

---

## 3. Integration Architecture

### The KnowledgeStore Pipeline

```
 HUMAN                    criterium                    ENGINES
   │                         │                            │
   │  frames question        │                            │
   ├────────────────────────►│                            │
   │                         │  lower facts to infer      │
   │                         ├───────────────────────────►│ infer
   │                         │                            │ Solver::ask()
   │                         │◄───────────────────────────┤ proof/contradiction
   │                         │                            │
   │                         │  assert result to KB       │
   │                         ├─────┐                      │
   │                         │     ▼                      │
   │                         │ KnowledgeStore             │
   │                         │ (FactEntry + provenance)   │
   │                         │     │                      │
   │                         │     ▼                      │
   │                         │ rstmdb WAL                 │
   │                         │ (persist across sessions)  │
   │                         │                            │
   │  review + decide        │                            │
   │◄────────────────────────┤                            │
```

### Data contracts between components

| From → To | Contract | Data type |
|-----------|----------|-----------|
| criterium → infer | `to_infer_kb()` | `infer_core::KnowledgeBase` |
| infer → criterium | `DeductiveResult` | proof tree + TruthValue |
| criterium → KnowledgeStore | `assert()` | `FactEntry` with provenance |
| KnowledgeStore → criterium | `canonical()` | highest-confidence fact |
| KnowledgeStore → rstmdb | WAL events | `FactAsserted` event (v0.3) |
| criterium → HITL | `AbductivePrompt` | question + candidates |
| HITL → criterium | `HumanAnnotation` | selection + justification |

---

## 4. Functional Requirements

### Session 1: KnowledgeStore (TASK-16)

**Repo**: `zz-notation` — `crates/zz-core/src/knowledge.rs`
**Spec**: ADR-002 (already written, 6 decisions)

| Requirement | Description |
|-------------|-------------|
| FR-1.1 | `FactEntry` struct with: entity_id, field, value, truth (TruthValue), confidence (f64), source, observed_at, seq |
| FR-1.2 | `KnowledgeStore` with dual-index: `Vec<FactEntry>` + `HashMap<(String,String), Vec<usize>>` |
| FR-1.3 | `assert()` — insert fact, auto-detect conflicts, back-patch to `Conflicted` |
| FR-1.4 | `canonical()` — highest confidence wins, seq breaks ties |
| FR-1.5 | `lookup()` — all entries for a pair, insertion order |
| FR-1.6 | `has_conflicts()` / `conflicts()` — report Belnap Conflicted pairs |
| FR-1.7 | `to_infer_kb()` — lower canonical facts to `infer_core::KnowledgeBase` |
| FR-1.8 | `ZZEvaluator` holds `ZZState` + `KnowledgeStore` as distinct fields |

### Session 2: infer Bridge (TASK-5)

**Repo**: `zz-notation` — `crates/zz-core/src/bridge.rs`

| Requirement | Description |
|-------------|-------------|
| FR-2.1 | Entity flattening: entity fields → infer relations `entity_field(EntityId, Value)` |
| FR-2.2 | Fact lowering: ZZ facts → infer Facts with type encoding (Float/Time as tagged strings) |
| FR-2.3 | Query lowering: ZZ field access queries → infer Predicates |
| FR-2.4 | Result wrapping: infer Solutions → ZZ typed values with TruthValue |
| FR-2.5 | KB reconstruction: fresh `infer_core::KnowledgeBase` per evaluation cycle |
| FR-2.6 | Integration test: ZZ fact → infer ask → ZZ result roundtrip |

### Session 3: criterium Wiring

**Repo**: `criterium` — `crates/criterium-deduce/`, `crates/criterium-kb/`

| Requirement | Description |
|-------------|-------------|
| FR-3.1 | `criterium-deduce`: send claims to `infer::Solver::ask()`, receive `DeductiveResult` |
| FR-3.2 | `criterium-kb`: wrap `zz-core::KnowledgeStore` as adapter with per-phase assert methods |
| FR-3.3 | `assert_from_deduction()` — sets source="infer", updates truth from Solver result |
| FR-3.4 | `assert_from_human()` — sets source="human", records HumanAnnotation |
| FR-3.5 | `conflicted_claims()` — surface Belnap::Conflicted for HITL resolution |
| FR-3.6 | AssuranceLevel promotion: L0→L1 on clean deductive pass |
| FR-3.7 | Demo: full loop from CLI — abduct hypothesis → deduce via infer → store → report |

### Session 4: PRs + ARCHITECTURE.md

| Requirement | Description |
|-------------|-------------|
| FR-4.1 | Merge ZZ PRs #13 (Quint bridge) and #14 (SixTruthValue) |
| FR-4.2 | Merge pctl-rs PR #24 (axiom tests) |
| FR-4.3 | Write `ARCHITECTURE.md` at ecosystem root — honest mapping, dependency graph, what's wired vs aspirational |
| FR-4.4 | Sync all beads — backlog tasks → beads issues for ZZ, criterium |

---

## 5. Non-Functional Requirements

| Dimension | Requirement |
|-----------|-------------|
| Performance | `canonical()` must be O(1) lookup; `assert()` O(k) where k = conflict set size |
| Determinism | `to_infer_kb()` must produce identical output for identical KnowledgeStore state |
| Testability | Each session must have unit tests; Session 3 must have an integration test |
| Zero-dependency | KnowledgeStore adds only `chrono` to zz-core; no other new deps |
| Backward compat | Existing ZZ v0.1 programs must continue to work unchanged |

---

## 6. Task Breakdown (Beads Issues)

Creating implementation tasks wired to epics:

### Created Tasks

| Beads ID | Title | Priority | Session | Depends on |
|----------|-------|----------|---------|------------|
| `zse-ufk` | IMPL: zz-core KnowledgeStore (knowledge.rs) per ADR-002 | P1 | 1 | — |
| `zse-sh4` | IMPL: zz-core infer bridge (entity flattening + query lowering) | P1 | 2 | zse-ufk |
| `zse-gg4` | IMPL: criterium-deduce + criterium-kb — real infer + KB wiring | P2 | 3 | zse-sh4 |
| `zse-qyw` | DOCS: Merge open PRs + ecosystem ARCHITECTURE.md | P2 | 4 | zse-gg4 |
| `zse-3hj` | SYNC: Wire 16 zz-notation backlog tasks to beads | P3 | — | — |

---

## 7. Discovery and Validation Plan

### Hypothesis 1: KnowledgeStore is sufficient as the integration layer

**Test**: After Session 1, can infer-core receive facts from KnowledgeStore via `to_infer_kb()`?
**Success**: Unit test passes — `assert()` → `to_infer_kb()` → `Solver::ask()` returns correct result.
**Go/No-Go**: If `to_infer_kb()` doesn't produce correct infer KB, redesign the lowering contract.

### Hypothesis 2: The criterium loop works end-to-end

**Test**: After Session 3, can a claim flow through abduct → deduce → store → report?
**Success**: CLI demo prints proof trace from infer, stores result in KB with provenance, shows L0→L1 promotion.
**Go/No-Go**: If the loop breaks, the data contract between components is wrong.

### Hypothesis 3: The human IS the inductive engine

**Test**: Can a domain expert use criterium CLI to provide hypotheses that infer then validates?
**Success**: Expert frames question, selects hypothesis, infer validates, KB stores — no ML needed.
**Go/No-Go**: If experts can't express hypotheses as facts, ZZ's fact syntax needs extension.

---

## 8. Acceptance Criteria

### Definition of Done (per session)

| Session | Done when |
|---------|-----------|
| 1 | `cargo test -p zz-core` passes with 10+ KnowledgeStore tests |
| 2 | Integration test: ZZ fact → infer ask → ZZ result roundtrip works |
| 3 | `cargo run -p criterium` runs full demo loop with real infer calls |
| 4 | PRs merged, ARCHITECTURE.md committed, beads synced |

### Quality Gates

- All sessions: `cargo test` passes, `cargo clippy` clean
- Session 3: demo produces human-readable output (proof trace + KB state)
- Session 4: ARCHITECTURE.md reviewed by human before merge

---

## 9. Dependencies and Constraints

| Dependency | Status | Risk |
|------------|--------|------|
| ADR-002 (KnowledgeStore spec) | Written | None — spec is complete |
| infer-core Solver API | Stable | Low — API hasn't changed in weeks |
| chrono crate (for observed_at) | Available | None |
| zz-core existing code (truth.rs, state.rs) | Working | Low — v0.1 tests pass |
| criterium workspace | Scaffolded | Low — compiles, demo runs |

---

## 10. Success Metrics

### North Star

**End-to-end loop completion**: a claim flows from human hypothesis → infer deduction → KnowledgeStore persistence → criterium AssuranceLevel tracking.

### Leading Indicators

- KnowledgeStore `assert()` + `canonical()` test count ≥ 10
- infer bridge roundtrip test passes on first attempt
- criterium demo prints real proof trace (not stubs)

### Lagging Indicators

- All 4 sessions completed
- ARCHITECTURE.md describes what's wired vs. aspirational honestly
- No beads tasks left unsynced

---

## Example Reference

**Existing example demonstrating the pattern**: `reasoning-universe/infer/examples/emex_copilot_session.infer`

This example shows infer validating a governance ruleset — facts asserted, rules fired, proof trees generated. The KnowledgeStore + criterium integration should produce the same kind of output: structured facts in, proof traces out, AssuranceLevel tracked.

---

*PRD generated by /flow:specify — reasoning-universe-architecture*
