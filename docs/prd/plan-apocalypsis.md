# Plan: Apocalypsis Commentary Research + RSTMDB Computational Icon

**Spec**: `docs/prd/apocalypsis-rstmdb-spec.md`
**Date**: 2026-04-02

---

## Execution Order

### Phase 1: Research (Part 1 -- Commentary Catalog)

Research tasks run in parallel. Each epoch range is independent.

1. **TASK: Catalog Epochs 1-3 (33-600 CE)** -- All Orthodox-only (pre-Schism). Includes Andrew of Caesarea as the KEY reference. Foundation for the state machine.
2. **TASK: Catalog Epochs 4-6 (600-1453 CE)** -- Side B (Catholic) begins at 1054. Arethas, hesychast tradition. Detect Dennitsa pattern in Catholic Revelation interpretation.
3. **TASK: Catalog Epochs 7-9 (1453-Present)** -- Side C (Protestant) begins at 1517. Detect 5% poison (rapture, Darby 1830s). STRESS test all three traditions.

### Phase 2: Architecture (Parts 2-4 -- State Machine + Infer + Visualization)

Architecture tasks depend on research completion. Run sequentially.

4. **TASK: RSTMDB State Machine Definition** -- Define S0-S10 with sub-states, transitions, observables. Grounded in patristic consensus from Phase 1. Computational icon framing.
5. **TASK: Infer Proof Integration** -- 5-verb engine connected to state machine. Proof chains. 3 projections. PCTL properties. Apophatic boundaries.
6. **TASK: Visualization Dashboard Design** -- Timeline, proof chain drill-down, missing indicator dashboard, MONITOR watch list, 3-sided comparison view.

### Dependency Graph

```
[Epoch 1-3] ──┐
[Epoch 4-6] ──┼──> [State Machine] ──> [Infer Integration] ──> [Visualization]
[Epoch 7-9] ──┘
```

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Andrew of Caesarea text not fully accessible in translation | Use Constantinou (2008) and Schmid (1955-1956) critical editions; supplement with Arethas commentary where Andrew is unclear |
| Date prediction creep (system outputs timing despite constraints) | Hard-coded apophatic boundary in every FORWARD projection; automated test that rejects any output containing year-specific predictions |
| Theological sensitivity (eschatological topics require pastoral care) | Frame ALL outputs as "structural analysis of patristic commentary" not as "prophecy interpretation"; include disclaimers |
| Scope expansion (9 epochs x 3 sides = large research surface) | Epochs 1-3 are highest priority (foundation); Epochs 7-9 are highest for poison detection; Epochs 4-6 fill the gap |

---

*Plan generated from spec `apocalypsis-rstmdb-spec.md`*
