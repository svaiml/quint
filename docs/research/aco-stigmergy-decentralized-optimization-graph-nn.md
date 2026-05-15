# ACO and Stigmergy: The 1992 Algorithm That Returned at NeurIPS 2023

> **Context**: Ant Colony Optimization (ACO, Dorigo 1992) emerged from a 1989 biology experiment. In 2026, a Habr author benchmarks it against TSP (0.10% from optimum) and traces its 2023 NeurIPS comeback as a GNN backbone (DeepACO). The mechanism — stigmergy — is architecturally relevant to multi-agent coordination without a central orchestrator.
> **Question**: What is stigmergy, what are the concrete ACO mechanics, and what does the NeurIPS 2023 DeepACO paper mean for knowledge graph navigation?
> **Last updated**: 2026-05-08
> **br task**: docs-zcsg

---

## Short Answer

**Stigmergy = indirect coordination through shared environment modification. Agents don't talk to each other — they modify the world, and the world guides future agents. This is the design pattern behind ACO, and it maps cleanly to index.map access tracking and multi-agent knowledge accumulation.**

```
ACO CORE MECHANIC                  ZomboCraftEco ANALOG
─────────────────────────────────────────────────────────────────
Pheromone τ: quality signal        Access frequency of concept labels
  deposited by successful ants       (which index.map entries led to fixes)

Heuristic η: domain knowledge      Concept label namespace hierarchy
  1/distance to next city             (auth.* > utils.* for auth tasks)

Selection probability:             Weighted concept label ranking:
  P(i→j) ∝ τ^α · η^β               P(label) ∝ freq^α · relevance^β

Evaporation ρ:                     Label relevance decay:
  stale pheromone fades               old access patterns less trusted

DeepACO (NeurIPS 2023):            Learned codegraph edge ranking:
  GNN replaces manual η              GNN output as relevance score
  single architecture, 8 problems    generalizes across domains
```

The pheromone matrix is a **better attention mechanism than transformer attention for this problem**: it carries semantic meaning (which paths led to successful outcomes) vs. transformer attention weights (which have no interpretable meaning).

---

## The Biology: Stigmergy

1989 experiment: Argentine ants (*Linepithema humile*), 250,000 neurons, no map memory, no coordinator. Two bridges, one twice as long. Entire colony converges on short bridge in 100% of trials.

Mechanism: **stigmergy** — coordination through environment modification.

```
Ant A takes short bridge (shorter → returns faster)
  → deposits pheromone on short bridge path
  → short bridge now has more pheromone

Ant B chooses based on pheromone → also takes short bridge
  → deposits more pheromone

Positive feedback: more pheromone → more ants → more pheromone
Evaporation: stale paths lose signal → exploration continues
```

No ant knows the global solution. No ant communicates directly with another. The environment is the communication medium.

**Key property**: the algorithm is *anytime* (any snapshot is a valid approximate solution) and *self-healing* (if the short bridge breaks, pheromone evaporates, long bridge gets traffic, new equilibrium).

---

## ACO Algorithm Mechanics

### The Math

```
PHEROMONE UPDATE:
  Evaporation: τᵢⱼ ← (1 − ρ) · τᵢⱼ         (ρ = 0.1 → 10% fades each round)
  Deposition:  τᵢⱼ ← τᵢⱼ + Q / Lₖ           (better tour = more pheromone)

PATH SELECTION PROBABILITY:
  P(i → j) = (τᵢⱼ^α · ηᵢⱼ^β) / Σₗ(τᵢₗ^α · ηᵢₗ^β)

  τ  = pheromone (learned quality signal from past experience)
  η  = heuristic (domain knowledge: η = 1/distance)
  α  = trust in learned signal (α=1.0 in benchmark)
  β  = trust in domain heuristic (β=4.0 in benchmark → heuristic matters more)

PARAMETERS (TSP berlin52):
  n_ants = 30, n_iter = 150, α = 1.0, β = 4.0, ρ = 0.1, Q = 1.0
```

