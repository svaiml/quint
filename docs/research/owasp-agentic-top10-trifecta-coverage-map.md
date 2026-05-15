# OWASP Agentic Top 10 + Lethal Trifecta — Coverage Map Against Our Stack

> **Last updated**: 2026-05-13
> **Status**: Complete
> **Tracking**: research note from Habr 1014474 (Konstantin Rozanov, 2025-03-24); forwarded via channel 2026-05-13
> **Question**: Where does our existing FlowSpec / RSTMDB / Infer / Invariantis stack already cover the OWASP Agentic Security Initiative (ASI) Top 10? Where is the gap?
> **Verdict**: **PARTIAL — 6 of 10 ASI categories are substantially covered by existing or recently-proposed work; 4 categories have operational gaps that warrant explicit tickets.** Importantly, the **Lethal Trifecta** is structurally identical to a violation of our existing Phase 0 boundary in `agentic-management-flows.md` — we have the conceptual frame; we lack the named architectural-design-pattern artifact.

---

## 1. Source — Verbatim Claims

### 1.1 The Lethal Trifecta (per Rozanov / per Simon Willison's original coinage)

Three simultaneous conditions that make indirect prompt injection → sensitive-data exfiltration **practically inevitable**:

| Leg | Definition | Concrete examples |
|---|---|---|
| **A — Private Data Access** | Agent holds credentials / connections to sensitive content | Emails, internal DBs, API keys, confidential docs |
| **B — Untrusted Content Consumption** | System ingests unverified inputs | Web pages, attachments, tool outputs, peer-agent messages |
| **C — External Communication Channel** | Outbound channel exists | HTTP, email send, DNS, public-repo commit |

**Load-bearing claim**: removing *any one leg* drops the attack surface dramatically. The danger is the combination.

### 1.2 OWASP Agentic Top 10 (ASI01–ASI10) — verbatim category names

| ID | Name | One-line |
|---|---|---|
| **ASI01** | Agent Goal Hijack | Indirect prompt injection rewrites the agent's goal |
| **ASI02** | Tool Misuse & Exploitation | Legitimate tools invoked with malicious intent or unsafe chains |
| **ASI03** | Identity & Privilege Abuse | Token reuse, confused deputy, transitive privilege escalation |
| **ASI04** | Agentic Supply Chain Vulnerabilities | Tool metadata, deps, integrations — typosquatting, compromise |
| **ASI05** | Unexpected Code Execution | `eval()`, auto-run, unsafe deserialization via injection |
| **ASI06** | Memory & Context Poisoning | RAG + long-term memory poisoned; gradual planning corruption |
| **ASI07** | Insecure Inter-Agent Communication | Spoofing, replay, descriptor manipulation |
| **ASI08** | Cascading Failures | Single vuln propagates through memory + plans + A2A links |
| **ASI09** | Human-Agent Trust Exploitation | Social engineering bypassing HITL via "consent laundering" |
| **ASI10** | Rogue Agents | Long-lived agents drift goals, low-and-slow malice, collusion |

### 1.3 Rozanov's load-bearing operational point

> "**Detector-based prompt injection is a layer, not a wall.**" Real-world bypasses are inevitable. The strongest defense controls **consequences**, not perfect prevention.

This is the same architectural stance our `prompt-injection-architectural-limits-grace-index-map.md` already takes. Good — we are aligned with the published consensus, not behind it.

---

## 2. Key Drivers — Who Built This Framework

### 2.1 OWASP itself

| Year | Figure | Contribution |
|---|---|---|
| 2001 | **Mark Curphey** | Founded OWASP |
| 2003+ | **Jeff Williams** (Aspect Security, later Contrast Security) | OWASP Top 10 lineage |
| 2003+ | OWASP community | Web app Top 10 — the genre Rozanov's article continues |

### 2.2 OWASP LLM Top 10 / OWASP Agentic Security Initiative (the immediate parent)

| Year | Figure | Contribution |
|---|---|---|
| 2023 | **Steve Wilson** (project lead) | OWASP Top 10 for LLM Applications v1.0 (Aug 2023), v1.1 (Oct 2023) |
| 2024 | Steve Wilson | *The Developer's Playbook for Large Language Model Security*, O'Reilly |
| 2025–26 | **OWASP Agentic Security Initiative (ASI)** contributors | OWASP Top 10 for Agentic Applications (the framework Rozanov summarizes) |

