# Epistemic Cycle MAS vs. ZomboCraftEco: Deep Philosophy Mapping

> **Context**: Habr article "From Sandbox to Epistemic Cycle" diagnoses 4 scaling failures in current MAS frameworks (OpenClaw/ReAct pattern) and proposes an epistemic cycle as the architectural solution. The user says this aligns with our philosophy. This document provides a deep analysis.
> **Question**: How does the epistemic cycle framework map to ZomboCraftEco's architecture? Where do we confirm the same thesis independently, where do we go further, and where are we behind?
> **Last updated**: 2026-05-08
> **br task**: docs-fyi3

---

## Short Answer

**We independently arrived at the same architecture from different entry points. ZomboCraftEco has partially formalized what the epistemic cycle describes informally. Key gap: we have no P2P typed envelope between agents, and no automated nightly reflection cycle.**

```
EPISTEMIC CYCLE COMPONENT          ZOMBOCRAFTECO EQUIVALENT         STATUS
────────────────────────────────────────────────────────────────────────────
Curiosity Activation               index.map grep                   ✓ built
  "what do we know?"               ("what code exists?")

World Simulation                   GRACE GREP slice                 ✓ built
  "predict before acting"          (read 37 lines before fix)

Epistemic Gap Identification       infer-analysis detect_gaps()     ✓ built
  "what is provably missing?"      (Horn clause gap detection)      FORMAL

Hypothesis Testing                 infer-core solver                ✓ built
  "run the experiment"             (does the rule fire?)            FORMAL

World Model Update                 RSTMDB provenance triples        ~ partial
  "update knowledge"               (typed, but no auto-ingestion)

P2P Typed Envelope                 Context packet (informal text)   ✗ missing
  "structured inter-agent message"

Uncertainty Score                  analyze_sensitivity() (proxy)    ~ partial
  "how confident is this step?"    (load-bearing facts, not score)

Nightly Reflection                 Nothing                          ✗ missing
  "background gap closure"
```

The epistemic cycle is the informal description of what infer-core formalizes.
"Epistemic" and "Infer" are the same word in different languages — the philosophy is identical.

---

## The Four MAS Scaling Failures

### Problem 1: Linear ReAct Loop

**Claim**: ReAct (Reason + Act) is reflexive, not cognitive. When uncertainty is high, agents hallucinate or loop on identical errors. They lack the ability to pause, identify knowledge gaps, and conduct targeted research.

```
ReAct loop:
  Input → Reason → Act → Observe → Reason → Act → ...
  No pause. No "what don't I know?" step. No epistemic map.
  When stuck: loops or hallucinates. Never escalates.
```

**ZomboCraftEco mapping**: The 3-tier pipeline (from `multi-agent-codebase-navigation-pipeline.md`) directly addresses this. The Context Collector sub-agent does the "pause and investigate" step before the Architect sees the task. The Architect never operates under high uncertainty — the Collector resolves uncertainty first.

But: the Collector's knowledge-gap investigation is **informal**. It greps, reads, assembles. There is no explicit "uncertainty map" or "what we don't know" output. The epistemic cycle formalizes this as `epistemic gap identification` with a typed `missing_knowledge` field.

**Divergence**: Their approach surfaces the uncertainty explicitly (`uncertainty_score`, `missing_knowledge` field). Ours resolves it before the Architect sees it, but leaves no trace of what was uncertain and how it was resolved. This means the Architect cannot calibrate its confidence based on how hard the Collector worked to resolve the task.

### Problem 2: Context Degradation Through Delegation

**Claim**: Agents delegate by passing raw text paragraphs. By the 3rd-4th step, objectives are distorted, constraints forgotten, and the context window fills with intermediate log garbage. "Architectural drift and chaos of untyped prompts."

