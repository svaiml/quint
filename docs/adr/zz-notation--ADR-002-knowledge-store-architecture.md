# ADR-002: ZZ Knowledge Store Architecture

## Status

Accepted

## Context

ZZ Notation's architecture (`docs/architecture.md`) lists `zz-core/knowledge.rs` as a critical
module responsible for:

- Storing asserted facts with provenance metadata (source, confidence, observed_at)
- Detecting conflicts (same subject + predicate, different values)
- Providing a query interface to the evaluator
- Lowering facts into `infer-core::KnowledgeBase` for Horn-clause deduction

However, no concrete specification exists for this module. The docs describe **what** it should
do, but not **how** — no data structures, no query API, no conflict resolution algorithm, no
persistence strategy. This gap blocks TASK-5 (infer-core bridge) and all downstream work.

Three confounded concepts must be cleanly separated:

| Concept | What it is | Where it lives |
|---------|-----------|----------------|
| **State** | Mutable field values during evaluation — can change via transitions | `zz-core/state.rs` — `ZZState` |
| **Knowledge** | Asserted facts about the domain — immutable once asserted, accumulate over time | `zz-core/knowledge.rs` — `KnowledgeStore` |
| **Persistence** | Cross-session storage of facts and decisions | `rstmdb` (v0.2+) |

This ADR specifies the `KnowledgeStore` design that sits in the **Knowledge** layer.

---

## Decision 1: Data Structure — Indexed Fact Store

### Options considered

| Option | Pros | Cons |
|--------|------|------|
| A. Flat `Vec<Fact>` | Simple, minimal code | O(n) lookup; no conflict detection at insert |
| B. `HashMap<(EntityId, FieldName), Vec<FactEntry>>` | O(1) lookup; groups by subject+predicate | Loses insertion order; harder to iterate all facts |
| C. Dual-index: primary Vec + inverted HashMap | O(1) lookup + insertion order preserved | Slightly more memory; two structures to keep in sync |
| D. External crate (sled, SQLite) | Persistent by default | Adds dependency; overkill for in-memory evaluation |

**Decision**: **Option C** — primary `Vec<FactEntry>` plus inverted index
`HashMap<(EntityId, FieldName), Vec<usize>>` (indices into the Vec).

**Rationale**: O(1) lookup is required for the hot path (evaluator queries on every field access).
Insertion order matters for provenance ordering and deterministic output. Adding an external crate
contradicts the zero-dependency philosophy of the `zz-core` crate. The dual-index overhead is
negligible at evaluation-time scales (hundreds to low thousands of facts).

### Rust types

**Updated 2026-05-04**: Added `entity_type` as a first-class field. ZZ's domain model uses
typed entities (`fact server("api-1").status = "online"` — entity_type=`server`, entity_id=`api-1`,
field=`status`). The original 2-key `(entity_id, field)` model lost entity_type, which is required
for `forall`/`exists` quantification over typed collections and for type-checked field access.
The primary index is now 3-key `(entity_type, entity_id, field)`. External callers (criterium,
infer bridge) that don't have entity types can pass `entity_type = ""`.

```rust
/// A single asserted fact with full provenance.
#[derive(Debug, Clone)]
pub struct FactEntry {
    pub entity_type: String,           // ZZ entity type: "server", "service", etc.
    pub entity_id:   String,           // instance: "api-1", "db-primary", etc.
    pub field:       String,           // field name: "status", "tls", etc.
    pub value:       Literal,          // ZZ's AST value type (String, Bool, Int, Float)
    pub truth:       TruthValue,       // Belnap: True / False / Unknown / Conflicted
    pub confidence:  f64,              // [0.0, 1.0]
    pub source:      String,           // origin: "source", "infer", "human", etc.
    pub observed_at: chrono::DateTime<chrono::Utc>,
    pub seq:         u64,              // monotonic insert sequence — tie-break for ordering
}

/// The primary knowledge store for a ZZ evaluation session.
pub struct KnowledgeStore {
    /// All facts in insertion order.
    facts: Vec<FactEntry>,
    /// (entity_type, entity_id, field) → indices into `facts` for O(1) lookup.
    index: HashMap<(String, String, String), Vec<usize>>,
    /// entity_type → ordered list of entity_ids (for forall/exists quantification).
    entity_roster: HashMap<String, Vec<String>>,
    /// Monotonic counter for `seq` assignment.
    seq:   u64,
}
```

---

## Decision 2: Query API

### Options considered

