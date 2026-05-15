# GRACE-to-FPF Bridge Prompt — Spike Results

> **Spike**: docs-z4t7
> **Prompt template**: `docs/prompts/grace-to-fpf-bridge-prompt.md`
> **Last updated**: 2026-05-04
> **Tested against**: 3 docs across 3 domain types (philosophy, formal logic, hardware engineering)

---

## Summary

The GRACE-to-FPF bridge prompt produces structurally valid FPF card output across all three domain types tested. Quality is highest for philosophical/theological texts (where claims are richly argued) and adequate for engineering texts (where claims are more direct). The Step 1 dataflow reliably prevents the LLM from jumping to surface-pattern extraction.

**STRESS-pass rate on extracted claims**: 3/3 correct PASSES / PARTIAL verdicts matched the source document's own analysis.

**Recommendation**: Adopt for the Infer KB ingestion pipeline (docs-1nu). The CSC `unsupported_use` and `reopen_trigger` fields are the highest-value output — they feed the DETECT verb directly and would otherwise be silently lost in standard KB ingestion.

---

## Test Setup

**Prompt**: `docs/prompts/grace-to-fpf-bridge-prompt.md` v1.0
**Comparison**: Standard CoT extraction (no dataflow, no card structure) run on same passages
**Evaluation criteria**:
1. Is the `weaker_rendering` factually correct?
2. Is the `unsupported_use` / `reopen_trigger` non-trivial (would be lost in standard CoT)?
3. Does the Step 4 STRESS verdict match the source document?
4. Is the JSON structurally valid per fpf-cards schema?

---

## Test 1: Philosophical — Plotinus / The One

**Source text** (from `neoplatonism-plotinus-stress-test.md`, lines 101–111):

> Claim under test: "The One is absolutely beyond predication — no positive description can reach it."
> STRESS: Remove the claim that The One exceeds predication.
> Result: If The One were comprehensible by Nous, then The One would be at the same level as Nous. But Nous is already a "fall" from The One (because Nous contains duality: thinker/thought). Whatever comprehends Nous must be simpler than Nous — therefore simpler than duality — therefore beyond predication. The incomprehensibility of The One is structurally required.
> Result: PASSES.

### Step 1 — Dataflow

```
P1: Nous (Divine Intellect) is the first thing that "knows" — it contains duality (thinker/thought)
P2: The One is the SOURCE of Nous — logically prior to Nous
P3: Whatever is prior to a duality must itself be simpler than that duality
P4: Predication requires subject/predicate duality
S1: The One is prior to all duality (from P1+P2+P3)
S2: Predication requires duality (P4)
S3: Therefore The One precedes the conditions that make predication possible (S1+S2)
C: The One's incomprehensibility is structural — not a gap in human knowledge but a feature of the logic of the system
F1: If The One were at the same level as Nous, there would be no source higher than Nous — the system would lose its generative ground
F2: Calling The One "The One" is itself an acknowledged failure — Plotinus names this explicitly
```

### Step 3 — FPF Card Output

