# KV-Cache Compression: Google TurboQuant vs DeepSeek MLA/CSA/HCA

> **Context**: Two non-competing compression strategies for transformer KV caches — one is a drop-in bit packer, one is architectural redesign. They compose.
> **Question**: What are the actual numbers, what are the trade-offs, and what does the composition of both strategies mean for local inference economics?
> **Last updated**: 2026-05-07
> **br task**: docs-m1fs

---

## Short Answer

**Orthogonal strategies, composable stack.**

```
APPROACH        LAYER            COMPRESSION    REQUIRES RETRAIN?
──────────────────────────────────────────────────────────────────
TurboQuant      Bit packing      5–6× (3.5-bit) No — drop-in
                (any vectors)    (vs BF16)

DeepSeek MLA    Low-rank latent  28× per token  Yes — architecture
(V3)            (dim reduction)  (14k→512)      change + training

DeepSeek CSA    Sequence pooling 4×–50×         Yes — architecture
/HCA (V4)       (temporal axis)  (4× CSA,       change + training
                                 128× HCA)

COMPOSED STACK  MLA × CSA/HCA   2%–10% of      One retrain covers
                × TurboQuant    baseline GQA    MLA+CSA/HCA;
                                + additional    TurboQuant is free
                                5-6× on top
```

At 1M tokens on V4-Pro: **2% of standard GQA BF16 KV cache** before TurboQuant.
TurboQuant adds another 5-6× on any residual vectors. No quality cliff at 3.5-bit.
The "RTX 50-series runs what datacenter GPUs run today" prediction is directionally correct.

---

## Google TurboQuant (arXiv:2504.19874)

### What It Does

Online vector quantization for KV cache (and nearest-neighbor indexes).
Three-step algorithm, data-oblivious, zero codebook, no training:

```
Input vector v ∈ R^d
  │
  ├─[Step 1]─ Random rotation R·v
  │             Transforms arbitrary distribution → concentrated Beta(α,α)
  │             Coordinates become approximately independent
  │             → scalar quantization applies per-coordinate without cross-terms
  │
  ├─[Step 2]─ Scalar quantization per coordinate (Lloyd-Max)
  │             Optimal MSE quantizer for the Beta distribution
  │             Result: v̂ (MSE-quantized reconstruction)
  │
  └─[Step 3]─ QJL residual (1-bit Johnson-Lindenstrauss)
                Residual r = v - v̂
                Apply 1-bit ±1 JL sketch to r
                → Unbiased correction for inner product estimation
                   (critical for attention score computation)
```

### Measured Numbers

| Setting | LongBench avg | vs Baseline |
|---|---|---|
| Full precision (BF16) | ~50.0 | — |
| **TurboQuant 3.5-bit** | **50.06** | **≈ 0 degradation** |
| TurboQuant 2.5-bit | 49.44 | marginal |
| KIVI (baseline) | lower | worse at same compression |
| PolarQuant (baseline) | lower | worse at same compression |

**Needle-in-haystack** (Llama-3.1-8B, 4k–104k context): **0.997** at 4× compression.

**Indexing overhead**: 0.0013 seconds for 100k vectors vs RabitQ 2,267 sec.
Effectively zero — this is why it's called "online."

**Models tested**: Llama-3.1-8B-Instruct, Ministral-7B-Instruct, up to 128k context.

### What Makes It Exceptional

- **No codebook, no calibration data, no retrain.** Works on any pre-existing model.
- **Drop-in**: quantize KV vectors as they are generated; no pipeline changes.
- **Inner product unbiased**: the QJL residual correction preserves softmax attention score
  fidelity — this is the hard part other quantizers get wrong.
- **Works on already-compressed vectors**: MLA outputs latents, CSA/HCA outputs block
  summaries — TurboQuant doesn't know or care. It just packs any R^d vector to 3.5 bits.

---

## DeepSeek V3 — MLA (Multi-Head Latent Attention)

### What It Does

Low-rank compression of the KV cache: instead of storing full-rank K and V tensors,
the model stores a compressed latent vector, then up-projects on demand.

