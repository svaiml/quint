# ADR-012: `BelnapMdp` as `{ lo: Mdp, hi: Mdp }` Pair vs Per-Edge Interval

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL — paraconsistent PCTL
**Branch**: `develop`
**References**: TASK-16, `docs/adr/pctl-paraconsistent-architecture.md` §ADR-3, ADR-010, ADR-011

---

## Context

The DTMC analog uses `BelnapTransition { prob_lo, prob_hi }` because a DTMC
transition has a single probability. An MDP transition has an action index and a
probability, and the semantic unit of choice in an MDP is a `(state, action)`
group, not a single edge. Interval semantics for MDPs must account for how the
optimistic and pessimistic schedulers select actions.

## Problem

Should `BelnapMdp` be structured as a pair of classical `Mdp` values
`{ lo: Mdp, hi: Mdp }`, or should it have its own `BelnapTransition`-style
internal representation with per-edge intervals?

## Considered Options

### Option A — `BelnapMdp { lo: Mdp, hi: Mdp }` ✓

The composed MDP is split into two classical `Mdp` values. The lo-MDP contains
the minimum probabilities per `(state, action, successor)` triple; the hi-MDP
contains the maximum. `belnap_mdp_prob_bounded_until` calls
`mdp_prob_bounded_until(lo, ..., OptDir::Max)` and
`mdp_prob_bounded_until(hi, ..., OptDir::Max)` — two existing, rayon-parallel calls.

- **Pro**: Zero new MDP sparse-representation code. The entire sparse-group infrastructure in `mdp_build_sparse` is reused by both lo and hi.
- **Pro**: `Mdp::validate()` enforces row sums on both lo and hi independently — a correctness invariant that comes for free.
- **Pro**: `lo` and `hi` are independently serialisable and inspectable; pessimistic and optimistic policy behaviours can be queried separately.
- **Pro**: The two-pass pattern is identical to `BelnapDtmc`: run existing function twice, map results.
- **Con**: `BelnapMdp` carries two full `Mdp` values — memory is 2× the classical MDP size.
- **Con**: If an action is present in one source but absent in another, constructing valid lo/hi MDPs requires careful padding at composition time.

### Option B — `BelnapMdp` with `BelnapMdpTransition { from, action, to, prob_lo, prob_hi }`

Parallel to `BelnapDtmc` — single struct with interval per edge.

- **Pro**: Structural uniformity with `BelnapDtmc`.
- **Con**: Requires reimplementing the `MdpSparse` grouping logic for `BelnapMdpTransition`, duplicating `mdp_build_sparse`.
- **Con**: `Mdp::validate()` cannot be applied directly — new validation logic required (row-sum check for intervals is ambiguous when sources have different action sets).
- **Con**: The two-pass DP cannot delegate to `mdp_prob_bounded_until` — new sparse-group DP code needed, increasing the bug surface.
- **Con**: TASK-11 acceptance criterion AC-1 explicitly specifies `BelnapMdp { lo: Mdp, hi: Mdp }` — changing this would break the stated contract.

## Decision

**Option A — `BelnapMdp { state_count, lo: Mdp, hi: Mdp }`.**

The TASK-11 specification is authoritative: AC-1 requires `lo` and `hi` each to
pass `Mdp::validate()`. This is only possible with the lo/hi pair design.
Additionally, the pair design eliminates all new sparse-representation code:
`belnap_mdp_prob_bounded_until` is a four-line function calling the existing
`mdp_prob_bounded_until` twice, matching the two-pass pattern established by the
DTMC implementation.

The 2× memory cost is acceptable: MDP state counts in the ZZ meta-reasoning
platform are bounded by `problem_state_count × 3` (as in `strategy.rs`), which
is dozens to hundreds of states — far below the threshold where the doubling
becomes meaningful.

## Consequences

- **Positive**: `compose_mdp_sources` constructs lo and hi `Mdp` values using existing `MdpTransition` structs — no new types needed.
- **Positive**: Both `lo.validate()` and `hi.validate()` are called inside `compose_mdp_sources` — composition failures surface as `Result` errors with precise messages from the existing validator.
- **Positive**: Commutativity test is straightforward: call `compose_mdp_sources` with sources in two orders and compare `lo.transitions` and `hi.transitions`.
- **Positive**: The same lo/hi pair pattern extends naturally to `NineMdp` (three `Mdp` fields: lo, mid, hi) — ADR-006 already anticipates this.
- **Negative**: Composition must pad missing actions with zero-probability self-loops to maintain row sums. This padding logic is novel but confined to `compose_mdp_sources`.
