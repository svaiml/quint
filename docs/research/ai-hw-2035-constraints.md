# AI+HW 2035: Hardware Constraints Roadmap — Algorithm Co-Design Implications

> **Source**: arXiv:2603.05225 — "AI+HW 2035: Shaping the Next Decade"
> **Authors**: Deming Chen, Jason Cong, Azalia Mirhoseini, Christos Kozyrakis, Yann LeCun, Tri Dao, and 24 co-authors (Stanford, UCLA, CMU, IBM, MIT, industry consortium)
> **Last updated**: 2026-05-03
> **br task**: docs-gcbi
> **Scope**: Hardware constraint mapping to Infer / RSTMDB / pctl-rs / multi-agent harness

---

## Core Claim

The paper organizes around one target: **1000× improvement in AI training and inference efficiency over 10 years**, requiring a shift from maximizing raw throughput to maximizing **intelligence per joule**. This requires simultaneous co-design across three layers:

- **Algorithm layer** (10× contribution): sparse models, low-precision arithmetic, test-time scaling efficiency, noise-tolerant training
- **Silicon/architecture layer** (20× contribution): compute-in-memory (CIM), 3D chiplet integration, photonic interconnects, HBM
- **System orchestration layer** (5× contribution): adaptive routing, small-big model symbiosis, energy-proportional scheduling

> **Important calibration**: The 10×/20×/5× decomposition is the external framing (from the Russian-language review). The paper's actual claim is the unified 1000× target. The decomposition is directionally correct but should not be treated as a precise budget.

The metric shift: not "more operations per second" but "correct knowledge assertions per joule."

---

## Constraint 1: The Memory Wall

### What it is

Energy for **moving data** now exceeds energy for **computing on it**. This is the dominant hardware constraint going forward — not raw flop capacity but data-movement bandwidth and cost. Every read from DRAM to compute core costs more joules than the arithmetic it enables. The bottleneck is:
- Dennard scaling ended (power no longer scales down as transistors shrink)
- Off-chip signaling energy scales linearly with distance, quadratically with wire capacitance
- Von Neumann gap: processor speed vastly outpaces memory bandwidth

### Implications for the platform

**Infer Engine:**
Standard Horn-clause backward-chaining is the canonical memory-wall-hostile workload: pointer-chasing over heap-allocated term structures, irregular access patterns, minimal data reuse. Each unification step loads a term, follows a pointer, loads the next term — 1 flop per 16+ bytes moved.

Required redesign:
- **Flattened fact tables** over linked term structures. Ground facts as packed integer arrays (atom IDs) with FOUR bilattice truth values encoded as 2-bit fields *in the same word* as the fact ID — no separate heap allocation for truth values
- **First-argument indexing** to prune the search space before any memory access
- **Batch clause evaluation**: group queries over the same rule template, evaluate together to amortize the cost of loading the rule into cache across many ground substitutions
- **Demand-driven (lazy) evaluation**: mark newly-derived facts as ⊥ (unknown) until queried; do not propagate all consequences of a new fact immediately — this bounds the working set

**RSTMDB (citation graph):**
Sparse graph traversal = canonical memory-wall workload. Citations are random access with no temporal locality.

Required redesign:
- **Locality-aware graph layout**: Hilbert curve ordering or METIS bisection so citation neighborhoods fit within L2/L3 cache
- **Provenance metadata inlining**: store source, confidence, and timestamp in-line with edges (not in separate tables); turns a join into a sequential scan
- **Hot/cold layer separation**: full provenance chains are cold-accessed (audit, debug); graph topology (integer edge arrays) is hot; never mix them in the same data structure
- **Frontier-based BFS** with explicit work-stealing rather than recursive call stacks; keeps active working set bounded

**pctl-rs:**
PCTL fixpoint computation = sparse matrix-vector multiply (SpMV) = ~1 flop per 12 bytes transferred. Already a known memory-wall workload.

Required: CSR/CSC format with sorted indices; block-sparse representation where model structure allows state grouping; streaming probability vector evaluation rather than random scatter-gather.

**Agent harness:**
Context engineering = data movement. Assembling and transmitting system prompts, retrieved documents, and tool results is fundamentally a serialization problem.

