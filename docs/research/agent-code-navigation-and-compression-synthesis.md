# AI Agent Code Navigation + Token Compression — Full Synthesis

> **Combines**: codegraph-vs-grace-tags-index-map.md · codegraph-ctop-toon-index-format.md · ctop-toon-prompt-injection-format.md · grace-2-doxygen-grep-semantic-slicing.md
> **Question**: What is the full architecture for agent-friendly code navigation, and what compression tools exist at each layer?
> **Last updated**: 2026-05-07

---

## Short Answer

```
THE PROBLEM:
  AI agents navigating a large codebase naïvely read full files.
  Cost before any analysis: ~3500 tokens (3 files, no strategy).

THE INSIGHT:
  Agents operate in "zombie mode" — they default to grep regardless
  of what other retrieval tools are available. Lead that, don't fight it.

THE SOLUTION (Approach C — codegraph hybrid):
  tree-sitter derives structure → external index.map (TSV, grep-ready)
  concept labels in concepts.map → LLM batch assigns once
  merged into index.map → agent greps, gets file+start+end in one result
  Cost before analysis: ~630 tokens.  82% reduction vs naïve.

TOKEN COMPRESSION STACK (three orthogonal layers):
  Structured data  → CTOP DSL / binary   (infra-eco/ctop ✓ in ZomboCraftEco)
  Prose logic      → Wenyan / LLMLingua  (caveman NOT installed, LLMLingua NOT installed)
  Agent output     → caveman skill        (NOT installed)
```

---

## 1. Why Agents Grep: Zombie Mode

GrepRAG paper (arXiv:2601.23254) studied 45,615 LLM-generated ripgrep commands:

```
What agents actually search for:
  41% method names     35% class names     18% variable names     4% other

Why grep, not vector search or MCP tools?
  "Naive GrepRAG achieves competitive performance with sophisticated
   graph-based methods." — GrepRAG paper conclusion.

  Agents converge on grep because it works reliably enough to become
  a stable learned trajectory. Once a trajectory is stable, the model
  will follow it regardless of what other tools are offered.

Zombie mode trajectory (observed across Gemini, DeepSeek, Claude, GLM):
  1. File tree scan
  2. Grep for known identifiers
  3. Read matched file at returned line
  REPEAT until answer found.
```

**Design principle** (Ivanov, GRACE 2.0): "You can't fight zombie mode — lead it instead."

Both approaches below (GRACE embedded tags and codegraph hybrid) work by placing the right information at grep-reachable locations. The question is WHERE that information lives and who writes it.

---

## 2. Two Approaches: Embedded Tags vs External Index

### Approach A — GRACE Embedded Tags (the risk)

```
SOURCE FILE: auth/token_validator.py
─────────────────────────────────────────────────────────────────
# @GRACE_SEMANTIC: auth.entry-point, auth.token-validation
# START_BLOCK_validate_token
def validate_token(raw_token, secret, audience):
    ...
# END_BLOCK_validate_token
─────────────────────────────────────────────────────────────────

Agent navigation:
  grep "auth.entry-point" auth/         → hits tag, gets file
  grep "START_BLOCK_validate_token" auth/ → line 3 (needs 2nd grep for END)
  read lines 3–N

WHY IT FAILS:
┌─────────────────────────────────────────────────────────────────┐
│  "Comment and Control" CVE (CVSS 9.4, 2026)                     │
│  Claude Code, Gemini CLI, Copilot all vulnerable via            │
│  structured source comments.                                    │
│  GRACE embedded tags are structurally identical to the          │
│  exploited surface:                                             │
│    • Vendor dependencies carry tags → agent follows them        │
│    • Attacker writes to src/ → injects navigation target        │
│    • Tags drift silently as code moves (no checker)             │
│    • Audit: grep across 1000 files                              │
└─────────────────────────────────────────────────────────────────┘
```

### Approach C — codegraph Hybrid (the solution)

