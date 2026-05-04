# PRD: ProdX Universe and Craftegy-Design Framework

## 1. Executive Summary
The **ProdX Universe** is a new top-level architectural layer in the `zombo-sash-eco` ecosystem dedicated to **Product Experience** and **UIX Intelligence**. The core project in this layer is **Craftegy-Design** (codename: ZomboDesign), a high-performance rewrite of the `open-codesign` artifact generation framework.

## 2. Problem Statement
The current `open-codesign` framework is implemented using TypeScript and Electron, which introduces significant runtime overhead and bloat. To align with the ecosystem's high-performance standards (Rust/Tauri) and integrate with the `craftegy` reasoning engines, a clean architectural separation and a performant rewrite are required.

## 3. User Stories

### US.1: Ecosystem Integration
**As a** Developer,
**I want** a dedicated place in the repository for UIX-related tools,
**So that** architectural concerns for Product Experience are clearly separated from core reasoning and infra.

*   **AC.1.1**: `prodx/` directory exists at the root.
*   **AC.1.2**: `prodx/external/` contains a clone of the original `open-codesign` repository.
*   **AC.1.3**: `eco-sync` correctly detects and manages the new `prodx` groups.

### US.2: Framework Rewrite (Craftegy-Design)
**As a** Product Engineer,
**I want** the framework to be rewritten in Rust and Tauri,
**So that** it is lightweight, secure, and easily integrates with existing Rust-based reasoning engines like `infer` and `craftegy-algo`.

*   **AC.2.1**: `prodx/craftegy-design/` is initialized as a Rust/Tauri project.
*   **AC.2.2**: The core logic is ported from TS to Rust.
*   **AC.2.3**: Artifact generation logic leverages `craftegy-algo` for layout optimization.

## 4. Functional Requirements
*   **FR.1**: The `eco-sync` tool must support the `prodx` and `prodx-external` groups.
*   **FR.2**: `ECOSYSTEM.md` must accurately reflect the ProdX layer.
*   **FR.3**: The `craftegy-design` crate must be able to reference `craftegy-algo` as a workspace dependency.

## 5. Non-Functional Requirements
*   **Performance**: The Rust/Tauri implementation must have at least 50% faster startup time compared to Electron.
*   **Memory Usage**: Peak memory usage should be under 200MB for standard artifact generation.
*   **Scalability**: The `prodx/` layer should be designed to house future UIX intelligence tools.

## 6. Success Metrics
*   Successful synchronization of all 31+ repositories (including the 2 new ones) via `eco-sync`.
*   Zero build warnings in the newly initialized `craftegy-design` crate.

## 7. Dependencies
*   `gita`: For multi-repo management.
*   `Tauri`: For the UI layer.
*   `craftegy-algo`: For graph-based design logic.

## 8. Risks and Mitigations
*   **Risk**: High complexity of porting complex TS logic to Rust.
*   **Mitigation**: Use `prodx/external/open-codesign` as a literal reference and port modules incrementally.

## 9. Out of Scope
*   Porting all 20+ models support in Phase 1.
*   Finalizing the Electron-to-Tauri migration for the UI layer in the initial setup.
