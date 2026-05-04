# ADR-003: JSONL Audit Journal

**Status**: Accepted
**Date**: 2026-04-23

## Context

The PRD (section 5.4) requires a sync history mechanism that serves three purposes:

1. **Audit trail**: Record every sync run with timestamp, outcome, byte counts, and error count
   so the operator can answer "what was the last successful sync?" and "did anything go wrong?"

2. **Diagnostics**: When bisync state corruption occurs (Risk #3 in the validation document),
   the journal provides a paper trail to determine when the last clean run completed, what
   rclone version was used, and whether the corruption coincides with a known event.

3. **Resume fingerprint**: While rclone maintains its own internal listing files for change
   detection, the operator-facing journal should record the run's `run_id` and outcome so that
   partially-completed runs can be identified and `--recover` invocations can be confirmed.

rclone's internal bisync listing files in `~/.cache/rclone/bisync/` are the engine's own state,
not a user-facing journal. They are not suitable as an audit trail because they are binary-ish
path-hashed files with no human-readable run metadata.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **JSONL append-only (one record per run)** | Human-readable; appendable without locking; trivially parseable with `jq`, Python, or any log tool; no schema migration; daily rotation keeps file size bounded; grep-friendly | No query capability beyond line-by-line scan; no indexing; not suitable if thousands of runs per day are expected (not applicable here) |
| **SQLite database** | Queryable; schema-enforced; supports indexes and foreign keys | Adds `sqlite3` stdlib import (acceptable) but more setup than append; single-file database can be corrupted by a crash during write; harder to inspect with a text editor; overkill for single-user tool with at most a few runs per day |
| **Plain text log** | Simplest possible implementation | Unstructured; not machine-parseable; fields not self-documenting; cannot be reliably parsed by CI or monitoring tools |
| **rclone bisync listing files only** | No additional code needed | Not an operator-facing journal; contains per-file state, not per-run metadata; stored in a platform-specific cache directory; not checked into repo |

## Decision

**Use JSONL (newline-delimited JSON) append-only files, one file per calendar day.**

Each sync run appends exactly one JSON object on a new line to `journal/sync-YYYY-MM-DD.jsonl`.
The journal directory is checked into the repository (`.gitignore` excludes large binary files but
JSONL text journals are small and version-controlled for history).

Daily rotation bounds individual file size and makes retention policy trivial: keep last 30 days,
delete older files.

The schema for each record is fixed (see PRD section 5.4) and includes: `run_id` (UUID4),
`timestamp_utc`, `duration_seconds`, `source`, `remote`, `dry_run`, `resync`, `exit_code`,
`files_transferred`, `bytes_transferred`, `errors`, `rclone_version`, `wrapper_version`, `platform`.

**Security constraint enforced at write time**: the journal MUST NOT log SSH key paths, remote
credentials, or any file paths matching the secrets exclusion patterns (see ADR-004).

## Consequences

**Positive:**
- Human-readable without any tooling — `cat journal/sync-2026-04-23.jsonl` is immediately useful
- Append-only write pattern is crash-safe: a failed write leaves the previous lines intact
- `jq` or Python one-liners can query the journal for last successful run, error patterns, etc.
- Daily rotation limits individual file size; 30-day retention is a simple `find` / directory scan
- Checked into the repository as part of the tool, giving a natural audit trail in version control
- UUID `run_id` per record enables correlation with rclone verbose logs if debugging is needed

**Negative:**
- No query capability beyond sequential scan (grep / jq / Python); no index
- Journal must not contain sensitive data — enforced by wrapper logic, but requires ongoing discipline
- If the wrapper crashes before writing the journal entry, the run is unrecorded (mitigated below)

**Mitigations:**
- Journal write is a try/finally block: even if rclone exits non-zero, the wrapper writes the entry with the actual exit code
- The journal schema includes an `errors` array so partial-failure runs are recorded, not silently dropped
- Security review of the journal writer is part of the security spike (bd-1g9) acceptance criteria
