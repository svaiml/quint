# ADR: pPCTL Paraconsistent Architecture

**Status**: Accepted
**Date**: 2026-04-10
**Feature**: `pctl-paraconsistent` (pPCTL)
**Branch**: `feature/pctl-paraconsistent`
**References**: TASK-9, TASK-10, TASK-11, TASK-12, TASK-13

---

## Architecture Overview

pPCTL adds Belnap 4-valued semantics to the pctl-rs model checker. Where the
existing engine resolves a probabilistic property to a binary True/False, pPCTL
returns one of four values — True, False, Unknown, or Conflicted — by running
the standard bounded-reachability DP twice: once on pessimistic (lower-bound)
probabilities and once on optimistic (upper-bound) probabilities, then mapping
the pair of scalars to a `BelnapValue` using the threshold comparison:

```
 (lo >= θ, hi >= θ) = (true,  false) → BelnapValue::True
 (lo >= θ, hi >= θ) = (false, false) → BelnapValue::False
 (lo >= θ, hi >= θ) = (false, true)  → BelnapValue::Conflicted
 lo == 0 ∧ hi == 0 ∧ no-source       → BelnapValue::Unknown
```

The two-pass approach re-uses the proven `prob_bounded_until` kernel from
`eval.rs` and `mdp_prob_bounded_until` from `mdp.rs` without modification,
satisfying the backward-compatibility requirement and keeping the new code
surface minimal.

### Data flow

```
Source DTMCs / MDPs
      │
      ▼
compose_dtmc_sources(&[Dtmc])          compose_mdp_sources(&[Mdp])
      │                                       │
      │  For each (s,s') transition:          │  For each (s,a,s') transition:
      │    prob_lo = min(all source probs)     │    lo_mdp: min over sources
      │    prob_hi = max(all source probs)     │    hi_mdp: max over sources
      │    no source → Unknown sentinel        │
      ▼                                       ▼
  BelnapDtmc                             BelnapMdp
  ┌─────────────────────┐               ┌────────────────────────┐
  │ state_count: usize  │               │ state_count: usize     │
  │ transitions:        │               │ lo: Mdp                │
  │   Vec<BelnapTrans>  │               │ hi: Mdp                │
  │     .prob_lo: f64   │               └────────────────────────┘
  │     .prob_hi: f64   │
  │ labels: Vec<Label>  │
  └─────────────────────┘
              │                                       │
              ▼                                       ▼
      belnap_check(                   belnap_mdp_prob_bounded_until(
        model, formula)                  model, phi1, phi2, bound)
              │                                       │
      ┌───────┴────────┐               ┌──────────────┴──────────────┐
      │ Pass 1 (lo DP) │               │ Pass 1: mdp_prob_bounded_   │
      │  prob_lo → lo  │               │   until(lo_mdp, ..., Max)   │
      │ Pass 2 (hi DP) │               │ Pass 2: mdp_prob_bounded_   │
      │  prob_hi → hi  │               │   until(hi_mdp, ..., Max)   │
      └───────┬────────┘               └──────────────┬──────────────┘
              │                                       │
              ▼                                       ▼
       threshold mapping                       threshold mapping
              │                                       │
              ▼                                       ▼
    Vec<BelnapValue>                       Vec<BelnapValue>
    (one per state)                        (one per state)
```

### Two-pass DP algorithm (DTMC)

For a formula `Prob { op: Ge, threshold: θ, path: F<=k(φ) }`:

**Pass 1 — lower-bound reachability**

Construct a synthetic `Dtmc` from the `BelnapDtmc` using only `prob_lo` fields
for every transition. Feed this to `prob_bounded_until` with the same `φ`
target set and step bound `k`. The result is `lo_probs: Vec<f64>`, where
`lo_probs[s]` is the minimum probability of satisfying `φ` within `k` steps
across all source interpretations.

**Pass 2 — upper-bound reachability**

Repeat with `prob_hi` fields. The result is `hi_probs: Vec<f64>`, where
`hi_probs[s]` is the maximum probability.

**Belnap mapping**

For each state `s`:

```
told_true  = lo_probs[s] >= θ      // even the pessimistic estimate satisfies φ
told_false = hi_probs[s] <  θ      // even the optimistic estimate fails φ
told_unknown = is_unknown_state[s] // no source contributed any evidence

BelnapValue::from_tf(told_true, told_false, told_unknown)
```

