# Research: Does a 7-Valued Bilattice Exist?

> **Date**: 2026-05-04 | **Task**: docs-3862 | **Status**: Complete
> **Refs**: docs-omhf (SIX bilattice), docs/assess/6-valued-lattice-assessment.md

---

## Verdict

**Yes — Ginsberg's SEVEN (1988) is the canonical published 7-valued bilattice.**
It is non-interlaced (no product representation), explicitly designed for default reasoning in AI,
and represents a "default layer" between no-information (⊥) and definite values (t, f, ⊤).

**For the ZZ ecosystem: use SIX, not SEVEN.** The 7th value's meaning (structurally-inferred,
not directly evidenced) is better captured as evidence metadata than as a new truth value.

---

## Mathematical Existence

### Why 7 Is Impossible for Interlaced Bilattices

**Avron's Representation Theorem (1996):** Every interlaced bilattice ≅ L₁ ⊗ L₂ for bounded
lattices L₁, L₂. Cardinality = |L₁| · |L₂|. For bilattices with Ginsberg negation: ≅ L ⊗ L,
cardinality = |L|².

Since 7 is prime: 7 = 1 × 7 only, and a 1-element lattice is trivial (collapses both orderings).
**No interlaced bilattice with 7 elements exists.** This is a theorem, not a gap.

The standard product series: FOUR (2×2=4), NINE (3×3=9), SIXTEEN (4×4=16). SIX ([3]×[2]=6)
is valid as a pre-bilattice (asymmetric product, no Ginsberg negation).

### Non-Interlaced Bilattices Can Have 7 Elements

Algebraic enumeration: **284 distinct bilattice structures exist on a 7-element set.**
The requirement is only: two lattice structures on the same set. The interlacing (monotonicity
between orderings) is not required for the base definition.

---

## Ginsberg's SEVEN (1988)

**Source:** Ginsberg, M. (1988). "Multivalued logics: a uniform approach to reasoning in AI."
*Computational Intelligence* 4(3):265–316. The canonical published 7-valued AI bilattice.

### Structure

7 elements: {⊥, dt, df, d⊤, t, f, ⊤}

| Element | Name | Meaning |
|---------|------|---------|
| ⊥ | Bottom | No information |
| dt | Default-true | Assumed true by default (no evidence against) |
| df | Default-false | Assumed false by default (no evidence against) |
| d⊤ | Default-conflict | Contradicting default conclusions |
| t | True | Definitively confirmed true |
| f | False | Definitively confirmed false |
| ⊤ | Top | Definitively contradictory (both confirmed) |

```
Knowledge ordering (≤_k):        Truth ordering (≤_t):

         ⊤                              ⊤
        /|\                            / \
       t d⊤ f                         t   f
       |  |  |                         |   |
      dt  | df                        dt  df
        \ | /                          \ /
          ⊥                            ⊥(≈d⊤ incomparable)
```

**Why non-interlaced:** Default elements violate the monotonicity requirement between orderings.
The meet on the knowledge ordering does not always preserve the truth ordering at the default tier.

### The Jₙ Family vs. SEVEN

Craig-Davey-Haviar (2020) "Expanding Belnap: dualities for a new class of default bilattices,"
*Algebra Universalis* 81(50) introduced the Jₙ family:

| n | Elements | Structure |
|---|----------|-----------|
| J₀ | 4 | FOUR itself |
| J₁ | 6 | One priority level of defaults |
| J₂ | 8 | Two priority levels |
| Jₙ | 4 + 2n | n priority levels |

Jₙ always has **even** cardinality (4 + 2n). SEVEN = 7 is **odd** — it does not fit the Jₙ pattern.
Ginsberg's SEVEN has a distinct d⊤ (default-contradiction) element absent from Jₙ symmetry.

---

## Subvariety Lattice (the "Variety Lattice" Interpretation)

The subvariety lattice of De Morgan algebras is a **4-element chain**:
```
De Morgan ⊃ Kleene ⊃ Boolean ⊃ Trivial
```
**Not 7 elements.** This interpretation does not match.

For De Morgan bisemilattices (arXiv:2603.12175): **23 subvarieties** — also not 7.
For the variety of all bilattices: infinite (infinitely many finite bilattices exist).

The "variety lattice" framing does not cleanly yield 7.

