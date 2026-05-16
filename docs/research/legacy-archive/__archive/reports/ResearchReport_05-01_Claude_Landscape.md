# Research Report 05: Agentic Software Engineering — Full Landscape Verification (2026)

> **Compiled by Claude Code (Opus 4.6) on 2026-03-13**
> Based on independent verification of 158 tools across 7 layers, originally catalogued in Gemini ResearchReports 01–04.
> Sources: Web search, GitHub verification, local repo analysis, training knowledge (cutoff Aug 2025).

---

## Methodology

Seven parallel research agents independently verified every tool mentioned across the four Gemini research reports. Each tool was assessed on:
- **Existence**: Does a public GitHub repo or product page exist?
- **Activity**: Is it actively maintained (commits within 90 days)?
- **Stars/Adoption**: Approximate GitHub stars or user base
- **Honest Verdict**: Brutally honest 1-line assessment

### Verification Tiers
- **VERIFIED** — Confirmed real with active repo/product
- **REAL BUT NICHE** — Exists but low adoption or narrow scope
- **PATTERN NOT PRODUCT** — Describes a valid concept but no single canonical tool
- **VAPORWARE** — No verifiable public presence; likely Gemini hallucination
- **MISNAMED** — Feature of another tool promoted to standalone status by Gemini

---

## Layer 1: Memory & Context (25 items → 22 unique after dedup)

### Subcategory A: Agent Memory Frameworks

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **Letta (MemGPT)** | ~12k | VERIFIED | Tiered agent memory OS: Core/Recall/Archival with self-editing paging | Legitimate and widely deployed; the OS-paging metaphor is architecturally sound |
| 2 | **Mem0** | ~20k | VERIFIED | Extracts user-specific facts/preferences across sessions; hybrid vector+graph | Real, popular, production-ready; simpler than Letta — a feature, not a bug |
| 3 | **Zep / Graphiti** | ~3k/~1.5k | VERIFIED | Temporal knowledge graph where facts expire or get superseded over time | Genuinely differentiated; solving a harder problem than most vector stores |
| 4 | **LangMem** | Low (ecosystem) | VERIFIED | Memory primitives for LangGraph agents: cross-thread persistence, namespaces | Real but niche — only useful if you're on LangGraph |
| 5 | **PydanticAI State** | ~8k | VERIFIED | Type-validated agent state via Pydantic models; not standalone memory | Real and excellent; "State" is shorthand for PydanticAI's persistence layer |
| 6 | **Cognition Memory (Devin)** | N/A (closed) | VERIFIED (proprietary) | Devin's long-term reasoning trace memory | Real capability, but proprietary — a benchmark, not a toolkit |
| 7 | **SimpleMem** | None found | **VAPORWARE** | Claimed "30x semantic lossless compression" — ranked #1 DOMINANT in all 4 Gemini reports | **Highest-risk entry**: zero public footprint despite being ranked first everywhere |
| 8 | **CASS (Dicklesworthstone)** | Very low | REAL BUT NICHE | SIMD-accelerated procedural memory by Jeffrey Emanuel | Author is real; "CASS" as described is unconfirmed; elevated via Gemini sycophancy |
| 9 | **AgeMem** | None found | **VAPORWARE** | "Memory management as first-class agentic tool" | No repo, no paper, no package — likely hallucinated |
| 10 | **memU** | None found | **VAPORWARE** | "Proactive memory that surfaces context before agent prompts" | Concept is valid; named product cannot be confirmed |
| 11 | **MemOS** | Ambiguous | **VAPORWARE** | "Standard API for memory lifecycle and GDPR compliance" | Name collision with a Chinese note app; no confirmed agent memory product |
| 12 | **Like-I-Said (v1/v2)** | None found | **VAPORWARE** | "Zero-infra markdown memory" / "task-to-memory linking" | Pattern exists (writing to .md files); named product unverified |
| 13 | **ByteRover Cipher** | None found | **VAPORWARE** | "Dual cognitive model (System 1/2)" | No evidence as software; concept from Kahneman, not a package |

### Subcategory B: Vector Databases (Infrastructure)

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 14 | **Chroma** | ~15k | VERIFIED | Embeddable vector DB; `pip install chromadb` and go | The go-to for rapid prototyping; don't over-engineer — use this first |
| 15 | **Milvus ("AgentEx")** | ~30k | VERIFIED (core) | Distributed vector DB at enterprise scale; "AgentEx" is marketing label | Milvus is real; "AgentEx" as a distinct product is Gemini-invented |
| 16 | **Qdrant Hybrid** | ~20k | VERIFIED | Rust vector engine with native dense+sparse hybrid search | Real and excellent; hybrid search is a genuine differentiator for code |
| 17 | **Weaviate Verba** | ~6k | VERIFIED | RAG chatbot app on Weaviate with human-in-the-loop curation UI | Real and deployable; a complete app, not just a DB wrapper |
| 18 | **Pinecone Canopy** | ~1k | VERIFIED (low momentum) | Pinecone's open-source RAG framework | Pinecone is real; Canopy the framework has modest adoption |
| 19 | **Vectara Agentic** | N/A (SaaS) | VERIFIED (company) | Managed RAG with hallucination detection (HHEM scoring) | Real company, real differentiator; "Agentic" is a marketing tier |

