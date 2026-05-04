# Quint Typed IR Schema (Spike Results)

**Date**: 2026-05-03
**Task**: zombo-sash-eco-5xr
**Verdict**: GO — quint typecheck output is fully parseable, bridge is feasible

## How to Get Typed IR

```bash
quint typecheck file.qnt --out /tmp/typed.json
```

- Exit 0 + JSON file = success
- Exit 1 + stderr errors = type failure (structured, with line/col)
- No `--json` flag — use `--out` instead

## JSON Schema

```json
{
  "stage": "typechecking",
  "warnings": [],
  "modules": [
    {
      "id": 74,
      "name": "records",
      "declarations": [
        {
          "kind": "var",
          "name": "rec1",
          "id": 4,
          "typeAnnotation": {
            "id": 3,
            "kind": "rec",
            "fields": {
              "kind": "row",
              "fields": [
                {"fieldName": "f1", "fieldType": {"id": 1, "kind": "int"}},
                {"fieldName": "f2", "fieldType": {"id": 2, "kind": "str"}}
              ],
              "other": {"kind": "empty"}
            }
          }
        },
        {
          "kind": "def",
          "name": "updateF1",
          "qualifier": "def",
          "expr": { "kind": "lambda", ... }
        },
        {
          "kind": "def",
          "name": "init",
          "qualifier": "action",
          "expr": { "kind": "app", "opcode": "actionAll", ... }
        }
      ]
    }
  ]
}
```

## Type Mapping: Quint → ZZ Entities

| Quint type | IR `kind` | ZZ mapping |
|------------|-----------|------------|
| `int` | `"int"` | Entity property `Integer` |
| `str` | `"str"` | Entity property `String` |
| `bool` | `"bool"` | Entity property `Boolean` |
| `{ f1: int, f2: str }` | `"rec"` with `fields.fields[]` | Entity with typed properties |
| `Set[T]` | `"set"` with `elem` | ZZ collection (future) |
| `List[T]` | `"list"` with `elem` | ZZ collection (future) |

## Record Type Structure

```
typeAnnotation.kind == "rec"
  → fields.kind == "row"
    → fields.fields[] = [{fieldName, fieldType: {kind}}]
    → fields.other.kind == "empty" (closed record)
```

Row polymorphism: `other.kind != "empty"` indicates an open record (has extra fields).
In practice, typed output resolves all row variables — `other` is always `"empty"` after typechecking.

## Declaration Kinds

| `kind` | What it is | Has type annotation |
|--------|-----------|-------------------|
| `var` | State variable | Yes (explicit) |
| `def` with `qualifier: "val"` | Constant value | No (inferred from expr) |
| `def` with `qualifier: "def"` | Function | No (inferred) |
| `def` with `qualifier: "action"` | State transition | No (inferred) |

## Error Format (stderr)

```
Error [QNT000]: Couldn't unify int and str
Trying to unify int and str

  at /tmp/bad_types.qnt:5:9
  5:         x' = "hello"
             ^^^^^^^^^^^^

error: typechecking failed
```

Exit code 1 on type error. Parseable: `Error [QNTXXX]:` prefix, `at file:line:col`, source snippet.

## Bridge Design Implications

For `zz-bridge-quint`:
1. Call `quint typecheck file.qnt --out /tmp/typed.json`
2. Parse JSON → extract `var` declarations with `typeAnnotation.kind == "rec"`
3. Map each record field to a ZZ entity property
4. Type errors → ZZ invariant violations (Belnap False)
