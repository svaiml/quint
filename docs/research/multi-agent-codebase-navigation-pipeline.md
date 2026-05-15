# Multi-Agent Codebase Navigation Pipeline

> **Context**: Why Claude Code has no vector search — and why that is correct. Code IS a RAG corpus; agent navigation strategy in large codebases differs fundamentally from small ones.
> **Question**: What is the professional multi-agent pipeline for large-codebase navigation, and how do codegraph/GRACE fit into it?
> **Last updated**: 2026-05-07
> **br task**: docs-xld8

---

## Short Answer

Coding agents in large applications **do not search their own context**. They receive pre-compiled context from dedicated context-collection sub-agents. Vector search and XML parsing are sub-agent tools, not Architect or Coder tools.

```
WRONG MENTAL MODEL                  CORRECT MENTAL MODEL
──────────────────────────          ──────────────────────────────────────
Coder reads whole codebase          Coder receives: target files + context
Architect uses vector search        Architect sees: root graph (<8k tokens)
Agent reads Doxygen XML             Sub-agent reads XML; packages for Architect
All agents equal complexity         Expensive model = clean context
                                    Cheap model = dirty context + tools
```

The 3-tier architecture solves the LLM attention problem: the expensive model (Architect)
gets full-attention budget filled with high-signal content only.
The cheap model (Haiku/Flash/Grok Code Fast) absorbs the navigation overhead.

---

## The Fundamental Premise: Code IS RAG

A codebase is a retrieval corpus. The agent's job is retrieval + synthesis, not
brute-force reading. The question "should I use vector search or graphs?" is secondary
to "which agent is doing the retrieval, and what do they need?"

Implications:
- Vector search, full-text grep, AST graphs, and XML indexes are **retrieval tools**
- Their quality is secondary to the **navigation logic** — what to look for and why
- LLMs distrust documentation and trust code → they will always verify against source
- Small codebase: one agent reads everything; no sub-agents needed; complexity not justified
- Large codebase: sub-agent architecture mandatory; the navigation problem outgrows one context

---

## The 3-Tier Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1: ARCHITECT (expensive LLM — Opus/GPT-4)                │
│                                                                  │
│  Clean context: no system prompts, no tools, no agent noise      │
│  Full Attention zone: ~4-8k tokens (root graph + key modules)   │
│  Input: context packet prepared by sub-agent                     │
│  Output: architectural decisions, target files, HOW instructions │
│  Does NOT search. Does NOT read XML/Doxygen directly.           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ context packet
┌──────────────────────▼──────────────────────────────────────────┐
│  TIER 1.5: CONTEXT COLLECTOR (cheap LLM — Haiku/Flash/Grok)    │
│                                                                  │
│  Dirty context: has tools, system prompts, navigation state      │
│  Navigation chain:                                               │
│    1. Root graph (compact overview, orientation)                 │
│    2. Doxygen XML / index.map (structural details)               │
│    3. grep target files (code truth check)                       │
│    4. Assemble context packet for Architect                      │
│  Purpose: absorb all navigation cost so Architect stays clean   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ task + context
┌──────────────────────▼──────────────────────────────────────────┐
│  TIER 2: CODER (mid-range LLM — Sonnet/Coder models)            │
│                                                                  │
│  Receives: target files + implementation instructions            │
│  Does NOT search. Files already identified by Architect.         │
│  Focuses exclusively on implementation within given scope        │
│  Sends output to: Tester or back to Architect for review         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│  TIER 2: TESTER (mid-range LLM, log-aware)                      │
│                                                                  │
│  Works from: logs (linked to class/method via log tokens)        │
│  Navigation: log reference → target code (no graph needed)       │
│  Also checks: DB schemas, config files                           │
│  Output: bug report with target files identified for Coder      │
│  Rarely uses graphs; log linkage is sufficient                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Attention Window Constraint (Why <8k for Architect)

The "Lost in the Middle" phenomenon (Liu et al., arXiv:2307.03172, TACL 2024)
established that LLMs exhibit a **U-shaped attention curve**:

```
Performance
    ▲
    │▌                                                      ▌
    │▌                                                     ▌▌
    │▌▌                                                   ▌▌▌
    │▌▌▌▌                                             ▌▌▌▌▌▌
    │▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌
    └────────────────────────────────────────────────────►
       START                                             END
              (information in middle = degraded recall)
```

Key measurement: **30%+ accuracy drop** when answer document moves from position 1 to
position 10 in a 20-document context. Mechanism: RoPE decay — earlier tokens accumulate
more attention weight because they are visible to every subsequent token.

