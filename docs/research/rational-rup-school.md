# Rational / RUP / Booch School

> **Template version**: 1.0
> **Last updated**: 2026-05-13
> **Status**: Complete
> **Beads task**: docs-rgoc
> **School Type**: Corporate methodology lab → standards ecosystem

---

## 1. School Overview

| Field | Value |
|---|---|
| **Founders** | Grady Booch (1955–); James Rumbaugh (1947–); Ivar Jacobson (1939–) — joined 1994–1995 |
| **Institutional anchor** | Rational Software Corporation (founded 1981, Paul Levy & Mike Devlin) |
| **Locations** | Cupertino, CA → Lexington/Burlington, MA (post-IPO); after 2003 absorbed into IBM Rational (Boston, Raleigh) |
| **Active Period** | 1981–2003 standalone; 2003–present as IBM Rational / IBM Engineering Lifecycle Management |
| **Primary Domains** | Object-oriented analysis & design (OOAD), modeling languages (UML, SysML), software process (RUP), software project economics, software architecture (4+1 views), use-case-driven engineering |

### Historical Context

Rational Software is unusual among the schools in our corpus: it is a **corporate methodology lab** that won the "method wars" of the late 1980s and early 1990s, codified its victory as an OMG/ISO standard (UML), and sold the lifecycle tooling that ran on top of it (Rational Rose, ClearCase, ClearQuest, RequisitePro, Rational Unified Process). It is closer in shape to Bell Labs than to a university school — but where Bell Labs's products were physical artifacts (transistor, UNIX, C), Rational's products were *processes and notations*.

The methodological landscape Rational consolidated was crowded. By 1990 there were dozens of incompatible OO methodologies — Booch (1986/1991), Coad-Yourdon (1990), Rumbaugh's OMT (1991), Jacobson's OOSE (1992), Wirfs-Brock CRC (1990), Shlaer-Mellor (1988), Martin-Odell (1992), and others. Vendors and customers were bewildered. The **merge** happened at Rational: Booch joined as Chief Scientist in 1994, Rumbaugh moved from GE Research the same year, and Jacobson followed in 1995 (when Rational acquired his Objectory AB). The three founders became known as the *Three Amigos*. Their public goal was a unified notation; their commercial goal was to make Rational's tooling the default platform for software architecture work.

UML drafts circulated in 1995–96; OMG adopted UML 1.1 in November 1997, formally establishing it as the industry-wide modeling language. The Rational Unified Process was packaged commercially in 1998 from Jacobson's earlier *Objectory Process*, taking the use-case-driven core and overlaying iterative, risk-driven, architecture-centric phasing. Rational rode the dot-com expansion (NASDAQ listing 1984; market cap peaked ~$8B in 2000), survived the bust, and was acquired by IBM in February 2003 for $2.1 billion in cash. The Rational brand persisted inside IBM through the 2010s and is now folded into *IBM Engineering Lifecycle Management* (formerly Rational CLM).

The school's intellectual influence extends well past its commercial peak. UML is taught in every undergraduate CS curriculum. RUP's phase model (with its empirical 5/30/50/15 effort distribution) remains the default reference even where Agile is practiced. The 4+1 architectural view model is the unofficial textbook answer for "how do I document an architecture." This canonical status is exactly what AI Projects channel intelligence captured in 2026: *"no one made anything more intelligent than Booch in IT-project norming"* (Vladimir Ivanov, 2026-05-12).

---

## 2. Key Figures

### Founder: Grady Booch

Grady Booch was born on February 27, 1955, in Texas. He earned a BS from the United States Air Force Academy (1977) and an MSc in electrical engineering from the University of California, Santa Barbara (1979). He served in the USAF before joining Rational in 1981 as one of its earliest employees, where he led the development of the Booch Method through the 1980s. He served as Rational's Chief Scientist from the mid-1990s through the IBM acquisition and continued as **IBM Chief Scientist for Software Engineering** afterward.

Booch's signature artifact is *Object-Oriented Analysis and Design with Applications* (1991, 2/e 1994, 3/e 2007 with Maksimchuk, Engle, Young, Conallen, Houston) — the canonical text from which a generation of OO practitioners learned the discipline. His later *Handbook of Software Architecture* (initiated 2002, ongoing) attempted a Vitruvian catalog of major software systems. Booch has received the IEEE Computer Pioneer Award (2007), the Lovelace Medal (2007), and ACM Fellowship.

### Co-founder: James Rumbaugh

James Rumbaugh (born 1947) studied physics at MIT (BS 1968) and earned a PhD in computer science from MIT under Jack Dennis [needs verification of advisor]. He spent most of his career at General Electric R&D Center, where he developed the **Object Modeling Technique (OMT)**, published as *Object-Oriented Modeling and Design* (with Blaha, Premerlani, Eddy, Lorensen, 1991). He left GE to join Rational in 1994. Rumbaugh's principal contributions to UML were the class-diagram notation (largely inherited from OMT) and state-machine modeling.

### Co-founder: Ivar Jacobson

