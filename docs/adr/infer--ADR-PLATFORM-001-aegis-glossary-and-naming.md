# ADR-PLATFORM-001: Aegis Glossary And Naming

## Status
Accepted

## Context

Planning documents and discussion have used `Aegis`, `AGIS`, and `Ageos` interchangeably.
That creates confusion about whether these are different subsystems or simple misspellings.

## Decision

Use `Aegis` as the canonical name for the product capability layer.

Definitions:

- `Aegis`: product layer that assembles reasoning modalities into end-user capabilities
- `AGIS`, `Ageos`: deprecated misspellings that should redirect to `Aegis`

`Aegis` is a capability layer, not a proof calculus and not a kernel algorithm.

## Consequences

### Positive

- removes ambiguity in future ADRs and roadmap docs
- keeps product and formal layers distinct
- makes grep- and glossary-based hygiene possible

### Negative

- older documents need cleanup or redirect notes
- some capability descriptions still need formalization underneath

### Neutral

- does not change any runtime architecture by itself