```
SOURCE FILES                .codegraph/                   AGENT
(zero annotations)          ─────────────────────────     ─────────────
auth/token_validator.py ──► index.map.raw (AST-derived)
api/middleware.py       ──► file, start, end,              greps here ◄──
auth/session_manager.py     symbol, kind                       │
  tree-sitter parse              │ + concepts.map               │
                                 ▼   (human/LLM, once)          │
                            index.map ◄── grep-ready TSV        │
                            concept  file  start  end  name  kind

Agent grep:
  grep "auth.entry-point" .codegraph/index.map
  → auth.entry-point  auth/token_validator.py  45  81  validate_token  function
    ↑ concept          ↑ file                  ↑   ↑   ↑ symbol         ↑ kind
                                               start end
                                      (start AND end in ONE result)

Security properties:
  • No tags in source — nothing to inject
  • index.map generated, not hand-edited
  • Vendor files excluded
  • Line drift impossible (AST re-derives on every run)
  • Audit: read ONE file
  • CI: sign index.map, verify on load
```

### Token Cost Comparison (3-way)

```
NAÏVE (no strategy):
  file tree scan              ~200 tokens
  read token_validator.py    ~1500 tokens (full file)
  read middleware.py         ~1000 tokens (full file)
  read session_manager.py    ~800 tokens  (full file)
  TOTAL before analysis:     ~3500 tokens

GRACE EMBEDDED TAGS:
  3× grep source files        ~350 tokens
  2× grep START/END_BLOCK     ~60 tokens   (needs TWO greps per block)
  read lines 69–121 (tagged)  ~500 tokens
  TOTAL before analysis:      ~910 tokens

HYBRID index.map (Approach C):
  3× grep .codegraph/index.map ~230 tokens  (results are shorter)
  read lines 45–81 (AST range) ~400 tokens
  TOTAL before analysis:       ~630 tokens  ← best

Hybrid saves: 30% vs GRACE tags · 82% vs naïve
On 1000-module codebase: naïve impossible · GRACE viable · hybrid wins
```

---

## 3. Concept Label Automation Pipeline

```
codegraph-rust (tree-sitter)
  │
  ▼
index.map.raw  ─────────────────────────────────► LLM batch call
<symbol>validate_token  auth/...  45  81           ~200 tokens / 10 symbols
<symbol>require_auth    api/...   10  22
<symbol>AuthError       auth/...  10  18           "Assign concept labels.
                                                    namespace=parent_dir
                                                    concept=semantic_role"
                                                        │
                                                        ▼
                                                   concepts.map
                                                   (LLM output, human reviews once)
                                                   auth/...::validate_token → auth.token-validation
                                                   api/...::require_auth    → auth.entry-point
                                                        │
                                                        ▼
                                               codegraph concepts merge
                                                        │
                                                        ▼
                                               index.map  (grep-ready)
                                               humans never touched source

Auto-derivable (>80% of well-named code):
  auth/token_validator.py::validate_token  →  auth.token-validation
  │     └── namespace from dir             └── concept from name
  └── strip extension, replace / with .

Requires human judgment: ambiguous names, cross-cutting concepts
```

---

## 4. GRACE 2.0 + Doxygen: Lazy-Load Architecture

GRACE 2.0 introduces Doxygen XML as an ALTERNATIVE navigation strategy for multi-language codebases (C/C++/Java/Python together). This is NOT in conflict with the hybrid index.map — they serve different scales.

```
GRACE 2.0 DOXYGEN PIPELINE:

source code (C++ / Python / Java / Rust)
  │
  └─► Doxygen (GENERATE_XML=YES, CALL_GRAPH=YES, CALLER_GRAPH=YES)
        │   50,000 LOC/min incremental, re-parses only changed files
        ▼
  doxygen/xml/
    ├── index.xml          ← tiny master list of all compounds (~2 KB for 1000 symbols)
    ├── compound.xsd       ← schema for validation
    └── classMyClass.xml   ← one file per class/namespace/file/struct
        contains: params, return types, call graph edges, inheritance

AGENT TRAVERSAL (lazy-load, not inline injection):
  Step 1: read index.xml    → full compound list, O(1), ~2 KB
  Step 2: identify targets  → names from index
  Step 3: load ONE compound XML → e.g. classAuthError.xml (~400 chars)
  Step 4: follow call graph edges → next compound only if needed
  Step 5: STOP — never load what is not needed

WHAT "OXYGEN ENGINE" MEANS:
  Oxygen XML Editor (oxygenxml.com) or combine.xslt from Doxygen
  transforms compound XML → compact agent-consumable format
  source → XML → XSLT/Oxygen transform → CTOP DSL table → GRACE prompt

WHY NOT INLINE XML INJECTION:
  Doxygen XML per function: ~400 chars (verbose tags)
  20 functions inline: ~8000 chars → ~2000 tokens
  Same 20 functions in CTOP DSL: ~356 tokens  (5.6× cheaper)
  XML is the intermediate format. CTOP DSL is what enters the prompt.
```

