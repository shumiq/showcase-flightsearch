---
name: create-bug-ticket
description: Guides the user through creating a structured bug ticket by accepting fuzzy input, conducting early investigation, and rewriting everything into clean, organized content with additional context and clues.
---

# Create Bug Ticket Skill

## Description
This skill helps users create structured bug tickets by accepting raw, fuzzy bug descriptions and rewriting them into clean, professional, and easy-to-read content. It actively investigates the issue by examining relevant code, identifying gaps, and adding contextual clues. It generates a consistent bug report at `./bugs/{title}.md`.

Use this skill when the user asks to create a bug ticket, report a bug, or file an issue.

## Workflow

### Step 1: Accept & Rewrite User Input
The user may provide rough, unstructured, or fuzzy information about the bug. Your job is to:
- **Rewrite and structure** their input into clear, professional language
- **Organize** steps to reproduce into numbered, actionable steps
- **Clarify** expected and actual behavior with proper grammar and formatting
- **Extract** key information even if poorly described
- **Infer** context from conversation history and project structure

First, infer the following fields from available context (user's initial request, conversation history, project context, environment info):
- **Title**: Derive from the user's bug description (e.g., "login button not working" → "Login Button Not Working")
- **Steps to Reproduce**, **Expected Behavior**, **Actual Behavior**: Extract and rewrite from the user's provided details about the bug
- **Component/File Location**: Identify which files or components are likely involved

### Step 2: Conduct Early Investigation
Before asking environment questions, actively investigate the bug by:
- **Reading relevant source files** mentioned or implied by the bug description
- **Searching for related code** using grep/glob to find potential causes
- **Checking recent changes** that might have introduced the bug
- **Identifying gaps** in the user's description (missing steps, unclear behavior, etc.)
- **Looking for patterns** in similar components or previous bugs
- **Examining component dependencies** and interactions

Use tools like `read`, `grep`, `glob`, and `task` (with explore subagent) to gather technical context.

### Step 3: Gather Environment Info
For fields that cannot be inferred from investigation, use the `question` tool to ask only the following in a single call (omit questions for Title, description fields, and Additional Context):
1. **Device** - Desktop, mobile, tablet, etc. (infer as Desktop for web projects if not specified)
2. **Browser** - Chrome, Firefox, Safari, Edge, etc.
3. **Browser Version** - Version number of the browser
4. **Operating System** - Windows, macOS, Linux, iOS, Android, etc. (infer from environment platform if possible)
5. **Severity** - Critical, High, Medium, Low

Note: "Where it happened" should already be identified during investigation.

### Step 4: Generate Bug Description
Before creating the ticket, generate a concise **Description** section that summarizes the bug by deriving from ALL context:
- User's bug report and fuzzy input
- Investigation findings
- Steps to reproduce
- Expected vs actual behavior
- Technical context discovered

The description should be 2-4 sentences that clearly explain what the bug is, when it occurs, and its impact. Write it in professional language that gives developers immediate understanding of the issue.

### Step 5: Create Bug Ticket
After gathering, investigating, rewriting all information, and generating the description, create the bug ticket file at `./bugs/{title}.md` using the template below. Convert the title to kebab-case for the filename. Ensure all content is well-structured, properly formatted, and easy to read.

Include in the bug ticket:
- **Generated description** at the top summarizing the bug
- **Investigation findings** in the Investigation Findings section
- **Potential root causes** or clues discovered
- **Related files** examined during investigation
- **Gaps identified** that need further investigation

### Step 5: Confirm
Inform the user that the bug ticket has been created and show the file path.

## Bug Ticket Template

```markdown
# {title}

**Status:** Open
**Severity:** {severity}
**Created:** {date}

---

## Description

{description}

---

## Environment

| Field | Value |
|-------|-------|
| Location | {location} |
| Device | {device} |
| Browser | {browser} |
| Browser Version | {browser_version} |
| Operating System | {os} |

---

### Steps to Reproduce

{steps_to_reproduce}

### Expected Behavior

{expected_behavior}

### Actual Behavior

{actual_behavior}

---

## Investigation Findings

{investigation_findings}

### Potential Root Causes
{potential_root_causes}

### Related Files
{related_files}

### Gaps Identified
{gaps_identified}

---

## Additional Context

{additional_context}

---

*Bug ticket created by opencode*
```

## Notes
- Replace `{date}` with the current date in YYYY-MM-DD format
- If additional context is not provided, use "N/A"
- Ensure the `./bugs/` directory exists before writing the file; create it if necessary
- Use kebab-case for the filename (e.g., `login-button-not-working.md`)
- **Important**: Always rewrite and structure user's fuzzy input into clean, professional language. Fix grammar, organize steps into numbered lists, and ensure the bug ticket is easy to read and understand.
- **Investigation**: Actively investigate the bug before creating the ticket. Read relevant source files, search for related code, check recent changes, and identify potential causes. Document all findings in the Investigation Findings section.
- **Add Value**: Your job is to help the user by gathering information they may have missed, identifying gaps in their description, and providing technical context that will help developers fix the bug faster.
