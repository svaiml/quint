# Research Findings: Spectra & Prometey Stack

## Executive Summary
Spectra is a high-potential Rust-native SDD intelligence engine. Its unique competitive moat lies in its **Epistemic Layer**, offering formal evidence-gated assurance (L0-L3) that competitors lack. The Prometey Stack grounding is essential for cross-layer semantic alignment.

## Critical Tool Comparison
- **Spectra vs Cronus**: Spectra (Rust/MIT) offers 10-100x faster graph operations and formal reasoning compared to Cronus (Python/AGPL).
- **Spectra vs Spec Kit**: Complementary relationship. Spec Kit handles creation; Spectra handles impact analysis and governance.
- **Spectra vs Kiro**: Spectra is agent-agnostic and multi-repo, providing a unified view that Kiro lacks.

## Roadmap Stress Test
- **POC (Weeks 1-4)**: High feasibility. Existing `craftegy-graph` algorithms support basic SpecImpact DAGs.
- **MVP (Weeks 5-10)**: Moderate complexity. Depends on `rig` and `lancedb-rs` stability.
- **Alpha (Weeks 11-20)**: High complexity. Integration with `pctl-rs` and `infer` is the primary technical risk.

## Tool Pruning Recommendation
**`feature-factory`** is redundant. Its BDD journeys should be merged into `catalyst-tests` (Layer 10) to clear the top-level tool layer of fragmentation.

## Prometey Grounding Implementation Path
1. Map `CausalSupportBasis` (FPF C.28) to `AssuranceLevels`.
2. Enforce 0.5 R-cap gate for simulation-only data.
3. Bridge `infer` deductive validation with `criterium` scoring.

## Sources
- `docs/research/spectra-consolidated-product-vision.md`
- `docs/research/fpf-haft-ecosystem-integration.md`
- `arXiv:2510.01171` (Verbalized Sampling)
