# CodeGraph index.map: CTOP vs TOON vs TSV — Format Architecture

> **Context**: codegraph-rust `--emit-index-map` needs a serialization format for the grep-navigable semantic index
> **Question**: Should index.map be TSV, CTOP DSL, CTOP binary, or dual-format? What does CTOP add?
> **Last updated**: 2026-05-07
> **br task**: docs-39sr

---

## 1. Short Answer

**Use dual-format: `.codegraph/index.map` (TSV) + `.codegraph/index.ctop` (CTOP binary).**

The TSV file is the primary agent navigation surface — it satisfies the critical grep constraint with zero tooling overhead and no format knowledge required. The CTOP binary is the secondary artifact for programmatic loading, incremental updates, and compressed storage at scale.

Do NOT replace TSV with CTOP DSL table syntax as the primary format. The grep ergonomics of CTOP DSL are nearly identical to TSV but require one additional understanding: the schema header row must be skipped or the grep pattern must be specific enough not to match it. This is a minor tax, not a blocker, but TSV has strictly zero overhead and is universally understood.

TOON is not relevant for this use case. It is a JSON replacement for LLM prompts, not a file format for agent-navigable indexes. CTOP has strictly better characteristics in every dimension relevant here.

**Decision matrix:**

| Constraint | TSV | CTOP DSL | CTOP Binary |
|---|---|---|---|
| Agent grep nav | Best | OK | No |
| Token efficiency | Poor | Good | N/A (not in context) |
| Incremental update | Full rewrite | Full rewrite | Structured patch (see §7) |
| Rust integration cost | Trivial | Low (ctop crate) | Low (ctop crate) |
| Schema validation | None | Optional | Yes |
| Compression | No | No (pipe to ctop) | Yes, automatic |
| Human readable | Yes | Yes | No |

---

## 2. What CTOP Actually Is (from source)

Read from `/home/sash/ZomboCraftEco/infra-eco/ctop/`.

CTOP is a 3-layer unified protocol: DSL text ↔ AST ↔ Binary. All three layers share the same `Document` struct (`src/ast.rs`):

```rust
pub struct Document {
    pub version: u16,
    pub flags: u16,
    pub symbols: SymbolTable,      // bidirectional string ↔ u32 ID mapping
    pub node_types: Vec<SymbolId>, // node type names
    pub fields: Vec<SymbolId>,     // field names
    pub roots: Vec<Node>,          // top-level nodes (one per symbol row)
    pub refs: HashMap<RefId, Value>,
}
```

Every string (field names, node type names, symbol values) is interned into a `SymbolTable` once. Subsequent occurrences are ID references — this is how CTOP achieves deduplication. For a codegraph index where `file_path`, `kind`, and `language` strings repeat thousands of times, this is a meaningful binary savings.

The binary encoder (`src/encoder.rs`) applies three automatic optimizations when serializing lists:

1. **DELTA_INT** (`0x17`): triggered when a list has 3+ `Int` elements and `max_delta < max_value / 2`. Encodes as: first value (zigzag varint) + N-1 deltas (zigzag varint). For source line numbers sorted within a file this fires every time.

2. **PACKED_LIST** (`0x16`): homogeneous numeric lists — eliminates per-element opcode byte. Fallback when DELTA_INT doesn't trigger.

3. **DICT_REF** (`0x18`): inline strings seen more than once are replaced with a 1-2 byte dictionary reference. Applied during encoding, transparent on decode.

The DSL table syntax (from `src/dsl/printer.rs` and the spec) auto-detects when multiple roots share the same node type and field signature and emits them as a single table block:

```
symbol(concept_label file start end name kind)[
auth.token-validation auth/token_validator.py 45 81 validate_token function
auth.entry-point main.py 1 10 main function
]
```

The printer produces this automatically from a sequence of `symbol{...}` nodes — the encoding is not stored in the AST, it is a printing decision. Decoding a CTOP table re-expands to individual nodes.

**Key limitation for incremental updates**: CTOP binary has no patch/merge opcode. The `Document` is a complete, self-contained unit. Patching requires decode → modify → re-encode. However, the spec notes (§14.6) that the binary format "supports append-only semantics (new roots appended)" — this is a future design intent, not a current implementation. See §7.

