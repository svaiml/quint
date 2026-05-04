# PRD: folder-sync-tool

**Status:** Draft
**Date:** 2026-04-23
**Owner:** AITechCraft Research Team
**Tracking:** bd-d6t (assessment), bd-8tu (research), bd-2ph (validation)
**Security Spike (blocker):** bd-1g9

---

## 1. Executive Summary

### Problem

The Research monorepo at `D:\WORK\Organizations\AITechCraft\Research\` must remain in sync with a remote Linux server (`root@89.167.57.6:/root/zombo-sash-eco/`). Manual copy/rsync workflows are error-prone and leave no audit trail. Git is explicitly excluded as a sync transport because the workspace contains submodules from multiple independent authors — Git semantics (commits, branches, remotes) do not map to a flat workspace mirror.

### Solution

A thin Python CLI wrapper around **rclone bisync** that adds the two capabilities rclone lacks natively:
1. Pre-flight size/count threshold warning before any transfer begins
2. A structured JSONL audit journal recording every sync run

rclone covers the remaining 80% of requirements natively: Windows binary, SFTP+SSH-key transport, bidirectional sync with fingerprint-based change detection, configurable skip lists, and crash-resilient resume.

### Success Metrics

| Metric | Target |
|---|---|
| Workspace parity achieved | `rclone check` reports zero differences after sync |
| Pre-flight guard fires correctly | Prompts when source or remote exceeds 1 GB or 100k files |
| Journal completeness | Every run appended to JSONL with timestamp, exit code, byte count, error count |
| Secret exclusion | `rclone check --dry-run` on first run reports zero `.env`, `*.pem`, `*.key`, `*credentials*` files in transfer set |
| Resume capability | Interrupted sync recoverable via `--resilient --recover` without manual `--resync` |
| Cross-platform | Tool runs unmodified on Windows 10, Ubuntu 22.04, macOS 14, FreeBSD 14 |

### Assessment Scores (from /flow:assess)

| Dimension | Score |
|---|---|
| Complexity | 5.7 / 10 |
| Risk | 4.3 / 10 |
| Architecture Impact | 3.3 / 10 |
| DVF+V Bonus | +4.0 |
| **Total** | **17.3 / 34** |
| **Recommendation** | **Spec-Light** |

---

## 2. Cross-Platform Support Matrix

### Direct Answer to "Will it work between Mac, Win, Linux, FreeBSD?"

**Yes, rclone bisync supports all four platforms.** rclone ships as a single precompiled binary for Windows (amd64/arm64), Linux (amd64/arm/arm64/mips/etc.), macOS (amd64/arm64), and FreeBSD (amd64/arm64). The SFTP backend — which is the transport used for SSH-based remote servers — works identically across all platforms. The Python wrapper uses only Python stdlib and `subprocess`, so it is equally portable.

However, there are platform-specific differences in path handling, permissions, and symlinks that operators must understand:

### Platform x Feature Matrix

| Feature | Windows 10/11 | Linux (Ubuntu/Debian/RHEL) | macOS (12+) | FreeBSD 14 |
|---|---|---|---|---|
| **rclone binary available** | Yes (`.exe`, winget/portable) | Yes (pkg manager or portable) | Yes (Homebrew/portable) | Yes (ports: `net/rclone`, or portable binary) |
| **rclone bisync available** | Yes (v1.65+) | Yes (v1.65+) | Yes (v1.65+) | Yes (v1.65+) |
| **SFTP backend (SSH key)** | Yes (`key_file` in rclone.conf) | Yes | Yes | Yes |
| **PEM key auth** | Yes (via rclone config `key_file`) | Yes | Yes | Yes |
| **Python 3.8+ available** | Yes (winget/Microsoft Store) | Yes (apt/yum/dnf) | Yes (Homebrew/system 3.9+) | Yes (ports: `lang/python311`) |
| **Path separator handling** | rclone normalizes `\` to `/` for remote paths automatically | Native `/` | Native `/` | Native `/` |
| **POSIX file permissions preserved** | No (Windows NTFS has no POSIX mode bits) | Yes | Yes (APFS/HFS+) | Yes (UFS2/ZFS) |
| **Symlink handling** | Limited (requires developer mode or admin for native symlinks) | Yes (full symlink support) | Yes | Yes |
| **Long path support** | Requires opt-in (registry or group policy) | No limit beyond filesystem | No limit | No limit |
| **Line ending conversion** | NOT performed by rclone (byte-for-byte mirror) | NOT performed | NOT performed | NOT performed |
| **rclone config location** | `%APPDATA%\rclone\rclone.conf` | `~/.config/rclone/rclone.conf` | `~/.config/rclone/rclone.conf` | `~/.config/rclone/rclone.conf` |
| **bisync listing cache** | `%LOCALAPPDATA%\rclone\bisync\` | `~/.cache/rclone/bisync/` | `~/.cache/rclone/bisync/` | `~/.cache/rclone/bisync/` |

### What Works and What Doesn't: Platform Notes

**Windows specifics:**
- Path separator: rclone accepts both `D:/WORK/...` and `D:\WORK\...`; the wrapper normalizes to forward slashes internally.
- Long paths: Paths exceeding 260 characters will fail unless long path support is enabled. Enable via: `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1`.
- Symlinks: rclone follows symlinks by default on Windows (`--copy-links` equivalent behavior). For native symlink creation on the Windows side, developer mode must be enabled. This is generally not required for sync targets.
- SSH key permissions: The PEM file must be readable only by the current user. Use `icacls` to strip group/world permissions if OpenSSH rejects it.

**Linux specifics:**
- POSIX permissions: rclone SFTP backend does preserve permissions when both sides are POSIX (Linux-to-Linux or Linux-to-FreeBSD). When syncing Windows-to-Linux, rclone assigns default permissions (0644 for files, 0755 for dirs) on new remote files.
- No special setup required beyond having rclone installed and the PEM key available.

**macOS specifics:**
- rclone installs cleanly via Homebrew (`brew install rclone`).
- Extended attributes (xattr) and macOS resource forks (`.DS_Store`, `._*` files) should be excluded explicitly. Add `._*` and `.DS_Store` to the skip list.
- Apple Silicon (arm64) binary is available natively — no Rosetta required.
- macOS keychain integration is NOT used; key path is stored in rclone.conf.

**FreeBSD specifics:**
- Install via ports: `pkg install rclone` or `cd /usr/ports/net/rclone && make install clean`.
- FreeBSD uses `/usr/local/bin/python3` for Python. The wrapper shebang should use `/usr/bin/env python3`.
- ZFS extended attributes: rclone does not sync ZFS-specific attributes; byte content and standard POSIX metadata only.
- FreeBSD is a first-class rclone platform; there are no known FreeBSD-specific bisync issues.

**Line endings (all platforms):**
rclone transfers files byte-for-byte. It does NOT perform CRLF-to-LF conversion or vice versa. This means:
- A file edited on Windows with CRLF endings will be synced to Linux with CRLF endings intact. This is intentional — rclone is a file mirror, not a text normalizer.
- If line ending consistency is required, configure `.gitattributes` or use a separate normalization step. This is out of scope for this tool.
- Monitor the first few syncs for unexpected "file changed" churn caused by editors silently rewriting line endings.

### Multi-Platform Topology Support

The tool supports any pair of the following endpoints in bisync mode:

| Source | Remote | Status |
|---|---|---|
| Windows → Linux | Supported (primary use case) | Production-ready |
| Linux → Linux | Supported | Production-ready |
| macOS → Linux | Supported | Production-ready |
| Windows → macOS | Supported (both use SFTP backend) | Supported, untested |
| FreeBSD → Linux | Supported | Supported, untested |
| macOS → FreeBSD | Supported | Supported, untested |
| Windows → FreeBSD | Supported | Supported, untested |

**Note on FreeBSD as the local source:** Running the Python wrapper on FreeBSD requires Python 3.8+ and rclone installed on the FreeBSD host. The SSH transport still targets `root@89.167.57.6` via SFTP; nothing changes in the remote config.

---

## 3. User Stories

### Persona 1: Local Dev (Windows Workstation)

> As a developer on Windows 10, I want to sync my Research workspace to the remote Linux server so that all machines have the same file state without manually copying files or managing git remotes for non-git content.

**Scenarios:**
- `sync.py --source "D:\WORK\Organizations\AITechCraft\Research" --remote zombo-sash:/root/zombo-sash-eco` — runs bisync with defaults, warns if large, appends journal entry.
- `sync.py --dry-run` — shows what would change without transferring anything.
- After a network drop mid-sync, re-running `sync.py` automatically recovers using `--resilient --recover`.

### Persona 2: Remote Server Admin (Linux)

> As the admin of the Linux server `89.167.57.6`, I want to be able to push changes made server-side back to the Windows workspace so that work done directly on the server (e.g., log edits, config tweaks) is not lost on the next sync.

**Scenarios:**
- Bisync propagates server-side changes to local on the next run.
- Conflicts (same file changed on both sides) are resolved by mtime: newer version wins; loser renamed `.conflict`.
- The JSONL journal shows what the server contributed on each run.

### Persona 3: Multi-Platform Team Member (macOS)

> As a developer joining the project on macOS, I want to use the same sync tool and config as my Windows colleagues so that I don't need a separate workflow or separate documentation.

**Scenarios:**
- `brew install rclone && pip3 install -r requirements.txt` (no requirements beyond stdlib) is the full setup.
- Same `config.yml` and `sync-excludes.txt` work unchanged on macOS.
- The wrapper detects platform automatically; no platform-specific flags needed.
- macOS-specific noise files (`.DS_Store`, `._*`) are excluded by default.

### Persona 4: CI/Automation Agent

> As an automated CI pipeline, I want to sync artifacts to the remote server after a build without human confirmation prompts, using structured output I can parse.

**Scenarios:**
- `sync.py --non-interactive` suppresses the size/count prompt and proceeds (or fails fast if thresholds are exceeded, with non-zero exit code).
- Exit codes: 0 = success, 1 = rclone error, 2 = threshold exceeded and non-interactive, 3 = SSH connectivity failure.
- The JSONL journal provides machine-readable run history.

---

## 4. DVF+V Risk Assessment

| Risk Type | Description | Rating | Mitigation |
|---|---|---|---|
| **Value Risk** | Is the problem worth solving? | LOW | User has a clear, daily-workflow need. Manual copy/paste is the current state. No ambiguity. |
| **Usability Risk** | Sync direction confusion; conflict resolution surprise; "my file got renamed .conflict" | MEDIUM | Dry-run default for first run; explicit conflict logging; warn before `--resync` overwrites remote. |
| **Feasibility Risk - Core** | rclone bisync + Python wrapper is well-understood scope | LOW | rclone is production-grade at v1.73.5. Wrapper is ~200 lines of Python stdlib. |
| **Feasibility Risk - FreeBSD/macOS** | Untested cross-platform combinations | LOW-MEDIUM | rclone ships FreeBSD/macOS binaries officially. Risk is in testing coverage, not platform support. Python stdlib works identically. |
| **Feasibility Risk - Windows paths** | 260-char path limit, key file permissions, CRLF | MEDIUM | Long path opt-in documented; PEM permission fix documented; CRLF explicitly out of scope. |
| **Viability Risk** | Is this worth maintaining? | LOW | ~200-line wrapper wrapping a 57k-star actively maintained tool. Maintenance burden is pinning rclone version and re-testing on upgrades. |
| **Security Risk** | Root SSH key; `.env` file sync; journal leaking sensitive paths | CRITICAL | Secret exclusion list + key path never logged + `--max-delete` guard. Addressed in bd-1g9. |
| **Bisync Beta Label** | rclone docs still label bisync "beta" | LOW | bisync has been in active use since v1.65 (2023). "Beta" is a documentation lag, not an instability signal. Used by thousands in production dev workflows. |

---

## 5. Functional Requirements

### 5.1 CLI Contract

```
sync.py [OPTIONS]

