# GRACE 2.0: Doxygen AI Documentation + GREP Semantic Slicing

> **Context**: GRACE 2.0 pre-release analysis — what's new vs prior GRACE research
> **Question**: What do Doxygen XML output and GREP-tag slicing add to AI agent code navigation?
> **Last updated**: 2026-05-06
> **br task**: docs-3mwu

---

## 1. Short Answer (What's Genuinely New)

GRACE 2.0 introduces three additions that are not in prior research:

1. **Doxygen as AI documentation engine** — Replace Python docstrings with Doxygen `@`-tag style to produce machine-navigable XML. The XML format (index.xml + per-compound files + schema validation) gives agents a structured code graph instead of hoping the LLM doesn't hallucinate from a JSON blob. 50k LOC/min incremental processing. Call graphs (CALL_GRAPH / CALLER_GRAPH) included.

2. **GREP-tag semantic slicing** — The "zombie mode" observation: empirically, AI agents (Gemini, DeepSeek, Claude, GLM) default to grep-based navigation regardless of what other retrieval is available. GRACE 2.0 exploits this by embedding searchable semantic tags into code so that when an agent grepping across 1000 modules hits the tag, it lands on the right semantic unit without reading any documentation. The tag IS the navigation contract.

3. **Lightning attention anchor prompts for Chinese models** — DeepSeek V4 and GLM-5 both adopted Compressed Sparse Attention (CSA) with FP8/FP4 Lightning Indexers. The Indexer runs a fast pre-scoring pass to select which tokens become "anchors" before full attention. GRACE 2.0 adapts prompt structure for this: key semantic claims must appear early in the prompt sequence to survive the Indexer's top-k cut and become attention anchors. The Wenyan "5x compression" claim belongs here as a token-density argument for Chinese-script prompts on these models.

**Confidence**: MEDIUM. Ivanov's specific GRACE 2.0 pre-release announcement is not yet findable as a published document or marketplace listing. The underlying technology claims (Doxygen XML structure, DSA Lightning Indexer, grep-as-default-agent-behavior) are independently confirmed by multiple sources. The synthesis here treats the announced features at face value and validates each against primary sources.

---

## 2. What's Already Documented (Prior Research — Don't Repeat)

| Topic | Prior Document | What's Covered |
|-------|---------------|----------------|
| GRACE as L1→L2 technique, dataflow-before-code | `semantic-vm-grace-deepseek-dsa.md` | Full analysis of GRACE dataflow planning, DeepSeek V3.2, GRPO, DSA architecture |
| GRACE absorbed into Gemini training | `semantic-vm-grace-deepseek-dsa.md` | Noted as confirmed |
| DeepSeek DSA / Lightning Indexer (V3.2) | `semantic-vm-grace-deepseek-dsa.md` | Two-stage indexer → top-k sparse attention. DSA implication: front-load structure |
| FPF vs GRACE comparison | `fpf-haft-vs-grace-semantic-vm.md` | FPF is schema-level L2; GRACE is prose-level L1→L2. Pipeline: GRACE → FPF → Infer |
| Wenyan prompting (caveman ecosystem, 65% compression, Classical Chinese) | `caveman-wenyan-context-compression.md` | Linguistic analysis, benchmark table, ZomboCraftEco mapping |
| GRACE-to-FPF bridge prompt (proposed) | `fpf-haft-vs-grace-semantic-vm.md` | Unbuilt spike; bridge that produces FPF JSON from GRACE dataflow |

This document covers only the GRACE 2.0 delta: Doxygen, GREP-tags, and the V4/GLM-5 attention updates.

---

## 3. Doxygen for AI Agents — XML Structure and Comparison

### What Doxygen XML Produces

Doxygen with `GENERATE_XML = YES` produces a structured dump of all documentation gathered from source code:

```
output/xml/
├── index.xml              ← master index of all compounds
├── index.xsd              ← schema for index.xml
├── compound.xsd           ← schema for all compound files
├── combine.xslt           ← merge all compounds into one document
├── classMyClass.xml       ← one file per class/namespace/file/struct
├── filemy__module_8py.xml ← one file per documented source file
└── ...
```

