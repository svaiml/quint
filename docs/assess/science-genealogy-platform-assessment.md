# Feature Assessment: Science & Tech Genealogy SaaS Platform

**Date**: 2026-03-29
**Assessed By**: Claude AI Agent
**Status**: Assessed

## Feature Overview

Transform the Soviet Science Schools knowledge base into a SaaS product / marketplace platform that provides:

1. **Science & Tech Genealogy as a Service** - Users trace the intellectual lineage of their ideas back to foundational scientific schools
2. **Idea Provability & Provenance** - Full traceability chain proving how a modern technology descends from foundational theory (e.g., "Your embedding model traces to Glushkov's 1961 automata theory via Ivakhnenko's GMDH")
3. **Marketplace** - Users contribute genealogy chains, researchers validate connections, enterprises pay for provenance reports
4. **Inference Engine** - AI-powered matching that connects user-described ideas/technologies to the genealogy graph
5. **Defensible IP** - Killer features with moats that are hard to replicate

**User's vision**: "cool UIX/DX" + "SaaS or marketplace" + "provability and trace of ideas" + "infer + rstmdb eco" + "killer features and IP not easy to steal"

## Scoring Analysis

### Complexity Score: 8.7/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Effort Days | 9/10 | Full-stack SaaS: graph database, inference engine, web UI, API, auth, payments, marketplace logic. Multiple months of development. |
| Component Count | 9/10 | Frontend (interactive graph UI), backend API, graph database, inference/AI engine, auth/billing, marketplace/contribution system, admin panel, search engine |
| Integration Points | 8/10 | Graph DB (Neo4j/similar), AI inference (LLM + embedding), payment processor (Stripe), auth (OAuth), academic APIs (Semantic Scholar, CrossRef, Mathematics Genealogy Project), potential RSTMDB integration |
| **Average** | **8.7/10** | |

### Risk Score: 5.0/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Security Implications | 6/10 | User accounts, API keys, payment processing, intellectual property claims. Moderate security requirements. |
| Compliance Requirements | 4/10 | Payment processing (PCI DSS via Stripe), GDPR for European users, data retention policies. Standard SaaS compliance. |
| Data Sensitivity | 5/10 | User research data, proprietary genealogy contributions, payment information (handled by Stripe). Mix of public and user-generated content. |
| **Average** | **5.0/10** | |

### Architecture Impact Score: 8.3/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| New Patterns | 9/10 | Graph-based knowledge representation, AI inference pipeline for idea-to-lineage matching, provenance chain verification, marketplace contribution/validation workflow. All novel patterns. |
| Breaking Changes | 7/10 | Transforms static markdown docs into a dynamic platform. Existing research becomes seed data. Complete architectural shift from static files to distributed system. |
| Dependencies Affected | 9/10 | Every existing research document becomes input data. Graph DB, AI models, payment systems, academic APIs all become critical dependencies. Platform availability affects all users. |
| **Average** | **8.3/10** | |

## Overall Assessment

**Total Score**: 22.0/30
**Recommendation**: Full SDD
**Confidence**: High

### Rationale

All three dimension scores exceed the threshold (Complexity 8.7 >= 7, Risk 5.0 >= 4, Architecture Impact 8.3 >= 7). This is a greenfield SaaS platform with novel IP, requiring full specification-driven development. The complexity of building a graph-based genealogy engine with AI inference, marketplace dynamics, and defensible moats demands rigorous architectural planning.

### Key Factors

- **Complexity**: Full-stack SaaS with 8+ components, multiple external integrations, and AI inference pipeline
- **Risk**: Moderate - standard SaaS security/compliance, but IP protection strategy adds complexity
- **Impact**: Complete architectural transformation from static docs to distributed platform

## Product Vision & Killer Features

### Core Value Proposition

**"Prove the lineage of any idea in technology"** - Like ancestry.com for scientific ideas and tech innovations.

### Killer Features & Defensible IP

#### 1. Genealogy Graph Engine (Hard to Steal)
- **What**: A curated, verified knowledge graph mapping 10,000+ scientific contributions to modern technologies with typed transmission paths (Direct, Reformulation, Convergent, Indirect)
- **Moat**: The graph is the product. Building it required deep research (our 10 schools are the seed). Each new school/connection requires expert validation. Data network effects: more users contributing = richer graph = more value
- **IP Defense**: The curated graph with verified transmission paths is proprietary. Raw facts are public, but the structured connections with evidence chains are original work

