# Cross-Ecosystem Alignment: zz-core ↔ criterium-kb

> **Status**: Research — verified against actual source code
> **Last updated**: 2026-05-04
> **Repos**: zombocrafteco/reasoning-universe/zz-notation · zombocrafteco/epistemic-universe/criterium
> **Related**: epistemic-oracle-mapping.md, docs-ojqt (counterfactual gap)

---

## 1. What the Code Actually Says

### zz-core (zz-notation/crates/zz-core/src/store.rs)

```rust
// KnowledgeStore — indexed by (entity_type, entity_id, field)
pub struct KnowledgeStore {
    facts: HashMap<(String, String, String), (Literal, TruthValue)>,
    entities: HashMap<String, Vec<String>>,
}
```

No `FactEntry` struct exists. Facts live as `(Literal, TruthValue)` tuples in the HashMap.
`TruthValue` is a proper Belnap FOUR enum (True/False/Unknown/Conflicted) with AND, OR, NOT.
`Literal` is a proper AST enum (String/Integer/Float/Boolean/Null).

**What zz-core does NOT have**: confidence, source, seq, assurance, timestamps.

### criterium-kb (crates/criterium-kb/src/lib.rs)

```rust
pub struct FactEntry {
    pub entity_id:   String,          // missing: entity_type
    pub field:       String,
    pub value:       String,          // should be: Literal
    pub truth:       String,          // should be: TruthValue
    pub confidence:  f64,             // criterium-only metadata
    pub source:      String,          // criterium-only metadata
    pub observed_at: DateTime<Utc>,   // criterium-only metadata
    pub assurance:   AssuranceLevel,  // criterium-only, stays here
}
```

### criterium-core (crates/criterium-core/src/lib.rs)

```rust
pub enum AssuranceLevel { Abduced=0, Deduced=1, Induced=2, Operational=3 }

pub struct Claim {       // IN-FLIGHT work item through the loop
    pub id:              Uuid,
    pub title:           String,
    pub description:     String,
    pub assurance_level: AssuranceLevel,
    pub created_at:      DateTime<Utc>,
    pub updated_at:      DateTime<Utc>,
}
```

**zz-core::Decision**: does not exist yet — neither in zz-notation nor criterium.
**Cargo wiring**: `criterium-kb/Cargo.toml` has `# TODO: Link to zz-core when ready` — the bridge is planned but not implemented.

---

## 2. Complete Mismatch Table (from code, not description)

| Field | zz-core (actual) | criterium-kb (actual) | Resolution |
|-------|-----------------|----------------------|------------|
| `entity_type` | key component of HashMap key | **MISSING** | Add to FactEntry — required for multi-entity-type stores |
| `entity_id` | key component | `entity_id: String` ✓ | matches |
| `field` | key component | `field: String` ✓ | matches |
| `value` | `Literal` (5-variant enum) | `String` — simplified | **Migrate** to `Literal` when zz-core dep added |
| `truth` | `TruthValue` (Belnap enum, with AND/OR/NOT) | `String` — stringly typed | **Migrate** to `TruthValue` enum |
| `confidence` | absent | `f64` ✓ | **criterium-only** — stays in wrapper |
| `source` | absent | `String` ✓ | **criterium-only** — stays in wrapper |
| `observed_at` | absent | `DateTime<Utc>` ✓ | **criterium-only** — stays in wrapper |
| `assurance` | absent | `AssuranceLevel` ✓ | **criterium-only by design** — stays |
| `seq: u64` | absent (not in code) | absent | Future WAL ordering field — not yet in either |

---

## 3. The Three Mechanical Changes

All three are **deferred to the criterium wiring session** (zse-gg4). Nothing needs changing now.

### Change 1 — Add `entity_type` to criterium-kb::FactEntry

```rust
// BEFORE
pub struct FactEntry {
    pub entity_id: String,
    // ...
}

// AFTER
pub struct FactEntry {
    pub entity_type: String,   // ← add
    pub entity_id:   String,
    // ...
}
```

**Why**: zz-core's KnowledgeStore is indexed by `(entity_type, entity_id, field)`. Without `entity_type`, criterium cannot use zz-core's store as a backend — it can only represent one entity type per store instance.

### Change 2 — `truth: String` → `truth: TruthValue`

```rust
// BEFORE
pub truth: String,  // "True" / "False" / "Unknown" / "Conflicted"

// AFTER
pub truth: zz_types::TruthValue,  // enum with Belnap AND/OR/NOT
```

**Why**: `String` truth values are parse-error-prone and lose the Belnap algebra. Once criterium depends on zz-core (which re-exports `TruthValue` from zz-types), this is a one-line change in the struct plus serde rename annotations if needed.

### Change 3 — `value: String` → `value: zz_ast::Literal`

```rust
// BEFORE
pub value: String,

// AFTER
pub value: zz_ast::Literal,  // String | Integer | Float | Boolean | Null
```

