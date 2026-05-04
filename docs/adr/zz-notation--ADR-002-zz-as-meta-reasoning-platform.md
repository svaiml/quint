# ADR-002: ZZ as Meta-Reasoning Platform — Strategy Composition Architecture

## Status

Accepted

## Context

GitHub Issue #5 raises the open question: should ZZ pursue the "meta-reasoning platform" identity, where it hosts reasoning strategies (FPF, TRIZ, custom) as pluggable modules, composes their outputs through a fault-tolerant algorithm, resolves contradictions via Belnap Conflicted, and explains every conclusion through proof trees?

This decision is foundational. It determines:
- What ZZ *is* (a specification language vs. a meta-reasoning platform)
- How ZZ's v0.2 and v0.3 features are prioritised
- How ZZ positions itself relative to FPF, TRIZ, and adjacent tools
- What TASK-7 (ecosystem README), TASK-8 (comparison matrix), and TASK-11 (roadmap) say

### Research Inputs

Five assessments and two research reports inform this ADR:

| Input | Key Finding |
|-------|------------|
| TASK-13: Formal theory research | Recommended BGA (Bilattice-Grounded Argumentation) as minimal formal core |
| TASK-14: Business validation | Proceed with Caution — Phase A (bilattice layer) first, gate v0.3 on v0.1 adoption |
| GBLA assessment | GWTS algorithm solves ZZ's multi-strategy composition problem; now tractable, not aspirational |
| FPF/haft assessment | FPF is a trajectory-guiding oracle, not a state machine; haft materialises FPF in Go+SQLite |
| aivm assessment | host_call dispatch IS strategy dispatch; ZZ capability specs formalize aivm's informal caps.yaml |
| EML assessment | Fills ZZ's abductive gap via EML-based symbolic regression → hypothesis blocks |

### Current v0.1 State

ZZ v0.1 (TASK-1 through TASK-6, all Done) delivers:
- Full grammar (entities, states, facts, invariants, hypotheses, checks)
- ZzType system with TypeRegistry and TypeChecker
- KnowledgeStore with Belnap truth engine (FOUR2: True/False/Unknown/Conflicted)
- Evaluator producing spec §11 JSON output
- CLI: `zz run` and `zz check`

What v0.1 does **not** have:
- `strategy` block syntax
- Per-fact strategy provenance
- Multi-strategy composition
- GWTS fault-tolerant composition algorithm
- AAF (abstract argumentation) conflict resolution

### The Core Question

The issue asks five specific decisions:
1. **Direction**: Should ZZ pursue the meta-reasoning platform identity?
2. **Formal theory**: Is GWTS + Belnap sufficient, or do we need institution theory / fibred logics / AAF?
3. **Scope**: Which strategies built-in first?
4. **Phasing**: When does strategy composition enter? v0.3? v0.4?
5. **FPF relationship**: Engage Levenchuk/ailev or position independently?

---

## Decision 1: Platform Direction — Yes, ZZ is a Meta-Reasoning Platform

**Options considered:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Specification language only | ZZ stays a spec/verification tool (like TLA+, Alloy) | Focused, tractable, clear scope | Misses the genuine architectural gap ZZ already fills |
| B. Meta-reasoning platform (full) | ZZ hosts strategies, composes outputs, explains everything | Matches ZZ's actual capabilities; differentiating identity | Risk of over-promising before v0.3 ships |
| C. "Meta-reasoning ready" positioning | Commit to the direction without claiming full capability today | Honest about maturity; reserves the strategic position | Requires careful language to avoid over-promise |

**Decision**: **Option C, staged to B** — ZZ formally commits to the meta-reasoning platform identity today, with a phased capability rollout. Public claims are calibrated to what is shipped, not what is planned.

**Rationale**: ZZ's existing v0.1 capabilities (Belnap FOUR2, per-fact provenance, defeasible reasoning via infer-core defeat clauses) already constitute the truth substrate and conflict detection layer of a meta-reasoning platform. The strategy composition layer is a natural extension, not a pivot. Claiming Option A would abandon ZZ's genuine differentiator. Option B without phasing would over-promise to pre-v0.3 users. The "Meta-reasoning ready" framing positions ZZ honestly while reserving the architectural identity.