---

## 3. What TOON Is (from toonformat.dev)

TOON (Token-Oriented Object Notation) is a text-only format — there is no binary layer, no schema validation, no typed nodes, no references. It is a drop-in JSON replacement optimized for LLM prompt context.

**TOON syntax for tabular data** (extracted from the ctop compare_formats example, which contains the canonical side-by-side):

```
hikes[3]{id,name,km,gain,sunny}:
  1,Blue Lake Trail,7.5,320,true
  2,Ridge Overlook,9.2,540,false
  3,Wildflower Loop,5.1,180,true
```

Key syntax elements:
- `name[N]{fields}:` — table header with explicit row count N
- Comma-separated values per row
- 2-space indentation per row
- No typed nodes — arrays of objects are the only tabular primitive

**TOON vs CTOP DSL for a symbol table row** (CTOP from compare_formats.rs):

```
TOON (132 chars):
hikes[3]{id,name,km,gain,sunny}:
  1,Blue Lake Trail,7.5,320,true
  2,Ridge Overlook,9.2,540,false
  3,Wildflower Loop,5.1,180,true

CTOP (129 chars):
hike(id name km gain sunny)[
1 "Blue Lake Trail" 7.5 320 true
2 "Ridge Overlook" 9.2 540 false
3 "Wildflower Loop" 5.1 180 true
]
```

The 3-char difference on 3 rows grows as rows increase (no count in CTOP header, no commas, no 2-space indent per row = ~3 chars per row savings on typical data).

**What TOON does that CTOP does not:**
- Nothing relevant for this use case. TOON is a subset — it only covers what JSON covers, as text.

**What CTOP does that TOON does not:**
- Binary format with compression (LZ4/ZSTD)
- Symbol table deduplication (DICT_REF)
- Delta encoding (DELTA_INT)
- Typed nodes (`symbol{...}` vs anonymous objects)
- References (`$1`, `$2`) for cross-referencing
- Enum types (`#ok(200)`)
- Canonicalization (deterministic field ordering)
- Schema validation (structural integrity checks)
- Rust library API with `Document` builder

**Verdict**: TOON is irrelevant for codegraph-rust. It has no binary format, no compression, no validation, and is text-only. CTOP is strictly better on every axis that matters here.

---

## 4. The Critical Constraint: grep Navigability

The agent navigation pattern MUST support:
```bash
grep "auth.token-validation" .codegraph/index.map
```
and return file path + start_line + end_line in one result.

### Option A: Flat TSV

File content:
```
auth.token-validation	auth/token_validator.py	45	81	validate_token	function
auth.entry-point	auth/token_validator.py	45	81	validate_token	function
```

Grep test:
```bash
grep "auth.token-validation" .codegraph/index.map
# → auth.token-validation	auth/token_validator.py	45	81	validate_token	function
```

Result: **passes**. File path, start, end are fields 2-4 of the tab-separated result. Agent reads with `awk -F'\t' '{print $2, $3, $4}'` or by splitting on tab.

### Option B: CTOP DSL table format

File content:
```
symbol(concept_label file start end name kind)[
auth.token-validation auth/token_validator.py 45 81 validate_token function
auth.entry-point auth/token_validator.py 45 81 validate_token function
]
```

Grep test:
```bash
grep "auth.token-validation" .codegraph/index.ctop.dsl
# → auth.token-validation auth/token_validator.py 45 81 validate_token function
```

Result: **passes**. The data rows are plain space-separated text. The schema header `symbol(concept_label file start end name kind)[` does not contain concept labels so will never false-match. Agent reads columns by splitting on space. Column positions: 1=concept, 2=file, 3=start, 4=end, 5=name, 6=kind.

**Caveat**: file paths with spaces would require quoting in CTOP DSL (`"path with spaces/file.py"`), making awk splitting slightly harder. TSV has the same problem — spaces in paths break both formats equally.

### Option C: CTOP DSL full structured

File content:
```
symbol{concept:auth.token-validation file:"auth/token_validator.py" start:45 end:81 name:validate_token kind:function}
```

