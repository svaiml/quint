---
target_peer: zombocraft
---

# ADR-011: LLM + Infer STRESS-Validated Knowledge Ingestion Pipeline

**Date**: 2026-05-05
**Status**: Proposed
**Deciders**: Project Architect
**Supersedes**: None
**Related**: ADR-002 (Research Methodology), ADR-009 (FPF Cherry-Pick), docs-z4t7 (GRACE-to-FPF bridge spike)
**References**: `docs/prompts/grace-to-fpf-bridge-prompt.md`, `docs/research/grace-to-fpf-bridge-spike.md`, `docs/research/fpf-haft-vs-grace-semantic-vm.md`

## Context

25+ school research documents exist as Markdown. The Science Genealogy platform's value proposition is *provable fact lineage* — not RAG-based approximate retrieval. Loading unvalidated LLM extractions directly into the Infer engine contradicts this: if the KB facts are LLM hallucinations, the proof chains built on them have zero epistemic standing.

The platform needs a pipeline that:
1. Extracts candidate facts from Markdown school documents
2. Documents each extraction's simplification boundary (what was dropped)
3. STRESS-tests each extracted claim before KB admission
4. Auto-loads claims passing STRESS into RSTMDB as AssuranceLevel L1 facts
5. Routes failed claims to human review with failure diagnostics

The spike task docs-z4t7 (GRACE-to-FPF bridge prompt) validated that an LLM can produce typed FPF card output (CSC/DRR/EFP JSON) from research text using a 4-step prompt. Three test cases across philosophical, formal-logic, and engineering domains all produced correct STRESS verdicts with correctly scoped `unsupported_use` and `reopen_trigger` fields.

This ADR makes the architectural decisions for applying that bridge to school document ingestion at scale.

---

## Problem Statement

Standard CoT extraction silently drops scope limitations. The bridge spike demonstrated that `unsupported_use` and `reopen_trigger` fields capture scope limitations that CoT extraction leaves implicit — and these are discovered only at STRESS time (downstream), not at ingestion time (where they can be flagged immediately).

Example: "Florensky's antinomy structure (1914) anticipates Gödel incompleteness (1931)" is a valid KB entry with a critical scope limit: it does not imply logical derivation, only structural isomorphism. CoT extraction would write: "Florensky anticipated Gödel." CSC extraction writes:
- `stronger_source`: "Florensky independently formulated antinomy as inexpressible-yet-real structure in 1914, 17 years before Gödel formalized unprovable-yet-true statements — the formal structures are isomorphic but there is no causal or citation link"
- `weaker_rendering`: "Florensky's 1914 antinomy theorem is structurally isomorphic to Gödel's 1931 incompleteness theorem (no causal link; independent derivation)"
- `unsupported_use`: "Claiming Florensky influenced Gödel; citing as causal transmission"

The `weaker_rendering` is a safe KB entry. The scope boundary is in the card at ingestion time, not discovered at STRESS time.

---

## Architecture: 4-Stage Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                     INGESTION PIPELINE                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INPUT: Markdown school document                                  │
│      │                                                            │
│      ▼                                                            │
│  STAGE 1: GRACE-to-FPF Extraction                               │
│  Bridge prompt (genealogy-mode) → CSC/DRR/EFP JSON per claim    │
│  LLM model routing: DeepSeek V3.2 (science/math);               │
│                      Claude (Orthodox/theological)               │
│      │                                                            │
│      ▼                                                            │
│  STAGE 2: FPF Card Validation                                    │
│  Schema check: all required fields present + non-empty           │
│  Reject malformed cards before any KB write                      │
│      │                                                            │
│      ▼                                                            │
│  STAGE 3: RSTMDB Ingestion                                       │
│  weaker_rendering → KB fact (AssuranceLevel L0)                  │
│  CSC/DRR/EFP → provenance block                                  │
│  F-G-R derived from efp.rendering_type                          │
│      │                                                            │
│      ▼                                                            │
│  STAGE 4: Infer STRESS Validation                               │
│  3 typed challenges per claim                                    │
│  All 3 PASS → AssuranceLevel L0 → L1 (auto-promote)            │
│  Any FAIL → human review queue                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Decision 1: Extraction Layer — GRACE-to-FPF Bridge Prompt (Genealogy Mode)

**Decision**: ADOPT the bridge prompt from docs-z4t7 as the extraction layer, adapted for school document structure.

