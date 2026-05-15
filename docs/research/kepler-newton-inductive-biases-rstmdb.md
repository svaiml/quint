# Kepler→Newton Inductive Biases and RSTMDB Citation Analysis

> **Last updated**: 2026-05-04
> **Status**: Complete
> **Task**: docs-smau
> **arXiv**: 2602.06923 — "From Kepler to Newton: Inductive Biases Guide Learned World Models in Transformers" (Liu, Sanborn, Ganguli, Tolias)
> **GitHub**: github.com/KindXiaoming/newton-kepler

---

## Executive Summary

The paper studies how three inductive biases enable transformer world models to discover **physical laws** (Newton strategy) rather than merely **memorizing trajectories** (Kepler strategy). The phase transition between the two strategies is structurally identical to the RSTMDB citation analysis problem: Kepler = pattern-match citation trajectories; Newton = discover why papers get cited.

The paper provides the theoretical justification for why **temporal locality** (SFA sliding window, docs-1wru) is the correct inductive bias for RSTMDB — it is the bias that forces discovery of local causal laws rather than global trajectory fitting.

---

## 1. The Paper's Core Framework

### 1.1 Setup

A transformer world model is trained to predict planetary positions from trajectory data. The question: does the model memorize orbital geometry (Kepler) or discover Newtonian dynamics (Newton)?

**Kepler strategy**: Fit the global trajectory — memorize that planets move in ellipses. Good for interpolation, fails on extrapolation or perturbation (a sudden mass change breaks the ellipse).

**Newton strategy**: Discover the local causal law — for each timestep, the force applied equals mass times acceleration, and force falls off as 1/r². Good for extrapolation and perturbation, requires understanding the *mechanism* not the *pattern*.

### 1.2 Three Inductive Biases

The paper identifies three interventions that shift the model from Kepler to Newton:

| Bias | Mechanism | Effect |
|---|---|---|
| **Spatial smoothness** | Regularize across adjacent spatial positions | Forces learning of spatially continuous (law-like) rather than position-specific functions |
| **Spatial stability** (noise injection) | Add noise to input positions during training | Forces learning of position-invariant dynamics; breaks position-specific memorization |
| **Temporal locality** (window constraint) | Restrict context window to recent timesteps only | Forces learning of *local causal forces* (what happened recently → what happens next); blocks fitting of global trajectory geometry |

**Key finding**: temporal locality is the single most powerful of the three. Without it, models overwhelmingly adopt the Kepler strategy regardless of other regularization.

### 1.3 The Phase Transition

As the context window shrinks from full-trajectory to local-window, there is a sharp **phase transition** in strategy:
- Long window → Kepler dominant (global geometry fitting)
- Short window → Newton dominant (local causal law discovery)
- The transition is not gradual — it is a first-order phase transition with a critical window length

---

## 2. RSTMDB Mapping

### 2.1 Kepler vs. Newton in Citation Analysis

| Physics | RSTMDB |
|---|---|
| Orbital trajectory | Citation trajectory (papers cited per year) |
| Memorize ellipse geometry | Pattern-match historical citation curves |
| Kepler strategy | "This paper follows the 'slow rise then decay' citation pattern" |
| Newton strategy | "This paper is cited because it introduced technique X, used by fields A and B" |
| Local causal force (F = ma, 1/r²) | Local citation mechanism (what caused this paper to be cited in this window) |
| Force depends on current position/velocity | Citation depends on current scientific context (what problems are active) |

**Kepler failure mode in RSTMDB**: A model that learns global citation curve shapes predicts future citations from curve shape continuity. It fails when a paper suddenly spikes (new technique becomes important) or decays (field abandoned) — exactly the cases RSTMDB most needs to get right.

**Newton goal in RSTMDB**: Discover the local causal mechanism — which features of a paper (technique, problem domain, connection to active fields) cause it to be cited in a given time window. This is the SFA stability score: a paper is stable if its citation mechanism is time-invariant, unstable if the mechanism is context-dependent.

### 2.2 Temporal Locality as the Critical Bias

The paper's finding that temporal locality is the dominant factor maps directly to SFA's sliding window architecture (docs-1wru):

**SFA sliding window** = precisely the temporal locality inductive bias. By restricting the model's context to a recent window of the citation record, SFA forces discovery of local causal mechanisms rather than global trajectory fitting.

This provides the **theoretical justification** for the SFA window parameter:
- Window too long → Kepler regime → memorizes citation curve shapes → poor generalization
- Window optimal → Newton regime → discovers local citation mechanisms → generalizable stability scores
- Window too short → loses signal (insufficient context for the causal mechanism)