Grep test:
```bash
grep "auth.token-validation" .codegraph/index.ctop.dsl
# → symbol{concept:auth.token-validation file:"auth/token_validator.py" start:45 end:81 name:validate_token kind:function}
```

Result: **passes**, but extraction requires more parsing — the agent must parse `file:"..."`, `start:N`, `end:N` from key:value syntax. Not as agent-friendly as columnar formats.

### Option D: CTOP binary

Not greppable — binary opcode stream. Not suitable as the primary navigation file.

**Conclusion**: All text formats pass the grep constraint. TSV is the simplest for column extraction. CTOP DSL table is equally greppable with a known column schema. CTOP binary fails entirely.

---

## 5. Format Comparison Table

| Dimension | TSV | TOON tabular | CTOP DSL table | CTOP binary |
|---|---|---|---|---|
| grep nav (concept → file:line) | Best (direct column) | N/A for this | Good (direct column) | No |
| Schema in file | No | Yes (header) | Yes (header) | Yes (symbol table) |
| Token count (100 rows) | High (repeated strings) | Medium | Medium | N/A (binary) |
| File path deduplication | No | No | No (DSL) / Yes (binary) | Yes (DICT_REF) |
| Integer compression | No | No | No | Yes (DELTA_INT) |
| Incremental update | Full rewrite | Full rewrite | Full rewrite | Decode+modify+encode |
| Rust codegen complexity | Trivial (write_fmt) | N/A | Low (ctop::print_dsl) | Low (ctop::encode_binary) |
| External tool required | None | None | ctop CLI (optional) | ctop CLI or crate |
| Human readable | Yes | Yes | Yes | No |
| Schema validation | None | None | Optional (ctop validate) | Yes |
| Compression | No | No | No | LZ4/ZSTD |
| Canonicalization (stable diffs) | Sort by file+line | N/A | ctop canonicalize | ctop canonicalize |
| Suited for LLM context injection | Poor (high tokens) | Good | Good | No |

---

## 6. DELTA_INT Savings Calculation

**Scenario**: 10,000 symbol index with average delta of 15 between consecutive start_lines within a file.

### Without DELTA_INT (raw INT opcode per value)

Each value stored as: `INT opcode (1 byte)` + `zigzag_varint(value)`.

Line numbers in source files typically range 1–5000. A line number of 3000 encodes as:
- zigzag(3000) = 6000 (positive, so zigzag doubles it)
- LEB128(6000): 6000 = 0x1770 → needs 2 bytes (6000 > 127, 6000 < 16384)

So each raw line number = 1 (opcode) + 2 (varint) = **3 bytes** on average.

For a list of N start_lines: needs `LIST_START (1)` + `count varint (1-2)` + `N * 3 bytes`.

For 10,000 symbols (assuming ~100 files, ~100 symbols/file → 100 lists of 100):
- 100 lists × (1 + 1 + 100 × 3) = 100 × 302 = **30,200 bytes for start_line**
- Same for end_line: **30,200 bytes**
- **Total: ~60 KB for line numbers**

### With DELTA_INT

DELTA_INT fires when: list has 3+ Int elements AND max_delta < max_value / 2.
- max_delta = 15 (given), max_value ≈ 3000 (mid-file line number)
- 15 < 1500 → **fires every time**

Encoding: `DELTA_INT opcode (1)` + `count varint (1)` + `first_value zigzag_varint` + `(N-1) delta zigzag_varints`.

- First value: zigzag(3000÷2 avg start) = LEB128 ≈ 2 bytes
- Each delta: zigzag(15) = 30, LEB128(30) = **1 byte**
- Per list of 100: 1 + 1 + 2 + 99×1 = **103 bytes**

For 100 lists of 100 symbols:
- 100 × 103 = **10,300 bytes for start_line**
- Same for end_line: **10,300 bytes**
- **Total: ~20 KB for line numbers**

### Summary

| Encoding | start_line + end_line | Savings |
|---|---|---|
| Raw INT per value | ~60 KB | baseline |
| DELTA_INT | ~20 KB | **67% reduction** |