**Rationale**: Raw CoT extraction produces prose facts with silently dropped scope limits. The bridge prompt produces typed CSC/DRR/EFP JSON with explicit `unsupported_use` and `reopen_trigger` fields. The spike validated this on 3 research texts. School documents have similar structure (factual claims + transmission paths). The `weaker_rendering` becomes the KB fact; `stronger_source` is the provenance annotation.

**School Document Adaptation** — replace the generic STEP 1 with a genealogy-mode version:

```
STEP 1 — BUILD DATAFLOW (genealogy mode)
Identify the PRIMARY TRANSMISSION CLAIM in the following passage.
Trace as a numbered dataflow:
  P[1]: founding entity (person, school, institution) with dates and location
  P[2]: knowledge domain or contribution being transmitted
  P[3]: evidence for transmission (publication, student record, seminar, letter)
  P[4]: receiving entity (student, school, tradition) with connection type
  S[1]: how P[3] establishes the P[1]→P[4] transmission
  C: the specific genealogy claim:
     "[Person/School A] transmitted [Concept X] to [Person/School B] via [Mechanism]"
     — OR —
     "[Person A] formulated [Result X] independently before [Person B] (no causal link)"
  F[1]: what evidence would disprove this transmission path
  F[2]: scope limit (e.g., "transmission of X, not Y"; "no causal link, only structural isomorphism")

Do NOT write prose. Use: "P[n]: ..." / "S[n]: ..." / "C: ..." / "F[n]: ..."

STEPS 2–4: identical to docs/prompts/grace-to-fpf-bridge-prompt.md
```

This adaptation front-loads the transmission path structure (P[1]→P[4]) that science genealogy queries run against. The dual C: form handles both direct transmission and independent parallel development.

**Extraction scope**: Extract 1 primary claim per bridge prompt call. For a complete school document, call multiple times: once per section heading (Key Figures, Core Contributions, Transmission Paths, International Connections). Limit: no more than 3 claims per LLM call (per the batch variant in the bridge prompt).

---

## Decision 2: Storage Target — RSTMDB with Neo4j Projection

**Decision**: RSTMDB is the canonical write store. Neo4j is a read projection built from RSTMDB facts.

**Rationale**: The original task description (written pre-RSTMDB) specified "Neo4j import" as the target. RSTMDB supersedes direct Neo4j writes:
- RSTMDB provides WAL for bitemporal provenance tracking
- RSTMDB stores the CSC/DRR/EFP provenance cards alongside each fact
- Neo4j is updated by a projection layer reading from RSTMDB, not by direct LLM-to-Neo4j writes

**Write schema (RSTMDB entry per ingested claim)**:

```json
{
  "fact": "<weaker_rendering from CSC>",
  "fact_type": "<L|A|D|E per LADE, default E (evidence)>",
  "provenance": {
    "source_doc": "<Markdown filename>",
    "source_section": "<section heading>",
    "extraction_model": "<LLM model used>",
    "csc_card": { "stronger_source": "", "weaker_rendering": "", "supported_use": "",
                  "unsupported_use": "", "reopen_trigger": "" },
    "drr_card": { "context": "", "decision": "", "consequences": "", "status": "" },
    "efp_card": { "rendering_type": "", "source_anchors": [], "admissible_faces": [] }
  },
  "confidence": {
    "formality": 0.0,
    "scope": 0.0,
    "reliability": 0.0,
    "aggregate": 0.0
  },
  "assurance_level": "L0",
  "stress_validation": null,
  "ingestion_timestamp": "<ISO 8601>"
}
```

**F-G-R derivation from `efp.rendering_type`** (per ADR-009 Decision 2):

| `rendering_type` | Formality (F) | Scope (G) | Reliability (R) | Notes |
|---|---|---|---|---|
| `SourcePinned` | 0.85 | 0.60 | 0.80 | Directly stated; medium scope (one school) |
| `Reconstruction` | 0.65 | 0.50 | 0.65 | Synthesized from multiple passages |
| `DidacticRetelling` | 0.45 | 0.55 | 0.45 | Simplified; pedagogical loss |
| `SpeculativeRetelling` | 0.30 | 0.35 | 0.30 | Inferential; aggregate ≤ 0.30 |

Aggregate confidence = geometric mean of F, G, R. Initial AssuranceLevel = L0 for all ingested facts. Stage 4 STRESS validation promotes passing facts to L1.

