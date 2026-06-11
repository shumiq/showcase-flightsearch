---
name: create-ticket
description: Unified skill for creating Jira tickets of any type (Story, Bug, Task). Determines the appropriate type from the user's description, confirms with the user, then delegates to the specialist agent for requirements gathering, codebase investigation, and ticket creation.
---

# Create Ticket Skill

## Description
This unified skill handles creation of all Jira issue types in the SCRUM project: Story, Bug, and Task. It first determines the appropriate ticket type based on the user's description, confirms with the user, then hands off to the specialist agent (Technical Business Analyst for stories/bugs, Technical Lead for tasks) for detailed questioning and ticket creation.

Use this skill when the user says things like: "I need a new feature", "I found a bug", "Create a task to update dependencies", "Let's make a ticket for...", "File a ticket", etc.

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "technical-lead"` to execute the **full workflow** (Steps 1–7).
2. Pass the user's input and Jira constants (`cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`, `projectKey: "SCRUM"`) in the `prompt`.
3. After subagent completes, present the resulting Jira issue key to the user.

## Workflow

### Step 1: Determine Ticket Type

Interact with the user to determine the correct ticket type. There are three cases:

#### Case A: User Specifies a Type
If the user explicitly says "bug", "story", or "task", note their choice but evaluate whether it matches the description they provided:

- **Bug**: Something broken, error, crash, visual glitch, unexpected behavior
- **Story**: New feature, enhancement, user-facing functionality, improvement
- **Task**: Maintenance, dependency updates, security patches, refactoring, configuration, tooling, CI/CD

If the type doesn't match (e.g., "create a story to update lodash"), ask: *"Your description sounds like a maintenance task rather than a story. Would you like to switch to a Task ticket instead?"*

If the type matches, confirm briefly: *"Got it, creating a Bug ticket for the login issue."* → proceed to Step 2.

#### Case B: User Doesn't Specify a Type
Analyze their description and decide the most appropriate type. Then confirm:

*"Based on your description, this sounds like a **{Story/Bug/Task}**. Shall I proceed with that, or would you prefer a different type?"*

Wait for their response, then proceed to Step 2.

#### Case C: Very Vague Input
If the user provides minimal context (e.g., "create a ticket"), ask:

*"Sure! What's this about? Is it a new feature, a bug you've found, or a maintenance task (like dependency updates or refactoring)?"*

Wait for their response, then confirm the type and proceed to Step 2.

### Step 2: Branch by Ticket Type

#### For Story or Bug: Delegate to Technical Business Analyst

Use `Task` tool with `subagent_type: "technical-business-analyst"` to execute the remaining steps. Include in the prompt:

- The confirmed ticket type (`Story` or `Bug`)
- The user's full input and any clarifications gathered so far
- Jira constants: `cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`, `projectKey: "SCRUM"`
- The detailed workflow instructions from **Steps 3–6 below** for the appropriate type
- The **Jira Issue Template** for the chosen type (from the Templates section below)

Wait for the subagent to complete and return the Jira issue key, then proceed to Step 7.

#### For Task: Handle Directly

Proceed to **Step 3** below.

---

### Step 3: Gather Requirements

#### For Story or Bug (handled by TBA):

Ask clarifying questions according to the ticket type. Keep the tone natural and conversational, not like a form.

**For Story:**
Ask 2–4 questions:
1. **User value:** "Who is this for? What problem does it solve for them?"
2. **Scope boundaries:** "Should this include connected functionality too, or just the core feature?"
3. **Edge cases:** "What should happen if the user has no data?" or "What if the API is slow or fails?"
4. **Vague requirements:** "You mentioned 'fast loading' — do you have a target in mind?"
5. **Design/UX:** "Do you have a mockup, or should we follow existing patterns?" If the user provides a URL (e.g., "make it like this link"), treat the link as the **source of truth**. Use `chrome-devtools` tools (navigate to the URL, take snapshots, inspect elements, examine computed styles) to analyze the reference design. **Describe styling in exhaustive detail** — capture colors (hex/rgb), typography (font family, size, weight, line-height), spacing (margin, padding, gaps), border radius, shadows, hover/focus/active states, transitions, layout (flex/grid, alignment), responsive breakpoints, and micro-interactions. The description must be thorough enough for a developer to reproduce the exact visual appearance without ever seeing a screenshot.
6. **Estimation (Fibonacci):** "What size do you estimate this is? Pick a Fibonacci number: 1, 2, 3, 5, 8, 13, or 21?"

**For Bug:**
Ask 1–3 questions:
1. **Behavior:** "Does it show an error message, or just do nothing at all?"
2. **Reproduction:** "Did this happen right after you logged in, or were you already on the page?"
3. **Environment (if needed):** "Are you testing on desktop or mobile? Which browser?" (Default to Desktop/Chrome if unknown)
4. **Estimation (Fibonacci):** "What size do you estimate this is? Pick a Fibonacci number: 1, 2, 3, 5, 8, 13, or 21?"

#### For Task (handled by Technical Lead):

Ask 1–2 concise questions if critical details are missing:
1. **Scope:** "Is there a specific reason for this (e.g., a CVE), or is it routine maintenance?"
2. **Priority:** "Is this time-sensitive, or can it wait for the next sprint?"
3. **Breaking changes:** "Does this require updating any consuming code?"

No Fibonacci estimation needed for tasks.

---

### Step 4: Investigate the Codebase

Use `glob` and `grep` tools to locate relevant files. Document findings concisely.

**For Stories:**
- Search for files matching the feature terms
- Look for existing components, hooks, utilities that can be extended
- Identify related files, existing patterns, and similar features to reference
- If the user provided a reference URL, treat it as the **source of truth**. Use `chrome-devtools` tools to inspect the page — take snapshots, examine layout, styling (colors, typography, spacing, border radius, shadows, transitions), interactions (hover, focus, click, animations), and responsive behavior. Document every style detail exhaustively in the Technical Notes under a **Design Reference** section. Assume the developer has no visual reference beyond your description.

**For Bugs:**
- Search for files matching the fuzzy terms (button, page, API, etc.)
- Read suspected components — check for missing error handling, logic issues
- Formulate a technical hypothesis
- If the user provided a URL showing the bug, use `chrome-devtools` tools to navigate to the page, inspect console errors, network requests, and element state. Capture relevant screenshots and console logs as evidence in the ticket's Investigation Findings.

**For Tasks:**
- Dependency updates: Check `package.json`, lock files, config files
- Security fixes: Search for the vulnerable package/pattern in the codebase
- Refactoring: Locate relevant components, hooks, utilities
- Configuration: Find relevant config files

---

### Step 5: Rewrite & Structure

Synthesize everything into professional terminology according to the ticket type.

**For Stories:**
- **Title:** Actionable title (e.g., "Implement Dark Mode Theme Toggle")
- **Description:** User story: "As a [role], I want [goal], so that [benefit]"
- **Acceptance Criteria:** Given/When/Then BDD format
- **Requirements:** Clear, testable items

**For Bugs:**
- **Title:** Actionable title (e.g., "Settings Page Submit Button Unresponsive")
- **Steps to Reproduce:** Numbered, imperative list
- **Expected/Actual Behavior:** Precise technical language
- **Priority:** Map severity to Jira priority

**For Tasks:**
- **Title:** Specific and actionable (e.g., "Update lodash from 4.17.20 to 4.17.21")
- Keep simple and direct — Definition of Done, scope of changes, risks

---

### Step 6: Create the Ticket in Jira

Use the Jira MCP tool to create the issue:

| Field | Value |
|-------|-------|
| `cloudId` | `06873323-7b4f-4662-8589-74ea341fcba6` |
| `projectKey` | `SCRUM` |
| `issueTypeName` | `{Story / Bug / Task}` |
| `summary` | Actionable title |
| `description` | Full markdown description (see type-specific template below) |
| `contentFormat` | `markdown` |

**Type-specific `additional_fields`:**

- **Story:** `{"labels": ["story"], "customfield_10016": <fibonacci_number>}`
- **Bug:** `{"priority": {"name": "<priority_level>"}, "labels": ["bug"], "customfield_10016": <fibonacci_number>}`
- **Task:** `{"labels": ["task"]}`

**Bug priority mapping:**

| Severity | Jira Priority |
|----------|---------------|
| Critical | Highest |
| Major | High |
| Minor | Medium |
| Trivial | Low |

**After creation:**

1. Move to **TODO**: use `jira_getTransitionsForJiraIssue` to find the "To Do" transition ID, then `jira_transitionJiraIssue` to move it.
2. If the user mentioned a specific assignee, use `jira_lookupJiraAccountId` to find their account ID and update via `jira_editJiraIssue` with `{"assignee": {"accountId": "..."}}`.
3. **Add to current sprint:**
   - Query for the active sprint: `jira_searchJiraIssuesUsingJql` with `project = SCRUM AND sprint in openSprints() ORDER BY created ASC` (limit 1). Extract the sprint ID from `customfield_10020` of any returned issue, or use `jira_getTeamworkGraphContext` to find active sprints.
   - If active sprint found, use `jira_editJiraIssue` with `{"customfield_10020": [sprintId]}`.
   - If no active sprint, inform the user: *"No active sprint found. The ticket has been created in To Do but was not added to a sprint. Please create a sprint and assign this ticket manually."*

---

### Step 7: Confirm & Summarize

Inform the user that the ticket has been created. Provide the Jira issue key (e.g., `SCRUM-42`). Briefly mention any interesting technical clues found during investigation.

**Do NOT create any local files.** The Jira issue is the single source of truth.

---

## Jira Issue Templates

### Story Template

```markdown
{User story: "As a [role], I want [goal], so that [benefit]."}