For a 1M-symbol index (scaled linearly): raw = ~6 MB, DELTA_INT = ~2 MB, saving ~4 MB on line numbers alone. Combined with DICT_REF on repeated file paths and kind strings (function/struct/etc. repeat thousands of times), the full binary index for 1M symbols would be roughly **3-5x smaller** than a naive binary encoding, and **10-20x smaller** than TSV (which stores every string in full every time).

For comparison, 1M-row TSV at ~80 bytes/row = ~80 MB. CTOP binary with all optimizations: roughly **8-15 MB** (before LZ4/ZSTD which would further halve it).

---

## 7. Incremental Update Architecture

### TSV: Full Rewrite Required

A TSV is a flat file. Patching entries for a single changed file requires:
1. Read all lines
2. Filter out lines for changed_file
3. Re-parse changed_file, emit new lines
4. Write all lines back

For a 1M-row TSV this is a full 80 MB read + write on every build. On 5% daily change (50,000 symbols), this is unavoidable.

### CTOP Binary: Decode → Modify → Encode

CTOP binary has no patch opcode (confirmed from spec and encoder source). The `DELTA_INT` and `DICT_REF` optimizations are applied over the whole document during encode, so they cannot be applied incrementally to a partial stream.

Patching a CTOP binary requires:
1. `decode_binary(data)` → `Document`
2. `doc.roots.retain(|node| node.file != changed_file)` (filter out stale nodes)
3. Append new nodes from re-parsed changed_file
4. `encode_binary(&doc)` → new binary

For 1M symbols at ~10 MB binary: decode takes ~280 µs/1000 nodes × 1000 = ~280 ms. Encode at ~60 µs/1000 = ~60 ms. Total: ~340 ms per incremental update.

This is **faster than TSV** (which requires 80 MB I/O) and produces a smaller file. The `Document` decode/encode is in-memory; disk write is 10 MB vs 80 MB.

However, the spec notes "append-only semantics" as a design goal. A future CTOP version could support appending new root sections without full re-encode. This is not implemented today.

### Practical Incremental Design

Recommended architecture for codegraph-rust incremental builds:

```
Changed file detected (fsnotify / --watch)
  → re-parse changed files via tree-sitter
  → load .codegraph/index.ctop (decode ~340ms for 1M symbols)
  → remove stale entries for changed files
  → append new entries
  → encode and write .codegraph/index.ctop
  → separately: regenerate .codegraph/index.map (TSV) in same pass
```

For the TSV: since codegraph-rust already has the full in-memory list of nodes after the decode+update step, re-emitting the TSV is a single sequential write. Do not read the old TSV — regenerate it entirely from the in-memory document. Cost: ~80 MB write for 1M symbols, dominated by the 10 MB CTOP decode.

**Alternative for large codebases**: maintain a per-file CTOP shard system (one `index-<hash>.ctop` per file), with a manifest. Changed files invalidate their shard. This allows O(changed_files) updates but adds complexity. Not recommended until benchmarks show the single-document approach is too slow.

---

## 8. Dual-Format Recommendation

**Emit both on every `codegraph index` and `--emit-index-map` run:**

### `.codegraph/index.map` — TSV (primary)

```
# concept_label	file	start	end	symbol	kind
auth.token-validation	auth/token_validator.py	45	81	validate_token	function
auth.entry-point	main.py	1	10	main	function
```

