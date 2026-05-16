# AGENTS.md - Project Agent Instructions

This project is an AI agent showcase. Follow these rules in every session.

## Code Conventions

- React 19 + TypeScript + Vite
- Tailwind CSS v4 for styling
- No external UI library — build custom components
- Follow existing patterns in the codebase
- Use pnpm as the package manager
- Always run `pnpm test -- --run` after making changes

## Jira Integration

- All Jira interactions must go through MCP tools (not `gh` or raw API calls)
- Project: **Showcase** (key: `SCRUM`, cloud ID: `06873323-7b4f-4662-8589-74ea341fcba6`)
- Available issue types: Epic, Task, Story, Bug, Subtask
- Always create/manage issues within the SCRUM project unless explicitly told otherwise

## Confluence Integration

- All Confluence interactions must go through MCP tools
- Use the **SCRUM** space (ID: `65859`, cloud ID: `06873323-7b4f-4662-8589-74ea341fcba6`)
- **Project page**: `https://shumiq.atlassian.net/wiki/spaces/SCRUM/pages/65986/Project`
- **Components page**: `https://shumiq.atlassian.net/wiki/spaces/SCRUM/pages/98459/Components`

## Available Agents

| Agent | Description | Entry Point |
|-------|-------------|-------------|
| **technical-business-analyst** | Gathers requirements, performs early technical analysis, creates story/bug tickets | `Task` tool with `subagent_type: "technical-business-analyst"` |
| **technical-lead** | Breaks down tickets into dev plans, generates documentation, syncs project docs | `Task` tool with `subagent_type: "technical-lead"` |
| **software-developer** | Executes dev plans precisely using TDD (Red → Green → Refactor) | `Task` tool with `subagent_type: "software-developer"` |
| **quality-analyst** | Reviews code against ticket requirements, runs automated verification | `Task` tool with `subagent_type: "quality-analyst"` |

## Workflow

### feature-development

End-to-end pipeline: **Concept → Ticket → Plan → Code → Verify → Document**

| Step | Agent | Skill | Description |
|------|-------|-------|-------------|
| 1 | `technical-business-analyst` | `create-story-ticket` / `create-bug-ticket` | Create a Jira issue from requirements |
| 2 | `technical-lead` | `create-development-plan` | Break ticket into step-by-step implementation phases |
| 3 | `software-developer` | `implement-ticket` | Execute plan using TDD |
| 4 | `quality-analyst` | `verify-changes` | Review implementation against requirements |
| 5 | `technical-lead` | `sync-project` | Sync documentation to reflect changes |

- **Fresh start:** `opencode run "Run the feature-development workflow: <description>"`
- **Continue:** `opencode run "Run the feature-development workflow: continue SCRUM-42"`
- Workflow config: `.opencode/workflows/feature-development.md`
