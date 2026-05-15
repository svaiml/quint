---
target_peer: zombocraft
---

# Craft Architecture: Multi-Universe AI Project

**Date**: 2026-04-13
**Author**: Senior Research Analyst + Enterprise Architect (TASK-121)
**Status**: Research Document — Iteration 1 Complete. **New research iteration needed before ADR implementation.**

---

## 1. Meta Levels (Philosophical Foundations)

### Level 0 — Ontological Commitment: "What is knowledge?"

Three philosophical traditions converge:
- **Belnap (1977)**: Truth is two-dimensional. FOUR = {True, False, Unknown(0,0), Contested(0.5,0.5)}. Not-True ≠ False.
- **Leibniz "Calculemus"**: Disagreement resolved by computation. Knowledge has formal structure; that structure can be mechanized.
- **Orthodox Apophatics**: What the system CANNOT know must be declared explicitly. Epistemic humility is precision.

All three say the same thing at different registers: classical two-valued reasoning is inadequate.

### Level 1 — Logical Foundation: Bilattice Structure

- **Belnap FOUR** `{T,F,U,B}` → `zz-notation`, `pctl-rs/pctl-belnap`
- **NINE bilattice** (Ginsberg 1988) `{Low,Med,High}²` → `pctl-rs/pctl-belnap/belnap_nine.rs`, `belnap-gpt-nine`
- **Randers Finsler distance on [0,1]²** → `pbelnap/src/loss.py` (trainable bilattice)

FOUR and NINE are the correct type system for any system handling missing data, conflicting sources, graduated evidence.

### Level 2 — Execution Architecture: Determinism + Auditability

Every output derivable from explicit axioms via traceable path:
- `axiomvm`: proof-carrying traces, gas metering
- `aivm`: WASM actors, capability-gated
- `rstmdb`: WAL-durable state transitions (event-sourced)
- `invariantis`: cryptographic finality (Raft)

### Level 3 — Application Semantics: Domain Formalization

Pattern across all domains: **domain facts → infer relations → RSTMDB state machines → proof-carrying outputs with bilattice confidence**
- Science genealogy, legal reasoning, financial reasoning, eschatology, adaptive education — all same pattern

---

## 2. Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  LEVEL 0 — ONTOLOGICAL COMMITMENT                                           ║
║  Belnap FOUR · Leibniz Calculemus · Orthodox Apophatics                     ║
║  "Truth is 2D. Uncertainty must be typed. Ignorance must be declared."      ║
╚══════════════════════════════════════════════╤═══════════════════════════════╝
                                               │
╔══════════════════════════════════════════════╧═══════════════════════════════╗
║  LEVEL 1 — LOGICAL SUBSTRATE                                                ║
║  zz-notation (FOUR, Rust)  ·  pctl-rs/pctl-belnap (FOUR + NINE)            ║
║  pctl (probabilistic MC, C)  ·  pbelnap (Randers loss, Python)              ║
╚═══════════╤═══════════════════════════════════════════╤═════════════════════╝
            │                                           │
            ▼                                           ▼
╔═══════════════════════════╗             ╔═════════════════════════════════╗
║  DIRECTION 1              ║             ║  DIRECTION 2                    ║
║  DEDUCTIVE ARM            ║             ║  INDUCTIVE ARM                  ║
║  (reasoning-universe)     ║             ║  (epistemic-universe)           ║
║                           ║             ║                                 ║
║  infer (5-verb logic DSL) ║             ║  nanoGPT (CE baseline)         ║
║  infer-fpc (Pascal port)  ║             ║  belnap-gpt (dual heads)       ║
║  axiomvm (proof VM)       ║             ║  belnap-gpt-nine (NINE heads)  ║
║  aivm (WASM agents)       ║             ║  TruthfulQA/HotpotQA datasets  ║
║  o2l (null-free OOP lang) ║             ╚═════════════╤═══════════════════╝
╚═══════════╤═══════════════╝                           │
            │                                           │
╔═══════════╧═══════════════╗             ╔═════════════╧═══════════════════╗
║  DIRECTION 3              ║             ║  THE BRIDGE                     ║
║  TEMPORAL STATE + FINALITY║             ║  pctl-rs/pctl-belnap            ║
║                           ║             ║  NINE bilattice = same struct   ║
║  rstmdb (WAL state DB)    ║             ║  in formal MC + neural net      ║
║  invariantis (Raft ledger)║             ╚═════════════╤═══════════════════╝
║  inferense (HTTP API)     ║◄──────────────────────────┘
╚═══════════╤═══════════════╝
            │
            ▼
