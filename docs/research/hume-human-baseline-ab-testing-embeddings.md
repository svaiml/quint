# HUME: Human Baseline for AI Benchmarks and the Calibration Gap in Our A/B Harness

> **Context**: HUME (Human Evaluation Framework for Text Embeddings) — Sber + international researchers. Measures human performance across 16 MTEB datasets, 26 task-language pairs. User flagged: "review A/B concept we had earlier and potential impact on previous vision."
> **Question**: What is HUME's methodology and findings, and what does it break in our A/B testing harness design?
> **Last updated**: 2026-05-08
> **br task**: docs-10ce

---

## Short Answer

**HUME's core thesis: any benchmark score without a human baseline and inter-annotator agreement (IAA) metric is uninterpretable. "85% accuracy on emotion classification (185% of human performance, κ=0.39) is a fundamentally different achievement than 85% on reranking (97% of human performance, ρ=0.75)."**

**Impact on our A/B harness: our Comparator agent is an LLM judge. HUME shows LLM judges score 5% below humans (76.1% vs 81.2%). More critically: we have no IAA measurement for our Comparator — we cannot tell whether a 6-point score difference between Stack A and Stack B is signal or noise in the rubric. Two required additions: (1) dual-Comparator IAA measurement, (2) human spot-check calibration layer.**

```
OUR CURRENT A/B HARNESS DESIGN:
  Stack A runs task → Comparator agent scores → score_a
  Stack B runs task → Comparator agent scores → score_b
  Mann-Whitney U test on {score_a} vs {score_b} → winner

THE HUME PROBLEM:
  score_a = 78/100, score_b = 72/100 → Stack A wins by 6 points
  But: Comparator IAA not measured
  → Two independent Comparators on the same output: 78 vs 71 (Δ=7)
  → The 6-point Stack A advantage is within the noise of the judge
  → Reported winner may be a rubric artifact, not a real difference

HUME-CALIBRATED DESIGN:
  Stack A runs task → Comparator A + Comparator B score independently
  IAA: Spearman ρ between {score_A} and {score_B} per rubric dimension
  Only report winner if: |score_a - score_b| > 2 × (1 - ρ) × σ_rubric
  Spot-check 10% with human grader → measure LLM-judge systematic bias
```

---

## HUME Framework: Technical Design

### Study Scope

- **16 MTEB datasets**, 26 task-language pairs
- **4 task types**: Classification, Clustering, Semantic Textual Similarity (STS), Reranking
- **5 languages**: English (eng), Arabic (ara), Russian (rus), Norwegian (nob), Danish (dan)
- **13 embedding models** tested against human performance
- **3 annotators** (all male, aged 20-35, NLP practitioners, native/near-native in tested languages)

### Annotation Interface

Platform: **Argilla** with task-specific interfaces:

| Task | Human Interface | Score Scale |
|---|---|---|
| Classification | Categorical label selection from predefined set | Accuracy / F1 |
| Clustering | Free cluster ID assignment (no predefined clusters) | V-Measure, ARI |
| STS | Numerical slider: 0–5 similarity scale | Spearman ρ |
| Reranking | Binary relevance judgment per candidate | MAP, nDCG@10 |

**Annotation strategy**: English tasks = 2 annotators (enables IAA); multilingual tasks = 1 expert annotator.

---

## Complete Results: Human vs Best Model

