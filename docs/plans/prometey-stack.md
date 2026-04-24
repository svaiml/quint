# Implementation Plan: Prometey Stack Monorepo Restructuring

## 1. Directory Mapping (Inventory)

| Source Folder | Prometey Category | Target Path |
| :--- | :--- | :--- |
| `memory` | 01_Memory | `01_Memory/memory` |
| `SpecDriven/graphiti` | 01_Memory | `01_Memory/graphiti` |
| `SpecDriven/specmem` | 01_Memory | `01_Memory/specmem` |
| `SpecDriven/graphify` | 02_Knowledge | `02_Knowledge/graphify` |
| `SpecDriven/codegraph` | 02_Knowledge | `02_Knowledge/codegraph` |
| `Grounding` | 02_Knowledge | `02_Knowledge/Grounding` |
| `SpecDriven/intent-spec-kit`| 03_Spec | `03_Spec/intent-spec-kit` |
| `SpecDriven/tessl-cli` | 03_Spec | `03_Spec/tessl-cli` |
| `SpecDriven/tessl-tile` | 03_Spec | `03_Spec/tessl-tile` |
| `SpecDriven/contextflow-forge`| 03_Spec | `03_Spec/contextflow-forge` |
| `SpecDriven/spec-driven-feature-factory` | 03_Spec | `03_Spec/spec-driven-feature-factory` |
| `SpecDriven/AllBeads` | 04_Bridge | `04_Bridge/AllBeads` |
| `backlog` | 04_Bridge | `04_Bridge/backlog` |
| `.beads` | 04_Bridge | `04_Bridge/.beads` |
| `SpecDriven/master-plan` | 04_Bridge | `04_Bridge/master-plan` |
| `SpecDriven/vibescaffold` | 05_Execution | `05_Execution/vibescaffold` |
| `PaperClipCompany` | 06_Orchestration | `06_Orchestration/PaperClipCompany` |
| `SpecDriven/gsd-2` | 06_Orchestration | `06_Orchestration/gsd-2` |
| `SpecDriven/flowspec` | 06_Orchestration | `06_Orchestration/flowspec` |
| `SpecDriven/cronus` | 06_Orchestration | `06_Orchestration/cronus` |
| `Optimization` | 07_Infra | `07_Infra/Optimization` |
| `ctop` | 07_Infra | `07_Infra/ctop` |
| `docs` | 08_Research | `08_Research/docs` |
| `ResearchReport_*.md` | 08_Research | `08_Research/reports/` |
| `AI-Native` | 08_Research | `08_Research/AI-Native` |
| `grace-marketplace` | 08_Research | `08_Research/grace-marketplace` |

## 2. Execution Steps

### Step 1: Scaffolding
```bash
mkdir 01_Memory 02_Knowledge 03_Spec 04_Bridge 05_Execution 06_Orchestration 07_Infra 08_Research
mkdir 08_Research/reports
```

### Step 2: Surgical Moves (Git-Native)
Use `git mv` for all moves to preserve history.
Example:
```bash
git mv memory 01_Memory/
git mv SpecDriven/graphiti 01_Memory/
...
```

### Step 3: Reference Updates
- [ ] Update `pnpm-workspace.yaml` in `PaperClipCompany`.
- [ ] Update `Cargo.toml` workspace members if applicable.
- [ ] Search and replace all `../` references in `package.json` files that were depth-increased.
- [ ] Update root-level steering files: `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`.

### Step 4: Tool Configuration
- [ ] Update `.flowspec/config.yml` (if it exists) or `flowspec_workflow.yml` path references.
- [ ] Update `backlog/config.yml` paths for tasks and status tracking.

## 3. Verification Plan
- [ ] **Structural Check**: Run `tree -L 2` to verify the new hierarchy.
- [ ] **Dependency Check**: Run `pnpm install` in orchestration/execution folders.
- [ ] **Workflow Check**: Verify `backlog task list` still works.
- [ ] **Build Check**: Run `cargo check` in `ctop`.
