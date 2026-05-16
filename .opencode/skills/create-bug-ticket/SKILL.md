---
name: create-bug-ticket
description: Acts as a helpful QA assistant that immediately prompts the user for fuzzy bug descriptions, conducts a quick codebase investigation, asks natural clarifying questions, and generates a highly structured, professional bug ticket.
---

# Create Bug Ticket Skill

## Description
This skill transforms raw, unstructured, or "fuzzy" bug reports into clean, actionable, and professional Jira bug tickets. Upon being triggered, the agent takes the initiative to prompt the user for details, actively investigates the codebase, and creates a Bug issue in the SCRUM Jira project.

Use this skill when the user says things like: "I found a bug", "The login is broken", "Create a ticket for the layout issue", etc.

## Workflow

### Step 1: Trigger & Proactively Prompt the User
When this skill is triggered, **do not wait for the user to explain everything.** Take the initiative immediately.
- If the user provided a very short trigger (e.g., "I need to report a bug"), reply immediately with a friendly, open-ended prompt like: *"I can help with that! What's broken? Feel free to describe it naturally, and I'll figure out the technical details."*
- If the user already provided a fuzzy description (e.g., "the blue button is broken"), immediately parse their input to identify what is broken and what implicit details are missing.

### Step 2: Conduct Early Code Investigation (Silent Step)
Before asking follow-up questions, attempt to map their fuzzy description to the codebase:
- Use `glob` or file search tools to find files matching their fuzzy terms (e.g., searching for `settings`, `button`, `profile`).
- Use `grep` or `read` to look inside the suspected component. Does it have an `onClick` handler? Does it call an API? 
- Check if there are obvious reasons for the bug based on recent code or missing error handling.
- Formulate a brief technical hypothesis.

### Step 3: Prompt with Clarifying Questions
Based on the user's initial fuzzy input and your code investigation, **immediately reply to the user** asking for the missing context. Do not wait for them to guess what you need. 
Ask a maximum of 1-3 questions in a **conversational, natural tone**. Do NOT send them a rigid form. 
Examples of what to ask:
1. **Behavioral gaps:** "Does it show an error message, or just do nothing at all?"
2. **Reproduction steps:** "Did this happen right after you logged in, or were you already on the page?"
3. **Environment (only if necessary):** "Are you testing this on desktop or mobile? Which browser?" *(Note: Default to Desktop/Chrome if it's a standard web project and the user doesn't know).*
4. **Estimation (Fibonacci):** "What size do you estimate this is? Pick a Fibonacci number: 1, 2, 3, 5, 8, 13, or 21?"

### Step 4: Rewrite & Structure
Once the user answers your prompts, synthesize everything into professional terminology:
- **Title:** Convert "button broken" to actionable titles like "Settings Page Submit Button Unresponsive".
- **Steps to Reproduce:** Convert conversational steps into numbered, imperative lists.
- **Expected/Actual Behavior:** Use precise technical language.

### Step 5: Create the Bug in Jira

Use the Jira MCP tool to create the bug issue with these fields:

| Field | Value |
|-------|-------|
| `cloudId` | `06873323-7b4f-4662-8589-74ea341fcba6` |
| `projectKey` | `SCRUM` |
| `issueTypeName` | `Bug` |
| `summary` | Actionable title (e.g., "Settings Page Submit Button Unresponsive") |
| `description` | Full markdown description with sections from the template below |
| `additional_fields` | `{"priority": {"name": "..."}, "labels": ["..."], "customfield_10016": <number>}` |

1. Call `jira_createJiraIssue` with the structured data — include `customfield_10016` in `additional_fields` with the Fibonacci value the user chose.
2. Move the ticket to the **TODO** column: use `jira_getTransitionsForJiraIssue` to find the "To Do" transition ID, then `jira_transitionJiraIssue` to move it.
3. If the user mentioned a specific assignee, use `jira_lookupJiraAccountId` to find their account ID and update via `jira_editJiraIssue`.
4. **Add to current sprint:**
   - Query for the active sprint: `jira_searchJiraIssuesUsingJql` with `project = SCRUM AND sprint in openSprints() ORDER BY created ASC` (limit 1). Extract the sprint ID from the `customfield_10020` field of any returned issue, or use `jira_getTeamworkGraphContext` to find active sprints.
   - If an active sprint is found, use `jira_editJiraIssue` with `{"customfield_10020": [sprintId]}` to add the issue to that sprint.
   - If no active sprint exists, inform the user: *"No active sprint found. The ticket has been created in To Do but was not added to a sprint. Please create a sprint and assign this ticket manually."*
   - The sprint field is `customfield_10020` (type: array of numbers — pass the sprint ID as a single-element array).

### Step 6: Confirm & Summarize
Inform the user that the ticket has been created. Provide the Jira issue key (e.g., `SCRUM-42`). Briefly mention any interesting technical clues you found during your investigation that were added to the description.

**Do NOT create any local files.** The Jira issue is the single source of truth.

---

## Jira Bug Issue Structure

When creating the Jira issue, use `contentFormat: "markdown"` and structure the description with these sections:

```markdown
{2-4 sentence professional summary — what happens, where, and impact}

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
3. {Step 3}

**Expected Behavior:** {Clear description}

**Actual Behavior:** {Clear description}

---

## Investigation Findings
- **Suspected Files:** `{related_files}`
- **Technical Clues:** {e.g., "onSubmit in Settings.tsx is missing an await"}
- **Potential Root Cause:** {Your hypothesis}
- **Gaps:** {Anything still unknown}

---

## Estimation
**Story Points:** {Fibonacci number: 1, 2, 3, 5, 8, 13, or 21}

---

## Additional Context
{Any screenshots, logs, or user notes. "N/A" if none.}

---

## Conversation Log
{User/agent dialogue for reference}

---

*Generated by opencode*
```

### Priority mapping

| Severity | Jira Priority |
|----------|---------------|
| Critical | Highest |
| Major | High |
| Minor | Medium |
| Trivial | Low |

Pass priority via `additional_fields: {"priority": {"name": "High"}}`.

### Estimation (Fibonacci)
During Step 3, ask the user to pick a Fibonacci number (1, 2, 3, 5, 8, 13, 21) for the story point estimate. Include this value in `customfield_10016` (`customfield_10016` is the "Story point estimate" field in Jira). The value is also added to the `## Estimation` section in the description.

### Assignee
If the user specified a person, use `jira_lookupJiraAccountId` to get their account ID, then update the issue via `jira_editJiraIssue` with `{"assignee": {"accountId": "..."}}`.

## Best Practices & Rules
- **Proactive Communication:** Never leave the user hanging. Always output a conversational prompt asking for the next piece of information you need.
- **Be forgiving:** The user might just say "it's broken." It is your job to figure out the rest through code search and polite questioning.
- **Be professional:** Never use the user's exact fuzzy, slang, or poor grammar in the final markdown ticket. Always rewrite it to sound like a Senior QA Engineer wrote it.
- **Jira keys:** After creation, note the Jira issue key (e.g., `SCRUM-42`) — it is used by downstream skills like `create-development-plan` and `verify-changes`.
- **Date format:** Always use YYYY-MM-DD for the `{date}` field.
- **Do not hallucinate:** If your code investigation yields no results, state "No obvious technical clues found during initial scan" in the Investigation Findings section.