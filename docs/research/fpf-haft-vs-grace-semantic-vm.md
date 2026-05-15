# FPF+Haft vs GRACE vs ZomboCraftEco — Semantic VM Ladder Positioning

> **Context**: Follow-up to `semantic-vm-grace-deepseek-dsa.md`
> **Question**: Could FPF+Haft be a better semantic VM implementation than GRACE for ZomboCraftEco?
> **Last updated**: 2026-05-04
> **br task**: docs-9vnj

---

## Short Answer

**They operate at different layers of the same ladder. They are not competing — they are sequential.**

FPF+Haft is MORE APPROPRIATE than GRACE for ZomboCraftEco's internal reasoning formalization.
GRACE is STILL NEEDED where FPF+Haft cannot operate: at the LLM inference frontier (raw text → structured claim).
ZomboCraftEco's own stack (criterium + Infer + STRESS) is SUPERIOR to both at verified derivation.

The correct architecture is a pipeline, not a choice:

```
GRACE prompting
    → FPF card output (CSC/DRR/EFP)
        → RSTMDB KB entry with provenance
            → Infer verified derivation
                → criterium AssuranceLevel upgrade
```

---

## The Semantic VM Ladder (Recap)

```
Level 3: DETERMINISTIC           Infer engine (Horn clause, FOUR bilattice)
          100% for in-scope       Accuracy: provably correct
          Requires: KB populated  Cost: KB must be built first

Level 2: SEMI-FORMAL             FPF card artifacts (CSC/DRR/EFP)
          87–93% accuracy         Structured, typed, formally validated
          Requires: formalized     GRACE dataflows are prose-level L2
          input                   FPF is schema-level L2

Level 1: PATTERN MATCHING        Default LLM mode
          ~78% accuracy           No explicit structure
                                  Text in → text out
```

---

## What Each Tool Actually Does

### GRACE (Vladimir Ivanov, proprietary)

**Layer**: L1 → L2 transition at inference time.

GRACE forces LLMs to build explicit dataflows BEFORE generating code or text. It operates at the LLM prompt level — it is a TECHNIQUE, not a typed artifact format. The output is prose-structured: "input: X → step 1: Y → output: Z."

```
GRACE input:  "Write a function that validates tokens"
GRACE output: "Dataflow:
               input: {token: JWT, request_time: timestamp}
               step 1: decode JWT → {header, payload, signature}
               step 2: verify signature → {valid: bool}
               step 3: check payload.exp vs request_time → {expired: bool}
               output: {valid_and_not_expired: bool}
               THEN: generate code against this flow"
```

GRACE is **prose-level L2**. The dataflow is a natural language document, not a typed artifact.

**GRACE's unique capability**: It works on LLMs that have never seen any FPF structure. It guides the LLM's internal attention pattern (especially on DSA architectures) by front-loading semantic structure. No schema required, no runtime needed.

**GRACE's limitation**: The dataflow is informal — it cannot be validated, cannot be queried by Infer, cannot serve as a provenance node in RSTMDB.

---

### FPF (Levenchuk) + Haft (m0n0x41d) + fpf-cards (Rust crate, in progress)

**Layer**: Schema-level L2 — formalizes what GRACE produces informally.

FPF defines three card types that are the formal equivalent of what GRACE produces as prose:

```
CSC card (Controlled Semantic Coarsening):
  stronger_source: "JWT token validation requires checking expiry, signature, audience, and issuer"
  weaker_rendering: "Check only expiry and signature"
  supported_use: "Internal API calls with known issuers"
  unsupported_use: "External public APIs with unknown issuers"
  reopen_trigger: "Any external API integration"
```

This is GRACE's dataflow step made TYPED and VALIDATED. The CSC card:
- Records the simplification explicitly (what was cut, not just what was kept)
- Defines the scope boundary where the simplification is safe
- Defines when it must be reopened

```
DRR card (Design-Rationale Record):
  context: "Token validation for internal services under 50ms latency SLA"
  decision: "Check expiry and signature only; skip audience/issuer"
  consequences: "External API support impossible without reopening this decision"
  status: Accepted
```

This is the WHY behind the GRACE dataflow step — also not captured by GRACE.

```
EFP card (Explanation/Framing Pattern):
  framing: "Security vs latency tradeoff"
  focus: "Internal service boundary"
  excluded: "Public API threat model"
```

**Haft** enforces FPF card structure compliance at runtime (Go layer).
**fpf-cards** (the Rust crate being built) makes FPF card types available to the ZomboCraftEco Rust stack natively.

