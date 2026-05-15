# Second Brain + LLM-Wiki (Karpathy): Architecture and Axspace Connection

> **Context**: Habr article covers Second Brain concept, minimal Obsidian setup, and Karpathy's LLM-Wiki approach vs. classical RAG. User says this is "really relevant to our axspace ideas."
> **Question**: How does LLM-Wiki map to our current docs/research/ vault and RSTMDB? What is the axspace product layer that sits above LLM-Wiki?
> **Last updated**: 2026-05-08
> **br task**: docs-nfxo

---

## Short Answer

**LLM-Wiki is the informal layer. RSTMDB is the formal layer. Axspace is the bridge that promotes informal wikilinks to formal provenance triples when they meet evidence criteria.**

```
LAYER            TOOL              SCALE          KNOWLEDGE TYPE
────────────────────────────────────────────────────────────────────
Personal notes   Obsidian          ~100 sources   Informal, narrative
                 (raw/ + wiki/)    ~hundreds      wikilinks, summaries
                                   of pages

LLM-Wiki         docs/research/*.md ~10-50        Processed, structured
(our current     + MEMORY.md        research docs  markdown, citations
state)           (the index.md)

axspace          RSTMDB            ~1k-10k        Formal: typed triples
(the product     + ZZ KnowledgeStore papers        provenance, temporal,
vision)          + infer-core       per domain     Belnap contradiction

Science          Citation network  ~millions      Peer-reviewed,
genealogy        (alphaXIV tier)   of papers      citation-graded
(SaaS product)
```

We already ARE a working LLM-Wiki. The gap: we have no ingest/lint automation, no raw/ layer, no wikilinks between research docs. Axspace is the product that sits above personal LLM-Wikis and formalizes their best claims into provenance-traced knowledge.

---

## What LLM-Wiki Actually Is

### The Three-Layer Architecture

```
raw/                    Immutable originals (articles, PDFs, transcripts)
  article-1.md          Never edited after ingest. The evidence chain.
  paper-2.pdf

wiki/                   Processed knowledge, created and maintained by LLM
  concepts/             Concept pages: what is X?
  entities/             Entity pages: who/what is Y?
  comparisons/          Comparison pages: X vs Y
  relationships/        How does X relate to Y?

AGENTS.md               Schema: agent rules for ingest/query/lint operations
index.md                The knowledge map — entire structure, fits in context
log.md                  Change journal — what was added/updated/removed
```

### Three Core Operations

```
INGEST:
  Agent reads new source in raw/
  Creates wiki pages: summary, extracted ideas, wikilinks to related concepts
  Updates index.md and log.md
  Never modifies raw/ original

QUERY:
  Agent reads index.md (fits in context)
  Navigates to relevant wiki pages via wikilinks
  Answers from wiki structure
  Descends to raw/ only if wiki insufficient

LINT:
  Agent validates: broken wikilinks, outdated claims, contradictions, isolated pages
  Flags for human review
  Does NOT auto-fix — only identifies
```

### LLM-Wiki vs. Classical RAG: The Key Distinction

**The fundamental difference is when compilation happens.**

```
CLASSICAL RAG:
  Source → chunk → embed → vector DB
  Query → embed query → top-K similarity → reconstruct answer
  Compilation: per query (stateless)
  Problem: fragments lose context; topics connected by proximity, not meaning

LLM-WIKI:
  Source → LLM processes → wiki pages with explicit wikilinks
  Query → read index → navigate wiki → follow wikilinks → answer
  Compilation: at ingest (stateful, accumulates)
  Property: wikilinks ARE the knowledge graph; contradictions caught at ingest
```

Karpathy's framing: **"Knowledge is compiled once and kept current, not re-derived on every query."**

Scale constraint: LLM-Wiki works at ~100 sources / hundreds of pages, where `index.md` fits in a context window. Beyond that: classical RAG is better (thousands of docs, frequent updates, dynamic content).

The two approaches compose: **LLM-Wiki holds the stable core; RAG supplements with fresh/rare documents.**

---

## Our Current State: We Already Have an LLM-Wiki

We ARE running an LLM-Wiki right now. Mapping:

```
KARPATHY LLM-WIKI          OUR EQUIVALENT              GAP?
─────────────────────────────────────────────────────────────────
raw/                        (missing)                   ✗ NO raw/ layer
  immutable originals       We process directly;
                            original sources = just URLs

wiki/                       docs/research/*.md          ~ partial
  concept pages             Each doc is a research      No cross-links
  entity pages              finding, not a concept page between docs
  comparison pages

AGENTS.md / CLAUDE.md       CLAUDE.md + researcher      ✓ exists
  schema + ingest rules     skill = ingest operation

index.md                    memory/MEMORY.md            ~ partial
  knowledge map             (memory index, not          Covers memories,
                            research docs)              not research docs

log.md                      git commit history          ~ partial
  change journal            (implicit, not structured)

INGEST operation            /flow:research skill        ✓ exists
  agent reads + wikifies    (creates docs/research/*.md)

QUERY operation             /researcher skill +         ~ partial
  agent navigates wiki      GRACE GREP                  No cross-doc nav

LINT operation              (missing)                   ✗ NO lint
  validate links,           detect_gaps() exists for
  contradictions,           .infer facts but not for
  isolated pages            docs/research/ vault
```