#### 2. Idea Provenance Engine (AI-Powered)
- **What**: User describes their technology/idea in natural language. The engine traces it through the genealogy graph and produces a "Provenance Certificate" - a verified chain from modern tech back to foundational theory
- **Example**: User inputs "I'm building a recommendation system using collaborative filtering" -> Engine traces: Collaborative filtering -> Matrix factorization -> Spectral methods (Gelfand) -> Functional analysis (Banach) -> with branches to Markov processes and Tikhonov regularization
- **Moat**: Requires both the curated graph AND fine-tuned inference. The combination is the moat - neither the graph alone nor a generic LLM can replicate this
- **IP Defense**: The inference model fine-tuned on genealogy data, the matching algorithm, and the provenance certificate format are all protectable

#### 3. Transmission Path Taxonomy (Novel Framework)
- **What**: The 4-type classification system (Direct/Reformulation/Convergent/Indirect) applied systematically to idea lineage. No one else has this structured taxonomy for tech provenance
- **Moat**: This is a novel intellectual framework. Like how DORA metrics became the standard for DevOps, this taxonomy can become the standard for idea provenance
- **IP Defense**: Publish the taxonomy academically (establishes priority), trademark the certification format

#### 4. Interactive Genealogy Explorer (UIX Differentiator)
- **What**: A visual, interactive graph UI where users explore the genealogy network. Think: a 3D/2D force-directed graph where nodes are scientists/theories and edges are connections, with time-travel slider (1850s -> present)
- **Features**: Click any node to see the full lineage tree, zoom into specific schools, filter by modern tech domain (ML, quantum, compilers, etc.)
- **Moat**: The UIX is the brand. First-mover advantage on "genealogy explorer for tech ideas"

#### 5. Provenance API for Enterprises
- **What**: API endpoint where enterprises submit their technology description and receive a structured provenance report. Use cases:
  - Patent applications: "Prior art lineage" reports
  - Grant proposals: "Theoretical foundations" sections auto-generated
  - Academic papers: "Related foundational work" discovery
  - Due diligence: "IP risk assessment" for tech acquisitions
- **Moat**: Enterprise contracts + API integration = switching costs. Once integrated into patent workflow, hard to replace
- **IP Defense**: API format, provenance report schema, and enterprise tooling are protectable

#### 6. Community Marketplace (Network Effects)
- **What**: Researchers contribute new genealogy chains, validate existing ones, and earn reputation/revenue. Like a curated Wikipedia + Stack Overflow for idea provenance
- **Validator roles**: Academic experts verify connections for accuracy
- **Contributor roles**: Researchers add new schools, figures, and transmission paths
- **Moat**: Two-sided marketplace with network effects. More contributors = richer graph = more enterprise customers = more revenue to attract contributors

### Revenue Model

| Tier | Features | Price |
|------|----------|-------|
| Free | Browse 10 seed schools, limited graph exploration | $0 |
| Researcher | Full graph access, 10 provenance traces/month, contribute chains | $29/mo |
| Enterprise | Unlimited API access, custom reports, patent lineage, white-label | $499/mo+ |
| Marketplace | Revenue share for validated contributions | 70/30 split |

### Tech Stack Direction

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Graph DB | Neo4j or ArangoDB | Native graph queries for lineage traversal |
| Backend API | Python (FastAPI) | AI/ML ecosystem, rapid development |
| Inference | LLM + embedding model | Idea-to-lineage matching, provenance generation |
| Frontend | React + D3.js/Three.js | Interactive graph visualization |
| Search | Elasticsearch | Full-text search across genealogy data |
| Auth/Billing | Clerk + Stripe | Standard SaaS infrastructure |
| Data seed | Our 10 school documents | Structured markdown -> graph import |

## Next Steps

### Full SDD Path

```bash
/flow:specify science-genealogy-platform
```

This will create the full PRD with:
- Detailed user stories for each killer feature
- API contracts for the Provenance API
- Data model for the genealogy graph
- DVF+V risk assessment for the marketplace
- Task breakdown for MVP development

## Override

```bash
/flow:assess science-genealogy-platform --mode light  # Force spec-light
/flow:assess science-genealogy-platform --mode skip   # Force skip SDD
```

---

*Assessment generated by /flow:assess workflow*