### Subcategory C: Context Extension

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 20 | **GraphRAG (Microsoft)** | ~20k | VERIFIED | Knowledge graph from corpus via entity+relationship extraction | Real, powerful, genuinely differentiated from naive RAG; expensive at index time |
| 21 | **LongLoRA** | ~3k | VERIFIED (research) | Fine-tuning method for extending LLaMA context windows | **Misclassified** — training technique, not a runtime memory framework |
| 22 | **Redis Agent Cache** | ~65k (Redis) | **PATTERN NOT PRODUCT** | Using Redis as fast transient state for agents | Redis is real; "Agent Cache" is a deployment pattern, not a product |

### Layer 1 Scorecard
- **Verified Real**: 14/22 (64%)
- **Vaporware/Hallucinated**: 6/22 (27%)
- **Misclassified/Pattern**: 2/22 (9%)

---

## Layer 2: Knowledge & Code Intelligence (20 items)

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **Repomix** | ~5-8k | VERIFIED | Packs entire repo into single text file for LLM context | Genuinely useful and widely adopted; the brute-force fallback every stack needs |
| 2 | **CodeQL (GitHub)** | ~7k | VERIFIED | Semantic code analysis via Datalog-like queries; security & patterns | Undeniably real and powerful; high learning curve; "agentic" framing is new |
| 3 | **Sourcegraph MCP** | ~10k (parent) | VERIFIED | Enterprise multi-repo code search; MCP bridge is an add-on | Sourcegraph is rock-solid; MCP bridge maturity varies |
| 4 | **LlamaIndex Code** | ~35k (parent) | VERIFIED | Tree-sitter code splitters + hierarchical indexing for RAG | Real; code features are a small part of a large general framework |
| 5 | **Serena** | ~800-1.5k | VERIFIED | LSP-based agent navigation: "who calls X?" not "find file Y" | Architecturally correct approach; worth adopting |
| 6 | **Cognee** | ~2-3.5k | VERIFIED | Knowledge graph ETL for documents/code; multiple graph backends | Real; more general than code-specific; better categorized as Layer 1 |
| 7 | **CocoIndex** | ~500-1.5k | VERIFIED | AST-aware chunking for code RAG; splits at function boundaries | Sound engineering; legitimate specialist tool |
| 8 | **tree-sitter-graph** | ~500-800 | VERIFIED | DSL for building graphs from tree-sitter parse trees | Real protocol-level tool from official tree-sitter org; a primitive you build on |
| 9 | **Kythe (Google)** | ~3.5k | VERIFIED (slowing) | Polyglot cross-reference framework; Google uses internally | Gold standard but hard to operate OSS; not practical without Google-level infra |
| 10 | **DuckDB Code** | ~24k (DuckDB) | **PATTERN NOT PRODUCT** | Using DuckDB for SQL analytics on codebase metadata | DuckDB is excellent; "Code" use case needs custom ETL — not a packaged product |
| 11 | **codebase-memory-mcp** | Low | REAL BUT NICHE | SQLite-backed MCP server for code knowledge persistence | Honest lightweight utility; solid indie building block |
| 12 | **Code-Index-MCP** | Unknown | **PATTERN NOT PRODUCT** | MCP server for incremental codebase indexing | Concept is sound; multiple implementations exist; no single canonical project |
| 13 | **Go-Code-Graph** | Low | REAL BUT NICHE | Go AST → Neo4j graph for architectural analysis | Too narrow for general use; legitimate if Go-heavy |
| 14 | **Codecrumbs** | ~4.5k | VERIFIED (stale) | Code path visualization with annotations for humans | Real but stale (last activity ~2021-2022); human tool, not agent tool |
| 15 | **Tree-sitter MCP** | Low (scattered) | **PATTERN NOT PRODUCT** | Wrapping tree-sitter as MCP server for on-demand AST parsing | Valid concept; no dominant implementation; ~200-line DIY project |
| 16 | **CodeGraph Rust** | Unknown | **VAPORWARE** | Claimed symbol-level HNSW vector graph — ranked #1 in all 4 Gemini reports | **Red flag**: top-ranked in every report but no verifiable repo or citations |
| 17 | **GZOO Cortex** | None found | **VAPORWARE** | "Local-first entity extraction from codebases" | No GitHub, no product, no mentions in any community |
| 18 | **RepoCloud** | None found | **VAPORWARE** | "Real-time mono-repo indexing" | Name collision with a Docker PaaS; code-indexing variant doesn't exist |
| 19 | **Kythe-MCP** | None found | **VAPORWARE** | "Bridge between Kythe and MCP agents" | No evidence; Kythe itself is hard to operate, a bridge is aspirational |
| 20 | **codesearch** | Ambiguous | **PATTERN NOT PRODUCT** | "Hybrid BM25+vector ranking for code" | The pattern is real; no single canonical product by this name |

