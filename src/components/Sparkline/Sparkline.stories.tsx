import type { CSSProperties } from 'react';
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
    className: 'h-8 w-24 text-tally-success-fg',
  },
};

export const DownTrend: Story = {
  args: {
    data: [15, 12, 13, 9, 10, 6, 7, 3],
    className: 'h-8 w-24 text-tally-danger-fg',
  },
};

export const FlatData: Story = {
  args: {
    data: [5, 5, 5, 5, 5],
    className: 'h-8 w-24 text-tally-primary',
  },
};

export const WithZeros: Story = {
  args: {
    data: [0, 4, 0, 6, 0, 8],
    className: 'h-8 w-24 text-tally-primary',
  },
};

// NaN doesn't survive Storybook's args serialization, so this one uses render.
export const WithGap: Story = {
  render: () => (
    <Sparkline
      data={[3, 5, NaN, 8, 7, 12]}
      className="h-8 w-24 text-tally-primary"
    />
  ),
};

// Each glow should take its own line's color, like the gradient fill. The
// flat line checks that the glow isn't clipped away when the data has no height.
export const GlowColors: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <Sparkline
        data={[3, 5, 4, 8, 7, 12, 11, 15]}
        className="h-16 w-64 text-tally-success-fg"
      />
      <Sparkline
        data={[15, 12, 13, 9, 10, 6, 7, 3]}
        className="h-16 w-64 text-tally-danger-fg"
      />
      <Sparkline
        data={[5, 5, 5, 5, 5]}
        className="h-16 w-64 text-tally-primary"
      />
    </div>
  ),
};

/**
 * The glow is part of the style, not a prop. Setting the
 * `--tally-chart-glow-opacity` token to `0` turns it off; an app would do this
 * once in its own CSS.
 */
export const WithoutGlow: Story = {
  args: {
    data: [3, 5, 4, 8, 7, 12, 11, 15],
    className: 'h-16 w-64 text-tally-success-fg',
  },
  decorators: [
    (Story) => (
      <div style={{ '--tally-chart-glow-opacity': 0 } as CSSProperties}>
        <Story />
      </div>
    ),
  ],
};

// Regression check for the per-instance gradient id: each sparkline should
// keep its own color instead of all taking the first one's.
export const MixedColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Sparkline
        data={[3, 5, 4, 8, 7, 12]}
        className="h-8 w-24 text-tally-success-fg"
      />
      <Sparkline
        data={[12, 9, 10, 6, 7, 3]}
        className="h-8 w-24 text-tally-danger-fg"
      />
      <Sparkline
        data={[4, 6, 5, 9, 8, 11]}
        className="h-8 w-24 text-tally-primary"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => {
    const data = [3, 5, 4, 8, 7, 12, 11, 15];
    return (
      <div className="flex flex-col items-start gap-4 text-tally-primary">
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
