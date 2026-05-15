# Platform Infrastructure Design: Science Genealogy SaaS Platform

**Date**: 2026-03-30
**Author**: Platform Engineer
**Status**: Draft
**Spec Reference**: `docs/prd/science-genealogy-platform-spec.md`
**Vision Reference**: `docs/platform/product-vision-uix-dx.md`
**IP Strategy Reference**: `docs/prd/killer-features-ip-strategy.md`
**Supersedes**: `docs/platform/soviet-science-schools-platform.md` (research-only platform), `docs/platform/global-science-schools-platform.md` (research scaling platform)

---

## 1. Executive Summary

This document defines the infrastructure architecture for the Science Genealogy Platform -- the SaaS product that delivers provable facts about technology lineage through structured proof chains. The platform is built on top of the existing Infer engine and RSTMDB ecosystem, using the 25 completed school research documents as seed data.

The infrastructure must support three phases:
- **Phase 0 (Dogfood)**: CLI tools + internal API for the team to verify research claims, run proof queries, compute RSI, and detect gaps
- **Phase 1 (External Free Tier)**: Web Explorer + Prover + Radar interfaces serving free and paid users
- **Phase 2 (Enterprise)**: API-first platform with SSO, SLAs, custom reports, and high-availability guarantees

This design focuses on Phase 0 infrastructure with forward-compatible decisions that do not require re-architecture for Phase 1/2.

---

## 2. Development Environment

### 2.1 Language & Runtime

| Component | Choice | Rationale |
|---|---|---|
| Language | Python 3.13 | Team familiarity, ML ecosystem (sentence-transformers), Infer integration |
| Package manager | uv | Fast, reproducible, lockfile-based dependency management |
| Linter/Formatter | ruff | Single tool for linting + formatting, fast, replaces flake8/black/isort |
| Type checking | mypy (strict mode) | Proof chains demand type safety; Pydantic models enforce runtime validation |
| Test framework | pytest | Standard, extensive plugin ecosystem, fixtures for Neo4j/Redis test instances |

### 2.2 Key Dependencies

**Core Application:**

| Package | Purpose | Version Constraint |
|---|---|---|
| fastapi | HTTP API framework | >=0.115 |
| uvicorn | ASGI server | >=0.34 |
| pydantic | Data models, validation, serialization | >=2.10 |
| neo4j | Official Neo4j Python driver | >=5.28 |
| sentence-transformers | Query-to-node embedding similarity | >=4.1 |
| typer | CLI framework | >=0.15 |
| rich | Terminal formatting (color-coded proof chains, tables) | >=14.0 |
| httpx | Async HTTP client for Infer/RSTMDB integration | >=0.28 |
| redis | Caching layer (rate limiting, query cache, RSI cache) | >=5.2 |
| structlog | Structured logging | >=24.4 |

**Development:**

| Package | Purpose |
|---|---|
| pytest | Unit + integration tests |
| pytest-asyncio | Async test support (FastAPI, Neo4j async driver) |
| pytest-cov | Coverage reporting |
| ruff | Lint + format |
| mypy | Static type checking |
| httpx | Test client for FastAPI (also a runtime dep) |

### 2.3 Project Initialization

```bash
# Initialize project
cd /home/sash/docs
uv init --name science-genealogy --python 3.13

# Add runtime dependencies
uv add fastapi uvicorn pydantic neo4j sentence-transformers \
       typer rich httpx redis structlog

# Add dev dependencies
uv add --dev pytest pytest-asyncio pytest-cov ruff mypy
```

### 2.4 pyproject.toml Configuration

```toml
[project]
name = "science-genealogy"
version = "0.1.0"
description = "Science & Tech Genealogy Platform -- Provable Facts Engine"
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
    "fastapi>=0.115",
    "uvicorn>=0.34",
    "pydantic>=2.10",
    "neo4j>=5.28",
    "sentence-transformers>=4.1",
    "typer>=0.15",
    "rich>=14.0",
    "httpx>=0.28",
    "redis>=5.2",
    "structlog>=24.4",
]

[dependency-groups]
dev = [
    "pytest>=8.3",
    "pytest-asyncio>=0.25",
    "pytest-cov>=6.1",
    "ruff>=0.11",
    "mypy>=1.15",
]

[tool.ruff]
target-version = "py313"
line-length = 120
src = ["src"]

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "B", "SIM", "TCH", "RUF"]

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.mypy]
strict = true
python_version = "3.13"
plugins = ["pydantic.mypy"]

[project.scripts]
genealogy = "genealogy.cli.main:app"
```

---

## 3. Project Directory Structure

