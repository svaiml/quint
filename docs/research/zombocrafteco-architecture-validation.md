# ZomboCraftEco Architecture Validation Research

> **Date**: 2026-05-04
> **Task**: docs-59jx
> **Status**: Complete — Proceed with Caution
> **Question**: Is the current architecture sound enough to implement, or does it need a redesign pass?

---

## Verdict

**Proceed with Caution. Architecture is correct. Sequence is the only risk.**

The layered ZZ→infer→criterium→pctl-rs stack is industry-validated, dependency directions are correct, and Option B composition is the right pattern. Three of the five missing bridges are mechanical. Two (Bridges 4/5: axiomvm/aivm→infer) require schema contract design before any code is written — but they are NOT blocking the product MVP.

One bug and one known implementation gap must be addressed before criterium's HITL loop can function as designed.

---

## Technical Findings

### Architecture Pattern: Sound

Option B composition (criterium wraps zz-core::KnowledgeStore by value, adds AssuranceMetadata per-fact) is validated by industry precedents:
- Tokio `Mutex<T>` wraps std with async semantics
- Bevy ECS: components composed alongside core types
- Polkadot Substrate: `OverlayedChanges` wraps backend storage with transaction semantics
- Datomic/XTDB: immutable EAV triples with provenance — same pattern as zz-core

Dependency direction (`criterium → zz-core`, not reverse) is correct. The epistemic hierarchy flows data → knowledge → reasoning without circular deps.

### Bridge-by-Bridge Assessment

| Bridge | Classification | Estimate | Verdict |
|--------|---------------|----------|---------|
| 3: BelnapFourValue ↔ TruthValue | Mechanical 4-arm From/Into | 2 hours | **Go now** |
| 1: criterium → zz-core (3 mechanical changes) | Mechanical | 1 day | **Go now** |
| 2: AssuranceLevel loop → infer verbs | Needs session model decision first | 3-5 days after decision | **Design first, then Go** |
| 4: axiomvm → infer | Schema contract undefined | 1-2 weeks design + impl | **Design first, not blocking MVP** |
| 5: aivm → infer | Schema contract undefined | 1-2 weeks design + impl | **Design first, not blocking MVP** |

### Two Items That Need Fixing Before Bridges 1/2

**Bug: `zz-types::TruthValue.or(Unknown, Conflicted)` returns `Conflicted`; should return `True`**

The pctl-rs implementation returns `True` for `join(Unknown, Conflicted)` — which is the correct bilattice LUB (least upper bound on the truth ordering for two incomparable elements). The `zz-types` implementation returns `Conflicted`. This is inconsistent with the declared bilattice structure. Will produce silent wrong answers in any ZZ invariant that ORs Unknown with Conflicted.

```rust
// zz-types/src/lib.rs — WRONG
(Unknown, Conflicted) | (Conflicted, Unknown) => Conflicted,
// Should be:
(Unknown, Conflicted) | (Conflicted, Unknown) => True,
```

File and fix before Bridge 3.

**Known gap: `KnowledgeStore` v0.1 is last-write-wins, not the full ADR-002 conflict-detection spec**

The current `store.rs` `insert()` method overwrites on duplicate key. ADR-002 describes conflict detection where a second contradictory assertion triggers back-patching to `Conflicted`. This is not implemented. Bridge 1 wires criterium to the v0.1 store — the HITL conflict-surfacing feature depends on the full store. Design criterium-kb's wrapper around the v0.1 semantics explicitly; do not assume conflict detection is live.

### Bridge 3 semantic note

From/Into is safe across all four variants. However, one genuine semantic divergence was found:
- `zz-types::TruthValue.or(Unknown, Conflicted)` → `Conflicted` (has the bug)
- `pctl-rs::BelnapFourValue.join(Unknown, Conflicted)` → `True` (correct)

Once the bug is fixed, the round-trip `BelnapFourValue::X.into::<TruthValue>().into::<BelnapFourValue>()` is loss-free across all four variants.

Additional: `zz-types::TruthValue` does not implement `Serde`. This must be added before criterium-kb can serialize facts to rstmdb.

