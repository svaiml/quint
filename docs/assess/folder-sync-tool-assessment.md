# Feature Assessment: Folder Sync Tool (zombo-sash-eco)

**Date**: 2026-04-23
**Assessed By**: Claude AI Agent
**Beads Issue**: bd-d6t
**Status**: Assessed

---

## Feature Overview

Build a bidirectional folder sync tool (Python or Rust) to achieve full parity between local workspace
folders (e.g., `D:\WORK\Organizations\AITechCraft\Research\`) and a remote server
(`root@89.167.57.6:/root/zombo-sash-eco/*`, key `d:\WORK\Organizations\SpilnoMe\keys\sash.pem`).

**Core requirements:**
- `--target-folder(s)` and `--remote-folder(s)` CLI params
- Skip noise directories: `node_modules`, `.venv`, `target` (Cargo), `dist`, `.git` subtrees, etc.
- Warn before syncing when size > 1 GB or file count > 100k
- Sync history / fingerprint journal for resume capability (mini-DropBox approach)
- Research OSS solutions first; wrap or build as appropriate

**Why not Git?** Remote repos belong to different authors and are parts of multi-repo workspaces. Git
semantics (commits, branches, remotes) do not map cleanly to a flat workspace mirror.

---

## Scoring Analysis

### Complexity: 5.7 / 10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 6/10 | ~1 week: CLI harness, SSH transport, manifest store, skip-list engine, warning thresholds, resume logic |
| Component Count | 6/10 | ~5-6 components: CLI, SSH/SFTP layer, fingerprint DB (SQLite), ignore engine, journal, threshold guard |
| Integration Points | 5/10 | SSH key auth, remote FS via SFTP/rsync, local SQLite manifest; 3 integration surfaces |
| **Average** | **5.7/10** | |

### Risk: 4.3 / 10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 6/10 | SSH private key handling, remote root access, potential data loss on wrong sync direction |
| Compliance Requirements | 2/10 | Internal dev tool, no regulatory constraints |
| Data Sensitivity | 5/10 | Workspace may contain API keys, `.env` files, secrets that could transit or be mirrored |
| **Average** | **4.3/10** | |

### Architecture Impact: 3.3 / 10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 6/10 | Introduces sync/fingerprint pattern not present in workspace; new tool category entirely |
| Breaking Changes | 1/10 | Standalone new tool; no changes to existing repos or APIs |
| Dependencies Affected | 3/10 | Affects workspace-level dev workflow but no code dependencies downstream |
| **Average** | **3.3/10** | |

---

## DVF+V Preliminary Risk

| Risk Type | Present? | Bonus |
|-----------|----------|-------|
| Value Risk | No - user has clear, stated need | 0 |
| Usability Risk | Yes - sync direction ambiguity, conflict resolution UX, resume UX | +2 |
| Feasibility Risk | Yes - unknown OSS landscape; SSH edge cases; fingerprint algo choice | +2 |
| Viability Risk | No - clear daily-workflow ROI | 0 |
| **DVF+V Bonus** | | **+4** |

---

## Overall Assessment

| | Score |
|--|-------|
| Complexity | 5.7 |
| Risk | 4.3 |
| Architecture Impact | 3.3 |
| DVF+V Bonus | +4.0 |
| **Total** | **17.3 / 34** |

**Recommendation: Spec-Light**
**Confidence: Medium-High**

---

## Rationale

Total score 17.3 lands just below the Full SDD threshold (18), but above Spec-Light (10).
No single category dimension exceeds 7. Key factors:

- **Research-first is mandatory**: The user explicitly wants to evaluate OSS tools before building.
  Candidates include: `Syncthing`, `Unison`, `rclone`, `mutagen`, `lsyncd`, `rsync` wrappers.
  A `/flow:research` pass should precede any spec or implementation.
- **Security surface is real**: Root SSH key transit and potential secret mirroring warrant
  explicit attention in the spec (`.env` exclusion rules, dry-run default).
- **UX unknowns**: Conflict resolution strategy (last-write-wins vs prompt vs side-by-side) and
  resume semantics need to be pinned before coding starts.
- **Scope is well-bounded**: A Spec-Light document covering problem statement, OSS evaluation
  matrix, selected approach, skip-list defaults, and 5-6 acceptance criteria is sufficient.

---

## Recommended Next Steps

### Step 1 - Research (immediate)

```bash
/flow:research folder-sync-tool
```

Research questions:
1. Does `rclone` + SFTP backend satisfy the use case out of the box?
2. Does `Syncthing` or `Unison` cover multi-folder, SSH-key, skip-list, and manifest requirements?
3. Is `mutagen` (designed for dev workspace sync) a better fit than a custom tool?
4. If custom: Python (`paramiko` + `watchdog`) vs Rust (`openssh` crate + `notify`)?

### Step 2 - Spec-Light Document

After research, create `docs/prd/folder-sync-tool-spec.md` covering:

- Problem statement and non-goals (not a VCS replacement)
- OSS evaluation matrix + selected approach (wrap vs build)
- CLI contract: `--source`, `--remote`, `--exclude`, `--dry-run`, `--resume`
- Default skip-list (`node_modules`, `.venv`, `target`, `dist`, `.git`, `__pycache__`, `*.pyc`)
- Threshold warning behavior (>1 GB or >100k files -> confirm prompt)
- Fingerprint/manifest format (SQLite, keyed by path + mtime + size hash)
- Acceptance criteria (5-6 testable items)

Then proceed to implementation:

```bash
/flow:implement folder-sync-tool
```

### Override Options

```bash
/flow:assess folder-sync-tool --mode full    # Escalate to full SDD
/flow:assess folder-sync-tool --mode skip    # Skip spec, implement directly
```

---

## Remote Context (for research phase)

- Remote host: `root@89.167.57.6`
- Remote root: `/root/zombo-sash-eco/`
- SSH key: `d:\WORK\Organizations\SpilnoMe\keys\sash.pem`
- Local workspace: `D:\WORK\Organizations\AITechCraft\Research\`

---

*Assessment generated by /flow:assess workflow*