The `from_tf` mapping implements Belnap's bilattice FOUR directly:

```
 (T=true,  F=false) → BelnapValue::True
 (T=false, F=true)  → BelnapValue::False
 (T=true,  F=true)  → BelnapValue::Conflicted
 (T=false, F=false) → BelnapValue::Unknown     // base case
 unknown override   → BelnapValue::Unknown     // explicit no-data
```

**Formal correctness**: When all sources agree (prob_lo == prob_hi for every
transition), `told_true` and `told_false` are mutually exclusive, and the
mapping reduces to classical binary model checking. This is the classical
reduction property verified by `test_agreement_reduces_to_classical`.

---

## ADR-1: Interval-Based Probability Representation

### Context

pPCTL accepts N source models, each a classical `Dtmc` with a single `f64`
probability per transition. When two sources assign different probabilities to
the same `(from, to)` edge, we must represent that disagreement in the composed
`BelnapDtmc`. The choice of representation directly determines the memory
footprint, the complexity of the DP computation, and the faithfulness of the
4-valued semantics.

### Problem

How should `BelnapDtmc` represent the probability information on a transition
when multiple source models may assign it different values?

### Considered Options

**Option A — Store all source probability vectors**

`BelnapTransition` carries a `Vec<f64>` with one probability per source.

- **Pro**: Full provenance; can reproduce any aggregate downstream.
- **Pro**: Supports N-source operations beyond min/max.
- **Con**: Memory grows O(N × |transitions|); unbounded with N sources.
- **Con**: The DP step must iterate over all N values at every state × step — O(N)
  factor in the inner loop.
- **Con**: No natural `Copy` — `Vec<f64>` forces heap allocation per transition.
- **Con**: The semantic contract becomes "compute aggregate at check time",
  coupling composition and evaluation.

**Option B — Store `[prob_lo, prob_hi]` interval per transition**

`BelnapTransition { from, to, prob_lo: f64, prob_hi: f64 }` where
`prob_lo = min(all source probs)` and `prob_hi = max(all source probs)`.

- **Pro**: Fixed-size struct; `Copy`; no heap per transition.
- **Pro**: Two-pass DP runs two standard `prob_bounded_until` calls, each
  identical to the existing `eval.rs` implementation.
- **Pro**: Memory is O(|transitions|) regardless of N sources.
- **Pro**: Composition is a single linear pass over all source transitions.
- **Con**: Provenance is lost — cannot recover which source contributed lo or hi.
- **Con**: With N ≥ 3 sources, the interval may be wider than strictly necessary
  for a specific threshold (conservative but sound).

**Option C — Store a `BelnapValue` per transition (pre-evaluated at composition)**

Compose sources directly into a `BelnapValue` without retaining numeric
probabilities. Requires a threshold at compose time.

- **Pro**: No DP required at check time — just a lookup.
- **Con**: Formula threshold is not known at compose time; the same composed
  model cannot be queried with different thresholds.
- **Con**: Cannot support `CompareOp::Lt`, `Le`, `Gt`, `Ge` uniformly without
  recomposing.
- **Con**: Destroys the ability to ask multiple formulas against one composed
  model.

### Decision

**Option B — `[prob_lo, prob_hi]` interval per transition.**

The interval encoding is the only option that is simultaneously:
1. Memory-bounded (O(transitions), not O(N × transitions)).
2. Reusable: one composed `BelnapDtmc` can answer any number of formulas with
   any threshold.
3. Structurally isomorphic to the existing `Dtmc` — `BelnapDtmc` is a drop-in
   extension that the two-pass DP consumes without new algorithmic machinery.
4. Sound: if `prob_lo ≥ θ`, the property holds under all source interpretations;
   if `prob_hi < θ`, it fails under all; if `prob_lo < θ ≤ prob_hi`, sources
   actively conflict.

Provenance loss (Con) is acceptable: TASK-12 integration tests verify the
analytical reference examples from the PRD, which are sufficient to confirm
soundness. Full provenance tracking, if needed, is a separate feature.

### Consequences

- **Positive**: `BelnapTransition` is `Copy`, enabling stack allocation and
  clean iterator patterns.
- **Positive**: The two-pass DP re-uses `prob_bounded_until` verbatim, requiring
  only a thin synthetic-`Dtmc` adapter inside `belnap_check`.