---

## Requirements
1. {Requirement 1}
2. {Requirement 2}

---

## Scope

### In Scope
- {Item 1}

### Out of Scope
- {Item 1}

---

## Acceptance Criteria

### AC 1: {Short Title}
**Given** {precondition}
**When** {action}
**Then** {outcome}

### AC 2: {Short Title}
**Given** {precondition}
**When** {action}
**Then** {outcome}

---

## Technical Notes

### Investigation Findings
- **Related Files:** `{related_files}`
- **Existing Patterns:** {Components/hooks/utilities to reuse}
- **Technical Considerations:** {Architecture, API changes, dependencies}

### Suggested Implementation Steps
1. {Step 1}
2. {Step 2}

### Open Questions
- {Any technical unknowns}

### Design Reference
*Delete this section if no reference URL was provided.*

- **Source URL:** `{link}`
- **Layout:** {grid/flex, alignment, responsive behavior}
- **Colors:** {hex values for backgrounds, text, borders, accents, hover/active states}
- **Typography:** {font family, sizes, weights, line heights}
- **Spacing & Sizing:** {padding, margin, gaps, component dimensions}
- **Borders & Shadows:** {border radius, border styles, box-shadow values}
- **Interactive States:** {hover, focus, active, disabled, transitions, animations}
- **Responsive Breakpoints:** {breakpoint widths, layout changes at each breakpoint}

