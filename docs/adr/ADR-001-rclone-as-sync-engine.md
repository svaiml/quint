# ADR-001: rclone as Sync Engine

**Status**: Accepted
**Date**: 2026-04-23

## Context

The folder-sync-tool must bidirectionally sync a Windows 10 developer workspace
(`D:\WORK\Organizations\AITechCraft\Research\`) with a remote Linux server
(`root@89.167.57.6:/root/zombo-sash-eco/`) using SSH key authentication (PEM file).

Key constraints that drive the engine selection:

- Must run natively on Windows, Linux, macOS, and FreeBSD without WSL or Cygwin
- Must authenticate via SSH PEM key (not a daemon-pairing protocol)
- Must support configurable exclude patterns (build artifacts, secrets, VCS internals)
- Must detect file changes by content fingerprint (mtime + size + hash), not just timestamp
- Must handle crash recovery and resume without requiring a full re-baseline
- Must support bidirectional conflict detection and configurable resolution strategies
- Git is explicitly excluded as a transport mechanism (workspace contains multi-author submodules)

Research phase (see `docs/research/folder-sync-tool-research.md`) evaluated seven candidates:
rclone bisync, Syncthing, Unison, mutagen, lsyncd, osync, and FreeFileSync.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **rclone bisync** | Native binary for Win/Linux/macOS/FreeBSD; SFTP+PEM key auth built in; exclude-from file; fingerprint-based change detection; `--conflict-resolve newer`; `--resilient --recover` for crash safety; MIT license; 57k stars; v1.73.5 actively maintained (April 2026) | bisync labelled "beta" in docs (production-stable in practice); large tree listing scan is slow over SFTP; no built-in pre-flight size/count warning; version pinning required across upgrades |
| **mutagen** | Real-time FS-watch daemon; fast incremental propagation; gitignore-style ignores; SSH transport via system OpenSSH | No user-readable sync history/journal; no pre-flight threshold check; Docker acquisition (last standalone release Feb 2025, roadmap uncertain); halts on anomalies requiring manual resume |
| **Custom paramiko + watchdog (Python)** | Full control over journal, filtering, and conflict logic | 5–10 days to reach feature parity with rclone bisync; reimplements solved problems (checksumming, SFTP protocol, conflict detection) |
| **Syncthing** | Mature, battle-tested, large community | Uses proprietary P2P protocol — not SSH/SFTP; requires Syncthing daemon on both endpoints; cannot use the existing `sash.pem` key directly; setup complexity for headless server |
| **lsyncd / osync** | Battle-tested for Linux-to-Linux | Linux-only (lsyncd); maintenance-only since 2022 (osync); no native Windows support |

## Decision

**Use rclone bisync as the sync engine.**

rclone satisfies the core transport and change-detection requirements with a single cross-platform binary.
The two genuine gaps (pre-flight size/count warning and a structured audit journal) are filled by
a thin Python wrapper (see ADR-002) rather than by selecting a less capable engine.

The "beta" label in rclone documentation is a documentation lag, not an instability signal. bisync has
been in active production use since v1.65 (2023) and is used by thousands of developer workflows.
The `--resilient --recover` flags provide robust crash recovery semantics that no alternative matches.

## Consequences

**Positive:**
- Single portable binary for all four target platforms (Windows, Linux, macOS, FreeBSD)
- SSH/SFTP+PEM key auth is first-class (configured via `rclone.conf`; no OpenSSH daemon required on client)
- Fingerprint-based change detection drives reliable bidirectional sync and crash recovery
- `--exclude-from` supports the full canonical skip list in a version-controlled file
- `--conflict-resolve newer --conflict-loser rename` gives safe, predictable conflict semantics
- `--resilient --recover --max-delete` provide defense-in-depth against data loss on failures
- Zero custom protocol code; all transport complexity is delegated to a mature, actively maintained tool

**Negative:**
- rclone binary is a required external dependency; wrapper cannot function without it on `PATH`
- Large tree listing scan over SFTP is O(n files) — initial baseline and full listing on each run
  can take minutes for 100k+ file trees (tracked: rclone/rclone#7332)
- bisync listing file format may change on major rclone version upgrades, requiring `--resync`
- No CRLF-to-LF conversion — files are transferred byte-for-byte (by design, not a defect)

**Mitigations:**
- Wrapper checks `rclone --version` at startup; exits with a helpful error and install link if not found (see ADR-005)
- Aggressive exclusion of build artifact directories (`node_modules`, `target`, `.venv`, etc.) keeps tree size manageable
- rclone version is pinned in `config.yml`; wrapper warns if installed version differs from pinned version
- Upgrade procedure documented: update `config.yml` pin, run `--resync` once, re-run acceptance criteria
