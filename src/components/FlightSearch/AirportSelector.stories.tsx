import type { Meta, StoryObj } from '@storybook/react-vite';
import { AirportSelector } from './AirportSelector';
import { useState } from 'react';

const PlaneIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17 8L21 12L17 16" />
    <path d="M21 12H3" />
  </svg>
);

const sampleAirports = [
  { code: 'BKK', city: 'Bangkok' },
  { code: 'CNX', city: 'Chiang Mai' },
  { code: 'HKT', city: 'Phuket' },
  { code: 'USM', city: 'Koh Samui' },
  { code: 'NRT', city: 'Tokyo Narita' },
  { code: 'KIX', city: 'Osaka Kansai' },
  { code: 'ICN', city: 'Seoul Incheon' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'HKG', city: 'Hong Kong' },
  { code: 'TPE', city: 'Taipei' },
];

const meta: Meta<typeof AirportSelector> = {
  title: 'Components/FlightSearch/AirportSelector',
  component: AirportSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AirportSelector>;

export const Default: Story = {
  args: {
    id: 'origin',
    label: 'Origin Airport',
    value: '',
    onChange: (code: string) => console.log('Selected:', code),
    placeholder: 'Select departure airport',
    airports: sampleAirports,
    icon: <PlaneIcon />,
  },
};

export const WithSelectedAirport: Story = {
  args: {
    id: 'destination',
    label: 'Destination Airport',
    value: 'BKK',
    onChange: (code: string) => console.log('Selected:', code),
    placeholder: 'Select arrival airport',
    airports: sampleAirports,
    icon: <PlaneIcon />,
  },
};

export const EmptyList: Story = {
  args: {
    id: 'origin',
    label: 'Origin Airport',
    value: '',
    onChange: (code: string) => console.log('Selected:', code),
    placeholder: 'Select departure airport',
    airports: [],
    icon: <PlaneIcon />,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Disabled Airport',
    value: '',
    onChange: (code: string) => console.log('Selected:', code),
    placeholder: 'Select airport (disabled)',
    airports: sampleAirports,
    icon: <PlaneIcon />,
    disabled: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <AirportSelector
        {...args}
        value={value}
        onChange={(code) => {
          setValue(code);
          args.onChange(code);
        }}
      />
    );
  },
  args: {
    id: 'origin',
    label: 'Origin Airport',
    value: '',
    onChange: (code: string) => console.log('Selected:', code),
    placeholder: 'Select departure airport',
    airports: sampleAirports,
    icon: <PlaneIcon />,
  },
};
