---
name: generate-document
description: Generates comprehensive technical documentation for a specified component. Investigates the codebase, analyzes the component's props, dependencies, usage patterns, and outputs a structured developer-focused document under ./docs. Also syncs the generated document to the Confluence SCRUM space under the Components page.
---

# Generate Document Skill

## Description

This skill generates comprehensive technical documentation for any component in the codebase. When triggered, the agent identifies the specified component, performs deep code investigation, and produces a structured markdown document under `./docs/{component-name}.md`.

The document is written for **developers** who want to understand, integrate, or extend the component. It includes API references, usage examples, dependency maps, and implementation notes.

Use this skill when the user says things like: "Document the FlightSearch component", "Generate docs for AirportSelector", "Create technical docs for the search feature", etc.

## Workflow

### Step 1: Trigger & Identify the Component

When this skill is triggered:
- If the user provided a component name (e.g., "document the FlightSearch component"), proceed directly to investigation.
- If the user was vague (e.g., "I need docs"), ask: *"Which component would you like me to document? You can give me the name or describe what it does."*

### Step 2: Conduct Deep Code Investigation (Silent Step)

Perform a thorough investigation of the target component:
- Use `glob` to find the component files (e.g., `**/{ComponentName}.tsx`, `**/{componentName}.ts`).
- Use `read` to read the main component file and identify:
  - **Props interface** — all props, types, defaults, and whether they're required or optional.
  - **Exports** — named exports, default exports, and any re-exported types/interfaces.
  - **Internal components** — sub-components defined within the same file.
  - **State management** — `useState`, `useReducer`, context usage, etc.
  - **Effects** — `useEffect` hooks and their dependencies.
  - **Custom hooks** — any hooks used or defined.
- Use `glob` and `read` to find related files:
  - **Test files** (`*.test.tsx`, `*.test.ts`) — understand tested behavior and edge cases.
  - **Story files** (`*.stories.tsx`) — understand usage variants and visual states.
  - **Type files** (`*.types.ts`, `*.d.ts`) — shared types.
  - **Sub-components** — files in the same directory that this component imports.
- Use `grep` to find **consumers** of this component — which other components or pages import and use it.
- Map **dependencies** — what this component depends on (other components, hooks, utilities, external libs).
- Map **dependents** — what depends on this component (parent components, pages, other features).

### Step 3: Generate the Document

Ensure the `./docs/` directory exists (create it if not). Create the file at `./docs/{component-name-in-kebab-case}.md` using the template below.

Fill in every section with accurate information derived from code investigation. Do not leave sections blank — if a section does not apply, write "N/A" or remove it.

### Step 4: Sync to Confluence

After generating the local document, sync it to the Confluence SCRUM space:

1. **Find or create the child page** under the Components page (`https://shumiq.atlassian.net/wiki/spaces/SCRUM/pages/98459/Components`):
   - Use `jira_getPagesInConfluenceSpace` with `spaceId: "65859"`, then filter results where `parentId === "98459"` to find existing child pages.
   - If a child page with the component's name already exists, update it using `jira_updateConfluencePage`.
   - If no child page exists, create one using `jira_createConfluencePage` with `spaceId: "65859"`, `parentId: "98459"`, and `contentType: "page"`.

2. **Page title**: Use the component name (e.g., "FlightSearch").

3. **Page body**: Convert the generated markdown document to Confluence-compatible format using `contentFormat: "markdown"`.

4. **Verify**: Confirm the page was created/updated successfully.

### Step 5: Confirm & Summarize

Inform the user that the document has been created and synced to Confluence. Provide the file path and Confluence page URL, and briefly summarize:
- The component's primary purpose.
- How many props it exposes.
- Whether it's standalone or has dependencies/dependents.
- Any notable patterns or implementation details found.

---

## Document Template

```markdown
# {Component Name}

## Overview

*{A concise 2-4 sentence description of what this component does, its primary purpose, and where it fits in the application.}*

**Type:** {Standalone | Sub-component | Container | Utility}  
**Location:** `{relative path from project root, e.g., src/components/FlightSearch/FlightSearch.tsx}`  
**Status:** {Production | WIP | Deprecated}

---

## File Structure

```
{component-folder}/
├── {ComponentName}.tsx        # Main component
├── {ComponentName}.test.tsx   # Unit tests
├── {ComponentName}.stories.tsx # Storybook stories
├── {SubComponent}.tsx         # Sub-component (if any)
└── ...
```

*{Brief explanation of each file if not obvious.}*

---

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `propName` | `string` | Yes | — | {Description of what this prop does} |
| `optionalProp` | `number` | No | `0` | {Description} |
| `onEvent` | `(data: SomeType) => void` | No | — | {Description of the callback and when it fires} |

*{Add notes about prop relationships, e.g., "If `propA` is set, `propB` becomes required."}*

### Exports

```typescript
// Named exports
export { ComponentName };
export type { SomeType, AnotherType };