**codegraph hybrid vs GRACE 2.0 Doxygen — when to use which:**

```
                    codegraph hybrid          GRACE 2.0 Doxygen
                    ────────────────────────  ──────────────────────────
Codebase language   Any (tree-sitter)         C/C++/Java/Python/Rust/...
Index file          index.map (TSV)           index.xml (XML)
Symbol detail       source lines at AST range compound XML file
Call edges          Not yet (docs-rk1t next)  CALL_GRAPH built-in
Line numbers        AST-derived (exact)       Doxygen-parsed (re-run)
Grep navigation     ✓ zombie-mode compatible  ✗ XML not greppable
ZomboCraftEco       codegraph-rust ✓          Not installed
Scale               Any                       Large multi-lang codebases
```

---

## 5. Format Decisions: Two Different Surfaces

The index.map serves **two completely different consumers** that need different formats.

```
SURFACE 1: Agent grep at the shell (zombie mode navigation)
  Consumer: shell grep command in agent trajectory
  Format needed: grep-compatible text, one result = one row = all fields
  Winner: TSV — grep returns "concept\tfile\tstart\tend\tname\tkind" in one line

SURFACE 2: Data pre-loaded into LLM context window
  Consumer: LLM attention mechanism reading the prompt
  Format needed: token-efficient, self-describing, handles nested data
  Winner: depends on data shape (see §5.2)
```

### 5.1 Storage Format (on disk)

```
index.map (TSV) — primary, grep-first
  auth.token-validation  auth/token_validator.py  45  81  validate_token  function
  auth.entry-point       auth/token_validator.py  45  81  validate_token  function

index.ctop (CTOP binary) — secondary, fast-load
  Same data, CTOP binary with automatic optimizations:
  ┌──────────────────────────────────────────────────────────────┐
  │  DICT_REF  — repeated strings stored once, referenced by ID  │
  │  DELTA_INT — monotonic start_line sequences compressed:      │
  │    avg delta 15 between consecutive lines → 1 byte vs 3      │
  │    67% reduction on line number columns                      │
  │  PACKED_LIST — homogeneous int columns, no per-element opcode│
  │  LZ4/ZSTD — optional compression layer on top               │
  └──────────────────────────────────────────────────────────────┘
  For 1M symbols: TSV ~80 MB  →  CTOP binary + LZ4 ~2–4 MB  (40-60% smaller)
  Decode speed: ~3 ms for 10,000 symbols (vs I/O-bound TSV parse)
```

### 5.2 Prompt Injection Format (in LLM context)

**The flat tabular surprise** — for index rows without call edges, all three text formats are nearly equal:

```
Flat index (20 symbols, no call edges):
  TSV:  1435c  ~358 tokens  (baseline)
  CTOP: 1341c  ~335 tokens  (93% of TSV — schema overhead amortizes slowly)
  TOON: 1403c  ~350 tokens  (97% of TSV)
  → Use TSV or CTOP, no material difference
```

**Where CTOP wins: call graph / nested data**

