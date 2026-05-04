# Reasoning Universe — Critical Vision & Architecture Assessment

**Date**: 2026-05-04
**Scope**: Full ecosystem review — reasoning-universe + epistemic-universe + infra + tools
**Purpose**: Establish solid mappings to known systems, identify gaps, validate coherence

---

## 1. The Ecosystem Map — What Each Project IS

### Layer 1: Reasoning Engines (the "what")

| Project | Identity | Closest Analog | What it DOES | What it does NOT do |
|---------|----------|----------------|-------------|---------------------|
| **infer** | Logic programming engine | **Prolog** (+ defeasible + abduction) | Horn clauses, 5 verbs (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR), unification, proof trees | No probability, no state, no truth values beyond True/False |
| **pctl-rs** | Probabilistic model checker | **PRISM** / Storm | DTMC/MDP/CTMC, reachability probabilities, Belnap 4/6-value composition | No logical rules, no deduction, no abduction |
| **zz-notation** | Epistemic specification language | **Alloy** meets **Dafny** (with Belnap) | Entities, states, facts with provenance, invariants, 4-valued truth, transitions, `old()` | No probabilistic reasoning, no data learning |
| **obstruct** | NP-complexity analysis DSL | **SageMath** for structural complexity | Constraint systems, treewidth, metrics, sweep experiments | Not a solver — analyzes WHY problems are hard |
| **craftegy-algo** | Algorithm substrate | **Boost.Graph** / petgraph (batteries) | Graph, sets, ordering, probability — pure algorithms, zero opinions | Not an engine — no rules, no reasoning, just computation |

### Layer 2: Epistemic Platform (the "why" + "who decides")

| Project | Identity | Closest Analog | What it DOES |
|---------|----------|----------------|-------------|
| **criterium** | Epistemic reasoning orchestrator | **No direct analog** — closest: scientific method as software | Abduction→Deduction→Induction loop, HITL gates, AssuranceLevel tracking, KnowledgeStore persistence |
| **FPF** | Problem-solving framework | **TRIZ** (structured inventive thinking) | Canonical reasoning cycle (abduce→deduce→induce), plausibility filters, AssuranceLevel, DVF+V |

### Layer 3: Infrastructure (the "how it runs")

| Project | Identity | Closest Analog | What it DOES |
|---------|----------|----------------|-------------|
| **rstmdb** | State machine database | **Event Store** + **Temporal.io durable state** | WAL, guards, WATCH daemon, state machines with transitions |
| **inferense** | Reasoning-as-a-Service | **Prolog-as-a-Service** (no real analog) | HTTP API wrapping infer engine |
| **invariantis** | Distributed proof ledger | **Certificate Transparency log** | Append-only Raft log for audit trails |
| **aivm** | Agent runtime | **Firecracker** for AI agents | WASM sandbox, capability-gated, message passing |
| **axiomvm** | Deterministic execution VM | **CKB-VM** / deterministic Lisp | Typed Lisp DSL, proof-carrying results, gas metering |

### Layer 4: Tools (the "how you build")

| Project | Identity | Closest Analog |
|---------|----------|----------------|
| **flowspec** | Dev workflow CLI | **Nx** / **Turborepo** (for spec-driven dev) |
| **haft** | Engineering governance | **OPA** (Open Policy Agent for eng practices) |
| **codegraph-rust** | Code knowledge graph | **Sourcegraph** (code intelligence) |
| **code-catalyst** | Code reasoning platform | **CodeScene** + logic (unique) |

---

## 2. The Unifying Principle

From `master-reasoning-algorithm-spec.md`:

```
Master Algorithm = MDL × Glushkov

min F(I) = Complexity(I) - Accuracy(I, O, K)
where I ∈ G (Glushkov algebra of composable inference steps)
```

### How each engine maps to the principle