---

## Estimation
**Story Points:** {Fibonacci number}

---

## Additional Context
{N/A if none}

---

*Generated by opencode*
```

### Bug Template

```markdown
{2-4 sentence summary — what happens, where, and impact}

---

## Environment
| Field | Value |
|-------|-------|
| **Location / URL** | {location} |
| **Device** | {device} |
| **Browser** | {browser} |
| **OS** | {os} |

---

## Steps to Reproduce
1. {Step 1}
2. {Step 2}

**Expected Behavior:** {Clear description}

**Actual Behavior:** {Clear description}

---

## Investigation Findings
- **Suspected Files:** `{related_files}`
- **Technical Clues:** {e.g., "onSubmit in Settings.tsx is missing an await"}
- **Potential Root Cause:** {Hypothesis}
- **Gaps:** {Anything still unknown}

---

## Estimation
**Story Points:** {Fibonacci number}

---

## Additional Context
{N/A if none}

---

*Generated by opencode*
```

### Task Template

```markdown
{1-2 sentence summary of what needs to be done and why}

---

## Background / Rationale
{Why this task is needed}

---

## Definition of Done
1. {How to verify the change was made}
2. {How to confirm nothing is broken}

---

## Technical Details

### Scope of Changes
- {File or area 1}: {description of change needed}
- {File or area 2}: {description of change needed}

### Investigation Findings
- **Related Files:** `{related_files}`
- **Risks:** {Breaking changes, compatibility concerns}
- **Verification:** {How to confirm the task is complete}

---

## Additional Context
{N/A if none}

---

*Generated by opencode*
```

## Best Practices & Rules
- **Proactive Communication:** Never leave the user hanging. Always output a conversational prompt asking for the next piece of information.
- **Be forgiving:** The user might just say "it's broken" or "I want a profile page." Figure out the rest through code search and polite questioning.
- **Clarify vagueness:** Actively identify ambiguous requirements, missing edge cases, and implicit assumptions. Raise them with the user.
- **Be professional:** Never use the user's exact fuzzy, slang, or poor grammar in the final markdown ticket. Always rewrite to sound professional.
- **Jira keys:** After creation, note the Jira issue key (e.g., `SCRUM-42`) — used by downstream skills.
- **Do not hallucinate:** If code investigation yields no results, state "No obvious technical clues found during initial scan."
- **Given/When/Then format:** All story acceptance criteria must follow BDD format.
- **Reference links are source of truth:** When a user provides a reference URL, treat it as the definitive design specification. Crosscheck all plan, implementation, and verification steps against this link. Never approximate or assume — always inspect the actual page with `chrome-devtools`.
- **Fibonacci estimation:** Use Fibonacci numbers (1, 2, 3, 5, 8, 13, 21) for stories and bugs only. Base estimate on codebase complexity.
- **Keep tasks simple:** Task tickets are operational/maintenance work. Don't over-engineer them. Be specific, note risks, include minimal Definition of Done. No Fibonacci estimation needed.
- **Date format:** Always use YYYY-MM-DD.
