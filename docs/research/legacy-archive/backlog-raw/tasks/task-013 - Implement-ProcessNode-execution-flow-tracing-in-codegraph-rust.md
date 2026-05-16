---
id: task-013
title: Implement ProcessNode execution-flow tracing in codegraph-rust
status: To Do
assignee: []
created_date: '2026-05-04 22:50'
updated_date: '2026-05-04 22:54'
labels:
  - implement
  - codegraph-rust
  - research-followup
  - knowledge-graph
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
WHAT: Add named ProcessNode entities to codegraph-rust SurrealDB schema to model user-facing execution flows as first-class graph entities.
WHY: GitNexus research identified this as the primary unique capability gap — without it, AI agents see symbol-level impact but miss cascading flow effects (e.g., changing a function breaks the 'checkout flow').
HOW: Design ProcessNode schema + manifest format (TOML declaring named processes + entry-point symbols) → implement process attribution phase between Resolution and Clustering → add MCP tool for detect_changes equivalent
Refs: docs/research/gitnexus-research.md, tools/ai-tools/codegraph-rust/
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ProcessNode schema and TOML manifest format designed and documented
- [ ] #2 Process attribution phase implemented between Resolution and Clustering in codegraph-rust
- [ ] #3 detect_changes equivalent MCP tool returns affected processes (not just symbols) for a git diff
- [ ] #4 At least 2 reasoning-apps execution flows annotated and validated end-to-end
<!-- AC:END -->