### TSP Benchmark Results

| Method | Tour Length | Deviation |
|---|---|---|
| Random (best of 1,000) | 24,553 | +225.6% |
| Nearest Neighbor (best of 52) | 8,182 | +8.5% |
| ACO average (5 runs) | 7,651 | +1.44% |
| **ACO best (5 runs)** | **7,549** | **+0.10%** |
| Optimum | 7,542 | — |

**0.10% from optimum** with 30 ants × 150 iterations = 4,500 tour evaluations. No neural network, no training data, no GPU.

---

## DeepACO at NeurIPS 2023

**Paper**: "DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization" (Haoran Ye, NeurIPS 2023)

### The Innovation

Replace the manual heuristic η with a GNN:

```
STANDARD ACO:
  η_ij = 1/distance(i, j)   ← hand-crafted domain knowledge

DEEPACO:
  η_ij = GNN(city_coordinates)[i, j]   ← learned by neural network
  GNN: coordinates → edge heatmap (probability of inclusion in optimal tour)
  
RESULT:
  1. Single architecture works across 8 combinatorial problems
     (TSP, CVRP, OP, PCTSP, SOP, ...)
  2. Matches specialized networks trained per-problem
  3. Surpasses pure ACO (better heuristic → better guidance)
  4. Classical ACO pheromone mechanics unchanged
```

**The key insight**: the pheromone mechanics (stigmergy) are the outer loop; the neural network just improves the initialization of where ants start looking. The ants then refine the solution through collective exploration.

### What This Means for Knowledge Graph Navigation

The TSP city = knowledge node (concept label, RSTMDB triple, research document).
The optimal tour = optimal context construction for a given task.

DeepACO suggests: train a GNN on successful past knowledge navigation paths → use it as the heuristic η for future navigation. The GNN learns "which knowledge nodes are typically relevant together" — a learned index.map ranking.

This is the neural extension of the pheromone-as-access-frequency idea.

---

## The Pheromone Matrix as Interpretable Attention

The article makes a pointed observation:

> "The pheromone matrix serves as ready visualization of what the algorithm considers important, whereas transformer attention weights lack comparable semantic meaning."

Transformer attention: numerical weights over all token pairs. No semantic interpretation. Black box.

Pheromone matrix: each entry is the accumulated history of successful path usage. White box.

```
Pheromone matrix after 150 iterations:
  city 5 → city 12:  τ = 4.2   (heavily used in good tours)
  city 5 → city 7:   τ = 0.3   (rarely used, usually suboptimal)
  city 5 → city 3:   τ = 1.1   (moderate, used in acceptable tours)
```

Applied to index.map:
```
Pheromone of concept label access chains:
  auth.entry-point → auth.token-validation: τ = 8.7  (often co-navigated)
  auth.entry-point → auth.session:          τ = 2.1  (less common)
  auth.entry-point → utils.cache:           τ = 0.2  (almost never together)
```

This matrix is a learned understanding of the codebase's semantic neighborhoods. It's richer than just "auth.token-validation is tagged" — it captures "when auth.entry-point is relevant, auth.token-validation is usually also relevant."

---

## Applicability to ZomboCraftEco

### 1. index.map Pheromone Layer

Current: agents grep index.map → read source lines → fix → done. No learning.

With pheromone:
```
.codegraph/pheromone.tsv  (new file, alongside index.map)

Format: from_label  to_label  τ  last_success  quality

auth.entry-point  auth.token-validation  8.7  2026-05-07  fix_accepted
auth.entry-point  auth.session           2.1  2026-04-20  fix_accepted
auth.entry-point  utils.cache            0.2  2026-03-10  fix_rejected
```

Agent query: "auth bug near entry point" → grep `auth.entry-point` → but ALSO follow high-τ edges to `auth.token-validation`. Context packet is enriched with the pheromone-suggested co-relevant concepts.

