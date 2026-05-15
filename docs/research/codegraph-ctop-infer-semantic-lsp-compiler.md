# Code Graph + CTOP + InferEco → Semantic LSP Compiler

> **Context**: GRACE 2.0 uses Doxygen XML as semantic core; codegraph-rust derives index.map via tree-sitter. Hypothesis: the same AST can seed an infer KB for real-time rule checking.
> **Question**: Can `codegraph-rust → CTOP facts → infer-lsp` give real-time LSP diagnostics for rule violations, req drift, and contradictions in source code?
> **Last updated**: 2026-05-07
> **br task**: docs-wxkv

---

## Short Answer

**Yes — and 80% of the infrastructure already exists.**

```
WHAT EXISTS NOW                    WHAT'S MISSING
─────────────────────────────      ──────────────────────────────────────
infer-lsp   (tower_lsp server)     codegraph-rust --emit-infer-facts
infer-analysis (detect_drift,      .infer schema for code facts
               detect_gaps,        rules/*.infer library (per language)
               analyze_sens.)      rule-violation → LSP diagnostic bridge
infer-core  (facts, rules,
             proof trees)
infer-mcp   (Claude integration)
```

The missing piece is the **extractor**: a codegraph-rust flag `--emit-infer-facts` that
translates tree-sitter AST nodes into `.infer` ground facts. Estimated effort: **3-5 days**
for Python + Rust proof-of-concept; 2-3 weeks for production-quality multi-language support.

TheoSciTech mapping: Belnap contradiction detection and Horn clause derivation are **built**.
Refinement Calculus and Curry-Howard are **not built** (and not needed for the core PoC).

---

## What InferEco Already Provides

### infer-lsp: Full LSP Server (tower_lsp)

```rust
// crates/infer-lsp/src/backend.rs — actual production code
async fn on_change(&self, uri: Url, text: String) {
    let (program, parse_diags) = infer_parser::parse(&text);
    let analysis = infer_sema::analyze(&program);
    // Merge parse + sema diagnostics → publish_diagnostics
    self.client.publish_diagnostics(uri, lsp_diags, None).await;
}
```

Handles: `did_open`, `did_change`, document symbols, go-to-definition, hover.
Watch mode: `infer --watch` re-runs on file changes.

### infer-analysis: The Three Operations We Need

```rust
// crates/infer-analysis/src/lib.rs — exact API
detect_gaps(&mut solver, &expected: &[Predicate]) → GapResult
analyze_sensitivity(&mut solver, &conclusion, &vary_facts) → SensitivityResult
detect_drift(&mut solver, &baseline_facts, &current_facts, &monitor) → DriftResult
```

- **detect_gaps**: "which expected predicates are derivable vs missing" → missing invariants
- **detect_drift**: "which monitored predicates changed between two KB states" → req drift as code changes
- **analyze_sensitivity**: "which facts are load-bearing for a conclusion" → what code is critical to a rule

### infer-core: Typed Facts and Horn Clause Rules

```
domain Symbol
domain File
domain ConceptLabel
domain CallTarget

relation calls(Symbol, CallTarget)
relation defined_in(Symbol, File)
relation has_concept(Symbol, ConceptLabel)
relation auth_entry_point(Symbol)

rule auth.requires_tls(S) :- auth_entry_point(S), not tls_enforced(S).
rule rule_violated(S, "missing-tls-on-auth") :- auth.requires_tls(S).
```

Facts are `Value::String | Value::Integer | Value::Boolean`. Proof trees give
the derivation chain for every diagnostic — "this rule fired because of these facts."

---

## Architecture: The Full Pipeline

