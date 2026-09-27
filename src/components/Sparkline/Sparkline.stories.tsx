import type { Meta, StoryObj } from '@storybook/react-vite';

import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Components/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Sparkline>;

export const UpTrend: Story = {
  args: {
    data: [3, 5, 4, 8, 7, 12, 11, 15],
    className: 'h-8 w-24 text-success-foreground',
  },
};

export const DownTrend: Story = {
  args: {
    data: [15, 12, 13, 9, 10, 6, 7, 3],
    className: 'h-8 w-24 text-danger-foreground',
  },
};

export const FlatData: Story = {
  args: {
    data: [5, 5, 5, 5, 5],
    className: 'h-8 w-24 text-primary',
  },
};

export const WithZeros: Story = {
  args: {
    data: [0, 4, 0, 6, 0, 8],
    className: 'h-8 w-24 text-primary',
  },
};

// NaN doesn't survive Storybook's args serialization, so this one uses render.
export const WithGap: Story = {
  render: () => (
    <Sparkline
      data={[3, 5, NaN, 8, 7, 12]}
      className="h-8 w-24 text-primary"
    />
  ),
};

// Regression check for the per-instance gradient id: each sparkline should
// keep its own color instead of all taking the first one's.
export const MixedColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Sparkline
        data={[3, 5, 4, 8, 7, 12]}
        className="h-8 w-24 text-success-foreground"
      />
      <Sparkline
        data={[12, 9, 10, 6, 7, 3]}
        className="h-8 w-24 text-danger-foreground"
      />
      <Sparkline data={[4, 6, 5, 9, 8, 11]} className="h-8 w-24 text-primary" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => {
    const data = [3, 5, 4, 8, 7, 12, 11, 15];
    return (
      <div className="flex flex-col items-start gap-4 text-primary">
        <Sparkline data={data} className="h-6 w-16" />
        <Sparkline data={data} className="h-8 w-24" />
        <Sparkline data={data} className="h-16 w-48" />
        <Sparkline data={data} className="h-16 w-16" />
      </div>
    );
  },
};

// Shows the current placeholder until the real EmptyState treatment exists.
export const NotEnoughData: Story = {
  args: {
    data: [5],
    className: 'h-8 w-24',
  },
};
