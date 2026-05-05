import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AirportSelector } from './AirportSelector';

const PlaneIcon = () => (
  <svg data-testid="plane-icon" />
);

const sampleAirports = [
  { code: 'BKK', city: 'Bangkok' },
  { code: 'CNX', city: 'Chiang Mai' },
  { code: 'HKT', city: 'Phuket' },
  { code: 'NRT', city: 'Tokyo Narita' },
];

// Mock useIsMobile to always return false (desktop)
vi.mock('./AirportSelector', async () => {
  const actual = await vi.importActual('./AirportSelector');
  return {
    ...actual,
    useIsMobile: () => false,
  };
});

describe('AirportSelector', () => {
  it('renders with placeholder when no value selected', () => {
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    expect(screen.getByText('Select airport')).toBeInTheDocument();
  });

  it('displays selected airport when value is provided', () => {
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value="BKK"
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    expect(screen.getByText('Bangkok (BKK)')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Bangkok')).toBeInTheDocument();
    expect(screen.getByText('Chiang Mai')).toBeInTheDocument();
  });

  it('calls onChange when airport is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={onChange}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);
    await user.click(screen.getByText('Bangkok'));

    expect(onChange).toHaveBeenCalledWith('BKK');
  });

  it('closes dropdown after selecting an airport', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);
    await user.click(screen.getByText('Bangkok'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('filters airports when searching', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    const searchInput = screen.getByPlaceholderText('Search airport...');
    await user.type(searchInput, 'bang');

    expect(screen.getByText('Bangkok')).toBeInTheDocument();
    expect(screen.queryByText('Chiang Mai')).not.toBeInTheDocument();
  });

  it('shows no results message when search has no matches', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    const searchInput = screen.getByPlaceholderText('Search airport...');
    await user.type(searchInput, 'xyz');

    expect(screen.getByText('No airports found')).toBeInTheDocument();
  });

  it('can search by airport code', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    const searchInput = screen.getByPlaceholderText('Search airport...');
    await user.type(searchInput, 'nrt');

    expect(screen.getByText('Tokyo Narita')).toBeInTheDocument();
    expect(screen.queryByText('Bangkok')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <AirportSelector
          id="origin"
          label="Origin"
          value=""
          onChange={() => {}}
          placeholder="Select airport"
          airports={sampleAirports}
          icon={<PlaneIcon />}
        />
        <button>Outside</button>
      </div>
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('highlights selected airport in the list', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value="BKK"
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    const bangkokOption = screen.getByRole('option', { name: /Bangkok/i });
    expect(bangkokOption).toHaveAttribute('aria-selected', 'true');
  });

  it('does not open dropdown when disabled', async () => {
    const user = userEvent.setup();
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    await user.click(button);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies disabled styles when disabled', () => {
    render(
      <AirportSelector
        id="origin"
        label="Origin"
        value=""
        onChange={() => {}}
        placeholder="Select airport"
        airports={sampleAirports}
        icon={<PlaneIcon />}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /origin/i });
    expect(button).toBeDisabled();
  });
});