| Engine | MDL role | Glushkov role | Tractable restriction |
|--------|----------|---------------|----------------------|
| **infer** (DEDUCE) | Shortest proof = simplest explanation | Rules compose via unification | O(n·k) per query |
| **infer** (ABDUCE/RSI) | Min-complexity hypothesis | Candidate search over Glushkov algebra | O(2^k) bounded |
| **pctl-rs** | Probability ≈ compression of evidence | DTMC composition via tensor product | O(n²·t) matrix iteration |
| **zz-notation** | Fact provenance = evidence compression | Facts compose via KnowledgeStore | O(n·k) per fact + Belnap |
| **criterium** | AssuranceLevel = progressive compression | Loop composes all three engines | Human-bounded |
| **obstruct** | Structural complexity IS the metric | Constraint composition | NP-analysis (meta-level) |

### Critical assessment: does the principle hold?

**Yes, but weakly.** MDL × Glushkov is a valid unifying lens, but:

1. **pctl-rs doesn't actually use MDL scoring today** — it has its own probability semantics
2. **ZZ doesn't compose via Glushkov** — it composes via KnowledgeStore (fact accumulation)
3. **criterium adds a dimension MDL doesn't cover** — human judgment (the criterion itself)
4. **obstruct is meta-level** — it analyzes complexity, doesn't perform reasoning

**Recommendation**: Keep MDL × Glushkov as the *theoretical north star* but don't force every component to implement it literally. The practical unifying layer is the **KnowledgeStore + AssuranceLevel pipeline**.

---

## 3. The Philosophy Map — Three Philosophers

From `ADR-THEORY-002-5verb-reasoning-framework.md`:

```
Spinoza → Deduction → DEDUCE        → infer
Peirce  → Abduction → ABDUCE        → criterium (HITL) + infer (RSI)
Hume    → Induction → DETECT/STRESS → pctl-rs + MONITOR
```

### Critical assessment: is this mapping honest?

| Claim | Verdict | Issue |
|-------|---------|-------|
| infer = Deduction (Spinoza) | **Solid** | infer IS a deductive engine; Horn clauses are classical deduction |
| criterium = Abduction (Peirce) | **Aspirational** | criterium is scaffolded but has no real abductive engine — today it's a state machine with hardcoded suggestions |
| pctl-rs = Induction (Hume) | **Stretched** | pctl-rs is probabilistic model checking, not inductive learning. DETECT/STRESS map better to *verification* than *induction* |

**Gap**: True induction (learning from data, updating beliefs) is missing. pctl-rs verifies models — it doesn't learn them. The ecosystem has no ML/statistical learning component.

**Options**:
- Accept that "induction" in this ecosystem means "probabilistic verification" (redefine)
- Add a real inductive component (Bayesian belief update, online learning)
- Let criterium's HITL BE the inductive component (human provides the "data" via domain knowledge)

**Recommendation**: Option 3 — the human IS the inductive engine. This is philosophically coherent with Peirce's pragmatism: knowledge is what survives the cycle of hypothesis → test → revision, and the human provides the empirical grounding. Document this explicitly.

---

## 4. Dependency Map — What Blocks What

```
                  craftegy-algo (pure algorithms)
                        │
            ┌───────────┼───────────────┐
            │           │               │
            ▼           ▼               ▼
        infer        pctl-rs        obstruct
     (deduction)   (probability)   (complexity)
            │           │
            ▼           │
       zz-notation      │
     (epistemic layer)  │
            │           │
     ┌──────▼───────────▼──────┐
     │   KnowledgeStore        │  ← ADR-002, TASK-16
     │   (shared memory)       │     THE critical path
     └──────────┬──────────────┘
                │
                ▼
           criterium
        (loop orchestrator)
                │
         ┌──────┼──────┐
         │      │      │
         ▼      ▼      ▼
     rstmdb  inferense  invariantis
  (persist) (API)      (audit)
```

### What's actually wired today vs. aspirational

| Connection | Status | Evidence |
|------------|--------|----------|
| infer → ZZ (deduction engine) | **Designed** | Architecture doc, TASK-5 spec, but no code |
| ZZ → KnowledgeStore | **Specified** | ADR-002 written, TASK-16 created, no code |
| KnowledgeStore → criterium | **Scaffolded** | criterium-kb crate exists, compiles, demo works |
| criterium → pctl-rs | **Issue only** | criterium #5, no code |
| craftegy-algo → anyone | **Not wired** | Standalone algorithms, no consumer yet |
| infer → rstmdb | **Merged** | PR #27 WATCH daemon, infer-rstmdb-bridge crate |
| infer → inferense | **Working** | HTTP API deployed |
| ZZ → Quint bridge | **PR open** | PR #13, type mapping |
| pctl-rs → ZZ (Belnap six) | **PRs open** | ZZ PR #14 + pctl-rs PR #24, same SixTruthValue |