| Task | Language | Human | Best Model | Best Model Name | Gap |
|---|---|---|---|---|---|
| Classification | ara | **95.0** | 77.5 | SFR-Embedding-Mistral | **+17.5 human** |
| Classification | eng | 70.3 | **87.1** | jasper_en_vision_language_v1 | −16.8 model |
| Classification | nob | **85.0** | 75.0 | — | **+10.0 human** |
| Classification | rus | **92.5** | 81.2 | — | **+11.3 human** |
| Clustering | ara | 76.0 | **78.8** | Qwen3-Embedding-0.6B | −2.8 model |
| Clustering | dan | 62.7 | **76.0** | e5-mistral-7b-instruct | −13.3 model |
| Clustering | eng | 67.4 | **85.1** | SFR-Embedding-Mistral | −17.7 model |
| Clustering | rus | 68.0 | **77.7** | e5-mistral-7b-instruct | −9.7 model |
| Reranking | dan | 91.4 | **95.0** | jasper_en_vision_language_v1 | −3.6 model |
| Reranking | eng | 87.2 | **96.4** | e5-mistral-7b-instruct | −9.2 model |
| Reranking | nob | 89.8 | **92.3** | jasper_en_vision_language_v1 | −2.5 model |
| STS | ara | **67.5** | 40.9 | Gemini | **+26.6 human** |
| STS | eng | 83.2 | **88.5** | Qwen3-Embedding-0.6B | −5.3 model |
| STS | rus | 58.7 | **69.5** | — | −10.8 model |
| **AVERAGE** | | **77.6** | **80.1** | jasper_en_vision_language | −2.5 model |

**Model ranking** (all 13 models, average across all tasks):
```
jasper_en_vision_language_v1:  80.1%  ← best
SFR-Embedding-Mistral:         78.3%
e5-mistral-7b-instruct:        78.2%
Qwen3-Embedding-0.6B:          76.8%
stella_en_1.5B_v5:             76.9%
gte-Qwen2-1.5B-instruct:       77.5%
multilingual-e5-large:         70.4%
multilingual-e5-small:         69.0%
multilingual-e5-base:          68.2%
mxbai-embed-large-v1:          66.6%
embeddinggemma-300m:           64.2%
all-mpnet-base-v2:             63.4%
all-MiniLM-L6-v2:              61.9%
```

---

## Inter-Annotator Agreement (IAA): The Task Quality Signal

This is the most important table in the paper for our purposes:

| Task | Dataset | Metric | IAA Score | Quality |
|---|---|---|---|---|
| Classification | Toxicity | κ | 0.55 | Moderate ✓ |
| Classification | Tweet Sentiment | κ | 0.41 | Fair △ |
| Classification | Emotion | κ | 0.39 | **Fair ✗** |
| Classification | Multilingual Sentiment (eng) | κ | 0.24 | **Weak ✗** |
| Clustering | WikiCities | ARI | 0.91 | Excellent ✓ |
| Clustering | Reddit | ARI | 0.42 | Moderate ✓ |
| Clustering | SIB200 (eng) | ARI | 0.15 | Weak △ |
| Clustering | ArXiv | ARI | -0.001 | **No agreement ✗** |
| Reranking | News21 | ρ | 0.85 | Strong ✓ |
| Reranking | Core17 | ρ | 0.80 | Strong ✓ |
| Reranking | Robust04 | ρ | 0.75 | Strong ✓ |
| Reranking | Wikipedia (eng) | ρ | 0.64 | Moderate ✓ |
| STS | STS12 | ρ | 0.77 | Strong ✓ |
| STS | STSBenchmark | ρ | 0.58 | Moderate ✓ |
| STS | SICK-R | ρ | 0.63 | Moderate ✓ |
| STS | STS22 (eng) | ρ | 0.75 | Strong ✓ |

**Critical insight from the ✗ rows**: ArXiv clustering IAA = -0.001 (literally random). The paper recommends removing this dataset from MTEB. Any model score on ArXiv clustering is meaningless — humans themselves cannot agree on the ground truth. A model "achieving" 85.1% on ArXiv clustering is measuring nothing.

### IAA Quality Thresholds (Paper's Recommendations)

```
κ or ρ < 0.4:    LOW QUALITY — task definition broken; scores unreliable
κ or ρ 0.4-0.6:  MODERATE — use with caution; report IAA alongside scores
κ or ρ > 0.6:    HIGH QUALITY — reliable benchmark; scores interpretable
```

**Proposed for removal from MTEB**: emotion classification (κ=0.39), ArXiv clustering (ARI=-0.001), STS22-Russian (context expansion artifacts).

