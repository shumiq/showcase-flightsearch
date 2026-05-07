# Development Plan: Add Passenger Selector to Flight Search

**Source Ticket:** `./stories/add-passenger-selector-to-flight-search.md`
**Date Created:** 2026-05-07
**Approach:** Test-Driven Development (TDD)

---

## Overview

Create a `PassengerSelector` dropdown component with `-`/`+` controls for selecting 1–9 passengers, integrate it into `FlightSearch` across all three layouts (desktop row, tablet column, mobile modal), and extend the `onSearch` callback interface to include the `passengers` field.

---

## Architecture & Design

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `PassengerSelector` | Dropdown trigger showing passenger count with popover containing increment/decrement controls | `src/components/FlightSearch/PassengerSelector.tsx` |

### State Management

Passenger count is managed locally in `FlightSearch.tsx` via `useState<number>(1)`. The value flows down to `PassengerSelector` via props and is passed back up through an `onChange` callback. No new context or global state is needed.

```typescript
// New type to add to FlightSearchProps
interface FlightSearchProps {
  onSearch?: (data: { from: string; to: string; date: DateRange; passengers: number }) => void;
}

// PassengerSelector props interface
interface PassengerSelectorProps {
  id: string;
  label: string;
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
  min?: number;  // default 1
  max?: number;  // default 9
}
```

### Dependencies

- **Existing components to reuse:** None — this is a standalone component following the same visual patterns as `AirportSelector` and `DatesSelector`.
- **Hooks/utilities to use:** `useState`, `useRef`, `useEffect` for dropdown open/close and outside-click detection (same pattern as `AirportSelector:93-102`).
- **New dependencies (if any):** None.

### Existing Component Patterns (Summary)

From reviewing `AirportSelector.tsx` and `DatesSelector.tsx`:

**Props pattern:**
- `id: string` — unique identifier for the trigger button
- `label: string` — accessible label (rendered as `sr-only`)
- `value` — controlled value (varies by component type)
- `onChange: (newValue) => void` — controlled callback
- `disabled?: boolean` — optional, defaults to `false`

**Styling pattern:**
- Trigger button: `w-full rounded-xl border py-4 pl-12 pr-10 text-left text-sm font-medium shadow-sm` with border/color variations for disabled vs enabled states
- Focus ring: `focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`
- Disabled: `cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400`
- Popover: `absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-xl shadow-gray-900/10`

**Dropdown behavior:**
- Toggle open/close on trigger click
- Outside click detection via `mousedown` event on `document` with `ref.contains()` check (`AirportSelector:93-102`)
- No mobile modal needed for this component — the popover is simple enough to work on both desktop and mobile (unlike `AirportSelector` which needs a full-screen modal for list searching)

---

## Test Strategy

### Unit Tests (`PassengerSelector.test.tsx`)

| Test Case | Description | Expected Assertion |
|-----------|-------------|-------------------|
| `renders with default count label` | Component mounts with value=1 | Trigger displays "1 Passenger" |
| `renders plural label for count > 1` | Component mounts with value=3 | Trigger displays "3 Passengers" |
| `opens dropdown when clicked` | User clicks the trigger button | Dropdown panel appears with `-`, `+`, and count display |
| `increments count when + is clicked` | Dropdown open, click `+` | `onChange` called with incremented value |
| `decrements count when - is clicked` | Dropdown open, count > 1, click `-` | `onChange` called with decremented value |
| `disables - button at minimum (1)` | Count is 1 | `-` button has `disabled` attribute |
| `disables + button at maximum (9)` | Count is 9 | `+` button has `disabled` attribute |
| `does not increment past max` | Count is 9, click `+` | `onChange` not called |
| `does not decrement below min` | Count is 1, click `-` | `onChange` not called |
| `closes dropdown when clicking outside` | Dropdown open, click element outside component | Dropdown is no longer in DOM |
| `does not open when disabled` | Component has `disabled=true`, click trigger | Dropdown does not appear |
| `applies disabled styles when disabled` | Component has `disabled=true` | Trigger button has `disabled` attribute and disabled class |
| `respects custom min/max props` | Pass `min={2}`, `max={5}` | `-` disabled at 2, `+` disabled at 5 |