**Why**: Knowledge about numeric metrics (latency: 140, error_rate: 0.003) is stored as strings today. Infer and pctl-rs operate on typed values. The Literal enum is the correct shared type.

---

## 4. The Bridge Architecture — Option B (correct)

zz-core should not know about criterium's loop. AssuranceLevel is criterium's epistemic machinery — it encodes position in the abduction→deduction→induction cycle. zz-core only needs to be a high-quality Belnap fact store.

```
┌─────────────────────────────────────────────────────────────┐
│ criterium-kb                                                 │
│                                                              │
│  CriteriumFact {                                             │
│      fact:       zz_core::FactKey,   ← (entity_type, id, field)  │
│      assurance:  AssuranceLevel,     ← criterium's concept        │
│      confidence: f64,                ← criterium's concept        │
│      source:     String,             ← criterium's concept        │
│      observed_at: DateTime<Utc>,     ← criterium's concept        │
│  }                                                           │
│                                                              │
│  KnowledgeStoreAdapter {                                     │
│      inner:    zz_core::KnowledgeStore,  ← delegate T/F/U/C       │
│      metadata: HashMap<FactKey, CriteriumMeta>,              │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
         │ depends on
         ▼
┌─────────────────────────────────────────────────────────────┐
│ zz-core                                                      │
│   KnowledgeStore — Belnap truth, entity typing, Literal values  │
│   TruthValue (re-exported from zz-types)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. The Decision Type — Not Yet Implemented

`zz-core::Decision` does not exist in either repo. It needs to be designed before the wiring session.

From the alignment analysis, two lifecycle-distinct types are needed:

```rust
// zz-core — output artifact of a completed reasoning loop
pub struct Decision {
    pub id:                 Uuid,
    pub claim:              String,         // what was decided
    pub chosen:             String,         // which option was selected
    pub justification:      String,         // why
    pub criterion:          String,         // which criterion applied
    pub annotator:          String,         // who decided (HITL identity)
    pub decided_at:         u64,            // Unix epoch
    pub evidence_reviewed:  Vec<FactKey>,   // which facts were seen
}

// criterium-core — in-flight work item (already exists as Claim)
pub struct Claim { ... }  // advances L0 → L1 → L2 → L3
```

`Claim` becomes `Decision` when `assurance_level` reaches `Operational`.
The conversion is the moment where criterium hands a result back to zz-core's store.

---

## 6. 7-Tier Type Alignment

Each tier now has a concrete type in the stack:

```
Tier  Type                           Crate               Status
─────────────────────────────────────────────────────────────────
 7    Session + TerminalHITL         criterium-hitl      exists (stub)
 6    —                              —                   GAP (docs-ojqt)
 5    infer::StressResult            infer               exists
 4    infer::ProofTree               infer               exists
 3    zz_core::KnowledgeStore        zz-core             exists ✓
 2    criterium_kb::FactEntry        criterium-kb        exists (mismatches)
      (at AssuranceLevel::Abduced)
 1    rstmdb WAL entry               rstmdb              exists ✓
```

Tier 2 (`criterium-kb::FactEntry`) has the three mismatches above.
Tier 6 (Counterfactual) is the hardest gap — no type, no verb, no design yet.
Tier 7 (`TerminalHITL`) is a stub — present_hypotheses simulates input instead of blocking.

---

## 7. What to Do — Ordered by dependency

| Priority | Task | Session |
|----------|------|---------|
| **Now** | Design `zz-core::Decision` struct — needed before criterium wiring | design session |
| **Now** | Add `seq: u64` to zz-core FactDecl if WAL ordering is needed | zse-gg4 |
| **zse-gg4** | Change 1: add `entity_type` to criterium-kb::FactEntry | wiring session |
| **zse-gg4** | Change 2: `truth: String` → `truth: TruthValue` | wiring session |
| **zse-gg4** | Change 3: `value: String` → `value: Literal` | wiring session |
| **zse-gg4** | Split `KnowledgeStoreAdapter` into inner+metadata composition | wiring session |
| **zse-gg4** | Implement `Claim → Decision` conversion at `AssuranceLevel::Operational` | wiring session |
| **zse-gg4** | Replace `TerminalHITL` stub with real blocking stdin read | wiring session |
| **future** | Tier 6: design counterfactual verb + type for infer | docs-ojqt |

---

## 8. Verdict

No breaking conflicts. The ecosystem is structurally sound — the mismatches are surface-level type annotations, not architectural contradictions. The boundary between zz-core (Belnap facts) and criterium (epistemic loop metadata) is correctly drawn: AssuranceLevel stays in criterium, TruthValue stays in zz-core.

The `# TODO: Link to zz-core when ready` comment in criterium-kb/Cargo.toml is the correct instinct. The three changes above are the definition of "when ready."
