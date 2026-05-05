# AGENTS.md - Project Agent Instructions

This project is an AI agent showcase. Follow these rules in every session.

## Prompt Logging (Required)

After receiving **every user prompt** (excluding commit instructions), append the prompt to `prompt-logs.md` with the next sequential number.

### How to log:

1. Read `prompt-logs.md` to find the last entry number and current date.
2. Increment the number by 1.
3. Append a new section in this format:

```markdown
---

### {N}. {Short Title}
**Prompt:**
> {exact user prompt text}

---

*Last updated: {YYYY-MM-DD}*
```

4. Use the current date for the "Last updated" line.

### Exceptions:

- Do **not** log prompts that are only "commit all changes" or similar commit-only instructions.
- Do **not** log prompts that are only "update prompt-logs.md" or "amend commit" instructions (these are meta-logging tasks).

## Code Conventions

- React 19 + TypeScript + Vite
- Tailwind CSS v4 for styling
- No external UI library — build custom components
- Follow existing patterns in the codebase
- Always run `npm test -- --run` after making changes