Required: system prompt caching (Anthropic prompt cache API — cache the fixed prefix that never changes between calls); rope-like lazy string concatenation instead of O(n) copy-on-assembly; treat context selection as an optimization against a cost model (marginal information per token), not a greedy "include everything that fits."

---

## Constraint 2: Compute-in-Memory (CIM) and 3D Integration

### What it is

CIM colocates arithmetic with storage — perform matrix-vector multiply directly inside or adjacent to memory arrays:

- **Digital CIM** (near-term, 2–5 years): SRAM arrays with embedded arithmetic units; deterministic, standard tooling
- **Analog/mixed-signal CIM** (longer-term, 5–10 years): resistive crossbars (PCM, RRAM) where weights are conductances and multiply-accumulate is Ohm's Law; orders-of-magnitude more energy-efficient but with noise, nonlinearity, and calibration drift
- **3D chiplet packaging** (near-term): stack memory dies directly on compute dies using TSV (through-silicon via); dramatically higher bandwidth than off-chip DRAM

### Implications for the platform

**Infer Engine — the CIM compilation problem:**
Logic reasoning is structurally CIM-hostile: irregular, branchy, pointer-chasing. The bridge is **neural-symbolic compilation**:
- Compile high-frequency rule templates into sparse weight matrices
- Execute them as approximate matrix operations on digital CIM hardware
- Use the FOUR bilattice as the decode interface: analog output below the T/F confidence threshold → ⊥; contradictory signals → ⊤
- Only T and F values exit the analog tier; ⊥ and ⊤ trigger re-evaluation on exact digital hardware

This creates a **two-tier cascade**:
1. **CIM fast path**: approximate, analog, high-throughput for well-known ground facts
2. **Exact symbolic path**: backward-chaining Horn clauses for novel queries, abduction, inconsistency detection

The FOUR lattice was designed for incomplete and inconsistent knowledge. This design maps hardware noise directly onto epistemic states — noise becomes indeterminacy rather than silent error. This is semantically sound.

**RSTMDB:**
3D integration creates bandwidth tiers with dramatically different costs. Hot/cold split becomes architectural:
- **Hot tier (HBM-backed)**: recent papers, highly-cited hubs, active research frontiers
- **Cold tier (NVMe-backed)**: full provenance chains, historical snapshots, rarely-accessed subgraphs
- **Edge tier**: compressed RSTMDB subgraph (topic-specific, time-bounded) for offline deployment; provenance includes the snapshot timestamp as part of the compressed KB's provenance metadata

**pctl-rs:**
SpMV is the most natural CIM target in the stack. Near-term: use existing sparse BLAS (cuSPARSE, MKL sparse). Medium-term: design state transition matrices for CIM-compilation — fixed-precision weights, regular structure, bounded fan-in per state.

---

## Constraint 3: Mixed-Signal Noise Resilience

### What it is

Analog CIM hardware produces noise, nonlinearity, and calibration drift. Algorithms that require exact bit-level determinism cannot run on analog hardware. The paper's principle: "algorithms that are inherently robust, probabilistic, or self-correcting" gain orders-of-magnitude efficiency on analog hardware.

No quantitative noise thresholds are specified. The principle is qualitative: design for statistical correctness, not bit-exact correctness.

### Implications for the platform

**Infer Engine — FOUR as analog noise model (key insight):**
This is the deepest alignment between the hardware roadmap and the platform's existing design. The FOUR bilattice already handles incompleteness (⊥) and inconsistency (⊤) as first-class epistemic states. On analog hardware:

| Analog hardware output | FOUR value | Interpretation |
|------------------------|------------|----------------|
| High-confidence True signal | T | Accept as true |
| High-confidence False signal | F | Accept as false |
| Contradictory signals (noise-induced) | ⊤ | Inconsistency — escalate to exact digital |
| Insufficient signal (below threshold) | ⊥ | Unknown — defer or escalate |

This is a **principled, hardware-aware semantics for approximate reasoning**. The FOUR bilattice was not designed for hardware; but it is structurally the right interface for analog noise. This is a significant architectural advantage.

**RSTMDB — provenance confidence as computational quality:**
Provenance confidence scores should encode *both* source semantic reliability *and* computational quality of derivation (analog path = lower confidence than exact digital path). These are part of the same evidence quality continuum. The provenance model already supports confidence annotation; wire the hardware execution tier into it.