```
Call graph (20 symbols, avg 3 outgoing edges each):
  JSON: 2293c  ~573 tokens  (baseline)
  CTOP: 1426c  ~356 tokens  (62% of JSON — 38% savings)
  TOON: 1478c  ~369 tokens  (64% of JSON)
  TSV:  BROKEN — requires separate edge file + schema note in prompt

CTOP table with call edges (unambiguous):
  sym(concept file start end calls)[
  validate_token auth/token_validator.py 45 81 [decode_header verify_hmac is_expired]
  decode_header  auth/token_validator.py 32 44 []
  require_auth   api/middleware.py       10 22 [validate_token handle_auth_error]
  ]

TOON with call edges (ambiguous — commas clash):
  sym[3]{concept,file,start,end,calls}:
    validate_token,auth/token_validator.py,45,81,[decode_header,verify_hmac,is_expired]
    ↑ row separator = comma                       ↑ list separator = also comma
    An LLM must use heuristics to parse this correctly.
```

**TOON vs CTOP: the training familiarity question**

TOON (toonformat.dev) has more web presence than CTOP. But for self-describing table formats, training familiarity is nearly irrelevant — the schema header IS the documentation:

```
CTOP:  sym(concept file start end calls)[  ← columns declared here, LLM reads them
TOON:  sym[N]{concept,file,start,end}:     ← columns declared here, LLM reads them
```

The LLM does not need prior training to parse either — it reads the header and infers the structure. Training familiarity matters when the LLM must GENERATE the format as output, not read it as input.

CTOP wins on ecosystem (binary format, validation, ZomboCraftEco-native). TOON has no binary layer and stops at the prompt boundary.

### 5.3 Format Selection Matrix (complete)

```
USE CASE                        FORMAT              NOTES
──────────────────────────────  ──────────────────  ─────────────────────────
Agent grep navigation (shell)   TSV (index.map)     Zombie-mode compatible
Storage on disk                 TSV + CTOP binary   Dual format
Prompt: flat symbol list        TSV or CTOP table   Equivalent, pick either
Prompt: symbols + call edges    CTOP DSL table      38% savings vs JSON; TSV breaks
Prompt: module hierarchy        CTOP nested map     ~28% savings vs JSON
Full codebase traversal         Doxygen lazy-load   NOT inline — subagent reads index.xml
GRACE DATAFLOW section          Dense symbolic      Hand-written; no library needed
Agent output                    caveman:ultra       Claude generates compressed output
Long input doc compression      LLMLingua           Algorithmic; NOT installed
```

---

## 6. Token Compression Ecosystem — Full Capability Map

This section covers every compression tool, who does the work, and the current installation status.

### 6.1 The Three Compression Domains

```
DOMAIN 1: Structured data (symbols, file paths, line numbers, call edges)
  → CTOP DSL for prompt injection
  → CTOP binary for storage
  → TSV for grep navigation
  These are FORMAT decisions. No compression happens "at runtime."

DOMAIN 2: Input documents (long docs fed into LLM context)
  → LLMLingua: a small Python model scores token importance, drops low-value tokens
  → Compresses BEFORE the LLM sees the text
  → 40-60% token reduction on English prose
  → The LLM that reads compressed text does not know it was compressed

DOMAIN 3: LLM output (what the agent says in responses)
  → caveman: a Claude Code skill (system prompt instruction)
  → Claude generates compressed output when the skill is active
  → 65% average savings (87% peak explanatory, 22% min refactors)
  → Wenyan mode: Claude responds in Classical Chinese — ~79% vs English prose
```

### 6.2 Why Compression Increases Accuracy (arXiv:2604.00025)

```
VERBOSE PROMPT (28 tokens — grammar dilutes attention):

  [The][reason][your][React][comp][is][re-rendering][is][likely]
  [because][you][are][creating][a][new][object][ref][on][each][render]

  Semantic concepts [React][re-rendering][new][object][ref] must
  compete with 15 grammar tokens for attention weight.
  Each concept gets ~1/28 of total attention budget.

COMPRESSED PROMPT (10 tokens — all semantic):

  [React][comp][re-renders][:][new][obj][ref][per][render]

  No grammar competing. Each concept gets ~1/10 of attention.
  Concepts attend to each other 2-3× more strongly.
  → Reasoning about causal relationships becomes more reliable.

arXiv:2604.00025 result: +26pp accuracy on some benchmarks
"Brevity Constraints Reverse Performance Hierarchies in Language Models"
Counterintuitive: less verbose = more correct (not just cheaper).
```