```
Standard MHA per token:
  K ∈ R^(n_heads × d_head) = 128 × 128 = 16,384 values
  V ∈ R^(n_heads × d_head) = 128 × 128 = 16,384 values
  Total: ~32k values/token in BF16 → 64 KB per token

MLA per token:
  c_KV ∈ R^512  (compressed latent, stored in KV cache)
  K, V reconstructed at attention time: c_KV → W_UK → K; c_KV → W_UV → V
  Total stored: 512 values → 1 KB per token
```

**Compression**: 16,384 → 512 per K and V combined → **28× smaller**.
**Numbers**: 213.5 GB BF16 KV cache → **7.6 GB** for same context.

Analogous to LoRA but applied to the base attention KV projection, trained in.
The model "learns to live in the compressed latent space."

**Requires**: architectural redesign + full model training. Not retro-fittable to
existing models without training.

---

## DeepSeek V4 — CSA + HCA (Sequence Compression)

### What It Does

Where MLA compresses the **dimension axis** of KV vectors, CSA/HCA compress the
**sequence (time) axis** — multiple tokens collapse into one KV slot.

```
MLA (V3) compresses:  d_head dimension  14k → 512
CSA (V4) compresses:  sequence length   every 4 tokens → 1 block
HCA (V4) compresses:  sequence length   every 128 tokens → 1 block (dense)

Layer assignment (V4):
  Layer type A (most): CSA — sparse block selection via lightning indexer
  Layer type B (some): HCA — dense attention over heavily compressed blocks
```

**CSA detail**: 4× sequence compression via softmax-gated pooling + learned positional
bias. A "lightning indexer" (from V3.2 sparse attention) selects top-k compressed blocks
per query. Result: 4× fewer KV entries + sparse attention over them.

**HCA detail**: 128× sequence compression (128 tokens → 1 slot). Dense attention
over these ultra-compressed blocks. Every query attends to everything, but sequence
is 128× shorter.

### Measured Numbers

| Metric | V4-Pro at 1M tokens | vs V3.2 |
|---|---|---|
| Inference FLOPs | 27% | 73% reduction |
| KV cache (vs V3.2) | 10% | 10× smaller |
| KV cache (vs GQA-8 BF16) | **2%** | **50× smaller** |

V4-Pro: 1.6T parameters total, 49B active (MoE).
V4-Flash: 284B parameters total, 13B active.
Both: native 1M token context.

---

## The Composition Stack

TurboQuant and DeepSeek approaches are independent compression axes:

```
BASELINE: Standard GQA-8 BF16, 1M tokens
  KV cache: ~100% (reference)

AFTER MLA (V3):
  KV cache: ~3.5% (28× reduction per head × GQA factor)

AFTER MLA + CSA/HCA (V4):
  KV cache: ~2% of GQA-8 BF16 baseline

AFTER MLA + CSA/HCA + TurboQuant (3.5-bit):
  Additional 5-6× on residual vectors
  Theoretical: ~0.3–0.4% of GQA-8 BF16 baseline
  Practical floor: quality limits before 3.5-bit, so ~0.5–1%
```

Composition diagram:

```
Token stream
  │
  ▼
[MLA] project to c_KV ∈ R^512          ← 28× dim reduction
  │
  ▼
[CSA/HCA] pool 4–128 tokens → 1 slot   ← 4–128× sequence reduction
  │
  ▼
[TurboQuant] pack R^512 → 3.5 bits     ← 5-6× bit reduction
  │
  ▼
KV cache entry: ~(512 × 3.5 / 16) bytes per aggregated slot
```

**Why they compose cleanly**: TurboQuant is input-agnostic. It treats any R^d vector
as input. The latent c_KV output by MLA and the pooled block output by CSA/HCA are
both regular R^d vectors — TurboQuant packs them without knowing their origin.

---

## The No-Plateau Thesis

The R&D pace disproves the "transformers are saturated" narrative:

```
2023: Standard GQA, BF16 KV, 32k context typical
2024: MLA (V3) — 28× KV reduction, training-required
2025: CSA/HCA (V4) — additional 10-50× at 1M context
2025: TurboQuant — 5-6× any vector, zero overhead, drop-in
2025-26: Composition: theoretical 250-300× vs 2023 baseline

RTX 5090: 32GB VRAM
70B model at 1M context, 2023 baseline KV: ~2TB needed
70B model at 1M context, MLA+CSA/HCA+TurboQuant: ~7-10GB needed
→ fits with room for weights
```

The driver is **VRAM cost**, not intelligence research. The economic pressure
(H100 at $2-3/hour, inference margins thin) makes 250× KV compression worth
multiple research teams. The plateau is real for benchmark accuracy — not for
inference economics.

---

## Implications for Local Inference / Edge

| Scenario | 2023 baseline | MLA+CSA/HCA | + TurboQuant |
|---|---|---|---|
| Llama-70B, 32k ctx, A100 80GB | Barely fits | Comfortable | Tiny |
| Llama-70B, 128k ctx, RTX 5090 32GB | Impossible | Tight | Fits |
| Llama-70B, 1M ctx, RTX 5090 32GB | Impossible | Impossible | Possible (weights are the limit) |
| Llama-7B, 1M ctx, RTX 4090 24GB | Impossible | Possible | Comfortable |

**Edge deployment** (target: RTX 50-series + SLM at LLM-level quality):
- TurboQuant is the key because it requires no retrain
- Existing Llama-3.1-8B runs with TurboQuant 3.5-bit at ~0 quality loss
- New models trained with MLA+CSA/HCA + TurboQuant at serve time → radical VRAM economics
- SLM (7-13B) with 1M context on a consumer GPU: realistic within 1-2 years

---

## Relevance to ZomboCraftEco / Context Engineering

This research is directly relevant to the multi-agent pipeline (see
`multi-agent-codebase-navigation-pipeline.md`) and context budgeting:

1. **The 8k Architect budget** (full-attention zone) holds regardless of KV compression.
   KV compression saves *memory* but doesn't fix positional bias (Lost in the Middle).
   The two constraints are independent.

2. **Local inference viability**: caveman/Wenyan token compression + TurboQuant are
   orthogonal. caveman reduces input tokens; TurboQuant reduces KV memory per token.
   Together they multiply.

3. **Context economy**: if 1M context at 2% VRAM cost is real, the "load only 37 lines"
   GRACE GREP strategy becomes even more efficient — the *retrieval cost* drops, not just
   the *memory cost*. Agents can afford longer conversations.

4. **CTOP binary format** aligns with this direction: CTOP compressed binary + TurboQuant
   3.5-bit KV = two layers of compression at orthogonal abstraction levels.

---

## Follow-up Tasks

None needed — this is awareness research, not actionable for ZomboCraftEco directly.
Monitor: DeepSeek V4 open weights for TurboQuant integration experiments.

---

## Sources

- [TurboQuant (arXiv:2504.19874)](https://arxiv.org/abs/2504.19874) — rotation + scalar quant + QJL residual; 3.5-bit ≈ full precision; zero overhead
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/html/2412.19437v1) — MLA: 512-dim latent, 28× KV reduction
- [DeepSeek V4: Million-Token Context (HuggingFace blog)](https://huggingface.co/blog/deepseekv4) — CSA 4×, HCA 128×, 2% GQA-8 baseline at 1M tokens
- [Inside DeepSeek V4: Hybrid Attention](https://dasroot.net/posts/2026/04/deepseek-v4-hybrid-attention-massive-contexts/) — CSA/HCA architecture details
- [DeepSeek V4 Review (Andrew Lukyanenko)](https://artgor.medium.com/deepseek-v4-review-why-million-token-context-needs-efficient-attention-not-just-larger-windows-6dc8e74a00b1)
- [MarkTechPost: DeepSeek V4 CSA/HCA announcement](https://www.marktechpost.com/2026/04/24/deepseek-ai-releases-deepseek-v4-compressed-sparse-attention-and-heavily-compressed-attention-enable-one-million-token-contexts/)
- [Understanding MLA (sebastianraschka.com)](https://sebastianraschka.com/llms-from-scratch/ch04/05_mla/)