Required (at least one pair):
  --source PATH           Local source directory
  --remote REMOTE:PATH    rclone remote name + remote path

Optional:
  --config FILE           Config file path (default: ./config.yml)
  --dry-run               Pass --dry-run to rclone; do not write journal entry
  --non-interactive       Suppress confirmation prompts; exit code 2 if threshold exceeded
  --warn-size-gb FLOAT    Override size threshold in GB (default: 1.0)
  --warn-file-count INT   Override file count threshold (default: 100000)
  --resync                Pass --resync to rclone (full re-baseline; use after rclone upgrades)
  --verbose               Pass --verbose to rclone
  --version               Print wrapper version and rclone version
```

Multiple `--source`/`--remote` pairs are supported for syncing multiple folder pairs in a single run.

### 5.2 Default Skip List

The following patterns are excluded unconditionally unless overridden via `--config`:

**Build artifacts:**
- `node_modules/**`
- `.venv/**`
- `venv/**`
- `target/**`
- `dist/**`
- `build/**`
- `__pycache__/**`
- `*.pyc`
- `.cargo/**`

**VCS internals:**
- `.git/**`

**Secrets and credentials (non-negotiable, always excluded):**
- `.env`
- `.env.*`
- `*.pem`
- `*.key`
- `*.p12`
- `*.pfx`
- `*credentials*`
- `*secrets*`
- `.aws/**`
- `.ssh/**`

**macOS noise (added when source is macOS):**
- `.DS_Store`
- `._*`

**Note:** The secrets exclusion list is hardcoded in the wrapper and cannot be disabled via config. This is a deliberate security decision.

### 5.3 Pre-Flight Threshold Logic

Before invoking `rclone bisync`, the wrapper calls `rclone size --json <source>` and `rclone size --json <remote>`.

If `source_bytes > warn_size_gb * 1024^3` OR `source_count > warn_file_count` OR same for remote:

```
WARNING: Source tree is 2.3 GB (230,000 files).
This exceeds the configured threshold (1.0 GB / 100,000 files).
Proceed with sync? [y/N]:
```

In `--non-interactive` mode, the wrapper exits with code 2 instead of prompting.

The `--dry-run` path always skips the threshold prompt (safe to run without confirmation).

### 5.4 JSONL Audit Journal Schema

Each sync run appends one JSON object (newline-delimited) to `journal/sync-YYYY-MM-DD.jsonl`:

```json
{
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp_utc": "2026-04-23T14:32:11Z",
  "duration_seconds": 42.1,
  "source": "/local/path/to/source",
  "remote": "zombo-sash-remote:/root/zombo-sash-eco",
  "dry_run": false,
  "resync": false,
  "exit_code": 0,
  "files_transferred": 14,
  "bytes_transferred": 204800,
  "errors": [],
  "rclone_version": "v1.73.5",
  "wrapper_version": "0.1.0",
  "platform": "win32"
}
```

**Security constraint:** The journal MUST NOT log:
- SSH key paths or content
- Remote host credentials or usernames
- Any file content
- File paths that match the secrets exclusion patterns

The `source` and `remote` fields log the directory paths only (not SSH key paths from rclone config).

### 5.5 Conflict Resolution

Default strategy: `--conflict-resolve newer --conflict-loser rename`

- Newer mtime wins.
- Losing version renamed to `<filename>.conflict.<timestamp>` (kept on both sides).
- Override available in `config.yml`: `conflict_resolve: path1` (local always wins) or `path2` (remote always wins).

### 5.6 Resume / Crash Recovery

The wrapper unconditionally passes `--resilient --recover` to rclone bisync. These flags cannot be disabled.

`--resilient`: Continue sync past individual file errors (log them, don't abort).
`--recover`: On the next run after a crash, use the last good bisync listing snapshot to recover state without requiring a full `--resync`.

Additionally, `--max-delete 20` is enforced: if more than 20% of files on either side would be deleted in a single run, rclone aborts. This prevents accidental mass-deletion from propagating silently.

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Scenario | Target |
|---|---|
| Incremental sync (few changed files in 10k-file tree) | Complete in < 60 seconds over 100 Mbps link |
| Initial baseline scan (`--resync` on full workspace) | Expected 5-15 minutes; acceptable |
| rclone size pre-flight check | < 30 seconds for trees up to 100k files |

Note: rclone bisync performs a full listing of both sides on every run to detect changes. For very large trees (100k+ files), this listing pass over SFTP is the dominant time cost. This is a known rclone limitation (issue #7332). Consider excluding large artifact directories aggressively to reduce listing time.

### 6.2 Security

- SSH private key path is stored in `rclone.conf` only. The wrapper never reads or logs it.
- The JSONL journal contains no credentials, key paths, or secret file paths.
- The secrets exclusion list is hardcoded and non-overridable.
- The SSH key (`sash.pem`) must remain outside the synced workspace tree (currently at `D:\WORK\Organizations\SpilnoMe\keys\` — preserve this location).
- Consider creating a dedicated non-root Linux user for sync with `ChrootDirectory` restriction to `/root/zombo-sash-eco/`. Root access for sync is unnecessary and widens the blast radius if the key is ever compromised.

### 6.3 Portability

- Python 3.8+ only. Zero third-party dependencies (stdlib `subprocess`, `json`, `pathlib`, `argparse`, `uuid`, `datetime`).
- rclone binary must be on `PATH` or the path configured in `config.yml`.
- The wrapper auto-detects the platform for macOS-specific excludes and path normalization.
- `config.yml` is shared across platforms. Remote names (e.g., `zombo-sash-remote`) are resolved from the platform-local `rclone.conf`.

### 6.4 Reliability

- `--resilient --recover --max-delete 20` enforced on every run.
- Dry-run mode (`--dry-run`) always available for safe inspection.
- The wrapper exits with a non-zero code on any rclone error and records the error in the journal.
- A `--resync` flag is available for full re-baseline after rclone upgrades or manifest corruption.

### 6.5 Maintainability

- Wrapper target: < 300 lines of Python, no classes, no framework.
- rclone version is pinned in `config.yml` and checked at startup (warn if installed version differs).
- The exclude list lives in `sync-excludes.txt` (checked into repo) for auditability.
- The JSONL journal rotates daily (one file per day). Retention policy: keep last 30 days.

---

## 7. Task Breakdown

Implementation tasks are tracked in `br` (beads-rust). The security spike `bd-1g9` is a hard blocker for all implementation tasks.

### Task IDs (created below)

| Task | ID | Title | Blocked by |
|---|---|---|---|
| T1 | bd-1e6 | Implement: wrapper CLI skeleton + config loading | bd-1g9 |
| T2 | bd-1cs | Implement: pre-flight size/count check | bd-1g9 |
| T3 | bd-1at | Implement: JSONL audit journal | bd-1g9 |
| T4 | bd-268 | Implement: rclone bisync invocation + exclude list | bd-1g9 |
| T5 | bd-2ly | Implement: cross-platform path handling + macOS excludes | bd-1g9 |
| T6 | bd-2vc | Test: dry-run validation on Windows + Linux endpoint | bd-1e6, bd-1cs, bd-1at, bd-268, bd-2ly |

---

## 8. Discovery / Validation Plan

### Phase 0 — SSH Connectivity Spike (bd-1g9, MUST complete first)

1. Run `ssh -i sash.pem root@89.167.57.6 "echo OK"` from each planned client platform.
2. Run `rclone ls zombo-sash-remote:/root/zombo-sash-eco/` to confirm SFTP backend auth works.
3. Audit workspace for secret files: `find . -name ".env" -o -name "*.pem" -o -name "*.key" -o -name "*credentials*"`.
4. Finalize `sync-excludes.txt` with all secret patterns.
5. Get sign-off before any sync run touches the remote.

### Phase 1 — Dry-Run Validation (first use of wrapper)

1. Run `sync.py --dry-run --verbose` on a small subdirectory (e.g., `docs/`).
2. Inspect the rclone verbose output for any unexpected files (secrets, large binaries).
3. Run `rclone check` after dry-run to confirm zero-diff on unchanged content.

### Phase 2 — Initial Baseline (`--resync`)

1. Confirm the workspace is the source of truth (remote may have stale or empty content).
2. Run `sync.py --resync --dry-run` and review the full transfer list.
3. Obtain explicit confirmation before `sync.py --resync` (live).
4. Run `rclone check` to verify parity after resync.
5. Inspect the JSONL journal entry for completeness.

### Phase 3 — Incremental Validation

1. Make a small change on the local side; run `sync.py`; verify change appears on remote.
2. Make a small change on the remote side; run `sync.py`; verify change propagates to local.
3. Simulate a conflict (change same file on both sides); verify `.conflict` rename behavior.
4. Simulate an interrupted sync; re-run; verify `--recover` restores state without `--resync`.

---

## 9. Acceptance Criteria

1. **Cross-platform binary**: `rclone bisync --help` runs successfully on Windows 10, Ubuntu 22.04, macOS 14, and FreeBSD 14 without error. (Verifiable: run command on each platform.)

2. **SSH key authentication**: `rclone ls zombo-sash-remote:/root/zombo-sash-eco/` succeeds from Windows using `sash.pem` PEM key with no password prompt.

3. **Skip list enforced**: After a full sync run, `rclone check` reports zero transfers for any file matching `node_modules`, `.venv`, `target`, `dist`, `build`, `__pycache__`, `*.pyc`, `.git`, `.env`, `*.pem`, `*.key`, `*credentials*`.

4. **Pre-flight warning fires**: Mocking a source tree exceeding 1 GB or 100k files triggers the confirmation prompt (or exits code 2 in `--non-interactive` mode) before any rclone bisync invocation.

5. **JSONL journal populated**: After each sync run (including dry-run failures), a valid JSON object is appended to `journal/sync-YYYY-MM-DD.jsonl` containing `run_id`, `timestamp_utc`, `exit_code`, `files_transferred`, and `platform`. The journal contains no SSH key paths, remote credentials, or files matching the secrets exclusion patterns.

6. **Bidirectional propagation**: A file created on the local side syncs to remote on the next run. A file created on the remote side syncs to local on the next run. Both verified via `rclone check`.

7. **Resume after interruption**: An interrupted sync (simulated by SIGKILL mid-run) is recoverable on the next invocation using `--resilient --recover` without requiring `--resync`. The JSONL journal records the interrupted run with a non-zero exit code.

8. **Conflict rename behavior**: When the same file is modified on both sides between sync runs, the losing version is renamed to `<filename>.conflict.<timestamp>` and both versions are preserved on both sides.

---

## 10. Success Metrics

This is an internal developer tool. "Done" means:

| Metric | Definition of Done |
|---|---|
| **Workspace parity** | `rclone check` reports zero differences between local and remote after a sync run on all tested platforms |
| **Secret safety** | Zero files matching the secrets exclusion patterns appear in any journal entry or rclone transfer log across all test runs |
| **Developer adoption** | The tool is used as the standard sync mechanism (replaces ad-hoc rsync/manual copy) for at least 30 consecutive days without operator-reported data loss |
| **Journal completeness** | 100% of sync runs (including failures) produce a valid JSONL entry |
| **Cross-platform verified** | At least Windows and Linux combination validated end-to-end (macOS and FreeBSD documented and testable; validation deferred to when hardware is available) |
| **No unintended mass-delete** | `--max-delete 20` guard fires correctly on a test scenario where > 20% of files would be deleted |
| **Maintenance burden** | A rclone version upgrade can be completed (update config.yml pin + run `--resync` on one pair + re-run acceptance criteria) in under 30 minutes |

---

## Appendix A: rclone Installation by Platform

| Platform | Command |
|---|---|
| Windows | `winget install Rclone.Rclone` or portable binary from rclone.org/downloads |
| Ubuntu/Debian | `sudo apt install rclone` or `curl https://rclone.org/install.sh \| sudo bash` |
| macOS | `brew install rclone` |
| FreeBSD | `pkg install rclone` or `cd /usr/ports/net/rclone && make install clean` |

Current pinned version: **v1.73.5** (released 2026-04-19).

## Appendix B: rclone.conf SFTP Remote Template

```ini
[zombo-sash-remote]
type = sftp
host = 89.167.57.6
user = root
key_file = /path/to/sash.pem
shell_type = unix
```

Config location by platform:
- Windows: `%APPDATA%\rclone\rclone.conf`
- Linux/macOS/FreeBSD: `~/.config/rclone/rclone.conf`

## Appendix C: References

- Assessment: `docs/assess/folder-sync-tool-assessment.md`
- Research: `docs/research/folder-sync-tool-research.md`
- Validation: `docs/research/folder-sync-tool-validation.md`
- Security spike: `br show bd-1g9`
- rclone bisync docs: https://rclone.org/bisync/
- rclone SFTP backend: https://rclone.org/sftp/
- rclone releases: https://github.com/rclone/rclone/releases