### Layer 2 Scorecard
- **Verified Real**: 10/20 (50%)
- **Vaporware/Hallucinated**: 5/20 (25%)
- **Pattern/Ambiguous**: 5/20 (25%)

---

## Layer 3: Specification & Strategic Intent / SDD (23 items)

### Subcategory A: Real Standards & Conventions

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **AGENTS.md** | Thousands of repos | VERIFIED | Project-level markdown file steering AI agent behavior | The most practically significant "spec standard" of 2025-26; every project should have one |
| 2 | **CursorRules / .cursorrules** | ~10k (awesome-list) | VERIFIED | Project root file steering Cursor IDE AI behavior | Most battle-tested spec-steering convention; simple but extremely practical |
| 3 | **cc-sdd / Kiro (AWS)** | N/A (commercial) | VERIFIED | AWS AI-native IDE using EARS notation for formal requirements in `.kiro/specs/` | Real and significant; AWS backing gives substantial reach; EARS reduces hallucination |
| 4 | **BMAD Method** | ~3-6k | VERIFIED | Structured AI team simulation: Analyst/Architect/Developer/QA/PM personas | Real, popular, mature; fundamentally a prompt-template collection — good start, not infrastructure |

### Subcategory B: Commercial Products

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 5 | **Factory AI** | N/A (SaaS) | VERIFIED | Proprietary "Mission-driven" agent platform: PRD to PR lifecycle | Legitimate; calling it a "spec standard" is a category error — it's a commercial SaaS |
| 6 | **Tessl** | N/A (private) | VERIFIED | AI code gen constrained to security-idiomatic "tiles" from a registry | Real, funded; "Spec Registry" framing is accurate but product is closed |
| 7 | **Warp (Oz)** | N/A (~$73M raised) | VERIFIED | AI-native terminal with "Drive" for agentic workflows | Real but its "spec framework" role is peripheral — it's primarily a terminal |
| 8 | **Windsurf Cascade** | N/A (Codeium) | VERIFIED | AI IDE with `.windsurfrules` steering — analogous to `.cursorrules` | Real product; Rules system is a steering convention, not a spec framework |

### Subcategory C: Open-Source Tools

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 9 | **SpecMem** | ~30-80 | VERIFIED (local) | Normalizes all spec formats to canonical SpecIR; MCP server + vector DB + web UI | Genuine "Rosetta Stone" for specs; alpha-quality hackathon code but functional |
| 10 | **OpenSpec** | Active (in flowspec) | VERIFIED (local) | Change-centric spec convention: atomic proposals under `.openspec/` or `.cronus/changes/` | Real workflow pattern, not standalone tool; more convention than library |
| 11 | **GitHub Spec-Kit** | ~200-500 | VERIFIED | CLI + templates for spec-first development from GitHub Next team | Real with institutional backing; flowspec builds on it |
| 12 | **Melty Spec** | ~9k (pre-acquisition) | VERIFIED (absorbed) | AI-native IDE with integrated spec-driven loop; acquired by Block early 2025 | Real pre-acquisition; OSS maintenance status unclear post-Block-acquisition |
| 13 | **Spec-Driven FF** | Local only | VERIFIED (local) | Template-based feature spec generator in this workspace | Real local project; not a public package yet |
| 14 | **OpenCode Rules** | ~5-8k (OpenCode) | VERIFIED | Privacy-first terminal agent's project-level config files | Real tool; calling its config files a "spec framework" is over-categorization |

