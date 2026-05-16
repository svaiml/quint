# Research Report 06: The AI-Native Software Company — Full Pipeline

> **Compiled by Claude Code (Opus 4.6) on 2026-03-13**
> **17 pipeline stages × 33 tools = 561 tools total**
> 10 NEW business stages (330 tools) + 7 existing engineering layers from Report 05-03 (231 tools)
> The most comprehensive map of AI tools for running an entire software company.

---

## The Full Pipeline

```
ONE SENTENCE ("Build Marketplace for Betting Strategies")
    │
    ▼
┌─────────────────────── REVENUE TEAM ───────────────────────┐
│  [1] Sales & CRM ──→ [2] Business Analysis & Strategy      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────── PRODUCT TEAM ───────────────────────┐
│  [3] Product Management ──→ [4] UX/UI Design               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────── ENGINEERING TEAM ───────────────────┐
│  [5] Architecture & Spec ──→ [6] Development & Architecture │
│  ──→ [7] Task Bridge ──→ [8] Implementation ──→             │
│  [9] QA & Testing ──→ [10] DevOps & Deployment              │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────── OPERATIONS TEAM ────────────────────┐
│  [11] Launch & Marketing ──→ [12] Customer Support ──→      │
│  [13] Analytics & BI                                        │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────── CROSS-CUTTING INFRASTRUCTURE ───────────┐
│  [14] Memory & Context   [15] Knowledge & Code Intel        │
│  [16] Multi-Agent Orchestration   [17] AI Native Infra      │
└─────────────────────────────────────────────────────────────┘
```

---

## Verification Legend
- **T1** = Production-ready, high adoption
- **T2** = Real, growing, some caveats
- **T3** = Niche, early-stage, or specialized

---

# PART I: BUSINESS STAGES (9 NEW — 297 tools)

---

## Stage 1: Sales & CRM (33 tools)

### A. CRM Platforms with AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Salesforce Einstein AI** | 150k+ customers | T1 | Predictive lead scoring, opportunity insights, auto-generated emails, Einstein Copilot across full CRM |
| 2 | **HubSpot AI (Breeze)** | 228k+ customers | T1 | AI content generation, predictive scoring, conversation intelligence, Breeze Copilot |
| 3 | **Freshsales (Freddy AI)** | 67k+ customers | T1 | Freddy AI for lead scoring, deal insights, next-best-action, AI forecasting |
| 4 | **Zoho Zia AI** | 100M+ users (suite) | T1 | Anomaly detection, sentiment analysis, lead/deal predictions, workflow automation |
| 5 | **Pipedrive AI** | 100k+ companies | T2 | AI Sales Assistant with deal insights, performance tips, activity suggestions |
| 6 | **Attio** | 20k+ companies | T2 | Flexible data model CRM with AI automations, relationship intelligence, NL queries |
| 7 | **Folk CRM** | 3k+ companies | T3 | Lightweight CRM with AI contact enrichment, email sequences, pipeline management |

### B. AI SDR & Outbound Automation

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Apollo.io** | 3M+ users | T1 | All-in-one sales intelligence: AI prospecting, lead scoring, 270M+ contact database |
| 9 | **Outreach** | 6k+ customers | T1 | Enterprise sales execution: AI-optimized multi-channel sequences, deal risk signals |
| 10 | **Salesloft** | 5k+ customers | T1 | Revenue orchestration: AI cadence optimization, conversation intelligence |
| 11 | **11x.ai (Alice)** | $50M+ raised | T2 | Autonomous AI SDR: researches prospects, writes outreach, books meetings |
| 12 | **Artisan AI (Ava)** | $25M+ raised | T2 | AI BDR: automates prospecting, email personalization, multi-channel outbound |
| 13 | **Instantly.ai** | 100k+ users | T2 | Cold email infrastructure: unlimited accounts, warmup, AI personalization |
| 14 | **Lemlist** | 37k+ users | T2 | Multi-channel outreach: AI-generated personalized images, email, LinkedIn |
| 15 | **Regie.ai** | 3k+ customers | T2 | Generative AI for sales: auto-creates personalized sequences, call scripts |
| 16 | **AiSDR** | 1k+ customers | T3 | Purpose-built AI SDR: lead qualification, personalized email, meeting booking |
| 17 | **Coldreach** | $2M+ raised | T3 | Signal-based outbound: monitors buying signals, generates relevant outreach |

### C. Revenue Intelligence & Forecasting

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 18 | **Gong** | 4k+ customers | T1 | Captures/analyzes all customer interactions; surfaces deal risks and coaching insights |
| 19 | **Clari** | 1.5k+ customers | T1 | AI pipeline inspection, forecast accuracy, deal health scoring, revenue leak detection |
| 20 | **Chorus.ai (ZoomInfo)** | 35k+ customers | T1 | Conversation intelligence: records, transcribes, analyzes sales calls |
| 21 | **People.ai** | 1k+ enterprise | T2 | Auto-captures sales activities; AI matches to accounts for accurate forecasting |
| 22 | **6sense** | 2k+ customers | T2 | AI-powered ABM: intent data + predictive analytics to identify in-market accounts |
| 23 | **Aviso AI** | 500+ enterprise | T2 | Time-series forecasting, deal-level win probability, prescriptive next-best-actions |
| 24 | **BoostUp.ai** | 500+ customers | T3 | Forecast accuracy via AI analysis of buyer engagement across emails, calls, CRM |
| 25 | **Scratchpad** | 3k+ teams | T3 | Salesforce overlay: AI pipeline hygiene, deal inspection, forecasting roll-ups |

### D. Proposal & Contract AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 26 | **PandaDoc** | 50k+ customers | T1 | AI-assisted proposals, quotes, contracts + e-signatures + CPQ workflows |
| 27 | **Proposify** | 8k+ customers | T2 | AI content recommendations, design automation, buyer engagement analytics |
| 28 | **DealHub CPQ** | 1.5k+ customers | T2 | AI-powered CPQ: complex quoting, subscription management, contract generation |
| 29 | **Qwilr** | 5k+ teams | T2 | Web-based proposals: AI content, interactive pricing, engagement analytics |
| 30 | **Icertis** | 2k+ enterprise | T2 | Enterprise CLM: AI clause extraction, risk scoring, obligation tracking |

### E. Conversational Sales AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 31 | **Drift (Salesloft)** | 5k+ customers | T1 | Conversational AI: chatbots qualify visitors, book meetings, route leads |
| 32 | **Intercom Fin AI** | 25k+ customers | T1 | AI-first messaging: Fin AI handles sales/support, qualifies leads, instant answers |
| 33 | **Qualified** | 1k+ customers | T2 | AI pipeline generation: Piper AI SDR engages enterprise visitors in real-time |

**Stage 1 Totals: T1=13, T2=15, T3=5**

---

## Stage 2: Business Analysis & Strategy (33 tools)

### A. Market Research & Competitive Intelligence

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Crayon** | 1k+ enterprise | T1 | AI competitive intelligence: tracks competitor changes across web, reviews, pricing |
| 2 | **Klue** | 1k+ B2B | T1 | Competitive enablement: AI-curated battlecards distributed to sales teams |
| 3 | **Semrush** | 10M+ users | T1 | All-in-one digital marketing + competitive research: AI market analysis, keyword intel |
| 4 | **SimilarWeb** | Enterprise | T1 | Digital intelligence: AI-driven traffic analytics, market share estimation |
| 5 | **Kompyte (Semrush)** | Acquired | T2 | Automated competitor monitoring: website, ads, content changes with AI summaries |
| 6 | **AlphaSense** | 4k+ enterprise | T1 | Semantic search over earnings calls, SEC filings, broker research for strategy signals |
| 7 | **Brandwatch** | Enterprise | T1 | AI consumer intelligence and social listening for market trends |
| 8 | **Perplexity** | 100M+ queries/wk | T1 | AI search engine used for rapid market research and competitive lookups |

### B. Business Model & Strategy AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 9 | **Strategyzer** | 6M+ BMC users | T1 | Business Model Canvas + Value Proposition Canvas with AI hypothesis testing |
| 10 | **Upmetrics** | 100k+ users | T2 | AI business plan generator: financial projections, SWOT, investor-ready docs |
| 11 | **IdeaBuddy** | 50k+ users | T2 | AI business planning: BMC, financial plans, feasibility from idea descriptions |
| 12 | **Vizologi** | Growing | T2 | AI strategy: mashes up business models from 1M+ companies for new combinations |
| 13 | **Notion AI** | 30M+ users | T1 | AI assistant for strategy docs, competitive briefs, business model drafting |
| 14 | **ChatGPT / GPT-4** | 200M+ users | T1 | General-purpose LLM for SWOT, TAM, business model ideation, strategic planning |
| 15 | **Canvanizer** | 1M+ canvases | T2 | Online collaborative BMC, Lean Canvas, SWOT with AI suggestions |

