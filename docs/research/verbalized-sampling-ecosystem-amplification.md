# Research: Verbalized Sampling — Ecosystem Amplification Strategy

**Date**: 2026-05-13
**Paper**: [Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity](https://arxiv.org/abs/2510.01171)
**Authors**: Zhang, Yu, Chong, Sicilia, Tomz, Manning, Shi (Stanford, CMU)
**Status**: Researched — pending implementation tasks

---

## Executive Summary

The Verbalized Sampling (VS) paper validates a technique already practiced in our brainstorming workflow: instead of asking an LLM for a single answer (instance-level prompting), ask it to generate **k candidates with explicit probability estimates** (distribution-level prompting). This achieves **2-3x diversity improvement** while maintaining quality — training-free, model-agnostic.

**Key insight for our ecosystem**: Our platform already implements the formal mathematical machinery for "superposition + collapse" across multiple repos (Belnap bilattices, Dempster-Shafer intervals, AAF argumentation, PCTL model checking, MDL abduction). What we lack is the **AI-native hypothesis generation layer** that VS provides. Plugging VS into our existing infrastructure creates a complete pipeline: **VS generates the superposition → our engines evaluate/rank → criterion-driven collapse**.

**Confidence**: HIGH — the paper validates what we already do informally; the ecosystem components are production-ready.

---

## Paper Analysis

### Core Problem: Mode Collapse in LLMs

Post-training alignment (RLHF/DPO) introduces **typicality bias**: annotators prefer familiar text patterns. Mathematically:

```
π*(y|x) ∝ π_ref(y|x)^γ · exp(r_true(x,y)/β)
```

When γ > 1 (always true with typicality bias), probability concentrates on "typical" completions. Result: LLMs give "Captain Obvious" answers.

### Solution: Verbalized Sampling (VS)

**Instance-level** (bad): "Tell me a joke about coffee" → 1 stereotypical joke
**Distribution-level** (VS): "Generate 5 jokes with probability estimates" → 5 diverse jokes + self-rated probabilities

Key parameters:
- `k` — number of candidates (typically 5-7)
- `tau` — probability threshold for tail sampling
- Variants: VS-CoT (chain-of-thought), VS-Multi (multi-turn with history)

### Results

| Task | Diversity Gain | Quality Impact |
|------|---------------|----------------|
| Creative writing | 1.6-2.1x | +25.7% human preference |
| Open-ended QA | Lower KL divergence | Better coverage, no precision loss |
| Synthetic data | — | 37.5% vs 32.8% downstream accuracy |
| Dialogue simulation | 2-3x diversity | Maintained coherence |

### Implementation

```python
from verbalized_sampling import verbalize
dist = verbalize("Tell me a joke", k=5, tau=0.10, temperature=0.9)
joke = dist.sample(seed=42)
```

GitHub: [CHATS-lab/verbalized-sampling](https://github.com/CHATS-lab/verbalized-sampling)

---

## Ecosystem Mapping: Where VS Amplifies

### Current Architecture (without VS)

```
HUMAN frames question
  ↓
ABDUCTION (infer retroduce, MDL scoring) — generates hypotheses
  ↓
DEDUCTION (infer + zz-notation, Belnap truth) — validates
  ↓
INDUCTION (pctl-rs, probabilistic verification) — stress-tests
  ↓
KNOWLEDGE STORE (zz KnowledgeStore + rstmdb) — persists
  ↓
HUMAN reviews via criterium HITL
```

**Gap**: Abduction (retroduce) is **rule-driven**, not LLM-driven. Hypothesis diversity is limited by the rules in the knowledge base.

### Enhanced Architecture (with VS)

```
HUMAN frames question
  ↓
╔══════════════════════════════════════════╗
║  VS LAYER (NEW)                          ║
║  Generate k hypotheses + probabilities   ║
║  Distribution-level, not instance-level  ║
╚══════════════════════════════════════════╝
  ↓ k candidates with p(h_i)
ABDUCTION (infer retroduce) — refines VS output via MDL
  ↓
DEDUCTION (infer + zz-notation) — validates each candidate
  ↓
INDUCTION (pctl-rs) — stress-tests survivors
  ↓
KNOWLEDGE STORE — persists with provenance
  ↓
CRITERION-DRIVEN COLLAPSE — human or automated
```

---

## TOP 5 Use Cases

### UC-1: criterium — VS as Abduction Front-End (Hypothesis Superposition)

**Repo**: `epistemic-universe/criterium`
**What**: Replace the current FPF-driven abduction step with VS-backed hypothesis generation. VS generates k diverse hypotheses with self-rated probabilities. These feed directly into criterium's AssuranceLevel pipeline (L0→L1→L2→L3).

**Why it fits**:
- Criterium already orchestrates ABD→DED→IND loop
- VS probabilities map to initial Dempster-Shafer belief intervals [Bel, Pl]
- Diversity gain means more hypotheses enter deductive validation → fewer blind spots
- Human-in-the-loop criterion selects the collapse point

**Implementation sketch**:
```
criterium-hitl → VS prompt (k=7 hypotheses)
  → each h_i gets (text, p_i)
  → convert p_i to DS interval [Bel_i, Pl_i]
  → feed into criterium-core session
  → deduction validates, induction stress-tests
  → criterion collapse
```

**Impact**: HIGH — directly amplifies the core reasoning loop quality

---

### UC-2: infer — VS-Powered Retroduce (Diverse Abductive Inference)

**Repo**: `reasoning-universe/infer`
**What**: Extend the `retroduce` verb to accept VS-generated hypotheses alongside rule-driven MDL hypotheses. Create an `infer-vs` crate that bridges VS output into infer's hypothesis format.

**Why it fits**:
- Retroduce currently generates hypotheses only from KB rules
- MDL scoring ranks by simplicity — good but limited to known patterns
- VS adds LLM creativity: hypotheses that rules can't express
- MDL + VS probability = dual ranking (simplicity × LLM confidence)

**Implementation sketch**:
```
retroduce_vs(observation, k=5):
  1. VS generates k candidate explanations with p(h_i)
  2. Each candidate converted to infer Hypothesis { text, confidence: p_i }
  3. MDL scorer ranks all hypotheses (rule-derived + VS-derived)
  4. Merge ranking: MDL_score * vs_probability → final ordering
  5. Return top-N with proof trees (rule) or rationale (VS)
```

**Impact**: HIGH — makes abduction work on open-domain problems where KB rules are incomplete

---

### UC-3: reasoning-apps — Multi-Hypothesis Market Analysis (Polymarket)

**Repo**: `apps/reasoning-apps`
**What**: For the Polymarket insider trading detection PoC, use VS to generate diverse market manipulation scenarios. Currently the analysis follows hand-crafted patterns; VS explodes the scenario space.

**Why it fits**:
- Polymarket PoC already uses retroduce for hypothesis generation
- VS generates diverse insider trading scenarios human analysts might miss
- Three-layer pattern (RSTMDB + Infer) validates each scenario against on-chain data
- AAF conflict resolution between competing scenarios = natural collapse

**Implementation sketch**:
```
VS prompt: "Given this bet timeline [data], generate 7 possible explanations
for the unusual volume spike, each with probability estimate"
  → 7 scenarios: insider trading, whale accumulation, bot arbitrage,
    news leak, coordinated pump, hedging, random noise
  → each scenario → infer program → validate against timeline
  → AAF: which scenarios attack each other?
  → pctl-rs: P(scenario_i holds | data) with confidence interval
  → Proven Map: persist validated scenarios to rstmdb
```

**Impact**: MEDIUM-HIGH — extends existing PoC with dramatically better hypothesis coverage

---

### UC-4: zz-notation — Epistemic Tier Seeding via VS Distributions

**Repo**: `reasoning-universe/zz-notation`
**What**: Use VS to seed the KnowledgeStore with initial hypotheses at appropriate epistemic tiers. VS probability maps to the 7-tier TruthValue system.

**Why it fits**:
- KnowledgeStore tracks facts with Belnap truth values (7 tiers)
- VS generates candidates with probabilities that map naturally:
  - p > 0.8 → WeaklyTrue (needs deductive confirmation for True)
  - 0.4 < p < 0.6 → Contested (evidence split)
  - p < 0.2 → WeaklyFalse (needs refutation for False)
  - No VS output → Unknown
- InferBridge then promotes/demotes based on deductive evidence

**Mapping table**:
```
VS probability → Epistemic Tier
  p ∈ [0.8, 1.0]  → WeaklyTrue  (strong VS signal, pending deduction)
  p ∈ [0.6, 0.8)  → WeaklyTrue  (moderate VS signal)
  p ∈ [0.4, 0.6)  → Contested   (VS uncertain, needs evidence)
  p ∈ [0.2, 0.4)  → WeaklyFalse (VS leans against)
  p ∈ [0.0, 0.2)  → WeaklyFalse (strong VS counter-signal)
  conflicting VS   → Conflicted  (VS self-contradicted)
  no VS output     → Unknown     (outside VS scope)
```

**Impact**: MEDIUM — provides principled initialization for the knowledge store

---

### UC-5: pbelnap — VS-Calibrated Bilattice Training Data

**Repo**: `epistemic-universe/pbelnap`
**What**: Use VS to generate diverse (t, f) training annotations for bilattice-native LLM training. Instead of binary correct/incorrect, VS generates k answers with probabilities → map to bilattice coordinates.

**Why it fits**:
- pbelnap already converts TruthfulQA → bilattice annotations
- Current annotation is rule-based (adversarial → Contested, correct → True)
- VS can generate nuanced annotations: "This answer is 70% true, 20% false"
- Maps directly to BilatticeState(t=0.70, f=0.20)
- LADE classification benefits from probabilistic evidence distribution

**Implementation sketch**:
```
For each training question Q:
  VS generates k=5 candidate answers with p(a_i)
  For each answer a_i:
    t_i = p(a_i is correct)     # from VS or verifier
    f_i = p(a_i is incorrect)   # complementary evidence
    BilatticeState(t_i, f_i)
  F-G-R provenance: formality from source, generality from coverage,
    reliability from VS calibration score
```

**Impact**: MEDIUM — improves training data quality for epistemic LLMs

---

## Recommendation: GO — Proceed with Implementation

**Overall Score**: 8.5/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Strategic Fit | 9/10 | VS fills the exact gap in our pipeline (LLM-native hypothesis generation) |
| Technical Feasibility | 9/10 | Training-free, model-agnostic, Python library exists |
| Implementation Complexity | 7/10 | Integration points are well-defined; main work is bridge code |
| Novelty/Differentiation | 9/10 | Nobody else combines VS with paraconsistent bilattice evaluation |
| Risk | 8/10 | Low technical risk; main risk is VS probability calibration |

**Critical Assumption**: VS self-rated probabilities correlate meaningfully with actual quality. The paper shows they do for creative tasks; needs validation for our epistemic/reasoning domains.

---

## Sources

- [Verbalized Sampling paper (arXiv)](https://arxiv.org/abs/2510.01171)
- [VS GitHub implementation](https://github.com/CHATS-lab/verbalized-sampling)
- [VS project website](https://www.verbalized-sampling.com/)