Ivar Jacobson (born September 1939, Sweden) trained at the **Royal Institute of Technology (KTH), Stockholm**, with a PhD in 1985 supervised by Ole-Johan Dahl [needs verification of supervisor] — putting him in direct lineage with the Norwegian SIMULA / Simula 67 tradition (the historical root of object-oriented programming). He spent his early career at **Ericsson** (1967–1987) developing the AXE telephone exchange system, where he pioneered the **use-case** concept (1986) and the architecture/process discipline that became OOSE. He founded **Objectory AB** in 1987 to commercialize this work. Objectory AB was acquired by Rational in October 1995, bringing Jacobson into the Three Amigos.

After leaving Rational/IBM in the early 2000s, Jacobson founded **Ivar Jacobson International** and led the **SEMAT initiative** (Software Engineering Method and Theory, 2010s) and its *Essence* kernel — a meta-framework for combining and tailoring methods.

### The Phase-Ratio Codifier: Walker Royce

Walker Royce (son of **Winston Royce**, author of the much-misread 1970 "Managing the Development of Large Software Systems" paper) joined Rational from **TRW**, where he managed large defense-software contracts. He authored *Software Project Management: A Unified Framework* (Addison-Wesley, 1998), the canonical source for the **5% / 30% / 50% / 15%** RUP phase distribution (Inception / Elaboration / Construction / Transition) — empirically derived from 100+ Rational client engagements. Walker Royce served as Rational's VP of Worldwide Services and stayed on at IBM Rational after 2003.

### The Architect: Philippe Kruchten

Philippe Kruchten (Belgian-French-Canadian) was Rational's Director of Process Development and the principal author of **The Rational Unified Process: An Introduction** (Addison-Wesley, 1998; 2/e 2000; 3/e 2003). His independently most-cited contribution is the **4+1 Architectural View Model** ("Architectural Blueprints — The 4+1 View Model of Software Architecture," *IEEE Software* 12(6), November 1995). After Rational, Kruchten moved to the **University of British Columbia** (Department of Electrical and Computer Engineering, 2004–present), where he remains active in both software-engineering research and the Agile community.

### The Agile Bridge: Scott Ambler

Scott Ambler is the figure who kept the RUP skeleton alive after Agile's marketing dominance. He authored the **Agile Unified Process (AUP)** in 2005 — a lightweight, RUP-shaped Agile process. With Mark Lines he co-authored **Disciplined Agile Delivery (DAD)** in 2012, which was later expanded to the **Disciplined Agile (DA)** toolkit. The DA portfolio was **acquired by the Project Management Institute (PMI) in August 2019**, putting RUP DNA inside the largest professional body in project management.

### Other Notable Rational Figures

| Name | Role | Contribution |
|---|---|---|
| Paul Levy | Co-founder, CEO | Founded Rational with Devlin (1981); UC Berkeley background |
| Mike Devlin | Co-founder | Co-led commercial growth; eventually CTO |
| John Smith | Distinguished Engineer | RUP Configuration & Change Management discipline |
| Per Kroll | Process Lead | *The Rational Unified Process Made Easy* (2003); led RUP simplification |
| Bran Selic | Distinguished Engineer | Real-time UML, MARTE, model-driven architecture |
| Jim Conallen | Methodologist | UML extensions for web applications |

### Diaspora and International Connections

Rational's diaspora is methodological more than geographic. After the IBM acquisition:

- **Booch** stayed at IBM as Chief Scientist for Software Engineering, writing and lecturing widely.
- **Rumbaugh** continued at IBM Rational; later retired.
- **Jacobson** founded Ivar Jacobson International and SEMAT/Essence, influencing the *Object Management Group (OMG) Essence* standard (2014).
- **Kruchten** became a UBC professor and crossed into Agile/scaling research.
- **Ambler** carried RUP-DNA into PMI Disciplined Agile (2019).
- **Bran Selic** moved to model-driven engineering research (Eclipse Modeling Project, MARTE, OMG MDA).

A separate diaspora went through the **Eclipse Process Framework (EPF) Composer** project (2005–) and **OpenUP** — open-source RUP successors. EPF carried the Rational process metamodel into the Eclipse Foundation, where it influenced model-driven engineering tooling and the modern Spec-Driven Development line.

---

## 3. Core Contributions

### 3.1 UML — Unified Modeling Language

- **What it addresses**: a single notation for software analysis and design replacing the dozens of competing OO method notations of the 1980s
- **Status**: OMG standard since UML 1.1 (November 1997); UML 2.5 (2015) current; SysML v1.x extends to systems engineering; **SysML v2** (2025) is the major modernization
- **Legacy**: still the dominant teaching notation; weakened in industrial practice as code-first / "the code is the model" took over; reborn in MBSE / SysML v2 for safety-critical and AI-assurance contexts

### 3.2 RUP — Rational Unified Process

