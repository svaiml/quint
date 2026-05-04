# ADR-THEORY-003: AAF Extraction API Design for infer-core

**Status**: Accepted
**Date**: 2026-04-14
**Author**: @software-architect
**Feature**: argumentation-dynamics (TASK-22, TASK-23)
**Supersedes**: —
**Related**: ADR-THEORY-001 (MDL/PCTL/Glushkov), docs/prd/argumentation-dynamics-spec.md

---

## 1. Context

### 1.1 The Defeat Mechanism as Implemented

The infer language supports `defeat ruleName if condition` syntax. After compilation through
`infer-sema`, this populates `Rule.defeats: Vec<Vec<RuntimeCondition>>` — each inner `Vec`
is one defeat clause's conditions. The solver evaluates these conditions in `is_defeated()`:
if any condition set is satisfiable under the current substitution, the rule's conclusion is
suppressed.

**Critical finding**: the PRD for TASK-22 assumed `Rule.defeats: Vec<RuleId>` (named rule
attacks). The actual implementation is condition-based:

```rust
// crates/infer-core/src/knowledge.rs — actual code
pub struct Rule {
    pub id: RuleId,
    pub label: Option<String>,
    pub head: Predicate,
    pub body: Vec<RuntimeCondition>,
    pub defeats: Vec<Vec<RuntimeCondition>>,  // condition sets, NOT rule references
}
```

A `defeat bird_flight if penguin(x)` clause appends `[penguin(x)]` to
`bird_flight.defeats`. There is no reference back to the attacking rule — the attacker is
anonymous at the `Rule` struct level.

### 1.2 The AAF Extraction Gap

For Abstract Argumentation Framework (AAF) consumption by `pctl-rs` (DTMC construction) and
`zz-notation` (strategy convergence verification), we need a queryable attack graph.
Dung (1995) defines an AAF as a pair `(AR, attacks)` where `AR` is a set of arguments and
`attacks ⊆ AR × AR` is a binary relation.

The question is: what are the "attackers" in our condition-based defeat model?

### 1.3 The AST Level for Context

At the AST level (`infer-ast`), `DefeatDecl` records the target rule label and conditions:

```rust
pub struct DefeatDecl {
    pub target_label: Ident,
    pub conditions: Vec<Condition>,
    pub span: Span,
}
```

In `infer-sema::analyze_defeat()`, `target_label` resolves to the target rule index, and
the conditions are lowered to `RuntimeCondition` values and appended to
`self.rules[rule_idx].defeats`. The attacker identity (the declaring context) is lost.

### 1.4 Downstream Consumer Requirements

- **pctl-rs** needs: a set of argument labels + for each label, what conditions can defeat it.
  It constructs a 3-state DTMC per argument (`proposed`, `accepted`, `defeated`), where the
  defeat conditions govern the `proposed → defeated` transition probability.
- **zz-notation** needs: a convergence query surface — given the AAF, can the grounded
  extension be certified to be stable under repeated evidence arrival?

Neither consumer requires that attackers have stable names of their own. They require:
1. Which arguments (labeled rules) are in the AAF.
2. For each argument, which condition sets can defeat it (the edges in the attack graph).

---

## 2. Decision Options

### Option A: Condition-Based Attack Edges (Recommended)

Model each defeat clause directly as an attack edge. The "attacker" is the condition set
itself, not a named rule.

```rust
/// A directed attack in the AAF: argument `target` is defeated whenever
/// all conditions in any element of `conditions` are satisfiable.
pub struct DefeatEdge {
    pub target: RuleId,
    pub target_label: String,
    pub conditions: Vec<Vec<RuntimeCondition>>,  // mirrors Rule.defeats
}

/// An Abstract Argumentation Framework extracted from a KnowledgeBase.
pub struct Aaf {
    /// All labeled rules in the KB (the arguments of the AAF).
    pub arguments: Vec<(RuleId, String)>,
    /// Attack edges: one per labeled rule that has at least one defeat clause.
    pub attacks: Vec<DefeatEdge>,
}
```

`KnowledgeBase::extract_aaf()` iterates `rules_by_relation`, collects all labeled rules
as arguments, and for each labeled rule with non-empty `defeats`, creates one `DefeatEdge`
mirroring the rule's existing defeat conditions.

**Characteristics:**
- Zero breaking changes: `Rule` struct is unchanged, no new fields required.
- Zero syntax changes: no new infer language constructs.
- Correct AAF semantics: Dung's original formulation allows attack conditions — the attack
  relation holds when the condition is satisfiable under grounding. This is standard in
  conditional AAF literature (Cayrol & Lagasquie-Schiex, 2005).
- Attacker is anonymous: `pctl-rs` computes transition probabilities from condition
  satisfiability, not from attacker identity.
- Full information: `DefeatEdge.conditions` carries all defeat condition sets for the
  target, which is all information the solver itself uses.

**Trade-offs:**
- Attacker cannot be identified by name in the AAF output — this is a semantic limitation
  of the current infer language.
- DTMC construction must derive attack probability from condition satisfiability checks,
  not from a simple edge weight.

### Option B: Named Attack Groups (Future-Proof, Minor Syntax Extension)

Introduce a syntax extension allowing named defeat groups:

```infer
# hypothetical future syntax
defeat-group penguin_exception { target: bird_flight, if: penguin(x) }
```

This would allow `Attack { attacker: "penguin_exception", attacked: "bird_flight" }` with
named attackers, matching the PRD's original `Attack` struct design.