**Evaporation**: τ decays over time (old access patterns less trusted). Simple: τ *= 0.9 on each session.

**Deposition**: when a fix is accepted by human or tests pass → deposit along the navigation path used.

**Implementation**: ~100 lines Python or Rust; no neural network required; stores in one TSV file.

### 2. The α/β Balance Problem

In ACO: β=4.0 (domain heuristic) >> α=1.0 (learned pheromone). At start with no pheromone, the heuristic must dominate. As history accumulates, α can be raised.

In index.map navigation: at start of a new codebase, no pheromone exists → rely on concept label namespace hierarchy (heuristic η). As navigation history builds → pheromone matters more.

**Design rule**: new projects start with α=0.1, β=5.0 (rely on namespace). Mature projects migrate toward α=2.0, β=2.0 (trust learned patterns equally).

### 3. Stigmergy as Agent Coordination Pattern

Our multi-agent pipeline currently coordinates via explicit context packets (Context Collector → Architect). This is direct communication.

Stigmergy would add an implicit layer:
- Context Collector leaves a "pheromone trace" in `.codegraph/pheromone.tsv` after each successful navigation
- Future Context Collectors read the trace → biased toward paths that worked before
- Architect doesn't need to know about this — it's sub-agent coordination through shared environment
- This is robust: even if the context packet system changes, the pheromone file persists

### 4. When ACO Pattern Applies (vs. Neural Approach)

From the article's conclusions:

| Condition | ACO Better | Transformer Better |
|---|---|---|
| New codebase (no training data) | ✓ | ✗ |
| Custom constraints (unusual architecture) | ✓ | ✗ |
| Interpretability required | ✓ | ✗ |
| 10k+ modules, millions of examples | ✗ | ✓ |
| Speed over quality | ✗ | ✓ |

Our codebase navigation scenario:
- New codebases are common → ACO pattern applies
- Architecture constraints vary per project → ACO pattern applies
- Interpretability (why did the agent look here?) is desirable → ACO pattern applies
- Scale is 50-500 modules, not 10k → ACO range

**Verdict**: for codegraph navigation with ≤500 modules, the pheromone layer approach is appropriate. For massive enterprise codebases (10k+ modules), DeepACO (GNN + pheromone) would be the right approach.

### 5. RSTMDB Knowledge Graph: Pheromone Over Citation Chains

RSTMDB stores provenance triples. Knowledge navigation is: given a new claim → find related prior claims.

Current: no navigation mechanism (the central gap).
With pheromone: triple-to-triple access patterns build a "what tends to be researched together" map.

```
RSTMDB pheromone after multiple research sessions:
  TurboQuant → KV-cache-compression:         τ = 7.2  (always co-researched)
  DeepSeek-MLA → KV-cache-compression:       τ = 6.8
  TurboQuant → multi-agent-pipeline:         τ = 1.2  (rarely connected)
```

This is a learned citation neighborhood — richer than explicit links. The pheromone captures "researchers who study TurboQuant also study KV cache and DeepSeek" even before explicit RSTMDB triples link them.

---

## The Deeper Connection: Stigmergy as Knowledge Accumulation

The key design insight from ACO is:

> **Successful action is its own memory.**

You don't explicitly encode "this worked." The trace of successful action — the pheromone — accumulates implicitly. Future agents are guided by accumulated traces of past success.

This is a fundamentally different philosophy from explicit knowledge representation:
- RSTMDB: explicit triples (heavy, requires curation)
- Pheromone: implicit traces (lightweight, accumulates automatically)

The two are complementary:
- Pheromone guides exploration (what to look at)
- RSTMDB captures verified knowledge (what is true)
- Pheromone is soft, decays, self-corrects
- RSTMDB is hard, versioned, formally consistent

The nightly reflection pipeline (`docs-f0ef`) could use the pheromone as its navigation layer: "run lint on the clusters of documents with highest pheromone co-access" — prioritize the knowledge neighborhoods that are most actively used.

---

## Design Rules Derived

