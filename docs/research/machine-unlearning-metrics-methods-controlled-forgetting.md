# Machine Unlearning: Metrics, Methods, and the Knowledge Retraction Gap

> **Context**: Habr article (AiConf 2025 talk by Vadim, Raft) covers Machine Unlearning — how to measure and achieve controlled forgetting in LLMs without full retraining. User flagged as "important for us."
> **Question**: What are the concrete unlearning mechanics, and how do they map to RSTMDB triple retraction and the axspace knowledge lifecycle?
> **Last updated**: 2026-05-08
> **br task**: docs-in4c

---

## Short Answer

**Machine Unlearning is the missing "retraction" half of the RSTMDB knowledge lifecycle. RSTMDB handles symbolic forgetting (update the triple store). Machine Unlearning handles parametric forgetting (update the model weights). Without the parametric layer, a retracted RSTMDB triple is formally erased but the LLM still "remembers" — and will regenerate — the old claim under adversarial prompting.**

```
CURRENT RSTMDB LIFECYCLE:
  Claim ingested → RSTMDB triple created (valid_from: T₁)
  Claim retracted → triple marked (valid_until: T₂)
  ✓ Symbolic store is correct
  ✗ LLM parametric weights still contain the retracted claim
  ✗ Under different context or adversarial attack: old claim reproduced

COMPLETE LIFECYCLE (with Machine Unlearning):
  Claim ingested → RSTMDB triple created
  Claim retracted → RSTMDB triple marked invalid
                  → Machine Unlearning applied to LLM weights
                  → MIA probe confirms: model no longer reproduces claim
  ✓ Symbolic store is correct
  ✓ Parametric store is also correct
  ✓ Adversarial reproduction blocked
```

---

## Metrics Taxonomy

Three categories. All three must be tracked simultaneously — optimizing only one produces systems that pass tests but not real-world retraction requirements.

### Category 1: Forgetting Metrics

**Unlearn Accuracy** — inverted accuracy: success = model produces *wrong* answer for forgotten data. Target: low (ideally ≈ random chance for classification, no verbatim reproduction for generation).

**MIA (Membership Inference Attack) Score** — adversary builds a classifier: given model behavior, predict whether sample X was in training data. Metrics: Accuracy, AUC-ROC, TPR@FPR. Post-unlearning success = MIA classifier is at chance (AUC ≈ 0.5). If MIA classifier still works, the data is still parametrically present even if formally deleted.

**Memorization Score** — how much the model continues to reproduce forgotten content, ranging from verbatim text reproduction to factual knowledge retention. Used in MUSE benchmark.

**Privacy Metrics** — direct extraction attacks: can you recover the original training example from model outputs? Post-unlearning success = extraction fails.

### Category 2: Utility Preservation Metrics

**Retain Accuracy (Locality)** — standard accuracy on data NOT in the forget set. The key constraint: high Retain Accuracy AND low Unlearn Accuracy simultaneously. This is the fundamental tension.

**Domain-Specific Quality**:
- Classification: Precision / Recall / F1
- Generation: BLEU / ROUGE / BERTScore
- General knowledge: MMLU, MT-Bench scores

### Category 3: Computational Efficiency

| Metric | Meaning |
|---|---|
| Unlearning Time | Wall-clock duration to process a retraction |
| Memory (RAM/VRAM) | Resource cost during the unlearning run |
| FLOPs / GPU-hours | Total compute — critical for comparing methods |

---

## Methods Survey

### Parametric Methods (modify model weights)

#### 1. Gradient Ascent

Reverse gradient descent: instead of minimizing loss on forget-set examples, maximize it. Updates parameters to make the model wrong on the forgotten data.

```
Standard training:  θ ← θ - α · ∇L(θ, forget_set)   [minimize loss]
Gradient Ascent:    θ ← θ + α · ∇L(θ, forget_set)   [maximize loss]

Combined objective: L_total = L_forget_ascent + λ · L_retain_descent
  λ controls trade-off: high λ = preserve utility; low λ = stronger forgetting
```

**Pros**: fast, simple, no architectural changes required.
**Cons**: unstable — gradient ascent can degrade retain-set performance catastrophically if λ not carefully tuned.

