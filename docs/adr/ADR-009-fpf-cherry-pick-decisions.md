# ADR-009: FPF Cherry-Pick Decisions -- Formal Comparison and Adopt/Reject

**Date**: 2026-04-02
**Status**: Proposed
**Deciders**: Project Architect
**Supersedes**: None
**Related**: ADR-002 (Research Methodology), ADR-004 (Cross-Reference Scaling), ADR-006 (Timeline Integration)
**References**: `llm-insights/fpf-levenchuk-analysis.md`, `llm-insights/fpf-levenchuk-provenance-trace.md`

## Context

Levenchuk's First Principles Framework (FPF, March 2026) is a normative, tool-agnostic specification for rigorous reasoning -- "an operating system for thought." Our platform is a specific application: a science genealogy knowledge base with a provable-fact inference engine (Infer) powered by 5 verbs (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR), a single-dimension confidence score (0.0--1.0), typed transmission paths, and a curated 25-school + 7-era graph.

The FPF analysis (see references) concluded that FPF and our platform are complementary, not competing: FPF provides the grammar, we provide the content and product. It recommended Option C -- cherry-pick the best FPF concepts rather than wholesale adoption or complete rejection.

This ADR makes binding decisions on 6 specific FPF concepts. Each decision is ADOPT, REJECT, or DEFER, with rationale and implementation consequences.

### Comparative Context

FPF is philosophically rooted (top schools: Aristotle/Greek 6 components, Kolmogorov 4, Wiener/MIT 3). Our framework is mathematically rooted (top schools: Kolmogorov 8, Pontryagin 7, Tikhonov 6). This complementarity means FPF offers formal/categorical structure where we have operational/numerical strength, and vice versa.

---

## Decision 1: FPF Canonical Reasoning Cycle (Abduction-Deduction-Induction) vs Our 5 Verbs (DEDUCE/ABDUCE/DETECT/STRESS/MONITOR)

**FPF**: Three-mode canonical reasoning cycle grounded in Peirce (1878). Abduction generates hypotheses, Deduction derives consequences, Induction validates empirically. Supplemented by a 4-step evolution loop (Observe-Notice-Stabilize-Route). Total: 7 operations across two cycles.

**Our Current**: Five verbs, each a distinct Infer engine operation:
- ABDUCE: Generate candidate explanations from evidence patterns (Peirce)
- DEDUCE: Derive consequences from axioms and graph structure (Spinoza/Euclid)
- DETECT: Find missing connections, whitespace in the graph (gap detection)
- STRESS: Identify load-bearing facts -- "what single fact, if removed, collapses the chain?" (sensitivity analysis)
- MONITOR: Track drift and decay in proof chains over time (watchdog)

**Decision**: REJECT replacing our 5 verbs. ACKNOWLEDGE Peirce grounding.

**Rationale**: Our 5-verb set is a strict superset of FPF's reasoning capabilities. FPF's Abduction maps to ABDUCE, Deduction maps to DEDUCE, and Induction maps partially to DETECT (empirical validation through gap-finding). However, DETECT (absence detection) and STRESS (sensitivity analysis) have no FPF equivalent whatsoever. FPF's evolution loop (Observe-Notice-Stabilize-Route) maps loosely to MONITOR, but MONITOR is more specific: it tracks confidence decay and structural drift in existing proof chains, not general epistemic evolution.

Replacing our 5 verbs with FPF's 3+4 model would lose two capabilities (DETECT, STRESS) that are core differentiators of our platform. No existing competitor (AlphaXIV, Semantic Scholar, Google Scholar) can answer "what's missing?" (DETECT) or "what breaks if this fact is wrong?" (STRESS). These are unique IP.

**If REJECT**: Our 5 verbs remain the canonical Infer operations. Documentation should explicitly note the Peirce lineage of ABDUCE and DEDUCE, and acknowledge that FPF's Canonical Reasoning Cycle covers the same Abduction-Deduction-Induction ground as our first two verbs. This is a provenance acknowledgment, not an architectural change.

