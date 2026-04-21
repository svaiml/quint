---
name: FlowSync
description: "Sync tasks between backlog.md and beads issue tracker."
target: "chat"
tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Grep"
  - "Glob"
  - "Bash"
  - "mcp__backlog__*"
  - "Skill"

## Context
Use this agent to synchronize state between the human-readable `backlog.md` and the high-performance `beads` (Rust) issue tracker.

## Execution
Run the synchronization command:
```bash
flowspec sync tasks --direction bidirectional
```

## Post-Completion
After sync, the task graph is updated. You can now use triage or implementation commands.