1. **Stigmergy over direct coordination where possible.** Agents that leave traces in shared files (pheromone.tsv, facts.infer) enable future agents to benefit from past successes without explicit communication. This is lower coupling than P2P messages.

2. **α=low, β=high at project start; rebalance with history.** When there is no pheromone, domain heuristic must dominate. Build in the rebalancing as history accumulates.

3. **Pheromone matrix is the audit log.** High-τ edges in pheromone.tsv show which navigations were repeatedly successful. This is a free interpretability layer — no additional tooling needed.

4. **Evaporation prevents overfit.** Without evaporation, pheromone accumulates from old sessions that are no longer valid (refactored code). Regular decay ensures only recent successes guide navigation.

5. **DeepACO pattern for 10k+ scale.** If codegraph ever reaches enterprise scale (10k+ modules), replace the manual heuristic η with a GNN trained on pheromone history. The pheromone mechanics stay the same; the heuristic gets smarter.

---

## Does Beads-Rust Already Implement the ACO Pattern?

**Verdict: Static approximation — structurally analogous but missing the dynamic outcome-feedback loop that defines true stigmergy.**

### What bv DOES implement (ACO analogs)

```
ACO MECHANIC              bv EQUIVALENT                   MATCH TYPE
──────────────────────────────────────────────────────────────────────
Pheromone τ               PageRank score                  STATIC structural
  accumulated from         derived from dependency         τ comes from
  successful tours         graph topology                  GRAPH EDGES,
                                                           not from outcomes

Heuristic η               text similarity score           DOMAIN heuristic
  1/distance to next city  (TF-IDF / embedding distance)  ✓ correct analog

α/β balance               --search-weights flag           DIRECT KNOB
  P(i→j) ∝ τ^α · η^β     {"text":0.3,"pagerank":0.5}     ✓ exact equivalent
                           pagerank = τ weight             text = η weight

Evaporation ρ             staleness factor                TIME-BASED decay
  τ *= (1 - ρ)            score penalizes old open tasks  not outcome-based

Path selection             impact_score composite          COMPOSITE score
  weighted probability     0.22·pagerank + 0.20·betweenness  ✓ analogous
                           + 0.124·blocker_ratio + ...

Bridge nodes              betweenness centrality           ✓ explicit metric
  ants prefer connectors   tasks that connect graph        well-implemented

Ant colony size           graph: 329 nodes, 145 edges     ACO operates at
                           density: 0.00134                correct scale
```

### What is MISSING (the stigmergy gap)

**In ACO, pheromone is deposited by SUCCESSFUL tours**: τᵢⱼ += Q / Lₖ (where Lₖ = tour length; better tour = more pheromone deposited).

**In bv, `br close <id>` deposits NOTHING back into the graph.**

```
WHAT HAPPENS IN ACO:
  Ant navigates city sequence → solution quality evaluated
  → High-quality tour: τᵢⱼ += Q/Lₖ  (large deposit)
  → Low-quality tour: τᵢⱼ += Q/Lₖ  (small deposit)
  → Future ants: biased toward paths used in HIGH-quality tours

WHAT HAPPENS IN bv:
  Agent completes task → br close docs-xxxx
  → Nothing is deposited back
  → PageRank does NOT change because the dependency graph is static
  → Future impact_score is identical whether the closed task was:
      (a) a key blocker resolved = "high-quality tour"
      (b) a dead-end task nobody depended on = "low-quality tour"
  → 51 closed tasks have contributed ZERO pheromone signal

THE MISSING MECHANISM:
  When br close docs-xxxx fires:
  1. Identify the dependency chain that docs-xxxx was on
  2. Score the "tour quality" — how many downstream tasks became unblocked?
  3. Deposit into the graph: increase edge weight for the path that led here
  4. Future searches are biased toward paths that COMPLETED SUCCESSFULLY
```

### Concrete data confirming the gap