**Mocking Strategy:**
- No mocks needed for `PassengerSelector` itself — it has no internal hooks to mock.
- `FlightSearch.test.tsx` does not need new mocks since `PassengerSelector` is a simple controlled component.

### Storybook Stories (`PassengerSelector.stories.tsx`)

| Story | Purpose | Interactivity |
|-------|---------|---------------|
| `Default` | Shows default state with 1 passenger, dropdown closed | Static |
| `WithMultiplePassengers` | Shows trigger with count > 1 (e.g., "4 Passengers") | Static |
| `Disabled` | Shows disabled state | Static |
| `AtMinimum` | Shows component at min count (1), `-` button visibly disabled | Static (open dropdown) |
| `AtMaximum` | Shows component at max count (9), `+` button visibly disabled | Static (open dropdown) |
| `Interactive` | Full interactive demo with state management | Interactive (click +/-, open/close) |

---

## Implementation Phases (TDD)

Each phase follows the Red → Green → Refactor cycle. Write tests **before** implementation.

### Phase 1: PassengerSelector Component — Basic Rendering & Props

**Goal:** Create `PassengerSelector.tsx` with trigger button showing passenger count, pass all rendering tests.

#### 1.1 Write Failing Tests

File: `src/components/FlightSearch/PassengerSelector.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PassengerSelector } from './PassengerSelector';

describe('PassengerSelector', () => {
  it('renders with singular label when count is 1', () => {
    render(
      <PassengerSelector
        id="pax"
        label="Passengers"
        value={1}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('1 Passenger')).toBeInTheDocument();
  });

  it('renders with plural label when count > 1', () => {
    render(
      <PassengerSelector
        id="pax"
        label="Passengers"
        value={3}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('3 Passengers')).toBeInTheDocument();
  });

  it('applies disabled styles when disabled', () => {
    render(
      <PassengerSelector
        id="pax"
        label="Passengers"
        value={1}
        onChange={() => {}}
        disabled
      />
    );
    const button = screen.getByRole('button', { name: /passengers/i });
    expect(button).toBeDisabled();
  });
});
```

Run: `npm test -- --run` — confirm tests fail (file does not exist).

#### 1.2 Implement Minimum Code

File: `src/components/FlightSearch/PassengerSelector.tsx`

Create the component with:
- Props interface matching `PassengerSelectorProps` defined above
- Trigger button with `id`, `aria-label` from `label`, `disabled` prop
- Label text: `${value} Passenger${value !== 1 ? 's' : ''}`
- Same styling classes as `AirportSelector` trigger button (rounded-xl border, py-4, pl-12 pr-10, etc.)
- A people/person icon positioned at `left-4` (similar to how `AirportSelector` positions its icon)
- Chevron icon at `right-4`

```typescript
interface PassengerSelectorProps {
  id: string;
  label: string;
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

export function PassengerSelector({ id, label, value, onChange, disabled = false }: PassengerSelectorProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {/* People icon SVG */}
      </div>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={`w-full rounded-xl border py-4 pl-12 pr-10 text-left text-sm font-medium shadow-sm transition-all ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        }`}
      >
        <span className="text-gray-900">
          {value} Passenger{value !== 1 ? 's' : ''}
        </span>
      </button>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        {/* ChevronDownIcon */}
      </div>
    </div>
  );
}
```

#### 1.3 Verify & Refactor

Run: `npm test -- --run` — confirm tests pass.
Refactor: Extract `PeopleIcon` and reuse existing `ChevronDownIcon`/`ChevronUpIcon` pattern from `AirportSelector`.

---

### Phase 2: PassengerSelector — Dropdown Open/Close & Outside Click

**Goal:** Add dropdown panel with open/close behavior and outside-click detection.

#### 2.1 Write Failing Tests

Extend `PassengerSelector.test.tsx`:

```typescript
it('opens dropdown when clicked', async () => {
  const user = userEvent.setup();
  render(
    <PassengerSelector id="pax" label="Passengers" value={1} onChange={() => {}} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  expect(screen.getByTestId('passenger-dropdown')).toBeInTheDocument();
});

it('closes dropdown when clicking outside', async () => {
  const user = userEvent.setup();
  render(
    <div>
      <PassengerSelector id="pax" label="Passengers" value={1} onChange={() => {}} />
      <button>Outside</button>
    </div>
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  expect(screen.getByTestId('passenger-dropdown')).toBeInTheDocument();
  await user.click(screen.getByText('Outside'));
  expect(screen.queryByTestId('passenger-dropdown')).not.toBeInTheDocument();
});

it('does not open when disabled', async () => {
  const user = userEvent.setup();
  render(
    <PassengerSelector id="pax" label="Passengers" value={1} onChange={() => {}} disabled />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  expect(screen.queryByTestId('passenger-dropdown')).not.toBeInTheDocument();
});
```

