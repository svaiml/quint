# ADR-004: Secret Exclusion by Default

**Status**: Accepted
**Date**: 2026-04-23

## Context

The sync source (`D:\WORK\Organizations\AITechCraft\Research\`) is a developer monorepo that may contain:

- `.env` files with API keys, database passwords, and service credentials
- `*.pem` / `*.key` / `*.p12` / `*.pfx` certificate and private key files
- Files named `*credentials*` or `*secrets*` (common naming conventions for credential stores)
- `.aws/` directories containing AWS credential files
- `.ssh/` directories (if present in the workspace tree)

The sync remote is `root@89.167.57.6` — a Linux server with root-level SSH access. If any secret
file is transferred to this server, the blast radius extends to: full server compromise if the server
itself is compromised, credential leakage if the remote filesystem is ever shared or backed up
without the same exclusions, and audit failures in any compliance review.

The validation document (Risk #1: Secret File Sync, Probability: HIGH / Impact: CRITICAL) identifies
this as the highest-priority risk before any sync run takes place.

The security spike `bd-1g9` is a hard blocker for all implementation tasks specifically to address
this risk before code is written.

The design question is: should secret exclusion be user-configurable, partially configurable, or
unconditionally enforced?

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **User-configurable only** (no defaults) | Maximum flexibility; user controls what is excluded | A single oversight — forgetting to add `.env` to the exclude list — results in a critical secret exposure; not acceptable for a tool with root SSH access |
| **Default deny-list, fully overridable** | Good defaults with escape hatch | User can accidentally remove `.env` from the list via config override; safety guarantee is not absolute |
| **Default deny-list + user can ADD but not remove core patterns** | Safety floor is guaranteed; user can add org-specific patterns | Slightly reduced flexibility for advanced users who knowingly want to sync credential files (rare; better handled by explicit rclone invocation outside the wrapper) |
| **Hardcoded deny-list, no user override** | Maximum safety; no configuration surface for mistakes | Cannot accommodate org-specific exclusion patterns beyond the built-in set |

## Decision

**Enforce a default deny-list unconditionally. Users may ADD additional patterns but cannot remove
the core secret patterns.**

The core patterns that are hardcoded and non-removable:

```
.env
.env.*
*.pem
*.key
*.p12
*.pfx
*credentials*
*secrets*
.aws/**
.ssh/**
```

These patterns are passed to rclone via `--exclude-from sync-excludes.txt`. The wrapper generates
this file at startup, always prepending the core patterns before any user-supplied additions.
User-supplied additions from `config.yml` are appended after the core patterns.

The `sync-excludes.txt` file is written to a temp directory at runtime and is not user-editable
directly — the wrapper owns its content. This prevents accidental or deliberate removal of core
patterns via file editing.

The decision rationale: the incremental security value of being able to sync `.env` files through
this tool is zero (a direct `rclone copy` invocation is always available for intentional credential
transfer if ever needed). The downside of allowing removal is a CRITICAL exposure. The asymmetry
strongly favors unconditional enforcement.

## Consequences

**Positive:**
- Zero risk of accidentally syncing credentials regardless of user config
- The safety property is testable: acceptance criterion #3 verifies via `rclone check --dry-run`
  that zero files matching secret patterns appear in any transfer set
- Security spike `bd-1g9` can verify this property as a hard gate before implementation begins
- Auditable: `sync-excludes.txt` is generated at startup from a known, version-controlled function
- macOS-specific noise files (`.DS_Store`, `._*`) are added to the deny-list on macOS automatically

**Negative:**
- A developer who legitimately needs to sync a `.pem` file (e.g., a certificate for a web service
  checked into the repo intentionally) cannot do so through this tool
- Slight friction: the wrapper exits with an explanatory error if a user attempts to override core patterns

**Mitigations:**
- The PRD and README document that intentional credential/certificate file transfers should use
  direct `rclone copy` with explicit source and destination, bypassing the wrapper
- The error message when a core pattern override is attempted explains the rationale and provides
  the direct rclone command as an alternative
- The SSH private key (`sash.pem`) is already stored outside the synced workspace tree
  (`D:\WORK\Organizations\SpilnoMe\keys\`) — this architectural separation should be preserved
