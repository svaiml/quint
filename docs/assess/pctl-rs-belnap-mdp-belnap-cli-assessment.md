# Feature Assessment: pctl-rs BelnapMdp + belnap CLI MDP subcommand

**Date**: 2026-04-24
**Assessed By**: Claude AI Agent
**Status**: Assessed
**Beads Issue**: zombo-sash-eco-ut3

## Feature Overview

Extend `pctl-rs` with a complete `BelnapMdp` struct and a `belnap mdp` CLI subcommand for probabilistic model checking of Markov Decision Processes under 4-valued Belnap logic. Builds on the already-complete `BelnapDtmc` implementation and DTMC CLI (`belnap dtmc` / `belnap nine`).

**Scope**:
- `BelnapMdp` struct: `{lo: Mdp, hi: Mdp}` pair (per ADR-012)
- `belnap_mdp_prob_bounded_until()` function using pessimistic/optimistic scheduler pair
- `belnap mdp detect` CLI subcommand (analogous to `belnap dtmc detect`)
- Integration tests in `pctl-tests`

**Context**: High centrality — unblocks `criterium` (epistemic reasoning loop) and `epistemic-game` (multi-agent equilibrium detection). Branch `feature/ppctl-mdp-composition` already started; eager MDP composition with missing-transition padding is done (ADR-011, ADR-012).

## Scoring Analysis

### Complexity Score: 3.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 5/10 | ~2-3 days; DTMC pattern is established — MDP follows same structure but adds scheduler pair logic |
| Component Count | 4/10 | pctl-belnap crate (new BelnapMdp type + algorithm), pctl-cli (new subcommand), pctl-tests (integration tests), pctl-core (no changes expected) |
| Integration Points | 2/10 | Self-contained math library; no external APIs or services; criterium/epistemic-game are consumers not integrations |
| **Average** | **3.7/10** | |

### Risk Score: 1.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 1/10 | Pure mathematics library, no I/O beyond CLI stdin/stdout |
| Compliance Requirements | 1/10 | None |
| Data Sensitivity | 1/10 | Public/non-sensitive — model states are synthetic test inputs |
| **Average** | **1.0/10** | |

### Architecture Impact Score: 4.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 4/10 | Scheduler-pair pattern (pessimistic/optimistic) is new within pctl-rs; established in MDP literature |
| Breaking Changes | 2/10 | Additive only; existing `belnap dtmc` / `nine` CLI subcommands unchanged |
| Dependencies Affected | 6/10 | Unblocks criterium (Layer 05) and epistemic-game (Layer 05) — both wait on BelnapMdp for full loop closure |
| **Average** | **4.0/10** | |

## DVF+V Preliminary Risk

| Risk Type | Present? | Score |
|-----------|----------|-------|
| Value Risk — unclear if users want this? | No — criterium requires it | 0 |
| Usability Risk — complex novel UX? | No — CLI mirrors existing DTMC pattern | 0 |
| Feasibility Risk — unknown technical unknowns? | No — ADR-011/ADR-012 resolve the design; DTMC is precedent | 0 |
| Viability Risk — uncertain ROI? | No — two direct consumers already planned | 0 |
| **DVF+V Bonus** | | **0** |

## Overall Assessment

**Total Score**: 8.7/30
**Recommendation**: Spec-Light
**Confidence**: High

### Rationale

Total score (8.7) falls below the Full SDD threshold (18), but Architecture Impact (4.0) meets the Spec-Light trigger (≥ 4). The feature is moderate-impact due to downstream unblocking of two Layer 05 components, but technically well-understood: ADR-011 specifies eager composition, ADR-012 defines `BelnapMdp` as `{lo: Mdp, hi: Mdp}`. These ADRs already serve as the specification — no separate spec document is needed.

### Key Factors

- **Complexity**: Low-moderate. DTMC is already done; MDP adds scheduler-pair semantics but follows identical 4-valued Belnap reduction (lo-bound DTMC → pessimistic, hi-bound DTMC → optimistic).
- **Risk**: Negligible. Pure math library, no external dependencies, no runtime state.
- **Impact**: Elevated due to unblocking. criterium's inductive loop and epistemic-game's equilibrium detector both require `BelnapMdp::prob_bounded_until()` to close the full abduction→deduction→induction cycle.

### Spec artifact: ADRs are sufficient

The existing accepted ADRs in `reasoning-universe/pctl-rs/docs/adr/` cover the design decisions completely:
- **ADR-007**: BelnapStateFormula placement in pctl-belnap
- **ADR-011**: Eager MDP composition with missing-transition padding
- **ADR-012**: `BelnapMdp` as `{lo: Mdp, hi: Mdp}` pair

No additional `/flow:specify` pass is required.

## Next Steps

### Spec-Light Path — proceed directly to implementation

The ADRs are the spec. Implementation starts on the existing `feature/ppctl-mdp-composition` branch:

```bash
# Navigate to pctl-rs
cd reasoning-universe/pctl-rs

# Check current branch state
git log --oneline -5
git status

# Implement in order:
# 1. pctl-belnap/src/belnap_mdp.rs — BelnapMdp struct + prob_bounded_until
# 2. pctl-cli/src/main.rs — belnap mdp detect subcommand
# 3. pctl-tests/tests/ — MDP integration tests

# Build + test
cargo test -p pctl-tests
```

### Key implementation guidance (from ADR-012)

```rust
pub struct BelnapMdp {
    pub lo: Mdp,  // pessimistic transitions
    pub hi: Mdp,  // optimistic transitions
}

impl BelnapMdp {
    pub fn prob_bounded_until(&self, phi: &BelnapStateFormula, psi: &BelnapStateFormula, bound: u32)
        -> Vec<BelnapValue> {
        // Reduce to two DTMC problems via scheduler fixpoint:
        // lo_result = min_scheduler(self.lo).prob_bounded_until(phi, psi, bound)
        // hi_result = max_scheduler(self.hi).prob_bounded_until(phi, psi, bound)
        // Combine using BelnapValue::from_interval(lo_result[s], hi_result[s])
    }
}
```

## Override

```bash
# Force full SDD workflow
/flow:assess pctl-rs-belnap-mdp --mode full

# Force skip SDD
/flow:assess pctl-rs-belnap-mdp --mode skip
```

---

*Assessment generated by /flow:assess workflow*
