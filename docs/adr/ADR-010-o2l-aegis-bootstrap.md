# ADR-010: O2L Aegis Bootstrap — Compiled Language + Self-Hosting Path

**Status:** Draft  
**Date:** 2026-04-26  
**Repo reference:** zombocoder/o2l (upstream)

---

## Problem

O2L is a tree-walking interpreter. Four gaps block production use:

1. Speed — tree-walking is 10-50× slower than bytecode VMs for tight loops
2. Self-hosting — no bytecode, no sealed sum types, no bitwise ops, no binary I/O
3. Safety — no formal verification of compiled artifacts
4. Agent trust — no proof-carrying binary format

---

## Rejected Approach: CompilerLibrary (C++ AST Bridge)

A prior proposal exposed C++ AST nodes to O2L via a `NativeLibrary` that converted
`ASTNode*` trees into O2L sealed objects one time at `compiler.parse()` call time.

**Why rejected:**
- Permanent coupling: every new upstream AST node type requires a matching conversion entry
- Two trees in memory during compilation
- Solving the wrong problem — self-hosting does not require exposing C++ internals
- Precedent (GHC, rustc, fpc) never exposes the host compiler's AST; they write a new
  parser in the target language

---

## Chosen Architecture: Pure O2L Compiler

```
OLD: CompilerLibrary (coupled)
═══════════════════════════════════════

  C++ AST
     │ convertNode() — must update when upstream adds nodes
     ▼
  O2L sealed objects (materialized copy of C++ tree)
     │
     ▼
  ByteBuffer → .o2bc


NEW: Pure O2L Compiler (decoupled)
═══════════════════════════════════════

  Phases 1-4: Language primitives only
  ┌──────────┬──────────┬──────────┬──────────┐
  │ bitwise  │ByteBuffer│Text.id() │sealed+   │
  │ &|^~<<>> │ (binary) │ intern   │ match    │
  └──────────┴──────────┴──────────┴──────────┘
                       │
                       ▼
  Phase 5: Write o2lc.o2l — compiler in O2L
  ┌──────────────────────────────────────────────┐
  │  Lexer.o2l    →  List<Token>                 │
  │  Parser.o2l   →  sealed Expr { ... }         │
  │  TypeEnv.o2l  →  Map<Text, O2LType>          │
  │  Emit.o2l     →  binary.buffer() → .o2bc     │
  │  Pctl.o2l     →  text file → pctl-rs         │
  └──────────────────────────────────────────────┘
                       │
              C++ interpreter (just runs it)
                       ▼
  Phase 6: Bootstrap
  ┌──────────────────────────────────────────────┐
  │  o2l run o2lc.o2l <o2lc.o2l> → o2lc.o2bc    │
  │  o2lc.o2bc   <o2lc.o2l>      → o2lc-v2.o2bc │
  │  diff(o2lc.o2bc, o2lc-v2.o2bc) == 0  ✓       │
  └──────────────────────────────────────────────┘
                       │
  Phase 7: Verification (see open question below)
  ┌──────────────────────────────────────────────┐
  │  Emit.o2l also writes verification side-file │
  │  verifier checks properties → cert.bin       │
  │  binary.buffer().attach(cert) → .o2bc+cert   │
  └──────────────────────────────────────────────┘
```

---

## Phases

### Phase 1 — Bitwise Operators

**Gap:** `enum class BinaryOperator` in `src/AST/BinaryOpNode.hpp:25` is
`{PLUS, MINUS, MULTIPLY, DIVIDE, MODULO}` only. `src/Lexer.hpp` `TokenType` has no
tokens for `&`, `|`, `^`, `~`, `<<`, `>>`.

**Files:** `src/Lexer.hpp`, `src/Lexer.cpp`, `src/AST/BinaryOpNode.hpp`,
`src/AST/UnaryNode.hpp`, `src/Parser.cpp`, `src/Runtime/Interpreter.cpp`

Tokens added: `BITWISE_AND`, `BITWISE_OR`, `BITWISE_XOR`, `BITWISE_NOT`, `LSHIFT`, `RSHIFT`

Note: existing `<` / `>` character dispatch must be refactored to handle `<<`/`>>`
before falling through to `<=`/`>=`.

Precedence (C-standard, low→high): `|` → `^` → `&` → shift → additive