Run: `npm test -- --run` — confirm new tests fail.

#### 2.2 Implement

Add to `PassengerSelector.tsx`:
- `const [isOpen, setIsOpen] = useState(false);`
- `const containerRef = useRef<HTMLDivElement>(null);`
- `useEffect` for outside-click detection (same pattern as `AirportSelector:93-102`)
- Toggle `isOpen` on button click (guard with `!disabled`)
- Render dropdown panel conditionally: `{isOpen && !disabled && (<div data-testid="passenger-dropdown" ...>...</div>)}`
- Dropdown styling: `absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white py-4 shadow-xl shadow-gray-900/10`
- Dropdown content: centered display of current count with `-` and `+` buttons on either side

#### 2.3 Verify & Refactor

Run: `npm test -- --run` — confirm all tests pass.
Refactor: Ensure the dropdown panel width matches the trigger button (use `w-full` on dropdown inside `relative` container).

---

### Phase 3: PassengerSelector — Increment/Decrement Logic & Boundaries

**Goal:** Add `-`/`+` button functionality with min/max enforcement.

#### 3.1 Write Failing Tests

Extend `PassengerSelector.test.tsx`:

```typescript
it('calls onChange with incremented value when + is clicked', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <PassengerSelector id="pax" label="Passengers" value={3} onChange={onChange} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  const incrementBtn = screen.getByRole('button', { name: '+' });
  await user.click(incrementBtn);
  expect(onChange).toHaveBeenCalledWith(4);
});

it('calls onChange with decremented value when - is clicked', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <PassengerSelector id="pax" label="Passengers" value={3} onChange={onChange} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  const decrementBtn = screen.getByRole('button', { name: '-' });
  await user.click(decrementBtn);
  expect(onChange).toHaveBeenCalledWith(2);
});

it('disables - button at minimum count', () => {
  render(
    <PassengerSelector id="pax" label="Passengers" value={1} onChange={() => {}} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  // Need to open dropdown to see the buttons
  // This test will be easier with userEvent, but for static check:
  // Render with value=1, open dropdown, check - button disabled
});

it('disables + button at maximum count (9)', async () => {
  const user = userEvent.setup();
  render(
    <PassengerSelector id="pax" label="Passengers" value={9} onChange={() => {}} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  const incrementBtn = screen.getByRole('button', { name: '+' });
  expect(incrementBtn).toBeDisabled();
});

it('does not call onChange when + clicked at max', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <PassengerSelector id="pax" label="Passengers" value={9} onChange={onChange} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  const incrementBtn = screen.getByRole('button', { name: '+' });
  await user.click(incrementBtn);
  expect(onChange).not.toHaveBeenCalled();
});

it('respects custom min and max props', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <PassengerSelector id="pax" label="Passengers" value={2} onChange={onChange} min={2} max={5} />
  );
  const button = screen.getByRole('button', { name: /passengers/i });
  await user.click(button);
  const decrementBtn = screen.getByRole('button', { name: '-' });
  expect(decrementBtn).toBeDisabled();
  // Increment to 5, then check + is disabled
  const incrementBtn = screen.getByRole('button', { name: '+' });
  await user.click(incrementBtn);
  expect(onChange).toHaveBeenCalledWith(3);
});
```

Run: `npm test -- --run` — confirm new tests fail.

#### 3.2 Implement

Add to `PassengerSelector.tsx`:
- Accept `min` (default 1) and `max` (default 9) props
- Inside dropdown, render a flex row: `-` button, count display, `+` button
- `-` button: `disabled={value <= min}`, onClick calls `onChange(value - 1)`
- `+` button: `disabled={value >= max}`, onClick calls `onChange(value + 1)`
- Both buttons styled as rounded circles/squares with consistent sizing
- Count display centered between them, styled as `text-lg font-semibold`