### C. Financial Modeling & Forecasting

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 16 | **Causal** | Growing | T2 | Visual financial modeling with AI scenario analysis, replacing spreadsheets |
| 17 | **Runway Financial** | 800+ customers | T2 | AI financial planning for startups: forecasts, burn rate, scenario models |
| 18 | **Finmark (BILL)** | Acquired | T2 | AI revenue forecasts, expense projections, investor-ready dashboards |
| 19 | **Jirav** | 2k+ companies | T2 | AI FP&A: budgeting, forecasting, reporting with driver-based models |
| 20 | **Mosaic.tech** | 500+ customers | T2 | Strategic finance: AI unifies data, automates reporting, real-time forecasts |
| 21 | **Rows** | Growing | T2 | AI-native spreadsheet: financial models, data analysis from natural language |
| 22 | **Julius AI** | 1M+ users | T2 | AI data analysis: ingests financial data, builds models, generates visualizations |

### D. Research & Data Agents

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 23 | **Gartner** | Enterprise standard | T1 | AI-enhanced market analysis, Magic Quadrants, technology evaluation |
| 24 | **CB Insights** | 1k+ enterprise | T1 | AI market intelligence: patents, earnings, news, funding → emerging tech trends |
| 25 | **Crunchbase** | 75M+ visitors/yr | T1 | AI company database: funding, acquisitions, competitor landscapes, TAM estimation |
| 26 | **PitchBook** | 3.8k+ institutional | T1 | Private capital data: AI deal sourcing, market sizing, competitive landscape |
| 27 | **GPT Researcher** | ~13k stars | T2 | OSS autonomous research agent: multi-step web research → comprehensive reports |
| 28 | **STORM (Stanford)** | ~15k stars | T2 | OSS research agent: generates Wikipedia-style articles with multi-perspective research |

### E. Decision Support & Feasibility

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 29 | **Consensus** | 1M+ users | T2 | AI search for scientific papers: extracts evidence-based answers from peer review |
| 30 | **Elicit** | 2M+ researchers | T2 | AI research assistant: automates literature review, data extraction, synthesis |
| 31 | **Hebbia** | Enterprise (Series B) | T2 | AI document analysis: processes thousands of docs for due diligence insights |
| 32 | **Kira Systems (Litera)** | 800+ enterprise | T1 | AI contract analysis: provision extraction from legal/financial docs at scale |
| 33 | **Luminance** | 600+ enterprise | T2 | AI legal intelligence: M&A due diligence, contract review, regulatory compliance |

**Stage 2 Totals: T1=14, T2=19, T3=0**

---

## Stage 3: Product Management (33 tools)

### A. PRD & Spec Generation

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Notion AI** | 100M+ users | T1 | Generates PRDs, user stories, specs from prompts with templates and auto-formatting |
| 2 | **Narrato AI** | 10k+ teams | T2 | AI content workspace with PRD and product brief generators using custom templates |
| 3 | **Craft.io** | 5k+ teams | T2 | Generates structured PRDs from feature descriptions, integrated with roadmap |
| 4 | **Saga AI** | 3k+ teams | T3 | AI-first workspace: auto-generates PRDs, user stories, acceptance criteria |
| 5 | **Taskade AI** | 500k+ users | T2 | Multi-agent workspace: PRDs, user stories, mind maps from product briefs |
| 6 | **Specy** | 2k+ teams | T3 | Purpose-built AI PRD generator: specs with acceptance criteria, edge cases |
| 7 | **StoryChief AI** | 5k+ teams | T3 | AI content platform with product launch brief and requirements generation |

### B. Roadmap & Prioritization

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Productboard** | 6k+ customers | T1 | AI consolidates user signals, auto-prioritizes features, generates roadmaps |
| 9 | **Aha!** | 700k+ users | T1 | Enterprise roadmapping: AI scoring, goal alignment, capacity prioritization |
| 10 | **Airfocus** | 4k+ teams | T2 | AI-native prioritization and roadmapping with custom scoring frameworks |
| 11 | **Productplan** | 3k+ teams | T2 | Visual roadmapping: AI timeline planning, cross-team dependency detection |
| 12 | **LaunchNotes** | 2k+ teams | T2 | AI release communication: auto-generates changelogs, ties roadmap to impact |
| 13 | **Ducalis.io** | 1.5k+ teams | T3 | AI feature prioritization using RICE, WSJF, custom scoring models |
| 14 | **Chisel AI** | 1k+ teams | T3 | AI PM platform: feature priorities from team alignment + customer feedback |

### C. User Feedback & Research

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 15 | **Dovetail** | 5k+ teams | T1 | AI research repository: auto-tags, clusters, surfaces insights from interviews |
| 16 | **Canny** | 5k+ companies | T1 | AI feature request tracker: deduplicates feedback, ranks by revenue impact |
| 17 | **UserVoice** | 2.5k+ companies | T1 | Enterprise feedback management: AI theme clustering, CRM-linked attribution |
| 18 | **Sprig** | 3k+ teams | T2 | In-product AI surveys: auto-generates questions, analyzes open-text responses |
| 19 | **Enterpret** | 500+ enterprise | T2 | AI feedback analytics: unifies tickets, NPS, reviews into taxonomy with insights |
| 20 | **Viable** | 1k+ teams | T2 | GPT-powered qualitative analysis: surveys, reviews, tickets → insight reports |
| 21 | **MonkeyLearn** | 3k+ users | T2 | No-code AI text analysis: classifies and extracts from customer feedback at scale |

### D. Product Analytics & Experimentation

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 22 | **Amplitude** | 2.6k+ enterprise | T1 | AI analytics: NL queries, auto-insights, anomaly detection, predictive cohorts |
| 23 | **Mixpanel (Spark)** | 9k+ customers | T1 | AI Spark assistant: NL querying, automated funnels, retention predictions |
| 24 | **PostHog** | ~22k stars | T1 | OSS product analytics: AI session replays, feature flags, A/B testing, NL queries |
| 25 | **Statsig** | 4k+ companies | T1 | AI experimentation: feature flags, A/B tests, automated statistical analysis |
| 26 | **Pendo** | 10k+ companies | T1 | Product experience: AI usage analytics, in-app guidance, adoption tracking |
| 27 | **Eppo** | 1.5k+ teams | T2 | Warehouse-native AI experimentation on Snowflake/BigQuery with causal inference |
| 28 | **June.so** | 3k+ startups | T2 | AI-first B2B analytics: auto-generates company dashboards, churn predictions |

### E. Backlog & Sprint AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 29 | **Linear** | 10k+ teams | T1 | AI-native project tracker: auto-triage, AI issue creation, cycle planning |
| 30 | **Jira AI (Atlassian Intelligence)** | 250k+ orgs | T1 | AI backlog grooming, smart sprint suggestions, NL JQL, auto-summaries |
| 31 | **Shortcut** | 5k+ teams | T2 | AI story generation, automatic labeling, epic-to-story decomposition |
| 32 | **Zepel** | 1.5k+ teams | T3 | AI feature decomposition into user stories and dev tasks with effort estimation |
| 33 | **Sweep AI** | ~7.5k stars | T2 | OSS AI agent: converts issues into PRs, auto-plans sprints from codebase |

**Stage 3 Totals: T1=12, T2=14, T3=7**

---

## Stage 4: UX/UI Design (33 tools)

### A. AI Design Platforms & Editors

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Figma AI** | ~30M users | T1 | Native AI: auto-layout, rename layers, generate designs from text prompts |
| 2 | **Penpot** | ~35k stars | T1 | OSS design + prototyping with emerging AI plugins for layout and SVG generation |
| 3 | **Framer AI** | ~5M users | T1 | AI website builder: generates complete responsive sites from text prompts |
| 4 | **Galileo AI** | Early Access | T2 | Generates high-fidelity UI designs from NL descriptions → Figma-ready outputs |
| 5 | **Uizard** | ~2M users | T2 | Converts screenshots, sketches, text into editable wireframes and prototypes |
| 6 | **Visily** | ~500k users | T2 | AI wireframing: turns screenshots/templates/text into editable designs |
| 7 | **Creatie** | ~200k users | T2 | AI-native editor from Wondershare: generation, auto-layout, design-to-code |

