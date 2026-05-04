# PRD: SIX Bilattice — [3]×[2] Directional-Confidence Lattice

**Date**: 2026-05-03
**GitHub Issue**: [zombocoder/pctl-rs#23](https://github.com/zombocoder/pctl-rs/issues/23)
**Assessment**: 17.0/30 → Spec-Light
**Mode**: Spec-Light

## 1. Executive Summary

FOUR (2²=4) and NINE (3²=9) bilattices exist in pctl-rs. Between them sits a natural 6-element structure: [3]×[2] = Direction × Confidence. This maps to Blanché's Logical Hexagon (1953) and gives us weak/strong distinction missing from FOUR without the complexity of NINE.

**Key insight**: `coarsen_to_four()` makes SIX backward-compatible. Existing FOUR consumers never break — they get coarsened results.

## 2. The 6 Values

| Value | Symbol | Direction | Confidence | Meaning |
|-------|--------|-----------|------------|---------|
| `Bottom` | ⊥ | Neutral | Uncertain | No information |
| `WeakTrue` | ◇t | True | Uncertain | Possibly true |
| `WeakFalse` | ◇f | False | Uncertain | Possibly false |
| `StrongTrue` | □t | True | Certain | Confirmed true |
| `StrongFalse` | □f | False | Certain | Confirmed false |
| `Top` | ⊤ | Neutral | Certain | Certainly contested (contradiction) |

```
Knowledge ordering (Hasse diagram):

         ⊤
        / \
       □t  □f
       |    |
       ◇t  ◇f
        \ /
         ⊥
```

### Coarsening to FOUR

```
SIX → FOUR:
  ◇t, □t → True
  ◇f, □f → False
  ⊥      → Unknown
  ⊤      → Conflicted

FOUR → SIX (embed):
  True       → □t (strong true — default embedding)
  False      → □f (strong false)
  Unknown    → ⊥
  Conflicted → ⊤
```

### Blanché Hexagon Correspondence

| SIX | Blanché | Modal Logic |
|-----|---------|-------------|
| ⊥ | Y (I∧O) | contingent |
| □t | A (□p) | necessarily true |
| □f | E (□¬p) | necessarily false |
| ◇t | I (◇p) | possibly true |
| ◇f | O (◇¬p) | possibly false |
| ⊤ | U (A∨E) | certain either way |

## 3. Functional Requirements

### FR-1: BelnapSixValue enum (pctl-belnap)

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BelnapSixValue {
    Bottom,      // ⊥ — no information
    WeakTrue,    // ◇t — possibly true
    WeakFalse,   // ◇f — possibly false
    StrongTrue,  // □t — confirmed true
    StrongFalse, // □f — confirmed false
    Top,         // ⊤ — certainly contested
}
```

### FR-2: Lattice operations

```rust
impl BelnapSixValue {
    fn knowledge_meet(self, other: Self) -> Self;  // greatest lower bound
    fn knowledge_join(self, other: Self) -> Self;  // least upper bound
    fn negation(self) -> Self;  // De Morgan: □t↔□f, ◇t↔◇f, ⊥↔⊥, ⊤↔⊤
    fn coarsen_to_four(self) -> BelnapFourValue;
    fn from_four(v: BelnapFourValue) -> Self;  // embed FOUR into SIX
    fn from_interval(lo: f64, hi: f64, threshold: f64) -> Self;
}
```

`from_interval` for SIX:
- `lo >= threshold` and `hi - lo < ε` → `StrongTrue` (high confidence)
- `lo >= threshold` → `WeakTrue` (low confidence, but above)
- `hi < threshold` and `lo` far below → `StrongFalse`
- `hi < threshold` → `WeakFalse`
- `lo < threshold <= hi` → `Top` (conflicted)
- no sources → `Bottom`

### FR-3: BelnapSixDtmc composition

Same pattern as BelnapFourDtmc but produces SIX values:
```rust
pub struct BelnapSixDtmc {
    pub lo: Dtmc,
    pub hi: Dtmc,
    // Plus confidence metric per state
    pub confidence: Vec<f64>,  // [0,1] per state — interval width → confidence
}
```

### FR-4: CLI subcommand

```bash
pctl-cli belnap six <a.dtmc> [b.dtmc ...] 'P6>=0.5 [true U<=1 fault]'
```

### FR-5: SixTruthValue in zz-types (Phase 2)

```rust
pub enum SixTruthValue {
    Bottom,
    WeakTrue,
    WeakFalse,
    StrongTrue,
    StrongFalse,
    Top,
}

impl SixTruthValue {
    pub fn coarsen(&self) -> TruthValue { ... }
}
```

## 4. Examples

### Existing patterns to follow

- `pctl-belnap/src/belnap_four.rs` — BelnapFourValue with `from_interval`
- `pctl-belnap/src/belnap_nine.rs` — NineValue with quality tiers
- `examples/belnap-four/` — DTMC composition examples
- `examples/belnap-nine/` — F-G-R quality-weighted examples

### New examples needed

- `examples/belnap-six/source_strong.dtmc` — high-confidence source
- `examples/belnap-six/source_weak.dtmc` — low-confidence source
- `examples/belnap-six/six_confidence.pctl` — SIX bilattice check

## 5. Task Breakdown

| ID | Task | Epic | Priority | Phase |
|----|------|------|----------|-------|
| `zse-aj4` | BelnapSixValue type + lattice operations + coarsen_to_four | pctl-rs | P2 | 1 |
| `zse-p7i` | BelnapSixDtmc composition + eval_belnap_six evaluator | pctl-rs | P2 | 1 |
| `zse-3da` | CLI belnap six subcommand + P6 formula parser | pctl-rs | P3 | 1 |
| `zse-eat` | SixTruthValue in zz-types with coarsen mapping | zz-notation | P3 | 2 |

**Dependency chain**: `zse-aj4` → `zse-p7i` → `zse-3da` (sequential in pctl-rs). `zse-eat` is independent (Phase 2).

## 6. Acceptance Criteria (from GitHub issue)

- [ ] [3]×[2] lattice satisfies bilattice axioms (De Morgan, distributivity)
- [ ] `BelnapSixValue` enum with all 6 variants
- [ ] Knowledge and truth orderings for all 36 pairs
- [ ] De Morgan negation: `neg(□t)=□f`, `neg(◇t)=◇f`, `neg(⊥)=⊥`, `neg(⊤)=⊤`
- [ ] `coarsen_to_four()` and `from_four()` with round-trip test
- [ ] Unit tests: meet/join on all 36 pairs
- [ ] Comparison table: [3]×[2] vs Blanché vs [2]×[3] in README

## 7. Success Metrics

- All 36 pair operations verified in unit tests
- `coarsen_to_four()` produces identical results to existing FOUR for coarsened inputs
- `belnap six` CLI subcommand works end-to-end
- No regressions in existing FOUR or NINE tests

---

*Spec-Light generated by /flow:specify.*