### Subcategory D: Unverified / Vaporware

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 15 | **o2l (zombocoder)** | N/V | **VAPORWARE** | "Pure OO language for agent architectural rigor" | Elevated to DOMINANT via Gemini sycophancy; unverifiable |
| 16 | **Shotgun** | N/V | **POSSIBLY REAL** | 5-phase spec harness: Research→Specify→Plan→Task→Export | Described with enough specificity to be real; DOMINANT status unearned |
| 17 | **Refly** | N/V | **UNCLEAR** | "Skills-as-Infrastructure" for composable agent logic | Some product exists; whether it maps to this description is unclear |
| 18 | **Design OS** | None found | **VAPORWARE** | "Product-to-codebase bridge" | No link, no author, no details anywhere |
| 19 | **Agent OS** | None found | **VAPORWARE** | "Pattern Discovery & Injection" | Describes a capability, not a product |
| 20 | **agentmd** | None found | **VAPORWARE** | "Multi-format generator for agent config files" | Capability exists in SpecMem/vibescaffold; standalone tool unverified |
| 21 | **OpenAgentsControl** | None found | **VAPORWARE** | "Approval gates and plan-first enforcement" | Concept exists in Cline/flowspec; named product doesn't |
| 22 | **GSD (build)** | None found | **VAPORWARE** | "Meta-prompting framework for high-vibe SDD" | Smells strongly of Gemini sycophantic hallucination |
| 23 | **awesome-specs** | None found | **POSSIBLY REAL** | "Curated library of spec templates for 50+ stacks" | Could be a small community repo; low priority to verify |

### Layer 3 Scorecard
- **Verified Real**: 14/23 (61%)
- **Vaporware/Hallucinated**: 7/23 (30%)
- **Unclear/Possibly Real**: 2/23 (9%)

---

## Layer 4: The Task Bridge (20 items)

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **AllBeads (br/ab)** | v0.10.0 | VERIFIED (local) | Federated Beads orchestrator across repos; Sheriff daemon, TUI, agent mail | Most complete tool in this layer; local source confirmed at v0.10.0 |
| 2 | **Git-Native-Issue (beads/bd)** | Active | VERIFIED | Steve Yegge's git-native issue tracker; JSONL in `.beads/` | "Git-Native-Issue" is a descriptor — the real tool is `beads`/`bd` CLI |
| 3 | **A2A Protocol (Google)** | Active | VERIFIED | JSON-over-HTTP agent-to-agent message passing standard | Real open standard; LiteLLM ships SDK wrapper; transport protocol, not task manager |
| 4 | **TaskMaster AI** | ~15k | VERIFIED | Claude Code extension: PRD → structured numbered task list | Real, popular, battle-tested; not used in this workspace (uses Beads instead) |
| 5 | **Master-Plan** | Active | VERIFIED (local) | Claude Code plugin: tasks in `MASTER_PLAN.md` with slash commands | Genuine; simpler than AllBeads; best for solo devs |
| 6 | **JIRA MCP Server** | Active | VERIFIED | Atlassian's official MCP endpoint for Jira/Confluence/Bitbucket | Real, production-ready; official hosted SSE at `mcp.atlassian.com` |
| 7 | **GitHub Issues MCP** | Active | VERIFIED | Official `@modelcontextprotocol/server-github` npm package | Real, official, widely deployed |
| 8 | **Linear Agent SDK** | Active | VERIFIED | Linear's official MCP endpoint at `mcp.linear.app/sse` | Real; "Agent SDK" label overstates it — it's an MCP server |
| 9 | **Beads-Viewer (bv)** | Low | VERIFIED | Go-based TUI for browsing `.beads/` issues; by Dicklesworthstone | Real; cited with install commands in Cronus design docs |
| 10 | **openspec-to-beads** | Local | **MISNAMED** | A 50-line Cronus slash-command, not a standalone tool | Real functionality; Gemini promoted a command file to "tool" status |
| 11 | **ccsdd-to-beads** | Local | **MISNAMED** | Cronus `convert kiro-to-beads` sub-command | Real feature of Cronus; fabricated standalone name |
| 12 | **Agent-Beads Bridge** | Local | **MISNAMED** | Cronus adapter system (beads.py) for format conversion | Real architecture; Gemini invented the product name |
| 13 | **Shadow Beads** | Local | **MISNAMED** | AllBeads subsystem: cross-repo pointer records (`bead://repo/id` URIs) | Real AllBeads feature; presented as independent tool by Gemini |
| 14 | **Context-Onboarding** | Local | **MISNAMED** | AllBeads 5-level dry→wet repo integration model | Real AllBeads subsystem; not a standalone product |
| 15 | **Ghost Worktrees** | Local | **MISNAMED** | AllBeads `ab handoff --worktree` flag for git worktree isolation | Real feature; Gemini invented standalone product name |
| 16 | **VibeKanban** | None found | **VAPORWARE** | "Visual cockpit for SDD pipeline" | AllBeads TUI already has Kanban; this is redundant and unverified |
| 17 | **Perles (BQL)** | None found | **VAPORWARE** | "Beads Query Language TUI" | "Perles" = French for "beads"; Gemini invented a plausible French name |
| 18 | **Ralph-Plan** | None found | **VAPORWARE** | "SQLite-backed immutable run logs" | No evidence; AllBeads Sheriff provides similar functionality |
| 19 | **Spec-Bridge** | None found | **VAPORWARE** | "Requirement IDs to verification checks" | Concept exists in Cronus; named product doesn't |
| 20 | **Task-Flow / Plan-to-Task** | None found | **VAPORWARE** | "State-machine lifecycle" / "Markdown checkboxes to beads" | Category labels promoted to product names; trivially implemented |