The meta-architecture that ZZ commits to:

```
┌─────────────────────────────────────────────────────┐
│                  ZZ NOTATION (meta-level)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Strategy │ │ Strategy │ │ Strategy │ │Strategy│ │
│  │   FPF    │ │  TRIZ    │ │  Custom  │ │  ...   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       ▼            ▼            ▼            ▼      │
│  ┌──────────────────────────────────────────────┐   │
│  │           ZZ Composition Engine               │   │
│  │  • Claims carry provenance (which strategy?)  │   │
│  │  • Conflicting claims → Belnap Conflicted     │   │
│  │  • Defeat clauses resolve conflicts            │   │
│  │  • Proof trees explain everything             │   │
│  └──────────────────────────────────────────────┘   │
│  infer-core (logic) + rstmdb (state) + pctl (time)  │
└─────────────────────────────────────────────────────┘
```

---

## Decision 2: Formal Foundation — BGA (Bilattice-Grounded Argumentation)

**Options considered:**

| Option | Description | Tractability | Formal Grounding |
|--------|-------------|-------------|-----------------|
| A. GWTS + Belnap alone | Composition algorithm + existing truth engine | High | Partial — does not address cross-strategy conflict resolution semantics |
| B. Institution Theory + Belnap | Category-theoretic logic composition | Very Low | Maximum — but requires Haskell-only Hets toolchain |
| C. Fibred Logics | Combine different logics by fibring semantics | Low | Medium — collapsing problem unsolved for defeasible logics |
| D. BGA = Bilattice + AAF + MDL | Product bilattice (Layer 1) + Abstract Argumentation Frameworks (Layer 2) + MDL scoring (Layer 3) | Medium | High — each layer has proven soundness, Rust tooling exists |
| E. BGA with GWTS composition | Option D + GWTS as the multi-strategy composition algorithm | Medium | Maximum tractable — GWTS is verified; BGA handles conflict resolution |

**Decision**: **Option E — BGA with GWTS composition**

The formal foundation is: **Bilattice-Grounded Argumentation over the GWTS algorithm**.

| Layer | Theory | What it does in ZZ | Tooling |
|-------|--------|-------------------|---------|
| Layer 1 | Product Bilattice (FOUR2 × FOUR2 × …) | Track per-strategy truth values; collapse via knowledge join | Extend zz-core/truth.rs |
| Layer 2 | Abstract Argumentation Frameworks (Dung 1995) | Resolve cross-strategy conflicts; map to existing defeat clauses | crustabri/Scalop Rust crate |
| Layer 3 | MDL scoring (Kolmogorov complexity) | Rank competing strategy outputs; already in retroduce | Extend infer-core retroduce |
| Composition | GWTS (GBLA algorithm) | Fault-tolerant multi-strategy lattice agreement | New pctl-compose crate |

**Rationale**:
- GWTS (from informalsystems/generalised-byzantine-lattice-agreement) is a verified algorithm for lattice agreement under Byzantine faults. It directly maps to ZZ's need: strategies as processes, fact sets as proposed values, Belnap knowledge order as the lattice order.
- BGA grounds every layer in proven mathematics. Institution Theory and Fibred Logics were rejected: Institution Theory requires category theory infrastructure with no practical Rust tooling; Fibred Logics has the collapsing problem for defeasible logics and zero practical implementations.
- GWTS moves multi-strategy composition from "novel semantics must be proven" to "adapt a verified algorithm to the Belnap lattice." Risk is engineering, not theoretical.

**Critical GWTS constraint — element-wise SAFE predicate**:

The GBLA assessment documents a critical bug in the GWTS algorithm's Algorithm 4:

```
// BUGGY (existential — catastrophic liveness failure):
SAFE(S, svs) ≡ ∃r. S ⊆ svs[r]

// CORRECT (element-wise — confirmed by TLC exhaustive verification):
SAFE(S, svs) ≡ ∀v ∈ S. ∃r. v ∈ svs[r]
```

