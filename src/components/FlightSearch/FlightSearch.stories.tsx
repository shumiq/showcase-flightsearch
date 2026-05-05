import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlightSearch } from "./FlightSearch";

const meta: Meta<typeof FlightSearch> = {
  title: "Components/FlightSearch",
  component: FlightSearch,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onSearch: { action: "searched" },
  },
};

export default meta;

type Story = StoryObj<typeof FlightSearch>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <Story />
      </div>
    ),
  ],
};