---

## The LLM Annotator Finding

**LLM annotators scored 76.1% vs human 81.2% on the same tasks** — a 5.1-point systematic underperformance.

This is measured directly on the same annotation tasks, not on downstream model evaluation. The paper's interpretation:

> "While LLMs offer scalability advantages, these limitations suggest they should augment rather than replace human annotation, particularly for benchmark development where task quality directly impacts model development priorities."

The LLM annotator gap is not uniform — it's larger on nuanced tasks (multilingual sentiment, cultural context) and smaller on clean tasks (reranking, objective classification). The same task-type pattern as the embedding model gap.

---

## Key Language-Specific Findings

**Arabic is the canary**:
- STS: humans 67.5% vs model 40.9% — 26.6 point human advantage
- Sentiment: humans 95.0% vs model 77.5% — 17.5 point human advantage
- **"67% win rate against best models, 100% against average models"**
- Cause: Arabic has rich dialectal variation, cultural nuance, and low training data representation

**English is where models dominate**: 0% human win rate on English-only tasks. Models have consumed so much English text that they match or exceed average human performance on English text analysis.

**Russian**: humans +11.3 on sentiment (92.5% vs 81.2%). Native cultural context matters.

**The cross-lingual verdict**: "Humans achieve a 29% win rate on multilingual tasks vs 0% on English-only tasks against best models."

---

## The Core Insight: Benchmark Score Interpretability

The 85% paradox:

```
SCENARIO 1: Model achieves 85% on emotion classification
  Human score: 70.3%   → model is at 121% of human performance
  IAA (κ): 0.39        → the task itself is poorly defined
  Interpretation: "The model memorized patterns that humans find ambiguous"
                  This is not a meaningful measure of semantic understanding.

SCENARIO 2: Model achieves 85% on news reranking
  Human score: 87.2%   → model is at 97% of human performance
  IAA (ρ): 0.80        → high-quality, reliable task
  Interpretation: "The model nearly matches human-level document relevance judgment"
                  This IS a meaningful measure.

SAME SCORE. COMPLETELY DIFFERENT MEANING.
```

**The paper's proposed fix**: Report three numbers alongside any benchmark score:
1. Model score (e.g., 85.0%)
2. Human baseline score (e.g., 70.3%)
3. Human IAA metric (e.g., κ=0.39)

Only with all three can the score be interpreted.

---

## Impact on Our A/B Testing Harness

### The Problem HUME Reveals

Our A/B harness (ADR-012, docs-ot99 assessment, docs-u0iu research) uses a **Comparator agent** as the judge. Current design:

```
Output_A → Comparator → score_A ∈ [0,100]
Output_B → Comparator → score_B ∈ [0,100]
Mann-Whitney U on {score_A} vs {score_B} → p-value → winner
```

What's missing: IAA measurement of the Comparator itself.

If we run the same output through the Comparator twice (or through two independent Comparator instances), what is the Spearman ρ between the two score sequences?

- If ρ < 0.6: our scoring rubric is unreliable. A 6-point difference between Stack A and Stack B is noise.
- If ρ > 0.8: our rubric is reliable. A 6-point difference is likely real signal.

**We have no idea which it is.** The harness as currently designed cannot tell us if its winner is an artifact.

### The 5% LLM Judge Bias

HUME's LLM annotator finding (76.1% vs 81.2%) applies directly to our Comparator agent. Our Comparator will systematically underperform a human judge by ~5%. More specifically:

- On **well-defined rubric dimensions** (functional correctness: does the code pass tests?) — LLM judge bias is minimal. Tests either pass or fail.
- On **subjective rubric dimensions** (code quality, architectural appropriateness, security posture) — LLM judge bias is 5-15%.

This means: our rubric dimensions that are not objectively verifiable need human spot-check calibration.

### The Human Baseline for SWE-Bench

HUME reveals that SWE-Bench scores (e.g., "Stack A resolves 42% of issues") are as uninterpretable as an embedding model benchmark without a human baseline.