- **What it addresses**: a commercial, iterative, use-case-driven, architecture-centric, risk-driven process framework
- **Phases**: Inception, Elaboration, Construction, Transition
- **Disciplines (9)**: Business Modeling, Requirements, Analysis & Design, Implementation, Test, Deployment, Configuration & Change Management, Project Management, Environment
- **Status**: tooling still sold inside IBM ELM; methodology absorbed into Disciplined Agile (PMI); strong residual presence in regulated industries (aerospace, defense, healthcare, banking)

### 3.3 Walker-Royce Phase Ratios — 5 / 30 / 50 / 15

| Phase | Deliverable | Effort & calendar share |
|---|---|---|
| Inception | Vision, business case, scope | **5%** |
| Elaboration | Architecture baseline, prototype, validated use cases | **30%** |
| Construction | Tested product, full feature set | **50%** |
| Transition | Deployment, acceptance, handoff | **15%** |

Empirically derived by Walker Royce from ~100 Rational client engagements (1998). Holds with small variance across RUP and simplified variants (AUP, Disciplined Agile, OpenUP). This is the empirical kernel Ivanov referenced in the AI Projects chat (2026-05-12) and the anchor for our `it-management-rup-booch-ai-mapping.md` analysis.

### 3.4 4+1 Architectural View Model (Kruchten 1995)

