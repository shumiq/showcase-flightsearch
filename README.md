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

## Available AI Agent Skills

This project includes specialized skills to help the AI agent work more effectively:

| Skill | Description | Source of Truth |
|-------|-------------|-----------------|
| **create-bug-ticket** | Transforms fuzzy bug descriptions into structured Jira bug tickets with investigation findings | Jira (SCRUM project) |
| **create-story-ticket** | Converts feature requests into professional Jira story tickets with acceptance criteria | Jira (SCRUM project) |
| **create-development-plan** | Creates TDD-based development plans from Jira tickets with phased implementation | Jira comment |
| **implement-ticket** | Executes a development plan from Jira comments using TDD (Red → Green → Refactor) | `./src/components/...` |
| **generate-document** | Generates comprehensive technical documentation for any component | Confluence (SCRUM space) |
| **sync-project** | Synchronizes Confluence project documentation with the current state of the codebase | Confluence (SCRUM space) |

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
