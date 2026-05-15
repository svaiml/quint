# CTOP/TOON as LLM Prompt Injection Format — When Format Actually Matters

> **Context**: codegraph-rust emits `index.map` (TSV) for agent grep navigation. Separately, GRACE-style prompts PRE-LOAD index data directly into the LLM context window. These are two different problems that need two different format strategies.
> **Question**: For LLM prompt injection (not grep navigation), should codegraph use CTOP DSL, TOON, TSV, or Doxygen XML?
> **Last updated**: 2026-05-07
> **br task**: docs-09ox

---

## Short Answer

```
Data shape               Best prompt format        Why
────────────────────     ──────────────────────    ───────────────────────────────
Flat index (no edges)    TSV ≈ CTOP DSL ≈ TOON    They're identical at scale (+/-7%)
With call edges/nesting  CTOP DSL table            40% savings over JSON; TSV breaks
Full codebase traversal  Doxygen XML lazy-load     NOT inline — subagent reads index.xml
Prose descriptions       Wenyan / caveman:ultra    65% output compression (not data)
```

**The surprise**: For flat tabular index rows (concept + file + lines + name + kind), all three text formats (TSV / CTOP / TOON) are within 7% of each other. The CTOP/TOON advantage only materializes when the data has **nested structure** — call graphs, import edges, module hierarchies. At that point, CTOP wins ~40% over JSON and TSV cannot represent the data in one file at all.

**GRACE 2.0 + Doxygen XML**: The "Oxygen engine" approach is NOT about injecting XML into prompts — it is a **lazy-loading traversal architecture**. The LLM reads the tiny `index.xml` first, then lazily loads specific compound XML files. Inline XML injection would cost ~5x more tokens than CTOP DSL for the same data.

---

## 1. The Flat Tabular Surprise

When you embed an index.map slice into a GRACE prompt orientation section, the format barely matters:

```
Flat index (20 symbols, no call edges):
  TSV:  1435c  ~358 tokens  (baseline)
  CTOP: 1341c  ~335 tokens  (93% of TSV)
  TOON: 1403c  ~350 tokens  (97% of TSV)
```

**Why TSV is already near-optimal for flat tabular data**:
- TSV already avoids per-row field name repetition (the main inefficiency of JSON)
- Tabs and spaces both cost 1 token each — no difference at the separator level
- CTOP/TOON schema overhead (header row) amortizes only over many rows

**The CTOP README claims** (from compare_formats.rs) are correct but measure CTOP vs JSON, not CTOP vs TSV:
```
Tabular (3 rows): JSON 231c → TOON 131c (56%) → CTOP 129c (55%)
```
Codegraph index.map is already in TSV, which is structurally identical to CTOP's flat table format. Both declare schema once and stream rows. TSV uses tabs; CTOP uses spaces. The savings vs JSON are real (~55%), but you already have them by using TSV.

---

## 2. Where CTOP/TOON Genuinely Win: Nested Data

When the prompt needs to include **call graph edges alongside symbol data**, the data shape changes from flat rows to nested structures. TSV cannot represent this in a single file; JSON is verbose; CTOP/TOON handle it natively.

```
Call graph (20 symbols, avg 3 outgoing edges each):
  JSON: 2293c  ~573 tokens  (baseline)
  CTOP: 1426c  ~356 tokens  (62% of JSON)  ← 38% savings
  TOON: 1478c  ~369 tokens  (64% of JSON)  ← 36% savings
  TSV:  BROKEN — requires separate edge file + schema explanation in prompt
```

CTOP table with inline call edges:

```
sym(name file start end calls)[
validate_token auth/token_validator.py 45 81 [decode_header verify_hmac is_expired]
decode_header auth/token_validator.py 32 44 []
is_expired auth/token_validator.py 28 29 []
require_auth api/middleware.py 10 22 [validate_token handle_auth_error]
]
```

vs JSON (same data):

