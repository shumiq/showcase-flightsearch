# Add Passenger Selector to Flight Search

**Status:** Open  
**Estimation:** M  
**Date Created:** 2026-05-07  

---

## Description
As a user searching for flights, I want to specify the number of passengers (1–9) so that the search results reflect the correct party size. This is a simple total count — not split by adult/child/infant categories.

---

## Requirements
1. Add a passenger count selector as a dropdown trigger in the `FlightSearch` component.
2. Display the current passenger count on the dropdown trigger (e.g., "1 Passenger" or "2 Passengers").
3. Inside the dropdown, provide `-` and `+` buttons to decrease/increase the count.
4. Minimum passenger count is **1**, maximum is **9**.
5. The `-` button must be disabled (or hidden) when the count is at 1.
6. The `+` button must be disabled (or hidden) when the count is at 9.
7. The dropdown should close when clicking outside or re-clicking the trigger.
8. The passenger count must be included in the `onSearch` callback data.

---

## Scope

### In Scope
- New `PassengerSelector` component (dropdown with +/- controls)
- Integration into `FlightSearch` across all three layouts (desktop row, tablet column, mobile modal)
- State management for passenger count within `FlightSearch`
- Passing passenger count in the `onSearch` callback
- Basic unit tests for the new component and integration

### Out of Scope
- Passenger type breakdown (adults, children, infants)
- Backend/API changes to handle passenger count
- Styling beyond the existing component patterns

---

## Acceptance Criteria

### AC 1: Dropdown renders with default passenger count of 1
- **Given** the user views the `FlightSearch` component
- **When** the component mounts
- **Then** the passenger selector trigger displays "1 Passenger"
- **And** the internal state defaults to 1

### AC 2: User can increase passenger count up to 9
- **Given** the passenger dropdown is open and the current count is less than 9
- **When** the user clicks the `+` button
- **Then** the count increases by 1
- **And** the trigger label updates to reflect the new count
- **And** if the count reaches 9, the `+` button becomes disabled

### AC 3: User can decrease passenger count down to 1
- **Given** the passenger dropdown is open and the current count is greater than 1
- **When** the user clicks the `-` button
- **Then** the count decreases by 1
- **And** the trigger label updates to reflect the new count
- **And** if the count reaches 1, the `-` button becomes disabled

### AC 4: Passenger count is included in search callback
- **Given** the user has filled in all required fields including passenger count
- **When** the user clicks "Search Flights"
- **Then** the `onSearch` callback is called with an object containing `passengers` (a number between 1 and 9)

### AC 5: Dropdown closes on outside click
- **Given** the passenger dropdown is open
- **When** the user clicks anywhere outside the dropdown
- **Then** the dropdown closes

---

## Estimation

| Size | Description |
|------|-------------|
| **XS** | Trivial change, < 1 hour |
| **S** | Small task, a few hours |
| **M** | Moderate effort, 1-2 days |
| **L** | Significant work, 3-5 days |
| **XL** | Large feature, > 1 week |

**Selected:** S — Creating a new dropdown component with simple +/- logic and wiring it into three existing layouts. No new state management infrastructure or API changes needed.

---

## Technical Notes

### Investigation Findings

- **Related Files:**
  - `src/components/FlightSearch/FlightSearch.tsx` — main component to modify
  - `src/components/FlightSearch/FlightSearch.test.tsx` — tests to extend
  - `src/components/FlightSearch/FlightSearch.stories.tsx` — Storybook stories to update
  - `src/components/FlightSearch/AirportSelector.tsx` — existing dropdown-like component to follow as a pattern
  - `src/components/FlightSearch/DatesSelector.tsx` — another existing field component for reference

- **Existing Patterns:** The `AirportSelector` and `DatesSelector` components already handle dropdown/popover behavior, labels, and icons. Follow the same visual style (rounded inputs, consistent padding, label above field).

- **Technical Considerations:** The `onSearch` callback currently accepts `{ from: string; to: string; date: DateRange }`. This interface will need a `passengers: number` field added. The desktop, tablet, and mobile layouts all need the new selector inserted — desktop as a 4th column, tablet as an additional row item, mobile as another field in the modal.

### Suggested Implementation Steps
1. Create `src/components/FlightSearch/PassengerSelector.tsx` — a dropdown component with a trigger showing the current count and a popover with `-` / `+` buttons
2. Add `passengers` state to `FlightSearch.tsx` with default value of `1`
3. Update the `onSearch` interface to include `passengers: number`
4. Insert `PassengerSelector` into all three layouts (desktop, tablet, mobile)
5. Include `passengers` in the `handleSearch` callback payload
6. Add unit tests for `PassengerSelector` (increment, decrement, boundary conditions)
7. Update the existing `FlightSearch` test to verify `passengers` is passed to `onSearch`
8. Update Storybook story to showcase the new selector

### Missing Information / Open Questions
- Should the dropdown use the same styling as `AirportSelector` (white popover with shadow), or a lighter inline panel?
- Is the label "Passengers" acceptable, or should it be "Travelers"?

---

## Additional Context
N/A

## Conversation Log
*Full conversation between user and agent during ticket creation for reference:*

### Agent
> I can help with that! What feature or story do you want to build? Feel free to describe it naturally, and I'll figure out the technical details.

### User
> I want to let user set number of passenger in FlightSearch

### Agent
> I found the `FlightSearch` component at `src/components/FlightSearch/FlightSearch.tsx`. It currently supports departure/arrival airports and dates, but has no passenger selection. A few quick questions:
>
> 1. **Passenger types** — Should this be a simple total count (e.g., 1-9 passengers), or do you need categories like Adults, Children, and Infants with separate counts?
> 2. **Validation rules** — Should there be a minimum of 1 passenger and a maximum limit? Any rules like "at least 1 adult required"?
> 3. **Placement** — Should the passenger selector appear alongside the other fields (from/to/dates) in the desktop row, tablet column, and mobile modal?

### User
> 1. Let's simple total count for now  
> 2. 1-9 passengers 
> 3. I want it to be dropdown. When you open dropdown, there would be - and + button

---
*Generated by opencode*
