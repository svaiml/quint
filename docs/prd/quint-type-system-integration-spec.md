# PRD: Quint Type System Integration

**Feature**: quint-type-system-integration
**Date**: 2026-04-24
**Author**: @pm-planner (Claude AI Agent)
**Status**: Specified
**Assessment**: docs/assess/quint-type-system-assessment.md
**Assessment Score**: 17.0/30 → Spec-Light
**Upstream ADR**: quint/ADR005 (informalsystems/quint)

---

## 1. Executive Summary

### Problem Statement

Quint (Layer 06 SPEC) has a fully implemented constraint-based type system
(ADR005: equality constraint generation, unification solver, row-polymorphism
for records/tuples). We are not using it.

Currently `flowspec gate` has no type-checking step. Specs written in `.qnt`
can contain type errors that silently pass gate and propagate to `infer` and
`criterium`, which then receive malformed fact schemas and fail at runtime —
far from the spec that caused the problem.

### Strategy Update (2026-05-03)

**Bridge first, reimplement later.** We don't patch quint or haft. We use quint
as-is via `zz-bridge-quint` — same pattern as `zz-bridge-infer` and `infer-pctl`.

Phases:
1. **Spike** — verify `quint typecheck` output is parseable (`zombo-sash-eco-5xr`)
2. **Bridge** — `zz-bridge-quint` crate maps Quint types → ZZ entities (`zombo-sash-eco-nnh`)
3. **Gate** — flowspec gate calls the bridge, not quint directly (`zombo-sash-eco-wdv`)
4. **Native** (future) — replace bridge with built-in ZZ type inference

Quint ADRs (001-008) are upstream references informing bridge design, not our
implementation tasks.

### Proposed Solution

Wire Quint's type checker into ZZ via a bridge crate:

| # | Surface | Mechanism |
|---|---------|-----------|
| 1 | `flowspec gate` → `quint typecheck` | Gate blocks on type errors before workflow progresses |
| 2 | Typed Quint → `infer` fact bridge | Row types become infer predicate signatures |
| 3 | `zz-notation` ↔ Quint type schemes | Type-tagged propositions in meta-reasoning |

The result: type errors caught at spec-time (Layer 06), not at inference-time
(Layer 05). The logic proof gate becomes a **type proof gate + logic proof gate**.

### Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Type errors caught at gate | 0% | 100% of `.qnt` files in spec pipeline |
| Infer runtime schema errors caused by bad specs | unknown | 0 |
| Time from type error to developer feedback | hours (runtime) | seconds (gate) |

### Strategic Alignment

Prometey Stack crossover principle: `infer` (Layer 05) proves that specs (Layer 06)
satisfy architectural invariants **before** agents execute them. Type checking is the
first, cheapest proof — it must happen before logical proof.

Assessment scores: Complexity 4.3, Risk 1.0, Architecture Impact 4.7, DVF+V +7.
Primary risk is feasibility: row type → infer predicate mapping is untested.

---

## 2. User Stories and Use Cases

### Persona: Spec Author (flowspec user writing `.qnt` files)

**Story 1 — Type error caught at gate**
> As a spec author, when I write a `.qnt` spec with a type error (e.g. passing
> an `int` where a `str` is expected), I want `flowspec gate` to fail immediately
> with a clear message pointing to the line, so I fix it before it cascades
> downstream.

Acceptance:
- `flowspec gate` runs `quint typecheck <file>.qnt` for every `.qnt` in the spec path
- Gate exit code is non-zero if any type errors exist
- Error message includes file, line, column, and the conflicting types
- Plain-text and `--json` output modes both supported

**Story 2 — Row type → infer bridge**
> As a reasoning engineer, when a `.qnt` spec defines a record type
> `{ case_id: str, outcome: bool }`, I want the infer bridge to emit a matching
> predicate declaration `case_outcome(CaseId: str, Outcome: bool)` so that infer
> can reason over it without manual schema writing.

