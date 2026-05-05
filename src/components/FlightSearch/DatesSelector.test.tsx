import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DatesSelector } from './DatesSelector';

describe('DatesSelector', () => {
  it('renders with placeholder text when no date selected', () => {
    render(<DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} />);
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });

  it('has Return selected by default', async () => {
    const user = userEvent.setup();
    render(<DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} />);

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    const returnRadio = within(desktopCalendar).getByLabelText('Return');
    expect(returnRadio).toBeChecked();
  });

  it('can switch to One Way', async () => {
    const user = userEvent.setup();
    render(<DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} />);

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    
    // Verify Return is checked by default
    const returnRadio = within(desktopCalendar).getByRole('radio', { name: 'Return' });
    expect(returnRadio).toBeChecked();
    
    // Switch to One Way - click the radio input directly
    const oneWayRadio = within(desktopCalendar).getByRole('radio', { name: 'One Way' });
    await user.click(oneWayRadio);
    expect(oneWayRadio).toBeChecked();
    expect(returnRadio).not.toBeChecked();
  });

  it('opens calendar dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} />);

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    expect(within(desktopCalendar).getByText(new RegExp(currentMonth))).toBeInTheDocument();
    expect(within(desktopCalendar).getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('calls onChange with formatted date when a day is selected (one way)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={onChange} defaultTripType="oneWay" />);

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    
    // Click "One Way" radio button within desktop calendar
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

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ departure: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) })
    );
  });

  it('displays selected date in formatted form', () => {
    render(
      <DatesSelector
        id="test-date"
        label="Departure Date"
        value={{ departure: '2026-06-15' }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText(/Jun 15/)).toBeInTheDocument();
  });

  it('navigates to previous month when left arrow is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DatesSelector
        id="test-date"
        label="Departure Date"
        value={{ departure: '2026-06-15' }}
        onChange={() => {}}
      />
    );

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    const prevButtons = within(desktopCalendar).getAllByRole('button', { name: 'Previous month' });
    await user.click(prevButtons[0]);

    expect(within(desktopCalendar).getByText(/May/)).toBeInTheDocument();
  });

  it('navigates to next month when right arrow is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DatesSelector
        id="test-date"
        label="Departure Date"
        value={{ departure: '2026-06-15' }}
        onChange={() => {}}
      />
    );

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');
    const nextButtons = within(desktopCalendar).getAllByRole('button', { name: 'Next month' });
    await user.click(nextButtons[0]);

    expect(within(desktopCalendar).getByText(/July/)).toBeInTheDocument();
  });

  it('selects return date when return trip is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatesSelector
        id="test-date"
        label="Departure Date"
        value={{ departure: '2026-06-15' }}
        onChange={onChange}
      />
    );

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const desktopCalendar = screen.getByTestId('desktop-calendar');

    // Select return date (must be after departure)
    const dayButtons = within(desktopCalendar).getAllByRole('button').filter(btn => /^\d+$/.test(btn.textContent || ''));
    const returnDay = dayButtons.find(btn => {
      const day = parseInt(btn.textContent || '0');
      return day > 15 && !btn.hasAttribute('disabled');
    });
    if (returnDay) {
      await user.click(returnDay);
    }

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        departure: '2026-06-15',
        return: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
      })
    );
  });

  it('closes calendar when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} />
        <button type="button">Outside</button>
      </>
    );

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    const outsideButton = screen.getByRole('button', { name: 'Outside' });
    await user.click(outsideButton);

    expect(screen.queryByTestId('desktop-calendar')).not.toBeInTheDocument();
  });

  it('does not open calendar when disabled', async () => {
    const user = userEvent.setup();
    render(
      <DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} disabled={true} />
    );

    const button = screen.getByLabelText('Departure Date');
    await user.click(button);

    expect(screen.queryByTestId('desktop-calendar')).not.toBeInTheDocument();
  });

  it('applies disabled attribute when disabled', () => {
    render(
      <DatesSelector id="test-date" label="Departure Date" value={{ departure: '' }} onChange={() => {}} disabled={true} />
    );

    const button = screen.getByLabelText('Departure Date');
    expect(button).toBeDisabled();
  });
});