```json
[
  {"name": "validate_token", "file": "auth/token_validator.py", "start": 45, "end": 81,
   "calls": ["decode_header", "verify_hmac", "is_expired"]},
  {"name": "decode_header", "file": "auth/token_validator.py", "start": 32, "end": 44, "calls": []},
  {"name": "is_expired", "file": "auth/token_validator.py", "start": 28, "end": 29, "calls": []},
  {"name": "require_auth", "file": "api/middleware.py", "start": 10, "end": 22,
   "calls": ["validate_token", "handle_auth_error"]}
]
```

CTOP wins here because:
- Field names not repeated per row (saves `"name":`, `"file":`, `"start":`, `"end":`, `"calls":` × N rows)
- Inline list `[decode_header verify_hmac is_expired]` requires no quotes for bare identifiers
- No commas, no braces per row, no indentation tax

**TOON cannot do this cleanly**: TOON's tabular syntax uses commas and explicit row counts. For list-valued cells (calls), TOON gets awkward (`[decode_header,verify_hmac,is_expired]` with commas). CTOP is cleaner (space-separated bare identifiers inside `[...]`).

---

## 3. Doxygen XML + GRACE 2.0: NOT Inline Injection

The "Oxygen engine" in GRACE 2.0 context refers to processing Doxygen XML output — either via Oxygen XML Editor's XSLT transforms or the `doxmlparser` lazy-loading library. The key architectural point: **Doxygen XML is never injected inline into the prompt as a whole**.

### Why Inline XML is Disqualified

```
Doxygen XML (inline injection, 20 compound excerpts):
  XML: 8000c  ~2000 tokens  (5x more than CTOP for same data)
```

A single Doxygen compound XML entry (one function with parameters, brief, location, call graph edges) is ~400 characters of XML markup. For 20 symbols, that's ~8,000 characters — 5× more tokens than CTOP DSL for identical information.

### The Correct Doxygen Architecture: Lazy-Load via Subagent

GRACE 2.0's Doxygen strategy is a **traversal architecture**, not an injection architecture:

```
GRACE 2.0 + Doxygen XML pipeline:

Step 1: Agent reads index.xml (tiny: ~2KB for 1000 compounds)
              ↓
Step 2: Agent identifies target compound names from index
              ↓
Step 3: Agent loads ONLY the relevant compound XML file (e.g. classAuthError.xml)
              ↓
Step 4: Agent reads brief + params + call graph from that one compound file
              ↓
Step 5: Agent follows call edges to next compound only if needed
```

This is identical in spirit to the codegraph hybrid `index.map` approach — load a small orientation file first, then navigate to specific symbols. The difference is format:

| | codegraph hybrid | GRACE 2.0 Doxygen |
|---|---|---|
| Index file | `index.map` (TSV, grep-ready) | `index.xml` (XML, doxmlparser) |
| Symbol detail | source file at specific lines | compound XML file |
| Call edges | separate (not yet in index.map) | `CALL_GRAPH`/`CALLER_GRAPH` in compound XML |
| Line numbers | AST-derived (always current) | Doxygen-parsed (re-run on change) |
| Injection format | TSV or CTOP DSL | XML → transform → compact |

### What "Oxygen Engine" Means Practically

The processing pipeline:
```
source code
  → Doxygen (GENERATE_XML=YES, CALL_GRAPH=YES) → compound XML files
    → Oxygen XSLT transform (or combine.xslt) → compact agent-consumable form
      → embedded in GRACE prompt as CTOP DSL table or structured summary
```

The XML is an intermediate representation. It is not the final format in the prompt. Oxygen (or XSLT + doxmlparser) transforms it into whatever format the agent reads most efficiently — which should be CTOP DSL table for structured data.

---

## 4. Format Selection Matrix by Data Shape

```
DATA SHAPE                           PROMPT FORMAT       GREP FORMAT
─────────────────────────────────    ─────────────────   ─────────────
Symbol index (flat, no edges)        CTOP table or TSV   TSV (index.map)
Symbol index + call edges            CTOP table          TSV + edge TSV
Module hierarchy (nested)            CTOP nested map     N/A (not greppable)
Function signatures (typed fields)   CTOP map            TSV row per field
Documentation / descriptions         Wenyan/caveman      Plain text
Full codebase orientation (big)      Doxygen lazy-load   index.xml listing
```