**Their solution — P2P typed envelope**:
```json
{
  "intent": "Fix authentication bypass",
  "objective": "Find and patch token validation",
  "input_context": "auth/token_validator.py lines 45-81",
  "constraints": ["no breaking API changes", "tests must pass"],
  "output_contract": "unified diff + test results",
  "safety": {"max_file_writes": 1, "deny_paths": ["vendor/"]},
  "metadata": {"uncertainty_score": 0.3, "evidence_log": [...]}
}
```

**ZomboCraftEco mapping**: The context packet from Context Collector to Architect is currently informal text. We have the concept right — "context packet" is our term for what the article calls P2P envelope. But we have no schema.

The **index.map grep result** is the closest thing we have to a typed envelope for code navigation:
```
auth.token-validation  auth/token_validator.py  45  81  validate_token  function
```

This is typed (label, file, start, end, symbol, kind) — it is machine-readable, not prose. For the navigation layer, we already have typed structured output. The gap is at the *agent-to-agent communication* level: when the Context Collector hands off to the Architect, the handoff is prose.

**Gap identified**: Define a context packet schema (analogous to P2P envelope) for Context Collector → Architect handoff. At minimum: task, target_files, architectural_context, constraints, uncertainty_notes.

### Problem 3: Memory Fragmentation

**Claim**: Storing all facts, dialogue history, code snippets in one local file or unified vector DB causes search quality to degrade rapidly. Without strict separation between working cache, verified facts, and behavioral patterns, noise accumulates.

**Their solution — 4-layer memory (L1-L4)**:
```
L1 (Redis):      Working cache, agent state, session context
L2 (Qdrant):     Vector semantic search, document embeddings
L3 (Mem0):       Long-term semantic memory, SPO triples, confirmed knowledge
L4 (SQLite):     Confirmed knowledge across 4 axes: self/user/interaction/world
```

**ZomboCraftEco mapping**: Our `llm-memory-taxonomy-user-code-knowledge.md` research arrived at the same 3-type separation independently:

| Their Layer | Our Equivalent | Type |
|---|---|---|
| L1 Redis (session cache) | Claude Code context window | User memory (ephemeral) |
| L2 Qdrant (vector search) | Not built (we rejected vector for code) | — |
| L3 Mem0 (SPO triples) | RSTMDB typed provenance triples | Knowledge memory |
| L4 SQLite (confirmed knowledge axes) | RSTMDB + ZZ KnowledgeStore | Knowledge memory |
| code graph (not their focus) | codegraph-rust index.map | Code memory |

**Where we go further**: Their L3 is Mem0 SPO triples — Subject-Predicate-Object, no type system, no temporal component, no contradiction detection. RSTMDB provides:
- Typed relations (not just SPO — typed with domain/codomain)
- Temporal claims (`valid_from` / `valid_until`, TEMPORAL_STATE constants)
- Belnap 4-valued contradiction detection (T/F/Both/Neither)
- Proof trees for derivation tracing

RSTMDB is strictly more powerful than Mem0 as a knowledge memory. But: their Mem0 is **automated** (extracts SPO triples from conversation history automatically). RSTMDB is **manual**. The RSTMDB × Ingestion = Constant conservation law applies here again.

**Where we are behind**: We have no vector search (L2). We explicitly rejected vector for code navigation (graph is better). But for knowledge memory (RSTMDB documents, research findings), vector similarity search is useful for discovery. The article's L2 does "memory matching" — finding relevant prior knowledge. RSTMDB has no discovery mechanism today.

**Where we are missing entirely**: Their L4 has 4 knowledge axes: self, user, interaction, world. "Self" = what the agent knows about itself (capabilities, past failures). We have no `self` axis in any of our memory systems. The agent doesn't accumulate a model of its own track record.

### Problem 4: Security and Control Risks

**Claim**: Unrestricted filesystem and terminal access is enormous risk. System prompt restrictions bypass easily. Agents accidentally delete files or leak data.

**Their solution**: Isolated sandboxes with workspace-level filesystem restrictions + static AST audits for proposed skills + capability separation.

