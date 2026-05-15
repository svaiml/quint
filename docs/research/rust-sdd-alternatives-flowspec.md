# Research: SDD Alternatives to flowspec — Rust-Native + Agent Ecosystems

**Date**: 2026-05-15 | **Tracked**: zombo-sash-eco-x2ne

## Executive Summary

**No single tool replaces flowspec end-to-end today.** After deep investigation of 8 tools:

- **ForgeCode** (7.3k stars, Rust) — multi-agent coding harness (Forge/Sage/Muse). Agent runtime, not SDD framework.
- **Goose** (44.7k stars, Rust) — agent runtime. Could execute SDD workflows but no built-in pipeline.
- **Shotgun** (672 stars, Python) — **most directly SDD-aligned**. Research->Spec->Plan->Tasks->Export. But Python, not embeddable.
- **Spec Kit + spec-kit-mcp** (71-75k stars) — closest SDD match. Rust MCP crate (v0.1.0) wraps Python subprocess.
- **Rig** (7.3k stars, pure Rust) — **best foundation for building flowspec-rs**. Composable Agent/Pipeline/Tool abstractions.
- **Kilo Code** (19.3k stars, TypeScript) — superior agent ecosystem with Agent Manager, 500+ models, Skills, but no SDD workflow.

**Confidence**: High on tool identities; Medium on SDD fit assessment.

---

## Tool-by-Tool Analysis

### 1. ForgeCode (Rust) — CORRECTED (not "ForgeAI")

```
Repo:     github.com/tailcallhq/forgecode (was antinomyhq/forge)
Language: Rust | Stars: ~7,300 | License: Apache-2.0
```

```
+----------------------------------------------------------+
|                    FORGECODE ARCH                         |
+----------------------------------------------------------+
|  USER: Interactive TUI | One-Shot CLI | ZSH Plugin (:)   |
|                          |                                |
|           +--------------v--------------+                 |
|           |        forge_app            |                 |
|           | Session mgmt, agent routing |                 |
|           +--------------+--------------+                 |
|                          |                                |
|           +--------------v--------------+                 |
|           |      forge_services         |                 |
|           | Tools, MCP client, registry |                 |
|           +--------------+--------------+                 |
|                          |                                |
|           +--------------v--------------+                 |
|           |      forge_domain           |                 |
|           | Abstract types, tool catalog|                 |
|           +-----------------------------+                 |
|                                                           |
|  AGENTS:                                                  |
|  +-------+  +-------+  +-------+                         |
|  | Forge |  | Sage  |  | Muse  |                         |
|  | (code)|  |(read- |  |(plans)|                         |
|  |       |  | only) |  |       |                         |
|  +-------+  +-------+  +-------+                         |
+----------------------------------------------------------+
```

- **Muse** = planner, **Sage** = researcher (read-only), **Forge** = executor
- Custom agents via `.forge/agents/*.md` (YAML frontmatter)
- MCP support, 300+ models via OpenRouter
- **SDD relevance**: Low-Medium. Agent runtime, not SDD framework. Muse's plan-first approach aligns but no workflow stages.
- **Ecosystem fit**: Rust — language match. Standalone binary, not a library.

### 2. Shotgun.sh (Python) — CORRECTED (deeper dive)

```
Repo:     github.com/shotgun-sh/shotgun | Site: shotgun.sh
Language: Python 3.11+ | Stars: ~672 | License: MIT
Install:  uvx shotgun-sh@latest
```

```
  USER: "Add refund support to payments"
       |
       v
  +-----------+     +-----------+     +-----------+
  | RESEARCH  |---->| SPECIFY   |---->| PLAN      |
  | Indexes   |     | Writes    |     | Creates   |
  | codebase  |     | PRD +     |     | roadmap + |
  | (tree-    |     | arch spec |     | stages    |
  |  sitter)  |     |           |     |           |
  +-----------+     +-----------+     +-----------+
                                           |
                    +-----------+     +----v------+
                    | EXPORT    |<----| TASKS     |
                    | Format    |     | Staged    |
                    | for AI    |     | PRs with  |
                    | agents    |     | file-by-  |
                    |           |     | file inst |
                    +-----------+     +-----------+

  Output: .shotgun/ directory (specs, plans, staged task lists)
  Privacy: All indexing local, code never leaves machine
```

