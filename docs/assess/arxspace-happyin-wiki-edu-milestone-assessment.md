# Feature Assessment: ArxSpace — Karpathy Wiki Pattern as Edu Milestone

**Date**: 2026-04-30
**Assessed By**: Claude AI Agent
**Status**: Assessed
**Tracking**: docs-1om

## Feature Overview

**ArxSpace** is a learning project rewriting Karpathy's `arxiv-sanity-lite` with a modern Python
stack (FastAPI + SQLAlchemy + Scrapy + HTMX). Learner: Artem (Python beginner).
Current state: 3 open PRs with changes requested, blocked on Artem addressing reviewer feedback.

**Proposed addition**: Implement the Karpathy LLM Wiki pattern (April 2026) as an additional
ArxSpace milestone — a wiki-link knowledge base where each arxiv research session becomes a
persistent card. Scope is **edu project only** (not enterprise grade). Evaluate if any real
business moats exist.

**Architecture (Karpathy/Happyin pattern):**
```
raw/        ← immutable arxiv session notes
wiki/       ← one card per concept, [[wiki-linked]]
index.md    ← full catalog, fits in one context window
llms.txt    ← machine-readable index for AI agents
```
No vector DB. No embedding model. Agent reads `index.md` → follows wiki-links.
95% cheaper than RAG at bounded knowledge sizes.

**Related existing work:**
- `backlog/TASK-104` — Production version: Apply Karpathy Wiki Compiler to Science Genealogy (broader scope)
- `docs-2o0` — Spike: Happyin-style wiki-link layer for RSTMDB
- `docs-1tk` — Upgrade flowspec memory to wiki-link pattern
- `docs-1xi` — Evaluate llms.txt as agent interface

---

## Scoring Analysis

### Complexity Score: 2.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 3/10 | For Artem: ~3-5 days to build wiki/, raw/, index.md, a Python compiler script, llms.txt generator. Well-defined pattern with reference implementation. |
| Component Count | 3/10 | 3 new components: wiki directory structure, LLM compiler script (converts raw/ → wiki/ cards), llms.txt auto-generator. Plugs into existing ArxSpace scraper output. |
| Integration Points | 2/10 | No external APIs. File system only. Optional: feed wiki/ into existing ArxSpace search index. |
| **Average** | **2.7/10** | |

### Risk Score: 1.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 1/10 | Static markdown files, no auth, no sensitive data pathways. |
| Compliance Requirements | 1/10 | None. ArxSpace processes public arxiv papers. |
| Data Sensitivity | 1/10 | All content is public arxiv metadata + student research notes. |
| **Average** | **1.0/10** | |

### Architecture Impact Score: 2.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 4/10 | Wiki-link graph retrieval is new to ArxSpace. Pattern is well-defined but introduces the concept of agent-readable knowledge structure — meaningful learning milestone. |
| Breaking Changes | 1/10 | Purely additive. Does not touch existing PRs or features. Can be its own milestone after the current 3 PRs merge. |
| Dependencies Affected | 3/10 | Downstream: feeds into RSTMDB architecture (via TASK-104 and docs-2o0). The edu implementation validates the production pattern cheaply. |
| **Average** | **2.7/10** | |

---

## Overall Assessment

**Total Score**: 6.4/30
**DVF+V Bonus**: +1 (Viability Risk — moat value uncertain without explicit analysis)
**Adjusted Total**: 7.4/30
**Recommendation**: Skip SDD
**Confidence**: High

### Rationale

All three individual scores are below the 4.0 Spec-Light threshold. Total is well below 10.
The pattern is fully documented (Karpathy gist + Happyin reference implementation), the scope is
additive, and Artem is learning from it. No specification phase needed — a clean implementation
task is the right artifact.

The architecture impact score 4/10 on "New Patterns" is the only score near threshold — but this
is appropriate for a learning project: introducing a new pattern IS the educational value, not
a risk factor.

---

## Business Moat Analysis

This is the more important question. The wiki-link pattern itself is **not a moat** (MIT license,
trivially replicable, Karpathy published it publicly). The moats are in the pipeline it enables:

### Moat 1: Content Flywheel (MEDIUM MOAT)

