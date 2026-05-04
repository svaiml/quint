# Research: Code Intelligence Gap Analysis — GitNexus vs Our Ecosystem

**Date**: 2026-05-02
**Task**: zse-js2
**Status**: Complete

## Executive Summary

Our ecosystem has **strong code intelligence foundations** (codegraph-rust + codebase-memory-mcp) but is missing several capabilities that GitNexus (34k stars, PolyForm license) demonstrates as table-stakes for 2026 agent workflows. Key gaps: **blast-radius/impact analysis**, **multi-repo knowledge graph**, **Claude Code hooks integration**, and **auto-generated skills per codebase module**.

**Recommendation**: Proceed with caution. Don't adopt GitNexus (PolyForm Noncommercial license). Instead, add the missing capabilities to our existing MIT-licensed tools.

---

## 1. Current Ecosystem Inventory

### What We Have

| Tool | Language | License | Role | MCP Tools |
|------|----------|---------|------|-----------|
| **codegraph-rust** | Rust | MIT | GraphRAG with SurrealDB backend, AST+FastML parsing, embeddings | Yes (via MCP) |
| **codebase-memory-mcp** | C | MIT | Ultra-fast indexing (ms), 66 languages, 14 MCP tools, persistent KG | Yes (14 tools) |
| **serena** | Python | OSS | LSP-grade code understanding + safe semantic edits | Yes (MCP) |
| **ctop** | Rust | MIT | Topological dependency analysis for token savings | No MCP |
| **graphify** | Python | MIT | Graph visualization | No MCP |

### What We Use (from .mcp.json)
- `github` — GitHub API (repos, issues, PRs)
- `serena` — LSP semantic edits
- `playwright-test` — E2E testing
- `trivy` — Security scans
- `codegraph` — Code graph queries (codegraph-rust)

---

## 2. GitNexus Capability Map

| Capability | GitNexus | codegraph-rust | codebase-memory-mcp |
|------------|----------|---------------|---------------------|
| AST parsing (Tree-sitter) | 12+ languages | Rust-native AST + FastML | 66 languages |
| Knowledge graph storage | LadybugDB | SurrealDB | SQLite |
| MCP tools count | 16 | ~10 | 14 |
| **Blast-radius / impact analysis** | Yes (`impact` tool) | No | No |
| **Safe multi-file rename** | Yes (`rename` tool) | No | No |
| **Execution flow tracking** | Yes (processes) | Partial (call chains) | Yes (call chains) |
| **Functional clustering** | Yes (Leiden detection) | No | No |
| **Claude Code hooks** | PreToolUse + PostToolUse | No | No |
| **Auto-generated skills** | Yes (per module) | No | No |
| **Multi-repo graph** | Yes (group_* tools) | Single repo | Single repo |
| **Browser/Web UI** | Yes (WASM) | No | No |
| Indexing speed | Not benchmarked | Fast (Rust) | Fastest (ms, C) |
| License | PolyForm Noncommercial | MIT | MIT |
| Stars | 34k | ~200 | ~2k |

---

## 3. Gap Analysis — What We're Missing

### Gap 1: Blast-Radius / Impact Analysis (HIGH)
**What**: Given a changed function, compute all transitively affected callers, tests, and modules.
**Why it matters**: Prevents "I changed the return type and broke 47 callers" — the #1 agent failure mode.
**Where to add**: codegraph-rust or codebase-memory-mcp.
**Effort**: Medium (graph traversal on existing call-chain data).

### Gap 2: Multi-Repo Knowledge Graph (HIGH)
**What**: Single graph spanning multiple repos with cross-repo call chains and dependency tracking.
**Why it matters**: Our ecosystem has 20+ repos. Agents working on infer need to see pctl-rs interfaces. Cross-repo impact analysis is critical.
**Where to add**: codegraph-rust (SurrealDB already supports multi-database).
**Effort**: High (needs cross-repo symbol resolution).

