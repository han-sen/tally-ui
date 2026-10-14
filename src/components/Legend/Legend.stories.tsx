import type { Meta, StoryObj } from '@storybook/react-vite';

import { Legend } from './Legend';

const meta: Meta<typeof Legend> = {
  title: 'Components/Legend',
  component: Legend,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Northline', colorClassName: 'text-tally-chart-1' },
      { label: 'Coastal Freight', colorClassName: 'text-tally-chart-2' },
      { label: 'Summit Express', colorClassName: 'text-tally-chart-3' },
      { label: 'Harbor Logistics', colorClassName: 'text-tally-chart-4' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};

/** A total next to each series, stacked for a narrow side panel. */
export const VerticalWithValues: Story = {
  args: {
    orientation: 'vertical',
    items: [
      {
        label: 'Northline',
        colorClassName: 'text-tally-chart-1',
        value: '48,210',
      },
      {
        label: 'Coastal Freight',
        colorClassName: 'text-tally-chart-2',
        value: '41,980',
      },
      {
        label: 'Summit Express',
        colorClassName: 'text-tally-chart-3',
        value: '39,455',
      },
    ],
  },
};
