# Docs Index

Synced from zombo-sash-eco ecosystem. Run `bin/sync-docs.sh` to refresh.

## ADRs (25)

| File | Source | Title |
|------|--------|-------|
| [ADR-001-rclone-as-sync-engine.md](adr/ADR-001-rclone-as-sync-engine.md) | umbrella | ADR-001: rclone as Sync Engine |
| [ADR-002-python-wrapper-cli.md](adr/ADR-002-python-wrapper-cli.md) | umbrella | ADR-002: Python Wrapper CLI |
| [ADR-003-jsonl-audit-journal.md](adr/ADR-003-jsonl-audit-journal.md) | umbrella | ADR-003: JSONL Audit Journal |
| [ADR-004-secret-exclusion-by-default.md](adr/ADR-004-secret-exclusion-by-default.md) | umbrella | ADR-004: Secret Exclusion by Default |
| [ADR-005-cross-platform-binary-strategy.md](adr/ADR-005-cross-platform-binary-strategy.md) | umbrella | ADR-005: Cross-Platform Binary Strategy |
| [ADR-006-prodx-universe-structure.md](adr/ADR-006-prodx-universe-structure.md) | umbrella | ADR-006: ProdX Universe Directory Structure and Governance |
| [ADR-007-craftegy-design-architecture.md](adr/ADR-007-craftegy-design-architecture.md) | umbrella | ADR-007: Craftegy-Design Architecture (Rust/Tauri) |
| [criterium--ADR-001-inductive-deductive-bridge.md](adr/criterium--ADR-001-inductive-deductive-bridge.md) | criterium | ADR-001: Inductive ↔ Deductive Bridge Design |
| [infer--ADR-IMPL-001-cross-repo-dep-strategy.md](adr/infer--ADR-IMPL-001-cross-repo-dep-strategy.md) | infer | ADR-IMPL-001: Cross-Repo Dependency Strategy for pctl-aaf → infer-core |
| [infer--ADR-PLATFORM-001-aegis-glossary-and-naming.md](adr/infer--ADR-PLATFORM-001-aegis-glossary-and-naming.md) | infer | ADR-PLATFORM-001: Aegis Glossary And Naming |
| [infer--ADR-PLATFORM-002-external-influences-science-libs.md](adr/infer--ADR-PLATFORM-002-external-influences-science-libs.md) | infer | ADR-PLATFORM-002: External Influences From Science Libs |
| [infer--ADR-THEORY-001-mdl-entropy-pctl-and-glushkov-composition.md](adr/infer--ADR-THEORY-001-mdl-entropy-pctl-and-glushkov-composition.md) | infer | ADR-THEORY-001: MDL, Entropy, PCTL, And Glushkov Composition |
| [infer--ADR-THEORY-002-5verb-reasoning-framework.md](adr/infer--ADR-THEORY-002-5verb-reasoning-framework.md) | infer | ADR-THEORY-002: 5-Verb Reasoning Framework |
| [infer--ADR-THEORY-003-aaf-extraction-api.md](adr/infer--ADR-THEORY-003-aaf-extraction-api.md) | infer | ADR-THEORY-003: AAF Extraction API Design for infer-core |
| [pctl-rs--ADR-006-nine-same-tier-composition.md](adr/pctl-rs--ADR-006-nine-same-tier-composition.md) | pctl | ADR-006: NINE Bilattice Same-Tier Composition Strategy |
| [pctl-rs--ADR-007-belnap-state-formula-placement.md](adr/pctl-rs--ADR-007-belnap-state-formula-placement.md) | pctl | ADR-007: `BelnapStateFormula` Placement in `pctl-belnap` (Not `pctl-core`) |
| [pctl-rs--ADR-008-pctl-parser-depends-on-pctl-belnap.md](adr/pctl-rs--ADR-008-pctl-parser-depends-on-pctl-belnap.md) | pctl | ADR-008: `pctl-parser` Dependency on `pctl-belnap` (Acyclic Graph Verification) |
| [pctl-rs--ADR-009-cli-belnap-output-format.md](adr/pctl-rs--ADR-009-cli-belnap-output-format.md) | pctl | ADR-009: CLI `belnap` Subcommand Output Format (Plain Text `s_name: Value`) |
| [pctl-rs--ADR-010-interval-probability-representation.md](adr/pctl-rs--ADR-010-interval-probability-representation.md) | pctl | ADR-010: Interval-Based Probability Representation in `BelnapDtmc` |
| [pctl-rs--ADR-011-eager-vs-lazy-composition.md](adr/pctl-rs--ADR-011-eager-vs-lazy-composition.md) | pctl | ADR-011: Eager Composition (`compose_dtmc_sources`) vs Lazy Composition at Check Time |
| [pctl-rs--ADR-012-belnap-mdp-structure.md](adr/pctl-rs--ADR-012-belnap-mdp-structure.md) | pctl | ADR-012: `BelnapMdp` as `{ lo: Mdp, hi: Mdp }` Pair vs Per-Edge Interval |
| [pctl-rs--pctl-paraconsistent-architecture.md](adr/pctl-rs--pctl-paraconsistent-architecture.md) | pctl | ADR: pPCTL Paraconsistent Architecture |
| [zz-notation--ADR-001-positioning-document-architecture.md](adr/zz-notation--ADR-001-positioning-document-architecture.md) | zz | ADR-001: Positioning Document Architecture |
| [zz-notation--ADR-002-knowledge-store-architecture.md](adr/zz-notation--ADR-002-knowledge-store-architecture.md) | zz | ADR-002: ZZ Knowledge Store Architecture |
| [zz-notation--ADR-002-zz-as-meta-reasoning-platform.md](adr/zz-notation--ADR-002-zz-as-meta-reasoning-platform.md) | zz | ADR-002: ZZ as Meta-Reasoning Platform — Strategy Composition Architecture |