ZZ's implementation MUST use the element-wise form. The existential form fails because it requires a single reasoning round to validate all proposed facts simultaneously — which is unachievable when strategies operate across different time windows. The element-wise form allows each fact to be validated by whichever strategy round covered it. This maps exactly to ZZ's actual need: facts from FPF and TRIZ may be validated in different rounds.

**Belnap lattice mapping for GWTS**:

```
lat_le(a, b)   → Belnap knowledge order:  a ⊑_k b
lat_join(a, b) → Belnap knowledge join:   a ∨_k b
proposed_set   → Set<BelnapFact>
decided_set    → ZZ's composed fact base after multi-strategy round
```

Never substitute truth-order `⊑_t` for knowledge-order `⊑_k` in this mapping. Belnap's knowledge order preserves information-theoretic monotonicity — the right property for accumulating multi-strategy evidence.

**Phased implementation** (per TASK-14 business validation):
- **v0.1 (Now)**: Basic FOUR2, no strategy layer. Ship and gather adoption signals.
- **v0.2**: Layer 1 only — product bilattice extension + per-fact strategy provenance. 2–3 weeks.
- **v0.3**: GWTS Quint spec + pctl-compose crate + full composition engine. 5–8 weeks. Gate on v0.1 adoption (>100 GitHub stars, >20 active users).

---

## Decision 3: Built-In Strategies — FPF and "Custom" First

**Options considered:**

| Option | Built-in strategies | Effort | Risk |
|--------|---------------------|--------|------|
| A. FPF only | FPF as the sole first-party strategy | Low | Dependence on one theory's adoption |
| B. FPF + TRIZ | Two domain theories as built-in | High | TRIZ formalisation is significant work; S-curve model is hard to specify |
| C. FPF + Custom | FPF + user-defined strategy blocks | Medium | Custom strategies are user responsibility; FPF provides the reference implementation |
| D. No built-in strategies, only custom | Pure extensibility, no first-party strategies | Low | No reference strategy; adoption story is abstract |

**Decision**: **Option C — FPF (as trajectory oracle) + Custom strategy blocks**

**Rationale**:
- FPF is the highest-value first built-in strategy: it has a live spec (ailev/FPF), a Claude-compatible skill implementation (fpf-problem-solving-skill), and an active resurrection (haft/quint-code). The ecosystem connection is real and documented.
- TRIZ formalisation is deferred: TRIZ's inventive principles and S-curve model require significant ontological work. TRIZ enters as a custom strategy in v0.3 examples before considering a first-party implementation.
- Custom strategy blocks are the extensibility primitive that makes ZZ genuinely a platform.

**FPF modelling constraint**: ZZ models FPF as a **strategy oracle** — non-deterministic, trajectory-shaping. It is NOT modelled as a state machine. The ADI cycle (Abduction → Deduction → Induction) that haft implements IS a state machine — but that is haft's interpretation of FPF, not FPF itself. ZZ's `strategy FPF {}` block represents FPF's F-G-R model, holonic decomposition, and trust calculus as configuration, not as a sequential execution FSM.

**Proposed `strategy` block syntax for v0.2 lexer/parser** (minimal, parseable):

```zz
strategy FPF {
  trust_model: F_G_R
  composition: holonic
  types: kind_bridged
}

strategy TRIZ {
  contradiction_model: inventive_principles
  evolution: s_curve
  ideal: IFR
}

strategy CustomComplianceCheck {
  framework: SOC2_TYPE2
  coverage: all_controls
}

domain ComplianceAudit {
  use FPF for trust_assessment
  use CustomComplianceCheck for control_verification

  invariant all_risks_covered {
    forall r in risks:
      exists s in strategies: s.covers(r)
  }
}
```