#### 2. Fisher-Based Methods

Use second-order information (Hessian approximations) to more precisely identify which parameters encode the forgotten data.

**Fisher Forgetting** (gentler): adds Gaussian noise to weights, weighted by Fisher information matrix. Perturbs parameters in directions the model is sensitive to, without aggressive updates. Better retain-quality, can be run repeatedly.

**Fisher Removal** (stronger): combines second-order information from retain-set with first-order from forget-set. More reliable erasure of targeted information. Higher compute cost.

```
Weight update direction:   F_retain^{-1} · ∇L(θ, forget_set)
  F_retain = Fisher matrix from retain-set (approximated, e.g. diagonal)
  Result: updates in directions that maximally damage forget-set recall
          while minimally damaging retain-set recall
```

#### 3. Knowledge Distillation

Conceptually the cleanest method for post-fine-tuning scenarios:

```
1. Teacher = original model (before fine-tuning on data to be forgotten)
2. Student = fine-tuned model (contains unwanted knowledge)
3. Pass forget-set through Teacher → clean predictions (teacher never saw this data)
4. Train Student to match Teacher's predictions on forget-set
Result: Student unlearns fine-tuning effect; Teacher's clean behavior transfers
```

**Pros**: natural for our axspace use case — if we have the pre-triple-ingestion model as teacher.
**Cons**: requires access to a clean "teacher" checkpoint; storage overhead.

#### 4. SISA (Sharding, Isolation, Slicing, Aggregation)

Architectural method — requires design at training time, not a post-hoc fix:

```
SHARDING:  Dataset D split into k disjoint shards S₁...Sₖ
           Each training example in exactly one shard

ISOLATION: Train separate model M₁...Mₖ — one per shard
           No information exchange between models during training

SLICING:   Within each shard, training divided into temporal slices
           Checkpoint saved after each slice
           When example x ∈ Sᵢ must be deleted: rollback Mᵢ to the
           checkpoint before x was introduced, retrain only from there

AGGREGATION: Final predictions = ensemble(M₁...Mₖ) via majority vote
             or averaging
```

**Unlearning cost**: O(1/k × 1/slices) of full retraining — only affected shard/slice is retouched.
**Guarantees**: exact (not approximate) unlearning — the deleted example never affected any checkpoint after the rollback point.
**Cons**: inference cost multiplied by k; designed before training; storage for k models.

### Non-Parametric Methods (no weight modification)

#### 5. In-Context Unlearning

No weight updates — inject "false memory" into the context at inference time:

```
Prompt construction:
  [forget example with WRONG label]         ← signal: this was incorrect
  [several retain examples with correct labels]  ← preserve utility
  [actual query]

Effect: model's in-context learning overrides its parametric memory
        for the duration of the context window
```

**Pros**: zero compute, zero weight change, immediately reversible.
**Cons**: adversarial bypass — sufficiently different prompt framing can still access parametric memory. GDPR compliance: the weight still technically contains the data. No formal deletion guarantee.

---

## Benchmarks

| Benchmark | Domain | Size | What It Tests |
|---|---|---|---|
| **TOFU** | Synthetic LLM | 200 fictitious author profiles × 20 Q&A = 4,000 pairs | Forget 2/10/20 authors; retain others + general knowledge |
| **WMDP** | Safety / LLM | 3,668 multiple-choice questions (bio/cyber/chem hazards) | Reduce hazardous knowledge; maintain MMLU + MT-Bench |
| **MUSE** | Real text / LLM | Books + news corpora | 6 properties: verbatim absence, factual absence, privacy, utility, scalability, robustness |
| **UnlearnCanvas** | Visual generative | 20 artistic style classes, high-res | Style forgetting + in-domain + cross-domain retain accuracy |

**TOFU is the most directly applicable** to our use case: replace "fictitious author profiles" with "retracted RSTMDB triples." Each triple is a Q&A pair: Subject → Predicate → Object. Unlearning a retracted triple = the model should no longer answer "TurboQuant achieves 5-6× KV cache reduction" if that triple was superseded.

---

## Method Comparison