### Concrete GRACE Prompt Structure with CTOP

A GRACE hybrid prompt (Approach C) pre-loading the orientation section:

```
GRACE 2.0 HYBRID — codegraph/ctop mode

[INDEX — auth module, call-graph included]
sym(concept file start end calls)[
auth.entry-point auth/token_validator.py 45 81 [decode_header verify_hmac is_expired]
auth.entry-point api/middleware.py 10 22 [validate_token handle_auth_error]
auth.error-type auth/token_validator.py 10 18 []
auth.token-claims auth/token_validator.py 20 31 [is_expired]
auth.session auth/session_manager.py 10 20 [validate_token]
]

[NAVIGATION CONTRACT]
All greps hit .codegraph/index.map (TSV) — NOT source files.
Index above pre-loaded for orientation. Use grep for semantic slicing.
```

This combines:
1. CTOP table for call-graph-enriched orientation (38% savings over JSON, works in prompt)
2. TSV index.map for agent grep navigation (zombie mode compatible)

The two formats coexist — they serve different purposes.

---

## 5. TOON vs CTOP — The Training Familiarity Question

The user's concern is legitimate: TOON has a published spec at toonformat.dev and is presented as a community standard. CTOP is a ZomboCraftEco internal library. Why would an LLM handle CTOP as well as TOON when it has seen far more TOON in training?

### The Framing Is Slightly Wrong

The question assumes CTOP needs to beat TOON **on prompt readability**. That is the wrong battleground. CTOP and TOON are within 2-3% of each other on token cost for flat tabular data. Neither wins there. The actual decision splits differently:

```
                    TOON wins            CTOP wins
                    ─────────────────    ──────────────────────────────
  Prompt readability  Slight edge         —
  (LLM has seen it)   (familiarity)
                    
  Call graph cells    —                   Clear (no comma ambiguity)
  
  After prompt        —                   Binary round-trip, validation,
  (ecosystem)                             native ZomboCraftEco library
```

### Why Training Familiarity Is Smaller Than It Sounds

Both TOON and CTOP are **self-describing table formats**. The LLM does not need prior training to read them — the schema header IS the documentation:

```
CTOP:  sym(concept file start end calls)[   ← column names declared here
         auth.token-validation auth/... 45 81 [decode_header]
       ]

TOON:  sym[5]{concept,file,start,end,calls}:  ← column names declared here
         auth.token-validation,auth/...,45,81,[decode_header]
```

When an LLM sees either header, it immediately knows: "this is a 6-column table, here are the column names, here are the rows." No training exposure needed. The format documents itself in the first line.

Training familiarity matters when:
- The LLM must **generate** the format as output (not just read it)
- The format has **ambiguous edge cases** that training resolves by convention
- The format is **mixed with prose** and training determines how the LLM switches modes

For injected structured data (input to LLM), training familiarity is nearly irrelevant.

### The One Place TOON Has a Structural Problem

TOON uses commas as both the **row-element separator** and the convention for list values. This creates genuine ambiguity with call graph data:

```
TOON row with call edges:
  auth.token-validation,auth/token_validator.py,45,81,[decode_header,verify_hmac,is_expired],function
                                                       ─────────────────────────────────────
                                                       Is this one field or three fields?
                                                       A CSV parser would split on ALL commas.
                                                       An LLM must decide by context.

CTOP row with call edges:
  auth.token-validation auth/token_validator.py 45 81 [decode_header verify_hmac is_expired] function
                                                       ─────────────────────────────────────
                                                       Unambiguous: space-separated list inside [...].
                                                       No conflict with row separator (also space).
```

This is not a theoretical concern. TOON's spec uses commas for rows, and `[a,b,c]` for lists — the same character at two levels. An LLM parsing TOON with list-valued columns has to apply heuristics. CTOP's space-separated everything is unambiguous by design.

For flat tabular data with no list-valued columns, this problem does not arise. For call graphs, it does.

### The Actual CTOP Advantage: Ecosystem, Not Prompt Syntax

The reason to standardize on CTOP is **not** that it writes prettier prompts. It is that CTOP is the same format across three contexts where TOON only covers one:

```
Context           CTOP                          TOON
────────────────  ────────────────────────────  ──────────────────────
Prompt injection  DSL text (readable by LLM)    Text (readable by LLM)
Tool storage      Binary (40-60% smaller)        Text only — no binary
Validation        ctop validate (structural)     None — parse manually
Round-trip        DSL → binary → DSL, lossless  Text only
ZomboCraftEco     infra-eco/ctop (native dep)    External (toonformat.dev)
```

If you use TOON in prompts and CTOP binary for storage, you pay a translation step between the two. If you use CTOP DSL in prompts and CTOP binary for storage, the same crate handles both — `print_dsl()` for prompts, `encode_binary()` for storage, `decode_binary()` to load.

**Verdict**: For flat tabular data injected into prompts, TOON and CTOP are interchangeable. Use whichever you prefer aesthetically. The moment you need call edges (list-valued columns), prefer CTOP. The moment you need the format to survive past the prompt (storage, validation, tooling), CTOP wins by having an ecosystem. TOON stops at the prompt boundary.

---

## 6. Wenyan / Caveman: Where It Applies (and What It Actually Is)

Full mechanism, attention math, and DSA Lightning Indexer analysis:
→ see `docs/research/caveman-wenyan-context-compression.md`

**Short version**: English prose is ~50% grammar overhead (articles, aux verbs, inflection) that carries near-zero information for an LLM that has already learned the grammar. Caveman strips that overhead from Claude's output. Wenyan (Classical Chinese) goes further — logographic script has ~5% grammar overhead vs ~50% for English, so 1 character ≈ 1 semantic unit. arXiv:2604.00025 showed brevity constraints improved accuracy by 26pp on some benchmarks: fewer tokens = less attention dilution = concepts attend to each other more strongly.

The three compression tiers and their token savings are documented in `caveman-wenyan-context-compression.md §Architecture`.

### 6.6 What Wenyan/Caveman Does NOT Apply To

```
                    caveman:ultra    Wenyan    CTOP DSL
                    ─────────────    ───────   ────────
Prose explanations       YES           YES       No
Dataflow descriptions    YES           YES       No
Error messages           YES           YES       No
────────────────────────────────────────────────────────
File paths               NO            NO        Yes (as table data)
Function names           NO            NO        Yes (as table data)
Line numbers             NO            NO        Yes (as table data)
Call edges               NO            NO        Yes (as list value)
```

**The hard boundary**: Wenyan strips grammatical overhead. Structured symbols (paths, names, numbers) have NO grammatical overhead to strip — they are already 100% information density. Applying Wenyan to `auth/token_validator.py::validate_token` would corrupt the symbol. CTOP DSL is the format for structured symbols; Wenyan is the format for prose logic around them.

### 6.7 ⚠ CRITICAL: "Wenyan" Is Not a Library — What Actually Runs

This is the most important clarification in this document.

```
WHAT YOU MIGHT THINK:
  English prose  ──[wenyan-compiler]──►  Wenyan/dense output
  (a preprocessing step before the LLM sees the prompt)

WHAT ACTUALLY HAPPENS:
  Claude Code + caveman skill installed
       │
       ▼
  Claude generates a response
       │
       ├── WITHOUT caveman skill:
       │   "The reason your React component is re-rendering is
       │    likely because you are creating a new object reference
       │    on each render cycle."   (28 tokens)
       │
       └── WITH caveman:ultra skill active:
           "new obj ref per render → re-render"   (8 tokens)
           ↑
           Claude itself wrote this. No library ran.
           The skill is a system prompt instruction, not code.
```

**Caveman is a Claude Code skill** — a `/caveman` slash command installed via `curl | bash`. When active, it changes Claude's *output style*. The LLM generates the compression. Nothing runs outside the LLM.

**The three techniques and who does the work:**

```
Technique              Who does the work       Is there code?    In our stack?
─────────────────────  ──────────────────────  ────────────────  ─────────────
caveman output mode    Claude (generation)     Skill = sys prompt  NOT installed
Wenyan notation        Claude (generation)     Skill = lang mode   NOT installed
Dense symbolic (→|{})  Prompt author (human)   Handwritten         Manual effort
LLMLingua              Separate small model    Python library      NOT installed
CTOP DSL               Rust serializer         Rust library        ✓ infra-eco/ctop
```