### Layer 4 Scorecard
- **Verified Real**: 9/20 (45%)
- **Misnamed (feature, not product)**: 6/20 (30%)
- **Vaporware/Hallucinated**: 5/20 (25%)

---

## Layer 5: Agentic Execution & Coding Loops (25 items)

### Tier 1 — Production Leaders

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **Aider** | ~24k | VERIFIED | Terminal git-native coding agent; repo-maps via tree-sitter; 100+ models | Undisputed efficiency champion; Paul Gauthier ships faster than most teams |
| 2 | **Cline** | ~35k+ | VERIFIED | VS Code Plan/Act agent; visual diffs, approval gates; 5M+ installs | Gold standard for human-in-the-loop; largest install base of any OSS coding agent |
| 3 | **OpenHands** | ~38k+ | VERIFIED | Docker-sandboxed autonomous platform; top SWE-bench scores | Most serious open-source competitor to Devin; right architecture for autonomy |
| 4 | **Continue** | ~18-20k | VERIFIED | Open-source modular AI coding backbone for any IDE; BYO model | Most important open-source infra tool most devs overlook; underrated |
| 5 | **Goose (Block)** | ~12k | VERIFIED | Rust core + pure MCP architecture + YAML Recipes | Most "programmable" agent; steeper learning curve but most composable |
| 6 | **Cursor Agent** | N/A (SaaS) | VERIFIED | Proprietary AI-first editor; Agent/Composer mode; 500k+ paying users | Most commercially successful AI coding tool; the benchmark for all others |
| 7 | **GitHub Copilot** | N/A (1.8M+ users) | VERIFIED | GitHub's integrated AI assistant + Workspace agent mode | Most widely deployed by user count; agent mode maturing slower than Cursor |

### Tier 2 — Strong & Growing

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 8 | **Roo Code** | ~12-15k | VERIFIED | Cline fork with "Boomerang" recursive sub-task delegation | Solves context bloat genuinely; fastest-growing VS Code agent |
| 9 | **Windsurf Cascade** | N/A (Codeium) | VERIFIED | AI IDE with "Flows" architecture for change-cascade awareness | Most serious Cursor competitor for large refactors; closed-source concern |
| 10 | **Qodo (CodiumAI)** | ~3-7k | VERIFIED | Enterprise quality gate: Security/Performance/Standards agent panel | Most serious enterprise quality tool; multi-repo drift detection is unique |
| 11 | **Claude Code** | 100k+ weekly npm | VERIFIED | Anthropic's CLI agent; CLAUDE.md + MCP + hooks | Most capable single-model agent on frontier models; cost at scale is real |
| 12 | **Forge Code** | ~3-5k | VERIFIED | Shell-native binary; Muse/Forge dual-agent; TermBench #1 | Best for shell-heavy tasks; specialist, not generalist |
| 13 | **Cody (Sourcegraph)** | ~2.5-3.5k | VERIFIED | Enterprise cross-repo AI assistant on Sourcegraph search | Only agent purpose-built for 10k+ repo enterprise environments |
| 14 | **Agent Zero** | ~8-10k | VERIFIED | Self-modifying agent that writes its own persistent tools | Most intellectually interesting; R&D only, not production-safe |
| 15 | **mcp-agent** | ~3-5k | VERIFIED | Library for composable MCP-native agent patterns (LastMile AI) | Fills a genuine gap; building-block library, not end-user agent |
| 16 | **Void** | ~12-15k | VERIFIED | Local-first privacy VS Code fork; Ollama/llama.cpp integration | Best for air-gapped environments; agent capabilities still catching up |
| 17 | **PearAI** | ~5-7k | VERIFIED | Open-source Cursor alternative; YC-backed VS Code fork | Value is philosophical (open-source); not technically superior to Cursor |
| 18 | **OpenCode (Go)** | ~5-8k | VERIFIED | Privacy-first terminal agent in Go; 75+ models; nice TUI | Solid Aider alternative for compliance environments; not yet at Aider maturity |

