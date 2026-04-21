# Architecture Decision Records — Cross-Repo Index

This file is the **umbrella index** of all ADRs across every nested workspace repo.
Top-level ADRs (new decisions affecting the whole ecosystem) live in this directory.
Repo-local ADRs live beside the code they govern.

---

## apps/reasoning-apps

### reasoning-apps (root)
| ADR | Title |
|-----|-------|
| [ADR-001](../../apps/reasoning-apps/docs/adr/ADR-001-polymarket-url-as-minimum-input.md) | Polymarket URL as Minimum Input |
| [ADR-004](../../apps/reasoning-apps/docs/adr/ADR-004-axiomvm-as-compute-agent.md) | AxiomVM as Compute Agent |
| [ADR-005a](../../apps/reasoning-apps/docs/adr/ADR-005-invariantis-immutable-proof-ledger.md) | Invariantis Immutable Proof Ledger |
| [ADR-005b](../../apps/reasoning-apps/docs/adr/ADR-005-proof-envelope-as-integration-currency.md) | Proof Envelope as Integration Currency |
| [ADR-006](../../apps/reasoning-apps/docs/adr/ADR-006-metabase-duckdb-dashboards.md) | Metabase + DuckDB Dashboards |
| [ADR-007](../../apps/reasoning-apps/docs/adr/ADR-007-parallel-rate-limited-fetching.md) | Parallel Rate-Limited Fetching |
| [ADR-008](../../apps/reasoning-apps/docs/adr/ADR-008-temporal-pipeline-orchestration.md) | Temporal Pipeline Orchestration |

### polymarket-confidence
| ADR | Title |
|-----|-------|
| [ADR-002](../../apps/reasoning-apps/apps/polymarket-confidence/docs/adr/ADR-002-rstmdb-as-primary-state-layer.md) | rstmdb as Primary State Layer |
| [ADR-003](../../apps/reasoning-apps/apps/polymarket-confidence/docs/adr/ADR-003-three-layer-proven-map.md) | Three-Layer Proven Map |
| [ADR-009](../../apps/reasoning-apps/apps/polymarket-confidence/docs/adr/ADR-009-archetype-subcategories.md) | Archetype Subcategories |

---

## epistemic-universe

### criterium
| ADR | Title |
|-----|-------|
| [ADR-001](../../epistemic-universe/criterium/docs/adr/ADR-001-inductive-deductive-bridge.md) | Inductive-Deductive Bridge |

---

## infra-eco

### o2l
| ADR | Title |
|-----|-------|
| [ADR-001a](../../infra-eco/o2l/docs/adr/ADR-001-green-threads.md) | Green Threads |
| [ADR-001b](../../infra-eco/o2l/docs/adr/ADR-001-implementation-plan.md) | Implementation Plan |

---

## reasoning-universe

### infer
| ADR | Title |
|-----|-------|
| [ADR-IMPL-001](../../reasoning-universe/infer/docs/adr/ADR-IMPL-001-cross-repo-dep-strategy.md) | Cross-Repo Dependency Strategy |
| [ADR-PLATFORM-001](../../reasoning-universe/infer/docs/adr/ADR-PLATFORM-001-aegis-glossary-and-naming.md) | Aegis Glossary and Naming |
| [ADR-PLATFORM-002](../../reasoning-universe/infer/docs/adr/ADR-PLATFORM-002-external-influences-science-libs.md) | External Influences / Science Libs |
| [ADR-THEORY-001](../../reasoning-universe/infer/docs/adr/ADR-THEORY-001-mdl-entropy-pctl-and-glushkov-composition.md) | MDL Entropy, PCTL, and Glushkov Composition |
| [ADR-THEORY-002](../../reasoning-universe/infer/docs/adr/ADR-THEORY-002-5verb-reasoning-framework.md) | 5-Verb Reasoning Framework |
| [ADR-THEORY-003](../../reasoning-universe/infer/docs/adr/ADR-THEORY-003-aaf-extraction-api.md) | AAF Extraction API |
| [ARCH](../../reasoning-universe/infer/docs/adr/separate-zz-pctl-rust-science-libs-architecture.md) | Separate zz / pctl-rs / Science Libs Architecture |

