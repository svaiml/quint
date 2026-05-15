# Dostoevsky's Method for Unbiased AI — TheoSciTech Confirmation and Operational Mapping

> **Last updated**: 2026-05-13
> **Status**: Complete
> **Tracking**: research note from Habr articles (Tarasov 1012518; anonymous 1013226), forwarded via channel 2026-05-13
> **Question**: Does our TheoSciTech framework confirm Tarasov's claim that Dostoevsky's "реализм в высшем смысле" is the right anti-bias method for AI? How does our infrastructure operationalize it? What of the companion "embodied intelligence" piece — confirmed or refuted?
> **Verdict**: **Article 1 (Dostoevsky method) — STRONGLY CONFIRMED.** Our existing Orthodox apophatic + Florensky-Losev + Praxis-Theoria-Gnosis stack already provides the operational substrate Tarasov calls for. Article 2 (embodied intelligence, anonymous) — **partial; mostly the wrong piece to be reading on this topic.**

---

## 1. The Source Material — What Each Article Actually Claims

### 1.1 Article 1 — Tarasov, "How to Make AI Unbiased — Dostoevsky's Method" (Habr 1012518)

Vladimir Tarasov's load-bearing claims:

1. **Hidden biases are the failure mode.** Standard "balanced view" AI alignment (present arguments from all sides) leaves *unidentified* assumptions intact. The danger is the bias that nobody — neither developer nor evaluator — notices.
2. **Dostoevsky offered a different method.** *Реализм в высшем смысле* ("realism in the highest sense") — not balance, but **root-cause discernment**: rules for distinguishing truth from comforting falsehood.
3. **The Fourth Rule (load-bearing example).** Seek *first causes* over surface characteristics. Tarasov's case: Dostoevsky's 1881 *Diary of a Writer* attack on "экономизм" — Russian society obsessing over budget reforms while ignoring the spiritual root (elite-people fragmentation). The fix is not the budget but the social-spiritual reunification.
4. **Modern test case.** Russia's 2026–2030 Strategic Reform Plan targets shadow-economy reduction with economic measures, missing Jean Tochenko's root diagnosis: citizens are constitutionally sovereign but operationally cut off from governance.
5. **Proposal.** Train NNs on Dostoevsky's reasoning rules: identify hidden assumptions, distinguish symptoms from root causes, name when *societal consensus itself* embodies unexamined prejudice.

### 1.2 Article 2 — Anonymous, "Intelligence: Natural vs Artificial" (Habr 1013226)

Sparked by reading about crow intelligence. Author's load-bearing claims:

1. Strips "spirit, god, and other muddy philosophical concepts" out of standard definitions; defines intelligence as **understanding + learning + prediction**; then narrows to **learnability through experience, reflection, and emotional guidance**.
2. Intelligence emerges when environments destabilize and fixed-program species lose; flexible learners (corvids) win.
3. Consciousness is "an inevitable byproduct of a self-learning program in any sufficiently developed brain"; consciousness is a spectrum.
4. Human consciousness is "**largely linguistic and cultural rather than biological**."
5. **Embodiment requirement**: a robot with sensors has better prospects than a text-only LLM. Without body/feedback, no genuine "I."
6. Skeptical of the Turing Test (measures complexity, not consciousness); alternative criterion: *internal cycles of endless self-reflection*.

### 1.3 The two articles disagree about what to ask

Article 1 asks: *What method finds the hidden bias?* Article 2 asks: *What machinery would have an "I" at all?* They are not commensurable — but they collide on **the materialist exclusion**. Article 2 throws "spirit, god, etc." out of the definition; Article 1's whole point is that the bias Dostoevsky uncovered was *precisely* that exclusion.

This is not a coincidence. Article 2 represents exactly the methodological stance Article 1 critiques as biased.

---

## 2. Who Were the Key Drivers — Two Distinct Lineages

### 2.1 The Dostoevsky-method lineage (Article 1's tradition)