Acceptance:
- Bridge reads typed Quint IR (post-typecheck JSON output)
- Each top-level record type becomes one infer predicate
- Field names become argument names; Quint types map to infer sorts
- Bridge is invocable as `quint-to-infer <typed.json> > facts.infer`

**Story 3 — Gate integration visible in workflow**
> As a team lead, when I run `flowspec gate`, I want to see a "Quint typecheck"
> line in the output summary, so I know type validation was actually run.

Acceptance:
- Gate output includes `[quint] typecheck: N files checked, M errors` line
- Gate passes only if M = 0
- Gate respects `--skip-quint` flag for repos without `.qnt` files

---

## 3. DVF+V Risk Assessment

| Risk | Score | Mitigation |
|------|-------|------------|
| **Value**: Do we actually use Quint specs today? | Medium | Check for `.qnt` files in flowspec and reasoning repos before building gate |
| **Usability**: Type error messages from Quint are cryptic | High | Add a translation layer that converts Quint constraint solver errors to plain English. Example: "Type mismatch at records.qnt:12 — `rec1` expects `{f1: int, f2: str}`, got `{f1: str, f2: str}`" |
| **Feasibility**: Row type → infer predicate arity mapping | High | Spike on `examples/language-features/records.qnt` first — verify Quint's `--output json` emits typed IR we can parse |
| **Viability**: Effort justified vs. benefit | Low | Gate integration is ~1 day; bridge is ~2 days. Clear payoff: type errors caught at spec time |

---

## 4. Functional Requirements

### 4.1 flowspec gate — Quint typecheck step

- `flowspec gate` discovers `.qnt` files in the spec search path
  (configurable in `flowspec_workflow.yml`, default: `docs/specs/`)
- For each `.qnt` file: runs `quint typecheck <file>` (or `npx @informalsystems/quint typecheck`)
- Collects errors; aggregates into gate result
- Gate score penalty: each type error deducts 10 points (default gate threshold 70 → 0 type errors allowed)
- New gate config key:

```yaml
# flowspec_workflow.yml
gate:
  quint_typecheck:
    enabled: true
    search_path: "docs/specs/"
    binary: "quint"          # or "npx @informalsystems/quint"
    skip_flag: "--skip-quint"
```

### 4.2 Quint → infer type bridge

Type mapping table:

| Quint type | infer sort |
|-----------|------------|
| `int` | `Integer` |
| `str` | `String` |
| `bool` | `Boolean` |
| `Set[T]` | `List` (homogeneous) |
| `List[T]` | `List` |
| `{ f: T, ... }` | Predicate with named args |
| `(T1, T2)` | Tuple predicate with positional args |
| `T1 -> T2` | Function fact (operator declaration) |

Row-type example:

```
-- Quint record type
var case_record: { case_id: str, outcome: bool, confidence: int }

-- Bridge output (.infer)
predicate case_record(CaseId: String, Outcome: Boolean, Confidence: Integer).
```

### 4.3 zz-notation type annotation alignment

zz-notation strategy compositions use type-tagged propositions of the form
`[type: T] proposition`. Quint type schemes (parametric polymorphism via type
variables) map to zz-notation's open type variables:

```
-- Quint polymorphic operator
def apply(f: (a) => b, x: a): b = f(x)

-- zz-notation tagged proposition
[type: (a -> b) × a -> b] apply
```

This surface is lower priority (see task breakdown). Spec it in a follow-on ADR.

---

## 5. Non-Functional Requirements

- **Performance**: `quint typecheck` on a single file completes in < 2s (JS startup included); gate adds < 10s total on a repo with ≤ 20 spec files
- **Fail-safe**: if `quint` binary not found, gate emits a warning (not an error) and skips the typecheck step — avoids blocking CI on machines without Node
- **Idempotent**: running gate twice gives the same result
- **No new runtime deps in pctl-rs or infer**: bridge is a standalone CLI tool, not a Rust crate dependency

---

## 6. Task Breakdown

Tasks created via `br create`:

### Task 1: Quint typecheck spike