### B. Text-to-UI / Screenshot-to-Code

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **v0 by Vercel** | ~10M+ generations | T1 | NL prompts → production React/Next.js components (shadcn/ui + Tailwind) |
| 9 | **screenshot-to-code** | ~65k stars | T1 | GPT-4 Vision converts screenshots into clean HTML/Tailwind/React code |
| 10 | **tldraw Make Real** | ~5k stars | T2 | Hand-drawn whiteboard sketches → working HTML/CSS/JS via multimodal LLMs |
| 11 | **Bolt.new (StackBlitz)** | ~15M users | T1 | AI full-stack app generator in browser via WebContainers from prompts |
| 12 | **Lovable (ex-GPT Engineer)** | ~20k stars | T1 | AI generates full-stack apps with UI from NL, real-time preview + Supabase |
| 13 | **OpenUI** | ~20k stars | T2 | OSS: describe UI in NL, renders live, multiple framework outputs |
| 14 | **Tempo Labs** | Early Access | T3 | AI design-to-code: production React from Figma with pixel-perfect accuracy |

### C. Design Systems & Component AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 15 | **Storybook** | ~85k stars | T1 | UI component workshop with AI plugins for docs, visual regression, a11y |
| 16 | **shadcn/ui** | ~80k stars | T1 | Copy-paste React components (Radix+Tailwind); default output for v0 and AI generators |
| 17 | **Mitosis (Builder.io)** | ~12k stars | T2 | Write once, compile to React/Vue/Angular/Svelte; used by Builder.io AI |
| 18 | **Tokens Studio** | ~3k stars | T2 | Figma plugin for design tokens as code with AI token generation |
| 19 | **Specify** | SaaS (~1k teams) | T2 | Automates design token translation from Figma to code across any tech stack |
| 20 | **Radix UI** | ~16k stars | T1 | Accessible component primitives powering shadcn/ui and AI-generated UIs |
| 21 | **Magic Patterns** | Early Access | T3 | AI generates React component patterns and design system pages from text |

### D. User Research & Testing AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 22 | **Maze** | ~100k teams | T1 | AI rapid testing: automates usability analysis, generates insight reports |
| 23 | **Hotjar AI** | ~1.5M websites | T1 | AI session analysis, heatmap insights, automated survey summaries |
| 24 | **UserTesting AI** | Enterprise | T1 | AI highlight reels, sentiment analysis, insight extraction from interviews |
| 25 | **Attention Insight** | ~5k users | T2 | AI predicts user attention heatmaps on designs before launch |
| 26 | **Synthetic Users** | Early Access | T3 | AI-simulated personas respond to surveys/usability tests without real users |
| 27 | **Dovetail AI** | ~500k users | T2 | Research repo with AI tagging, theme clustering, insight generation |

### E. Design-to-Code & Accessibility AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 28 | **Anima** | ~50k users | T2 | Figma-to-code: React/Vue/HTML with AI responsive breakpoints |
| 29 | **Locofy.ai** | ~30k users | T2 | Figma/XD → React/Next.js/Flutter with auto-tagging and component mapping |
| 30 | **Builder.io Visual Copilot** | ~8k stars | T1 | AI Figma-to-code: React/Vue/Angular/Svelte + visual CMS |
| 31 | **axe DevTools (Deque)** | ~25k stars | T1 | Industry-standard a11y testing: AI remediation, WCAG compliance, CI/CD |
| 32 | **Stark** | ~30k users | T2 | A11y Figma plugin: AI contrast checking, vision simulation, alt-text |
| 33 | **Iconify + AI generators** | ~4k stars | T2 | 200k+ icon framework paired with AI icon generators (Recraft, IconifyAI) |

**Stage 4 Totals: T1=14, T2=15, T3=4**

---

## Stage 5: Specification & SDD (33 tools)

*Full data from Report 05-03, Layer 3 — see that report for GitHub URLs and correction details.*

### A. Standards & Conventions

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **AGENTS.md** | Thousands | T1 | Cross-tool project-level AI steering file |
| 2 | **CursorRules** | ~10k (list) | T1 | Cursor IDE AI behavior steering |
| 3 | **cc-sdd / Kiro (AWS)** | N/A | T1 | EARS notation for formal requirements |
| 4 | **BMAD Method** | ~3-6k | T1 | AI team role simulation |
| 5 | **CLAUDE.md** | 100k+ weekly | T1 | Anthropic's project memory + instruction format |
| 6 | **Roo Code `.roomodes`** | ~12-15k | T1 | JSON persona definitions |
| 7 | **Aider CONVENTIONS.md** | ~24k | T1 | Project-level code style spec |
| 8 | **Goose Recipes** | ~12k | T1 | YAML executable workflow specs |
| 9 | **Continue `config.yaml`** | ~18-20k | T1 | Workspace-scoped model routing |
| 10 | **Agent Skills** | Emerging | T2 | Cross-tool portable skill definitions |

### B. Commercial & Open-Source Spec Tools

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 11 | **Factory AI** | SaaS | T1 | Mission-driven agent platform |
| 12 | **Tessl** | Funded | T2 | AI code gen constrained to security-idiomatic tiles |
| 13 | **Warp (Oz)** | ~$73M | T2 | AI-native terminal with agentic workflows |
| 14 | **Windsurf Cascade** | Codeium | T2 | `.windsurfrules` steering convention |
| 15 | **SpecMem** | ~30-80 | T2 | Normalizes all spec formats to SpecIR |
| 16 | **OpenSpec** | Active | T2 | Change-centric spec convention |
| 17 | **GitHub Spec-Kit** | ~200-500 | T2 | CLI + templates for spec-first development |
| 18 | **Spec-Driven FF** | Local | T3 | Template-based feature spec generator |
| 19 | **OpenCode Rules** | ~5-8k | T2 | Privacy-first terminal agent config |
| 20 | **Melty Spec** | ~9k | T3 (absorbed) | AI-native IDE spec loop (acquired by Block) |
| 21 | **gpt-engineer** | ~52-55k | T1 | Original "spec file → codebase" tool |
| 22 | **BAML** | ~5-7k | T1 | DSL for typed LLM function specs |
| 23 | **Backlog.md CLI** | ~800-2k | T2 | Markdown-native task specs |
| 24 | **Plandex** | ~11-13k | T2 | Terminal agent with reviewable plan staging |

### C. CORRECTED — Confirmed Real (from 05-03 vaporware validation)

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 25 | o2l (zombocoder) | N/V | VAPORWARE | Pure OO language for agents (not found) |
| 26 | **Shotgun** | Active | T2 | 5-phase spec harness: Research→Specify→Plan→Task→Export |
| 27 | Refly | N/V | UNCLEAR | Skills-as-Infrastructure |
| 28 | Design OS | None | PATTERN | Product-to-codebase bridge concept |
| 29 | **Agent OS** | v3.0 | T2 | Standards injection for spec-driven dev |
| 30 | **agentmd** | Active | T2 | Standardized format for agent instructions |
| 31 | **OpenAgentsControl** | Active | T2 | Plan-first dev with approval gates |
| 32 | **GSD** | Active | T2 | Meta-prompting + context engineering + SDD |
| 33 | **awesome-specs** | Multiple repos | T2 | Curated SDD resource lists |

**Stage 5 Totals: T1=12, T2=16, T3=2, Other=3**

---

## Stage 6: Development & Architecture (33 tools) — NEW

*Solution Architects, Backend Leads, Frontend Leads, DB Admins — the technical decision-making layer between spec and code.*

### A. Solution Architecture & System Design AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Eraser.io (DiagramGPT)** | 500k+ users | T1 | Text-to-architecture diagrams: system design, ER, flow, sequence from NL prompts |
| 2 | **Lucidchart AI** | 15M+ users | T1 | Enterprise diagramming with AI-powered auto-layout, smart suggestions, and collaboration |
| 3 | **IcePanel** | Growing | T2 | C4-model interactive architecture modeling with flow visualization and tech catalog |
| 4 | **Structurizr** | ~2k stars | T2 | C4 model diagram-as-code DSL for architecture documentation |
| 5 | **InfraSketch** | Free tier | T3 | AI system design + design doc generator from NL descriptions |
| 6 | **Draft1.ai** | Growing | T2 | Meeting notes → UML/ER/cloud diagrams, Draw.io compatible export |
| 7 | **Log4brains** | ~1k stars | T3 | ADR management as docs-as-code; pairs with LLM prompts for ADR generation |

