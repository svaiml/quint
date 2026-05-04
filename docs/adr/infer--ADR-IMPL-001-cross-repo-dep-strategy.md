# ADR-IMPL-001: Cross-Repo Dependency Strategy for pctl-aaf → infer-core

**Status**: Accepted
**Date**: 2026-04-15
**Author**: @software-architect
**Feature**: pctl-aaf DTMC translation module (TASK-24)
**Related**: ADR-THEORY-003 (AAF extraction API), docs/prd/pctl-aaf-spec.md

---

## Context

`pctl-aaf` is a new crate inside the `pctl-rs` workspace
(`github.com/zombocoder/pctl-rs`). Its sole job is translating an
`infer_core::Aaf` into a `pctl_core::Dtmc`. This requires a compile-time
dependency on `infer-core` from `github.com/zombocoder/infer`.

The two repos are siblings under `reasoning-universe/` but are **not**
co-located in a shared parent workspace. The `infer-core` crate is at version
`0.1.0` and is **not** published to crates.io. The public API surface that
matters is:

```rust
// infer-core public re-exports (src/lib.rs)
pub use aaf::{Aaf, DefeatEdge};
pub use knowledge::{KnowledgeBase, RuleId, RuntimeCondition, ...};
```

`Aaf` and `DefeatEdge` were stabilized in PR #16 (merged to `main`).

---

## Options

### A — Git dependency (`git = "...", branch = "main"`)

```toml
infer-core = { git = "https://github.com/zombocoder/infer", branch = "main" }
```

Cargo fetches the crate at build time, locks the resolved commit in
`Cargo.lock`. No publishing required. Works across separate repos without a
shared parent workspace.

**Pros**: zero publishing overhead; reproducible builds via `Cargo.lock`;
works immediately; upgrade path to crates.io is non-breaking (just change
the dep declaration).

**Cons**: build requires network access (mitigated by `Cargo.lock` vendoring
in CI); API changes on `main` silently become the new baseline until `cargo
update` is run; no semver enforcement between the two repos beyond convention.

### B — Path dependency

```toml
infer-core = { path = "../../infer/crates/infer-core" }
```

Works only if both repos are checked out under a shared parent workspace
manifest. The `pctl-rs` workspace has no `[workspace]` entry spanning into
`infer/`, so the path would dangle for anyone whose checkout layout differs.

**Verdict**: Not applicable. Fragile and non-portable across developer machines.

### C — Publish `infer-core` to crates.io

```toml
infer-core = "0.1"
```

Requires version discipline: every `Aaf` / `DefeatEdge` API change that
affects `pctl-aaf` must be a semver bump and a `cargo publish` before
`pctl-aaf` can consume it.

**Verdict**: Correct long-term endpoint but premature now. The API is at
`0.1.0` and is actively shaped by TASK-22 through TASK-27. Publishing now
would require frequent patch releases or `0.1.x` pinning gymnastics.

### D — Copy/re-declare Aaf and DefeatEdge in pctl-rs

Define mirror types in `pctl-aaf` and write conversion glue.

**Verdict**: Rejected. Two authoritative definitions of the same domain type
is a maintenance trap. Any change to `Aaf` requires a parallel change to the
mirror and the conversion layer. The types are non-trivial (`Vec<Vec<RuntimeCondition>>`
carries deep infer-core internals).

---

## Decision

**Option A** — git dependency pinned to `branch = "main"`.

The `Cargo.toml` for `pctl-aaf` will contain:

```toml
[dependencies]
pctl-core  = { path = "../pctl-core" }
infer-core = { git = "https://github.com/zombocoder/infer", branch = "main" }
```

Rationale:
1. PR #16 is merged; the `Aaf` + `DefeatEdge` API is stable on `main`.
2. The TASK-24 → TASK-27 pipeline will be completed before any breaking change
   to `Aaf` is plausible. If `main` does diverge, `Cargo.lock` protects CI
   builds until `cargo update` is explicitly run.
3. Path deps across repos are unportable. crates.io publishing is overhead
   that should be deferred until the API reaches `0.2.0` stability.

---

## Consequences

### API change coordination (the key risk)

When `infer-core` changes the `Aaf` or `DefeatEdge` public API, `pctl-aaf`
will fail to compile after the next `cargo update`. The failure is loud and
immediate — no silent runtime breakage. The coordination burden is a manual
check against the infer changelog before running `cargo update` in `pctl-rs`.

Mitigation: pin to a specific commit SHA in `pctl-aaf/Cargo.toml` at the
point of each TASK-24–27 sprint boundary, and convert to `branch = "main"`
only when API stability is confirmed.

### Cargo.lock must be committed in pctl-rs

`Cargo.lock` must be committed to the `pctl-rs` repo so that CI builds
reproduce the exact commit of `infer-core` that was tested locally. Without
this, a push to `infer` `main` that breaks the `Aaf` API would silently break
`pctl-rs` CI on the next `cargo build`.

### Upgrade path to crates.io

When `infer-core` is published (expected at `0.2.0`, after the TASK-27 ZZ
bridge lands):

1. Change the dep declaration in `pctl-aaf/Cargo.toml` from git to version:
   ```toml
   infer-core = "0.2"
   ```
2. Run `cargo update` and verify tests pass.
3. Drop the `Cargo.lock` git-dep entry. No code changes required in `pctl-aaf`
   itself — the types are identical.

### No impact on pctl-belnap or other pctl-rs crates

`pctl-belnap`, `pctl-core`, `pctl-parser`, and `pctl-cli` have no dependency
on `infer-core` and are unaffected by this decision.
