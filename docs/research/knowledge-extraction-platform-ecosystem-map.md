---
target_peer: zombocraft
---

# Knowledge Extraction & Distribution Platform — Ecosystem Map

> **Date**: 2026-05-05 | **Task**: docs-ui11 | **Status**: Complete
> **Refs**: reasoning-apps#24 (infer-knowledge), criterium ADR-001, infer ADR-THEORY-002, pctl-rs pPCTL ADR

---

## Verdict

**Go — the platform exists in pieces. Three missing bridges make it complete.**

The vision is sound: scan any domain corpus → extract business rules inductively → validate
deductively → curate (HITL) → package as Knowledge Model → distribute. ZomboCraftEco already
covers stages 3-6. Stages 1-2 (Corpus Scanner, Task Planner) and the final packaging artifact
(Knowledge Packager) are the missing pieces.

`infer-knowledge` should be a **standalone repo** (same class as `criterium`), not a module
in `reasoning-apps`. It orchestrates engines; it is not an app.

---

## The Pipeline (7 Stages, 40 Repos)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  KNOWLEDGE EXTRACTION & DISTRIBUTION PLATFORM                                │
│                                                                              │
│  INPUT           SCAN         EXTRACT       VALIDATE      CURATE            │
│  ─────           ────         ───────       ────────      ──────            │
│  Any domain   aivm/LLM     infer::         infer::       criterium         │
│  corpus       reads text   retroduce       ask/explain   L0→L1→L2→L3      │
│  (legal,      axiomvm      (ABDUCE:        gap_detect    HITL required     │
│  medical,     executes     hypothesis      sensitivity   at L0 + L2→L3    │
│  engineering  programs     generation)     (DETECT,      zz-core::         │
│  financial)               zz-notation     STRESS)       KnowledgeStore    │
│               craftegy-    schema          invariantis   rstmdb WAL        │
│               algo         structures      quint         (provenance)      │
│               RSTMDB       candidates      obstruct      pctl-rs           │
│               ingestion                    (SCORE:       (inductive        │
│                                            pPCTL         evidence)         │
│                                            BelnapValue)                    │
│                                                                              │
│  PACKAGE         DISTRIBUTE      MONITOR                                    │
│  ───────         ──────────      ───────                                    │
│  *** MISSING *** inferense API   infer::                                    │
│  manifest.yaml   CLI + embed     drift_detect                               │
│  .infer files    inferense       (MONITOR)                                  │
│  .zz artifacts   marketplace?    criterium L3                               │
│  version tags    registry        rstmdb drift                               │
│  seed_cases/                     alerting                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Stage-by-Stage Framework Map

### Stage 1: INPUT (Corpus Ingestion) — *** MISSING: Corpus Scanner ***

**What's needed**: An LLM-driven pipeline that reads domain text (PDFs, legal docs, engineering specs,
medical literature) and converts natural-language content into structured ZZ entities and candidate
`.infer` rule fragments.

**What exists**: aivm (agent VM), axiomvm (deterministic execution), rstmdb ingestion.

**Gap**: No orchestrated pipeline connecting LLM output → infer fact format. This is the
**Corpus Scanner** missing piece. It lives at the boundary of aivm and infer.

```
Corpus Scanner = aivm (LLM reads text)
              + axiomvm (structured extraction programs)
              + NL → infer fragment conversion
              + rstmdb.tier2_beliefs (candidate staging area)
```

---

### Stage 2: EXTRACT (Rule Hypothesis Generation) — EXISTS: `infer::retroduce`

`retroduce` (ABDUCE verb) is the formal extraction operator. Given an observation:
```infer
retroduce custody_presumption(parent, child) from
  domestic_violence_finding(parent) = true
  best_interest_evaluated = true;
```
It generates the most plausible hypothesis consistent with the KB. This is **Peirce abduction** —
the correct formal basis for rule extraction.

**Status**: Implemented and tested (Polymarket case study).

**Integration gap**: retroduce is manually invoked today. The Corpus Scanner must auto-invoke
it with LLM-proposed candidate predicates.

---