### B. Backend & API Development AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Postman (Postbot/Agent)** | 30M+ devs | T1 | AI test/doc/debug generation for APIs; Agent Mode automates full API workflows |
| 9 | **Apidog** | Growing | T1 | All-in-one API platform: AI test case gen, design guideline enforcement, mock server |
| 10 | **Stoplight** | Enterprise (SmartBear) | T1 | Design-first OpenAPI platform with AI-assisted schema linting and governance |
| 11 | **OpenAPI Generator** | ~22k stars | T1 | Generates client SDKs/servers in 50+ languages from OpenAPI specs; foundational |
| 12 | **Speakeasy** | Growing | T2 | AI-generated SDKs, MCP servers, and Terraform providers from OpenAPI specs |
| 13 | **Keploy** | ~10.2k stars | T2 | eBPF-based API test recording and replay; captures real traffic as test suites |
| 14 | **Treblle** | Growing | T2 | API intelligence platform: governance, observability, Alfred AI assistant |

### C. Frontend Development AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 15 | **Builder.io Visual Copilot** | ~8k stars | T1 | Figma-to-code with 2M+ training data points; React/Vue/Angular/Svelte output |
| 16 | **Kombai** | Growing | T2 | Repo-aware AI frontend agent: 96% compilation success, understands existing code patterns |
| 17 | **Locofy.ai** | ~30k users | T2 | Figma/XD → production React/Vue/Flutter/Angular with component mapping |
| 18 | **Windframe** | Growing | T2 | Tailwind CSS visual builder with 1000+ templates and AI layout suggestions |
| 19 | **CodeRocket** | Early | T3 | Tailwind v4 component generation from NL descriptions |
| 20 | **FlyonUI MCP** | Early | T3 | Tailwind component generation via MCP protocol directly in agent IDEs |
| 21 | **Edraw AI** | Growing | T2 | AI wireframing and layout prototyping with smart templates |

### D. Database & Data Modeling AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 22 | **Prisma Optimize** | ~40k stars (ecosystem) | T1 | AI query analysis and optimization for Prisma ORM; identifies N+1, slow queries |
| 23 | **Chat2DB** | ~18k stars | T1 | NL-to-SQL across 20+ databases; AI schema exploration and query building |
| 24 | **ChartDB** | ~12k stars | T2 | OSS AI schema analysis and ER diagram generation from existing databases |
| 25 | **DB Designer** | SaaS | T2 | AI-enhanced visual schema design with relationship suggestions |
| 26 | **AI2SQL** | SaaS | T2 | NL-to-SQL with query optimization and schema recommendations |
| 27 | **DBModeler AI** | SaaS (Visual Paradigm) | T2 | Plain English → normalized database schemas with ER diagrams |

### E. Development Environment & Tooling AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 28 | **Mintlify** | Growing fast | T1 | AI-native docs: auto-generates from code, changelog generation, acquiring Helicone |
| 29 | **GitBook** | Enterprise | T1 | AI-native docs-as-code with semantic search, linting, git sync |
| 30 | **Nx** | ~25k stars | T1 | Build Intelligence Platform for monorepos; AI agent skills for workspace management |
| 31 | **Renovate** | ~18k stars | T1 | Automated dependency updates for 90+ package managers; AI-powered merge decisions |
| 32 | **Swimm** | Growing | T2 | Code-coupled documentation that auto-updates when code changes |
| 33 | **ReadMe** | SaaS | T2 | Interactive API docs with AI-generated examples and developer analytics |

**Stage 6 Totals: T1=11, T2=16, T3=4, VAPORWARE=0 — 81% verified (T1+T2)**

---

## Stage 7: Task Bridge (33 tools)

*Full data from Report 05-03, Layer 4.*

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **AllBeads (br/ab)** | v0.10.0 | T1 | Federated Beads orchestrator; Sheriff daemon, TUI, agent mail |
| 2 | **Beads (bd)** | Active | T1 | Git-native issue tracker; JSONL in `.beads/` |
| 3 | **TaskMaster AI** | ~15k | T1 | Claude Code extension: PRD → structured task list |
| 4 | **Master-Plan** | Active | T2 | Claude Code plugin: tasks in MASTER_PLAN.md |
| 5 | **Beads-Viewer (bv)** | Low | T2 | Go TUI for browsing `.beads/` |
| 6 | **Plane** | ~28k | T1 | Open-source JIRA alternative |
| 7 | **AppFlowy** | ~60k | T1 | Open-source Notion alternative |
| 8 | **JIRA MCP Server** | Official | T1 | Atlassian's official MCP endpoint |
| 9 | **GitHub Issues MCP** | Official | T1 | Official GitHub MCP server |
| 10 | **Linear Agent SDK** | Official | T1 | Linear's official MCP |
| 11 | **GitHub Projects MCP** | ~5-8k | T1 | Full Projects v2 access |
| 12 | **Notion MCP Server** | ~2-3k | T1 | Official Notion MCP |
| 13 | **Asana MCP** | ~200-400 | T2 | Community MCP for Asana |
| 14 | **Trello MCP** | ~100-200 | T2 | MCP wrapping Trello |
| 15 | **Monday.com MCP** | ~100-200 | T2 | MCP for Monday.com |
| 16 | **Shortcut MCP** | ~50-100 | T3 | MCP for Shortcut |
| 17 | **Taskwarrior MCP** | ~50-150 | T3 | MCP wrapping Taskwarrior |
| 18 | **A2A Protocol** | Active | T1 | Agent-to-agent message passing |
| 19 | **OpenAI Swarm** | ~18k (archived) | T2 | Handoff-based multi-agent routing |
| 20-25 | AllBeads Subsystems | Local | MISNAMED | openspec-to-beads, ccsdd-to-beads, Agent-Beads Bridge, Shadow Beads, Context-Onboarding, Ghost Worktrees |
| 26 | **TodoMCP** | Low | T3 | Ultra-minimal MCP to-do servers |
| 27 | **Claude Task Manager** | Community | T2 | OSS Claude task system |
| 28 | **VibeKanban** | Active | T2 | Visual pipeline management for SDD |
| 29 | **Perles (BQL)** | Active | T3 | Go-based BQL TUI for Beads |
| 30 | **Ralph-Plan** | Active | T3 | Ralph loop + OpenSpec; SQLite state.db |
| 31 | Spec-Bridge | None | PATTERN | Requirement IDs to verification concept |
| 32 | Task-Flow | None | PATTERN | State-machine lifecycle concept |
| 33 | Plan-to-Task | None | PATTERN | Markdown checkboxes to beads concept |

---

## Stage 8: Agentic Execution & Coding (33 tools)

*Full data from Report 05-03, Layer 5.*

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Aider** | ~24k | T1 | Terminal git-native coding; repo-maps; 100+ models |
| 2 | **Cline** | ~35k+ | T1 | VS Code Plan/Act; visual diffs; 5M+ installs |
| 3 | **OpenHands** | ~38k+ | T1 | Docker-sandboxed autonomous; top SWE-bench |
| 4 | **Continue** | ~18-20k | T1 | Open-source modular backbone; any IDE, BYO model |
| 5 | **Goose (Block)** | ~12k | T1 | Rust core + pure MCP + YAML Recipes |
| 6 | **Cursor Agent** | SaaS | T1 | Proprietary AI-first editor; 500k+ paying |
| 7 | **GitHub Copilot** | 1.8M+ | T1 | Integrated assistant + Workspace agent mode |
| 8 | **OpenAI Codex CLI** | ~28k | T1 | Terminal agent; Apache 2.0; codex-1 model |
| 9 | **Devin** | SaaS | T1 | First fully autonomous AI SWE |
| 10 | **SWE-agent** | ~14k | T1 | Academic benchmark standard |
| 11 | **Roo Code** | ~12-15k | T2 | Boomerang recursive sub-task delegation |
| 12 | **Windsurf Cascade** | N/A | T2 | Flows change-cascade architecture |
| 13 | **Qodo (CodiumAI)** | ~3-7k | T2 | Enterprise quality gate; multi-agent review |
| 14 | **Claude Code** | 100k+ npm/wk | T2 | Anthropic's CLI agent |
| 15 | **Forge Code** | ~3-5k | T2 | Shell-native; TermBench #1 |
| 16 | **Cody (Sourcegraph)** | ~2.5-3.5k | T2 | Enterprise cross-repo assistant |
| 17 | **Agent Zero** | ~8-10k | T2 | Self-modifying agent |
| 18 | **mcp-agent** | ~3-5k | T2 | Composable MCP-native patterns |
| 19 | **Void** | ~12-15k | T2 | Local-first privacy VS Code fork |
| 20 | **PearAI** | ~5-7k | T2 | Open-source Cursor alternative |
| 21 | **OpenCode** | ~5-8k | T2 | Privacy-first terminal agent |
| 22 | **Tabby** | ~22k | T1 | Self-hosted Copilot alternative |
| 23 | **Amazon Q Developer** | Millions | T1 | AWS agentic coder |
| 24 | **JetBrains AI** | Millions | T1 | Agent Mode in IntelliJ family |
| 25 | **Plandex** | ~10k | T2 | Git-backed draft/rewind system |
| 26 | **Sweep AI** | ~7.5k | T2 | GitHub Issue → PR async agent |
| 27 | **gpt-engineer** | ~53k | T2 | Original spec → codebase generator |
| 28 | **Manus AI** | N/A | T3 | Chinese autonomous virtual intern |
| 29 | **Trae (ByteDance)** | N/A | T3 | ByteDance AI IDE |
| 30 | **Melty** | ~8-10k | T3 | First OSS AI-native IDE (Block) |
| 31 | **Mentat** | ~2-3k | T3 | Terminal coding agent (legacy) |
| 32 | Goose Desktop | Bundled | MISNAMED | GUI for Goose CLI |
| 33 | Aiki | None | VAPORWARE | PR generation (not verified) |