| Figure | Years | Contribution to the "anti-bias by depth" tradition |
|---|---|---|
| **F. M. Dostoevsky** | 1821–1881 | *Notes from Underground* (1864), *The Brothers Karamazov* (1880), *Diary of a Writer* (1873–1881); explicit articulation of *реализм в высшем смысле* in notebooks. |
| **Vladimir Solovyov** | 1853–1900 | *Vseyedinstvo* (All-Unity); built the philosophical framework Dostoevsky implied. Solovyov delivered the funeral speech for Dostoevsky. |
| **Mikhail Bakhtin** | 1895–1975 | *Problems of Dostoevsky's Poetics* (1929/1963); identified Dostoevsky's **polyphony** as a philosophical innovation: multiple ideologically-loaded consciousnesses retained without authorial flattening. |
| **Pavel Florensky** | 1882–1937 | *The Pillar and Ground of the Truth* (1914); antinomic logic — truth includes its own negation as a higher synthesis. Already documented in our `florensky-losev-school.md`. |
| **Aleksei Losev** | 1893–1988 | *The Dialectics of Myth* (1930); symbol-as-cognitive-primitive; carries Florensky's program through Soviet period. |
| **Lev Shestov** | 1866–1938 | *Athens and Jerusalem* (1938); anti-rationalist faith; the irreducibility of singular existence to general law. |
| **Nikolai Berdyaev** | 1874–1948 | *Dostoevsky* (1923); freedom as primary ontological category. |
| **Sergei Bulgakov** | 1871–1944 | Sophiology — but flagged in our memory as "not holy," cite with caution. |
| **René Girard** | 1923–2015 | Mimetic theory (West); *Resurrection from the Underground* (1976) reads Dostoevsky as the discoverer of mimetic rivalry. The bridge to anglophone academia. |
| **Søren Kierkegaard** | 1813–1855 | Parallel development; the "single individual" before universalizing ethics. |

### 2.2 The embodied-cognition lineage (Article 2's tradition)

| Figure | Years | Contribution |
|---|---|---|
| **Maurice Merleau-Ponty** | 1908–1961 | *Phenomenology of Perception* (1945); body as primary cognitive substrate. |
| **Hubert Dreyfus** | 1929–2017 | *What Computers Can't Do* (1972); anti-symbolic-AI on embodiment grounds. |
| **Francisco Varela / Evan Thompson / Eleanor Rosch** | 1991+ | *The Embodied Mind*; enactivism. |
| **Rodney Brooks** | (active) | *Elephants Don't Play Chess* (1990); robotics-first AI. |
| **Andy Clark** | (active) | *Being There* (1997), *Supersizing the Mind* (2008); extended mind. |
| **Nathan Emery & Nicola Clayton** | (active, Cambridge) | Corvid cognition empirical work — the crow data behind Article 2. |

These are real traditions. Our quarrel is with Article 2's *exclusion move* (drop "spirit, god, etc."), not with embodiment as such.

### 2.3 The AI-side parallels worth crediting

| Figure | Contribution | Relevance to Dostoevsky method |
|---|---|---|
| **Marvin Minsky** | *The Society of Mind* (1986) | A polyphonic-agent architecture; structurally akin to Bakhtin. |
| **Stuart Russell** | *Human Compatible* (2019) | AI should be **uncertain about objectives** — the structural humility Dostoevsky's method requires. |
| **John Holland / Gell-Mann (Santa Fe)** | Complex-adaptive-systems | Treats values as emergent rather than imposed. |
| **Anthropic Constitutional AI** | (2022+) | Adds explicit principles to RLHF — closest current AI practice to Tarasov's proposal. |

---

## 3. TheoSciTech Lens — Does Our Framework Confirm Tarasov?

We have five existing frameworks/docs that bear directly. Each one returns a verdict on Article 1.

### 3.1 Apophatic epistemology — confirms strongly