**Practical consequence for Architect**:
- Root graph MUST appear at the very beginning of context (token 0)
- Root graph MUST be compact enough to stay in the high-attention zone
- Rule of thumb: ≤8k tokens before sparse attention effects dominate
- Classic mistake: 50k-token graph dump → most of it is in the degraded middle zone

The first 4-8k tokens give the model its "maximum IQ" — full attention with no dilution.
Giving this budget to system prompts, tool definitions, and navigation scaffolding
(as a solo-agent setup does) wastes the most valuable attention real estate.

---

## Context Collector Navigation Chain

```
Context Collector Sub-Agent
  │
  ├─[Step 1]─ Root graph (compact overview)
  │             codegraph index.map compact summary
  │             OR hand-authored root.mermaid
  │             Budget: 500-1500 tokens (orientation only)
  │
  ├─[Step 2]─ Structural details (if needed)
  │             grep .codegraph/index.map "target.concept"
  │             OR Doxygen XML compound files for key modules
  │             Budget: 1000-3000 tokens (selective, not full XML)
  │
  ├─[Step 3]─ Code truth check (always)
  │             Read actual source files for identified targets
  │             LLM training bias: NEVER trust docs, always verify code
  │             Budget: 2000-5000 tokens (4-5 modules max)
  │
  └─[Step 4]─ Assemble context packet
                Root graph + key module code (no XML/docs)
                Total ≤ 7500 tokens (leaves headroom for task)
                Delivers: target files list + architectural context
```

Note: **Doxygen XML is sub-agent food, not Architect food.** The XML is useful
for the context collector because it gives stable semantic structure for navigation.
The Architect never sees the XML — it sees the distilled code extracted from it.

---

## Why Vector Search Is Wrong for Coding Agents

```
VECTOR SEARCH ASSUMPTION           WHY IT FAILS IN LARGE APPS
──────────────────────────────     ────────────────────────────────────────
"Agent needs to find code"         Coder/Architect don't search — sub-agent does
"Semantic similarity = relevance"  Code relevance is structural (call graph),
                                   not semantic (name similarity)
"Embed codebase, search at need"   Embedding is expensive; call graph grep is O(1)
"Handles ambiguous queries"        Agents don't issue ambiguous queries;
                                   they grep specific concept labels
"Better than grep for code"        GrapRAG study: agents prefer ripgrep 87% of time
                                   regardless of available tools
```

Structural navigation (grep concept label → find file+line) beats semantic search
because code relationships are explicit, not latent. The call graph is the "semantic
similarity" of code — and it's already computed by tree-sitter.

**For small codebases**: vector search overhead not justified; one agent reads all.
**For large codebases**: sub-agent uses structural navigation, not vector search.

Vector search has one valid use case: **fuzzy discovery** in unfamiliar codebases
with no existing codegraph/index.map. Even then, it is sub-agent-only work.

---

## GRACE 2.0 Middle Mode: GREP as SQL

Between "single agent reads everything" (small codebase) and
"full 3-tier with dedicated sub-agents" (large codebase), GRACE 2.0 provides
a middle mode: the main agent does semantic slices via GREP.

```
Code as SQL database analogy:

  SELECT * FROM index.map WHERE concept = "auth.token-validation"
  ≡
  grep "auth.token-validation" .codegraph/index.map

  SELECT file, start, end FROM index.map WHERE concept LIKE "auth.%"
  ≡
  grep "auth\." .codegraph/index.map

  SELECT * FROM index.map WHERE symbol = "validate_token"
  ≡
  grep "validate_token" .codegraph/index.map
```

This gives the main agent "semantic slice" capability across hundreds of modules
with a single grep operation. Cost: ~150 tokens per query (index.map results are short).
The main agent doesn't read 1000 files; it queries the index and reads only the 37
lines it identified.

With this mechanism:
- **Root graph**: still valuable for Architect orientation
- **index.map**: primary navigation tool for main agent in middle mode
- **Full XML/Doxygen**: needed only by context collector in 3-tier mode
- **Graphs in general**: less critical for Coder; root graph remains critical for Architect

---

## Agent-to-Tool Assignment Matrix

| Tool | Architect | Coder | Tester | Context Collector |
|---|---|---|---|---|
| Root graph (<8k tokens) | ✓ PRIMARY | — | — | produces it |
| index.map grep | — | ✓ GRACE middle mode | — | ✓ step 2 |
| Doxygen XML | — | — | — | ✓ step 2 (selective) |
| Source file read | — | ✓ given files | ✓ from log refs | ✓ step 3 |
| Vector search | — | — | — | ~ (unfamiliar codebase only) |
| Log navigation | — | — | ✓ PRIMARY | — |
| DB/config read | — | — | ✓ | — |
| Full-text grep | — | — | — | ✓ fallback |