- **Most SDD-aligned tool in this comparison** — literally built for "write specs first"
- 5 specialized sub-agents (Research, Spec, Plan, Tasks, Export)
- Codebase indexing via tree-sitter (searchable code graph, local only)
- Staged PR output (5 focused PRs, not one 10K-line monster)
- **SDD relevance**: HIGH. Research->Spec->Plan->Tasks->Export = SDD pipeline.
- **Ecosystem fit**: Python — no Rust match. Standalone CLI. Could generate specs that feed into beads workflow.

### 3. Rig (Pure Rust) — DEEP DIVE

```
Repo:     github.com/0xPlaygrounds/rig | Site: rig.rs
Language: Rust 2024 | Stars: ~7,289 | License: MIT
Version:  0.36.x | Downloads: 809k+
```

#### Rig Core Architecture

```
+===========================================================================+
|                         RIG CORE ARCHITECTURE                              |
+===========================================================================+
|                                                                            |
|  rig (facade crate) -- feature-gated re-exports                           |
|  cargo add rig --features "lancedb,fastembed,memory"                      |
|                                                                            |
|  rig-core:                                                                 |
|  TRAITS                           STRUCTS                                  |
|  +-------------------------+      +-------------------------+              |
|  | CompletionModel         |      | Agent<M>                |              |
|  | EmbeddingModel          |      | AgentBuilder<M>         |              |
|  | VectorStoreIndex        |      | Pipeline                |              |
|  | Tool                    |      | CompletionRequest       |              |
|  | Op (pipeline operation) |      | InMemoryVectorStore     |              |
|  | Prompt / Chat           |      |                         |              |
|  | ConversationMemory      |      |                         |              |
|  +-------------------------+      +-------------------------+              |
|                                                                            |
|  COMPANION CRATES:                                                         |
|  Providers: rig-bedrock, rig-gemini-grpc, rig-vertexai + 20 built-in     |
|  Stores:    rig-lancedb, rig-mongodb, rig-qdrant, rig-postgres,           |
|             rig-sqlite, rig-neo4j, rig-milvus, rig-surrealdb (10+)       |
|  Extensions: rig-memory, rig-fastembed                                     |
+===========================================================================+
```

#### Request Lifecycle

```
  agent.prompt("Analyze this code").await
       |
       v
  1. PROMPT ASSEMBLY
     - Inject preamble (system prompt)
     - Append static context documents
     - Register tool definitions (JSON schemas)
     - Attach conversation memory
       |
       v
  2. COMPLETION MODEL
     - Serialize to provider format
     - HTTP request to LLM API
     - Deserialize response
       |
       v
  3. TOOL LOOP (if tool_call in response)
     - Look up Tool by name
     - Deserialize args, call tool.call(args)
     - Append results to context
     - Re-send to LLM
     - Repeat until no more tool_calls
       |
       v
  4. FINAL RESPONSE
     - Return text, persist to memory, emit telemetry
```

#### Pipeline System

```
  Op #1 ---> Op #2 ---> Op #3 ---> Op #4
  (any fn)   (any fn)   (any fn)   (any fn)

  Combinators: .map() .then() .lookup() .prompt() .batch()

  RAG Example:
  Extract query -> Vector Search (top-k) -> Build context -> Agent prompt
```

#### SDD Workflow on Rig

```
  FULL SDD PIPELINE (composed as Op chain):

  +--------+     +--------+     +--------+     +--------+     +--------+
  |Research|---->|Specify |---->| Plan   |---->|Implement|---->|Validate|
  | Agent  |     | Agent  |     | Agent  |     | Agent   |     | Agent  |
  +--------+     +--------+     +--------+     +--------+     +--------+

  Each phase = Agent<M> with:
  - .preamble("You are a [role]...")
  - .tool(FileReaderTool / GrepTool / GitLogTool / etc.)
  - .context(output from previous phase)

  Pipeline::new(research_op)
    .then(spec_op)
    .then(plan_op)
    .then(impl_op)
    .then(validate_op)
```