**Characteristics:**
- True named-attacker AAF: pctl-rs can label DTMC states by attacker name.
- Requires parser + AST + sema changes: `DefeatGroupDecl` AST node, new lowering path.
- Breaking change to surface syntax in the long run (old `defeat` syntax becomes a shorthand).
- Not needed by TASK-22 or TASK-23: pctl-rs does not require named attackers for DTMC
  construction.

**Verdict**: Premature for TASK-22. Implement only if a concrete consumer requires named
attacker labels in the DTMC.

### Option C: Infer Named Attackers from Rule Bodies (Fragile, Not Recommended)

Heuristic: if a rule's body conditions exactly match a defeat condition set on another rule,
treat that rule as the attacker.

**Characteristics:**
- Produces named attacker edges without syntax changes.
- Fragile: defeat conditions may not match any rule body exactly (they may use shared
  variables in different scopes, or test negation).
- Underdetermined: multiple rules may have identical body conditions.
- No formal basis in AAF theory.

**Verdict**: Rejected. Heuristic correctness cannot be guaranteed without a formal encoding
discipline that the infer language does not currently impose.

---

## 3. Decision

**Option A is adopted for TASK-22.**

Rationale:
1. **Correctness first**: Option A produces a valid AAF in Dung's conditional sense.
   Condition-based attacks are semantically equivalent to grounded attack edges when the
   conditions are evaluated against the KB's fact base — this is exactly what `is_defeated()`
   already does.

2. **Zero cost to existing users**: no `Rule` struct changes, no semver bump to the struct
   layout, no parser changes. The only new surface is `DefeatEdge`, `Aaf`, and
   `extract_aaf()` — purely additive.

3. **Sufficient for DTMC**: pctl-rs needs the condition sets to determine transition
   probabilities. Named attacker labels are a display concern, not a semantic one.

4. **Hohpe Decision Discipline**: keep options open. Option B (named attackers) remains
   available as an additive extension on top of Option A's API without breaking it.

---

## 4. Consequences

### 4.1 For DTMC Construction (pctl-rs, TASK-24)

Attack probability for a `proposed → defeated` transition is computed from condition
satisfiability:

- For deterministic KBs: `attack_prob ∈ {0.0, 1.0}` — conditions either hold or do not.
- For probabilistic extensions: the condition satisfiability probability is parameterized
  by evidence arrival probability (PRD Section 4.3, `evidence_arrival_prob`).

The `DefeatEdge.conditions` field gives pctl-rs all it needs: for each target argument, try
each condition set against the current KB snapshot; if any is satisfiable, the attack fires.

### 4.2 For Grounded Extension (Aaf::grounded_extension())

The grounded extension algorithm must evaluate defeat conditions against the KB to determine
which arguments are attacked. The signature:

```rust
impl Aaf {
    /// Compute the grounded extension: the set of argument labels that are not defeated
    /// under any currently satisfiable defeat condition.
    ///
    /// Takes the KB by reference to evaluate defeat conditions.
    pub fn grounded_extension<'a>(&'a self, kb: &KnowledgeBase) -> Vec<&'a str>;
}
```

This requires `Aaf` to hold a reference to the KB or for the caller to provide it. The
preferred design is to pass the KB at call time to keep `Aaf` a pure data struct (no
lifetime entanglement at rest).

### 4.3 For the Embedding API Stability Contract

`DefeatEdge`, `Aaf`, and `KnowledgeBase::extract_aaf()` are added as stable public types
under the 0.1.x minor version. They appear in `docs/api/infer-core-embedding.md` under a
new "Argumentation" section.

The `Rule` struct is unchanged — existing embedders (`zz-notation`, `inferense`) require no
code changes.

### 4.4 For Future Named Attackers (Extension Path)

If Option B is desired later:

1. Add `DefeatGroupDecl` to `infer-ast` (new syntax node, parser change).
2. Add `group_name: Option<String>` to `DefeatEdge` (additive, backward-compatible).
3. Update `extract_aaf()` to populate `group_name` when the source was a named group.
4. pctl-rs updates its DTMC labeling to use `group_name` when available.

This extension leaves the existing `DefeatEdge` and `Aaf` types intact — no breaking change
at the embedding API level.

---

## 5. Alignment with Dung (1995) AAF Semantics

Dung's AAF paper defines:
- **Conflict-free**: S is conflict-free iff no argument in S attacks another in S.
- **Admissible**: S is admissible iff S is conflict-free and defends all its members.
- **Grounded extension**: the least fixed point of the characteristic function `F_AF(S)`.

In Option A, "attacks" in Dung's sense is: condition set `c` attacks argument `a` iff
`c` is satisfiable under the current grounding. This maps correctly:
- A labeled rule `r` is in the grounded extension iff none of its defeat condition sets
  are satisfiable under the current KB.
- This matches the solver's `is_defeated()` check exactly.

The grounded extension computed by `Aaf::grounded_extension(kb)` must produce the same
membership as the solver produces when evaluating the rule. This is a correctness invariant
verified by TASK-23 golden tests.

---

## 6. References

- Dung, P.M. (1995). "On the acceptability of arguments and its fundamental role in
  nonmonotonic reasoning, logic programming and n-person games." *AI* 77(2): 321–357.
- Cayrol, C. & Lagasquie-Schiex, M.-C. (2005). "Graduality in argumentation."
  *JAIR* 23: 245–297. (Conditional attack semantics.)
- `docs/prd/argumentation-dynamics-spec.md` — full feature PRD
- `crates/infer-core/src/knowledge.rs` — `Rule`, `KnowledgeBase` types
- `crates/infer-sema/src/lib.rs` lines 894–1078 — `analyze_defeat()` implementation
