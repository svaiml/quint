# ADR-006: NINE Bilattice Same-Tier Composition Strategy

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: NINE bilattice for pPCTL
**Branch**: `develop`
**References**: TASK-18, `docs/prd/nine-bilattice-spec.md`, ADR-001 through ADR-005

---

## Context

`compose_dtmc_nine_sources` receives a list of `(Dtmc, SourceQuality)` pairs and
must route each source into one of three probability channels in the `NineDtmc`:

- `prob_lo` — Low-quality sources (pessimistic bound)
- `prob_mid` — Med-quality sources (medium-reliability estimate)
- `prob_hi` — High-quality sources (optimistic bound)

When multiple sources of the **same quality tier** assign different probabilities
to the same `(from, to)` edge, there is a conflict **within** a single tier. We
need a rule to collapse multiple same-tier values into one representative per edge.

## Decision

Use **min for Lo and Med channels; max for the Hi channel**:

| Channel | Rule | Rationale |
|---------|------|-----------|
| `prob_lo` (Low quality) | per-edge `min` | Pessimistic bound: take the weakest Low-quality estimate. |
| `prob_mid` (Med quality) | per-edge `min` | Conservative: treat Med like a pessimistic bound within its tier. |
| `prob_hi` (High quality) | per-edge `max` | Optimistic bound: take the strongest High-quality estimate. |

This makes each channel a **mini-FOUR** channel:
- The Lo channel is analogous to `prob_lo` in FOUR — always the global lower bound.
- The Hi channel is analogous to `prob_hi` in FOUR — always the global upper bound.
- The Mid channel follows the Lo convention (min) to remain conservative.

## Alternatives Considered

### Normalise / Average within tier

Compute a weighted average of all same-tier sources for a given edge. This breaks
the soundness property: the Lo channel would no longer be a lower bound on the true
transition probability. Requires a weight vector not present in the current API.
**Rejected.**

### Max for Lo channel

Taking the max of Low-quality sources for `prob_lo` would inflate the pessimistic
bound, making it optimistic. Semantically incorrect.
**Rejected.**

### Min for Hi channel

Taking the min of High-quality sources for `prob_hi` would deflate the optimistic
bound. The Hi channel would become more pessimistic than the Mid channel in some
configurations.
**Rejected.**

## Consequences

- Each channel independently satisfies the same soundness proof as FOUR's lo/hi
  channels. The FOUR soundness proof transfers directly to each NINE channel.
- `compose_dtmc_nine_sources` is commutative within each quality tier: ordering
  sources of the same tier does not change the result (min and max are both
  commutative and associative).
- The three channels are **not** required to satisfy `prob_lo ≤ prob_mid ≤ prob_hi`
  since they represent independent quality tiers, not a nested interval.
- Future work (TASK-TBD NineMdp) can apply the same convention to MDP transitions.