### Tier 3 — Caution / Stalled / Risk

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 19 | **Manus AI** | N/A (closed) | VERIFIED (closed beta) | Chinese-built autonomous "virtual intern" in cloud sandbox | Real demos; closed architecture + Chinese cloud = not enterprise-viable |
| 20 | **Trae (ByteDance)** | N/A (closed) | VERIFIED | ByteDance AI IDE; free tier; mirrors Cursor features | **Geopolitical risk**: same data sovereignty concerns as TikTok |
| 21 | **Melty** | ~8-10k | VERIFIED (stalled) | First open-source AI-native IDE; acquired by Block | Activity inconsistent post-acquisition; crowded niche |
| 22 | **Mentat** | ~2-3k | VERIFIED (stalled) | Terminal coding agent from AbanteAI | Decisively surpassed by Aider; effectively legacy in 2026 |
| 23 | **Goose Desktop** | (bundled) | **MISNAMED** | GUI wrapper for Goose CLI; not a separate agent | Electron UI for Goose; useful addition, not independent product |
| 24 | **Aiki** | None found | **VAPORWARE** | "High-performance PR generation and conflict resolution" | Cannot verify meaningful public presence |
| 25 | **Ralph Loop** | None found | **VAPORWARE** | "Simplest autonomous PRD-to-Implementation cycle" | May be conceptual pattern, not shipping product |

### Layer 5 Scorecard
- **Verified Real**: 22/25 (88%)
- **Vaporware**: 2/25 (8%)
- **Misnamed**: 1/25 (4%)

---

## Layer 6: Multi-Agent Orchestrators (22 items)

### Tier 1 — Production-Ready

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **LangGraph** | ~7.5k | VERIFIED | Stateful cyclic agent graphs with checkpointing; de-facto standard | Most battle-tested stateful orchestrator; steep learning curve, real payoff |
| 2 | **CrewAI** | ~22k+ | VERIFIED | Role-based agent teams with goals/backstories; rapid prototyping | Most approachable; ergonomics leak at scale — teams migrate to LangGraph |
| 3 | **PydanticAI** | ~8k | VERIFIED | Type-safe agent framework; "FastAPI for AI" | Excellent if in Pydantic ecosystem; orchestration story still thin vs LangGraph |
| 4 | **AutoGen / AG2** | ~35k / ~5k | VERIFIED (fragmented) | Async message-passing; group chats; code sandboxes | Impressive stars; Microsoft/AG2 fork split is a real governance problem |
| 5 | **Semantic Kernel** | ~23k | VERIFIED | Microsoft SDK for LLM integration in .NET/Java/Python + Azure | The choice for Azure/.NET shops — nowhere else |
| 6 | **LlamaIndex** | ~38k | VERIFIED | Data-ingestion + RAG + agent layer with document-aware tools | Best when data retrieval dominates; use as "data brain" inside larger orchestration |
| 7 | **DSPy** | ~20k | VERIFIED | Programmatic prompt optimization as compilation, not art | Only framework treating prompts as a compilation problem; steep but powerful |
| 8 | **MetaGPT** | ~46k | VERIFIED (declining) | "Virtual software company": PM/Architect/Engineer/QA agents | Highest stars; earned in 2023 hype; 2024-25 momentum declining |
| 9 | **Phidata / Agno** | ~16k | VERIFIED (rebranding) | Assistant-centric with DB memory; Teams with shared state | Strong DX; rebrand from Phidata→Agno introduces API churn risk |
| 10 | **Haystack** | ~18k | VERIFIED | Enterprise modular RAG and search pipelines | Gold standard for document-search; agent story is secondary |
| 11 | **OpenAI Agents SDK** | ~18k (Swarm, archived) | VERIFIED | Swarm (deprecated) → Agents SDK (production); handoffs + tracing | The choice if fully OpenAI-native; narrower than LangGraph |
| 12 | **Agent Squad (AWS)** | ~4.5k | VERIFIED | Intent-routing classifier dispatching to specialized agents | Well-engineered for Bedrock/AWS; narrow scope (routing only) |
| 13 | **CAMEL** | ~6.5k | VERIFIED | Pioneer of role-playing communicative agents (2023) | Research-grade; directly inspired CrewAI; less ergonomic for production |
| 14 | **Griptape** | ~1.8k | VERIFIED | Enterprise workflows with mandatory guardrails and audit trails | Best for regulated industries; smaller community |
| 15 | **Bee Agent (IBM)** | ~1.8k | VERIFIED | Enterprise-first agent framework; watsonx.ai integration | Solid IBM engineering; low adoption outside IBM ecosystem |