**The three critical gaps:**
1. No `raw/` layer — original sources are lost when URLs die
2. No explicit wikilinks between `docs/research/*.md` files — knowledge graph is implicit
3. No lint operation over the research vault — contradictions between older and newer docs go undetected

---

## The Lint Gap Is the Most Dangerous

We now have 10+ research documents. They were written at different times, with different levels of detail. Without lint:

- `llm-memory-taxonomy.md` says "RSTMDB is the central gap"
- `epistemic-cycle-mas.md` says "nightly reflection is missing"
- `prism-premortem.md` says "RSTMDB × Ingestion = Constant"
- None of these are wikilinked to each other. A researcher reading any one of them doesn't see the convergence.

A lint operation would:
- Find that all three docs independently arrive at the same RSTMDB gap
- Surface this convergence as a high-confidence finding (3 independent paths to the same conclusion)
- Detect if any newer doc contradicts an older one
- Identify "isolated pages" — docs with no cross-references = potentially orphaned knowledge

**The lint operation = our missing research.md index + contradiction detection.**

---

## Where RSTMDB Fits: Above LLM-Wiki

LLM-Wiki produces informal, narrative knowledge: summaries, wikilinks, comparison pages.
RSTMDB provides formal, provenance-traced knowledge: typed triples, temporal claims, Belnap logic.

The relationship is not competitive — it's a promotion pipeline:

```
LLM-Wiki claim (informal):
  "TurboQuant reduces KV cache by 5-6× with no quality loss"
  Source: wikilink → kv-cache-compression.md → Source: arXiv:2504.19874

Promoted to RSTMDB triple (formal):
  Subject:   TurboQuant (paper arXiv:2504.19874)
  Predicate: reduces (confidence: high)
  Object:    KV-cache-size by 5-6× (evidence: LongBench 50.06 ≈ full precision)
  valid_from: 2026-04-01 (publication date)
  valid_until: null (still valid)
  provenance: direct citation from paper
```

**The promotion criteria:**
- Claim is in a research doc (LLM-Wiki layer) ✓
- Claim has a primary source citation ✓
- Claim is not contradicted by another claim in the vault (lint passes) ✓
- → Promote to RSTMDB triple

**This is the axspace value proposition**: the upgrade path from informal wiki notes to formal provenance-traced knowledge — without requiring the researcher to write formal logic manually.

---

## Axspace as the Science Genealogy Product

The Science Genealogy SaaS product vision (from memory: infer engine proves facts, RSTMDB, dogfood-first, alphaXIV as competitor reference) is exactly this stack:

```
TIER 1: Personal LLM-Wiki (what the user maintains)
  Obsidian vault or docs/research/*.md
  AGENTS.md rules for ingest/lint
  "Second brain" for researchers

TIER 2: Axspace (the product)
  Ingests LLM-Wiki → extracts formal claims
  Validates against RSTMDB (is this claim already known? contradicted?)
  Promotes verified claims to provenance triples
  Runs infer-core: what can we derive from the accumulated axioms?
  Tracks citation genealogy: where did this claim originate?
  UI: "this claim was first stated in paper X, repeated in Y and Z,
       contradicted by W in 2025, reconciled by V in 2026"

TIER 3: Science Genealogy Layer (alphaXIV competitor)
  Full citation network at paper/field scale
  infer-core reasoning over the global knowledge graph
  "Prove this claim from first principles"
  "Find all papers whose conclusions are invalidated by paper X"
```

LLM-Wiki is the on-ramp. Axspace is the value-add. The science genealogy layer is the network effect.

---

## The Wikilink → RSTMDB Triple Mapping

Karpathy's wikilink format: `[[concept]]` in wiki pages.
RSTMDB triple format: `Subject → Predicate → Object` with provenance.

```
LLM-WIKI WIKILINK:
  "[[TurboQuant]] achieves [[3.5-bit quantization]] with no quality loss
   on [[KV cache compression]]"

RSTMDB TRIPLE:
  (TurboQuant, achieves, 3.5-bit-no-quality-loss)
  (TurboQuant, applies-to, KV-cache-compression)
  provenance: arXiv:2504.19874

THE AXSPACE BRIDGE:
  1. Lint the wikilink: is 3.5-bit-no-quality-loss a known concept?
  2. Check for contradictions: does any other triple say "3.5-bit causes quality loss"?
  3. If clean: promote to RSTMDB triple with full provenance
  4. infer-core: what can we derive? (e.g., "70B model at 1M context fits RTX 5090")
```