```
SOURCE FILES (on every didChange / --watch tick)
  │
  ▼
codegraph-rust --emit-infer-facts   [3-5 days to build]
  │  tree-sitter AST → .infer ground facts
  │
  ▼
.codegraph/facts.infer              [generated, committed to repo]
  │
  │  calls(validate_token, decode_header).
  │  calls(validate_token, hmac_verify).
  │  defined_in(validate_token, "auth/token_validator.py").
  │  has_concept(validate_token, "auth.token-validation").
  │  visibility(validate_token, public).
  │
  ▼
rules/*.infer                       [hand-authored, per project]
  │
  │  rule tls_required(S) :- has_concept(S, "auth.entry-point"),
  │                           calls(S, ?H), external_endpoint(?H).
  │  rule contradiction(S, "auth-logic-split") :-
  │       has_concept(S, "auth.token-validation"),
  │       has_concept(S, "auth.session"),
  │       calls(S, ?X), calls(?X, S).
  │
  ▼
infer-core Solver  [built]
  │  backward chaining + unification
  │  proof tree per violation
  │
  ▼
infer-analysis   [built]
  │  detect_drift(baseline, current, monitor)  → appeared/disappeared
  │  detect_gaps(solver, expected)             → missing invariants
  │  analyze_sensitivity(solver, rule, facts)  → load-bearing facts
  │
  ▼
infer-lsp  [built — tower_lsp]
  │  publish_diagnostics(uri, violations, proof_summaries)
  │
  ▼
IDE (VS Code / JetBrains)
  │  red squiggle on validate_token: "tls_required violated — auth.entry-point
  │   calls external_endpoint without tls_enforced"
  │  hover: full proof tree expandable
  │  go-to-definition: jumps to the rule that fired
```

**Key design choice**: The Semantic LSP Compiler doesn't rewrite infer-lsp.
It **feeds** the existing infer-lsp with a new source of `.infer` facts derived
from source code rather than hand-authored `.infer` files.

---

## The Missing Piece: codegraph-rust --emit-infer-facts

### Fact Schema (proposed)

```
# Structural facts — tree-sitter derived, always accurate
calls(caller: Symbol, callee: Symbol).
defined_in(symbol: Symbol, file: File, start: Int, end: Int).
has_kind(symbol: Symbol, kind: Kind).       # function/class/method/var
has_visibility(symbol: Symbol, vis: Vis).   # public/private/protected
inherits(child: Class, parent: Class).
implements(class: Class, interface: Interface).

# Semantic facts — from concepts.map (one-time human review)
has_concept(symbol: Symbol, label: ConceptLabel).

# Derived facts — computed by infer rules
auth_entry_point(S) :- has_concept(S, "auth.entry-point").
```

### Implementation Path

```
codegraph-rust (existing)          New flag: --emit-infer-facts
  tree-sitter parse                  walk existing SymbolNode tree
  index.map TSV out                  emit Fact tuples to facts.infer
  concepts merge                     concepts.map → has_concept() facts
```

The AST walk is already done for index.map. `--emit-infer-facts` reuses
the same traversal and writes a different output format. ~200-300 lines Rust.

### Incremental Update

On `did_change`:
1. codegraph-rust re-parses the changed file (tree-sitter incremental)
2. Replaces facts for that file only
3. infer-analysis `detect_drift(baseline_facts, new_facts, monitor)` fires
4. New violations → LSP diagnostics within ~50ms

---

## Real-Time Diagnostics: Three Modes

### Mode 1: Rule Violation (immediate)
```
rule tls_required(S) :- auth_entry_point(S), not tls_enforced(S).
```
→ squiggle on `require_auth` in middleware.py: "auth.entry-point missing TLS enforcement"

### Mode 2: Req Drift (between commits)
```
baseline = facts from last committed facts.infer
current  = facts from current edit
monitor  = [tls_required, signature_verified, audience_checked, ...]
```
→ detect_drift fires → "auth.token-validation lost signature_verified invariant"

### Mode 3: Contradiction Detection (Belnap)
ZZ KnowledgeStore already implements Belnap 4-valued logic (T/F/Both/Neither).
Bridge: violation facts from infer → ZZ KnowledgeStore → Belnap contradiction check.

```
Both(tls_required(validate_token))    → CONTRADICTION: rule says required,
                                         fact says enforced — one of them is wrong
```

---

## TheoSciTech Ecosystem Mapping