- **Positive**: `BelnapDtmc::validate()` mirrors `Dtmc::validate()` and
  `Mdp::validate()` — row sums checked for both lo and hi.
- **Negative**: Conservative interval: three sources at 0.9, 0.5, 0.3 produce
  `[0.3, 0.9]`, which may return `Conflicted` for a threshold of 0.4 even
  though two out of three sources say True. If majority-rule semantics are
  needed, a different composition function (not `compose_dtmc_sources`) can be
  provided without touching this data structure.

---

## ADR-2: Eager Composition (compose_dtmc_sources) vs Lazy Composition at Check Time

### Context

pPCTL must combine N source DTMCs before (or during) model checking. The
composition step determines min/max probability intervals for each transition
across all sources. The decision is whether to perform this combination once
upfront (eager) or on demand during each `belnap_check` call (lazy).

### Problem

Should the `compose_dtmc_sources` function produce a `BelnapDtmc` value that is
stored and reused, or should `belnap_check` accept `&[Dtmc]` directly and
derive intervals internally on each call?

### Considered Options

**Option A — Eager: `compose_dtmc_sources(&[Dtmc]) -> BelnapDtmc`**

Sources are composed once into a `BelnapDtmc`. All subsequent `belnap_check`
calls take `&BelnapDtmc`.

- **Pro**: Composition cost paid once, not per formula. N source models queried
  k times costs 1 composition + k two-pass DPs.
- **Pro**: `BelnapDtmc` is a first-class value: loggable, serialisable,
  inspectable. Callers can examine intervals before querying.
- **Pro**: Separation of concerns: composition and evaluation are independent
  operations with independent test coverage.
- **Pro**: Matches the existing domain-builder pattern in `strategy.rs` and
  `trust.rs` — the builder produces a value; the evaluator consumes it.
- **Con**: Caller must store the intermediate `BelnapDtmc`; adds one value to
  lifetime management.

**Option B — Lazy: `belnap_check(&[Dtmc], &StateFormula) -> Vec<BelnapValue>`**

Sources are passed directly to `belnap_check`, which derives intervals
internally and does not expose a composed model.

- **Pro**: One-shot API; callers with a single formula need not store an
  intermediate value.
- **Con**: Each formula call recomputes intervals from all N sources — O(N ×
  |transitions|) overhead per query.
- **Con**: Prevents inspection or caching of the composed model.
- **Con**: Testing composition correctness requires end-to-end tests, not unit
  tests of the composed value.
- **Con**: Breaks US-3 (bilattice composition must be a testable, standalone
  operation).

### Decision

**Option A — Eager composition via `compose_dtmc_sources`.**

The ZZ meta-reasoning use case queries the same composed model with multiple
formulas (e.g., `P>=0.8 [F<=10 certified]` and `P>=0.5 [F<=5 partial]`) in a
single reasoning cycle. Paying the O(N × |transitions|) composition cost once
is essential. Additionally, the bilattice commutativity and associativity laws
(US-3) require `compose_dtmc_sources` to be independently testable — which
demands it produce a value, not a side-effect.

### Consequences

- **Positive**: `belnap_check` signature is `(&BelnapDtmc, &StateFormula) ->
  Vec<BelnapValue>` — both arguments are borrowable without cloning.
- **Positive**: US-3 (commutativity test) becomes a unit test of
  `compose_dtmc_sources` alone, without involving the DP engine.
- **Positive**: The domain-builder convention is preserved: every new domain
  type in pctl-core (trust, strategy, belnap) follows produce-then-query.
- **Negative**: Callers who query exactly one formula pay the cost of holding
  a `BelnapDtmc` in scope — acceptable given that `BelnapDtmc` is a plain
  struct with no Drop logic.

---

## ADR-3: BelnapMdp as lo/hi Mdp Pair vs BelnapMdp with BelnapTransition

### Context

The DTMC analog uses `BelnapTransition { prob_lo, prob_hi }` because a DTMC
transition has a single probability. An MDP transition has an action index and
a probability, and the semantic unit of "choice" in an MDP is a
`(state, action)` group, not a single edge. Interval semantics for MDPs must
account for how the optimistic and pessimistic schedulers select actions.

### Problem

Should `BelnapMdp` be structured as a pair of classical `Mdp` values
`{ lo: Mdp, hi: Mdp }`, or should it have its own `BelnapTransition`-style
internal representation with per-edge intervals?