**Implementation**: Add a "Theoretical Lineage" note to the Infer engine documentation:
> *The ABDUCE and DEDUCE verbs implement Peirce's triadic reasoning model (1878), also formalized in Levenchuk's FPF (2026) as the Canonical Reasoning Cycle. DETECT, STRESS, and MONITOR extend beyond Peirce's model into absence detection, sensitivity analysis, and temporal monitoring respectively.*

**Effort**: Documentation only. No code or schema changes.

---

## Decision 2: F-G-R Trust Model (3D: Formality x Scope x Reliability) vs Our 1D Confidence

**FPF**: Three-dimensional trust representation:
- **Formality (F)**: How formal is the evidence? (informal anecdote -> peer-reviewed paper -> mathematical proof)
- **Scope (G, from "Generality")**: How broadly does the claim apply? (single case -> domain-wide -> universal)
- **Reliability (R)**: How reproducible/stable is the evidence? (one-off observation -> reproducible experiment -> logical necessity)

Each claim carries a (F, G, R) triple. Trust is not a single number but a position in 3D space.

**Our Current**: Single confidence score per proof chain link, range 0.0--1.0, computed from evidence quality tier (primary/secondary/tertiary), transmission path type (Direct > Reformulation > Convergent > Indirect), and number of independent sources. Aggregate chain confidence = product of per-link confidences.

**Decision**: ADOPT, with phased implementation.

**Rationale**: Our 1D confidence score conflates three genuinely independent dimensions. Consider two proof chain links:

- Link A: A peer-reviewed paper (high formality) documenting a single case study (low scope) with reproducible methodology (high reliability). 1D score: 0.85.
- Link B: An informal memoir (low formality) describing a widespread teaching tradition (high scope) with strong cross-corroboration (high reliability). 1D score: 0.75.

Under 1D, Link A > Link B. Under 3D, they are incomparable -- A dominates on Formality, B dominates on Scope. The user should see this distinction. For science genealogy, where evidence ranges from Euclidean proofs (F=max, G=max, R=max) to oral tradition about teacher-student relationships (F=low, G=low, R=varies), the 3D model captures real differences that a single number obscures.

The 3D model also directly addresses a known weakness in our current system: pre-modern proof chains (e.g., manuscript transmission from Euclid through Islamic Golden Age scholars) tend to score low on 1D confidence because evidence is sparse, but their Formality may be high (mathematical proofs survive translation) even when Reliability is lower (we cannot verify the exact transmission path). F-G-R makes this nuance visible.

**If ADOPT**: The proof chain schema gains three new fields per link:

```json
{
  "from": "...",
  "to": "...",
  "confidence": 0.85,
  "formality": 0.95,
  "scope": 0.40,
  "reliability": 0.90
}
```

The existing `confidence` field is retained as a backward-compatible aggregate: `confidence = f(formality, scope, reliability)`. The aggregation function defaults to geometric mean but is configurable per domain. This preserves all existing queries and UIs while enabling 3D drill-down for advanced users.

**Implementation plan**:
1. **Phase 1 (schema)**: Add `formality`, `scope`, `reliability` fields to the ProofChainLink type. All three are optional; if absent, the system falls back to the existing 1D `confidence` field.
2. **Phase 2 (scoring)**: Update Stage 5 (Confidence Computation) of the Infer pipeline to compute F, G, R from evidence metadata. Formality derived from source type (primary=0.9, secondary=0.7, tertiary=0.4). Scope derived from transmission path type (Direct=high scope within domain, Convergent=cross-domain scope). Reliability derived from number of independent sources and reproducibility markers.
3. **Phase 3 (display)**: Platform UI shows 3D trust as a small radar/triangle chart on each proof chain link, alongside the existing confidence bar.

**Effort**: Medium. Schema change is trivial. Scoring algorithm requires mapping existing evidence metadata to three dimensions. UI change is a display enhancement, not a new feature.

---

## Decision 3: Congruence Level (CL) -- Trust Penalty at Context Boundaries

**FPF**: When a reasoning chain crosses from one bounded context to another (via a "bridge"), confidence is penalized because assumptions valid in Context A may not hold in Context B. FPF formalizes this as the Congruence Level: a multiplier < 1.0 applied at every bridge crossing.