### 2.3 The Lethal Trifecta — Simon Willison's coinage

| Year | Figure | Contribution |
|---|---|---|
| 2022-09 | **Simon Willison** | First named "prompt injection" (blog) |
| 2022-09 | **Riley Goodside** | Twitter demonstrations that popularized the concept |
| 2023-02 | **Kai Greshake, Sahar Abdelnabi, et al.** | "Not what you've signed up for" — indirect prompt injection arXiv:2302.12173 |
| 2024-25 | **Simon Willison** | **"Lethal Trifecta"** — coined the term in his blog series on agent security |
| 2024-25 | Various | "EchoLeak" arXiv paper; "Design Patterns for Securing LLM Agents" arXiv |
| 2025-03 | **Konstantin Rozanov** | The Habr 1014474 article synthesizing OWASP ASI + Trifecta for Russian-speaking audience |

Simon Willison is the load-bearing name for the Trifecta specifically. The framing — *three conditions whose intersection is the danger* — is his.

### 2.4 The MCP / tool-protocol axis (relevant to ASI02, ASI04, ASI07)

| Year | Figure | Contribution |
|---|---|---|
| 2024-11 | **Anthropic** | Released Model Context Protocol (MCP) |
| 2024-25 | MCP community | Tool descriptor specs; security audits of MCP primitives |
| Our work | docs-2ne0 (open) | "Spike: MCP client primitives — sampling/roots/elicitation security audit for Flowspec MCP servers" |

### 2.5 Indirect prompt injection — the empirical literature

Beyond Greshake et al. (2023): work on tool-output poisoning, RAG-corpus poisoning, A2A descriptor manipulation. "EchoLeak" is the recent significant paper Rozanov cites.

---

## 3. Coverage Map — TheoSciTech / Our Stack vs OWASP ASI Top 10

For each ASI category: what we already have (or have proposed), and what is missing.

| ASI | Category | We have | We're missing |
|---|---|---|---|
| **ASI01** | Goal Hijack | `prompt-injection-architectural-limits-grace-index-map.md` — architectural limits; GRACE Phase 0 boundary; structural injection limits | Operational policy-gate spec |
| **ASI02** | Tool Misuse | docs-2ne0 (MCP primitives audit); docs-gw2e (verification specialist track — formal contracts on tools) | Per-tool blast-radius policy artifact |
| **ASI03** | Privilege Abuse | docs-5q59 (RSTMDB AI-contract entities — temporal lifecycle) | JIT token issuance design |
| **ASI04** | Supply Chain | docs-lr60 (lineage-citation completeness — *just* opened); docs-r5im (invariantis on /flow:specify); docs-9r62 (AITechCraft / ZomboCraftEco MANIFEST integration) | Tool/dependency provenance manifest format |
| **ASI05** | Code Execution | Standard sandbox / no agent-side `eval()` posture; nothing TheoSciTech-specific | Concrete codegen-sandbox policy doc |
| **ASI06** | Memory & Context Poisoning | docs-orht (DISCERN verb — root-cause detection); docs-egg5 (RSTMDB cause-depth); docs-2yc5 (Infer STRESS-pass on KB ingestion); docs-2ofi (Infer LLM extraction boundary protocol) | Memory TTL/trust-scoring policy doc |
| **ASI07** | Inter-Agent Communication | docs-1sio (flowspec multi-agent mailbox protocol); docs-1i73 (mailbox impl); docs-izj5 (polyphonic council pattern) | Inter-agent descriptor-spoofing threat model |
| **ASI08** | Cascading Failures | `agent-architecture-2026-durable-state-dual-window.md`; docs-m3gq (durable state layer); docs-bjpn (BackgroundJob lease) | Circuit-breaker / kill-switch pattern doc |
| **ASI09** | Human-Agent Trust | `kolmogorov-school-failures-corrections.md` Praxis-Theoria-Gnosis (Gnosis layer = humans); `dostoevsky-method-unbiased-ai-theosci-tech.md` (hidden-bias detection) | "Consent laundering" detection pattern |
| **ASI10** | Rogue Agents | docs-bjpn (lease for stuck workers); polyphonic council (docs-izj5) — disagreement as signal | Long-lived-agent drift telemetry spec |