**`SpeculativeRetelling` exclusion**: Cards with this rendering_type do NOT auto-promote regardless of STRESS results. They route to human review by default and remain L0 until a human reviewer upgrades them.

---

## Decision 3: STRESS Test Harness for Genealogy Claims

**Decision**: A genealogy claim auto-promotes (L0 → L1) if it survives all 3 challenges from the challenge set matching its claim type.

**Rationale**: "Surviving 3+ STRESS tests" (task description) means: run 3 distinct challenges typed to the claim. All 3 must pass for auto-promotion. Any failure routes to human review with the specific failing challenge identified.

**Claim type taxonomy**:

| Type | Description | Example |
|---|---|---|
| A | Direct transmission ("A was a student of B") | "Kolmogorov was a student of Luzin" |
| B | Conceptual influence ("A's work influenced B's work") | "Kolmogorov probability axioms influenced Pontryagin's control theory" |
| C | School formation ("A founded school Z at institution I") | "Pontryagin founded the optimal control school at Steklov" |
| D | Priority claim ("A formulated X before B, independently") | "Florensky's antinomy structure predates Gödel incompleteness" |

**Challenge scenarios**:

**(A) Direct Transmission**

| # | Challenge | Pass condition |
|---|---|---|
| S1 | Remove primary citation (degree record, dissertation). Does independent evidence remain? | Secondary source (letter, seminar record, institutional memoir) still supports the relationship |
| S2 | Remove institutional affiliation. Does teacher-student relationship survive? | Evidence for personal supervision persists without the institutional framing |
| S3 | Reverse direction ("B was a student of A"). Does the claim collapse into ambiguity? | Original direction (A→B) is still clearly distinguishable from the reversal |

**(B) Conceptual Influence**

| # | Challenge | Pass condition |
|---|---|---|
| S1 | Remove influence mechanism (seminar, publication, citation). Does evidence of influence remain? | Structural similarity in methods + temporal proximity still suggests transmission |
| S2 | Replace "influenced" with "coincidentally paralleled." Does evidence distinguish these? | Evidence shows actual pathway, not merely parallel independent development |
| S3 | Remove one entity. Does the claim survive as specifically about this A→B pair? | Claim is not a generic attribution; it specifically concerns this directed pair |

**(C) School Formation**

| # | Challenge | Pass condition |
|---|---|---|
| S1 | Remove institutional record. Does the intellectual lineage survive? | Student network and shared methodology persist without the formal institution |
| S2 | Remove founder attribution. Does a competing founder emerge? | No alternative founder with stronger claim exists in the source material |
| S3 | Apply narrow "school" definition (≥3 direct doctoral students with shared methodology). Does it hold? | At least 3 direct students identifiable with shared approaches |

**(D) Priority / Independent Development**

| # | Challenge | Pass condition |
|---|---|---|
| S1 | Remove publication dates. Does independence still hold? | Evidence of no citation or communication between A and B at time of formulation |
| S2 | Remove one of the two entities. Is the claim specifically about this pair? | Claim is about A and B specifically, not a generic "X was formalized in period Y" |
| S3 | Require causal claim ("A caused B"). Does the `weaker_rendering` correctly reject this? | `weaker_rendering` explicitly excludes causation; scope restriction is in the fact text, not only in provenance |

**Auto-promote rule**: All 3 challenges PASS → AssuranceLevel L0 → L1. The `stress_validation` block in the RSTMDB entry is populated:

```json
"stress_validation": {
  "claim_type": "A",
  "challenges_run": ["S1", "S2", "S3"],
  "results": ["PASS", "PASS", "PASS"],
  "promoted_at": "<ISO 8601>",
  "promoted_to": "L1"
}
```

---

## Decision 4: Human Review Queue Format

**Decision**: Failed claims are serialized to a structured Markdown file in `docs/ingestion-queue/` (versioned in git). One file per school document batch. Machine re-ingestion is possible after reviewer edits, via the same pipeline.

**Rationale**: Human reviewers need readable context, not raw JSON. The queue file must be actionable — each entry contains enough context to accept/reject without re-reading the source.

**Per-entry format**:

```markdown
## [QUEUE-NNN] Claim requires human review

**Source**: `docs/research/<school>-school.md` § "<Section heading>"
**Ingestion date**: YYYY-MM-DD
**Status**: Pending review

### Claim (weaker_rendering)
<The simplified KB entry from the CSC card>

### Why it failed STRESS
**Claim type**: <A|B|C|D>
**Challenge**: S<n> — <challenge description>
**Result**: FAILS — <one sentence explaining why the rendering doesn't survive this challenge>

### CSC scope boundary
**unsupported_use**: <from CSC card>
**reopen_trigger**: <from CSC card>

### DRR decision
**consequences**: <from DRR card — what downstream reasoning cannot do with this entry>

### Reviewer options
- [ ] **ACCEPT with scope restriction**: Narrow `weaker_rendering` to:
      "<proposed narrowed claim>" → re-run STRESS → promote to L1
- [ ] **REJECT**: Remove from KB
- [ ] **DEFER with research task**: Create spike to resolve: <specific open question>
- [ ] **ACCEPT AS SPECULATIVE**: Keep at AssuranceLevel L0; visible in DETECT gap reports as unverified

**Assigned reviewer**: (unassigned)
**Resolution deadline**: (none)
```

---

## Decision 5: Relationship to ADR-009

ADR-009 Decision 1 REJECTED replacing the 5 Infer verbs with FPF's Canonical Reasoning Cycle. This ADR does not contradict that decision.

ADR-009 rejected FPF *as a replacement* for the 5 verbs. This ADR uses FPF *as the extraction protocol* at the L0 boundary — the stage before the Infer engine operates. The FPF bridge prompt operates on raw Markdown text; the Infer STRESS verb operates on KB facts. These are sequential pipeline stages, not competing alternatives.

ADR-009 explicitly noted that criterium uses FPF for its abduction stage (Abduction (FPF) → Deduction (Infer) → Induction (pctl-rs)). This ADR instantiates that abduction stage for school document ingestion.

---

## Pipeline Script Outline

Full implementation is a separate task. This outline specifies the interface contract.

```python
# ingest_school_doc.py
# Usage: uv run python ingest_school_doc.py <school-doc.md> [--dry-run]

import json, sys
from pathlib import Path

def extract_claims(section_text: str, model: str) -> list[dict]:
    """Call LLM with genealogy-mode bridge prompt. Returns list of {csc, drr, efp} dicts."""
    ...

def validate_fpf_cards(cards: list[dict]) -> list[dict]:
    """Schema check: all required fields present, rendering_type valid enum.
    Returns validated cards; logs and drops malformed ones."""
    ...

def ingest_to_rstmdb(card: dict, source_doc: str, section: str) -> str:
    """Write fact + provenance to RSTMDB WAL. Returns assigned fact_id."""
    ...

def run_stress_challenges(fact_id: str, claim_type: str, card: dict) -> dict:
    """Run 3 typed STRESS challenges against the ingested fact.
    Returns {challenges: [...], results: [...], verdict: PASS|FAIL, failing_challenge: str|None}"""
    ...

def promote_to_l1(fact_id: str, stress_results: dict):
    """Update RSTMDB entry: assurance_level L0 → L1, populate stress_validation block."""
    ...

def write_review_queue_entry(fact_id: str, card: dict, source_doc: str,
                             section: str, stress_results: dict, queue_file: Path):
    """Append QUEUE-NNN entry to the human review queue Markdown file."""
    ...

def ingest_document(doc_path: Path, dry_run: bool = False):
    sections = parse_sections(doc_path)          # split by ## headings
    model = route_model(doc_path)                # DeepSeek for science/math, Claude for Orthodox

    for section in sections:
        raw_cards = extract_claims(section.text, model)
        valid_cards = validate_fpf_cards(raw_cards)

        for card in valid_cards:
            if dry_run:
                print(json.dumps(card, indent=2))
                continue

            fact_id = ingest_to_rstmdb(card, str(doc_path), section.heading)
            claim_type = infer_claim_type(card)   # A/B/C/D from dataflow structure

            if card["efp"]["rendering_type"] == "SpeculativeRetelling":
                write_review_queue_entry(fact_id, card, str(doc_path),
                                         section.heading, {}, queue_file)
                continue

            stress = run_stress_challenges(fact_id, claim_type, card)

            if stress["verdict"] == "PASS":
                promote_to_l1(fact_id, stress)
            else:
                write_review_queue_entry(fact_id, card, str(doc_path),
                                         section.heading, stress, queue_file)
```

