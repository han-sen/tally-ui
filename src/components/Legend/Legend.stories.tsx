import type { Meta, StoryObj } from '@storybook/react-vite';

import { Legend } from './Legend';

const meta: Meta<typeof Legend> = {
  title: 'Components/Legend',
  component: Legend,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Toyota Camry', colorClassName: 'text-tally-chart-1' },
      { label: 'Honda Accord', colorClassName: 'text-tally-chart-2' },
      { label: 'Ford F-150', colorClassName: 'text-tally-chart-3' },
      { label: 'Tesla Model 3', colorClassName: 'text-tally-chart-4' },
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
        label: 'Toyota Camry',
        colorClassName: 'text-tally-chart-1',
        value: '48,210',
      },
      {
        label: 'Honda Accord',
        colorClassName: 'text-tally-chart-2',
        value: '41,980',
      },
      {
        label: 'Ford F-150',
        colorClassName: 'text-tally-chart-3',
        value: '39,455',
      },
    ],
  },
};
