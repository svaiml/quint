# craftegy-design DB Selection: Embedded Database for Tauri AI Desktop App

**Date:** 2026-05-10
**Status:** Research Complete → Recommendation: rusqlite
**Issue:** docs-4nbl

---

## Executive Summary

- **rusqlite is the correct pick** — already proven in `aivm`, SQL query ergonomics match the access patterns, identical approach to Open Design and DesignOS. Confidence: **H**
- **rstmdb is NOT needed** — rusqlite's `update_hook` + Tauri `app.emit()` replicates rstmdb WATCH for a single-process Tauri app with zero server dependency. Confidence: **H**
- **sled is ruled out** — unmaintained (last release: 0.34, 2021), no SQL, awkward for relational message queries. Confidence: **H**
- **Every production AI desktop app** (Cursor, AnythingLLM, Zed, Open Design, Letta) converges on SQLite/rusqlite for chat history. Confidence: **H**
- **LanceDB embedded** is the right add-on if vector/semantic search on artifacts is needed later — do not add it now.

---

## Ecosystem DB Inventory

| DB | Where in ecosystem | Type | Status |
|---|---|---|---|
| rusqlite (SQLite) | `aivm` | Relational SQL, embedded, C bindings | Active, mature |
| sled | `invariantis` (proof ledger — append-only hash-chained block storage) | Key-value B-tree, ordered, multi-tree, ACID, `flush_async`, pure Rust | v0.34 stable; v1.0 rewrite in progress (not abandoned) |
| rstmdb | `infra-eco/rstmdb` | State machine DB, server-based | Active, internal |

**Why sled is correct in invariantis:** Invariantis is a distributed immutable ledger (private blockchain analogue). The access pattern is: append blocks (`id → encrypted_blob`), walk by sequential index (`u64 position → id`), read last block pointer from metadata. Three sled trees in one file cover this perfectly. Pure Rust with zero C dependencies satisfies invariantis's security model. Sled 0.34 is intentionally frozen for this stable API — for an append-only ledger with well-defined access patterns, "no new releases" ≈ "stable."

**Why sled is wrong for craftegy-design:** The message access pattern is `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at` — relational, filtered, ordered by a non-key column. A K/V B-tree has no query planner; this requires building custom iteration and filter logic that rusqlite gives for free.

---

## Candidate Comparison

| DB | Pros | Cons | Verdict |
|---|---|---|---|
| **rusqlite** | Already in ecosystem (aivm), SQL queries, mature, Open Design/DesignOS pattern, C bundled fine | C dependency (acceptable) | **Winner** |
| sled | Pure Rust, zero config, already in invariantis (proof ledger), ACID, ordered B-tree, multi-tree per file, `flush_async` durability | **Wrong access pattern** — no SQL, no `WHERE session_id = ? ORDER BY created_at`; designed for append-only hash-chained K/V, not relational message queries. v0.34 is intentionally stable (author paused for v1.0 rewrite, not abandoned). | Wrong tool for this use case |
| redb | Pure Rust, sled successor, actively maintained | Not yet in ecosystem, K/V only — same access pattern mismatch as sled | Skip for now |
| rstmdb | WATCH events, state machine semantics | Requires running server (breaks offline-first), C-lib dependency anyway, server crash = no persistence | Use rusqlite hooks instead |
| SurrealDB embedded | LIVE SELECT works in embedded file mode, multi-model | +16 MB installer, +70 MB RAM, no ecosystem precedent, overkill | Skip |
| LanceDB embedded | Best-in-class vector store, Rust SDK | Not needed yet | Add when semantic search required |

---

## Production Evidence

| App | Chat History DB | Vector DB | State Machine |
|---|---|---|---|
| **Cursor** | SQLite (`state.vscdb`, JSON blobs) | None | None — JSON field migration |
| **AnythingLLM** | SQLite (`anythingllm.db`) | LanceDB | None |
| **Zed** | LMDB (`threads-db.1.mdb`) | None | None |
| **Open Design** | SQLite (`.od/app.sqlite`) | None | None |
| **Letta/MemGPT** | SQLite (via SQLAlchemy) | Pluggable vector | None |
| **Claude Desktop** | Transient (in-memory sessions) | None | None |