What does 42% mean? 
- If a skilled engineer resolves 80%: the stack is at 52% of human performance (bad).
- If a skilled engineer resolves 35%: the stack is at 120% of human performance (excellent).

We don't know. SWE-Bench has published human performance data (human unassisted: ~27%, human with scaffolding: ~42%, expert with full tools: ~73%) but this varies by dataset version and selection criteria.

**What we need**: declare a specific human baseline for SWE-Bench before running Phase 2, so our results are contextualized.

### Proposed Calibration Additions to Harness Design

#### Addition 1: Dual-Comparator IAA Measurement

```python
# Run each output through TWO independent Comparator instances
score_a1 = comparator_1.score(output_A)
score_a2 = comparator_2.score(output_A)

# Measure IAA across the full task corpus
ρ = spearman(scores_a1, scores_a2)  # per rubric dimension

# Publish ρ alongside results
results = {
    "stack_a_score": mean(score_a1),
    "stack_b_score": mean(score_b1),
    "comparator_ρ": ρ,                    # NEW
    "score_difference": ...,
    "difference_significant": abs(delta) > 2 * (1-ρ) * σ  # NEW gate
}
```

**Threshold**: only report a winner if |score_A - score_B| > reliability margin. If comparator ρ = 0.7, reliability margin ≈ 3 points. A 2-point difference is not reportable.

#### Addition 2: Human Spot-Check Layer (10% sample)

```
For 10% of tasks (5 of 50), have a human evaluator score both outputs blind.
Measure: Spearman ρ between human scores and Comparator scores.
Target: ρ > 0.70 (moderately calibrated)
If ρ < 0.60: rubric revision required before proceeding
```

This is 5 tasks × 2 stacks × blind human review ≈ 2-3 hours of human effort. Low cost, high interpretability gain.

#### Addition 3: Declare Human SWE-Bench Baseline

Before Phase 2, document the human baseline:

```yaml
# swebench_baseline.yml
human_unassisted_resolve_rate: 0.27      # SWE-Bench Verified, no tools
human_assisted_resolve_rate: 0.42        # human + basic search
expert_full_tools_resolve_rate: 0.73     # expert + all tools
source: SWE-Bench Verified leaderboard 2025-Q4
```

Report Phase 2 results as: "Stack A: 38% (140% of human-unassisted, 90% of human-assisted)"

#### Addition 4: Per-Task IAA Classification

Label each task in the 50-task corpus by IAA quality tier before running the experiment:

```yaml
# task_corpus/task_001.yml
task_id: task_001
type: backend_api
difficulty: medium
iaa_class: high    # objective correctness criteria → ρ expected > 0.80
rubric_dimensions:
  - name: functional_correctness
    type: objective   # test pass/fail — no LLM judgment needed
    weight: 0.6
  - name: code_quality
    type: subjective  # stylistic — needs IAA measurement
    weight: 0.2
  - name: spec_adherence
    type: semi-objective  # checkable against spec items
    weight: 0.2
```

Tasks with `iaa_class: low` (subjective dimensions dominate) get human spot-check. Tasks with `iaa_class: high` (mostly functional correctness) can rely on automated Comparator alone.

---

## HUME's Wider Impact on Axspace / RSTMDB

### The Embedding Layer for Knowledge Navigation

HUME tests the embedding models that would power our RSTMDB knowledge navigation layer (HippoRAG 2 spike, docs-nowb). The results reveal critical selection criteria:

**For multilingual knowledge (our axspace use case includes Russian research papers)**:
- e5-mistral-7b-instruct performs strongly on clustering (78.2% average)
- SFR-Embedding-Mistral strong on classification
- All English-optimized models underperform on Arabic/Russian STS by 20-30%

**Selection rule derived**: if RSTMDB contains non-English triples (Russian research, Arabic sources), embedding model selection must be validated against HUME multilingual benchmarks, not MTEB English-only scores.

### The "Benchmark Score Without Context" Anti-Pattern