- The comment header line (starting `#`) is skipped by grep when searching for concept labels (concept labels don't start with `#`)
- Fields: concept_label, file, start, end, symbol, kind — exactly 6 columns, tab-separated
- One row per symbol
- Agent usage: `grep "auth.token-validation" .codegraph/index.map`
- Human usage: open in any editor or spreadsheet

### `.codegraph/index.ctop` — CTOP binary (secondary)

- CTOP binary with LZ4 compression
- DICT_REF deduplicates file paths and kind strings
- DELTA_INT compresses start/end line sequences within each file
- Used by: programmatic loading, diff tools, incremental update pipeline
- Not human-readable, not greppable
- Agent usage: none direct — agents use index.map
- Tooling usage: `ctop decode -i .codegraph/index.ctop | grep "auth.token-validation"` (slower, for verification)

### When each is used

| Use case | index.map (TSV) | index.ctop (CTOP binary) |
|---|---|---|
| Agent `grep` navigation | Primary | No |
| Programmatic loading (full index) | Slow (parse 80 MB) | Fast (decode 10 MB) |
| Diff between builds | Hard (text diff) | Easy (canonicalized) |
| LLM context injection (summary) | Too token-heavy | Not applicable |
| Incremental update source | Regenerate from memory | Load → modify → save |
| CI artifact storage | ~80 MB uncompressed | ~3-5 MB compressed |

### Is dual-format overhead justified?

Yes, because the two files serve orthogonal use cases. TSV costs nothing to write — it is `writeln!` in a loop. CTOP binary requires the ctop crate dependency but the encode path is ~60 µs/1000 nodes. For 100,000 symbols, emitting both takes:
- TSV: ~50 ms (I/O bound)
- CTOP binary: ~6 ms encode + ~1 ms disk write (10x smaller)
- Total overhead vs TSV-only: ~7 ms

This is negligible in a build that just ran tree-sitter on a codebase.

The ongoing storage cost is ~10x higher for TSV than CTOP binary. On a 1M-symbol codebase:
- index.map: ~80 MB
- index.ctop (LZ4): ~2-4 MB

For CI artifact retention and developer disk, this matters.

---

## 9. Rust Integration Path

codegraph-rust Cargo.toml currently has NO dependency on ctop. It uses `serde_json`, `bincode`, `zstd`, `lz4_flex` already (all in workspace.dependencies).

### Step 1: Add ctop as a workspace dependency

In `/home/sash/ZomboCraftEco/tools/ai-tools/codegraph-rust/Cargo.toml`:

```toml
[workspace.dependencies]
ctop = { path = "/home/sash/ZomboCraftEco/infra-eco/ctop" }
```

Or as a published crate if ctop is published:
```toml
ctop = { version = "0.1", features = [] }
```

Add to the crate that will emit the index (likely `codegraph-core` or `codegraph-mcp-server`):
```toml
[dependencies]
ctop = { workspace = true }
```

### Step 2: Implement TSV emitter (trivial)

In `codegraph-core/src/`, add `index_map.rs`:

```rust
use crate::{CodeNode, NodeType};
use std::io::Write;

pub fn emit_tsv<W: Write>(nodes: &[CodeNode], writer: &mut W) -> std::io::Result<()> {
    writeln!(writer, "# concept_label\tfile\tstart\tend\tsymbol\tkind")?;
    for node in nodes {
        let kind = node.node_type.as_ref().map(|t| format!("{:?}", t).to_lowercase())
            .unwrap_or_default();
        let end = node.location.end_line.unwrap_or(node.location.line);
        writeln!(
            writer,
            "{}\t{}\t{}\t{}\t{}\t{}",
            node.name,          // concept_label (or separate field if Approach C)
            node.location.file_path,
            node.location.line,
            end,
            node.name,
            kind,
        )?;
    }
    Ok(())
}
```

### Step 3: Implement CTOP binary emitter

```rust
use ctop::{Document, Node, FieldEntry, Value, encode_binary};

pub fn emit_ctop_binary(nodes: &[CodeNode]) -> ctop::Result<Vec<u8>> {
    let mut doc = Document::new();
    let sym_type = doc.register_node_type("symbol");
    let f_concept = doc.register_field("concept");
    let f_file    = doc.register_field("file");
    let f_start   = doc.register_field("start");
    let f_end     = doc.register_field("end");
    let f_name    = doc.register_field("name");
    let f_kind    = doc.register_field("kind");

    for node in nodes {
        let end = node.location.end_line.unwrap_or(node.location.line);
        let file_sym = doc.symbols.intern(&node.location.file_path);
        let name_sym = doc.symbols.intern(&node.name);
        let kind_str = node.node_type.as_ref()
            .map(|t| format!("{:?}", t).to_lowercase())
            .unwrap_or_default();
        let kind_sym = doc.symbols.intern(&kind_str);

        doc.roots.push(Node {
            node_type: sym_type,
            fields: vec![
                FieldEntry { field_id: f_concept, value: Value::String(name_sym) },
                FieldEntry { field_id: f_file,    value: Value::String(file_sym) },
                FieldEntry { field_id: f_start,   value: Value::Int(node.location.line as i64) },
                FieldEntry { field_id: f_end,     value: Value::Int(end as i64) },
                FieldEntry { field_id: f_name,    value: Value::String(name_sym) },
                FieldEntry { field_id: f_kind,    value: Value::Symbol(kind_sym) },
            ],
        });
    }
    encode_binary(&doc)
}
```

**Note**: DELTA_INT fires automatically for the `start` and `end` Int fields if they are emitted in sorted order (file → line). Sort `nodes` by `(file_path, line)` before encoding to maximize delta compression.

### Step 4: Add CLI flag

In the codegraph index CLI (likely `codegraph-mcp-server/src/main.rs` or the CLI entry point):

```rust
#[arg(long)]
emit_index_map: bool,
```

After indexing, if `emit_index_map`:
```rust
let map_path = project_dir.join(".codegraph/index.map");
let ctop_path = project_dir.join(".codegraph/index.ctop");
let mut sorted_nodes = all_nodes.clone();
sorted_nodes.sort_by(|a, b| {
    a.location.file_path.cmp(&b.location.file_path)
        .then(a.location.line.cmp(&b.location.line))
});
emit_tsv(&sorted_nodes, &mut BufWriter::new(File::create(&map_path)?))?;
let binary = emit_ctop_binary(&sorted_nodes)?;
std::fs::write(&ctop_path, binary)?;
```

### Step 5: Concept label field (Approach C)

The current `CodeNode.name` is the symbol name (`validate_token`), not the concept label (`auth.token-validation`). Approach C requires a separate concept_label field. Options:
1. Add `concept_label: Option<String>` to `CodeNode` — populated from a hand-maintained `labels.toml` in the project
2. Default concept_label to `module_path.symbol_name` derived from file path — auto-derived without human input
3. Separate index overlay: `index.map` shows auto-derived labels; user overrides written to `labels.toml` which the emitter merges

Option 2 (auto-derived) is the path of least resistance for the initial implementation. A function that converts `auth/token_validator.py:validate_token` → `auth.token-validation` can be heuristic (strip extension, replace `/` and `_` with `.`, lowercase).

---

## 10. Follow-up Tasks

1. **docs-rk1t** (existing): Implement `--emit-index-map` in codegraph-rust — now has this design doc as spec
2. **Add ctop path dependency to codegraph-rust workspace** — blocked on ctop being published or path-accessible
3. **Concept label auto-derivation** — heuristic function `file_path + symbol_name → concept_label`
4. **labels.toml overlay** — hand-maintained concept labels that override auto-derived ones
5. **Incremental update path** — load .ctop, patch in-memory, re-emit both formats
6. **CTOP per-file shard design** — evaluate if 1M+ symbol codebases need sharded CTOP files

---

## 11. Sources

- **CTOP source**: `/home/sash/ZomboCraftEco/infra-eco/ctop/` — read `README.md`, `docs/specification.md`, `src/ast.rs`, `src/encoder.rs`, `src/varint.rs`, `src/lib.rs`, `examples/compare_formats.rs`
- **CTOP spec**: `/home/sash/ZomboCraftEco/infra-eco/ctop/docs/specification.md` — §4.8 DELTA_INT, §4.6 DICT_REF, §5.4 table syntax
- **codegraph-rust source**: `/home/sash/ZomboCraftEco/tools/ai-tools/codegraph-rust/` — `Cargo.toml` (no ctop dep confirmed), `crates/codegraph-core/src/node.rs` (CodeNode struct), `crates/codegraph-core/src/types.rs` (Location struct)
- **Prior research**: `/home/sash/docs/docs/research/codegraph-vs-grace-tags-index-map.md` — Approach C design, security rationale for external index.map
- **TOON**: `https://toonformat.dev/` — text-only format, JSON replacement for LLM prompts; limited spec available via web; canonical comparison from ctop `examples/compare_formats.rs`
- **CTOP vs TOON comparison table**: from `ctop/docs/specification.md` §15 and `examples/compare_formats.rs` (authoritative side-by-side with char counts)
