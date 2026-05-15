# Typed Linkage Across the Requirements-to-Code Chain — Formal Theories

> **Context**: ZomboCraftEco RM stack positioning — do we have the theory and tools to formally link doc→reqs→design→tasks→code with no contradictions?
> **Question**: Which formal theories prove this chain? What does ZomboCraftEco have vs what is missing?
> **Last updated**: 2026-05-06
> **br task**: docs-o0fv

---

## Short Answer

Four real theories address this. Two are too heavy to implement without dependent types. One gives coverage but not correctness. One we already have.

```
THEORY                      WHAT IT PROVES            WE HAVE IT?
────────────────────────────────────────────────────────────────────
Refinement Calculus         Full chain, no gaps        ❌ not built
(Back & von Wright, 1998)   Code ⊑ Spec, transitive

Curry-Howard                Code IS a proof of spec    ⚠️ axiomvm only
(1969)                      Compiles = satisfies       (isolated Lisp VM)

Traceability + Graph        Coverage only              ✅ file-level
(IEEE 830)                  Not correctness            (contextflow-forge)

Belnap 4-Valued Logic       Contradiction detection    ✅ BUILT
(1977)                      Conflicted ≠ error         (ZZ KnowledgeStore)
────────────────────────────────────────────────────────────────────

PRACTICAL PATH (no Lean/Idris required):
  contextflow-forge  →  entity-level typed links   (Theory 3, upgraded)
  ZZ KnowledgeStore  →  Belnap contradiction scan  (Theory 4, built)
  infer              →  typed relation rules        (bridge, needs wiring)
  codegraph-rust     →  symbol auto-discovery       (Theory 3 auto)
  criterium          →  HITL contradiction resolution
```

---

## The Four Theories — Honest Assessment

### Theory 1: Refinement Calculus (Back & von Wright, 1998)

**What it proves**: The ONLY theory that formally proves the full chain end-to-end.

```
Spec (abstract) ──refines──► Design ──refines──► Code (concrete)
```

If `C ⊑ S` (C refines S), then every behavior of C is a behavior allowed by S. Refinement is **transitive and compositional**: if Design refines Spec, and Code refines Design, then Code refines Spec — no contradictions possible anywhere in the chain.

**Industrial implementations**:

| Tool | Used for | Adoption |
|------|----------|----------|
| Event-B / Rodin | Safety-critical systems | Paris Metro Line 14 (driverless) |
| Atelier B | Railway signaling | French national rail (SNCF) |
| ASM (Abstract State Machines) | Protocol verification | Microsoft Spec Explorer |
| TLA+ | Distributed systems | AWS (S3, DynamoDB, EBS) |

**What ZomboCraftEco has**: Nothing. `infer` does deductive reasoning (Horn clause derivation), not refinement. ZZ does epistemic state, not behavioral refinement. RSTMDB tracks state transitions, not spec-to-code refinement steps.

**Verdict**: THE correct formal theory. Too heavy to retrofit onto an existing codebase. The right path is to study it as the theoretical foundation for what we're building toward, not to implement a full refinement checker.

---

### Theory 2: Curry-Howard Correspondence (1969)

**What it proves**: A requirement is a type. An implementation is a proof term inhabiting that type. Compilation = verification.

```
Requirement: "server returns 200 on health check"
Type:        fn health_check() -> HttpResponse<200>
Code:        fn health_check() -> HttpResponse<200> { Ok(()) }
Proof:       code compiles → requirement is satisfied
```

Under dependent types (Idris, Agda, Lean 4), you can express the *full* requirement as a type:
```idris
health_check : (req : Requirement "server returns 200") -> Proof req
```
This makes requirements mechanically checkable — not by tests but by the type checker.

**Industrial implementations**: Lean 4 (used by Microsoft Research, Fields Medalists for mathematics), Coq (CompCert C compiler — proven correct), Idris (practical dependent types).

**What ZomboCraftEco has**: `axiomvm` produces proof-carrying execution traces for its own Lisp DSL programs. It cannot type-check arbitrary Rust/TypeScript code. ZZ has a type system but not dependent types. `infer` programs are Horn clause derivations — a restricted form of constructive proof, but not Curry-Howard in the full sense.