```bash
TASK1=$(br create \
  --title="Spike: verify quint typecheck JSON output for row types" \
  --type=task \
  --priority=1 \
  -l "quint,spike,feasibility" \
  -d "WHAT: Run quint typecheck on examples/language-features/records.qnt with --output json and inspect the typed IR schema

WHY: Feasibility risk from assessment — row type → infer mapping is untested. Must confirm Quint emits parseable typed IR before building bridge.

HOW: 1) Install quint (npm i -g @informalsystems/quint or use repo binary)
2) quint typecheck examples/language-features/records.qnt --output json > /tmp/typed.json
3) Inspect schema: what does a record type look like in the JSON?
4) Document the IR schema in docs/specs/quint-typed-ir-schema.md

Refs: docs/prd/quint-type-system-integration-spec.md, tools/ai-tools/quint/examples/language-features/records.qnt" \
  --silent 2>/dev/null)
br update "$TASK1" --acceptance-criteria $'- [ ] quint typecheck runs successfully on records.qnt\n- [ ] Typed IR JSON schema documented\n- [ ] Row type fields confirmed parseable\n- [ ] Go/no-go decision on bridge approach documented' 2>/dev/null
echo "Task 1: $TASK1"
```

### Task 2: flowspec gate — Quint typecheck integration

```bash
TASK2=$(br create \
  --title="flowspec gate: add quint typecheck step" \
  --type=task \
  --priority=2 \
  -l "quint,flowspec,implement" \
  -d "WHAT: Add quint typecheck step to flowspec gate command

WHY: Type errors in .qnt specs currently reach infer/criterium at runtime. Gate must catch them at spec-time.

HOW: 1) Add gate config key quint_typecheck to flowspec_workflow.yml schema
2) In flowspec gate code: glob for .qnt files in search_path
3) Invoke quint typecheck per file; collect errors
4) Deduct 10 pts per error from gate score
5) Print [quint] typecheck: N files, M errors line in gate summary
6) Respect --skip-quint flag

Refs: docs/prd/quint-type-system-integration-spec.md, tools/ai-tools/flowspec/src/flowspec_cli/" \
  --silent 2>/dev/null)
br update "$TASK2" --acceptance-criteria $'- [ ] flowspec gate runs quint typecheck on .qnt files\n- [ ] Gate fails with clear error on type violation\n- [ ] --skip-quint flag bypasses check gracefully\n- [ ] Binary-not-found emits warning, not error\n- [ ] Gate output includes typecheck summary line' 2>/dev/null
echo "Task 2: $TASK2"
```

### Task 3: Quint → infer type bridge CLI

```bash
TASK3=$(br create \
  --title="quint-to-infer: row type → predicate bridge CLI" \
  --type=task \
  --priority=2 \
  -l "quint,infer,implement,bridge" \
  -d "WHAT: CLI tool that reads Quint typed IR JSON and emits infer predicate declarations

WHY: Spec authors shouldn't hand-write infer fact schemas — they duplicate and drift from the Quint spec. Bridge makes them derived artifacts.

HOW: 1) Read typed Quint IR JSON (from quint typecheck --output json)
2) Walk top-level var/val declarations with record types
3) Emit predicate(Arg1: Sort1, ...) per record field using type mapping table
4) Output to stdout (pipe to .infer file)
5) Implement as standalone Python script: tools/bridges/quint_to_infer.py

Refs: docs/prd/quint-type-system-integration-spec.md#type-mapping-table, docs/specs/quint-typed-ir-schema.md (from Task 1)" \
  --silent 2>/dev/null)
br update "$TASK3" --acceptance-criteria $'- [ ] Bridge reads Quint typed IR JSON\n- [ ] Record types emit correct infer predicates\n- [ ] All type mapping table entries handled\n- [ ] Invalid types emit warning and skip (not crash)\n- [ ] Integration test: records.qnt → expected predicates' 2>/dev/null
echo "Task 3: $TASK3"
```
<br>

**Created tasks:**