**The only real compression library we have is CTOP** — and it only covers structured data.

### 6.8 How to Get Prose Compression: Three Options

**Option A — Install caveman skill (immediate, free)**

```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
# → adds /caveman:ultra, /caveman:wenyan, etc. as Claude Code slash commands
# → Claude's output becomes compressed whenever the skill is active
# → zero infrastructure change, works today
```

Constraint: only compresses Claude's OUTPUT tokens (what Claude says). Does not compress input documents fed into context. Does not help with pre-loaded GRACE prompt sections.

**Option B — LLMLingua for INPUT compression (~1-2 days, Python)**

```bash
pip install llmlingua

# Usage: compress a long document before injecting into prompt
from llmlingua import PromptCompressor
compressor = PromptCompressor(model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank")
result = compressor.compress_prompt(long_dataflow_prose, rate=0.4)
# → removes ~60% of tokens by importance scoring
# → suitable for compressing long context docs before GRACE prompt injection
```

This DOES help with input: feed a 500-token English explanation of the dataflow into LLMLingua, get a 200-token compressed version, inject that into the GRACE prompt. The LLM that reads the compressed version does not know it was compressed.

**Option C — Hand-write dense symbolic notation (no library, works today)**

The GRACE DATAFLOW dense symbolic notation (`→`, `|`, `{}`) is handwritten by the prompt author:

```
ENGLISH PROSE (120 tokens):
  "Step 1: Call decode_header(raw_token) which returns {alg, kid}.
   Guard: if alg is not 'HS256' then raise AuthError with status 400.
   Step 2: Verify the HMAC-SHA256 signature..."

DENSE SYMBOLIC (40 tokens, handwritten):
  raw_token→decode_header→{alg,kid}|AuthError(400)
  →verify_hmac|AuthError(401)→claims
  →is_expired(now≥exp)|AuthError(401)→aud==aud|AuthError(401)→TokenClaims
```

This notation is just careful writing. The LLM reads it correctly because the symbols (`→`, `|`, `{}`) are in its training data as common code/math notation. No library needed to generate it; it is hand-authored once per GRACE prompt template.

**Summary — what to do now:**

```
For OUTPUT compression in sessions:      install caveman skill (Option A)
For INPUT compression of long docs:      integrate LLMLingua (Option B) — 1-2 days
For GRACE DATAFLOW sections:             hand-write dense symbolic (Option C) — today
For structured index/call graph data:    CTOP DSL already in infra-eco/ctop ✓
```

### 6.7 Combined GRACE Prompt: CTOP + Wenyan Together

```
NAÏVE GRACE PROMPT (English prose + JSON):
┌─────────────────────────────────────────────────────────────┐
│  [INDEX — JSON array]                    ~573 tokens         │
│  [{"name":"validate_token","file":"...","start":45,...}...] │
│                                                             │
│  [DATAFLOW — English prose]              ~120 tokens         │
│  "Step 1: Call decode_header(raw_token)                     │
│   which returns {alg, kid}. Guard: if alg is not 'HS256'    │
│   then raise AuthError with status code 400..."             │
│                                                             │
│  [CERTIFICATE — paragraph]               ~60 tokens          │
│  "I have verified that all six execution paths through      │
│   validate_token have been covered..."                      │
│  TOTAL: ~753 tokens                                         │
└─────────────────────────────────────────────────────────────┘

COMPRESSED GRACE PROMPT (CTOP + Wenyan):
┌─────────────────────────────────────────────────────────────┐
│  [INDEX — CTOP DSL table with calls]     ~356 tokens         │
│  sym(concept file start end calls)[                         │
│  validate_token auth/token_validator.py 45 81               │
│    [decode_header verify_hmac is_expired]                   │
│  ...]                                                       │
│                                                             │
│  [DATAFLOW — dense symbolic / Wenyan]    ~40 tokens          │
│  raw_token→decode_header→{alg,kid}|AuthError(400)           │
│  →verify_hmac|AuthError(401)→claims→is_expired(now≥exp)     │
│  |AuthError(401)→aud==aud|AuthError(401)→TokenClaims        │
│                                                             │
│  [CERTIFICATE — 1 line]                  ~8 tokens           │
│  ✓ 6/6 paths. No case skipped.                              │
│  TOTAL: ~404 tokens   (46% savings vs naïve)                │
└─────────────────────────────────────────────────────────────┘

Rule of thumb:
  Structured symbols  →  CTOP DSL  (saves 38-40% vs JSON)
  Prose logic         →  Wenyan/dense symbolic  (saves 40-87% vs English)
  Filler grammar      →  Eliminate entirely  (0% information loss)
```