```
Artem processes arxiv papers via ArxSpace
    ↓  (each session generates wiki cards)
raw/ notes → wiki/ compiler → concept cards
    ↓  (cards flow into production)
RSTMDB ingestion → Infer proof validation
    ↓  (compound effect)
RSTMDB becomes richer than competitors who start from scratch
```

Every arxiv paper Artem reviews becomes a seed card in RSTMDB. The edu project is a **content
generation engine** running on student time. No competitor has this bootstrap channel.

**Condition for moat**: Cards must be structured for RSTMDB ingest from day one. If wiki/ cards
follow the RSTMDB entity schema (scholar, paper, claim, lineage), they port directly.

### Moat 2: llms.txt as Discovery Surface (SMALL BUT FIRST-MOVER)

Publishing ArxSpace's `llms.txt` makes its knowledge findable by AI agents before any competitor
has the data. When Claude, Gemini, or a research agent queries a science lineage, it can consume
ArxSpace's index directly. This creates citation/reference gravity before RSTMDB is production.

**Condition**: llms.txt must be published (MIT, public-facing). Private = no moat.

### Moat 3: Architecture Validation (RISK REDUCTION → MOAT ENABLER)

ArxSpace validates the TASK-104 architecture cheaply (edu context, no stakes). When RSTMDB
implements the full Karpathy compiler, the design choices are already battle-tested.
Estimated TASK-104 integration complexity drops from ~5 days to ~2 days.

This is not itself a moat, but it *enables* faster production deployment of Moat 1.

### Moat 4: The Pipeline, Not the Pattern (CORE MOAT — LONG-TERM)

```
ArxSpace (edu content generation)
    ↓
RSTMDB (temporal citation graph)
    ↓
SFA stability analysis (Session 5 finding)
    ↓
Infer proof engine (formal provenance)
    ↓
User-facing: "This citation is proven with temporal stability score 0.94"
```

**No competitor has all four layers.** Semantic Scholar has citations. OpenAlex has open data.
Neither has: (a) temporal stability scoring, (b) formal proof chains, or (c) an edu bootstrap
pipeline generating structured content. The wiki pattern is the intake valve for this pipeline.

### What Is NOT a Moat

- The wiki-link pattern itself (public, trivially replicable)
- The llms.txt format (open standard)
- The Python compiler script (commodity code)
- ArxSpace as a standalone product (arxiv-sanity-lite clones are numerous)

---

## Next Steps

### Skip SDD Path (Recommended)

Add as **Milestone 4** to ArxSpace, after the current 3 PRs merge:

```bash
# Create the milestone task in beads
br create \
  --title="ArxSpace M4: Karpathy Wiki milestone — wiki-link knowledge base" \
  --type=task \
  --priority=2 \
  -l "edu,arxspace,karpathy-wiki,milestone" \
  -d "Add Karpathy LLM Wiki pattern to ArxSpace as Milestone 4 (after M1-M3 PRs merge).

Scope:
- raw/ directory: immutable arxiv session notes from Scrapy output
- wiki/ compiler: Python script that converts raw/ notes to concept cards with [[wiki-links]]
- index.md: auto-generated catalog (one entry per concept, one context window)
- llms.txt: machine-readable index for AI agents (publish publicly)
- Schema alignment: wiki cards follow RSTMDB entity format (scholar, paper, claim, lineage)

Business constraint: cards must be RSTMDB-compatible from day one to activate Content Flywheel moat.
Reference: Karpathy gist April 2026, Happyin Knowledge Space as reference implementation."
```

### Dependency on TASK-104

This milestone is the **edu proof-of-concept** for TASK-104 (production version).
Recommended sequence:
1. ArxSpace M4 (edu) → validates architecture
2. docs-2o0 spike (RSTMDB wiki layer) → production implementation drawing on M4 learnings
3. TASK-104 full compiler → production deployment

### Current Blocker

ArxSpace has 3 open PRs with changes requested. **Artem must address reviewer feedback first.**
M4 should not be started until at least the core PRs merge.

---

## Override

```bash
/flow:assess arxspace-happyin-wiki-edu-milestone --mode full   # if scope grows to enterprise
/flow:assess arxspace-happyin-wiki-edu-milestone --mode light  # if some spec is needed
```

---

*Assessment generated by /flow:assess workflow*