### pctl-rs
| ADR | Title |
|-----|-------|
| [ADR-006](../../reasoning-universe/pctl-rs/docs/adr/ADR-006-nine-same-tier-composition.md) | Nine Same-Tier Composition |
| [ADR-007](../../reasoning-universe/pctl-rs/docs/adr/ADR-007-belnap-state-formula-placement.md) | Belnap State Formula Placement |
| [ADR-008](../../reasoning-universe/pctl-rs/docs/adr/ADR-008-pctl-parser-depends-on-pctl-belnap.md) | PCTL Parser Depends on PCTL-Belnap |
| [ADR-009](../../reasoning-universe/pctl-rs/docs/adr/ADR-009-cli-belnap-output-format.md) | CLI Belnap Output Format |
| [ADR-010](../../reasoning-universe/pctl-rs/docs/adr/ADR-010-interval-probability-representation.md) | Interval Probability Representation |
| [ADR-011](../../reasoning-universe/pctl-rs/docs/adr/ADR-011-eager-vs-lazy-composition.md) | Eager vs Lazy Composition |
| [ADR-012](../../reasoning-universe/pctl-rs/docs/adr/ADR-012-belnap-mdp-structure.md) | Belnap MDP Structure |
| [ARCH](../../reasoning-universe/pctl-rs/docs/adr/pctl-paraconsistent-architecture.md) | PCTL Paraconsistent Architecture |

### zz-notation
| ADR | Title |
|-----|-------|
| [ADR-001](../../reasoning-universe/zz-notation/docs/adr/ADR-001-positioning-document-architecture.md) | Positioning Document Architecture |
| [ADR-002a](../../reasoning-universe/zz-notation/docs/adr/ADR-002-knowledge-store-architecture.md) | Knowledge Store Architecture |
| [ADR-002b](../../reasoning-universe/zz-notation/docs/adr/ADR-002-zz-as-meta-reasoning-platform.md) | ZZ as Meta-Reasoning Platform |

---

## tools/ai-tools

### flowspec
| ADR | Title |
|-----|-------|
| [ADR-001](../../tools/ai-tools/flowspec/docs/adr/ADR-001-vscode-copilot-agent-naming-convention.md) | VSCode Copilot Agent Naming Convention |
| [ADR-002](../../tools/ai-tools/flowspec/docs/adr/ADR-002-upgrade-repo-architecture-redesign.md) | Upgrade Repo Architecture Redesign |
| [ADR-003](../../tools/ai-tools/flowspec/docs/adr/ADR-003-upgrade-repo-implementation-approach.md) | Upgrade Repo Implementation Approach |

> flowspec also has an extensive build-docs/adr/ archive (30+ decision records). See [`tools/ai-tools/flowspec/build-docs/adr/`](../../tools/ai-tools/flowspec/build-docs/adr/) and [`user-docs/adr/`](../../tools/ai-tools/flowspec/user-docs/adr/).

### quint
| ADR | Title |
|-----|-------|
| [ADR-001](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr001-transpiler-architecture.md) | Transpiler Architecture |
| [ADR-002](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr002-errors.md) | Error Handling |
| [ADR-003](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr003-visiting-ir-components.md) | Visiting IR Components |
| [ADR-004](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr004-effect-system.md) | Effect System |
| [ADR-005](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr005-type-system.md) | Type System |
| [ADR-006](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr006-modules.lit.md) | Modules (Literate) |
| [ADR-007](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr007-flattening.md) | Flattening |
| [ADR-008](../../tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr008-managing-apalache.md) | Managing Apalache |

---

## Repos with no ADRs (as of 2026-04-21)

`apps/code-catalyst`, `epistemic-universe/criterium` (except ADR-001), `infra-eco/ctop`, `infra-eco/inferense`, `infra-eco/invariantis`, `infra-eco/npd-cipher`, `infra-eco/rstmdb`, `infra-eco/rstmdb-studio`, `reasoning-universe/aivm`, `reasoning-universe/axiomvm`, `reasoning-universe/craftegy-algo`, `reasoning-universe/obstruct`, `tools/ai-tools/codebase-memory-mcp`, `tools/ai-tools/codegraph-rust`, `tools/ai-tools/FPF`, `tools/ai-tools/fpf-problem-solving-skill`, `tools/ai-tools/grace-marketplace`, `tools/ai-tools/grace-skills`, `tools/ai-tools/graphify`, `tools/ai-tools/haft`, `tools/orchestrator/AllBeads`, `tools/orchestrator/beads_rust`, `tools/orchestrator/beads_viewer_rust`

---

## Adding a New ADR

1. Create in the relevant repo at `docs/adr/NNN-slug.md`
2. Add a row to the table above
3. Use the Nygard format (Status / Context / Decision / Consequences)

*Index last updated: 2026-04-21*