**Model routing rule** (per `docs/research/semantic-vm-grace-deepseek-dsa.md`):
- DeepSeek V3.2: school documents with scientific/mathematical content (GRPO training = better STRESS accuracy, no sycophancy)
- Claude: school documents with Orthodox/theological content (Florensky-Losev, Byzantine, Islamic Golden Age)

---

## Pilot: 2 School Documents

### Pilot 1: Kolmogorov School (`kolmogorov-school.md`)

**Claim K-1 — Direct Transmission (Type A)**

Source passage: "with the Mathematics Genealogy Project recording 82 direct doctoral students and over 4,600 academic descendants"

```
DATAFLOW:
P[1]: Kolmogorov, MSU, 1929–1987
P[2]: Mathematical methodology across probability theory, topology, dynamical systems, AIT
P[3]: Mathematics Genealogy Project records; 82 doctoral dissertation supervisions
P[4]: 82 direct students; ~4,600 multi-generation academic descendants
S[1]: MGP records formal PhD supervision as the transmission evidence
C: Kolmogorov supervised 82 doctoral students at MSU, making his school one of the largest
   mathematical lineages of the 20th century
F[1]: MGP coverage of Soviet-era dissertations is incomplete; count may be higher
F[2]: "doctoral supervisor" ≠ "intellectual mentor" — scope is formal supervision only
```

```json
{
  "csc": {
    "stronger_source": "MGP records 82 direct doctoral students under Kolmogorov, but Soviet-era MGP coverage is incomplete; actual count may be higher. The 4,600 descendant figure is transitive and subject to propagation methodology.",
    "weaker_rendering": "Kolmogorov supervised at least 82 doctoral students at MSU (Mathematics Genealogy Project), establishing one of the largest mathematical schools of the 20th century.",
    "supported_use": "School scale comparison; genealogy graph node sizing; Soviet mathematical productivity analysis",
    "unsupported_use": "Exact count claims; arguing Kolmogorov's influence was purely supervisory rather than intellectual",
    "reopen_trigger": "Access to Soviet-era dissertation archives not covered by MGP"
  },
  "drr": {
    "context": "Ingesting Kolmogorov school scale claims for Science Genealogy graph",
    "decision": "Use MGP count with 'at least' qualifier; drop 4,600 descendant count as methodologically uncertain",
    "consequences": "Cannot use this entry for precise count comparisons; only for order-of-magnitude school size",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "SourcePinned",
    "source_anchors": ["Mathematics Genealogy Project — Kolmogorov entry", "kolmogorov-school.md §1 Overview"],
    "admissible_faces": ["School size comparison", "Kolmogorov school graph node", "Soviet mathematical productivity"]
  }
}
```

STRESS (Type A):
- S1: Remove MGP citation → independent evidence remains (Arnold, Sinai, Dynkin are documented Kolmogorov students in multiple sources) → **PASS**
- S2: Remove MSU institutional affiliation → teacher-student relationships documented independently in biographical literature → **PASS**
- S3: Reverse direction ("Kolmogorov was a student of his 82 students") → claim clearly collapses; direction unambiguous → **PASS**

**Result: AUTO-PROMOTE to L1**

---

**Claim K-2 — Priority Claim (Type D)**

Source passage: "entered MSU 1920 ... by 1925 had already published ten papers ... completed his doctorate in 1929"

```
DATAFLOW:
P[1]: Kolmogorov, MSU student, 1920–1929
P[2]: Research output during undergraduate period
P[3]: Documented publications including the 1922 Fourier series divergence paper
P[4]: ~10 publications before completing undergraduate degree
S[1]: 1922 Fourier paper is independently verifiable as a major result; count from secondary sources
C: Kolmogorov published approximately 10 research papers as an undergraduate (1920–1925)
F[1]: "10 papers" from hagiographic secondary sources; may aggregate different publication types
F[2]: No causal claim — Kolmogorov's early productivity does not imply it caused later work
```