Evaluation for `Int` and `Long` (`__int128`) — six cases in Interpreter.cpp.

---

### Phase 2 — ByteBuffer (binary I/O)

**Gap:** no binary write library. Bytecode emission requires raw little-endian byte writes.

**New files:** `src/Runtime/BinaryLibrary.hpp` / `.cpp`  
Pattern follows `JsonLibrary` (stateless, registered as `"binary"` namespace).

O2L API:
```
binary.buffer()             -> BinaryBuffer
buf.writeU8(n)   -> buf     (fluent)
buf.writeU16LE(n) -> buf
buf.writeU32LE(n) -> buf
buf.writeU64LE(n) -> buf
buf.writeBytes(list) -> buf
buf.size()       -> Int
buf.toFile(path) -> Result<Unit, Text>
buf.fromFile(path) -> Result<BinaryBuffer, Text>
buf.readU8(offset) -> Result<Int, Text>
buf.readU32LE(offset) -> Result<Int, Text>
buf.slice(s, e)  -> BinaryBuffer
buf.toHex()      -> Text
```

Backed by `std::vector<uint8_t>`. Little-endian encoding is explicit byte writes (no memcpy).

---

### Phase 3 — Text.intern()

**Gap:** symbol table lookups use `std::map<std::string, Value>` string equality.
A compiler touches thousands of names — O(1) integer ID comparison eliminates the hot path.

**Changes:** add to `src/Runtime/Context.hpp`:
```cpp
std::unordered_map<std::string, int32_t> intern_map_;
std::vector<std::string> intern_table_;
int32_t intern(const std::string& s);
const std::string& internResolve(int32_t id) const;
```

O2L API (two methods on existing Text type):
```
"foo".id()        -> Int    // stable id within Context lifetime
Text.fromId(n)    -> Text
```

---

### Phase 4 — sealed + match

**Gap:** O2L has record (product) and object (OO) but no sum type. A compiler written in
O2L needs sum types for AST nodes, opcodes, type lattice nodes.

Syntax:
```o2l
sealed object Expr {
    record Lit { value: Int }
    record Add { left: Expr, right: Expr }
    record Var { name: Text }
}

val result = match expr {
    Lit(v)     => v
    Add(l, r)  => eval(l) + eval(r)
    Var(name)  => env.get(name)
}
```

**New files:** `src/AST/MatchNode.hpp`  
**Changed:** `src/AST/ObjectNode.hpp` (add `sealed_` flag), `src/Lexer.hpp/cpp`
(add `SEALED`, `MATCH` keywords), `src/Parser.cpp`, `src/Runtime/Interpreter.cpp`

Discrimination: reads `RecordInstance::getTypeName()` (already present in `RecordType`).
Exhaustiveness checked at parse time (compile error, not runtime panic).

---

### Phase 5 — o2lc.o2l (compiler written in O2L)

Once phases 1-4 are complete, the O2L compiler is written entirely in O2L.
No C++ bridge needed. The C++ interpreter simply executes `o2lc.o2l`.

Modules:
- `Lexer.o2l` — produces `List<Token>` using `sealed object Token`
- `Parser.o2l` — produces `sealed Expr` tree from token stream
- `TypeEnv.o2l` — `Map<Text, O2LType>` using `Text.id()` for fast symbol lookup
- `Emit.o2l` — walks typed tree, writes `binary.buffer()` → `.o2bc`
- `Verify.o2l` — walks typed tree, writes side-file for verifier (see open question)

---

### Phase 6 — Bootstrap

```
o2l run o2lc.o2l  <o2lc.o2l>  →  o2lc.o2bc       (C++ interpreter compiles it)
o2lc.o2bc         <o2lc.o2l>  →  o2lc-v2.o2bc    (self-compiled)
diff(o2lc.o2bc, o2lc-v2.o2bc) == 0                (idempotent bootstrap test)
```

---

### Phase 7 — Proof-Carrying Binaries (dual-verifier)

**Lineage:** Necula's Proof-Carrying Code (1997) embedded a single safety proof in the
binary. JVM split behavioral verification (Bytecode Verifier) from trust verification
(Security Manager) but never unified them in one artifact. `.o2bc` unifies both.

**Two orthogonal verification domains:**