---

## 7. Practical Integration Plan

### Phase 1: CTOP table for GRACE orientation section (no tooling change)

Add CTOP DSL table syntax to GRACE prompt templates when call edges are included. No codegraph-rust change needed — write the table by hand in the prompt template.

**Impact**: ~38% token savings on orientation sections that include call graph data.

### Phase 2: codegraph-rust CTOP output with call edges

Extend the `--emit-index-map` implementation (docs-rk1t) to optionally include call edges in CTOP DSL format:

```
codegraph --emit-index-ctop-calls   # writes .codegraph/index-calls.ctop (DSL text, with edges)
```

Format:
```
sym(concept file start end calls)[
auth.token-validation auth/token_validator.py 45 81 [decode_header verify_hmac is_expired]
...
]
```

This becomes the "prompt-facing" format. The TSV `index.map` remains the "grep-facing" format.

**Cost**: ~1 day Rust (build Call edges into existing codegraph-core types, serialize to CTOP DSL). Depends on docs-rk1t.

### Phase 3: Doxygen XML → CTOP transform for multi-language codebases

For codebases where Doxygen XML is already generated (C/C++/Java projects), a transform:

```
doxygen/xml/compound.xml → XSLT or doxmlparser → CTOP DSL table → GRACE prompt
```

This lets GRACE work with pre-existing Doxygen documentation without requiring codegraph-rust.

---

## 8. Summary Decision Table

| Use case | Format | Token cost vs JSON/XML |
|---|---|---|
| Agent grep nav (shell) | TSV (`index.map`) | Already optimal vs JSON |
| Prompt: flat symbol list | TSV or CTOP table | Equivalent (~93% of TSV) |
| Prompt: symbols + call edges | **CTOP DSL table** | 62% of JSON, TSV breaks |
| Prompt: full module hierarchy | **CTOP nested map** | ~72% of JSON |
| Full codebase orientation | Doxygen lazy-load | Not inline — subagent reads index.xml |
| GRACE DATAFLOW section | **Wenyan / dense symbolic** | ~40-65% of prose |
| Tool storage / fast load | CTOP binary | 40-60% of TSV text size |

---

## Follow-up Tasks

- docs-09ox (this task): CLOSED — research complete
- New: `codegraph-rust --emit-index-ctop-calls` — CTOP DSL with call edges (~1 day, depends on docs-rk1t)
- New: GRACE prompt template update — replace flat TSV orientation with CTOP table + calls
- New: Doxygen XML → CTOP transform spike (for C/C++/Java multi-language codebases)

---

## Sources

- CTOP compare_formats.rs: `/home/sash/ZomboCraftEco/infra-eco/ctop/examples/compare_formats.rs` — authoritative char counts, format side-by-side
- CTOP README: `/home/sash/ZomboCraftEco/infra-eco/ctop/README.md` — token comparison table
- GRACE 2.0 Doxygen research: `docs/research/grace-2-doxygen-grep-semantic-slicing.md` — index.xml lazy-load architecture, Oxygen XML context
- Wenyan/caveman: `docs/research/caveman-wenyan-context-compression.md` — 65% prose compression, arXiv:2604.00025
- Prior index format: `docs/research/codegraph-ctop-toon-index-format.md` — CTOP binary, DELTA_INT, dual-format storage
- Calculated: char counts for flat (20 symbols) and nested (20 symbols + 3 edges each) across all formats