| Method | Weight Access | Unlearn Type | Forgetting Quality | Utility Preservation | Compute Cost |
|---|---|---|---|---|---|
| Gradient Ascent | Required | Approximate | Medium–High | Medium–Low | Low |
| Fisher Forgetting | Required | Approximate | Medium | High | Medium |
| Fisher Removal | Required | Approximate | High | Medium | High |
| Knowledge Distillation | Required | Approximate | High | High | Medium–High |
| SISA | Required (by design) | **Exact** | High | High | Low (at delete time) |
| In-Context Unlearning | Not required | Approximate | Low | High | Near-zero |

---

## Connection to ZomboCraftEco / Axspace

### The Gap the Article Reveals

Every component in our stack assumes **monotonic knowledge accumulation**. RSTMDB has `valid_until` for temporal claims, but there is no mechanism to ensure the LLM component "forgets" what was valid_until'd. This is the gap:

```
WHAT WE HAVE:
  RSTMDB triple:  (TurboQuant, reduces, KV-cache-5x)  valid_until: 2026-03-01
  Belnap detection: contradiction flagged when newer triple conflicts
  LLM-Wiki lint: orphaned / outdated claims surfaced

WHAT WE LACK:
  When the contradiction is resolved (old triple retracted):
    → RSTMDB is updated ✓
    → LLM parametric weights still encode the old claim ✗
    → An adversarial prompt can extract the retracted claim ✗
    → GDPR "right to be forgotten" cannot be formally certified ✗
```

### Where Each Method Fits in Our Architecture

**In-Context Unlearning** — applicable immediately, no infra change:
- When RSTMDB marks `valid_until`, the axspace query layer injects the retraction into context
- "The following claim has been superseded: [old triple]. Do not reproduce it."
- Weak guarantee but zero cost. Good as first-pass.

**Gradient Ascent + λ-tuned retain loss** — applicable for axspace fine-tuned models:
- When we fine-tune a model on an RSTMDB corpus snapshot, gradient ascent can un-tune specific triples
- The forget-set = retracted triples; retain-set = valid triples
- Run as part of the nightly reflection pipeline (P08)

**Knowledge Distillation** — most architecturally clean for axspace:
- Teacher = model before the "contaminated" fine-tuning batch
- Student = current model with retracted knowledge
- This pairs naturally with how we checkpoint models during RSTMDB ingestion cycles
- Requires: keep pre-ingestion checkpoints (lightweight LoRA deltas, not full weights)

**SISA** — architectural pattern for the axspace training pipeline:
- Design the training corpus as shards per knowledge domain
- When a domain's knowledge is retracted: retrain only that shard
- This is the "RSTMDB × SISA = Exact Unlearning" design for the full product

**MIA probe as verification** — directly applicable to the RSTMDB retraction workflow:
- After applying any unlearning method, run MIA probe on retracted triples
- Target: MIA classifier AUC ≈ 0.5 (cannot tell if retracted triple was ever in training data)
- This is the formal verification step that makes retraction certifiable (GDPR-relevant)

### The RSTMDB Retraction Pipeline (Design Sketch)

```
TRIGGER: RSTMDB triple marked valid_until = NOW
         OR contradiction detected by Belnap + resolution = OLD triple loses

STEP 1: In-Context Unlearning (immediate, zero-cost)
  → axspace query layer: inject retraction into system prompt
  → Blocks most reproduction immediately

STEP 2: MIA Probe (verify need for parametric unlearning)
  → Run MIA classifier on retracted triple
  → If AUC < 0.55: parametric memory is weak enough, skip step 3
  → If AUC ≥ 0.55: parametric unlearning required

STEP 3: Gradient Ascent + retain loss (scheduled, not real-time)
  → forget-set: retracted triple + related QA pairs (from TOFU-style evaluation)
  → retain-set: valid triples in same domain (to prevent locality damage)
  → Run overnight in nightly reflection pipeline (docs-f0ef)
  → Checkpoint delta (LoRA) — do not overwrite full model

STEP 4: MIA Probe (verify completion)
  → Re-run MIA on retracted triple
  → Target: AUC ≤ 0.55
  → If not achieved: escalate to Fisher Removal or Knowledge Distillation

STEP 5: RSTMDB audit log
  → Record: which triples were retracted, which unlearning method applied,
             MIA AUC before/after, timestamp, compute cost
  → This is the formal GDPR deletion certificate
```

