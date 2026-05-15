# Agent Architecture 2026: Durable State, /goal Mechanics, and the Dual-Window Pattern

> **Context**: Three Habr articles + Part 1 holistic review: (1) Proper Agent Architecture Parts 1 & 2 — complete durable state design with 8 entities; (2) Codex CLI /goal command — month of real-world use, 5-layer architecture, token cost realities; (3) Dual-window pattern — architect + developer separation as the most underrated pattern.
> **Question**: What does production-grade agent architecture look like in 2026, and how does it map to our multi-agent pipeline?
> **Last updated**: 2026-05-08
> **br task**: docs-3ehw

---

## Short Answer

**Our multi-agent pipeline (Context Collector → Architect → Implementor) already implements the dual-window pattern correctly — but it lacks the durable state substrate that makes it production-grade. Parts 1 & 2 provide exactly that substrate: 8 entities covering turn tracking, plan decomposition, event journaling, approval grants, session context, background jobs, and event cursors. Without this layer, our pipeline is a stateless chatbot chain that loses all progress on any restart.**

```
THREE ARTICLES → ONE CONVERGENT PICTURE:

Parts 1+2:         8 durable state entities → turns/plans/events/approvals/jobs survive restarts
/goal CLI:         5-layer state machine → proxy-signal rejection + budget enforcement
Dual-window:       Architect ≠ Developer → clean start, no inertia transfer, critic role

OUR PIPELINE                 WHAT'S MISSING
─────────────────────────────────────────────────────────────────────
Context Collector            → No AgentTurn (lost on restart)
  output: string packet      → No AgentPlanItem (no plan decomposition stored)
Architect                    → No SessionContext (no pending_approval persistence)
  output: plan string        → No ApprovalGrant (no durable human confirmation)
Implementor                  → No BackgroundJob (no retry/lease/idempotency)
  output: code               → No AgentEvent (no audit trail, no reconnect)

✓ Dual-window pattern:      already implemented (each sub-agent has no other's history)
✗ Durable state layer:      entirely missing
```

---

## Part 1 Foundation: Three Core Entities

### AgentTurn — The Request Container

Represents one complete cycle for a user request. Survives restarts because it's in the database, not memory.

```python
class AgentTurn(Base):
    turn_id:            UUID (PK)
    session_id:         String (indexed)
    input_text:         Text          # raw user message
    normalized_command: JSON          # structured intent extracted from input
    status:             String        # created → planned → awaiting_approval
                                      #   → running → completed/failed/cancelled
    needs_confirmation: Boolean
    output_text:        Text          # final agent response
    error:              Text          # durable error for post-restart diagnostics
```

**Key property**: `normalized_command` — the LLM-extracted structured intent, stored durably. After restart, the agent doesn't re-parse the user message; it reads the stored normalized intent. This is the first durable artifact in the pipeline.

### AgentPlanItem — The Decomposed Step

Each turn decomposes into ≥1 plan items. Each item is one tool call with explicit approval mode.

```python
class AgentPlanItem(Base):
    item_id:      UUID (PK)
    turn_id:      UUID (FK → AgentTurn)
    step_index:   Integer             # ordinal position (enables ordered execution)
    tool_name:    String              # e.g., "search_docs", "write_file", "run_test"
    args:         JSON                # tool parameters
    approval_mode: String             # safe_readonly | confirm_once | mutating
    status:        String             # created → running → completed/failed/skipped
    result:        JSON               # success payload
    error:         Text               # failure details
```

**`approval_mode` is critical**: not a runtime decision — it's declared in the plan, per-item. `safe_readonly` skips approval gates. `mutating` requires explicit human confirmation. This is a declarative privilege model for agent tools.

### AgentEvent — The Immutable Audit Trail

Append-only log of all state transitions. Enables frontend to show real progress (not "thinking...") and enables reconnect.

```python
class AgentEvent(Base):
    event_id:   UUID (PK)
    turn_id:    UUID (FK → AgentTurn)
    item_id:    UUID | None (FK → AgentPlanItem, null for turn-level events)
    session_id: String (indexed)
    event_type: String (indexed)      # turn_started | plan_created | tool_started
                                      # tool_progress | tool_completed | tool_failed
                                      # turn_completed | approval_requested
    status:     String                # running | completed | failed | awaiting_approval
    payload:    JSON                  # progress %, error details, counts
    created_at: Datetime              # chronological ordering
```

