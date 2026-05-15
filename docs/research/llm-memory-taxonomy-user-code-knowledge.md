# LLM Memory Taxonomy: User / Code / Knowledge Are Three Different Problems

> **Context**: ChatGPT/Claude/Gemini have built-in memory — yet Mem0, Zep, Letta, Graphify, and Obsidian wikis over Claude Code keep growing. Two Habr articles and supporting literature explain why.
> **Question**: What are the three distinct LLM memory types, what data structures serve each, and why is there no universal memory layer?
> **Last updated**: 2026-05-07
> **br task**: docs-jgrp

---

## Short Answer

**Three memory types, three data structures, three failure modes.**

```
MEMORY TYPE    DATA STRUCTURE          RETRIEVAL          BUILT-IN CHAT?
────────────── ───────────────         ────────────────   ──────────────
User           Vector + temporal       Embedding search   ✓ SUFFICIENT
               key-value               + profile inject   for consumer use

Code           DAG / call graph +      Graph traversal    ✗ WRONG TOOL
               AST node store          + concept grep     (no graph)

Knowledge      Markdown vault +        Semantic links +   ✗ WRONG TOOL
               knowledge graph         wiki compilation   (no provenance)
```

Built-in memory handles user preferences correctly.
Code and knowledge need fundamentally different data structures.
Mem0/Zep/Letta/Graphify are not "better built-in memory" — they are different tools.

The deeper problem: context length itself degrades LLM performance 13.9%-85%
even with perfect retrieval (arXiv:2510.05381). More memory ≠ better results.
Less context + right structure = better results.

---

## The Three Memory Types (from Habr:1028790 + landscape data)

### Type 1 — User Memory

**What it stores**: who the user is, preferences, work style, past conversation facts.

**Data structure**: vector embeddings + temporal markers + key-value facts.
Auto-injected as compressed profile (~300-1000 tokens) in system prompt.

**Built-in chat sufficient when**: consumer single-tenant usage; no API access needed;
no temporal queries ("what did I say in Q1?"); no proprietary retention policies.

**Insufficient when**: custom API-based agent (no access to built-in systems);
multi-tenant service; temporal queries; regulatory audit trail required.

**Right tool per use case**:
- Consumer ChatGPT/Claude → built-in memory ✓
- Custom API agent → Mem0 (48k ⭐, $24M funding; self-edits on conflict; hybrid vector+graph+kv)
- Enterprise with policy churn → Zep/Graphiti (temporal graph: `valid_from`/`valid_until`)
- Long-running autonomous agent (days) → Letta (OS-inspired RAM/swap/disk; 74% on LoCoMo)

### Type 2 — Code Memory

**What it stores**: architectural knowledge, call relationships, module boundaries,
concept labels, design invariants.

**Data structure**: directed acyclic graph with AST nodes; concept label index.

**Why vector search fails for code**: code relevance is structural, not semantic.
"Which functions call validate_token?" = graph traversal, not embedding similarity.
The call graph IS the semantic structure of code — it's explicit, not latent.

**Why built-in memory fails**: chat memory stores user facts, not AST graphs.
Even if the model remembers "you have a token validator", it can't answer
"which of the 47 auth functions call it before or after hmac_verify?"

**Right tools**:
- Graphify: tree-sitter AST + NetworkX in-memory graph (claims 2-5× token reduction; 71.5× best case unverified)
- codegraph-rust + index.map: tree-sitter → TSV concept index (ZomboCraftEco, built)
- GRACE 2.0: GREP semantic slices = SQL-like queries over code structure

**Key property**: code graph must be regenerated from source (never stale);
never embedded in source files (injection risk); concept labels are semantic
indexes, not documentation.

### Type 3 — Knowledge Memory

**What it stores**: research findings, domain knowledge, cross-document relationships,
provenance trails, citation networks.

**Data structure**: markdown files with YAML frontmatter + wikilinks + knowledge graph.

**Why built-in memory fails**: chat memory forgets between sessions, has no
version control, no provenance, no structure for cross-document linking.

