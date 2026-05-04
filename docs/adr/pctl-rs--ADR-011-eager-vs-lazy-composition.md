# ADR-011: Eager Composition (`compose_dtmc_sources`) vs Lazy Composition at Check Time

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL — paraconsistent PCTL
**Branch**: `develop`
**References**: TASK-15, `docs/adr/pctl-paraconsistent-architecture.md` §ADR-2, ADR-010

---

## Context

pPCTL must combine N source DTMCs before (or during) model checking. The
composition step determines min/max probability intervals for each transition
across all sources. The decision is whether to perform this combination once
upfront (eager) or on demand during each `belnap_check` call (lazy).

## Problem

Should `compose_dtmc_sources` produce a `BelnapDtmc` value that is stored and
reused, or should `belnap_check` accept `&[Dtmc]` directly and derive intervals
internally on each call?

## Considered Options

### Option A — Eager: `compose_dtmc_sources(&[Dtmc]) -> BelnapDtmc` ✓

Sources are composed once into a `BelnapDtmc`. All subsequent `belnap_check`
calls take `&BelnapDtmc`.

- **Pro**: Composition cost paid once, not per formula. N source models queried k times costs 1 composition + k two-pass DPs.
- **Pro**: `BelnapDtmc` is a first-class value: loggable, serialisable, inspectable. Callers can examine intervals before querying.
- **Pro**: Separation of concerns: composition and evaluation are independent operations with independent test coverage.
- **Pro**: Matches the existing domain-builder pattern in `strategy.rs` and `trust.rs` — builder produces a value; evaluator consumes it.
- **Con**: Caller must store the intermediate `BelnapDtmc`; adds one value to lifetime management.

### Option B — Lazy: `belnap_check(&[Dtmc], &StateFormula) -> Vec<BelnapValue>`

Sources are passed directly to `belnap_check`, which derives intervals internally and does not expose a composed model.

- **Pro**: One-shot API; callers with a single formula need not store an intermediate value.
- **Con**: Each formula call recomputes intervals from all N sources — O(N × |transitions|) overhead per query.
- **Con**: Prevents inspection or caching of the composed model.
- **Con**: Testing composition correctness requires end-to-end tests, not unit tests of the composed value.
- **Con**: Breaks the requirement that bilattice composition must be a testable, standalone operation (TASK-12 AC).

## Decision

**Option A — Eager composition via `compose_dtmc_sources`.**

The ZZ meta-reasoning use case queries the same composed model with multiple
formulas (e.g., `P>=0.8 [F<=10 certified]` and `P>=0.5 [F<=5 partial]`) in a
single reasoning cycle. Paying the O(N × |transitions|) composition cost once
is essential. Additionally, the bilattice commutativity and associativity laws
require `compose_dtmc_sources` to be independently testable — which demands it
produce a value, not a side-effect.

## Consequences

- **Positive**: `belnap_check` signature is `(&BelnapDtmc, &StateFormula) -> Vec<BelnapValue>` — both arguments are borrowable without cloning.
- **Positive**: Commutativity test becomes a unit test of `compose_dtmc_sources` alone, without involving the DP engine.
- **Positive**: The domain-builder convention is preserved: every domain type in pctl-core (trust, strategy, belnap) follows produce-then-query.
- **Positive**: Same pattern applies to `compose_dtmc_nine_sources` for the NINE bilattice (ADR-006).
- **Negative**: Callers who query exactly one formula pay the cost of holding a `BelnapDtmc` in scope — acceptable given that `BelnapDtmc` is a plain struct with no `Drop` logic.
