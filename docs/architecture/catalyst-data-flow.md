# Catalyst — Component Map & Data Flow

**App**: `apps/reasoning-apps/apps/catalyst/`
**Domain**: Family law / custody case analysis (HIPAA-compliant)
**Updated**: 2026-04-24

---

## Component Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CATALYST  REASONING  APP                            │
│                                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────────────────────┐   │
│  │   ENTRY      │    │                  PIPELINE                        │   │
│  │              │    │  ┌─────────┐  ┌────────────────────────────────┐ │   │
│  │  CLI / API   │───►│  │ config  │  │           runner               │ │   │
│  │  (server.py) │    │  └─────────┘  └──────────────┬─────────────────┘ │   │
│  └──────────────┘    └─────────────────────────────┼────────────────────┘   │
│                                                    │                        │
│              ┌─────────────────────────────────────┼──────────────────┐     │
│              │             CONNECTORS               │                  │     │
│              │                                     ▼                  │     │
│              │  ┌──────────────┐  ┌──────────────────────────────┐   │     │
│              │  │ case_intake  │  │     document_parser           │   │     │
│              │  │ (YAML/form)  │  │  (PDF → structured facts)    │   │     │
│              │  └──────┬───────┘  └──────────────┬───────────────┘   │     │
│              └─────────┼─────────────────────────┼───────────────────┘     │
│                        │                         │                          │
│              ┌──────── ▼─────────────────────────▼──────────────────┐      │
│              │                    ANALYTICS                          │      │
│              │                                                       │      │
│              │  ┌───────────┐ ┌────────────┐ ┌───────────────────┐  │      │
│              │  │  factors  │ │foundations │ │    statutory       │  │      │
│              │  │(14 family │ │(legal basis│ │  (statute match)  │  │      │
│              │  │  factors) │ │ & history) │ │                   │  │      │
│              │  └─────┬─────┘ └─────┬──────┘ └────────┬──────────┘  │      │
│              │        │             │                  │             │      │
│              │  ┌─────▼─────┐  ┌───▼────────────────┐ │             │      │
│              │  │ mh_triage │  │    qa_engine        │◄┘             │      │
│              │  │(mental    │  │ (Q&A over facts)    │               │      │
│              │  │ health)   │  └─────────────────────┘               │      │
│              │  └─────┬─────┘                                        │      │
│              └────────┼─────────────────────────────────────────────┘      │
│                       │                                                     │
│              ┌─────── ▼────────────────────────────────────────────┐        │
│              │              REASONING BRIDGES                       │        │
│              │                                                      │        │
│              │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │        │
│              │  │infer_bridge │  │rstmdb_bridge │  │pctl_bridge │  │        │
│              │  │ (5-verb     │  │(state machine│  │(probabilis-│  │        │
│              │  │  logic)     │  │  timeline)   │  │ tic check) │  │        │
│              │  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │        │
│              │         │                │                 │         │        │
│              │  ┌──────▼──────┐  ┌──────▼──────────────┐ │         │        │
│              │  │axiomvm_     │  │invariantis_bridge   │◄┘         │        │
│              │  │bridge       │  │(immutable proof     │           │        │
│              │  │(formal VM)  │  │    ledger)          │           │        │
│              │  └──────┬──────┘  └──────┬──────────────┘           │        │
│              └─────────┼────────────────┼─────────────────────────┘        │
│                        │                │                                   │
│         ┌──────────────▼────────┐   ┌───▼──────────┐  ┌─────────────────┐  │
│         │      STORAGE          │   │  COMPLIANCE  │  │   REPORTING     │  │
│         │  ┌────────────────┐   │   │  ┌────────┐  │  │  ┌──────────┐   │  │
│         │  │  duckdb_store  │   │   │  │ hipaa  │  │  │  │ renderer │   │  │
│         │  │  (facts, audit,│   │   │  │(access │  │  │  │(JSON +   │   │  │
│         │  │   results)     │   │   │  │ log)   │  │  │  │Markdown) │   │  │
│         │  └────────────────┘   │   │  └────────┘  │  │  └──────────┘   │  │
│         └───────────────────────┘   └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
 EXTERNAL INPUT                CATALYST                          EXTERNAL ENGINES
 ──────────────                ───────────────────────────       ────────────────

 Case YAML / PDF ──►  [case_intake]                             ┌────────────┐
                       [document_parser]                   ───► │   infer    │
                            │                              │    │ (5-verb    │
                            ▼                              │    │  logic)    │
                       [Analytics Layer]                   │    └────────────┘
                         factors →                         │
                         statutory →  ──────────────────── │    ┌────────────┐
                         foundations →                     ───► │   rstmdb   │
                         mh_triage →                       │    │ (timeline) │
                         qa_engine                         │    └────────────┘
                            │                              │
                            ▼                              │    ┌────────────┐
                      [Reasoning Bridges] ─────────────────┤──► │  axiomvm   │
                       infer_bridge                        │    │(formal VM) │
                       rstmdb_bridge                       │    └────────────┘
                       pctl_bridge                         │
                       axiomvm_bridge                      │    ┌────────────┐
                       invariantis_bridge ─────────────────┤──► │  pctl-rs   │
                            │                              │    │(probabilis-│
                            │                              │    │ tic check) │
                  ┌─────────┼──────────┐                   │    └────────────┘
                  │         │          │                   │
                  ▼         ▼          ▼                   │    ┌────────────┐
             [duckdb_    [hipaa    [invariantis] ──────────┘──► │invariantis │
              store]     audit]   proof record                  │(proof      │
                  │                                             │ ledger)    │
                  │                                             └────────────┘
                  ▼
            [renderer]
                  │
                  ├──► report.json
                  └──► report.md