**FPF+Haft advantage over GRACE**: The output is TYPED, VALIDATED, and QUERYABLE. An Infer engine can reason over CSC cards:
```prolog
reopen_required(Decision) :-
    csc_card(Decision, _, _, _, _, ReopenTrigger),
    current_context(Context),
    matches(Context, ReopenTrigger).
```

GRACE cannot feed Infer. FPF cards CAN.

**FPF+Haft limitation**: FPF assumes you ALREADY HAVE a formalized claim to record. It has no mechanism for guiding an LLM from unstructured text to the first L2 claim. That is GRACE's job.

---

### ZomboCraftEco Native Stack

**Layer**: L3 (verified derivation) + full Peirce cycle via criterium.

```
criterium's epistemic loop:
  Abduction (FPF)  → generates hypothesis cards (CSC/DRR/EFP)
  Deduction (Infer) → Horn clause verification of hypothesis
  Induction (pctl-rs) → probabilistic validation across evidence
  HITL checkpoint  → cannot advance L without human judgment
  
  AssuranceLevel:
  L0 (hypothesis)  → raw LLM output, GRACE dataflow, pattern-matched claim
  L1 (logical)     → Infer derivable, FPF card present, CSC documented
  L2 (evidenced)   → pctl-rs probability > threshold, multi-source
  L3 (operational) → HITL validated, RSTMDB provenance complete
```

The AssuranceLevel system is a more rigorous version of the semantic VM ladder:
- L0 = Level 1 (pattern matching)
- L1 = Level 2 (semi-formal, Infer-derivable)
- L2/L3 = Level 3 (verified, operationally trusted)

**ZomboCraftEco's unique capability**: The STRESS verb has no equivalent in GRACE or FPF:

```
GRACE: "Build the dataflow explicitly"
FPF:   "Record what you simplified and why"
STRESS: "Remove each claim's supports — does the conclusion still hold?"
```

STRESS is a fourth operation that neither GRACE's dataflow planning nor FPF's card documentation performs. It is adversarial validation: find the load-bearing claims and test their absence.

---

## The Correct Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SEMANTIC VM PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  RAW INPUT (research paper, code, theological text, patent)              │
│      │                                                                   │
│      ▼                                                                   │
│  [GRACE prompting]                           ← L0 → L1 transition        │
│  Force LLM to build explicit dataflows       prose-level semi-formal     │
│  DSA-optimized (front-load structure)        Not typed, not queryable    │
│      │                                                                   │
│      ▼                                                                   │
│  [LLM output: structured prose dataflow]                                 │
│  "Input X → Step A → Step B → Output Y"                                 │
│      │                                                                   │
│      ▼                                                                   │
│  [FPF card serialization]                    ← prose → typed artifact    │
│  Parse GRACE dataflow → CSC/DRR/EFP cards    fpf-cards Rust crate       │
│  Validate via haft/fpf-cards                 Now queryable by Infer     │
│      │                                                                   │
│      ▼                                                                   │
│  [RSTMDB ingestion]                          ← L1 knowledge persistence  │
│  FPF cards as provenance-annotated KB nodes  F-G-R confidence (ADR-009) │
│  WAL entry with card type + validation hash                              │
│      │                                                                   │
│      ▼                                                                   │
│  [Infer engine]                              ← L1 → L2 verification      │
│  Horn clause derivation over FPF card claims  Deterministic              │
│  STRESS test: remove card's supports → holds? FOUR bilattice            │
│      │                                                                   │
│      ▼                                                                   │
│  [criterium AssuranceLevel upgrade]           ← L2 → L3 certification   │
│  pctl-rs probabilistic validation             HITL checkpoint required   │
│  L2 (evidenced) → L3 (operational)                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Direct Comparison Table

| Dimension | GRACE | FPF+Haft | ZomboCraftEco native |
|-----------|-------|----------|----------------------|
| **Layer** | L0→L1 transition | L1→L2 formalization | L2→L3 verification |
| **Mechanism** | Prompting technique | Card schema + runtime enforcement | Deterministic logic + probabilistic validation |
| **Output type** | Prose dataflow | Typed validated cards (CSC/DRR/EFP) | Proof chains + AssuranceLevels |
| **LLM-dependent?** | Yes (guides LLM) | No (validates output) | No (replaces LLM for derivation) |
| **Handles unknowns?** | Implicitly | CSC card: explicit scope limits | FOUR bilattice: ⊥ (unknown) as first-class |
| **Handles contradictions?** | No | No | ⊤ (contradicted) as first-class |
| **Adversarial validation?** | No | No | STRESS verb: removes supports |
| **Chinese LLM optimized?** | Yes (DSA-aware) | No | No |
| **ZomboCraftEco-native?** | No (external) | Partly (fpf-cards Rust crate being built) | Yes (native) |
| **What it can't do** | Produce typed artifacts | Guide LLM from unstructured input | Handle the frontier before L1 |