The wikilink IS the informal claim. The triple IS the formal claim. Axspace is the extraction and validation process between them.

---

## What to Build First: The docs/research/ Index

Immediate practical step before any axspace product: we need an `index.md` for `docs/research/`.

```
docs/research/index.md  (to create)
  Maps all research documents by:
    - Topic cluster
    - Cross-references (which docs cite which)
    - Open questions / gaps identified
    - Confidence level of findings
    - Date and br task reference

Current docs/research/ files (2026-05-08):
  kv-cache-compression-turbo-quant-vs-deepseek-mla.md
  llm-memory-taxonomy-user-code-knowledge.md
  multi-agent-codebase-navigation-pipeline.md
  codegraph-ctop-infer-semantic-lsp-compiler.md
  prompt-length-paradox-gpt55-openai-guide.md
  prompt-injection-architectural-limits-grace-index-map.md
  prism-premortem-ai-agent-architecture-review.md
  epistemic-cycle-mas-architecture-vs-zombocrafteco.md
  second-brain-llm-wiki-karpathy-axspace.md  (this doc)
```

The `index.md` is the prerequisite for the lint operation. Without it, the lint agent doesn't know the scope.

---

## Key Design Decisions for Axspace

1. **LLM-Wiki is the UX, RSTMDB is the backend.** Users write markdown (easy). Axspace extracts formal triples (automatic). Researchers don't need to learn formal logic — the system promotes claims that meet evidence criteria.

2. **Promotion not extraction.** Don't try to extract triples from all markdown. Only promote claims that: (a) have primary source citation, (b) pass lint (no contradiction in vault), (c) human confirms or auto-promotes above confidence threshold. This maintains quality.

3. **Lint is the gateway.** The lint operation is what separates LLM-Wiki from formal knowledge. Running lint weekly catches contradictions before they accumulate. Each contradiction is a research opportunity: "we found that paper X contradicts our prior belief Y — should we investigate?"

4. **Genealogy is the differentiator.** Classical RAG has no genealogy. LLM-Wiki has wikilinks. RSTMDB has typed provenance. Axspace has the full lineage: claim → source → prior claims in the same source → predecessor claims those depend on. This is the alphaXIV competitor value.

5. **Scale target: 100-1000 sources, dense cross-linking.** Not millions of papers (that's RAG territory). Axspace is for deep, curated, provenance-rich knowledge in a specific domain. The density of wikilinks/triples per source is the quality metric, not the number of sources.

---

## The Nightly Reflection Pipeline as LLM-Wiki Ingest

The nightly reflection pipeline we identified in the Epistemic Cycle research (docs-f0ef) is exactly the LLM-Wiki ingest operation applied to our research vault:

```
NIGHTLY REFLECTION (P08 from Epistemic Cycle) = LLM-WIKI INGEST + LINT:
  1. Read new/modified docs/research/*.md files (since last run)
  2. Extract claims with source citations
  3. Generate wikilinks to related existing concepts
  4. Update docs/research/index.md
  5. Run lint: check cross-doc contradictions
  6. If clean: promote to RSTMDB triples
  7. Run detect_gaps: what claims are in wiki but not in RSTMDB?
  8. Create br tasks for identified gaps

This single pipeline closes 3 open tasks:
  docs-f0ef  (nightly reflection / RSTMDB ingestion)
  docs-nref  (above, now redundant)
  +           creates the research vault index we're missing
```

The LLM-Wiki article gives us the concrete operations list (ingest/lint/promote) that the Epistemic Cycle article described abstractly as "P08 autonomous research trigger."

---

## Follow-up Tasks

- docs-rind: create docs/research/index.md — knowledge map for research vault (prerequisite for lint)
- docs-lint: implement lint operation for docs/research/ vault — cross-doc contradiction and orphan detection

---

## Sources

- [Habr: Второй мозг и LLM-Wiki (habr.com/ru/articles/1031970/)](https://habr.com/ru/articles/1031970/) — Second Brain concept, Obsidian minimal setup, Karpathy LLM-Wiki architecture, RAG comparison, scale limits
- [Karpathy's LLM-Wiki GitHub (via article)](https://github.com/evylegzhanin/test-second-brain) — working implementation with AGENTS.md schema
- Prior: `docs/research/llm-memory-taxonomy-user-code-knowledge.md` — 3 memory types; RSTMDB as knowledge memory gap (LLM-Wiki = informal layer above this)
- Prior: `docs/research/epistemic-cycle-mas-architecture-vs-zombocrafteco.md` — P08 nightly reflection = LLM-Wiki ingest applied to our research vault
- Prior: `docs/research/prism-premortem-ai-agent-architecture-review.md` — RSTMDB × Ingestion = Constant; nightly reflection is the required automaton
- User memory: `user_product_vision.md` — infer engine proves facts, RSTMDB eco, dogfood-first, alphaXIV as competitor reference