```
src/
  genealogy/
    __init__.py
    models/                          # Pydantic data models (the schema layer)
      __init__.py
      proof_chain.py                 # ProofChain, ProofLink, TransmissionType
      school.py                      # School, Person, Theory, ModernTech, Publication
      graph.py                       # Graph query/response models, NodeMatch, PathResult
    engine/                          # Core proof engine (the brain)
      __init__.py
      proof_engine.py                # 6-stage proof chain assembly (spec Stages 1-6)
      query_processor.py             # Stage 1: NLP query processing + entity extraction
      node_mapper.py                 # Stage 2: Entity-to-graph-node mapping (exact + embedding)
      graph_traverser.py             # Stage 3: Neo4j graph traversal (Cypher shortest-path)
      evidence_attacher.py           # Stage 4: Evidence attachment from edge properties
      confidence_scorer.py           # Stage 5: Deterministic confidence scoring
      chain_assembler.py             # Stage 6: Top-K proof chain selection + response assembly
    integrations/                    # External system clients
      __init__.py
      infer_client.py                # Infer API client (fact-proving engine)
      rstmdb_client.py               # RSTMDB API client (citations, GitHub, patents)
      neo4j_client.py                # Neo4j connection pool management
      redis_client.py                # Redis connection + cache helpers
    importers/                       # Data pipeline (markdown -> graph)
      __init__.py
      markdown_parser.py             # Parse school markdown -> structured entities
      cross_ref_parser.py            # Parse cross-reference-map.md -> typed edges
      graph_importer.py              # Batch import parsed data into Neo4j (idempotent)
      validation.py                  # Import accuracy validation (95%+ target)
    cli/                             # CLI interface (typer + rich)
      __init__.py
      main.py                        # typer app entry point, command group registration
      commands/
        __init__.py
        trace.py                     # `genealogy trace "How does RL connect to..."`
        verify.py                    # `genealogy verify docs/research/kolmogorov-school.md`
        import_cmd.py                # `genealogy import --all` / `genealogy import --school kolmogorov`
        rsi.py                       # `genealogy rsi --lineage "diffusion-models"`
        gap.py                       # `genealogy gap --top 10` / `genealogy gap --pair kolmogorov pontryagin`
        graph_cmd.py                 # `genealogy graph stats` / `genealogy graph export`
    api/                             # HTTP API (FastAPI)
      __init__.py
      main.py                        # FastAPI app factory, middleware, lifespan
      dependencies.py                # Dependency injection (Neo4j session, Redis, auth)
      routes/
        __init__.py
        trace.py                     # POST /api/v1/trace -- proof chain queries
        search.py                    # GET /api/v1/search -- full-text + embedding search
        schools.py                   # GET /api/v1/schools -- school listings + detail
        graph.py                     # GET /api/v1/graph -- subgraph data for Explorer
        rsi.py                       # GET /api/v1/rsi -- RSI scores + time series
        gap.py                       # GET /api/v1/gap -- gap scores + matrix
        health.py                    # GET /api/v1/health -- readiness + liveness probes
tests/
  __init__.py
  conftest.py                        # Shared fixtures (Neo4j test instance, mock Redis)
  models/
    __init__.py
    test_proof_chain.py              # ProofChain/ProofLink model validation tests
    test_school.py                   # School model validation tests
    test_graph.py                    # Graph query/response model tests
  engine/
    __init__.py
    test_proof_engine.py             # End-to-end proof engine tests (6 stages)
    test_confidence_scorer.py        # Confidence scoring determinism tests
    test_graph_traverser.py          # Graph traversal + path finding tests
  importers/
    __init__.py
    test_markdown_parser.py          # Markdown -> entity extraction tests
    test_cross_ref_parser.py         # Cross-reference map parsing tests
    test_graph_importer.py           # Import idempotency + accuracy tests
  api/
    __init__.py
    test_trace_routes.py             # Trace endpoint integration tests
    test_search_routes.py            # Search endpoint tests
  fixtures/
    sample_school.md                 # Trimmed markdown for parser tests
    sample_cross_ref.md              # Trimmed cross-ref map for parser tests
```

### Design Decisions on Structure

| Decision | Rationale |
|---|---|
| `engine/` splits into 6 modules matching spec stages | Each stage is independently testable; mirrors the 6-stage architecture from the spec |
| `importers/` separate from `engine/` | Import pipeline runs once (batch); engine runs per-query (hot path). Different performance profiles. |
| `models/` at the top level, not inside each module | Models are shared across engine, API, CLI, and importers. Central location prevents circular imports. |
| `cli/commands/` mirrors `api/routes/` | Same capabilities exposed through both interfaces. CLI for dogfood (Phase 0), API for web (Phase 1+). |
| `tests/` mirrors `src/genealogy/` | Test discoverability. Every source module has a corresponding test module. |
| `tests/fixtures/` for sample data | Real markdown snippets, not mocks. Tests validate actual parsing behavior. |

---

## 4. Core Data Models

### 4.1 Proof Chain Models (`src/genealogy/models/proof_chain.py`)

These models implement the ProofChain schema defined in the platform spec (Section "Proof Chain Schema").