**Example event sequence for a Context Collector run:**
```
turn_started
plan_created
tool_started       {item: "grep_index_map", args: {pattern: "auth.*"}}
tool_progress      {pct: 40, lines_found: 847}
tool_completed     {lines_found: 1847, tokens_used: 2100}
tool_started       {item: "read_source_lines", args: {...}}
tool_completed     {context_packet_size: 5800}
turn_completed     {output: "context packet ready"}
```

---

## Part 2 Extensions: Five Production-Grade Components

### ApprovalGrant — Durable Human Confirmation

The key insight: approvals must not live in memory. After restart, the agent checks grants in the database rather than re-asking the user.

```python
class ApprovalGrant(Base):
    grant_id:   UUID (PK)
    session_id: String
    project_id: UUID | None
    tool_name:  String                # which tool the approval covers
    mode:       String                # "read" | "write" | "execute"
    scope:      JSON                  # machine-checkable boundaries
    expires_at: datetime | None       # approvals must expire — never eternal
```

**Design rule from article**: "разрешение не становится вечным" — permission doesn't become eternal. Every approval has an expiry. A write approval for a specific file doesn't imply write access to all files.

### SessionContext — Compact State Card

NOT a full conversation transcript. A minimal technical state card that enables resume.

```python
class SessionContext(Base):
    session_id:          String (PK)
    active_turn_id:      UUID | None   # current request
    pending_approval:    JSON | None   # what's waiting for human confirmation
    status:              String        # idle | waiting_user | running
    event_cursor:        Int           # last delivered event seq (reconnect anchor)
    summary:             Text          # compressed history
    agent_profile:       String        # mode/persona
    last_user_message_at: Datetime
    last_agent_event_at:  Datetime
```

**Design philosophy from article**: "маленький, скучный и восстанавливаемый" — small, boring, recoverable. No full prompts. No base64 files. No large tracebacks. Those go in AgentEvent payloads.

### ProjectContext — Concurrent Write Prevention

Soft lock preventing two agents from modifying the same output simultaneously.

```python
class ProjectContext(Base):
    project_id:           UUID (PK)
    active_operation_id:  UUID | None  # which turn holds the lock
    operation_lock:       JSON         # soft-lock metadata (not DB-level)
    latest_output_file_id: UUID | None
    status:               String       # idle | processing | needs_review | failed
```

**Soft vs hard lock**: reads are allowed while processing; only writes to `output_slot` are blocked. This prevents the "two agents write conflicting code to the same file" failure mode.

### BackgroundJob — Atomic Long-Running Operations

The most operationally critical component. Handles tasks that exceed an HTTP request lifetime.

```python
class BackgroundJob(Base):
    job_id:          UUID (PK)
    type:            String        # translate | parse | render | export | ingest
    status:          String        # queued → running → completed/failed/cancelled
    attempt:         Integer
    max_attempts:    Integer
    lease_owner:     String | None # worker_id that holds this job
    lease_expires_at: Datetime | None  # dead worker detection
    progress_seq:    Integer       # monotonic progress counter
    input:           JSON          # sanitized input params
    output:          JSON | None   # success result
    error:           JSON | None   # failure details
    next_attempt_at: Datetime | None  # for retryable failures
```

**Atomic claim — the critical operation:**
```sql
UPDATE background_jobs
SET status='running',
    lease_owner=:worker_id,
    lease_expires_at=NOW() + INTERVAL '2 minutes'
WHERE job_id=:job_id
  AND status='queued'
```

Only one worker succeeds (DB atomicity). If the worker dies mid-job, `lease_expires_at` expires and another worker can claim it. This is **exactly the pattern needed for our nightly reflection pipeline** (docs-f0ef) — prevents double-ingestion runs.

**Error classification:**
```python
except RetryableJobError:   jobs.schedule_retry(job_id, next_attempt_at=...)
except TerminalJobError:    jobs.fail(job_id, error=classify_error(...))
```

### EventCursor — Reconnect-Safe Delivery

Enables UI / consumer to catch up after disconnect without depending on WebSocket reliability.

```python
class EventCursor(Base):
    session_id:     String
    turn_id:        UUID
    consumer_id:    String        # which client/subscriber
    last_event_seq: Integer       # monotonic (not timestamp!)
    # Unique: (session_id, turn_id, consumer_id)
```

**Pattern**: UI receives events through seq=42. Connection drops. Reconnects with "give me events after seq=42." Backend delivers 43, 44, 45 from the durable log. No events lost, no duplication.

