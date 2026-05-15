# DB Selection Rationale: craftegy-design

**Date**: 2026-05-10
**Status**: Decided
**Related**: [DB Layer Assessment](../assess/craftegy-design-db-layer-assessment.md) | [Vector DB Spike](craftegy-design-vector-db-spike.md) | [BYOK LLM Spec](../prd/byok-llm-provider-spec.md)

---

## Decision

**Primary data store**: SQLite via `rusqlite` (WAL mode, embedded)
**State machine layer**: `rstmdb` (existing, for artifact/session lifecycle)
**Vector search layer**: Deferred -- brute-force over SQLite BLOBs when needed

---

## Why SQLite (rusqlite)

SQLite is the proven choice for desktop application persistence. It matches every access pattern craftegy-design requires:

| Requirement | SQLite Fit |
|-------------|-----------|
| Conversations (append + query by session) | Excellent -- indexed queries, WAL for concurrent reads |
| Artifacts (write-once, read-many, search by title) | Excellent -- BLOB storage + metadata columns |
| Provider configs (key-value, read on boot) | Excellent -- simple table, <10 rows |
| Design systems (browse catalog, read at gen time) | Excellent -- full-text search via FTS5 if needed |
| Encryption at rest (API keys) | Good -- application-level encryption of sensitive columns |

**Reference architecture**: open-design uses `better-sqlite3` (Node.js SQLite binding) with WAL mode for the same data patterns: projects, conversations, messages, tabs, templates, critique sessions. Artifacts live on filesystem under `.od/projects/<id>/`. craftegy-design follows the same pattern with `rusqlite` as the Rust equivalent.

**Maturity**: rusqlite is the most downloaded SQLite binding on crates.io, battle-tested, actively maintained, and already used in the ecosystem (aivm).

---

## Why rstmdb for State Machines

craftegy-design already depends on `rstmdb-client` (see `craftegy-design-db/Cargo.toml`). rstmdb provides:

- Formal state machine definitions with validated transitions
- WATCH events for real-time state change notifications (used for artifact lifecycle: pending -> generating -> ready -> error)
- Separation of concerns: state logic in rstmdb, data in SQLite

This dual-DB pattern (SQLite for data + rstmdb for state machines) is the recommended architecture from the assessment.

---

## Why Not the Alternatives

### sled -- Unmaintained

- Last significant release: 2021. The maintainer has moved on.
- K/V only -- no SQL, no schema, no migrations.
- Corruption reports in edge cases.
- **Verdict**: Not viable for new projects in 2026.

### redb -- K/V Only

- Positioned as sled's spiritual successor, actively maintained.
- Pure Rust, embedded, ACID.
- But: K/V only. No SQL, no query language. Would need manual index management for every access pattern.
- **Verdict**: Good for simple K/V needs, but craftegy-design needs relational queries (JOIN conversations with artifacts, filter by date range, etc.).

### SurrealDB -- Overkill

- Multi-model database (document + graph + vector + relational).
- Embedded mode available, but:
  - Massive dependency tree
  - Its own query language (SurrealQL) -- team must learn another DSL
  - Binary size bloat inappropriate for a Tauri desktop app
  - Features we would never use (graph queries, record links, live queries across network)
- **Verdict**: Overkill. SQLite covers 100% of our needs with 1% of the complexity.

### DuckDB -- Wrong Access Pattern

- Excellent for OLAP (analytics, columnar scans, large aggregations).
- Poor fit for OLTP (single-row inserts, point lookups, real-time updates).
- craftegy-design is OLTP: append a message, fetch a conversation, update a config.
- **Verdict**: Wrong tool for the job.

### lancedb -- Deferred (See Vector DB Spike)

- Embedded vector DB with native Rust core. Technically capable.
- But: Heavy dependency tree (Arrow + Lance + object_store), pre-1.0 API, async-only.
- The vector search use case is not justified at craftegy-design's scale (<1,000 artifacts).
- **Verdict**: Deferred. See [craftegy-design-vector-db-spike.md](craftegy-design-vector-db-spike.md) for full analysis.

