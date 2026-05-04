# ADR-THEORY-001: MDL, Entropy, PCTL, And Glushkov Composition

## Status
Accepted

## Context

Roadmap discussions have mixed several different formal ideas under one vague notion of
`complexity` or `master reasoning`. Without sharper boundaries, implementation work risks
collapsing incompatible concepts into the same layer.

## Decision

Assign distinct responsibilities:

- `MDL` and computable description-length proxies: hypothesis ranking and model selection, especially RSI
- `entropy` and calibrated probability: uncertainty narratives for beliefs and probability-bearing models
- `PCTL`: temporal and path-based verification over extracted finite-state models
- `Glushkov algebra`: composition of processes, agents, or reasoning workflows

Additional rule:

- the project does **not** claim to compute exact Kolmogorov complexity `K(x)`
- any implementation must use explicit approximations or proxy objectives
- Glushkov composition is orthogonal to Belnap truth values and must not be modeled as another truth annotation

## Consequences

### Positive

- prevents theory drift across ADRs and product docs
- gives RSI, PCTL, and future `infer-compose` separate conceptual homes
- supports precise documentation for Aegis capabilities

### Negative

- reduces the simplicity of one-big-idea messaging
- requires deliberate bridge rules when features mix these layers

### Neutral

- this ADR is a framing constraint; it does not by itself add new crates or algorithms