**Why monotonic sequence, not timestamp**: timestamps can collide; sequences cannot. Two events at the same millisecond get unambiguous ordering.

### EventPayloadSanitizer — Centralized Secret Protection

Applied before every AgentEvent insertion. Not a developer convention — a structural gate.

```python
SANITIZATION_RULES:
  - Keys matching: api_key, token, secret, password, authorization → REDACTED
  - base64 strings > 256 chars → stripped
  - strings > 2000 chars → truncated
  - lists > 100 items → capped
  - total payload > 32KB → error

BAD:  {"file_base64": "UEsDBBQ...", "api_key": "sk-...", "html": "<...full html...>"}
GOOD: {"file_id": "file_123", "rows_count": 1842, "result_file_id": "file_456"}
```

This is the same design philosophy as `index.map` vs GRACE tags: structured references over raw content in the shared medium.

---

## Codex CLI /goal: The 5-Layer Architecture

### Layer Stack

```
LAYER 5: TUI              Status indicators, elapsed time, token budget visualization
LAYER 4: Runtime          Continuation turns; only fires during session idle
                          User input always takes priority over continuation
LAYER 3: Model tools      Model CAN: query goal status, mark completion
                          Model CANNOT: pause, resume, reset (user-only operations)
LAYER 2: App-Server API   RPC: thread/goal/get, thread/goal/set, thread/goal/clear
          (v2)            Cross-client push notifications
LAYER 1: Persistence      goal text, status (pursuing/paused/achieved/unmet/budget_limited)
                          timestamps, token consumption tracking
```

### Proxy Signal Rejection — The Critical Instruction

Two system prompt templates inject on each continuation turn:

- **`goals/continuation.md`**: "do not accept proxy signals and treat uncertainty as not achieved"
- **`goals/budget_limit.md`**: soft-stop — wrap work, document state, flag incomplete items

**What "proxy signals" means**: tests passing, files written, metric improvement, benchmark scores — these are *indicators*, not proof of goal achievement. A /goal for "+20% P95 latency" requires validating against production metrics, not just a local benchmark showing improvement.

**This is identical to our skill stopping condition rule** (from prompt paradox research): ALWAYS/NEVER = true invariants only; never declare done based on secondary signals.

### Real-World Performance Data

| Metric | Value |
|---|---|
| Case study result | +25.7% FPS verified by `npm run perf:guard` |
| Duration | 1 hour, GPT-5.5 highest reasoning |
| Token variance | 3–5x multiplier — same goal class: 80k vs 400k tokens |
| Observation cadence | Check every 15-20 min; pause if trajectory diverges |
| Adoption | Researchers first (concrete objectives + measurable targets), not developers |

### /goal Failure Mode Inventory

| Failure Mode | Mechanism | Mitigation |
|---|---|---|
| Vague objective | "make code better" → infinite refinement, no definition-of-done | Measurable target required: tests, metrics, behavioral criteria |
| Missing feedback loop | No tests/logs/graphs → forced proxy-signal reliance | Feedback mechanism must exist before /goal starts |
| Production execution | Agent can commit/merge/restart → 47-commit nonsense branches | Sandbox environment mandatory |
| Quota wall | MCP approval calls fail silently at zero quota | Budget monitor + hard stop before quota boundary |
| Unstructured long task | "Rewrite service architecture" → overwhelms mechanism | Decompose or use investigative+clean two-phase pattern |
| Task-loop mismatch | Not all problems are iterative loops | Establish Ralph-loop applicability before /goal |

### /side as Inertia Escape

`/side` opens ephemeral context without polluting goal state. Pattern: encounter unexplained term → `/side clarify X` → answer arrives without touching goal thread.

**This is the dual-window pattern applied within a single tool**: temporary isolation for a specific cognitive subtask.

---

## The Dual-Window Pattern

### The Two Windows

```
ARCHITECT WINDOW                    DEVELOPER WINDOW
────────────────────────────────────────────────────────
Role: Critic, skeptic, reviewer     Role: Executor, coder
Task: Review specs, find gaps,      Task: Read repo, refactor,
      catch contradictions               modify files
Does NOT: write code                Does NOT: review specs
System prompt: skepticism-tuned     System prompt: execution-tuned
Model: GPT-5.5 high-thinking        Model: Claude Code (tools)
  "takes a pause and pokes problem"   "understood, doing it"
```

### Why Separation Matters: The Inertia Problem