| ID | Title | Priority | Labels |
|----|-------|----------|--------|
| (see output) | Spike: verify quint typecheck JSON output | P1 | quint, spike, feasibility |
| (see output) | flowspec gate: add quint typecheck step | P2 | quint, flowspec, implement |
| (see output) | quint-to-infer: row type → predicate bridge CLI | P2 | quint, infer, implement, bridge |

---

## 7. Discovery and Validation Plan

**Hypothesis 1 (feasibility)**: `quint typecheck --output json` emits a typed IR
with row type fields accessible at the top level.
→ Validated by Task 1 spike. If false: use `quint typecheck` plain-text output
with regex parsing as fallback.

**Hypothesis 2 (value)**: At least one `.qnt` file exists in the active spec
pipeline (flowspec or reasoning repos).
→ Check: `find . -name "*.qnt" | grep -v node_modules`. If none found, defer
gate integration until Quint specs are written.

**Go/No-Go**: After Task 1 spike, if Quint typed IR is parseable → proceed with
Tasks 2 and 3. If not → fall back to regex-based type error extraction from
plain text output (acceptable for gate; not sufficient for bridge).

---

## 8. Acceptance Criteria (Feature-Level)

- [ ] `flowspec gate` invokes `quint typecheck` and fails on type errors
- [ ] Gate output includes a Quint typecheck summary line
- [ ] `quint-to-infer` bridge emits correct predicates for `records.qnt`
- [ ] Type mapping table fully implemented (int, str, bool, Set, List, record)
- [ ] `--skip-quint` flag works; missing binary degrades gracefully
- [ ] End-to-end test: `.qnt` with a type error blocks gate; fix → gate passes

---

## 9. Dependencies and Constraints

| Dependency | Status | Risk |
|-----------|--------|------|
| `quint` binary / npm package | Available in `tools/ai-tools/quint/` | Low — repo present |
| `quint typecheck --output json` flag | Unknown | **HIGH** — Task 1 validates this |
| `flowspec gate` plugin architecture | Exists (Python) | Low |
| `infer` predicate declaration format | Known from existing `.infer` files | Low |
| zz-notation type annotation spec | Not yet written | Deferred to follow-on |

**Constraints**:
- No new Rust crate dependencies (bridge is Python/script)
- Must not break existing gate for repos without `.qnt` files
- Quint binary version must be pinned to avoid upstream type system changes

---

## 10. Success Metrics

| Metric | Measurement | Target |
|--------|-------------|--------|
| **North Star**: type errors caught at gate | Count of type errors reaching infer runtime | 0 |
| Gate adoption | flowspec repos with quint_typecheck enabled | 3 within 1 sprint |
| Bridge accuracy | Predicates matching hand-written schemas | 100% on records.qnt test |
| Gate latency increase | Seconds added to gate by typecheck step | < 10s |

---

## All Needed Context

### Examples
- `tools/ai-tools/quint/examples/language-features/records.qnt` — row type definitions, the primary test case for the bridge (multi-field records, polymorphic `updateF1`)
- `tools/ai-tools/quint/quint/src/types/constraintGenerator.ts` — upstream type constraint generation (reference only)
- `tools/ai-tools/quint/quint/src/types/constraintSolver.ts` — upstream unification solver (reference only)
- `tools/ai-tools/quint/quint/src/types/inferrer.ts` — entry point for `quint typecheck` (reference only)

### External References
- Quint ADR005: `tools/ai-tools/quint/docs/content/docs/development-docs/architecture-decision-records/adr005-type-system.md`
- Apalache type system (basis): https://apalache-mc.org/docs/adr/002adr-types.html

### Gotchas
- Quint uses **row polymorphism** for records — `{ f1: int, f2: str }` is structurally typed, not nominally typed. The bridge must handle open row types (partial records) that appear as function parameters.
- `quint typecheck` may not have a `--output json` flag — Task 1 spike must verify. Fallback: parse plain-text error output.
- Quint's type variables are represented as `a`, `b`, etc. in error messages — translate these to human-readable names in gate output.

---

*Spec generated by /flow:specify workflow*