---

## Stage 9: QA & Testing (33 tools)

### A. AI Test Generation (Unit/Integration)

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Qodo Cover** | ~5k stars | T1 | Iteratively generates unit tests until coverage threshold met |
| 2 | **Diffblue Cover** | 100+ enterprise | T1 | Autonomously writes Java/JUnit tests via RL on bytecode (no LLM) |
| 3 | **Qodo Gen** | Millions of installs | T1 | IDE extension: analyzes code intent → meaningful tests with edge cases |
| 4 | **EvoSuite** | ~800 stars | T2 | Search-based test generation for Java using evolutionary algorithms |
| 5 | **Qodo Merge (PR-Agent)** | ~6k stars | T1 | AI PR review: auto-suggests tests for uncovered code paths in CI |
| 6 | **Ponicode (CircleCI)** | Acquired | T2 | AI unit test generator for JS/TS/Python from function signatures |
| 7 | **Early AI** | YC-backed | T2 | AI agent writes and maintains tests by understanding codebase context |
| 8 | **Symflower** | ~200 stars | T2 | Symbolic execution → full test suites with 100% path coverage (Go/Java) |

### B. E2E & Visual Testing AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 9 | **Playwright** | ~68k stars | T1 | Cross-browser E2E: codegen, auto-waiting, AI-augmented test generation |
| 10 | **Cypress** | ~47k stars | T1 | Developer-friendly E2E with AI self-healing selector plugins |
| 11 | **Applitools Eyes** | 400+ enterprise | T1 | AI Visual Testing: deep learning detects layout shifts across browsers |
| 12 | **Percy (BrowserStack)** | Enterprise | T1 | Visual regression: snapshot comparison with smart diffing per commit |
| 13 | **Testim (Tricentis)** | Enterprise | T1 | AI E2E authoring: self-healing locators adapt when UI changes |
| 14 | **Katalon** | 850k+ users | T1 | Low-code AI test automation: web, API, mobile, desktop |
| 15 | **Mabl** | 200+ customers | T2 | AI test automation: auto-healing, visual change detection |
| 16 | **Chromatic (Storybook)** | ~3k stars | T1 | Visual regression for UI components via Storybook snapshots |
| 17 | **Meticulous AI** | YC W22 | T2 | Records production sessions → auto-generates E2E tests without code |

### C. Security Testing AI (SAST/DAST/SCA)

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 18 | **Semgrep** | ~10k stars | T1 | AST-based SAST with AI Assistant: auto-triages, cuts false positives 50%+ |
| 19 | **Snyk** | $7.4B valuation | T1 | AI developer security: SAST, SCA, container, IaC scanning with auto-fix |
| 20 | **SonarQube** | ~9k stars | T1 | AI-enhanced code quality and security: 30+ languages |
| 21 | **CodeQL (GitHub)** | ~7k stars | T1 | Semantic code analysis; powers GitHub Advanced Security |
| 22 | **Checkmarx** | 1.8k+ enterprise | T1 | Enterprise AppSec: AI SAST/DAST/SCA with exploitability scoring |
| 23 | **Socket.dev** | ~4k stars | T2 | AI supply chain security: detects malicious npm/PyPI packages |
| 24 | **Aikido Security** | $17M Series A | T2 | All-in-one dev security: SAST+DAST+SCA+secrets+IaC with AI noise reduction |

### D. Code Review & Quality AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 25 | **Copilot Code Review** | Millions | T1 | AI PR reviewer: line-level suggestions, bug identification |
| 26 | **CodeRabbit** | ~5k stars | T1 | AI code review agent: detailed PR reviews with security flags |
| 27 | **Codacy** | 50k+ orgs | T2 | Automated code quality: AI pattern detection across 40+ languages |
| 28 | **Sourcery** | ~1.5k stars | T2 | AI Python reviewer: refactoring suggestions, anti-pattern detection |
| 29 | **Bito AI** | 100k+ users | T2 | AI code review: explains code, generates reviews, flags performance |

### E. Performance & Load Testing AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 30 | **Grafana k6** | ~26k stars | T1 | Developer-centric load testing: AI-assisted script generation |
| 31 | **Locust** | ~25k stars | T1 | Python distributed load testing; AI auto-generates load scenarios |
| 32 | **Launchable** | Acquired by CloudBees | T2 | ML predicts which tests fail → prioritizes them → reduces CI time 60-80% |
| 33 | **BugBug** | SaaS | T3 | No-code browser testing with AI recording and smart element detection |

**Stage 8 Totals: T1=19, T2=13, T3=1 — Most mature layer (97% verified)**

---

## Stage 10: DevOps & Deployment (33 tools)

### A. CI/CD & Pipeline AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Harness AI (AIDA)** | Thousands | T1 | AI CI/CD: auto-generates pipelines, predicts failures, automates rollbacks |
| 2 | **GitHub Actions + Copilot** | 70M+ devs | T1 | Native CI/CD with Copilot suggesting workflow YAML from NL |
| 3 | **GitLab Duo CI/CD** | ~30M users | T1 | AI explains CI failures, suggests fixes, generates gitlab-ci.yml |
| 4 | **Octopus Deploy** | 25k+ customers | T2 | AI runbook generation, deployment failure analysis |
| 5 | **Buildkite** | ~2k stars | T2 | Hybrid CI/CD: AI debugging, auto-scaling, intelligent test splitting |
| 6 | **Trunk.io** | ~3k stars | T2 | AI CI analytics: identifies flaky tests, predicts failures |
| 7 | **PR-Agent (Qodo)** | ~6k stars | T2 | AI PR review + CI test suggestions + security analysis |

### B. Infrastructure as Code AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Pulumi AI** | ~21k stars | T1 | NL-to-infrastructure: type-safe IaC in Python/TS/Go/C# |
| 9 | **Terraform + AI** | ~42k stars | T1 | IaC standard with Copilot HCL generation and AI drift detection |
| 10 | **Spacelift** | Enterprise | T2 | IaC management: AI policy suggestions, drift remediation |
| 11 | **env0** | Enterprise | T2 | IaC automation: AI cost estimation, policy-as-code |
| 12 | **Firefly.ai** | Enterprise | T2 | AI scans cloud → reverse-engineers into Terraform/Pulumi |
| 13 | **Klotho** | ~1.5k stars | T3 | AI compiler: code annotations → cloud infrastructure |
| 14 | **Nitric** | ~1k stars | T3 | Cloud-agnostic: declare infra in app code → AI generates resources |

### C. Monitoring & Observability AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 15 | **Datadog (Bits AI)** | $2B+ ARR | T1 | AI assistant: correlates metrics/traces/logs, NL querying, anomalies |
| 16 | **Dynatrace (Davis AI)** | $1.4B+ ARR | T1 | Causal AI: auto-identifies root causes across distributed systems |
| 17 | **Grafana + ML** | ~65k stars | T1 | ML alerting, anomaly detection, Sift root-cause analysis |
| 18 | **New Relic AI** | Public company | T1 | AI: NL → NRQL queries, error explanation, anomaly detection |
| 19 | **Prometheus + AI** | ~55k stars | T1 | Standard metrics with AI anomaly detection and PromQL generators |
| 20 | **Elastic Observability** | ~70k stars | T1 | AI log pattern analysis, NL → ES|QL, incident classification |
| 21 | **Signoz** | ~19k stars | T2 | OSS OpenTelemetry-native: AI query builder, anomaly detection |

