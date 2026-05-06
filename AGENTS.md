# FlowSpec Agent Instructions

This project uses **FlowSpec** for Spec-Driven Development (SDD).

## Skills System

Codex loads skills from `.agents/skills/`. Use `/skills` to browse available skills or
invoke them inline using `$<skill-name>` syntax. Codex may also trigger skills implicitly
when a task description matches a skill's description.

| Command | Skill Name | Purpose |
|---------|-----------|---------|
| `$flow-assess` | `flow-assess` | Evaluate feature complexity and SDD fit |
| `$flow-specify` | `flow-specify` | Create PRD / feature spec |
| `$flow-plan` | `flow-plan` | Architecture and platform planning |
| `$flow-implement` | `flow-implement` | Guided implementation with agents |
| `$flow-validate` | `flow-validate` | QA, security, docs validation |
| `$flow-gate` | `flow-gate` | Quality gate before implementation |
| `$flow-triage` | `flow-triage` | Session-start project triage via bv |
| `$flow-intake` | `flow-intake` | Process INITIAL feature docs |
| `$flow-research` | `flow-research` | Business validation and research |
| `$flow-init` | `flow-init` | Initialize SDD constitution |
| `$flow-reset` | `flow-reset` | Reset workflow configuration |
| `$flow-generate-prp` | `flow-generate-prp` | Generate PRP context bundle |
| `$flow-map-codebase` | `flow-map-codebase` | Map codebase for context |
| `$flow-security_workflow` | `flow-security_workflow` | Security scanning workflow |
| `$flow-sync` | `flow-sync` | Sync backlog and beads tasks |
| `$vibe-vibe` | `vibe-vibe` | Casual mode — just code it |

## How to Execute a Skill

Three ways to invoke a skill:

1. **Browse**: Type `/skills` to open the skills menu and select interactively.
2. **Inline explicit**: Type `$flow-gate docs/prd/my-feature-spec.md --threshold 95`
   in the chat — Codex invokes the `flow-gate` skill with those arguments.
3. **Implicit**: Codex may automatically trigger a skill when your task description
   matches the skill's description (e.g., asking to "assess" a feature triggers
   `flow-assess`).

## SDD Workflow Order

```
$flow-assess -> $flow-specify -> $flow-plan -> $flow-implement -> $flow-validate
```

Run `$flow-gate` before implementation to validate spec quality.
Run `$flow-triage` at session start for project context.

## Task Tracking — Two Systems, Never Mixed

| System | CLI | When to use |
|--------|-----|-------------|
| Backlog.md | `backlog task ...` | Feature/task tracking, workflow labels |
| Beads-rust | `br ...` | Agent implementation steps, sub-tasks |

```bash
backlog task edit <id> -l workflow:Specified   # set workflow label (backlog only)
br update <id> --status=in_progress            # valid br statuses: open/in_progress/blocked/deferred/closed
# NEVER: br update <id> --status=Specified     # invalid — not a br status
```

## Project Intelligence (bv)

```bash
bv -agent-brief /tmp/bv-brief   # Full session context export
bv -robot-next                  # Recommended next task
bv -robot-triage                # Full triage report
bv -robot-alerts                # Blockers and risks
bv -robot-suggest               # Duplicate/related issue detection
bv -robot-blocker-chain <id>    # Blocker chain for a task
bv -robot-forecast <id>         # ETA forecast
```

## Ecosystem Setup (gm)

`gm` is the git workspace orchestrator. It uses `gh repo clone` (HTTPS + OAuth) for all cloning — no SSH keys needed.

### First-time setup

```bash
gh auth login                                    # authenticate
gh config set git_protocol https --host github.com  # HTTPS mode
gh auth switch --user USER                      # account with access to all 5 orgs
./bin/bootstrap                                   # clones 62 repos + installs tools
```

### Common commands

```bash
gm status                    # all repos: branch, dirty, ahead/behind
gm sync                      # clone missing repos (parallel)
gm pull                      # fetch + merge all
gm lock                      # snapshot state → .gm/workspace.lock
gm lock --diff               # drift since last lock
gm push --plan               # dependency-ordered push plan
gm exec "cargo test" --group reasoning  # run command across group
```

### Troubleshooting for agents

| Problem | Fix |
|---------|-----|
| SSH passphrase prompts | `gh config set git_protocol https --host github.com` |
| Repos not cloning | `gh auth switch --user USER` (has access to all orgs) |
| `gm` not found | `cargo install --git https://github.com/svaiml/gm.git --branch feature/m1-bootstrap --bin gm gm-cli` |
| Windows path errors | gm v0.1.0+ strips `\\?\` prefix automatically |