Five concurrent views over one architecture: **Logical** (functionality), **Process** (concurrency), **Development** (code organization), **Physical** (deployment), plus the **+1 Use Case** view that ties the other four together. This single paper became the unofficial standard for architecture documentation and survives in modern derivatives (arc42, Simon Brown's C4 model).

### 3.5 Use-Case Driven Approach (Jacobson 1986–1992)

Use cases as the persistent thread connecting business need → requirements → analysis → design → implementation → test. Pre-dates the Three Amigos merge and is Jacobson's signature contribution; it remains the most-stolen idea in modern requirements engineering, including Agile user stories (which are use-case fragments with extra ceremony stripped off).

### 3.6 Tooling — Rational Rose, ClearCase, ClearQuest, RequisitePro

The commercial substrate that monetized the methodology. Rational Rose was the UML CASE tool that bankrolled the school. ClearCase and ClearQuest were the version-control and defect-tracking complements. RequisitePro made requirements traceable. The tooling-bundle business model is itself an artifact worth noting — methodology became sticky because the tools enforced it.

---

## 4. Modern Tech Prototypes and Successors

Rational's intellectual estate split into roughly three branches after 2003: a **modeling-language line** (UML → SysML → MBSE), a **process line** (RUP → AUP → DAD → PMI Disciplined Agile), and an **architecture-documentation line** (4+1 → arc42 → C4). Each line absorbed selective ideas, dropped the heavyweight tooling-bundle business model, and adapted to the open-source / cloud / AI eras.

### 4.1 The Modeling-Language Line — UML → SysML → SysML v2

**SysML v1.x (2007)** was the first major UML offshoot: an OMG profile that extended UML to systems engineering for hardware/software/process co-modeling, driven by aerospace, defense, and automotive industries that needed something more rigorous than UML alone. It carried forward UML's class/state/sequence diagrams but added requirement diagrams and parametric (constraint) diagrams. SysML v1 was widely deployed in safety-critical contexts (Lockheed Martin, NASA, Airbus, automotive Tier-1s) but suffered from UML's notational sprawl and tooling cost.

**SysML v2 (2025)** is the major modernization — a ground-up rewrite with a textual + graphical surface syntax built on a formal metamodel (KerML), explicit API-first design for tooling interoperability, and first-class machine-readability. OMG approved final adoption on 21 July 2025; specification published 3 September 2025; major vendors (PTC) shipping. **Scope caveat (per `eu-ai-act-mbse-sysml-v2-substrate-validation.md`)**: SysML v2 is the natural AI-integration substrate only for the *subset* of EU AI Act high-risk systems that are also safety-critical (aerospace, automotive, medical devices, defense, space) where V-model regimes (DO-178C, ISO 26262, IEC 62304) already mandate MBSE traceability. The broader EU AI Act compliance substrate is **ISO/IEC 42001 + CEN-CENELEC JTC 21 harmonised standards (prEN 18286 first)**, not MBSE/SysML. This is the descendant most relevant to our verification specialist career-track research (docs-gw2e) for the safety-critical-AI vertical.

### 4.2 The Process Line — RUP → AUP → DAD → PMI Disciplined Agile (2019)

**AUP (Scott Ambler, 2005)** stripped RUP's tooling dependence and ceremony density while keeping the four-phase structure, the disciplines, and the empirical phase ratios. AUP was free, documented on Ambler's site, and explicitly positioned as RUP's bridge into the Agile era — RUP-shaped Agile, not RUP-with-Agile-stickers.

**DAD — Disciplined Agile Delivery (Ambler & Lines, 2012)** expanded AUP into a delivery-lifecycle toolkit covering Scrum, Kanban, Lean, and AUP variants under one decision-framework umbrella. DAD added explicit *goals* (the things any process must address) and *decision points* (where teams choose among options) — turning RUP's prescriptive process into a tailorable framework.

**PMI Disciplined Agile (DA, 2019)** is the current form. PMI acquired Disciplined Agile from Ambler in August 2019 for an undisclosed sum, folding it into the Project Management Institute's certification ladder (DASM, DASSM, DAC, DAVSC). PMI brought 1M+ certified PMs as a distribution channel, and the move put RUP-derived DNA inside the largest professional body in project management. The substrate persists in PMI's BABOK-style Business Analysis tracks and PMBOK Guide 7th edition (2021), which dropped its prescriptive process for a principles-based approach drawn substantially from DA.

### 4.3 The Architecture-Documentation Line — 4+1 → arc42 → C4

**arc42 (Gernot Starke, Peter Hruschka, 2005–)** is a free template for architecture documentation that follows the 4+1 spirit (concurrent views over one system) but uses pragmatic prose-and-diagram sections rather than formal UML diagrams. arc42 is now the de facto standard for architecture documentation in German-speaking enterprise software and has spread widely in Europe.

**C4 Model (Simon Brown, 2010s)** distilled architecture documentation further into four levels: Context, Containers, Components, Code. C4 is the *most popular* modern architecture documentation approach for cloud-native systems — it deliberately rejects UML's notational requirements in favor of "diagrams as code" workflows (Mermaid, Structurizr, PlantUML). C4 is what Kruchten's 4+1 looks like after thirty years of pruning.

### 4.4 The Process-Metamodel Line — EPF / OpenUP / Essence

**Eclipse Process Framework (EPF) Composer (2005–)** open-sourced the Rational process metamodel. **OpenUP** was the EPF-hosted RUP successor — a minimal, Eclipse-licensed process with the same disciplines but lighter ceremony. OpenUP did not achieve broad commercial adoption but seeded the model-driven engineering tooling that survives in modern MDE practice.

**OMG Essence / SEMAT (Jacobson et al., 2014)** is Jacobson's post-Rational project: a *method kernel* of universal software-engineering "things" (Way of Working, Software System, Team, Stakeholders, Opportunity, Requirements, Work) and "alphas" (lifecycle state machines) that any specific method must instantiate. Essence is RUP's intellectual heir filtered through twenty years of methodology pluralism — a meta-framework, not a method. Adoption has been thin but it influences the SEMAT community and academic software-engineering curricula.

### 4.5 Modern Specification-First — Spec-Driven Development

**Spec-Driven Development** (Thoughtworks 2024, AWS Kiro 2025) is the AI-era successor that matters most for our project. SDD takes the RUP principle "specification is the persistent asset" and adapts it for LLM-assisted coding: the spec is the source of truth, code is the *derived artifact* (generated, regenerated, or verified against the spec). SDD drops RUP's phase ceremony, keeps the spec-first discipline, and adds AI-specific concerns (prompt engineering, validation, drift detection). This is precisely the lineage point where our own work sits.

### 4.6 Our Stack — FlowSpec / GRACE / RSTMDB

We sit downstream of SDD with specific extensions:

- **FlowSpec** carries forward the *spec-as-artifact* and *phase-discipline* RUP DNA, modernized with AI-native context engineering (`/flow:specify`, `/flow:plan`).
- **GRACE** is the modern equivalent of *use-case-driven analysis*: structured prompts as the persistent specification of intent, with semantic-shield contracts protecting against LLM drift.
- **RSTMDB** provides the durable knowledge substrate that 4+1 views and use cases were *trying* to be in the 1990s, but with formal-relation backing rather than UML notation.

### 4.7 What Did Not Survive

Three Rational lines effectively died:

- **Rational Rose** — the CASE tool that funded the methodology — was discontinued by IBM in 2017, replaced by Rational Software Architect (also discontinued in favor of IBM ELM).
- **OOAD-as-discipline** — the standalone profession of "object-oriented analyst/designer" disappeared; the work merged into general software engineering with code-first practice.
- **Methodology as a sellable product** — the commercial model where vendors sold *process licenses* (RUP licenses, CMMI assessments) gave way to open methodology + paid tooling, and now to open methodology + paid AI assistance.

### 4.8 The Common Pattern

The clearest *living* descendant in 2026 is not RUP-the-product but **RUP-the-vocabulary**: phase ratios, 4+1 views, use cases, disciplines, iteration planning, and risk-driven sequencing all still structure how senior engineers and architects think — even when they call themselves Agile, even when they call themselves AI-native. Every successor above is a *selective compression* of RUP that keeps the empirically validated parts (phase ratios, spec-first discipline, architectural views) and drops the parts that didn't scale to the open-source / cloud / AI eras (tooling lock-in, notational ceremony, vendor licensing).

---

## 5. Intellectual Lineage

Rational's methodology synthesis (1994–98) did not arrive ex nihilo. It is the convergence of two distinct intellectual streams: the **OO-language tradition** (running from SIMULA forward through Smalltalk, Eiffel, C++, Objective-C) which gave Rational its *object* — and the **software-engineering process tradition** (running from Dijkstra, Parnas, Royce, Boehm) which gave Rational its *project*. The Three Amigos sat at the intersection. Understanding which idea came from which tradition explains why RUP succeeded where pure-OO methods and pure-process methods had failed separately.

### 5.1 Upstream — Two Streams Converging on Rational

```
   OO-LANGUAGE STREAM                      SE-PROCESS STREAM
   ─────────────────────                   ─────────────────────

   Ole-Johan Dahl & Kristen Nygaard       Edsger Dijkstra
   SIMULA 67 (1967)                       Structured Programming (1968)
   "objects + inheritance"                "GOTO considered harmful"
            │                                       │
            ▼                                       ▼
   Alan Kay — Smalltalk (1972)            David Parnas
   "objects + messages"                   Information hiding (1972)
            │                              Modular decomposition (1985)
            ├──────────────┐                       │
            ▼              ▼                       ▼
   Bjarne Stroustrup    Bertrand Meyer    Niklaus Wirth
   C++ (1985)           Eiffel (1986)     Modula-2 (1978)
            │           Design-by-       Yourdon-Constantine
   Tom Love +           Contract         Structured Design (1979)
   Brad Cox             "preconditions"            │
   Objective-C (1983)                     Winston Royce — iterative
            │                              phasing (1970, misread)
            │                              Barry Boehm — Spiral (1986)
            │                              COCOMO (1981)
            │                              Capers Jones — metrics (1980s)
            │                                       │
            └─────────────┬─────────────────────────┘
                          │
                          ▼
              RATIONAL SYNTHESIS (1994–98)
              ── Booch + Rumbaugh + Jacobson ──
              UML (1996/97) + RUP (1998) + 4+1 (1995)
              + Walker-Royce phase ratios (1998)
```

#### How each upstream link landed in Rational's synthesis

**SIMULA 67 → object model.** The class-inheritance-polymorphism trio that everyone now treats as default arrived through Dahl and Nygaard's discrete-event simulation language. Booch's earliest writing (1986 papers) is *recognizably SIMULA* with Ada syntax. Without SIMULA's prior demonstration that objects could organize a non-trivial system (the simulation domain forced the issue), the 1980s OO method explosion would not have had a substrate.

**Smalltalk → message-passing semantics.** Alan Kay's Smalltalk (Xerox PARC) was Rational's *cultural* upstream as much as technical: the idea that objects communicate via messages (not function calls) shaped Jacobson's collaboration diagrams and the dynamic-view sections of UML. Kay's late insistence that *"the big idea is messaging, not objects"* is exactly what UML's interaction diagrams try to capture.

**Eiffel → design-by-contract.** Bertrand Meyer's Eiffel introduced *preconditions, postconditions, and invariants* as first-class language constructs. Rational adopted the discipline (use cases as informal contracts, OCL as the formal layer for UML), but never the language. Meyer's tradition surfaces in our verification specialist work (docs-gw2e) — formal contracts on AI-generated code is Eiffel's grandchild.

**C++ and Objective-C → tooling reality.** By the time Booch was writing the 1991 book, C++ (1985) and Objective-C (1983) had given OO industrial reach. Rational's earliest commercial tooling targeted Ada (founders' background) but quickly pivoted to C++; Rational Rose's market dominance in the late 1990s rode the C++ enterprise wave.

