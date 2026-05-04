# Specification: AI-Native Spiral Pipeline Integration

## 1. Technical Architecture
The pipeline operates as a **Federated Agentic System** across the 8 Prometey Layers. Each layer exposes an MCP (Model Context Protocol) server or CLI interface that the `00_Orchestration` layer (the Commander) consumes. This specification references the requirements defined in **docs/prd/spec.md**.

### 1.1. Core Integration Hub: `contextflow-forge`
Located in `02_Spec`, `contextflow-forge` acts as the **Context Registry**. It maintains the `.kiro` steering rules and requirements.
- **Input**: Human Strategic Intent (Markdown).
- **Process**: MD → XML (Agent-Optimized) → JSON (Workflow Engine).
- **Sync**: Ensures parity between requirements and tasks.

## 2. The "Spiral Loop" Tool Mapping

### 2.1. PAUSE (State Management)
- **Tool**: `flowspec` (CLI) + `PaperClip` (UI).
- **Mechanism**: Agents stop execution when a "Gap" is detected. The state is stored in **.beads** (03_Bridge).

### 2.2. DOCUMENT (Knowledge Discovery)
- **Tool**: `Graphify` (04_Knowledge).
- **Mechanism**: Run `/graphify` to generate a semantic map. Extract God Nodes and relationships to provide high-level wisdom.

### 2.3. UPDATE (Spec Refinement)
- **Tool**: `contextflow-forge` (02_Spec).
- **Mechanism**: Update `.kiro/specs/` files. The processing pipeline regenerates contexts for agents.

### 2.4. TEST (Logic Proof & Validation)
- **Tool**: `cronus` (02_Spec) + `infer` (06_Inference).
- **Mechanism**: 
    - `cronus` validates EARS syntax and requirements consistency.
    - `infer` (Rust logic engine) proves that the proposed change satisfies architectural invariants.

### 2.5. IMPLEMENT (Execution)
- **Tool**: `Aider` / `Cline` (07_Execution) + `vibescaffold` (02_Spec).
- **Mechanism**: 
    - `vibescaffold` generates boilerplate/scaffolding.
    - `Aider` performs surgical code edits using the symbolic map from `CodeGraph`.

### 2.6. VERIFY (QA & Evaluation)
- **Tool**: `vitest` / `playwright` (07_Execution) + `flowspec` (00_Orch).
- **Mechanism**: Execute the automated test suite. `flowspec` validates the transition to "Done" only if all tests pass.

## 3. Implementation Roadmap

### Phase 1: Context Stabilization
- [ ] Connect `contextflow-forge` to the monorepo root.
- [ ] Implement `Graphify` scan triggers in the `DOCUMENT` phase.

### Phase 2: Logic Proof Integration
- [ ] Define `infer` logic rules for architectural integrity.
- [ ] Hook `cronus` into the `flowspec` validation gate.

### Phase 3: Dashboard & Orchestration
- [ ] Set up the `PaperClip` UI to visualize Spiral Cycles.
- [ ] Enable `gsd-2` to command cross-layer migrations.

## 4. Risks & Mitigations
- **Complexity**: The loop may add latency. Mitigation: Automate `DOCUMENT` and `TEST` phases to run in the background.
- **Incompatibility**: Disparate languages (Rust, Python, TS). Mitigation: Use Model Context Protocol (MCP) as the universal glue.