// Default export (if applicable)
export default ComponentName;
```

*{List all named exports including types, interfaces, and helper functions that are part of the public API.}*

---

## Usage

### Basic Example

*{The simplest way to use this component.}*

```tsx
import { ComponentName } from "./path/to/ComponentName";

function App() {
  return <ComponentName requiredProp="value" />;
}
```

### With All Props

*{A more complete example showing optional props and callbacks.}*

```tsx
import { ComponentName } from "./path/to/ComponentName";

function App() {
  const handleChange = (data: SomeType) => {
    console.log("Changed:", data);
  };

  return (
    <ComponentName
      requiredProp="value"
      optionalProp={42}
      onChange={handleChange}
    />
  );
}
```

### Advanced / Common Patterns

*{Show real-world usage patterns, integration with state management, or common compositions.}*

```tsx
// Example: Using with React state
import { useState } from "react";
import { ComponentName } from "./path/to/ComponentName";

function App() {
  const [value, setValue] = useState("");

  return (
    <ComponentName
      value={value}
      onChange={setValue}
    />
  );
}
```

---

## Dependencies

### Internal Dependencies

*{Components, hooks, utilities from the same project that this component imports.}*

| Dependency | Type | Description |
|------------|------|-------------|
| `SubComponent` | Component | {What it does and how this component uses it} |
| `useSomeHook` | Hook | {What it does and how this component uses it} |
| `someUtil` | Utility | {What it does and how this component uses it} |

### External Dependencies

*{Third-party libraries this component relies on.}*

| Package | Usage |
|---------|-------|
| `react` | Core component logic |
| `{other-lib}` | {What it's used for} |

### Dependents

*{Other components or pages that import and use this component.}*

| Component | Location | How it uses this component |
|-----------|----------|---------------------------|
| `ParentComponent` | `src/components/...` | {Brief description} |

*If this component is standalone and not used by other components, write: "This is a standalone component with no internal dependents."*

---

## State Management

*{Describe internal state: what useState/useReducer hooks are used, what the state shape looks like, and how state flows.}*

```typescript
// Internal state shape
const [state, setState] = useState<StateType>({
  // ...
});
```

*{Explain state transitions if complex. If state is minimal, keep it brief.}*

---

## Responsive Behavior

*{Describe how the component behaves at different breakpoints. Include mobile/tablet/desktop variations if applicable.}*

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | {Description} |
| Tablet (768px - 1024px) | {Description} |
| Desktop (> 1024px) | {Description} |

*If the component is not responsive, write: "This component has no responsive variations."*

---

## Accessibility

*{Describe ARIA attributes, keyboard navigation, screen reader support, focus management, and any a11y considerations.}*

- **ARIA:** {List ARIA attributes used}
- **Keyboard:** {Describe keyboard interactions}
- **Screen Reader:** {Describe screen reader behavior}
- **Focus:** {Describe focus management}

*If no specific a11y work has been done, note that and suggest improvements. If unknown, write: "Accessibility details need verification."*

---

## Testing

*{Summarize the test coverage and what scenarios are tested.}*

### Test File

`{relative path to test file}`

### Covered Scenarios

1. {Test scenario 1}
2. {Test scenario 2}
3. {Test scenario 3}

*{Mention any gaps or scenarios not yet covered.}*

---

## Notes & Limitations

*{Important implementation details, gotchas, performance considerations, or known limitations that developers should be aware of.}*

- {Note 1}
- {Note 2}

*If there are no notable limitations, write: "No known limitations."*

---

## Related Components

*{Link to or briefly describe related components that developers might also need.}*

| Component | Description |
|-----------|-------------|
| `{ComponentA}` | {What it does and how it relates} |
| `{ComponentB}` | {What it does and how it relates} |

*If no related components exist, write: "N/A"*

---

*Generated by opencode on {YYYY-MM-DD}*
```

## Best Practices & Rules

- **Investigate first, write second:** Always read the actual component code, its tests, stories, and related files before generating documentation. Do not guess or hallucinate prop types, behaviors, or dependencies.
- **Be comprehensive:** Every section in the template should be filled. If a section truly does not apply, write "N/A" rather than omitting it.
- **Use actual code:** Code examples in the Usage section must be accurate and compilable. Derive them from actual story files, test files, or the component's own implementation.
- **Kebab-case filenames:** Always format the output file name in kebab-case (e.g., `./docs/flight-search.md`, `./docs/airport-selector.md`).
- **Date format:** Always use YYYY-MM-DD for dates.
- **Developer-focused:** Write for developers who need to integrate, modify, or debug this component. Avoid marketing language; be technical and precise.
- **Standalone vs dependent:** Clearly indicate whether the component is standalone or intended to be used with other components. Call out required context (parent components, providers, data shapes).
- **No hallucination:** If investigation yields no results for a section (e.g., no test file exists), state "No test file found" rather than inventing test scenarios.
- **Relative paths:** Always use relative paths from the project root for file references.