**pctl-rs — adaptive precision:**
Run PCTL fixpoint iterations in low precision (INT8 or FP16); track accumulated error bounds; automatically switch to FP32/FP64 when error threatens to exceed the formula's required precision threshold. This is standard adaptive precision numerics (interval arithmetic, affine arithmetic) applied to hardware tier selection.

---

## Constraint 4: System Orchestration

### What it is

The paper identifies multi-agent AI orchestration as a first-class hardware problem. "Agentic AI systems increasingly act as orchestrators, selecting models, kernels, hardware resources, and execution strategies dynamically." Key features:
- **Large-population sparse coordination**: agents communicate through a shared substrate, not peer-to-peer
- **Large model + SLM symbiosis**: frontier models as teachers, domain SLMs for fast edge inference
- **Dynamic hardware tier selection**: task routing based on latency budget, energy budget, and correctness requirement

### Implications for the platform

**Agent harness architecture — three-tier routing:**

| Tier | Component | Use case | Cost profile |
|------|-----------|----------|-------------|
| Exact symbolic | Infer engine | Verified derivations, deterministic logic, no hallucination tolerance | Low latency, zero energy for pure reasoning |
| Fast approximate | Domain-tuned SLM | Entity extraction, classification, structured fact validation | Low cost, edge-deployable |
| Full reasoning | Frontier model (cloud) | Novel abduction, complex disambiguation, planning | High cost, high quality, used sparingly |

Routing logic: each task carries a `(latency_budget, energy_budget, correctness_requirement)` triple. Route to exact symbolic when correctness is non-negotiable. Route to SLM for high-frequency narrow tasks. Route to frontier only when the task is genuinely novel or requires world-model reasoning.

**Sparse coordination principle:**
Agents should coordinate through the shared KB (Infer + RSTMDB), not through peer-to-peer message passing. This:
- Creates a natural audit trail (all inter-agent communication is KB reads/writes with provenance)
- Is cache-friendly (the shared KB is a hot read target)
- Avoids full-mesh communication scaling problems
- Aligns with the paper's "sparse communication" multi-agent architecture

**Test-time compute offload:**
Instead of asking an LLM to "think through" a derivation in natural language (expensive, unverifiable, not cacheable), invoke the Infer DEDUCE verb for deterministic symbolic reasoning. This converts unstructured neural test-time compute into structured symbolic compute — lower cost, verifiable, cacheable results.

---

## Constraint 5: Edge vs. Cloud Deployment

### What it is

The paper contrasts:
- **Cloud training/inference** (gigawatt scale): throughput-optimized, amortize energy over long-horizon batch tasks
- **Edge physical AI** (milliwatt scale): millisecond latency, deterministic response, extreme energy efficiency

The power crisis is real: U.S. datacenter demand is rising by tens of GW while supply growth lags. Sustainability is a first-class design constraint.

### Implications for the platform

**Tiered deployment model:**

| Tier | Content | Optimization target |
|------|---------|---------------------|
| Cloud | Full RSTMDB, complete Infer KB, frontier model | Throughput, accuracy |
| Edge | Compressed RSTMDB subgraph (topic × time-bounded), restricted Infer rules, domain SLM | Latency, energy |
| Sync | Edge snapshot ← cloud at timestamp T | Provenance includes snapshot_T annotation |

**pctl-rs bounded-horizon mode:**
For edge deployment (embedded monitoring of physical experiments against probabilistic temporal safety specs), infinite-horizon PCTL is not viable under tight power budgets. **Bounded PCTL** (verify property up to time horizon H) must be a first-class mode, not an approximation. This matches edge power constraints and the paper's "deterministic response" requirement.

**Value-weighted resource allocation:**
Invest more compute (energy) in high-value, high-uncertainty claims; less in low-value, high-confidence facts. This is naturally expressed via STRESS and MONITOR — stress-test claims preferentially where their truth value matters most for downstream decisions. Not all knowledge is worth the same energy to verify.

---

## Algorithm Co-Design Checklist (Hardware-Friendly Properties)