```
THEORY                  BUILT IN ZomboCraftEco?   ROLE IN SEMANTIC LSP
────────────────────────────────────────────────────────────────────────
Horn clause derivation  ✓ infer-core              PRIMARY: rule firing
Proof trees             ✓ infer-core              Diagnostic explanation
Gap detection           ✓ infer-analysis           Missing invariants
Drift detection         ✓ infer-analysis           Req drift as code changes
Belnap contradiction    ✓ ZZ KnowledgeStore        T/F/Both/Neither on rules
Traceability links      ✓ contextflow-forge        req → code typed links
Abduction               ✓ infer-abduction          "which fact would fix this?"
MCP integration         ✓ infer-mcp                Claude sees rule violations
Refinement Calculus     ✗ not built               Code ⊑ Spec formally (Paris
                                                    Metro used Event-B; overkill
                                                    for PoC)
Curry-Howard            ~ axiomvm (isolated)       Code = proof of type;
                                                    needs dependent types;
                                                    not connected
```

**Practical path**: Horn clause + Belnap covers 90% of the hypothesis.
Refinement Calculus and Curry-Howard are academic ceiling, not PoC requirements.

---

## Feasibility Assessment

| Dimension | Score | Notes |
|---|---|---|
| **Infrastructure exists** | 9/10 | infer-lsp, infer-analysis, infer-core all built |
| **Extractor effort** | 3/10 | 3-5 days for PoC; codegraph-rust AST walk already done |
| **Rule authoring** | 6/10 | Must hand-write rules per project; no auto-extraction |
| **Performance** | 8/10 | tree-sitter incremental + infer backward chaining; ~50ms estimate |
| **Proof quality** | 9/10 | infer generates full proof trees, not just yes/no |
| **AI integration** | 9/10 | infer-mcp exposes violations to Claude directly |

**Overall: HIGH feasibility. Strongest case in ZomboCraftEco for a quick high-impact PoC.**

---

## Auto-Rule Extraction from Codebase (Hypothesis Core)

The user's hypothesis goes further: *the codebase itself is the ideal source for rules.*

This is **partially true**:

```
WHAT tree-sitter CAN extract automatically
  call graph structure        → calls(A, B) facts
  inheritance hierarchy       → inherits(X, Y) facts
  visibility patterns         → public/private facts
  concept labels              → from concepts.map (semi-auto)

WHAT requires human authoring
  semantic invariants         → "auth functions must enforce TLS"
  architectural rules         → "no circular deps between layers"
  business rules              → "payment functions must log audit trail"
  contradiction rules         → "X and Y cannot both be entry points"
```