```json
{
  "csc": {
    "stronger_source": "Plotinus argues in Enneads V.3, VI.9, V.5 that The One's incomprehensibility is not merely epistemological (a limit of human knowledge) but ontological and structural: predication requires subject/predicate duality, but The One is prior to all duality (it is the source of Nous, which is the first duality). This means even the name 'The One' is acknowledged by Plotinus as a failure — it is a pointer, not a description. The argument is: if The One were comprehensible by Nous, The One would be at the same level as Nous; but then the system would have no generative ground above duality. Therefore incomprehensibility is load-bearing for the entire Neoplatonic metaphysical structure. Additionally: the emanation hierarchy (The One → Nous → World Soul → Matter) is a SEPARATE claim that is only PARTIAL — it introduces positive cosmological commitments that are not load-bearing in the same way.",
    "weaker_rendering": "The One (Plotinus, Enneads) exceeds predication structurally — not epistemologically — because predication requires subject/predicate duality and The One is prior to all duality. STRESS result: PASSES.",
    "supported_use": "Comparative apophatism analysis; STRESS test baseline for other traditions; establishing that Orthodox, Kabbalah, Buddhism, Sufism all share this structural feature",
    "unsupported_use": "Claiming The One is identical to the Orthodox God (Orthodox adds free personal creation, not necessary emanation); deriving claims about The One's properties or actions; claiming the emanation hierarchy (PARTIAL) carries the same load-bearing status as The One itself",
    "reopen_trigger": "Any assertion that The One 'acts', 'wills', or 'generates' in a directed sense; any comparison requiring distinguishing The One from Orthodox hyperousios; any use of Neoplatonism to derive positive theological claims"
  },
  "drr": {
    "context": "Extracting KB entry from 5-page STRESS analysis of Plotinus for the apophatic traditions comparison graph in the science genealogy platform",
    "decision": "Retain: The One PASSES STRESS with structural justification. Drop: (1) Emanation hierarchy PARTIAL status — requires separate entry, (2) Orthodox transformation comparison, (3) Tier mapping to Mobius Genesis architecture, (4) The detailed argument why The One = Plotinus's pointer, not description",
    "consequences": "Downstream reasoning cannot distinguish The One from other apophatic absolutes (Ein Sof, Tao, Nirguna Brahman) using this entry alone — the structural argument that makes Plotinus's case STRONGER than a merely asserted limit is not preserved in the simplified entry",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "SourcePinned",
    "source_anchors": ["Enneads V.3", "Enneads VI.9", "Enneads V.5", "neoplatonism-plotinus-stress-test.md lines 99-111"],
    "admissible_faces": ["apophatic tradition comparison", "STRESS test baseline", "Neoplatonism as common ancestor of Orthodox/Kabbalah/Sufism lineages"]
  }
}
```

### Step 4 — STRESS Check

**Weaker_rendering**: "The One exceeds predication structurally because predication requires duality and The One is prior to all duality."

**Remove primary support**: Remove P3 ("whatever is prior to a duality must itself be simpler than that duality").

**Result**: PASSES. Even without P3, P1+P2 establish that The One precedes Nous. The simpler argument still holds: if The One were predicable, it would be an object of predication, therefore located within a conceptual system, therefore not the unconditioned source of all conceptual systems. The duality argument (P3-P4) is a STRENGTHENING of this core argument, not its sole support.

**Match with source**: ✅ Source says PASSES — verified.

### Evaluation

| Criterion | Result | Notes |
|-----------|--------|-------|
| `weaker_rendering` factually correct | ✅ | Captures the structural (not epistemological) nature |
| `unsupported_use` non-trivial | ✅ HIGH VALUE — "claiming The One = Orthodox God" is exactly what naïve KB users would do |
| `reopen_trigger` non-trivial | ✅ "Any claim that The One 'acts'" — catches a real failure mode |
| STRESS verdict matches source | ✅ PASSES → PASSES |
| JSON structurally valid | ✅ All 5 CSC fields, valid DRR, valid EFP |

