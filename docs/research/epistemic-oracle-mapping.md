# Epistemic Oracle Mapping: ZZ Stack ↔ Philosophy / Science / Theology

> **Status**: Research draft
> **Last updated**: 2026-05-04
> **Related**: apophatic-computational-epistemology.md, criterium (epistemic-universe), infer (reasoning-universe)

---

## The Epistemic Model — 7 Tiers

What looks like 5 tiers is actually 7. "Understanding" (the old Tier 4) contains three
mechanistically distinct operations — each requires different machinery, so each is a
first-class tier. Pearl's causation ladder is the formal basis for the split.

```
  7   WISDOM           judgment — what to DO with understanding  → criterium HITL loop
  6   COUNTERFACTUAL   "what would have been if...?"            → GAP (docs-ojqt)
  5   INTERVENTION     "what if I do X?" — do-calculus          → infer::STRESS
  4   EXPLANATION      "why did X happen?" — causal proof       → infer::explain()
  3   KNOWLEDGE        justified true belief, provenance        → KnowledgeStore (L1–L2)
  2   INFORMATION      data + context, provisional              → BeliefStore (L0, conf < 1.0)
  1   DATA             raw signals, no interpretation           → rstmdb WAL / StateStore
```

**The Pearl split (Tiers 4–6)**:
- T4 Explanation: observe the causal graph, read off causes (passive)
- T5 Intervention: intervene — sever incoming edges, force a value (`do(X)`) (active)
- T6 Counterfactual: imagine — what if the past had been different? Requires abduction
  *into* the causal model, then forward simulation. Operates on possible worlds, not
  actual events. No current infer verb covers this — it is the stack's sharpest gap.

Each tier has an "oracle" — the tradition that best formalized it.

---

## Tier 1 — DATA (StateStore / rstmdb)

Raw signals. No interpretation. Mutable, ephemeral. No provenance.

| Domain | Oracle | Core Claim |
|--------|--------|------------|
| **Philosophy** | Hume's bundle theory | Reality is streams of atomic impressions, nothing more. The "self" is a habit, not a substance. |
| **Philosophy** | Logical positivism (Carnap, Schlick) | Meaningful statements are protocol sentences — direct records of observation events. |
| **Science** | Shannon information theory | A bit is a bit. Meaning is external. Entropy measures surprise, not truth. |
| **Science** | Raw measurement / lab notebooks | Data is sacred precisely because it has no interpretation yet — the source that cannot be argued with. |
| **Theology** | Theophany as raw event | The burning bush, thunder on Sinai — raw encounter before interpretation. Moses does not yet know what he has seen. |
| **Theology** | Apophatic baseline | Before we can say what God IS, we note only what is NOT. The raw datum of divine encounter is silence. |

**ZZ mapping**: `rstmdb` WAL entries. Every state transition recorded as a naked event with timestamp, guard condition, and new value — no causal story yet.

---

## Tier 2 — INFORMATION (BeliefStore / KnowledgeStore L0)

Data + context = parsed facts. AssuranceLevel::L0. Confidence < 1.0. Still provisional.

| Domain | Oracle | Core Claim |
|--------|--------|------------|
| **Philosophy** | Frege's propositional logic | Facts are truth-bearing sentences with logical form. Context (predicates, quantifiers) transforms raw events into propositions. |
| **Philosophy** | Peirce's semiotics | Signs require an interpretant — a third element that gives a sign its meaning in context. Information is the triadic relation. |
| **Science** | Statistical inference | Raw data + distributional model = information. Bayesian priors are the "context" that transforms data into probability statements. |
| **Science** | Bioinformatics annotation | A DNA sequence is data. A gene annotation (context: organism, function, homologs) makes it information. |
| **Theology** | Lectio Divina — Stage 1 (lectio) | Reading the text. The word on the page. Context is the canon, the language, the typological frame. |
| **Theology** | Catechesis | Organized doctrine: raw Scripture + creedal context = doctrinal information accessible to the catechumen. |

**ZZ mapping**: `KnowledgeStore` entries with `confidence < 1.0` and `assurance_level = L0`. The `BeliefStore` abstraction — hypotheses that are tracked but not yet verified. Infer's ABDUCE verb operates here: generating candidate explanations from data.

---

## Tier 3 — KNOWLEDGE (KnowledgeStore / AssuranceLevel L1–L2)

Justified true belief. Provenance attached. Reproducible. Peer-verifiable.