```json
{
  "csc": {
    "stronger_source": "The 'ten papers by 1925' claim is from secondary biographical sources; the precise count is unverified against a primary bibliography. The 1922 Fourier divergence paper is independently verifiable as a major result published ~3 years into his undergraduate study.",
    "weaker_rendering": "Kolmogorov published approximately 10 papers as an undergraduate (1920–1925), including the landmark 1922 result on divergent Fourier series.",
    "supported_use": "Kolmogorov early productivity; biographical context; Moscow mathematical tradition precocity",
    "unsupported_use": "Precise count comparisons with other mathematicians without equivalent source quality",
    "reopen_trigger": "A verified complete Kolmogorov bibliography with publication dates from primary sources"
  },
  "drr": {
    "context": "Capturing Kolmogorov's early research output as a genealogy graph node attribute",
    "decision": "Use 'approximately 10' with the 1922 paper as the anchor; drop exact count",
    "consequences": "Cannot use for quantitative early-productivity comparisons",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "Reconstruction",
    "source_anchors": ["kolmogorov-school.md §2 Biography (secondary sources)", "1922 Fourier paper (independently verifiable)"],
    "admissible_faces": ["Biographical context", "School precocity metrics"]
  }
}
```

STRESS (Type D):
- S1: Remove publication dates → the 1922 Fourier result is documented as a major early paper; productivity claim survives removal of precise count → **PASS**
- S2: Remove "Kolmogorov" → claim collapses; it is specifically about Kolmogorov's individual record → **PASS**
- S3: Require causal claim ("early papers caused later success") → `weaker_rendering` makes no causal claim; the fact stands as biographical context only → **PASS**

**Result: AUTO-PROMOTE to L1**

---

### Pilot 2: Florensky-Losev School (`florensky-losev-school.md`)

**Claim F-1 — Direct Transmission (Type A)**

Source passage: "Bugaev's student Dmitry Egorov taught Florensky directly; Egorov also taught Kolmogorov and Luzin. Florensky was thus at the root of the same mathematical tradition that produced measure theory and modern probability."

```
DATAFLOW:
P[1]: Nikolai Bugaev, MSU, 1840s–1903
P[2]: Slavophile mathematical philosophy: discontinuous functions, singularities as primary
P[3]: Bugaev→Egorov (direct student); Egorov→{Florensky, Kolmogorov, Luzin} at MSU
P[4]: Shared root lineage: Moscow function theory, measure theory, Florensky's geometric work
S[1]: All three (Florensky, Kolmogorov, Luzin) have documented study under Egorov at MSU
C: Florensky shared the same training lineage as Kolmogorov and Luzin through Bugaev→Egorov at MSU
F[1]: "Shared lineage" ≠ "shared research program" — Florensky left mathematics for theology in 1904
F[2]: Scope: genealogical connection through Bugaev/Egorov only; intellectual divergence complete ~1910
```

```json
{
  "csc": {
    "stronger_source": "Florensky, Kolmogorov, and Luzin all passed through the Moscow mathematical tradition via Bugaev's students (primarily Egorov). However, Florensky left mathematics for theology in 1904, before Luzin's seminar (1920s) shaped Kolmogorov's research program. The genealogical link is real; the intellectual divergence is complete by ~1910.",
    "weaker_rendering": "Florensky, Kolmogorov, and Luzin share a mathematical training lineage through Bugaev→Egorov at MSU, though Florensky's career diverged from mathematics to theology by 1904.",
    "supported_use": "Genealogy graph edges: Bugaev→Egorov→{Florensky, Kolmogorov, Luzin}; identifying shared roots of the Moscow mathematical tradition",
    "unsupported_use": "Claiming Florensky belongs to the same intellectual school as Kolmogorov or Luzin after 1904; attributing Luzitania influence to Florensky",
    "reopen_trigger": "Evidence of Florensky engaging with Luzin's or Kolmogorov's mathematical work after 1904"
  },
  "drr": {
    "context": "Connecting Florensky-Losev school to the broader Moscow mathematical tradition in the genealogy graph",
    "decision": "Record the Bugaev-Egorov lineage as a graph edge; annotate the 1904 divergence explicitly",
    "consequences": "Cannot use this edge to imply shared research agenda or cross-citation between Florensky and the Kolmogorov/Luzin school after 1904",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "SourcePinned",
    "source_anchors": ["florensky-losev-school.md §2 Florensky biography", "kolmogorov-school.md §1 Historical Context (Luzin/Bugaev connection)"],
    "admissible_faces": ["Moscow mathematical tradition graph", "School root identification", "Bugaev node connections"]
  }
}
```

STRESS (Type A):
- S1: Remove MGP/MSU institutional record → Egorov's students are documented in multiple independent biographical sources → **PASS**
- S2: Remove MSU affiliation → teacher-student relationships documented independently → **PASS**
- S3: Reverse direction ("Kolmogorov transmitted to Florensky") → claim clearly collapses; Florensky predates Kolmogorov's research career → **PASS**

