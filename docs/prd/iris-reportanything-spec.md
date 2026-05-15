# PRD: Iris / ReportAnything — Multimedia-Grounded Reporting Surface

**Status**: Full SDD
**Assessment ref**: `docs/assess/iris-reportanything-assessment.md` (Complexity 7.7, Risk 6.0, Architecture Impact 7.7, Total **21.4 / 30 → Full SDD**)
**Vision ref**: `docs/platform/iris-reportanything-chat-capabilities-vision.md` (616 lines — target architecture, anti-patterns, migration plan, capabilities matrix, component & service shape)
**Research ref**: `docs/research/chat-kit-multimedia-iris-reportanything.md` (10 surveyed projects → 10 proven patterns)
**Beads parent**: `docs-z9xg`
**Date**: 2026-05-14
**Home repo**: `emex-x-application` (Iris is the Copilot component there; this PRD lives in `/home/sash/docs/` for research-handoff and is intended to be mirrored as a GitHub issue / ADR in `emex-x-application` once Iris team is engaged)

---

## All Needed Context (read these first)

1. **Vision (canonical target architecture)**: `docs/platform/iris-reportanything-chat-capabilities-vision.md` — every architectural claim in this PRD references it as `vision §X.Y` and does not duplicate its content
2. **Assessment**: `docs/assess/iris-reportanything-assessment.md` — score backfill (21.4/30, Full SDD)
3. **Research (proven patterns)**: `docs/research/chat-kit-multimedia-iris-reportanything.md` — 10 patterns from 5 chat UI kits + 5 full-stack apps; load-bearing Node/TS references are LibreChat (MIT) and AnythingLLM (MIT)
4. **Security gate**: `docs/research/owasp-agentic-top10-trifecta-coverage-map.md` — Trifecta-gate review applies per loader; ASI02 blast-radius per file upload
5. **Test strategy**: `docs/research/headless-ui-testing-grace-v2-gap-analysis.md` — two-tier model (handler-chain via vitest+jsdom for logic; Playwright `browser_snapshot` only for canvas/layout)

