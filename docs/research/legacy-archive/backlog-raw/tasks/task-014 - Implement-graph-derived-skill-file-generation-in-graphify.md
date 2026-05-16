---
id: task-014
title: Implement graph-derived skill file generation in graphify
status: To Do
assignee: []
created_date: '2026-05-04 22:54'
updated_date: '2026-05-04 22:55'
labels:
  - implement
  - graphify
  - research-followup
  - knowledge-graph
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
WHAT: Add a 'flowspec skills' CLI command to graphify that generates AGENTS.md/CLAUDE.md from Leiden clustering output rather than templates.
WHY: GitNexus research shows graph-derived skill files stay current as code evolves; template-based files (flowspec) require manual updates.
HOW: Pipe graphify Leiden cluster output → map community boundaries to capability descriptions → emit structured CLAUDE.md markdown
Refs: docs/research/gitnexus-research.md, tools/ai-tools/graphify/
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 graphify skills --output CLAUDE.md command implemented
- [ ] #2 Generated file maps Leiden clusters to capability sections with entry points
- [ ] #3 Validated on at least one reasoning-apps repo — output is more accurate than current template-based CLAUDE.md
<!-- AC:END -->
