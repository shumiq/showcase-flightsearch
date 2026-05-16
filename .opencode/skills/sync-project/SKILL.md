---
name: sync-project
description: Synchronizes Confluence project pages (Project overview and component documentation) and local documentation files (AGENTS.md, README.md) with the current state of the codebase. By default syncs changed components only; supports full sync when explicitly requested.
---

# Sync Project Skill

## Description

This skill ensures both Confluence project documentation and local documentation files stay in sync with the codebase. It updates the SCRUM space's Project page, creates/updates component documentation pages under the Components parent page, and refreshes AGENTS.md and README.md to reflect the current project state.

By default, it only processes **changed components** for efficiency. If the user explicitly requests a **full sync**, it will scan all components (with confirmation).

Use this skill when the user says things like: "Sync the project", "Update project docs", "Run sync", "Full sync all files", or when invoked from a git precommit hook.

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "technical-lead"` to execute the **full workflow** (Steps 1–5).
2. Pass the user's input and Confluence constants (`spaceId: "65859"`, Project page ID `65986`, Components page ID `98459`) in the `prompt`.
3. After subagent completes, present the sync summary to the user.

## Workflow

### Step 1: Determine Sync Mode

By default, the skill runs in **Changed Files Mode** (only processes modified component files). This is the default for:
- Precommit hooks (automatic)
- Manual invocation without specifying "full sync"

**Check if user wants full sync:**
- If the user's prompt contains phrases like "full sync", "all files", "entire project", ask for confirmation.
- If user confirms, proceed to Step 3 (Full Scan Mode)
- If user cancels or doesn't confirm, proceed to Step 2 (Changed Files Mode)

### Step 2: Changed Files Mode (Default)

When running in default mode, only process component files that have been modified:

1. **Get changed files:**
   ```bash
   git diff --cached --name-only
   ```
   Also check unstaged changes:
   ```bash
   git diff --name-only
   ```

2. **Filter relevant files:**
   - Components: `src/components/**/*.tsx`

3. **Process each changed component:**
   - Use the `generate-document` skill to create/update the Confluence page for each changed component.
   - The skill handles finding or creating the child page under the Components parent page.

4. **Update the Project page on Confluence:**
   - Use `jira_getConfluencePage` with `pageId: "65986"` to get current Project page content.
   - Generate updated content reflecting the current project state.
   - Include sections for: project overview, tech stack, components built, AI agents (table with agent name, description, invocation), development workflow (steps), AI skills (table with skill name, description, source of truth), and project structure.
   - The agent descriptions and workflow table should match what is in `.opencode/agents/*.md` (definitions) and `.opencode/workflows/feature-development.md` (step descriptions).
   - Update using `jira_updateConfluencePage`.

### Step 3: Full Scan Mode (Explicit Request)

When user explicitly requests full sync and confirms:

1. **Scan all components:**
   - Use `glob` to find all components: `src/components/**/*.tsx`
   - Exclude test files (`*.test.tsx`) and story files (`*.stories.tsx`)
   - For each component, use the `generate-document` skill to create/update its Confluence page.

2. **Update the Project page on Confluence:**
   - Read current Confluence Project page content.
   - Compare with actual project state and update as needed.
   - Include sections for: project overview, tech stack, components built, AI agents table, development workflow, AI skills table, and project structure.

### Step 4: Sync Local Documentation Files

After updating Confluence, sync the local documentation files to match the current project state. These files are checked into version control and serve as the authoritative source for agent instructions and project overview.

#### 4a. Update AGENTS.md

Read the current `AGENTS.md` and update these sections:

**Available Agents table:**
- Read all agent definitions from `.opencode/agents/*.md` files
- Extract the description from each file's frontmatter
- Build the table rows with: Agent name, Description (from frontmatter), Entry point (`Task` tool with `subagent_type: "<name>"`)
- The `technical-lead` row should include "Determines ticket types, creates task tickets," prefix from the `create-ticket` skill logic

**Workflow section (feature-development):**
- Read `.opencode/workflows/feature-development.md`
- Extract Step numbers, Agents, Skills, and Descriptions from each step's heading and body
- Reconstruct the workflow table rows
- Update the Fresh Start and Continue Mode invocation commands to match the workflow file

**Preserve** all other content (headers, integration sections, usage examples) — only update the agent table and workflow table.

#### 4b. Update README.md

Read the current `README.md` and update these sections:

**Available AI Agent Skills table:**
- Read all skill definitions from `.opencode/skills/*/SKILL.md` files
- Extract the name (from frontmatter) and description (from frontmatter) for each skill
- Build the table with: Skill name, Description, Source of Truth
  - For source of truth, infer from context: skills that create Jira issues → "Jira (SCRUM project)", skills that use Confluence → "Confluence (SCRUM space)", `implement-ticket` → "`./src/components/...`", `create-development-plan` → "Jira comment"
- Sort alphabetically by skill name
- Replace only the skills table section — preserve all other content

### Step 5: Summary

Provide a concise summary of what was done:

- Components documented/updated on Confluence
- Project page updated
- Local files updated (AGENTS.md, README.md)
- Any issues found (e.g., missing tests, outdated docs)

## Rules & Best Practices

- **Default to changed files:** Always use Changed Files Mode unless user explicitly requests full sync
- **User confirmation:** Ask for confirmation only when user requests full sync
- **No hallucination:** Base all updates on actual file content, not assumptions
- **Follow existing patterns:** Match the format of existing Confluence documentation and local markdown files
- **Respect AGENTS.md:** Follow the prompt logging rules exactly
- **Date format:** Use YYYY-MM-DD for all dates
- **Preserve non-table content:** When updating AGENTS.md and README.md, only modify the specific tables and sections — keep everything else intact

*Generated by opencode*
