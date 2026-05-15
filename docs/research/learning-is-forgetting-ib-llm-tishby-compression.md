# Learning Is Forgetting: Information Bottleneck for LLMs — Tishby's Legacy at 32B Scale

> **Context**: Conklin et al. (Princeton + Cohere, 2026) applied Tishby's Information Bottleneck (IB) theory to LLMs up to 32B parameters using a differentiable "soft-entropy" estimator. Validates the two-phase fitting+compression dynamic at production scale and shows information-theoretic metrics predict benchmark and human-preference outcomes.
> **Question**: What does this mean for our existing compression / unlearning / KV-cache research, and is the IB framework now actionable for model selection without expensive evaluation?
> **Last updated**: 2026-05-10
> **br task**: docs-8jci

---

## Short Answer

**Tishby's Information Bottleneck — long considered untestable at scale — now empirically validated up to 32B parameters. Training is provably two-phase: fit, then forget. Proximity to the optimal lossy-compression bound correlates r=0.52 with benchmark performance and r=0.76 with human preferences. This is the first unsupervised, training-internal predictor of LLM quality that doesn't require running domain evals.**

```
TISHBY 2017 (toy models, MNIST):  fit → compress → generalize
              │
              │ untestable at LLM scale because Shannon entropy
              │ on high-dim continuous manifolds is intractable
              ▼
CONKLIN 2026 (32B LLMs):          soft-entropy estimator (differentiable)
                                  → information plane reconstructed
                                  → two-phase dynamic confirmed
                                  → IB bound predicts quality
```

**Bottom line**: forgetting is not a bug, not a side-effect — it IS the learning. Every workstream we have on compression, retention, and unlearning needs to be re-read through this lens.

---

## The Tishby Legacy

Naftali Tishby (1952–2021) introduced the Information Bottleneck principle in 1999 and applied it to deep learning in 2015–2017. The core claim:

```
Optimal representation T of input X for predicting Y:
  Minimize:    I(X; T)    — compress X
  Maximize:    I(T; Y)    — preserve Y-relevance

Optimal trade-off:        T* = argmin [I(X;T) - β·I(T;Y)]
                                  ↑              ↑
                              compression    relevance
                              cost           reward
```

The 2017 result (Schwartz-Ziv & Tishby): SGD training of deep nets has two phases:
1. **Fitting phase** — short, both I(X;T) and I(T;Y) increase
2. **Compression phase** — long, I(X;T) decreases while I(T;Y) stays high

→ generalization comes from the compression phase, not fitting.

**Why the field dismissed it**: Saxe et al. (2018) argued the compression phase was an artifact of saturating tanh activations; with ReLU the effect vanished. Subsequent work could not replicate Tishby's findings on large models. The IB framework became a beautiful theory without empirical traction at scale.

---

## What Conklin et al. Actually Did

### 1. The Soft-Entropy Estimator

The blocking problem for 9 years: computing Shannon entropy on a continuous manifold of dimension d requires binning or k-means clustering. Memory scales exponentially with d. For a 4096-dim hidden state, this is forever-infeasible.

Conklin et al. introduce a **differentiable soft-entropy estimator** that:
- Approximates H(T) and H(T|Y) without explicit binning
- Is gradient-trackable (you can use it as a loss signal, not just a probe)
- Scales to 32B-parameter representations

Code: https://github.com/hcoxec/soft_h

This is the key technical unlock. Without it, the rest of the paper cannot exist.

### 2. Information Plane Projection

For LLMs during pre-training:
- Track I(X; T) — mutual information between input tokens and hidden representations
- Track I(T; Y) — mutual information between hidden representations and next-token labels
- Plot trajectory on (I(X;T), I(T;Y)) plane

**Result**: Two distinct phases visible at 32B scale, matching Tishby's 2017 prediction qualitatively.

