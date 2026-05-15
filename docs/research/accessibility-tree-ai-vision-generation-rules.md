# Accessibility Tree as AI Vision Substrate — Generation Rules + Cross-Platform Reality

> **Context**: Vladimir Ivanov's GRACE follow-up post (2026-05) on AX-tree-based UI testing speed/quality + FrontendMasters article (Pawar, 2026-04-13) on AI-generated UI inaccessibility. Chat comments from Konstantin, Vasiliy, Andrey Panchenko add cross-platform reality (Flutter canvas, cua-driver, Android uiautomator).
> **Question**: How should we generate UIs so AI agents can actually use them — and where does this slot into our GRACE-extended pipeline?
> **Last updated**: 2026-05-14
> **br task**: docs-xl9v

---

## Short Answer

**Accessibility Tree (AX Tree) is the canonical substrate AI agents use to "see" UIs — fast, text-only, RL-trained-on. Most AI-generated UIs fail it: `<div onClick>` instead of `<button>`, missing names, missing states. Fix at generation time (not after) with explicit accessibility-first prompt rules. This is the missing operational layer between our GRACE prompting and LDD feedback loop.**

```
WHAT THE AI AGENT ACTUALLY SEES (via browser_snapshot):

  root
    heading "🎨 SDXL Generator Pro"
    generic
      group
        combobox "Model" [expanded]
          option "photo1-sdxl" [selected]
        textbox "Prompt" [focused]
        button "Generate Parameters" [expanded]
          spinbutton "Steps" [valuetext: "20"]
          slider "CFG Scale" [valuetext: "7.0"]
        ...

WHY THIS IS FAST:
  • Native browser data — no Playwright translation overhead
  • CDP caches the tree at Browser Process level
  • Pure text → no multimodal LLM needed → no vision tokens
  • LLMs trained on AX trees got MORE RL cycles than on screenshots
    (browser rendering too slow for thousands of RL trajectories)

WHY MOST AI-GENERATED UIs FAIL IT:
  • ChatGPT/Claude default to non-semantic <div onClick>
  • Missing aria-expanded / aria-selected state attributes
  • Icon-only buttons without aria-label
  • Result: AX tree has "generic" nodes — agent can't navigate
```

---

## What's Already in the Workspace

`docs/research/headless-ui-testing-grace-v2-gap-analysis.md` already covers:
- Two test-speed tiers (extreme headless vs browser-driven)
- DeepSeek V4 GRPO training on UI cycles
- Playwright `browser_snapshot` as text substrate
- Workspace gap: no engineering pattern coverage

**What this doc adds**:
- The generation-side rules (what UI code must look like)
- The "AI-generated UIs are inaccessible by default" evidence (Pawar, FrontendMasters)
- Cross-platform reality (Web / Flutter / Android / Python)
- Integration into our GRACE-extended pipeline as a NAMED layer

---

## The Architecture (How AI Agent → UI Actually Works)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  AI AGENT WANTS TO USE A WEB UI                                          │
│                                                                          │
│  Agent calls browser_snapshot                                            │
│         │                                                                │
│         ▼                                                                │
│  ┌────────────────────────────────────────────┐                          │
│  │ Playwright MCP server                       │                         │
│  │   │                                         │                         │
│  │   ▼                                         │                         │
│  │ Chrome DevTools Protocol (CDP)              │                         │
│  │   │                                         │                         │
│  │   ▼                                         │                         │
│  │ Browser Process — generates AX Tree        │                         │
│  │   (cached for performance)                  │                         │
│  └────────────────────────────────────────────┘                          │
│         │                                                                │
│         ▼                                                                │
│  AX Tree returned as YAML/text                                           │
│  (no vision model required)                                              │
│         │                                                                │
│         ▼                                                                │
│  Agent reasons over text tree, picks target                              │
│  by role + name + state                                                  │
│         │                                                                │
│         ▼                                                                │
│  Agent calls action:                                                     │
│    browser_click(target='button "Generate"')                             │
│    browser_fill_form(fields=[{target='textbox "Prompt"', value='...'}])  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Key Ivanov claim** (worth verifying separately): *all LLMs including Claude Opus received significantly MORE RL training cycles through AX-tree-based UI interaction than through full visual rendering, because rendering was too slow for the RL trajectory budget. Implication: AI agents are intrinsically better at AX-tree UIs than at screenshot-based ones, regardless of the agent's multimodal capability.*

If true, this is a major incentive to ship accessibility-first regardless of how visually capable the target agent is.

---

## What Pawar's FrontendMasters Article Proves

**Source**: Durgesh Rajubhai Pawar, *"AI-Generated UI Is Inaccessible by Default"*, Frontend Masters Blog, 2026-04-13. https://frontendmasters.com/blog/ai-generated-ui-is-inaccessible-by-default/