### Stage 3: VALIDATE (Deductive Consistency Checking) — EXISTS: `infer::ask/explain/gap_detect/sensitivity`

Once a rule is extracted, infer validates it deductively:

| Verb | Role in validation |
|------|--------------------|
| `ask` | Does this rule produce expected conclusions from known facts? |
| `explain` | What proof tree justifies the rule firing? |
| `gap_detect` | Does the rule depend on predicates not yet in the KB? |
| `sensitivity` | If this rule is removed, what conclusions change? (load-bearing test) |

**Status**: `ask`/`explain` implemented. `gap_detect`/`sensitivity` designed (ADR-THEORY-002),
not yet built (TASK-16, TASK-17).

**Also**: `invariantis` validates structural invariants. `quint` validates specifications via model
checking. `obstruct` (abstract interpretation) validates type-level properties.

---

### Stage 4: SCORE (Inductive Evidence Weighting) — EXISTS: `pctl-rs` pPCTL

The probabilistic model checker scores each rule's evidence using Belnap 4-valued semantics:

```
Source 1 says: custody_presumption fires with P=0.87
Source 2 says: custody_presumption fires with P=0.71

pPCTL → interval [0.71, 0.87]
  lo=0.71 ≥ θ=0.7? YES → told_true
  hi=0.87 ≥ θ=0.7? YES → told_true
  → BelnapValue::True
```

For conflicting sources:
  lo=0.4 < θ=0.7, hi=0.9 ≥ θ=0.7 → BelnapValue::Conflicted → surfaces to human

**Status**: Implemented, formally proved correct (ADR-ADR-3).

---

### Stage 5: CURATE (Human-in-the-Loop Assurance) — EXISTS: `criterium`

The assurance loop governs promotion of rules through 4 assurance levels:

```
L0 Abduced    → Corpus Scanner proposed it; human selects which to pursue
L1 Deduced    → infer ask/explain: no contradictions; rule is logically coherent
L2 Induced    → pctl-rs: evidence confidence ≥ domain threshold (θ set by domain expert)
L3 Operational → deployed, monitored by drift_detect; loop restarts if drift detected
```

HITL is **structural, not optional**: the loop state machine cannot advance past L0 without
human hypothesis selection, and cannot mark L3 without human evidence review.

**Status**: ADR accepted. Wiring incomplete (docs-ma8r, docs-vm1a, docs-nwf2 open).

**Storage**: criterium uses `zz-core::KnowledgeStore` (Option B composition: criterium wraps
by value + adds `AssuranceLevel` metadata). rstmdb provides WAL provenance.

---

### Stage 6: PACKAGE (Knowledge Model Artifact) — *** MISSING: Knowledge Packager ***

**What's needed**: A tool that bundles L2/L3-validated rules into a portable Knowledge Model artifact.

```yaml
# manifest.yaml (from reasoning-apps#24)
name: child-custody-california
version: 1.4.2
domain: family_law
jurisdiction: california
author: expert@court.gov
provenance: rstmdb://governance/rules/custody-ca
entrypoints:
  - fc_3044_dv_presumption
  - fc_3040_best_interest
dependencies:
  infer: ">=0.9"
  zz-notation: ">=0.3"
seed_cases: tests/
```

A Knowledge Model is:
- `manifest.yaml` — metadata, versioning, provenance pointer
- `rules.infer` — the validated rule set (materializes from rstmdb WAL)
- `entities.zz` — ZZ entity schema (what entities the rules operate on)
- `tests/` — seed cases (known input→output pairs for regression)

This is `npm` for domain knowledge. The runtime (infer binary, inferense) is infrastructure —
not part of the artifact.

**Gap**: The packaging toolchain does not exist. This is the **Knowledge Packager** missing piece.

---

### Stage 7: DISTRIBUTE — PARTIAL: `inferense` + missing registry

**What exists**: `inferense` serves `.infer` programs as an API. Callers can query:
```
POST /v1/infer
{ "program": "custody-california@1.4.2", "facts": {...} }
```

