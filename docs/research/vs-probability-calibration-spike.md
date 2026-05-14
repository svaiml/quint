# Spike: VS Probability Calibration — Formal Guarantees, Belnap Bridge, DS Combination

**Date**: 2026-05-13
**Type**: Scientific Investigation
**Status**: Complete
**Parent**: docs/research/verbalized-sampling-ecosystem-amplification.md
**Epic**: zombo-sash-eco-u3i7 (VS Pipeline)

## Summary

VS self-rated probabilities are **systematically miscalibrated** (overconfident, ECE 0.20-0.38 naive). The VS paper performs ZERO calibration analysis. However: (1) our platform's existing `Bel(h) = p*cal, Pl(h) = 1-(1-p)*cal` formula IS Shafer's discounting — theoretically correct, only `cal` needs principled derivation; (2) a formal VS→Belnap bridge exists via DS mass over {T,F,B,N} (Bilkova et al. 2023); (3) conflict thresholds for multiple VS runs are well-defined. The pipeline is viable WITH mandatory calibration correction.

---

## Sources

| # | Source | Type | Key Contribution |
|---|--------|------|-----------------|
| 1 | Kadavath et al. "Language Models (Mostly) Know What They Know" (2022) | Paper | Pre-RLHF LLMs are reasonably calibrated; post-RLHF degrades |
| 2 | Tian et al. "Just Ask for Calibration" (EMNLP 2023) | Paper | Verbalized confidence > logit confidence for RLHF models |
| 3 | Yang et al. "On Verbalized Confidence Scores" (2024) | Paper | ECE ~0.07-0.10 for 70B+ with optimal prompting |
| 4 | Stengel-Eskin et al. "Calibrating Verbalized Probabilities" (2024) | Paper | Invert-softmax trick: ECE 5.2% -> 1.0% post-calibration |
| 5 | Liang et al. "Taming Overconfidence: Reward Calibration in RLHF" (2024) | Paper | RLHF reward models prefer confidence regardless of correctness |
| 6 | Bilkova et al. "Reasoning with belief functions over Belnap-Dunn logic" (2023) | Paper | DS mass functions over {T,F,B,N} — formal foundation |
| 7 | Bilkova et al. "Describing and Quantifying Contradiction" (ISIPTA 2023) | Paper | Conflict quantification in DS+Belnap framework |
| 8 | Yang et al. "Verbalizing LLM Higher-order Uncertainty via Imprecise Probs" (2026) | Paper | VS→credal set mapping precedent |
| 9 | Sentz & Ferson "Combination of Evidence in DS Theory" (Sandia) | Report | DS combination rules comparison |
| 10 | Sensoy et al. "Evidential Deep Learning" (NeurIPS 2018) | Paper | Dirichlet-based native mass functions from NNs |
| 11 | Zhang et al. "Verbalized Sampling" (arXiv 2510.01171) | Paper | The VS paper itself — no calibration analysis |

---

## Core Findings

### Finding 1: VS Probabilities Are NOT Calibrated

The VS paper (2510.01171) performs **zero calibration analysis**. No ECE measurement, no reliability diagrams, no calibration metrics. The gamma = 1 + alpha/beta formula describes distribution sharpening (mode collapse), not probability accuracy.

**Calibration by model size and method:**

| Source | ECE (typical) | Notes |
|--------|---------------|-------|
| Base model logits (pre-RLHF) | 0.05-0.10 | Best raw calibration |
| Post-RLHF logits | 0.10-0.40+ | RLHF systematically degrades |
| Verbalized confidence (naive) | 0.20-0.38+ | Clusters at 90-100% |
| Verbalized confidence (optimized prompt) | 0.07-0.10 | Requires careful prompt engineering |
| Verbalized + post-hoc temperature scaling | 0.01-0.08 | Best, but requires labeled calibration set |
| Consistency-based (multi-sample) | Best overall | Agreement/entropy over samples outperforms all |

**Dominant failure mode**: Systematic overconfidence. Models say "0.9" when accuracy is 0.6-0.7. Confidence clusters at 0.8-1.0, producing poor resolution in the critical 0.5-0.8 range.

**Critical implication**: Raw VS probabilities fed into DS belief intervals will produce artificially narrow [Bel, Pl], making the system falsely certain. Belnap tier promotions will be premature.

### Finding 2: Our Platform's DS Formula Is Correct (Shafer's Discounting)

The platform's existing formula:

```
Bel(h) = p(h) * cal
Pl(h)  = 1 - (1 - p(h)) * cal
```

**This IS Shafer's classical discounting** with reliability alpha = cal. The derivation:

1. Start with Bayesian mass: m({h_i}) = p_i (all mass on singletons)
2. Apply Shafer discount with reliability alpha = cal:
   - m_alpha({h_i}) = cal * p_i
   - m_alpha(Theta) = 1 - cal (ignorance mass)
3. Compute: Bel({h_i}) = cal * p_i, Pl({h_i}) = 1 - cal*(1-p_i)