```tsx
// Dropdown content structure
<div className="flex items-center justify-center gap-4 px-4">
  <button
    type="button"
    onClick={() => onChange(value - 1)}
    disabled={value <= min}
    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
    aria-label="Decrease passengers"
  >
    -
  </button>
  <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
    {value}
  </span>
  <button
    type="button"
    onClick={() => onChange(value + 1)}
    disabled={value >= max}
    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
    aria-label="Increase passengers"
  >
    +
  </button>
</div>
```

#### 3.3 Verify & Refactor

Run: `npm test -- --run` — confirm all tests pass.
Refactor: Consider extracting `-`/`+` buttons into small sub-components if styling becomes complex.

---

### Phase 4: Storybook Stories

**Goal:** Create Storybook stories for visual testing and documentation.

#### 4.1 Create Story File

File: `src/components/FlightSearch/PassengerSelector.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PassengerSelector } from './PassengerSelector';
import { useState } from 'react';

const meta: Meta<typeof PassengerSelector> = {
  title: 'FlightSearch/PassengerSelector',
  component: PassengerSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PassengerSelector>;
```

#### 4.2 Define Stories

```typescript
export const Default: Story = {
  args: {
    id: 'passengers-default',
    label: 'Passengers',
    value: 1,
    onChange: (count: number) => console.log('Passengers:', count),
  },
};

export const WithMultiplePassengers: Story = {
  args: {
    id: 'passengers-multi',
    label: 'Passengers',
    value: 4,
    onChange: (count: number) => console.log('Passengers:', count),
  },
};

export const Disabled: Story = {
  args: {
    id: 'passengers-disabled',
    label: 'Passengers',
    value: 2,
    onChange: (count: number) => console.log('Passengers:', count),
    disabled: true,
  },
};

export const AtMinimum: Story = {
  args: {
    id: 'passengers-min',
    label: 'Passengers',
    value: 1,
    onChange: (count: number) => console.log('Passengers:', count),
  },
  // Note: developer should manually open dropdown to verify - button is disabled
};

export const AtMaximum: Story = {
  args: {
    id: 'passengers-max',
    label: 'Passengers',
    value: 9,
    onChange: (count: number) => console.log('Passengers:', count),
  },
  // Note: developer should manually open dropdown to verify + button is disabled
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div className="w-72">
        <PassengerSelector
          {...args}
          value={value}
          onChange={(count) => {
            setValue(count);
            args.onChange(count);
          }}
        />
      </div>
    );
  },
  args: {
    id: 'passengers-interactive',
    label: 'Passengers',
    value: 1,
    onChange: (count: number) => console.log('Passengers:', count),
  },
};
```

#### 4.3 Verify

Run: `npm run storybook` — verify all stories render correctly. Open `Interactive` story and confirm +/- buttons work, boundaries are enforced, and dropdown closes on outside click.

---

### Phase 5: Integration into FlightSearch

**Goal:** Wire `PassengerSelector` into `FlightSearch` across all three layouts and update the `onSearch` callback.

#### 5.1 Update FlightSearch Types & State

File: `src/components/FlightSearch/FlightSearch.tsx`

Add import:
```typescript
import { PassengerSelector } from './PassengerSelector';
```

Update `FlightSearchProps`:
```typescript
interface FlightSearchProps {
  onSearch?: (data: { from: string; to: string; date: DateRange; passengers: number }) => void;
}
```

Add state:
```typescript
const [passengers, setPassengers] = useState(1);
```

Update `handleSearch`:
```typescript
const handleSearch = () => {
  onSearch?.({ from, to, date: dateRange, passengers });
  setIsOpen(false);
};
```

#### 5.2 Insert into Desktop Layout

Add as 4th column in the desktop row (before SearchButton):
```tsx
<div className="flex-1">
  <PassengerSelector
    id="passengers-desktop"
    label="Passengers"
    value={passengers}
    onChange={setPassengers}
  />
</div>
```

This changes the desktop flex row from 4 items (from, to, dates, button) to 5 items (from, to, dates, passengers, button). All existing items use `flex-1`, so the new item should also use `flex-1`. The SearchButton wrapper uses `min-w-[200px]` which should remain unchanged.

#### 5.3 Insert into Tablet Layout

Add after `DatesSelector` and before `SearchButton`:
```tsx
<PassengerSelector
  id="passengers-tablet"
  label="Passengers"
  value={passengers}
  onChange={setPassengers}
/>
```