**Our Current**: Proof chains that cross school boundaries (e.g., Kolmogorov school to Pontryagin school) carry no boundary-crossing penalty. A chain Kolmogorov -> Pontryagin -> Bellman -> Sutton treats each link independently. The aggregate confidence is the product of per-link confidences, but no additional penalty is applied for the fact that the chain crosses from probability theory (Kolmogorov) to control theory (Pontryagin) to decision theory (Bellman) to reinforcement learning (Sutton).

**Decision**: ADOPT.

**Rationale**: Context boundaries are real in science genealogy. When a mathematical concept crosses from one school to another, it is reformulated -- the same word may mean different things, assumptions change, and the evidence standard shifts. Our existing transmission path taxonomy already encodes this: Direct transmission (same context, no reformulation) should have no penalty, while Reformulation (concept adapted to new context) and Convergent (independent development, superficial similarity) inherently involve context shifts.

The absence of a boundary penalty is a known weakness. Consider: Kolmogorov's probability axioms (1933) influenced Pontryagin's maximum principle (1956) through Pontryagin's doctoral student Gamkrelidze, who studied measure-theoretic control. This is a legitimate connection, but the axioms of probability do not transfer unmodified into control theory -- they are reformulated. Our current system treats this link the same as a within-school link (e.g., Kolmogorov -> Kolmogorov student), which overstates confidence.

The CL penalty makes this honest. A proof chain that stays within one school's tradition (e.g., Kolmogorov -> Dynkin -> Sinai, all within the Moscow probability school) should have higher aggregate confidence than a chain that crosses three school boundaries, all else being equal.

**If ADOPT**: The Congruence Level is implemented as a multiplier applied during Stage 5 (Confidence Computation) of the Infer pipeline. The multiplier is determined by the transmission path type of each link:

| Transmission Path Type | CL Multiplier |
|---|---|
| Direct | 1.00 (no penalty) |
| Reformulation | 0.90 (10% penalty for context adaptation) |
| Convergent | 0.80 (20% penalty for independent re-derivation) |
| Indirect | 0.70 (30% penalty for weak/speculative connection) |

Aggregate chain confidence becomes: `product(per_link_confidence * CL_multiplier)`.

This integrates naturally with the existing transmission path taxonomy (ADR-002) -- no new metadata is required. The penalty values are initial defaults, tunable per domain.

**Implementation plan**:
1. Add CL multiplier lookup table to Infer configuration.
2. Modify Stage 5 aggregation to apply CL multiplier per link based on `link_type`.
3. Display CL penalties visually in proof chain output (e.g., a small icon or color shift at each boundary crossing).

**Effort**: Low. The transmission path type already exists on every edge. This is a scoring formula change, not a schema change.

---

## Decision 4: NQD Search (Novelty-Quality-Diversity)

**FPF**: NQD optimizes creative search across three dimensions:
- **Novelty**: Distance from known patterns (rooted in Kolmogorov complexity)
- **Quality**: Fitness against domain criteria
- **Diversity**: Coverage of the solution space (avoiding convergence to a single cluster)

FPF uses NQD as a "creative abduction engine" -- generating hypotheses that are not just plausible but genuinely novel and diverse.

**Our Current**: The GAP engine (DETECT verb) finds missing connections in the genealogy graph: pairs of schools that should be connected but lack documented evidence. It operates by comparing expected connections (based on thematic proximity, temporal overlap, geographic proximity) against actual graph edges. Detected gaps are reported as "whitespace" -- areas where research is needed.

The GAP engine does NOT optimize for novelty, quality, or diversity. It finds absences, not creative hypotheses. It cannot distinguish between a boring gap (two schools that trivially should be connected) and an exciting gap (an unexpected potential connection that, if confirmed, would reshape understanding).

**Decision**: ADOPT, scoped to GAP engine enhancement.

**Rationale**: The GAP engine's current output is a flat list of missing connections. All gaps are treated equally. But some gaps are far more interesting than others:

- **Novel gap**: "No one has connected Glushkov's cybernetics to Kantorovich's linear programming, but both were in the Soviet Academy at the same time." This is a high-novelty gap -- the connection is unexpected and would be a genuine discovery if confirmed.
- **Boring gap**: "Kolmogorov school and Markov school have a gap." This is low-novelty -- the connection via Chebyshev is well-documented and the gap is likely a data entry omission, not a genuine absence.

