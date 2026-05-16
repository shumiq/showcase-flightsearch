---
name: create-development-plan
description: Creates a detailed TDD-based development plan from a bug or story ticket, including component design, test strategy (unit + Storybook), and step-by-step implementation phases.
---

# Create Development Plan Skill

## Description

This skill reads a ticket from Jira (SCRUM project) and produces a comprehensive, TDD-driven development plan tailored for developers. The plan breaks down the work into phases: test-first design, component architecture, unit tests, Storybook stories, and implementation.

Use this skill when the user says things like: "create a plan for this ticket", "how should I approach this bug", "plan out the passenger selector story", etc.

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "technical-lead"` to execute the **full workflow** (Steps 1–6).
2. Pass the user's input (issue key if provided) and Jira constants (`cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`) in the `prompt`.
3. After subagent completes, present the plan location to the user.

## Workflow

### Step 1: Ask for the Ticket

If the user hasn't specified a ticket, ask them which ticket they want a plan for. Accept either:
- A Jira issue key (e.g., `SCRUM-42`)
- A ticket title or keyword (e.g., "passenger selector", "dates selector bug")

### Step 2: Read the Ticket from Jira

Use `jira_getJiraIssue` with `cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"` and the issue key (or search for it by keyword using `jira_searchJiraIssuesUsingJql`). Read the full ticket content to understand:
- The problem or feature requirements
- Acceptance criteria (from the description)
- Investigation findings and technical context
- Any constraints noted in the description or comments

### Step 3: Investigate the Codebase

Perform code investigation to understand the current state:
- Read the suspected/related files mentioned in the ticket
- Identify existing patterns, interfaces, and component architecture
- Check existing test files (`.test.tsx`) for testing patterns
- Check existing Storybook files (`.stories.tsx`) for story patterns
- Identify shared types, utilities, or hooks that will be reused
- Note any existing test mocks or setup patterns (e.g., `vi.mock`, `vitest.setup.ts`)

### Step 4: Generate the Development Plan

Create the development plan using the template below. The plan should be:
- **TDD-focused**: Every implementation step is preceded by its corresponding test
- **Technical**: Use precise terminology (props, interfaces, hooks, mocks, render cycles, etc.)
- **Actionable**: Each step should be concrete enough that a developer can execute it without ambiguity
- **Comprehensive**: Cover unit tests, Storybook stories, component implementation, and integration

Do NOT create any local files. The plan will be posted as a Jira comment in the next step.

### Step 5: Post Plan as Jira Comment

1. Use `jira_getJiraIssue` to get the ticket's existing comments.
2. Check if a development plan comment already exists — if so, the new plan will be posted as an additional comment (there may be multiple plans over time).
3. Use `jira_addCommentToJiraIssue` to post the full development plan as a comment on the ticket, prefixed with `### 📋 Development Plan` so it can be identified by downstream skills.

### Step 6: Confirm & Summarize

Inform the user that the plan has been created as a comment on the Jira issue. Provide the Jira issue key and briefly summarize the key phases.

---

## Development Plan Template

