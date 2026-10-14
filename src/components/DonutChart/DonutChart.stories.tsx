import type { Meta, StoryObj } from '@storybook/react-vite';

import { Legend } from '../Legend/Legend';
import { DonutChart } from './DonutChart';

const meta: Meta<typeof DonutChart> = {
  title: 'Components/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  args: {
    className: 'max-w-sm',
    formatValue: (v: number) => v.toLocaleString('en-US'),
  },
};
export default meta;

type Story = StoryObj<typeof DonutChart>;

// Colors are written out in full, since Tailwind only generates classes it can
// find in the source. The same class goes on the slice and its legend item.
const carriers = [
  { label: 'Northline', value: 4820, colorClassName: 'text-tally-chart-1' },
  {
    label: 'Coastal Freight',
    value: 4190,
    colorClassName: 'text-tally-chart-2',
  },
  {
    label: 'Summit Express',
    value: 2730,
    colorClassName: 'text-tally-chart-3',
  },
];

export const Default: Story = {
  args: {
    data: carriers,
    label: 'Share of shipments by carrier in August',
  },
};

// Past four slices the chart colors repeat, so a fifth slice gets an explicit
// color here.
export const ManySlices: Story = {
  args: {
    data: [
      ...carriers,
      { label: 'Harbor Logistics', value: 2260 },
      {
        label: 'Ridgeway Transport',
        value: 1840,
        colorClassName: 'text-tally-primary',
      },
    ],
    label: 'Share of shipments across five carriers in August',
  },
};

export const WithLegend: Story = {
  render: (args) => (
    <div className="flex max-w-md items-center gap-6">
      <DonutChart {...args} className="w-48 shrink-0" height={192} />
      <Legend
        orientation="vertical"
        items={carriers.map((slice) => ({
          label: slice.label,
          colorClassName: slice.colorClassName,
          value: slice.value.toLocaleString('en-US'),
        }))}
      />
    </div>
  ),
  args: {
    data: carriers,
    label: 'Share of shipments by carrier in August',
  },
};

export const NoData: Story = {
  args: {
    data: [],
    label: 'Share of shipments by carrier',
  },
};
