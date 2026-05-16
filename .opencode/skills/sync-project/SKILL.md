---
name: sync-project
description: Synchronizes project files (README.md, and component documentation) with the current state of the codebase. By default syncs changed files only; supports full sync when explicitly requested. README.md is synced to the Confluence SCRUM space under the Project page, and component docs are synced under the Components page.
---

# Sync Project Skill

## Description

This skill ensures the project documentation stays in sync with the codebase. It updates `README.md`, and generates/updates component documentation under `./docs/`.

By default, it only processes **changed files** for efficiency. If the user explicitly requests a **full sync**, it will scan all files (with confirmation).

Use this skill when the user says things like: "Sync the project", "Update project docs", "Run sync", "Full sync all files", or when invoked from a git precommit hook.

## Workflow

### Step 1: Determine Sync Mode

By default, the skill runs in **Changed Files Mode** (only processes modified files). This is the behavior for:
- Precommit hooks (automatic)
- Manual invocation without specifying "full sync"

**Check if user wants full sync:**
- If the user's prompt contains phrases like "full sync", "all files", "entire project", ask for confirmation:
  > "This will check ALL project files (README.md, and all components). This may take longer. Do you want to proceed with a full sync?"
- If user confirms, proceed to Step 3 (Full Scan Mode)
- If user cancels or doesn't confirm, proceed to Step 2 (Changed Files Mode)

**Precommit context detection (optional, for logging only):**
- Check if `HUSKY` or `GIT_PARAMS` environment variables are set
- This is informational only - precommit always uses Changed Files Mode

### Step 2: Changed Files Mode (Default)

When running in default mode, only process files that have been modified:

1. **Get changed files:**
   ```bash
   git diff --cached --name-only
   ```

2. **Filter relevant files:**
   - Components: `src/components/**/*.tsx`
   - Documentation: `README.md`
   - Docs folder: `docs/**/*.md`

3. **Process each changed component:**
   - If a component file changed (`.tsx`), check if corresponding doc exists in `./docs/`
   - If doc is missing or outdated, use the `generate-document` skill to create/update it
   - Doc filename should be kebab-case of component name (e.g., `FlightSearch.tsx` → `docs/flight-search.md`)

4. **Update README.md if needed:**
   - If any component files changed, check if README.md accurately reflects the current project state
   - Use the existing README.md structure and update it to match current:
     - List of components
     - Tech stack
     - Available scripts
     - Project structure

### Step 3: Full Scan Mode (Explicit Request)

When user explicitly requests full sync and confirms:

1. **Scan all components:**
   - Use `glob` to find all components: `src/components/**/*.tsx`
   - Exclude test files (`*.test.tsx`) and story files (`*.stories.tsx`)
   - For each component, check if corresponding doc exists in `./docs/`
   - If doc is missing, use the `generate-document` skill to create it
   - If doc exists but component was modified more recently, offer to update it

2. **Update README.md:**
   - Read current README.md
   - Compare with actual project state:
     - Components listed vs actual components in `src/components/`
     - Tech stack (check `package.json` for dependencies)
     - Available scripts (check `package.json` scripts section)
     - Project structure (verify directories exist)
     - Available skills (check `.agents/skills/` directory)
   - Update README.md to match current state

### Step 4: Sync README.md to Confluence Project Page

After applying local changes to README.md, sync it to the Confluence SCRUM space:

1. **Update the Project page** at `https://shumiq.atlassian.net/wiki/spaces/SCRUM/pages/65986/Project`:
   - Use `jira_getConfluencePage` with `pageId: "65986"` and `cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"` to get current page content.
   - Convert the README.md content to markdown and update using `jira_updateConfluencePage` with `pageId: "65986"`, `cloudId: "06873323-7b4f-4662-8589-74ea341fcba6"`, `contentFormat: "markdown"`.

2. **Component documentation sync** is handled by the `generate-document` skill's Step 4 (Confluence sync).

### Step 5: Apply Changes

After investigation:

1. **For README.md updates:**
   - Use the `edit` tool to update sections that are out of sync
   - Maintain the existing format and structure
   - Update the "Last updated" date if changes were made

2. **For component documentation:**
   - Use the `generate-document` skill for each component that needs docs
   - This will create/update `./docs/{component-name}.md`

### Step 5: Summary

Provide a concise summary of what was done:

- Files checked/updated
- Components documented
- Any issues found (e.g., missing tests, outdated docs)

## Rules & Best Practices

- **Default to changed files:** Always use Changed Files Mode unless user explicitly requests full sync
- **User confirmation:** Ask for confirmation only when user requests full sync
- **No hallucination:** Base all updates on actual file content, not assumptions
- **Follow existing patterns:** Match the format of existing documentation
- **Respect AGENTS.md:** Follow the prompt logging rules exactly
- **Kebab-case docs:** Component docs should use kebab-case filenames
- **Date format:** Use YYYY-MM-DD for all dates
- **Atomic updates:** Make all changes clear and traceable

## Environment Detection

To detect if running in precommit context (informational only):

```bash
# Check for husky/git hook environment
if [ -n "$HUSKY" ] || [ -n "$GIT_PARAMS" ]; then
  echo "Running in git hook context"
fi
```

In practice, the skill should:
1. Always default to Changed Files Mode (Step 2)
2. Only prompt for confirmation if user explicitly requests "full sync"
3. Check `HUSKY` env var only for informational purposes

## Integration with Precommit Hook

To use this skill in a precommit hook:

1. Initialize husky: `pnpm dlx husky-init && pnpm install`
2. Create `.husky/precommit` with:
   ```bash
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"
   
   # Run sync-project skill via opencode CLI (default: changed files only)
   pnpm exec opencode run "sync the project"
   ```

Note: The precommit hook triggers the skill without "full sync" in the prompt, so it defaults to Changed Files Mode automatically.

*Generated by opencode*
