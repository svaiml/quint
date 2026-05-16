---
id: task-012
title: 'Spike: codegraph-rust workspace mode for multi-repo contract extraction'
status: To Do
assignee: []
created_date: '2026-05-04 22:49'
updated_date: '2026-05-04 22:50'
labels:
  - spike
  - codegraph-rust
  - research-followup
  - knowledge-graph
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
WHAT: Prototype cross-repo indexing in codegraph-rust by defining ContractEdge schema and indexing two repos (infer + o2l) into shared SurrealDB instance.
WHY: 28+ repos with growing microservice boundaries (o2l, infer, rstmdb, invariantis) — interface contract drift is the highest-value gap identified in GitNexus research.
HOW: Define ContractEdge schema → prototype shared SurrealDB workspace → extract public API surfaces from 2 repos → validate cross-repo query
Refs: docs/research/gitnexus-research.md, tools/ai-tools/codegraph-rust/
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ContractEdge schema defined in SurrealDB
- [ ] #2 Two repos (infer + o2l) indexed into shared SurrealDB workspace instance
- [ ] #3 Cross-repo query returns public API surface of o2l consumed by infer
- [ ] #4 Feasibility verdict documented: proceed / rescope / abandon with rationale
<!-- AC:END -->