**In a single-agent session**: the LLM accumulates bias. Once it starts toward solution X, it will refine X, defend X, find arguments for X. Helper bias compounds this: most agents optimize to fulfill requests, not to question them.

**With two windows**: each has a clean start. The architect has no knowledge of the developer's implementation attempts. When the developer is stuck after 2 hours of failed hypotheses, the architect receives only the error + approaches tried — "approaches from an angle we hadn't considered."

### 6 Error Categories the Pattern Catches

1. **Vague acceptance criteria** — "system should work fast" → architect demands latency/throughput targets
2. **Internal contradictions** — conflicting requirements stated in different spec sections
3. **Hidden infrastructure assumptions** — unstated dependencies on system architecture
4. **Forgotten error scenarios** — "what if null?" / "what if timeout?" / "what if two simultaneous?"
5. **Unspecified edge cases** — concurrent requests, failure modes, partial completion
6. **Architectural risk** — "here's what happens in 6 months when load grows" (long-term consequences invisible to developer)

### When It's Redundant

- Utility scripts (≤1 hour tasks)
- Tests with clear specifications
- Minor modifications to existing features
- Exploratory/throwaway code

**Threshold**: overhead of coordinating two agents must be less than the benefit of catching one production-breaking issue. For anything above ~2 hours of implementation, the pattern pays for itself.

### Human as Router

The author is explicit: no direct communication between windows. The human acts as intermediary — reads architect output, extracts relevant gaps, reformulates for developer (or vice versa). This prevents the inertia of one window contaminating the other.

---

## Synthesis: Mapping to Our Multi-Agent Pipeline

### What We Already Have (Confirmed)

**Dual-window pattern** ✓ — our Context Collector, Architect, and Implementor each receive clean context packets without the conversation history of other sub-agents. The Architect does not have the Context Collector's grep results; it receives only the synthesized packet. This is the "no inertia" property by design.

**Proxy-signal rejection** ✓ (partial) — our flow:validate step is supposed to catch this; in practice, it needs explicit "do not accept proxy signals" instruction similar to `goals/continuation.md`.

### What We're Missing (Critical Gaps)

```
DURABLE STATE GAP:
  Current: sub-agent output = string → lost on any failure
  Needed: AgentTurn per pipeline invocation (survives restart)
          AgentPlanItem per sub-agent step (explicit tool declaration)
          AgentEvent per state transition (audit trail, reconnect)

APPROVAL GAP:
  Current: human approval = implicit (user runs the command)
  Needed: ApprovalGrant per mutating operation
          (scope-limited, expiring, machine-checkable)
          This is the GDPR-certifiable consent record

BACKGROUND JOB GAP:
  Current: nightly reflection (docs-f0ef) = cron with no lease
  Needed: BackgroundJob with atomic claim + lease expiry
          Prevents double-ingestion; handles dead workers
          This is the exact Hermes Agent HippoRAG cron failure (prism research)

SESSION CONTEXT GAP:
  Current: context packet = one-shot string
  Needed: SessionContext with event_cursor
          Enables resume after disconnection
          (our /flow:research skill dies silently on any network issue)

PAYLOAD SANITIZATION GAP:
  Current: no sanitization on context packets
  Needed: EventPayloadSanitizer before any content enters agent event log
          Prevents secrets from appearing in audit trail
```

### The Architecture We Should Build

```
CURRENT PIPELINE (stateless):
  /flow:research → Context Collector → Architect → Implementor
  Each step: string in → LLM → string out → next step
  On failure: restart from beginning

TARGET PIPELINE (durable):
  /flow:research
    → AgentTurn(turn_id, session_id, normalized_command)
    → AgentPlanItem × N (step_index, tool_name, approval_mode)
    
  Context Collector sub-agent
    → emit: tool_started (grep index.map)
    → emit: tool_progress (40%, 847 lines found)
    → emit: tool_completed (context_packet_size: 5800)
    
  [ApprovalGrant check if approval_mode = confirm_once]
  
  Architect sub-agent
    → reads context packet from AgentEvent(tool_completed.payload)
    → SessionContext.pending_approval = null (proceeds)
    → emit: tool_started (plan generation)
    → emit: tool_completed (plan: 3 steps)
    
  Implementor sub-agent
    → BackgroundJob (atomic claim, lease 10min)
    → emit: job_queued, tool_started × N
    → On failure: RetryableJobError → schedule_retry
    
  On any restart:
    → Read AgentTurn.status → resume from last AgentEvent
    → Context Collector already done (tool_completed exists) → skip
    → Resume at Architect step
```

