# Universal Open Problems Catalog + Proactive Monitoring System

**Spec ID**: universal-open-problems
**Date**: 2026-04-02
**Author**: PM Planner Agent
**Status**: Draft
**North Star Metric**: Open Problems Cataloged with RSI Tracking Active

---

## Description

A two-part deliverable that (1) enumerates ALL known open, unresolved, and partially resolved problems across eight domains of human knowledge -- mathematics, logic and foundations, physics, computer science, consciousness and mind, philosophy, sociology and political science, and biology -- and (2) builds a proactive monitoring system that tracks new papers, claimed proofs, advances, and retractions for every cataloged problem.

The catalog extends the precedent set by the 66 Orthodox Open Problems (documented in `docs/research/orthodox-open-problems.md`) from the theological domain to the ENTIRE space of unsolved human questions. Each problem entry carries a Research Strength Index (RSI) measuring current research momentum, a 5-verb analysis (DEDUCE/ABDUCE/DETECT/STRESS/MONITOR), Mobius tier placement, school lineage from the 25 documented science schools, and a cross-reference to the Orthodox 66 problems where a theological analog exists.

The monitoring system transforms the catalog from a static snapshot into a LIVING document. Sources include arXiv, Nature, Science, Annals of Mathematics, Physical Review Letters, NeurIPS/ICML/ICLR proceedings, PhilPapers, and SSRN. The system computes RSI per problem from citation velocity, new author entry rates, conference attention, funding signals, and claimed proof frequency. Alerts fire on RSI spikes (>15 points in 30 days), claimed proofs, retractions, and prize announcements (Nobel, Fields, Abel, Turing). New developments feed into the Infer engine through a 5-verb analysis pipeline that updates proof chains, triggers state transitions in RSTMDB, and cross-references against the Orthodox mapping.

The Mobius tier architecture (`llm-insights/mobius-genesis/01-tier-architecture.md`) assigns tiers to each problem:
- **Tier 0**: Philosophy and Theology -- problem of induction, Euthyphro dilemma, problem of evil, moral realism
- **Tier 1**: Formal Power Systems -- Godel implications, Continuum Hypothesis, large cardinals, HoTT, P vs NP
- **Tier 2**: Scientific Pillars -- quantum gravity, dark matter, measurement problem, hard problem of consciousness
- **Tier 3**: Domain Frameworks -- Arrow impossibility, commons governance, institutional decay
- **Tier 4**: Applied Methodologies -- AI alignment, AI consciousness, explainability
- **Tier 5**: Technologies -- room temperature superconductivity, quantum supremacy for specific problem classes
- **Tier -1 to -4**: Pre-philosophical and pre-ontological -- why something rather than nothing, nature of time, origin of life

The strategic value: the catalog maps what humanity does NOT know, kept current. The Infer engine can answer "What changed about [open problem X] since [date Y]?" with structured evidence. No competitor combines problem cataloging, RSI tracking, 5-verb analysis, and theological cross-referencing in a single system.

## User Story

As a researcher or knowledge platform user, I want to browse ALL major open problems across science, philosophy, and sociology with per-problem research momentum scores, structured 5-verb analyses, and mappings to Orthodox theological analogs, so that I can (1) understand the current frontier of unsolved questions, (2) track which problems are gaining momentum and which are dormant, (3) receive alerts when a claimed proof or major advance appears, and (4) explore the connections between scientific open problems and the 66 Orthodox Open Problems that the platform documents.

## Acceptance Criteria