The critical window length from the paper suggests a principled search strategy for the SFA window hyperparameter: search around the phase transition point, not across the full range.

### 2.3 Spatial Stability → Citation Stability

The spatial stability bias (noise injection) has an RSTMDB analogue: **noise in the citation count** (e.g., injecting artificial citation spikes during training) forces the model to learn citation mechanisms that are *invariant to count magnitude* — it must learn why papers get cited, not how many.

This is equivalent to the SFA stability metric itself: a paper is "stable" if its citation growth mechanism doesn't change across windows, regardless of the absolute count level.

---

## 3. Connection to LMIC Smooth Manifold (arXiv:2504.03933)

The Kepler→Newton phase transition mirrors the LMIC smooth manifold→discrete checkpoint transition (docs-10a):

| Kepler-Newton (2602.06923) | LMIC (2504.03933) |
|---|---|
| Kepler: fit global trajectory geometry | Smooth manifold: continuous function fitting |
| Newton: discover local causal forces | Discrete checkpoints: locally valid approximations |
| Phase transition: global → local | Phase transition: smooth → discrete |
| Critical window: below it, Newton; above, Kepler | Critical scale: below it, smooth; above, discrete |

Both papers study the same fundamental phenomenon: **at what scale does a learning system transition from global pattern fitting to local causal law discovery?** The common theoretical thread is that *temporal/spatial locality biases are the mechanism that forces the transition*.

---

## 4. Science Genealogy Platform Implications

### 4.1 Graph Architecture Bias

The Science Genealogy graph should be structured with **temporal locality** as a first-class property:

- Each edge has a **temporal window** of validity (when was this influence active?)
- Queries should default to **recent context windows** rather than full-history traversal
- The infer proof engine should weight recent provenance chains over historical ones when evaluating citation claims

This prevents the Science Genealogy platform from falling into the Kepler regime (fitting historical genealogy patterns) and pushes it toward the Newton regime (discovering active causal mechanisms in scientific influence).

### 4.2 RSTMDB Integration

The three inductive biases suggest three concrete RSTMDB model architecture requirements:

| Bias | RSTMDB Implementation |
|---|---|
| Temporal locality | SFA sliding window (docs-1wru); critical window search around phase transition |
| Spatial stability | Count-normalized citation features; training with citation count noise injection |
| Spatial smoothness | Regularization across similar papers (same field, same technique cluster) |

### 4.3 Kepler vs. Newton as User-Facing Framing

The Kepler/Newton dichotomy is usable as a product framing for RSTMDB's value proposition:

> **Kepler mode** (competitors): "This paper will be cited X times based on its historical citation curve."  
> **Newton mode** (RSTMDB): "This paper is cited because of mechanism Y, active in field Z — and here's how long that mechanism will remain active."

---

## 5. Hypotheses Generated

**H-KN1 — SFA Window Phase Transition**: The SFA stability score exhibits a phase transition as a function of window length. There is a critical window length W* below which the score is mechanism-sensitive (Newton regime) and above which it is curve-shape-sensitive (Kepler regime). W* can be estimated from the RSTMDB citation corpus and should be used as the default SFA window parameter.

**H-KN2 — Noise Injection Improves Mechanism Recovery**: Adding controlled noise to citation counts during RSTMDB model training (analogous to the spatial stability bias) improves the model's ability to identify papers with stable citation mechanisms — papers that will remain relevant even if their citation count fluctuates.

**H-KN3 — Temporal Locality Outperforms Global Curve Fitting**: An RSTMDB model trained with a local citation window (SFA-style) will outperform a model trained on full citation trajectories on the task of predicting citation counts 3–5 years ahead, specifically for papers that experience significant context shifts (field pivots, technique obsolescence).

---

## 6. Cross-References

- `docs-1wru` (SFA stability mechanism) — temporal locality window is the formal basis of SFA
- `docs-10a` (LMIC smooth manifold, arXiv:2504.03933) — parallel phase transition: smooth→discrete mirrors Kepler→Newton
- `soviet-math-llm-lineage.md` — Kolmogorov Complexity → Entropy-Memorization Law → Hallucination as lossy decompression (Kepler failure mode is the same as memorization failure)
- `captain-obvious-triz-solution-space.md` — mode-seeking = Kepler strategy; VPI escape = Newton strategy
- arXiv:2602.06923 — source paper
- arXiv:2504.03933 — LMIC smooth manifold (docs-10a)
- github.com/KindXiaoming/newton-kepler — implementation and experiments