**Result: AUTO-PROMOTE to L1**

---

**Claim F-2 — Priority Claim (Type D)**

Source passage: "Florensky reached the same formal structure thirteen years before Bohr and seventeen years before Gödel"

```
DATAFLOW:
P[1]: Florensky, "The Pillar and Ground of the Truth," 1914 — antinomy formalized
P[2]: Formal structure: simultaneous affirmation of logically contradictory propositions as irreducible
P[3]: Bohr 1927 (wave-particle complementarity), Gödel 1931 (unprovable-yet-true statements)
P[4]: Three independent derivations of the same formal structure across theology, physics, mathematics
S[1]: Florensky's 1914 antinomy predates Bohr (1927) by 13 years and Gödel (1931) by 17 years
C: Florensky independently formalized antinomy as an inexpressible-yet-real structure 17 years before Gödel
F[1]: "Same formal structure" requires scoping: structural isomorphism ≠ logical equivalence
F[2]: Independence is certain (no communication; Florensky was executed before Gödel's proof became famous)
F[3]: Whether Florensky's theological antinomy is formally equivalent (not merely analogous) to
      Gödel incompleteness is an open mathematical question
```

```json
{
  "csc": {
    "stronger_source": "Florensky's 1914 *Pillar* formulated theological antinomy as simultaneously-true contradictions inexpressible within a formal system — a structure isomorphic to Gödel's incompleteness (1931). Independence is certain (no communication; chronological precedence confirmed). However, formal equivalence is contested: Florensky's framework is phenomenological, not proof-theoretic. The isomorphism is philosophical, not a mathematical derivation.",
    "weaker_rendering": "Florensky's 1914 antinomy formulation and Gödel's 1931 incompleteness theorem independently formalized the concept that some propositions are real but formally inexpressible; no causal or proof-theoretic link exists.",
    "supported_use": "Independent parallel development taxonomy; history-of-ideas genealogy; positioning Florensky in apophatic epistemology lineage",
    "unsupported_use": "Claiming Florensky influenced Gödel; claiming proof-theoretic equivalence; assigning Florensky causal credit in mathematical logic genealogy",
    "reopen_trigger": "A formal proof that Florensky's antinomy system is proof-theoretically equivalent to Gödel sentences"
  },
  "drr": {
    "context": "Placing Florensky in the science genealogy graph relative to formal logic history",
    "decision": "Record as independent parallel development; exclude from causal transmission paths to Gödel or the Vienna Circle",
    "consequences": "Cannot use this claim in a proof chain that assigns Florensky influence weight in the mathematical logic genealogy",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "Reconstruction",
    "source_anchors": ["florensky-losev-school.md §2 Mathematical Contributions", "Florensky 1914 *Pillar and Ground of the Truth*"],
    "admissible_faces": ["Independent parallel development taxonomy", "Apophatic epistemology lineage", "History of logic — informal precursors"]
  }
}
```

STRESS (Type D):
- S1: Remove publication dates → independence still holds (evidence of no communication between Florensky and Gödel is independent of the precise chronology) → **PASS**
- S2: Remove one entity → claim is specifically about the Florensky/Gödel pair, not a generic attribution → **PASS**
- S3: Require causal claim ("Florensky caused Gödel's incompleteness") → **FAILS**: the original source passage uses the phrase "reached the same formal structure" which the `weaker_rendering` correctly scopes, but the phrase "structurally isomorphic" in a KB fact could be misread as implying proof-theoretic equivalence or influence. The scope restriction is in the provenance annotation, not embedded in the fact text itself. The fact needs the exclusion stated positively in the `weaker_rendering`.

**Result: HUMAN REVIEW**

