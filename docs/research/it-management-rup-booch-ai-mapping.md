# IT Project Management Norms in the AI Epoch — Booch/RUP Lineage, Phase Ratios, and Our Vision Mapping

> **Last updated**: 2026-05-13
> **Status**: Complete
> **Tracking**: research note from AI Projects chat (Vladimir Ivanov, 2026-05-12 09:26)
> **Source**: Chat post on IT project effort norms with AI bots, channel praise for Grady Booch's methodology

---

## 1. Source — Verbatim Claims (Ivanov, AI Projects chat, 2026-05-12)

Ivanov's three load-bearing claims:

### Claim A — RUP phase distribution is stable across projects

The classical Rational Unified Process phase ratios (Booch-empirical, both effort and calendar):

| Phase | Deliverable | Share |
|---|---|---|
| **Inception** | Vision / primary product concept | 5% |
| **Elaboration** | Prototype + Use Cases | 30% |
| **Implementation** | Tested product | 50% |
| **Transition** | Deployment + acceptance testing | 15% |

These hold under RUP proper or simplified variants like **Agile Unified Process (AUP)**.

### Claim B — Bots top out at ~60–70% of effort

Bots can fully absorb phases 3 and 4 and *partially* phase 2 (the codable parts of Elaboration). The analytical core of Elaboration (prototype design, Use Case modelling) and most of Model/Project Management stays human. Net automation ceiling ≈ **60–70% of total effort**.

### Claim C — The 3× paradox

If a bot is 3× faster than a human at its slice, then **human task-writing time ≈ bot execution time**. Implication: you cannot just "launch bots for 20 hours and go to sleep" — you'll spend the same 20 hours specifying the work. This matches what practitioners observe in real (non-toy) software like SQLite-class systems.

### Claim D — Career stratification

- **Safe (human-resident) processes**: Business Modeling, Requirements, Analysis & Design
- **Disappearing (100% automation) processes**: Implementation, Testing, Deployment

Channel reaction (Ivanov, Andrei, Кирилл): unanimous respect for Booch, "no one made anything more intelligent in IT-project norming than Booch did."

---

## 2. Key Drivers — Who Built These Norms

### 2.1 The "Three Amigos" of OOAD and RUP

| Person | Years | Role | Foundational Artifact |
|---|---|---|---|
| **Grady Booch** | 1955– | OO methodology pioneer at Rational | *Object-Oriented Analysis and Design with Applications* (1991, 2/e 1994, 3/e 2007); the "Booch Method" |
| **James Rumbaugh** | 1947– | OMT (Object Modeling Technique) at GE | *Object-Oriented Modeling and Design* (1991); joined Rational 1994 |
| **Ivar Jacobson** | 1939– | OOSE / Use-Case driven at Objectory AB (Ericsson roots) | *Object-Oriented Software Engineering* (1992); joined Rational 1995 |

All three converged at **Rational Software Corporation** (founded 1981 by Paul Levy and Mike Devlin), producing:

- **UML** (Unified Modeling Language) — first draft 1996, OMG standard 1997
- **RUP** (Rational Unified Process) — 1998, commercial process framework
- **Rational Rose** — the UML CASE tool that bankrolled the methodology

Rational was acquired by IBM in 2003 ($2.1B); RUP lineage continues through IBM and OpenUP/Eclipse Process Framework.

### 2.2 The Phase-Ratio Codifier — Walker Royce

Booch authored the *method*; **Walker Royce** (son of Winston Royce, the misread "father of waterfall") authored *Software Project Management: A Unified Framework* (1998), which is the canonical reference for the 5/30/50/15 ratios. Walker Royce ran Rational's services org and ground-truthed the ratios from 100+ engagements.

The empirical claim Ivanov repeats — that ratios hold across project sizes ±a small variance — is **Walker Royce's data, not Booch's**, though both are inseparable in the methodology's reception.

### 2.3 The "4+1 Views" — Philippe Kruchten

**Philippe Kruchten** (Rational, then UBC) defined the **4+1 architectural view model** (1995) — Logical, Process, Development, Physical, + Use Case. Authored *The Rational Unified Process: An Introduction* (1998, 3 editions through 2003), the standard textbook. He is the implicit teacher behind any practitioner who "thinks in RUP."

### 2.4 The Agile Bridge — Scott Ambler

**Scott Ambler** authored **Agile Unified Process (AUP)** (2005), a lightweight, RUP-shaped Agile process. Later folded into **Disciplined Agile Delivery (DAD)** with Mark Lines, then **Disciplined Agile (DA)** under PMI (acquired 2019). Ambler is the figure who kept the RUP skeleton alive in the Agile era — exactly the "simplified variant" Ivanov cites.

### 2.5 The Loyal Opposition — Agile/XP founders

Phase ratios are RUP's claim, not Agile's. The relevant counterweights:

| Person | Method | Stance |
|---|---|---|
| **Kent Beck** | XP, TDD | Reject up-front phases; test-first replaces Elaboration |
| **Ken Schwaber + Jeff Sutherland** | Scrum | Iterative, no defined phase ratios |
| **Mike Cohn** | User Stories sizing | Story points, not phase percents |
| **Dave Thomas + Andy Hunt** | Pragmatic Programmer | "Don't trust waterfall numbers" |