╔══════════════════════════════════════════════════════════════════════════════╗
║  DIRECTION 4 — KNOWLEDGE BASE (docs universe)                               ║
║  Science Genealogy · Orthodox Theology · Management Schools                 ║
║  Ukrainian Science · Open Problems · Education curriculum                   ║
╚═══════════╤═══════════════════════════════════════════╤═════════════════════╝
            │                                           │
     ┌──────┴──────────────────────────┐   ┌───────────┴────────────┐
     ▼             ▼          ▼        │   ▼                        ▼
╔══════════╗ ╔══════════╗ ╔═══════╗   │ ╔═══════════════╗  ╔═════════════════╗
║ Science  ║ ║Apocalypsis║ ║poly-  ║   │ ║ catalyst      ║  ║ edu-platform   ║
║ Genealogy║ ║RSTMDB SM  ║ ║market ║   │ ║ custody-MH    ║  ║ (FSRS+Elo+BKT) ║
║ SaaS     ║ ║           ║ ║(2 apps║   │ ║               ║  ║ Telegram bot   ║
╚══════════╝ ╚══════════╝ ╚═══════╝   └─╚═══════════════╝  ╚═════════════════╝
```

---

## 3. Strong Directions (5 Axes — Never Compromise)

### Direction 1 — Declarative Formal Reasoning
- **Thesis**: Knowledge is structure, not procedure. Every output derivable from explicit axioms via traceable path.
- **Repos**: `infer`, `infer-fpc`, `axiomvm`, `inferense`
- **Violation**: LLM outputs used directly as facts without formal validation; Unknown collapsed to False by default

### Direction 2 — Bilattice Epistemic Calibration
- **Thesis**: Every claim carries an epistemic type (FOUR or NINE), not just a confidence float.
- **Repos**: `zz-notation`, `pctl-rs/pctl-belnap`, `pbelnap`, `belnap-gpt`
- **Violation**: Replacing (t,f) dual heads with single softmax; treating 0.5 as "Unknown" when it may be "Contested"

### Direction 3 — Temporal Durability + Cryptographic Finality
- **Thesis**: State transitions are facts; they must be durable, auditable, eventually immutable.
- **Repos**: `rstmdb`, `invariantis`
- **Violation**: Using mutable RDBMS for state machine storage; storing proof chains in mutable DB

### Direction 4 — Knowledge as Primary Asset
- **Thesis**: The 120+ research documents are the primary dataset. Research quality IS product quality.
- **Repos/Docs**: `docs/docs/research/`, `science-genealogy-platform-spec.md`
- **Violation**: Publishing genealogy claims without proof chains; loading unvalidated LLM extractions into graph

### Direction 5 — Dogfood-First, No Phantom Products
- **Thesis**: Every platform validated internally before shipping externally.
- **Violation**: Building web explorer before internal proof CLI is used daily; adding paid tiers before free-tier value is demonstrated

---

## 4. Dependency Graph (Topological Order)

```
Tier 0 (Pure Logic — no code deps):
  zz-notation · pctl · pbelnap

Tier 1 (Core Formal Infrastructure):
  infer · pctl-rs/pctl-core · pctl-rs/pctl-belnap

Tier 2 (Execution Runtimes):
  axiomvm · aivm · o2l

Tier 3 (Temporal + Network):
  rstmdb · invariantis

Tier 4 (API):
  inferense

Tier 5 (Neural — parallel track):
  nanoGPT → belnap-gpt → belnap-gpt-nine

Tier 6 (Applications):
  polymarket-temporal · polymarket-confidence · catalyst · custody-mental-health

Tier 7 (Products):
  Science Genealogy SaaS · Apocalypsis · Education Platform
```

**Critical paths**:
- Proof Engine to SaaS: `infer → inferense → Science Genealogy API → SaaS UI`
- Bilattice Bridge: `pctl-belnap/NINE → belnap-gpt-nine → formal-neural calibration`
- Temporal Proof Finality: `rstmdb WATCH → invariantis block → proof certificate`

**Genuinely independent** (potential orphan risk): `o2l`, `aivm` (no ecosystem integration path yet), `npd-cipher`

---

## 5. VSM Mapping (Beer's Viable System Model)

| VSM Level | Role | Project Component |
|-----------|------|-------------------|
| System 5 — Identity | Why the project exists; invariants | Belnap+Leibniz+Apophatics philosophy; infer/MANIFESTO.md |
| System 4 — Intelligence | Environment sensing; future direction | Science Genealogy research (docs); belnap-gpt-nine (leading edge); RSI index |
| System 3 — Optimization | Internal operations management | `infer` + `inferense` + `rstmdb` + `invariantis` |
| System 2 — Coordination | Parts communication; conflict resolution | `rstmdb` WATCH_ALL; `invariantis` Raft; pctl-rs/trust.rs decay |
| System 1 — Operations | Actual work | reasoning-apps, Science Genealogy SaaS, edu-platform, apocalypsis |

---

## 6. Gap Analysis

### Critical Gaps (Missing)

| ID | Gap | Severity | Mitigation |
|----|-----|----------|------------|
| GAP-1 | No bitemporal timestamps on RSTMDB events (valid_time vs transaction_time) | HIGH | Add `valid_time_start/end` to event payload schema as optional fields |
| GAP-2 | No AGM belief revision / retraction log | HIGH | New RSTMDB machine: `retraction_log` with (claim, evidence-for, new-evidence-against, retracted-at) |
| GAP-3 | No divergence log (multiple proof paths from same facts) | MEDIUM | axiomvm trace envelopes: add `divergence_id` when multiple proof paths exist |
| GAP-4 | **belnap-gpt has never been run** — the core hypothesis is unvalidated | CRITICAL | Run benchmark immediately. Everything in epistemic-universe depends on this. |
| GAP-5 | aivm has no integration with infer or rstmdb | HIGH | Define `aivm-infer` capability (calls inferense API) and `aivm-rstmdb` capability |
| GAP-6 | Science Genealogy graph (Neo4j) does not exist yet — TASK-22 not started | HIGH | Blocked on STRESS-validated ingestion pipeline (ADR-D) |
| GAP-7 | No counterfactual specification log (STRESS results ephemeral) | MEDIUM | Persistent STRESS test log in RSTMDB |

### Overlaps (Rationalization Needed)

| Overlap | Resolution |
|---------|------------|
| axiomvm vs aivm (two runtimes) | axiomvm = micro-reasoning steps; aivm = macro-agent orchestration. axiomvm is a GUEST LIBRARY inside aivm agents. |
| infer vs pctl (two truth engines) | Not a conflict — correct separation. Bridge: pctl computes probability bounds → pctl-belnap converts to BelnapFourValue → infer uses as scored fact |
| o2l (unclear role) | Primary: education platform teaching language. Secondary: research artifact. Clarify or risk orphaning. |

---

## 7. Top 5 Architectural Decisions

### ADR-A: Formal-Neural Integration Protocol
**Options**: Loose API | Shared bilattice type | Neural prior + formal posterior
**Recommendation**: Neural prior (belnap-gpt) + formal posterior update (pctl-belnap verification). Phase 1: loose API. Phase 2: `NeuralBelnapPrior` struct in `pctl-rs/crates/pctl-belnap/src/neural_interface.rs`.

### ADR-B: RSTMDB Bitemporal Extension
**Options**: No | Optional fields | Native engine redesign
**Recommendation**: Optional `valid_time_start/end` fields immediately (schema convention). Plan native engine for v0.3+.

### ADR-C: aivm as Universal Agent Runtime
**Options**: Keep standalone | Port all apps immediately | Incremental via host capabilities
**Recommendation**: Define `aivm-infer` and `aivm-rstmdb` host capabilities. New agents → aivm. Existing Python apps wrapped as host tools.

### ADR-D: Knowledge Ingestion Protocol
**Options**: Manual curation | LLM extraction (no validation) | LLM extraction → infer STRESS validation
**Recommendation**: LLM extraction → STRESS test → human review queue for failures. Auto-load claims surviving 3+ STRESS tests. This makes "provable genealogy" meaningful.

### ADR-E: o2l Ecosystem Role
**Options**: Deprecate | Education vehicle | Scripting for infer | Research artifact
**Recommendation**: Education vehicle (primary) + research artifact (secondary).

---

## Immediate Actions

1. **Run belnap-gpt benchmark** — highest-priority unvalidated hypothesis
2. **Create `aivm-infer` capability spec** — 2 days, unlocks correct agent architecture
3. **Add RSTMDB bitemporal schema convention** — additive, no risk, needed by 3+ apps
4. **Implement AGM retraction log** — most important logical gap
5. **Wire pctl-belnap into polymarket-confidence** — shortest path to formal-neural bridge in production

---

---

## Next Research Iteration Needed

This is **Iteration 1** — a structural first pass. Before ADR implementation proceeds, a second research iteration is needed to address:

1. **Management Schools as organizational model** — Bogdanov Tektology, Glushkov OGAS 3-tier, Beer VSM applied more deeply to the project's own organizational craft (not just mapped, but designed with)
2. **Ukrainian Science node integration** — how Vernadsky (noosphere) + Kondratyuk (LOR) + Glushkov (SAA/OGAS) connect to the knowledge base as a distinct genealogy thread
3. **o2l role decision** — concrete decision: education vehicle or deprecate
4. **The flat-routing gap (OGAS insight)** — currently all apps are siloed; OGAS principle says any node should reach any other node for data. Design the inter-app data routing layer.
5. **Apophatic boundary pattern** — formalize what the system explicitly CANNOT know across all domains (not just apocalypsis)

*Generated from TASK-121 research session.*
