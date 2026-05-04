# ADR-007: Craftegy-Design Architecture (Rust/Tauri)

## Status
Proposed

## Context
The `open-codesign` framework provides a powerful model for artifact generation but is constrained by Electron's resource usage. `Craftegy-Design` (ZomboDesign) aims to provide the same functionality with better performance and deeper integration with the `craftegy-algo` graph engines.

## Decision
`Craftegy-Design` will be architected as follows:

1.  **Backend (Rust)**:
    -   State management and artifact generation logic in Rust.
    -   Direct dependency on `craftegy-algo` for layout and structural optimization.
    -   Support for multiple LLM providers via a common trait interface.
2.  **Frontend (Tauri + React/TS)**:
    -   Tauri for the desktop shell (replacing Electron).
    -   Clean separation between UI components and generation logic.
3.  **Core Integration**:
    -   Use `rstmdb` for local state persistence of design artifacts.
    -   Use `infer` to validate design constraints and architectural invariants.

## Consequences
- **Pros**: Massive reduction in memory footprint; type-safe artifact generation; ecosystem-wide consistency.
- **Cons**: High initial effort to port complex TypeScript generation logic to Rust.