- **Best candidate for building flowspec-rs** — library with composable abstractions
- Agent/Pipeline/Tool traits map directly onto SDD phases
- 10+ vector store integrations for codebase RAG
- Pure Rust, Tokio-based, WASM-compatible
- **SDD relevance**: None directly. Building blocks for custom SDD.
- **Ecosystem fit**: EXCELLENT. Cargo crate, same idioms as criterium/zz-notation.

### 4. Kilo Code — Agent Ecosystem Deep Dive

```
Repo:     github.com/Kilo-Org/kilocode
Language: TypeScript (Bun) | Stars: 19,312 | License: MIT
Lineage:  Cline -> Roo Code -> Kilo Code
Funding:  $8M seed (Sid Sijbrandij / GitLab co-founder)
```

#### Architecture

```
+------------------------------------------------------------------+
|                     KILO CODE MONOREPO                           |
+------------------------------------------------------------------+
|  BACKEND (opencode engine)                                       |
|  +------------------------------------------------------------+ |
|  | HTTP Server (Hono) | Agent Loop | Tool Registry             | |
|  | REST + SSE streams | Prompt asm | bash/read/write/edit/grep | |
|  |                    | LLM stream | webfetch/glob/MCP bridge  | |
|  | Provider Layer     | Tool disp. | Permission System         | |
|  | (Kilo Gateway)     | Multi-turn | ask() + rules + approval  | |
|  | 500+ models        |            |                           | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  FRONTENDS (all via SDK + HTTP + SSE)                            |
|  +-----------+ +-----------+ +----------+ +-----------+          |
|  | VS Code   | | JetBrains | | Desktop  | | TUI/CLI   |          |
|  +-----------+ +-----------+ +----------+ +-----------+          |
|                                                                  |
|  AGENTS:                                                         |
|  +------+ +-----------+ +-------+ +-----+                       |
|  | Code | | Architect | | Debug | | Ask |                       |
|  | (all | | (read-only| | (all  | |(RO) |                       |
|  |tools)| | + web)    | |tools) | |     |                       |
|  +------+ +-----------+ +-------+ +-----+                       |
|                                                                  |
|  AGENT MANAGER (multi-agent):                                    |
|  +------------------+  +------------------+                      |
|  | Session 1        |  | Session 2        |  ...                 |
|  | Branch: feat-a   |  | Branch: feat-b   |                     |
|  | Worktree: /tmp/a |  | Worktree: /tmp/b |                     |
|  | Model: Opus 4    |  | Model: Sonnet 4  |                     |
|  +------------------+  +------------------+                      |
|                                                                  |
|  EXTENSIONS: Modes + Subagents + Skills + MCP + Plugin hooks     |
|  MARKETPLACE: github.com/Kilo-Org/kilo-marketplace               |
+------------------------------------------------------------------+
```

#### Kilo vs Claude Code vs flowspec

```
+-------------------+------------------+------------------+------------------+
| Capability        | Kilo Code        | Claude Code      | flowspec         |
+-------------------+------------------+------------------+------------------+
| SDD built-in      | No (via Skills)  | No (via hooks)   | YES (core)       |
| Multi-agent       | Agent Manager +  | Agent Teams      | Single-agent     |
|                   | git worktrees    |                  |                  |
| Model flexibility | 500+ BYOK        | 3 Claude models  | Via Claude       |
| Task tracking     | None             | TodoWrite        | beads-rust       |
| MCP support       | First-class      | First-class      | Via Claude Code  |
| IDE support       | VS Code + JB +   | VS Code + JB +   | CLI-first        |
|                   | Desktop          | Terminal         |                  |
| Open source       | Yes (MIT)        | No               | Partial          |
| Cost              | Free (BYOK)      | Pro $17-200/mo   | Via Claude       |
| Extension model   | 5 mechanisms     | CLAUDE.md + hooks| Slash commands   |
+-------------------+------------------+------------------+------------------+
```