### Bridges 4/5: Not Blocking, But Define the Contract

axiomvm `ExecutionResult` carries `result: serde_json::Value` (arbitrary JSON). aivm agents return `Vec<u8>` (raw bytes). Neither maps to `infer_core::Fact` tuples without a schema contract. Two options:
- Convention: axiomvm programs that intend to produce infer-facts return a specific JSON shape `{entity_type, entity_id, field, value, truth}`
- Configuration: a mapping layer between result field paths and infer relation arguments

This design decision does not need to be made before MVP. Bridges 4/5 are not on the critical path to the first proof tree.

---

## Business Findings

### The Core Tension

The architecture was designed for epistemic correctness. The market rewards epistemic *confidence*. A user asking "did Transformer attention descend from Hopfield networks?" does not need a Belnap four-valued proof tree on day one — they need an answer more trustworthy than a hallucination and more structured than a citation list. The architecture can deliver the proof tree. The question is whether the full stack is needed before the first increment of trust lands.

### Competitive Position

**alphaXIV**: Discovery + social layer. Gives similarity scores and paper lists. Does not and cannot give proof trees. Complementary, not competing on the formal provenance axis.

**LLM systems (GraphRAG, NotebookLM, Perplexity)**: Commoditize "find related papers." This is an accelerator for differentiation, not a threat — every hallucinated citation is evidence for why provable chains matter. The threat is if proof trees take 6+ more months while the retrieval wave crests.

**Real competitive threat**: A well-funded team (Allen AI, Semantic Scholar) decides to build formal provenance on top of an existing 200M paper graph. 6-12 month window before they catch up on surface features.

### Minimal Viable Wiring (MVW)

The minimum to deliver the first user-visible proof tree:

1. Fix `TruthValue.or()` bug
2. Bridge 3: BelnapFourValue ↔ TruthValue (2 hours)
3. Bridge 1: three mechanical changes + composition wrapper (1 day)
4. Bridge 2 session model decision (design note, not code — make the decision)
5. Wire a single DEDUCE path on one real science genealogy claim
6. Minimal read surface: CLI/API returning human-readable proof tree with epistemic grades

**What is NOT in MVW**: criterium full HITL loop, pctl-rs confidence intervals, axiomvm/aivm wiring, KnowledgeStore conflict detection. These are Phase 2.

**Time estimate**: 2-3 weeks of focused work if the Bridge 2 session model decision is made this week.

---

## Recommended Sequence

**This week**
1. Make the Bridge 2 session model decision: how does `Claim.advance()` condition on actual infer results? Write a one-page design note.
2. Fix `TruthValue.or(Unknown, Conflicted)` bug
3. Implement Bridge 3 (From/Into, add Serde to TruthValue)

**Week 2**
4. Implement Bridge 1 (3 mechanical changes + composition wrapper in criterium-kb)
5. Wire one DEDUCE path on the ecosystem's own provenance claim as the first proof tree

**Week 3**
6. Build minimal read surface: API or CLI that returns proof tree + epistemic grades for one claim
7. Find one external user to react to the output

**Week 4-6 (conditional on external signal)**
8. Positive signal: extend to 3-5 claims, begin KnowledgeStore conflict detection, plan criterium HITL
9. Flat signal: positioning pivot before writing more infrastructure

**Bridges 4/5**: Do not start until MVW is shipped and externally validated.

---

## Opportunity Score Summary

| Dimension | Score | Notes |
|-----------|-------|-------|
| Strategic Fit | 8/10 | Formal provability is a real, defensible, unoccupied position |
| Competitive Moat | 9/10 | Rust + formal logic + HITL is near-impossible to replicate quickly |
| Execution Feasibility | 5/10 | 1-2 people, 5 bridges, product features = dangerous spread |
| Time-to-Market Risk | 8/10 (bad) | Full stack wiring without MVW time-box = 6-12 months to nothing user-visible |

The architecture is the product's soul. It is not the product's first sentence.

---

## Follow-up Tasks

See: docs-cxsp (TruthValue bug), docs-r7qu (Bridge 3), docs-p8mq (Bridge 2 design note), docs-mvw1 (Wire first proof tree)