**Partial realization**: Rust's ownership/lifetime types partially implement this for memory safety. ZZ's `TruthValue` propagation through `infer::DEDUCE` is a restricted Curry-Howard instance (each derivation step is a typed inference).

**Verdict**: Theoretically perfect. Requires dependent types for full realization. Achievable incrementally: Rust's type system gets us partial guarantees today; wiring `infer` to ZZ (TASK-5, `docs-4gko`) moves us further along the spectrum.

---

### Theory 3: Traceability + Graph Consistency (IEEE 830 / IEEE 29148)

**What it proves**: Coverage — that every requirement has a corresponding design element, code artifact, and test. Does **not** prove correctness of implementation.

```
Requirement R1 ──traced──► Design D1 ──traced──► Code C1 ──traced──► Test T1
```

If every requirement traces to a passing test, the system is claimed to satisfy requirements. The problem: 100% traceability coverage is compatible with contradictory requirements (`R1: tls=true`, `R2: tls=false`).

**What ZomboCraftEco has**:
- `contextflow-forge` `#[[file:path/to/file|Label]]` links — file-level traceability, manually placed, typed by link type (document/xml_context/prompt_template/agentic_reference)
- `beads_viewer` — task-level graph (PageRank, betweenness, critical path) with triage
- Neither detects inter-requirement contradictions

**The upgrade needed** (entity-level typed links):

```
CURRENT (file-level):
  spec.md ──#[[file:validator.ts]]──► validator.ts

NEEDED (entity-level, typed relations):
  requirement(AC-3, "all servers must have TLS enabled")
    ──implements──►   code(validator.ts::check_tls)
    ──tested_by──►    test(test_tls.rs::test_all_tls)
    ──decided_by──►   adr(ADR-002::decision-3)
    ──constrained_by──► requirement(AC-7, "TLS v1.3 minimum")
    ──contradicts──►  requirement(AC-12, "TLS optional for internal services")
```

Each relation is **typed**: `implements`, `tested_by`, `decided_by`, `constrained_by`, `contradicts`. The `contradicts` relation is derived, not manually placed — it emerges from Belnap conflict detection.

**Verdict**: Necessary foundation. Insufficient alone. Upgrade path: entity-level links (contextflow-forge) + auto-discovery (codegraph-rust) + contradiction derivation (infer + ZZ).

---

### Theory 4: Belnap's 4-Valued Logic for Contradiction Detection (1977)

**What it proves**: Contradictions in requirements are **detectable and representable** without collapsing the specification. A requirement set where R1 says `tls=true` and R2 says `tls=false` does not explode — it enters the `Conflicted` truth state, which is valid epistemic information.

```
R1: server.tls = true     → KnowledgeStore: (server, tls, True,  confidence=0.9)
R2: server.tls = false    → KnowledgeStore: (server, tls, False, confidence=0.8)
                          → assert_fact() detects conflict
                          → (server, tls) truth value → Conflicted
                          → has_conflicts() = true
                          → criterium HITL: "Contradiction found in TLS requirement — resolve"
```

**What ZomboCraftEco has**: ZZ `KnowledgeStore` v0.2 — **built and working**:
- `assert_fact(entity, field, value, confidence)` — inserts fact, detects conflicts
- `canonical(entity, field)` — returns highest-confidence resolution of conflicting facts
- `has_conflicts()` / `conflicts()` — reports all contradictions
- `SixTruthValue` — extended bilattice with degrees between truth values

**The bilattice structure**:
```
        True
         │
    ─────┼─────
   /     │     \
Unknown  │  Conflicted
   \     │     /
    ─────┼─────
         │
       False
```
UNKNOWN = not yet gathered. CONFLICTED = contradicting sources. Both are valid requirement states, not errors.

**Verdict**: WE HAVE THIS. It is our strongest unique capability in the RM space. No competitor (Spec Kit, GSD-2, Kiro, DOORS, Jama) detects inter-requirement contradictions via formal logic. This is the gap in Theory 3.