- **19.3k stars**, Sid Sijbrandij (GitLab) backed, $8M seed
- Agent Manager: parallel agents in isolated git worktrees
- 5 extension mechanisms: Modes, Subagents, Skills, MCP, Plugin hooks
- No SDD built-in — would need custom Skills to encode /flow: workflow
- **SDD relevance**: None natively. Superior agent platform that could host SDD.
- **Ecosystem fit**: TypeScript. Could invoke gm/br via bash tool or custom MCP servers.

---

## Comparison Matrix (All 8 Tools)

```
+------------------+--------+--------+--------+--------+--------+--------+--------+--------+
|                  |flowspec|Forge   |Goose   |Shotgun |SpecKit |Rig     |Kilo    |AutoAgts|
|                  |        |Code    |        |.sh     |+MCP    |        |Code    |        |
+------------------+--------+--------+--------+--------+--------+--------+--------+--------+
| Language         |Python  |Rust    |Rust+TS |Python  |Py+Rust |Rust    |TypeScrp|Rust    |
| Stars            |private |7.3k    |44.7k   |672     |71-75k  |7.3k    |19.3k   |small   |
| SDD workflow     |FULL    |None    |None    |FULL    |FULL    |None    |None    |None    |
| Agent orchestr.  |Yes     |3 agents|Yes     |5 agents|MCP     |Pipeline|AgentMgr|Ractor  |
| Task integration |beads   |None    |None    |None    |Internal|None    |None    |None    |
| Embeddable lib?  |No      |No      |No      |No      |No      |YES     |No      |Yes     |
| Multi-model      |Claude  |300+    |15+     |BYOK    |MCP     |20+     |500+    |custom  |
| Rust-native      |No      |Yes     |Yes     |No      |Wrapper |Yes     |No      |Yes     |
+------------------+--------+--------+--------+--------+--------+--------+--------+--------+
```

---

## Recommendations (Updated)

### Option A: Keep flowspec + adopt Kilo Code as agent platform (Short-Term)

flowspec for SDD orchestration, Kilo Code for multi-model agent execution. Kilo's Agent Manager gives parallel worktree isolation. Wrap gm + beads as MCP servers for Kilo.

- Effort: Low-Medium | Risk: Low | Timeline: 2-4 weeks

### Option B: Build flowspec-rs on rig-core (Medium-Term)

Pure Rust SDD orchestrator:
1. `rig-core` for LLM abstractions + pipeline composition
2. Reimplement spec-kit tools as Rig Agents
3. Native beads-rust + gm integration
4. flowspec memory system + PR workflow

- Effort: High (4-8 weeks) | Risk: Medium | Timeline: Q3-Q4 2026

### Option C: Use Shotgun.sh for spec generation + beads for execution

Shotgun generates .shotgun/ specs, beads tracks implementation tasks, Claude Code/Kilo executes.

- Effort: Low | Risk: Low | Timeline: 1 week trial

### NOT Recommended

- ForgeCode as SDD replacement (agent tool, not framework)
- Goose as SDD replacement (agent runtime only)
- Full replacement today — nothing matches flowspec's integrated pipeline

---

## Sources

- ForgeCode: github.com/tailcallhq/forgecode (Apache-2.0, 7.3k stars)
- Goose: github.com/block/goose (Apache-2.0, 44.7k stars)
- Shotgun: github.com/shotgun-sh/shotgun (MIT, 672 stars) / shotgun.sh
- Spec Kit: github.com/github/spec-kit (MIT, 71-75k stars)
- spec-kit-mcp: crates.io/crates/spec-kit-mcp (Rust MCP bridge, v0.1.0)
- Rig: github.com/0xPlaygrounds/rig (MIT, 7.3k stars) / rig.rs
- Kilo Code: github.com/Kilo-Org/kilocode (MIT, 19.3k stars) / kilo.ai
- AutoAgents: github.com/liquidos-ai/AutoAgents (Rust)
- OpenFANG: github.com/RightNow-AI/openfang (Rust, 16.8k stars)
- get-stuff-done-for-kilocode: github.com/punal100/get-stuff-done-for-kilocode (SDD for Kilo)