### Considered Options

**Option A — `BelnapMdp { lo: Mdp, hi: Mdp }`**

The composed MDP is split into two classical `Mdp` values. The lo-MDP contains
the minimum probabilities per `(state, action, successor)` triple; the hi-MDP
contains the maximum. `belnap_mdp_prob_bounded_until` calls
`mdp_prob_bounded_until(lo, ..., OptDir::Max)` and
`mdp_prob_bounded_until(hi, ..., OptDir::Max)` — two existing, rayon-parallel
calls.

- **Pro**: Zero new MDP sparse-representation code. The entire sparse-group
  infrastructure in `mdp_build_sparse` is reused by both lo and hi.
- **Pro**: `Mdp::validate()` enforces row sums on both lo and hi independently —
  a correctness invariant that comes for free.
- **Pro**: `lo` and `hi` are independently serialisable and inspectable; the
  pessimistic and optimistic policy behaviours can be queried separately.
- **Pro**: The two-pass pattern is identical to `BelnapDtmc`: run existing
  function twice, map results.
- **Con**: `BelnapMdp` carries two full `Mdp` values — memory is 2× the
  classical MDP size.
- **Con**: If an action is present in one source but absent in another,
  constructing valid lo/hi MDPs (with matching action sets and row sums of 1.0)
  requires careful padding at composition time.

**Option B — `BelnapMdp` with `BelnapMdpTransition { from, action, to, prob_lo, prob_hi }`**

Parallel to `BelnapDtmc` — single struct with interval per edge.

- **Pro**: Structural uniformity with `BelnapDtmc`.
- **Con**: Requires reimplementing the `MdpSparse` grouping logic for
  `BelnapMdpTransition`, duplicating `mdp_build_sparse`.
- **Con**: `Mdp::validate()` cannot be applied directly — new validation logic
  required (row-sum check for intervals is ambiguous: lo-row-sum and hi-row-sum
  may both not equal 1.0 if sources have different action sets).
- **Con**: The two-pass DP cannot delegate to `mdp_prob_bounded_until` — new
  sparse-group DP code needed, increasing the bug surface.
- **Con**: TASK-11 acceptance criterion AC-1 explicitly specifies
  `BelnapMdp { lo: Mdp, hi: Mdp }` — changing this would break the stated
  contract.

### Decision

**Option A — `BelnapMdp { state_count, lo: Mdp, hi: Mdp }`.**

The TASK-11 specification is authoritative: AC-1 requires `lo` and `hi` each
to pass `Mdp::validate()`. This is only possible with the lo/hi pair design.
Additionally, the pair design eliminates all new sparse-representation code:
`belnap_mdp_prob_bounded_until` is a four-line function calling the existing
`mdp_prob_bounded_until` twice, matching the two-pass pattern established by
the DTMC implementation.

The 2× memory cost is acceptable: MDP state counts in the ZZ meta-reasoning
platform are bounded by `problem_state_count × 3` (as in `strategy.rs`), which
is dozens to hundreds of states — far below the threshold where the doubling
becomes meaningful.

### Consequences

- **Positive**: `compose_mdp_sources` constructs lo and hi `Mdp` values using
  existing `MdpTransition` structs — no new types needed.
- **Positive**: Both `lo.validate()` and `hi.validate()` are called inside
  `compose_mdp_sources` — composition failures surface as `Result` errors with
  precise messages from the existing validator.
- **Positive**: Commutativity test (AC-3) is straightforward: call
  `compose_mdp_sources` with sources in two orders and compare `lo.transitions`
  and `hi.transitions`.
- **Negative**: Composition must pad missing actions (actions present in one
  source but not another) with zero-probability self-loops to maintain row sums.
  This padding logic is novel but confined to `compose_mdp_sources`.

---

## ADR-4: Unknown vs Zero Probability Encoding

### Context

In the Belnap semantics, `Unknown` (0,0 in FOUR) means "no source has provided
any evidence about this transition". This is semantically distinct from `False`
(0,1), where evidence actively says the probability is near zero. In the
interval representation, both cases produce `prob_lo = 0.0` — which creates an
ambiguity: does `(prob_lo=0.0, prob_hi=0.0)` mean a transition genuinely has
probability zero (False), or that no source covered it (Unknown)?

### Problem