```
  I(T;Y)
    │
    │            ╭─ compression phase ─╮
    │           ╱   I(T;Y) plateaus    ╲
    │          ╱    I(X;T) decreases    ╲
    │  ╭───── ╯                          ╲────►
    │ ╱  fitting phase                    final
    │╱   both increase                    representation
    └──────────────────────────► I(X;T)
```

### 3. The IB Bound as Quality Predictor

For each model, measure proximity to the **optimal lossy compression limit** (the theoretical IB curve).

**Correlations**:
- Benchmark performance (downstream eval suite): **r = 0.52**
- Human preference alignment (preference-rated outputs): **r = 0.76**

The human-preference correlation is the striking one. Quality of human-rated output is **better predicted** by information-theoretic distance to the IB bound than by typical benchmark scores.

---

## Why This Matters for Our Workspace

### Connection 1 → Machine Unlearning (docs/research/machine-unlearning-...)

Machine Unlearning research treats forgetting as a post-hoc operation: train → discover unwanted knowledge → unlearn. Conklin et al. show forgetting is **already happening during training**. The compression phase removes "nerelevantnyh vhodnyh dannyh" — irrelevant input data — automatically.

**Implication**: There may be a window during the compression phase where targeted unlearning is dramatically cheaper than post-training surgical unlearning. If we could mark certain inputs as "extra-forgettable" during the compression phase, we'd get GDPR-style retraction at low cost.

```
CURRENT MACHINE UNLEARNING:
  Train → MIA probe detects retained data → Gradient Ascent / SISA / Fisher
  Cost: high — fighting against trained weights

POTENTIAL IB-AWARE UNLEARNING:
  During compression phase → inject forget-set with reverse IB pressure
  Cost: low — amplifying a process the model is already doing
```

→ **Follow-up task**: investigate IB-aware unlearning during training compression window.

### Connection 2 → KV-Cache Compression (docs/research/kv-cache-compression-...)

TurboQuant / DeepSeek MLA compress KV-cache via quantization or low-rank approximation. These are **inference-time** compression schemes that don't know about IB.

**IB principle**: the optimal compression is the one that preserves I(T; Y) while minimizing I(X; T). For attention KV caches, this means: prioritize compressing keys/values that carry low mutual information with future generation.

→ **Follow-up task**: explore IB-guided KV-cache compression (compress along directions of low mutual information with downstream tokens).

### Connection 3 → Agent Context Compression (docs/research/caveman-wenyan-context-compression.md)

Wenyan compression in agent context tries to compress prompts while preserving semantic content. This is literally an IB problem: find T (compressed context) that maximizes I(T; Y) where Y is the downstream agent response quality.

→ **Follow-up task**: measure IB bound for context compression schemes — does proximity to the IB curve correlate with agent task success rate?

### Connection 4 → Agent Code Navigation (docs/research/agent-code-navigation-...)

Code navigation tools (CodeGraph, CTOP) compress codebases into navigable indexes. Same IB framing: preserve information about code semantics relevant to agent tasks, discard surface syntax.

→ **Follow-up task**: define I(X; T) and I(T; Y) for code index compression and benchmark against existing tools.

---

## Practical Implications

### 1. Unsupervised Early Stopping

Run soft-entropy estimator during training. When information-plane trajectory enters the compression phase **and** distance to IB bound stops improving, training has reached diminishing returns. **Stop without running benchmarks.**

This is potentially worth millions of GPU-hours per run for frontier-scale models.

### 2. Model Selection Without Domain Evals

Given two candidate models, compute their IB-bound distance. The closer-to-IB model is predicted to have higher human-preference alignment (r = 0.76).

For mid-training checkpoints where running MMLU + MT-Bench + HumanEval costs hours, this is a dramatic speedup.

### 3. Training Diagnostics

If a model fails to enter the compression phase (information plane stalls in fitting region), it's underfit or the optimization is broken. This becomes a debug signal **during training**, not after.

---

