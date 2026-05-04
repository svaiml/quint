# ADR-008: `pctl-parser` Dependency on `pctl-belnap` (Acyclic Graph Verification)

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL Parser — P4>=θ Syntax + CLI Belnap Subcommand
**Branch**: `feature/pctl-parser-belnap`
**References**: TASK-22, `docs/prd/pctl-parser-belnap-spec.md` §3.3, ADR-007

---

## Context

`pctl-parser` currently depends only on `pctl-core`. It exposes:

```rust
pub fn parse(input: &str, atoms: &[AtomEntry]) -> Result<StateFormula, ParseError>
```

The new `parse_belnap` function (see ADR-007) returns `BelnapStateFormula`, which is
defined in `pctl-belnap`. To return that type, `pctl-parser` must import `pctl-belnap`.

Before accepting this dependency edge, it must be verified that no cycle is introduced.
The concern is: if `pctl-belnap` already depends on `pctl-parser` (directly or transitively),
adding `pctl-parser → pctl-belnap` would create a cycle.

### Dependency graph before this change

```
pctl-core
  ↑
pctl-belnap  ←  pctl-tests
  ↑
pctl-cli
pctl-parser  ←  pctl-tests
```

`pctl-belnap` depends on `pctl-core` only. `pctl-parser` depends on `pctl-core` only.
There is no edge between `pctl-belnap` and `pctl-parser` in either direction.

### Dependency graph after this change

```
pctl-core
  └─ pctl-belnap          (unchanged: depends on pctl-core)
       └─ pctl-parser      (NEW: depends on pctl-belnap)
            └─ pctl-cli    (unchanged: already depends on pctl-parser)
                 └─ pctl-tests
```

Cycle check — following each dependency chain from `pctl-parser`:

- `pctl-parser → pctl-belnap → pctl-core` — terminates (no back-edge).
- `pctl-parser → pctl-core` — terminates.

`pctl-belnap` does not depend on `pctl-parser`. No cycle exists.

## Decision

Add `pctl-belnap` as a regular (non-optional) dependency of `pctl-parser`:

```toml
# crates/pctl-parser/Cargo.toml
[dependencies]
pctl-core   = { path = "../pctl-core" }
pctl-belnap = { path = "../pctl-belnap" }
```

The `pctl-belnap` dependency is non-optional because `parse_belnap` is part of the
public API of `pctl-parser`. Making it optional via a Cargo feature would add conditional
compilation complexity with no benefit at this scale; all consumers that build `pctl-parser`
also build `pctl-belnap`.

`parse_belnap` is added to `crates/pctl-parser/src/lib.rs`. It reuses the existing
`Tokenizer` and grammar rules, extending only the `parse_primary` dispatch to recognise
the `P4` keyword before the classical `P` arm (longer prefix wins).

## Alternatives Considered

### Keep `parse_belnap` in `pctl-belnap` (no new dep on parser)

A `parse_belnap` function in `pctl-belnap` would require either duplicating the tokenizer
or pulling `pctl-parser` into `pctl-belnap` — which is the reverse direction and introduces
the cycle that was being avoided. **Rejected.**

### Use a Cargo feature to make `pctl-belnap` optional in `pctl-parser`

Conditional compilation (`#[cfg(feature = "belnap")]`) is appropriate when some consumers
genuinely do not need the feature and compile-time savings are material. The workspace is
small; all present consumers use `pctl-belnap`. The feature gate would add three-way
configuration complexity (`pctl-core` alone, `pctl-core + pctl-belnap`) for no runtime
benefit. **Rejected for now** — can be revisited if an embedded/no-std target is introduced.

### Separate crate `pctl-parser-belnap`

A fourth parser crate bridging `pctl-parser` and `pctl-belnap` is over-engineering at this
scale. It adds a build artifact, another `Cargo.toml`, and an extra layer of re-exports for
a single function. **Rejected.**

## Consequences

- The full acyclic dependency chain becomes:
  `pctl-core ← pctl-belnap ← pctl-parser ← pctl-cli ← pctl-tests`.
- `pctl-parser` now exposes two public parse entry points: `parse` (classical) and
  `parse_belnap` (bilattice). They share tokenizer and path-formula grammar but diverge
  at the primary-expression dispatch level.
- Adding NINE later (`parse_nine`) follows the same pattern: `pctl-parser → pctl-belnap`
  edge already exists; only the `parse_nine_primary` dispatch branch is new.
- Build times increase marginally (one extra crate in `pctl-parser`'s dependency closure),
  but `pctl-belnap` is already compiled for `pctl-cli` so the incremental cost is zero in
  a workspace build.