### The 10 Failures in One 29-Line Sidebar

A single typical AI-generated sidebar component produced ALL of these failures simultaneously:

1. Missing `<nav>` landmark role
2. "Settings" text as `<div>` instead of heading
3. No list structure (`<ul>`/`<li>`)
4. Interactive toggles mapped to `generic` role
5. Non-focusable elements (divs without tab index)
6. Missing `aria-expanded` state attributes
7. Absent `aria-controls` relationships
8. No keyboard interaction handlers
9. Unlabeled SVG icons
10. Fake links built from `<div onClick>` patterns

### Direct Quote on Prevalence

> *"`<div onClick>` instead of `<button>` or `<a>` appeared in the vast majority of interactive components"* across tested AI tools. Missing ARIA state attributes and keyboard handling were *"nearly universal"* and *"absent from almost every custom control."*

### The Four Properties AI Agents Need

The AX tree exposes four properties per element. AI agents key on all four:

| Property | Example | What breaks if missing |
|---|---|---|
| **Role** | `button`, `combobox`, `tab` | Agent can't identify element type → falls back to `generic` |
| **Name** | "Generate", "Prompt" | Agent can't address element by name |
| **State** | `expanded`, `selected`, `checked` | Agent can't tell if menu is open, tab is active |
| **Value** | `"20"`, `"7.0"` | Agent can't read current value of spinbutton/slider |

**The core insight from Pawar**: *"CSS can make a `<div>` look like a button. Only HTML semantics can make it be one."*

### Time Cost Asymmetry

- Adding accessibility constraints at generation time: **3-8 minutes per component**
- Remediation after-the-fact: **45-90 minutes per component**

The ratio is ~10×. Shift-left on accessibility = order-of-magnitude cost savings.

---