```python
from enum import Enum
from datetime import datetime
from uuid import uuid4

from pydantic import BaseModel, Field


class TransmissionType(str, Enum):
    """Typed transmission paths per ADR-002 taxonomy.

    Ordered by typical confidence contribution (highest to lowest).
    """
    DIRECT = "Direct"
    REFORMULATION = "Reformulation"
    CONVERGENT = "Convergent"
    INDIRECT = "Indirect"


class EvidenceType(str, Enum):
    """Source quality tier for confidence scoring."""
    PRIMARY = "primary"       # Original paper, book by school member (0.90-1.0)
    SECONDARY = "secondary"   # Survey article, encyclopedia, peer-reviewed bio (0.70-0.89)
    TERTIARY = "tertiary"     # Wikipedia, popular science (0.40-0.69, flagged)


class Evidence(BaseModel):
    """A single evidence citation supporting a proof chain link."""
    source: str = Field(description="Full citation (author, year, title, publisher)")
    evidence_type: EvidenceType
    note: str = Field(default="", description="Explanation of how this source supports the link")


class GraphNode(BaseModel):
    """A node in the genealogy graph (person, theory, technology, institution)."""
    id: str = Field(description="Stable identifier, e.g. 'pontryagin-maximum-principle-1956'")
    label: str = Field(description="Human-readable label")
    school: str | None = Field(default=None, description="School this node belongs to, if any")


class ProofLink(BaseModel):
    """A single link in a proof chain -- one hop in the evidence trail."""
    from_node: GraphNode
    to_node: GraphNode
    link_type: TransmissionType
    evidence: list[Evidence] = Field(min_length=1, description="At least one evidence source required (AC3)")
    confidence: float = Field(ge=0.0, le=1.0)


class ProofChain(BaseModel):
    """A complete proof chain answering a lineage query.

    The chain is an ordered list of ProofLinks from origin to destination.
    Aggregate confidence = product of per-link confidences (weakest link dominates).
    """
    claim: str = Field(description="Human-readable claim this chain proves")
    overall_confidence: float = Field(ge=0.0, le=1.0)
    chain: list[ProofLink] = Field(min_length=1)
    graph_version: str = Field(description="Graph version this chain was computed against")
    transmission_type: TransmissionType = Field(
        description="Dominant transmission type across the chain"
    )
    computed_at: datetime = Field(default_factory=datetime.utcnow)


class TraceRequest(BaseModel):
    """Incoming query for a proof chain."""
    query: str = Field(min_length=10, max_length=2000, description="Natural language lineage question")


class TraceResponse(BaseModel):
    """Response containing proof chain(s) for a lineage query."""
    proof_chain: ProofChain
    alternatives: list[ProofChain] = Field(
        default_factory=list,
        description="Up to 2 alternative paths ranked by confidence"
    )
    trace_id: str = Field(default_factory=lambda: str(uuid4()))
    latency_ms: int = Field(ge=0, description="Total computation time in milliseconds")
    query: str = Field(description="Original query, echoed back for traceability")
```

### 4.2 School Models (`src/genealogy/models/school.py`)

```python
from pydantic import BaseModel, Field


class Person(BaseModel):
    """A researcher, mathematician, or scientist in the genealogy graph."""
    id: str
    name: str
    birth_year: int | None = None
    death_year: int | None = None
    institution: str | None = None
    role: str = Field(default="researcher", description="founder, student, collaborator, emigre")
    key_contributions: list[str] = Field(default_factory=list)


class Theory(BaseModel):
    """A theoretical contribution or framework."""
    id: str
    name: str
    year: int | None = None
    description: str = ""
    originating_school: str | None = None
    key_papers: list[str] = Field(default_factory=list)


class ModernTech(BaseModel):
    """A modern technology prototype descended from foundational theory."""
    id: str
    name: str
    domain: str = Field(description="AI/ML, Quantum, Compilers, Crypto, Optimization, etc.")
    description: str = ""
    year_emerged: int | None = None


class Publication(BaseModel):
    """A seminal publication (paper, book, monograph)."""
    id: str
    title: str
    authors: list[str]
    year: int
    venue: str = ""
    citation_key: str = Field(default="", description="BibTeX key for academic export")


class School(BaseModel):
    """A science school -- the top-level organizational unit in the genealogy graph."""
    id: str = Field(description="Stable identifier, e.g. 'kolmogorov'")
    name: str = Field(description="Full school name, e.g. 'Kolmogorov School (Moscow)'")
    founder: Person
    location: str
    region: str = Field(description="Geographic/cultural region for Explorer color coding")
    active_period: str = Field(description="e.g. '1930s-present'")
    core_domains: list[str]
    key_figures: list[Person] = Field(default_factory=list)
    theories: list[Theory] = Field(default_factory=list)
    modern_technologies: list[ModernTech] = Field(default_factory=list)
    publications: list[Publication] = Field(default_factory=list)
```

### 4.3 Graph Query Models (`src/genealogy/models/graph.py`)

```python
from pydantic import BaseModel, Field


class NodeMatch(BaseModel):
    """Result of mapping a query entity to a graph node."""
    node_id: str
    label: str
    match_method: str = Field(description="'exact', 'fuzzy', or 'embedding'")
    match_confidence: float = Field(ge=0.0, le=1.0)


class PathResult(BaseModel):
    """A raw path returned from Neo4j graph traversal."""
    nodes: list[str] = Field(description="Ordered list of node IDs in the path")
    edges: list[dict] = Field(description="Edge properties for each hop")  # noqa: UP006
    hop_count: int
    total_weight: float = Field(description="Traversal weight (lower is better)")


class GraphStats(BaseModel):
    """Summary statistics for the genealogy graph."""
    total_nodes: int
    total_edges: int
    school_count: int
    person_count: int
    theory_count: int
    modern_tech_count: int
    graph_version: str


class SubgraphRequest(BaseModel):
    """Request for a subgraph (used by Explorer frontend)."""
    center_node: str | None = None
    school_id: str | None = None
    depth: int = Field(default=2, ge=1, le=4)
    include_evidence: bool = False


class SubgraphResponse(BaseModel):
    """Subgraph data for rendering in the Explorer."""
    nodes: list[dict]  # noqa: UP006
    edges: list[dict]  # noqa: UP006
    metadata: GraphStats
```

