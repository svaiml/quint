# Research: Rust-Native Alternatives to flowspec for SDD

**Date**: 2026-05-15 | **Tracked**: zombo-sash-eco-x2ne

## Executive Summary

**No single Rust-native tool replaces flowspec end-to-end today.** After investigating Goose, ForgeAI, Shotgun CLI, GitHub Spec Kit (+ Rust MCP crate), Rig, AutoAgents, and OpenFANG:

- **Goose** (44.7k stars, Rust) — agent runtime, not SDD. Could execute SDD workflows but you'd build the orchestration yourself.
- **ForgeAI** — chat gateway (TypeScript). Irrelevant.
- **Shotgun CLI** — spec generation only, not Rust, early stage. Too narrow.
- **Spec Kit + spec-kit-mcp** (71-75k stars) — closest SDD match. Rust MCP crate exists (v0.1.0) but wraps Python subprocess. Gap: no beads/br integration, no memory system, no PR workflow.
- **Rig** (5.9k stars, pure Rust) — best foundation library for building a Rust SDD tool. Not SDD itself.
- **AutoAgents** — Rust multi-agent framework (Ractor actor model). Infrastructure, not SDD.
- **OpenFANG** — Rust "Agent OS" for business automation. Wrong domain.

**Confidence**: Medium-High.

## Comparison Matrix

| Feature | flowspec | Goose | Spec Kit + MCP | Rig | Shotgun |
|---------|---------|-------|----------------|-----|---------|
| Language | Python | Rust + TS | Python + Rust wrapper | Pure Rust | Not Rust |
| SDD workflow | Full (6 phases) | None (runtime) | Full (10 tools) | None (library) | Spec gen only |
| Agent orchestration | Yes | Yes (multi-provider) | Yes (MCP) | Yes (pipelines) | No |
| Slash commands | /flow:* (4 agents) | No | /speckit.* | No | No |
| Task integration | br/beads | None | Internal only | None | None |
| Memory system | Yes | No | No | No | No |
| PR workflow | Yes | No | No | No | No |
| Rust-native | No | Yes | Wrapper only | Yes | No |
| Maturity | Production | Production | Production / v0.1.0 MCP | Production | Early |
| Stars | sashml/flowspec | ~44.7k | ~71-75k | ~5.9k | Early |

## What flowspec provides that no Rust tool matches

1. Full SDD lifecycle (assess -> specify -> plan -> implement -> validate -> submit)
2. Integrated beads-rust task tracking
3. Memory system (constitution, code standards)
4. PR submission workflow (/flow:submit-n-watch-pr)
5. Intake processing (/flow:intake)
6. Multi-agent coverage (Claude/Gemini/Codex/GH Copilot)

## Recommendations

### Option A: Keep flowspec, augment with Rust agent runtime (Short-Term)

flowspec works, is production-tested, and is a thin CLI layer — not a perf bottleneck. Use Goose or Rig as agent runtime if needed.

- Effort: Low | Risk: Low | Timeline: Immediate

### Option B: Port spec-kit core to Rust + custom SDD layer (Medium-Term)

Build `flowspec-rs` or `sdd-rs`:
1. `rig-core` for LLM abstractions
2. Reimplement spec-kit 10 tools in pure Rust
3. Native beads-rust + gm integration
4. flowspec's memory system + PR workflow

- Effort: High (4-8 weeks) | Risk: Medium | Timeline: Q3-Q4 2026

### Option C: Adopt GitHub Spec Kit + spec-kit-mcp directly

Replace flowspec with raw Spec Kit. Accept Python subprocess. Build beads integration as separate MCP server.

- Effort: Medium | Risk: Medium (lose customizations) | Timeline: 2-4 weeks

### NOT Recommended

- ForgeAI (wrong category), Shotgun (too narrow), OpenFANG (wrong domain)
- Full replacement today — nothing matches flowspec's pipeline completeness

## Sources

- Goose: github.com/block/goose (Apache-2.0, 44.7k stars)
- Spec Kit: github.com/github/spec-kit (MIT, 71-75k stars)
- spec-kit-mcp: crates.io/crates/spec-kit-mcp (Rust MCP bridge, v0.1.0)
- Rig: github.com/0xPlaygrounds/rig (MIT, 5.9k stars)
- Shotgun: github.com/shotgun-sh/shotgun
- ForgeAI: github.com/forgeai-dev/ForgeAI (TypeScript)
- AutoAgents: github.com/liquidos-ai/AutoAgents (Rust)
- OpenFANG: github.com/RightNow-AI/openfang (Rust, 16.8k stars)
