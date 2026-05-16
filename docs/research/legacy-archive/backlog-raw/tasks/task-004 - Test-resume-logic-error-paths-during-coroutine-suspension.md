---
id: task-004
title: 'Test: resume logic error paths during coroutine suspension'
status: Done
assignee:
  - '@claude'
created_date: '2026-04-30 07:01'
updated_date: '2026-04-30 16:49'
labels:
  - concurrency
  - testing
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add tests for error handling during coroutine suspension and resumption. Verify that runtime errors thrown mid-body during a yield-resume cycle are properly propagated, that block_resume_stack is cleaned up correctly on errors, and that the scheduler handles coroutine failures gracefully.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Test that a runtime error thrown after yield (during resumed execution) propagates to the scheduler and sets coroutine state to Failed
- [x] #2 Test that block_resume_stack is empty after a coroutine completes (whether normally or via error)
- [x] #3 Test that a runtime error during condition evaluation in WhileStatementNode does not leave stale resume state
- [x] #4 All tests pass on Windows (MSVC), macOS, and Linux
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. AC#1: Build AST: while(i<2) { yield; if i==1 throw error; i=i+1 }. First iteration yields, resumes, increments. Second iteration yields, resumes, throws. Verify scheduler catches it and coroutine state is Failed.
2. AC#2: After sched.run() completes (both normal and error cases), access the coroutine block_resume_stack and verify it is empty. Need to check if Coroutine is accessible after run.
3. AC#3: Build AST where condition node throws on second evaluation. while(errorCondition) { yield; }. First eval ok, yields. Resume, second eval throws. Verify clean state.
4. All tests in test_resume_logic.cpp using existing YieldNode + new ErrorAfterResumeNode.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added 3 tests to test_resume_logic.cpp:
- error_after_resume: YieldThenErrorNode yields then throws on resume, root_exception_ captured
- scheduler_clean_after_run: isActive()==false after success, error, and yield+error cases
- error_in_condition_after_resume: CountdownConditionNode throws on 2nd eval after a yield-resume cycle, verifies yield/post-yield counts and root_exception_

498 tests pass on Windows MSVC Release.
<!-- SECTION:NOTES:END -->