---

## 5. Local Development Stack

### 5.1 Docker Compose

All stateful services run in Docker for local development. The Python application runs natively via `uv run` for fast iteration.

```yaml
# docker-compose.yml
services:
  neo4j:
    image: neo4j:5.28-community
    ports:
      - "7474:7474"   # Browser UI
      - "7687:7687"   # Bolt protocol
    environment:
      NEO4J_AUTH: neo4j/genealogy-dev
      NEO4J_PLUGINS: '["apoc", "graph-data-science"]'
      NEO4J_server_memory_pagecache_size: "512M"
      NEO4J_server_memory_heap_initial__size: "512M"
      NEO4J_server_memory_heap_max__size: "1G"
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
    healthcheck:
      test: ["CMD", "cypher-shell", "-u", "neo4j", "-p", "genealogy-dev", "RETURN 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: genealogy
      POSTGRES_USER: genealogy
      POSTGRES_PASSWORD: genealogy-dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U genealogy"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  neo4j_data:
  neo4j_logs:
  redis_data:
  postgres_data:
```

### 5.2 Service Roles

| Service | Role | Phase 0 Usage | Phase 1+ Usage |
|---|---|---|---|
| **Neo4j** | Primary graph database for genealogy data | Graph traversal, proof chains, gap detection | Same + Explorer subgraph queries, full-text search |
| **Redis** | Caching + rate limiting | Cache proof chains (deterministic = safe to cache), RSI scores, embedding vectors | Same + API rate limiting per tier, session cache |
| **PostgreSQL** | User/account state, audit logs, RSI time series | RSI time-series storage, import audit logs | Same + user accounts, API keys, billing state, proof chain audit trail |

### 5.3 Running Locally

```bash
# Start infrastructure services
docker compose up -d

# Wait for health checks
docker compose ps  # All services should show "healthy"

# Install Python dependencies
uv sync

# Import seed data (25 school markdown documents)
uv run genealogy import --all --source docs/research/

# Run the API server
uv run uvicorn genealogy.api.main:app --reload --port 8000

# Or use the CLI directly
uv run genealogy trace "How does reinforcement learning trace back to Pontryagin?"
uv run genealogy verify docs/research/kolmogorov-school.md
uv run genealogy rsi --all
uv run genealogy gap --top 10
```

---

## 6. Neo4j Graph Schema

### 6.1 Node Labels

| Label | Properties | Example |
|---|---|---|
| `School` | `id`, `name`, `region`, `location`, `active_period`, `core_domains[]` | `(:School {id: "kolmogorov", name: "Kolmogorov School (Moscow)"})` |
| `Person` | `id`, `name`, `birth_year`, `death_year`, `institution`, `role` | `(:Person {id: "kolmogorov-an", name: "Andrey Kolmogorov"})` |
| `Theory` | `id`, `name`, `year`, `description`, `key_papers[]` | `(:Theory {id: "kolmogorov-complexity-1965", name: "Kolmogorov Complexity"})` |
| `ModernTech` | `id`, `name`, `domain`, `description`, `year_emerged` | `(:ModernTech {id: "diffusion-models", name: "Diffusion Models"})` |
| `Publication` | `id`, `title`, `authors[]`, `year`, `venue` | `(:Publication {id: "pontryagin-1962", title: "Mathematical Theory of Optimal Processes"})` |

### 6.2 Relationship Types

| Relationship | Between | Properties |
|---|---|---|
| `FOUNDED` | Person -> School | `year` |
| `MEMBER_OF` | Person -> School | `role`, `years_active` |
| `STUDENT_OF` | Person -> Person | `institution`, `years` |
| `COLLABORATOR` | Person -> Person | `nature`, `institution` |
| `DEVELOPED` | Person -> Theory | `year`, `role` (primary, contributor) |
| `BASED_ON` | Theory -> Theory | `transmission_type`, `evidence[]`, `confidence` |
| `REALIZED_IN` | Theory -> ModernTech | `transmission_type`, `evidence[]`, `confidence`, `year` |
| `PUBLISHED` | Person -> Publication | `role` (author, editor) |
| `CITES` | Publication -> Publication | `context` |
| `CROSS_REFERENCE` | School -> School | `layer` (personal/theoretical/convergence), `connections[]` |

### 6.3 Key Cypher Patterns

**Shortest proof chain (Stage 3 traversal):**
```cypher
MATCH path = shortestPath(
  (start:Theory {id: $start_id})-[:BASED_ON|REALIZED_IN*..6]-(end:ModernTech {id: $end_id})
)
RETURN path,
  [r IN relationships(path) | r.transmission_type] AS types,
  [r IN relationships(path) | r.confidence] AS confidences,
  [r IN relationships(path) | r.evidence] AS evidences
```

**All paths up to 6 hops (for alternative chains):**
```cypher
MATCH path = (start:Theory {id: $start_id})-[:BASED_ON|REALIZED_IN*..6]-(end:ModernTech {id: $end_id})
WITH path,
  reduce(conf = 1.0, r IN relationships(path) | conf * r.confidence) AS aggregate_confidence
ORDER BY aggregate_confidence DESC
LIMIT 3
RETURN path, aggregate_confidence
```

