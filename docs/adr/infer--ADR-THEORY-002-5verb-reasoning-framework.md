# ADR-THEORY-002: 5-Verb Reasoning Framework

## Status
Accepted

## Context

Infer has two first-class reasoning constructs (`ask`/`explain` for deduction, `retroduce` for abduction) and two manual patterns (negation-based gap detection, defeat-based sensitivity). A case study (Polymarket/IAF insider trading, March 2026) demonstrated all four techniques on one real case, revealing that the manual approaches require 50-80 lines of boilerplate each.

Additionally, drift detection (temporal comparison of KB states) is unsupported.

Philosophically, the five techniques map to the three classical modes of inference (Spinoza/deduction, Peirce/abduction, Hume/induction), forming a complete reasoning framework with zero teleology in the proof layer.

## Decision

Add three first-class language constructs to achieve 5/5 verb parity:

| # | Verb | Construct | Philosopher | Pillar |
|---|------|-----------|-------------|--------|
| 1 | DEDUCE | `ask`/`explain` (exists) | Spinoza | Deduction |
| 2 | ABDUCE | `retroduce` (exists) | Peirce | Abduction |
| 3 | DETECT | `gap_detect` (new) | Spinoza | Deduction |
| 4 | STRESS | `sensitivity` (new) | Spinoza | Deduction |
| 5 | MONITOR | `drift_detect` (new) | Hume | Induction |

All three new constructs follow the `retroduce` implementation pattern exactly: lexer token -> parser function -> AST node -> sema lowering -> solver method -> CLI formatter.

Key constraints:
- All outputs are structural facts ("3/8 missing", "X is load-bearing"), never value judgments
- Teleology belongs in the SYNTHERION layer (Aristotle), not in Infer's proof layer
- `retroduce` maps to **Peirce** (abduction), not Hume — Hume is reserved for `drift_detect` (induction)

## Consequences

### Positive
- Completes the three-pillar coverage: deduction (Spinoza), abduction (Peirce), induction (Hume)
- Reduces boilerplate: gap detection from 56 lines to ~8, sensitivity from 83 lines to ~8
- Validates against a real case study (Polymarket)
- Maintains clean separation: Infer = structural facts, SYNTHERION = value judgments

### Negative
- Three new constructs across 7 crates = ~6-9 days of implementation work
- New keywords (`gap_detect`, `sensitivity`, `drift_detect`, `expect`, `conclusion`, `vary`, `baseline`, `current`, `monitor`) expand the language surface

### Neutral
- `remove_fact()` must be added to `KnowledgeBase` (prerequisite for `sensitivity` and `drift_detect`)
- Existing manual patterns (`not`-based, `defeat`-based) continue to work — no breaking changes