**Dijkstra → structured-program rigor.** Dijkstra's "GOTO considered harmful" (CACM 1968) and *A Discipline of Programming* (1976) set the precondition for any methodology being taken seriously: programs are mathematical objects, not just artifacts. Rational inherited this seriousness; the Agile counter-revolution partly rejected it.

**Parnas → information hiding and modular decomposition.** Parnas's 1972 paper on module decomposition criteria is the conceptual ancestor of *encapsulation* in OO and of *components* in UML. His 1985 paper on "tabular notations" anticipates use-case tables. Rational rarely cited Parnas directly, but the architecture-documentation line (Kruchten's 4+1 views, then arc42 and C4) is structurally Parnas.

**Wirth and Yourdon-Constantine → modular programming and structured design.** The pre-OO modular tradition (Modula-2, structured design) gave Rational the *project decomposition* habit (one module = one responsibility) that became *one use case = one slice of value* under Jacobson.

**Winston Royce → iterative phasing (misread as waterfall).** Winston Royce's 1970 paper proposed an iterative model with explicit feedback loops; it was misread by industry for two decades as "waterfall." Walker Royce, his son, returned to the original iterative reading inside Rational and converted it into the RUP four-phase model. The 5/30/50/15 ratios are the empirical descendant of Winston Royce's 1970 effort estimates.

**Boehm → spiral model and project economics.** Barry Boehm's Spiral Model (1986) and COCOMO (1981) gave software project management its first defensible *quantitative* footing. RUP absorbed the risk-driven sequencing from Spiral and the empirical phase-ratio mindset from COCOMO. Walker Royce's *Software Project Management* (1998) is unimaginable without Boehm's groundwork.

### 5.2 Downstream — What Rational Fed Forward

