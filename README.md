# AI Agent Showcase

A demonstration of AI agent capabilities in building a complete React UI component from scratch. This project showcases how an AI agent can iteratively develop, style, test, and refine a complex FlightSearch interface using React 19, TypeScript, and Tailwind CSS.

## Live Demo

🚀 **[View Live Demo](https://shumiq.github.io/showcase-flightsearch)**

## Project Management

📋 **[Jira Board](https://shumiq.atlassian.net/jira/software/projects/SCRUM/boards/1)**
📄 **[Confluence Project Page](https://shumiq.atlassian.net/wiki/spaces/SCRUM/pages/65986/Project)**

## What Was Built

The AI agent built a fully functional **FlightSearch** component consisting of:

- **FlightSearch** - Main responsive search form combining all sub-components
- **AirportSelector** - Searchable dropdown for departure/arrival airports with mobile bottom-sheet
- **DatesSelector** - Custom calendar with OneWay/Return trip type, date range selection, and mobile bottom-sheet
- **Responsive Design** - Desktop (single row), Tablet (single column), Mobile (full-screen modal)
- **Unit Tests** - 37 Vitest tests across all components
- **Storybook** - Component documentation and visual testing with autodocs

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vitest (testing)
- Storybook
- ESLint

## AI Agents

This project defines specialized agents that handle different phases of development:

| Agent | Description | Invocation |
|-------|-------------|------------|
| **technical-business-analyst** | Gathers requirements, performs early technical analysis, creates story/bug tickets | `Task` tool with `subagent_type: "technical-business-analyst"` |
| **technical-lead** | Determines ticket types, creates task tickets, breaks down tickets into dev plans, generates documentation, syncs project docs | `Task` tool with `subagent_type: "technical-lead"` |
| **software-developer** | Executes dev plans precisely using TDD (Red → Green → Refactor) | `Task` tool with `subagent_type: "software-developer"` |
| **quality-analyst** | Reviews code against ticket requirements, runs automated verification | `Task` tool with `subagent_type: "quality-analyst"` |

## Development Workflow

The **feature-development** workflow orchestrates agents through a full lifecycle:

```
Concept → Ticket → Plan → Code → Verify → Document
```

| Step | Agent | Skill | Description |
|------|-------|-------|-------------|
| 1 | `technical-lead` (triage) → delegates to `technical-business-analyst` (story/bug) or handles directly (task) | `create-ticket` | Create a Jira issue from requirements |
| 2 | `technical-lead` | `create-development-plan` | Break ticket into step-by-step implementation phases |
| 3 | `software-developer` | `implement-ticket` | Execute plan using TDD (Red → Green → Refactor) |
| 4 | `quality-analyst` | `verify-changes` | Review implementation against requirements |
| 5 | `technical-lead` | `sync-project` | Sync documentation to reflect changes |

Run with: `opencode run "Run the feature-development workflow: <feature description>"`

## Available AI Agent Skills

This project includes specialized skills to help the AI agent work more effectively:

| Skill | Description | Source of Truth |
|-------|-------------|-----------------|
| **create-development-plan** | Creates a detailed TDD-based development plan from a bug or story ticket, including component design, test strategy (unit + Storybook), and step-by-step implementation phases | Jira comment |
| **create-ticket** | Unified skill for creating Jira tickets of any type (Story, Bug, Task). Determines the appropriate type from the user's description, confirms with the user, then delegates to the specialist agent for requirements gathering, codebase investigation, and ticket creation | Jira (SCRUM project) |
| **customize-opencode** | Use ONLY when the user is editing or creating opencode's own configuration: opencode.json, opencode.jsonc, files under .opencode/, or files under ~/.config/opencode/. Also use when creating or fixing opencode agents, subagents, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring opencode itself. | Source code |
| **generate-document** | Generates comprehensive technical documentation for a specified component. Investigates the codebase, analyzes the component's props, dependencies, usage patterns, and creates a Confluence page under the SCRUM space's Components page | Confluence (SCRUM space) |
| **implement-ticket** | Follows a development plan from Jira comments to implement code using TDD (Red → Green → Refactor). Supports yolo mode (auto-execute) and approval mode (approve each step) | Source code |
| **start-workflow** | Starts a workflow from `.opencode/workflows`. If no workflow is specified, prompts the user to choose one | `.opencode/workflows/` |
| **sync-project** | Synchronizes Confluence project pages (Project overview and component documentation), available commands, skills, agents, workflows, and local documentation files (AGENTS.md, README.md) with the current state of the codebase. By default syncs changed components only; supports full sync when explicitly requested | Confluence (SCRUM space) |
| **verify-changes** | Verifies that a Jira ticket has been fully and correctly implemented by checking coverage, quality, and completeness. Updates ticket status or creates follow-up tickets as needed | Source code |

## Available Commands

OpenCode commands that can be invoked directly from the chat:

| Command | Agent | Description |
|---------|-------|-------------|
| `/create-development-plan` | `technical-lead` | Create a development plan from a Jira ticket |
| `/create-ticket` | `technical-lead` | Create a Jira ticket (Story/Bug/Task) |
| `/generate-document` | `technical-lead` | Generate technical documentation for a component |
| `/implement-ticket` | `software-developer` | Implement a ticket following its development plan |
| `/start-workflow` | `technical-lead` | Start a workflow from `.opencode/workflows` |
| `/sync-project` | `technical-lead` | Sync project documentation with codebase state |
| `/verify-changes` | `quality-analyst` | Verify a ticket implementation against requirements |

## MCP Servers

Model Context Protocol servers used for external integrations:

| Server | Type | URL |
|--------|------|-----|
| `jira` | remote | `https://mcp.atlassian.com/v1/mcp/authv2` |

## Getting Started

```bash
pnpm install
pnpm storybook
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm storybook` | Start Storybook development server (port 6006) |
| `pnpm build-storybook` | Build Storybook for production |
| `pnpm test` | Run Vitest tests |
| `pnpm lint` | Run ESLint across the project |

## Project Structure

```
showcase/
├── src/components/FlightSearch/   # Main feature components
│   ├── FlightSearch.tsx           # Top-level search form
│   ├── AirportSelector.tsx        # Airport dropdown
│   └── DatesSelector.tsx          # Calendar date picker
├── .opencode/skills/              # AI agent skill definitions
└── .storybook/                    # Storybook configuration
```