**What's missing**: A registry/registry-of-registries that indexes Knowledge Models by domain,
version, and author. Currently each model must be deployed manually. The marketplace vision
(tokenomics, royalties) from reasoning-apps#23 is the long-term goal.

---

## The Three Missing Pieces

| Missing Piece | What It Does | Where It Lives | Depends On |
|---------------|--------------|----------------|------------|
| **Corpus Scanner** | LLM reads domain text → candidate .infer fragments + ZZ entities | `infer-knowledge` repo | aivm, axiomvm, infer::retroduce |
| **Task Planner** | ZZ templates that define WHAT to extract (domain expert sets the schema) | `infer-knowledge` repo | zz-notation, fpf-cards |
| **Knowledge Packager** | Bundles L2/L3 rules into manifest.yaml + .infer + .zz + tests/ | `infer-knowledge` repo | criterium, rstmdb, infer |

All three live in the same new repo: `infer-knowledge` (standalone, like criterium).

### Task Planner detail

The Task Planner is the domain expert's interface. It answers: "What should we extract?"

```zz
# Domain expert defines extraction schema in ZZ
entity ExtractionTask {
  domain: "family_law",
  jurisdiction: "california",
  target_predicates: [
    "custody_presumption",
    "domestic_violence_finding",
    "best_interest_evaluation"
  ],
  corpus_sources: [
    "California Family Code §§3040-3048",
    "FC-3044 form documentation",
    "Case law: In re Marriage of LaMusga (2004)"
  ],
  confidence_threshold: 0.75  // domain expert sets θ for pctl-rs
}
```

The Task Planner is the ZZ-based description of WHAT to scan — the domain expert's definition
of the extraction problem. It drives the Corpus Scanner.

