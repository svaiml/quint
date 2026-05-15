# Prism + Premortem: Structural Analysis Pipeline for AI Agent Architecture

> **Context**: Nikolai (23yr DevOps, Hermes Agent) describes two tools he uses constantly to find real architecture bugs. Prism = 5 structured analysis skills (fork of Cranot/super-hermes). Premortem = backward-from-failure protocol (Klein + military analytics).
> **Question**: What is the Prism/Premortem pipeline, what bugs does it find, and what in ZomboCraftEco is directly applicable?
> **Last updated**: 2026-05-08
> **br task**: docs-6je4

---

## Short Answer

**Two orthogonal diagnostic tools that combine into one pipeline: Premortem finds what breaks; Prism explains why.**

```
TOOL         DIRECTION     QUESTION                  OUTPUT
──────────────────────────────────────────────────────────────────
Premortem    Backward      "System failed. Why?"     5-10 symptom claims
             from failure  (assume catastrophe)      (discrete, verifiable)

Prism        Forward       "What does this           Conservation laws,
             structural    architecture              identity gaps,
             analysis      actually guarantee?"      temporal failures

COMBINED
PIPELINE:
  Premortem → symptom claims → Prism audits each claim → Conservation Laws
  "You're adding tiers. Each tier = independent failure mode. Tested each?"

AUTHOR'S CONCRETE FINDINGS on Hermes Agent:
  4 memory tiers → 2 (MemPalace was duplicating state.db with FTS5)
  1.1 GB duplicates pruned
  HippoRAG cron had silently stopped 3 days prior — undetected
  52% of custom code duplicated built-in framework capabilities
  774 lines docs → 120 lines active content
  Conservation law discovered: Memory × Automaton = Constant
```

Every finding in the above list maps to something in ZomboCraftEco. The tools are directly applicable.

---

## Tool 1: Premortem

### Protocol

From Gary Klein's "The Power of Intuition" + military intelligence:

```
STEP 1: Assume catastrophic failure (not "could it fail" — "it HAS failed")
  "The Semantic LSP Compiler is in production. It has broken. Evidence is undeniable."

STEP 2: List symptoms without filtering
  One claim per line. No ranking. Include intuitions.
  "facts.infer is three hours stale"
  "LSP shows violations that no longer exist in code"
  "infer-core is silently swallowing parse errors"

STEP 3: No censorship
  Write the uncomfortable ones too.
  "The concept labels in concepts.map were never reviewed after initial LLM generation"

STEP 4: Convert to discrete verifiable claims
  Each symptom becomes: can I verify this is currently false?
  If not → it may already be true.
```

**The key shift**: Premortem is not brainstorming risks. It is narrative debugging of a system that has already broken. The psychological difference is significant — forward-looking risk assessment activates planning optimism; backward-looking failure explanation activates diagnostic realism.

### Why It Works

Forward analysis ("what could go wrong") is filtered by planning optimism:
- You tend to believe the parts you designed will work
- You miss failures that require multiple things to be simultaneously wrong
- You assess effort, not fragility

Backward analysis ("this broke, why") is not filtered by planning optimism:
- The failure is already given — you're just explaining it
- You discover structural impossibilities rather than just risks
- You reason about conservation laws (what must always be true regardless of fixes)

---

## Tool 2: Prism (Cranot/super-hermes, customised)

### The Five Prism Skills