```
                 RATIONAL (Three Amigos, 1994–95)
                              │
       ┌──────────┬───────────┼───────────┬──────────────┬────────────┐
       │          │           │           │              │            │
       ▼          ▼           ▼           ▼              ▼            ▼
     UML        RUP        4+1 views   Use cases     Rational Rose  Process
     (1997)     (1998)     (1995)      (Jacobson)    CASE tool      metamodel
       │          │           │           │              │            │
       ▼          ▼           ▼           ▼              ▼            ▼
   SysML 1.x   AUP (2005)  arc42      Agile           IBM ELM       Eclipse
   (2007)      DAD (2012)  Simon       user           (post-2017    Process
   SysML v2    PMI DA      Brown C4    stories        rebrand)      Framework
   (2025)      (2019)      Model                                    + OpenUP
       │          │           │           │              │            │
       ▼          ▼           ▼           ▼              ▼            ▼
   MBSE/EU     PMBOK       Cloud-      Agile          (sunset)      OMG Essence
   AI Act      Guide 7e    native      Manifesto                    / SEMAT
   audit       (2021)      architec-   (2001)                       (Jacobson)
   substrate   PM-cert     ture                                         │
                                                                        ▼
                                                                  Spec-Driven
                                                                  Development
                                                                  (2024–)
                                                                        │
                                                                        ▼
                                                            FlowSpec/GRACE/RSTMDB
                                                                  (our stack)
```

#### How each downstream link inherits or mutates from Rational

**UML → SysML v2 → MBSE.** UML's class/sequence/state diagrams became the substrate of SysML, which became the substrate of Model-Based Systems Engineering (MBSE). SysML v2's OMG ratification (July 2025) and publication (Sept 2025) modernized the metamodel — KerML now gives UML's underlying structure a tractable textual+graphical form. **Important scope correction**: I originally claimed the EU AI Act drives MBSE/SysML v2 re-emergence broadly; validation work in `eu-ai-act-mbse-sysml-v2-substrate-validation.md` shows this is overstated. The actual EU AI Act compliance substrate is **ISO/IEC 42001 (AIMS) + CEN-CENELEC JTC 21 harmonised standards (prEN 18286 QMS first, public enquiry from 30 Oct 2025)** — not MBSE/SysML. MBSE/SysML v2 is the substrate only for the *safety-critical subset* of EU AI Act high-risk scope (aerospace, automotive, medical, defense, space), where existing V-model regimes (DO-178C, ISO 26262, IEC 62304) already mandate MBSE traceability and the AI Act overlays additional obligations. For generative AI, hiring AI, credit scoring, education AI, and most other high-risk categories, the substrate is governance frameworks (ISO 42001 + NIST AI RMF), not MBSE.

**RUP → AUP → DAD → PMI Disciplined Agile.** Section 4.2 documents the chain. The key inheritance is the *discipline structure* (Business Modeling, Requirements, Analysis & Design, Implementation, Test, Deployment, Configuration & Change, Project Management, Environment) — these nine areas appear in every successor under different naming. PMBOK Guide 7th edition (2021) abandoned its long-standing prescriptive process for principles-based delivery, drawing substantially from DA.

**4+1 views → arc42 → C4.** Kruchten's five concurrent views compressed into Brown's four levels (Context, Containers, Components, Code). The *spirit* — multiple aligned views of one architecture — survives; the *notation* (UML diagrams) was dropped. C4's "diagrams as code" workflow (Structurizr, Mermaid, PlantUML) is what 4+1 looks like after cloud-native adoption removed the central-CASE-tool assumption.

**Use cases → Agile user stories.** Mike Cohn's user-story format ("As a *role*, I want *capability* so that *value*") is a *fragment* of Jacobson's use case (specifically the basic-flow header). The detailed flow, alternative flows, extension points, and inclusion relationships were dropped — though they reappear under different names in BDD scenario tables and Gherkin "given/when/then" structures. The most-stolen idea in modern requirements engineering.

**Rational Rose → IBM Engineering Lifecycle Management → sunset.** The tooling line ended commercially: Rose was discontinued by IBM in 2017, ELM has been deprioritized inside IBM, and the open-source equivalents (Eclipse Papyrus, draw.io with UML stencils, PlantUML) absorbed what remained of the market. *The lesson: tools paid for the methodology; the methodology outlasted the tools.*

**Process metamodel → Eclipse Process Framework → OMG Essence/SEMAT.** The meta-meta layer — *how to describe processes formally* — survived in Eclipse and in Jacobson's SEMAT/Essence work. This is the layer our own FlowSpec workflow YAML descends from intellectually, though we built it independently.

### 5.3 Critical Reception — Agile as the Loyal Opposition

```
                  RATIONAL synthesis (1994–98)
                              │
                              │ provokes
                              ▼
              Agile Manifesto (Snowbird, Feb 2001)
              17 signatories, four value pairs
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
   Kent Beck            Schwaber + Sutherland     Mike Cohn
   XP (1999)            Scrum (1995, book 2001)   User Stories
   TDD                  Sprints + roles            (use-case fragment)
   Pair Programming
       │                      │                      │
       └──────────────┬───────┴──────────────────────┘
                      │
                      ▼
              Mary Poppendieck — Lean SD (2003)
              David Anderson — Kanban (2010)
              SAFe, LeSS, Nexus (2010s scaling frameworks)
```