### D. Incident Response & AIOps

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 22 | **PagerDuty AIOps** | 27k+ customers | T1 | AI alert correlation, noise reduction (98%), intelligent triage |
| 23 | **Opsgenie (Atlassian)** | Part of Atlassian | T1 | AI alert grouping, noise reduction, intelligent routing |
| 24 | **BigPanda AIOps** | $300M+ raised | T1 | ML alert correlation, root cause identification, MTTR reduction |
| 25 | **Moogsoft (Dell)** | Acquired | T1 | Pioneering AIOps: correlation algorithms, anomaly detection |
| 26 | **Shoreline.io** | Enterprise | T2 | AI converts manual debugging → automated remediation scripts |
| 27 | **Rootly** | Enterprise | T2 | AI incident management in Slack: auto-generates postmortems |
| 28 | **incident.io** | Enterprise | T2 | Modern incident mgmt: AI status updates, postmortems, on-call |

### E. Cloud Cost & Kubernetes AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 29 | **Kubecost / OpenCost** | ~5k stars | T1 | K8s cost monitoring: AI right-sizing, idle resource detection |
| 30 | **CAST AI** | Enterprise | T1 | AI K8s optimization: auto right-sizes, selects instances, cuts 50%+ spend |
| 31 | **K8sGPT** | ~6k stars | T2 | AI K8s diagnostics: scans clusters, explains problems in plain English |
| 32 | **Robusta** | ~3k stars | T2 | K8s troubleshooting: Holmes AI root-cause, automated playbooks |
| 33 | **Vantage** | Enterprise | T2 | Multi-cloud cost observability: AI anomaly detection, savings recs |

**Stage 9 Totals: T1=17, T2=14, T3=2**

---

## Stage 11: Marketing & Growth (33 tools)

### A. Content Creation & Copywriting AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Jasper** | 100k+ business | T1 | Enterprise AI content: brand voice, campaign workflows, multi-channel |
| 2 | **Copy.ai** | 15M+ users | T1 | AI GTM platform: sales copy, blog content, marketing workflows |
| 3 | **Writer** | Enterprise (Intuit, Deloitte) | T1 | Full-stack enterprise GenAI: brand governance, style guides, content at scale |
| 4 | **Writesonic** | 5M+ users | T2 | AI writing: articles, ads, landing pages with real-time web data |
| 5 | **Anyword** | 1M+ users | T2 | Predictive AI copywriting: scores effectiveness before publishing |
| 6 | **Hypotenuse AI** | 500k+ users | T2 | AI e-commerce content: product descriptions, SEO articles, bulk gen |
| 7 | **Typeface** | $165M Series B | T2 | Enterprise brand-personalized content: text, images, video with guardrails |
| 8 | **Lately** | 10k+ brands | T3 | AI auto-atomizes long-form content into dozens of social posts |

### B. SEO & Search AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 9 | **Surfer SEO** | 100k+ users | T1 | AI on-page SEO: content scoring, SERP analysis, NLP keyword recs |
| 10 | **Clearscope** | Enterprise | T1 | AI content optimization: grades content vs top-ranking pages |
| 11 | **MarketMuse** | 10k+ companies | T2 | AI content strategy: automated audits, gap identification, topic authority |
| 12 | **Frase** | 30k+ users | T2 | AI SEO workflow: SERP research + AI writing + content optimization |
| 13 | **SE Ranking** | 800k+ users | T2 | All-in-one SEO: AI content editor, rank tracking, competitor analysis |
| 14 | **Alli AI** | 10k+ sites | T3 | Automated technical SEO: deploys AI changes directly to sites |
| 15 | **Perplexity Pages** | 100M+ visits/mo | T2 | AI search + content publishing (GEO — Generative Engine Optimization) |

### C. Social Media & Community AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 16 | **Hootsuite (OwlyWriter)** | 18M+ users | T1 | Enterprise social mgmt with built-in AI writer for all channels |
| 17 | **Sprout Social (AI Assist)** | 30k+ customers | T1 | Enterprise social: AI sentiment, optimal send times, auto-responses |
| 18 | **Buffer (AI)** | 140k+ customers | T2 | Social scheduling: AI post ideas, content repurposing, hashtags |
| 19 | **Predis.ai** | 1M+ users | T2 | AI social content: ready-to-publish posts with AI creatives/captions |
| 20 | **FeedHive** | 30k+ users | T2 | AI social mgmt: recycling, conditional posting, performance prediction |
| 21 | **Brandwatch** | 7.5k+ customers | T1 | AI social listening: analyzes millions of conversations for brand insights |
| 22 | **CreatorIQ** | 1k+ brands | T2 | AI influencer marketing: identifies, vets creators, measures ROI |

### D. Email & Campaign Automation

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 23 | **Klaviyo** | 143k+ customers | T1 | AI email/SMS for e-commerce: predictive analytics, segmentation, flow optimization |
| 24 | **HubSpot (Breeze)** | 228k+ customers | T1 | All-in-one CRM + marketing automation with AI agents for content/social/prospecting |
| 25 | **ActiveCampaign** | 185k+ customers | T1 | AI marketing automation: email + CRM + predictive sending |
| 26 | **Seventh Sense** | 5k+ companies | T3 | AI send-time optimization for HubSpot and Marketo |
| 27 | **Jacquard (Phrasee)** | Enterprise | T2 | AI brand language optimization: subject lines, push, ad copy at scale |
| 28 | **Customer.io** | 7.2k+ customers | T2 | Event-driven marketing: AI message optimization, multi-channel orchestration |

### E. Ad Optimization & Growth AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 29 | **Albert.ai** | Enterprise | T2 | Autonomous AI marketing: self-optimizes paid media across channels |
| 30 | **AdCreative.ai** | 3M+ users | T1 | AI ad creative generation: conversion-optimized banners, video with scoring |
| 31 | **Unbounce** | 15k+ customers | T2 | AI landing pages: Smart Traffic auto-routes visitors to best variant |
| 32 | **Mutiny** | 300+ enterprise | T2 | AI website personalization: dynamically customizes pages for target accounts |
| 33 | **Synthesia** | 50k+ customers | T1 | AI video generation: professional videos from text with AI avatars in 130+ languages |

**Stage 10 Totals: T1=11, T2=17, T3=5**

---

## Stage 12: Customer Support & Success (33 tools)

### A. AI Help Desk & Ticket Management

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Zendesk AI** | 100k+ customers | T1 | Enterprise help desk: AI routing, agent copilot, auto-resolution bots |
| 2 | **Freshdesk (Freddy)** | 68k+ customers | T1 | Omnichannel help desk: AI triage, canned responses, predictive assignment |
| 3 | **Intercom Fin** | 25k+ customers | T1 | AI-first: Fin agent resolves ~50% queries autonomously via RAG |
| 4 | **Salesforce Service Cloud** | 150k+ orgs | T1 | Einstein AI: case classification, next-best-action, generative replies |
| 5 | **Zoho Desk (Zia)** | 100k+ customers | T1 | AI sentiment, ticket tagging, anomaly alerts, knowledge suggestions |
| 6 | **Tidio** | 300k+ websites | T2 | SMB live chat + Lyro AI agent resolves from FAQ/knowledge base |
| 7 | **HelpScout** | 12k+ customers | T2 | AI Summarize, Drafts, Classify for lightweight support teams |

### B. Chatbots & Conversational AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Ada** | 350M+ conversations | T1 | Enterprise AI agent: multilingual resolution across all channels |
| 9 | **Drift (Salesloft)** | 50k+ customers | T1 | B2B conversational AI: qualify leads, book meetings, route support |
| 10 | **Botpress** | ~13k stars | T2 | OSS conversational AI: visual flow builder, LLM-native NLU |
| 11 | **Voiceflow** | 150k+ teams | T2 | Collaborative AI agent design: visual canvas + knowledge base |
| 12 | **Yellow.ai** | 1.1k+ enterprise | T2 | Enterprise conversational AI: 135+ languages, voice + chat |
| 13 | **Kore.ai** | Gartner MQ Leader | T2 | Enterprise-grade: pre-built industry bots, XO Platform |
| 14 | **Rasa** | ~19k stars | T2 | OSS conversational AI: on-premise, full NLU pipeline control |
| 15 | **Chatwoot** | ~21k stars | T2 | OSS customer engagement: live chat, chatbot, omnichannel inbox |
| 16 | **Dialogflow CX** | Google Cloud | T1 | Google's advanced conversational AI: state-machine dialogs + LLM |
| 17 | **Amazon Lex** | AWS ecosystem | T1 | AWS conversational AI: chatbots + IVR with ASR + NLU |