From [github.com/Cranot/super-hermes](https://github.com/Cranot/super-hermes):

```
SKILL          WHAT IT DOES                        WHEN TO USE
────────────────────────────────────────────────────────────────────
prism-scan     Generate optimal lens for THIS       Unknown artifact;
               artifact, execute it, report         first analysis
               findings + constraints

prism-full     Multi-pass analysis with             Deep architectural
               adversarial self-correction           review; known system
               (3 passes, each challenges prior)

prism-3way     Three-angle analysis:                Suspected design flaw;
               WHERE (structural archaeology)        need to find root cause
               WHEN (temporal simulation)
               WHY (structural impossibility proof)

prism-discover Map every possible analysis           Broad discovery;
               domain for this artifact             finding unknown unknowns

prism-reflect  Self-aware analysis: what did         After using another prism;
               this lens maximise, what did          validate completeness
               it sacrifice?
```

### The Seven Battle-Tested Lenses (prisms/ directory)

Pre-built analytical frameworks applied via `prism-full` or `prism-scan`:

```
LENS              WHAT IT FINDS
──────────────────────────────────────────────────────────────────
error_resilience  Corruption cascade chains and silent failures
l12               Conservation laws — structural trade-offs that
                  persist regardless of remediation
optimize          Critical paths: safe vs. unsafe optimizations
identity          Gaps between claimed and actual code behavior
deep_scan         Information destruction and silent transformations
claim             Consequences of inverting foundational assumptions
simulation        Temporal degradation patterns (how it rots over time)
```

### prism-3way in Detail

The most powerful single lens for architecture diagnosis:

```
WHERE — Structural Archaeology
  "What does this system actually contain?"
  Not what you designed — what exists right now.
  Question: "User states 'remember X' → agent chooses tier → data persists
             → next query retrieves → model receives context.
             How many of these steps actually occur?"

WHEN — Temporal Simulation
  "Run this system forward 6 months in your mind. What degrades?"
  Not failures — degradation. What works on day 1 but silently decays.
  Question: "The cron runs every 15 minutes. What if it stops?
             How long until someone notices?"

WHY — Structural Impossibility
  "Is there a reason this CANNOT work, regardless of implementation quality?"
  Conservation laws. Structural contradictions.
  Question: "Four storage tiers. Each has independent failure mode.
             Can you guarantee consistency across all four simultaneously?"
```

---

## The Combined Pipeline

```
ARCHITECTURE DOCUMENT or DESIGN
  │
  ▼
[Premortem]
  Assume: "This system has failed catastrophically in production."
  Output: 5-10 discrete symptom claims
  Example: "The cron job silently stopped. Nobody noticed for 3 days."
  │
  ▼
[Prism — claim lens]
  Invert each symptom: "What must be true for this NOT to happen?"
  Output: Required structural guarantees
  Example: "Cron health check must be externally observable; cron is not observable"
  │
  ▼
[Prism — identity lens]
  "Does the claimed architecture match the actual implementation?"
  Output: Gap list between design doc and code reality
  Example: "/kg command is empty stub; not implemented"
  │
  ▼
[Prism — l12 conservation law lens]
  "What invariant persists regardless of how you fix individual failures?"
  Output: The structural law that generates all the symptoms
  Example: "Memory × Automaton = Constant — adding tiers without
             automating their population just multiplies failure modes"
  │
  ▼
[Synthesis]
  Not "here's what to fix" — "here's why your fixes won't hold"
  + "here's the minimal change that addresses the conservation law"
```

The pipeline produces **conservation laws** — structural properties that survive any individual fix. Knowing the law is more valuable than knowing the symptoms, because the law predicts which fixes will fail and which will hold.

---

## Author's Findings: Hermes Agent Memory System

Concrete results from running the pipeline on a real production system:

### What Was Found

```
FINDING                                     SOURCE LENS
──────────────────────────────────────────────────────────────
No automatic fact persistence;              prism-3way / WHEN
  facts die at session end without          temporal simulation
  explicit save command

HippoRAG cron silently stopped             prism-scan
  3 days prior; 6,409 docs not indexed;    + Premortem symptom
  nobody noticed

MemPalace duplicated state.db with FTS5    prism-identity
  (1.1 GB duplicates); both already        gap: claimed ≠ actual
  indexing the same content

/kg command interface is empty stubs        prism-identity
  (unimplemented)

52% of custom code duplicated              prism-discover
  built-in framework capabilities

774 → 120 lines: documentation contained   prism-claim
  aspirational claims, not verified facts   claim inversion audit
```

### The Conservation Law Discovered

**Memory × Automaton = Constant**

> "You are constructing more storage. Each tier represents separate infrastructure with independent failure modes. The total failure surface grows with each tier you add. Adding tiers without adding automated population and health-check mechanisms multiplies failure probability, not capability."

This is a structural law: it's not a bug to fix, it's a constraint to accept. The correct response is not "better cron jobs" — it's reducing tiers until each surviving tier has robust automated population and health monitoring.

---

## Application to ZomboCraftEco

### Premortem: Apply to Each Major System

#### Semantic LSP Compiler (assumed failed)

```
SYMPTOM CLAIMS:
- facts.infer is 6 hours stale; LSP shows violations that no longer exist
- tree-sitter parse failed silently; codegraph-rust emitted partial facts with no error
- concepts.map labels were never reviewed after initial LLM generation;
  30% are inaccurate but nobody has verified
- infer-core backward chaining produces proof trees that reference deleted symbols
- The LSP diagnostic "validate_token:48 — tls_required" fires on every file
  because the rule has a bug but produces no error, just fires everywhere
```

Prism-3way WHEN: "How do we detect stale facts.infer?"
Currently: we don't. facts.infer is regenerated on save, but there is no health check.
→ Need: facts.infer timestamp vs. source files mtime check on LSP server startup.

#### RSTMDB (assumed failed)

```
SYMPTOM CLAIMS:
- RSTMDB crate exists but nothing feeds it automatically;
  all provenance records were added manually during development
- Temporal claims (TEMPORAL_STATE constants) are defined but no workflow populates them
- infer-rstmdb bridge exists but is never called in production code paths
- ZZ KnowledgeStore contradiction detection has never run on real data
  (only on manually constructed test fixtures)
```

**The Conservation Law**: RSTMDB × Ingestion Pipeline = Constant.
This is identical to the Hermes Agent finding. We have built more provenance types (typed triples, temporal claims, contradiction detection) without building the automated ingestion pipeline. This multiplies complexity without adding capability.

#### Multi-Agent Pipeline (assumed failed)

```
SYMPTOM CLAIMS:
- Context Collector sub-agent produced a 9,800-token context packet
  (over the 7,500-token budget); Architect timed out
- index.map has 47,000 entries; "grep auth.token-validation" returns
  1,847 results; agent reads all 1,847 lines
- Context Collector ran for 4 minutes navigating the graph;
  by the time Architect got the packet, the coding task was stale
```

Prism-3way WHY: "Can the context budget of ≤7,500 tokens be maintained
as the codebase grows past 500 modules?"
Structural answer: No. The budget constraint requires O(1) navigation
(index.map grep → exact hit), not O(n) graph traversal.

### Conservation Laws for ZomboCraftEco

Running the l12 lens on our architecture:

```
LAW                                    SYSTEM              IMPLICATION
───────────────────────────────────────────────────────────────────────
RSTMDB × Ingestion = Constant          RSTMDB, ZZ store    Building more provenance
                                                           types without pipeline
                                                           = more failure surface

Index × Precision = Constant           index.map,          Larger index with generic
                                       concept labels      labels → more false hits →
                                                           context budget violation

Rule × Maintenance = Constant          rules/*.infer       More rules without
                                                           a rule-test harness =
                                                           more silent misfires

Agent × Privilege = Constant           3-tier pipeline     More agent tiers without
                                                           explicit privilege bounds
                                                           = injection blast radius grows
```

### The 52% Duplication Check

The author found 52% of Hermes Agent custom code duplicated built-in capabilities.

Prism-discover question for our agent skills:
"Which of our custom skills duplicate what Claude Code already provides natively?"

Quick assessment:
```
SKILL                    NATIVE EQUIVALENT?               VERDICT
──────────────────────────────────────────────────────────────────
researcher               Claude's web search + synthesis  ~ partial — our skill adds
                                                          br tracking + doc structure
                                                          that Claude doesn't do natively

security-reporter        Claude can write security        ~ partial — reporter adds
                         reports natively                 structured CVSS + br tracking

flow:assess              No native equivalent             ✓ genuinely custom
                                                         (scoring + workflow state)

codegraph-rust           No native equivalent             ✓ genuinely custom
                         (tree-sitter AST → index.map)    (not an LLM capability)

infer-core               No native equivalent             ✓ genuinely custom
                         (Horn clause solver)             (formal reasoning, not LLM)
```

The risk is in the LLM-wrapping skills (researcher, security-reporter) — these may be adding process overhead without adding structural value beyond what Claude does natively. The correct test: run the skill vs. running the equivalent Claude Code native prompt. If the output is the same, the skill is overhead.

---

## prism-3way as a Template for flow:assess

The current flow:assess produces forward scores (complexity, risk, architecture impact).
It does not apply backward failure analysis.

A Premortem phase could be added to flow:assess between scoring and recommendation:

```
CURRENT FLOW:
  Feature input → Complexity score → Risk score → Architecture score → Recommendation

WITH PREMORTEM:
  Feature input → Complexity score → Risk score → Architecture score
                → Premortem: "This feature shipped and broke. What broke first?"
                → Prism-3way: WHERE (what does it actually touch?) /
                               WHEN (what degrades over 6 months?) /
                               WHY (what structural impossibility exists?)
                → Revised recommendation with identified conservation laws
```

This would turn flow:assess from a forward-risk assessment into a structural integrity assessment — closer to what the author is doing for Hermes Agent.

---

## Design Rules Derived

1. **Premortem before spec.** Before writing a PRD or ADR: assume it shipped and broke in production. List 5 symptoms. This is 30 minutes, not 30 days — and it surfaces structural laws that forward scoring doesn't.

2. **Conservation laws > symptom lists.** When you find 5 symptoms, look for the one structural law that generates all 5. Fixing symptoms without identifying the law means symptoms return in different forms.

3. **52% test.** Periodically ask: which of our custom code duplicates what the framework/runtime already provides? Custom code that duplicates native capabilities = maintenance burden without capability gain.

4. **Health checks are not optional for async systems.** Any async process (cron, watch mode, background ingestor) must have an externally observable health signal. If you cannot observe that it's running, it is not running — you just don't know yet.

5. **prism-3way for every new major component.** Before building: run WHERE (what does this actually touch?), WHEN (what degrades silently?), WHY (is there a structural reason this cannot work?). If you can't answer WHY with "there is no structural impossibility," don't build yet.

6. **prism-identity for existing components.** Periodically: does the architecture doc match the code? The Hermes Agent found empty stub commands in production. We should verify concepts.map label accuracy, rules/*.infer rule coverage, and infer-mcp integration completeness.

---

## Follow-up Tasks

- docs-prmt: run Premortem on Semantic LSP Compiler design — "it has failed, why?" → discrete symptom claims → conservation laws
- docs-p3wy: run prism-3way on RSTMDB productization plan — WHERE/WHEN/WHY structural audit before building ingestion pipeline

---

## Sources

- [Habr: Prism и Premortem (habr.com/ru/articles/1031722/)](https://habr.com/ru/articles/1031722/) — concrete findings from Hermes Agent; 5 structural failures; conservation law; quantified outcomes
- [Cranot/super-hermes (github.com/Cranot/super-hermes)](https://github.com/Cranot/super-hermes) — 5 prism skills + 7 analytical lenses; full skill definitions
- Gary Klein, "The Power of Intuition" — Premortem methodology; backward-from-failure protocol
- Prior research: `docs/research/llm-memory-taxonomy-user-code-knowledge.md` — RSTMDB as central gap (confirmed by RSTMDB × Ingestion = Constant conservation law)
- Prior research: `docs/research/multi-agent-codebase-navigation-pipeline.md` — 3-tier pipeline; context budget ≤7,500 tokens (Premortem: what happens when budget is violated?)
- Prior research: `docs/research/codegraph-ctop-infer-semantic-lsp-compiler.md` — Semantic LSP Compiler; facts.infer pipeline (Premortem: stale facts are already a risk, no health check exists)
