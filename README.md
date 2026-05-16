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
| **technical-lead** | Breaks down tickets into dev plans, generates documentation, syncs project docs | `Task` tool with `subagent_type: "technical-lead"` |
| **software-developer** | Executes dev plans precisely using TDD (Red → Green → Refactor) | `Task` tool with `subagent_type: "software-developer"` |
| **quality-analyst** | Reviews code against ticket requirements, runs automated verification | `Task` tool with `subagent_type: "quality-analyst"` |

## Development Workflow

The **feature-development** workflow orchestrates agents through a full lifecycle:

```
Concept → Ticket → Plan → Code → Verify → Document
```

| Step | Agent | Description |
|------|-------|-------------|
| 1 | `technical-business-analyst` | Create a Jira issue from requirements |
| 2 | `technical-lead` | Break ticket into step-by-step implementation phases |
| 3 | `software-developer` | Execute plan using TDD |
| 4 | `quality-analyst` | Review implementation against requirements |
| 5 | `technical-lead` | Sync documentation to reflect changes |

Run with: `opencode run "Run the feature-development workflow: <feature description>"`

## Available AI Agent Skills

This project includes specialized skills to help the AI agent work more effectively:

| Skill | Description | Source of Truth |
|-------|-------------|-----------------|
| **create-development-plan** | Creates a detailed TDD-based development plan from a bug or story ticket, including component design, test strategy (unit + Storybook), and step-by-step implementation phases | Jira comment |
| **create-ticket** | Unified skill for creating Jira tickets of any type (Story, Bug, Task). Determines the appropriate type from the user's description, confirms with the user, then delegates to the specialist agent for requirements gathering, codebase investigation, and ticket creation | Jira (SCRUM project) |
| **customize-opencode** | Used when editing or creating opencode's own configuration files (.opencode/, opencode.json, etc.) and related settings | Source code |
| **generate-document** | Generates comprehensive technical documentation for a specified component by investigating the codebase and creating a Confluence page under the SCRUM space's Components page | Confluence (SCRUM space) |
| **implement-ticket** | Follows a development plan from Jira comments to implement code using TDD (Red → Green → Refactor). Supports yolo mode and approval mode | `./src/components/...` |
| **start-workflow** | Starts a workflow from `.opencode/workflows/`. If no workflow is specified, prompts the user to choose one | `.opencode/workflows/` |
| **sync-project** | Synchronizes Confluence project pages (Project overview and component documentation) and local documentation files (AGENTS.md, README.md) with the current state of the codebase | Confluence (SCRUM space) |
| **verify-changes** | Verifies that a Jira ticket has been fully and correctly implemented by checking coverage, quality, and completeness. Updates ticket status or creates follow-up tickets as needed | Source code |

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
| `pnpm test` | Run Vitest tests (interactive mode) |
| `pnpm test -- --run` | Run Vitest tests (CI mode) |
| `pnpm lint` | Run ESLint |

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