---

## Why FPF+Haft Is More Appropriate Than GRACE for ZomboCraftEco

**1. FPF card output plugs into the existing stack.**
The fpf-cards Rust crate (zse-q48) is already planned and being built. GRACE produces prose that would need a separate parser. FPF produces types that Infer can query directly.

**2. CSC cards formalize what DETECT and STRESS need.**
The DETECT verb finds what's MISSING. The CSC card explicitly records what was simplified/excluded (`unsupported_use`, `reopen_trigger`). Running DETECT against a CSC card is trivial — the "absent" content is in the card schema.

**3. DRR cards are ADRs with FPF validation.**
ZomboCraftEco already produces ADRs (Architecture Decision Records). DRR cards are a superset — they add FPF validation and machine-queryable structure. GRACE produces no equivalent artifact.

**4. Haft enforcement at the Go layer (flowspec, orchestration).**
flowspec is in the ZomboCraftEco stack and produces specifications that benefit from FPF governance. Haft already runs there. GRACE is a Claude Code skill, not a runtime enforcement tool.

**5. criterium's abduction loop already uses FPF as its abduction mechanism.**
The loop is: **Abduction (FPF)** → Deduction (infer) → Induction (pctl-rs). FPF IS criterium's first stage. GRACE is an alternative first-stage that is less integrated.

---

## What ZomboCraftEco Is Missing (Where GRACE Still Wins)

**The L0 frontier**: When reading a raw research document (a Neoplatonism paper, a Chinese patent, an arXiv preprint), there is no FPF card yet. The LLM must extract the first structured claim from unstructured text. FPF assumes the claim is already partially structured. GRACE operates in this raw zone.

The missing component: **a GRACE-style prompting template that produces FPF card output directly.**

```
PROPOSED: GRACE-to-FPF bridge prompt

"Read this text. Build a dataflow of its main argument.
Then serialize as:
  CSC: {stronger_source: <full claim>, weaker_rendering: <simplified version for KB>,
        supported_use: <scope>, unsupported_use: <exclusions>, reopen_trigger: <condition>}
  DRR: {context: <why this simplification>, decision: <what was decided>,
        consequences: <what's lost>, status: Proposed}
Don't generate prose. Output JSON only."
```

This bridge prompt would combine:
- GRACE's "build dataflow first" discipline
- GRACE's DSA-optimized front-loading of structure
- FPF's typed output format
- fpf-cards validation on the Rust side

This bridge is the concrete implementation task that falls out of this analysis.

---

## STRESS Test of This Analysis

**Claim under test**: "FPF+Haft is more appropriate than GRACE for ZomboCraftEco."

**STRESS**: Remove the claim that FPF integrates better.
- What breaks: FPF card output is only better if there IS a mechanism to produce it. If no LLM can reliably output CSC/DRR/EFP JSON from raw text, FPF provides no advantage.
- The dependency: FPF's advantage over GRACE requires the GRACE-to-FPF bridge prompt (proposed above). Without it, GRACE's prose dataflows are MORE actionable than FPF cards that don't get produced.

**DETECT**: What's absent from this analysis?
- The benchmark: Has anyone tested whether LLMs reliably produce valid CSC/DRR/EFP JSON? The fpf-problem-solving-skill exists in ZomboCraftEco — what's its empirical reliability?
- The Chinese LLM gap: FPF is a Western framework. How does DeepSeek V3.2 (GRPO, Chinese domain) handle FPF card generation vs GRACE dataflow generation? Untested.

**Result**: **PARTIAL** — the architectural claim is correct, but the practical advantage depends on the bridge prompt quality. The spike task (docs-z4t7: semi-formal reasoning prompt template) should specifically test GRACE-to-FPF bridge output quality.

---

## Follow-Up Tasks

| Task | What |
|------|------|
| docs-z4t7 (existing spike) | Extend to test GRACE-to-FPF bridge: produce CSC/DRR JSON, validate via fpf-cards |
| ADR update needed | ADR-009 decision 1 (REJECT FPF canonical cycle) should note that criterium already uses FPF for abduction — the "rejection" was of replacing our 5 Infer verbs, not of FPF integration |

---

*Research document: FPF+Haft vs GRACE — semantic VM ladder positioning. br task: docs-9vnj*