### Tier 2 — Niche / Unverified

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 16 | **Kata Orchestrator** | N/V | REAL BUT NICHE | Phase-based worktree orchestrator | Worktree-per-phase pattern is real; "Kata" brand unverified |
| 17 | **Automagik Genie** | Very low | REAL BUT NICHE | 39+ specialist roles defined in markdown | Config template library masquerading as a framework |
| 18 | **Agent-MCP** | Low (fragmented) | **PATTERN NOT PRODUCT** | Agents sharing an MCP server as knowledge bus | Real pattern; no single canonical package — point to MCP spec itself |
| 19 | **GasTown (Yegge)** | None (private) | **VAPORWARE** | "Mayor/Polecat" agent hierarchy managing 30+ parallel agents | Intellectually compelling blog-post architecture; no public repo |
| 20 | **Antfarm** | None found | **VAPORWARE** | Mutual-verification: Reviewer agents audit Worker agents | Pattern is real (AutoGen does this); named package unconfirmed |
| 21 | **Pi Mono** | None found | **VAPORWARE** | "Modular agent toolkit" | Cannot find; likely a report construct |
| 22 | **NTM (Emanuel)** | None (private) | REAL (private) | Named Tmux Manager for parallel agent SSH sessions | Real personal utility; private tool, not a public framework |

### Layer 6 Scorecard
- **Verified Real**: 15/22 (68%)
- **Vaporware/Private**: 4/22 (18%)
- **Niche/Pattern**: 3/22 (14%)

---

## Layer 7: AI Native Infrastructure (23 items → 21 unique after dedup)

### Subcategory A: Sandboxes & Compute

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 1 | **E2B** | ~7k | VERIFIED | Firecracker microVM sandboxes for AI code execution; sub-second cold starts | De facto standard for AI sandbox isolation; used by OpenHands, Cline, and dozens more |
| 2 | **Daytona** | ~12k | VERIFIED | Open-source reproducible dev environments from Git; agent workspace layer | Legitimate OSS alternative to GitHub Codespaces; real adoption |
| 3 | **Modal** | ~3k (SDK) | VERIFIED | Serverless Python compute; `@app.function` for parallel GPU containers | Excellent DX for parallelizing agent tasks; genuine productivity multiplier |
| 4 | **Fly.io** | ~2k (CLI) | VERIFIED | Global Firecracker VM deployment; 30+ regions; Machines API | Excellent for latency-sensitive agent microservices; not AI-specific but widely used |
| 5 | **Hetzner** | N/A (IaaS) | VERIFIED | German cloud; bare-metal at low cost; popular for AI GPU workloads | Legitimately excellent value; not a tool but an IaaS provider |
| 6 | **SkyPilot** | ~7k | VERIFIED | Multi-cloud job runner with automatic cost optimization | Real, UC Berkeley-backed; useful for cross-cloud agent compute |

### Subcategory B: Inference Engines

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 7 | **Ollama** | ~90k+ | VERIFIED | Local LLM runtime with REST API; model download + GPU/CPU inference | Unambiguous standard for local LLM serving; critical for privacy/offline |
| 8 | **vLLM** | ~30k | VERIFIED | High-throughput LLM server with PagedAttention | Default for self-hosted model serving at scale; production-grade |
| 9 | **SGLang** | ~7k | VERIFIED | Structured generation framework; constrained decoding + KV cache reuse | Real, UC Berkeley; increasingly important for tool-calling reliability |
| 10 | **Groq (LPU)** | N/A (commercial) | VERIFIED | Custom ASIC for 300-800+ tok/sec inference; OpenAI-compatible API | Unambiguously real; fastest public inference API; hardware moat is genuine |
| 11 | **Together AI** | ~1.5k (repos) | VERIFIED | Managed inference for open-source LLMs; fine-tuning; competitive pricing | Real and growing; credible primary or fallback inference provider |
| 12 | **Fireworks AI** | Active | VERIFIED | Low-latency inference; specialized for function-calling/JSON reliability | Real with genuine low-latency differentiation; competes with Together/Groq |
| 13 | **NVIDIA NIM** | Enterprise | VERIFIED | Containerized optimized model serving on NVIDIA hardware | Real enterprise product; right choice for NVIDIA GPU shops |
| 14 | **Replicate** | ~3k (client) | VERIFIED | Managed platform for running OSS ML models via API; broad catalog | Real; excellent breadth; good for heterogeneous agent pipelines |