| Option | Description |
|--------|-------------|
| A. `lookup(entity_id, field) -> Vec<&FactEntry>` | Returns all entries for a subject+predicate pair |
| B. `lookup_one(entity_id, field) -> Option<&FactEntry>` | Returns the single "winning" entry per policy |
| C. Both A and B | Evaluator uses B for expression evaluation, A for conflict inspection |
| D. Iterator-based: `facts_for(entity_id, field) -> impl Iterator<Item=&FactEntry>` | Lazy; composable |

**Decision**: **Option C + D** — expose all three surfaces:

```rust
impl KnowledgeStore {
    /// Assert a new fact. Returns the assigned seq number.
    /// Automatically updates truth to Conflicted if a contradicting fact exists.
    pub fn assert(&mut self, entry: FactEntry) -> u64;

    /// All entries for a given entity+field, in insertion order.
    pub fn lookup(&self, entity_id: &str, field: &str) -> &[FactEntry];

    /// The single "canonical" entry per the conflict resolution policy.
    /// Returns None if no facts exist for the pair.
    pub fn canonical(&self, entity_id: &str, field: &str) -> Option<&FactEntry>;

    /// Iterator over all facts (for infer-core lowering, persistence, etc.).
    pub fn all_facts(&self) -> impl Iterator<Item = &FactEntry>;

    /// All facts about a specific entity (across all fields).
    pub fn facts_for_entity(&self, entity_id: &str) -> impl Iterator<Item = &FactEntry>;

    /// Number of facts currently stored.
    pub fn len(&self) -> usize;

    /// True if any pair has TruthValue::Conflicted.
    pub fn has_conflicts(&self) -> bool;

    /// All (entity_id, field) pairs with conflicting facts.
    pub fn conflicts(&self) -> Vec<(&str, &str)>;
}
```

**Rationale**: `canonical()` is the hot-path method the evaluator calls for field resolution.
`lookup()` is used for conflict reporting and explanation. `all_facts()` / `facts_for_entity()`
are used by the infer-core bridge (TASK-5) to build the `KnowledgeBase` for each evaluation
cycle.

---

## Decision 3: Conflict Detection and Resolution

### The conflict model

A **conflict** exists when two `FactEntry` values share the same `(entity_id, field)` but have
different `value` fields. This mirrors the Belnap `Conflicted` (⊤) truth value — the system
**knows both B and ¬B**, which is a defined, useful state, not an error.

### Options considered

| Option | Description | When to use |
|--------|-------------|-------------|
| A. Last-write-wins | Most recent `seq` is canonical | Simple; loses provenance |
| B. Highest-confidence-wins | `confidence` field determines canonical | Good for sensor fusion |
| C. Belnap accumulation | All facts coexist; truth is `Conflicted`; caller decides | Correct for reasoning |
| D. Source-priority policy | Configurable per-source ranking | Flexible; complex config |

**Decision**: **Option C (Belnap accumulation) as the default, with `canonical()` implementing
highest-confidence-wins as a pragmatic read policy.**

Specifically:
- `assert()` inserts the new fact and **marks the `truth` of all entries for that pair as
  `TruthValue::Conflicted`** if any other entry has a different value
- `canonical()` returns the entry with the highest `confidence`; ties broken by highest `seq`
  (most recent)
- The evaluator uses `canonical()` for expression evaluation (it needs a single value)
- The explainer uses `lookup()` to report all conflicting entries and their provenance

```rust
// Conflict detection in assert():
pub fn assert(&mut self, mut entry: FactEntry) -> u64 {
    let key = (entry.entity_id.clone(), entry.field.clone());
    let existing = self.index.get(&key).cloned().unwrap_or_default();

    let has_conflict = existing.iter().any(|&i| self.facts[i].value != entry.value);
    if has_conflict {
        entry.truth = TruthValue::Conflicted;
        // Back-patch all existing entries for this pair to Conflicted
        for &i in &existing {
            self.facts[i].truth = TruthValue::Conflicted;
        }
    }
    // ... insert entry, update index
}
```

**Rationale**: Belnap's four-valued logic is a first-class design constraint of ZZ (see
`truth.rs`, research docs). Silently discarding conflicting facts (last-write-wins) destroys
provenance and prevents explanation. The `Conflicted` state propagates correctly through the
evaluator's truth engine. Using confidence as the `canonical()` tie-break is pragmatic and
consistent with how ZZ facts carry confidence scores.

---

## Decision 4: Relationship to `ZZState`

`ZZState` (`state.rs`) and `KnowledgeStore` are **distinct, non-overlapping stores**:

| Dimension | `ZZState` | `KnowledgeStore` |
|-----------|-----------|-----------------|
| Content | State declaration field values | Asserted facts about domain entities |
| Mutability | Mutable via transitions | Append-only during a session |
| Provenance | None (evaluator-internal) | Full (source, confidence, observed_at) |
| Truth values | Derived from evaluation | Carried per-fact |
| Lifetime | Single evaluation cycle | Entire session (or longer with persistence) |
| ZZ syntax | `state Infrastructure { ... }` | `fact server("api-1").status = "up"` |
| infer-core bridge | Not lowered to infer | Lowered to `KnowledgeBase` facts |

The evaluator holds **both** during execution:

```rust
pub struct ZZEvaluator {
    pub state:     ZZState,          // mutable state fields
    pub knowledge: KnowledgeStore,   // asserted facts with provenance
    // ...
}
```

---

## Decision 5: Persistence Bridge (rstmdb, v0.2+)

In v0.1, `KnowledgeStore` is **entirely in-memory** and is rebuilt fresh for each evaluation
session. Persistence is a v0.2 concern.

When persistence is added, the bridge will follow the rstmdb pattern:

```
KnowledgeStore::assert(fact)
    → WAL event: FactAsserted { entity_id, field, value, truth, confidence, source, observed_at }
    → rstmdb stores event in append-only log
    → On session restore: replay WAL events → rebuild KnowledgeStore

KnowledgeStore::conflicts()
    → rstmdb guard re-evaluates downstream decisions
    → Stale decisions flagged automatically (rstmdb's existing mechanism)
```

**Why not now**: Persistence requires defining the WAL event schema, the rstmdb schema, and the
serialization format. These are non-trivial and out of scope for the v0.1 evaluator. The
in-memory interface defined here is persistence-agnostic — adding rstmdb in v0.2 will not change
the `KnowledgeStore` public API.

---

## Decision 6: infer-core Lowering Contract

For each evaluation cycle, the ZZ evaluator lowers `KnowledgeStore` to an
`infer_core::KnowledgeBase` using only **canonical** facts:

```rust
pub fn to_infer_kb(&self) -> infer_core::KnowledgeBase {
    let facts: Vec<infer_core::Fact> = self
        .all_facts()
        .filter_map(|e| {
            // Only lower canonical (non-conflicted or highest-confidence) entries
            let canonical = self.canonical(&e.entity_id, &e.field)?;
            if std::ptr::eq(e, canonical) {
                Some(lower_fact(e))  // entity_field(EntityId, Value) relation
            } else {
                None
            }
        })
        .collect();
    infer_core::KnowledgeBase::new(/* domains, relations */ facts, vec![])
}
```

**Invariant**: `to_infer_kb()` is deterministic for the same `KnowledgeStore` state. Conflicting
facts are **not** discarded — they remain in the store for explanation — but only one canonical
entry per pair is lowered to infer-core.

---

## Consequences

### Positive

- `KnowledgeStore` is now fully specified: implementable as a single Rust file without ambiguity
- Belnap semantics are preserved end-to-end (assertion → conflict detection → truth propagation)
- Conflict detection is automatic at `assert()` time — the evaluator doesn't need to check
- The evaluator's hot path (`canonical()`) is O(1)
- `to_infer_kb()` gives a clean, deterministic contract for the infer-core bridge (TASK-5)
- State and Knowledge are cleanly separated — no conflation of mutable state with asserted facts

### Negative

- Dual-index means two data structures must stay in sync — a bug in `assert()` could
  corrupt the index (mitigated by unit tests on every `assert()` path)
- Back-patching existing entries to `Conflicted` in `assert()` is a linear scan over the
  conflicting entries (acceptable: conflict sets are tiny in practice)
- `canonical()` losing a conflict (returning one entry when two exist) could surprise users
  who expect the conflict to propagate — mitigated by explicit `has_conflicts()` and
  `conflicts()` APIs

### Neutral

- rstmdb persistence deferred to v0.2; the in-memory interface is deliberately persistence-agnostic
- The `chrono` dependency is added to `zz-core` for `observed_at` timestamps

## Unblocks

- **TASK-5** (infer-core bridge) — now has a fully specified `KnowledgeStore` to build on
- **TASK-16** (implement `knowledge.rs`) — new task, direct implementation of this ADR
- Downstream: evaluator fact assertions, conflict reporting, explanation traces

## References

- [Architecture v2](../architecture.md) — ZZ dual-layer model
- [ZZ Deep Dive Open Questions](../assess/zz-deep-dive-open-questions.md) — §3-§6 bridge analysis
- [ZZ Architecture v2 Assessment](../assess/zz-architecture-v2.md) — KnowledgeStore requirements
- [TASK-5](../../backlog/tasks/task-5%20-%20infer-core-bridge-entity-flattening-query-lowering.md) — infer bridge (depends on this ADR)

---

*This ADR follows the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).*
