---
name: create-story-ticket
description: Acts as a helpful product/engineering assistant that takes fuzzy feature requests or story ideas, investigates the codebase, asks clarifying questions, and generates a highly structured, professional user story ticket.
---

# Create Story Ticket Skill

## Description
This skill transforms raw, unstructured, or "fuzzy" feature requests into clean, actionable, and professional user story tickets. Upon being triggered, the agent takes the initiative to prompt the user for details, actively investigates the codebase, and creates a Story issue in the SCRUM Jira project.

Use this skill when the user says things like: "I need a new feature", "Create a story for the user profile page", "Let's add dark mode", "Write up a ticket for the export functionality", etc.

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "technical-business-analyst"` to execute the **full workflow** (Steps 1–6).
2. Pass the user's input and Jira constants (`cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`, `projectKey: "SCRUM"`) in the `prompt`.
3. After subagent completes, present the resulting Jira issue key to the user.

## Workflow

### Step 1: Trigger & Proactively Prompt the User
When this skill is triggered, **do not wait for the user to explain everything.** Take the initiative immediately.
- If the user provided a very short trigger (e.g., "I need a new story"), reply immediately with a friendly, open-ended prompt like: *"I can help with that! What feature or story do you want to build? Feel free to describe it naturally, and I'll figure out the technical details."*
- If the user already provided a fuzzy description (e.g., "add a dark mode toggle"), immediately parse their input to identify what they want and what implicit details are missing.

### Step 2: Conduct Early Code Investigation (Silent Step)
Before asking follow-up questions, attempt to map their fuzzy description to the codebase:
- Use `glob` or file search tools to find files matching their fuzzy terms (e.g., searching for `theme`, `toggle`, `profile`, `export`).
- Use `grep` or `read` to look inside the suspected components. Are there existing patterns we can extend? Is there a theme provider already? What APIs exist?
- Identify related files, existing components, shared utilities, or similar features that can serve as references.
- Formulate a brief technical hypothesis for how this could be implemented.

### Step 3: Prompt with Clarifying Questions
Based on the user's initial fuzzy input and your code investigation, **immediately reply to the user** asking for the missing context. Do not wait for them to guess what you need. It is also your responsibility to **identify vague requirements, edge cases, and potential ambiguities** and proactively raise them with the user.

Ask a maximum of 2-4 questions in a **conversational, natural tone**. Do NOT send them a rigid form.
Examples of what to ask:
1. **User value:** "Who is this for? What problem does it solve for them?"
2. **Scope boundaries:** "Should this include the settings page too, or just the toggle itself?"
3. **Edge cases:** "What should happen if the user has no data to export?" or "What if the API is slow or fails — should we show a loading state or a fallback?"
4. **Vague requirements:** "You mentioned 'fast loading' — do you have a target in mind, or should we aim for under 2 seconds?"
5. **Design/UX:** "Do you have a mockup, or should we follow the existing component patterns?"
6. **Estimation (Fibonacci):** "What size do you estimate this is? Pick a Fibonacci number: 1, 2, 3, 5, 8, 13, or 21?"

### Step 4: Rewrite & Structure
Once the user answers your prompts, synthesize everything into professional terminology:
- **Title:** Convert "add dark mode" to actionable titles like "Implement Dark Mode Theme Toggle".
- **Description:** Frame as a user story (As a [role], I want [goal], so that [benefit]).
- **Requirements:** Convert fuzzy wants into clear, testable requirements.
- **Acceptance Criteria:** Write in Given/When/Then format.
- **Technical notes:** Include file references, existing patterns to follow, and step-by-step implementation hints.

### Step 5: Create the Story in Jira

Use the Jira MCP tool to create the story issue with these fields:

| Field | Value |
|-------|-------|
| `cloudId` | `06873323-7b4f-4662-8589-74ea341fcba6` |
| `projectKey` | `SCRUM` |
| `issueTypeName` | `Story` |
| `summary` | Actionable title (e.g., "Implement Dark Mode Theme Toggle") |
| `description` | Full markdown description with sections from the template below |
| `additional_fields` | `{"labels": ["..."], "customfield_10016": <number>}` |

1. Call `jira_createJiraIssue` with the structured data — include `customfield_10016` in `additional_fields` with the Fibonacci value the user chose.
2. Move the ticket to the **TODO** column: use `jira_getTransitionsForJiraIssue` to find the "To Do" transition ID, then `jira_transitionJiraIssue` to move it.
3. If the user mentioned a specific assignee, use `jira_lookupJiraAccountId` to find their account ID and update via `jira_editJiraIssue`.
4. **Add to current sprint:**
   - Query for the active sprint: `jira_searchJiraIssuesUsingJql` with `project = SCRUM AND sprint in openSprints() ORDER BY created ASC` (limit 1). Extract the sprint ID from the `customfield_10020` field of any returned issue, or use `jira_getTeamworkGraphContext` to find active sprints.
   - If an active sprint is found, use `jira_editJiraIssue` with `{"customfield_10020": [sprintId]}` to add the issue to that sprint.
   - If no active sprint exists, inform the user: *"No active sprint found. The ticket has been created in To Do but was not added to a sprint. Please create a sprint and assign this ticket manually."*
   - The sprint field is `customfield_10020` (type: array of numbers — pass the sprint ID as a single-element array).

### Step 6: Confirm & Summarize
Inform the user that the ticket has been created. Provide the Jira issue key (e.g., `SCRUM-42`). Briefly mention any technical context or existing patterns you found during your investigation that were added to the description.

**Do NOT create any local files.** The Jira issue is the single source of truth.

---

## Jira Story Issue Structure

When creating the Jira issue, use `contentFormat: "markdown"` and structure the description with these sections:

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
3. {Step 3}

### Open Questions
- {Any technical unknowns}

---

## Estimation
**Story Points:** {Fibonacci number: 1, 2, 3, 5, 8, 13, or 21}

---

## Additional Context
{Design links, mockups, references. "N/A" if none.}

---

## Conversation Log
{User/agent dialogue for reference}

---

*Generated by opencode*
```