The Agile Manifesto's four value pairs are a point-by-point inversion of the RUP value proposition:

- *individuals and interactions over processes and tools* — RUP was process + tools
- *working software over comprehensive documentation* — RUP demanded UML diagrams
- *customer collaboration over contract negotiation* — RUP wrote contracts via use cases
- *responding to change over following a plan* — RUP had four phases with risk gates

Yet the relationship is not pure opposition. Booch was an *honorary participant* in the Snowbird meeting. Many of the seventeen signatories had RUP/UML backgrounds. The Manifesto worked *because* RUP existed to be reacted against; without a shared substrate, no inversion would have been legible. Twenty-five years later, both traditions coexist: Agile in product-software / consumer / startup contexts, RUP-derived discipline in regulated / safety-critical / large-system contexts. **Disciplined Agile (PMI 2019) is the explicit synthesis** — RUP discipline structure dressed in Agile vocabulary.

### 5.4 Modern Absorption — The AI Era (2024–)

```
              SDD spec-first principle (RUP DNA)
                              │
                              ▼
              Spec-Driven Development (Thoughtworks 2024,
                AWS Kiro 2025): spec = source of truth
                              │
                              ▼
              FlowSpec / GRACE / RSTMDB (our stack)
                ├── /flow:specify  (spec as artifact)
                ├── GRACE prompts  (use-case modernization)
                ├── RSTMDB         (formal knowledge substrate)
                └── invariantis    (Eiffel DBC descendant)
                              │
                              ▼
              EU AI Act 2026 → ISO/IEC 42001 + JTC 21 harmonised
              standards (prEN 18286 QMS first); SysML v2 substrate
              for the safety-critical-AI subset only
              [see eu-ai-act-mbse-sysml-v2-substrate-validation.md]
```

What is alive in our stack from the Rational tradition:

- **Phase discipline** — `/flow:assess` → `/flow:specify` → `/flow:plan` → `/flow:implement` → `/flow:validate` is RUP's four-phase model under different names, with empirical respect for Walker-Royce ratios.
- **Spec-as-persistent-asset** — FlowSpec's central premise. Pure RUP inheritance.
- **Use-case-driven analysis** — GRACE structured prompts are use cases for the LLM-execution era.
- **Design-by-contract** — invariantis carries the Eiffel/Meyer tradition forward into AI provenance.
- **Empirical phase ratios** — our `it-management-rup-booch-ai-mapping.md` validates the 5/30/50/15 distribution against agentic-management-flows Phase 0–6.

What we dropped from Rational:

- **Single-vendor process licensing** — open methodology, paid AI assistance, not paid process license.
- **UML notational ceremony** — diagrams when useful, prose and code when sufficient.
- **CASE-tool-driven workflow** — CLI-driven, LLM-assisted, IDE-integrated.

The honest summary: we are *neo-Rationalists* (in the methodology sense, not the philosophical sense). We carry the substrate forward, drop the lock-in, and add the AI-native layer.

---

## 6. Critical Reception — The Agile Counter-Tradition

The strongest critique of Rational came from inside the room. The **Manifesto for Agile Software Development** (February 2001, Snowbird Utah) was signed by 17 practitioners frustrated with RUP's ceremony and prescriptive tooling. The manifesto's four value pairs — *individuals over processes, working software over documentation, customer collaboration over contract negotiation, responding to change over plans* — read as a point-by-point inversion of the RUP value proposition.

Three observations on the reception:

1. **Marketing victory ≠ technical victory.** Agile won the marketing battle 2000–2015; RUP retained dominance in regulated industries (aerospace, defense, healthcare, finance) where Walker-Royce ratios still describe project reality.
2. **Booch signed the room.** Grady Booch is listed as an honorary participant in the Agile Manifesto. The Three Amigos were not enemies of Agile — they were the establishment Agile defined itself against.
3. **The Agile DNA carries RUP genes.** Use cases became user stories. Iterative phasing became sprints. 4+1 views became C4. The Definition of Done is risk-driven planning by another name. **Disciplined Agile** is RUP wearing an Agile T-shirt and PMI now owns it.

The honest verdict: Rational won the *substrate* (notation, vocabulary, phase model), Agile won the *practice rhetoric* (ceremonies, role naming, marketing). Both are alive in 2026; neither has been replaced.

---

## 7. Key Publications