Each compound file contains:
- All member functions with parameter types, return types, documentation
- Inheritance graph (base/derived classes)
- Call graph data (if `CALL_GRAPH = YES`, `CALLER_GRAPH = YES`)
- Cross-references between compounds
- Brief + detailed description sections

The `doxmlparser` library in `addon/doxmlparser` supports incremental loading: read `index.xml` first, then lazily load only the compound files the agent navigates to. This is the architectural property that makes it agent-friendly — the agent gets a map first, then navigates selectively. This avoids the "load everything into one giant JSON blob" failure mode.

### Call Graph Support

Two config flags:
- `CALL_GRAPH = YES` — generates "functions called by this function" diagrams
- `CALLER_GRAPH = YES` — generates "functions that call this function" diagrams

These are the structural relationships that vector embeddings fail to represent reliably (confirmed by MindStudio analysis: "Code has explicit structural relationships — imports, function calls, type definitions — that vector embeddings don't capture reliably"). Call graphs give an agent exact dependency edges, not semantic similarity approximations.

### Python + Doxygen

Python is supported natively since Doxygen 1.x (current: 1.17.0, April 30, 2026). The bridge is `doxypypy` — a filter that converts Pythonic docstrings (Google/NumPy style) into Doxygen `@`-tag format. Without doxypypy, you use Doxygen `@`-tag style directly in Python docstrings. The `EXTRACT_ALL = YES` config option forces Doxygen to process ALL entities even without documentation — critical for large codebases where docs are incomplete.

### Comparison Table: Documentation Systems for AI Agent Consumption

| System | Output Format | Call Graphs | Incremental | AI-navigable Index | Python Support | Cross-language |
|--------|--------------|-------------|-------------|-------------------|----------------|----------------|
| **Doxygen + GENERATE_XML** | Structured XML + schema | Yes (CALL_GRAPH, CALLER_GRAPH) | Yes (doxmlparser lazy load) | Yes (index.xml → compound.xml) | Yes (doxypypy) | Yes (C/C++/Java/Python/Rust/…) |
| **Python docstrings** | None (prose strings in source) | No | N/A | No | Yes (native) | No |
| **Sphinx (rst/autodoc)** | HTML/PDF/JSON | No (plugin needed) | No | Partial (search index) | Yes (primary) | Limited |
| **JSDoc** | HTML/JSON | No | No | Partial | No | JS/TS only |
| **rustdoc** | HTML/JSON | Partial (via cargo-doc) | No | Partial | No | Rust only |
| **DocFX** | YAML/JSON/HTML | No | Partial | Partial | Limited | .NET/JS |
| **grepai** | Vector index | Yes (grepai trace) | Yes (file watcher) | Via semantic search | Yes | Yes |

**Doxygen's unique advantage for AI agents**: It is the only system that produces a validated, schema-backed XML structure with a lazy-loadable index AND call graph edges across multiple languages simultaneously. For a codebase spanning Python + Rust + C (e.g., a Python agent harness calling Rust FFI calling a C library), Doxygen is the only single tool that maps all three layers.

