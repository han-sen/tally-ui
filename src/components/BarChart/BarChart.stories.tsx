import type { Meta, StoryObj } from '@storybook/react-vite';

import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    className: 'max-w-2xl text-tally-primary',
  },
};
export default meta;

type Story = StoryObj<typeof BarChart>;

// Deterministic fixture shaped like daily pageviews, so the story never changes.
const days = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    label: `Aug ${i + 1}`,
    value: Math.round(1400 + 300 * Math.sin(i / 4) + i * 12),
  }));

export const ThirtyDays: Story = {
  args: {
    data: days(30),
    label: 'Daily views for Toyota Camry, August 1 to 30',
  },
};

export const SevenDays: Story = {
  args: {
    data: days(7),
    label: 'Daily views for Toyota Camry, August 1 to 7',
  },
};

// NaN doesn't survive Storybook's args serialization, so this one uses render.
export const WithMissingValue: Story = {
  render: (args) => {
    const data = days(10);
    data[4] = { ...data[4]!, value: NaN };
    return (
      <BarChart
        {...args}
        data={data}
        label="Daily views with one missing day"
      />
    );
  },
};

export const NoData: Story = {
  args: {
    data: [],
  },
};

/** A shorter chart for compact cards. The width still fills the container. */
export const Height: Story = {
  args: {
    data: days(30),
    label: 'Daily views over the last 30 days',
    height: 160,
  },
};

/**
 * Drag the bottom-right corner to resize the container. The chart redraws at
 * the new width: bars get narrower, text stays the same size, and x labels
 * thin out as space runs short.
 */
export const Resizable: Story = {
  args: {
    data: days(30),
    label: 'Daily views over the last 30 days',
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] max-w-full min-w-48 resize-x overflow-auto rounded-tally-panel border border-dashed border-tally-border p-2">
        <Story />
      </div>
    ),
  ],
};
