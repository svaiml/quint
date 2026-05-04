# Specification: Prometey Stack Monorepo Restructuring

## 1. Technical Implementation Approach

### Phase 1: Preparation (Inventory)
- [ ] Map every existing top-level directory and `SpecDriven` subdirectory to a Prometey category.
- [ ] Identify all cross-repo symlinks and `package.json` / `Cargo.toml` / `go.mod` path references.
- [ ] Identify all build scripts (e.g., in `PaperClipCompany/scripts`) that rely on absolute or relative paths.

### Phase 2: Category Scaffolding
- [ ] Create 01-08 root-level folders:
    - `01_Memory/`
    - `02_Knowledge/`
    - `03_Spec/`
    - `04_Bridge/`
    - `05_Execution/`
    - `06_Orchestration/`
    - `07_Infra/`
    - `08_Research/`

### Phase 3: Migration (Surgical Moves)
- [ ] Move folders into the new structure.
- [ ] Update all `package.json`, `Cargo.toml`, and internal scripts using an automated `sed` or `replace` script where possible.
- [ ] Update `.gitignore` and `.github/workflows` to reflect new paths.
- [ ] Update the `pnpm-workspace.yaml` (in `PaperClipCompany`) to point to the new package locations.

### Phase 4: Validation
- [ ] Run `pnpm install` and `cargo check` to verify dependencies.
- [ ] Run basic CI/CD (lint/test) locally.
- [ ] Verify that the `backlog` and `flowspec` tools correctly identify the new task locations.

## 2. Key Milestones
- **M1: Mapping Complete**: All current files/folders assigned to 01-08 categories.
- **M2: Scaffolding Ready**: Category folders created.
- **M3: Transition Phase**: Folders moved and internal paths updated.
- **M4: Validation Phase**: All projects build and tests pass.

## 3. Risk Areas & Mitigations
- **Hidden Dependencies**: Some scripts may use hardcoded absolute paths. Mitigation: Full-repo grep for absolute paths after migration.
- **Tool Breakage**: `flowspec`, `backlog`, and `allbeads` might lose track of the `.beads` databases. Mitigation: Verify tool-specific configs (like `config.yaml` or `.allbeads/config`) early.
- **Version Control Complexity**: `git mv` should be used to preserve history.