**Gap detection (school pairs with embedding proximity but no edges):**
```cypher
MATCH (s1:School), (s2:School)
WHERE s1.id < s2.id
  AND NOT (s1)-[:CROSS_REFERENCE]-(s2)
RETURN s1.id, s2.id, s1.name, s2.name
```

### 6.4 Indexes

```cypher
-- Full-text index for search
CREATE FULLTEXT INDEX search_index FOR (n:School|Person|Theory|ModernTech) ON EACH [n.name, n.description];

-- Unique constraints
CREATE CONSTRAINT school_id FOR (s:School) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT person_id FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT theory_id FOR (t:Theory) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT modern_tech_id FOR (m:ModernTech) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT publication_id FOR (pub:Publication) REQUIRE pub.id IS UNIQUE;

-- Composite index for traversal performance
CREATE INDEX theory_school FOR (t:Theory) ON (t.originating_school);
```

---

## 7. CI/CD Pipeline

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: "3.13"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
      - run: uv run ruff check src/ tests/
      - run: uv run ruff format --check src/ tests/
      - run: uv run mypy src/

  test:
    runs-on: ubuntu-latest
    needs: lint
    services:
      neo4j:
        image: neo4j:5.28-community
        ports:
          - 7687:7687
        env:
          NEO4J_AUTH: neo4j/test-password
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
      - run: uv run pytest --cov=genealogy --cov-report=xml -v
      - uses: codecov/codecov-action@v5
        with:
          file: coverage.xml

  docs-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: DavidAnson/markdownlint-cli2-action@v19
        with:
          globs: 'docs/**/*.md'
      - uses: streetsidesoftware/cspell-action@v6
        with:
          files: 'docs/**/*.md'

  determinism-check:
    runs-on: ubuntu-latest
    needs: test
    services:
      neo4j:
        image: neo4j:5.28-community
        ports:
          - 7687:7687
        env:
          NEO4J_AUTH: neo4j/test-password
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
      - name: Run determinism test (same query 3x, identical results)
        run: uv run pytest tests/engine/test_proof_engine.py -k determinism -v
```

### 7.2 Branch Strategy

```
main (protected -- requires PR + passing CI)
 |
 +-- feat/proof-engine          # Core engine development
 +-- feat/graph-import          # Markdown -> Neo4j import pipeline
 +-- feat/cli-trace             # CLI trace command
 +-- feat/cli-verify            # CLI verification tool
 +-- feat/rsi-computation       # RSI engine
 +-- feat/gap-detector          # Gap detection algorithm
 +-- feat/api-v1                # FastAPI endpoints
 +-- infra/docker-compose       # Infrastructure setup
 +-- infra/ci-pipeline          # CI/CD configuration
```

### 7.3 Commit Convention

Follow existing convention from the repo plus DCO sign-off (per spec technical requirements):

```
feat(engine): add proof chain assembly with deterministic traversal
fix(importer): handle duplicate nodes in idempotent import
test(scorer): add confidence scoring edge cases
docs(platform): add infrastructure design document
chore(ci): add Neo4j service container for integration tests

# DCO sign-off required on every commit
git commit -s -m "feat(engine): add proof chain assembly"
```

---

## 8. Cloud Architecture (Phase 1+)

### 8.1 Phase 0 (Dogfood): Local Only

```
Developer Laptop
├── Python app (uv run)
├── Docker: Neo4j
├── Docker: Redis
└── Docker: PostgreSQL
```

No cloud deployment in Phase 0. The team runs everything locally. This validates the stack before investing in infrastructure.

### 8.2 Phase 1 (External Free Tier): MVP Cloud

**Target: Fly.io or Railway** -- both support Docker, managed PostgreSQL, and have generous free/starter tiers. Decision deferred until Phase 0 completion, but architecture is container-ready.

```
                    ┌─────────────────────────────────┐
                    │         CDN (Cloudflare)         │
                    │   Static assets + edge caching   │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │      Load Balancer / Router      │
                    └────────────┬────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
    ┌─────────▼──────┐ ┌────────▼───────┐ ┌────────▼────────┐
    │   API Server   │ │  API Server    │ │  Worker          │
    │  (FastAPI)     │ │  (FastAPI)     │ │  (RSI cron,      │
    │  2x instances  │ │  replica       │ │   gap batch)     │
    └────────┬───────┘ └────────┬───────┘ └────────┬─────────┘
             │                  │                   │
    ┌────────▼──────────────────▼───────────────────▼─────────┐
    │                    Service Mesh                           │
    └───┬─────────────────┬──────────────────┬────────────────┘
        │                 │                  │
  ┌─────▼──────┐  ┌──────▼──────┐  ┌───────▼───────┐
  │   Neo4j    │  │   Redis     │  │  PostgreSQL   │
  │  (managed) │  │  (managed)  │  │  (managed)    │
  └────────────┘  └─────────────┘  └───────────────┘
