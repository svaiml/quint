# ADR-010: Interval-Based Probability Representation in `BelnapDtmc`

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL — paraconsistent PCTL
**Branch**: `develop`
**References**: TASK-14, `docs/adr/pctl-paraconsistent-architecture.md` §ADR-1

---

## Context

pPCTL accepts N source models, each a classical `Dtmc` with a single `f64`
probability per transition. When two sources assign different probabilities to
the same `(from, to)` edge, we must represent that disagreement in the composed
`BelnapDtmc`. The choice of representation directly determines memory footprint,
the complexity of the DP computation, and the faithfulness of the 4-valued
semantics.

## Problem

How should `BelnapDtmc` represent the probability information on a transition
when multiple source models may assign it different values?

## Considered Options

### Option A — Store all source probability vectors

`BelnapTransition` carries a `Vec<f64>` with one probability per source.

- **Pro**: Full provenance; can reproduce any aggregate downstream.
- **Pro**: Supports N-source operations beyond min/max.
- **Con**: Memory grows O(N × |transitions|); unbounded with N sources.
- **Con**: The DP step must iterate over all N values at every state × step — O(N) factor in the inner loop.
- **Con**: No natural `Copy` — `Vec<f64>` forces heap allocation per transition.
- **Con**: Couples composition and evaluation — semantic contract becomes "compute aggregate at check time".

### Option B — Store `[prob_lo, prob_hi]` interval per transition ✓

`BelnapTransition { from, to, prob_lo: f64, prob_hi: f64 }` where
`prob_lo = min(all source probs)` and `prob_hi = max(all source probs)`.

- **Pro**: Fixed-size struct; `Copy`; no heap per transition.
- **Pro**: Two-pass DP runs two standard `prob_bounded_until` calls, each identical to the existing `eval.rs` implementation.
- **Pro**: Memory is O(|transitions|) regardless of N sources.
- **Pro**: Composition is a single linear pass over all source transitions.
- **Con**: Provenance is lost — cannot recover which source contributed lo or hi.
- **Con**: With N ≥ 3 sources, the interval may be wider than strictly necessary for a specific threshold (conservative but sound).

### Option C — Store a `BelnapValue` per transition (pre-evaluated at composition)

Compose sources directly into a `BelnapValue` without retaining numeric probabilities. Requires a threshold at compose time.

- **Pro**: No DP required at check time — just a lookup.
- **Con**: Formula threshold is not known at compose time; the same composed model cannot be queried with different thresholds.
- **Con**: Cannot support `CompareOp::Lt`, `Le`, `Gt`, `Ge` uniformly without recomposing.
- **Con**: Destroys the ability to ask multiple formulas against one composed model.

## Decision

**Option B — `[prob_lo, prob_hi]` interval per transition.**

The interval encoding is the only option that is simultaneously:
1. Memory-bounded (O(|transitions|), not O(N × |transitions|)).
2. Reusable: one composed `BelnapDtmc` can answer any number of formulas with any threshold.
3. Structurally isomorphic to the existing `Dtmc` — `BelnapDtmc` is a drop-in extension that the two-pass DP consumes without new algorithmic machinery.
4. Sound: if `prob_lo ≥ θ`, the property holds under all source interpretations; if `prob_hi < θ`, it fails under all; if `prob_lo < θ ≤ prob_hi`, sources actively conflict.

Provenance loss is acceptable: TASK-12 integration tests verify the analytical reference examples from the PRD, confirming soundness. Full provenance tracking, if needed, is a separate feature.

## Consequences

- **Positive**: `BelnapTransition` is `Copy`, enabling stack allocation and clean iterator patterns.
- **Positive**: The two-pass DP re-uses `prob_bounded_until` verbatim, requiring only a thin synthetic-`Dtmc` adapter inside `belnap_check`.
- **Positive**: `BelnapDtmc::validate()` mirrors `Dtmc::validate()` — row sums checked for both lo and hi.
- **Negative**: Conservative interval: three sources at 0.9, 0.5, 0.3 produce `[0.3, 0.9]`, which may return `Conflicted` for a threshold of 0.4 even though two of three sources say True. If majority-rule semantics are needed, a different composition function can be provided without touching this data structure.

### Sub-stochastic lo rows and super-stochastic hi rows

A structural consequence of per-edge min/max composition is that the lo-DTMC and hi-DTMC
rows do **not** necessarily sum to 1.0, even though every source row does.

**Why this happens**: each source assigns complementary probabilities to the outgoing edges
of a state so that they sum to 1.0. After per-edge `min` (lo) and per-edge `max` (hi),
complementary edges are no longer paired — the minimum of one edge is not in general
`1 - maximum of its complement`.

**Sub-stochastic lo rows** (row sum < 1.0): using `min` per edge strips away the higher
contributions, leaving gaps. The DP on a sub-stochastic matrix gives a **lower bound** on the
true reachability probability — it underestimates how likely the target is to be reached.

**Super-stochastic hi rows** (row sum > 1.0): using `max` per edge accumulates the higher
contributions from every source, inflating the row sum beyond 1.0. The DP on a super-stochastic
matrix gives an **upper bound** on reachability — it may yield values > 1.0 after several steps.
This is expected and sound: values > 1.0 in the hi-DP still participate correctly in the
Belnap classification (`hi_prob ≥ θ` means `True` or `Conflicted`; the exact magnitude
above 1.0 is irrelevant).

**Numerical example** (from `test_multi_step_conflicted_propagates`):

Two sources over a 2-state model (s0 → s1 absorbing):
- Source A: `s0→s1=0.9`, `s0→s0=0.1`
- Source B: `s0→s1=0.3`, `s0→s0=0.7`

After composition:
- lo-DTMC: `s0→s1=min(0.9,0.3)=0.3`, `s0→s0=min(0.1,0.7)=0.1` → row sum = **0.4** (sub-stochastic)
- hi-DTMC: `s0→s1=max(0.9,0.3)=0.9`, `s0→s0=max(0.1,0.7)=0.7` → row sum = **1.6** (super-stochastic)

Two-step DP (bound = 2, threshold = 0.6):
- `lo_2 = 0.3 + 0.1 × 0.3 = 0.33`
- `hi_2 = 0.9 + 0.7 × 0.9 = 1.53`  (exceeds 1.0 — valid for an upper bound)
- `0.33 < 0.6 ≤ 1.53` → **Conflicted**
