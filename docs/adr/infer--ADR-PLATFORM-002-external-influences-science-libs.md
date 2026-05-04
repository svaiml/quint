# ADR-PLATFORM-002: External Influences From Science Libs

## Status
Accepted

## Context

Two cloned research/code bases under `/home/sash/science-libs` are relevant to the reasoning roadmap:

- `naproche`
- `algorithmic-algebras-embedding`

They contain useful ideas, but importing them directly would pull in heavyweight ecosystems and expand scope beyond the current Rust-first plan.

## Decision

Treat both repositories as pattern sources only.

Approved imports of ideas:

- from `naproche`: controlled natural language discipline, structured assertion pipelines, evidence/provenance habits
- from `algorithmic-algebras-embedding`: schema-to-IR thinking, translation phases, cost estimation, algebraic composition metaphors

Explicit non-goals:

- no Isabelle or Mercurial toolchain in `infer` or `zz-notation`
- no Scala/JVM runtime dependency for `infer`, `zz-notation`, or `pctl-rs`
- no direct code import without a new ADR

## Consequences

### Positive

- preserves intellectual lineage without destabilizing the build
- gives `infer-compose` and ZZ lowering a disciplined source of ideas
- makes scope boundaries explicit for future contributors

### Negative

- useful implementation pieces from those repos cannot be adopted wholesale
- some concepts must be re-expressed in Rust from first principles

### Neutral

- this ADR governs design influence, not licensing or release mechanics
