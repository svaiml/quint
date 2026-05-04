# Business Validation: folder-sync-tool

**Date:** 2026-04-23
**Analyst:** Senior Business Analyst
**Tracking:** bd-2ph
**Status:** Final
**Input:** docs/research/folder-sync-tool-research.md

---

## 1. Executive Assessment

**Verdict: PROCEED WITH CAUTION — Go on the thin Python wrapper**
**Confidence: 75%**

The research phase produced a clear and well-supported recommendation. The rclone bisync foundation is solid: native Windows binary, MIT license, active maintenance (v1.73.5, April 2026), PEM key SSH, and built-in fingerprint-based change detection. The two genuine gaps — pre-flight size/count warning and a structured sync journal — are small and well-bounded. A thin Python wrapper fills them in ~1 day.

The caution flags are not about the build decision itself; they are about operational risks that exist whether you wrap or use rclone directly. Root SSH key exposure, `.env` file sync, and bisync state corruption on large monorepos are real hazards that require deliberate mitigation before first use.

**Do not proceed without addressing Risk #1 and Risk #2 (see Risk Register) first.**

---

## 2. Opportunity Score

| Dimension | Score (1-10) | Rationale |
|---|---|---|
| **Feasibility** | 8 | rclone covers 80% of requirements natively; wrapper scope is tightly bounded; stdlib Python only; no novel protocol work. Docked 2 for bisync beta label and Windows path edge cases. |
| **Strategic Fit** | 9 | Directly unblocks the stated goal: full parity between local Research workspace and remote zombo-sash-eco. No team adoption friction (single developer). Eliminates the current manual copy/paste or ad-hoc rsync workflow. |
| **Operational Risk** | 4 | SSH to root, .env files in workspace, monorepo with submodules, bisync state corruption potential, and Windows↔Linux line-ending divergence are all real. Score reflects inherent risk level — not a reason to cancel, but risks must be mitigated. |
| **Maintenance Burden** | 7 | rclone is very actively maintained. The wrapper is thin (no complex logic). Main burden: pin rclone version and re-test on rclone major upgrades. Docked 3 for bisync format-change risk on upgrades requiring `--resync`. |
| **Composite** | **7.0** | Weighted average. Feasibility and strategic fit are strong; operational risk is the primary area needing attention. |

---

## 3. Risk Register

### Risk 1: Secret File Sync (Probability: HIGH / Impact: CRITICAL)

**Description:** The workspace contains `.env` files, PEM keys, credentials JSON, and API token files. rclone bisync will sync everything not explicitly excluded. A `.env` containing production secrets synced to a remote root account is a critical exposure.

**Current state:** The research-defined default skip list covers build artifacts and VCS internals but does NOT include `.env`, `*.pem`, `*.key`, `*credentials*`, `*.secret`, or similar patterns.

**Mitigation (REQUIRED before first run):**
- Add to the exclude list in `config.yml` (wrapper) or `sync-excludes.txt` (bare rclone):
  ```
  .env
  .env.*
  *.pem
  *.key
  *.p12
  *.pfx
  *credentials*
  *secrets*
  .aws/
  .ssh/
  ```
- Run `rclone check` (dry-run) on first use and audit the transfer list before confirming.
- Document the canonical exclude list in the wrapper README so it is reviewed on each change.

---

### Risk 2: Root SSH Key Exposure (Probability: MEDIUM / Impact: CRITICAL)

**Description:** `sash.pem` grants root access to `89.167.57.6`. If the Windows workstation is compromised, the key is compromised. If the wrapper or a script logs the key path into a synced journal, the journal itself leaks the key path.

