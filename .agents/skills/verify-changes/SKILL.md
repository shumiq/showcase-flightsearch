---
name: verify-changes
description: Verifies that a ticket from bugs/ or stories/ has been fully and correctly implemented by checking coverage, quality, and completeness. Updates ticket status or creates follow-up tickets as needed.
---

# Verify Changes Skill

## Description

This skill reads a ticket from `./bugs/` or `./stories/`, investigates the codebase to verify that everything in the ticket has been properly implemented, evaluates code quality (production readiness, clean code, test coverage, typos, readability, TypeScript strictness), and either marks the ticket as done or creates follow-up work.

Use this skill when the user says things like: "verify the changes", "check the ticket", "review implementation", "is the bug fixed?", "validate the story", "quality check the ticket", or when a development plan has been completed and needs verification.

## Workflow

### Step 1: Identify the Ticket

If the user hasn't specified a ticket, ask them which ticket to verify. Accept either:
- A ticket filename (e.g., `dates-selector-mobile-panel-unexpected-close.md`)
- A ticket title or keyword (e.g., "passenger selector", "dates selector bug")
- A path (e.g., `./bugs/dates-selector-mobile-panel-unexpected-close.md`)

### Step 2: Locate and Read the Ticket

Search for the ticket in `./bugs/` and `./stories/` directories. Read the full ticket content to understand:
- **For bugs:** Description, steps to reproduce, expected/actual behavior, investigation findings, suspected root cause
- **For stories:** Description, requirements, scope, acceptance criteria, technical notes, suggested implementation steps

### Step 3: Investigate Implementation

Conduct thorough codebase investigation to verify the ticket is properly addressed:

#### Common checks (all ticket types):
1. **Identify affected files** — look at the ticket's technical notes, suggested steps, or investigation findings for file references
2. **Read the suspected/modified files** — review the actual implementation
3. **Check test files** — read corresponding `*.test.tsx` files
4. **Check Storybook files** — read corresponding `*.stories.tsx` files (if applicable)

#### For bug tickets specifically:
- Verify the root cause identified in "Investigation Findings" is actually fixed
- Confirm the fix doesn't break the expected behavior described in the ticket
- Check for regression test coverage that reproduces the bug

#### For story tickets specifically:
- Map each Acceptance Criteria to the code and verify it's met
- Map each Requirement to the code and verify it's implemented
- Check scope boundaries (in scope vs out of scope)

### Step 4: Quality Audit

Evaluate the implementation against these quality dimensions:

| Dimension | What to Check |
|-----------|---------------|
| **Coverage** | All acceptance criteria/requirements/bug fixes are addressed. No missing pieces. |
| **Test Coverage** | Unit tests exist for new/modified code. Tests cover happy paths, edge cases, and error states. Tests actually pass (`pnpm test -- --run`). |
| **Production Readiness** | No console.logs, debuggers, or TODO comments left in. Error states are handled. Loading states are handled (if applicable). Edge cases are covered (empty data, API failures, boundary values). |
| **Coding Standards** | Follows existing project conventions (React 19, TypeScript, Tailwind v4, no external UI library). Uses existing patterns and utilities. Consistent naming. |
| **Clean Code** | No dead code, commented-out code, or duplicate logic. Functions are reasonably sized. Props/interfaces are properly typed. No `any` types. |
| **TypeScript Strictness** | No `@ts-ignore` or `@ts-expect-error` comments. Proper type definitions. Interfaces are exported if reused. |
| **Readability** | Variable/function names are clear. Component structure is logical. No overly complex nested conditionals. |
| **Typos / Consistency** | No typos in code, comments, or user-facing text. Consistent pluralization (e.g., "Passengers" vs "Passenger"). Consistent with existing user-facing labels. |

### Step 5: Run Verification Commands

Run the following commands and report results:

```bash
# Run tests
pnpm test -- --run

# TypeScript check (if available)
# Check package.json for the exact script name first
pnpm exec tsc --noEmit

# Lint check (if available, e.g., eslint, biome, prettier)
# Check package.json for the exact script name
```

### Step 6: Determine Outcome

Based on the investigation and quality audit, determine one of these outcomes:

| Outcome | Condition |
|---------|-----------|
| **All Good** | Every requirement/AC/bug fix is properly covered. All quality checks pass. All verification commands succeed. |
| **Minor Issues** | Core functionality is implemented correctly, but there are small quality issues (typos, minor cleanup, missing edge case test, missing Storybook story, etc.). |
| **Needs Follow-Up** | Significant gaps found: missing features, untested code, broken tests, incomplete fixes, TypeScript errors, or production-readiness concerns. |

### Step 7a: If All Good — Update Ticket Status

1. Update the ticket's `**Status:**` line from `Open` or `In Progress` to `Done`
2. Add a verification section at the bottom of the ticket:

```markdown
---

## Verification Results

**Verified on:** {YYYY-MM-DD}
**Status:** ✅ Passed

### Quality Audit Summary

| Dimension | Result |
|-----------|--------|
| Coverage | ✅ All requirements/AC covered |
| Test Coverage | ✅ All tests passing |
| Production Readiness | ✅ Clean |
| Coding Standards | ✅ Follows conventions |
| Clean Code | ✅ Clean |
| TypeScript Strictness | ✅ No issues |
| Readability | ✅ Clear |
| Typos / Consistency | ✅ Clean |

### Verification Commands

| Command | Result |
|---------|--------|
| `pnpm test -- --run` | ✅ Passed |
| `tsc --noEmit` | ✅ Passed |
| `{lint command}` | ✅ Passed |

---

*Verified by opencode*
```

### Step 7b: If Minor Issues — Report and Offer to Fix

1. Present the findings to the user in a clear summary
2. Ask the user: "I found some minor issues. Would you like me to fix them?"
3. If user agrees, fix the issues directly
4. After fixing, run verification commands again
5. If all pass after fixes, proceed to Step 7a (update ticket to Done)

### Step 7c: If Needs Follow-Up — Create Follow-Up Tickets

1. Present the full findings to the user
2. Determine what kind of follow-up is needed:

| Follow-Up Type | When to Use |
|----------------|-------------|
| **create-bug-ticket** | New bugs found in the implementation (regressions, broken behavior) |
| **create-story-ticket** | Missing features or new requirements discovered during verification |
| **create-development-plan** | The existing implementation needs a structured plan for fixes/improvements |

3. Use the appropriate skill to create the follow-up ticket
4. Do NOT update the original ticket to "Done" if there are follow-up items
5. Instead, add a "Verification Results" section noting the gaps

### Step 8: Report Summary

Present a comprehensive summary to the user with:

```
## Verification Report: {Ticket Title}

**Source:** `./{bugs|stories}/{ticket-filename}`
**Result:** ✅ All Good | ⚠️ Minor Issues | ❌ Needs Follow-Up

### What Was Checked
- {Key finding 1}
- {Key finding 2}
- {Key finding N}

### Quality Audit
| Dimension | Result | Details |
|-----------|--------|---------|
| Coverage | ✅/⚠️/❌ | {summary} |
| Test Coverage | ✅/⚠️/❌ | {N tests, N passing} |
| Production Readiness | ✅/⚠️/❌ | {findings} |
| Coding Standards | ✅/⚠️/❌ | {findings} |
| Clean Code | ✅/⚠️/❌ | {findings} |
| TypeScript Strictness | ✅/⚠️/❌ | {findings} |
| Readability | ✅/⚠️/❌ | {findings} |
| Typos / Consistency | ✅/⚠️/❌ | {findings} |

### Verification Commands
```
{pnpm test output}
{tsc output}
{lint output}
```

### Actions Taken
- {Updated ticket status to Done | Fixed minor issues | Created follow-up ticket(s)}
```

## Best Practices & Rules

- **Thorough investigation:** Read actual source files, test files, and story files. Do not rely on assumptions.
- **Run actual commands:** Always run `pnpm test -- --run` and typecheck. Do not guess test results.
- **Be specific in findings:** Reference exact file paths and line numbers when reporting issues.
- **Don't over-fix:** Only address what's relevant to the ticket. Do not refactor unrelated code.
- **Ticket status discipline:** Only set a ticket to "Done" if ALL items are verified and all quality checks pass.
- **Follow-up over silence:** If there are gaps, always create follow-up tickets rather than ignoring them.
- **Date format:** Always use YYYY-MM-DD.
- **Prompt logging:** Remember to log prompts per AGENTS.md instructions.
- **Respect existing patterns:** Use the same format as existing tickets and documentation.