```

---

## Layer Summary

| Layer | Modules | Purpose |
|-------|---------|---------|
| **Entry** | `cli.py`, `server.py` | FastAPI HTTP server + CLI |
| **Pipeline** | `config`, `runner` | Orchestration — loads config, sequences all stages |
| **Connectors** | `case_intake`, `document_parser` | Ingest YAML case files and PDF/text documents |
| **Analytics** | `factors`, `foundations`, `statutory`, `mh_triage`, `qa_engine` | Family law factor scoring, statutory matching, mental health triage, Q&A |
| **Reasoning Bridges** | `infer_bridge`, `rstmdb_bridge`, `pctl_bridge`, `axiomvm_bridge`, `invariantis_bridge` | Calls external reasoning engines; returns typed results |
| **Storage** | `duckdb_store` | Persists all facts, interim results, and audit events to DuckDB |
| **Compliance** | `hipaa` | HIPAA access log (JSONL audit trail per record access) |
| **Reporting** | `renderer` | Renders final JSON + Markdown reports from engine outputs |

---

## Key Data Objects

```
CaseFile (YAML)
  └── CaseIntake
        ├── parties[], children[], facts[]
        └── documents[]
              └── ParsedDocument
                    └── ExtractedFacts[]

AnalyticsResult
  ├── FactorScores (14 BIC factors)
  ├── StatutoryMatches[]
  ├── MHTriageResult
  └── QAResponse[]

ReasoningResult
  ├── InferOutput   (.infer + .json)  ← 5-verb proof
  ├── AxiomProof    (.ax + .proof)    ← formal axiom check
  ├── PctlResult    (Belnap values)   ← probabilistic check
  └── ProofLedger   (invariantis)     ← immutable record

FinalReport
  ├── analysis.json
  └── analysis.md
```

---

## Compliance

All record access is logged to `data/audit/hipaa_access.jsonl`.
Proof records are pinned to `invariantis` (immutable, append-only).
Case data stays in DuckDB (`data/catalyst.duckdb`) — never leaves the node.
