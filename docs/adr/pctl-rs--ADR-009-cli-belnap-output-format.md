# ADR-009: CLI `belnap` Subcommand Output Format (Plain Text `s_name: Value`)

**Status**: Accepted
**Date**: 2026-04-13
**Feature**: pPCTL Parser — P4>=θ Syntax + CLI Belnap Subcommand
**Branch**: `feature/pctl-parser-belnap`
**References**: TASK-23, `docs/prd/pctl-parser-belnap-spec.md` §3.6, ADR-007, ADR-008

---

## Context

`belnap_four_check` returns one `BelnapFourValue` per state: `True`, `False`,
`Conflicted`, or `Unknown`. The CLI subcommand must render these to stdout in a form
that is:

1. **Human-readable** — researchers inspect output directly in a terminal.
2. **Script-friendly** — CI shell scripts drive `pctl-cli` and `grep`/`awk` the output.
3. **Diff-stable** — golden-file integration tests (`belnap_cli_conflicted_fixture`) must
   compare exact byte output.
4. **Extensible** — future JSON support must not require a breaking format change.

Two concrete output formats were evaluated:

**Option A — Plain text, one line per state:**
```
s_init: Conflicted
s_fault: True
```

**Option B — JSON array:**
```json
[
  {"state": "s_init",  "value": "Conflicted"},
  {"state": "s_fault", "value": "True"}
]
```

## Decision

Use **plain text `<state_name>: <value>`** (Option A) as the default and only output
format for the `belnap` subcommand in this feature.

Rules for rendering each line:

| Field        | Rule |
|--------------|------|
| `state_name` | First atom label in `dtmc.labels[s].atoms`; falls back to `s{N}` (0-indexed) if the state has no labels. |
| `value`      | `Display` of `BelnapFourValue`: `True`, `False`, `Conflicted`, `Unknown`. |
| Separator    | `: ` (colon + single space). |
| Order        | States in ascending index order (0, 1, 2, …). |
| Terminator   | Newline (`\n`) after each line; no trailing blank line. |

Exit codes: `0` on success, `1` on any I/O or parse error (message to stderr).

JSON output is **deferred** — it can be added behind a `--json` flag in a follow-up
without changing the default behaviour. The plain-text format is stable and will not
be altered when `--json` is introduced.

## Alternatives Considered

### JSON as default output

JSON is machine-parseable without regex and self-describing. However, the primary
consumers at this stage are researchers in a terminal and shell-script CI pipelines;
both groups are better served by `grep "s_init: Conflicted"` than by piping through
`jq`. JSON as default also adds a dependency on a JSON serialisation crate (`serde_json`)
for a single string-rendering concern. **Deferred to a follow-up `--json` flag.**

### Tab-separated values (`s_init\tConflicted`)

TSV is grep-friendly and avoids the `: ` ambiguity if a state name contains a colon.
State names in the `.dtmc` format are atom identifiers (alphanumeric + underscore by
loader convention), so colon collisions are impossible. TSV is less readable than the
`name: value` form at a glance. **Rejected in favour of the more readable colon form.**

### One value per line, no state name (`Conflicted\nTrue`)

Positional-only output makes integration tests fragile when state ordering changes and
is unreadable without cross-referencing the model file. **Rejected.**

### Align values in columns

Fixed-width alignment (`s_init  : Conflicted`) would break diff-stable tests if a
model grows a longer state name. **Rejected.**

## Consequences

- Integration tests (`belnap_cli_conflicted_fixture`, `belnap_cli_unknown_fixture`) assert
  exact string equality against the plain-text output; the format is frozen for this feature.
- Adding `--json` later is non-breaking: the default path is unchanged, and existing tests
  do not pass `--json`.
- Classical `check` and `info` subcommands are unaffected; they use their own output paths.
- `pctl-cli` gains zero new crate dependencies for output rendering (formatting is a
  `format!("{}: {}", name, value)` call using `BelnapFourValue`'s existing `Display` impl,
  or a simple `match` if `Display` is not yet implemented).
- NINE bilattice CLI output (`P9` variant) will follow the same plain-text convention when
  implemented, with value rendering extended to cover the nine bilattice values.