The *structure* is theoretically well-founded. Only the *value* of `cal` was ad hoc — now it has a principled derivation.

**VS probabilities are most analogous to pignistic probabilities (BetP)**, not Bel or Pl. The discounting correctly derives [Bel, Pl] from BetP.

### Finding 3: Principled `cal` Derivation

| Method | Formula | When to Use |
|--------|---------|-------------|
| **ECE-based (recommended)** | cal = max(0.5, 1 - ECE) | When you have a domain-specific validation set |
| Reliability diagram | cal(bin) = accuracy(bin)/confidence(bin) | For per-hypothesis fine-grained discounting |
| Entropy-based | cal = 1 - H/H_max | When no ground truth available (measures spread not accuracy) |
| Conflict-adaptive | cal = cal_base * (1-K) | Self-correcting with multiple VS runs |
| **Conservative default** | **cal = 0.7** | When no calibration data available (70B+ models) |

For our platform: **start with cal = 0.7** (conservative default for large models), then build domain-specific calibration sets to measure ECE per task type.

### Finding 4: Formal VS→Belnap Bridge via DS Mass over {T,F,B,N}

Bilkova et al. (2023) defined DS mass functions over Belnap values as frame of discernment. This gives a principled (not hand-crafted) mapping:

**Step 1: Classify VS hypotheses by polarity**

```
Given VS output D = {(h_1, p_1), ..., (h_k, p_k)}, classify each h_i:
  sigma(h_i) in {+, -, ~}    (supports, opposes, ambiguous)

s+ = sum{p_i : sigma(h_i) = +}    evidence FOR
s- = sum{p_i : sigma(h_i) = -}    evidence AGAINST
s~ = sum{p_i : sigma(h_i) = ~}    ambiguous
```

**Step 2: Derive bilattice coordinates**

```
t = s+                              (evidence for = aggregate support mass)
f = s-                              (evidence against = aggregate opposition mass)
H_norm = -sum(p_i * log(p_i)) / log(k)    (normalized entropy)
confidence = 1 - H_norm
```

**Step 3: Classify to 7-tier TruthValue**

```
classify(t, f, confidence) =
  | t < 0.1  AND f < 0.1                     -> Unknown
  | t > 0.7  AND f > 0.7                     -> Conflicted
  | |t - f| < 0.15 OR confidence < 0.3       -> Contested
  | t > f AND confidence > 0.7 AND t > 0.7   -> StrongTrue (needs deductive confirmation)
  | t > f                                     -> WeaklyTrue
  | f > t AND confidence > 0.7 AND f > 0.7   -> StrongFalse (needs deductive confirmation)
  | f > t                                     -> WeaklyFalse
```

**Why this is better than hand-crafted thresholds:**
1. Uses full distribution shape, not single scalar p
2. Distinguishes Unknown (0,0) from Contested (balanced t,f > 0)
3. Detects conflict via polarity analysis
4. Entropy modulates weak/strong (concentration of evidence, not direction)

**Monotonicity property**: Adding concordant evidence increases t or f along truth ordering; adding any evidence increases t+f along knowledge ordering. The hand-crafted mapping is recovered as a degenerate case when k=1.

### Finding 5: DS Conflict Thresholds for Multiple VS Runs

When combining multiple VS runs via Dempster's rule:

| K Range | Interpretation | Action for VS |
|---------|---------------|---------------|
| K < 0.3 | Low conflict | Dempster's rule is safe |
| 0.3 <= K < 0.5 | Moderate | Increase ignorance mass (lower cal by 0.1) |
| K >= 0.5 | High conflict | Switch to Yager's rule or HITL |
| K >= 0.7 | Severe | Flag for human review — VS unreliable on this question |

**VS-specific stricter thresholds** because VS runs are NOT independent (shared training data, RLHF biases). K = 0.5 from LLM is more alarming than K = 0.5 from independent sensors.

**Alternative combination rules for high conflict:**

| Scenario | Rule | Why |
|----------|------|-----|
| K < 0.3, 2 runs | Dempster | Standard, low conflict |
| K in [0.3, 0.5), 2 runs | Dempster + lower cal | Mild conflict; widen interval |
| K >= 0.5, 2 runs | **Yager** (conflict → ignorance) | Honestly represents "LLM contradicted itself" |
| Any K, n > 3 runs | Murphy averaging then Dempster | Smooth noise over many samples |

### Finding 6: Connection to Existing Codebase

| Component | Location | How Spike Connects |
|-----------|----------|-------------------|
| `BilatticeState(t, f)` | `epistemic-universe/pbelnap/src/types.py` | Region boundaries (0.8/0.2/0.15) are close to principled derivation — main change: feed (t,f) from full VS distribution, not single p |
| `SixTruthValue` | `reasoning-universe/zz-notation/crates/zz-types/src/lib.rs` | Confidence-gated weak/strong aligns with proposed entropy modulation |
| `BeliefInterval { bel, pl }` | `epistemic-universe/criterium/docs/design/bridge2-session-model.md` | Bridge: bel = t, pl = 1 - f, uncertainty = 1 - t - f → feeds `Claim.try_advance()` |
| `compose_dtmc_sources` | `reasoning-universe/pctl-rs/crates/pctl-belnap/` | Conflict K maps directly to NINE bilattice composition conflict detection |