**ZomboCraftEco mapping**: Our injection research (`prompt-injection-architectural-limits-grace-index-map.md`) covers this in more depth. Their sandbox approach = our privilege separation (Context Collector reads, Architect decides, human approves writes). Their static AST audit for skills = our codegraph-rust tree-sitter analysis applied to skill safety.

**Where we go further**: We have the injection threat model more formally analyzed (5 injection types, attack surfaces for each, architectural vs. patch-level mitigations). They describe sandbox isolation as the solution; we explain why injection remains possible even in sandboxes (Type 2 indirect injection through data the agent reads).

---

## The Epistemic Cycle vs. infer-core

The epistemic cycle's 5 phases mapped to infer-core operations:

```
EPISTEMIC CYCLE PHASE           infer-core EQUIVALENT
────────────────────────────────────────────────────────────────────
Phase 1: Curiosity Activation   facts.infer + has_concept() facts
  "What do we know?"            The ground facts ARE the world model.
  Creates map of known/unknown  Unknown = predicate with no grounding fact.

Phase 2: World Simulation       infer-core backward chaining
  "Predict before acting"       Apply rules to current facts.
  Run mental model forward      Proof tree = the simulation trace.

Phase 3: Epistemic Gap          infer-analysis detect_gaps()
  "Identify what's missing"     detect_gaps(solver, expected_predicates)
  Classify as epistemic gap     → GapResult: which expected predicates
                                  are not derivable from current facts

Phase 4: Hypothesis Testing     infer-core solver execution
  "Run the experiment"          Try to prove the conclusion.
  Code = hypothesis probe       Proof attempt = the test.
  Tool execution = reality      test result = new fact added to KB

Phase 5: World Model Update     RSTMDB + facts.infer regeneration
  "Update from reality"         codegraph-rust --emit-infer-facts
  Refine world model            → new facts.infer on file save
                                → detect_drift(baseline, current, monitor)
```

**The key insight**: infer-core IS a formal implementation of the epistemic cycle.

- The article describes "epistemic gap identification" as a novel architectural concept. We have `detect_gaps()` — a concrete API for exactly this.
- The article describes "world model" as a vague field in the state manager. We have `knowledge.rs` with typed `Fact`, `DomainId`, `RelationId` — the world model is formally specified.
- The article describes "hypothesis testing" as "code generates probes." We have `analyze_sensitivity()` — it tells us which facts are load-bearing for a hypothesis, which is a formal sensitivity analysis on hypotheses.

The philosophical alignment is exact. The implementation quality is higher on our side where we've built things.

**The naming is not coincidental**: "epistemic" (Greek: ἐπιστήμη, episteme = knowledge) and "infer" (Latin: inferre = to carry to a conclusion from evidence) are the same cognitive operation. The infer ecosystem is the epistemic cycle formalized.

---

## Their 8-Phase Extended Cycle (P01-P08) Mapped

```
P01: Data Ingestion              GRACE GREP + source read
P02: Vector Memory Matching      ✗ no vector search (rejected for code)
                                  ~ index.map concept label search (structural)
P03: Internet Triangulation      /researcher skill (WebSearch/WebFetch)
P04: Human Verification          flow:validate (human gate before deploy)
     Requests                    + LSP squiggles (human sees, decides)
P05: Semantic Integration        infer-core: add new facts to KB
                                  RSTMDB: typed triple creation
P06: New Gap Detection           infer-analysis detect_gaps() re-run
P07: Memory Compression          ~ Claude Code /memory/ system (manual)
                                  ✗ no automated compression
P08: Autonomous Research         ✗ not built; no background curiosity
     Trigger (nightly)           trigger exists in our architecture
```

The P02 gap (vector memory matching) is intentional for code — we chose structural graph over vector for code navigation. But for knowledge memory (research documents, RSTMDB entries), P02 is genuinely missing. We cannot do "find prior research similar to this task" without reading all documents.