1. Grady Booch, *Object-Oriented Analysis and Design with Applications*, Benjamin/Cummings (1991), 2/e Addison-Wesley (1994), 3/e (with Maksimchuk et al.) Addison-Wesley (2007).
2. James Rumbaugh, Michael Blaha, William Premerlani, Frederick Eddy, William Lorensen, *Object-Oriented Modeling and Design*, Prentice Hall (1991).
3. Ivar Jacobson, *Object-Oriented Software Engineering: A Use Case Driven Approach*, Addison-Wesley (1992).
4. Philippe Kruchten, "Architectural Blueprints — The 4+1 View Model of Software Architecture," *IEEE Software* 12(6), November 1995.
5. Walker Royce, *Software Project Management: A Unified Framework*, Addison-Wesley (1998) — canonical reference for 5/30/50/15 phase ratios.
6. Philippe Kruchten, *The Rational Unified Process: An Introduction*, Addison-Wesley (1998); 2/e (2000); 3/e (2003).
7. Ivar Jacobson, Grady Booch, James Rumbaugh, *The Unified Software Development Process*, Addison-Wesley (1999).
8. Grady Booch, James Rumbaugh, Ivar Jacobson, *The Unified Modeling Language User Guide*, Addison-Wesley (1999); 2/e (2005).
9. Scott Ambler, *Agile Unified Process* — http://www.ambysoft.com/unifiedprocess/agileUP.html (2005).
10. Scott Ambler, Mark Lines, *Disciplined Agile Delivery: A Practitioner's Guide to Agile Software Delivery in the Enterprise*, IBM Press (2012).
11. Ivar Jacobson, Pan-Wei Ng, Paul E. McMahon, Ian Spence, Svante Lidman, *The Essence of Software Engineering: Applying the SEMAT Kernel*, Addison-Wesley (2013).
12. OMG, *Unified Modeling Language (UML) Specification*, versions 1.1 (1997) through 2.5 (2015).
13. OMG, *Systems Modeling Language (SysML) v2 Specification*, 2025.

---

## 8. Cross-References

### Internal — TheoSciTech research

- [`management-schools.md`](management-schools.md) — Soviet/cybernetic management methodology lineage (Bogdanov → Beer); Rational is the Western corporate counterpart on the *software-process* axis.
- [`bell-labs-shannon-school.md`](bell-labs-shannon-school.md) — closest peer in the corporate-lab pattern, but Bell Labs's output was physical artifacts where Rational's was methodology and tooling.
- [`it-management-rup-booch-ai-mapping.md`](it-management-rup-booch-ai-mapping.md) — origin doc; maps the channel intelligence about Booch's continued canonical status to our agentic management framework.
- [`agentic-management-flows.md`](agentic-management-flows.md) — our 6-phase agentic flow maps cleanly onto the RUP phase distribution (Section 3.1 of the IT-management mapping).
- [`requirements-management-ai-epoch.md`](requirements-management-ai-epoch.md) — positioning landscape; explicitly places RUP/UML in the *legacy zone* relative to Type-Theoretic and Formal-RE+LLM methodologies, while acknowledging its empirical staying power.
- [`andreessen-breadth-depth-theosci-tech-critique.md`](andreessen-breadth-depth-theosci-tech-critique.md) — Walker-Royce phase ratios figure in the labor-market stack analysis (Elaboration 30% as the Theoria layer).
- [`carnegie-mellon-school.md`](carnegie-mellon-school.md) — SEI/CMMI is the parallel American process-improvement tradition; CMM and CMMI share substantial DNA with RUP discipline structure.
- [`inria-school.md`](inria-school.md) — European software engineering tradition; partial overlap on formal methods, distinct on commercial process.

### External — open follow-up tickets

- `docs-zygc` [P2] — extend `agentic-management-flows.md` with the 3× / Amdahl framing and Walker-Royce validation.
- `docs-gw2e` [P2] — verification specialist career track; RUP's "Test discipline" is the historical ancestor of modern formal-verification roles.
- `docs-c02` [P1] — Kolmogorov Correction (Education Division); Rational's empirical phase-ratio approach is a positive contrast to Kolmogorov's purely theoretical reform.

---

## 9. Notes — What This School Tells Us About Our Vision

Three observations worth carrying forward:

1. **The phase ratios survive every paradigm shift.** Waterfall → iterative → spiral → RUP → Agile → DevOps → DevSecOps → AI-assisted development have all redistributed the *vocabulary*, but the underlying 5/30/50/15 effort distribution persists empirically. This is one of the most robust empirical findings in software engineering and our agentic-flow architecture should respect it — not "reinvent it" in agent costume.

2. **The Three Amigos won by merging, not by competing.** The "method wars" ended because Booch/Rumbaugh/Jacobson chose convergence over distinction. The AI-era equivalent is FlowSpec/GRACE/RSTMDB choosing **interop and substrate convergence** (Curry-Howard + EARS + SDD + 4-valued logic) over a vendor-specific stack. The historical lesson: the unifier wins, and unification requires sacrificing some local optima.

3. **Tooling lock-in funded the methodology.** Rational Rose paid for UML. The commercial reality of any successful methodology is that it must come bundled with tools that enforce it cheaply. For our stack this means **FlowSpec needs first-class CLI/IDE integration**, **GRACE needs structured-prompt tooling**, and **RSTMDB needs durable storage tooling** — methodology alone does not propagate.

---

*Research note — Rational/RUP/Booch school documented as the methodology counterpart to Bell Labs in our corporate-lab school taxonomy, 2026-05-13.*