HUME's core critique — scores without human baseline + IAA are uninterpretable — applies to every metric we'll report in our ecosystem:

- SWE-Bench resolve rate (Phase 2 A/B harness)
- RSTMDB claim confidence scores (what is 0.8 confidence without a baseline?)
- infer-core derivation coverage (85% of axioms derived — vs what human expert would derive?)
- Pheromone score in bv (PageRank 0.12 — vs what?)

**HUME's proposed standard for our metrics**: report (model_score, human_baseline, IAA) triples, not bare numbers. This is the same principle as RSTMDB provenance: a claim without source is a claim without weight.

---

## Design Rules Derived

1. **Every evaluator produces three outputs: score, human_baseline, IAA.** A bare score number is uninterpretable. This applies to our Comparator agent, to RSTMDB confidence values, and to any benchmark we report.

2. **Dual-Comparator IAA measurement before announcing any A/B harness winner.** Run outputs through two independent Comparator instances. If Spearman ρ < 0.6 between them, the rubric must be revised. A difference smaller than the reliability margin is not a real winner.

3. **Human spot-check 10% of tasks.** 5 tasks × 2 stacks = 10 human evaluations. This calibrates the LLM judge against human judgment and detects the 5% systematic bias HUME found in LLM annotators.

4. **Objective rubric dimensions > subjective dimensions.** Test pass/fail is IAA=1.0 by definition. Code quality (IAA typically 0.4-0.6) must be backed by human spot-check or replaced with objective criteria.

5. **Multilingual embedding model selection requires multilingual IAA validation.** MTEB English leaderboard rankings do not predict multilingual performance. For any knowledge domain with non-English sources, validate against HUME's multilingual task scores.

6. **Remove low-IAA tasks from any benchmark.** If a human cannot agree with another human (κ < 0.4), the task definition is broken. Fixing the task spec takes priority over collecting model scores.

---

## Recommendation: A/B Harness Revision

The existing harness design (ADR-012) is architecturally sound. Two additions are required before Phase 1 results can be trusted:

**R1 (HIGH): Add dual-Comparator IAA measurement** — implementation cost: ~20 lines in `evaluator.py`. The Mann-Whitney U significance test already in the design becomes meaningful only after this step confirms the rubric reliability.

**R2 (MEDIUM): 10% human spot-check layer** — implementation cost: spreadsheet + 2-3 hours human effort. Produces the LLM judge calibration coefficient that makes our scores interpretable.

**R3 (LOW, Phase 2 prep): Declare human SWE-Bench baseline** — document the human resolve rates from published data. Zero implementation cost. Makes Phase 2 results reportable in context.

---

## Follow-up Tasks

- docs-hume-iaa: add dual-Comparator IAA measurement to harness `evaluator.py` — Spearman ρ between two Comparator runs, reliability margin gate before declaring winner

---

## Sources

- [Habr: HUME — новый метод A/B тестирования ИИ моделей (habr.com/ru/articles/1031020/)](https://habr.com/ru/articles/1031020/) — overview, key numbers summary
- [arXiv:2510.10062 — HUME paper (full text)](https://arxiv.org/abs/2510.10062) — complete results table, IAA data, annotator details, methodology, recommendations
- Prior: `docs/assess/ab-testing-framework-swebench-assessment.md` (docs-ot99) — our A/B harness assessment; Comparator agent design
- Prior: `docs/adr/ADR-012-ab-testing-harness-architecture.md` — architectural decisions; Option D (subprocess) chosen
- Prior: `docs/prd/ab-testing-harness-swebench-spec.md` — Mann-Whitney U test, 50-task corpus, Phase 1/2 design
- Prior: `docs/research/second-brain-llm-wiki-karpathy-axspace.md` — RSTMDB knowledge navigation; embedding model selection for multilingual knowledge
- Prior: `docs/research/aco-stigmergy-decentralized-optimization-graph-nn.md` — pheromone score interpretation; same "score without baseline" problem
