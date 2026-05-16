---
id: task-005
title: 'Test: nested loop resumption with yield'
status: Done
assignee:
  - '@claude'
created_date: '2026-04-30 07:02'
updated_date: '2026-04-30 16:57'
labels:
  - concurrency
  - testing
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add tests for yield/resume inside nested while loops. The block_resume_stack must correctly save and restore indices for multiple nesting levels. This exercises the stack-based resume mechanism more deeply than the current single-loop test.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Test yield inside inner loop of a nested while-while construct, verifying correct resume at the right nesting level
- [x] #2 Test yield in outer loop body (after inner loop completes) resumes correctly
- [x] #3 Test that block_resume_stack depth matches nesting depth during suspension
- [x] #4 All tests pass on Windows (MSVC), macOS, and Linux
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. AC#1: Build nested while(i<2) { while(j<2) { yield; j=j+1 } j=0; i=i+1 }. Yield happens in inner loop. Verify g_yield_count=4 (2 outer * 2 inner).
2. AC#2: Build while(i<2) { while(j<1) { j=j+1 } yield; i=i+1 }. Yield in outer body after inner loop completes. Verify g_yield_count=2.
3. AC#3: Inspect block_resume_stack depth by counting yields - the stack must correctly save/restore for inner BlockNode + inner While + outer BlockNode + outer While (4 levels on suspend).
4. All in test_resume_logic.cpp using existing YieldNode.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added 2 tests to test_resume_logic.cpp:
- yield_nested_inner_loop: while-while with yield in inner loop, 2*2=4 yields, verifies block_resume_stack handles 4 nesting levels (inner Block + inner While + outer Block + outer While)
- yield_nested_outer_body: yield in outer body after inner loop completes, 2 yields

500 tests pass on Windows MSVC Release.
<!-- SECTION:NOTES:END -->
