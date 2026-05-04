# PRD: fpf-cards — Standalone FPF Card Validators

**Date**: 2026-05-02
**Parent assessment**: docs/assess/fpf-v7-keyword-integration-assessment.md (13.0/30)
**Mode**: Spec-Light

## 1. Executive Summary

**Problem**: FPF v7.0 introduced formal card structures (CSC, DRR, EFP) that describe weakened renderings, design decisions, and explanation classifications. These cards need validation and serialization, but no standalone library exists — haft embeds them in its Go runtime, and our Rust ecosystem has no equivalent.

**Solution**: A minimal Rust crate `fpf-cards` with:
- Pure types (structs + enums) for CSC, DRR, and EFP cards
- Validation (well-formedness checks per FPF spec)
- Serde serialization (JSON + ctop-compatible)
- Zero dependencies beyond `serde`

**Design principle**: Maximally simple, atomic, zero coupling. Types only — no runtime, no FPF indexing, no semantic search. haft is reference, not dependency.

## 2. User Story

**US-1**: As a developer building context-aware tools (codegraph, flowspec, reasoning-apps), I need validated FPF card types so I can describe what was simplified/decided/explained without hand-rolling structs or coupling to haft's Go codebase.

## 3. Functional Requirements

### FR-1: CscCard (Controlled Semantic Coarsening)

Per FPF A.6.3.CSC WF-1:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CscCard {
    pub stronger_source: String,
    pub weaker_rendering: String,
    pub supported_use: String,
    pub unsupported_use: String,
    pub reopen_trigger: String,
}
```

**Validation**: All 5 fields required, non-empty. `validate()` returns `Result<(), CardError>`.

### FR-2: DrrCard (Design-Rationale Record)

Per FPF E.9:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DrrCard {
    pub context: String,
    pub decision: String,
    pub consequences: String,
    pub status: DrrStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DrrStatus {
    Proposed,
    Accepted,
    Deprecated,
    Superseded,
}
```

**Validation**: `context`, `decision`, `consequences` required, non-empty.

### FR-3: EfpCard (Explanation Faithfulness Profile)

Per FPF E.17.EFP:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EfpCard {
    pub rendering_type: EfpType,
    pub source_anchors: Vec<String>,
    pub admissible_faces: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EfpType {
    SourcePinned,
    Reconstruction,
    DidacticRetelling,
    SpeculativeRetelling,
}
```

**Validation**: `rendering_type` required, `source_anchors` non-empty for `SourcePinned`.

### FR-4: Shared traits

```rust
pub trait FpfCard: Sized {
    fn validate(&self) -> Result<(), CardError>;
    fn card_type(&self) -> &'static str;
}

#[derive(Debug, thiserror::Error)]
pub enum CardError {
    #[error("missing required field: {0}")]
    MissingField(String),
    #[error("invalid value for {field}: {reason}")]
    InvalidValue { field: String, reason: String },
}
```

## 4. Crate Structure

```
reasoning-universe/fpf-cards/
├── Cargo.toml          # [dependencies] serde, thiserror
├── src/
│   ├── lib.rs          # pub mod csc, drr, efp, error; pub use trait FpfCard
│   ├── csc.rs          # CscCard + validate
│   ├── drr.rs          # DrrCard + DrrStatus + validate
│   ├── efp.rs          # EfpCard + EfpType + validate
│   └── error.rs        # CardError
└── tests/
    └── validation.rs   # Well-formedness tests
```

**Dependencies**: `serde` (with derive), `thiserror`. That's it.

## 5. Consumer Integration (future, not in scope)

| Consumer | How it uses fpf-cards | When |
|----------|----------------------|------|
| **codegraph-rust** | Optional dep: emit `CscCard` on pruned MCP responses | When context pruning is implemented |
| **flowspec** | Assessments as CSC of full analysis | When assessment format evolves |
| **reasoning-apps** | Dashboard tiles described as CSC cards | When Metabase integration matures |
| **haft** | Reference only — haft has its own Go types | Never (different language) |

## 6. Task Breakdown

| ID | Task | Priority | Labels |
|----|------|----------|--------|
| `zse-q48` | Scaffold crate with CscCard, DrrCard, EfpCard types + validation | P2 | fpf,implement,rust |

Single task — the crate is small enough to implement in one PR.

## Description

A minimal Rust crate (`fpf-cards`) providing validated types for three FPF v7.0 card structures: Controlled Semantic Coarsening (CSC), Design-Rationale Record (DRR), and Explanation Faithfulness Profile (EFP). Pure types with validation — no runtime, no coupling to specific consumers. Lives in `reasoning-universe/fpf-cards/` alongside infer and pctl-rs.

## Technical Requirements

- **Language**: Rust 2021 edition
- **Dependencies**: `serde` (optional, default on), `thiserror`
- **API surface**: 3 card structs, 2 enums, 1 trait (`FpfCard`), 1 error type
- **Testing**: `cargo test` with well-formedness validation tests
- **Compatibility**: `--no-default-features` compiles without serde

## Acceptance Criteria

- [ ] `CscCard` struct with 5 required fields and `validate()` rejecting empty fields
- [ ] `DrrCard` struct with `DrrStatus` enum and `validate()` rejecting empty context/decision/consequences
- [ ] `EfpCard` struct with `EfpType` enum and `validate()` requiring source_anchors for SourcePinned
- [ ] `FpfCard` trait implemented for all 3 card types
- [ ] Serde JSON roundtrip test for each card type
- [ ] `cargo test` passes all validation tests (valid cards pass, invalid cards error with `CardError`)
- [ ] Crate compiles with `--no-default-features` (serde disabled)
- [ ] Zero dependencies beyond `serde` + `thiserror`

## Success Metrics

- `cargo test` passes with well-formedness tests for all 3 card types
- `CscCard` serializes to JSON matching the ctop DSL roundtrip format
- Crate compiles with `--no-default-features` (serde optional)

---

*Spec-Light generated by /flow:specify.*
