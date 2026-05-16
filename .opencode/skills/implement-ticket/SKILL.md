---
name: implement-ticket
description: Follows a development plan from ./plans to implement code using TDD (Red → Green → Refactor). Supports yolo mode (auto-execute) and approval mode (approve each step).
---

# Implement Ticket Skill

## Description

This skill reads a development plan from `./plans/`, parses its implementation phases, and executes them step-by-step following strict TDD workflow. Every change is transparently reported to the user.

Use this skill when the user says things like: "implement the plan for farecard", "start working on the passenger selector plan", "execute the development plan", etc.

## Workflow

### Step 1: Identify the Plan

If the user already specified a plan file (e.g., `farecard-promotional-component-plan.md`), use it. If the user specified a Jira issue key (e.g., `SCRUM-42`), look for a matching plan in `./plans/` — plans created by `create-development-plan` include the Jira key in their filename or content. Otherwise, list the available plans in `./plans/` and ask the user to choose.

### Step 2: Read and Parse the Plan

Read the full plan file. Extract:
- **Plan phases** (Phase 1, Phase 2, etc.) and their sub-steps
- **Files to create/modify** from the File Change Summary
- **Checklist items** for final verification
- **Test patterns** from the code snippets in each phase

### Step 3: Ask for Execution Mode

Prompt the user to choose one of two modes:

1. **YOLO Mode** — Execute all phases automatically without pausing. Every step is reported after completion but the agent proceeds immediately.
2. **Approval Mode** — Before each sub-step (e.g., before writing tests, before implementing, before running commands), pause and ask the user to approve.

### Step 4: Execute the Plan

For each phase in the plan, execute its sub-steps in order, following the TDD cycle:

#### For "Write Failing Tests" sub-steps:
1. Report: *"Starting Phase X: Write failing tests for [file]"*
2. Create the test file with the test code from the plan
3. Run `pnpm test -- --run` and confirm the tests fail (Red)
4. In approval mode: ask user to approve before proceeding
5. In yolo mode: report the result and continue

#### For "Implement Minimum Code" sub-steps:
1. Report: *"Phase X: Implementing [component/file]"*
2. Implement the component/code as described in the plan
3. Run `pnpm test -- --run` and confirm tests pass (Green)
4. Report the result

#### For "Verify & Refactor" sub-steps:
1. Report: *"Phase X: Verifying and refactoring"*
2. Run `pnpm test -- --run` and confirm all tests pass
3. Perform any refactoring notes from the plan
4. Report the result

#### For Storybook sub-steps:
1. Report: *"Creating Storybook stories for [component]"*
2. Create the story file based on the plan's guidance
3. Verify by checking the file exists and matches the plan requirements
4. Report the result

### Step 5: Run Final Checklist

After all phases are complete, execute the checklist items from the plan:
1. Run `pnpm test -- --run` and confirm all pass
2. Check TypeScript compiles (run `tsc --noEmit` if available in project)
3. Build storybook if needed (`pnpm run build-storybook`)
4. Report the final result

### Step 6: Report Summary

Provide a summary of what was implemented:
- Files created/modified
- Test results
- Any deviations from the plan
- Checklist status

### Step 7: Update Jira Issue (optional)

If the plan references a Jira issue key, consider updating the issue:
1. Use `jira_transitionJiraIssue` to move the issue to "In Review" or "Done" (check available transitions with `jira_getTransitionsForJiraIssue`)
2. Use `jira_addCommentToJiraIssue` to add an implementation summary with key file paths and test results

---

## Plan Parsing Guide

The agent should parse the plan markdown structure to extract:

1. **Phase headers** — Lines matching `### Phase N: Title`
2. **Sub-step headers** — Lines matching `#### N.M Description`
3. **File references** — Lines matching `File: \`path/to/file\``
4. **Code blocks** — TypeScript code blocks (```typescript ... ```)
5. **Run commands** — Lines matching `Run: \`command\``
6. **File Change Summary** — The table at the end listing files to create/modify
7. **Checklist** — The checklist section at the end

### Expected Plan Structure

Each plan follows this structure:
- `# Development Plan: Title` — h1 title
- `## Overview` — description
- `## Architecture & Design` — component design, interfaces
- `## Test Strategy` — test cases and story list
- `## Implementation Phases (TDD)` — numbered phases with sub-steps
  - `### Phase N: Title` — phase header
  - `#### N.1 Write Failing Tests` — test files to create
  - `#### N.2 Implement Minimum Code` — implementation details
  - `#### N.3 Verify & Refactor` — verification
- `## File Change Summary` — table of files
- `## Checklist` — verification steps

---

## Best Practices & Rules

- **Strict TDD**: Never write implementation code before tests. The Red step (failing tests) must always come first.
- **Transparency**: Report every sub-step, file change, and test result to the user. No silent operations.
- **Follow the plan exactly**: Do not deviate from the plan's code snippets, file paths, or descriptions. If something is unclear, stop and ask the user.
- **Handle failures gracefully**: If `pnpm test -- --run` fails when it should pass (or passes when it should fail), stop and report the issue to the user. Do not silently continue.
- **Mode discipline**: In approval mode, never proceed past a user-approved boundary without asking. In yolo mode, proceed but always report.
- **DO NOT skip steps**: Every "Write Failing Tests", "Implement", and "Verify" sub-step must be executed, even in yolo mode.
- **Post-implementation**: After completing all phases, run the full checklist and report results.

---

## Template: Execution Report

Use this format when reporting progress to the user:

```
## Progress: {Phase Title} ({N}/{Total} phases)

**Sub-step:** {Write Failing Tests | Implement | Verify}
**File:** `{file path}`
**Status:** ✅ Completed | ❌ Failed | ⏳ In Progress

**Test Results:** {N} passing, {N} failing
**Details:** {brief summary of what was done}
```

---

## Template: Final Summary

```
# Implementation Complete: {Plan Title}

## Files Created/Modified
- `{file path}` — {action}
- `{file path}` — {action}

## Test Results
{pnpx test output summary}

## Checklist
- [x] {item 1}
- [ ] {item 2}

## Notes
{any deviations, issues, or recommendations}
```
