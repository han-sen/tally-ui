import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const ExampleStatCard: Story = {
  args: {
    label: 'Revenue',
    value: '$2400',
    delta: {
      value: '2.4%',
      direction: 'up',
      sentiment: 'positive',
      comparison: 'vs last week',
    },
  },
};

export const NegativeDelta: Story = {
  args: {
    label: 'Revenue',
    value: '$2100',
    delta: {
      value: '2.4%',
      direction: 'down',
      sentiment: 'negative',
      comparison: 'vs last week',
    },
  },
};

export const IncreaseIsBad: Story = {
  args: {
    label: 'Open recalls',
    value: '12',
    delta: {
      value: '3',
      direction: 'up',
      sentiment: 'negative',
      comparison: 'vs last month',
    },
  },
};

export const WithoutDelta: Story = {
  args: {
    label: 'Revenue',
    value: '$2400',
  },
};

export const LoadingStatCard: Story = {
  args: {
    label: 'Revenue',
    isLoading: true,
  },
};
