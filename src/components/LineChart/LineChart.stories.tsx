import type { Meta, StoryObj } from '@storybook/react-vite';

import { Legend } from '../Legend/Legend';
import { LineChart } from './LineChart';

// Deterministic fixtures shaped like daily shipment counts.
const xLabels = Array.from({ length: 30 }, (_, i) => `Aug ${i + 1}`);

function shipments(base: number, swing: number, trend: number, phase: number) {
  return xLabels.map((_, i) =>
    Math.round(base + swing * Math.sin(i / 4 + phase) + i * trend),
  );
}

const northline = shipments(1400, 300, 12, 0);
const coastal = shipments(1200, 200, 6, 1.5);
const summit = shipments(900, 150, -4, 3);

const meta: Meta<typeof LineChart> = {
  title: 'Components/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Daily shipments by carrier over the last 30 days',
    xLabels,
    series: [
      { name: 'Northline', values: northline },
      { name: 'Coastal Freight', values: coastal },
      { name: 'Summit Express', values: summit },
    ],
    formatValue: (v) => v.toLocaleString('en-US'),
  },
};
export default meta;

type Story = StoryObj<typeof LineChart>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    label: 'Daily shipments for Northline over the last 30 days',
    series: [{ name: 'Northline', values: northline }],
  },
};

/** Missing days leave a gap instead of joining the points around them. */
export const WithGaps: Story = {
  args: {
    series: [
      {
        name: 'Northline',
        values: northline.map((v, i) => (i >= 12 && i <= 15 ? NaN : v)),
      },
      { name: 'Coastal Freight', values: coastal },
    ],
  },
};

export const Empty: Story = {
  args: {
    series: [],
  },
};

/** A circle on every point, for short series where each value matters. */
export const ShowPoints: Story = {
  args: {
    label: 'Daily shipments for two carriers over the last 7 days',
    xLabels: xLabels.slice(0, 7),
    series: [
      { name: 'Northline', values: northline.slice(0, 7) },
      { name: 'Coastal Freight', values: coastal.slice(0, 7) },
    ],
    showPoints: true,
  },
};

/**
 * A value with no drawable neighbor has no line to sit on, so it always gets
 * a circle, even without `showPoints`.
 */
export const IsolatedPoints: Story = {
  args: {
    series: [
      {
        name: 'Northline',
        values: northline.map((v, i) => (i % 3 === 1 ? v : NaN)),
      },
      { name: 'Coastal Freight', values: coastal },
    ],
  },
};

/**
 * The chart doesn't draw its own legend, so the layout decides where it goes.
 * Give each series and its legend item the same color class.
 */
export const WithLegend: Story = {
  render: (args) => {
    const colors = [
      'text-tally-chart-1',
      'text-tally-chart-2',
      'text-tally-chart-3',
    ];
    const series = args.series.map((s, i) => ({
      ...s,
      colorClassName: colors[i],
    }));

    return (
      <div className="flex flex-col gap-4">
        <Legend
          items={series.map((s) => ({
            label: s.name,
            colorClassName: s.colorClassName ?? '',
          }))}
        />
        <LineChart {...args} series={series} />
      </div>
    );
  },
};

/** A shorter chart for compact cards. The width still fills the container. */
export const Height: Story = {
  args: {
    height: 160,
  },
};

/**
 * Drag the bottom-right corner to resize the container. The chart redraws at
 * the new width, so the text stays the same size and the x labels thin out
 * as space runs short.
 */
export const Resizable: Story = {
  decorators: [
    (Story) => (
      <div className="w-[600px] max-w-full min-w-48 resize-x overflow-auto rounded-tally-panel border border-dashed border-tally-border p-2">
        <Story />
      </div>
    ),
  ],
};

/**
 * The left margin grows to fit the widest y label, so values in the tens of
 * thousands show in full.
 */
export const LargeValues: Story = {
  args: {
    label: 'Daily shipments by carrier over the last 30 days, network-wide',
    series: [
      { name: 'Northline', values: northline.map((v) => v * 10) },
      { name: 'Coastal Freight', values: coastal.map((v) => v * 10) },
      { name: 'Summit Express', values: summit.map((v) => v * 10) },
    ],
  },
};
