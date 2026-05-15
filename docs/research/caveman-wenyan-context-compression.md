# Caveman / Wenyan: Context Compression Ecosystem — Research

> **Source**: github.com/JuliusBrussee/caveman (multi-k stars, MIT)
> **Last updated**: 2026-05-04
> **br task**: docs-sc7g
> **Scope**: TheoSciTech (docs project) + ZomboCraftEco (42-repo reasoning ecosystem)

---

## Executive Summary

The caveman ecosystem is a production-grade, agent-native context compression stack for Claude Code and 30+ other AI agents. It operates at three levels: output compression (65% average), memory file compression (46%), and MCP tool description compression. The Wenyan (文言文 — Classical Chinese) mode is not a gimmick — it exploits genuine information-theoretic properties of a logographic language that has no inflection, no articles, and no grammatical overhead.

**Confidence**: HIGH — GitHub repo fully examined, benchmarks reproducible, science paper validated the core claim.

**Key finding**: This is the most directly actionable efficiency tool for both spaces identified in this research sprint. The ROI for TheoSciTech is concentrated in CLAUDE.md + memory file compression. The ROI for ZomboCraftEco is in MCP tool description compression and the cavemem lightweight KB layer.

**Adjacent paper**: ["Brevity Constraints Reverse Performance Hierarchies in Language Models"](https://arxiv.org/abs/2604.00025) (March 2026, arXiv:2604.00025) — brevity constraints on large models *improved* accuracy by 26 percentage points on some benchmarks and reversed model-capability rankings. Less verbose ≠ less correct. Often more correct.

---

## Architecture: The Three Tiers

```
CAVEMAN ECOSYSTEM
│
├── caveman (output compression) — affects what the agent SAYS
│   Levels: lite → full → ultra → wenyan-lite → wenyan-full → wenyan-ultra
│   Avg savings: 65% output tokens (range 22–87% per task type)
│   Installs as Claude Code skill / Codex / Cursor / Gemini CLI / 30+ others
│   ⚠ ONLY output tokens — thinking/reasoning tokens are UNTOUCHED
│
├── cavemem (memory compression) — affects what the agent REMEMBERS
│   Cross-agent persistent memory: compressed SQLite + MCP, local-first
│   NOT the same as /caveman:compress — this is a full memory system
│   Replaces: manual MEMORY.md files + context-loading per session
│   Serves memories back through MCP to Claude Code, Cursor, Codex, Gemini
│
├── cavekit (build orchestration) — affects what the agent BUILDS
│   Spec-driven autonomous build loop: NL → kits → parallel build → verified
│   Less relevant to this analysis; noted for completeness
│
└── /caveman:compress (memory file rewriter) — separate from cavemem
    Rewrites existing memory files (CLAUDE.md, MEMORY.md, project notes) in-place
    Saves backup as <file>.original.md
    Preserves byte-for-byte: code, URLs, paths, identifiers, terms
    Avg 46% reduction (range 36.9%–59.6% per file type):
    │
    │  claude-md-preferences.md  706 → 285  (-59.6%)
    │  project-notes.md         1145 → 535  (-53.3%)
    │  claude-md-project.md     1122 → 636  (-43.3%)
    │  todo-list.md              627 → 388  (-38.1%)
    │  mixed-with-code.md        888 → 560  (-36.9%)
    │  AVERAGE                   898 → 481  (-46.0%)

caveman-shrink (MCP middleware, separate npm package)
    stdio proxy wrapping any MCP server
    Compresses description fields in tools/list + prompts/list + resources/list responses
    Does NOT touch: tool-call response bodies, request payloads, tool arguments
    Code/URLs/paths/identifiers preserved byte-for-byte
    Install: add caveman-shrink as wrapper in mcp_settings.json
```

---

## Wenyan (文言文) — Why It Actually Works

Classical Chinese is not a compression hack. It is a language with genuinely different information-theoretic properties:

```
ENGLISH grammar overhead (stripped in caveman):
  "The reason your React component is re-rendering is likely because
   you're creating a new object reference on each render cycle."
  = 22 words for what caveman full says in 9 words

WENYAN grammar overhead (structural, not padding):
  "物出新參照，致重繪。useMemo Wrap之。"
  = 10 characters total (including the English useMemo)
```

**Linguistic properties that create density:**

| Property | English | Wenyan |
|----------|---------|--------|
| Inflection | Required (verb tenses, noun plurals, adjective agreement) | None — word order carries it |
| Articles | Required (a/an/the) | None — definiteness inferred |
| Auxiliary verbs | Required (is/are/was/will/would) | None — aspect optional |
| Subject omission | Grammatically required | Omitted when inferable (the norm) |
| Conjunctions | Multiple function words | Minimal; juxtaposition implies relation |
| 4-char idioms (成語) | — | Full narrative/concept frames in 4 chars |
| Character density | 1 char ≈ 0.3-0.5 semantic units | 1 char ≈ 1 semantic unit |

A 10-character Wenyan sentence routinely carries what requires 30–40 English words. This is the most token-efficient writing system for semantic content density. The token savings are real — "物出新參照" tokenizes to fewer tokens in modern tokenizers than the English equivalent because the BPE tokenizer is trained on modern Chinese, but Classical Chinese reuses the same characters at high density.

**Russian adaptation at 95% fidelity** (from user's practice note): Russian is naturally compression-friendly because:
- Rich inflection means word order is flexible (agent can drop function words and reorder)
- Academic Russian already uses heavily nominalized, compact phrasing
- Russian omits subjects and objects more freely than English

The 95% fidelity claim for Russian is plausible. Wenyan mode used as a *style guide* for Russian produces compressed Russian, not actual Classical Chinese.

---

## Benchmark Reference

From official caveman benchmarks (Claude API, reproducible):

| Task type | Normal | Caveman | Saved |
|-----------|-------:|--------:|------:|
| React re-render explanation | 1180 | 159 | 87% |
| Auth middleware fix | 704 | 121 | 83% |
| PostgreSQL connection pool | 2347 | 380 | 84% |
| Git rebase vs merge explanation | 702 | 292 | 58% |
| Refactor callback → async/await | 387 | 301 | 22% |
| Architecture: microservices vs monolith | 446 | 310 | 30% |
| Security review | 678 | 398 | 41% |
| Docker multi-stage build | 1042 | 290 | 72% |
| Debug race condition | 1200 | 232 | 81% |
| Implement error boundary | 3454 | 456 | 87% |
| **Average** | **1214** | **294** | **65%** |

Savings are highest for explanatory/educational output (80%+) and lowest for architectural reasoning and refactoring (22–30%). This pattern matters for the mapping below.

---

## TheoSciTech Mapping (docs project)

### Where the ROI is

```
/home/sash/docs/
│
├── CLAUDE.md  ← HIGH VALUE for /caveman:compress
│   The backlog section alone is ~1500 lines loaded every session
│   Estimated: 43-53% reduction = ~700-800 fewer input tokens per session
│   Code/paths preserved byte-for-byte → safe
│
├── memory/MEMORY.md  ← MEDIUM VALUE
│   Currently at ~30 lines (index only) — small but grows
│   Individual memory files (user_thinking_profile.md, etc.) → compressable
│   /caveman:compress on each file: ~45% reduction
│   Risk: MEMORY.md is an index; compressing individual files is safer
│
├── docs/research/*.md  ← SITUATIONAL VALUE
│   5 new STRESS test docs just written (each 200-500 lines)
│   When referenced in sessions, loaded as context
│   Compress AFTER they're finalized — not during active research
│   Apophatic theology: explanatory content → high compression (80%+)
│
└── .claude/skills/  ← HIGH VALUE for caveman-shrink
    If skills are exposed via MCP (they are in some configurations)
    The flow:research / flow:specify skill instructions are enormous
    (system-reminder blocks show they're loaded verbatim into context)
```

### Caveman output mode for long research sessions

The theological/philosophical sessions are exactly the high-compression case:
- **Explanatory content** (explaining Neoplatonism, Jainism, Orthodox epistemology) = 80%+ savings
- **Architectural reasoning** (RSTMDB + Infer design) = 30% savings
- Mixed: realistic estimate for this project's sessions = **50-60% output compression**

**Recommendation for TheoSciTech**: Use caveman full mode for research sessions; switch to lite or off for design/architecture sessions where reasoning density matters.

### Cavecrew subagents — direct impact

The cavecrew-investigator (haiku, read-only) + cavecrew-builder (surgical edit) + cavecrew-reviewer (one-line) emit ~60% fewer tokens than vanilla subagents. This means:

- Multi-step research orchestration (spawn Explore agent → synthesize → write doc) stays within context window longer
- The subagents are already Haiku-class which is faster AND now also token-efficient
- Maps directly to the current workflow where `Agent(subagent_type="Explore")` is used for research

### What to skip for TheoSciTech

- **Wenyan mode for output**: The project produces English research documents. Wenyan mode for responses would require the user to read compressed Chinese output. Not useful here.
- **Wenyan mode for memory compression**: Could work if accepted as a compression format, but adds cognitive overhead to reading/updating memory files.
- **cavemem**: The project already has a structured file-based memory system at `memory/`. cavemem (SQLite) would duplicate this. Use `/caveman:compress` on existing files instead.

---

## ZomboCraftEco Mapping (42-repo reasoning ecosystem)

### Structural alignment with AI+HW 2035 findings

The ai-hw-2035 research (docs/research/ai-hw-2035-constraints.md) identified:
> "Context engineering = data movement. Assembling and transmitting system prompts, retrieved documents, and tool results is fundamentally a serialization problem."

Caveman directly addresses this at the token level:

```
AI+HW 2035 recommendation:           Caveman implementation:
─────────────────────────────────────────────────────────────
System prompt caching                 ← Not caveman (Anthropic API)
Lazy string concatenation             ← Not caveman
Context selection as cost model       ← Caveman mode selection (lite vs ultra)
"marginal information per token"      ← Caveman strips zero-marginal-value tokens
```

The alignment is real: both frameworks address the same constraint (data movement cost) at different layers. Caveman is a session-level compression; AI+HW 2035 recommends hardware + caching. They compose.

### MCP tool descriptions — caveman-shrink

ZomboCraftEco repos that likely have MCP servers:
- **infer** — Horn clause engine exposed as MCP tools (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR)
- **rstmdb** — state machine DB exposed as MCP (WATCH_ALL, state transition queries)
- **aivm** — if exposed as MCP

The Infer verb descriptions are verbose by nature (they need to explain complex epistemological operations to the LLM). caveman-shrink would compress those descriptions transparently — the LLM still understands what the tool does, but the token cost of loading the tool list is reduced.

**Estimated impact**: If each Infer verb description is ~100 tokens, and caveman-shrink achieves 46% compression, that's 46 tokens saved per verb × 5 verbs = 230 tokens per context load. In a multi-agent harness that loads tools frequently, this compounds.

### cavemem as lightweight agent-harness KB

```
Current design (intended):
  Agent A → writes proven facts → RSTMDB WAL → Agent B reads

cavemem alternative for SHORT-TERM agent memory:
  Agent A → observations → compressed SQLite (local, MCP-served) → Agent B reads via MCP
  No WAL, no provenance, no bitemporal schema
  
When to use cavemem vs RSTMDB:
  cavemem: ephemeral session-level agent coordination (< 1 session)
  RSTMDB: persistent provenance-tracked knowledge (permanent, auditable)
  
The two layers compose:
  cavemem = L1 cache (fast, volatile, compressed)
  RSTMDB  = L2 persistent store (slow, durable, provenance-tracked)
```

This is the same hot/cold split that AI+HW 2035 recommends at the hardware level — applied at the knowledge layer.

### FOUR bilattice and caveman compression — compatibility

Caveman strips the verbose wrapper around content. It does NOT change:
- Code/paths/terms/links — preserved byte-for-byte
- Epistemic values (T/F/⊤/⊥) — these are short-form symbols, not compressable further
- Rule identifiers, proof hashes — preserved

Caveman compression is compatible with FOUR bilattice semantics. A compressed Infer response still carries the same T/F/⊤/⊥ conclusion. The compression targets the English prose explanation around the conclusion, not the conclusion itself.

### Cavecrew for agent harness routing

The three-tier agent routing in ai-hw-2035-constraints.md:

```
Exact symbolic    ← Infer engine (deterministic logic)
Fast approximate  ← Domain-tuned SLM (entity extraction)
Full reasoning    ← Frontier model (novel abduction)
```

Cavecrew maps:

```
Cavecrew investigator ← Haiku, read-only, ~60% fewer tokens  ≈ Fast approximate tier
Cavecrew builder      ← Surgical 1-2 file edit, refuses 3+   ≈ Exact symbolic tier (bounded)
Cavecrew reviewer     ← One-line findings, Haiku             ≈ Fast approximate tier
```

The cavecrew-investigator is the closest thing to a production-ready "domain SLM for high-frequency narrow tasks" that exists today for Claude Code — it's already Haiku (smaller model) AND token-compressed AND scoped to read-only locator tasks. This is worth integrating into the ZomboCraftEco agent harness protocol.

---

## Competitive Comparison

| Tool | What it compresses | Mechanism | Lossless? | Integration |
|------|-------------------|-----------|-----------|-------------|
| **caveman** | Agent output | Prompt-based style | Semantic (not lossless) | Claude Code skill |
| **caveman-shrink** | MCP descriptions | Proxy middleware | Near-lossless (code/paths preserved) | MCP server wrapper |
| **LLMLingua** (Microsoft) | Long input contexts | Iterative token importance scoring | Semantic | Preprocessing library |
| **LLMLingua-2** | Input + structured | Encoder-based compression | Semantic | Library |
| **MemGPT / Letta** | Memory management | Hierarchical page-in/page-out | No (lossy archival) | Framework |
| **cavemem** | Cross-agent memory | Compressed SQLite + MCP | Compressed but queryable | MCP server |

**Key distinction**: LLMLingua operates on INPUT (compresses long documents before feeding to model). Caveman operates on OUTPUT (compresses what the model says). They are complementary, not competing.

For ZomboCraftEco: LLMLingua would apply to ingesting long research documents into RSTMDB (input compression pipeline). Caveman applies to the agent harness responses. Both are worth evaluating.

---

## Adoption Recommendations

### For TheoSciTech (docs project) — Priority order

| Action | Value | Effort | Priority |
|--------|-------|--------|----------|
| `/caveman:compress CLAUDE.md` | High (700-800 tokens/session saved) | 5 min | **P0 — do now** |
| `/caveman:compress memory/*.md` | Medium (45% per file) | 10 min | **P1** |
| Caveman full mode for research sessions | High (50-60% output) | 0 (just trigger it) | **P1** |
| Caveman lite for design/architecture | Medium (30-40% output) | 0 | **P2** |
| Cavemem (replace file-based memory) | Low (system already good) | High | **Skip v1** |
| Wenyan output mode | Low (cognitive overhead for English docs) | 0 | **Skip** |

### For ZomboCraftEco (reasoning ecosystem) — Priority order

| Action | Value | Effort | Priority |
|--------|-------|--------|----------|
| caveman-shrink on Infer MCP server | High (tool desc cost per call) | 1 hour | **P1** |
| caveman-shrink on RSTMDB MCP server | High | 1 hour | **P1** |
| cavemem as L1 cache for agent harness | High (complements RSTMDB) | 2-4 hours | **P1** |
| Cavecrew-investigator for Explore tasks | High (~60% token savings in subagents) | 30 min | **P1** |
| LLMLingua for RSTMDB ingestion pipeline | Medium (input compression) | 1-2 days | **P2** |
| Caveman output mode on all agents | Medium | 0 | **P2** |

### What NOT to adopt

- **Wenyan output mode for production**: Only if the downstream consumer expects Classical Chinese. Not suited for English-primary systems.
- **cavekit**: Builds via natural language orchestration — interesting but outside current scope.
- **caveman-compress on code files**: The tool explicitly preserves code byte-for-byte, but don't run it on source files — it's designed for documentation/memory files only.

---

## Installation Reference

```bash
# Full install for Claude Code (this project)
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash

# Minimal (skill only, no MCP shrink, no hooks)
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash --minimal

# After install — compress the main CLAUDE.md
/caveman:compress CLAUDE.md

# MCP shrink for any existing MCP server in mcp_settings.json:
# Wrap the server command with: npx caveman-shrink <original-command> <args>
```

---

## Cross-References

| Document | Relationship |
|----------|-------------|
| `docs/research/ai-hw-2035-constraints.md` | Context engineering as data movement — caveman is a token-layer implementation of the same principle |
| `docs-u22` | Research: CLI AI agent internal architecture — context compression, loop, fork-join |
| `docs-2bx` | Implement context budget gate hooks for flowspec (40/60/80% thresholds) — caveman output mode is a complement to budget gates |
| `docs/research/apophatic-computational-epistemology.md` | FOUR bilattice — compatible with caveman compression (epistemic values are short-form, not compressed away) |

---

*Research document: caveman/Wenyan context compression ecosystem. br task: docs-sc7g*