Cross-link tickets (existing, do not re-create):
- `docs-z9xg` — parent vision ticket (this PRD's parent)
- `docs-xbp2` — ASI02 per-tool blast-radius spec (cross-link from ticket #17)
- `docs-yq2y` — invariantis AI-disclosure field (cross-link from ticket #18)

---

## 1. Executive Summary

### Problem

The Iris Copilot in `emex-x-application` accepts user attachments via primitive dispatch — `switch(messageType)` + chained `if/elif`, mixed message shapes, three separate handlers for drag/paste/picker, client-side parsing leaking into the browser bundle, a single "loading…" spinner across upload→parse→embed→index, and citations baked into the assistant text as `[1]`/`[2]` strings. The maintainer flagged (2026-05-14) that the current code is "too naive — primitive dispatch, no schema discipline; switch/if where a registry/discriminated-union belongs; style-fragmented; half-finished logic from parent branch sitting in the repo." (vision §0 & §2)

The customer-facing consequence: users today cannot reliably drop *anything* and get a source-anchored report. Scanned PDFs fail silently; DOCX legacy `.doc` are unsupported; OCR fires on every image (wasting tokens vision models would handle natively); audio is hand-rolled; URL ingestion is missing. There is no progressive UI showing which stage of the pipeline is running — the user sees one spinner then either a wall of text or "sorry, couldn't parse." The chat surface is not actually a *report* surface; it is a one-shot generation that loses provenance the moment the assistant replies.

### Proposed solution

**ReportAnything is Iris's multimedia-grounded reporting surface** (vision §1). A user drops anything — PDF, scanned image folder, meeting recording, screenshot, URL — and Iris produces a **source-anchored report** through a chat-as-surface dialogue, with every operation expressed as typed message parts and every claim linked to a `source` part with `{doc_id, page, snippet, score}`.

The bet is **pipeline-as-Node-service + UI-as-React-kit, decoupled** — no surveyed project (out of 10 in the research) does this cleanly. If we ship it right, we have a real architectural position.

Three load-bearing decisions:
1. **Canonical `message.parts[]` discriminated-union schema** (vision §4.1) replaces flat strings + bespoke fields — one source of truth across renderer, transport, persistence
2. **MIME loader registry** (vision §5.1) replaces switch/if dispatch — adding a media type means registering a loader; removing one means unregistering
3. **Fast-path → fallback ladder per loader** (vision §5.2) — `pdf-parse` → `tesseract.js` → vision-LLM-as-OCR — with confidence gates, replacing "first parser wins, otherwise sorry"

Concrete TypeScript schema for the message-parts union lives in vision §4.1 (12 part types: `text`, `reasoning`, `tool_call`, `tool_result`, `file`, `source`, `artifact`, `step`, `tasklist` — adding a 13th requires an ADR per vision §10). Concrete loader registry shape lives in vision §5.1.

### Success metrics

**North Star Metric**: % of report sessions that end with a user-accepted report (not regenerated, not abandoned) — measures whether the chat-anchored report flow actually delivers the outcome users want.

**Leading metrics**:
- Time-to-first-`Step`-event (UX responsiveness; target < 2s)
- Parser confidence rate per loader (proxy for fallback-ladder health)
- Vision-LLM-as-OCR success rate (cost ↔ quality trade-off signal)

**Lagging metrics**:
- Weekly active ReportAnything users
- Reports-per-user-per-week
- Citation click-through (source parts engaged — proves the source-anchoring is *used*, not just present)

Provisional V1 targets (refine post-concierge test, ticket #16):
- > 70% report acceptance
- < 2s first-event latency
- < 10% regen rate
- > 30% citation click-through on reports with >5 sources

### Business value and strategic alignment

ReportAnything establishes Iris's architectural identity beyond "yet another chat." The decoupled pipeline + UI position is unique among 10 surveyed projects (research §6). It also sets the message-parts schema that every future Iris chat feature will use — not just ReportAnything (assessment §Architecture Impact). The Full SDD recommendation reflects the schema's load-bearing role.

### Assessment score reference

Per `docs/assess/iris-reportanything-assessment.md`:
- Complexity **7.7/10** (8 V1 media categories, 6-step migration, 4-8 weeks for V1)
- Risk **6.0/10** (Trifecta-gate per loader; vision-LLM routes content to third parties; EU AI Act Aug 2026 disclosure)
- Architecture Impact **7.7/10** (new schema, registry, fallback ladder, Streamdown, Step/TaskList — all new to Iris)
- **Total 21.4/30 → Full SDD** (above the 18-point floor decisively)

---

## 2. User Stories and Use Cases

### 2.1 Personas

**P1 — Domain analyst (Anya)**: Mid-career analyst at a regulated firm. Drops PDFs (mix of native and scanned), DOCX, XLSX, and URLs daily; needs every cited fact traceable to a page number for compliance review. Pain: current Iris loses citations to `[1]` strings; scanned PDFs fail silently.

**P2 — Compliance officer (Olu)**: Reviews AI-generated artifacts for EU AI Act disclosure conformance. Drops complete document bundles into a single chat to ask "what does this say about X, with sources." Pain: current Iris does not declare which third-party providers saw the document; cannot certify the report for downstream use.

**P3 — Casual report writer (Mei)**: Knowledge worker who occasionally synthesizes a meeting recording + 2-3 reference docs + a YouTube link into a 1-page briefing. Pain: current Iris cannot ingest audio; cannot pull a YouTube transcript; the "what's it doing right now?" spinner is opaque.

### 2.2 User journeys

**Journey A — Drop-a-PDF-get-a-report (Anya, V1)**:
1. Anya drags a 24-page mixed (native + scanned-page) regulatory PDF into the chat
2. Iris emits `Step: "Upload (0.4s)"`, then `Step: "PDF: fast-path (0.8s)"`, then `Step: "PDF: fast-path empty-pages-ratio 0.6 — entering fallback ladder"`, then `Step: "PDF: tesseract.js (4.2s) — succeeded"`
3. Inline 1st-page preview appears; full text becomes an artifact part
4. Anya types: "summarize section 3 with citations"
5. Iris streams a markdown artifact via Streamdown; every claim has hover-card `source` parts citing page numbers and confidence scores
6. Anya clicks a citation; the renderer jumps to the cited page in the artifact

**Journey B — Talk-to-audio-recording (Mei, V1)**:
1. Mei drops a 23-minute meeting recording (m4a)
2. Iris streams partial transcript via `Step` events as `nodejs-whisper` processes (no opaque spinner)
3. Transcript artifact appears with timestamp source parts (`start_ms`, `end_ms`)
4. Mei asks: "what action items did we agree on?"
5. Iris produces a markdown artifact with action items; each item links to a `source` part with the audio timestamp where the agreement happened
6. Mei clicks an action item; the audio player jumps to that timestamp

**Journey C — Multi-doc synthesis (Olu, V1)**:
1. Olu drops three DOCX files + one URL into the same chat in succession
2. Iris parallelizes loaders; emits a `TaskList` with one item per source; each item transitions `pending → running → done` independently
3. Olu types: "draft a 1-page summary citing all four sources"
4. Iris produces a `artifact[kind: 'markdown']` with disclosure footer (`ai_assistance: substantial`, list of providers that saw content)
5. Olu exports as PDF; disclosure footer travels with the export

### 2.3 Detailed user stories with acceptance criteria

**US-1 (Anya)**: As a domain analyst, I drop a scanned regulatory PDF and get a citation-anchored summary so that I can defend my analysis with page-level traceability.
- AC: Scanned-page PDFs route through the fallback ladder (vision §5.2)
- AC: Every claim in the generated report has at least one `source` part (citation builder, ticket #13)
- AC: Citations carry `{doc_id, page, snippet, score}` — never inline `[1]` strings (vision §8 #6)

**US-2 (Olu)**: As a compliance officer, I see which third-party providers saw the document content before submitting so that I can certify the report for downstream use.
- AC: Consent gate triggers when remote provider + PII heuristic (ticket #18)
- AC: Generated artifact carries `ai_assistance` + `ai_tools_used` + `pii_routed` metadata
- AC: Exported MD/HTML/PDF preserve the disclosure footer

**US-3 (Mei)**: As a casual report writer, I drop a meeting recording and see streaming progress so that I can tell whether to wait or come back later.
- AC: `Step` events emit streaming partial transcript (vision §3 row 7)
- AC: No single "loading…" spinner — multi-stage operations use `Step` / `TaskList` (vision §8 #5)
- AC: Source parts include `start_ms`/`end_ms` for click-to-jump

**US-4 (Anya)**: As a domain analyst, I see which loader stage failed when extraction fails so that I can retry with a different format.
- AC: Unsupported MIME returns clean error (not 500; vision §1 "Everything else → unsupported with a clear message, not a silent failure")
- AC: All-engines-failed surface a labeled `Step[status: failed]` (vision §5.2)
- AC: Failure does not corrupt thread history (history append is atomic)

**US-5 (Olu)**: As a compliance officer, I re-open a past report and find every citation still resolves so that audit trail is durable.
- AC: `source` parts persist with the message; history GET returns full Part[] (vision §5.4)
- AC: Citation click jumps to the cited page/chunk on re-open
- AC: `pgvector` retains chunks per-tenant; cross-tenant retrieval returns empty (ticket #13)

**US-6 (Mei)**: As a casual report writer, I export the report as PDF and the disclosure footer is preserved so that recipients know it is AI-generated.
- AC: Export preserves disclosure metadata in the rendered footer (ticket #18)

### 2.4 Edge cases and error scenarios

| Scenario | Expected behavior | Loader/Owner |
|---|---|---|
| Corrupt PDF (zero readable bytes) | `Step[failed]: "PDF: fast-path failed — ladder exhausted"` clean error to user | PdfLoader (#7) |
| Password-protected DOCX | `UnsupportedMediaError` with hint "remove password protection or share decrypted copy" | DocxLoader (#9) |
| Vision-LLM-as-OCR timeout (> 30s) | Ladder advances to next engine; `Step[detail]` shows timeout | PdfLoader (#7) |
| RAG miss (no chunks above threshold) | Generated report includes "no sources retrieved for this claim" inline; `source` part with `{score: 0}` | Citation builder (#13) |
| File > 50 MB | Client-side check rejects with clear message; server is the source of truth and rejects again | `<ReportAnything>` (#5) + service (#6) |
| Audio file with no speech | `Step[done]: "AudioLoader: transcribed 0 segments"` and graceful "no transcript" message | AudioLoader (#11) |
| URL returns 404 / 403 | Clean error with the HTTP status; not "sorry, couldn't parse" | UrlLoader (#12) |
| YouTube without transcript | Falls back to audio-track download + nodejs-whisper, or returns "no transcript available" | UrlLoader (#12) |
| Heic decode failure on iOS upload | Clean error; suggest re-export as PNG | ImageLoader (#8) |
| Mid-stream cancel by user | `LoadContext.signal` aborts all engines; partial Step events show `cancelled` | Service skeleton (#6) |
| LLM provider rate-limit | Fallback engine in the ladder advances; user sees `Step[detail]` with retry-after | PdfLoader (#7), ImageLoader (#8) |

---

## 3. DVF+V Risk Assessment

| Risk | Rating | Notes | Validation plan |
|---|---|---|---|
| **Desirability (Value)** | MEDIUM | Will users actually use a chat-anchored report flow, or do they expect a separate "report builder" UI? Vision §13 admits 70% confidence on V1 scope holding. | **Concierge test, 5 users (ticket #16)** on V1 PDF + DOCX path. Threshold: ≥4/5 successful end-to-end with no major abandon → green-light V2; ≤2/5 → pivot framing. Run **before** V2 scope decisions. |
| **Usability** | MEDIUM | Is per-stage `Step` / `TaskList` UI legible? Vision §10 cites the temptation to "just bypass the stream for fast cases" — fragmentation enters there. | **Hallway test** on the progress UI as part of the concierge sessions (ticket #16); WCAG 2.1 AA review on `<ReportAnything>` (ticket #5 AC); two-tier test model per `headless-ui-testing-grace-v2-gap-analysis.md`. |
| **Feasibility** | HIGH | Vision-LLM-as-OCR cost/latency tolerance on real-world PDFs is unknown. Vision §13 confidence: 85% on fallback-ladder shape but "uncertainty on which specific engines win in production." Python-only Marker/Docling may be tempting but explicitly rejected for in-process pipeline (vision §6) unless ADR approves peer service. | **Spike: Marker vs Docling vs vision-LLM-as-OCR on 100-PDF fixture set (ticket #14)**. Output: docs/research/iris-reportanything-pdf-ocr-spike-YYYY-MM-DD.md with verdict, ladder order, optional Python-sidecar ADR. **Gate before #7 ships**. |
| **Viability** | MEDIUM | Bundle-size hit from Streamdown + parser dependency set could break Iris's existing browser budget (vision §12 Q6 is TBC). | **Bundle-budget audit (ticket #15)** before/after Streamdown adoption; CI assertion that no parser libs leak into the browser bundle. **Gate before #3 and #5 ship**. |

**Cross-cutting risks already named**:
- Security: per-loader blast-radius declaration (ticket #17) — LibreOffice CLI shell-out (#9), vision-LLM-as-OCR external-write (#7), URL fetching (#12) all need explicit Trifecta-gate review
- Compliance: EU AI Act Aug 2026 transparency requires AI-disclosure (ticket #18); third-party PII routing requires consent gate
- License: Open-WebUI and LobeChat for *design reference only*; Python-only libraries require ADR for peer-service deployment (vision §6, §8 #7)
- Migration discipline: vision §9 prescribes one-loader-per-week, NOT big-bang; the audit step (#1) is the load-bearing non-negotiable

**Highest-risk assumption** (SVPG lens): users will accept the chat-as-report-surface bet. If concierge test (ticket #16) returns ≤2/5 successful, the entire framing pivots — every other ticket downstream changes priority. Run #16 alongside #14 and #15 as **fastest cheapest validation** before committing engineering capacity beyond audit (#1) + schema (#2) + skeleton (#5/#6).

---

## 4. Functional Requirements

### 4.1 Core capabilities — per-media matrix

V1 scope (per vision §1 and §3):

| Category | Examples | V1/V2 | Loader ticket |
|---|---|---|---|
| Image (vision/RAG) | jpg, png, webp, heic, screenshots, scanned-page-as-image | **V1** | #8 |
| PDF (native + scanned + mixed) | multi-column academic; tables | **V1** | #7 |
| DOCX (+ legacy .doc, ODT) | via mammoth + LibreOffice CLI | **V1** | #9 |
| XLSX | via exceljs | **V1** | #10 |
| PPTX | via officeparser; embedded images via vision-LLM | **V1** | #10 |
| Plain (TXT/MD/CSV/TSV/JSON/YAML/code) | UTF-8 direct read; language sniffed | **V1** | covered by #6 skeleton + per-format handler |
| Audio (mp3/wav/m4a/ogg) | via nodejs-whisper or Whisper API | **V1** | #11 |
| URL (web + YouTube) | @mozilla/readability + youtube-transcript-plus | **V1** | #12 |
| Video (mp4/webm/mov) | frame extraction + audio transcript | V2 | future |
| Archive (.zip) | unpack and re-dispatch | V2 | future |
| Ebook (.epub) | epub2 | V2 | future |

Per-row capabilities (input UX, fast-path parser, fallback, LLM handoff, output rendering, citation behavior, progressive UI) are defined in vision §3 — do not duplicate here.

### 4.2 UI requirements (per vision §4)

The `<ReportAnything>` React component (ticket #5) exposes the API defined in vision §4.2 — referenced verbatim, not redefined:
- Single `onAttach` prop lights up drag-drop + paste + picker simultaneously (research pattern 2)
- `transport` adapter (signed-URL or data-URL variants)
- `acceptedMimes`, `maxFileSize` (client-side check; server is source of truth)
- Optional `voice` surface (Deep-Chat pattern — peer to chat, not a button)
- `renderers` registry — override per part type; defaults provided for `text`/`reasoning`/`step`/`tasklist`
- `onStatusChange` ('submitted' | 'streaming' | 'ready' | 'error')
- `history` adapter (pluggable persistence)
- `theme` via CSS variables (no styled-system bake-in)

**Forbidden** (vision §4.3):
- No parsing libraries in the browser bundle (no PyMuPDF-WASM, no Mammoth-browser, no pdf.js parsing — preview-only use is fine)
- No vector store / embedding model / RAG pipeline in the browser
- No hardcoded LLM provider
- No flattening of `parts[]` into a single rendered string

### 4.3 API requirements (per vision §5.4)

Four endpoints — **not** per-media-type endpoints (vision §10 explicit anti-pattern):

```
POST /extract            → multipart upload; SSE stream of Part events
POST /chat               → JSON; { messages: Message[] }; SSE stream of Part events
POST /chat/regenerate    → { message_id }; idempotent
GET  /history/:thread    → Message[]
POST /history/:thread    → append Message
```

Framework binding — pick what Iris already uses (Express 5 / Fastify / Hono / Next.js API routes); do **not** introduce a new framework (vision §5.4, §12 Q1 **`[TBC by Iris team]`**).

### 4.4 Integration

- **Iris auth / session**: transport adapter signs URLs and routes auth headers per Iris's existing pattern **`[TBC by Iris team — vision §12 Q3]`**
- **History persistence**: pluggable adapter consumes Iris's existing chat message layer **`[TBC by Iris team — vision §12 Q5]`**
- **LLM provider routing**: provider-agnostic transport; today's wired provider determines vision-LLM-as-OCR engine (GPT-4V / Claude / Gemini) **`[TBC by Iris team — vision §12 Q4]`**

### 4.5 Data — `message.parts[]` schema

The canonical TypeScript discriminated union is defined in **vision §4.1** (12 part types). It is the single source of truth across renderer, transport, persistence. The `wrap()` boundary function (ticket #2) converts every legacy message shape into `Part[]`. Adding a 13th part type **requires an ADR** (vision §10).

Concrete TypeScript snippet: see vision §4.1 lines 123-153.

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **Streaming-first**: every multi-stage operation emits `Step` / `TaskList` events through the SSE/WS event stream (vision §5.3). No UI blocking. No single "loading…" spinner (vision §8 #5).
- **Audio**: streaming partial transcript per vision §3 row 7.
- **Latency targets**:
  - Time-to-first-`Step`-event: < 2s after upload
  - PDF fast-path: < 2s on a 10-page native-text PDF (ticket #7 AC)
  - DOCX parse: < 1s for typical documents (ticket #9 implicit)
  - Vision-LLM-as-OCR: < 30s per page; ladder advances on timeout

### 5.2 Scalability

- **Per-tenant vector-store namespacing** (ticket #13 AC) — cross-tenant retrieval returns empty
- **Concurrent extraction** — multiple files in a single chat run loaders in parallel (Journey C); `TaskList` shows per-file rows independently
- **Backpressure**: SSE / WS event stream respects the framework's existing flow control
- **Vector store choice** **`[TBC by Iris team — vision §12 Q7]`** — pgvector canonical, LanceDB optional

### 5.3 Security

Per OWASP ASI02 blast-radius alignment (research `docs/research/owasp-agentic-top10-trifecta-coverage-map.md`; cross-link to `docs-xbp2`):

- **Trifecta-gate review per loader** (ticket #17): every loader declares `data_scope` (read-only / per-tenant / per-org / global) and `side_effects` (pure / local-write / external-write / irreversible)
- **LibreOffice CLI shell-out** (ticket #9): explicit sandbox declaration; restricted file permissions; spawn from controlled directory
- **Vision-LLM-as-OCR** (ticket #7): external-write — document content reaches third-party provider; consent gate triggers when remote provider + PII heuristic (ticket #18)
- **URL fetching** (ticket #12): blast-radius `external-read; arbitrary internet`; SSRF mitigations required (host allow-list or proxy)
- **Upload pipeline**: MIME sniffed server-side via `file-type` (vision §5.1); never trust client-declared MIME
- **File size**: enforced server-side as source of truth (vision §4.2 caveat)

### 5.4 Accessibility

- **WCAG 2.1 AA**: Streamdown renderer outputs semantic HTML; ARIA-first per `headless-ui-testing-grace-v2-gap-analysis.md`
- **Renderer registry** (ticket #5): every Part renderer must emit ARIA roles; `step` / `tasklist` use `role="status"` with `aria-live="polite"`
- **Keyboard navigation**: drag-drop has keyboard-fallback file-picker; citation hover-cards reachable via Tab
- **Voice surface** (optional, ticket #5): does not preempt keyboard input

### 5.5 Compliance

- **EU AI Act August 2026**: AI-disclosure obligation on generated reports (ticket #18; cross-link `docs-yq2y`)
  - Every generated `artifact` carries disclosure metadata (`ai_assistance: substantial`, `ai_tools_used: [...]`, `pii_routed: [...]`)
  - Exported MD/HTML/PDF preserve the disclosure footer
- **PII routing consent**: vision-LLM-as-OCR (#7), remote embedding (#13), Whisper API (#11) may route document content to third parties; pre-processing consent gate when remote provider + PII heuristic
- **Audit trail**: `source` parts persist with messages so report claims can be re-traced post-hoc

---

## 6. Task Breakdown — Beads Issues Created

All 18 tickets created as children of parent vision ticket `docs-z9xg`. IDs follow the pattern `docs-z9xg.N`. Dependencies wired per the migration plan (vision §9).

| # | Beads ID | Title | Pri | Labels |
|---|---|---|---|---|
| 1 | `docs-z9xg.1` | Step 0: Audit broken parent-branch logic in emex-x-application Iris code | P1 | iris,reportanything,audit |
| 2 | `docs-z9xg.2` | Implement canonical message.parts[] schema + wrap() boundary | P1 | iris,reportanything,schema |
| 3 | `docs-z9xg.3` | Adopt Streamdown for streaming output rendering | P2 | iris,reportanything,frontend |
| 4 | `docs-z9xg.4` | Boy-Scout style/formatter pass on every touched file | P2 | iris,reportanything,refactor |
| 5 | `docs-z9xg.5` | Build `<ReportAnything>` React component: single onAttach + renderer registry | P1 | iris,reportanything,frontend,size-l |
| 6 | `docs-z9xg.6` | Build Iris extraction service skeleton: MIME registry + dispatch + SSE/WS event stream | P1 | iris,reportanything,backend,size-l |
| 7 | `docs-z9xg.7` | Implement PdfLoader: pdf-parse fast-path → tesseract.js → vision-LLM-as-OCR ladder | P1 | iris,reportanything,backend,size-m |
| 8 | `docs-z9xg.8` | Implement ImageLoader: bytes-inline to vision + OCR fallback | P1 | iris,reportanything,backend,size-s |
| 9 | `docs-z9xg.9` | Implement DocxLoader: mammoth + LibreOffice CLI for legacy .doc/ODT | P2 | iris,reportanything,backend,size-s |
| 10 | `docs-z9xg.10` | Implement XlsxLoader (exceljs) + PptxLoader (officeparser) | P2 | iris,reportanything,backend,size-s |
| 11 | `docs-z9xg.11` | Implement AudioLoader: nodejs-whisper local default + Whisper API option | P2 | iris,reportanything,backend,size-m |
| 12 | `docs-z9xg.12` | Implement UrlLoader: @mozilla/readability + jsdom + YouTube transcript | P2 | iris,reportanything,backend,size-s |
| 13 | `docs-z9xg.13` | Implement chunker → embedder → pgvector pipeline + citation builder | P1 | iris,reportanything,backend,size-l |
| 14 | `docs-z9xg.14` | Spike: Marker vs Docling vs vision-LLM-as-OCR on 100-PDF fixture set | P2 | iris,reportanything,spike,size-s |
| 15 | `docs-z9xg.15` | Spike: bundle-size audit before/after Streamdown + parser dependency set | P2 | iris,reportanything,spike,size-s |
| 16 | `docs-z9xg.16` | Concierge test: 5-user validation of PDF → report flow | P2 | iris,reportanything,discovery,size-s |
| 17 | `docs-z9xg.17` | Define per-loader blast-radius manifest (OWASP ASI02 alignment) | P2 | iris,reportanything,security,size-s |
| 18 | `docs-z9xg.18` | AI-disclosure field on generated reports (EU AI Act Aug 2026) | P2 | iris,reportanything,compliance,size-s |

**Dependencies wired** (via `br dep add <blocked> <blocker>`):
- `#1 (audit)` blocks `#2`, `#5`, `#6` — nothing new lands on unaudited fragmentation (vision §9.1 non-negotiable)
- `#2 (schema)` blocks `#5`, `#7`, `#8`, `#9`, `#10`, `#11`, `#12` — every loader and the React component consume `Part[]`
- `#6 (service skeleton)` blocks `#7`, `#8`, `#9`, `#10`, `#11`, `#12`, `#13` — every loader registers into the skeleton; the chunker/embedder/citation pipeline runs on top of it

**Ungated (parallel) work**:
- Spike `#14` (PDF OCR comparison) runs independently and feeds back into `#7` ladder order
- Spike `#15` (bundle audit) runs independently and gates `#3` and `#5`
- Discovery `#16` (concierge test) runs after `#5`+`#6`+`#7`+`#9` deliver the minimal PDF/DOCX path
- Security `#17` runs as each loader is delivered (manifest entry per PR)
- Compliance `#18` runs in parallel with `#13` (citation builder must carry disclosure metadata)
- Boy-Scout `#4` runs as a continuous side-effect of every other ticket

**Cross-links**:
- `#17` references `docs-xbp2` (ASI02 per-tool blast-radius spec)
- `#18` references `docs-yq2y` (invariantis AI-disclosure field)
- Parent ticket: `docs-z9xg`

---

## 7. Discovery and Validation Plan

### 7.1 Learning goals (per DVF+V Section 3 risks)

| Risk | Learning goal | Cheapest test |
|---|---|---|
| Desirability | Do users accept chat-as-report-surface? | Concierge test (5 users, ticket #16) |
| Usability | Is per-stage `Step`/`TaskList` UI legible? | Hallway test in concierge sessions; WCAG audit |
| Feasibility | Which OCR engine wins per PDF category? | 100-PDF spike (ticket #14) |
| Viability | Does Streamdown+parsers fit the bundle budget? | Bundle audit spike (ticket #15) |

### 7.2 Validation experiments

**Fastest cheapest order**:
1. **Audit (#1)** — week 1 — gates everything; cannot proceed without honest naming of the parent-branch wreckage
2. **Bundle audit (#15)** — week 1-2 — gates Streamdown adoption; cheap to run
3. **PDF OCR spike (#14)** — week 2-3 — runs in parallel with skeleton work
4. **Schema (#2)** + **Skeleton (#5)/(#6)** + **Reference loader (#7 PDF)** — weeks 2-4 — minimum viable to enable concierge
5. **Concierge test (#16)** — week 5 — once #5+#6+#7+#9 deliver PDF+DOCX path
6. Other loaders (#8, #10, #11, #12) — weeks 5-8 — one per week per vision §9.5
7. Citation pipeline (#13) — week 4-6 — required for any "report" framing to be honest
8. Security (#17) and Compliance (#18) — continuous, gated per-loader PR

### 7.3 Success criteria for V1 → V2

V1 ships when:
- All V1 loaders (image, PDF, DOCX, XLSX, PPTX, plain, audio, URL) deliver per their AC
- Concierge test (#16) returns ≥4/5 successful end-to-end (or pivot signal acknowledged)
- North Star Metric ≥ 70% report acceptance on the first week of internal use
- Per-loader blast-radius manifest (#17) complete; AI-disclosure (#18) shipping on every artifact
- Old `switch/if` dispatch deleted (vision §9.7 Step 6 cleanup)

V2 considers (in priority order):
1. Video (frame extraction + audio transcript)
2. Archive (.zip — unpack + re-dispatch)
3. Ebook (.epub)
4. Mistral OCR hosted API (if vision-LLM-as-OCR cost ceiling breaks)
5. Docling peer-service ADR (if spike #14 verdict requires it)

---

## 8. Acceptance Criteria and Testing

### 8.1 Acceptance test scenarios

Mirroring vision §3 capability matrix — one row per media category per Journey A/B/C. Concrete scenarios:

| Scenario | Loader | Pass criteria |
|---|---|---|
| Drop a 10-page native-text PDF | #7 | Fast-path returns < 2s; `text` artifact rendered; source parts per chunk |
| Drop a scanned PDF | #7 | Empty-pages-ratio triggers ladder; tesseract.js or vision-LLM succeeds; OCR confidence badge per page |
| Drop a corrupt PDF | #7 | `Step[failed]` clean error; no 500 |
| Drop a DOCX with headings | #9 | Headings preserved as chunk boundaries; source parts `{doc_id, section}` |
| Drop a legacy .doc | #9 | LibreOffice CLI sandbox-spawn succeeds; output equivalent to native .docx |
| Drop a screenshot (image) | #8 | Default path: bytes-inline to vision (no OCR); single Step |
| Drop a screenshot for RAG indexing | #8 | OCR path engaged; chunks embedded; source parts `{file_id, page, snippet}` |
| Drop a meeting audio | #11 | Streaming partial transcript; source parts with `start_ms`/`end_ms` |
| Drop a XLSX with 3 sheets | #10 | Each sheet renders as `table` part; row-range chunks for retrieval |
| Drop a PPTX with embedded images | #10 | Per-slide chunks; embedded images routed through vision-LLM with source attribution |
| Paste a YouTube URL | #12 | Transcript retrieved with timestamps; video card inline |
| Paste an arbitrary web page | #12 | @mozilla/readability returns clean markdown; turndown converts |
| Drop a password-protected DOCX | #9 | Clean error with remediation hint |
| Drop a 60 MB PDF | #5+#6 | Client + server both reject; clean error |
| Mid-stream cancel | #6 | `LoadContext.signal` aborts all engines; partial Step events show `cancelled` |
| Drop 3 docs concurrently | #6 | TaskList renders per-file rows; each transitions independently |
| Re-open report from history | #5+#6 | Citations resolve; click-to-jump still works |
| Export report as PDF | #13+#18 | Disclosure footer preserved; sources cited inline |

### 8.2 Definition of Done

Cross-references **vision §8 PR Acceptance Criteria** (vision §8 lines 433-446). A PR touching ReportAnything-relevant code merges only if it satisfies:

1. No new `switch(messageType)` or chained if/elif for part/media-type dispatch — use the registry
2. No client-side parsing libraries in the browser bundle
3. New media types come with loader registration + confidence-check function + defined fallback chain
4. No new flat-string assistant messages — output goes through `parts[]`
5. No new "loading…" single-spinner — use `Step` / `TaskList` parts
6. Citations as `source` parts, never inline `[1]` strings
7. License diligence: any new third-party dep lists license; AGPL/Open-WebUI/LobeHub clauses or Python-only deps require ADR
8. Streaming-aware rendering: any new renderer handles mid-token state without flicker (truncated-input test)
9. Pre-commit formatter runs on every touched file
10. Any "TODO from parent branch" in a touched file is resolved in the same PR (complete / delete / extract-as-spike)

### 8.3 Quality gates

- `flowspec gate --threshold 70` on the PRD itself (this document)
- Per-PR: CI runs vitest (handler-chain) + Playwright (canvas/layout only) per `headless-ui-testing-grace-v2-gap-analysis.md`
- Bundle-size CI gate: zero parser libs in browser bundle (asserted via webpack-bundle-analyzer or rollup-plugin-visualizer)
- Per-loader: blast-radius manifest entry CI-gated (ticket #17)

### 8.4 Test coverage strategy (two-tier per `headless-ui-testing-grace-v2-gap-analysis.md`)

**Tier 1 — handler-chain via vitest + jsdom** (logic, fast, deterministic):
- Renderer registry dispatches by `part.type` correctly
- `wrap()` round-trips legacy shapes into `Part[]`
- Loader dispatch via `Map.get()` for all registered MIMEs
- Confidence-gate logic per fallback ladder
- SSE/WS event stream parsing on the client

**Tier 2 — Playwright `browser_snapshot`** (canvas/layout only):
- Drag-drop visual behavior
- Streamdown rendering of half-closed code fences / mid-table rows
- Citation hover-card positioning
- WCAG 2.1 AA semantic structure spot-checks

---

## 9. Dependencies and Constraints

### 9.1 Technical dependencies — vision §12 open questions (the 12 gating items)

Each is **`[TBC by Iris team]`** and resolved by a one-line answer or a small spike once `emex-x-application` is accessible:

1. Server framework currently in Iris (Express / Fastify / Hono / Next.js API routes) — drives multipart + SSE binding in ticket #6
2. Frontend framework (Next.js / Vite / CRA / other) — drives `<ReportAnything>` packaging in ticket #5
3. Auth / session model — drives transport adapter and signed-URL minting in tickets #5 and #6
4. LLM provider(s) wired today — drives vision-LLM-as-OCR engine choice in #7
5. Existing chat message persistence layer — drives history adapter in #5/#6 and `wrap()` strategy in #2
6. Current bundle size and budget — drives Streamdown adoption (#3) and is the criterion for spike #15
7. Vector store status (pgvector / LanceDB / Qdrant deployed, or new ground?) — drives #13 and may reorder migration steps
8. AGPL / license posture rules of `emex-x-application` — may veto otherwise-clean libs at the host level
9. Specifics of the "broken parent-branch logic" — required input for audit ticket #1
10. Monorepo or polyrepo — affects packaging of `@iris/report-anything`
11. Existing test infrastructure (vitest? jest? playwright already in repo?) — affects test-tier execution
12. CI infrastructure and deploy targets — affects bundle-budget gate and security gate enforcement

### 9.2 External dependencies

- **Vision-LLM provider availability** (GPT-4V / Claude / Gemini) for OCR fallback — required by #7
- **pgvector deployment** (or LanceDB equivalent) — required by #13
- **LibreOffice binary** on the server — required by #9 for legacy .doc/ODT
- **whisper.cpp binary** on the server (or Whisper API access) — required by #11

### 9.3 Timeline constraints

- **Migration discipline (vision §9)**: one-loader-per-week, NOT big-bang. Vision §13 confidence: "if the parent-branch logic is messier than expected, schedule slips one to two weeks."
- **V1 estimate**: 4-8 weeks per assessment (`docs/assess/iris-reportanything-assessment.md`)
- **Critical path**: `#1 audit → #2 schema → #6 service skeleton → #7 PDF loader → #13 citation pipeline` is the spine; everything else parallelizes

### 9.4 Resource constraints

- **Iris team access**: required to resolve the 12 open questions; cannot be done from `/home/sash/docs/`
- **PRD consumability**: this PRD is consumable from `emex-x-application` once that repo is accessible; should be mirrored as a GitHub issue / ADR there

### 9.5 Risk factors (license footguns)

Per vision §6:
- **Open-WebUI** — branding + scale clauses in recent license (verify latest text); design reference only
- **LobeChat** — Community License blocks derivative SaaS without commercial license; design reference only
- **Python-only library temptation** (Marker, Docling, Unstructured, pypdf, python-docx, faster-whisper) — explicitly rejected for in-process pipeline; peer-service deployment requires ADR

Clean lifts permitted from: LibreChat (MIT), AnythingLLM (MIT), Chainlit (Apache-2.0 — but Python so design only), Streamdown (Apache-2.0), Vercel AI SDK (Apache-2.0), Deep-Chat (MIT), CopilotKit (MIT), Assistant-UI (MIT).

---

## 10. Success Metrics (Outcome-Focused)

### 10.1 North Star Metric

**% of report sessions that end with a user-accepted report** (not regenerated, not abandoned).

Why: this is the single behavior change that proves chat-as-report-surface works. Output-focused metrics (loaders shipped, parts schema adopted) would let us declare victory while users abandon. Outcome metric forces honesty.

Provisional V1 target: **> 70%** (refine post-concierge test #16).

### 10.2 Leading metrics

| Metric | What it tells us | V1 target |
|---|---|---|
| Time-to-first-`Step`-event | Initial UX responsiveness | < 2s |
| Parser confidence rate per loader | Fallback-ladder health (if fast-path always fails, ladder is the de facto path) | > 60% fast-path success on representative corpus |
| Vision-LLM-as-OCR success rate | Cost ↔ quality trade-off signal | > 90% on scanned-PDF subset |
| Per-loader latency p95 | UX bottleneck identification | PDF < 10s; DOCX < 2s; audio < 1x realtime |

### 10.3 Lagging metrics

| Metric | What it tells us | V1 target |
|---|---|---|
| Weekly active ReportAnything users | Adoption | TBC by Iris team baseline |
| Reports-per-user-per-week | Engagement depth | > 3 |
| Citation click-through | Source-anchoring is *used*, not just present | > 30% on reports with > 5 sources |
| Regen rate | Quality proxy (high regen = users dissatisfied with first output) | < 10% |
| Export rate (MD/HTML/PDF) | Reports leaving the chat surface (validates "report" framing) | > 20% of accepted reports |

### 10.4 Measurement plan

- **Instrumentation through SSE event stream**: every `Step`, `TaskList`, message accept/regen/export emits a telemetry event with `{thread_id, loader, latency_ms, status, confidence}`
- **Persisted thread history** (vision §5.4 `GET/POST /history/:thread`) is the source-of-truth for North Star calculation
- **Per-loader telemetry** feeds ladder-order tuning and informs spike #14 follow-up
- **Concierge-test (#16) qualitative findings** are the calibration layer for quantitative targets — provisional V1 targets above should be revised against actual observed behavior, not held as commitments

### 10.5 Targets (provisional; refine post-V1)

| Metric | Threshold |
|---|---|
| Report acceptance | > 70% |
| Time-to-first-event | < 2s |
| Regen rate | < 10% |
| Citation click-through | > 30% |
| Per-loader fast-path success | > 60% |

These are **provisional**. The concierge test (#16) is the calibration step. If concierge reveals very different user expectations (e.g. users export 90% of reports — citation engagement matters more than acceptance), targets shift accordingly.

---

## Appendix — TypeScript references

The PRD does not duplicate vision content; for concrete code shapes consult vision sections directly:

- **Canonical `Part` discriminated union**: vision §4.1 (lines 123-153) — 12 part types; the schema spine
- **`<ReportAnything>` component API**: vision §4.2 (lines 159-189)
- **Loader interface + MIME registry**: vision §5.1 (lines 207-241)
- **Fast-path → fallback ladder (PDF reference)**: vision §5.2 (lines 245-279)
- **SSE event emitter (`SseLoadContext`)**: vision §5.3 (lines 287-305)

---

*PRD generated 2026-05-14 from vision doc (2026-05-14) + chat-kit multimedia research (2026-05-14) + assessment backfill (2026-05-14). Substrate canonical; this PRD is the consumable-by-Iris-team translation layer.*