NQD scoring ranks gaps by interestingness:
- **Novelty**: How surprising is this potential connection? (Measured by graph distance, thematic distance, and lack of prior literature)
- **Quality**: If confirmed, how impactful would it be? (Measured by the importance of the connected nodes and the potential for new proof chains)
- **Diversity**: Are we surfacing gaps from different parts of the graph, or clustering in one area? (Ensures the GAP report covers the full graph, not just well-studied regions)

This directly enhances our competitive moat. No competitor has a gap detection engine at all; adding NQD-ranked gaps makes ours not just unique but actively creative.

**If ADOPT**: Add NQD scoring as a post-processing step in the DETECT pipeline:

```
DETECT (find gaps) -> NQD_RANK (score by novelty, quality, diversity) -> Output (ranked gap report)
```

NQD scores are computed as:
- `novelty = 1.0 - (graph_distance_normalized + thematic_overlap_normalized) / 2` (farther apart = more novel)
- `quality = (node_importance_A + node_importance_B) / 2 * potential_chain_impact` (more important nodes = higher quality)
- `diversity = 1.0 - cluster_density` (gaps in under-explored regions score higher)
- `nqd_score = w_n * novelty + w_q * quality + w_d * diversity` (weighted combination, default weights 0.4/0.4/0.2)

**Implementation plan**:
1. Add NQD scoring module to the DETECT pipeline.
2. Compute per-gap novelty, quality, diversity scores.
3. Rank gap report output by aggregate NQD score.
4. Surface top-N most interesting gaps in platform UI as "Discovery Opportunities."

**Effort**: Medium. Requires defining novelty/quality/diversity metrics against the existing graph schema. The scoring formulas are straightforward once metrics are defined. No schema changes needed -- NQD scores are computed at query time, not stored on edges.

---

## Decision 5: LADE Boundary Norms (Laws-Admissibility-Deontics-Evidence)

**FPF**: Every claim is classified into one of four types:
- **Laws (L)**: Necessary truths, axioms, logical entailments. Cannot be violated within the system.
- **Admissibility (A)**: Permissible but not required. Accepted interpretations, plausible alternatives.
- **Deontics (D)**: Norms, rules, standards. What SHOULD be done (not what IS true).
- **Evidence (E)**: Empirical observations, data, historical facts. Contingent truths.

FPF routes claims through a "boundary norm square" that determines how each claim type interacts at context boundaries.