### Gap 3: Claude Code Hooks (MEDIUM)
**What**: PreToolUse hooks that auto-enrich agent searches with graph context; PostToolUse hooks that detect stale index after commits.
**Where to add**: `.claude/hooks/` — we already have the hook infrastructure.
**Effort**: Low (write hook scripts that call codegraph/codebase-memory-mcp).

### Gap 4: Auto-Generated Skills per Module (MEDIUM)
**What**: Leiden community detection to identify functional clusters, then generate `.claude/skills/generated/` skill files per module.
**Why it matters**: Agents get pre-built context for each codebase area without manual skill authoring.
**Where to add**: New script in flowspec or codegraph-rust.
**Effort**: Medium (community detection + template generation).

### Gap 5: Safe Multi-File Rename (LOW)
**What**: Coordinated rename across all references in all files.
**Why it matters**: LSP rename exists for single-language projects; this works cross-language.
**Where to add**: serena already handles this for LSP-supported languages.
**Effort**: Low (serena covers most cases already).

### Gap 6: Web UI / Browser Explorer (LOW)
**What**: Interactive graph visualization in browser.
**Where to add**: graphify already exists; could add WASM export.
**Effort**: High (WASM port), low priority.

---

## 4. Competitive Positioning (2026 Landscape)

| Tier | Tools | Our Position |
|------|-------|-------------|
| **Tier 1: Knowledge Graphs** | GitNexus (34k), CodeGraphContext (2.2k), codegraph-rust | We have codegraph-rust (MIT) — solid but missing impact analysis + multi-repo |
| **Tier 2: MCP Search** | Octocode, CodePathFinder | We have codebase-memory-mcp — fastest in class (arXiv benchmarked) |
| **Tier 3: Context Packing** | Repomix (22k), code2prompt, Aider repo-map | Not our focus — agents use MCP directly |
| **Tier 4: Platforms** | Sourcegraph Cody, DeepWiki, Greptile | Enterprise scale — not needed yet |

**Key insight**: We're well-positioned in Tier 1+2 with MIT-licensed tools. The gaps are feature additions, not architectural rewrites.

---

## 5. Myria — Cloned

**zombocoder/myria** — Research microkernel OS for x86-64, designed for clusters of lightweight nodes.
- **Language**: C
- **Features**: Capability-based IPC, user-space drivers, live process migration, encrypted overlay, VIP/anycast networking
- **Cloned to**: `infra-eco/myria`
- **Relevance**: Low-level infrastructure — potential runtime target for Aegis VM or o2l green threads

---

## 6. Recommendations

### Immediate (this sprint)
1. **Add impact analysis MCP tool to codegraph-rust** — `codegraph_impact` already exists in the crate, wire it to MCP
2. **Write Claude Code pre-hook** for graph-enriched searches — `.claude/hooks/pre-tool-use-codegraph.py`

### Next sprint
3. **Multi-repo indexing** for codegraph-rust — index all repos in the ecosystem into one SurrealDB instance
4. **Auto-skill generation** — Leiden clustering on the graph, emit `.claude/skills/generated/` files

### Backlog
5. Browser visualization (graphify + WASM)
6. Cross-repo rename tool

---

## Sources

- [GitNexus GitHub](https://github.com/abhigyanpatwari/GitNexus) — 34k stars, PolyForm Noncommercial
- [MarkTechPost article](https://www.marktechpost.com/2026/04/24/meet-gitnexus-an-open-source-mcp-native-knowledge-graph-engine-that-gives-claude-code-and-cursor-full-codebase-structural-awareness/)
- [Code Intelligence Tools Compared (Ry Walker)](https://rywalker.com/research/code-intelligence-tools)
- [codegraph-rust](https://github.com/Jakedismo/codegraph-rust) — MIT, Rust, SurrealDB
- [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) — MIT, C, arXiv:2603.27277
- [CodeGraphContext](https://github.com/CodeGraphContext/CodeGraphContext) — MIT, 2.2k stars