Ivanov's channel chooses Booch over Beck — a classical/conservative stance worth flagging.

---

## 3. Mapping to Our Vision

Three of our existing research docs already address this terrain. Ivanov's chat post slots cleanly into the framework we've built.

### 3.1 Map to `agentic-management-flows.md` (docs-24r)

Our 6-phase agentic flow already encodes Ivanov's claim B (the 60–70% ceiling), but at finer resolution:

| RUP Phase (Ivanov) | Share | Our Agentic Phase | Automatability |
|---|---|---|---|
| Inception (Vision) | 5% | **Phase 0: Context Engineering** | **HUMAN** |
| Elaboration (Prototype + Use Cases) | 30% | **Phase 1: Decomposition** + **Phase 2: Pre-Execution Interview** | Planner Agent + Human PM (mixed) |
| Implementation (Tested product) | 50% | **Phase 3: Staged Implementation** + **Phase 4: Cross-Validation** | Agent + Human Review Gates |
| Transition (Deploy + Acceptance) | 15% | **Phase 5: Reflection** + deployment skills | Agent-led, human approval |
| (governance) | overhead | **Phase 6: Autonomy Expansion** | **HUMAN** |

**Our finding (Rakovskiy via docs-24r)**: context budget gates at 40/60/80% fill — agents in >40% filled context begin omitting steps. This is the *micro-mechanism* behind Ivanov's 60–70% ceiling at the macro level. The agent's context window literally cannot hold the analytical work of Elaboration without collapsing.

### 3.2 Map to `requirements-management-ai-epoch.md` (docs-saw6)

Our positioning map already explicitly places RUP/UML-era methodologies in the **legacy zone** while pointing the future arrows at:

- Constructive Type-Theoretic RM (Curry-Howard)
- Formal RE + LLM Bridge (neuro-symbolic)
- Spec-Driven Development (FlowSpec native)
- EARS + 4-Valued Logic (Belnap)

**Ivanov's claim that "no one made anything more intelligent than Booch in IT-project norming"** is half-right and half-wrong:

- **Right**: nobody has produced better *empirical effort ratios* — Walker Royce's 5/30/50/15 still holds.
- **Wrong**: the *requirements substrate* has moved forward enormously (Type Theory, formal RE+LLM, SDD). Booch's UML use cases are now a *visualization* layer over deeper formal substrates that didn't exist when RUP was built.

The chat is honoring the *measurement* (phase ratios) while ignoring the *substrate revolution* (types, proofs, NL→formal bridges).

### 3.3 Map to GRACE methodology (`grace-methodology-canonical-shutov-vision.md`)

GRACE (Shutov canonical) provides the **micro-grammar of Phase 0** in our agentic flow — exactly the human-resident analytical work Ivanov says is safe. GRACE artifacts (contracts, structured prompts, semantic shields) are *what Business Modeling and Requirements look like when bots are the executors*.

Said differently: **GRACE is the answer to "what does the Business Modeling layer look like in 2026 when 60% of the project goes to bots."** Booch told you the layer exists. GRACE tells you how to write it.

### 3.4 Map to Praxis-Theoria-Gnosis (Education Division, docs-c02)

Our Kolmogorov Correction (TASK-96 / docs-c02) argues curriculum must go **Praxis → Theoria → Gnosis**. Ivanov's Career-Safety claim is the same idea projected onto the labor market:

- **Praxis** (concrete work) = Implementation/Testing/Deployment = first to automate
- **Theoria** (abstract modelling) = Analysis & Design = harder, but encroaching
- **Gnosis** (judgment, vision, alignment) = Business Modeling, Requirements = persistently human

The career risk Ivanov flags is the **inverse** of the learning order Kolmogorov should have used. People who learned only Praxis (coding) are now exposed; those who built Theoria and Gnosis layers are insulated. This is a natural cross-link between the Education Division and the FlowSpec/RUP analysis.

---

## 4. Validating / Challenging the Ivanov Claims

### 4.1 The 60–70% ceiling — supported, with caveats

Aligned with:

- Our `agentic-management-flows.md` (independent practitioner consensus)
- `superposition-collapse-prompting-brainstorm-llm.md` — humans must do the "collapse" (selection) step that LLM superposition can't
- `multi-agent-codebase-navigation-pipeline.md` — Architect role stays human in all observed pipelines
- `learning-is-forgetting-ib-llm-tishby-compression.md` — Information Bottleneck *forces* lossy compression in agents; analytical work that must preserve full constraint structure can't run there

