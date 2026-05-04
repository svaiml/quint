# PRD: FPF v7.0 Keyword Integration into Reasoning Stack

**Date**: 2026-05-02
**Assessment**: docs/assess/fpf-v7-keyword-integration-assessment.md (13.0/30, Spec-Light)
**Mode**: Spec-Light

## 1. Executive Summary

FPF-Spec.md v7.0 introduced 6 new formal patterns (+7,978 lines). Three are directly actionable for our reasoning stack:

1. **Temporal Claim Adequacy (C.27)** — state vs rate vs intervention-sensitive claims
2. **Controlled Semantic Coarsening (A.6.3.CSC)** — disciplined weakening with reopen triggers
3. **Discoverability + Recognizability (E.11/A.6.RSIG)** — pattern-entry discipline

The remaining three (Quantum-Like Lens, DRR, ExplanationFaithfulnessProfile) are theoretical enrichments — track but don't implement now.

**Assessment scores**: Complexity 4.3, Risk 1.7, Architecture Impact 5.0. Total 13.0/30.

## 2. User Stories

**US-1**: As a reasoning-apps developer, I need `temporal_claim` predicates in infer so I can classify Polymarket signals as state readings ("BTC is at $X"), rate readings ("BTC is trending up"), or intervention-sensitive changes ("Fed rate cut moved BTC"), preventing false confidence from conflating these types.

**US-2**: As a ctop user, I need my token-pruned context formally described as a CSC card (stronger source, weaker rendering, supported use, reopen trigger) so the LLM knows exactly what was omitted and when to request the full context.

**US-3**: As a flowspec user running `/flow:assess`, I need the assessment gate to follow E.11 "first honest burden" discipline — routing me to the right workflow entry without tempting me into the wrong pattern.

## 3. DVF+V Risk

| Risk | Level | Mitigation |
|------|-------|-----------|
| **Value** | Low | Directly enriches existing stack — no adoption question |
| **Usability** | Low | Developer-facing predicates, not end-user UI |
| **Feasibility** | Medium | QL probe semantics are novel — defer to backlog |
| **Viability** | Low | Internal tooling, zero cost |

## 4. Functional Requirements

### FR-1: infer `temporal_claim` predicate type

Add a new predicate category to infer-core that classifies evidence along C.27 dimensions:

```
temporal_claim(Evidence, Type) where Type in {state, rate, intervention_sensitive}
temporal_claim_adequate(Claim, Window, Type)
```

**Integration point**: `reasoning-universe/infer/crates/infer-core/src/knowledge.rs` — extend `Fact` enum.

**Example**: In `examples/47_polymarket_probabilistic.infer`:
```
% Current: "BTC above 100k" is treated as a single fact
% After: classify temporal dimension
temporal_claim(btc_price_now, state).
temporal_claim(btc_trend_weekly, rate).
temporal_claim(fed_rate_impact, intervention_sensitive).
```

### FR-2: ctop MSC → CSC card output

When ctop prunes context to Minimum Sufficient Context, emit a CSC metadata header:

```
# CSC Card
# Stronger source: full component tree (247 nodes)
# Weaker rendering: pruned context (31 nodes)
# Supported use: LLM prompt for single-component edit
# Unsupported use: cross-component refactoring, dependency analysis
# Reopen trigger: if LLM requests imports, types, or callers not in context
```

**Integration point**: `infra-eco/ctop/src/` — add CSC card to pruned output.

### FR-3: fpf-problem-solving-skill v7.0 alignment

Update the skill router keywords to include new E.11 entry points and A.6.RSIG description-recognition cues:

- Add C.27 temporal claim triggers: "speed", "trend", "rate", "improving", "acceleration"
- Add CSC triggers: "summary", "simplified", "reduced", "pruned", "coarsened"
- Add E.11 discoverability triggers: "which pattern", "where do I start", "first step"

**Integration point**: `tools/ai-tools/fpf-problem-solving-skill/SKILL.md`

## 5. Task Breakdown

| ID | Task | Epic | Priority | Labels |
|----|------|------|----------|--------|
| `zse-3q6` | infer: add temporal_claim predicate type (FPF C.27) | zse-y0u (infer) | P2 | infer,fpf,implement |
| `zse-5nr` | ctop: emit CSC card metadata on pruned context (FPF A.6.3.CSC) | zse-gh7 (prodx) | P3 | ctop,fpf,implement |
| `zse-g9q` | fpf-problem-solving-skill: update router for v7.0 keywords | zse-8wr (flowspec) | P2 | fpf,flowspec,implement |

**Dependency order**: zse-g9q (skill router) is independent. zse-3q6 (temporal_claim) is independent. zse-5nr (CSC card) is independent. All three can be parallelized.

## 6. Deferred (Backlog)

These FPF v7.0 patterns are tracked but not scheduled:

| Pattern | Why Deferred | When to Revisit |
|---------|-------------|-----------------|
| Quantum-Like Lens (C.26) | Novel probe-order semantics; needs research spike | When zz-notation positioning architecture is stable |
| DRR (E.9) | ADR template alignment — low urgency | Next flowspec template upgrade |
| ExplanationFaithfulnessProfile (E.17.EFP) | Catalyst legal reasoning needs this; defer to catalyst sprint | When catalyst moves to active development |

## 7. Success Metrics

- `temporal_claim` predicates used in ≥1 Polymarket example program
- CSC card emitted on every ctop pruned output
- fpf-problem-solving-skill routes C.27/CSC/E.11 queries correctly (test with haft v7.0 index)

---

*Spec-Light generated by /flow:specify. Assessment: 13.0/30.*