### The Memorization Score as Drift Detector

The `detect_drift()` function in infer-core currently checks if derived facts have become inconsistent with the axiom base. Machine Unlearning's Memorization Score is a complementary probe at the **neural layer**:

```
infer-core detect_drift():    did the formal knowledge base drift? (symbolic)
Memorization Score probe:     did the parametric knowledge base drift? (neural)

Both are needed. A system that passes symbolic consistency checks but fails
memorization probes is formally correct but behaviorally compromised.
```

---

## The WMDP Connection: Hazardous Knowledge

WMDP (3,668 questions on bio/cyber/chem hazards) is the safety-critical variant of this problem. For our ecosystem: replace "hazardous knowledge" with "proprietary/confidential knowledge" that must be demonstrably absent from a deployed model.

If axspace ever ingests confidential enterprise knowledge (internal codebases, trade secrets, private research), the ability to certifiably un-ingest specific items is a hard enterprise requirement. WMDP + Machine Unlearning is the blueprint for how to build that guarantee.

---

## Design Rules Derived

1. **Two-layer retraction for every RSTMDB valid_until.** Symbolic retraction (triple marked) + parametric retraction (unlearning applied). Only the combination is GDPR-certifiable.

2. **MIA probe as the verification gate.** MIA AUC ≤ 0.55 is the operational threshold for "parametric forgetting confirmed." Without this, retraction is formal theater.

3. **Keep pre-ingestion checkpoints (LoRA deltas).** Knowledge Distillation — the highest-quality unlearning method — requires the teacher (pre-contamination model). Store LoRA delta per RSTMDB ingestion batch, not just the final merged model.

4. **SISA pattern for domains with high retraction probability.** If a knowledge domain is expected to have frequent retractions (e.g., rapidly evolving empirical claims), train that domain as a separate shard from the start. Retraction cost: O(1 shard / total shards) of retraining, not full retrain.

5. **In-Context Unlearning as immediate patch, parametric as permanent fix.** The two operate on different timescales. In-context is the SWAT response (minutes); parametric is the architectural cleanup (overnight/weekly).

6. **Memorization Score + detect_drift() = dual-layer drift detection.** Add memorization probing to the nightly reflection pipeline alongside symbolic consistency checking. Both must pass for a knowledge state to be certified stable.

---

## Follow-up Tasks

- docs-unretr: design RSTMDB retraction pipeline — in-context + MIA probe + scheduled gradient ascent + LoRA checkpoint strategy
- docs-miapb: implement MIA probe as post-retraction verification gate — AUC ≤ 0.55 threshold, integrate with RSTMDB audit log

---

## Sources

- [Habr: Machine Unlearning — как измерить и достичь «забывания» (habr.com/ru/companies/oleg-bunin/articles/1014692/)](https://habr.com/ru/companies/oleg-bunin/articles/1014692/) — full methods/metrics/benchmarks survey, AiConf 2025 talk by Vadim (Raft)
- arXiv:2407.20516 — GenAI machine unlearning review (cited in article)
- arXiv:1610.05820 — Membership Inference Attack foundational paper (Shokri et al.)
- [OpenUnlearning (locuslab/open-unlearning)](https://github.com/locuslab/open-unlearning) — open-source implementation referenced in article
- TOFU benchmark: "Task of Fictitious Unlearning" — 200 synthetic author profiles, 20 Q&A each
- WMDP benchmark: 3,668 multiple-choice hazardous knowledge questions
- MUSE benchmark: real book/news text, 6-property evaluation
- Prior: `docs/research/second-brain-llm-wiki-karpathy-axspace.md` — RSTMDB promotion pipeline; unlearning is the missing retraction direction
- Prior: `docs/research/prism-premortem-ai-agent-architecture-review.md` — RSTMDB × Ingestion = Constant; retraction pipeline is equally absent
- Prior: `docs/research/epistemic-cycle-mas-architecture-vs-zombocrafteco.md` — P08 nightly reflection pipeline; unlearning fits here as scheduled parametric cleanup