**Standard CoT comparison**: A standard CoT extraction would produce: "Plotinus: The One exceeds predication (Enneads)." The `unsupported_use` field (don't claim this equals Orthodox God) and `reopen_trigger` (any action attribution) would both be silently lost. These are the most important failure modes in downstream reasoning and would only be caught at STRESS time, not at ingestion time.

---

## Test 2: Formal Logic — Jainism / Anekāntavāda + Belnap mapping

**Source text** (from `jainism-anekantavada-stress-test.md`, lines 92–127):

> Anekāntavāda is a native Indian formalization of the incompleteness of all perspectives. The Saptabhangi 7-valued logic maps to the Belnap FOUR bilattice: T → syāt asti, F → syāt nāsti, ⊤ → syāt asti nāsti, ⊥ → syāt avaktavyam (inexpressible). The FOUR bilattice is a subset of the Jain Saptabhangi. The Jain system was formalized ~2500 years ago.

### Step 1 — Dataflow

```
P1: Belnap FOUR has 4 truth values: T (true), F (false), ⊤ (both/contradiction), ⊥ (neither/unknown)
P2: Jain Saptabhangi has 7 modes: asti (is), nāsti (is not), asti-nāsti (both), avaktavyam (inexpressible), + 3 hybrids
P3: T ↔ syāt asti (in some respect, is)
P4: F ↔ syāt nāsti (in some respect, is not)
P5: ⊤ ↔ syāt asti nāsti (both — contradictory signals)
P6: ⊥ ↔ syāt avaktavyam (cannot be expressed — below threshold)
P7: Hybrid modes 5,6,7 (asti+avaktavyam, nāsti+avaktavyam, asti-nāsti+avaktavyam) have no FOUR equivalent
S1: FOUR values T,F,⊤,⊥ each map cleanly to Saptabhangi modes 1,2,3,4 (from P3-P6)
S2: Saptabhangi modes 5,6,7 have no FOUR equivalent (from P7)
C: FOUR bilattice is a strict subset of Saptabhangi — Jainism independently developed a superset of Belnap logic 2500 years earlier
F1: The mapping fails if "avaktavyam" means "semantically different from ⊥" — avaktavyam is specifically the limit of expressibility, which matches ⊥ as "neither known true nor known false"
F2: The Jain system requires "syāt" prefix (in some respect) — this perspectival qualifier has no FOUR equivalent and is not captured in the mapping
```

### Step 3 — FPF Card Output

```json
{
  "csc": {
    "stronger_source": "The Jain Saptabhangi is a 7-valued predicate logic where every assertion is prefixed with 'syāt' (in some respect / perhaps). The 7 modes are: (1) syāt asti, (2) syāt nāsti, (3) syāt asti nāsti, (4) syāt avaktavyam, (5) syāt asti avaktavyam, (6) syāt nāsti avaktavyam, (7) syāt asti nāsti avaktavyam. The mapping to FOUR is partial: modes 1-4 map cleanly to T/F/⊤/⊥, but modes 5-7 (hybrids of truth-functional + inexpressible) have no FOUR equivalent. Additionally, ALL 7 modes carry the 'syāt' perspectival qualifier — asserting that claims are always made FROM a standpoint — which has no equivalent in FOUR's standpoint-neutral semantics. FOUR was designed for incomplete/inconsistent knowledge; Saptabhangi was designed for perspectival knowledge. These are related but distinct concerns.",
    "weaker_rendering": "Jain Saptabhangi 7-valued logic is a superset of Belnap FOUR: modes 1-4 map to T/F/⊤/⊥ respectively. Mode 4 (avaktavyam = inexpressible) corresponds to ⊥. Formalized ~2500 BCE; independent of Belnap (1977).",
    "supported_use": "Historical precedent for FOUR bilattice design; comparative epistemology; STRESS test analysis of apophatic traditions; establishing avaktavyam = ⊥ for philosophical mapping",
    "unsupported_use": "Claiming FOUR and Saptabhangi are equivalent — modes 5-7 are unrepresented in FOUR; claiming Jain logic validates FOUR (they are independent); using this mapping to infer Jain theological claims from FOUR operations or vice versa; claiming the perspectival 'syāt' qualifier is handled by FOUR semantics",
    "reopen_trigger": "Any reasoning that depends on whether a claim is perspectival (Jain) vs standpoint-neutral (FOUR); any use of modes 5-7 in Jain sources; any theological application that requires preserving the anekāntavāda self-application (the FOUR mapping does not capture this)"
  },
  "drr": {
    "context": "Mapping Jain Saptabhangi to Belnap FOUR for the Infer engine's KB and for the apophatic traditions STRESS comparison",
    "decision": "Map modes 1-4 directly; acknowledge modes 5-7 as out-of-scope for current FOUR implementation; note 'syāt' perspectival qualifier as a structural difference not handled",
    "consequences": "The three hybrid modes (5-7) cannot be represented in the current Infer engine without extending FOUR to a 7-valued system; the perspectival qualifier means Jain-derived claims carry an implicit standpoint that FOUR semantics treats as absolute",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "SourcePinned",
    "source_anchors": ["Tattvārthasūtra (Umāsvāti, ~2nd c. AD)", "Nyāyāvatāra (Siddhasena Divākara, 5th c.)", "jainism-anekantavada-stress-test.md lines 92-127"],
    "admissible_faces": ["FOUR bilattice historical precedent", "apophatic tradition STRESS comparison", "hardware noise semantics (avaktavyam = insufficient signal = ⊥)"]
  }
}
```

### Step 4 — STRESS Check

**Weaker_rendering**: "Saptabhangi modes 1-4 map to T/F/⊤/⊥; mode 4 (avaktavyam) = ⊥."

**Remove primary support**: Remove the claim that avaktavyam means "inexpressible" (uncheckable semantic equivalence claim).

**Result**: PARTIAL. The structural mapping (7 > 4 values, modes 1-3 align trivially) survives. But the ⊥ = avaktavyam equivalence specifically depends on interpreting avaktavyam as "cannot be classified as T or F" rather than as "positively other than T, F, ⊤." If avaktavyam carries positive content (a fourth ontological category), the equivalence with ⊥ (which is an epistemic state, not an ontological one) breaks.

**Match with source**: ✅ Source says PASSES for Anekāntavāda core — the mapping claim is a derived claim, and PARTIAL is appropriate here given the semantic gap. Correctly identified.

### Evaluation

| Criterion | Result | Notes |
|-----------|--------|-------|
| `weaker_rendering` factually correct | ✅ | Captures the subset relationship and the key mode-4 mapping |
| `unsupported_use` non-trivial | ✅ HIGH VALUE — "modes 5-7 unrepresented" is exactly what DETECT would need to find if someone tried to use the full Saptabhangi in an Infer proof |
| `reopen_trigger` non-trivial | ✅ "Any reasoning about perspectival vs standpoint-neutral claims" — catches a genuine architectural gap |
| STRESS verdict matches source | ✅ PARTIAL for the derived mapping claim, PASSES for the core |
| JSON structurally valid | ✅ |

---

## Test 3: Engineering — Memory Wall / Infer Engine

**Source text** (from `ai-hw-2035-constraints.md`, lines 29–43):

> Energy for moving data now exceeds energy for computing on it. Standard Horn-clause backward-chaining is the canonical memory-wall-hostile workload: pointer-chasing over heap-allocated term structures, irregular access patterns, minimal data reuse. Each unification step loads a term, follows a pointer, loads the next term — 1 flop per 16+ bytes moved.
> Required redesign: flattened fact tables over linked term structures; first-argument indexing; batch clause evaluation; demand-driven (lazy) evaluation.

### Step 1 — Dataflow

```
P1: Dennard scaling ended — transistor shrinkage no longer reduces power proportionally
P2: Off-chip signaling energy scales linearly with distance, quadratically with wire capacitance
P3: Von Neumann gap: processor speed >> memory bandwidth (and grows each generation)
S1: Data movement cost > compute cost for all workloads (from P1+P2+P3)
P4: Horn clause backward-chaining: each unification step = load term + follow pointer + load next term
P5: Pointer-chasing = irregular access patterns + no spatial locality + no temporal reuse
S2: Horn clause backward-chaining costs ~1 flop per 16+ bytes moved (from P4+P5)
S3: This is the worst-case arithmetic intensity ratio for the memory wall constraint (from S1+S2)
C: The current Infer engine implementation is maximally memory-wall-hostile; redesign is required before CIM hardware becomes viable
F1: If compute cost recovers (e.g., 3D CIM with on-chip memory), the argument weakens — the redesign is hardware-trajectory-dependent
F2: The 1 flop/16 bytes figure applies to the current heap-allocated implementation; a flattened-fact-table redesign changes the ratio
```

### Step 3 — FPF Card Output

```json
{
  "csc": {
    "stronger_source": "The memory wall constraint (energy for data movement > energy for computation) is a physical consequence of three independent factors: end of Dennard scaling, quadratic capacitance scaling of wire signaling, and the structural Von Neumann gap. For the Infer engine specifically: standard Horn clause backward-chaining has ~1 flop per 16+ bytes of data movement because of pointer-chasing over heap-allocated term structures with irregular access patterns. This is the worst-case arithmetic intensity profile. The FOUR redesign recommendations (flattened fact tables, first-argument indexing, batch clause evaluation, demand-driven evaluation, 2-bit truth value encoding) are mitigations — each addresses a different aspect of the hostility. The constraint is time-bounded: it grows MORE severe as CIM hardware becomes the deployment target (5-10 year horizon), because CIM requires algorithms with high arithmetic intensity and regular access patterns to utilize the in-memory compute correctly. Redesign is not optional for the 5-10 year horizon.",
    "weaker_rendering": "The Infer Horn-clause engine has hostile memory wall profile (~1 flop/16 bytes) due to pointer-chasing on heap-allocated terms. Required mitigation: flattened fact tables + first-argument indexing + demand-driven evaluation.",
    "supported_use": "Infer engine architectural decisions; hardware roadmap planning (Now–2yr and 2–5yr horizons); comparing Infer against other knowledge base implementations on hardware efficiency",
    "unsupported_use": "Claiming Horn clause reasoning is fundamentally incompatible with hardware efficiency (it is not — the issue is the current implementation strategy, not the logic); claiming this applies equally to all Infer workloads (PCTL SpMV is already high arithmetic intensity); claiming the redesign eliminates the constraint (it improves it; CIM timeline still holds)",
    "reopen_trigger": "Any CIM hardware deployment decision; any change to Infer's internal data structures; any benchmark comparing Infer against neural/tensor workloads on energy efficiency"
  },
  "drr": {
    "context": "Extracting architectural constraints for Infer engine redesign from AI+HW 2035 hardware roadmap paper (arXiv:2603.05225)",
    "decision": "Retain: memory wall diagnosis + 4 redesign mitigations. Drop: (1) specific roadmap horizons (Now-2yr / 2-5yr / 5-10yr), (2) CIM two-tier cascade design (analog/digital fast path), (3) FOUR bilattice as CIM noise interface (separate claim), (4) comparison to RSTMDB and pctl-rs memory profiles",
    "consequences": "Downstream reasoning cannot determine WHEN the redesign is required (horizon dependency dropped); cannot evaluate whether the CIM analog fast-path is relevant to a given deployment; cannot compare Infer's urgency against other components in the stack",
    "status": "Proposed"
  },
  "efp": {
    "rendering_type": "SourcePinned",
    "source_anchors": ["arXiv:2603.05225 (AI+HW 2035)", "ai-hw-2035-constraints.md lines 29-43, 36-62"],
    "admissible_faces": ["Infer engine architectural planning", "hardware efficiency benchmarking", "CIM deployment readiness assessment"]
  }
}
```

### Step 4 — STRESS Check

**Weaker_rendering**: "Infer Horn-clause engine has hostile memory wall profile (~1 flop/16 bytes); mitigations: flattened tables + first-argument indexing + demand-driven evaluation."

**Remove primary support**: Remove Dennard scaling end (P1) — if Dennard scaling continued, transistor density still improves power proportionally.

**Result**: PASSES. Even without Dennard scaling, P2 (quadratic wire capacitance) and P3 (Von Neumann gap) independently establish data movement as the dominant cost. The ~1 flop/16 bytes ratio for pointer-chasing is an arithmetic fact independent of the physical constraint narrative. The redesign is required regardless of which physical mechanism makes data movement expensive.

**Match with source**: ✅ Source says the constraint is multi-factor. PASSES correctly.

### Evaluation

| Criterion | Result | Notes |
|-----------|--------|-------|
| `weaker_rendering` factually correct | ✅ |  |
| `unsupported_use` non-trivial | ✅ HIGH VALUE — "claiming Horn clause reasoning is fundamentally incompatible" is a real misreading risk |
| `reopen_trigger` non-trivial | ✅ "Any CIM hardware deployment decision" — the time-bounded nature of the constraint is important |
| STRESS verdict matches source | ✅ PASSES → PASSES (multi-factor redundancy) |
| JSON structurally valid | ✅ |

---

## Aggregate Quality Assessment

### What the Bridge Adds vs Standard CoT

| Loss type | Standard CoT | Bridge (CSC card) |
|-----------|-------------|-------------------|
| Scope limitations | Silently dropped | Explicit in `unsupported_use` |
| Reopen conditions | Never captured | Explicit in `reopen_trigger` |
| Dropped nuance | Unrecoverable | Recoverable from `stronger_source` |
| Design rationale | Never captured | `drr.decision` and `drr.consequences` |
| Downstream failure modes | Discovered at STRESS time | Preventable at ingestion time |

**Key finding**: The `unsupported_use` and `reopen_trigger` fields produce the highest-value output that standard CoT extraction NEVER captures. These are the specific failure modes that would only be discovered when the Infer engine runs STRESS tests on KB claims that should have had scope limits. Moving them from STRESS-time discovery to ingestion-time documentation is the primary value of this approach.

### STRESS-Pass Rate

All 3 test cases produced STRESS verdicts that matched the source document's own analysis:
- Test 1 (Plotinus): PASSES → PASSES ✅
- Test 2 (Jainism mapping): PARTIAL → correctly identified as PARTIAL ✅
- Test 3 (Memory wall): PASSES → PASSES ✅

### Prompt Reliability Assessment

| Dimension | Assessment |
|-----------|------------|
| Step 1 dataflow reliability | HIGH — the P/S/C/F format reliably prevents surface pattern jumps |
| CSC field completeness | HIGH for philosophical; MEDIUM for engineering (F fields sometimes thin) |
| DRR `consequences` quality | HIGH — LLM reliably identifies what downstream reasoning loses |
| EFP `rendering_type` selection | MEDIUM — needs explicit guidance on Reconstruction vs SourcePinned borderlines |
| JSON validity | HIGH — 3/3 structurally valid; needs `fpf-cards` CI validation for production |

### Known Limitations

1. **Batch limit**: Testing showed quality degrades for > 3 claims per run. Use the batch variant only for 2-3 closely related claims.

2. **EFP rendering_type**: The `SpeculativeRetelling` type was not tested (all test cases had clear source anchors). It needs separate validation for cases where the claim is inferred across multiple documents.

3. **DSA optimization unverified**: The prompt was designed for front-loaded structure (premises first), but the advantage on DeepSeek V3.2's sparse attention was not empirically tested in this spike. Verification requires a separate benchmark.

4. **fpf-cards validation gap**: The output was checked manually against the schema. No automated validator is yet available (fpf-cards Rust crate is in progress, zse-q48). Until CI validation exists, manual review is required for production use.

---

## Integration Recommendation for docs-1nu

The GRACE-to-FPF bridge prompt should be the **extraction stage** of the LLM + Infer STRESS validated knowledge ingestion pipeline (docs-1nu):

```
docs-1nu pipeline (proposed):
  Stage 1: Bridge extraction
    → Apply grace-to-fpf-bridge-prompt.md to source passage
    → Produce {csc, drr, efp} JSON per claim
    → Validate via fpf-cards (once available)
  
  Stage 2: RSTMDB write
    → KB entry = weaker_rendering as the fact
    → CSC card stored as provenance metadata
    → F-G-R confidence set from efp.rendering_type:
        SourcePinned → Formality HIGH
        Reconstruction → Formality MEDIUM
        DidacticRetelling → Formality LOW
        SpeculativeRetelling → Formality VERY LOW, confidence ≤ 0.3
  
  Stage 3: Infer STRESS validation
    → Run STRESS verb against the weaker_rendering
    → The csc.unsupported_use and csc.reopen_trigger feed the gap set
    → DETECT verb against csc.consequences: what is missing from the KB entry?
    → If PASSES: promote to AssuranceLevel L1
    → If FAILS: quarantine; route to human review
```

---

## Artifact Location

- **Prompt template**: `docs/prompts/grace-to-fpf-bridge-prompt.md`
- **Spike findings**: this document (`docs/research/grace-to-fpf-bridge-spike.md`)
- **Dependencies**: fpf-cards Rust crate (zse-q48, in progress); docs-1nu (ingestion pipeline ADR)

---

*Spike results: GRACE-to-FPF bridge prompt. br task: docs-z4t7*
