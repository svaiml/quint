# PRD: SPECTRA Intelligence Platform

**Status**: Draft | **Date**: 2026-05-18
**Author**: @pm-planner (Senior Product Strategy Advisor)
**Tracked**: zombocrafteco-8az6 (Vision Epic)

---

## 1. Executive Summary
SPECTRA is a Rust-native SDD intelligence engine designed to bridge the gap between specification and implementation. It normalizes specifications from multiple agent frameworks (Claude Code, Gemini CLI, SpecKit, etc.), tracks their bidirectional impact on code and tests via the SpecImpact graph, and governs the implementation lifecycle using epistemic rigor (Dempster-Shafer evidence gates).

### Assessment Scores (from docs/assess/spectra-intelligence-platform-assessment.md)
*   **Overall Complexity**: 9.7/10 (Extreme orchestration, high integration density)
*   **Risk Score**: 6.0/10 (Compliance and formal governance requirements)
*   **Architecture Impact**: 7.3/10 (Introduction of Epistemic Moat and Superposition → Collapse methodology)
*   **Total Score**: 27.0/30 (Mandates Full SDD)

---

## 2. User Stories and Use Cases

### 2.1 User Personas
*   **Senior Software Engineer**: Needs to ensure that agent-generated code actually fulfills the spec and hasn't drifted over time.
*   **Technical Lead**: Needs a cross-repo view of spec coverage and implementation confidence levels.
*   **QA Engineer**: Needs to know exactly which tests verify which part of the specification.

### 2.2 User Stories
1.  **Normalization**: "As a developer using multiple agents (Claude Code for coding, Gemini for research), I want a single canonical representation of my specs so I can manage them consistently."
2.  **Impact Analysis**: "As a maintainer, I want to see which files are affected by a spec change before I approve the PR."
3.  **Governance**: "As a Tech Lead, I want to prevent a spec from being marked as 'Validated' unless it has passed formal evidence gates (Unit Tests + User Approval)."
4.  **Drift Detection**: "As a system auditor, I want to be alerted if the code implementation has diverged from the original specification."

---

## 3. DVF+V Risk Assessment

| Risk Category | Level | Mitigation Strategy |
| :--- | :--- | :--- |
| **Desirability** | Low | High demand for spec-integrity tools in the AI-agent era. |
| **Viability** | Medium | Open-core (MIT) model ensures ecosystem adoption; commercial layer for enterprise. |
| **Feasibility** | High | Mitigated by existing POCs in `reasoning-apps` and use of mature crates (`tree-sitter`, `lancedb`). |
| **Value** | Low | The "Epistemic Moat" provides unique value (L3 assurance) that competitors lack. |

---

## 4. Functional Requirements

### 4.1 Intelligence Layer (SpecIR-RS)
*   **FR-1.1**: Support normalization of Claude Code, Gemini CLI, and SpecKit formats into `SpecIR-RS`.
*   **FR-1.2**: Bidirectional Impact Graph (Spec <-> File <-> Symbol).
*   **FR-1.3**: Semantic vector search over specs using `lancedb-rs`.

### 4.2 Epistemic Layer (The Moat)
*   **FR-2.1**: Implement Assurance Levels L0 (Draft), L1 (Specified), L2 (Planned), L3 (Validated).
*   **FR-2.2**: Evidence Gates: Require formal artifacts (tests, logs, approval) for level promotion.
*   **FR-2.3**: Deductive Logic: Integrate with `infer-core` for invariant checking (Proof of Concept: `apps/reasoning-apps/apps/spectra/specs/spectra-logic-v1.infer`).

### 4.3 Workflow Layer
*   **FR-3.1**: State Machine: Strict transitions managed via CLI and MCP.
*   **FR-3.2**: Spiral Governor: PAUSE → DOCUMENT → UPDATE → TEST → IMPLEMENT → VERIFY loop.
*   **FR-3.3**: Superposition → Collapse: Support generating multiple architectural hypotheses and forcing a manual "Collapse" event.

---

## 5. Non-Functional Requirements
*   **Performance**: Rust-native implementation for sub-second graph operations on 10k+ nodes.
*   **Portability**: Ship as a standalone CLI, Rust crate, and MCP server.
*   **Security**: No transmission of codebase contents to external servers (local embeddings/processing).
*   **Integrity**: Content-addressed spec hashing for drift detection.

---

## 6. Task Breakdown

| Task ID | Title | Description | Status |
| :--- | :--- | :--- | :--- |
| zombocrafteco-aloi | Core: SpecIR-RS Types | Define the canonical representation and adapter traits. | Planned |
| zombocrafteco-f1l2 | Adapter: Claude Code | Implement the first adapter for `.claude/commands/spec/`. | Planned |
| zombocrafteco-je5c | Engine: SpecImpact Graph | Implement the DAG using `craftegy-graph`. | Planned |
| zombocrafteco-z6is | Governance: Evidence Gates | Implement L0-L3 promotion logic with Dempster-Shafer intervals. | Planned |
| zombocrafteco-kxju | Interface: MCP Server | Expose SPECTRA intelligence via Model Context Protocol. | Planned |

---

## 7. Discovery and Validation Plan
*   **Phase 1 (Dogfooding)**: Use SPECTRA to manage the development of the SPECTRA platform itself.
*   **Phase 2 (ARCUS Spec Specimen)**: Validate the engine against the ARCUS Trust Analysis (`apps/reasoning-apps/apps/spectra/specs/arcus-trust-golden.infer`).
*   **Phase 3 (Open Alpha)**: Release as a Rust crate for feedback from the `beads-rust` community.

---

## 8. Acceptance Criteria and Testing
*   **AC-1**: Successful normalization of 3 different spec formats into a single IR.
*   **AC-2**: Impact analysis correctly identifies all files modified in a PR related to a spec.
*   **AC-3**: L3 status cannot be achieved without a recorded "User Approval" (Collapse event).
*   **Testing**: 90% code coverage on `spectra-core`; formal logic verification via `infer`.

---

## 9. Dependencies and Constraints
*   **Dependencies**: `beads-rust`, `craftegy-algo`, `infer`, `zz-notation`, `criterium`.
*   **Constraints**: Must run in headless CI environments; must support `gm` workspace context.

---

## 10. Success Metrics
*   **Spec-Code Drift**: < 5% divergence in governed repos.
*   **Developer Velocity**: 20% reduction in "context-gathering" time during refactors.
*   **Assurance**: 100% of L3 specs have verifiable unit test evidence.

---

**Reference Files**:
- Logic POC: `apps/reasoning-apps/apps/spectra/specs/spectra-logic-v1.infer`
- Vision POC: `apps/reasoning-apps/apps/spectra/docs/spectra-proof-of-vision.html`
- ARCUS Spec: `apps/reasoning-apps/apps/spectra/specs/arcus-trust-golden.infer`
