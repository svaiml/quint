# Implementation Plan: Three-Layer Proven Map Pattern

## 1. Objectives
Implement the architectural pattern described in `docs/prd/three-layer-proven-map.md`. This plan focuses on the general infrastructure and the first application in `reasoning-apps`.

## 2. Technical Architecture
The system consists of three distinct components:
- **State Store (RSTMDB)**: Persistent state and context.
- **Reasoning Engine (Infer)**: Logical analysis and proof generation.
- **Bridge (Orchestrator)**: Bi-directional data flow and feedback loop.

### ADRs
- **ADR-002**: RSTMDB as Primary State Layer.
- **ADR-003**: Three-Layer Proven Map Pattern.

## 3. Implementation Phases

### Phase 1: RSTMDB Infrastructure
- [ ] Define state machine schemas for the target domain (e.g., `whale_lifecycle`, `event_lifecycle`).
- [ ] Develop scripts to register machines and seed initial data.
- [ ] **Deliverable**: RSTMDB instance with active state machines and queryable context.

### Phase 2: Reasoning Integration (Infer)
- [ ] Develop `.infer` reasoning programs for the target domain.
- [ ] Map RSTMDB context fields to Infer facts (e.g., `win_rate` -> `fact win_rate(...)`).
- [ ] Implement the 5-verb analysis (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR).
- [ ] **Deliverable**: Infer programs that can verify and score RSTMDB states.

### Phase 3: Bi-directional Bridge
- [ ] Implement `rstmdb-to-infer` script: Extracts context -> Generates `.infer` file.
- [ ] Implement `infer-to-rstmdb` script: Parses Infer output -> Applies RSTMDB events.
- [ ] Configure RSTMDB guards to enforce thresholds proven by Infer.
- [ ] **Deliverable**: Automated feedback loop between state and proof.

### Phase 4: Reporting & Visualization
- [ ] Develop a reporting tool that aggregates data from both RSTMDB and Infer.
- [ ] Display proof chains, confidence scores, and load-bearing evidence.
- [ ] **Deliverable**: Markdown or web-based "Proven Map" report.

## 4. Dependencies & Risks
- **Dependency**: RSTMDB server must be accessible.
- **Dependency**: Infer CLI must be installed and configured.
- **Risk**: High latency in the bridge for large datasets.
- **Risk**: Complexity of mapping domain-specific context to logical facts.

## 5. Next Steps
1. Execute Phase 1 for the `Polymarket Confidence Scam Detector`.
2. Verify state transitions with manual `rstmdb-cli` calls.
3. Begin Phase 2 by drafting the core `.infer` reasoning logic.
