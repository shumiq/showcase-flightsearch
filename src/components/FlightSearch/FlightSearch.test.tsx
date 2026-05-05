import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FlightSearch } from './FlightSearch';

describe('FlightSearch', () => {
  it('renders search button', () => {
    render(<FlightSearch />);
    expect(screen.getAllByText('Search Flights').length).toBeGreaterThan(0);
  });

  it('calls onSearch with correct data when form is filled (desktop)', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<FlightSearch onSearch={onSearch} />);

    const fromButton = screen.getAllByLabelText('From')[0];
    const toButton = screen.getAllByLabelText('To')[0];
    const dateButton = screen.getAllByLabelText('Departure Date')[0];

    await user.click(fromButton);
    await user.click(screen.getByRole('option', { name: /Bangkok \(BKK\)/i }));

    await user.click(toButton);
    await user.click(screen.getByRole('option', { name: /Chiang Mai \(CNX\)/i }));

    await user.click(dateButton);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    
    // Click "One Way" to simplify the test
    const oneWayRadio = within(desktopCalendar).getByLabelText('One Way');
    await user.click(oneWayRadio);
    
    const dayButtons = within(desktopCalendar).getAllByRole('button').filter(btn => /^\d+$/.test(btn.textContent || ''));
    const futureDay = dayButtons.find(btn => {
      const day = parseInt(btn.textContent || '0');
      return day > 5 && !btn.hasAttribute('disabled');
    });
    if (futureDay) {
      await user.click(futureDay);
    }

    const searchButton = screen.getAllByRole('button', { name: /search flights/i })[0];
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'BKK',
        to: 'CNX',
      })
    );
    const calledDate = onSearch.mock.calls[0][0].date;
    expect(calledDate.departure).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(calledDate.return).toBeUndefined();
  });

  it('search button is disabled when form is empty (desktop)', () => {
    render(<FlightSearch />);
    const searchButtons = screen.getAllByRole('button', { name: /search flights/i });
    const desktopButton = searchButtons[0];
    expect(desktopButton).toBeDisabled();
  });
});