**Net coverage**: 6 of 10 ASI categories have substantial existing or proposed coverage (ASI01, ASI04, ASI06, ASI07, ASI08, ASI10 — green/yellow); 4 categories have only conceptual coverage with operational gaps (ASI02, ASI03, ASI05, ASI09 — yellow/red).

### 3.1 The Lethal Trifecta maps to a Phase 0 boundary violation

Our `agentic-management-flows.md` already names six phases:

| Phase | Owner |
|---|---|
| 0. Context Engineering | **HUMAN** |
| 1. Decomposition | Planner + PM |
| 2. Pre-Execution Interview | Interview agent |
| 3. Staged Implementation | Impl agent + human gate |
| 4. Cross-Validation | Review agent + human |
| 5. Reflection + Meta-Update | Reflection → God agent → human approval |
| 6. Autonomy Expansion | **HUMAN** (governance) |

The Trifecta legs map as follows:

- **Leg A (private data access)** = something configured in Phase 0 (allowed data sources)
- **Leg B (untrusted content)** = something the agent encounters in Phases 2–4
- **Leg C (external channel)** = something authorized in Phase 0/6

A Trifecta violation **is exactly the collapse of the Phase 0 / Phase 6 governance boundary into the runtime phases**. Our doc names this implicitly. It is worth making it explicit as a *named architectural design pattern*: "the Trifecta gate" or "Phase 0 isolation invariant."

This is a small artifact (one doc section, not a new ticket) — see §6.2 below.

### 3.2 Rozanov's Stage 1 / 2 / 3 roadmap mapped to our tickets

| Rozanov stage | Mapped to our work |
|---|---|
| Stage 1 (immediate): inventory tools, data, channels; revoke unnecessary egress; enable audit | docs-r5im (invariantis on /flow:specify) — provenance from spec time |
| Stage 2 (short-term): independent policy gates; JIT tokens; HITL approvals | docs-orht (DISCERN); docs-egg5 (cause-depth); docs-lr60 (citation completeness); docs-yq2y (AI-disclosure) |
| Stage 3 (sustained): segment memory by tenant; lineage tracing; kill switches | docs-m3gq (durable state); docs-bjpn (lease); RSTMDB cause-depth; new ticket needed for kill-switch / blast-radius |

We are doing the right *direction* of work. The gap is operational: most of our work is in Stage 2; we have Stage 1 partially covered; Stage 3 we have foundations but not the named operational artifacts (kill switch, blast radius, drift telemetry).

---

## 4. Dependency Map

```
                  ┌───────────────────────────────────────────────────┐
                  │  owasp-agentic-top10-trifecta-coverage-map        │  ← THIS DOC
                  └───────────────────────────────────────────────────┘
                       ▲                                        │
              CONSUMES (existing / proposed work)        STRENGTHENS / EXPOSES GAPS
                       │                                        ▼
   ┌────────────────────────────────┐         ┌─────────────────────────────────┐
   │ agentic-management-flows       │────────▶│ NEW: Phase-0-isolation /        │
   │   (Phase 0 / Phase 6 boundary) │  Trif.  │   Trifecta-gate design pattern  │
   │                                │  = P0   │   doc                           │
   └────────────────────────────────┘  violat └─────────────────────────────────┘

   ┌────────────────────────────────┐         ┌─────────────────────────────────┐
   │ prompt-injection-architectural-│────────▶│ ASI01/ASI02 gate-policy spec    │
   │ limits-grace-index-map         │  arch.  │   (consequence-control, not     │
   │   ("not a wall")               │  posture│    detector-as-wall)            │
   └────────────────────────────────┘         └─────────────────────────────────┘

   ┌────────────────────────────────┐         ┌─────────────────────────────────┐
   │ agent-architecture-2026-       │────────▶│ ASI08/ASI10 circuit-breaker +   │
   │ durable-state-dual-window      │  cascade│   drift-telemetry doc           │
   │   + docs-m3gq + docs-bjpn      │  control│                                 │
   └────────────────────────────────┘         └─────────────────────────────────┘

   ┌────────────────────────────────┐         ┌─────────────────────────────────┐
   │ docs-orht (DISCERN verb) +     │────────▶│ ASI06 memory-poisoning policy   │
   │ docs-egg5 (cause-depth) +      │  KB     │   (TTL, trust-score, namespace) │
   │ docs-2yc5 / docs-2ofi          │  integ. │                                 │
   └────────────────────────────────┘         └─────────────────────────────────┘

   ┌────────────────────────────────┐         ┌─────────────────────────────────┐
   │ docs-r5im + docs-lr60 +        │────────▶│ ASI04 tool/dep provenance       │
   │ docs-yq2y + docs-yspb          │  prov.  │   manifest spec                 │
   │   (invariantis stack)          │  layer  └─────────────────────────────────┘
   └────────────────────────────────┘
                                              ┌─────────────────────────────────┐
   ┌────────────────────────────────┐         │ ASI09 consent-laundering        │
   │ kolmogorov-school-failures-    │────────▶│   detection — PTG-driven        │
   │ corrections (PTG) +            │  Gnosis │   approval-flow audit pattern   │
   │ dostoevsky-method (DISCERN)    │  guard  └─────────────────────────────────┘
   └────────────────────────────────┘

   ┌────────────────────────────────┐
   │ External lineage:              │  ← Simon Willison (Trifecta), Steve Wilson
   │ Willison → Wilson → Greshake → │    (OWASP LLM lead), Greshake et al
   │ EchoLeak → OWASP ASI 2026      │    (indirect prompt injection)
   └────────────────────────────────┘
```

