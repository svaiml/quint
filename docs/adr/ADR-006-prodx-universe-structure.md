# ADR-006: ProdX Universe Directory Structure and Governance

## Status
Proposed

## Context
The `zombo-sash-eco` ecosystem is expanding to include high-level Product Experience (ProdX) and UIX Intelligence tools. A structured way to organize original sources (like `open-codesign`) and their high-performance rewrites (like `craftegy-design`) is needed to maintain architectural integrity.

## Decision
We will establish a new top-level directory `prodx/` with the following sub-structure:

- `prodx/external/`: Contains read-only or reference clones of third-party/upstream UI projects.
- `prodx/<codename>/`: Contains the rewritten or original frameworks developed within the ecosystem.

### Governance Rules:
1.  **Porting First**: External projects in `prodx/external/` are used as reference material for the ecosystem's own implementations.
2.  **Rust/Tauri Standard**: All new internal ProdX projects MUST use Rust for core logic and Tauri for the UI layer to ensure performance and security.
3.  **Workspace Integration**: Internal ProdX projects should be part of the root workspace to share common reasoning crates (e.g., `craftegy-algo`).

## Consequences
- **Pros**: Clear separation of external vs. internal code; unified tech stack for UIX.
- **Cons**: Overhead of maintaining external clones alongside internal rewrites.