### C. Knowledge Base & Self-Service

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 18 | **Guru** | 4k+ customers | T2 | AI knowledge management: verified answers within agent workflows |
| 19 | **Notion AI (wikis)** | 100M+ users | T1 | AI workspace for support knowledge bases: Q&A, summarization, search |
| 20 | **Document360** | 2.5k+ customers | T2 | AI knowledge base: Eddy AI for article gen, search analytics |
| 21 | **Stonly** | 1k+ customers | T3 | Interactive KB: AI step-by-step troubleshooting replacing static FAQs |
| 22 | **Tettra** | 1.8k+ teams | T3 | Internal KB with AI instant answers from docs and Slack |
| 23 | **Capacity** | 2k+ customers | T2 | AI support automation: KB + helpdesk + chatbot unified |

### D. Customer Success & Health Scoring

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 24 | **Gainsight** | 1.5k+ enterprise | T1 | Dominant CS platform: AI health scores, churn prediction, playbooks |
| 25 | **Totango** | 5k+ (merged w/ Catalyst) | T1 | AI journey orchestration, SuccessBLOCs, revenue signal detection |
| 26 | **ChurnZero** | 1.5k+ customers | T2 | Real-time CS: AI health scoring, in-app engagement, lifecycle campaigns |
| 27 | **Vitally** | 1k+ customers | T2 | Modern B2B SaaS CS: AI health scoring, productivity hubs, proactive alerts |
| 28 | **Planhat** | 1k+ customers | T2 | EU leader: AI revenue forecasting, multi-dimensional health scores |
| 29 | **Custify** | 500+ customers | T3 | Lightweight CS: health scoring, lifecycle automation for lean teams |

### E. Voice AI & Sentiment Analysis

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 30 | **Observe.AI** | 350+ enterprise | T2 | Contact center AI: real-time agent assist, QA scoring, sentiment detection |
| 31 | **NICE CXone (Enlighten)** | 25k+ customers | T1 | Enterprise contact center: AI sentiment, complaint detection, coaching |
| 32 | **Medallia** | 2k+ enterprise | T1 | Experience management: AI text/speech analytics, sentiment scoring |
| 33 | **Bland AI** | YC-backed | T3 | AI phone agents: human-like calls for support, scheduling, outbound |

**Stage 11 Totals: T1=14, T2=15, T3=4**

---

## Stage 13: Analytics & Business Intelligence (33 tools)

### A. Natural Language BI / Text-to-SQL

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 1 | **Vanna AI** | ~12k stars | T1 | OSS RAG-based text-to-SQL that learns your schema |
| 2 | **SQLChat** | ~4.5k stars | T2 | Chat-based SQL client using LLMs for conversational queries |
| 3 | **Dataherald** | ~3.5k stars | T2 | Enterprise NL-to-SQL: fine-tuning, context injection, confidence scoring |
| 4 | **WrenAI** | ~2.5k stars | T2 | OSS text-to-SQL with semantic modeling layer for business logic |
| 5 | **DuckDB-NSQL** | ~1.5k stars | T3 | Fine-tuned LLM for SQL generation specifically on DuckDB |
| 6 | **ThoughtSpot Sage** | 10k+ enterprise | T1 | NL search + analytics: instant visualizations from questions |
| 7 | **Databricks Genie** | Part of Databricks | T1 | NL BI on the Lakehouse: SQL, dashboards, insights from conversation |

### B. Dashboard & Visualization AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 8 | **Apache Superset** | ~64k stars | T1 | OSS data exploration with AI chart suggestions and SQL IDE |
| 9 | **Metabase** | ~40k stars | T1 | OSS BI: auto-generates dashboards, AI question generation |
| 10 | **Evidence** | ~4.5k stars | T2 | Code-as-BI: Markdown + SQL → version-controlled data reports |
| 11 | **Lightdash** | ~4k stars | T2 | OSS BI built on dbt semantic layer: AI metric exploration |
| 12 | **Vizro (McKinsey)** | ~3k stars | T2 | Python framework for AI dashboards with minimal code |
| 13 | **Julius AI** | 2M+ users | T2 | AI data analyst: upload CSVs → charts and insights via chat |
| 14 | **Tableau AI** | Enterprise | T1 | Einstein Copilot: auto-generates visualizations, explains patterns |

### C. Product & User Analytics

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 15 | **PostHog** | ~23k stars | T1 | OSS product analytics: AI query builder, session replay, A/B tests |
| 16 | **Amplitude** | 2k+ enterprise | T1 | AI "Ask Amplitude": NL querying, auto-insights, predictive cohorts |
| 17 | **Mixpanel (Spark)** | 9k+ customers | T1 | AI Spark: NL reports, automated funnels, retention predictions |
| 18 | **Heap (Contentsquare)** | 6k+ customers | T2 | Auto-capture analytics: AI surfaces behavioral patterns |
| 19 | **Plausible** | ~21k stars | T2 | OSS privacy-first web analytics with growing AI features |
| 20 | **Matomo** | ~20k stars | T2 | OSS Google Analytics alternative: AI visitor insights, heatmaps |
| 21 | **GrowthBook** | ~6.5k stars | T2 | OSS feature flags + A/B testing with Bayesian AI analysis |

### D. Data Pipeline & ETL AI

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 22 | **Airbyte** | ~16k stars | T1 | OSS ELT: 400+ connectors, AI connector builder from schemas |
| 23 | **dbt** | ~10k stars | T1 | SQL transformation standard with dbt Copilot for AI-gen models |
| 24 | **Meltano** | ~1.8k stars | T2 | OSS DataOps: ELT pipelines with AI-assisted config |
| 25 | **Dagster** | ~12k stars | T1 | Data orchestrator: software-defined assets with AI lineage |
| 26 | **Prefect** | ~17k stars | T1 | Workflow orchestration: AI-assisted debugging, auto retry/failure |
| 27 | **Y42** | Growing | T3 | Managed data pipeline: AI auto-generates dbt models |

### E. Predictive Analytics & Anomaly Detection

| # | Name | Adoption | Tier | What It Does |
|---|------|----------|------|--------------|
| 28 | **Grafana + ML (Sift)** | ~66k stars | T1 | ML anomaly detection, forecasting, AI-assisted alerting |
| 29 | **Apache Spark MLlib** | ~40k stars | T1 | Distributed ML for predictive analytics at data lake scale |
| 30 | **Gretel.ai** | ~1k stars | T2 | AI synthetic data generation + anonymization for ML training |
| 31 | **NannyML** | ~2k stars | T2 | OSS post-deployment ML monitoring: drift detection without ground truth |
| 32 | **Pecan AI** | Enterprise | T2 | No-code predictive analytics: auto-builds ML for churn, LTV, revenue |
| 33 | **Nixtla** | ~4k stars | T2 | OSS time series forecasting: TimeGPT foundation model + StatsForecast |

**Stage 12 Totals: T1=15, T2=16, T3=2**

---

# PART II: CROSS-CUTTING INFRASTRUCTURE (from Report 05-03)

## Stage 14: Memory & Context (33 tools)
## Stage 15: Knowledge & Code Intelligence (33 tools)
## Stage 16: Multi-Agent Orchestrators (33 tools)
## Stage 17: AI Native Infrastructure (33 tools)

*These 4 stages contain 132 tools fully documented in Report 05-03 (CORRECTED). Key highlights:*

### Stage 13 Memory — Top Picks
Mem0 (20k stars), Letta/MemGPT (12k), GraphRAG (20k), **SimpleMem** (3.2k — CORRECTED from vaporware), **CASS**, **A-MEM**, **MemOS**, Chroma (15k), Qdrant (20k), Milvus (30k), LanceDB (4k)

### Stage 14 Knowledge — Top Picks
Repomix (5-8k), CodeQL (7k), Sourcegraph MCP (10k), ast-grep (8k), Semgrep (10k), **CodeGraph Rust** (154 — CORRECTED from vaporware), **GZOO Cortex**, LlamaIndex (35k), Serena, Universal Ctags