---

## 5. Honest Critique

### 5.1 Where Rozanov / OWASP ASI is correct and we should adopt directly

- **Consequence-control > detector-as-wall**: matches our `prompt-injection-architectural-limits-grace-index-map.md` thesis. No correction needed.
- **Three legs of the Trifecta as a fast operational heuristic**: a genuinely useful frame for design reviews. We should adopt it as a named gate in our PR review and `/flow:plan` checklists.
- **Audit / lineage / kill-switch trinity**: aligns with our durable-state work; adopt the OWASP language directly.

### 5.2 Where the framework has limits

- **"Detector-based prompt injection is a layer not a wall"** is true but understates the structural option: *some agent contexts can be architecturally Trifecta-free* (e.g., a read-only research synthesis agent with no external channel). The OWASP framing risks treating Trifecta avoidance as a runtime defense when it can be a *design-time invariant*. Our Phase 0 boundary already does this.
- **OWASP ASI is reactive**: catalogs known attack classes. Genuine *novel* agent failure modes (cascading hallucination amplification across long-running agents; semantic drift via accumulated tool outputs) are partially covered by ASI06+ASI08+ASI10 but not as a unified phenomenon. Our `learning-is-forgetting-ib-llm-tishby-compression.md` analysis provides a *mechanism-level* account the OWASP doc lacks.
- **The Trifecta over-indexes on data exfiltration**. It does not name the dual risk: *intent injection without exfiltration* (agent does the wrong thing without sending data anywhere). Our Dostoevsky-method / DISCERN work catches this. The intersection of OWASP-ASI's risk frame with our framework is wider than either alone.

### 5.3 Where Rozanov's article is conservative / under-claims

Rozanov writes for a Russian Habr enterprise-security audience. He understates the *upside* of explicit lineage tracking. Our position is stronger: lineage isn't just a stage-3 maturity — it is the **substrate that makes Stage 1 inventory possible**, because you can't inventory what you can't trace.

---

## 6. Recommendations

### 6.1 Adopt the OWASP ASI language as house vocabulary

The ASI01–ASI10 category codes are the right interlingua for our security docs, ADRs, and threat models. Use them in PR titles, ADR cross-refs, and `/flow:assess` outputs where applicable. Cheap, immediate, increases external legibility.

### 6.2 Name the "Trifecta Gate" as an architectural design pattern

