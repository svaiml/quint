---
name: FlowSync
description: "Sync tasks in beads issue tracker."
target: "chat"
tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Grep"
  - "Glob"
  - "Bash"
  - "Skill"

## Context
Use this agent to synchronize state in the `beads` (Rust) issue tracker.

## Execution
Run the synchronization command:
```bash
flowspec sync tasks --direction bidirectional
```

## Post-Completion
After sync, the task graph is updated. You can now use triage or implementation commands.