---

## The Full Chain: What Exists vs What's Missing

```
doc ──► biz reqs ──► design ──► tasks ──► code
 │          │            │          │         │
 ▼          ▼            ▼          ▼         ▼
NEED:   Refinement   Refinement   Task     Type
        Calculus     Calculus     dep      checking
        (abstract→   (design→     order    (code
        concrete)    concrete)             satisfies
                                           spec)

HAVE:   contextflow  ZZ +         beads    cargo test
        -forge       infer         br/bv    + ZZ
        #[[file:]]   rules         graph    invariants
        links        (deduction)   triage

MISS:   Refinement   entity-level  req→     Dependent
        proof chain  links         code     types or
        (formal)     + auto-disc.  trace    refinement
                     (codegraph)           proofs
```

**Status of each gap**:

| Gap | Effort | Blocker |
|-----|--------|---------|
| Refinement proof chain | High — requires Event-B-style tooling | Not YAGNI today; study first |
| Entity-level links | Medium — upgrade contextflow-forge | codegraph-rust symbol extraction |
| Auto-discovery (codegraph→infer) | Medium — pipeline work | TASK-5 (infer↔ZZ bridge, `docs-4gko`) |
| Dependent types | High — requires Lean 4 bindings | 2027+ horizon |

---

## The Practical Implementation: infer as the Typed Relation Engine

The chain becomes an **infer program** — this is the concrete target:

```prolog
# Facts: requirements (loaded from contextflow-forge / flowspec specs)
requirement(ac3, "all servers must have TLS enabled").
requirement(ac7, "TLS version must be 1.3 or higher").
requirement(ac12, "TLS is optional for internal services").
requirement_field(ac3, server_tls, true).
requirement_field(ac12, server_tls, false).

# Facts: code symbols (loaded from codegraph-rust)
code_symbol(check_tls, "validator.ts::check_tls").
code_symbol(skip_tls, "internal_server.ts::skip_tls_check").

# Rules: typed traceability relations
relation implements(Requirement, CodeSymbol).
relation tested_by(Requirement, TestFunction).
relation contradicts(Requirement, Requirement).

# Rule: contradiction detection
rule contradicts(R1, R2) if
  requirement_field(R1, Field, V1)
  requirement_field(R2, Field, V2)
  V1 != V2.

# Query: find all contradictions
ask contradicts(X, Y).
# → contradicts(ac3, ac12)  [both assert server_tls with different values]
```

Running this query:
1. Finds `ac3` (tls=true) and `ac12` (tls=false) contradict on `server_tls`
2. ZZ KnowledgeStore marks `(server, server_tls)` as `Conflicted`
3. criterium surfaces to human: "ac3 and ac12 conflict — which requirement wins?"
4. Human resolves → winning requirement gets `True`, losing gets `False` or is deprecated

---

## Refinement Calculus as the Long-Term Foundation

The practical path (Belnap + infer) detects contradictions but does not **prove** the chain is correct. Refinement Calculus is the theory that bridges this gap.

**The key insight from Event-B**: refinement is incremental. You don't write the full formal proof upfront. You start with an abstract spec (machine), add concrete implementation detail step by step, and prove each step refines the previous. This maps to:

```
flowspec /flow:specify  →  Abstract machine (requirements as invariants)
flowspec /flow:plan     →  First refinement (design decisions narrow implementation space)
flowspec /flow:implement→  Second refinement (code satisfies design)
flowspec /flow:validate →  Proof obligation discharge (tests = partial proof)
```

The gap: our refinement steps are markdown documents and beads tasks, not formal machines. ZZ invariants (`assert field = value`) are **proof obligations** in the Event-B sense — they just aren't discharged by a formal checker, only by `cargo test` + ZZ runtime checks.

**Next step toward Refinement Calculus** (not full Event-B, but directionally correct):
- Define requirements as ZZ invariants, not prose
- Define design decisions as ZZ invariant refinements (more specific constraints)
- infer DETECT checks that each refinement step doesn't violate the abstract spec
- This gives us a "soft" refinement chain without full formal verification overhead

