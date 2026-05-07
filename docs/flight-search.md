# FlightSearch

## Overview

The `FlightSearch` component is a responsive flight search form that allows users to select departure/arrival airports and travel dates. It adapts its layout across three breakpoints: a horizontal bar on desktop, a vertical card on tablet, and a bottom-sheet modal on mobile. Upon form submission, it invokes an optional `onSearch` callback with the selected search parameters.

**Type:** Container  
**Location:** `src/components/FlightSearch/FlightSearch.tsx`  
**Status:** Production

---

## File Structure

```
FlightSearch/
├── FlightSearch.tsx           # Main component
├── FlightSearch.test.tsx      # Unit tests
├── FlightSearch.stories.tsx   # Storybook stories
├── AirportSelector.tsx        # Sub-component for airport selection with search
├── AirportSelector.test.tsx   # AirportSelector unit tests
├── AirportSelector.stories.tsx # AirportSelector stories
├── DatesSelector.tsx          # Sub-component for date picking with calendar
├── DatesSelector.test.tsx     # DatesSelector unit tests
└── DatesSelector.stories.tsx  # DatesSelector stories
```

---

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onSearch` | `(data: { from: string; to: string; date: DateRange }) => void` | No | — | Callback fired when the user clicks "Search Flights". Receives the selected departure airport code, arrival airport code, and date range. |

The `DateRange` type (imported from `DatesSelector`) is:

```typescript
interface DateRange {
  departure: string;  // ISO date string (YYYY-MM-DD)
  return?: string;    // ISO date string (YYYY-MM-DD), optional
}
```

### Exports

```typescript
// Named export
export { FlightSearch };
```

---

## Usage

### Basic Example

```tsx
import { FlightSearch } from "./components/FlightSearch/FlightSearch";

function App() {
  return <FlightSearch />;
}
```

### With Search Callback

```tsx
import { useState } from "react";
import { FlightSearch } from "./components/FlightSearch/FlightSearch";
import type { DateRange } from "./components/FlightSearch/DatesSelector";

function App() {
  const [results, setResults] = useState<string | null>(null);

  const handleSearch = (data: { from: string; to: string; date: DateRange }) => {
    console.log("Searching flights:", data);
    // from: "BKK", to: "CNX", date: { departure: "2026-05-15" }
    setResults(`Flights from ${data.from} to ${data.to}`);
  };

  return <FlightSearch onSearch={handleSearch} />;
}
```

### Advanced / Common Patterns

```tsx
// Example: Integrating with a parent form state
import { useState } from "react";
import { FlightSearch } from "./components/FlightSearch/FlightSearch";
import type { DateRange } from "./components/FlightSearch/DatesSelector";