**Why vector search is insufficient alone**: temporal reasoning ("what was known
before paper X was published?"), provenance ("which claim comes from which source?"),
and contradiction detection require graph structure, not nearest-neighbor search.

**Right tools**:
- Obsidian wiki + MCP server: markdown vault, git-friendly, portable (Karpathy pattern)
- RSTMDB (ZomboCraftEco): typed provenance triples; inductive/deductive knowledge base
- Zep/Graphiti: temporal KG for evolving knowledge states
- Claude Code memory system: `/home/user/.claude/projects/*/memory/` — the MEMORY.md index pattern

---

## Context Degradation Mechanisms (from Habr:1031340 + literature)

The second article frames the debate engineers are having: compacting? attention
dilution? model disobedience? alignment failure? The answer is: all four, with
different triggers.

### Mechanism 1: Attention Dilution (structural)

Transformers distribute attention across all tokens. Longer contexts thin focus.

**Empirical proof** (arXiv:2510.05381, Du et al. 2025):
- 5 open/closed LLMs tested on math, QA, coding
- Performance drops **13.9%–85%** from context length alone
- Even with **perfect retrieval** (zero distraction tokens, correct answer present)
- Effect occurs within claimed context windows (not at limits)

```
Performance degradation vs context length
    100%  ▌
          ▌▌
          ▌▌▌
          ▌▌▌▌▌▌
    ~15%  ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌
          └──────────────────────►
          small             large context
```

This is independent of retrieval quality. **Sheer token count degrades reasoning.**

**Mitigation (from paper)**: "recite before solve" — model re-states retrieved
evidence before answering. +4% on RULER benchmark (GPT-4o). Transforms long-context
task into short-context task.

### Mechanism 2: Compacting / Lossy Compression (relational gaps)

Prompt-based summarization preserves facts but loses logical connections.

**Failure mode**: "agent found password in config.yml → used it for API"
compacts to "agent connected to API". The causal chain disappears.
Multi-hop reasoning breaks because intermediate links are gone.

**Symptom**: agent deletes database → often caused by compressed context that lost
the constraint "only delete staging, never production". The constraint was present in
the original context; compression removed it as "redundant."

**Mitigation**: compress structure, not facts. GRACE GREP slices preserve exact
line ranges and symbol boundaries — the structure is never compressed.

### Mechanism 3: CoT as Post-Hoc Rationalization (alignment)

Chain-of-Thought is rationalization after the fact, not a reasoning trace.
(Lanham et al. 2023). Long contexts amplify overthinking without improving accuracy.

**Symptom**: model provides elaborate, confident explanation for a wrong answer.
More "reasoning tokens" makes the wrong answer more convincing.

**Real data**: Claude Opus 4.7 documentation warns: "large/complex prompts cause
overthinking; max effort shows diminishing returns." DeepSeek V4 Pro outperforms
Opus 4.7 in 6/10 cases when harness validates-then-repairs vs adding instructions.

**Mitigation**: validate-then-repair harness pattern. Don't add more instructions;
add a separate validation step that catches the error.

### Mechanism 4: Positional Bias (U-shaped attention)

From "Lost in the Middle" (Liu et al. 2023, TACL 2024):
30%+ accuracy drop when relevant info moves from position 1 to position 10.

**Combined with attention dilution**: position matters AND total length matters.
The worst case: important information in the middle of a long context.

---

## The "Recite Before Solve" Pattern → GRACE GREP Slices

The Du et al. mitigation ("recite retrieved evidence before solving") is structurally
identical to what GRACE GREP semantic slices achieve:

```
"Recite before solve":
  1. Retrieve relevant evidence
  2. Model re-states it in its own words
  3. Then answers

GRACE GREP semantic slice:
  grep "auth.token-validation" .codegraph/index.map
  → auth/token_validator.py  45  81  validate_token  function
  read auth/token_validator.py lines 45-81
  → model has the exact 37 lines in context
  → THEN model reasons about the bug

```

The GRACE GREP approach is the operationalisation of "recite before solve":
instead of adding a CoT step, it structurally ensures only the relevant
37 lines enter the context. The "recitation" is the grep result.

---

## Tool Comparison Matrix

| Tool | Memory Type | Data Structure | Strength | Weakness |
|---|---|---|---|---|
| Built-in (ChatGPT/Claude) | User | Text profile | Zero setup, UX-native | No API, no temporal, no graph |
| **Mem0** | User | Vector + graph + KV | Self-healing, conflict resolution | No temporal states |
| **Zep/Graphiti** | User + Knowledge | Temporal KG | `valid_from`/`valid_until` | Complex, latency on multi-hop |
| **Letta** | User (long-running) | RAM/swap/disk | Autonomous agents, 74% LoCoMo | Overkill for chatbots |
| **Graphify** | Code | AST + NetworkX | Graph traversal for code | In-memory only, Python |
| **codegraph-rust** | Code | TSV index.map | Fast, Rust, git-friendly, grep | Needs concept labeling step |
| **RSTMDB** | Knowledge | Typed provenance triples | Scientific provenance, formal | Not yet productized |
| **Claude Code memory** | User + Knowledge | Markdown MEMORY.md | Zero infra, in-repo | Manual curation required |
| **Obsidian wiki** | Knowledge | Markdown + wikilinks | Git, portable, composable | No automatic graph derivation |

---

## ZomboCraftEco Asset Mapping

```
MEMORY TYPE      NEED                    ASSET STATUS
──────────────── ──────────────────────  ───────────────────────────────────
User memory      Preferences, feedback   ✓ Claude Code /memory/ system
                 User profile            ✓ MEMORY.md index pattern (in use)

Code memory      Call graph navigation   ✓ codegraph-rust + index.map (P1)
                 Concept labels          ✓ concepts.map + hybrid index
                 GREP semantic slices    ✓ GRACE 2.0 (published)
                 Rule checking           ~ Semantic LSP Compiler (planned)

Knowledge memory Provenance triples      ~ RSTMDB (in development, central gap)
                 Citation network        ~ infer-rstmdb crate (bridge exists)
                 Contradiction detect    ✓ ZZ KnowledgeStore (Belnap 4-valued)
                 Temporal claims         ✓ infer-core (TEMPORAL_STATE const)
                 Research docs           ✓ docs/research/ markdown wiki
```

**Verdict**:
- User memory: solved
- Code memory: 80% built (codegraph-rust + GRACE + GREP); Semantic LSP Compiler missing
- Knowledge memory: **the central gap** — RSTMDB is the answer but not yet productized

---

## Design Rules Derived

1. **Never use user memory tools for code navigation.** Mem0/Zep embed vectors;
   code navigation needs graph traversal. Mixing them degrades both.

2. **Context is a limited resource, not a free medium.**
   Du et al. (arXiv:2510.05381): 13.9%-85% drop from length alone, perfect retrieval.
   Every token you add reduces reasoning quality. Keep Architect context ≤8k.

3. **"Recite before solve" = GRACE GREP slice = right pattern.**
   Don't load 50k tokens and hope the model finds the relevant part.
   Identify the 37 lines first; load only those.

4. **Compression preserves facts, destroys structure.**
   Compacting is fine for user memory (facts). It is dangerous for code memory
   (causal chains, call sequences). Never compact the call graph — regenerate it.

5. **Knowledge memory needs provenance, not just vectors.**
   Vector search finds similar content; it cannot answer "was this claim known
   before paper X was published?" RSTMDB typed triples + infer temporal claims
   = the right answer. Obsidian wiki = the right interim tool.

6. **Built-in memory + codegraph + RSTMDB = complete coverage.**
   No single framework covers all three. The stack is intentionally split.

---

## Follow-up Tasks

- docs-rmtx: RSTMDB productization spike — what's needed to go from crate to usable tool
- (existing) docs-nowb: HippoRAG 2 vs RSTMDB — architecture comparison
- (existing) docs-fqye: Memory Systems Survey (arXiv:2512.23343) full read

---

## Sources

- Habr article on memory taxonomy: [habr.com/ru/articles/1028790](https://habr.com/ru/articles/1028790/)
- Habr article on context degradation: [habr.com/ru/articles/1031340](https://habr.com/ru/articles/1031340/)
- [Context Length Alone Hurts LLM Performance (arXiv:2510.05381)](https://arxiv.org/abs/2510.05381) — 13.9%-85% drop even with perfect retrieval; "recite before solve" +4%
- [Lost in the Middle (arXiv:2307.03172)](https://arxiv.org/abs/2307.03172) — U-shaped attention; 30%+ drop mid-context
- [State of AI Agent Memory 2026 (Mem0 blog)](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [Best AI Agent Memory Frameworks 2026 (atlan.com)](https://atlan.com/know/best-ai-agent-memory-frameworks-2026/)
- [Benchmarking AI Agent Memory (Letta)](https://www.letta.com/blog/benchmarking-ai-agent-memory) — 74% LoCoMo with GPT-4o mini
- [Chroma: Context Rot research](https://research.trychroma.com/context-rot)
- Lanham et al. 2023: CoT as post-hoc rationalization, not reasoning trace