**Caveat**: the 60–70% number is averaged across project types. For **boilerplate-heavy applications** (CRUD, glue code, well-typed transforms), automation runs higher — 80%+ is plausible. For **systems software** (Ivanov's SQLite example), 40–50% is more realistic. The variance is large.

### 4.2 The 3× paradox — supported, but a specific case of Amdahl

If automation factor = 3× and automated fraction = 66%, then total speedup = 1 / (0.34 + 0.66/3) = **1.79×** total. With humans now bottlenecking on spec-writing (the 34% that stays human), absolute calendar time scales with spec-writing capacity. Ivanov's observation that "bot time ≈ task-writing time" is the Amdahl bottleneck flipping which side dominates.

**Implication for our stack**: tools that accelerate spec-writing (FlowSpec /flow:specify, GRACE context engineering, RSTMDB knowledge reuse) directly relax the Amdahl bottleneck. This is *our* category, and our positioning narrative should lean into it.

### 4.3 Career stratification — broadly correct, with one missing axis

Ivanov's "Business Modeling vs Implementation" cleavage misses a third role that's both **safe AND high-leverage**: **Verification / Provenance / Formal Methods specialist**. With EU AI Act enforcement (August 2026) and SOC2/ISO compliance demands, the role of "writes the formal contract, proves the AI-generated code meets it" is *expanding*, not shrinking. This is where Infer / Invariantis / zz-notation sit — orthogonal to both the RUP phase model and the standard Agile career ladder.

---

## 5. Strategic Position — Where We Sit on the Ivanov Map

Plotting our ecosystem against Ivanov's framework:

```
          Business      Analysis &     Implementation /
          Modeling /    Design /       Testing /
          Requirements  Modeling       Deployment
          (5%)          (30%)          (50% + 15%)
            │             │              │
            │             │              │
   HUMAN ───┼─────────────┼──────────────┼─── 100% AGENT
            │             │              │
          GRACE         FlowSpec       Claude Code /
          RSTMDB        /flow:specify  Codex / Cursor
          Infer         /flow:plan     (commodity layer)
                        ZomboCraftEco
                        manifest
                        ─────────────
                        invariantis  ← orthogonal
                        zz-notation     verification axis
```

**Net positioning**: our entire ecosystem clusters in the **Booch-safe zone** (left half of the diagram) plus the orthogonal verification axis. We are *not* competing with commodity coding agents. We are building the persistent assets — specs, contracts, knowledge — that the commodity layer needs to consume.

This is consistent with `requirements-management-ai-epoch.md`'s competitive map and validates the "infer engine proves facts, RSTMDB eco, dogfood-first" product vision.

---

## 6. Follow-Up Hooks

Concrete handles for downstream work, *not* a list of new tickets to create.

1. **Education curriculum order** — feed Ivanov's career-safety stratification into the docs-c02 Praxis-Theoria-Gnosis curriculum design. The labor market is teaching the same lesson the Kolmogorov Correction predicts.
2. **FlowSpec positioning narrative** — the "3× paradox → Amdahl flips to spec-writing" framing is *the* one-line pitch for FlowSpec/GRACE/RSTMDB. Adopt it.
3. **Booch lineage as research-doc target** — Booch/Rumbaugh/Jacobson have never been written up as a school in our genealogy. They map naturally between `management-schools.md` (process methodology) and `bell-labs-shannon-school.md` (engineering rigor). A `rational-rup-school.md` would close that gap.
4. **AUP / DAD lineage in RM doc** — `requirements-management-ai-epoch.md` currently undersells AUP (Ambler → DAD → PMI Disciplined Agile). Add a row.
5. **Verification specialist track** — extend the labor-stratification analysis with the *third* career path (formal-methods/provenance) that Ivanov's binary misses. Connects to `em3-prep-management-asmt-politics.md` framing.

---

## 7. Sources

**Cited (chat)**:
- Vladimir Ivanov, AI Projects chat, 2026-05-12 09:26 (primary source for Claims A–D)
- Andrei (2026-05-12 10:12) — nostalgic confirmation, no new claim
- Kirill (2026-05-12 10:25) — confirms human acceptance gate persists in personal practice

**Foundational (Booch lineage)**:
- Grady Booch, *Object-Oriented Analysis and Design with Applications*, Benjamin/Cummings (1991, 2/e 1994); Addison-Wesley (3/e 2007)
- Walker Royce, *Software Project Management: A Unified Framework*, Addison-Wesley (1998) — source of the 5/30/50/15 ratios
- Philippe Kruchten, *The Rational Unified Process: An Introduction*, Addison-Wesley (1998, 3/e 2003)
- Jacobson, Booch, Rumbaugh, *The Unified Software Development Process*, Addison-Wesley (1999)
- Scott W. Ambler, *Agile Unified Process* — http://www.ambysoft.com/unifiedprocess/agileUP.html

**Internal cross-references**:
- `docs/research/agentic-management-flows.md` (docs-24r)
- `docs/research/requirements-management-ai-epoch.md` (docs-saw6)
- `docs/research/grace-methodology-canonical-shutov-vision.md`
- `docs/research/management-schools.md`
- `docs/research/multi-agent-codebase-navigation-pipeline.md`
- `docs/research/learning-is-forgetting-ib-llm-tishby-compression.md`
- `docs/research/superposition-collapse-prompting-brainstorm-llm.md`
- Kolmogorov Correction (open: docs-c02 / TASK-96)

---

*Research note — channel intelligence captured 2026-05-13.*