How should `BelnapTransition` and `BelnapDtmc` distinguish the Unknown case
from a transition with `(lo=0, hi=0)` that genuinely means "this transition
never fires"?

### Considered Options

**Option A — `Option<f64>` for prob fields: `prob_lo: Option<f64>, prob_hi: Option<f64>`**

`None` signals "no source data". Non-None values are always in [0, 1].

- **Pro**: Type-safe — the compiler enforces handling of the no-data case.
- **Con**: `Option<f64>` is 16 bytes on 64-bit (due to alignment); the struct
  grows from 24 bytes to 40 bytes per transition.
- **Con**: Both passes of the DP must filter on `Some`/`None`, complicating the
  synthetic-DTMC adapter.
- **Con**: Breaks the `Copy` property for `Option<f64>` — wait, `Option<f64>`
  is still `Copy`. However, the `transition_matrix` adapter would need to skip
  `None` entries rather than using them directly, adding conditional logic to
  the hot path.

**Option B — Sentinel `prob_lo > prob_hi` signals Unknown**

When `prob_lo = f64::NAN` or `prob_lo = 1.0, prob_hi = 0.0` (inverted
interval), the transition is flagged as Unknown. All valid intervals have
`prob_lo <= prob_hi`.

- **Pro**: No memory overhead; struct stays 32 bytes.
- **Con**: NaN values would propagate silently through the DP if the sentinel
  check is accidentally missed.
- **Con**: `1.0 > 0.0` as a sentinel is a convention that will surprise future
  readers and is fragile under numerical comparison.
- **Con**: `BelnapDtmc::validate()` must explicitly reject `prob_lo > prob_hi`
  in valid non-Unknown transitions and accept it only as a sentinel — confusing
  invariant.

**Option C — Separate `is_unknown: bool` flag on `BelnapTransition`**

`BelnapTransition { from, to, prob_lo, prob_hi, is_unknown: bool }`.

- **Pro**: Explicit; no ambiguity.
- **Pro**: `prob_lo = 0.0, prob_hi = 0.0, is_unknown = false` unambiguously
  means a genuinely zero-probability transition.
- **Con**: Struct grows by one `bool` (with alignment padding, likely 8 bytes).
- **Con**: `compose_dtmc_sources` must set `is_unknown` correctly and the DP
  adapter must respect it.

**Option D — State-level unknown tracking in BelnapDtmc**

Rather than marking individual transitions as Unknown, track which states have
no source coverage at the `BelnapDtmc` level: a `unknown_states: Vec<bool>`
or `StateSet` field.

- **Pro**: Transitions remain a clean `(from, to, prob_lo, prob_hi)` quad.
- **Pro**: The DP only needs to consult the state-level unknown flag after
  the two passes, not inside the hot loop.
- **Pro**: Matches the PRD semantics: Unknown arises when "both bounds are
  unavailable", which is a state-level condition for bounded-reachability
  formulas.