### /goal Pattern for Our Skills

The `/goal` architecture suggests a `flow:goal` skill:

```
/goal "add auth middleware to all routes with JWT validation"
  → Creates AgentTurn(normalized_command: {type: implement, target: auth-middleware})
  → Runs pipeline in background (BackgroundJob)
  → Continuation turns: check if goal achieved (don't accept proxy signals)
  → Budget enforcement: hard-stop at token limit with state documentation
  → EventCursor: user can reconnect and see current progress
```

The 3-5x token variance finding is important for our skill budget design: a `/goal`-style skill MUST have a hard budget cap with graceful degradation (`goals/budget_limit.md` pattern), not just a soft warning.

---

## Design Rules Derived

1. **Every pipeline invocation = one AgentTurn in the database.** No exceptions. In-memory pipelines are chatbots, not agents. The turn_id is the unit of recovery.

2. **Every tool call = one AgentPlanItem with explicit approval_mode.** Mutating operations are declared in the plan, not discovered at runtime. This is the architectural equivalent of index.map's generated-artifact principle.

3. **ApprovalGrant: scope + expiry always.** No eternal permissions. The scope is machine-checkable (not just a description string). This is the GDPR-certifiable consent layer.

4. **BackgroundJob with atomic claim for all async processes.** The nightly reflection pipeline (docs-f0ef), RSTMDB ingestion, and any scheduled job must use lease-based claiming. The Hermes Agent HippoRAG cron failure is the reference case.

5. **EventPayloadSanitizer before all event insertion.** References over raw content. This is the same principle as index.map (file:line references) over GRACE embedded tags (raw content in source).

6. **Dual-window pattern for any task ≥ 2 hours.** Architect reviews spec without developer context. Developer implements without architect context. Human routes between them. The separation is the feature, not the overhead.

7. **"Do not accept proxy signals."** A skill that declares success based on test pass or file write is accepting proxy signals. The stopping criterion must be the goal itself, not an indicator of the goal.

8. **Token budget ≠ soft warning; it's a hard gate with graceful degradation.** `/goal`'s 3-5x token variance means budget_limit must trigger state documentation and clean exit, not just a warning message.

---

## Follow-up Tasks

- docs-durst: design durable state layer for multi-agent pipeline — AgentTurn/PlanItem/Event schema, SQLite/file-based implementation, resume-from-last-event logic
- docs-bgnjob: implement BackgroundJob atomic lease pattern for nightly reflection pipeline (docs-f0ef dependency) — atomic SQL claim, 10min lease, RetryableJobError/TerminalJobError classification

---

## Sources

- [Habr Part 1: Правильная агентская архитектура 2026 — Часть 1 (habr.com/ru/articles/1028290/)](https://habr.com/ru/articles/1028290/) — AgentTurn, AgentPlanItem, AgentEvent; durable state philosophy; state machines; approval modes
- [Habr Part 2: Правильная агентская архитектура 2026 — Часть 2 (habr.com/ru/articles/1031440/)](https://habr.com/ru/articles/1031440/) — ApprovalGrant, SessionContext, ProjectContext, BackgroundJob, EventCursor, EventPayloadSanitizer; complete request lifecycle pseudocode
- [Habr: Тестировал /goal в Codex CLI (habr.com/ru/articles/1032606/)](https://habr.com/ru/articles/1032606/) — 5-layer /goal architecture; proxy signal rejection; +25.7% FPS case study; token variance 3-5x; quota wall failure; failure mode inventory
- [Habr: Два окна в работе с AI-агентами (habr.com/ru/articles/1032740/)](https://habr.com/ru/articles/1032740/) — dual-window pattern; 6 error categories; architect vs developer characterization; inertia problem; redundancy threshold
- Prior: `docs/research/multi-agent-codebase-navigation-pipeline.md` — 3-tier pipeline; context budget ≤7,500 tokens; this research provides the durable state layer that pipeline is missing
- Prior: `docs/research/prism-premortem-ai-agent-architecture-review.md` — HippoRAG cron silent failure = BackgroundJob lease gap; Health checks not optional for async systems
- Prior: `docs/research/prompt-length-paradox-gpt55-openai-guide.md` — stopping criterion design; proxy-signal rejection is the same principle
- Prior: `docs/research/epistemic-cycle-mas-architecture-vs-zombocrafteco.md` — P08 nightly reflection = BackgroundJob use case