---

## Recommendation

**Implement the practical hybrid**: Theory 3 (entity-level traceability) + Theory 4 (Belnap contradiction detection), using infer as the typed relation engine. Study Refinement Calculus as the theoretical foundation for where this leads.

**Priority sequence**:

| Step | Task | Why first |
|------|------|-----------|
| 0 | `docs-nwf2` — fix bilattice bug | Wrong `or(Unknown, Conflicted)` contaminates all conflict detection |
| 1 | `docs-4gko` — wire TASK-5 (infer ↔ ZZ) | Without this, ZZ facts cannot participate in infer derivations |
| 2 | `docs-o0fv-a` — define typed relation schema in infer | `implements`, `tested_by`, `contradicts` rules — the core typed linkage model |
| 3 | `docs-o0fv-b` — entity-level links in contextflow-forge | Upgrade from file-level to req-AC → code-symbol links |
| 4 | `docs-o0fv-c` — codegraph→infer pipeline | Auto-discover code symbols, feed as infer facts |
| 5 | Study Event-B / Refinement Calculus | Understand the theory before designing the next layer |

**What this gives**:
- ✅ Contradiction detection across the full requirement set (Belnap)
- ✅ Typed traceability: which function implements which acceptance criterion
- ✅ Drift detection: Spiral Governor catches naming divergence
- ✅ HITL resolution: criterium surfaces contradictions for human decision
- ❌ NOT: proof that code correctly implements spec (requires refinement or dependent types)

**The honest bound**: we can prove "no contradictions were detected" and "every requirement traces to code." We cannot yet prove "this code satisfies this requirement." That requires refinement calculus or dependent types — a 2027+ horizon.

---

## Follow-up Tasks

- `docs-o0fv-a` — Define infer typed relation schema: `implements`, `tested_by`, `contradicts` rules
- `docs-o0fv-b` — Upgrade contextflow-forge from file-level to entity-level typed links (req-AC → code-symbol)
- `docs-o0fv-c` — Build codegraph→infer pipeline: auto-extract code symbols as infer facts
- `docs-nwf2` — Fix bilattice bug (blocker for everything above)
- `docs-4gko` — Wire TASK-5: infer ↔ ZZ bridge

---

## Sources

- Back, R.J. & von Wright, J. (1998). *Refinement Calculus: A Systematic Introduction*. Springer. ISBN 978-0-387-98417-9.
- Howard, W.A. (1980). "The formulae-as-types notion of construction." In Seldin & Hindley (eds.), *To H.B. Curry: Essays on Combinatory Logic*. Academic Press. (Original manuscript 1969.)
- Curry, H.B. & Feys, R. (1958). *Combinatory Logic, Vol. I*. North-Holland.
- Belnap, N. (1977). "A Useful Four-Valued Logic." In Epstein & Dunn (eds.), *Modern Uses of Multiple-Valued Logic*. Springer. DOI:10.1007/978-94-010-1161-7_2
- Abrial, J-R. (2010). *Modeling in Event-B: System and Software Engineering*. Cambridge University Press. (Event-B / Rodin platform)
- Lamport, L. (2002). *Specifying Systems: The TLA+ Language and Tools for Hardware and Software Engineers*. Addison-Wesley.
- Leino, K.R.M. (2010). "Dafny: An Automatic Program Verifier for Functional Correctness." LPAR-16. (Dafny as practical Curry-Howard for industry)
- Ferrari, A. & Spoletini, P. (2025). "Formal requirements engineering and large language models: A two-way roadmap." *Information and Software Technology*. DOI:10.1016/j.infsof.2025.107697
- IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering.
- ZomboCraftEco internal: `zz-notation` (TruthValue, SixTruthValue, KnowledgeStore v0.2), `infer` (5-verb Horn clause engine), `contextflow-forge` (#[[file:...]] typed links, AllBeads adapter)
- Contextflow-forge session analysis (2026-05-06): honest assessment of Spiral Governor, typed link model, and the Theory 3 + Theory 4 practical path.