---

## Why LLMs Trust Code, Not Docs (Training Bias)

Both papers from the documentation effectiveness study (arXiv:2601.16661 and 2601.23059)
confirm empirically what was already observable: LLMs systematically prefer code over
documentation and will verify documentation claims against code.

This is not a bug — it is correct behavior trained into models:
- Stale docs actively harm performance (Paper 2: -90% worst case)
- Code is ground truth; docs drift from code without detection
- Therefore: any retrieval pipeline that relies on docs as authoritative = fragile

**Design constraint this imposes**:
```
CONTEXT COLLECTOR MUST:
  1. Use docs/graphs for NAVIGATION ONLY (finding target files)
  2. Always finish by reading actual source code
  3. Never pass docs as context without the code they describe
  4. Root graph = structural orientation, not authoritative truth
```

This is why Doxygen XML is a navigation aid (for context collector step 2),
not a knowledge source. The Architect receives code — the context collector
just used Doxygen to find which code to include.

---

## Mapping to ZomboCraftEco

```
PIPELINE COMPONENT          ZOMBOCRAFTECO ASSET
─────────────────────────   ────────────────────────────────────────
Root graph                  codegraph-rust compact output
                            (planned: --emit-root-graph flag)
Index map                   .codegraph/index.map TSV (built: docs-rk1t)
Context collector agent     Claude Haiku + index.map + GRACE middle mode
Structural navigation       codegraph-rust tree-sitter AST
GREP semantic slices        GRACE 2.0 embedded concept tags (existing)
                            OR index.map greps (hybrid approach)
Doxygen XML (optional)      GRACE 2.0 Doxygen integration (pre-release)
Rule violation diagnostics  Semantic LSP Compiler (planned: docs-vs8v)
Tester log navigation       infer-lsp watch mode + log linkage (future)
Architect context budget    ≤8k tokens → root graph constraint (design rule)
```

---

## Design Rules Derived

1. **Root graph budget**: ≤8k tokens total. No exceptions. Graph is orientation,
   not encyclopaedia. Cut ruthlessly: top-level modules + major callsites only.

2. **Architect context formula**: root_graph + 4-5 module source files + task.
   No XML, no docs, no tool definitions in Architect context.

3. **Sub-agent tool allocation**: context collector absorbs all dirty tools
   (XML parsers, graph navigators, grep loops). Architect sees output only.

4. **Code-last rule**: context collector always finishes with source file read.
   Docs and graphs navigate; code confirms. Never reverse this order.

5. **GRACE middle mode trigger**: use when codebase is 50-500 modules.
   Below 50: single agent reads all. Above 500: full 3-tier with sub-agent.

6. **Log linkage for Tester**: embed `module.ClassName.method_name` tokens
   in all log messages. Tester extracts these and jumps to code directly.
   Zero graph navigation needed for bug-fix workflows.

7. **Cheap model = dirty context**: Haiku/Flash absorbs navigation overhead.
   Cost savings are 5-10× vs running Architect for context collection.

---

## Follow-up Tasks

- docs-root: add `--emit-root-graph` compact mode to codegraph-rust (~500 token budget)
- docs-cctx: design context collector sub-agent prompt for GRACE 2.0 pipeline
- docs-logp: log linkage specification (token format for class/method in log messages)

---

## Sources

- [Lost in the Middle: How Language Models Use Long Contexts (arXiv:2307.03172)](https://arxiv.org/abs/2307.03172) — 30%+ accuracy drop; U-shaped attention; primacy/recency bias
- [Lost in the Middle: Emergent Property from IR Demands (arXiv:2510.10276)](https://arxiv.org/html/2510.10276v1) — mechanism explanation via RoPE decay
- [Agentic Coding Revolution: Multi-Agent AI Teams 2026](https://aiautomationglobal.com/blog/agentic-coding-revolution-multi-agent-teams-2026)
- [AI Coding Agents: Coherence Through Orchestration (Jan 2026)](https://mikemason.ca/writing/ai-coding-agents-jan-2026/)
- GrepRAG study: arXiv:2601.23254 — 87% agent preference for ripgrep regardless of available tools
- [Sparser is Faster (arXiv:2406.16747)](https://arxiv.org/html/2406.16747v1) — sparse attention mechanics
- arXiv:2601.16661 — code docs; stale docs toxic; inline proximity required
- arXiv:2601.23059 — code docs; buggy-code comments actively harmful
