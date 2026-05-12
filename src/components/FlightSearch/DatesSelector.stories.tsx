import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatesSelector } from './DatesSelector';
import { useState } from 'react';
import type { DateRange } from './DatesSelector';

const meta: Meta<typeof DatesSelector> = {
  title: 'Components/FlightSearch/DatesSelector',
  component: DatesSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatesSelector>;

export const Empty: Story = {
  args: {
    id: 'date-empty',
    label: 'Departure Date',
    value: { departure: '' },
    onChange: () => {},
  },
};

export const WithDate: Story = {
  args: {
    id: 'date-selected',
    label: 'Departure Date',
    value: { departure: '2026-06-15' },
    onChange: () => {},
  },
};

export const WithReturnDate: Story = {
  args: {
    id: 'date-return',
    label: 'Departure Date',
    value: { departure: '2026-06-15', return: '2026-06-20' },
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange>({ departure: '' });
    return (
      <div className="w-80">
        <DatesSelector
          id="date-interactive"
          label="Departure Date"
          value={dateRange}
          onChange={setDateRange}
        />
        {dateRange.departure && (
          <p className="mt-4 text-sm text-gray-600">
            Selected: {JSON.stringify(dateRange)}
          </p>
        )}
      </div>
    );
  },
};

export const OneWay: Story = {
  args: {
    id: 'date-oneway',
    label: 'Departure Date',
    value: { departure: '' },
    onChange: () => {},
    defaultTripType: 'oneWay',
  },
};

export const Disabled: Story = {
  args: {
    id: 'date-disabled',
    label: 'Departure Date',
    value: { departure: '' },
    onChange: () => {},
    disabled: true,
  },
};