- **Con**: A state with mixed coverage (some transitions have data, others
  don't) cannot be accurately characterised at the state level alone — it
  requires per-transition tracking.
- **Con**: However, in the ZZ use case, "no source covers a transition"
  typically means the entire state is unobserved, making state-level tracking
  sufficient in practice.

### Decision

**Option D — State-level `unknown_states: StateSet` field on `BelnapDtmc`.**

The PRD defines Unknown as "both bounds are unavailable", which is naturally
expressed as `lo_probs[s] == 0.0 AND hi_probs[s] == 0.0 AND no source
contributed transitions from s`. This is a state-level condition: if no source
model has any transitions from state `s`, then `prob_lo = prob_hi = 0.0` for
all outgoing transitions, and after the two-pass DP, `lo_probs[s]` and
`hi_probs[s]` are both 0.0. The DP naturally produces 0.0 for uncovered states;
the Unknown check is applied only after the passes complete, consulting
`unknown_states`.

`compose_dtmc_sources` sets `unknown_states[s] = true` if and only if no
source contributed any transition from state `s`. This check is O(|states|) and
runs once at composition time.

Option A's type overhead and Option C's struct growth are avoided. Option B's
NaN-sentinel is rejected as fragile. Option D keeps the transition hot path
clean while correctly distinguishing the two zero-probability cases.

### Consequences

- **Positive**: `BelnapTransition` remains a four-field `Copy` struct — no new
  fields in the hot path.
- **Positive**: The Unknown check is a single `StateSet` lookup after the DP,
  not a conditional inside every loop iteration.
- **Positive**: `BelnapDtmc::validate()` can assert `!unknown_states[s] →
  transitions from s sum to [0,1]` without conflating zero-probability with
  no-data.
- **Negative**: Mixed-coverage states (some transitions have data, others don't
  within the same source) are treated as "not unknown" at the state level. In
  practice this is sound: if any source provides even one transition from a
  state, we have non-zero information.

---

## ADR-5: Module Placement — belnap.rs in pctl-core vs New pctl-belnap Crate

### Context

pctl-rs is organised as a Cargo workspace with `crates/pctl-core` (the engine)
and `crates/pctl-tests` (integration tests). Adding a new logical subsystem
raises the question of whether it belongs inside the existing `pctl-core` crate
or in a new first-party crate.

### Problem

Should Belnap types (`BelnapValue`, `BelnapDtmc`, `BelnapMdp`, `belnap_check`,
`compose_dtmc_sources`) live in `pctl-core/src/belnap.rs` or in a new
`pctl-belnap` crate?

### Considered Options

**Option A — `belnap.rs` module inside `pctl-core`**

A single new source file `crates/pctl-core/src/belnap.rs` added to the
existing crate.

- **Pro**: Zero Cargo plumbing: no new `Cargo.toml`, no workspace entry, no
  cross-crate dependency declaration.
- **Pro**: `belnap.rs` accesses `Dtmc`, `Mdp`, `Label`, `StateSet`, and
  `Config` directly without any `pub use` re-export boilerplate.
- **Pro**: The existing `pctl-core` re-export in `lib.rs` gains six new `pub
  use belnap::{...}` lines — exactly what TASK-10 AC-8 specifies.
- **Pro**: `pctl-tests` already depends on `pctl-core`; integration tests
  require no new dependency edge.
- **Pro**: Matches the pattern of `trust.rs` and `strategy.rs` — both are
  domain-specific modules inside `pctl-core` that follow the
  produce-then-query builder pattern.
- **Con**: `pctl-core`'s compilation unit grows. In practice, the delta is one
  file of ~400 LOC — negligible for incremental rebuilds.
- **Con**: A downstream user who wants only `BelnapValue` without the MDP and
  CTMC machinery must compile all of `pctl-core`.

**Option B — New `pctl-belnap` crate**

A new crate `crates/pctl-belnap` depends on `pctl-core`.

- **Pro**: Clean separation at the crate boundary; a downstream user can add
  `pctl-belnap` without `pctl-core` (though in practice they always need both).
- **Con**: Requires new `Cargo.toml`, workspace entry, `[dependencies]` wiring
  — minimum 4 files changed before a single line of Belnap code is written.
- **Con**: `pctl-belnap` must re-export or import `Dtmc`, `Mdp`, `Label`, etc.
  from `pctl-core`, creating a cross-crate coherence surface that can introduce
  "expected pctl_core::Dtmc, found pctl_belnap::Dtmc" diagnostics if the
  version pin diverges.
- **Con**: All five integration tests in `pctl-tests` would require a new
  `pctl-belnap` dep — adding boilerplate to every test file.
- **Con**: Violates the existing crate topology: `trust.rs` and `strategy.rs`
  are inside `pctl-core`, not in separate crates. A third module in a new crate
  would be inconsistent.

### Decision

**Option A — `belnap.rs` inside `pctl-core`.**

The scope of pPCTL is bounded: it adds one evaluation path and three public
types. There is no evidence that external consumers will want Belnap semantics
without the rest of `pctl-core`. The coherence risk of a separate crate
outweighs the theoretical separation benefit for a feature of this size. The
`trust.rs` and `strategy.rs` precedents are decisive: domain-specific
extensions live as modules inside `pctl-core`, not as separate crates.

The compile-time concern (Option A Con) does not apply: `belnap.rs` has no new
external dependencies, so the incremental rebuild cost is negligible.

### Consequences

- **Positive**: The only new file is `crates/pctl-core/src/belnap.rs`. No
  Cargo workspace changes needed.
- **Positive**: `lib.rs` gains one `pub mod belnap;` declaration and one `pub
  use belnap::{ ... }` block — consistent with existing modules.
- **Positive**: `#![forbid(unsafe_code)]` in `belnap.rs` is a file-level
  attribute that applies to the module regardless of what the rest of
  `pctl-core` declares.
- **Negative**: If pPCTL grows substantially (e.g., a full CTL* extension),
  extraction to a separate crate is a future option. At that point the
  migration cost is low: `pub use pctl_belnap::*` in `pctl-core/src/lib.rs`
  preserves all downstream call sites.

---

## Summary: Decision Table

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-1: Prob representation | `[prob_lo, prob_hi]` interval per `BelnapTransition` | Fixed-size, `Copy`, enables two-pass DP reuse, O(transitions) memory |
| ADR-2: Composition timing | Eager — `compose_dtmc_sources → BelnapDtmc` | Multi-formula reuse; separation of concerns; matches builder pattern |
| ADR-3: BelnapMdp structure | `{ lo: Mdp, hi: Mdp }` pair | Required by TASK-11 AC-1; reuses `Mdp::validate()` and `mdp_prob_bounded_until` |
| ADR-4: Unknown encoding | State-level `unknown_states: StateSet` in `BelnapDtmc` | Keeps transition hot path clean; semantically correct for state-level Unknown |
| ADR-5: Module placement | `belnap.rs` inside `pctl-core` | Consistent with `trust.rs`/`strategy.rs` precedent; zero Cargo plumbing |

---

## Module Interface Summary

The following public symbols will be exported from `pctl-core/src/lib.rs`:

```rust
pub use belnap::{
    // Core type
    BelnapValue,
    // DTMC types and functions
    BelnapDtmc, BelnapTransition,
    compose_dtmc_sources, belnap_check,
    // MDP types and functions
    BelnapMdp,
    compose_mdp_sources, belnap_mdp_prob_bounded_until,
};
```

All existing exports are unchanged. The additive block satisfies NFR-1
(backward compatibility) and TASK-10 AC-8 / TASK-11 AC-7.

---

## Formal Semantics Sketch

The pPCTL semantics derive from Belnap (1977) "A Useful Four-Valued Logic" and
the standard PCTL bounded-until semantics of Hansson and Jonsson (1994).

**Bilattice FOUR** is the product lattice `{0,1} × {0,1}` under componentwise
ordering: `(t₁,f₁) ≤ₜ (t₂,f₂)` iff `t₁ ≤ t₂` and `f₁ ≥ f₂` (truth order).
The four elements are:

```
Unknown=(0,0)   False=(0,1)
True=(1,0)      Conflicted=(1,1)
```

**Interval probability propagation** for bounded-until `P≥θ [φ₁ U≤k φ₂]`:

Each interval `[lo, hi]` on a transition represents a set of possible
probability functions. The set of models consistent with a `BelnapDtmc` is:

```
M(B) = { Dtmc D | ∀(s,s'): D.P(s,s') ∈ [B.lo(s,s'), B.hi(s,s')] }
```

The pPCTL semantics at state `s` are:

```
told_true(s)  = ∀D ∈ M(B): Prob_D(s, φ₁ U≤k φ₂) ≥ θ
told_false(s) = ∀D ∈ M(B): Prob_D(s, φ₁ U≤k φ₂) < θ
```

**Claim**: `told_true(s)` iff `lo_probs[s] ≥ θ`, and `told_false(s)` iff
`hi_probs[s] < θ`, where `lo_probs` and `hi_probs` are computed by the
standard bounded-until DP applied to the lo-DTMC and hi-DTMC respectively.

**Proof sketch**: By induction on the bound `k`. Base case `k=0`: `Prob(s, φ₁
U≤0 φ₂) = 1` if `s ∈ φ₂`, else `0` — independent of transition probabilities,
so lo = hi = classical. Inductive step: `Prob(s, φ₁ U≤k φ₂) = Σ_{s'} P(s,s')
× Prob(s', φ₁ U≤(k-1) φ₂)`. Since `P(s,s') ∈ [lo(s,s'), hi(s,s')]` and the
right-hand sum is monotone in `P`, the minimum over M(B) is achieved by the
lo-DTMC and the maximum by the hi-DTMC. QED by induction.

This establishes that the two-pass DP is not a heuristic but a provably correct
computation of the min/max probability over all models consistent with the
interval assignments.

---

*ADR authored 2026-04-10 for pctl-rs feature/pctl-paraconsistent.*