### Subcategory C: Observability & Evaluation

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 15 | **LangSmith** | Active (LangChain) | VERIFIED | LLM observability: traces, replay, dataset creation, regression testing | Most widely deployed LLM observability tool; free tier; works standalone |
| 16 | **Braintrust** | ~1k | VERIFIED | Enterprise LLM evaluation: test datasets, score regression, CI/CD gates | Real; more eval-focused than LangSmith; good for systematic regression testing |
| 17 | **Weights & Biases** | ~9k | VERIFIED | ML experiment tracking + W&B Weave for LLM tracing | Incumbent ML observability standard; Weave extends to LLM-specific tracing |
| 18 | **BAML** | ~5k | VERIFIED | DSL for typed LLM function signatures with retry + streaming + validation | Real, gaining momentum; "Pydantic for LLM I/O" — worth serious evaluation |

### Subcategory D: Unverified / Vaporware

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 19 | **BFC/bfcfs (zombocoder)** | Very low (~50-200) | REAL BUT NICHE | Kernel-level Binary File Container filesystem for agent data | Interesting indie experiment; ranked DOMINANT via Gemini sycophancy — **do not depend on** |
| 20 | **AgentKernel** | None found | **VAPORWARE** | "AOS Control Plane with sub-125ms boots" | No GitHub, no product page; almost certainly hallucinated |
| 21 | **Gondolin Pattern** | None found | **VAPORWARE** | "Zero-Secret network injection architecture" | Not a product; AI-invented name for real concepts (Vault, IAM roles) |

### Subcategory E: Sunset

| # | Name | Stars | Status | What It Actually Does | Verdict |
|---|------|-------|--------|----------------------|---------|
| 22 | **OctoAI** | Acquired | **SUNSET** | Was optimized model serving; acquired by ServiceNow late 2024 | **Dead as independent product** — do not build on; migrate to Together/Fireworks |

### Layer 7 Scorecard
- **Verified Real**: 18/21 (86%)
- **Vaporware/Hallucinated**: 2/21 (9.5%)
- **Sunset**: 1/21 (4.5%)

---

## Grand Summary: All 7 Layers

| Layer | Total Tools | Verified Real | Vaporware | Misnamed/Pattern | Verification Rate |
|-------|:-----------:|:------------:|:---------:|:----------------:|:-----------------:|
| 1. Memory & Context | 22 | 14 | 6 | 2 | 64% |
| 2. Knowledge & Code Intel | 20 | 10 | 5 | 5 | 50% |
| 3. Spec & SDD | 23 | 14 | 7 | 2 | 61% |
| 4. Task Bridge | 20 | 9 | 5 | 6 | 45% |
| 5. Agentic Execution | 25 | 22 | 2 | 1 | 88% |
| 6. Orchestrators | 22 | 15 | 4 | 3 | 68% |
| 7. AI Native Infra | 21 | 18 | 2 | 1 | 86% |
| **TOTAL** | **153** | **102** | **31** | **20** | **67%** |

### Key Findings

1. **~67% of Gemini's claimed tools are verifiably real.** The remaining 33% are either vaporware (20%), misnamed features of other tools (13%), or patterns described as products.

2. **Layer 5 (Execution) and Layer 7 (Infra) are the most reliable** at 88% and 86% verification — these are mature, well-known tool categories.

3. **Layer 4 (Task Bridge) is the least reliable** at 45% — Gemini promoted AllBeads sub-features into standalone product names, inflating the count.

4. **31 tools appear to be hallucinated or vaporware.** The most egregious: SimpleMem (#1 in all 4 reports, zero public footprint), CodeGraph Rust (#1 in Layer 2, unverifiable), and AgentKernel (no evidence anywhere).

5. **The Gemini sycophancy pattern is confirmed.** Tools discussed in conversation (o2l, BFC, CASS, GasTown) were elevated to "DOMINANT" regardless of real-world traction.

6. **Only 2 tools survived all 4 Gemini reports AND passed verification: AllBeads and Goose.** CodeGraph Rust survived all reports but failed verification.

### The Verified "Titanium Stack" (Claude's Recommendation)

| Layer | Primary | Secondary |
|-------|---------|-----------|
| **Memory** | Letta (MemGPT) + Mem0 | Zep/Graphiti for temporal |
| **Knowledge** | Repomix + Serena | CodeQL for security |
| **Spec** | AGENTS.md + Kiro (EARS) | SpecMem for format unification |
| **Bridge** | AllBeads + TaskMaster AI | GitHub Issues MCP |
| **Execution** | Aider + Cline + Goose | Claude Code for Anthropic-native |
| **Orchestration** | LangGraph + PydanticAI | CrewAI for rapid prototyping |
| **Infra** | E2B + Ollama + vLLM | LangSmith for observability |

---

*Report compiled by Claude Code (Opus 4.6) on 2026-03-13. Seven parallel research agents verified 153 unique tools via web search, local repo analysis, and training knowledge. This is an independent verification — not a Gemini output.*
