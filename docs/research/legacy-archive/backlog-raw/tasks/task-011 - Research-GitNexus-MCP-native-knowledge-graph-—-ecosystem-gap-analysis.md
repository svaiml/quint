---
id: task-011
title: 'Research: GitNexus MCP-native knowledge graph — ecosystem gap analysis'
status: Done
assignee:
  - '@researcher'
created_date: '2026-05-04 22:45'
updated_date: '2026-05-04 22:55'
labels:
  - research
  - spike
  - knowledge-graph
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
WHAT: Analyze GitNexus against existing ecosystem tools to identify gaps and integration opportunities.
WHY: GitNexus (~31K stars) is gaining traction in the MCP/Claude Code space; need to determine if adoption is warranted or if gaps should be closed natively.
HOW: Market analysis → competitive comparison → gap identification → build-vs-adopt recommendation
Refs: docs/research/gitnexus-research.md
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Market analysis: GitNexus architecture, capabilities, MCP integration documented
- [x] #2 Competitive landscape analyzed (codegraph-rust, codebase-memory-mcp, graphify vs GitNexus)
- [x] #3 Genuine gaps identified: process tracing, multi-repo contracts, graph-derived skill files
- [x] #4 Build-vs-adopt recommendation with risk register
- [x] #5 Follow-up implementation tasks created
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
# Research Findings: GitNexus vs AITechCraft Ecosystem

## Executive Summary
Do NOT adopt GitNexus directly. The ecosystem (codegraph-rust + codebase-memory-mcp + graphify) already covers 80%+ of GitNexus capabilities — in many dimensions more deeply. Three genuine gaps exist and should be closed natively.

## Genuine Gaps
1. Named execution process tracing (ProcessNode) — task-013
2. Multi-repo contract extraction (workspace mode) — task-012 spike
3. Graph-derived skill file generation — task-014

## Recommendation: Proceed with Caution — Native Build
Confidence: 78%

## Follow-up Tasks
- task-012: Spike — codegraph-rust workspace mode for multi-repo contracts (HIGH)
- task-013: Implement ProcessNode execution-flow tracing (HIGH)
- task-014: Graph-derived skill file generation in graphify (MEDIUM)

## Sources
docs/research/gitnexus-research.md
https://github.com/abhigyanpatwari/GitNexus
https://arxiv.org/html/2603.27277v1
<!-- SECTION:NOTES:END -->