```markdown
# Development Plan: {ticket title}

**Source Ticket:** `SCRUM-42` (Jira)
**Date Created:** {YYYY-MM-DD}
**Approach:** Test-Driven Development (TDD)

---

## Overview

*{2-4 sentence summary of what will be built/fixed, derived from the ticket.}*

---

## Architecture & Design

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `{ComponentName}` | *{What it does}* | `src/components/{path}/{ComponentName}.tsx` |

### State Management

*{Describe state approach: local useState, useContext, props drilling, etc. Include any new interfaces/types needed.}*

```typescript
// Example interface/type definitions that will be needed
interface {ExampleInterface} {
  // ...
}
```

### Dependencies

- **Existing components to reuse:** `{list components}`
- **Hooks/utilities to use:** `{list hooks or utils}`
- **New dependencies (if any):** `{list or "None"}`

---

## Test Strategy

### Unit Tests (`{ComponentName}.test.tsx`)

| Test Case | Description | Expected Assertion |
|-----------|-------------|-------------------|
| {test name} | *{What scenario is tested}* | *{What should be asserted}* |
| {test name} | *{What scenario is tested}* | *{What should be asserted}* |

**Mocking Strategy:**
- *{Describe what needs to be mocked (e.g., hooks, context, external modules) and how}*

### Storybook Stories (`{ComponentName}.stories.tsx`)

| Story | Purpose | Interactivity |
|-------|---------|---------------|
| `{StoryName}` | *{What it showcases}* | *{interactive or static}* |
| `{StoryName}` | *{What it showcases}* | *{interactive or static}* |

---

## Implementation Phases (TDD)

Each phase follows the Red → Green → Refactor cycle. Write tests **before** implementation.

### Phase 1: {Phase Name}

**Goal:** *{What this phase achieves}*

#### 1.1 Write Failing Tests

File: `src/components/{path}/{ComponentName}.test.tsx`

```typescript
// Test stubs — these should fail initially
describe('{ComponentName}', () => {
  it('{test description}', () => {
    // ...
  });
});
```

Run: `pnpm test -- --run` — confirm tests fail.

#### 1.2 Implement Minimum Code

File: `src/components/{path}/{ComponentName}.tsx`

*{Describe the minimal implementation to make the tests pass. Include key code snippets if helpful.}*

#### 1.3 Verify & Refactor

Run: `pnpm test -- --run` — confirm tests pass.
Refactor: *{Any refactoring notes, e.g., extract helper, clean up types}*

---

### Phase 2: {Phase Name}

**Goal:** *{What this phase achieves}*

#### 2.1 Write Failing Tests

File: `src/components/{path}/{ComponentName}.test.tsx` (extend)

```typescript
// Additional test cases
```

Run: `pnpm test -- --run` — confirm new tests fail.

#### 2.2 Implement

File: `src/components/{path}/{ComponentName}.tsx`

*{Describe implementation}*

#### 2.3 Verify & Refactor

Run: `pnpm test -- --run` — confirm all tests pass.

---

### Phase 3: Storybook Stories

**Goal:** Create Storybook stories for visual testing and documentation.

#### 3.1 Create Story File

File: `src/components/{path}/{ComponentName}.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentName } from './{ComponentName}';

const meta: Meta<typeof ComponentName> = {
  title: '{Category}/{ComponentName}',
  component: ComponentName,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Define stories matching the test scenarios
```

#### 3.2 Define Stories

*{List each story with its args and purpose}*

#### 3.3 Verify

Run: `pnpm run storybook` — verify stories render correctly.

---

### Phase 4: Integration & Existing Test Updates

**Goal:** Wire the new/modified component into parent components and update existing tests.

#### 4.1 Update Parent Component

File: `src/components/{path}/{ParentComponent}.tsx`

*{Describe integration steps}*

#### 4.2 Update Existing Tests

File: `src/components/{path}/{ParentComponent}.test.tsx`

*{Describe what existing tests need updating and what new assertions to add}*

#### 4.3 Update Existing Stories

File: `src/components/{path}/{ParentComponent}.stories.tsx`

*{Describe story updates if needed}*

#### 4.4 Verify All Tests

Run: `pnpm test -- --run` — confirm **all** tests pass (new + existing).

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/.../{ComponentName}.tsx` | Create/Modify | *{Description}* |
| `src/components/.../{ComponentName}.test.tsx` | Create | Unit tests |
| `src/components/.../{ComponentName}.stories.tsx` | Create | Storybook stories |
| `src/components/.../{ParentComponent}.tsx` | Modify | Integration |
| `src/components/.../{ParentComponent}.test.tsx` | Modify | Update existing tests |
| `src/components/.../{ParentComponent}.stories.tsx` | Modify | Update existing stories |

---

## Checklist

- [ ] All new unit tests written and passing
- [ ] Storybook stories created and rendering
- [ ] Existing tests updated and passing
- [ ] Existing stories updated (if needed)
- [ ] `pnpm test -- --run` passes with no failures
- [ ] `pnpm run storybook` builds without errors
- [ ] TypeScript compiles with no errors (`tsc --noEmit`)

---

*Generated by opencode*
```

## Best Practices & Rules

- **TDD always**: Every code change must be preceded by a failing test. Never write implementation before tests.
- **Test coverage**: Unit tests must cover happy paths, edge cases, boundary conditions, and error states.
- **Storybook coverage**: Stories must cover all component states (default, disabled, empty, loading, error, interactive).
- **Be specific**: Use exact file paths, function names, prop types, and assertion expectations.
- **Follow existing patterns**: Reference the actual test and story patterns found during code investigation.
- **Plan location**: Plans are posted as Jira comments prefixed with `### 📋 Development Plan`.
- **Date format**: Always use YYYY-MM-DD.
- **Adapt to ticket type**:
  - **Bug tickets**: Focus on regression tests first, then the fix. Include a test that reproduces the bug before fixing.
  - **Story tickets**: Focus on feature tests matching acceptance criteria. Each AC should map to at least one test.
- **No filler**: Every phase should have a clear purpose. Skip phases that are not needed.
- **Include run commands**: Always specify the exact commands to run for verification.