```markdown
## [QUEUE-001] Claim requires human review

**Source**: `docs/research/florensky-losev-school.md` § "Mathematical and Scientific Contributions"
**Ingestion date**: 2026-05-05

### Claim (weaker_rendering)
Florensky's 1914 antinomy formulation and Gödel's 1931 incompleteness theorem independently
formalized the concept that some propositions are real but formally inexpressible; no causal
or proof-theoretic link exists.

### Why it failed STRESS
**Claim type**: D (Priority)
**Challenge**: S3 — Require causal claim: does the `weaker_rendering` positively exclude causation?
**Result**: FAILS — "structurally isomorphic" (from the original CSC draft) is not in this
`weaker_rendering`, but the phrase "independently formalized the concept" could still be read as
implying that Florensky's formulation informed Gödel's, since "the concept" implies shared
intellectual territory. The scope restriction must be stated in the fact, not only in provenance.

### CSC scope boundary
**unsupported_use**: Claiming Florensky influenced Gödel; claiming proof-theoretic equivalence
**reopen_trigger**: A formal proof that Florensky's antinomy system is proof-theoretically equivalent to Gödel sentences

### DRR consequences
Cannot use this claim in a proof chain that assigns Florensky influence weight in the
mathematical logic genealogy.

### Reviewer options
- [ ] **ACCEPT with scope restriction**: Narrow `weaker_rendering` to:
      "Florensky (1914) and Gödel (1931) independently arrived at the formal structure of
       inexpressible-yet-real propositions in theology and mathematics respectively;
       no transmission pathway or proof-theoretic equivalence exists between the two."
      → re-run STRESS S3 → promote to L1
- [ ] **REJECT**: Remove from KB
- [ ] **DEFER with research task**: Spike: is Florensky's antinomy proof-theoretically
      equivalent to a Gödel sentence? (formal open question)
- [ ] **ACCEPT AS SPECULATIVE**: Keep at L0; surface in DETECT gap reports as unverified
```

---

## Aggregate Pilot Assessment

| Claim | School | Type | rendering_type | STRESS | Route |
|---|---|---|---|---|---|
| Kolmogorov 82 students | Kolmogorov | A | SourcePinned | S1✓ S2✓ S3✓ | L1 auto-promote |
| Kolmogorov ~10 early papers | Kolmogorov | D | Reconstruction | S1✓ S2✓ S3✓ | L1 auto-promote |
| Bugaev→Egorov→{F,K,L} lineage | Florensky-Losev | A | SourcePinned | S1✓ S2✓ S3✓ | L1 auto-promote |
| Florensky antinomy ∥ Gödel | Florensky-Losev | D | Reconstruction | S1✓ S2✓ S3✗ | Human review |

3 of 4 claims auto-promote to L1. 1 routes to human review with a specific narrowing instruction that, if applied, would pass STRESS on re-run. This matches expected pipeline behavior: well-sourced factual claims promote automatically; interpretive claims with scope risk route for review.

**Pilot finding**: The S3 challenge ("require causal claim — does the `weaker_rendering` positively exclude causation?") is the most sensitive challenge for Type D priority claims in humanities domains. Reconstruction-type cards about parallel development will frequently trigger S3 because the language of parallelism ("independently formalized," "reached the same structure") contains residual ambiguity about causal direction. Human reviewers should prioritize S3-failed claims — the fix is usually a single sentence addition, not a rejection.

---

## Implementation Notes

**This ADR defines architecture; the pipeline script is a separate implementation task.**

- **Bridge prompt school variant**: Add the genealogy-mode STEP 1 to `docs/prompts/grace-to-fpf-bridge-prompt.md` as a variant section.
- **fpf-cards Rust crate (zse-q48)**: Stage 2 validation depends on this crate. Until zse-q48 ships, use a JSON schema check against the CSC/DRR/EFP field definitions above.
- **RSTMDB write schema**: Ratification with docs-1zv (bitemporal schema convention ADR) required before implementation.
- **Neo4j projection**: Out of scope here. The Neo4j graph is populated by reading from RSTMDB, not by direct ingestion.
- **Review queue location**: `docs/ingestion-queue/<school-slug>-queue.md`. One file per source document batch.

---

## Summary

| # | Decision |
|---|---|
| 1 | ADOPT GRACE-to-FPF bridge prompt as extraction layer; genealogy-mode adaptation adds P[1]→P[4] transmission dataflow |
| 2 | RSTMDB is the canonical write store; Neo4j is a read projection; F-G-R derived from EFP rendering_type |
| 3 | STRESS harness: 4 claim types (A/B/C/D), 3 challenges each; all PASS → L1 auto-promote; any FAIL → human review |
| 4 | Human review queue: structured Markdown with claim, failing challenge, CSC scope, and 4 reviewer options |
| 5 | This ADR operationalizes ADR-009's FPF-as-abduction-stage position for school document ingestion; no conflict with Decision 1 (reject FPF replacing 5 verbs) |

---

*ADR produced as part of TASK-125 (docs-1nu): LLM + Infer STRESS-validated knowledge ingestion pipeline*