The grammar rule for the strategy block (addition to ZZ's EBNF):

```
StrategyDecl    ::= 'strategy' IDENT '{' StrategyField* '}'
StrategyField   ::= IDENT ':' StrategyValue
StrategyValue   ::= IDENT | StringLit | NumberLit
DomainDecl      ::= 'domain' IDENT '{' DomainItem* '}'
DomainItem      ::= UseClause | InvariantDecl | FactDecl | HypothesisDecl
UseClause       ::= 'use' IDENT 'for' IDENT
```

This syntax is intentionally minimal for v0.2. Strategy fields are uninterpreted key-value pairs in the parser — interpretation is the evaluator's responsibility in v0.3+.

---

## Decision 4: Phasing — v0.2 Syntax, v0.3 Composition, v0.4 FPF Built-In

**Options considered:**

| Option | Phase strategy composition into |
|--------|--------------------------------|
| A. v0.2 (immediately) | Too fast — GWTS Quint spec must be verified first |
| B. v0.3 (next milestone) | Right — builds on v0.2 provenance layer |
| C. v0.4 (after FPF built-in) | Too slow — delays the central differentiator |
| D. No explicit version gating | Anti-pattern — unclear delivery expectations |

**Decision**: **Option B with staged gate**

Milestone map:

| Version | Theme | Strategy Composition Deliverable | Gate Criterion |
|---------|-------|----------------------------------|---------------|
| v0.1 | Foundation | None — Belnap FOUR2, KnowledgeStore, CLI | §17 example produces correct JSON |
| v0.2 | Syntax + Provenance | `strategy` block parses; per-fact `strategy_source` in KnowledgeStore | All TASK-16 and TASK-17 ACs pass |
| v0.3 | Composition Engine | GWTS Quint spec TLC-verified; pctl-compose crate; product bilattice | TLC exhausts GWTS Belnap spec; compliance_audit.zz example works |
| v0.4 | FPF Built-In | FPF strategy as first-party module; F-G-R trust calculus in ZZ | Worked FPF+custom multi-strategy example with conflict resolution |
| v1.0 | Production | Full multi-strategy composition; EML abduction integration; GWTS fault-tolerant quorum | 1000 GitHub stars, 50+ active users, stability guarantee |

**Business gate on v0.3** (per TASK-14 validation): do not invest 5–8 weeks in GWTS implementation until v0.1 produces adoption signals (>100 stars or >20 active users or >3 external citations). If adoption is too slow, reprioritise v0.3 to focus on language ergonomics over composition engine.

---

## Decision 5: FPF Engagement — Position Collaboratively, Not Competitively

**Options considered:**

| Option | Stance | Risk |
|--------|--------|------|
| A. Independent positioning | ZZ stands alone, FPF is one of many strategies | Misses the strongest ecosystem connection |
| B. Tight coupling | Co-develop ZZ + FPF spec jointly with Levenchuk/ailev | Dependency risk; governance complexity |
| C. Collaborative positioning | Acknowledge FPF as the reference strategy; engage Levenchuk to validate the FPF oracle model | Balanced — respects IP, builds trust |
| D. Wait for haft to stabilise | Observe quint-code resurrection before engaging | Safe but misses the window |

**Decision**: **Option C — Collaborative positioning**

**Rationale**: Levenchuk's live correction on stream ("FPF is NOT a state machine") shows active engagement with ecosystem users who are reasoning about FPF. ZZ's FPF oracle model (non-deterministic, trajectory-shaping) aligns with this correction. The engagement action is:
1. Reference ailev/FPF in ADR and documentation as the canonical source
2. Reach out to Levenchuk to validate ZZ's FPF oracle model against the spec (email or GitHub issue on ailev/FPF)
3. When haft/quint-code stabilises, offer ZZ as the formal spec layer over haft's SQLite governance — complementary, not competitive

ZZ does NOT compete with FPF. ZZ HOSTS FPF as a reasoning strategy and provides the formal infrastructure that FPF theory assumes but does not implement (Belnap truth substrate, provenance tracking, GWTS composition).

---

## Consequences

### Positive

- **ZZ has a clear identity**: meta-reasoning platform, not a specification language. This directly answers TASK-7 (README), TASK-8 (matrix), TASK-11 (roadmap).
- **GWTS reduces research risk**: multi-strategy composition is no longer novel formal semantics — it is adapting a TLC-verified algorithm to the Belnap lattice. Engineering risk replaces research risk.
- **FPF collaboration opens an ecosystem connection**: haft, fpf-problem-solving-skill, and ailev/FPF are active projects. ZZ can be the formal substrate for a resurgent FPF ecosystem.
- **BGA is implementable in phases**: Layer 1 (product bilattice) is 2–3 weeks, immediately actionable. Layers 2–3 are phased behind adoption gates.
- **aivm integration path is clear**: aivm's `host_call` dispatch IS strategy dispatch; ZZ's capability invariants formalize aivm's informal caps.yaml.

### Negative

- **v0.3 complexity is high**: GWTS Quint spec + pctl-compose crate is 5–8 weeks of focused engineering. If adoption does not materialize post-v0.1, this investment may be premature.
- **TRIZ is deferred**: TRIZ as a built-in strategy requires significant ontological work. v0.3 and v0.4 include TRIZ as custom strategy examples only.
- **FPF engagement dependency**: if Levenchuk/ailev does not respond to outreach, ZZ must proceed with an unvalidated oracle model.

### Neutral

- The ecosystem layer separation is unchanged: ZZ specifies, aivm executes, rstmdb stores, invariantis replicates, axiomvm computes.
- The GWTS SAFE predicate bug is a hard constraint, not a design choice. The element-wise form is the only correct implementation.

---

## Implementation Tasks Created by This ADR

| Task | Title | Version |
|------|-------|---------|
| TASK-16 | Implement ZZ strategy block syntax (v0.2 lexer+parser) | v0.2 |
| TASK-17 | Extend KnowledgeStore with per-fact strategy provenance | v0.2 |
| TASK-18 | Write Quint spec for GWTS over Belnap lattice | v0.3 |
| TASK-19 | Implement product bilattice extension in zz-core truth engine | v0.3 |
| TASK-20 | Write ecosystem overview README (unblocked by this ADR) | v0.1 docs |
| TASK-21 | Write ZZ row for competitive comparison matrix | v0.1 docs |
| TASK-22 | Write feature roadmap with strategy composition milestones | v0.1 docs |
| TASK-23 | Create strategy composition worked example: compliance audit | v0.3 |

---

## Unblocked Tasks

This ADR unblocks:
- **TASK-7** (ecosystem README): Use this ADR's meta-architecture diagram and identity statement.
- **TASK-8** (comparison matrix): ZZ's "row" is now defined — TASK-21 produces the capability profile.
- **TASK-11** (roadmap): TASK-22 implements the roadmap based on this milestone map.

---

## References

- [GBLA Assessment](../assess/gbla-byzantine-lattice-agreement-assessment.md) — GWTS algorithm, element-wise SAFE predicate, Belnap lattice mapping
- [FPF/haft Assessment](../assess/fpf-haft-ecosystem-assessment.md) — FPF oracle model, haft resurrection, engagement strategy
- [aivm Assessment](../assess/aivm-wasm-agent-runtime-assessment.md) — host_call as strategy dispatch, ZZ capability formalization
- [EML Assessment](../assess/eml-universal-primitive-assessment.md) — abductive gap, EML-SR as hypothesis generator
- [Formal Theory Research (TASK-13)](../research/zz-meta-formal-theory-research.md) — BGA recommendation with full theory analysis
- [Business Validation (TASK-14)](../research/zz-meta-formal-theory-validation.md) — Proceed with Caution, phased gates
- [ZZ Architecture v2](../architecture.md) — dual-layer architecture, ecosystem position
- [ADR-001](./ADR-001-positioning-document-architecture.md) — positioning document architecture
- [ZZ Spec §15](../spec/) — EBNF grammar for parser extensions
- informalsystems/generalised-byzantine-lattice-agreement — GWTS Quint specs (gwts_lattice_agreement.qnt, gwts_correct_safe_alg4_tlc.qnt)
- crustabri/Scalop — Rust crate for Abstract Argumentation Frameworks
- ailev/FPF — Canonical FPF specification
- Dung (1995), "On the Acceptability of Arguments and Its Fundamental Role in Nonmonotonic Reasoning" — AAF foundation
- Fitting (1991), "Bilattices and the Semantics of Logic Programming" — bilattice theory foundation

---

*This ADR follows the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).*

*Produced by @pm-planner in response to GitHub Issue #5, 2026-04-15.*
