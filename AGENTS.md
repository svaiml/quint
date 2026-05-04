# ZomboCraftEco — Agent Onboarding

> Meta-repo for the 42-repo zombo-sash-eco ecosystem.

## Prometey Stack (10 Layers)

```
╔══════════════════════════════════════════════════════════════════╗
║  10 — PRODUCTS     craftegy-design, external refs               ║
║  09 — APPS         reasoning-apps (Polymarket, Catalyst)        ║
║  08 — EXECUTION    code-catalyst, grace-*, fpf-skill            ║
╠══════════════════════════════════════════════════════════════════╣
║  07 — BRIDGE       beads_rust (br), beads_viewer (bv), AllBeads ║
║  06 — SPEC         flowspec, FPF, haft, quint                   ║
╠══════════════════════════════════════════════════════════════════╣
║  05 — REASONING    infer (11 verbs), axiomvm, aivm,             ║
║                    craftegy-algo                                 ║
║       EPISTEMIC    criterium (HITL abduction→deduction→         ║
║                    induction loop, AssuranceLevel L0→L3)        ║
║  04 — KNOWLEDGE    codegraph-rust, codebase-memory-mcp,         ║
║                    graphify                                      ║
║  03 — MEMORY       rstmdb (state machine DB), rstmdb-studio     ║
╠══════════════════════════════════════════════════════════════════╣
║  02 — FORMAL       pctl-rs (FOUR/SIX/NINE bilattices),          ║
║                    zz-notation (meta-reasoning, Belnap truth),   ║
║                    fpf-cards (CSC/DRR/EFP), obstruct            ║
║  01 — INFRA        o2l (language), ctop (protocol), inferense,  ║
║                    invariantis, npd-cipher, vaultura, myria      ║
╠══════════════════════════════════════════════════════════════════╣
║  00 — KERNEL-FORGE bfc (container), bfcfs-linux, bfc-httpd      ║
╚══════════════════════════════════════════════════════════════════╝
```

**Two sub-stacks:**
- **Intelligence Stack** (00→05): Makes reasoning possible
- **Agentic Stack** (06→10): Makes agents act on that reasoning
- **Crossover**: Layer 05→06 — infer proves specs satisfy invariants before agents execute

## Workspace Areas (5)

| Area | Path | What lives here |
|------|------|----------------|
| **reasoning-universe/** | Layers 02+05 | infer, pctl-rs, zz-notation, fpf-cards, axiomvm, aivm, craftegy-algo, obstruct |
| **epistemic-universe/** | Layer 05 | criterium (HITL reasoning loop) |
| **infra-eco/** | Layers 00-03 | o2l, rstmdb, ctop, bfc, myria, vaultura, inferense, invariantis |
| **tools/** | Layers 04-07 | flowspec, codegraph-rust, beads_rust, haft, FPF, quint |
| **apps/ + prodx/** | Layers 08-10 | reasoning-apps, code-catalyst, craftegy-design |

## Per-Repo AGENTS.md

| Repo | Layer | AGENTS.md | Key onboarding info |
|------|-------|-----------|-------------------|
| **infer** | 05 | [Yes](reasoning-universe/infer/AGENTS.md) | 11 verbs, 49+ examples, 6 ecosystem bridges |
| **pctl-rs** | 02 | [Yes](reasoning-universe/pctl-rs/AGENTS.md) | FOUR/SIX/NINE bilattices, CLI, from_interval semantics |
| **zz-notation** | 02 | [Yes](reasoning-universe/zz-notation/AGENTS.md) | Entity/state/invariant, InferBridge, Quint bridge |
| **criterium** | 05 | [Yes](epistemic-universe/criterium/AGENTS.md) | HITL loop, AssuranceLevel L0→L3, abduction→deduction→induction |
| **fpf-cards** | 02 | [Yes](reasoning-universe/fpf-cards/AGENTS.md) | CSC/DRR/EFP card validators, real-world scenario |

## Key Ecosystem Patterns

### Bridge Pattern (don't modify upstream)
```
zz-bridge-quint  — quint typecheck → ZZ entities
infer-pctl       — AAF → DTMC probabilistic verification
infer-rstmdb     — governance → persistent state machines
infer-fpf-cards  — KB facts → validated FPF cards
```

### Bilattice Hierarchy
```
FOUR (2²=4)  →  SIX ([3]×[2]=6)  →  NINE (3²=9)
  T/F/⊤/⊥       ◇t/□t/◇f/□f/⊥/⊤     3×3 quality tiers
  basic           weak/strong            F-G-R weighted
                  coarsen→FOUR
```

### Criterium Loop (epistemic-universe)
```
HUMAN → ABDUCTION (FPF) → DEDUCTION (infer) → INDUCTION (pctl-rs) → STORE (zz/rstmdb)
  ↑         L0                   L1                    L2                       │
  └──────────────── review, refine, raise assurance (L3 = operational) ────────┘
```

## Bootstrapping with gh CLI (required prerequisite)

`gh` is the only tool needed — no SSH keys, works on Linux, macOS, and Windows.
Install: https://cli.github.com

```bash
# One-time authentication (all platforms)
gh auth login
```

`clone-ecosystem.sh` uses `gh repo clone` for every repo — public and private alike.
Any repo that returns FAILED needs explicit access grant on the svaiml org.

## Quick Commands

```bash
# Bootstrap (first time)
gh repo clone svaiml/ZomboCraftEco zombocrafteco
cd zombocrafteco && git checkout develop   # or feature/<name>
./bin/clone-ecosystem.sh .

# Daily
uv run python bin/eco-sync sync        # fetch + pull all
uv run python bin/eco-sync delta       # what changed?
uv run python bin/eco-sync report infer --latest 5

# Workflow
flowspec triage --session              # session priorities
flowspec board --top 3                 # project board
br ready                               # what's actionable
br update <id> --status=in_progress    # claim work

# Multi-repo
gita ll                                # all repos status
gita super reasoning pull              # pull reasoning group
```
