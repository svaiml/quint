# Research: FPF + Haft Upstream Updates -- Ecosystem Integration Analysis

**Date**: 2026-05-14 | **Scope**: FPF commits b18acde..ee40821; Haft v7.0.0 + v7.1.0
**Tracked**: zombo-sash-eco-qte8

## Executive Summary

FPF and Haft have both undergone major releases introducing causal evidence vocabulary (C.27/C.28), source restoration discipline (A.15.4), spec-first project harnessability (Haft v7), and typed causal bindings with R-cap enforcement (Haft v7.1). These changes have direct integration points with three ecosystem repos: **criterium**, **zz-notation** (our Haft counterpart), and **infer**.

## Key Findings

### 1. CausalEvidenceSupportBasis -> AssuranceLevel Mapping

FPF C.28 introduces a five-value controlled set: `observationalAssociationSupportBasis`, `interventionalActionSupportBasis`, `realizedCounterfactualSampleSupportBasis`, `identifiedCounterfactualEstimateSupportBasis`, `simulationOnlyCounterfactualOutputBasis`.

These map to our L0-L3 progression (from `epistemic-universe/criterium/docs/adr/ADR-001-inductive-deductive-bridge.md`):

| CausalEvidenceSupportBasis | Max Reachable AssuranceLevel | Haft R-cap | Rationale |
|---|---|---|---|
| `simulationOnly` | **L1 (Deduced)** | 0.5 | Cannot produce empirical evidence; stays in deductive domain |
| `observationalAssociation` | **L2 (Induced)** | none | Association data satisfies inductive evidence if properly measured |
| `identifiedCounterfactualEstimate` | **L2 (Induced)** | none | Identified estimates admissible under declared assumptions |
| `interventionalAction` | **L3 (Operational)** | none | Direct intervention data is strongest basis |
| `realizedCounterfactualSample` | **L3 (Operational)** | none | Physically obtained counterfactual samples |

The R-cap at 0.5 for simulation-only maps exactly to the criterium L1->L2 gate. In `criterium/docs/design/bridge2-session-model.md`, `try_advance()` requires `bel >= theta` for L2 promotion. Simulation-only evidence produces plausibility but not belief mass -- the 0.5 cap prevents it from ever achieving sufficient R_eff.

### 2. R-cap Validates Our VS Calibration Research

Our VS calibration spike (`docs/research/vs-probability-calibration-spike.md`) established `cal = max(0.5, 1 - ECE)` as the floor for the Shafer discounting parameter. Haft's R-cap at 0.5 for simulation-only/nonrealizable is the same invariant: both prevent simulation/uncalibrated evidence from achieving false certainty. The convergence validates both approaches.

### 3. SpecCoverage -> zz-notation Strategy Composition

Haft v7's `SpecCoverage` states (`uncovered -> reasoned -> commissioned -> implemented -> verified -> stale`) map to **zz-notation's** meta-reasoning platform, NOT flowspec. ZZ-notation is our ecosystem's counterpart to Haft's decision governance. SpecCoverage states should inform zz-notation's strategy composition architecture and KnowledgeStore fact lifecycle (staleness, verification status).

### 4. AutonomyEnvelope Gap

Our `.mcp.json` has no scope guards. Any MCP tool can access any file. Haft v7's AutonomyEnvelope (allowed repos/paths/actions, forbidden one-way-door actions, concurrency budgets) should inform future `gm` workspace orchestrator and **zz-notation** agent governance design.

### 5. resolve_term MCP Relevance

Haft's `resolve_term` MCP action grounds umbrella terms in a project's bounded context. Our ecosystem lacks this. It would benefit criterium's TermMap, infer's predicate disambiguation, and zz-notation's KnowledgeStore fact validation.

### 6. Workspace Sync Status (gm)

Both FPF and Haft repos under `_external/` show modifications in git status, meaning they have newer commits than the last `gm sync`. A `gm sync` or `gm pull` is needed to capture the current state in the workspace. Haft v7.1.0 reports FPF corpus at `ee40821c`.

## FPF Analysis Detail

**C.27 (Temporal Claim Adequacy)**: ~2455 new lines. Introduces Dyn0/Dyn1/Dyn2 classification for temporal claims. The anti-bureaucracy invariant: "no C.27 record unless the Dyn0/Dyn1/Dyn2 distinction changes interpretation." Relevant for criterium claims involving rate-change and for pctl-rs temporal properties.

**C.28 (CausalUse-CAL)**: ~900 new lines. Three-level escalation (triage record -> local card -> durable card -> heavy profiles). Key types: `CausalUseTriageRecord`, `CausalityLadderRung` (3 values), `CausalEvidenceSupportBasis` (5 values), `RealizabilityVerdict` (4 values), `CounterfactualSamplingRealizabilityProfile`. The central rule CC-B3.9: unsupported causality-ladder climb SHALL degrade, block, or abstain rather than raising R.

**A.15.4 (Source Restoration)**: ~300 new lines. Core discipline: before any work/reliance claim, recover the exact project source record. First output is a 5-field note: `encountered item / live claim / exact source needed / admissible next move / blocked overread`. Already implemented in Haft v7.1 as carrier footers on all `/h-view` projections.

## Haft Analysis Detail

**v7.0.0**: Spec-first onboarding (TargetSystemSpec + EnablingSystemSpec + TermMap), AutonomyEnvelope, harness batch drain with lockset conflict prevention, SpecCoverage states, ImplementationPlan DAG, spec drift detection (SHA-256 baseline), resolve_term MCP, multi-commission scope-leak guard.

**v7.1.0**: C.28 typed binding on EvidenceItem/DecisionPrediction, R-cap at 0.5 for simulation-only/nonrealizable, A.15.4 carrier footer on all projections, complete-external CLI, v8 agent stack foundation (algebraic Session/Turn/Part, JSONL journal, HTTP+SSE), critical artifact_ref misroute fix.

## Concrete Follow-up Tasks

1. **gm sync** to pull latest FPF + Haft into `_external/`
2. **criterium**: Add `CausalSupportBasis` enum + gate L1->L2 on simulation-only
3. **zz-notation**: Add causal_support_basis to KnowledgeStore facts + R-cap in bridge scoring
4. **zz-notation**: Integrate Haft SpecCoverage states into strategy composition + staleness/drift detection
5. **Strategic**: AutonomyEnvelope for gm + zz-notation agent governance, resolve_term integration, A.15.4 carrier discipline

## Sources

- `tools/ai-tools/_external/FPF/FPF-Spec.md` (lines 44007-46957 for C.27/C.28; 20657-20955 for A.15.4; 11874-12648 for A.6.P)
- `tools/ai-tools/_external/haft/CHANGELOG.md` (full file, 444 lines)
- `epistemic-universe/criterium/docs/adr/ADR-001-inductive-deductive-bridge.md`
- `epistemic-universe/criterium/docs/design/bridge2-session-model.md`
- `reasoning-universe/zz-notation/docs/assess/fpf-haft-ecosystem-assessment.md`
- `docs/research/vs-probability-calibration-spike.md`
- `docs/research/verbalized-sampling-ecosystem-amplification.md`
- `.mcp.json`
- `.gm/workspace.yaml`