Write a short doc (~50 lines) in `docs/research/` or `docs/platform/` formalizing:
- The three legs (Willison's coinage; cite him)
- The Phase 0 isolation invariant (our framing)
- Design-time vs runtime defenses
- One canonical example: a Trifecta-free agent design (read-only research synthesis)
- One canonical example: a Trifecta-mitigated agent design (corporate-email agent with HITL + DLP + allowlist egress)

This is the only genuinely new artifact from this analysis.

### 6.3 Adopt Rozanov's Stage 1/2/3 maturity model

Our roadmap already implicitly tracks Stage 2 (most current tickets). Make this explicit: tag tickets with `stage-1` / `stage-2` / `stage-3` so we know when we cross thresholds. Connect to maturity tracking we're already doing in the engineering-leadership-pulse work.

### 6.4 Close 4 operational gaps with new tickets

The four genuine gaps (ASI02 blast radius, ASI03 JIT tokens, ASI05 codegen-sandbox policy, ASI09 consent-laundering detection) are concrete and bounded. Each warrants a ticket — not a research ticket, an implementation/design ticket.

### 6.5 What we should *not* over-claim

We have *foundations* for memory hardening (ASI06) via Infer STRESS-pass and the DISCERN verb proposal. We do *not* yet have a deployed memory hardening policy. The coverage table above is honest about this. Do not let internal pride converge with marketing pride; ASI06 is partial coverage at best.

---

## 7. Verdict and Confidence

**Verdict**: **STRONG ALIGNMENT** between OWASP ASI Top 10 / Lethal Trifecta and our existing TheoSciTech security work. 6/10 ASI categories have substantial coverage; 4 have gaps that are tractable with focused tickets. The Lethal Trifecta is a useful *named pattern* for design reviews and matches our Phase 0 governance boundary already.

**Confidence**:
- **Very high (95%)** on the Phase 0 / Trifecta isomorphism — direct structural match
- **High (85%)** on the 6-of-10 coverage assessment — based on concrete prior tickets/docs, not hypotheticals
- **High (80%)** on the 4 operational gaps being the right targets — supported by Rozanov's own roadmap structure
- **Medium-high (70%)** on the broader claim that we are *ahead* on memory/poisoning (ASI06) and *behind* on tool blast radius (ASI02). Could be confirmed/refuted by a single design review.

This is the second-most-aligned external framework we've critiqued so far, after the Dostoevsky-method doc. Both are confirmation that our trajectory is the right one.

---

## 8. Sources

**Primary**:
- Konstantin Rozanov, "Защита агентных приложений по OWASP Agentic Top 10 и модели Trifecta", Habr 1014474, 2025-03-24
- OWASP Top 10 for Agentic Applications (ASI), 2026 release
- OWASP AI Exchange — "Lethal Trifecta" documentation

**OWASP lineage**:
- Mark Curphey — OWASP founding (2001)
- Jeff Williams — OWASP Top 10 (2003+)
- Steve Wilson — *The Developer's Playbook for Large Language Model Security*, O'Reilly (2024); OWASP LLM Top 10 v1.0 (2023), v1.1 (2023)

**Indirect prompt injection / Trifecta lineage**:
- Simon Willison — "Prompt injection attacks against GPT-3" (blog, 2022-09)
- Simon Willison — "The Lethal Trifecta" blog series (2024–25)
- Riley Goodside — early Twitter demonstrations (2022)
- Kai Greshake, Sahar Abdelnabi, et al. — *Not what you've signed up for*, arXiv:2302.12173 (2023)
- "EchoLeak" — arXiv paper cited by Rozanov
- "Design Patterns for Securing LLM Agents" — arXiv paper cited by Rozanov

**MCP / tool axis**:
- Anthropic — Model Context Protocol release (Nov 2024)
- Our open ticket docs-2ne0 — MCP primitives security audit

**Internal**:
- `docs/research/prompt-injection-architectural-limits-grace-index-map.md`
- `docs/research/agentic-management-flows.md`
- `docs/research/agent-architecture-2026-durable-state-dual-window.md`
- `docs/research/multi-agent-codebase-navigation-pipeline.md`
- `docs/research/ctop-toon-prompt-injection-format.md`
- `docs/research/kolmogorov-school-failures-corrections.md` (PTG / Gnosis-as-human-layer)
- `docs/research/dostoevsky-method-unbiased-ai-theosci-tech.md` (DISCERN verb)
- `docs/research/learning-is-forgetting-ib-llm-tishby-compression.md` (memory-mechanism account)
- Open tickets: docs-r5im, docs-wqoh, docs-orht, docs-egg5, docs-izj5, docs-2ne0, docs-1sio, docs-1i73, docs-m3gq, docs-bjpn, docs-5q59, docs-9r62, docs-lr60, docs-yq2y, docs-yspb, docs-2yc5, docs-2ofi

---

*Coverage analysis — OWASP framework applied to our existing security and agent infrastructure, 2026-05-13.*