| | pctl-rs certificate | Infer certificate |
|--|----|----|
| Question | What will this code **do**? | What can this code **claim**? |
| Domain | Program as MDP/DTMC | Bilattice belief propagation |
| Verifies | Stack bounds, termination, resource limits | Trust non-escalation, LADE class, FGR provenance |
| Classical precedent | JVM Bytecode Verifier, PCC, Wasm validator | (novel — no classical compiler has this) |

---

## `.o2bc` File Format

All integers little-endian. Strings UTF-8 prefixed with `u32` length.
Sections use TLV (Type-Length-Value) for forward compatibility.

```
Offset  Size  Field
──────────────────────────────────────────────────────────
0       4     magic         "O2BC"
4       1     version       currently 1
5       1     flags         bit 0 = has_pctl_cert
                            bit 1 = has_infer_cert
6       1     section_count number of sections that follow
7       ...   sections[]    each section:
                              [type:u8][len:u32][data:len bytes]

Section types:
  0x01  code          raw bytecode (opcodes + operands)
  0x02  strings       intern table: [count:u32][entry: u32+utf8...]
  0x03  pctl_cert     behavioral certificate (see below)
  0x04  infer_cert    epistemic certificate (see below)
  0x05  debug         source map, line numbers (optional)
```

**Code hash:** SHA-256 of the `0x01 code` section bytes.
Both certificates commit to this hash — a tampered binary invalidates both certs.

---

## pctl-rs Certificate Format (section type 0x03)

Answers: *"is this code behaviorally safe to execute?"*

```
Offset  Size  Field
──────────────────────────────────────────────────────────
0       4     magic         "PCTL"
4       1     version       currently 1
5       32    code_hash     SHA-256 of code section
37      2     prop_count    number of verified properties
39      ...   properties[]  each property:
                              [formula: u16+utf8]
                              [result:  u8]   0=satisfied
                                              1=violated
                                              2=unknown
                              [prob:    f64]  computed probability
                              [bound:   f64]  declared bound from formula
64      8     timestamp     unix epoch seconds (u64)
72      1     ver_len
73      ver_len  prover_ver  e.g. "pctl-rs 0.3.1"
...     2     sig_len
...     sig_len  signature  Ed25519 over (code_hash || all property bytes)
```

**Standard properties emitted by `Verify.o2l`:**

```
P=1    [ G (stack_depth <= MAX_STACK)    ]   -- stack never overflows
P=1    [ G (alloc_bytes <= MAX_HEAP)     ]   -- heap bounded
P>=0.999 [ F "halt" ]                        -- terminates w/ high prob
P=1    [ G !(result == PANIC) ]              -- no unchecked panic paths
```

`MAX_STACK` and `MAX_HEAP` are declared per-function in the O2L source via annotations:

```o2l
@stack(256) @heap(65536)
method compile(src: Text) -> Result<BinaryBuffer, CompileError> {
    ...
}
```

If no annotation: defaults are 512 frames / 1 MiB.

---

## Infer Certificate Format (section type 0x04)

Answers: *"what epistemic claims can this code produce, and are they warranted?"*

```
Offset  Size  Field
──────────────────────────────────────────────────────────
0       4     magic         "INFE"
4       1     version       currently 1
5       32    code_hash     SHA-256 of code section (must match pctl cert)
37      2     fn_count      number of function entries
39      ...   functions[]   one entry per exported function:

  Function entry:
    [name_id:  u32]     index into strings section (intern table)
    [in_t_min: f32]     minimum required t-coord of inputs
    [in_f_max: f32]     maximum allowed f-coord of inputs
    [out_t_max: f32]    maximum claimable t-coord of output
    [out_f_min: f32]    minimum claimable f-coord of output
    [lade:     u8]      0=unknown 1=evidence 2=admissible 3=deontic 4=law
    [fgr_f:    f32]     FGR Formality   (0.0–1.0)
    [fgr_g:    f32]     FGR Generality  (0.0–1.0)
    [fgr_r:    f32]     FGR Reliability (0.0–1.0)

...     8     timestamp     unix epoch (u64)
...     1     ver_len
...     ver_len  ver_str   e.g. "infer 0.1.0"
...     2     sig_len
...     sig_len  signature Ed25519 over (code_hash || all fn entry bytes)
```

**Trust non-escalation invariant** (the key property Infer verifies):

For every function entry:
```
out_t_max  <=  in_t_min * fgr_r       (output truth bounded by input truth × reliability)
out_f_min  >=  in_f_max * (1 - fgr_r) (output falsity floor rises with unreliability)
```

