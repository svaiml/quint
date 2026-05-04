# ADR-007: `BelnapStateFormula` Placement in `pctl-belnap` (Not `pctl-core`)

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL Parser — P4>=θ Syntax + CLI Belnap Subcommand
**Branch**: `feature/pctl-parser-belnap`
**References**: TASK-22, `docs/prd/pctl-parser-belnap-spec.md` §3.1–3.2

---

## Context

`pctl-core` defines `StateFormula` — the canonical parse tree for classical PCTL formulae:

```
Prob { op, threshold, path }
BoundedUntil { phi1, phi2, bound }
True, Atom(u32), Not, And, ...
```

The new `P4>=θ [...]` syntax requires a distinct `BelnapProb` variant (or equivalent) to
carry paraconsistent semantics into the evaluator. Two placement options exist:

1. **Add `BelnapProb` to `pctl_core::StateFormula`** — single enum, one parser output type.
2. **Add `BelnapStateFormula` to `pctl_belnap::formula`** — separate enum, evaluation stays
   in `pctl-belnap`.

`pctl-core` is the foundation crate: it is depended on by every other crate in the workspace.
Its `StateFormula` is matched exhaustively throughout `pctl-parser`, `pctl-belnap`, and
`pctl-cli`. A bilattice variant would become a mandatory arm in every `match formula { ... }`
expression that today only needs to handle classical semantics.

## Decision

`BelnapStateFormula` is defined in a new file `crates/pctl-belnap/src/formula.rs` and
re-exported from `pctl_belnap`. It mirrors `StateFormula` structurally but names the
probability variant `BelnapProb` to make bilattice semantics explicit:

```rust
pub enum BelnapStateFormula {
    True,
    Atom(u32),
    Not(Box<BelnapStateFormula>),
    And(Box<BelnapStateFormula>, Box<BelnapStateFormula>),
    BelnapProb {
        op:        pctl_core::CompareOp,
        threshold: f64,
        path:      pctl_core::PathFormula,
    },
}
```

`PathFormula` is reused from `pctl-core` unchanged — path operators are lattice-independent.
`pctl-core` receives no changes.

## Alternatives Considered

### Add `BelnapProb` variant directly to `pctl_core::StateFormula`

A `BelnapProb` arm added to `pctl_core::StateFormula` would immediately make every
`match formula` exhaustive-match call in `pctl-parser` and `pctl-core::eval` non-exhaustive
without code changes. Classical callers would be forced to add an unreachable arm or silently
miss the new variant. More critically, it inverts the intended dependency direction:
`pctl-core` must not carry bilattice concerns. **Rejected.**

### Wrap `StateFormula` with a `BelnapWrapper(StateFormula)` newtype

A thin newtype wrapping classical `StateFormula` cannot carry bilattice-specific fields (e.g.,
a future `lo_threshold` / `hi_threshold` pair for NINE). This approach defers the problem
rather than solving it and complicates the NINE extension path (ADR-006). **Rejected.**

### Add a `belnap: bool` mode flag to `StateFormula::Prob`

A boolean flag on `Prob` is semantically opaque, breaks the closed-world assumption of
`StateFormula`, and still lives in `pctl-core`. Future NINE support (`P9>=lo,hi`) would
require a second flag or an `enum Mode { Classical, Belnap, Nine }`, polluting the core
crate further. **Rejected.**

## Consequences

- `pctl-core` remains a clean foundation with no bilattice dependencies.
- All existing `match formula` expressions in `pctl-core` and classical `pctl-parser`
  paths are unaffected — no new arms, no unreachable arms.
- `BelnapStateFormula` lives next to `BelnapFourValue`, `BelnapFourDtmc`, and `eval_belnap`
  in `pctl-belnap`, preserving crate cohesion.
- NINE extension follows the same pattern: `NineStateFormula` in `pctl-belnap` with a
  `NineProb { op, lo_threshold, hi_threshold, path }` variant. `BelnapStateFormula` is not
  re-used for NINE — they are distinct logics.
- `pctl-parser` gains a dependency on `pctl-belnap` (see ADR-008).
