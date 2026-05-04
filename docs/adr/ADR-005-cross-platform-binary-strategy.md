# ADR-005: Cross-Platform Binary Strategy

**Status**: Accepted
**Date**: 2026-04-23

## Context

The folder-sync-tool must work on four platforms: Windows 10/11, Linux (Ubuntu 22.04+), macOS 14+,
and FreeBSD 14. The Python wrapper (ADR-002) is inherently cross-platform. The question this ADR
addresses is: how should the rclone binary dependency be managed across these platforms?

rclone is a compiled Go binary with official releases for all four targets:
- Windows: `rclone-vX.Y.Z-windows-amd64.zip` / `winget install Rclone.Rclone`
- Linux: `rclone-vX.Y.Z-linux-amd64.zip` / `apt install rclone` / install script
- macOS: `brew install rclone` / portable binary
- FreeBSD: `pkg install rclone` / ports: `net/rclone`

The pinned version is **v1.73.5** (released 2026-04-19).

The wrapper cannot function without rclone. The deployment question is whether the wrapper should
bundle rclone, require the user to install it, or isolate it via a container.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Require user to install rclone (via package manager or direct download)** | Zero bundling complexity in the wrapper; rclone is managed by the host package manager (updates, security patches); single-binary install is well-documented; no legal/licensing concerns (MIT) | One-time manual setup step per developer machine; version drift possible if different developers install different rclone versions |
| **Bundle rclone binary inside the wrapper package** | Single-artifact distribution; exact version pinned automatically | Binary must be downloaded per-platform at build time; distribution artifact is 50+ MB; legal review needed for bundling (MIT is permissive but should be documented); stale bundled binary won't receive security patches automatically |
| **Docker container** | Fully reproducible environment; exact versions of both Python and rclone locked | Requires Docker on all developer machines (not guaranteed on FreeBSD); adds significant setup overhead for what is a thin CLI tool; container networking changes SFTP semantics; overkill for a 200-line wrapper |

## Decision

**Require the user to install rclone via the platform package manager or direct download.**

The wrapper checks for the rclone binary on `PATH` at startup (first action, before parsing any
arguments). If rclone is not found, the wrapper exits immediately with:

```
Error: rclone not found on PATH.
Install rclone for your platform:
  Windows:  winget install Rclone.Rclone
  Linux:    sudo apt install rclone  (or: curl https://rclone.org/install.sh | sudo bash)
  macOS:    brew install rclone
  FreeBSD:  pkg install rclone
Docs:       https://rclone.org/downloads/
Pinned version: v1.73.5
```

Exit code for this condition is 3 (SSH connectivity failure uses the same exit code to indicate
an environment setup error, not a sync error).

Additionally, the wrapper checks the installed rclone version string against the version pinned in
`config.yml`. If versions differ, the wrapper logs a warning but does not abort (version mismatch
is advisory, not fatal, unless the major version changes — in which case a bisync listing format
change may require `--resync`).

## Consequences

**Positive:**
- Zero bundling complexity; the wrapper repository contains only Python source and config files
- Package-manager-installed rclone participates in the system's normal update and security patch cycle
- Developers familiar with rclone can use their existing installation without conflicts
- No per-platform build step or binary download in CI to produce the wrapper artifact
- FreeBSD support is automatic — `pkg install rclone` is a documented one-liner

**Negative:**
- One-time manual setup step per developer machine and per CI runner
- Version drift: if a developer upgrades rclone independently (e.g., `brew upgrade`), the wrapper
  will warn about version mismatch but will not prevent operation

**Mitigations:**
- The startup check and helpful error message make the setup step self-documenting — a developer
  encountering the error gets exact install commands without consulting documentation
- The version pin in `config.yml` is checked on every run and logged in the JSONL journal
  (`rclone_version` field), making version drift visible in the audit trail
- The upgrade procedure (update pin in `config.yml`, run `--resync` once, re-run acceptance
  criteria) is documented in the README and takes under 30 minutes per the PRD success metrics
- If a zero-setup distribution is needed in the future, the wrapper can be packaged with
  PyInstaller + rclone binary as a post-hoc packaging step without changing the source code