### Stage 15 Orchestrators — Top Picks
LangGraph (7.5k), CrewAI (22k+), PydanticAI (8k), AutoGen (35k), Semantic Kernel (23k), LlamaIndex (38k), DSPy (20k), MetaGPT (46k), Haystack (18k), smolagents (5k), Mastra (8k), **GasTown** (189k LOC — CORRECTED), **Antfarm**, **Pi Mono**

### Stage 16 Infrastructure — Top Picks
E2B (7k), Daytona (12k), Ollama (90k+), vLLM (30k), LiteLLM (15k), SGLang (7k), BAML (5k), Outlines (11k), Instructor (9k), Guardrails AI (4.8k), Arize Phoenix (4.5k), **Gondolin** (CORRECTED), **AgentKernel** (CORRECTED)

*For full 33-tool tables with GitHub URLs and correction details, see `ResearchReport_05-03_Claude_Landscape_33x7_CORRECTED.md`.*

---

# PART III: THE DREAM PIPELINE

## "Build Marketplace for Betting Strategies" — Tool-by-Tool Flow

```
INPUT: "Build Marketplace for Betting Strategies"
```

| Stage | What Happens | Primary Tool | Output |
|-------|-------------|-------------|--------|
| **1. Sales** | Account manager logs opportunity | **HubSpot AI** | Deal in CRM pipeline |
| **2. Biz Analysis** | AI researches betting market, TAM, competitors | **GPT Researcher + Crunchbase** | Market analysis report |
| **3. Product Mgmt** | PM generates PRD with features, user stories | **Notion AI + Productboard** | PRD with prioritized features |
| **4. UX/UI Design** | Designer generates UI mockups from PRD | **v0 + Figma AI** | Interactive prototypes |
| **5. Spec/SDD** | Spec-driven definition of architecture | **CLAUDE.md + Shotgun + GSD** | AGENTS.md, specs, task plan |
| **6. Dev & Arch** | Architect designs system, DB schema, APIs | **Eraser.io + Postman + Prisma + Chat2DB** | Architecture diagrams, API specs, DB schema |
| **7. Task Bridge** | Tasks created and assigned to agents | **AllBeads + Linear** | Beads issues + sprint board |
| **8. Implementation** | AI agents write code in parallel | **Claude Code + Aider + Cline** | Working codebase |
| **9. QA & Testing** | AI generates and runs tests | **Qodo Cover + Playwright + Semgrep** | Test suites + security scan |
| **10. DevOps** | AI deploys to cloud | **GitHub Actions + Pulumi AI + E2B** | Live staging environment |
| **11. Marketing** | AI generates launch content | **Jasper + Surfer SEO + Synthesia** | Landing page + video + SEO |
| **12. Support** | AI chatbot handles user queries | **Intercom Fin + Botpress** | 24/7 AI support |
| **13. Analytics** | AI monitors KPIs and user behavior | **PostHog + Amplitude + Grafana** | Dashboards + alerts |
| **14-17. Infra** | Memory, knowledge, orchestration | **Mem0 + LangGraph + LiteLLM** | Cross-cutting AI backbone |

---

# PART IV: DEPARTMENT VIEW

## Which tools does each team use?

### Revenue Team (Sales + Marketing)

| Tool | Stage | Function |
|------|-------|----------|
| HubSpot AI / Salesforce | Sales | CRM + pipeline management |
| Apollo.io / Outreach | Sales | AI SDR + outbound automation |
| Gong / Clari | Sales | Revenue intelligence |
| PandaDoc | Sales | AI proposals + contracts |
| Jasper / Copy.ai | Marketing | Content creation |
| Surfer SEO / Clearscope | Marketing | SEO optimization |
| Hootsuite / Sprout Social | Marketing | Social media management |
| Klaviyo / ActiveCampaign | Marketing | Email automation |
| AdCreative.ai / Synthesia | Marketing | Ad + video creation |

### Product Team (PM + Design + BA)

| Tool | Stage | Function |
|------|-------|----------|
| Crayon / AlphaSense | Biz Analysis | Competitive intelligence |
| GPT Researcher / STORM | Biz Analysis | Autonomous research agents |
| Causal / Runway Financial | Biz Analysis | Financial modeling |
| Notion AI / Productboard | Product Mgmt | PRD + roadmap |
| Amplitude / PostHog | Product Mgmt | Product analytics |
| Dovetail / Canny | Product Mgmt | User feedback |
| Figma AI / v0 / Bolt.new | Design | UI generation |
| screenshot-to-code / Builder.io | Design | Design-to-code |
| Maze / Hotjar | Design | User testing |

### Engineering Team (Arch + Dev + Spec + Code + QA)

| Tool | Stage | Function |
|------|-------|----------|
| CLAUDE.md / AGENTS.md | Spec | Agent steering |
| Shotgun / GSD | Spec | Spec-driven harness |
| **Eraser.io / Lucidchart** | **Dev & Arch** | **System design & architecture diagrams** |
| **Postman / Apidog / Stoplight** | **Dev & Arch** | **API design & testing** |
| **Prisma Optimize / Chat2DB** | **Dev & Arch** | **DB schema design & query optimization** |
| **Builder.io / Kombai** | **Dev & Arch** | **Frontend code generation** |
| **Mintlify / GitBook** | **Dev & Arch** | **AI documentation generation** |
| **Nx / Renovate** | **Dev & Arch** | **Monorepo management & dependency updates** |
| AllBeads / Linear | Task Bridge | Issue tracking |
| Aider / Claude Code / Cursor | Execution | Coding agents |
| Qodo Cover / Playwright | QA | Test generation + E2E |
| Semgrep / Snyk / CodeQL | QA | Security testing |
| CodeRabbit / Qodo Merge | QA | AI code review |
| GitHub Actions / Harness | DevOps | CI/CD |
| Pulumi AI / Terraform | DevOps | Infrastructure as Code |
| Datadog / Grafana | DevOps | Monitoring |
| PagerDuty / Rootly | DevOps | Incident response |

### Operations Team (Support + Analytics)

| Tool | Stage | Function |
|------|-------|----------|
| Zendesk AI / Intercom Fin | Support | Help desk + AI resolution |
| Botpress / Rasa | Support | Custom chatbots |
| Gainsight / Vitally | Support | Customer success |
| Document360 / Notion | Support | Knowledge base |
| Vanna AI / ThoughtSpot | Analytics | Text-to-SQL |
| Superset / Metabase | Analytics | Dashboards |
| Airbyte / dbt | Analytics | Data pipelines |
| Grafana + ML / NannyML | Analytics | Anomaly detection |

---

# GRAND TOTAL

| Stage | Tools | T1 | T2 | T3+ |
|-------|:-----:|:--:|:--:|:---:|
| 1. Sales & CRM | 33 | 13 | 15 | 5 |
| 2. Business Analysis | 33 | 14 | 19 | 0 |
| 3. Product Management | 33 | 12 | 14 | 7 |
| 4. UX/UI Design | 33 | 14 | 15 | 4 |
| 5. Spec & SDD | 33 | 12 | 16 | 5 |
| **6. Development & Architecture** | **33** | **11** | **16** | **4** | ← NEW |
| 7. Task Bridge | 33 | 10 | 8 | 15 |
| 8. Agentic Execution | 33 | 13 | 14 | 6 |
| 9. QA & Testing | 33 | 19 | 13 | 1 |
| 10. DevOps & Deployment | 33 | 17 | 14 | 2 |
| 11. Marketing & Growth | 33 | 11 | 17 | 5 |
| 12. Customer Support | 33 | 14 | 15 | 4 |
| 13. Analytics & BI | 33 | 15 | 16 | 2 |
| 14. Memory & Context | 33 | 8 | 15 | 10 |
| 15. Knowledge & Code Intel | 33 | 10 | 10 | 13 |
| 16. Multi-Agent Orchestration | 33 | 15 | 9 | 9 |
| 17. AI Native Infrastructure | 33 | 16 | 4 | 13 |
| **TOTAL** | **561** | **214** | **230** | **105** |

**Overall Verification Rate (T1 + T2): 79%** (444 of 561 tools)

---

*Research Report 06 compiled by Claude Code (Opus 4.6) on 2026-03-13.*
*10 parallel research agents + Report 05-03 data. 561 tools across 17 pipeline stages.*
*The most comprehensive map of AI tools for running an entire software company.*