### Estimation (Fibonacci)
During Step 3, ask the user to pick a Fibonacci number (1, 2, 3, 5, 8, 13, 21) for the story point estimate. Include this value in `customfield_10016` (`customfield_10016` is the "Story point estimate" field in Jira). Also add it to the `## Estimation` section in the description.

### Assignee
If the user specified a person, use `jira_lookupJiraAccountId` to get their account ID, then update the issue via `jira_editJiraIssue` with `{"assignee": {"accountId": "..."}}`.

## Best Practices & Rules
- **Proactive Communication:** Never leave the user hanging. Always output a conversational prompt asking for the next piece of information you need.
- **Be forgiving:** The user might just say "I want a profile page." It is your job to figure out the rest through code search and polite questioning.
- **Clarify vagueness:** Actively identify ambiguous requirements, missing edge cases, and implicit assumptions. Raise them with the user before writing the ticket. Never leave vague language like "fast," "user-friendly," or "handle errors" unclarified — always push for specifics.
- **Be professional:** Never use the user's exact fuzzy, slang, or poor grammar in the final markdown ticket. Always rewrite it to sound like a Senior Product Engineer wrote it.
- **Jira keys:** After creation, note the Jira issue key (e.g., `SCRUM-42`) — it is used by downstream skills like `create-development-plan` and `verify-changes`.
- **Date format:** Always use YYYY-MM-DD for the `{date}` field.
- **Do not hallucinate:** If your code investigation yields no results, state "No obvious technical clues found during initial scan" in the Investigation Findings section.
- **Given/When/Then format:** All acceptance criteria must follow the Given/When/Then BDD format strictly.
- **Estimation guidance:** Use Fibonacci numbers (1, 2, 3, 5, 8, 13, 21). Base the estimate on codebase complexity findings — if similar features exist, lean smaller; if it requires new infrastructure, lean larger. Always set `customfield_10016` (story point estimate) in Jira via `additional_fields`.