| Domain | Oracle | Core Claim |
|--------|--------|------------|
| **Philosophy** | Plato's Theaetetus | Knowledge = justified true belief (episteme vs doxa). The Gettier problem (1963) shows JTB is necessary but not sufficient — provenance matters. |
| **Philosophy** | Kant's synthetic a priori | Knowledge is structured by the understanding (Verstand) — categories organize raw experience into unified, verifiable claims. |
| **Science** | Kuhn's normal science | The paradigm is the KnowledgeStore. Textbook science = verified, reproducible, communally held, provenance-tracked through citations. |
| **Science** | Merton norms (CUDOS) | Communalism, Universalism, Disinterestedness, Organized Skepticism — the institutional protocol for elevating belief to knowledge. |
| **Theology** | Ecumenical Councils (Nicaea, Chalcedon) | Dogma = theologically verified knowledge. Conciliar decision is the formal provenance mechanism. "It seemed good to the Holy Spirit and to us." |
| **Theology** | Orthodox Holy Tradition | The living KnowledgeStore. Patristic consensus is the provenance chain. Deviation from patristic consensus = unverified belief. |

**ZZ mapping**: `KnowledgeStore` at `AssuranceLevel::L1` (logically derived) and `L2` (empirically evidenced). Infer's DEDUCE and DETECT verbs operate here — deriving new facts from verified ones and detecting when evidence confirms or disconfirms a stored belief.

---

## Tier 4 — UNDERSTANDING (infer proof trees / Solver::explain())

Knowledge + causal model. The "why" not just the "what". Mechanistic.

| Domain | Oracle | Core Claim |
|--------|--------|------------|
| **Philosophy** | Aristotle's Posterior Analytics | Scientific understanding (episteme) requires demonstrating WHY — giving the four causes (material, formal, efficient, final). A fact without cause is not understood, only catalogued. |
| **Philosophy** | Sellars' "space of reasons" | To understand is to grasp inferential role — knowing what follows from what, what would count as evidence for or against. Understanding is being in the space of reasons. |
| **Philosophy** | Dilthey's Verstehen | Understanding (Verstehen) is distinct from explanation (Erklären). To understand is to grasp the meaning-context from within, not merely observe from without. |
| **Science** | Pearl's causal inference (do-calculus) | Correlation is information. Causation is understanding. The causal graph is the computational proof tree — `do(X)` is infer's STRESS verb applied to the graph. |
| **Science** | Feynman's criterion | "What I cannot create, I do not understand." Generative models, not classifiers, mark the understanding tier. |
| **Theology** | Theoria (Gregory Palamas) | The illumined nous sees the divine energies — not conceptual knowledge about God but participatory understanding of His operations in creation. |
| **Theology** | Philokalia tradition | Nepsis (watchfulness) + hesychia (stillness) purify the nous to receive understanding that exceeds propositional knowledge. Understanding here is ontological, not merely cognitive. |
| **Theology** | Talmudic reasoning (sugya structure) | Understanding through dialectical proof-tree construction. The gemara is a proof tree where every statement has a "why" — a chain of authorities and logical moves. |

**ZZ mapping**: `infer::Solver::explain()` returns a proof tree — the derivation path from axioms to conclusion. Every leaf is a verified fact from KnowledgeStore; every node is an inference rule. The FIVE-VERB framework (DEDUCE, ABDUCE, DETECT, STRESS, MONITOR) maps to Aristotle's four causes extended: STRESS is the efficient-cause probe, MONITOR is the temporal-cause tracker.

---

## Tier 5 — WISDOM (criterium / HITL loop)

Understanding + judgment. Knowing what to DO. Cannot be fully automated.

| Domain | Oracle | Core Claim |
|--------|--------|------------|
| **Philosophy** | Aristotle's phronesis | Practical wisdom: the capacity to deliberate well about what conduces to the good life. Not a rule but a disposition — the ability to perceive the morally salient features of a situation. |
| **Philosophy** | Gadamer's hermeneutics | Wisdom emerges in the fusion of horizons — understanding + the particular situation + the tradition. No algorithm; always a conversation. |
| **Philosophy** | Wittgenstein's rule-following | No rule can determine its own application. At some point, a practitioner must act — and that act is wisdom, not calculation. |
| **Science** | Science policy / responsible innovation | Where the HITL is mandatory: no algorithm decides which research to fund, which risks to accept, which populations to test on. Judgment is irreducible. |
| **Science** | Popper's falsificationism as wisdom | The scientist's wisdom: knowing WHICH theory to abandon in the face of anomaly, not just WHETHER anomalies exist. Judgment about when to switch paradigms. |
| **Theology** | Sophia (Divine Wisdom) | Proverbs 8: Wisdom as co-creator, present before creation, playing before God. Hagia Sophia — the Church dedicated not to a saint but to Wisdom itself as divine attribute. |
| **Theology** | Sobornost (Khomiakov) | Conciliar wisdom — truth is held by the whole Church, not any individual or office. The HITL loop is structurally sobornal: no single agent can advance without community ratification. |
| **Theology** | Diakrisis / discernment of spirits | The patristic gift of distinguishing true from false spiritual movements. Not algorithmic — requires purified nous, long practice, elder guidance. Criterium's AssuranceLevel::L3. |
| **Theology** | Florensky's living truth | "Truth is the antinomy resolved in life." Wisdom is not propositions but persons-in-relation. The HITL loop is not a UI widget — it is a community of persons bearing truth together. |