#### 5.4 Insert into Mobile Modal

Add after `DatesSelector` and before the SearchButton wrapper:
```tsx
<PassengerSelector
  id="passengers-mobile"
  label="Passengers"
  value={passengers}
  onChange={setPassengers}
/>
```

#### 5.5 Verify

Manually verify in Storybook (`npm run storybook`) that the `FlightSearch` component renders the passenger selector in all three viewport sizes (desktop >1024px, tablet 768-1024px, mobile <768px).

---

### Phase 6: Update Existing Tests

**Goal:** Update `FlightSearch.test.tsx` to verify `passengers` is passed in the `onSearch` callback.

#### 6.1 Extend Existing Integration Test

File: `src/components/FlightSearch/FlightSearch.test.tsx`

The existing test `calls onSearch with correct data when form is filled (desktop)` currently asserts on `from`, `to`, and `date`. Extend it to also assert on `passengers`:

```typescript
// After the existing onSearch assertions in the desktop test:
expect(onSearch).toHaveBeenCalledWith(
  expect.objectContaining({
    from: 'BKK',
    to: 'CNX',
    passengers: 1, // default value
  })
);
```

#### 6.2 Add New Test for Passenger Count in Callback

```typescript
it('includes updated passenger count in onSearch callback (desktop)', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<FlightSearch onSearch={onSearch} />);

  // Fill in from/to/date as in the existing test...
  // Then open passenger selector, increment to 3, then search

  const passengersButton = screen.getByLabelText('Passengers');
  await user.click(passengersButton);

  const incrementBtn = screen.getByRole('button', { name: '+' });
  await user.click(incrementBtn);
  await user.click(incrementBtn); // 1 -> 3

  // Close dropdown by clicking outside
  await user.click(screen.getByRole('button', { name: /search flights/i }));
  // Actually, search button is disabled without from/to/date, so we need to fill those first
  // ... then search
  // Assert passengers: 3
});
```

**Note:** The full test should follow the same pattern as the existing desktop test — fill from, to, date first, then adjust passengers, then search. The test should assert that `onSearch` is called with `passengers: 3`.

#### 6.3 Add Test for Default Passenger Display

```typescript
it('displays default passenger count of 1', () => {
  render(<FlightSearch />);
  // The passenger selector should show "1 Passenger"
  // This will be visible in the DOM even though it's inside a button
  expect(screen.getByText('1 Passenger')).toBeInTheDocument();
});
```

#### 6.4 Verify All Tests

Run: `npm test -- --run` — confirm **all** tests pass (new + existing).

---

### Phase 7: Update Existing Stories

**Goal:** The `FlightSearch.stories.tsx` does not need changes since it uses autodocs and the `onSearch` action is already configured. The new `passengers` field will automatically appear in the action panel when the search button is clicked.

Verify by running `npm run storybook` and interacting with the `FlightSearch` Default story — clicking "Search Flights" should show the `passengers` field in the action log.

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/FlightSearch/PassengerSelector.tsx` | Create | New dropdown component with +/- controls |
| `src/components/FlightSearch/PassengerSelector.test.tsx` | Create | Unit tests for PassengerSelector |
| `src/components/FlightSearch/PassengerSelector.stories.tsx` | Create | Storybook stories |
| `src/components/FlightSearch/FlightSearch.tsx` | Modify | Add passengers state, import PassengerSelector, insert into 3 layouts, update onSearch interface |
| `src/components/FlightSearch/FlightSearch.test.tsx` | Modify | Add passenger count assertions to existing test, add new test for passenger in callback |

---

## Checklist

- [ ] `PassengerSelector.tsx` created with trigger, dropdown, +/- controls
- [ ] `PassengerSelector.test.tsx` created — all tests passing
- [ ] `PassengerSelector.stories.tsx` created — all stories rendering
- [ ] `FlightSearch.tsx` updated with passengers state, integrated into desktop/tablet/mobile layouts
- [ ] `FlightSearch.tsx` onSearch interface updated to include `passengers: number`
- [ ] `FlightSearch.test.tsx` updated — all tests passing
- [ ] `npm test -- --run` passes with no failures
- [ ] `npm run storybook` builds without errors
- [ ] TypeScript compiles with no errors (`npx tsc --noEmit`)

---

*Generated by opencode*