### 6.3 DSA Lightning Indexer — Why Chinese Models Need This

```
DeepSeek V4 / GLM-5: Compressed Sparse Attention (CSA)

  ┌─ Lightning Indexer (FP8, fast pre-pass) ──────────────────┐
  │  Scores ALL tokens quickly → keeps TOP-K as "anchors"     │
  │  Discarded tokens get ~0 attention weight in ALL layers    │
  └───────────────────────────────────────────────────────────┘
                          ↓ anchors only
  ┌─ Full attention (FP16, expensive) ────────────────────────┐
  │  Runs only between anchor tokens. 90% KV-cache reduction.  │
  └───────────────────────────────────────────────────────────┘

VERBOSE prompt, TOP-K = 8, 28 tokens:
  Grammar words ("is" "are" "the" "a") score HIGH in Indexer
  because they appear in many training contexts.
  Your semantic concepts compete with grammar for 8 anchor slots.

COMPRESSED prompt, TOP-K = 8, 10 tokens:
  All tokens are semantic. 8 of 10 become anchors.
  Full attention runs between exactly the right concepts.

GRACE 2.0 anchor strategy: front-load semantic content,
strip grammar, all key tokens survive the pre-scoring cut.
```

### 6.4 Wenyan (文言文) — Why Logographic Script Is Dense

```
English: 1 word ≈ 0.3–0.5 semantic units (~50% grammar overhead)

  "The reason your React component is re-rendering is likely
   because you are creating a new object reference on each
   render cycle."
   28 tokens → 8 semantic units.  Ratio: 3.5 tokens/concept.

Classical Chinese: 1 character = 1 semantic unit (~5% grammar overhead)

  Stripped properties vs English:
    ✗ Verb inflection  (is/are/was/will — ~10% of English tokens)
    ✗ Articles         (a/an/the        — ~8%)
    ✗ Subject pronouns (you/it/they     — ~5% when inferable)
    ✗ Auxiliaries      (are creating    — ~7%)
    ✓ 4-char idioms    (full narrative frames in 4 chars)

  "物出新參照，致重繪。" = 9 chars → ~5-6 BPE tokens
   same meaning as 28 English tokens.  Savings: ~79%.

Russian: ~95% fidelity to Wenyan compression
  Rich inflection → flexible word order → drop function words
  Academic Russian already uses nominalized compact phrasing
```

### 6.5 LLMLingua — The Only Algorithmic Input Compressor

```
WHAT CAVEMAN DOES (output side):

  User message → [LLM generates response with caveman skill]
                         ↓
                 compressed output  (65% avg savings)
                 The LLM IS the compressor. No library runs.

WHAT LLMLINGUA DOES (input side):

  Long document → [LLMLingua small encoder model]
                         ↓
                 Scores each token by importance
                         ↓
                 Drops low-importance tokens
                         ↓
                 Compressed text → fed to LLM
                 The LLM never sees the full document.

LLMLingua-2:
  microsoft/llmlingua-2-xlm-roberta-large-meetingbank
  Task-agnostic compression, ~60% input token reduction
  Lossless for key facts; lossy for filler/redundancy
  Integration: pip install llmlingua → Python API

Use case for GRACE prompts:
  Long Doxygen compound XML → LLMLingua → compact summary
  → inject 200 tokens instead of 500 into GRACE prompt
  → LLM reads the summary, not the raw XML
```

### 6.6 Capability Matrix — What Exists, What Is Installed

