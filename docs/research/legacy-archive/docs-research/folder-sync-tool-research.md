# Folder Sync Tool OSS Landscape Research

**Date:** 2026-04-23
**Analyst:** Senior Research Analyst
**Tracking:** bd-8tu
**Status:** Final

---

## Context

**Problem:** Bidirectional sync of a Windows 10 dev workspace (`D:\WORK\Organizations\AITechCraft\Research\`) to a Linux server (`root@89.167.57.6:/root/zombo-sash-eco/`) via SSH key (`sash.pem`). Git is explicitly excluded as a sync mechanism because the workspace contains repos from multiple independent authors.

**Key constraints from requirements:**
1. `--source` / `--target-folder(s)` / `--remote-folder(s)` CLI params
2. Default skip list: `node_modules`, `.venv`, `venv`, `target`, `dist`, `build`, `__pycache__`, `*.pyc`, `.git` subtrees
3. Warn/confirm before sync if total size > 1 GB OR file count > 100k
4. Sync history / fingerprint journal (resume after interruption, mini-DropBox semantics)
5. SSH key (PEM) authentication
6. Windows ↔ Linux cross-platform

---

## 1. Executive Summary

### Top Recommendations

| Rank | Tool | Confidence | Rationale |
|------|------|-----------|-----------|
| 1 | **rclone bisync** | HIGH (80%) | Best overall fit: native Windows binary, SFTP+SSH-key, exclude filters, bisync with manifest/fingerprint, --resilient/--recover for resume. Gaps: no built-in size/count pre-flight warning (needs wrapper script); bisync still labelled "beta" in docs but widely production-used. |
| 2 | **mutagen** | MEDIUM (60%) | Excellent for live dev-workflow sync (watches FS changes, fast incremental); gitignore-style ignores; SSH via OpenSSH. Gaps: no fingerprint journal / sync history; acquired by Docker (future independent maintenance uncertain); no built-in size-check warning. |
| 3 | **Custom thin wrapper over rclone** | HIGH (90%) | ~1-2 days effort to add pre-flight size/count check, structured log journal, and CLI flags on top of rclone bisync. This is the recommended path. |

**Bottom line:** No single OSS tool satisfies all six requirements out of the box. rclone bisync covers ~80% natively; a thin Python wrapper fills the remaining 20% (size/count warning + structured journal). This is the recommended path.

---

## 2. Candidate Evaluation Matrix

| Criterion | rclone bisync | Syncthing | Unison | mutagen | lsyncd | osync | FreeFileSync |
|---|---|---|---|---|---|---|---|
| **Bidirectional sync** | Yes (bisync) | Yes | Yes | Yes | No (one-way only) | Yes | Yes |
| **Windows support** | Native binary | Native binary | Native binary (needs OpenSSH workaround) | Native binary | No (Linux only; Cygwin/WSL hacks) | WSL/Cygwin only | Native binary |
| **SSH key auth (PEM)** | Yes (`key_file` in config) | No (uses own TLS-based P2P protocol, not SSH) | Yes (delegates to system OpenSSH) | Yes (uses system OpenSSH, PEM respected) | N/A | No native SSH; SFTP via SSHFS mount | SFTP built-in (password or key) |
| **Custom exclude patterns** | Yes (`--exclude`, `--exclude-from`, `--filter`) | Yes (`.stignore` per-folder, gitignore-like) | Yes (`ignore` rules in profile) | Yes (`--ignore`, `~/.mutagen.yml` defaults, gitignore syntax) | Limited (rsync patterns via config) | Yes (rsync patterns, semicolon-separated list) | Yes (GUI + XML config) |
| **Sync manifest / fingerprinting** | Yes (bisync keeps per-run listing files in `~/.cache/rclone/bisync/`) | Partial (internal DB tracks file index, not user-readable journal) | Partial (archive dir in `~/.unison/`) | No explicit manifest; session state only | No | Yes (internal sqlite-like state for soft-deletes; opt-in backup dir) | Partial (sync database, not a journal) |
| **Resume after interruption** | Yes (`--recover`, `--resilient` flags) | Yes (auto-resumes; P2P protocol is inherently resumable) | Partial (reruns from scratch but skips unchanged; no explicit resume) | Partial (session can be paused/resumed; no crash-safe journal) | No | Yes (fault-tolerant; keeps soft-delete log) | Partial (resumes incomplete transfers) |
| **Size/count pre-flight warning** | No (has `--max-delete` % safety check, not size/count threshold) | No | No | No | No | No | No (GUI only, not scriptable) |
| **Conflict resolution** | Configurable: `newer`, `older`, `larger`, `path1`, `path2`; losers renamed `.conflict` | Last-write-wins by mtime; loser renamed `.sync-conflict-<date>` | Interactive prompt (default) or `--batch` for auto | Configurable per-session; defaults to safe rename | N/A (one-way) | Last-write-wins with soft-delete backup option | Configurable: mirror, two-way, update modes |
| **CLI-first vs GUI-first** | CLI-first | GUI/web-first (headless possible via config + REST API) | CLI-first | CLI-first | CLI-first | CLI (bash script) | GUI-first (CLI batch mode exists) |
| **Latest version** | v1.73.5 (2026-04-19) | v2.0.16 (2026-04-07) | v2.53.8 (2025-11-05) | v0.18.1 (2025-02-24) | ~v2.3 (2022, low activity) | v1.3 (2022, maintenance-only) | v14.x (2025) |
| **GitHub stars** | ~57k | ~83k | ~5.2k | ~4k | ~3k | ~1k | SourceForge (not GitHub) |
| **License** | MIT | MPL-2.0 | GPL-2.0 | MIT (acquired by Docker) | GPL-2.0 | GPL-3.0 | GPL-3.0 |
| **Maturity / activity** | Very active | Very active (v2.0 major release Aug 2025) | Active, slow-moving | Reduced (Docker ownership; last release Feb 2025) | Low (Linux-only, stale) | Maintenance-only (maintainer flagged as "feature complete") | Active |

---

## 3. Deep Dive: Top Two Picks

### 3.1 rclone bisync

#### What It Is

rclone is the "rsync for cloud storage" — a CLI tool with 70+ storage backends. The SFTP backend covers SSH-based remote Linux servers natively. `rclone bisync` is the bidirectional sync command (promoted from experimental to supported since ~v1.65).

#### Installation on Windows

```powershell
# Winget (recommended)
winget install Rclone.Rclone

# Or download portable binary from https://rclone.org/downloads/
# Latest: v1.73.5 (2026-04-19)
```

#### Configuring SFTP Remote with PEM Key

Edit `%APPDATA%\rclone\rclone.conf`:

```ini
[zombo-sash-remote]
type = sftp
host = 89.167.57.6
user = root
key_file = d:/WORK/Organizations/SpilnoMe/keys/sash.pem
shell_type = unix
```

Or set up via interactive wizard: `rclone config`

#### Running bisync with Exclude Patterns

```bash
# Initial baseline sync (required once before bisync)
rclone bisync "D:\WORK\Organizations\AITechCraft\Research" zombo-sash-remote:/root/zombo-sash-eco \
  --resync \
  --exclude "node_modules/**" \
  --exclude ".venv/**" \
  --exclude "venv/**" \
  --exclude "target/**" \
  --exclude "dist/**" \
  --exclude "build/**" \
  --exclude "__pycache__/**" \
  --exclude "*.pyc" \
  --exclude ".git/**" \
  --verbose

# Subsequent syncs
rclone bisync "D:\WORK\Organizations\AITechCraft\Research" zombo-sash-remote:/root/zombo-sash-eco \
  --exclude "node_modules/**" \
  --exclude ".venv/**" \
  --exclude "venv/**" \
  --exclude "target/**" \
  --exclude "dist/**" \
  --exclude "build/**" \
  --exclude "__pycache__/**" \
  --exclude "*.pyc" \
  --exclude ".git/**" \
  --conflict-resolve newer \
  --conflict-loser rename \
  --resilient \
  --recover \
  --verbose
```

Alternatively, put excludes in a file (`sync-excludes.txt`) and use `--exclude-from sync-excludes.txt`.

#### Sync History / Fingerprint Journal

rclone bisync maintains listing files (snapshots of both sides) in:
- Windows: `%LOCALAPPDATA%\rclone\bisync\` or `~/.cache/rclone/bisync/`

These are plain-text files named by path hash, containing mtime + size + hash for every tracked file. This is rclone's fingerprint journal — it enables change detection and drives resume capability. On the next run after a crash, `--recover` uses the last good snapshot to determine what changed vs. what is stale from the interrupted run.

#### Conflict Resolution

```bash
--conflict-resolve newer   # keep newer mtime wins
--conflict-loser rename    # rename loser to .conflict copy (keeps both)
# OR
--conflict-resolve path1   # local always wins
```

#### Known Limitations

1. **No built-in size/count pre-flight warning.** The `--max-delete` flag aborts if >N% of files would be deleted, but there is no "warn if total transfer > 1 GB" guard. This must be wrapped externally.
2. **bisync listing scan on large trees is slow** — for a tree with 100k+ files, the initial listing pass over SFTP can take minutes. Performance issue tracked at github.com/rclone/rclone/issues/7332.
3. **bisync is marked "beta" in docs** — in practice it is production-stable for dev workspaces, but rclone team recommends keeping backups.
4. **Version pinning required** — update rclone on both ends at the same time; a bisync listing format change across major versions can require `--resync`.
5. **Windows path length limit** — if syncing paths > 260 chars, enable long path support in Windows 10 (group policy or registry).

---

### 3.2 mutagen

#### What It Is

mutagen is a developer-focused bidirectional sync tool using SSH as the transport. Unlike rclone (which treats sync as a batch operation), mutagen runs as a background daemon and watches the filesystem for changes, propagating them in near-real-time. It was acquired by Docker in June 2023 and integrated into Docker Desktop, but the standalone OSS tool continues to be maintained.

#### Installation on Windows

```powershell
# Via winget
winget install mutagen-io.mutagen

# Or via Scoop
scoop install mutagen

# Latest standalone: v0.18.1 (2025-02-24)
```

Requires OpenSSH for Windows (built-in since Windows 10 1809, or install via `winget install Microsoft.OpenSSH.Beta`).

#### Configuring SSH Key Auth

mutagen delegates SSH to the system's OpenSSH binary. Set up an `~/.ssh/config` entry:

```sshconfig
Host zombo-sash
  HostName 89.167.57.6
  User root
  IdentityFile d:/WORK/Organizations/SpilnoMe/keys/sash.pem
```

Then fix PEM file permissions (Windows requires only the current user to have read access — SYSTEM and Administrators are allowed):

```powershell
icacls "d:\WORK\Organizations\SpilnoMe\keys\sash.pem" /inheritance:r
icacls "d:\WORK\Organizations\SpilnoMe\keys\sash.pem" /grant:r "$env:USERNAME:(R)"
```

#### Running a Sync Session with Ignore Patterns

```bash
mutagen sync create \
  --name research-zombo \
  --ignore "node_modules" \
  --ignore ".venv" \
  --ignore "venv" \
  --ignore "target" \
  --ignore "dist" \
  --ignore "build" \
  --ignore "__pycache__" \
  --ignore "*.pyc" \
  --ignore-vcs \
  "D:\WORK\Organizations\AITechCraft\Research" \
  zombo-sash:/root/zombo-sash-eco
```

Or use a global defaults config in `~/.mutagen.yml`:

```yaml
sync:
  defaults:
    ignore:
      vcs: true
      paths:
        - node_modules
        - .venv
        - venv
        - target
        - dist
        - build
        - __pycache__
        - "*.pyc"
```

Then simply: `mutagen sync create --name research-zombo "D:\WORK\..." zombo-sash:/root/...`

#### Managing the Session

```bash
mutagen sync list            # list all sessions
mutagen sync monitor         # live progress view
mutagen sync pause research-zombo
mutagen sync resume research-zombo
mutagen sync terminate research-zombo
```

#### Known Limitations

1. **No sync history / fingerprint journal.** mutagen tracks session state internally but does not expose a user-readable log of what was synced, when, or with what checksums. There is no built-in resume-from-manifest capability.
2. **No pre-flight size/count warning.** No threshold guard before beginning a large sync.
3. **Docker acquisition uncertainty.** The last standalone release was Feb 2025 (v0.18.1). The Docker team has not published a roadmap for the standalone tool. Development focus has shifted to Docker Desktop integration.
4. **"Halting" on conflicts.** If mutagen's safety mechanisms detect an anomaly (e.g., large-scale deletions would propagate), it halts synchronization and requires manual `mutagen sync resume` — which is safe but can be disruptive in automated pipelines.
5. **Windows: PEM key permission errors** are common. The error `permission denied (publickey)` often means the key file has loose ACLs; see fix above.

---

## 4. Custom Build Assessment

### Gap Analysis

No OSS tool satisfies requirement #3 (size/count pre-flight warning) or provides a structured JSON/SQLite fingerprint journal (requirement #4 in the full mini-DropBox sense — rclone's listing files are close but not purpose-built for the journal use case).

### Option A: Thin Python Wrapper over rclone bisync (RECOMMENDED)

A Python script that:
1. Calls `rclone size` against both source and remote before syncing to check total size and file count
2. Prompts for confirmation if either threshold is exceeded
3. Writes a structured JSON sync journal entry (timestamp, direction, files transferred, errors, duration)
4. Invokes `rclone bisync` with the standard exclude list and conflict flags
5. Reads rclone's exit code and appends status to the journal

**Effort estimate:** 1 day (8 hours)
- `rclone size --json` call: 1 hour
- Threshold prompt logic: 0.5 hours
- JSON journal writer: 1 hour
- CLI arg parsing (`--source`, `--target-folder`, `--remote-folder`): 1 hour
- Config file for defaults (exclude list, thresholds, remote name): 1 hour
- Testing on Windows + Linux endpoint: 2 hours
- Packaging / README: 0.5 hours

**Dependencies:** Python 3.8+, `subprocess`, `json`, `pathlib` (stdlib only). No paramiko needed — rclone handles SSH.

### Option B: Thin Rust Wrapper over rclone bisync

Same logic as above but in Rust. `std::process::Command` calls rclone; `serde_json` for journal; `clap` for CLI args.

**Effort estimate:** 2-3 days (Rust compile/link overhead, more verbose error handling, cross-compile for Linux test binary).

Not recommended unless the team already has Rust tooling in the workflow (they do, given `beads_rust`), but Python is faster for a wrapper that just shells out.

### Option C: Pure Python with paramiko + watchdog

A from-scratch implementation using `paramiko` (SSH/SFTP) and `watchdog` (FS events) to replicate mutagen-style live sync.

**Effort estimate:** 5-10 days to reach feature parity with rclone bisync. This is overkill — the OSS tools already solve the hard problems (checksumming, conflict detection, protocol handling).

### Option D: Pure Rust with openssh + notify crates

Similar to Option C but in Rust.

**Effort estimate:** 10-15 days. Significant protocol work.

**Verdict:** Options C and D are not recommended unless there is a strong reason to avoid rclone as a dependency (e.g., license concerns, binary size, air-gapped environment). rclone's MIT license is permissive.

---

## 5. Recommended Path

### Decision: Wrap rclone bisync with a thin Python CLI

**Why rclone bisync:**
- Native Windows binary, no WSL dependency
- SFTP backend with PEM key auth built in
- Mature bisync implementation with fingerprint-based change detection
- `--exclude-from` for skip lists, `--conflict-resolve newer` for conflict handling
- `--resilient` + `--recover` for crash safety and resume
- MIT license, 57k stars, very active (v1.73.5 released April 2026)
- Single portable binary, easy to install and pin versions

**Why a thin wrapper is needed:**
- Pre-flight size/count warning (requirement #3) is not native to rclone bisync
- A structured JSON sync journal (requirement #4 — "fingerprint journal for resume") is better served by an explicit log file than rclone's internal listing files

**Implementation sketch:**

```
flowspec-sync (Python CLI)
├── sync.py                  # main entrypoint
├── config.yml               # default exclude list, thresholds, remote name
├── journal/
│   └── sync-YYYY-MM-DD.jsonl  # append-only JSONL sync history
└── README.md
```

CLI interface:
```bash
python sync.py \
  --source "D:\WORK\Organizations\AITechCraft\Research" \
  --remote-folder "zombo-sash:/root/zombo-sash-eco" \
  --warn-size-gb 1 \
  --warn-file-count 100000
```

Pre-flight check calls `rclone size --json <source>` and `rclone size --json <remote>`, compares against thresholds, prompts `[y/N]` if exceeded. Then invokes rclone bisync. On completion, appends a JSONL entry to the journal.

**Total effort:** 1 day for a production-ready wrapper.

---

## 6. Eliminated Candidates

| Tool | Reason eliminated |
|---|---|
| **lsyncd** | Linux-only, one-way only, no Windows support |
| **Syncthing** | Does not use SSH/SFTP — uses its own P2P protocol. Requires both endpoints to run the Syncthing daemon and pair via device IDs. Does not accept a simple SSH key for transport. Unsuitable for the `root@89.167.57.6` endpoint without installing and configuring Syncthing on the server. CLI-headless setup is complex and fragile. |
| **osync** | Bash script, Cygwin/WSL required on Windows, maintenance-only since 2022 |
| **FreeFileSync** | GUI-first, no scriptable pre-flight check, SFTP via key not straightforward on CLI |
| **Seafile/ownCloud/Nextcloud** | Self-hosted server required on target (server software install), not a CLI sync tool |
| **Resilio Sync** | Proprietary/freemium, not fully OSS |

---

## 7. Sources

- [rclone bisync documentation](https://rclone.org/bisync/)
- [rclone SFTP backend](https://rclone.org/sftp/)
- [rclone releases (v1.73.5, 2026-04-19)](https://github.com/rclone/rclone/releases)
- [rclone GitHub (57k stars, MIT)](https://github.com/rclone/rclone)
- [Syncthing v2.0.16 release](https://github.com/syncthing/syncthing/releases)
- [Syncthing ignoring files (.stignore)](https://docs.syncthing.net/users/ignoring.html)
- [Syncthing headless setup](https://theselfhostingblog.com/posts/how-to-set-up-a-headless-syncthing-network/)
- [Syncthing conflict resolution](https://docs.syncthing.net/users/syncing.html)
- [Unison v2.53.8 release (2025-11-05)](https://github.com/bcpierce00/unison/releases/tag/v2.53.8)
- [Unison cross-platform SSH usage](https://blog.scottlowe.org/2020/06/01/using-unison-across-linux-macos-windows/)
- [mutagen documentation](https://mutagen.io/documentation/introduction)
- [mutagen SSH transport](https://mutagen.io/documentation/transports/ssh/)
- [mutagen ignore patterns](https://mutagen.io/documentation/synchronization/ignores/)
- [mutagen v0.18.1 release (2025-02-24)](https://github.com/mutagen-io/mutagen/releases)
- [Docker acquires Mutagen](https://www.docker.com/blog/mutagen-acquisition/)
- [lsyncd bidirectional sync issue](https://github.com/lsyncd/lsyncd/issues/136)
- [osync GitHub (deajan/osync)](https://github.com/deajan/osync)
- [FreeFileSync](https://freefilesync.org/)
- [SFTP sync with rclone (std.rocks)](https://std.rocks/rclone-sftp-file-sync.html)