The P08 gap (autonomous nightly reflection) is the most consequential. This is the mechanism that:
- Compresses successful/failed session logs
- Extracts SPO triples from accumulated context
- Identifies new knowledge gaps autonomously
- Updates the world model without human triggering

We have no equivalent. Our RSTMDB is populated entirely by human-directed research sessions. The knowledge base cannot grow autonomously between sessions.

---

## The Critic Agent

Their **Critic role** validates logic and detects contradictions — implemented as an LLM agent.

Our equivalent is **ZZ KnowledgeStore with Belnap 4-valued logic** — implemented as a formal contradiction detection system, not an LLM.

```
Their Critic:
  LLM agent reviews output
  Detects logical contradictions via reasoning
  Probabilistic: may miss subtle contradictions
  Language: natural language critique

Our ZZ KnowledgeStore:
  Formal Belnap T/F/Both/Neither evaluation
  Deterministic: if contradiction exists, it fires
  Machine-checkable: proof tree shows exact conflict
  Language: formal logic
```

The formal approach is strictly stronger for the contradiction-detection use case. An LLM Critic can be fooled (injection) or miss subtle contradictions; Belnap logic cannot be fooled and catches all contradictions within the rule system.

**But**: their Critic also does higher-level consistency checks — "is this fix consistent with the objective?" — which requires semantic understanding that formal logic cannot provide. We don't have this. The formal system detects rule violations; it cannot detect whether a fix is "reasonable" in the task context.

---

## Their Epistemic Fields in State Manager

```
uncertainty_score    float        How uncertain is the current step?
evidence_log         list[dict]   What evidence supports each claim?
missing_knowledge    list[str]    What gaps were identified?
```

These three fields are excellent additions to the Context Collector → Architect context packet:

- `uncertainty_score`: Architect can decide whether to proceed or escalate based on how uncertain the navigation was
- `evidence_log`: Architect knows which facts the Collector found and how reliable they are
- `missing_knowledge`: Architect knows what it doesn't know — crucial for "should I ask the human?" decisions

We should add equivalent fields to our context packet schema (the P2P envelope we need to design).

---

## Where ZomboCraftEco Architecture Leads the Epistemic Cycle

```
DIMENSION                         US vs THEM
──────────────────────────────────────────────────────────────────────────
Contradiction detection           Formal Belnap logic          LLM Critic
                                  (deterministic, proof trees) (probabilistic)

Knowledge memory type system      RSTMDB typed triples         SPO flat (Mem0)
                                  + temporal + Belnap

Code memory architecture          codegraph-rust index.map     Not separated
                                  (structural, AST-derived)    (vector DB)

Injection threat model            Formal analysis (5 types,    Sandbox + AST audit
                                  surface areas, mitigations)  (no injection theory)

Context budget constraint         "Lost in the Middle" theory  Not addressed
                                  → ≤8k token Architect budget (context just grows)

Proof traceability                infer-core Proof/ProofNode   evidence_log (dict)
                                  (typed, traversable)         (unstructured)
```

---

## Where We Are Behind

```
DIMENSION                         THEM vs US
──────────────────────────────────────────────────────────────────────────
P2P typed envelope                Explicit schema              Informal text
  inter-agent message format      (intent, constraints,        (no structure)
                                   output_contract, safety)

Uncertainty score                 Explicit field               Not surfaced
  "how confident is this step?"   (gates escalation to human)

Nightly reflection cycle          P08: autonomous research     Nothing
  background knowledge update     trigger, gap closure,
                                   log compression to triples

Vector memory (L2)                Qdrant for knowledge docs    Not built for
  "find similar prior knowledge"  similarity search            knowledge discovery

Self-knowledge axis               "self" axis in L4            No agent self-model
  agent's model of itself         (past failures, capabilities)

Cost control / budget gating      uncertainty_score → switch   No dynamic
  dynamic model selection         cheap vs. full quality       cost model
```