---

## Formal Framework

### The Complete VS→Pipeline Transform

```
VS output:  D = {(h_1, p_1), ..., (h_k, p_k)}, sum(p_i) = 1

┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Calibration Discount (Shafer)                           │
│                                                                 │
│   cal = max(0.5, 1 - ECE_domain)     // or 0.7 default         │
│   m({h_i}) = cal * p_i               // discounted mass         │
│   m(Theta) = 1 - cal                 // ignorance mass          │
│                                                                 │
│   Bel({h_i}) = cal * p_i                                       │
│   Pl({h_i})  = 1 - cal * (1 - p_i)                             │
│   [Bel, Pl] interval width = 1 - cal (constant)                │
├─────────────────────────────────────────────────────────────────┤
│ STEP 2: Polarity Classification                                 │
│                                                                 │
│   sigma: h_i -> {+, -, ~}            // NLI or rule-based       │
│   s+ = sum{cal*p_i : sigma(h_i)=+}  // calibrated support      │
│   s- = sum{cal*p_i : sigma(h_i)=-}  // calibrated opposition   │
│   s~ = sum{cal*p_i : sigma(h_i)=~}  // ambiguous               │
│   ign = 1 - cal                      // ignorance from discount │
├─────────────────────────────────────────────────────────────────┤
│ STEP 3: Bilattice Coordinates                                   │
│                                                                 │
│   t = s+         // evidence for (Bel(T) in Bilkova framework)  │
│   f = s-         // evidence against (Bel(F))                   │
│   H_norm = entropy(D) / log(k)                                  │
│   confidence = 1 - H_norm                                       │
├─────────────────────────────────────────────────────────────────┤
│ STEP 4: 7-Tier Classification                                   │
│                                                                 │
│   TruthValue = classify(t, f, confidence)  // see Finding 4     │
├─────────────────────────────────────────────────────────────────┤
│ STEP 5: Multi-Run Combination (optional)                        │
│                                                                 │
│   K = conflict mass between runs                                │
│   if K < 0.3:  Dempster's rule                                  │
│   if K < 0.5:  Dempster + lower cal by 0.1                      │
│   if K >= 0.5: Yager's rule (conflict -> ignorance)             │
│   if K >= 0.7: HITL flag                                        │
├─────────────────────────────────────────────────────────────────┤
│ STEP 6: BeliefInterval for criterium                            │
│                                                                 │
│   bel = t                                                       │
│   pl  = 1 - f                                                   │
│   uncertainty = pl - bel = 1 - t - f                            │
│   -> Claim.try_advance(bel, pl)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Practical Implications

### What MUST change in the pipeline issues

1. **criterium#8**: Add mandatory calibration step. VS output must be discounted before entering the loop. Default cal=0.7, with pathway to domain-specific ECE measurement. Add polarity classifier requirement.

2. **infer#34**: The dual ranking `mdl_score * vs_probability` should use `mdl_score * cal * vs_probability` (calibrated). AAF conflict between VS runs maps to DS conflict K — add K threshold check.

3. **pctl-rs#26**: The calibration_delta feedback is confirmed as essential. pctl-rs computes actual [lo, hi] intervals that serve as ground truth for measuring ECE. This enables adaptive cal: `cal_next = max(0.5, 1 - ECE_measured_by_pctl)`.

4. **zz-notation#19**: Replace hand-crafted p→tier mapping with the formal `classify(t, f, confidence)` function. Requires polarity classification upstream. Fallback single-p mapping still works as degenerate case (k=1, sigma=+).

### What we should NOT do

1. Never use raw VS probabilities as point estimates in PCTL transition weights
2. Never assume VS runs are independent — use stricter conflict thresholds
3. Never skip calibration "just for prototyping" — overconfident [Bel, Pl] is worse than wide intervals

---

## Open Questions

1. **Polarity classifier**: How to classify VS hypotheses as +/-/~? NLI model? Rule-based? This is a new dependency not in current issues.

2. **Domain-specific ECE**: We need calibration sets for each reasoning domain. What's the minimum validation set size for reliable ECE?

3. **Consistency-based vs verbalized**: Literature says multi-sample consistency outperforms verbalized probability. Should we run VS N times and use agreement as the primary signal, treating individual probabilities as secondary?

4. **Dirichlet alternative**: Sensoy's evidential approach gives native mass functions without post-hoc discounting. Worth exploring for tighter integration with bilattice loss (pbelnap).

---

## Follow-up Recommendations

1. **Update all 4 GitHub issues** with calibration requirements from this spike
2. **Create calibration validation task**: Build domain-specific calibration sets for ECE measurement
3. **Prototype polarity classifier**: Simple NLI-based sigma function for hypothesis classification
4. **Experiment**: Run VS 5x on same questions, measure K, validate conflict thresholds empirically