## Cross-Platform Reality (Where AX Tree Works and Doesn't)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PLATFORM            AX TREE SUPPORT       AGENT-FRIENDLY                │
│  ─────────────────── ────────────────────  ───────────────────────       │
│                                                                          │
│  Semantic HTML       Native, full          ✓✓✓ Best case                 │
│  (React/Vue/Svelte                                                       │
│   with semantic tags)                                                    │
│                                                                          │
│  Python Gradio       ~100% AX compat       ✓✓✓ (Ivanov claim)            │
│  (Streamlit similar)                                                     │
│                                                                          │
│  shadcn/ui + Radix   Inherits Radix        ✓✓ (Pawar exception)         │
│  v0.dev output       contracts                                           │
│                                                                          │
│  Vanilla AI-gen      Mostly inaccessible   ✗ Default failure mode        │
│  (ChatGPT/Claude     <div onClick> +                                     │
│   custom components) missing ARIA                                        │
│                                                                          │
│  Flutter Web         Canvas-rendered       ✗✗ No AX tree at all          │
│  (Konstantin's       no tags exposed                                     │
│   observation)                                                           │
│                                                                          │
│  Native Android      uiautomator XML       ✓ Different but equivalent    │
│  (Panchenko's        dump + gesture        (xml hierarchy ≈ AX tree)     │
│   observation)       send-back                                           │
│                                                                          │
│  Native iOS          UIAutomation +        ✓ Equivalent path             │
│                      Accessibility API                                   │
│                                                                          │
│  Desktop (computer-  AX tree layer +       ✓✓ cua-driver hybrid mode     │
│  use agents,         screenshot hybrid     (Vasiliy's observation)       │
│  cua-driver)         (deepseek v4 flash                                  │
│                       fast on tokens)                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

**Strategic implication**: pick frameworks with native AX tree support. Avoid Flutter Web for any UI an AI agent must interact with. Gradio is the safest Python frontend for AI-tested UIs.

---

## The 5-Layer Enforcement Architecture (Pawar)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  LAYER 1: PROMPT CONSTRAINTS                                             │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ .cursorrules / system prompt rules:                            │      │
│  │   • <button> for actions, never <div onClick>                  │      │
│  │   • <a href> for navigation                                    │      │
│  │   • Landmarks: <nav>, <main>, <aside>                          │      │
│  │   • Heading hierarchy: no skipped levels                       │      │
│  │   • Lists: <ul>/<li> for grouped items                         │      │
│  │   • Every interactive element → accessible name                 │      │
│  │   • Form inputs → <label> or aria-label                        │      │
│  │   • Icon buttons → aria-label on button, aria-hidden on icon   │      │
│  │   • Dynamic state → aria-expanded/selected/checked/current     │      │
│  │   • Keyboard access for all interactive elements               │      │
│  │   • focus-visible styles                                       │      │
│  │   • Use Headless UI / Radix / React Aria for complex patterns  │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  LAYER 2: STATIC ANALYSIS                                                │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ eslint-plugin-jsx-a11y (React)                                 │      │
│  │ eslint-plugin-vuejs-accessibility (Vue)                        │      │
│  │ SvelteKit built-in a11y warnings                               │      │
│  │ → detects interactive divs, missing ARIA, invalid roles        │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  LAYER 3: RUNTIME TESTING                                                │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ jest-axe — component-level audits                              │      │
│  │ @axe-core/playwright — browser automation testing              │      │
│  │ → catches what static analysis misses                          │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  LAYER 4: CI INTEGRATION                                                 │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ GitHub Actions running Playwright + axe                        │      │
│  │ → block PR merges if accessibility regressions                 │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  LAYER 5: ACCESSIBLE COMPONENT ABSTRACTIONS                              │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ Radix UI, Headless UI, React Aria                              │      │
│  │ shadcn/ui (built on Radix)                                     │      │
│  │ v0.dev (generates Radix-based components)                      │      │
│  │ → accessibility baked in, hard to fail                         │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  COMBINED AUTOMATED COVERAGE: 70-85% of real-world issues                │
│  (Pawar's estimate — remaining gap requires manual AT testing)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Integration With Our GRACE-Extended Pipeline

This is the missing operational layer between GRACE prompting and LDD feedback:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  GRACE prompting (L1→L2)                                                 │
│         │                                                                │
│         ▼                                                                │
│  AI-contracts emerge (RSTMDB entity)                                     │
│         │                                                                │
│         ▼                                                                │
│  FPF card output (L2)                                                    │
│         │                                                                │
│         ▼                                                                │
│  ★ UI generation with AX-tree-first rules         ← NEW LAYER            │
│    (Pawar Layer 1: prompt constraints)                                   │
│         │                                                                │
│         ▼                                                                │
│  Static analysis (Pawar Layer 2)                                         │
│         │                                                                │
│         ▼                                                                │
│  RSTMDB knowledge entry                                                  │
│         │                                                                │
│         ▼                                                                │
│  LDD feedback layer                                                      │
│   ├── Runtime testing via AX tree probes (Pawar Layer 3)                 │
│   ├── browser_snapshot returns YAML text                                 │
│   └── Critic agent evaluates trajectory                                  │
│         │                                                                │
│         ▼                                                                │
│  Infer derivation (L3)                                                   │
│         │                                                                │
│         ▼                                                                │
│  criterium upgrade                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Direct mapping to existing follow-ups

| Existing task | New AX-tree connection |
|---|---|
| docs-5q59 (RSTMDB contracts) | Add `accessibility-contract` as a contract sub-type. Format: "this UI component must produce AX tree with role=X, name=Y, state-set=Z" |
| docs-p8ay (LDD prototype) | Critic agent's probe = `browser_snapshot`. Semantic verdict: does AX tree shape match contract? |
| docs-3il0 (model-independence) | Test specifically across models known for different multimodal strength. If AX-tree-first is right, GPT-5/Claude 4.7/Gemini 3 all perform equivalently on UI tasks. |
| docs-r0jc (osovv plugin) | Check whether plugin includes accessibility-first prompt rules. If not, that's our addition. |

---

## TestSigma → Playwright Migration Connection (User Context)

The user's EM3 ASMT presentation cites the TestSigma → Playwright migration as a key accelerator. The AX-tree thesis adds a strategic reason this migration is more valuable than just "modernization":

```
┌──────────────────────────────────────────────────────────────────────────┐
│  TESTSIGMA APPROACH:                                                     │
│   • Locator-based (CSS / XPath)                                          │
│   • Brittle to DOM changes                                               │
│   • Not AI-agent-friendly                                                │
│   • Works on visual rendering                                            │
│                                                                          │
│  PLAYWRIGHT + AX-TREE APPROACH:                                          │
│   • Selector by role + name (matches AX tree)                            │
│   • Resilient to visual changes (same role/name = same target)           │
│   • AI-agent native (same substrate AI agents use)                       │
│   • Headless = fast                                                      │
│   • Trained-on substrate for frontier LLMs                               │
│                                                                          │
│  REFRAME FOR INTERVIEW:                                                  │
│  "We didn't migrate to Playwright for cosmetic reasons.                  │
│   We migrated to the same UI substrate AI agents use.                    │
│   That makes our tests AI-debuggable and our UI AI-usable —              │
│   one investment, two payoffs."                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Recommendations

### 1. ADOPT a project-level "AI-Accessible UI" prompt rule set

For any UI we generate or commission going forward, prepend a rules block to Architect prompts:

```
UI Generation Rules (AI-Agent Accessibility):
- Use semantic HTML: <button>, <a href>, <nav>, <main>, <header>, <aside>
- Never <div onClick> for actions; never bare <div> for navigation
- Heading hierarchy must not skip levels (h1 → h2 → h3)
- Lists for grouped items: <ul>/<li>
- Every interactive element needs an accessible name
- Form inputs: paired <label> or aria-label
- Icon buttons: aria-label on button + aria-hidden on icon
- Dynamic state: aria-expanded, aria-selected, aria-checked, aria-current
- Keyboard support for all interactive elements
- Use Radix UI / Headless UI / React Aria for complex patterns
- For Python: prefer Gradio (~100% AX compat); avoid Flutter Web for AI-tested UIs
```

This block goes into our Architect agent system prompt and any UI-generation skill.

### 2. ADD `accessibility-contract` as RSTMDB contract sub-type

Extend docs-5q59 scope to include accessibility contracts:

```python
class AccessibilityContract:
    component_name: str
    required_role: str        # "button", "combobox", etc.
    required_name: str        # accessible name pattern
    required_states: list[str]  # ["expanded", "selected"]
    valid_from: datetime
    valid_until: datetime | None
    contract_state: Literal["preserved", "broken", "pending"]
```

LDD critic probes via `browser_snapshot`, compares actual AX tree against contract.

### 3. RUN concrete experiment: AX-tree probe vs traditional test

Compare on identical bug:
- Traditional Playwright locator-based assertion (brittle, slow on rendering)
- AX-tree-based `browser_snapshot` probe (fast, semantic, robust)

Measure: cycle time, false positives/negatives, AI-agent debuggability.

### 4. STRATEGIC: bias framework choices toward AX-tree-friendly stacks

- Python frontends: Gradio first, Streamlit second (both AX-compat)
- React: shadcn/ui (Radix-based) over hand-rolled components
- Avoid: Flutter Web for anything AI must test/debug
- Mobile: prefer native (Android XML / iOS UIA) over canvas-rendered cross-platform

### 5. UPDATE the AB-testing harness to include AX-tree axis

When testing prompt strategies (standard vs VS vs GRACE), also measure: does the generated UI pass accessibility-tree probes? This is an objective output-quality metric independent of human preference.

---

## Open Questions for Verification

1. **Is Ivanov's RL-training-on-AX-tree claim verifiable?**
   He claims LLMs got more RL cycles on AX trees than on screenshots. I haven't found a primary source for this in public model documentation. Worth probing if any open-source model reports its RL trajectory mix.

2. **What's the AX tree quality of OUR existing UIs?**
   Run `browser_snapshot` on our actual production interfaces and audit. Cheap experiment, high signal.

3. **Does Flutter Web ship any accessibility layer in 2026?**
   Konstantin's "canvas only" observation may be partially outdated. Flutter has been adding some a11y support. Verify before declaring it dead for AI-testable UIs.

4. **What's the cua-driver "hybrid mode" Vasiliy mentions?**
   Worth a separate spike — desktop-agent UI interaction is a related but distinct surface.

---

## Follow-up Tasks

- docs-axt1: Project-level "AI-Accessible UI" prompt rules (skill template + .cursorrules equivalent)
- docs-axt2: Extend docs-5q59 (RSTMDB contracts) with `accessibility-contract` sub-type
- docs-axt3: Run AX-tree-probe vs traditional Playwright assertion bake-off on a real bug
- docs-axt4: Audit current production UI's AX tree quality via browser_snapshot
- docs-axt5: Verify Ivanov's RL-training claim (search open-source model training docs for AX-tree corpus references)
- docs-axt6: cua-driver hybrid mode (AX tree + screenshot) spike — desktop-agent UI surface

---

## Sources

- Vladimir Ivanov, @turboproject — chat thread on AX-tree-based Playwright UI testing (2026-05)
- Konstantin (chat) — Flutter Web canvas observation
- Vasiliy (chat) — cua-driver hybrid AX-tree + screenshot mode
- Andrey Panchenko (chat) — Android uiautomator dump pattern
- Durgesh Rajubhai Pawar, "AI-Generated UI Is Inaccessible by Default", Frontend Masters Blog, 2026-04-13 — https://frontendmasters.com/blog/ai-generated-ui-is-inaccessible-by-default/
- Workspace prior: docs/research/headless-ui-testing-grace-v2-gap-analysis.md (2026-05-13 gap analysis covering broader headless-UI thesis)
- Workspace prior: docs/research/grace-methodology-canonical-shutov-vision.md (GRACE-extended pipeline)
- Tooling: eslint-plugin-jsx-a11y, jest-axe, @axe-core/playwright, Radix UI, Headless UI, React Aria