```

### 8.3 Phase 2 (Enterprise): AWS/GCP Migration

When enterprise contracts demand SLAs, SOC 2, and data residency:

| Component | Phase 1 (MVP) | Phase 2 (Enterprise) |
|---|---|---|
| Compute | Fly.io / Railway containers | AWS ECS Fargate or GCP Cloud Run |
| Graph DB | Neo4j AuraDB (managed) | Neo4j AuraDB Enterprise or self-hosted on dedicated instances |
| Cache | Upstash Redis (managed) | AWS ElastiCache or GCP Memorystore |
| SQL DB | Managed Postgres (Fly/Railway) | AWS RDS or GCP Cloud SQL |
| CDN | Cloudflare (free tier) | Cloudflare Pro / AWS CloudFront |
| Monitoring | Fly.io metrics + Sentry | Datadog / Grafana Cloud |
| Auth | API key (homegrown) | Auth0 or AWS Cognito (SSO for enterprise) |

**Migration path**: The application is containerized from day one. Moving from Fly.io to AWS ECS is a deployment config change, not an application rewrite.

---

## 9. Observability

### 9.1 Structured Logging

All application logging uses structlog for machine-parseable output:

```python
import structlog

logger = structlog.get_logger()

# Every proof chain query is logged with context
logger.info(
    "proof_chain_computed",
    trace_id=trace_id,
    query=query,
    chain_length=len(chain.chain),
    confidence=chain.overall_confidence,
    latency_ms=latency_ms,
    graph_version=graph_version,
)

# Evidence quality warnings
logger.warning(
    "low_confidence_link",
    trace_id=trace_id,
    link_from=link.from_node.id,
    link_to=link.to_node.id,
    confidence=link.confidence,
    evidence_type=link.evidence[0].evidence_type,
)
```

### 9.2 Metrics (Phase 1+)

Key metrics to track:

| Metric | Type | Target |
|---|---|---|
| `proof_chain_latency_ms` | Histogram | p95 < 5000ms (spec AC11) |
| `proof_chain_confidence` | Histogram | 90%+ queries >= 0.70 confidence |
| `proof_chain_determinism` | Counter | 100% identical on repeated queries |
| `graph_import_accuracy` | Gauge | >= 95% (spec AC5) |
| `api_request_count` | Counter | By route, status code, tier |
| `cache_hit_rate` | Gauge | > 80% for repeated queries |

### 9.3 OpenTelemetry (Phase 2+)

Distributed tracing for the 6-stage proof engine pipeline:

```
Span: proof_chain_query
  ├── Span: stage_1_query_processing (NLP entity extraction)
  ├── Span: stage_2_node_mapping (exact match + embedding)
  ├── Span: stage_3_graph_traversal (Neo4j Cypher)
  ├── Span: stage_4_evidence_attachment (edge property lookup)
  ├── Span: stage_5_confidence_scoring (deterministic computation)
  └── Span: stage_6_chain_assembly (top-K selection)