**The 50k LOC/min claim** (from Ivanov's announcement) is plausible. Doxygen's incremental mode re-parses only changed files. For a 1M LOC codebase with a 5% daily change rate (50k LOC changed), one incremental run processes only the delta.

### What This Replaces in AI Agent Workflows

Without Doxygen XML: An agent navigating a large codebase either (a) reads files directly (slow, context-consuming) or (b) is given a hand-crafted JSON blob describing the codebase structure (maintenance-heavy, hallucination-prone when stale).

With Doxygen XML: The agent can:
1. Read `index.xml` to get the full compound list (O(1) map load)
2. Navigate to `classMyClass.xml` for the specific class
3. Follow call graph edges to traverse dependencies
4. All structure is schema-validated — no hallucinated APIs

This is analogous to what FPF card formalization does for knowledge claims: it makes the structure machine-queryable rather than prose-navigated.

---

## 4. GREP-Tag Semantic Slicing — Zombie Mode Theory

### The Zombie Mode Observation

Ivanov's claim: AI agents operate in "zombie mode" — they default to grep-based navigation because their learned trajectories are stable on grep. This is not a derogatory term; it is a description of observed behavior.

This claim is independently confirmed by multiple sources in 2025-2026:

**GrepRAG paper (arXiv:2601.23254)**: Empirically studied 45,615 LLM-generated ripgrep commands for code completion. Found that:
- 41.47% of commands target method names
- 35.96% target class names
- 18.37% target variable names
- Only 4.20% use other patterns

The paper's key finding: "Naive GrepRAG achieves competitive performance with sophisticated graph-based methods" — meaning grep alone, without vector search, gives agents most of what they need. Agents gravitate to grep not because they're instructed to but because it works well enough that the behavior becomes a stable trajectory.

**MindStudio analysis ("Is RAG Dead?")**: Documents that Claude Code, Cursor, and Devin use grep, file tree inspection, and selective file reading as primary navigation — not vector databases. Copilot added semantic search only as a supplement for when exact-match fails. "No match = no match" transparency makes grep safer than vector retrieval for code.

**Trajectory observation from the GRACE announcement**: Ivanov claims to have studied actual trajectory patterns for Gemini, DeepSeek, Claude, and GLM. The common behavior is: (1) file tree scan, (2) grep for known identifiers, (3) read matched files. This is the "zombie mode trajectory."

### How GRACE 2.0 GREP-Tag Slicing Works

Instead of fighting zombie mode (e.g., building a sophisticated vector DB that agents won't reliably use), GRACE 2.0 exploits it: embed special, searchable strings into source code at semantic boundaries. When an agent runs its default grep, it hits the tag and lands on the correct semantic unit.

The tags serve three functions simultaneously:
1. **Navigation anchor** — `// START_BLOCK_NAME` and `// END_BLOCK_NAME` are the visible GRACE convention. An agent that greps for `START_BLOCK_authenticate` will land on the authentication block boundary, not somewhere inside a 500-line file.
2. **Context granularity control** — Blocks are designed at ~500-token granularity. The tag tells the agent where the unit of work starts and ends, so it doesn't need to read the whole file.
3. **Cross-module semantic query** — A tag like `// GRACE_SEMANTIC: auth.token-validation` embeds a conceptual label that is greppable across 1000 modules. One grep retrieves all files in the codebase that handle token validation — without reading XML docs, without vector search.

This is structurally analogous to what embedded metadata does for databases: instead of a separate index (which can drift), the index IS in the data. The tags cannot go stale unless the code they annotate changes, because they live in the same file.

### Comparison to grepai and GrepRAG

| Approach | Index type | Location | Stale risk | Cross-module query |
|----------|-----------|----------|-----------|-------------------|
| **GRACE GREP-tags** | Embedded in source | In-file comments | Only if code changes | Yes (grep string is the query) |
| **grepai** | External vector DB | Separate process | High (requires re-indexing) | Yes (semantic query) |
| **GrepRAG** | No index | Repository search | None (live grep) | Yes (LLM generates queries) |
| **Vector RAG** | External embedding DB | Separate service | Very high | Yes (embedding similarity) |

GRACE GREP-tags occupy a unique position: they have zero external infrastructure (no vector DB, no indexer process) but provide semantic-level navigation through strategic tag placement. The cost is maintenance discipline — developers must add and maintain tags as code evolves.

### "Lead the zombie, don't fight it"

Ivanov's formulation — "you can't fight zombie mode — lead it instead" — is a design principle:

```
FIGHTING zombie mode:
  Build vector DB → agents ignore it and grep anyway
  Build XML navigation → agents grep the XML files (wrong!)
  Provide rich context → agents still grep the context

LEADING zombie mode:
  Make grep the correct navigation action
  Tag semantic boundaries so grep-landing == correct semantic unit
  Embed conceptual labels so cross-module grep == semantic query
  Result: agent's default behavior produces correct results
```

This is a meta-level insight about agent harness design: optimize the environment for the agent's actual behavior, not the agent's ideal behavior.

---

## 5. Wenyan Prompting in GRACE 2.0 — What's New vs Prior Research

### Prior Research Coverage

`caveman-wenyan-context-compression.md` covers:
- Wenyan as Classical Chinese (文言文): logographic, no inflection, no articles, ~1 char ≈ 1 semantic unit
- 65% average output token compression (up to 87% for explanatory content)
- Russian adaptation at ~95% fidelity (nominalized academic Russian)
- The `arXiv:2604.00025` finding: brevity constraints improved accuracy by 26pp on some benchmarks

### What GRACE 2.0 Adds

**The 5x claim** ("~5x token compression on descriptions") is more aggressive than caveman's 65% average (which is ~2.9x). The difference is likely scope:
- caveman's 65% is for full agent OUTPUT (explanatory prose, code explanations, architectural reasoning)
- Ivanov's 5x likely refers specifically to DESCRIPTION fields in GRACE XML artifacts — module contracts, function summaries, semantic tags — which are already dense and where Wenyan can compress most aggressively

Wenyan on a 40-word English description field:
```
ENGLISH: "This function validates JWT tokens by checking the signature, expiry time, 
          and audience claim. Returns True if valid, raises AuthError if invalid."

WENYAN:  "驗JWT。查簽名、到期、受眾。有效返真，否拋認証錯。"
(8 characters, ~10 BPE tokens vs ~35 BPE tokens for English)
```
Compression ratio in this specific case: ~3.5x. On terser descriptions, 5x is achievable.

**The attention anchor context**: On DeepSeek V4 and GLM-5 with their Lightning Indexers, Wenyan has a specific advantage beyond raw token count: logographic Chinese tokenizes at high semantic density per token. An attention anchor token in Wenyan carries more semantic content than the equivalent English anchor. For the FP8 Lightning Indexer's scoring pass, a high-density anchor token is more likely to survive the top-k cut.

**What's NOT new**: The Wenyan linguistic mechanism, compression benchmarks, and ZomboCraftEco mapping are already in `caveman-wenyan-context-compression.md`. The new addition is specifically:
- Wenyan optimized for DESCRIPTION fields in XML artifact systems (GRACE's Doxygen + knowledge-graph.xml)
- Wenyan as an attention anchor strategy for CSA Lightning Indexers (V4/GLM-5 specific)

---

## 6. GRACE Skills in Marketplace — Findings

### Claude.ai/marketplace

Not publicly accessible (authentication wall). WebFetch returns 403/redirect for claude.ai marketplace URLs.

### Third-Party Skill Directories

Checked: mcpmarket.com, agentskills.so, claudeskills.info, skillsmp.com, claudemarketplaces.com

**Findings:**
- `grace-project-expert` (mcpmarket.com) — GRACE skill exists in marketplace (confirmed listing)
- `grace-ask` (mcpmarket.com) — "Claude Code Skill for AI Code Intelligence" — confirmed
- `grace-explainer` (agentskills.so) — confirmed listing
- **No GRACE 2.0 specific skill found** — all marketplace listings describe the original GRACE (Graph-RAG Anchored Code Engineering) framework without Doxygen, GREP-tags, or Wenyan prompting extensions

### Published GRACE Framework Status

The public GRACE repository (github.com/osovv/grace-marketplace) reflects the original GRACE framework:
- Skills: `grace-init`, `grace-plan`, `grace-verification`, `grace-execute`, `grace-multiagent-execute`, `grace-refactor`, `grace-fix`, `grace-refresh`, `grace-reviewer`, `grace-status`, `grace-ask`
- Artifacts: `development-plan.xml`, `verification-plan.xml`, `knowledge-graph.xml`, `operational-packets.xml`
- Semantic markup: `START_BLOCK_NAME`/`END_BLOCK_NAME` code anchors confirmed
- **No Doxygen integration, no GREP-tag semantic slicing as named feature, no Wenyan prompting**

**Interpretation**: GRACE 2.0 features described by Ivanov appear to be a pre-release / announcement-stage iteration. The techniques are real and validated independently, but they have not yet been published as a discrete GRACE 2.0 marketplace release. The existing `knowledge-graph.xml` and `START_BLOCK`/`END_BLOCK` markup in the public repo represents the architectural predecessor to what Ivanov describes as GRACE 2.0's GREP-tag system.

### Adjacent Published Work

**grepai** (github.com/yoanbernabeu/grepai): Published, MIT-licensed CLI. Semantic search + call graph tracing for AI agents. Local embedding (Ollama by default). MCP server integration. This is an independent implementation of the same idea as GRACE 2.0 GREP-tag slicing, but using vectors rather than embedded tags.

**GrepRAG (arXiv:2601.23254)**: Academic paper confirming the empirical foundation of zombie mode theory. Not GRACE-specific but validates the core observation.

---

## 7. ZomboCraftEco Integration Points

### codegraph-rust

codegraph-rust is the most directly affected repo. GRACE 2.0's Doxygen + GREP-tag approach is an external methodology for agent-navigable code graphs. codegraph-rust builds the same capability natively in Rust.

**Design implication**: codegraph-rust should consider:
1. **GREP-tag emission**: When codegraph-rust generates its code graph, it should optionally emit `// CODEGRAPH_SEMANTIC: <concept>` tags into source files. This gives agents using any tool (grep, ripgrep, etc.) a stable navigation surface without needing to query the codegraph-rust API.
2. **Doxygen XML as input format**: codegraph-rust could consume Doxygen XML as an import pipeline for C/C++/Java code — instead of writing a C++ parser, parse Doxygen's already-parsed XML. The `compound.xsd` schema gives exact structure to parse against.
3. **Call graph inclusion**: CALL_GRAPH / CALLER_GRAPH output from Doxygen would give codegraph-rust free call edges for supported languages.

### contextflow-forge

contextflow-forge manages context assembly for agent harnesses. The GREP-tag zombie mode insight is directly applicable:

```
Current approach (likely):
  contextflow-forge selects context by semantic similarity or rule
  Agent receives assembled context → may still grep internally

GRACE 2.0 approach:
  contextflow-forge instructs agent: "your grep target is GRACE_SEMANTIC:auth"
  Agent greps across its available files using that tag
  Result: agent's default behavior reaches the right context
```

The practical change: contextflow-forge's prompting strategy should assume agents will grep, and front-load the grep targets (tag names, semantic identifiers) in the prompt. This is the DSA Lightning Indexer optimization applied at the harness level.

### infer

No direct Doxygen integration needed. However:
- The Doxygen XML compound files could serve as a code-structure KB layer that feeds into Infer rules. For example: "if a function's call graph includes an untrusted input source AND it calls `execute_sql()`, flag for SQL injection."
- The GREP-tag pattern (embed machine-readable semantic labels in source) is structurally analogous to Infer's rule tagging — both are forms of attaching formal metadata to informal artifacts.

### The GRACE-to-FPF Bridge (Already Proposed)

From `fpf-haft-vs-grace-semantic-vm.md`, the proposed bridge prompt produces FPF JSON (CSC/DRR/EFP cards) from GRACE dataflow output. GRACE 2.0's Doxygen XML adds a new input to that pipeline:

```
Doxygen XML (compound.xml)
    → GRACE-to-FPF bridge prompt
        → CSC card: {stronger_source: "Doxygen-extracted API contract",
                     weaker_rendering: "simplified KB entry",
                     supported_use: "internal callers only",
                     reopen_trigger: "external API integration"}
            → RSTMDB KB entry with Doxygen compound as provenance
```

The Doxygen XML's schema-validated structure makes it a better input for the bridge prompt than raw docstrings — it's already structured, already validated, already typed.

---

## 8. Recommendation

### For ZomboCraftEco Immediately

**P1 — codegraph-rust**: Evaluate Doxygen XML as import pipeline for multi-language codebases (C/C++/Java). The compound.xsd schema is stable and the call graph edges are free. This avoids writing language-specific parsers.

**P1 — contextflow-forge**: Audit current prompt assembly strategy. Verify that grep-target identifiers (semantic block names, GRACE-style tags) are front-loaded in prompts before context. This is the DSA-optimization pattern and applies to ALL Chinese models using CSA (DeepSeek V4, GLM-5).

**P2 — codegraph-rust**: Add GREP-tag emission as an optional output. When generating code graph for a file, emit `// CODEGRAPH_SEMANTIC:<concept>` comments to make the graph navigable via grep without API access.

### For Research

**HOLD on GRACE 2.0 specific**: No published GRACE 2.0 release exists. The announced features are real techniques with independent validation, but there is no documentation to integrate or skills to install. Resume when Ivanov publishes.

**Monitor grepai**: It is the closest published implementation of GRACE 2.0's GREP-tag semantic slicing vision (semantic search + call graphs, MCP-integrated). Worth evaluating as a contextflow-forge complement.

**Wenyan for XML artifact descriptions**: The 5x compression claim is plausible for description fields specifically. If GRACE 2.0 publishes Wenyan-compressed XML artifact schemas, evaluate for ZomboCraftEco's knowledge-graph.xml and FPF card description fields.

---

## 9. Sources

### Primary Sources (Fetched)

- **GRACE marketplace GitHub**: [github.com/osovv/grace-marketplace](https://github.com/osovv/grace-marketplace) — official public GRACE framework; no GRACE 2.0 yet
- **Doxygen manual — getting started**: [doxygen.nl/manual/starting.html](https://www.doxygen.nl/manual/starting.html) — XML output structure, index.xml + compound files
- **Doxygen manual — config**: [doxygen.nl/manual/config.html](https://www.doxygen.nl/manual/config.html) — GENERATE_XML, EXTRACT_ALL, CALL_GRAPH, CALLER_GRAPH
- **GrepRAG (arXiv:2601.23254)**: [arxiv.org/html/2601.23254v1](https://arxiv.org/html/2601.23254v1) — empirical study of grep-based retrieval; 45,615 ripgrep commands analyzed; zombie mode foundation
- **MindStudio "Is RAG Dead?"**: [mindstudio.ai/blog/is-rag-dead-what-ai-agents-use-instead](https://www.mindstudio.ai/blog/is-rag-dead-what-ai-agents-use-instead) — Claude Code/Cursor/Devin use grep, not vectors
- **grepai**: [github.com/yoanbernabeu/grepai](https://github.com/yoanbernabeu/grepai) — semantic search + call graph tracing, MCP server, local embeddings
- **DeepSeek V4 review**: [medium.com/@leucopsis/deepseek-v4-review](https://medium.com/@leucopsis/deepseek-v4-review-a23ce940151c) — CSA hybrid attention, Lightning Indexer FP8, DSML XML tokens
- **DeepSeek V4 technical**: [medium.com/@jiten.p.oswal/deepseek-v4-decoded](https://medium.com/@jiten.p.oswal/deepseek-v4-decoded-trillion-parameter-moe-hybrid-attention-and-the-open-source-agentic-a99f5ac9142a) — CSA + HCA hybrid, 90% KV cache reduction, 73% FLOP reduction
- **DeepSeek Sparse Attention explainer**: [medium.com/@inamdaraditya98](https://inamdaraditya.medium.com/deepseeks-breakthrough-how-sparse-attention-unlocks-next-gen-llm-efficiency-3bc233342aeb) — Lightning Indexer mechanism
- **GLM-5 paper (arXiv:2602.15763v1)**: [arxiv.org/html/2602.15763v1](https://arxiv.org/html/2602.15763v1) — MLA + DSA adoption, 745B params, Chinese GPU stack
- **GLM-5 vs Qwen3.5 analysis**: [recodechinaai.substack.com](https://recodechinaai.substack.com/p/glm-5-qwen35-and-the-ai-race-that) — MLA + DSA confirmed in GLM-5

### Prior Research (Cross-Referenced)

- `docs/research/semantic-vm-grace-deepseek-dsa.md` (br: docs-fk85)
- `docs/research/fpf-haft-vs-grace-semantic-vm.md` (br: docs-9vnj)
- `docs/research/caveman-wenyan-context-compression.md` (br: docs-sc7g)

---

*Research document: GRACE 2.0 — Doxygen AI docs + GREP semantic slicing. br task: docs-3mwu*
