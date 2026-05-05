import { render, screen } from '@testing-library/react';
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
    const dateInput = screen.getAllByLabelText('Departure Date')[0] as HTMLInputElement;

    await user.click(fromButton);
    await user.click(screen.getByRole('option', { name: /Bangkok \(BKK\)/i }));

    await user.click(toButton);
    await user.click(screen.getByRole('option', { name: /Chiang Mai \(CNX\)/i }));

    await user.type(dateInput, '2026-06-01');

    const searchButton = screen.getAllByRole('button', { name: /search flights/i })[0];
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith({
      from: 'BKK',
      to: 'CNX',
      date: '2026-06-01',
    });
  });

  it('search button is disabled when form is empty (desktop)', () => {
    render(<FlightSearch />);
    const searchButtons = screen.getAllByRole('button', { name: /search flights/i });
    const desktopButton = searchButtons[0];
    expect(desktopButton).toBeDisabled();
  });
});