- [ ] AC1: Catalog contains 30+ mathematics open problems including all 7 Millennium Prize Problems (with Poincare marked solved), Hilbert's 23 (with per-problem solved/open/impossible status), and 15+ additional conjectures (Erdos, Langlands, ABC, Collatz, Goldbach, Twin Prime)
- [ ] AC2: Catalog contains 10+ logic and foundations open problems (Godel implications, Continuum Hypothesis, large cardinals, HoTT, Axiom of Choice, constructivism vs classical)
- [ ] AC3: Catalog contains 15+ physics open problems (quantum gravity, dark matter, dark energy, measurement problem, arrow of time, baryon asymmetry, black hole information paradox, fine-tuning, cosmological constant, vacuum catastrophe, quantum entanglement, turbulence, room temperature superconductivity)
- [ ] AC4: Catalog contains 10+ computer science open problems (P vs NP, AI alignment, AI consciousness, explainability, halting problem implications, quantum supremacy, one-way functions)
- [ ] AC5: Catalog contains 10+ consciousness and mind open problems (hard problem, binding problem, free will vs determinism, qualia, other minds, neural correlates, IIT vs GWT)
- [ ] AC6: Catalog contains 15+ philosophy open problems (induction, Gettier, Ship of Theseus, Euthyphro, evil, divine hiddenness, sorites, Newcomb, trolley family, personal identity, moral realism vs anti-realism)
- [ ] AC7: Catalog contains 10+ sociology and political science open problems (Arrow impossibility, commons, principal-agent, social dilemma, inequality dynamics, institutional decay, Dunbar's number in digital societies, filter bubble/polarization, post-truth epistemology)
- [ ] AC8: Catalog contains 10+ biology open problems (abiogenesis, protein folding, cancer, aging, consciousness emergence, Cambrian explosion, Fermi paradox)
- [ ] AC9: Each problem entry includes: name, domain, Mobius tier, status (Open/Partially Resolved/Claimed/Solved), year posed, posed by, clear statement, current state as of 2026, RSI (0-100), top 3 key recent papers, Orthodox analog mapping (or "None identified"), school lineage, and 5-verb status (DEDUCE/ABDUCE/DETECT/STRESS/MONITOR)
- [ ] AC10: Monitoring system defines sources with API/feed specifications (arXiv API, Semantic Scholar API, journal RSS feeds, conference proceedings crawlers, PhilPapers API, SSRN feed)
- [ ] AC11: Monitoring system defines trigger conditions: new paper citing a cataloged problem, claimed proof or disproof, major conference talk, prize announcement, retraction
- [ ] AC12: RSI computation formula defined: RSI = f(citation_velocity, new_author_entry_rate, conference_attention, funding_signals, claimed_proof_frequency) with scoring thresholds (>70 "Hot", 30-70 "Active", <30 "Dormant")
- [ ] AC13: Alert types defined: RSI spike (>15 points in 30 days), claimed proof, retraction, Nobel/Fields/Abel/Turing citation of a cataloged problem
- [ ] AC14: Update cycle defined: daily arXiv/preprint scan, weekly digest of all domain activity, monthly RSI recalculation for all cataloged problems
- [ ] AC15: 5-verb analysis pipeline defined: each new development processed through DEDUCE (what necessarily follows), ABDUCE (does this change the best explanation), DETECT (does this fill an evidence gap), STRESS (does this break an existing assumption), MONITOR (how does this shift the problem's RSI)
- [ ] AC16: Cross-reference to Orthodox 66 Problems completed for every cataloged problem, categorized as ANTICIPATED (Orthodox tradition addressed the question before the scientific formulation), PARALLEL (both remain open with identifiable structural correspondence), or NONE (no theological analog identified)
- [ ] AC17: Baseline catalog of 2020-2026 advances established for all 8 domains, giving the monitoring system a starting point
- [ ] AC18: Dashboard visualization designed: domain heatmap (color = RSI, organized by Mobius tier), RSI time series per problem, Orthodox mapping overlay toggle, alert feed, drill-down to full problem entry with 5-verb analysis
- [ ] AC19: Integration with Infer engine defined: new evidence from monitoring updates existing proof chains, triggers state transitions in problem status, produces structured ProofChain objects
- [ ] AC20: Integration with RSTMDB defined: new developments feed into the data ecosystem, RSI computation draws from RSTMDB citation and activity feeds

## Technical Requirements

- **Testing**: pytest for all unit and integration tests on monitoring pipeline, RSI computation, and alert logic
- **Linting**: ruff for code quality enforcement across all Python modules
- **Dependency management**: uv for reproducible environments and deterministic dependency resolution
- **CLI framework**: typer for command-line interfaces to the catalog browser, monitoring control, and alert management
- **Terminal output**: rich for formatted, colored output including RSI heatmaps, problem status displays, and alert notifications
- **Commits**: DCO sign-off required on every commit (`git commit -s`)
- **Monitoring sources**: arXiv API (daily polling), Semantic Scholar API (citation velocity), journal RSS (Nature, Science, PRL, Annals of Mathematics), conference proceedings (NeurIPS, ICML, ICLR, STOC, FOCS), PhilPapers API, SSRN feed
- **Data storage**: problem catalog entries as structured markdown with YAML frontmatter; RSI time series stored in append-only log format
- **Graph database**: Neo4j for cross-reference relationships between universal problems, Orthodox problems, and school lineages
- **Inference engine**: Infer (existing) for 5-verb analysis pipeline and proof chain updates
- **RSTMDB integration**: citation velocity and activity signals feed RSI computation

---

## Problem Entry Format

Each problem in the catalog follows this structure:

```markdown
## Problem N: [Name]

| Field | Value |
|-------|-------|
| Domain | [Mathematics / Physics / Logic & Foundations / Computer Science / Consciousness & Mind / Philosophy / Sociology & Political Science / Biology] |
| Tier | [Mobius tier: -4 to 5] |
| Status | [Open / Partially Resolved / Claimed / Solved] |
| Year Posed | [YYYY or "Ancient" for pre-modern formulations] |
| Posed By | [Name(s)] |
| RSI | [0-100] |
| Orthodox Analog | [Problem number from the 66, or "None identified"] |
| School Lineage | [Which of the 25 documented schools contributed] |

**Statement**: [Clear, unambiguous statement of the problem]

**Current State (2026)**: [What is known, what remains unknown, major recent developments]

**Key Papers**:
1. [Author, Title, Year -- most impactful recent paper]
2. [Author, Title, Year -- second]
3. [Author, Title, Year -- third]

**5-Verb Status**:
- **DEDUCE**: [What necessarily follows from current knowledge about this problem]
- **ABDUCE**: [Best current explanation or approach to resolution]
- **DETECT**: [What evidence gaps remain; what observations would advance the problem]
- **STRESS**: [What assumption, if broken, changes everything about this problem]
- **MONITOR**: [What to watch for next; triggers that would signal progress]
```

---

## Domain 1: Mathematics (30+ Problems)

### Millennium Prize Problems (7 total, 1 solved)

1. **Riemann Hypothesis** (1859, Riemann) -- Tier 1 -- RSI ~55 -- The non-trivial zeros of the Riemann zeta function all have real part 1/2. Unresolved. Over 10 trillion zeros verified computationally. Implications cascade through all of number theory.
2. **P vs NP** (1971, Cook/Levin) -- Tier 1 -- RSI ~60 -- Does every problem whose solution verification runs in polynomial time also have a solution findable in polynomial time? Unresolved. Barriers to proof (relativization, natural proofs, algebrization) suggest new techniques needed.
3. **Navier-Stokes Existence and Smoothness** (2000, Clay formulation; 1845 equations) -- Tier 2 -- RSI ~40 -- Do smooth solutions always exist for the 3D Navier-Stokes equations? Partial results. Connects to turbulence.
4. **Birch and Swinnerton-Dyer Conjecture** (1965) -- Tier 1 -- RSI ~35 -- The rank of an elliptic curve equals the order of vanishing of its L-function at s=1. Partial results (Coates-Wiles, Gross-Zagier, Kolyvagin).
5. **Hodge Conjecture** (1950, Hodge) -- Tier 1 -- RSI ~30 -- Certain cohomology classes on projective algebraic varieties are algebraic. Open.
6. **Yang-Mills Existence and Mass Gap** (2000, Clay formulation) -- Tier 2 -- RSI ~45 -- Yang-Mills theory has a mass gap: the quantum particles have positive mass even though the classical waves travel at the speed of light. Open. Connects quantum field theory to rigorous mathematics.
7. **Poincare Conjecture** (1904, Poincare) -- SOLVED (2003, Perelman) -- Every topologically 1-connected closed 3-manifold is homeomorphic to the 3-sphere. Fields Medal awarded 2006 (declined).

### Hilbert's 23 Problems (1900)

Status per problem: 10 solved, 4 partially resolved, 2 proven impossible (Godel showed #2 and #10 have negative resolutions in certain senses), remainder open or reformulated. The unsolved subset includes:
- Hilbert #8 (Riemann Hypothesis -- same as Millennium Problem above)
- Hilbert #12 (Extension of Kronecker's theorem on Abelian fields)
- Hilbert #15 (Rigorous foundation for Schubert's enumerative calculus)
- Hilbert #16 (Topology of algebraic curves and surfaces)

### Additional Major Conjectures

8. **Goldbach's Conjecture** (1742) -- Tier 1 -- RSI ~35 -- Every even integer greater than 2 is the sum of two primes. Verified computationally up to 4x10^18. Helfgott (2013) proved the weak version (every odd integer >5 is the sum of three primes).
9. **Twin Prime Conjecture** (Ancient, formalized 1846) -- Tier 1 -- RSI ~50 -- Infinitely many primes p such that p+2 is also prime. Zhang (2013) proved bounded gaps. Maynard-Tao reduced gap to 246. Full conjecture open.
10. **Collatz Conjecture** (1937) -- Tier 1 -- RSI ~25 -- For any positive integer, iterating n/2 (if even) or 3n+1 (if odd) always reaches 1. Verified for all numbers up to 2^68. Tao (2019) proved "almost all" orbits reach values close to 1.
11. **ABC Conjecture** (1985, Oesterle-Masser) -- Tier 1 -- RSI ~40 -- Mochizuki's 2012 claimed proof via Inter-Universal Teichmuller Theory remains contested in 2026. Scholze-Stix objections unresolved. The mathematical community has not reached consensus.
12. **Langlands Program** (1967, Langlands) -- Tier 1 -- RSI ~65 -- Grand unifying framework connecting number theory, representation theory, and algebraic geometry. Partially proven: Langlands for function fields over finite fields (Lafforgue, 2002). Geometric Langlands partially established (Fargues-Scholze, 2021). Full arithmetic Langlands remains the deepest open program in mathematics.
13. **Erdos-Straus Conjecture** (1948) -- Tier 1 -- RSI ~15 -- 4/n = 1/x + 1/y + 1/z has positive integer solutions for all n >= 2. Verified for n up to 10^17.
14. **Hadamard Conjecture** (1893) -- Tier 1 -- RSI ~20 -- Hadamard matrices exist for every order divisible by 4.
15. **Jacobian Conjecture** (1939, Keller) -- Tier 1 -- RSI ~20 -- A polynomial map from C^n to C^n with constant non-zero Jacobian determinant is bijective.
16. **Schanuel's Conjecture** (1960s) -- Tier 1 -- RSI ~15 -- A transcendence conjecture in number theory that would resolve many open questions about algebraic independence.
17. **Birch-Tate Conjecture** -- Tier 1 -- RSI ~20 -- Relates the order of K_2 of the ring of integers in a number field to the value of the Dedekind zeta function at s=-1.
18. **Katz-Sarnak Philosophy** -- Tier 1 -- RSI ~45 -- The distribution of zeros of L-functions follows random matrix statistics. Extensive computational evidence; no general proof.
19. **Homotopy Groups of Spheres** -- Tier 1 -- RSI ~50 -- Complete computation of pi_n(S^k) for all n, k. Ongoing project using motivic homotopy theory and spectral sequences. New computations regularly published.
20. **Inverse Galois Problem** (19th century) -- Tier 1 -- RSI ~25 -- Every finite group is the Galois group of an extension of the rationals. Known for solvable groups; open for general case.

---

## Domain 2: Logic & Foundations (10+ Problems)

21. **Implications of Godel's Incompleteness Theorems** (1931) -- Tier 1 -- RSI ~45 -- Which specific mathematical truths are unprovable in ZFC? Can we characterize the boundary between provable and unprovable? New unprovable statements keep emerging (Harvey Friedman's work on Boolean relation theory).
22. **Status of the Continuum Hypothesis** (1878, Cantor; independent of ZFC per Cohen 1963) -- Tier 1 -- RSI ~35 -- Is there a set with cardinality strictly between the integers and the reals? Godel (1940) showed CH is consistent with ZFC; Cohen (1963) showed its negation is too. Forcing axioms and inner model theory continue to explore which "universe of sets" we inhabit. Woodin's Ultimate-L program aims to settle CH.
23. **Large Cardinal Axioms** -- Tier 1 -- RSI ~40 -- Which large cardinal axioms are consistent? The hierarchy (inaccessible, Mahlo, measurable, Woodin, supercompact, Reinhardt) extends ZFC upward. Do Reinhardt cardinals exist in any consistent extension? Are large cardinals "true" or merely consistent?
24. **Homotopy Type Theory as Foundation** (2013, Univalent Foundations) -- Tier 1 -- RSI ~50 -- HoTT proposes replacing set theory with type theory as the foundation of mathematics. Practical implications: proof assistants (Lean, Coq, Agda) use type-theoretic foundations. Open: Is HoTT strictly more expressive than ZFC? Does univalence produce new theorems inaccessible from set theory?
25. **Axiom of Choice: Accept, Reject, or Restrict?** -- Tier 1 -- RSI ~20 -- AC produces Banach-Tarski paradox and non-measurable sets. Determinacy axioms (AD) contradict full AC but produce a "nicer" mathematical universe. Which foundational stance is correct? AD + DC (dependent choice) is a popular middle ground.
26. **Constructivism vs Classical Logic** -- Tier 1 -- RSI ~40 -- Brouwer rejected the law of excluded middle. Constructive mathematics (per Martin-Lof type theory) requires explicit construction of witnesses. With the rise of proof assistants, constructivism is gaining practical relevance. Open: are there theorems with classical but no constructive proof that matter for computation?
27. **Predicativism** (Weyl, Feferman) -- Tier 1 -- RSI ~15 -- How much of mathematics survives without impredicative definitions? Feferman's claim: "all scientifically applicable mathematics is predicative." Open: is this claim accurate?
28. **Reverse Mathematics** (Friedman, Simpson) -- Tier 1 -- RSI ~30 -- Determining the exact axioms needed for each theorem of mathematics. The "Big Five" subsystems of second-order arithmetic capture most ordinary mathematics. Open: are there natural theorems outside all five?
29. **Feasible Mathematics** -- Tier 1 -- RSI ~20 -- Is there a meaningful mathematical theory of only "feasibly computable" objects? Nelson's attempt to prove the inconsistency of arithmetic via ultrafinitism failed, but the program continues.
30. **Automated Theorem Proving Limits** -- Tier 1/4 -- RSI ~55 -- AlphaProof (2024) solved IMO problems at silver-medal level. Can AI systems prove open conjectures? What are the limits of machine-generated proofs? This intersects Godel (fundamental limits) with AI capabilities (practical limits).

---

## Domain 3: Physics (15+ Problems)

31. **Quantum Gravity** -- Tier 2 -- RSI ~70 -- Unifying general relativity and quantum mechanics. String theory (RSI declining: no experimental predictions in 20 years), loop quantum gravity (RSI rising: testable predictions emerging), and alternatives (causal sets, emergent gravity) all remain unproven. The central problem of theoretical physics.
32. **Dark Matter** -- Tier 2 -- RSI ~65 -- 27% of the universe by energy density, never directly detected. WIMPs not found by LUX-ZEPLIN (2024). Axion searches ongoing (ADMX). Modified gravity (MOND) explains galaxy rotation but fails at cluster scale. Primordial black holes remain a candidate.
33. **Dark Energy** -- Tier 2 -- RSI ~60 -- 68% of the universe, driving accelerated expansion (discovered 1998). Cosmological constant (Lambda) fits data but has no physical explanation. Quintessence models invoke dynamical scalar fields. DESI (2024) data hints at time-varying dark energy, contradicting the cosmological constant.
34. **Measurement Problem** -- Tier 2 -- RSI ~50 -- Why does quantum superposition appear to collapse upon measurement? Copenhagen interpretation (standard but philosophically vague), Many-Worlds (no collapse, RSI rising), decoherence (explains appearance of collapse but not the Born rule), objective collapse models (GRW, Penrose, testable). Wigner's friend experiments (2019-2025) probe the boundaries.
35. **Arrow of Time** -- Tier 2 -- RSI ~35 -- Why does time flow from past to future when fundamental physics is time-symmetric? Thermodynamic arrow (entropy increase), cosmological arrow (universe expansion), psychological arrow (memory formation). Past Hypothesis (Carroll, Albert): the low-entropy initial condition requires explanation.
36. **Baryon Asymmetry** -- Tier 2 -- RSI ~45 -- The universe contains more matter than antimatter. Sakharov conditions (1967) specify the requirements, but no confirmed mechanism. CP violation in the Standard Model falls short by orders of magnitude. Leptogenesis and electroweak baryogenesis remain hypothetical.
37. **Black Hole Information Paradox** -- Tier 2 -- RSI ~70 -- Does information falling into a black hole survive? Hawking radiation is thermal (carries no information). Page curve calculations (2019, using AdS/CFT) suggest information survives, but researchers debate the mechanism. Islands formula, ER=EPR conjecture, and firewall debates continue.
38. **Fine-Tuning Problem** -- Tier 2/0 -- RSI ~40 -- The physical constants of the universe appear precisely tuned for complex structure and life. Explanations: multiverse (anthropic), design (theological), necessity (unknown deeper theory), or observational bias. No consensus. Intersects theology directly.
39. **Cosmological Constant Problem** -- Tier 2 -- RSI ~55 -- Quantum field theory predicts a vacuum energy 10^120 times larger than observed. The worst quantitative prediction in physics. Supersymmetry, anthropic arguments, and modified gravity all fail to resolve the discrepancy convincingly.
40. **Vacuum Catastrophe** -- Tier 2 -- RSI ~35 -- Related to the cosmological constant problem. The predicted zero-point energy density diverges. Regularization removes the infinity but leaves the fine-tuning problem.
41. **Quantum Entanglement Mechanism** -- Tier 2 -- RSI ~55 -- Bell tests (1982-2022) confirm nonlocality beyond any reasonable doubt. But WHAT IS nonlocality? How does it work? Is spacetime emergent from entanglement (ER=EPR, Van Raamsdonk)? Entanglement is a resource (quantum information theory) but its ontological status remains debated.
42. **Turbulence** -- Tier 2 -- RSI ~40 -- Navier-Stokes equations describe fluid flow, but turbulent solutions resist analytical treatment. Kolmogorov's 1941 theory provides statistical predictions; intermittency corrections remain debated. A complete theory of turbulence does not exist.
43. **Room Temperature Superconductivity** -- Tier 5 -- RSI ~45 -- Repeated claims, repeated retractions (Dias 2023 retraction). LK-99 (2023) disproven. The search continues. BCS theory does not predict room-temperature mechanisms; unconventional superconductors (cuprates, hydrides) remain poorly understood.
44. **Proton Radius Puzzle** -- Tier 2 -- RSI ~30 -- Muonic hydrogen measurements (2010) gave a proton radius 4% smaller than electron scattering experiments. Recent measurements are converging, but the discrepancy sparked re-examination of QED calculations.
45. **Neutrino Masses and Mixing** -- Tier 2 -- RSI ~50 -- Neutrinos have mass (Nobel 2015), but the absolute mass scale, the mass hierarchy (normal vs inverted), and whether neutrinos are Majorana particles remain unknown. DUNE and JUNO experiments will address these by 2030.

---

## Domain 4: Computer Science (10+ Problems)

46. **P vs NP** (1971, Cook/Levin) -- Tier 1 -- RSI ~60 -- (Cross-listed with Mathematics, Millennium Prize #2.) The central open problem in theoretical computer science and one of the seven Millennium Prize Problems. Most researchers conjecture P != NP, but proof techniques face barriers (Baker-Gill-Solovay relativization, Razborov-Rudich natural proofs, Aaronson-Wigderson algebrization).
47. **AI Alignment** (2014, Bostrom/Russell formalization) -- Tier 4 -- RSI ~85 -- Ensuring AI systems pursue goals aligned with human values. Concrete subproblems: reward hacking, goal misgeneralization, deceptive alignment, scalable oversight, corrigibility. Active research at Anthropic, DeepMind, OpenAI, MIRI, and academic labs. No proven solution.
48. **AI Consciousness** -- Tier 4/0 -- RSI ~60 -- Can artificial systems have subjective experience? Depends on resolving the hard problem of consciousness (Domain 5). IIT (Tononi) suggests consciousness requires specific information integration patterns; current neural networks may lack these. No empirical test exists.
49. **Explainability / Interpretability** -- Tier 4 -- RSI ~75 -- Why does a neural network make the decisions it makes? Mechanistic interpretability (2023-2026) made significant progress: sparse autoencoders, circuit-level analysis, superposition understanding. Full interpretability of frontier models remains out of reach.
50. **Halting Problem Implications** -- Tier 1 -- RSI ~25 -- Turing (1936) proved no general algorithm decides whether an arbitrary program halts. Ongoing: which specific classes of programs have decidable halting? Rice's theorem generalizes the negative result. Practical implications for software verification remain active.
51. **Quantum Supremacy (Practical)** -- Tier 4 -- RSI ~55 -- Google claimed quantum supremacy (2019), IBM contested it (2024). For which practical problems do quantum computers provide proven exponential speedup? Shor's algorithm (factoring), Grover's algorithm (search, quadratic speedup), variational algorithms (chemistry, unproven advantage). Fault-tolerant quantum computing remains years away.
52. **One-Way Functions** -- Tier 1 -- RSI ~35 -- Do one-way functions exist? The entire edifice of computational cryptography depends on this unproven assumption. If P=NP, no one-way functions exist. Even if P!=NP, one-way functions may still not exist.
53. **BPP vs P** -- Tier 1 -- RSI ~20 -- Is randomness computationally useful? Conjectured BPP = P (randomness does not help). Derandomization results support this but a full proof is missing.
54. **Natural Proofs Barrier** -- Tier 1 -- RSI ~30 -- Razborov-Rudich (1997) showed that "natural" proof techniques cannot separate P from NP if one-way functions exist. How to prove circuit lower bounds by non-natural methods? Ryan Williams' approach using algorithm design to prove lower bounds is the leading strategy.
55. **Complexity of Matrix Multiplication** -- Tier 1/4 -- RSI ~45 -- The exponent omega of matrix multiplication: omega=2 conjectured, best known ~2.37 (Alman-Vassilevska Williams). AlphaCode-style systems have found new algorithms (2022), but the optimal exponent remains unknown.

---

## Domain 5: Consciousness & Mind (10+ Problems)

56. **Hard Problem of Consciousness** (1995, Chalmers) -- Tier 0/2 -- RSI ~55 -- Why is there subjective experience? Why does neural processing produce qualia? Physicalism says consciousness reduces to physics (but has not shown how). Property dualism says consciousness functions as a fundamental property. IIT and GWT offer competing theories but neither achieves confirmation.
57. **Binding Problem** -- Tier 2 -- RSI ~40 -- How does the brain unify separate sensory streams (color, shape, motion, sound) into a single coherent experience? Temporal synchrony (40 Hz gamma binding, Crick-Koch) is one hypothesis. Global workspace theory (Baars, Dehaene) provides a functional account but not a mechanistic one.
58. **Free Will vs Determinism** -- Tier 0 -- RSI ~45 -- Does genuine choice exist in a universe governed by physical law? Libet experiments (1983) showed neural preparation before conscious decision. Subsequent work (Schurger 2012) reinterpreted Libet's data as neural noise, not pre-determination. Compatibilism (Frankfurt, Dennett) dominates philosophy; hard determinism (Harris) and libertarian free will (Kane) hold minority positions.
59. **Qualia** -- Tier 0 -- RSI ~35 -- Why does red FEEL like red? Mary's Room (Jackson 1982): a color scientist who has never seen red learns something new upon seeing it. This suggests physical knowledge is incomplete. Dennett's "quining qualia" argues qualia do not exist as traditionally conceived. No resolution.
60. **Other Minds Problem** -- Tier 0 -- RSI ~30 -- You cannot PROVE another being is conscious. Behavioral indicators (Turing Test, mirror self-recognition) are indirect. The "philosophical zombie" thought experiment (Chalmers) highlights the gap. AI systems make this urgent: is GPT-5 conscious? No empirical test can settle the question with current understanding.
61. **Neural Correlates of Consciousness (NCC)** -- Tier 2 -- RSI ~55 -- Which neural processes correlate with conscious experience? Koch, Crick, and Dehaene have mapped many correlates (prefrontal cortex activation, recurrent processing, ignition events). Open: are correlates causally necessary? Are there multiple sufficient neural architectures for consciousness?
62. **IIT vs GWT** -- Tier 2 -- RSI ~50 -- Integrated Information Theory (Tononi, 2004) posits consciousness = integrated information (Phi). Global Workspace Theory (Baars, 1988; Dehaene) posits consciousness = global broadcast of information. The COGITATE consortium (2023-2025) tested predictions of both theories. Results came back mixed: neither theory achieved definitive confirmation or refutation.
63. **Consciousness and Quantum Mechanics** -- Tier 2/0 -- RSI ~25 -- Does consciousness play a role in quantum measurement? Penrose-Hameroff Orch-OR proposes quantum processes in microtubules generate consciousness. Mainstream physics rejects this; decoherence times in the brain are too short. The question persists at the philosophy-physics boundary.
64. **Animal and Machine Consciousness** -- Tier 2/4 -- RSI ~45 -- The New York Declaration on Animal Consciousness (2024) acknowledged the realistic possibility of consciousness in a wide range of animals. Machine consciousness has no accepted framework. The moral status of awareness-capable AI systems is an open ethical question.
65. **Emergence of Consciousness** -- Tier 2 -- RSI ~40 -- At what level of biological complexity does consciousness arise? Single cells, neural networks, specific architectures, or something else? The "consciousness dial" (degrees of consciousness) vs "consciousness switch" (all-or-nothing) debate remains unresolved.

---

## Domain 6: Philosophy (15+ Problems)

66. **Problem of Induction** (1739, Hume) -- Tier 0 -- RSI ~25 -- ALL science rests on the assumption that observed patterns continue into unobserved cases. Hume showed this assumption finds no justification by logic (circular) or experience (also circular). Popper's falsificationism sidesteps but does not solve the problem. Bayesianism provides a framework but still assumes the uniformity of nature as a prior.
67. **Gettier Problem** (1963, Gettier) -- Tier 0 -- RSI ~20 -- What IS knowledge? Justified true belief fails: Gettier showed cases where someone has a justified true belief that is true by luck. Proposed fixes: no false lemmas (Harman), reliabilism (Goldman), knowledge-first (Williamson). No consensus on the correct analysis of knowledge.
68. **Ship of Theseus** (Ancient, Plutarch) -- Tier 0 -- RSI ~15 -- If every plank of a ship receives replacement, is it the same ship? Extends to personal identity, corporate identity, and code refactoring. Four-dimensionalism (temporal parts) provides one framework; others reject identity over time as a genuine relation.
69. **Euthyphro Dilemma** (Plato) -- Tier 0 -- RSI ~20 -- Is the good commanded by God because it is good (limiting divine sovereignty), or is it good because God commands it (making morality arbitrary)? Divine command theory (Adams, modified) and natural law (Aquinas) offer responses. The dilemma resurfaces in AI alignment: do aligned values hold goodness through alignment, or alignment through goodness?
70. **Problem of Evil** (Epicurus, Hume) -- Tier 0 -- RSI ~30 -- If God is omnipotent, omniscient, and omnibenevolent, why does evil exist? Theodicies: free will defense (Plantinga), soul-making (Hick), greater good, mystery (apophatic). The logical problem of evil (Mackie) stands as solved by Plantinga's free will defense; the evidential problem (Rowe, Draper) remains open.
71. **Problem of Divine Hiddenness** (1993, Schellenberg) -- Tier 0 -- RSI ~35 -- If a loving God exists, why is God's existence not more obvious? Why do reasonable nonbelievers exist? Responses: divine respect for freedom (Swinburne), soteriological distance (Moser), the "dark night" tradition (mystical theology). Cross-references directly to Orthodox apophatic theology.
72. **Sorites Paradox** (Ancient, Eubulides) -- Tier 0 -- RSI ~20 -- When does a heap become not-a-heap? Removing one grain from a heap leaves a heap, but repeated removal eliminates the heap. The paradox targets vagueness in language. Proposed solutions: supervaluationism, epistemic theory (Williamson), fuzzy logic. No consensus.
73. **Newcomb's Problem** (1960s, Nozick) -- Tier 0 -- RSI ~25 -- A perfect predictor offers you two boxes. Decision theory paradox between one-boxing (expected utility) and two-boxing (causal dominance). Evidential decision theory vs causal decision theory. Functional decision theory (Yudkowsky-Soares) is a recent addition. No resolution.
74. **Trolley Problem Family** -- Tier 0/3 -- RSI ~30 -- Moral intuitions diverge between the trolley switch case (most people pull) and the footbridge case (most people refuse to push). What explains this divergence? Dual-process theory (Greene), deontological constraints (Kamm), or something else? Relevant to autonomous vehicle ethics and AI decision-making.
75. **Personal Identity** -- Tier 0 -- RSI ~25 -- What makes you YOU across time? Psychological continuity (Locke, Parfit), biological continuity, narrative identity. Parfit's Reasons and Persons (1984) argued personal identity is not what matters; what matters is psychological continuity and connectedness. The teleporter thought experiment and fission cases remain unresolved.
76. **Moral Realism vs Anti-Realism** -- Tier 0 -- RSI ~30 -- Do moral facts exist independently of human opinion? Moral realism (Enoch, Shafer-Landau) says yes. Error theory (Mackie) says moral claims fail systematically. Expressivism (Blackburn, Gibbard) says moral claims express attitudes, not beliefs. Constructivism (Korsgaard, Street) says moral facts emerge through construction. No consensus.
77. **Is-Ought Gap** (1739, Hume) -- Tier 0 -- RSI ~20 -- No purely descriptive premises entail normative conclusions. Every ethical theory must bridge this gap. Naturalists (Foot, Railton) claim natural facts ground moral facts. Anti-naturalists (Moore's open question argument) deny this. The gap remains.
78. **Epistemological Disjunctivism** -- Tier 0 -- RSI ~20 -- When you perceive reality correctly, is your mental state fundamentally different from a perfect hallucination, or merely causally different? McDowell and Pritchard argue for disjunctivism (fundamentally different); representationalists argue for common-factor views.
79. **Abstract Objects** -- Tier 0/1 -- RSI ~15 -- Do numbers, sets, and propositions exist? Platonism says yes (they exist in an abstract realm). Nominalism says no (only concrete objects exist). Structuralism says mathematical objects are positions in structures. Fictionalism says mathematical claims are useful fictions. This intersects foundations of mathematics (Domain 2).
80. **Meta-Ethics: Motivation Problem** -- Tier 0 -- RSI ~20 -- If moral facts exist (realism), how do they motivate action? Pure facts do not compel behavior. Internalism says moral beliefs necessarily motivate; externalism says motivation is separate. The amoralist challenge: if someone knows what is right but does not care, is that coherent?

---

## Domain 7: Sociology & Political Science (10+ Problems)

81. **Arrow's Impossibility Theorem** (1951) -- Tier 3 -- RSI ~25 -- No voting system with 3+ candidates can simultaneously satisfy unrestricted domain, non-dictatorship, Pareto efficiency, and independence of irrelevant alternatives. Practical implication: all voting systems have exploitable flaws. Ongoing work: approval voting, quadratic voting, liquid democracy attempt to find the least-bad system.
82. **Tragedy of the Commons** (1968, Hardin; refined by Ostrom) -- Tier 3 -- RSI ~40 -- How to govern shared resources without overexploitation? Ostrom's 8 design principles for successful commons (1990 Nobel) advanced the field, but scaling these principles to global commons (climate, oceans, atmosphere) remains unsolved. Digital commons (open source, data) present new challenges.
83. **Principal-Agent Problem** -- Tier 3 -- RSI ~35 -- How to align incentives when the agent has more information than the principal? Corporate governance, democratic representation, AI deployment all exhibit this structure. Mechanism design (Myerson, Maskin) provides partial solutions. Complete alignment without full information appears impossible.
84. **Social Dilemma** -- Tier 3 -- RSI ~30 -- Individual rationality produces collective irrationality (Prisoner's Dilemma, public goods provision). Repeated games, reputation systems, and institutional design mitigate but do not eliminate the tension. Digital platforms create new social dilemmas (content moderation, algorithmic amplification).
85. **Inequality Dynamics** (Piketty, 2013) -- Tier 3 -- RSI ~50 -- When r > g (return on capital exceeds growth rate), wealth concentrates. Historical data confirms this tendency except during world wars and exceptional policy interventions. Is persistent inequality a structural feature of capitalism? Can policy sustainably counteract concentration without destroying growth?
86. **Institutional Decay** (Olson, Acemoglu) -- Tier 3 -- RSI ~45 -- Why do successful institutions degrade over time? Olson's Logic of Collective Action (1965): narrow interest groups accumulate and sclerotize institutions. Acemoglu-Robinson (2012): extractive institutions replace inclusive ones. No proven method prevents long-term institutional decay across political systems.
87. **Dunbar's Number in Digital Societies** -- Tier 3 -- RSI ~30 -- Dunbar (1992) proposed a cognitive limit of ~150 stable social relationships. Does this hold in digital environments? Social media users have hundreds of "friends" but research suggests deep relationships remain limited. Implications for online communities, distributed organizations, and DAO governance.
88. **Filter Bubble / Polarization** -- Tier 3/5 -- RSI ~55 -- Algorithmic content curation creates information silos. Sunstein (2001) predicted "echo chambers." Empirical evidence remains mixed: multiple studies find increased polarization, while others find greater exposure to cross-cutting content. The mechanism (algorithmic vs self-selection) and solution (regulation, design changes, media literacy) remain debated.
89. **Post-Truth Epistemology** -- Tier 3/0 -- RSI ~45 -- How do societies lose shared epistemological standards? Deepfakes, LLM-generated misinformation, declining trust in institutions, and alternative fact ecosystems create a crisis of shared truth. No proven intervention restores epistemological common ground at scale.
90. **Collective Intelligence Scaling** -- Tier 3 -- RSI ~40 -- Groups can outperform individuals (wisdom of crowds, Condorcet jury theorem), but group failures are common (groupthink, information cascades). What architectures reliably produce collective intelligence? DAOs, prediction markets, and federated learning attempt this, with mixed results.

---

## Domain 8: Biology (10+ Problems)

91. **Origin of Life (Abiogenesis)** -- Tier -1/2 -- RSI ~55 -- How did non-living chemistry become biology? RNA World hypothesis (RNA as both information carrier and catalyst) is leading but unconfirmed. Alternative: metabolism-first (iron-sulfur world). No laboratory experiment has produced a self-replicating system from prebiotic chemistry. Miller-Urey (1953) showed amino acid synthesis; the gap from amino acids to cells remains vast.
92. **Protein Folding** -- Tier 2/4 -- RSI ~60 -- AlphaFold (2020) predicts protein structures with high accuracy. Open: AlphaFold does not explain WHY proteins fold as they do (the physics), does not predict protein-protein interactions reliably, and misses intrinsically disordered proteins. The protein design problem (inverse folding) remains partially solved.
93. **Cancer (Complete Understanding)** -- Tier 2 -- RSI ~75 -- Cancer is not one disease but hundreds. Immunotherapy breakthroughs (CAR-T, checkpoint inhibitors) have transformed treatment for specific cancers. Open: metastasis mechanisms, tumor microenvironment manipulation, drug resistance evolution, early detection for all cancer types, and why certain cancers resist all treatment.
94. **Aging** -- Tier 2 -- RSI ~70 -- Is aging a programmed process or accumulated damage? Hallmarks of aging (Lopez-Otin, 2013, updated 2023): genomic instability, telomere attrition, epigenetic alterations, loss of proteostasis, deregulated nutrient sensing, mitochondrial dysfunction, cellular senescence, stem cell exhaustion, altered intercellular communication, disabled macroautophagy, chronic inflammation, dysbiosis. Senolytics, epigenetic reprogramming (Yamanaka factors), and rapamycin analogs show promise in model organisms. Human translation remains early.
95. **Consciousness Emergence in Biology** -- Tier 2/0 -- RSI ~40 -- (Cross-listed with Domain 5.) At what point in biological evolution did consciousness arise? Is it gradual (panpsychism, IIT) or sudden (threshold complexity)? The New York Declaration on Animal Consciousness (2024) acknowledged the realistic possibility across diverse taxa. Behavioral tests (mirror test, metacognition tasks) provide indirect evidence.
96. **Cambrian Explosion** -- Tier 2 -- RSI ~35 -- 540 million years ago, most major animal phyla appeared within a geologically brief 20-million-year window. Why? Hypotheses: oxygen rise, genetic toolkit (Hox genes), ecological arms race, snowball Earth recovery. No single explanation is sufficient.
97. **Fermi Paradox** (1950, Fermi) -- Tier 2/0 -- RSI ~50 -- The universe is vast and old; intelligent life would be common. Where is it? Great Filter hypothesis, Rare Earth hypothesis, Dark Forest hypothesis, zoo hypothesis. No SETI detection confirmed. James Webb Space Telescope biosignature searches on exoplanet atmospheres began in 2023.
98. **Gene Regulation Complexity** -- Tier 2 -- RSI ~55 -- The human genome has ~20,000 protein-coding genes, but gene regulation (epigenetics, non-coding RNA, 3D chromatin structure, phase separation) adds layers of complexity that remain poorly understood. ENCODE project mapped functional elements; interpretation is ongoing.
99. **Microbiome and Disease** -- Tier 2 -- RSI ~60 -- The gut microbiome contains 100 trillion organisms influencing metabolism, immunity, and brain function (gut-brain axis). Causation vs correlation remains the central challenge. Fecal microbiota transplant works for C. difficile but has not reliably treated other conditions.
100. **Extinction Dynamics** -- Tier 2/3 -- RSI ~45 -- The current extinction rate is 100-1000x the background rate (sixth mass extinction). Quantifying species loss, predicting tipping points, and designing effective conservation at planetary scale remain unsolved. De-extinction technology (woolly mammoth, passenger pigeon via gene editing) raises ethical and ecological questions.

---

## Monitoring System Architecture

### Sources and API Specifications

| Source | Type | API/Feed | Polling Frequency | Coverage |
|--------|------|----------|-------------------|----------|
| arXiv | Preprints | arXiv API (OAI-PMH, REST) | Daily | Mathematics, Physics, CS, Biology (q-bio) |
| Semantic Scholar | Citations | Semantic Scholar Academic Graph API | Weekly | Citation velocity, new author detection |
| Nature | Journal | RSS + Springer Nature API | Weekly | All domains |
| Science | Journal | RSS | Weekly | All domains |
| Physical Review Letters | Journal | APS API + RSS | Weekly | Physics |
| Annals of Mathematics | Journal | RSS | Monthly | Mathematics |
| NeurIPS / ICML / ICLR | Conference | OpenReview API | Per conference cycle | AI/ML/CS |
| STOC / FOCS | Conference | DBLP API | Per conference cycle | Theoretical CS |
| PhilPapers | Preprints | PhilPapers API | Weekly | Philosophy, Consciousness |
| SSRN | Preprints | SSRN API | Weekly | Sociology, Political Science, Economics |
| Millennium Prize Committee | Announcements | Web scrape + RSS | Monthly | Millennium problems |
| Nobel / Fields / Abel / Turing | Prizes | Web scrape | Annual + immediate on announcement | All domains |

### Trigger Conditions

| Trigger | Definition | Response |
|---------|------------|----------|
| New Citation | A new paper cites a cataloged problem by name or key reference | Add to problem's citation log; update citation velocity in RSI |
| Claimed Proof | A preprint or paper claims to prove/disprove a cataloged open problem | ALERT: initiate 5-verb analysis; flag for expert review |
| Prize Announcement | A Nobel, Fields, Abel, or Turing citation references a cataloged problem | ALERT: update problem status; recalculate RSI |
| Retraction | A previously claimed proof or major advance undergoes retraction | ALERT: revert status change; flag in problem history |
| RSI Spike | RSI increases >15 points within 30 days | ALERT: something is happening; trigger investigation |
| Conference Focus | A major conference dedicates a session/workshop to a cataloged problem | Update conference_attention signal in RSI |
| New Author Entry | A researcher not previously working on a cataloged problem publishes on it | Update new_author_entry rate in RSI |
| Funding Signal | A major grant (NSF, ERC, DARPA) targets a cataloged problem | Update funding_signals in RSI |

### RSI Computation Formula

```
RSI(problem, t) = w1 * citation_velocity(problem, t)
                + w2 * new_author_entry_rate(problem, t)
                + w3 * conference_attention(problem, t)
                + w4 * funding_signals(problem, t)
                + w5 * claimed_proof_frequency(problem, t)
                - w6 * retraction_penalty(problem, t)

where:
  citation_velocity    = papers/month citing this problem (normalized)
  new_author_entry_rate = fraction of new authors in last 12 months
  conference_attention  = dedicated sessions/workshops in last 12 months (normalized)
  funding_signals       = new grants targeting this problem in last 12 months (normalized)
  claimed_proof_frequency = claimed proofs/disproofs in last 24 months (normalized)
  retraction_penalty    = retractions in last 24 months (normalized, subtracted)

  w1..w6 = domain-specific weights (trade secret, tuned per domain)

Thresholds:
  RSI > 70:  "Hot" -- major activity, breakthrough may be imminent
  RSI 30-70: "Active" -- steady research, no imminent resolution
  RSI < 30:  "Dormant" -- limited current activity
  RSI spike (>15 points in 30 days): "Alert" -- sudden increase demands investigation
```

### Update Cycle

| Cycle | Actions |
|-------|---------|
| Daily | Scan arXiv for new preprints matching cataloged problem keywords and citation clusters |
| Weekly | Aggregate citation velocity from Semantic Scholar; scan journal RSS feeds; generate weekly digest per domain |
| Monthly | Recalculate RSI for all 100+ cataloged problems; generate monthly report with RSI trends and status changes |
| Per Event | On any ALERT trigger: run 5-verb analysis, update problem entry, notify subscribers |

### 5-Verb Analysis Pipeline

When the monitoring system detects a new development (paper, proof claim, retraction, prize), the pipeline applies:

```
INPUT: New development D affecting Problem P

STEP 1 - DEDUCE:
  Given D, what necessarily follows?
  → Update the "what is known" section of P
  → If D is a proof: verify logical chain against existing proof chains in Infer

STEP 2 - ABDUCE:
  Does D change the best explanation for P?
  → Update "best current approach" ranking
  → If D eliminates an approach: mark approach as refuted

STEP 3 - DETECT:
  Does D fill an evidence gap for P?
  → Update "evidence gaps remaining" list
  → If gap filled: mark in problem entry with citation

STEP 4 - STRESS:
  Does D break any assumption underlying the current state of P?
  → If assumption broken: cascade to all dependent problems
  → Update "what assumption, if broken, changes everything"

STEP 5 - MONITOR:
  How does D shift P's RSI?
  → Recalculate RSI for P
  → If RSI change > 15 points: fire RSI spike alert
  → Update the "what to watch for next" section
```

### Infer Engine Integration

```
New Development D
       │
       ▼
[5-Verb Analysis Pipeline]
       │
       ├──→ Infer: update existing proof chains affected by D
       ├──→ RSTMDB: feed citation and activity data for RSI computation
       ├──→ Problem Catalog: update problem entry (status, RSI, key papers)
       └──→ Orthodox Cross-Reference: check if D affects any Orthodox mapping
              │
              ▼
       [Alert System] ──→ Subscribers (email, dashboard, API webhook)
```

### AxiomVM Integration

For problems in mathematics and logic, the monitoring system connects to AxiomVM for deterministic verification:

- Claimed proofs with formal representations feed into AxiomVM for machine-checkable verification
- Verification results feed back into the 5-verb analysis (DEDUCE step: verified/unverified/error)
- This provides a ground truth layer for mathematical claimed proofs that no other monitoring system offers

---

## Cross-Reference to Orthodox 66 Problems

### Mapping Categories

| Category | Definition | Example |
|----------|------------|---------|
| **ANTICIPATED** | Orthodox tradition addressed the structural question before the scientific formulation existed | Free will (patristic debate, 4th-8th century) → Free will vs determinism (Libet 1983, neuroscience) |
| **PARALLEL** | Both the scientific and theological formulations remain open with identifiable structural correspondence | Fine-tuning problem ↔ Why did God create (Orthodox Problem #2) |
| **NONE** | No identified theological analog for this scientific problem | P vs NP, Navier-Stokes, protein folding |

### Selected Mappings (Full table in cross-reference task)

| Science Problem | Orthodox Problem | Category | Structural Correspondence |
|----------------|-----------------|----------|--------------------------|
| Godel Incompleteness (#21) | Apophatic theology (all 66 problems) | ANTICIPATED | No formal system achieves completeness ↔ God is beyond all positive description |
| Fine-Tuning (#38) | Why God Created (#2) | PARALLEL | Physical constants tuned for life ↔ creation as free act of divine love |
| Arrow of Time (#35) | Divine Timelessness (#3) | PARALLEL | Asymmetry of temporal flow ↔ eternity as non-temporal divine mode |
| Hard Problem of Consciousness (#56) | Theosis / Deification | ANTICIPATED | Why subjective experience? ↔ human nature destined for union with divine, consciousness as participation in divine life |
| Free Will vs Determinism (#58) | Synergy (divine-human cooperation) | ANTICIPATED | Genuine choice in physical universe ↔ patristic insistence on human freedom cooperating with divine grace |
| Problem of Evil (#70) | Origin of Evil / Dennitsa (#7) | PARALLEL | Omnipotent + good + evil exists ↔ why did a perfect being choose evil? |
| Problem of Induction (#66) | Apophatic epistemology | ANTICIPATED | Science rests on unjustifiable assumption ↔ apophatic tradition: positive knowledge always incomplete |
| Fermi Paradox (#97) | Theological uniqueness of Earth/humanity | PARALLEL | Where is everyone? ↔ Is Earth/humanity uniquely purposed in creation? |
| AI Alignment (#47) | Synergy + Dennitsa (#7, #8) | PARALLEL | How to align AI with human values ↔ how free beings choose good vs evil |
| Institutional Decay (#86) | Ecclesiological continuity | PARALLEL | Why do institutions degrade? ↔ How has the Church maintained continuity for 2000 years? |
| Origin of Life (#91) | Creation from nothing | PARALLEL | How did chemistry become biology? ↔ How did nothing become something? |
| Kolmogorov Complexity | Palamas essence-energies | ANTICIPATED | Irreducible complexity of descriptions ↔ divine essence is beyond all description, only energies are knowable |
| Measurement Problem (#34) | Observer in Orthodox epistemology | PARALLEL | Observation affects reality ↔ the knower participates in what is known (patristic epistemology) |

---

## Dashboard Visualization Design

### Domain Heatmap

A grid visualization where:
- **Columns** = 8 domains (Mathematics, Logic, Physics, CS, Consciousness, Philosophy, Sociology, Biology)
- **Rows** = Mobius tiers (-4 to 5)
- **Cell color intensity** = average RSI of problems in that cell
- **Cell size** = number of problems in that cell
- Click any cell to see the list of problems it contains

### RSI Time Series

Per-problem line chart showing RSI over time (monthly data points). Features:
- Spike annotations (claimed proof, major paper, prize)
- Trend lines (6-month moving average)
- Domain-average overlay for comparison

### Orthodox Mapping Overlay

Toggle button that overlays the Orthodox cross-reference:
- Problems with ANTICIPATED mapping: gold border
- Problems with PARALLEL mapping: silver border
- Problems with NONE mapping: no border
- Click any mapped problem to see the correspondence detail

### Alert Feed

Real-time scrolling feed showing:
- RSI spikes (red indicator)
- Claimed proofs (yellow indicator)
- Retractions (black indicator)
- Prize announcements (gold indicator)
- New major papers (blue indicator)

### Drill-Down View

Click any problem to see:
- Full problem entry (all fields from the Problem Entry Format)
- 5-verb analysis history (all analyses chronologically)
- RSI time series for this specific problem
- Proof chain from Infer (if applicable)
- Orthodox mapping detail (if applicable)
- Recent monitoring events for this problem

---

## Dependencies and Constraints

### Dependencies

| Dependency | Status | Impact |
|-----------|--------|--------|
| Orthodox 66 Open Problems | COMPLETED | Cross-reference target for all mappings |
| Infer engine | EXISTS (internal) | 5-verb analysis pipeline, proof chain updates |
| RSTMDB ecosystem | EXISTS (internal) | Citation and activity data feeds for RSI |
| AxiomVM | EXISTS (internal) | Deterministic verification of claimed math proofs |
| 25 school research documents | COMPLETED | School lineage data for each problem |
| Mobius tier architecture | COMPLETED | Tier assignment framework |
| Neo4j graph database | REQUIRED | Cross-reference relationship storage |
| Monitoring API access | REQUIRED | arXiv, Semantic Scholar, journal RSS feeds |

### Constraints

1. **Accuracy over completeness**: Every problem entry must state verifiable facts about current status. Where status remains disputed (ABC conjecture, room temperature superconductivity claims), present all sides without taking a position.
2. **RSI is advisory, not authoritative**: RSI measures research momentum, not proximity to solution. A problem with RSI 90 does not necessarily stand close to resolution; it has high current activity.
3. **Cross-reference rigor**: Orthodox mappings must identify specific structural correspondence, not vague thematic similarity. "Both are about knowledge" falls short; "both assert fundamental limits on positive description via parallel formal arguments" passes the bar.
4. **Monitoring rate limits**: External APIs (Semantic Scholar, arXiv) have rate limits. The system must implement caching, exponential backoff, and priority queuing to stay within limits.
5. **Living document maintenance**: The catalog requires ongoing human review of automated updates. AI-generated 5-verb analyses are drafts that experts validate before publication.

---

*Spec generated by PM Planner Agent. Revision: Universal Open Problems Catalog with Proactive Monitoring System.*