| Property | Hardware-friendly | Hostile antipattern |
|----------|------------------|---------------------|
| Arithmetic intensity | Many flops per byte loaded | Pointer-chasing (1 flop per 16 bytes) |
| Precision tolerance | Correct at INT8/FP16 | Requires FP64 throughout |
| Access regularity | Predictable stride patterns | Random access, pointer indirection |
| Decomposability | Partitionable across nodes/tiers | Monolithic global state |
| Incremental correctness | Partial results are useful | All-or-nothing evaluation |
| Sparsity exploitation | Most values zero at zero cost | Dense ops over mostly-zero tensors |
| Noise tolerance | Statistical correctness acceptable | Exact bit-level determinism required |

**Assessment of the platform stack:**

| Component | Hardware-friendliness | Main gap | Mitigation |
|-----------|----------------------|----------|-----------|
| Infer Horn-clause engine | Low — hostile antipattern profile | Pointer-chasing, exact semantics | Compile to matrix form; FOUR lattice as CIM interface |
| RSTMDB citation graph | Moderate — SpMV friendly, provenance not | Provenance irregularity | Hot/cold separation; topology vs. metadata layers |
| pctl-rs SpMV | High — natural CIM target | Precision underflow at extremes | Log-space probability representation |
| Agent harness | Moderate | Context assembly data-movement | Prompt caching; lazy context assembly |

---

## Roadmap Horizon

| Horizon | Hardware readiness | Platform action |
|---------|-------------------|-----------------|
| **Now–2 years** | HBM, chiplets, hardware-aware compilers, INT8/FP16 | pctl-rs: INT8 sparse SpMV; RSTMDB: compressed layout; Infer: first-argument indexing, packed fact tables |
| **2–5 years** | 3D packaging, heterogeneous nodes, digital CIM | Agent harness: SLM routing; RSTMDB: tiered hot/cold; Infer: demand-driven FOUR evaluation |
| **5–10 years** | Analog CIM, photonic interconnects | Infer: CIM-compilable rule templates + FOUR noise interface; pctl-rs: bounded adaptive-precision; RSTMDB: hardware-quality provenance |
| **Post-2035** | Dense 3D heterogeneous integration | Full energy-proportional intelligence-per-joule platform |

---

## Architecture Recommendations

| # | Recommendation | Component | Horizon |
|---|---------------|-----------|---------|
| R1 | Every harness task carries `(latency, energy, correctness)` triple for routing | Agent harness | Now |
| R2 | FOUR ⊥/⊤ as hardware noise interface: analog below threshold → ⊥; contradiction → ⊤ | Infer | 5–10 yr |
| R3 | Provenance confidence encodes computational quality (analog vs. exact path) | RSTMDB | 2–5 yr |
| R4 | Separate topology (hot) from provenance metadata (cold) in RSTMDB | RSTMDB | Now |
| R5 | Compile high-frequency Horn-clause templates to sparse matrix form | Infer | 2–5 yr |
| R6 | Bounded-horizon PCTL as first-class mode for edge deployment | pctl-rs | Now |
| R7 | Measure intelligence per joule (knowledge assertions derived per joule) not calls/sec | Platform-wide | Now |

---

## Limitations of Source Paper

- No quantitative hardware targets (pJ/op, GB/s, exact process node dates)
- 10×+20×+5× decomposition is external framing, not in the paper
- Analog CIM: 6–10 year horizon with unresolved noise/calibration barriers
- Agentic architecture is identified as important but protocol-level guidance is absent
- Knowledge graphs and symbolic reasoning engines are outside the paper's scope — platform implications in this document are extrapolations

---

## Cross-References

| Document | Relationship |
|----------|-------------|
| `docs/research/glushkov-school.md` | Glushkov's SAA as proto-process-calculus — relevant to agent harness orchestration |
| `docs/research/management-schools.md` | Zakharov УСЭ / OGAS as system-level orchestration predecessor |
| `docs/assess/6-valued-lattice-assessment.md` | SIX bilattice for Infer — extends FOUR with confidence gradient relevant to CIM noise interface |
| `docs/research/apophatic-computational-epistemology.md` | FOUR bilattice as hardware noise model — see Constraint 3 |

---

*Research document: AI+HW 2035 hardware constraint mapping. br task: docs-gcbi*