This is the bilattice knowledge-order constraint applied to function signatures.
A function that takes EVIDENCE-class input `(0.5, 0.5)` and claims LAW-class output
`(1.0, 0.0)` will fail Infer cert generation — the claim is not warranted.

**Example: a type-checker function**

```
name:       "typecheck"
in_t_min:   0.9    (requires high-confidence source input)
in_f_max:   0.1
out_t_max:  1.0    (deterministic algorithm → LAW class allowed)
out_f_min:  0.0
lade:       4      LAW
fgr_f:      1.0    (formal — algorithmic)
fgr_g:      0.7    (general within O2L type system)
fgr_r:      1.0    (deterministic → reliability = 1.0)
```

**Example: a statistical guard function**

```
name:       "trust_score"
in_t_min:   0.5    (accepts Evidence-class inputs)
in_f_max:   0.5
out_t_max:  0.8    (ADMISSIBLE at best — it's a heuristic)
out_f_min:  0.1
lade:       2      ADMISSIBLE
fgr_f:      0.7
fgr_g:      0.5
fgr_r:      0.8
```

---

## Certificate Pipeline (how `Verify.o2l` drives both)

```
o2lc.o2l compilation pass order:
                                                     
  1. parse + typecheck  →  TypedExpr tree            
                                                     
  2. Emit.o2l           →  code section (0x01)       
                           strings section (0x02)    
                                                     
  3. Verify.o2l reads TypedExpr tree:                
     a) walks call graph, measures max stack depth    
        per function → writes  verify.pctl  (text)   
     b) reads @lade / @fgr annotations on functions  
        + propagates bilattice bounds through calls   
        → writes  verify.infer (binary struct)        
                                                     
  4. system.process.spawn("pctl-rs", "verify.pctl")  
        → reads stdout → pctl_cert bytes              
                                                     
  5. infer.certify("verify.infer")                   
        → returns infer_cert bytes                   
                                                     
  6. binary.buffer()                                 
        .writeSection(0x01, code)                    
        .writeSection(0x02, strings)                 
        .writeSection(0x03, pctl_cert)               
        .writeSection(0x04, infer_cert)              
        .toFile("output.o2bc")                       
```

---

## Agent Verification (consumer side)

An agent receiving `some_function.o2bc` before calling it:

```o2l
val bc   = binary.buffer().fromFile("some_function.o2bc").unwrap()
val pctl = aegis.verifyBehavioral(bc)   // checks pctl cert sig + properties
val inf  = aegis.verifyEpistemic(bc)    // checks infer cert sig + lade bounds

match pctl {
    Ok(cert)  => assert(cert.allSatisfied())
    Err(msg)  => throw "behavioral verification failed: " + msg
}

match inf {
    Ok(cert)  => {
        // know the max epistemic weight before calling
        val maxClaim = cert.function("typecheck").out_t_max
        val result   = runtime.call(bc, "typecheck", src)
        // use result with known epistemic ceiling
    }
    Err(msg)  => throw "epistemic verification failed: " + msg
}
```

---

## Gap Summary

| Phase | Gap closed | Files |
|-------|-----------|-------|
| 1 | Bitwise operators | Lexer, BinaryOpNode, Parser, Interpreter |
| 2 | Binary I/O | BinaryLibrary (new) |
| 3 | Symbol interning | Context.hpp, TextLibrary |
| 4 | Sum types | MatchNode (new), ObjectNode, Lexer, Parser, Interpreter |
| 5 | O2L compiler in O2L | o2lc.o2l (new, pure O2L) |
| 6 | Bootstrap | CI script |
| 7a | Behavioral cert | pctl-rs + Verify.o2l (pctl side) |
| 7b | Epistemic cert | Infer + Verify.o2l (infer side) |

## References

- Necula (1997) — Proof-Carrying Code. POPL.
- Morrisett et al. (1998) — From System F to Typed Assembly Language. POPL.
- Leroy (2006) — Formal Certification of a Compiler Back-end. POPL. (CompCert)
- JVM Specification §4.10 — Verification of class files
- pctl-rs (this ecosystem) — PCTL model checker
- Infer (this ecosystem) — bilattice epistemic reasoner
- ADR-009 — fpf cherry-pick language decisions
