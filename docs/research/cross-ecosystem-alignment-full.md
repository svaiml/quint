---
target_peer: zombocraft
---

# Cross-Ecosystem Alignment: Full Multi-Repo Analysis

> **Status**: Research — verified against actual source code (2026-05-04)
> **Repos scanned**: reasoning-universe/*, epistemic-universe/*, infra-eco/*
> **Related**: cross-ecosystem-alignment-zz-criterium.md, epistemic-oracle-mapping.md

---

## Layer Status Summary

| Layer | Status | Notes |
|-------|--------|-------|
| 00 KERNEL-FORGE | ✓ ISOLATED | bfc, bfcfs-linux — no coupling needed |
| 01 INFRA | ⚠ PARTIAL | invariantis proto-only; inferense works |
| 02 FORMAL | ✗ BROKEN | pctl-rs::BelnapFourValue ≠ zz-types::TruthValue; SIX/NINE unused |
| 03 MEMORY | ⚠ PARTIAL | rstmdb works with infer; serde_json::Value vs infer::Value mismatch |
| 04 KNOWLEDGE | ✓ OK | graphify, codegraph-rust — integration planned |
| 05 REASONING | ✗ BROKEN | criterium isolated; axiomvm/aivm isolated; no verb coupling |
| 06 SPEC | ⚠ PARTIAL | flowspec OK; quint→zz bridge missing |
| 07 BRIDGE | ✓ OK | br, bv, AllBeads work |

---

## Actual Dependency Graph (what Cargo.toml says today)

```
infer ──────────────────────────► pctl-{core,parser}   [patch git → local]
infer ──────────────────────────► rstmdb-{client,proto} [patch git → local]
infer ──────────────────────────► fpf-cards             [patch git → local]
zz-notation ────────────────────► infer-core            [git dep]
inferense ───────────────────────► infer-* + axiom-*     [local paths]
criterium-kb ───────────────────► criterium-core         [internal only]
criterium-kb ───────────────────► zz-core               ✗ TODO COMMENT

axiomvm  ─────────────────────── STANDALONE (0 cross-repo deps)
aivm     ─────────────────────── STANDALONE (0 cross-repo deps)
pctl-rs  ─────────────────────── STANDALONE (0 cross-repo deps)
rstmdb   ─────────────────────── STANDALONE (patched INTO from infer)
invariantis ──────────────────── STANDALONE (proto-based types only)
```

---

## Mismatch Table — All Types

| Type | zz-core | criterium-kb | infer-core | pctl-rs | rstmdb | Fix |
|------|---------|--------------|------------|---------|--------|-----|
| Truth value | `TruthValue` enum (FOUR) | `String` | always `True` | `BelnapFourValue` (separate type) | absent | Canonicalize to `zz_types::TruthValue`; add From/Into |
| Fact value | `Literal` (6 variants) | `String` | `Value` {S,I,B} | absent | `serde_json::Value` | `Literal` is richest; infer add Float/DateTime |
| Entity type | key in HashMap | **MISSING** | domain concept | absent | absent | Add to FactEntry |
| Assurance | absent | `AssuranceLevel` | absent | absent | absent | Stays in criterium |
| Seq/WAL | absent | absent | absent | absent | WAL offset | Design zz-core FactDecl seq |

---

## Critical Missing Bridges

### 1. criterium → zz-core (BLOCKER — TODO in Cargo.toml)
```
criterium-kb::FactEntry  ──────►  zz_core::KnowledgeStore
  value: String           (needs)  Literal enum
  truth: String           (needs)  TruthValue enum
  (missing entity_type)   (needs)  (String, String, String) key
```

### 2. criterium loop → infer verbs (WORKFLOW BLOCKER)
```
AssuranceLevel::Abduced   ──call──►  infer::DEDUCE  → ::Deduced
AssuranceLevel::Deduced   ──call──►  pctl::VERIFY   → ::Induced
AssuranceLevel::Induced   ──HITL──►  human confirm  → ::Operational
```
No code path connects these today.

### 3. pctl-rs::BelnapFourValue ↔ zz-types::TruthValue (TYPE MISMATCH)
Same bilattice semantics, two incompatible Rust types. No From/Into.

### 4. axiomvm → infer (ISOLATION)
Execution results never become infer facts. No ExecutionBridge trait defined.

### 5. aivm → infer (ISOLATION)
Agent decisions never enter the reasoning loop.

### 6. rstmdb Instance.ctx: serde_json::Value (STORAGE MISMATCH)
Persisted facts lose type information. No domain validation.

---

## Existing Bridges (working)

| Bridge | File | Status |
|--------|------|--------|
| zz → infer | zz-core/src/bridge.rs | ✓ InferBridge |
| infer → pctl | infer-pctl/aaf_bridge.rs | ✓ AAF→DTMC |
| infer → rstmdb | infer-rstmdb/ | ✓ fact persistence |
| infer → fpf-cards | infer-fpf-cards/ | ✓ validation |

---

## P0 Fixes (Blockers)

### P0-A: criterium-kb Cargo.toml — add zz-core dep
```toml
zz-core  = { path = "../../reasoning-universe/zz-notation/crates/zz-core" }
zz-types = { path = "../../reasoning-universe/zz-notation/crates/zz-types" }
```
Then: FactEntry.truth → TruthValue, FactEntry.value → Literal, add entity_type.

### P0-B: criterium-core — couple loop states to infer verbs
Abduced→Deduced transition calls infer::DEDUCE.
Deduced→Induced transition calls pctl-rs VERIFY.

### P0-C: unify truth value types
Add From<TruthValue>/Into<BelnapFourValue> in pctl-belnap.
Re-export from zz-types as canonical.

---

## P1 Fixes (High)

### P1-A: rstmdb domain validation
Typed wrapper for Instance.ctx using infer_core::Value.

### P1-B: ExecutionBridge trait
axiomvm::Value → infer_core::Fact (so execution results enter KB).

### P1-C: probabilistic KB facts
infer-core Fact carries optional TruthValue (not always True).

---

## Open Questions

1. Should `seq: u64` be added to zz-core FactDecl for WAL ordering?
2. Should `confidence: f64` stay criterium-only or move to zz-core?
3. Who owns the canonical `Literal` type — zz-ast or a shared crate?
4. When does Tier 6 (Counterfactual) get a verb in infer? (docs-ojqt)