---

## 5. Gaps and Honest Problems

### Gap 1: KnowledgeStore is the bottleneck and it doesn't exist yet

Everything converges on `zz-core::KnowledgeStore` (ADR-002), but `knowledge.rs` has zero lines of code. This blocks:
- TASK-5 (infer bridge)
- criterium-kb (epistemic platform)
- rstmdb persistence (v0.3)
- TASK-17 (strategy provenance)

**Severity**: Critical. This is a 1-session implementation task but it's been specified for 2 weeks without code.

### Gap 2: No real abduction engine

criterium's `select_hypothesis()` presents hardcoded suggestions. There's no algorithmic hypothesis generation — no constraint-based search, no analogy engine, no case-based reasoning. The FPF spec describes a rich abductive cycle, but criterium doesn't implement it.

**Severity**: Medium. HITL works without algorithmic abduction (humans generate hypotheses), but the platform's claim of "abduction as first-class" is aspirational.

### Gap 3: No inductive learning component

pctl-rs does probabilistic verification, not learning. The ecosystem can check whether a model satisfies a property but cannot update the model from new observations.

**Severity**: Low-medium. Acceptable if we explicitly define "induction = human-provided evidence + probabilistic verification." Problematic if we claim ML-style learning.

### Gap 4: craftegy-algo has no consumers

39 graph algorithms, fully tested, but nobody imports the crate. It should be wired into:
- infer (proof graph analysis)
- criterium (claim dependency graphs)
- code-catalyst (code architecture analysis)

**Severity**: Low. The algorithms are correct and ready. Wiring is mechanical.

### Gap 5: Two VMs (aivm + axiomvm) with unclear roles

Both provide sandboxed execution. aivm is WASM-based (general), axiomvm is Lisp-based (deterministic proofs). Their relationship to the reasoning pipeline is unclear.

**Severity**: Low. These are infrastructure pieces that become relevant at deployment scale, not at the current stage.

---

## 6. Recommendation: What to Build Next

### Priority 1: Close the KnowledgeStore gap (1 session)

Implement TASK-16. This unblocks everything. ADR-002 has the full spec — `FactEntry`, dual-index, `assert()` with Belnap conflict detection, `canonical()`, `to_infer_kb()`.

### Priority 2: Wire infer → ZZ (TASK-5, 1 session)

With KnowledgeStore done, the infer bridge is mechanical: entity flattening, query lowering, result wrapping. ADR-002 §6 has the contract.

### Priority 3: Wire criterium → infer + KnowledgeStore (1 session)

Replace criterium's demo stubs with real infer calls. criterium-deduce sends claims to `infer::Solver::ask()`, criterium-kb wraps `zz-core::KnowledgeStore`.

### Priority 4: Merge open PRs

- ZZ PR #14 (SixTruthValue)
- ZZ PR #13 (Quint bridge)
- pctl-rs PR #24 (Belnap six axiom tests)

### Priority 5: Document the honest mapping

Write a single `ARCHITECTURE.md` at the ecosystem root that states:
- What each project IS and IS NOT
- The philosophical mapping (with honest caveats)
- The dependency graph (what's wired vs. aspirational)
- The KnowledgeStore as the integration layer (not MDL × Glushkov)

---

## Assessment Score

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Complexity | 8/10 | 15+ repos, 3 languages, cross-repo dependencies |
| Risk | 4/10 | Internal system, no external users yet, all private |
| Architecture Impact | 9/10 | Defines the entire ecosystem coherence |
| **Total** | **21/30** | |

**Recommendation**: Full SDD — this is the foundational architecture of the entire ecosystem.

**Next command**: `/flow:specify reasoning-universe-architecture`

---

*Assessment generated by /flow:assess — ecosystem-level architectural review*