## Assessments (8)
- [catalyst-architecture-diagram-assessment.md](assess/catalyst-architecture-diagram-assessment.md) — Feature Assessment: Catalyst Architecture Diagram
- [folder-sync-tool-assessment.md](assess/folder-sync-tool-assessment.md) — Feature Assessment: Folder Sync Tool (zombo-sash-eco)
- [fpf-v7-keyword-integration-assessment.md](assess/fpf-v7-keyword-integration-assessment.md) — Assessment: FPF v7.0 Keyword Integration into Reasoning Stack
- [pctl-rs-belnap-mdp-belnap-cli-assessment.md](assess/pctl-rs-belnap-mdp-belnap-cli-assessment.md) — Feature Assessment: pctl-rs BelnapMdp + belnap CLI MDP subcommand
- [quint-type-system-assessment.md](assess/quint-type-system-assessment.md) — Feature Assessment: Quint Type System Integration
- [README.md](assess/README.md) — Assessment Reports
- [reasoning-universe-vision-assessment.md](assess/reasoning-universe-vision-assessment.md) — Reasoning Universe — Critical Vision & Architecture Assessment
- [unified-task-management-assessment.md](assess/unified-task-management-assessment.md) — Feature Assessment: Unified Task Management (backlog-md + ADRs + GitHub Issues)

## PRDs (12)
- [craftegy-design-prodx.md](prd/craftegy-design-prodx.md) — PRD: ProdX Universe and Craftegy-Design Framework
- [folder-sync-tool-spec.md](prd/folder-sync-tool-spec.md) — PRD: folder-sync-tool
- [fpf-cards-spec.md](prd/fpf-cards-spec.md) — PRD: fpf-cards — Standalone FPF Card Validators
- [fpf-v7-keyword-integration-spec.md](prd/fpf-v7-keyword-integration-spec.md) — PRD: FPF v7.0 Keyword Integration into Reasoning Stack
- [plan.md](prd/plan.md) — Implementation Plan: AI-Native Spiral Pipeline
- [prometey-stack.md](prd/prometey-stack.md) — PRD: Prometey Stack — 10-Layer Ecosystem Architecture
- [quint-type-system-integration-spec.md](prd/quint-type-system-integration-spec.md) — PRD: Quint Type System Integration
- [README.md](prd/README.md) — Product Requirements Documents (PRDs)
- [reasoning-universe-architecture-spec.md](prd/reasoning-universe-architecture-spec.md) — PRD: Reasoning Universe Architecture — Integration Specification
- [six-bilattice-spec.md](prd/six-bilattice-spec.md) — PRD: SIX Bilattice — [3]×[2] Directional-Confidence Lattice
- [spec.md](prd/spec.md) — PRD: AI-Native Pipeline with Spiral SDD
- [three-layer-proven-map.md](prd/three-layer-proven-map.md) — PRD: Three-Layer Proven Map Pattern (RSTMDB + Infer)

## Plans (3)
- [fpf-cards-plan.md](plan/fpf-cards-plan.md) — Plan: fpf-cards crate
- [fpf-v7-keyword-integration-plan.md](plan/fpf-v7-keyword-integration-plan.md) — Plan: FPF v7.0 Keyword Integration
- [three-layer-proven-map-pattern.md](plan/three-layer-proven-map-pattern.md) — Implementation Plan: Three-Layer Proven Map Pattern

## Research (5)
- [code-intelligence-gap-analysis.md](research/code-intelligence-gap-analysis.md) — Research: Code Intelligence Gap Analysis — GitNexus vs Our Ecosystem
- [folder-sync-tool-research.md](research/folder-sync-tool-research.md) — Folder Sync Tool OSS Landscape Research
- [folder-sync-tool-validation.md](research/folder-sync-tool-validation.md) — Business Validation: folder-sync-tool
- [README.md](research/README.md) — Research Reports
- [spiral-sdd-methodology.md](research/spiral-sdd-methodology.md) — Research: Spiral Spec-Driven Development (Spiral SDD)
