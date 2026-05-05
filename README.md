# AI Agent Showcase - FlightSearch UI

A demonstration of AI agent capabilities in building a complete React UI component from scratch. This project showcases how an AI agent can iteratively develop, style, test, and refine a complex FlightSearch interface using React 19, TypeScript, and Tailwind CSS.

## Live Demo

🚀 **[View Live Demo](https://flightsearch-poc.vercel.app/)**

## What Was Built

The AI agent built a fully functional **FlightSearch** component consisting of:

- **AirportSelector** - Custom dropdown component for selecting departure/arrival airports
- **DatesSelector** - Custom calendar component with Return/OneWay trip type support
- **Responsive Design** - Desktop (single row with border/shadow), Tablet (single column), Mobile (full-screen modal)
- **Unit Tests** - Vitest test suite for components
- **Storybook** - Component documentation and visual testing

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vitest (testing)
- Storybook

## AI Agent Prompt Log

Every prompt given to the AI agent is documented in [`prompt-logs.md`](./prompt-logs.md) for transparency and reference.

## Getting Started

```bash
pnpm install
pnpm storybook
```

## Available Scripts

- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
