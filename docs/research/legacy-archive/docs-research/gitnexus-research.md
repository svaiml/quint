# Research: GitNexus — MCP-Native Knowledge Graph Engine
**Date**: 2026-05-05
**Status**: Complete

## Executive Summary

GitNexus (~31,700 GitHub stars) is an open-source MCP-native codebase knowledge graph engine. The AITechCraft ecosystem already covers 80%+ of its capabilities via `codegraph-rust` and `codebase-memory-mcp`, but has three genuine gaps: (1) named execution process tracing, (2) multi-repo contract extraction, (3) graph-derived auto-generated skill files.

**Recommendation**: Do NOT adopt GitNexus. Build the three gaps natively into existing tools, starting with a multi-repo workspace feasibility spike in `codegraph-rust`.

## What GitNexus Does

6-phase pipeline: Structure → Parsing (Tree-sitter, 13 languages) → Resolution → Clustering (Leiden) → Processes (execution-flow tracing) → Search (BM25 + semantic + RRF).
Storage: LadybugDB (embedded columnar graph DB). 16 MCP tools. WASM variant. Docker.
Key unique capabilities: named ProcessNode entities, `detect_changes` (git diff → affected processes), multi-repo group contracts, `--skills` flag generating graph-derived AGENTS.md/CLAUDE.md.

## Ecosystem vs GitNexus

| Capability | GitNexus | codegraph-rust | codebase-memory-mcp | graphify |
|---|---|---|---|---|
| AST parsing | 13 lang | 14 lang (+ LSP) | 66 lang | 20 lang + multimodal |
| Named process/flow tracing | ✅ | ❌ | ❌ | ❌ |
| Multi-repo contracts | ✅ | ❌ planned | ❌ | ❌ |
| Graph-derived skill files | ✅ | ❌ | ❌ | ❌ |
| Agentic reasoning (LATS/ReAct) | ❌ | ✅ | ❌ | ❌ |
| LSP-grade type resolution | ❌ | ✅ | partial | ❌ |
| Security attestation (SLSA L3) | ❌ | ❌ | ✅ | ❌ |
| arXiv paper | ❌ | ❌ | ✅ | ❌ |
| Zero external deps | npx | SurrealDB | ✅ single binary | Python |

## Gaps to Close Natively

1. **ProcessNode in codegraph-rust** (High priority): Add named execution-flow entities to SurrealDB schema. Entry-point tracing → process attribution. Enables `detect_changes` equivalent.
2. **Multi-repo workspace mode in codegraph-rust** (High priority): Cross-repo ContractEdge entities. MVP: extract public API surfaces from 28+ repos into shared SurrealDB instance.
3. **Graph-derived skill files via graphify** (Low-medium): `graphify skills --output CLAUDE.md` using existing Leiden clustering output.

## Sources
- https://github.com/abhigyanpatwari/GitNexus
- https://www.marktechpost.com/2026/04/24/meet-gitnexus-an-open-source-mcp-native-knowledge-graph-engine-that-gives-claude-code-and-cursor-full-codebase-structural-awareness/
- https://arxiv.org/html/2603.27277v1 (codebase-memory-mcp arXiv paper)
- Local: tools/ai-tools/codegraph-rust/README.md, tools/ai-tools/codebase-memory-mcp/README.md, tools/ai-tools/graphify/README.md
