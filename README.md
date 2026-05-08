# AI Agent Showcase

A demonstration of AI agent capabilities in building a complete React UI component from scratch. This project showcases how an AI agent can iteratively develop, style, test, and refine a complex FlightSearch interface using React 19, TypeScript, and Tailwind CSS.

## Live Demo

🚀 **[View Live Demo](https://santiphap-tw.github.io/flightsearch-ai)**

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

| Skill | Description | Output |
|-------|-------------|--------|
| **create-bug-ticket** | Transforms fuzzy bug descriptions into structured bug tickets with investigation findings | `./bugs/{title}.md` |
| **create-story-ticket** | Converts feature requests into professional user story tickets with acceptance criteria | `./stories/{title}.md` |
| **create-development-plan** | Creates TDD-based development plans from bug or story tickets with phased implementation | `./plans/{title}-plan.md` |
| **implement-ticket** | Executes a development plan from ./plans using TDD (Red → Green → Refactor) with yolo or approval mode | `./src/components/...` |
| **generate-document** | Generates comprehensive technical documentation for any component | `./docs/{component}.md` |
| **sync-project** | Synchronizes project files (README.md, prompt-logs.md, and component documentation) with the current state of the codebase | README.md, prompt-logs.md, ./docs/ |
| **manage-github-project** | Creates, updates, moves, archives, deletes, and bi-directionally syncs project board items with local tickets | GitHub project board, ./bugs/, ./stories/ |

## AI Agent Prompt Log

Every prompt given to the AI agent is documented in [`prompt-logs.md`](./prompt-logs.md) for transparency and reference.

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
├── .agents/skills/                # AI agent skill definitions
├── bugs/                          # Bug tracking tickets
├── stories/                       # User story tickets
├── plans/                         # Development plans
├── docs/                          # Generated documentation
└── .storybook/                    # Storybook configuration
```