function SearchPage() {
  const [searchParams, setSearchParams] = useState<{
    from: string;
    to: string;
    date: DateRange;
  } | null>(null);

  return (
    <div>
      <FlightSearch
        onSearch={(data) => {
          setSearchParams(data);
          // Navigate to results page or trigger API call
        }}
      />
      {searchParams && (
        <div>
          <p>From: {searchParams.from}</p>
          <p>To: {searchParams.to}</p>
          <p>Departure: {searchParams.date.departure}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Dependencies

### Internal Dependencies

| Dependency | Type | Description |
|------------|------|-------------|
| `AirportSelector` | Component | Dropdown selector for departure/arrival airports with search and filtering. Renders desktop dropdown or mobile bottom-sheet modal. |
| `DatesSelector` | Component | Calendar-based date picker supporting one-way and return trip types. Renders desktop dropdown or mobile bottom-sheet modal. |
| `DateRange` | Type | Imported from `DatesSelector`, defines the shape of the date selection (`departure` and optional `return`). |

### External Dependencies

| Package | Usage |
|---------|-------|
| `react` | Core component logic (`useState` hook) |

### Dependents

This component is used by:
- `FlightSearch.test.tsx` — Unit tests
- `FlightSearch.stories.tsx` — Storybook stories

No other components or pages in the codebase currently import `FlightSearch`. It is designed as a top-level feature component intended to be placed on landing or search pages.

---

## State Management

The component manages four pieces of internal state:

```typescript
const [from, setFrom] = useState("");           // Selected departure airport code
const [to, setTo] = useState("");               // Selected arrival airport code
const [dateRange, setDateRange] = useState<DateRange>({ departure: '' }); // Date selection
const [isOpen, setIsOpen] = useState(false);    // Mobile modal open/close state
```

**Validation logic:**
- `isValid` — The search button is enabled only when `from`, `to`, and `dateRange.departure` are all set.
- `isArrivalDisabled` — The "To" selector is disabled until a departure airport is selected.
- `isDateDisabled` — The date selector is disabled until both departure and arrival airports are selected.

**State flow on search:**
1. User fills in all required fields.
2. User clicks "Search Flights".
3. `handleSearch` invokes `onSearch` with the current state.
4. Mobile modal is closed (`setIsOpen(false)`).

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | A fixed bottom bar with a "Search Flights" button. Tapping opens a full-screen bottom-sheet modal containing the form fields (AirportSelector x2, DatesSelector, SearchButton). |
| Tablet (768px - 1023px) | A single-column card layout with fields stacked vertically: From, To, Departure Date, Search Button. |
| Desktop (>= 1024px) | A single-row horizontal bar with fields side by side: From, To, Departure Date, and Search Button in a rounded card. |

The responsive breakpoints use Tailwind CSS utility classes (`md:`, `lg:`) with `hidden`/`block` toggling to show the appropriate layout variant.

---

## Accessibility

- **ARIA:** 
  - `AirportSelector` sub-component uses `aria-expanded`, `aria-haspopup="listbox"`, and `aria-selected` on options.
  - Both sub-components use `role="listbox"` and `role="option"` for dropdown lists.
  - Labels use `sr-only` (screen-reader-only) class for visual compactness while maintaining screen reader context.
- **Keyboard:** Sub-components support standard button/tab navigation. Focus rings are applied via `focus:ring-2` Tailwind utilities.
- **Screen Reader:** Labels are provided via `sr-only` class on `<label>` elements associated with each input via `htmlFor`/`id`.
- **Focus:** 
  - `AirportSelector` auto-focuses the search input when the dropdown opens.
  - `DatesSelector` uses outside-click detection to close popups.
  - Focus ring styles are consistent across interactive elements.

---

## Testing

### Test File

`src/components/FlightSearch/FlightSearch.test.tsx`

### Covered Scenarios

1. **Renders search button** — Verifies that the "Search Flights" text appears in the rendered output.
2. **Calls onSearch with correct data when form is filled (desktop)** — Full integration test: selects departure airport (BKK), arrival airport (CNX), picks a date via the desktop calendar (one-way mode), confirms, and verifies the `onSearch` callback is called with the correct airport codes and a properly formatted departure date string. Also verifies the return date is undefined for one-way trips.
3. **Search button is disabled when form is empty (desktop)** — Verifies the initial disabled state of the search button.

### Gaps

- No tests for the tablet or mobile layouts.
- No tests for the conditional disabling of the "To" and date selectors.
- No tests for the mobile modal open/close behavior.
- No tests for edge cases (e.g., selecting the same airport for both from and to).

---

## Notes & Limitations

- **Hardcoded airports:** The `airports` array is defined inline within the component (10 airports covering Thai domestic and regional international destinations). For production use, this should be replaced with a prop or fetched from an API.
- **No same-airport validation:** The component does not prevent the user from selecting the same airport for both departure and arrival.
- **Date format:** Dates are stored and passed as ISO strings (`YYYY-MM-DD`). The `DateRange.return` field is optional, but the parent `FlightSearch` only validates `departure` for enabling the search button.
- **Mobile modal:** The mobile bottom-sheet uses `max-h-[90vh]` to leave space at the top, but there is no swipe-to-dismiss gesture.
- **No loading state:** The component has no loading indicator during search. The `onSearch` callback is synchronous; any async behavior must be handled by the consumer.

---

## Related Components

| Component | Description |
|-----------|-------------|
| `AirportSelector` | Standalone airport dropdown with search filtering, used by `FlightSearch` for departure/arrival selection. |
| `DatesSelector` | Standalone calendar-based date picker supporting one-way and return trips, used by `FlightSearch` for date selection. |

---

*Generated by opencode on 2026-05-07*