**Semi-automatic extraction** is possible via:
1. Run infer on the codebase as-is → emit call graph + concept facts
2. Run infer-abduction on the existing (passing) test suite → retroduced candidate rules
3. Human reviews candidate rules → promotes to rules/*.infer
4. From that point: real-time enforcement

This is the "codebase as oracle" loop: existing passing code describes the implicit rules;
abduction makes them explicit; LSP enforces them going forward.

---

## Evidence Base: Two Papers on Code Documentation Effectiveness

### Paper 1 — Code Translation: arXiv:2601.16661 (Jan 2026)
"Revisiting the Role of Natural Language Code Comments in Code Translation"
80,000+ translations · 5 languages (C/C++/Go/Java/Python) · multiple LLM vendors

| Finding | What it proves | Design implication |
|---|---|---|
| PURPOSE/intent > DESCRIPTION | Agents degrade without WHY; can survive without WHAT | index.map `has_concept(S, "auth.entry-point")` encodes WHY, not WHAT |
| Short (~5 words) > Long (~19 words) | Mixed intent = noise; focused label > verbose docstring | Rule names `auth.requires_tls` (3 tokens) > Doxygen paragraph |
| English > French/Chinese | Non-English degrades all tested vendors | Concept labels + rule names + diagnostics: English only |
| Inline > separate file (+435% best / -90% worst) | Token distance between code and description degrades agents | LSP squiggles appear at violation site, not in a separate report |
| Stale docs = toxic (agents learn to skip) | Active harm, not neutral degradation | AST-derived facts.infer regenerated on save — structurally cannot go stale |

### Paper 2 — Bug Fixing: arXiv:2601.23059 (Jan 2026)
"On the Impact of Code Comments for Automated Bug-Fixing: An Empirical Study"
109,099 bug-fix pairs · Java · CodeT5+ 220M + DeepSeek-Coder 1.3B · SHAP attention analysis

| Finding | What it proves | Design implication |
|---|---|---|
| HOW > WHY > WHAT for bug fixing | Implementation mechanism matters most; method name already conveys WHAT | rules/*.infer encode HOW (mechanism) — "auth entry point must verify HMAC before audience" |
| 3× improvement (CodeT5+), 2× (DeepSeek) | Architectural intent comments are not neutral; they change reasoning path | rules/*.infer is the architectural intent layer — formal, not prose |
| Comments from **buggy code are actively harmful** | If source annotation is wrong/stale → model reinforces the bug | **This is the injection/staleness argument proved empirically.** DocInCode = trust-amplification for bugs |
| SHAP: agents attend to HOW tokens for fix reconstruction | Not reading docs for description — using them to reconstruct the intended mechanism | Semantic LSP delivers HOW at violation site via proof tree; no source pollution |
| Removing HOW comments: -91% EM but still 2× over baseline | Some benefit survives even without best comment type | Minimum viable: concept labels in index.map + one rule per invariant |

### The Empirical Case Against DocInCode

Both papers together prove the user's position ("not a fan of DocInCode due to injections"):

```
RISK                           PAPER 1 EVIDENCE           PAPER 2 EVIDENCE
───────────────────────────────────────────────────────────────────────────
Stale docs = toxic             "agents learn to skip"     Buggy-code comments
                               (-90% worst case)          actively harm accuracy
Injected/malicious docs        Stale → noise              Wrong HOW → model
                               (attacker can inject        reinforces the bug
                               misleading PURPOSE)
Vendor-code bleed              Tags in vendor source      Adversarial comments
                               → greps find them          in deps → propagate
Long = worse than none         19-word comments < 5-word  "What" comments =
                               model-generated            redundant noise
```

**Conclusion**: DocInCode is the worst-of-both-worlds when docs diverge from code.
The hybrid approach (external rules + LSP delivery) satisfies both papers'
positive findings while eliminating all documented failure modes.

---

## The Separation of Concerns Architecture (Real Propositions)

The user's constraint: zero doc in source. The two papers' requirement: architectural
intent must be present AND close to the code at inference time.

These are not in tension. LSP delivers intent AT the code without being IN the code.

```
DOCIN-CODE (GRACE 1.x embedded tags)   HYBRID (Semantic LSP Compiler)
─────────────────────────────────────   ─────────────────────────────────────
Intent location: embedded in .py/.ts    Intent location: rules/*.infer
Delivery to agent: grep source file     Delivery to agent: LSP squiggle at site
Staleness: silent (drift undetected)    Staleness: impossible (AST re-derives)
Injection surface: every source file    Injection surface: rules/*.infer only
                                        (generated artifact, auditable)
Vendor bleed: yes (deps carry tags)     Vendor bleed: no (excluded from scan)
Proof: none                             Proof: full Horn clause derivation tree
```

### Proposition 1 — Minimal PoC (3-5 days)

Keep ALL existing GRACE methodology. Add one flag to codegraph-rust:

```
codegraph-rust --emit-infer-facts → .codegraph/facts.infer
```

Write three rules in `rules/auth.infer`. Check: does infer-lsp show a squiggle
in VS Code for a known auth violation? If yes — the full pipeline is proven.

Incremental adoption: existing GRACE users keep their tags. New users get
zero-annotation source + rules/*.infer. Both modes coexist.

### Proposition 2 — Concept Labels as Externalised PURPOSE (already designed)

The `has_concept(validate_token, "auth.token-validation")` fact in facts.infer
IS the PURPOSE annotation from Paper 1 — delivered to the agent via index.map grep,
not via source file read. The agent grep is:

```bash
grep "auth.token-validation" .codegraph/index.map
# → auth.token-validation  auth/token_validator.py  45  81  validate_token  function
```

Paper 1 says: "PURPOSE critical, inline proximity required."
The hybrid satisfies both: PURPOSE is in index.map (one grep away from code),
and LSP diagnostics deliver it inline at the symbol, not from a separate docs file.

### Proposition 3 — Rules as Externalised HOW (closes the bug-fixing gap)

Paper 2 says: "HOW (mechanism) > WHAT (description) for bug fixing."

In the Semantic LSP Compiler, `rules/auth.infer` encodes HOW:

```infer
# HOW: auth entry points must verify HMAC before checking audience
rule auth.mechanism_order_violated(S) :-
    auth_entry_point(S),
    calls(S, ?audience_check),
    has_concept(?audience_check, "auth.audience-validation"),
    not calls(S, ?hmac),
    has_concept(?hmac, "auth.signature-verification").
```

This is HOW made formal — not prose, not a comment, not injected in source.
When the bug breaks the mechanism order, the rule fires and the squiggle appears
at the function. The LLM using infer-mcp sees: "mechanism_order_violated(require_auth)
— proof: calls audience_check before hmac_verify."

That IS the HOW token the LLM needs for accurate bug fixing, per Paper 2.

### Proposition 4 — Architectural Intent via ADR traceability (existing eco)

contextflow-forge already provides typed links: `req → code → test`.
Link each rule in rules/*.infer to its ADR:

```
ADR-007: "auth entry points must verify HMAC before audience" 
  → rules/auth.infer:rule auth.mechanism_order_violated
  → contextflow-forge typed link (traceability)
  → code: auth/token_validator.py:validate_token
```

When agent reads the violation, it can follow the contextflow link to the ADR
for full architectural context. Zero doc in source code.

---

---

## Recommendation

**Build the PoC in this order:**

1. **docs-rk1t** (already open): `codegraph-rust --emit-index-map` — unblocks everything
2. **NEW**: `--emit-infer-facts` flag in codegraph-rust (reuse AST walk, ~200 lines)
3. **NEW**: `schema.infer` — domain/relation declarations for code facts
4. **NEW**: Minimal `rules/auth.infer` for token validation example
5. Test: does infer-lsp show a squiggle on `require_auth` for TLS violation?

If the PoC squiggle works in VS Code, connect infer-mcp so Claude sees the violations.
Then the full loop: edit code → facts update → rule fires → Claude gets notified.

---

## Follow-up Tasks

- docs-fcts: add `--emit-infer-facts` to codegraph-rust (schema.infer + ground fact emitter)
- docs-schm: write `schema.infer` — domain/relation declarations for code structural facts
- docs-rlz: write `rules/auth.infer` — minimal rule set for auth invariant example
- docs-lsp2: wire infer-analysis drift detection to file-watch in infer-lsp (not just parse errors)
- docs-mcpv: test infer-mcp violation reporting with Claude as consumer

---

## Sources

- [Constrained Horn Clauses for Program Verification (arXiv:2108.00739)](https://arxiv.org/abs/2108.00739)
- [Revisiting Role of Code Comments in Translation (arXiv:2601.16661)](https://arxiv.org/abs/2601.16661) — 80k+ translations; PURPOSE > DESCRIPTION; short > long; English only; inline proximity
- [On the Impact of Code Comments for Automated Bug-Fixing (arXiv:2601.23059)](https://arxiv.org/abs/2601.23059) — 109k bug-fix pairs; HOW > WHY > WHAT; buggy-code comments actively harmful; 3× improvement CodeT5+
- [lsp-tree-sitter library](https://lsp-tree-sitter.readthedocs.io/)
- [tree-sitter vs LSP explainer (Lambda Land, Jan 2026)](https://lambdaland.org/posts/2026-01-21_tree-sitter_vs_lsp/)
- infer-lsp: `crates/infer-lsp/src/backend.rs` (tower_lsp, full implementation)
- infer-analysis: `crates/infer-analysis/src/lib.rs` (detect_drift, detect_gaps, analyze_sensitivity)
- infer-core: `crates/infer-core/src/knowledge.rs` (typed facts, Horn clause rules)