Our `apophatic-computational-epistemology.md` and the TASK-60 to TASK-63 Tier -1 to Tier -4 tier docs (Pseudo-Dionysius, Gregory of Nyssa divine darkness, Maximus' logoi, Perichoresis) build the same move at the metaphysical level that Tarasov calls for at the AI-output level:

| Apophatic move | Tarasov / Dostoevsky equivalent |
|---|---|
| God is not what predicates say (any cataphatic claim is partial) | Mainstream consensus is not what the consensus says (the institutional bias is hidden) |
| Truth pursued *by negation* of inadequate descriptions | "Hidden bias" surfaced by removing the conventionally-believed framing |
| Divine darkness as positive epistemic stance | "Realism in the highest sense" sees more by refusing the surface |

**Verdict: confirmed.** The apophatic stance gives us the formal grammar Dostoevsky used intuitively.

### 3.2 Florensky's antinomic logic — confirms strongly

`florensky-losev-school.md` already documents Florensky's *antinomy as truth*: contradictory propositions can both be *positively true* under different aspects, with higher synthesis. This is the *operationalizable* version of Dostoevsky's method:

- Dostoevsky leaves the polyphony unresolved (Bakhtin).
- Florensky names *why* this is logically permissible (antinomic logic; modern: paraconsistent logic).
- **We already have** `pctl-rs::BelnapFourValue` — a 4-valued logic supporting paradox/contradiction states (our zz-notation work).

**Verdict: confirmed and already implemented in our reasoning stack.** Tarasov's proposal does not need to be invented; we can compile it.

### 3.3 Bakhtin's polyphony — confirms strongly; bears directly on multi-agent

Bakhtin's reading of Dostoevsky (1929) is that *characters speak with their own consciousness*, not as mouthpieces of the author. In Bakhtin's terms, polyphony is irreducible — averaging is the failure.

Map to multi-agent / council architectures:

| Bakhtin's polyphony | AI-agent architecture |
|---|---|
| Each voice retains its full ideological position | Each agent retains its full value frame |
| The author does not flatten | The orchestrator does not average |
| Dialogic truth emerges from un-resolved confrontation | "Council" patterns — adversarial debate without forced consensus |

Stuart Russell's "AI should be uncertain about objectives" is the Bakhtin move at the alignment level: don't collapse to a single objective function.

**Verdict: confirmed; this is the philosophically-grounded version of multi-agent debate architectures.**

### 3.4 Praxis → Theoria → Gnosis — places Dostoevsky's method correctly

From `kolmogorov-school-failures-corrections.md`:

- **Praxis** = concrete moral/social experience (Dostoevsky's prison years, his actual encounters with the poor)
- **Theoria** = abstract framework (Solovyov's All-Unity, Florensky's antinomy, Bakhtin's polyphony)
- **Gnosis** = judgment in particular cases (Dostoevsky's narrative discernment in the novels; what Tarasov is asking the AI to learn)

The "balanced view" approach to AI bias = Theoria only (present the abstract pros/cons). Dostoevsky's method = Theoria *grounded in Praxis* (you needed to have **suffered** to write *The House of the Dead*) and culminating in **Gnosis** (the *Brothers Karamazov* trial scene; the judgment that catches the hidden bias).

**Verdict: confirmed. Our PTG framework explains why pure-Theoria alignment fails, and Dostoevsky's method works.**

### 3.5 Infer 5-verb model — extension proposed

Our Infer engine has 5 verbs: DEDUCE, ABDUCE, DETECT, STRESS, INDUCE. Tarasov's method requires a sixth that we don't have:

| Existing verb | What it does | What Dostoevsky's method adds |
|---|---|---|
| DEDUCE | Forward inference | — |
| ABDUCE | Best explanation | — close, but ABDUCE picks the *best fit*; Dostoevsky picks the *deepest cause* |
| DETECT | Find counter-examples | — |
| STRESS | Sensitivity analysis | — |
| INDUCE | Generalize from cases | — |
| **DISCERN (proposed)** | — | Identify hidden assumptions; rank causes by *depth*, not by *fit*; flag when consensus itself is the bias |

DISCERN would be the verb that operationalizes "realism in the highest sense." Its formal core is **paraconsistent root-cause search**: given a contradictory or socially-consensual claim, search for the deepest premise whose negation would not break logical coherence but *would* break the consensus.

**Verdict: confirmed as a research direction.** This is a real Infer extension, not vapor. Connects to our docs-3862 (7-valued bilattice research).

### 3.6 Honest caveat — moral compass is presupposed

Dostoevsky's method assumes a **moral compass** (Orthodox conscience) to know which "deeper cause" is the *right* one. The fourth rule says "go to first causes" — but reaching the first causes still requires judgment about *which* cause counts as the root.

Tarasov's example shows this: his preferred root cause for Russia 2026–2030 (elite-people fragmentation, per Tochenko) is **itself a contestable political diagnosis**. A different moral framework would name a different "root."

This is not a bug; it is the load-bearing feature. The Dostoevsky method **cannot be applied without a value-substrate** — and so the question becomes "*whose* compass?" rather than "*should* there be a compass?"

For our project this is fine: our Orthodox memory + tier work + Praxis-Theoria-Gnosis frame *is* the explicit value substrate. We can build a Dostoevsky-method AI. A value-neutral entity (Anthropic Constitutional AI in its most-cautious mode) structurally cannot.

**Verdict: confirmed with operational warning — Dostoevsky's method is alignment-positive, not alignment-neutral. We should not pretend otherwise.**

---

## 4. What of Article 2 (Embodied Intelligence)?

Briefer treatment because the article is shallower.

| Claim | Verdict | Why |
|---|---|---|
| Intelligence = understanding + learning + prediction | Necessary but not sufficient | Vacuum robot has all three, as author concedes |
| Reflection + emotion = the real distinguisher | Partial confirm | Maps to our metacognition + LDD-style trajectory analysis |
| Drop "spirit, god, etc." as muddy | **Refute** | This is the exact materialist exclusion Article 1 catches as a hidden bias |
| Consciousness is "linguistic + cultural" rather than biological | Partial confirm | True descriptively; but cannot explain why a being would refuse a profitable evil act |
| Embodiment is necessary | Modest confirm | Aligns with our agent-architecture-2026 durable-state work and the embodied-cognition lineage |
| Turing Test measures only complexity | Confirm | Standard critique |
| AI needs "endless internal self-reflection cycles" | Tentative confirm | Aligns with our agent dual-window pattern |

**Net**: Article 2 sits firmly in the materialist-cognitive-science tradition. It is not wrong as far as it goes. Its **method**, however, is *exactly* what Article 1 critiques. Reading these two pieces together is a happy accident — they form a single test case for the Dostoevsky method, with Article 2 as the *patient* and Article 1 as the *diagnostic*.

---

## 5. Dependency Map

```
                  ┌─────────────────────────────────────────────────────┐
                  │  dostoevsky-method-unbiased-ai-theosci-tech         │  ← THIS DOC
                  └─────────────────────────────────────────────────────┘
                       ▲                                        │
              CONSUMES (existing frameworks)        STRENGTHENS (open work)
                       │                                        ▼
   ┌───────────────────────────────┐         ┌─────────────────────────────────┐
   │ apophatic-computational-      │────────▶│ docs-c02 Kolmogorov Correction  │
   │ epistemology                  │  truth- │   (Dostoevsky method as the     │
   │   (Tier -1 to -4 stack)       │  by-neg │    contemporary Gnosis-driver)  │
   └───────────────────────────────┘         └─────────────────────────────────┘

   ┌───────────────────────────────┐         ┌─────────────────────────────────┐
   │ florensky-losev-school        │────────▶│ docs-3862 7-valued bilattice    │
   │   (antinomic logic;           │  para-  │   (DISCERN verb / paraconsis-   │
   │    Pillar and Ground)         │  consist│    tent root-cause search)      │
   └───────────────────────────────┘         └─────────────────────────────────┘

   ┌───────────────────────────────┐         ┌─────────────────────────────────┐
   │ kolmogorov-school-failures-   │────────▶│ Infer 5-verb → 6-verb extension │
   │ corrections                   │  PTG    │   (proposal: add DISCERN)       │
   │   (Praxis-Theoria-Gnosis)     │  spiral │                                 │
   └───────────────────────────────┘         └─────────────────────────────────┘

   ┌───────────────────────────────┐         ┌─────────────────────────────────┐
   │ andreessen-breadth-depth-     │────────▶│ Multi-agent council (Bakhtin    │
   │ theosci-tech-critique         │  Gnosis-│   polyphony) as architectural   │
   │   (Gnosis-on-substrate)       │  hinge  │   pattern for FlowSpec agents   │
   └───────────────────────────────┘         └─────────────────────────────────┘

   ┌───────────────────────────────┐
   │ Russian religious-philosophy  │  ← lineage providing the value-substrate
   │ school (Solovyov, Florensky,  │    Tarasov's method requires
   │ Losev, Bakhtin, Berdyaev)     │
   └───────────────────────────────┘
```

The diagram shows the asymmetry clearly: this critique **consumes** four existing framework docs plus the Russian religious-philosophy lineage, and **strengthens** three open tickets + one architectural pattern. The DISCERN-verb proposal is the only genuinely new artifact.

---

## 6. Implications for Our Vision

### 6.1 Education Division — TheoSciTech and Tarasov agree against the Habr-2 author

The TheoSciTech curriculum thesis (Praxis → Theoria → Gnosis) needs **Dostoevsky-class literature in the Praxis tier**. Article 2's tradition treats literature as decoration; Article 1 treats it as the irreplaceable training corpus for Gnosis. Our pedagogy lines up with the Dostoevsky side.

### 6.2 Infer engine — DISCERN as a 6th verb

Concrete extension. Spec sketch:
- **Input**: a claim + a consensus context (the institutional/societal frame in which it is uttered)
- **Output**: ranked list of root-cause candidates, with each candidate annotated by *how much of the consensus it would invalidate* if true
- **Mechanism**: paraconsistent search through premises (using `BelnapFourValue` truth states), scoring by depth-of-invalidation rather than fit-to-data

This is a real Infer-side workstream, naturally chained to the existing 7-valued bilattice research (docs-3862).

### 6.3 FlowSpec / multi-agent — polyphonic council architecture

Don't average agents. Don't collapse votes. Keep voices distinct and let the orchestrator reason *with* the unresolved tension. This is structurally Bakhtin's polyphony as an alignment pattern.

### 6.4 RSTMDB — explicit "depth-of-cause" relation

A new edge type in the genealogy graph: *cause-depth* (or *root-distance*). For any claim node, store not just *who said it* and *who cited it* but *how deep along the causal chain* it sits. The Dostoevsky-method query then becomes a graph operation: "show me the deepest ancestor of this consensus claim whose negation is still coherent."

### 6.5 Recruiting / talent

The PTG-axis hire (`feedback` already noted from the Andreessen critique) gets a literary clause: we should hire people who have read Dostoevsky-class literature with comprehension, because Gnosis training corpora are not interchangeable with technical depth.

---

## 7. Verdict and Confidence

**Verdict**: TheoSciTech **strongly confirms** Tarasov's Dostoevsky-method proposal. The substrate is already in our codebase (apophatic stack, Florensky antinomy, Bakhtin polyphony lineage, PTG spiral). The novel extension is the Infer DISCERN verb. Article 2's intelligence definition is **internally consistent but methodologically of the wrong tradition** for the anti-bias question.

**Confidence**: **Very high (90%)** on the alignment with our frameworks. **High (75%)** that DISCERN is the right operational extension (some risk that the bilattice machinery is overkill for what's really a probabilistic causal-graph query). **Medium (60%)** that the broader Dostoevsky-method positioning is commercially defensible to non-Orthodox audiences — works as engineering, requires more care as pitch.

The chat thread treated these as throwaway forwards. Our framework gives them a place; one of them is a load-bearing alignment proposal that we are uniquely positioned to operationalize.

---

## 8. Sources

**Primary (chat forwards / Habr articles)**:
- Vladimir Tarasov, "Как заставить ИИ быть непредвзятым? – метод Достоевского", Habr 1012518, 2026-05 (verbatim summary above)
- Anonymous, "Интеллект: естественный vs искусственный", Habr 1013226, 2026-05 (verbatim summary above)

**Foundational Dostoevsky-method lineage**:
- F. M. Dostoevsky, *Notes from Underground* (1864); *The Brothers Karamazov* (1880); *Diary of a Writer* (1873–1881)
- V. Solovyov, *Lectures on Godmanhood* (1878–1881)
- M. Bakhtin, *Problems of Dostoevsky's Poetics* (1929/1963)
- P. Florensky, *The Pillar and Ground of the Truth* (1914)
- A. Losev, *The Dialectics of Myth* (1930)
- L. Shestov, *Athens and Jerusalem* (1938)
- N. Berdyaev, *Dostoevsky* (1923)
- R. Girard, *Resurrection from the Underground: Feodor Dostoevsky* (1976)

**Embodied-cognition lineage (Article 2's tradition)**:
- M. Merleau-Ponty, *Phenomenology of Perception* (1945)
- H. Dreyfus, *What Computers Can't Do* (1972)
- F. Varela, E. Thompson, E. Rosch, *The Embodied Mind* (1991)
- R. Brooks, "Elephants Don't Play Chess" (1990)
- A. Clark, *Being There* (1997), *Supersizing the Mind* (2008)
- N. Emery & N. Clayton — corvid cognition research

**AI-side parallels**:
- Marvin Minsky, *The Society of Mind* (1986)
- Stuart Russell, *Human Compatible* (2019)
- Anthropic, "Constitutional AI" (2022)

**Internal refs**:
- `docs/research/apophatic-computational-epistemology.md`
- `docs/research/florensky-losev-school.md`
- `docs/research/orthodox-holy-fathers-catalog.md`
- `docs/research/orthodox-science-correspondence-table.md`
- `docs/research/math-orthodox-correspondence.md`
- `docs/research/kolmogorov-school-failures-corrections.md` (PTG spiral)
- `docs/research/andreessen-breadth-depth-theosci-tech-critique.md` (Gnosis hinge)
- `docs/research/orthodox-tier-minus1-divine-darkness.md`
- Open tickets: docs-c02 (Kolmogorov Correction), docs-3862 (7-valued bilattice), docs-4gko (infer ↔ zz-notation bridge), docs-1qs (Russian Orthodox Scientists epic)

---

*Critical review — TheoSciTech framework applied to a load-bearing Russian alignment proposal, 2026-05-13.*