---

## What the 7th Value Represents

The core epistemic meaning of SEVEN's extra layer:

```
⊥ = "not investigated"
dt = "assumed true by structural inference, no direct evidence"   ← THE 7th VALUE
t  = "confirmed true by direct evidence"
```

In the ZZ/RSTMDB science genealogy context:
- A paper is **predicted** to have influenced another by graph structure (citation patterns,
  co-authorship, topic overlap) — but no direct citation evidence exists
- This is above ⊥ (we have a structural reason) but below ◇t (no direct source evidence)
- Ginsberg calls this "true by default" — the default assumption in absence of contradiction

This maps to the ZZ criterium assurance loop:
- **L0 Abduced** → ⊥/dt (hypothesis generated, not yet evidenced) — dt is "the abduction result"
- **L1 Deduced** → ◇t (infer confirmed it deductively — SIX weak-true)
- **L2 Induced** → □t (pctl-rs evidence confirms — SIX confirmed-true)
- **L3 Operational** → □t with HITL stamp

The 7th value dt would live **between L0 and L1** — post-abduction, pre-deduction.

---

## Should ZZ Use SEVEN?

### Against SEVEN

1. **Loss of interlacing** → no product representation → pctl-rs lattice operations lose monotonicity
   guarantees. This affects confidence interval propagation in pctl-rs evidence scoring.
2. **Implementation complexity**: meet/join tables for 7 elements with non-interlaced structure
   require explicit 49-entry tables rather than derivation from component lattices.
3. **The distinction is already capturable** via evidence metadata: `inference_type: direct | structural`
   added to the pctl-rs evidence record achieves the same epistemic discrimination without
   changing the truth-value algebra.

### For SEVEN

1. **The dt/df states are genuinely first-class** in the science genealogy use case: many lineage
   claims are structurally inferred (graph-predicted) before any direct citation is found.
   Making this a truth-value (not just metadata) enables formal reasoning: "if dt and no
   contradicting evidence found in N iterations, promote to ◇t."
2. **Ginsberg's SEVEN is published, studied, and has known algebraic properties.** Not speculative.
3. **The criterium loop maps cleanly**: L0 abduction → dt, loop-advances-to ◇t on deduction success.

### Recommendation

**Phase 1 (now):** Implement SIX ([3]×[2], interlaced). Add `inference_source: direct | structural | default`
to pctl-rs EvidenceRecord. This encodes the dt distinction without breaking the bilattice structure.

**Phase 2 (if L0→L1 loop needs formal default reasoning):** Consider SEVEN as a natural extension
once the criterium loop is wired. The non-interlaced structure is a known cost, accepted explicitly.

---

## Comparison Table

| Structure | Elements | Interlaced | Product form | Negation | ZZ fit |
|-----------|----------|-----------|--------------|----------|--------|
| FOUR | 4 | ✓ | [2]×[2] | ✓ Ginsberg | Current core |
| SIX | 6 | ✓ (pre-bilattice) | [3]×[2] | ✗ (asymmetric) | Recommended next |
| SEVEN | 7 | ✗ | None (prime) | Partial | Phase 2 if default reasoning needed |
| NINE | 9 | ✓ | [3]×[3] | ✓ Ginsberg | Full confidence gradient |

---

## Key Sources

| Source | Key result |
|--------|-----------|
| Ginsberg (1988) *Computational Intelligence* 4(3) | SEVEN constructed; non-interlaced bilattice for default reasoning |
| Avron (1996) *Math. Structures Comput. Sci.* 6 | Representation theorem: interlaced bilattice ≅ L₁⊗L₂; 7 impossible |
| Arieli & Avron (1996) *J. Logic Lang. Inf.* 5 | Logical bilattice framework; FOUR as subdirectly irreducible |
| Fitting (1991) *J. Logic Programming* 11 | NINE bilattice; bilattice semantics for logic programming |
| Craig-Davey-Haviar (2020) *Algebra Universalis* 81 | Jₙ default bilattice family; natural duality for default bilattices |
| arXiv:1010.2552 (Rivieccio) | 284 bilattice structures on 7-element set; algebraic enumeration |
| arXiv:2603.12175 | De Morgan bisemilattice subvariety lattice has 23 elements (not 7) |
