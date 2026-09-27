import type { Meta, StoryObj } from '@storybook/react-vite';

import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    className: 'w-full max-w-2xl text-tally-primary',
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
    return <BarChart {...args} data={data} label="Daily views with one missing day" />;
  },
};

export const NoData: Story = {
  args: {
    data: [],
  },
};
