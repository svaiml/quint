# ADR-001: Positioning Document Architecture

## Status

Accepted

## Context

The Infer Ecosystem spans 6+ repositories under `reasoning-universe/`. We need positioning materials (overview README, comparison matrix, decision guide, examples, roadmap) that are discoverable, maintainable, and accurate.

Key forces:
- Developers discover projects via GitHub repo landing pages (README.md)
- Positioning docs reference capabilities across all 6 projects
- Docs must stay current as underlying projects evolve
- Three distinct personas with different needs (developer, academic, engineering leader)
- The ecosystem is pre-1.0 — credibility depends on honest, verifiable claims

Four decisions are captured here.

---

## Decision 1: Document Location — ZZ-Notation Repo with Cross-Links

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| A. New top-level `reasoning-universe` repo | Single home, clean separation | Yet another repo to maintain, fragmented discoverability |
| B. Per-project READMEs with cross-links | Each project self-contained | No single entry point, duplication risk |
| C. Dedicated `docs/` in zz-notation repo | Already has docs structure, flowspec scaffold | ZZ-notation is not the whole ecosystem |
| D. GitHub Pages / external site | Rich formatting, analytics | Extra tooling, deploy pipeline, maintenance |

**Decision**: **Option C** — Host all positioning docs in `zz-notation/docs/` with cross-repo links.

**Rationale**: zz-notation is the "central node" of the ecosystem (per architecture.md). It already has the docs scaffold from flowspec init. Adding a new repo creates fragmentation. GitHub Pages is premature for pre-1.0 projects. Each individual project README should link back to the ecosystem overview in zz-notation.

**Future migration**: When the ecosystem reaches 1.0, consider Option D (GitHub Pages generated from these markdown files).

---

## Decision 2: Comparison Matrix Format — Structured Markdown with Verification Footnotes

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| A. Single markdown table | Simple, GitHub-renderable | Wide tables are hard to read, hard to update |
| B. YAML/JSON data rendered to multiple formats | Structured, machine-readable, generate multiple views | Over-engineering for 10 frameworks |
| C. Interactive web page (WASM) | Rich filtering, sorting | Requires deployment, maintenance, JS/WASM build |
| D. Multiple focused pages (1 per competitor) | Deep per-competitor analysis | No single comparison view, harder to scan |

**Decision**: **Option A+D hybrid** — One master markdown table (summary view) plus per-competitor detail sections in the same document.

**Format**:
- Top: Summary table with 10 columns (frameworks) x 15 rows (dimensions), using symbols (checkmark, dash, tilde) for scannability
- Below: Per-competitor sections with prose explanations, source links, and "Choose X when..." guidance
- Footer: Verification footnotes with source URLs and "last verified" dates

**Rationale**: Markdown tables render on GitHub without tooling. The hybrid keeps the scannable overview while allowing depth. YAML/JSON is over-engineering for a manually-curated document. The interactive web page can be built later from this markdown as source-of-truth.

---

## Decision 3: Example Strategy — Runnable .infer Files with Narrative README

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| A. Runnable .infer files with README commentary | Verifiable, testable in CI, demonstrates real syntax | Requires infer CLI to run, limited to infer features |
| B. Side-by-side code comparisons (infer vs Prolog) | Powerful visual impact | Requires competitor tooling to verify, maintenance burden |
| C. Literate programming documents | Rich narrative | Not runnable, can drift from reality |
| D. Video/screencast demos | Engaging, shows real workflow | Not searchable, expensive to update, accessibility concerns |

**Decision**: **Option A** — Runnable `.infer` files in `examples/positioning/` with a README providing narrative and competitor comparison.

**Structure**:
```
examples/positioning/
  README.md              # Narrative: what each example shows, competitor comparison
  01-abduction.infer     # retroduce example (runnable)
  02-evidence.infer      # gap_detect + sensitivity (runnable)
  03-contradiction.infer # Belnap paraconsistent logic (runnable)
```

Each README section includes:
- Problem statement
- Infer solution (reference to .infer file)
- How you'd attempt this in Prolog/TLA+/ASP (narrative, not runnable)
- What's different and why

**Rationale**: Runnable files are verifiable — CI can execute them and check output. Competitor comparisons are narrative (we don't maintain competitor toolchains). This keeps maintenance low while providing concrete proof.

For ZZ-notation examples (Belnap logic, state engine): use pseudo-code marked as "planned for v0.1" until the evaluator is implemented (TASK-4 through TASK-6).

---

## Decision 4: Positioning Tone — Honest Engineering

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| A. Academic (precise, cited, understated) | Credible with researchers, citable | Too dry for developers, doesn't convey urgency |
| B. Developer marketing (benefit-led, "why us") | Engaging, drives adoption | Risks overselling, destroys credibility if claims are wrong |
| C. Honest engineering (strengths + weaknesses + rationale) | Builds trust, respects reader intelligence | May feel less "exciting", requires more nuance |

**Decision**: **Option C** — Honest engineering tone.

**Guidelines**:
- Lead with what the ecosystem does, not what competitors don't
- For every "we're unique at X", include the trade-off ("we chose X over Y because Z")
- Explicitly state where competitors are stronger and why that's acceptable
- No superlatives unless literally true and verifiable
- Use the assessment's voice as the model: factual, structured, comparative

**Rationale**: The three personas are all technical. Developers and academics detect marketing instantly — it erodes trust. Engineering leaders respect honesty about limitations because it signals mature engineering judgment. The pre-1.0 maturity level makes overselling especially dangerous.

---

## Consequences

### Positive

- Single location (zz-notation/docs/) makes maintenance straightforward
- Runnable examples are testable in CI — claims can't silently drift
- Honest tone builds trust with all three personas
- Markdown format requires zero tooling beyond GitHub

### Negative

- zz-notation repo becomes the ecosystem's "docs hub" which may feel odd for non-ZZ content
- Narrative competitor comparisons (not runnable) may drift without a verification process
- Markdown tables have limited formatting — very wide comparisons may be hard to read

### Neutral

- Per-project READMEs in other repos (infer, rstmdb, pctl-rs) should link to the ecosystem overview but are not part of this effort

## References

- [Competitive Landscape Assessment](../assess/infer-eco-competitive-landscape-assessment.md)
- [Positioning PRD](../prd/infer-eco-competitive-positioning-spec.md)
- [ZZ Architecture v2](../architecture.md) — establishes ZZ as "central node"

---

*This ADR follows the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).*