## What's Still Unknown / Open Questions

1. **Soft-entropy bias**: The differentiable estimator likely has systematic bias. What's the bias structure? Does it favor certain architectures?

2. **Scale ceiling**: 32B is validated. Does the two-phase dynamic hold at 100B+? Tishby's theory predicts it should, but the field has been surprised before.

3. **Architecture sensitivity**: Tested on transformer LLMs. Does the IB framework apply equally to MoE, Mamba, or hybrid architectures?

4. **Data dependency**: Compression phase emergence may depend on data ordering, mixture, or pre-training curriculum. The paper's pre-training corpus is presumably standard — what happens with non-standard curricula (e.g., scientific text-heavy)?

5. **The r=0.52 benchmark correlation is moderate**: It's a useful signal but not a replacement for domain evals. Why the gap with human preference (r=0.76)? Hypothesis: benchmarks measure capabilities; human preference measures distillation/cleanliness — which is exactly what compression produces.

---

## Synthesis with ZomboCraftEco / Reasoning Stack

For RSTMDB and the formal reasoning stack:

```
RSTMDB symbolic store:      I(X; T) = compressed triples preserving I(T; Y) for queries
Belnap 4-valued logic:      compression must preserve contradiction signals
Apophatic theology angle:   "what cannot be said" = high I(X;T) cost, low I(T;Y) gain
                            → IB principle formalizes apophatic limits of knowledge
```

This is the most concrete bridge yet between the symbolic (RSTMDB) and parametric (LLM) layers: **both are doing IB compression**. Symbolic does it explicitly with valid_from/valid_until. Parametric does it implicitly during training compression phase. The connection is mathematical, not metaphorical.

---

## Recommendation

**Treat this paper as foundational for any compression/forgetting work in the next 12 months.** Three concrete actions:

1. **Read the code** (https://github.com/hcoxec/soft_h) before committing to any unlearning, KV-compression, or context-compression design. The soft-entropy estimator is the actionable unlock.

2. **Add IB bound distance** to our A/B harness as a third comparator dimension (alongside HUME's IAA and the dual-Comparator gate). If the model that's closer to the IB bound wins more often on human preference, we have a cheap pre-filter before running full evals.

3. **Re-read Tishby**: his lectures (the YouTube link the user provided) are the conceptual foundation. The Conklin paper is the empirical validation. Both needed.

---

## Follow-up Tasks

- docs-eoeh: IB-aware machine unlearning during training compression window
- docs-eoei: IB-guided KV-cache compression — preserve I(T; future tokens)
- docs-eoej: Measure IB bound for agent context compression (Wenyan, CTOP)
- docs-eoek: Add IB-bound distance to A/B testing harness as third comparator metric

---

## Sources

- arXiv:2604.07569v1 — Conklin et al., "Learning Is Forgetting: LLM Training as Lossy Compression"
- https://github.com/hcoxec/soft_h — reference implementation of soft-entropy estimator
- https://arxiviq.substack.com/p/learning-is-forgetting-llm-training — third-party review
- Tishby & Zaslavsky (2015), "Deep Learning and the Information Bottleneck Principle"
- Schwartz-Ziv & Tishby (2017), "Opening the Black Box of Deep Neural Networks via Information"
- Tishby YouTube lecture: https://www.youtube.com/watch?v=utvIaZ6wYuw
- Saxe et al. (2018) "On the Information Bottleneck Theory of Deep Learning" — critique of compression phase
- https://t.me/gonzo_ML_podcasts/3524 — Russian-language podcast discussion
- Prior workspace: docs/research/machine-unlearning-metrics-methods-controlled-forgetting.md
- Prior workspace: docs/research/kv-cache-compression-turbo-quant-vs-deepseek-mla.md
- Prior workspace: docs/research/caveman-wenyan-context-compression.md
- Prior workspace: docs/research/agent-code-navigation-and-compression-synthesis.md