### Qdrant -- Requires Server

- Best-in-class vector DB, written in Rust.
- But requires running a separate Qdrant server process.
- Unacceptable for a desktop Tauri app -- users should not need to install and manage a database server.
- **Verdict**: Not suitable for embedded desktop use.

---

## Vector Search Layer: Deferred

Per the [vector DB spike](craftegy-design-vector-db-spike.md):

- Expected scale: <1,000 items per workspace
- Brute-force cosine similarity over SQLite BLOBs: <1ms at this scale
- No additional dependencies needed
- **Graduation path**: SQLite BLOBs -> sqlite-vec extension -> usearch (if >100K vectors)

When vector search is eventually needed, it will be added as a BLOB column to the existing SQLite schema -- no architectural changes required.

---

## Schema Sketch

```sql
-- conversations: chat sessions with LLM providers
CREATE TABLE conversations (
    id          TEXT PRIMARY KEY,  -- UUID
    title       TEXT,
    provider_id TEXT REFERENCES provider_configs(id),
    created_at  TEXT NOT NULL,     -- ISO 8601
    updated_at  TEXT NOT NULL
);

-- messages: individual messages within conversations
CREATE TABLE messages (
    id              TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL,  -- 'user', 'assistant', 'system'
    content         TEXT NOT NULL,
    token_count     INTEGER,
    created_at      TEXT NOT NULL,
    -- embedding    BLOB           -- future: f32 vector for semantic search
);

-- artifacts: generated design outputs (HTML, SVG, code)
CREATE TABLE artifacts (
    id              TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    message_id      TEXT REFERENCES messages(id),
    type            TEXT NOT NULL,  -- 'html', 'svg', 'react', 'code'
    title           TEXT,
    content         TEXT NOT NULL,  -- raw artifact content
    metadata_json   TEXT,           -- parsed attributes, dimensions, etc.
    created_at      TEXT NOT NULL,
    -- embedding    BLOB           -- future: f32 vector for semantic search
);

-- provider_configs: BYOK LLM provider settings
CREATE TABLE provider_configs (
    id              TEXT PRIMARY KEY,
    preset          TEXT NOT NULL,  -- 'anthropic', 'openai', 'ollama', 'custom'
    wire_protocol   TEXT NOT NULL,  -- 'anthropic_wire', 'openai_chat_wire'
    auth_scheme     TEXT NOT NULL,  -- 'api_key', 'none'
    base_url        TEXT NOT NULL,
    model_id        TEXT NOT NULL,
    api_key_enc     BLOB,          -- encrypted API key (application-level encryption)
    extra_headers   TEXT,          -- JSON object
    is_active       INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);

-- design_systems: parsed DESIGN.md content and tokens
CREATE TABLE design_systems (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    source_path     TEXT,          -- path to DESIGN.md
    content_md      TEXT NOT NULL,  -- raw markdown
    tokens_json     TEXT,          -- parsed design tokens (colors, typography, spacing)
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);

-- migrations: schema version tracking
CREATE TABLE _migrations (
    version     INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    applied_at  TEXT NOT NULL
);
```

### Notes

- **UUIDs as TEXT**: SQLite has no native UUID type; TEXT with CHECK constraints is standard practice.
- **Timestamps as TEXT (ISO 8601)**: Allows SQLite date/time functions while remaining human-readable.
- **API key encryption**: Application-level encryption (e.g., `ring` or `aes-gcm` crate) before storage. The encryption key derived from OS keychain (macOS Keychain, Windows Credential Manager via `keyring` crate).
- **WAL mode**: Enabled on connection for concurrent read access from Tauri's multi-threaded runtime.
- **Embedding columns**: Commented out; added via migration when vector search is implemented.

---

*Decision documented 2026-05-10. Aligns with assessment recommendation (Spec-Light path).*