```

Each span carries attributes: `trace_id`, `graph_version`, `hop_count`, `candidate_paths_found`, `selected_confidence`.

---

## 10. Security

### 10.1 Authentication & Authorization

| Phase | Mechanism | Details |
|---|---|---|
| Phase 0 (Dogfood) | None / localhost only | CLI tools run locally, no network auth needed |
| Phase 1 (Free tier) | API key (auto-generated on signup) | Rate limited: Free = 2 queries/month, Researcher = 15/month |
| Phase 1 (Researcher) | API key + JWT session | JWT for web UI, API key for programmatic access |
| Phase 2 (Enterprise) | API key + JWT + SSO (SAML/OIDC) | Enterprise SSO integration via Auth0 or equivalent |

### 10.2 Rate Limiting

Redis-backed sliding window rate limiter:

```python
# Rate limit tiers (per API key)
RATE_LIMITS = {
    "free": {"proof_queries": 2, "window": "month"},
    "researcher": {"proof_queries": 15, "api_calls": 100, "window": "month"},
    "enterprise": {"proof_queries": -1, "api_calls": -1, "window": None},  # unlimited
}
```

### 10.3 Data Protection

| Concern | Mitigation |
|---|---|
| Graph data exposure | Free tier sees only 3 schools; Researcher/Enterprise sees all. Enforced at query layer, not graph layer. |
| Proof chain reproducibility | All proof chains reference `graph_version`. Graph mutations create new versions. Old versions are retained for audit. |
| RSTMDB API keys | Stored in environment variables, never in code or config files. Rotated quarterly. |
| Neo4j credentials | Docker Compose uses dev credentials. Production uses managed service credentials via environment injection. |

### 10.4 Secrets Management

| Environment | Method |
|---|---|
| Local dev | `.env` file (gitignored) |
| CI | GitHub Actions secrets |
| Production (Phase 1+) | Platform secrets (Fly.io secrets / AWS Secrets Manager) |

---

## 11. Data Import Pipeline

### 11.1 Architecture

The import pipeline converts 25 markdown research documents + the cross-reference map into Neo4j graph nodes and edges.

```
docs/research/*.md ──┐
                     ├──> markdown_parser.py ──> Structured Entities
                     │                                   │
cross-reference-map.md ──> cross_ref_parser.py ──────────┤
                                                         │
                                                         ▼
                                               graph_importer.py
                                                         │
                                                         ▼
                                                    Neo4j Graph
                                                         │
                                                         ▼
                                                  validation.py
                                                (95%+ accuracy check)
```

### 11.2 Idempotency

The importer uses `MERGE` statements in Cypher, not `CREATE`. Running the import twice produces the same graph state. Each node has a stable `id` property derived from the entity name and year:

```cypher
MERGE (p:Person {id: "kolmogorov-an"})
SET p.name = "Andrey Kolmogorov",
    p.birth_year = 1903,
    p.death_year = 1987,
    p.institution = "Moscow State University"
```

### 11.3 Validation

After import, `validation.py` compares the graph against source documents:

| Check | Target | Method |
|---|---|---|
| Node count | All persons, theories, modern techs from source present | Count nodes per label, compare to expected counts extracted from markdown |
| Edge count | 34+ personal, 20+ theoretical, 37+ convergence connections | Count edges by type, compare to cross-reference map |
| Evidence preservation | Every edge with evidence in markdown has evidence in graph | Sample 20% of edges, verify `evidence` property is populated |
| Accuracy | >= 95% of source facts present | (matched nodes + matched edges) / (expected nodes + expected edges) |

---

## 12. Testing Strategy

### 12.1 Test Pyramid

```
         ┌─────────────┐
         │  E2E Tests   │  5% -- Full CLI command -> Neo4j -> response
         │  (slow)      │
         ├─────────────┤
         │ Integration  │  25% -- API routes, Neo4j queries, import pipeline
         │ (medium)     │
         ├─────────────┤
         │  Unit Tests  │  70% -- Models, scoring, parsing, assembly logic
         │  (fast)      │
         └─────────────┘
```

### 12.2 Key Test Categories

| Category | What It Tests | Infrastructure Required |
|---|---|---|
| Model validation | Pydantic model constraints (confidence bounds, required fields, enum values) | None |
| Confidence scoring | Deterministic scoring with known inputs produces expected outputs | None |
| Markdown parsing | Entity extraction from sample markdown files | None (fixture files) |
| Graph traversal | Cypher queries return correct paths | Neo4j (test container) |
| Import idempotency | Running import twice yields identical graph | Neo4j (test container) |
| Proof chain determinism | Same query 3x against same graph = identical results (AC10) | Neo4j (test container) |
| API routes | HTTP request/response contracts | FastAPI TestClient + Neo4j |
| CLI commands | End-to-end command execution | All services |

### 12.3 Sample Test: Model Validation

```python
# tests/models/test_proof_chain.py

import pytest
from genealogy.models.proof_chain import (
    Evidence,
    EvidenceType,
    GraphNode,
    ProofChain,
    ProofLink,
    TraceRequest,
    TransmissionType,
)


class TestTransmissionType:
    def test_all_types_present(self):
        assert set(TransmissionType) == {
            TransmissionType.DIRECT,
            TransmissionType.REFORMULATION,
            TransmissionType.CONVERGENT,
            TransmissionType.INDIRECT,
        }

    def test_string_values(self):
        assert TransmissionType.DIRECT.value == "Direct"
        assert TransmissionType.INDIRECT.value == "Indirect"


class TestProofLink:
    def test_valid_proof_link(self):
        link = ProofLink(
            from_node=GraphNode(id="pontryagin-pmp-1956", label="Pontryagin Maximum Principle"),
            to_node=GraphNode(id="bellman-dp-1957", label="Bellman Dynamic Programming"),
            link_type=TransmissionType.CONVERGENT,
            evidence=[
                Evidence(
                    source="Pontryagin, L.S. et al. (1962). Mathematical Theory of Optimal Processes.",
                    evidence_type=EvidenceType.PRIMARY,
                    note="Establishes relationship between PMP and DP.",
                )
            ],
            confidence=0.90,
        )
        assert link.confidence == 0.90
        assert len(link.evidence) == 1

    def test_confidence_bounds(self):
        with pytest.raises(ValueError):
            ProofLink(
                from_node=GraphNode(id="a", label="A"),
                to_node=GraphNode(id="b", label="B"),
                link_type=TransmissionType.DIRECT,
                evidence=[Evidence(source="src", evidence_type=EvidenceType.PRIMARY)],
                confidence=1.5,  # Out of bounds
            )

    def test_evidence_required(self):
        """AC3: Every proof chain link cites at least one evidence source."""
        with pytest.raises(ValueError):
            ProofLink(
                from_node=GraphNode(id="a", label="A"),
                to_node=GraphNode(id="b", label="B"),
                link_type=TransmissionType.DIRECT,
                evidence=[],  # Empty -- violates min_length=1
                confidence=0.8,
            )


class TestProofChain:
    def _make_chain(self, confidence: float = 0.85) -> ProofChain:
        link = ProofLink(
            from_node=GraphNode(id="a", label="A", school="kolmogorov"),
            to_node=GraphNode(id="b", label="B"),
            link_type=TransmissionType.DIRECT,
            evidence=[Evidence(source="Test source", evidence_type=EvidenceType.PRIMARY)],
            confidence=confidence,
        )
        return ProofChain(
            claim="A leads to B",
            overall_confidence=confidence,
            chain=[link],
            graph_version="v1.0.0-10schools",
            transmission_type=TransmissionType.DIRECT,
        )

    def test_valid_chain(self):
        chain = self._make_chain()
        assert chain.overall_confidence == 0.85
        assert len(chain.chain) == 1
        assert chain.graph_version == "v1.0.0-10schools"

    def test_chain_requires_at_least_one_link(self):
        with pytest.raises(ValueError):
            ProofChain(
                claim="Empty chain",
                overall_confidence=0.5,
                chain=[],  # Empty -- violates min_length=1
                graph_version="v1.0.0",
                transmission_type=TransmissionType.DIRECT,
            )


class TestTraceRequest:
    def test_valid_request(self):
        req = TraceRequest(query="How does reinforcement learning trace back to Soviet-era control theory?")
        assert len(req.query) > 10

    def test_query_too_short(self):
        with pytest.raises(ValueError):
            TraceRequest(query="short")

    def test_query_too_long(self):
        with pytest.raises(ValueError):
            TraceRequest(query="x" * 2001)
```

---

## 13. Configuration Management

### 13.1 Environment Variables

```bash
# .env.example (committed to repo)

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=genealogy-dev

# Redis
REDIS_URL=redis://localhost:6379/0

# PostgreSQL
DATABASE_URL=postgresql://genealogy:genealogy-dev@localhost:5432/genealogy

# Infer Engine
INFER_API_URL=http://localhost:9000
INFER_API_KEY=

# RSTMDB
RSTMDB_API_URL=http://localhost:9001
RSTMDB_API_KEY=

# Embeddings
EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_CACHE_DIR=.cache/embeddings

# Application
GRAPH_VERSION=v1.0.0-25schools
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### 13.2 Configuration Loading

```python
# src/genealogy/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "genealogy-dev"
    redis_url: str = "redis://localhost:6379/0"
    database_url: str = "postgresql://genealogy:genealogy-dev@localhost:5432/genealogy"
    infer_api_url: str = "http://localhost:9000"
    infer_api_key: str = ""
    rstmdb_api_url: str = "http://localhost:9001"
    rstmdb_api_key: str = ""
    embedding_model: str = "all-MiniLM-L6-v2"
    graph_version: str = "v1.0.0-25schools"
    log_level: str = "INFO"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}
```

---

## 14. Performance Targets

| Metric | Target | Constraint From |
|---|---|---|
| Proof chain latency (p95) | < 5,000 ms | Spec AC11 |
| Graph traversal (up to 6 hops) | < 2,000 ms | Spec Stage 3 |
| Node mapping (exact + embedding) | < 1,000 ms | Spec Stage 2 |
| Import pipeline (25 schools) | < 5 minutes | Development workflow |
| API cold start | < 3 seconds | Developer experience |
| Explorer subgraph load | < 500 ms | Product vision (60fps target) |

### Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|---|---|---|---|
| Proof chains (same query + graph version) | Redis | 24 hours | On graph version bump |
| Embedding vectors (per node) | Redis + local file | Indefinite | On node content change |
| RSI scores | Redis | 1 hour | On RSI recomputation |
| Graph stats | Redis | 5 minutes | On import |
| School listings | Redis | 1 hour | On import |

---

## 15. Decision Log

| Decision | Rationale | Alternatives Considered |
|---|---|---|
| Python 3.13 | ML ecosystem (sentence-transformers), Infer integration, team familiarity | Go (fast but poor ML ecosystem), TypeScript (full-stack but weak graph DB support) |
| uv for package management | Fast, deterministic lockfile, replaces pip/pipenv/poetry | poetry (slower), pip + requirements.txt (no lockfile) |
| Neo4j for graph database | Native graph traversal, Cypher query language, APOC plugins for graph algorithms | PostgreSQL + recursive CTEs (slower for 6-hop traversals), ArangoDB (less ecosystem), Amazon Neptune (vendor lock-in) |
| Redis for caching | Proof chain determinism makes caching safe; also handles rate limiting | In-memory LRU (not shared across instances), Memcached (no data structures for rate limiting) |
| PostgreSQL for state | RSI time series, user accounts, audit logs need relational queries | SQLite (not suitable for concurrent access), Neo4j only (poor for time series and user accounts) |
| FastAPI for API | Async support, automatic OpenAPI docs, Pydantic integration | Flask (no async), Django (too heavy for API-first), Litestar (smaller ecosystem) |
| Fly.io/Railway for Phase 1 | Docker-native, managed Postgres, fast deploys, low cost for MVP | AWS ECS (overkill for MVP), Vercel (not suited for Python), Heroku (pricing) |
| structlog for logging | Structured JSON output, context binding, stdlib compatible | stdlib logging (unstructured), loguru (not as good for production structured output) |
| Monorepo (src/ in docs repo) | Seed data (markdown) and application code colocate; import pipeline reads from docs/ | Separate repo (adds complexity for Phase 0 where markdown IS the data source) |

---

## 16. Open Questions

| Question | Impact | Decision Needed By |
|---|---|---|
| Infer API contract: what is the exact request/response schema? | Blocks `infer_client.py` implementation | Before Task 1 (Infer Integration) |
| RSTMDB API contract: endpoints for citations, GitHub, patents? | Blocks RSI computation | Before Task 4 (RSI) |
| Neo4j AuraDB vs. self-hosted for Phase 1? | Cost and ops burden | Before Phase 1 deployment |
| Embedding model selection: all-MiniLM-L6-v2 vs. domain-specific? | Query-to-node mapping quality | During Task 1 prototyping |
| Graph versioning strategy: semver tags on Neo4j snapshots? | Proof chain reproducibility (AC10) | Before first import |

---

*Platform infrastructure design for the Science Genealogy SaaS Platform. Covers Phase 0 (dogfood) through Phase 2 (enterprise) with forward-compatible architecture decisions.*