```
TOOL / FORMAT       WHAT IT COVERS              WHERE IT LIVES           STATUS
──────────────────  ──────────────────────────  ───────────────────────  ────────────────
CTOP (Rust crate)   Struct data: DSL + binary   infra-eco/ctop           ✓ AVAILABLE
                    DELTA_INT, DICT_REF, LZ4
                    Encode/decode/validate

TSV index.map       Struct data: grep nav        codegraph-rust output    ✓ FORMAT DEFINED
                                                 (--emit-index-map)       ✗ NOT EMITTED YET
                                                                          (docs-rk1t open)

CTOP binary         Struct data: fast storage    infra-eco/ctop           ✓ LIBRARY READY
index.ctop          40-60% smaller than TSV      codegraph-rust output    ✗ NOT WIRED YET
                                                                          (docs-1htp open)

Doxygen XML         Multi-lang call graphs       External (doxygen.nl)    ✗ NOT INSTALLED
                    Lazy-load traversal          GENERATE_XML, CALL_GRAPH
                    50k LOC/min incremental

doxmlparser         Lazy compound XML loading    Doxygen addon/           ✗ NOT INSTALLED
                                                 doxmlparser

LLMLingua           Input compression            pip install llmlingua    ✗ NOT INSTALLED
                    ~60% long doc reduction      Microsoft Python lib      ~1-2 days to wire

caveman skill       Output compression           github: JuliusBrussee    ✗ NOT INSTALLED
                    65% avg (87% max)            /caveman                  curl | bash
                    Wenyan mode available        Claude Code skill

cavemem             Cross-agent compressed KB    github: JuliusBrussee    ✗ NOT INSTALLED
                    SQLite + MCP                 /cavemem

caveman-shrink      MCP tool desc compression   npm: caveman-shrink       ✗ NOT INSTALLED
                    46% savings on tool lists    MCP stdio proxy

Dense symbolic      Prose logic compression      Hand-written notation     ✓ USABLE TODAY
notation (→|{})     40-87% vs English prose     No library needed         manual authoring
```

### 6.7 What Each Tool Compresses (no overlap)

```
                INPUT     STRUCTURED    OUTPUT    MCP TOOL    AGENT
                DOCS      DATA          PROSE     DESCS       MEMORY
                ────────  ────────────  ────────  ──────────  ─────────
LLMLingua       ✓         ✗             ✗         ✗           ✗
CTOP DSL/bin    ✗         ✓             ✗         ✗           ✗
Dense symbolic  ✗         ✗             ✓         ✗           ✗
caveman output  ✗         ✗             ✓         ✗           ✗
Wenyan mode     ✗         ✗             ✓         ✗           ✗
caveman-shrink  ✗         ✗             ✗         ✓           ✗
cavemem         ✗         ✗             ✗         ✗           ✓

These tools are COMPLEMENTARY — no overlapping territory.
You can run all of them simultaneously without conflicts.
```

---

## 7. The Full Pipeline: Source Code → Agent Navigation

```
SOURCE CODE
    │
    ├─── tree-sitter (codegraph-rust) ──────────────────────────────────────►
    │    parse: file, start_line, end_line, symbol, kind
    │    output: index.map.raw (placeholder labels)
    │                    │
    │                    ├── LLM batch (~200 tokens / 10 symbols)
    │                    │   "assign concept labels, namespace=parent_dir"
    │                    │          │
    │                    │          ▼
    │                    │   concepts.map (human reviews once, one PR)
    │                    │          │
    │                    │   codegraph concepts merge
    │                    │          │
    │                    ▼          ▼
    │              .codegraph/index.map (TSV, grep-ready)  ← AGENT GREPS HERE
    │              .codegraph/index.ctop (binary, fast load)
    │
    └─── Doxygen (optional, multi-lang) ────────────────────────────────────►
         parse: all languages, call graphs, inheritance
         output: doxygen/xml/index.xml + compound XML files
                     │
                     └── AGENT reads index.xml (lazy)
                         → loads only needed compound XML
                         → Oxygen/XSLT transforms XML → CTOP DSL → GRACE prompt

GRACE PROMPT ASSEMBLY:
    ┌────────────────────────────────────────────────────────────────────┐
    │  [INDEX — CTOP DSL table with call edges]       ~356 tokens        │
    │  sym(concept file start end calls)[                                │
    │  validate_token auth/token_validator.py 45 81                      │
    │    [decode_header verify_hmac is_expired]                          │
    │  ...]                                                              │
    │                                                                    │
    │  [DATAFLOW — dense symbolic / Wenyan]            ~40 tokens        │
    │  raw_token→decode_header→{alg,kid}|AuthError(400)                  │
    │  →verify_hmac|AuthError(401)→claims                                │
    │  →is_expired(now≥exp)|AuthError(401)→TokenClaims                   │
    │                                                                    │
    │  [NAVIGATION CONTRACT]                           ~15 tokens        │
    │  greps hit .codegraph/index.map — NOT source files                 │
    │  TOTAL: ~411 tokens   vs naïve JSON+prose ~753 tokens  (45% saved) │
    └────────────────────────────────────────────────────────────────────┘

AGENT SESSION COMPRESSION (when caveman installed):
    caveman-shrink:  Infer/RSTMDB MCP tool descriptions  -46%
    caveman output:  agent response prose                 -65% avg
    cavemem:         cross-session memory KB              compressed SQLite
    LLMLingua:       long input docs before injection     -60%
```