---

## The Critical Synthesis

The epistemic cycle article and ZomboCraftEco share the same root thesis:

> **The ReAct loop is reflex. Intelligence requires epistemic machinery: a world model, gap detection, hypothesis testing, and world-model update. Code is a hypothesis probe, not a goal.**

ZomboCraftEco expresses this as:
- infer-core = formal epistemic engine
- detect_gaps() = epistemic gap identification (formalized)
- facts.infer = world model (typed, regenerated from AST)
- LSP diagnostics = verified reality feedback
- RSTMDB = provenance-traced knowledge accumulation

The article expresses this as:
- Epistemic cycle = informal description of the same loop
- uncertainty_score = operationalization of "how epistemic is this step?"
- P2P envelope = typed inter-agent communication
- L3 Mem0 SPO triples = informal equivalent of RSTMDB

**The naming converges**: "epistemic" and "infer" are the same concept. The infer ecosystem IS the epistemic cycle toolbox. We have formalized what they have architecturally framed.

---

## Design Rules Derived

1. **P2P envelope for context packets.** Context Collector → Architect handoff must use a typed schema: task, target_files, uncertainty_notes, missing_knowledge, constraints. This reduces context degradation and makes uncertainty explicit.

2. **uncertainty_score as first-class field.** When the Context Collector cannot find a concept label, cannot narrow to <3 files, or has >500 index.map hits: uncertainty is high. Surface this score so the Architect can decide whether to escalate to human before acting.

3. **Nightly reflection is the RSTMDB ingestion pipeline.** The P08 autonomous research trigger is exactly what RSTMDB needs. A nightly process that: reads docs/research/ markdown files → extracts typed triples → adds to RSTMDB → runs detect_gaps → creates br tasks for gaps. This would close the RSTMDB × Ingestion = Constant law.

4. **Self-knowledge axis is missing.** We have user memory, code memory, and knowledge memory. We don't have agent memory (what the agent knows about its own behavior, past failures, successful patterns). This is the L4 "self" axis. The flow:assess and flow:research skills have no feedback loop from previous failures.

5. **Belnap > LLM Critic.** For contradiction detection, formal logic beats an LLM Critic agent. Do not replace ZZ KnowledgeStore with an LLM-based Critic — keep the formal approach. Add LLM Critic only for semantic reasonableness checks (formal logic can't do this).

6. **Knowledge discovery needs vector search.** For code: index.map structural search is better than vector. For knowledge documents (research/*.md, RSTMDB entries): vector similarity is needed for "find prior research similar to this new task." This is genuinely missing and blocks RSTMDB usefulness.

---

## Follow-up Tasks

- docs-p2pe: define context packet P2P envelope schema — typed fields for Context Collector → Architect handoff
- docs-nref: design nightly reflection pipeline for RSTMDB — autonomous triple extraction from docs/research/ markdown files

---

## Sources

- [Habr: От песочницы до эпистемического цикла (habr.com/ru/articles/1031868/)](https://habr.com/ru/articles/1031868/) — 4 MAS failures, epistemic cycle (5 phases), 8-phase P01-P08 implementation, P2P envelope, L1-L4 memory architecture
- Prior: `docs/research/multi-agent-codebase-navigation-pipeline.md` — 3-tier pipeline (same as epistemic approach, different formalism)
- Prior: `docs/research/llm-memory-taxonomy-user-code-knowledge.md` — 3 memory types (same as L1-L4, different implementation)
- Prior: `docs/research/prompt-injection-architectural-limits-grace-index-map.md` — security deeper than their sandbox approach
- Prior: `docs/research/codegraph-ctop-infer-semantic-lsp-compiler.md` — infer-core = formal implementation of epistemic cycle
- Prior: `docs/research/prism-premortem-ai-agent-architecture-review.md` — conservation laws; RSTMDB × Ingestion = Constant (confirmed by their P08 nightly reflection gap)
