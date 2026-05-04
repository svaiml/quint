# ADR-002: Python Wrapper CLI

**Status**: Accepted
**Date**: 2026-04-23

## Context

rclone bisync (ADR-001) covers approximately 80% of the folder-sync-tool requirements natively.
Two capabilities are absent from rclone bisync and cannot be provided by shell aliases or rclone flags alone:

1. **Pre-flight threshold warning**: Before any transfer begins, the tool must check total source and
   remote size/file-count and prompt the operator (or exit non-zero in CI mode) if either exceeds
   configured limits (default: 1 GB / 100,000 files). rclone's `--max-delete` flag guards against
   mass deletion after the fact but provides no pre-flight awareness.

2. **Structured audit journal**: Every sync run must produce a machine-readable JSONL record including
   timestamp, duration, exit code, bytes transferred, and error count (see ADR-003). rclone's internal
   bisync listing files are an implementation detail, not an operator-facing audit trail.

Beyond these two gaps, a wrapper provides additional safety invariants: enforcing `--resilient --recover
--max-delete` on every run so they cannot be accidentally omitted, and keeping the canonical exclude
list in a single version-controlled config rather than duplicated across shell aliases.

The question is: what language and runtime should this thin wrapper be written in?

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Python stdlib wrapper** | Available on all four target platforms with no additional install; zero third-party dependencies (subprocess, json, pathlib, argparse, uuid, datetime); ~1 day scope; easy to read and audit by any team member; portable shebang (`/usr/bin/env python3`) | Runtime dependency on Python 3.8+; slightly slower startup than a compiled binary (irrelevant at this scale) |
| **Shell alias / bash script** | Zero setup; immediate | Not portable to Windows CMD/PowerShell without adaptation; no structured output; safety flags easy to omit; secret exclusion not auditable in source control |
| **Rust binary** | Single compiled binary; no Python dependency; fast startup | 2–3 day effort for same functionality; cross-compile required for each target platform; overkill for a ~200-line wrapper that shells out to rclone |
| **Direct rclone (no wrapper)** | Zero development effort | Missing pre-flight warning and audit journal entirely; safety flags must be remembered on every invocation; exclude list duplicated in every shell alias |

## Decision

**Build a thin Python stdlib wrapper (~200–300 lines, no classes, no framework).**

Python 3.8+ is already a declared prerequisite for the developer environment on all target platforms.
The wrapper's role is purely orchestration: call `rclone size`, compare against thresholds, call
`rclone bisync`, write a JSONL journal entry. This is a one-day scope that does not justify the
cross-compilation overhead of a compiled binary.

The wrapper is intentionally kept minimal: no classes, no framework, no third-party dependencies.
This keeps the maintenance surface as thin as the tool's name implies.

## Consequences

**Positive:**
- Portable across Windows, Linux, macOS, FreeBSD with the same source file (`/usr/bin/env python3` shebang)
- Zero third-party dependencies — `pip install` is not required at any point
- Pre-flight warning and journal logic are in plain Python, reviewable by any developer
- Enforced safety flags (`--resilient --recover --max-delete`) cannot be forgotten or overridden by operator error
- Single canonical exclude list in `config.yml` (checked into repo), not scattered across aliases
- Non-interactive mode (`--non-interactive`) makes the tool usable in CI pipelines with structured exit codes

**Negative:**
- Python 3.8+ must be present on `PATH` (in addition to rclone)
- Wrapper is a new file to maintain; changes to rclone CLI flags or output format require wrapper updates

**Mitigations:**
- Python 3.8 was released October 2019; it is available via all major package managers and is unlikely to be absent from any developer machine or CI runner
- If a zero-dependency binary is needed in the future, the wrapper can be packaged with PyInstaller without changing the source
- Wrapper version is tracked in `config.yml`; the architecture document specifies the rclone output fields the wrapper depends on