```
Graph stats (verified 2026-05-08):
  329 nodes (issues), 145 edges (dependency links)
  51 closed tasks — 11 had dependency links before closure
  0 edges carry outcome-based weight → ALL PageRank is structural-only

bv search weights schema (what exists):
  {"text": N, "pagerank": N, "impact": N}
  text = η heuristic ✓, pagerank = τ structural ✓
  Missing: "outcome_pheromone": N — no such field exists
  Missing: per-edge deposition record on closure

bv staleness (evaporation analog):
  open tasks: staleness penalizes old tasks (time-based ✓)
  closed tasks: contribute nothing to future scoring (outcome-blind ✗)
```

### Classification: Structural ACO vs Outcome-based Stigmergy

| Property | bv (current) | True ACO Stigmergy |
|---|---|---|
| Exploration mechanism | PageRank of current graph | Pheromone trails from past successful paths |
| Learning from success | ✗ None | ✓ τ += Q/Lₖ on good tours |
| Evaporation | ✓ Time-based staleness | ✓ τ *= (1-ρ) each round |
| α/β tuning | ✓ --search-weights | ✓ α, β parameters |
| Self-healing | ✓ Re-compute on graph change | ✓ Evaporation resets stale paths |
| Interpretable | ✓ factor breakdown visible | ✓ pheromone matrix readable |
| **Stigmergic feedback** | **✗ Missing** | **✓ Core mechanism** |

**Practical implication**: bv finds important tasks today (based on graph structure). It cannot learn which *navigation sequences* historically led to the most valuable outcomes. Each session starts with the same structural baseline — no accumulated "what worked before."

### What would genuine stigmergy require

```python
# Pseudocode: pheromone deposition on br close
def on_task_close(task_id):
    # 1. Measure tour quality
    unblocked = count_tasks_unblocked_by(task_id)
    tour_quality = Q / (1 + 1/max(unblocked, 1))   # Q/Lₖ analog
    
    # 2. Deposit on the path that led here
    for dep in task.dependency_chain:
        edge_pheromone[dep.from_id][dep.to_id] += tour_quality
    
    # 3. Write to persistent store
    append_to_pheromone_log(task_id, tour_quality, deps)

# bv search then uses: score ∝ edge_pheromone^α · text_similarity^β
# This is the missing 50% of ACO
```

**This is exactly the `docs-phero` follow-up task** — but for the bv/br layer, not just index.map. The same pattern is needed in two places:
1. `.codegraph/pheromone.tsv` — for code navigation (index.map paths)
2. bv graph edge weights — for task navigation (which task sequences complete successfully)

---

## Follow-up Tasks

- docs-phero: design pheromone layer for index.map — `.codegraph/pheromone.tsv` format, evaporation, deposition on fix acceptance
- docs-bvphr: design outcome-pheromone extension for bv — `br close` deposits tour quality into edge weights; adds `{"outcome_pheromone": N}` to --search-weights; enables true stigmergic task navigation

---

## Sources

- [Habr: Муравьи против трансформеров (habr.com/ru/companies/selectel/articles/1031574/)](https://habr.com/ru/companies/selectel/articles/1031574/) — ACO mechanics, TSP berlin52 benchmark (0.10% from optimum), DeepACO NeurIPS 2023, α/β parameters
- Dorigo, M. (1992) — Ant System, original ACO paper
- Goss, Aron, Deneubourg, Pasteels (1989) — Belgian biologists' bridge experiment
- [DeepACO: Neural-enhanced Ant Systems (NeurIPS 2023, Haoran Ye)](https://arxiv.org/abs/2309.14545) — GNN replaces manual heuristic; single architecture for 8 combinatorial problems
- Prior: `docs/research/multi-agent-codebase-navigation-pipeline.md` — 3-tier pipeline; implicit coordination gap addressed by stigmergy layer
- Prior: `docs/research/epistemic-cycle-mas-architecture-vs-zombocrafteco.md` — missing self-knowledge axis; pheromone is one form of agent self-knowledge