**ZZ mapping**: `criterium` — the HITL loop that cannot advance from L2 → L3 without human judgment. The `criterion registry` is the phronesis codified as far as possible; the HITL interruption is the point where codification runs out and wisdom begins. AssuranceLevel::L3 (operational) is the output of wisdom applied.

---

## The Belnap Lattice as Cross-Cutting Oracle

The FOUR / SIX / NINE bilattice system (pctl-rs) is not just a logic — it maps to a meta-epistemological insight shared across all three domains:

```
FOUR: True / False / Unknown(⊥) / Conflicted(⊤)
SIX:  weak-true / strong-true / weak-false / strong-false / Unknown / Conflicted
NINE: 3×3 quality tiers (F-G-R weighted)
```

| Value | Philosophy | Science | Theology |
|-------|------------|---------|----------|
| **True** | JTB satisfied | p-value < 0.05, replicated | Dogmatic definition |
| **False** | Contradiction derived | Falsified, retracted | Heresy formally condemned |
| **Unknown (⊥)** | Socratic ignorance | Null hypothesis undecided | Apophatic silence — "we do not know" |
| **Conflicted (⊤)** | Dialetheism (Priest) — true contradiction | Experimental anomaly — results conflict | Florensky's antinomy — sacred paradox as feature |

The NINE lattice adds **quality gradients** — this is where the ecosystem uniquely surpasses most epistemologies: not just true/false/unknown/conflicted but **how strongly** each value is held and with what **provenance quality** (F=foundational, G=grounded, R=reliable).

---

## The Crossover: L05 → L06 (Reasoning → Specification)

The most architecturally important mapping:

> `infer` proves that specs satisfy architectural invariants **before** agents execute them.

| Oracle | Name | Description |
|--------|------|-------------|
| **Philosophy** | Aristotle's practical syllogism | Major premise (universal: "all A should B") + minor (particular: "this is A") → action ("do B"). The crossover is where theoretical understanding becomes practical directive. |
| **Theology** | Theoria → Praxis | In Orthodox ascetic theology, theoria (contemplative vision) must issue in praxis (action) to bear fruit. Palamas: the divine light is not merely seen but transforms the person into agent. |
| **Science** | Engineering design | Theoretical physics → applied physics → engineering specification → artifact. Understanding without specification produces no artifact. |
| **ZZ** | infer → flowspec | A proof that a spec is sound (infer) gates the specification being handed to agents (flowspec). The crossover is the formal bridge from episteme to techne. |

---

## Ecosystem Oracle Summary

```
╔════════════════╦═══════════════════╦══════════════════════════╦══════════════════════════╗
║     Tier       ║    ZZ Component   ║  Philosophy Oracle       ║  Science / Theology      ║
╠════════════════╬═══════════════════╬══════════════════════════╬══════════════════════════╣
║ DATA           ║ rstmdb / StateStore║ Hume / Carnap           ║ Shannon / Theophany      ║
║ INFORMATION    ║ BeliefStore (L0)  ║ Peirce / Frege           ║ Bayesian / Lectio        ║
║ KNOWLEDGE      ║ KnowledgeStore L2 ║ Plato / Kant             ║ Kuhn / Holy Tradition    ║
║ UNDERSTANDING  ║ infer proof trees ║ Aristotle / Sellars      ║ Pearl / Theoria (Palamas)║
║ WISDOM         ║ criterium HITL    ║ Phronesis / Gadamer      ║ Science policy / Sophia  ║
╠════════════════╬═══════════════════╬══════════════════════════╬══════════════════════════╣
║ CROSS-CUTTING  ║ pctl-rs FOUR/SIX  ║ Dialetheism / Antinomy   ║ Quantum / Florensky      ║
║ CROSSOVER      ║ infer → flowspec  ║ Practical syllogism      ║ Theoria → Praxis         ║
╚════════════════╩═══════════════════╩══════════════════════════╩══════════════════════════╝
```

---

## Open Questions / Follow-up Research

1. **BeliefStore as distinct layer** — Should there be an explicit `BeliefStore` struct in zz-notation or criterium, separate from KnowledgeStore? Philosophy says yes (doxa vs episteme are categorically different). The current design uses confidence thresholds, which may be insufficient.

2. **Wisdom cannot be L3** — AssuranceLevel::L3 is "operational" — the output of wisdom applied. But wisdom itself is not an assurance level, it is the *faculty* that assigns them. Does criterium model this distinction?

3. **The Conflicted state (⊤) in theology** — Florensky insists antinomies are not bugs but revelations of divine reality's transcendence. pctl-rs::Belnap Conflicted should have a *positive* use mode, not just an error mode. Track as architectural gap.

4. **Sophia as missing epic** — "Wisdom" as a first-class epistemic entity (not just a property of the HITL loop) may deserve its own component. Aristotle's Sophia (theoretical wisdom about eternal truths) is different from Phronesis (practical wisdom). The ecosystem currently models only phronesis-level wisdom via criterium.