FPF-cards (Function-Process-Feature decomposition, from Zakharov ИПМ lineage) is the natural
format for Task Planner templates: each card describes a function (what the extraction achieves),
a process (how the scanner operates), and a feature (what distinguishes this domain's rules).

---

## ZomboCraftEco → TheoSciTech Intellectual Genealogy

Every ZomboCraftEco component has a TheoSciTech intellectual ancestor. This is not incidental —
the schools predicted the architecture.

| ZomboCraftEco Component | Pipeline Stage | Primary School | Key Link |
|---|---|---|---|
| `infer` | EXTRACT + VALIDATE | **Glushkov School** | SAA automata → Datalog-style proof engine; OGAS → formal rule systems |
| `pctl-rs` | SCORE | **Markov School** | Markov chains + CTMC/DTMC; probabilistic model checking |
| `criterium` | CURATE | **Zakharov ИПМ/УСЭ** | 13-block universal evolution schema = assurance loop; constitutional gap analysis = L0→L3 |
| `zz-notation` | SCHEMA + STORE | **Luzin/Luzitania School** | Descriptive set theory → type theory → knowledge representation |
| `axiomvm` | SCAN executor | **Bourbaki ENS School** | Axiomatic formalism → deterministic program execution |
| `aivm` | SCAN (LLM interface) | **Edinburgh AI School** | McCarthy/Minsky AI tradition; knowledge representation via agents |
| `rstmdb` | PROVENANCE | **Kolmogorov School** | Complexity theory + information theory → entropy-based provenance; MDL principle |
| `inferense` | DISTRIBUTE | **Bell Labs / Shannon School** | Information theory → communication → knowledge distribution |
| `invariantis` | VALIDATE (structural) | **Cambridge / Turing School** | Formal verification → invariant checking; Hoare logic |
| `obstruct` | VALIDATE (abstract) | **INRIA School** | Abstract interpretation (Cousot); program analysis |
| `craftegy-algo` | ANALYZE patterns | **Altshuller TRIZ School** | Algorithm selection under constraints; contradiction resolution |
| `flowspec` | ORCHESTRATE | **Glushkov + Zakharov** | Process orchestration; task planning; UСЭ-style structured workflow |
| `quint` | VALIDATE (model check) | **Cambridge / Turing** | Model checking (Milner CSP lineage → process algebra → Quint TLA+) |
| `fpf-cards` | TASK PLANNER | **Zakharov ИПМ** | FPF = Function-Process-Feature; direct УСЭ block decomposition |
| `pctl-rs NINE` (planned) | SCORE (6-value) | **Fitting / NINE bilattice** | Fitting 1991 NINE bilattice — full confidence gradient |
| `criterium AssuranceLevel` | CURATE (meta) | **Zakharov УСЭ** | L0=needs, L1=concept, L2=evidence, L3=operational — direct УСЭ block mapping |

### The Key Intellectual Lineages

**Deductive strand** (Aristotle → Leibniz → Boole → Frege → Turing):
```
Ancient Greek Foundations → Cambridge/Turing School → Edinburgh AI School
       ↓                           ↓                        ↓
  Logic as inference          Formal verification       Knowledge agents
       ↓                           ↓                        ↓
  infer (5-verb formal logic)  invariantis / quint     aivm
```

**Inductive strand** (Hume → Bayes → Markov → Kolmogorov):
```
Late 19th Century Precursors → Markov School → Kolmogorov School
       ↓                             ↓                  ↓
  Probability as epistemology   Stochastic processes  MDL + complexity
       ↓                             ↓                  ↓
  pctl-rs (probabilistic MC)   pctl-rs CTMC/DTMC     rstmdb WAL entropy
```

**Soviet Systems strand** (Dialectical materialism → multiple parallel schools):
```
Soviet intellectual culture
       ├── Glushkov (algebraic, OGAS) → infer proof engine
       ├── Altshuller (empirical, TRIZ) → craftegy-algo
       └── Zakharov (constitutional, ИПМ/УСЭ) → criterium + fpf-cards + flowspec
```

**French Formalism strand** (Bourbaki → structuralism → category theory):
```
Bourbaki ENS School → axiomvm (deterministic formal execution)
Poincaré lineage → obstruct (abstract interpretation via INRIA)
```

---

## TheoSciTech Schools as Domain Corpora

The TheoSciTech research schools (50+ docs in `docs/research/`) are simultaneously:
1. **Intellectual genealogy** of ZomboCraftEco components (where the ideas came from)
2. **The first domain corpus** for the Knowledge Extraction Platform (dogfood strategy)

Extracting knowledge from the TheoSciTech school docs into Knowledge Models is the platform's
own proof-of-concept:

```
INPUT: docs/research/glushkov-school.md
EXTRACT: "Glushkov founded SAA in Kyiv in 1962"
         "SAA developed the first Soviet CAD systems"
         "OGAS = Glushkov's national economic cybernetics network"
VALIDATE: infer proves no contradictions with known Soviet CS history
SCORE: pctl-rs: P(SAA→CAD) ≥ 0.9 (well-evidenced)
CURATE: criterium L2 (induced, high confidence)
PACKAGE: soviet-cs-genealogy@0.1.0 — knowledge model
DISTRIBUTE: inferense serves "Who influenced Glushkov?"
```

**Six natural domain corpora from TheoSciTech schools**:

| Domain | Schools | Sample Rules |
|--------|---------|--------------|
| **Soviet CS** | Glushkov, Lyapunov/Ershov, Kolmogorov | "If formal automata theory → then compiler theory" |
| **Mathematics** | Luzin, Gelfand, Bourbaki, Goettingen, Lviv/Banach | "If descriptive set theory → then modern type theory" |
| **Physics** | Landau, Ioffe, Korolev, Pontryagin | "If control theory → then aerospace dynamics" |
| **Innovation** | Altshuller TRIZ, Zakharov ИПМ, Russian Systems Thinking | "If contradiction identified → then TRIZ 40 principles applicable" |
| **AI Genealogy** | Edinburgh, Cambridge, MIT/Wiener, Montreal/Bengio, CMU | "If Turing machine → then Church-Turing thesis" |
| **Orthodox/Theology** | Byzantine, Florensky/Losev, Whitehead Process | "If apophatic theology → then formal limits of expressibility" |

---

## Architecture Decision: Standalone Repo (Confirmed)

**`infer-knowledge` must be a standalone repo, not a module in `reasoning-apps`.**

| Criterion | reasoning-apps module | Standalone repo (recommended) |
|-----------|----------------------|-------------------------------|
| Audience | PoC developers | Domain experts + external partners |
| Artifact | Demo app code | Distributable Knowledge Models |
| Lifecycle | Fast-moving experiments | Stable versioned releases |
| Dependencies | Uses reasoning engines | Orchestrates reasoning engines |
| Precedent | Polymarket PoC, Catalyst | criterium (same pattern) |
| Release cycle | Coupled to app updates | Independent versioning (semver) |

The Knowledge Packager produces `manifest.yaml` + `.infer` + `.zz` bundles that are
independently distributable — they need their own repo and release train.

**Proposed structure**:
```
infer-knowledge/
  Cargo.toml
  crates/
    corpus-scanner/       # LLM → candidate .infer fragments
    task-planner/         # ZZ templates for extraction schema
    knowledge-packager/   # manifest.yaml + artifact bundling
    rule-lifecycle/       # RSTMDB-backed rule state machine
    registry-client/      # publish/consume from registry
  docs/
    adr/
    prd/
  examples/
    soviet-cs-genealogy/  # first dogfood example
    child-custody-ca/     # from reasoning-apps#24
```

---

## Recommended Sequence

**Week 1 (foundation)**
1. Create `infer-knowledge` repo (standalone) with scaffolding
2. Wire docs-nwf2 (TruthValue bug) + docs-vm1a (Bridge 3) — prerequisite for all CURATE stage
3. Decision: docs-ma8r (Bridge 2 session model) — what triggers L1→L2 transition

**Week 2-3 (corpus scanner MVP)**
4. Build `corpus-scanner` crate: aivm → retroduce invocation → candidate staging
5. Dogfood first: soviet-cs-genealogy domain (TheoSciTech docs as input corpus)
6. Task planner v0: simple YAML schema for extraction task definition

**Week 4 (first Knowledge Model)**
7. Package soviet-cs-genealogy@0.1.0 — first manifest.yaml artifact
8. Serve via inferense: "who influenced whom?" proof trees with Belnap grades

**Week 5-6 (validation + docs-rian)**
9. Wire first proof tree (docs-rian) on a real Science Genealogy claim
10. `gap_detect` + `sensitivity` verbs (TASK-16/17 in infer)

---

## Opportunity Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Strategic Fit | 9/10 | Formally verifiable domain knowledge is a genuine defensible position |
| Competitive Moat | 9/10 | Rust + formal logic + HITL + provenance = near-impossible to replicate |
| Execution Feasibility | 6/10 | 3 missing pieces are real but bounded; TheoSciTech dogfood reduces risk |
| Time-to-Market Risk | 6/10 (moderate) | TheoSciTech corpus = immediate real data; reduces "waiting for users" |
| TheoSciTech as Dogfood | +2 bonus | First corpus is already in-house; proves platform without waiting for domain experts |

**Overall: Go. TheoSciTech dogfood strategy changes the execution risk profile.**

The TheoSciTech schools are not just intellectual genealogy — they are the platform's first
proof of life. The soviet-cs-genealogy Knowledge Model is the simplest possible real-world
test: ingest `glushkov-school.md`, extract the formal influence claims, validate against
known CS history, package, distribute. If that works, the platform works.

---

## Key Sources

| Source | Role |
|--------|------|
| reasoning-apps#24 | infer-knowledge origin issue; manifest.yaml design |
| criterium ADR-001 | Abduction-first bridge; L0→L1→L2→L3 assurance cycle |
| infer ADR-THEORY-002 | 5-verb framework (DEDUCE/ABDUCE/DETECT/STRESS/MONITOR) |
| pctl-rs pPCTL ADR | pPCTL formal semantics; BelnapValue from interval probability |
| zz-notation ADR-002 | KnowledgeStore architecture |
| docs-dtf4 | Formal deductive/inductive bridge theory (prerequisite for L2 threshold) |
| docs-ma8r | Bridge 2 session model (L1→L2 handshake protocol) |