**Pattern:** Every production AI desktop app uses SQLite for messages. None uses a dedicated state machine DB.

---

## rstmdb WATCH vs rusqlite update_hook

### The rstmdb case
- Subscribers notified on state transitions via WATCH protocol
- Requires a running rstmdb server process
- Network round-trips for state reads

### The rusqlite answer

rusqlite exposes `Connection::update_hook()` — fires in-process on every INSERT/UPDATE/DELETE:

```rust
conn.update_hook(Some(|action, _db, table, rowid| {
    if table == "artifact_states" || table == "sessions" {
        tx.send((table.to_string(), rowid)).ok();
    }
}));

// Async task bridges to Tauri events:
while let Some((table, rowid)) = rx.recv().await {
    app.emit("db-changed", json!({ "table": table, "rowid": rowid })).ok();
}
```

**Constraints (non-issues for Tauri):**
- Same connection only → use a single write connection (standard Tauri pattern) ✓
- Same process only → Tauri is a single process ✓
- Synchronous callback → dispatch to `tokio::sync::mpsc` channel, don't block ✓

**Verdict:** rusqlite update_hook + Tauri emit is functionally equivalent to rstmdb WATCH for craftegy-design. rstmdb adds a server dependency for no benefit.

---

## Recommended Schema

```sql
-- sessions
CREATE TABLE sessions (
    id       TEXT PRIMARY KEY,
    state    TEXT NOT NULL DEFAULT 'idle'   -- idle|active|locked
             CHECK (state IN ('idle', 'active', 'locked')),
    title    TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- messages
CREATE TABLE messages (
    id         TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content    TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE INDEX idx_messages_session ON messages(session_id, created_at);

-- artifacts
CREATE TABLE artifacts (
    id           TEXT PRIMARY KEY,
    message_id   TEXT REFERENCES messages(id) ON DELETE SET NULL,
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'generating', 'ready', 'error')),
    content_type TEXT,
    blob         BLOB,       -- for artifacts < 500KB
    file_path    TEXT,       -- for artifacts >= 500KB (store on disk, path here)
    error_msg    TEXT,       -- populated when status = 'error'
    created_at   INTEGER NOT NULL,
    updated_at   INTEGER NOT NULL
);

-- settings (key-value, replaces sled for app config)
CREATE TABLE settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- FTS (optional, adds semantic message search)
CREATE VIRTUAL TABLE messages_fts USING fts5(
    content,
    content='messages',
    content_rowid='rowid'
);
```

---

## What to Add Later

- **sqlite-vec** (successor to sqlite-vss): loadable SQLite extension for vector nearest-neighbor. Add when artifact semantic search is required. ~1 MB, no new dependency.
- **LanceDB embedded**: if a full RAG pipeline over artifacts becomes necessary (chunking, multi-vector, hybrid search). +5-10 MB.
- **redb / native_db**: revisit at native_db v1.0 if a typed-struct K/V store is needed alongside SQLite.

---

## Sources

- rusqlite hooks: https://docs.rs/rusqlite/latest/rusqlite/hooks/index.html
- AnythingLLM storage: https://docs.anythingllm.com/installation-desktop/storage
- Cursor chat architecture: https://dasarpai.com/dsblog/cursor-chat-architecture-data-flow-storage/
- SurrealDB embedded Tauri: https://huakun.tech/blogs/Tauri-+-SurrealDB
- SurrealDB LIVE SELECT: https://surrealdb.com/docs/surrealql/statements/live
- native_db v0.8.1: https://github.com/vincent-herlemont/native_db
- sqlite-vec: https://github.com/asg017/sqlite-vec
- Zed thread storage: https://github.com/zed-industries/zed/discussions/32335
- Letta storage: https://docs.letta.com/concepts/memgpt/
