# PRD: Three-Layer Proven Map Pattern (RSTMDB + Infer)

## 1. Overview
The **Three-Layer Proven Map Pattern** is an architectural pattern for building "proven dynamic maps" where every state assignment in a system is backed by a verifiable proof chain. It combines the state-tracking capabilities of **RSTMDB** with the logical reasoning and proof-generation capabilities of **Infer**.

## 2. Problem Statement
Traditional analytics and classification systems often present "black-box" conclusions. A classification (e.g., "High Risk") is often just a value in a database without a clear, auditable trail of evidence. This leads to:
- **Lack of Transparency**: Users can't see *why* a classification was made.
- **Brittleness**: It's unclear which pieces of evidence are "load-bearing" for a conclusion.
- **Static Analysis**: Conclusions don't naturally update or respond to changes in evidence quality.
- **Implicit Ignorance**: The system doesn't know what it doesn't know (missing evidence).

## 3. Goals
- **Auditability**: Every state transition must have an associated proof chain.
- **Challengeability**: Use stress testing to identify load-bearing evidence.
- **Honest Incompleteness**: Explicitly track and display missing evidence.
- **Dynamic Feedback**: Enable a closed-loop system where reasoning results drive state transitions.

## 4. Architecture: The Three Layers

### Layer 1: RSTMDB (The State Machine)
- **Role**: Tracks states, transitions, and context.
- **Responsibility**: Persistence of current classifications and the data used to reach them.
- **Analogy**: The "what" - a snapshot of the current understanding.

### Layer 2: Infer (The Proof Engine)
- **Role**: Executes logical reasoning using the 5-verb framework (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR).
- **Responsibility**: Evaluating evidence, calculating confidence scores, and identifying gaps.
- **Analogy**: The "why" - the reasoning process behind the snapshot.

### Layer 3: RSTMDB + Infer (The Proven Dynamic Map)
- **Role**: The integrated system where RSTMDB guards enforce thresholds proven by Infer.
- **Responsibility**: Orchestrating the feedback loop between state and reasoning.
- **Analogy**: The "proven map" - a live, auditable, and challengeable model of reality.

## 5. The Feedback Loop
1. **RSTMDB** maintains the current state of an entity (e.g., a "whale" in a trading platform).
2. **Bridge** extracts the state context and transforms it into Infer facts.
3. **Infer** processes the facts through a reasoning program (e.g., searching for rule exploitation).
4. **Bridge** parses Infer's output (confidence scores, evidence gaps).
5. **RSTMDB** receives events from the bridge to transition states based on the proof (e.g., `profiled` -> `flagged`).

## 6. User Stories
- **As an Auditor**, I want to click on any classification and see the full chain of evidence that produced it.
- **As a Developer**, I want to run a "stress test" to see which piece of evidence, if removed, would most significantly change the classification.
- **As an Investigator**, I want to see a list of "missing evidence" that, if found, would increase the confidence of a classification.

## 7. Acceptance Criteria
- [ ] Every state transition in the system must be triggered by a proof-backed event.
- [ ] Every classification must display a confidence score and an evidence inventory.
- [ ] Stress tests must be able to identify load-bearing factors for any given state.
- [ ] Missing evidence must be explicitly listed using the DETECT verb.

## 8. Reference Implementation
The pattern is first being applied in the `Polymarket Confidence Scam Detector` project located in `apps/reasoning-apps/apps/polymarket-confidence`.
