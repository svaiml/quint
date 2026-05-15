# Feature Assessment: iris-reportanything

**Date**: 2026-05-14
**Assessed By**: Claude AI Agent
**Status**: Assessed (backfill — vision and research preceded the formal assessment)

## Backfill Note

This assessment is created *after* the substantive design work because the user requested `/flow:specify` directly. The chat-kit multimedia research (`docs/research/chat-kit-multimedia-iris-reportanything.md`, 10 surveyed projects → 10 proven patterns) and the vision doc (`docs/platform/iris-reportanything-chat-capabilities-vision.md`, 616 lines covering target architecture + anti-patterns + capabilities matrix + component API + extraction service shape + migration plan) together exceed the depth of a standalone assessment. This file exists to satisfy the rigor rule SETUP-001 (specification must be preceded by assessment) and to provide the score lookups the PRD agent reads.

## Feature Overview

ReportAnything is a multimedia-grounded reporting feature being built into Iris (the Copilot in the `emex-x-application` repo, Node.js + TypeScript stack).

Users drop *anything* — image, PDF, DOCX, XLSX, PPTX, audio, URL, code — and Iris produces a source-anchored report through a chat-as-surface dialogue. Every operation is expressed as typed message parts (`text`/`reasoning`/`tool_call`/`tool_result`/`file`/`source`/`artifact`/`step`/`tasklist`); every claim links back to a `source` part with `{doc_id, page, snippet, score}`.

The bet is **pipeline-as-Node-service + UI-as-React-kit, decoupled** — no surveyed project (out of 10 in the research) does this cleanly. If we ship it right, we have a real architectural position.

## Scoring Analysis

### Complexity Score: 7.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 7/10 | Vision phasing is realistic but the V1 scope spans 8 media categories; the migration plan alone is 6 steps; conservative estimate is 4-8 weeks for V1 |
| Component Count | 9/10 | Browser bundle, server framework, MIME registry, 8+ loaders, chunker, embedder, vector store, citation builder, SSE/WS transport, Streamdown renderer, voice surface, history layer |
| Integration Points | 7/10 | LLM provider(s), vision-LLM-as-OCR fallback, pgvector / LanceDB, transformers.js for local embeddings, whisper.cpp binding, LibreOffice CLI shell-out, Iris's existing auth + history layers (still TBD) |
| **Average** | **7.7/10** | |

### Risk Score: 6.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 7/10 | Trifecta-gate review per OWASP ASI02; file uploads have blast-radius implications; vision-LLM-as-OCR sends document images to third-party providers (must be disclosed); document content may contain PII |
| Compliance Requirements | 5/10 | Moderate — depends on `emex-x-application` host policies; vision-LLM PII routing requires consent; EU AI Act August 2026 transparency obligations apply to AI-generated reports |
| Data Sensitivity | 6/10 | User-uploaded documents may contain commercial confidential, internal financials, customer data; vector store retention and cross-tenant isolation are first-class concerns |
| **Average** | **6.0/10** | |

### Architecture Impact Score: 7.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 8/10 | Discriminated-union message-parts schema, attachment adapter, MIME loader registry, fast-path→fallback ladder, Streamdown renderer, Step/TaskList primitive — all new to Iris |
| Breaking Changes | 7/10 | Replaces switch/if dispatch with registry; replaces flat assistant strings with `Part[]`; replaces single spinner with Step/TaskList; replaces inline `[1]` citations with `source` parts. Wrapped at the boundary during migration but the target shape is a full upgrade |
| Dependencies Affected | 8/10 | Streamdown, file-type, pdf-parse, mammoth, exceljs, officeparser, tesseract.js, nodejs-whisper, @xenova/transformers, @mozilla/readability, pgvector client — new dependency set largely; affects bundle size, server runtime, deployment |
| **Average** | **7.7/10** | |

## Overall Assessment

**Total Score**: 21.4/30
**Recommendation**: **Full SDD**
**Confidence**: High

### Rationale

All three dimensions average ≥ 6.0; complexity and architecture-impact both at 7.7 (above the ≥ 7 Full SDD threshold). Total of 21.4 exceeds the 18-point Full SDD floor decisively.

This is correctly a Full SDD feature:
- Multi-component, multi-phase pipeline with concrete migration sequence
- Touches security (Trifecta-gate), compliance (EU AI Act 2026, PII routing), data sensitivity (uploads)
- Replaces several load-bearing patterns simultaneously (dispatch shape, message schema, progress UI, citation model)
- Existing repo state is acknowledged-fragmented (anti-patterns to deprecate), so migration discipline matters

### Key Factors

- **Complexity**: Large surface but well-defined (vision doc is exhaustive; not exploration territory)
- **Risk**: Moderate — security and compliance concerns are real but each has a named control (Trifecta-gate, per-loader blast-radius, AI-disclosure invariantis)
- **Impact**: High — sets the message-parts schema for all future Iris chat work, not just ReportAnything

## Next Steps

### Full SDD Path (selected)

```bash
/flow:specify iris-reportanything        # ← this command (in progress)
/flow:plan iris-reportanything           # next: architecture plan
/flow:implement iris-reportanything      # then: implementation
/flow:validate iris-reportanything       # then: validation
```

The PRD agent should:
1. Consume the vision doc (`docs/platform/iris-reportanything-chat-capabilities-vision.md`) as the load-bearing source
2. Consume the chat-kit multimedia research as the proven-patterns substrate
3. Acknowledge the 12 open questions (vision §12) requiring `emex-x-application` repo access; treat as "to be confirmed by Iris team" placeholders
4. Produce `docs/prd/iris-reportanything-spec.md`
5. Create beads implementation tickets per PRD §6

## Source Documents (substrate for the PRD agent)

- `docs/platform/iris-reportanything-chat-capabilities-vision.md` — 616-line vision (target architecture, anti-patterns, migration plan)
- `docs/research/chat-kit-multimedia-iris-reportanything.md` — 10 surveyed projects, 10 patterns extracted
- `docs/research/owasp-agentic-top10-trifecta-coverage-map.md` — security gate context
- `docs/research/headless-ui-testing-grace-v2-gap-analysis.md` — testing tier strategy
- `docs/research/agentic-management-flows.md` — Phase 0 boundary discipline
- Memory: `project_iris_copilot.md` (Iris location), `feedback_iris_node_ts.md` (stack constraint)

---

*Backfill assessment to satisfy rigor rule SETUP-001 — substantive design preceded the formal assessment artifact, 2026-05-14.*
