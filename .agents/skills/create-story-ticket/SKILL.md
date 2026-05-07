---
name: create-story-ticket
description: Acts as a helpful product/engineering assistant that takes fuzzy feature requests or story ideas, investigates the codebase, asks clarifying questions, and generates a highly structured, professional user story ticket.
---

# Create Story Ticket Skill

## Description
This skill transforms raw, unstructured, or "fuzzy" feature requests into clean, actionable, and professional user story tickets. Upon being triggered, the agent takes the initiative to prompt the user for details, actively investigates the codebase, and generates a markdown ticket in `./stories/{title}.md`.

Use this skill when the user says things like: "I need a new feature", "Create a story for the user profile page", "Let's add dark mode", "Write up a ticket for the export functionality", etc.

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

### Step 4: Rewrite & Structure
Once the user answers your prompts, synthesize everything into professional terminology:
- **Title:** Convert "add dark mode" to actionable titles like "Implement Dark Mode Theme Toggle".
- **Description:** Frame as a user story (As a [role], I want [goal], so that [benefit]).
- **Requirements:** Convert fuzzy wants into clear, testable requirements.
- **Acceptance Criteria:** Write in Given/When/Then format.
- **Technical notes:** Include file references, existing patterns to follow, and step-by-step implementation hints.

### Step 5: Generate the Story Ticket
Ensure the `./stories/` directory exists (create it if not). Create the file at `./stories/{title-in-kebab-case}.md` using the template below.

### Step 6: Confirm & Summarize
Inform the user that the ticket has been created. Provide the file path and briefly mention any technical context or existing patterns you found during your investigation that were added to the ticket.

---

## Story Ticket Template

```markdown
# {title}

**Status:** Open  
**Estimation:** {estimation}  
**Date Created:** {date}  

---

## Description
*{A 2-4 sentence professional summary written as a user story. "As a [role], I want [feature/goal], so that [benefit/value]."}*

---

## Requirements
1. {Requirement 1}
2. {Requirement 2}
3. {Requirement 3}
4. {Requirement N}

---

## Scope

### In Scope
- {Item 1}
- {Item 2}
- {Item 3}

### Out of Scope
- {Item 1}
- {Item 2}

---

## Acceptance Criteria

### AC 1: {Short Title}
- **Given** {initial context or preconditions}
- **When** {action or event}
- **Then** {expected outcome}

### AC 2: {Short Title}
- **Given** {initial context or preconditions}
- **When** {action or event}
- **Then** {expected outcome}

### AC 3: {Short Title}
- **Given** {initial context or preconditions}
- **When** {action or event}
- **Then** {expected outcome}

---

## Estimation

| Size | Description |
|------|-------------|
| **XS** | Trivial change, < 1 hour |
| **S** | Small task, a few hours |
| **M** | Moderate effort, 1-2 days |
| **L** | Significant work, 3-5 days |
| **XL** | Large feature, > 1 week |

**Selected:** {XS | S | M | L | XL} — {brief justification}

---

## Technical Notes

### Investigation Findings
*(Generated by AI Code Search)*

- **Related Files:** `{related_files}`
- **Existing Patterns:** {Describe any existing components, hooks, utilities, or patterns that can be reused or followed}
- **Technical Considerations:** {Any architectural notes, API changes, state management implications, or dependencies}

### Suggested Implementation Steps
1. {Step 1 — e.g., "Create the new component in `src/components/`"}
2. {Step 2 — e.g., "Add the API endpoint handler in `src/api/`"}
3. {Step 3 — e.g., "Wire up state management with existing store"}
4. {Step 4 — e.g., "Add unit tests and integration tests"}
5. {Step 5 — e.g., "Update documentation if applicable"}

### Missing Information / Open Questions
- {Any technical unknowns or decisions that need to be made before or during implementation}

---

## Additional Context
{Any extra design links, mockups, reference tickets, or notes. Put "N/A" if none.}

---

## Conversation Log
*Full conversation between user and agent during ticket creation for reference:*

### Agent
> {Agent's initial prompt or question}

### User
> {User's response}

### Agent
> {Agent's follow-up prompt or question}

### User
> {User's response}

---
*Generated by opencode*
```

## Best Practices & Rules
- **Proactive Communication:** Never leave the user hanging. Always output a conversational prompt asking for the next piece of information you need.
- **Be forgiving:** The user might just say "I want a profile page." It is your job to figure out the rest through code search and polite questioning.
- **Clarify vagueness:** Actively identify ambiguous requirements, missing edge cases, and implicit assumptions. Raise them with the user before writing the ticket. Never leave vague language like "fast," "user-friendly," or "handle errors" unclarified — always push for specifics.
- **Be professional:** Never use the user's exact fuzzy, slang, or poor grammar in the final markdown ticket. Always rewrite it to sound like a Senior Product Engineer wrote it.
- **Kebab-case filenames:** Always format the file name correctly (e.g., `./stories/user-profile-page.md`).
- **Date format:** Always use YYYY-MM-DD for the `{date}` field.
- **Do not hallucinate:** If your code investigation yields no results, state "No obvious technical clues found during initial scan" in the Investigation Findings section.
- **Given/When/Then format:** All acceptance criteria must follow the Given/When/Then BDD format strictly.
- **Estimation guidance:** Base estimation on codebase complexity findings. If similar features exist, lean smaller. If it requires new infrastructure, lean larger.