---

## 8. Integration Priority

```
PRIORITY  TASK                                 EFFORT    STATUS
────────  ───────────────────────────────────  ────────  ───────────────────────
P1        codegraph-rust --emit-index-map      ~80 lines  docs-rk1t  OPEN
          (TSV output from tree-sitter)         Rust       UNBLOCKED

P1        ctop workspace dep in codegraph-rust ~5 lines   docs-ifdz  OPEN
          path dep in Cargo.toml               Cargo      UNBLOCKED

P2        codegraph-rust --emit-index-bin      ~80 lines  docs-1htp  OPEN
          (CTOP binary alongside TSV)          Rust       blocked on docs-rk1t

P2        codegraph-rust --emit-index-ctop-    ~80 lines  (not yet   OPEN
          calls (CTOP DSL with call edges       Rust       tracked)
          for GRACE prompt injection)

P2        Install caveman skill                1 command  —          UNBLOCKED
          curl | bash                          immediate
          Compressed agent output today.

P2        concept label auto-derivation        ~1 day     docs-j4tz  OPEN
          file_path+symbol_name → concept       Rust       UNBLOCKED
          heuristic + labels.toml overlay

P3        LLMLingua integration                ~1-2 days  —          UNBLOCKED
          pip install llmlingua                Python     for long input doc compression
          wire into GRACE prompt assembly

P3        GRACE prompt template update         ~1 day     —          UNBLOCKED
          replace flat TSV with CTOP table     Markdown   needs docs-rk1t data first
          + call edges + dense DATAFLOW

P4        Doxygen as codegraph-rust import     ~3 days    —          OPEN
          parse compound XML for C/C++/Java    Rust       large multi-lang codebases only
          (skip for Python-only codebases)

P4        caveman-shrink on Infer MCP          1 hour     —          UNBLOCKED
          compress tool descriptions
```

---

## 9. Sources

| Document | What it contributed |
|---|---|
| `codegraph-vs-grace-tags-index-map.md` | Security rationale; CVSS 9.4 "Comment and Control" CVE; tree-sitter as runtime truth; Approach C design |
| `codegraph-ctop-toon-index-format.md` | CTOP DELTA_INT math (67% line number savings); dual-format storage; Rust integration path; incremental update architecture |
| `ctop-toon-prompt-injection-format.md` | Flat tabular = TSV≈CTOP≈TOON; call graph = CTOP wins; TOON training familiarity question; "caveman is not a library" correction; LLMLingua integration path |
| `grace-2-doxygen-grep-semantic-slicing.md` | GrepRAG 41% method names; zombie mode theory; Doxygen XML lazy-load architecture; Lightning Indexer / DSA for Chinese models; Oxygen XML context |
| `caveman-wenyan-context-compression.md` | Caveman three tiers; benchmark table (87% peak); Wenyan linguistic properties; arXiv:2604.00025 (+26pp accuracy); FOUR bilattice compatibility |
| `ZomboCraftEco/infra-eco/ctop/` | CTOP README (format comparison table), specification.md (DELTA_INT §4.8, DICT_REF §4.6), compare_formats.rs (authoritative char counts) |
| arXiv:2601.23254 (GrepRAG) | 45,615 grep commands analysed; 41% method names; competitive with graph methods |
| arXiv:2604.00025 | Brevity → +26pp accuracy; reversed model-capability rankings |