**Our Current**: Proof chain links are unclassified. A link might be a logical derivation (Pontryagin's maximum principle follows from variational calculus), an empirical observation (Bellman attended a seminar where Pontryagin's work was discussed), or a normative claim (the RL community considers Bellman's work foundational). All three are treated identically in the confidence computation.

**Decision**: ADOPT, adapted to our domain.

**Rationale**: The LADE classification maps remarkably well to both science genealogy and Orthodox methodology, which is a dual strength given our platform's scope:

**Science genealogy mapping**:
- **L (Laws)**: Mathematical theorems and proofs that travel across schools unchanged. "The Pontryagin maximum principle is a necessary condition for optimal control." This is a logical truth -- it does not degrade when crossing school boundaries.
- **A (Admissibility)**: Accepted interpretations and historiographic consensus. "The Kolmogorov school is generally considered the most influential probability school of the 20th century." This is admissible but not a necessary truth -- reasonable scholars could disagree.
- **D (Deontics)**: Methodological norms and standards. "A transmission path claim must be supported by at least two independent sources." This is a norm our platform enforces, not a fact about the world.
- **E (Evidence)**: Historical facts with specific citations. "Kolmogorov's 1933 axioms were published in Ergebnisse der Mathematik." This is contingent evidence that could, in principle, be revised if the publication record were corrected.

**Orthodox methodology mapping** (cross-platform value):
- **L (Laws) = Dogma**: Conciliar definitions, irreformable truths. "Christ is fully God and fully man" (Chalcedon, 451).
- **A (Admissibility) = Theologoumena**: Permissible theological opinions not defined by councils. "The specific mechanism of the Pre-Eternal Council" (see `docs/research/pre-eternal-council-research.md`).
- **D (Deontics) = Canon law**: Normative rules for practice. "Clergy shall not charge interest" (Nicaea, Canon 17).
- **E (Evidence) = Historical evidence**: Patristic texts, archaeological findings, manuscript evidence.

This dual mapping means LADE classification serves both the science genealogy use case and the Orthodox methodology use case with a single taxonomy. A proof chain link in the Infer engine carries a `claim_type` field that is interpreted differently depending on the domain context but uses the same 4-category classification.

**If ADOPT**: Add a `claim_type` enum (L/A/D/E) to each proof chain link:

```json
{
  "from": "pontryagin-maximum-principle-1956",
  "to": "bellman-dynamic-programming-1957",
  "claim_type": "E",
  "claim_type_rationale": "Historical evidence: Bellman independently developed DP; the parallel to PMP is documented in both authors' publications."
}
```

Claim type interacts with the CL penalty (Decision 3):
- **L-type claims** receive no CL penalty at boundaries (logical truths survive context crossing)
- **A-type claims** receive standard CL penalty (interpretations may shift across contexts)
- **D-type claims** receive elevated CL penalty (norms are context-specific)
- **E-type claims** receive standard CL penalty (evidence must be re-evaluated in new context)

| Claim Type | CL Multiplier Modifier |
|---|---|
| L (Laws) | CL = 1.00 (no penalty regardless of path type) |
| A (Admissibility) | CL = standard (per Decision 3 table) |
| D (Deontics) | CL = standard * 0.90 (additional 10% penalty) |
| E (Evidence) | CL = standard (per Decision 3 table) |

**Implementation plan**:
1. Add `claim_type` enum (L, A, D, E) to the ProofChainLink type. Optional field; defaults to E (evidence) if unspecified.
2. Update Stage 5 scoring to apply claim-type-aware CL multipliers.
3. Display claim type as a badge on each proof chain link in the UI.
4. Provide a classification guide for content authors mapping common link patterns to LADE types.

**Effort**: Low-medium. Schema addition is trivial. The scoring integration builds on Decision 3. The main effort is creating the classification guide and retroactively classifying existing proof chain links.

---

## Decision 6: Holonic Foundation (Part-Whole Composition)

**FPF**: The foundational ontological primitive in FPF is the U.Holon -- an entity that is simultaneously a whole (containing parts) and a part (contained by a larger whole). This is traced from Koestler (1967) through Bertalanffy's General Systems Theory. Every entity in FPF is a holon: a person is a holon (whole: containing skills and knowledge; part: of a team), a team is a holon (whole: containing people; part: of an organization), and so on fractally.

**Our Current**: Implicit holonic structure exists throughout our architecture:
- A **figure** is a part of an **era** and a whole containing **contributions**
- An **era** is a part of the **timeline** and a whole containing **figures**
- A **school** is a part of a **thematic cluster** (ADR-004) and a whole containing **researchers and publications**
- A **proof chain** is a part of a **query response** and a whole containing **links**

However, none of this is formalized. The graph schema (ADR-006) uses three distinct node types (Era, Figure, School) with containment edges (CONTAINS_FIGURE), but there is no explicit holonic model that makes part-whole composition a first-class concept.

**Decision**: DEFER.

**Rationale**: The holonic model is intellectually compelling and accurately describes our existing architecture. However, formalizing it now would be premature optimization of the ontological layer.

Arguments for deferral:

1. **No immediate functional gap**: Our three-tier hierarchy (Era -> Figure -> School, per ADR-006) already supports the queries we need. A user can ask "what era does this figure belong to?" and "what figures belong to this school?" without a formal holonic model. The containment relationships are explicit in the graph schema.

2. **Formalization cost vs. benefit**: Making U.Holon a first-class type would require refactoring the graph schema to unify Era, Figure, School, Contribution, and ProofChain under a single `Holon` supertype with `contains` and `partOf` generic edges. This is a significant schema refactoring that would affect every query, every import pipeline, and every display component. The benefit -- cleaner ontology -- does not translate to user-visible features in the near term.

3. **Risk of over-abstraction**: The FPF holonic model is designed for a general-purpose reasoning framework. Our platform is a specific application. Introducing a general holon type risks making the schema harder to understand for contributors and developers who think in terms of "schools" and "figures," not "holons." Concreteness is an advantage in a domain-specific application.

4. **Revisit trigger**: The holonic model becomes necessary if we expand beyond science genealogy into a general-purpose knowledge graph (e.g., if the platform needs to model organizations, technologies, publications, and people with the same ontological primitives). At that point, the three-tier hierarchy would become insufficient, and a holonic refactoring would be justified.

**If DEFER**: No changes now. Document the implicit holonic structure in the architecture guide so that a future formalization has a starting point. Revisit when the platform expands to a fourth or fifth entity type beyond Era/Figure/School.

**Effort**: None now. Future formalization (if triggered) would be a major schema refactoring: High effort.

---

## Summary of Decisions

| # | FPF Concept | Decision | Key Rationale |
|---|---|---|---|
| 1 | Canonical Reasoning Cycle (3 modes) | **REJECT** | Our 5 verbs are a superset; DETECT and STRESS are unique IP with no FPF equivalent |
| 2 | F-G-R Trust Model (3D confidence) | **ADOPT** | 1D confidence conflates formality, scope, and reliability; 3D improves pre-modern chain assessment |
| 3 | Congruence Level (trust penalty at boundaries) | **ADOPT** | Cross-school proof chains overstate confidence without boundary penalties; integrates with existing transmission path taxonomy |
| 4 | NQD Search (novelty-quality-diversity) | **ADOPT** | Transforms GAP engine from flat absence list to ranked discovery opportunities; extends competitive moat |
| 5 | LADE Boundary Norms (L-A-D-E claim types) | **ADOPT** | Dual mapping to science genealogy and Orthodox methodology; interacts with CL penalty for type-aware confidence |
| 6 | Holonic Foundation (part-whole composition) | **DEFER** | Implicit holonic structure sufficient; formalization is premature without expansion to new entity types |

### Adoption Dependency Graph

Decisions 2, 3, and 5 are interdependent and should be implemented in order:

```
Decision 2 (F-G-R)     ← foundation: 3D trust fields on every link
    ↓
Decision 3 (CL)        ← depends on trust model: CL modifies confidence computation
    ↓
Decision 5 (LADE)      ← depends on CL: claim type modifies CL multiplier
    ↓
Decision 4 (NQD)       ← independent but benefits from richer trust model for quality scoring
```

### Implementation Phases

**Phase 1 -- Schema** (Decisions 2 + 5):
- Add `formality`, `scope`, `reliability` fields to ProofChainLink
- Add `claim_type` enum (L/A/D/E) to ProofChainLink
- Both optional, backward-compatible

**Phase 2 -- Scoring** (Decisions 2 + 3 + 5):
- Update Infer Stage 5 to compute F, G, R from evidence metadata
- Apply CL multiplier based on transmission path type
- Apply claim-type-aware CL modifier

**Phase 3 -- GAP Enhancement** (Decision 4):
- Add NQD scoring module to DETECT pipeline
- Rank gaps by novelty, quality, diversity

**Phase 4 -- Display** (all adopted decisions):
- 3D trust visualization (radar chart per link)
- CL penalty indicators at boundary crossings
- Claim type badges
- NQD-ranked discovery opportunities in GAP reports

### What We Keep Unchanged

The following platform capabilities have no FPF equivalent and remain our unique IP:
- **5-verb Infer model** (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR)
- **Transmission Path Taxonomy** (Direct/Reformulation/Convergent/Indirect)
- **RSI (Research Strength Index)** -- real-time momentum metric
- **Sensitivity Analysis** (STRESS verb) -- "what breaks if removed?"
- **Science Genealogy Graph** -- 25 schools, 7 eras, 200+ connections
- **Provenance Certificates** -- exportable proof of idea lineage
- **Cold War Convergence Analysis** -- parallel development detection

---

## Compliance

- No security, privacy, or compliance implications
- FPF is a publicly available specification (GitHub: ailev/FPF)
- All adopted concepts are general reasoning patterns, not proprietary IP of FPF
- Our adaptations (LADE-to-Orthodox mapping, NQD-for-GAP, CL-via-transmission-type) are original work

---

*ADR produced as part of TASK-106: FPF Cherry-Pick formal comparison and adopt/reject decisions*
