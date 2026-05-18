---
name: sync-project
description: Synchronizes Confluence project pages (Project overview and component documentation), available commands, skills, agents, workflows, and local documentation files (AGENTS.md, README.md) with the current state of the codebase. By default syncs changed components only; supports full sync when explicitly requested.
---

# Sync Project Skill

## Description

This skill ensures both Confluence project documentation and local documentation files stay in sync with the codebase. It updates the SCRUM space's Project page, creates/updates component documentation pages under the Components parent page, syncs available commands, skills, agents, and workflows from `.opencode/` definitions, and refreshes AGENTS.md and README.md to reflect the current project state.

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
   - Commands: `.opencode/commands/*.md`
   - Skills: `.opencode/skills/*/SKILL.md`
   - Agents: `.opencode/agents/*.md`
   - Workflows: `.opencode/workflows/*.md`
   - MCP Servers: `opencode.json` (if changed)
   - Scripts: `package.json` (if changed)

3. **Process each changed component:**
   - Use the `generate-document` skill to create/update the Confluence page for each changed component.
   - The skill handles finding or creating the child page under the Components parent page.

4. **Collect all project metadata from `.opencode/`:**
   - **Commands:** Read `.opencode/commands/*.md`. Extract frontmatter (`description`, `agent`) for each. Build a table with: Command name (filename without extension), Agent, Description.
   - **Skills:** Read `.opencode/skills/*/SKILL.md`. Extract frontmatter (`name`, `description`) for each. Build a table with: Skill name, Description, Source of Truth.
   - **Agents:** Read `.opencode/agents/*.md`. Extract frontmatter (`description`) for each. Build a table with: Agent name, Description, Entry point.
   - **Workflows:** Read `.opencode/workflows/*.md`. Extract frontmatter (`name`, `description`, `agents`) for each. Build a table with: Workflow name, Description, Agents involved.
   - **MCP Servers:** Read `opencode.json` and extract the `mcp` section. For each MCP server entry, extract: server name (key), type, url/baseUrl. Build a table with: Server name, Type, URL.
   - **Scripts:** Read `package.json` and extract the `scripts` section for the Available Scripts table.

5. **Update the Project page on Confluence:**
   - Use `jira_getConfluencePage` with `pageId: "65986"` to get current Project page content.
   - Generate updated content reflecting the current project state.
   - Include sections for: project overview, tech stack, components built, AI agents (table with agent name, description, invocation), development workflow (steps with agent, skill, description), AI skills (table with skill name, description, source of truth), available commands (table with command name, agent, description), available workflows (table with workflow name, description, agents), MCP servers (table with server name, type, url), and project structure.
   - The agent descriptions and workflow table should match what is in `.opencode/agents/*.md` (definitions) and `.opencode/workflows/*.md` (step descriptions).
   - Update using `jira_updateConfluencePage`.

### Step 3: Full Scan Mode (Explicit Request)

When user explicitly requests full sync and confirms:

1. **Scan all components:**
   - Use `glob` to find all components: `src/components/**/*.tsx`
   - Exclude test files (`*.test.tsx`) and story files (`*.stories.tsx`)
   - For each component, use the `generate-document` skill to create/update its Confluence page.

2. **Collect all project metadata from `.opencode/`:**
   - **Commands:** Read `.opencode/commands/*.md`. Extract frontmatter (`description`, `agent`) for each. Build a table with: Command name (filename without extension), Agent, Description.
   - **Skills:** Read `.opencode/skills/*/SKILL.md`. Extract frontmatter (`name`, `description`) for each. Build a table with: Skill name, Description, Source of Truth.
   - **Agents:** Read `.opencode/agents/*.md`. Extract frontmatter (`description`) for each. Build a table with: Agent name, Description, Entry point.
   - **Workflows:** Read `.opencode/workflows/*.md`. Extract frontmatter (`name`, `description`, `agents`) for each. Build a table with: Workflow name, Description, Agents involved.
   - **MCP Servers:** Read `opencode.json` and extract the `mcp` section. For each MCP server entry, extract: server name (key), type, url/baseUrl. Build a table with: Server name, Type, URL.
   - **Scripts:** Read `package.json` and extract the `scripts` section for the Available Scripts table.

3. **Update the Project page on Confluence:**
   - Read current Confluence Project page content.
   - Compare with actual project state and update as needed.
   - Include sections for: project overview, tech stack, components built, AI agents table, development workflow, AI skills table, available commands table, available workflows table, MCP servers table, and project structure.

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

**Available OpenCode Commands table:**
- Read all command definitions from `.opencode/commands/*.md` files
- Extract the command name (filename without `.md` extension), agent (from frontmatter), and description (from frontmatter) for each command
- Build the table with: Command (`/<name>`), Agent, Description
- Sort alphabetically by command name
- Find or create an "## Available Commands" section in README.md with this table
- If the section already exists, replace it; otherwise add it after the skills section

**Available Scripts table (from package.json):**
- Read `package.json` and extract the `scripts` section
- Build a table with: Command (`pnpm <name>`), Description (infer from the script value — e.g. `eslint .` → "Run ESLint across the project", `vitest` → "Run Vitest tests")
- Update the existing "## Available Scripts" section in README.md with this table
- If the section doesn't exist, add it after the commands section

**Available AI Agents table:**
- Read all agent definitions from `.opencode/agents/*.md` files
- Extract the description from each file's frontmatter
- Build the table with: Agent, Description, Invocation (`Task` tool with `subagent_type: "<name>"`)
- Find or create an "## AI Agents" section in README.md with this table
- If the section already exists, replace it; otherwise add it after the skills section

**Development Workflow table:**
- Read `.opencode/workflows/feature-development.md`
- Extract Step numbers, Agents, Skills, and Descriptions from each step's heading and body
- Reconstruct the workflow table rows
- Update invocation commands to match the workflow file
- Update or add the "## Development Workflow" section in README.md

**MCP Servers table:**
- Read `opencode.json` and extract the `mcp` section
- For each MCP server entry, extract: server name (key), type, url
- Build a table with: Server, Type, URL
- Find or create an "## MCP Servers" section in README.md with this table
- If the section already exists, replace it; otherwise add it after the workflows section

### Step 5: Summary

Provide a concise summary of what was done:

- Components documented/updated on Confluence
- Project page updated (including agents, skills, commands, workflows, MCP servers, scripts)
- Local files updated (AGENTS.md, README.md — agents, skills, commands, workflows, MCP servers, scripts sections)
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
