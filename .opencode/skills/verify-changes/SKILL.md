---
name: verify-changes
description: Verifies that a Jira ticket has been fully and correctly implemented by checking coverage, quality, and completeness. Updates ticket status or creates follow-up tickets as needed.
---

# Verify Changes Skill

## Description

This skill reads a ticket from Jira (SCRUM project), investigates the codebase to verify that everything in the ticket has been properly implemented, evaluates code quality (production readiness, clean code, test coverage, typos, readability, TypeScript strictness), and either transitions the issue to Done or creates follow-up Jira tickets.

Use this skill when the user says things like: "verify the changes", "check the ticket", "review implementation", "is the bug fixed?", "validate the story", "quality check the ticket", or when a development plan has been completed and needs verification.

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "quality-analyst"` to execute the **full workflow** (Steps 1–8).
2. Pass the user's input, available context (e.g., issue key if already provided), and Jira constants (`cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`) in the `prompt`.
3. After subagent completes, present the verification report to the user.

## Workflow

### Step 1: Select the Ticket

If the user already specified a Jira issue key (e.g., `SCRUM-42`), use it. Otherwise, search for issues in the SCRUM project that are in the **REVIEW** column using `jira_searchJiraIssuesUsingJql` with a JQL query like `project = SCRUM AND status = "In Review" ORDER BY updated ASC`. Present the list to the user and ask which one to verify. Accept either:
- A Jira issue key (e.g., `SCRUM-42`)
- A ticket title or keyword (e.g., "passenger selector", "dates selector bug")

### Step 2: Read the Ticket from Jira

Use `jira_getJiraIssue` with `cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"` and the issue key (or search by keyword using `jira_searchJiraIssuesUsingJql`). Read the full ticket content to understand:
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
- Verify the root cause identified in the Jira description is actually fixed
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
| **Needs Follow-Up** | Any issues found: missing features, untested code, broken tests, incomplete fixes, TypeScript errors, production-readiness concerns, typos, or any other gaps. |

### Step 7a: If All Good — Transition Jira Issue to Done

1. Use `jira_getTransitionsForJiraIssue` to find the "Done" transition ID for the issue.
2. Use `jira_transitionJiraIssue` to move the issue to Done.
3. Use `jira_addCommentToJiraIssue` to add the verification summary:

```markdown
### Verification Results

**Verified on:** {YYYY-MM-DD}
**Status:** ✅ Passed

#### Quality Audit
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

#### Commands
| Command | Result |
|---------|--------|
| `pnpm test -- --run` | ✅ Passed |
| `tsc --noEmit` | ✅ Passed |

---

*Verified by opencode*
```

### Step 7b: If Needs Follow-Up — Create Development Plan or Follow-Up Ticket

1. Present the full findings to the user
2. Determine what kind of follow-up is needed:

| Follow-Up Type | Action | When to Use |
|----------------|--------|-------------|
| **Development Plan** | Add `### 📋 Development Plan` comment + move to TODO | The implementation approach was wrong or incomplete and needs re-planning before re-implementation |
| **create-bug-ticket** | Create Bug in TODO + move original to DONE | New bugs found in the implementation (regressions, broken behavior) |
| **create-story-ticket** | Create Story in TODO + move original to DONE | Missing features or new requirements discovered during verification |

3. Act based on the follow-up type:

#### If Development Plan:
- Create the development plan (following the create-development-plan workflow).
- Post the plan as a comment on the current issue prefixed with `### 📋 Development Plan`.
- Post a verification comment noting the gaps and that a re-plan has been created.
- Use `jira_getTransitionsForJiraIssue` to find the "To Do" transition ID, then `jira_transitionJiraIssue` to move the current issue to TODO.

#### If New Ticket (Bug/Story):
- Use the appropriate skill to create the follow-up Jira issue (it will be placed in TODO by that skill).
- Post a verification comment on the **original** issue noting the gaps and linking to the follow-up ticket.
- Use `jira_getTransitionsForJiraIssue` to find the "Done" transition ID, then `jira_transitionJiraIssue` to move the **original** issue to Done.
- Link original ↔ follow-up using `jira_createIssueLink` with type "Relates".

### Step 8: Report Summary

Present a comprehensive summary to the user with:

```
## Verification Report: {Ticket Title}

**Source:** `{Jira issue key, e.g., SCRUM-42}`
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
- **Transition discipline:** Only transition an issue to "Done" if ALL items are verified and all quality checks pass.
- **Follow-up over silence:** If there are gaps, always create follow-up Jira issues rather than ignoring them.
- **Date format:** Always use YYYY-MM-DD.
- **Prompt logging:** Remember to log prompts per AGENTS.md instructions.
- **Respect existing patterns:** Use the same format as existing tickets and documentation.