**Mitigation:**
- Do NOT log key path or SSH config values in the JSON sync journal.
- Store `sash.pem` outside the synced workspace tree (`D:\WORK\Organizations\SpilnoMe\keys\` is already outside the Research folder — preserve this).
- Consider creating a dedicated non-root user on the remote server for sync operations, restricted to `/root/zombo-sash-eco/` via an SSH `ForceCommand` or `ChrootDirectory` setup. Root is overkill for a sync transport.
- Rotate the key if any doubt about prior exposure exists.

---

### Risk 3: bisync State Corruption on Large Monorepo (Probability: MEDIUM / Impact: HIGH)

**Description:** The workspace is a monorepo with submodules (`apps/reasoning-apps`, `orchestration/AllBeads`, etc. per git status). If a sync is interrupted mid-run (network drop, laptop sleep, OS crash), rclone bisync's listing files may be left in an inconsistent state. On the next run, bisync may misinterpret the stale state and propagate deletions or overwrites incorrectly.

**Mitigation:**
- Always use `--resilient --recover` flags (the wrapper should enforce these unconditionally).
- Keep `--max-delete 20` (or lower) so that an anomalous mass-delete is aborted, not silently executed.
- Exclude `.git/**` unconditionally (already in the default list) — git submodule `.git` directories contain symlinks and objects that confuse bisync's change detection.
- Schedule a periodic `--resync` (full re-baseline) monthly or after any rclone version upgrade.
- The wrapper's JSONL journal will provide a paper trail to diagnose state issues.

---

### Risk 4: Windows Path Length and Line Ending Issues (Probability: MEDIUM / Impact: MEDIUM)

**Description:** Windows 10 has a 260-character path limit by default. The workspace path `D:\WORK\Organizations\AITechCraft\Research\` is already 45 characters; deeply nested Rust/Node projects can easily exceed the limit. Additionally, cross-platform sync may cause line-ending divergence (CRLF vs LF) on text files if any tool rewrites them on the Windows side.

**Mitigation:**
- Enable long path support on Windows 10 (Group Policy: `Computer Configuration > Administrative Templates > System > Filesystem > Enable Win32 long paths`, or registry `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1`).
- Add `.gitattributes`-style notes to the sync README reminding developers not to rely on CRLF normalization from sync (rclone transfers bytes, not text).
- Monitor the first few sync runs for any unexpected file churn on text files.

---

### Risk 5: Submodule and Symlink Handling (Probability: LOW-MEDIUM / Impact: MEDIUM)

**Description:** The workspace contains Git submodules (listed as `m` in git status: `orchestration/AllBeads`, `orchestration/CoreFoundation`, `orchestration/beads_rust`, etc.). Submodules are directories containing their own `.git` directories. rclone bisync with `.git/**` excluded will sync the submodule working-tree files but not their `.git` metadata. This is the correct behavior for workspace mirroring, but the remote server will not have functional submodule git state — only the file contents.

**Mitigation:**
- This is acceptable for the stated goal (workspace file parity), not code repository mirroring. Document this explicitly: the remote is a file mirror, not a git clone.
- If the remote ever needs to be a functional git repo, use `git clone --recursive` separately — do not rely on bisync for git state.
- Confirm rclone's behavior with symlinks (`--copy-links` vs default) on the first dry-run; Linux servers often use symlinks in node_modules or virtual envs.

---

## 4. Critical Assumptions

For the recommended path to succeed, all of the following must be true:

1. **rclone is installable on the Windows workstation** without admin restrictions (winget or portable binary). If the machine is managed/locked down, this must be pre-approved.

2. **SSH port 22 is reachable** from the Windows workstation to `89.167.57.6` without VPN or firewall intervention. (If a VPN is required, the wrapper must document this prerequisite.)

3. **Python 3.8+ is available** on the Windows workstation (or the wrapper is packaged as a standalone executable via PyInstaller, removing this dependency).

4. **The remote path `/root/zombo-sash-eco/` exists** and is writable. The initial `--resync` will create it if rclone has the right permissions, but this should be verified.

5. **The workspace is the source of truth** for the initial sync baseline. If the remote server already has files that differ from local, the first `--resync` will overwrite remote with local. This must be consciously accepted by the operator.

6. **No other process modifies the remote directory** concurrently during sync. bisync does not support concurrent writers. If CI pipelines or other agents modify `/root/zombo-sash-eco/` while sync runs, conflicts will occur.

7. **`.env` and credential files are excluded** before the first run. This is non-negotiable (see Risk #1).

---

## 5. Recommended Path

### Decision: Build the thin Python wrapper (Option A from research)

**Rationale over direct rclone alias/script:**

The "just use a shell alias" alternative is tempting for a single-developer tool, but it fails on two specific requirements that are not cosmetic:

- **Pre-flight size/count warning:** Without this, a first sync of the full monorepo (which could be multi-GB after accounting for compiled artifacts that slip past excludes) will silently transfer without operator awareness. For a root SSH target, silent large transfers are a liability.
- **Structured sync journal:** The JSONL journal provides an audit trail for diagnosing state corruption (Risk #3) and for answering "what was the last successful sync, and what did it touch?" A shell alias provides no such trail.

Both of these have value that exceeds 1 day of effort.

**The wrapper also:**
- Enforces `--resilient --recover --max-delete` unconditionally (not forgettable flags)
- Owns the exclude list in a config file (single source of truth, not duplicated across alias definitions)
- Makes the secret-exclusion patterns reviewable and auditable in source control

**Compared to direct rclone alias:**

| Capability | Python Wrapper | Shell Alias / Direct rclone |
|---|---|---|
| Pre-flight size/count warning | Yes | No |
| JSONL sync journal | Yes | No |
| Enforced safety flags | Yes (hardcoded in wrapper) | Relies on alias being correct every time |
| Canonical exclude list | Yes (config file) | Duplicated in alias, easy to drift |
| Secret exclusion auditable in repo | Yes | Partially (alias definition) |
| Effort | ~1 day | ~1 hour |

The delta is 1 day. Given the operational risks (root key, `.env` sync), the wrapper's enforced safety surface justifies this.

**Scope for the 1-day build:**

The wrapper does NOT need to be a production-grade tool. It is a developer convenience script. Scope it tightly:

1. Read config from `config.yml` (exclude list, remote name, thresholds)
2. Call `rclone size --json` on source and remote; warn and prompt if thresholds exceeded
3. Build and invoke the `rclone bisync` command with enforced flags
4. Append a JSONL entry on completion (timestamp, exit code, duration, bytes transferred if parseable from rclone output)
5. Optionally: `--dry-run` flag that passes `--dry-run` to rclone and skips journal write

No daemon, no file watcher, no web UI, no dependency beyond Python stdlib + rclone binary.

---

## 6. Next Steps

**Step 1 (Before any sync): Finalize the secret exclusion list.**
Audit the workspace for all credential and secret files. Add patterns to a `sync-excludes.txt` in the repo. This takes 1-2 hours and is a hard prerequisite.

**Step 2 (Before any sync): Verify SSH connectivity and remote path.**
Run `rclone ls zombo-sash-remote:/root/zombo-sash-eco/` (or create the path). Confirm SSH works from the Windows workstation with the PEM key. Confirm the remote path is the intended target.

**Step 3 (Day 1): Build the Python wrapper.**
Implement the five-scope items above. Run a `--dry-run` first on a small subdirectory to validate exclude patterns, then on the full workspace before committing to `--resync`. Create a task in the backlog for implementation.

**Step 4 (After first sync): Audit the JSONL journal and remote file tree.**
Spot-check the remote to confirm no secrets transferred, no unexpected large files, no submodule `.git` dirs. This is a 30-minute sanity check that validates the entire setup.

**Step 5 (Ongoing): Pin rclone version and document upgrade procedure.**
Add the installed rclone version to the wrapper README. Document that a rclone major version upgrade requires running `--resync` once and re-testing the exclude list.

---

## 7. Summary Table

| Question | Answer |
|---|---|
| Build vs wrap decision justified? | Yes. 1-day wrapper investment is justified by enforced safety flags, pre-flight warning, and audit journal. |
| Essential risk mitigations? | (1) Secret exclusion list before first run. (2) Confirm root key never logged or synced. (3) `--resilient --recover --max-delete` enforced. |
| Biggest operational hazard? | bisync state corruption on interrupted runs + mass-delete propagation without `--max-delete`. |
| Does this unblock the stated goal? | Yes, with high confidence — workspace file parity between local and remote is the core use case rclone bisync was built for. |
| Alternative path viable? | A shell alias is viable but lacks safety enforcement and audit trail. Not recommended given the root-key risk surface. |
| Overall recommendation | Go. Build wrapper. Mitigate secrets and key risks first. |
