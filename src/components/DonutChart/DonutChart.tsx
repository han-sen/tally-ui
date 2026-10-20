'use client';

import type { HTMLAttributes } from 'react';
import { useChartSize } from '../../hooks/useChartSize';
import { getChartColor, type ChartMargin } from '../../lib/chart';
import { EmptyState } from '../EmptyState/EmptyState';
import { cn, isDrawable } from '../../lib/utils';
import { ChartTooltip } from '../charts/ChartTooltip';
import { useChartNavigation } from '../../hooks/useChartNavigation';
import { pie, arc, type PieArcDatum } from 'd3-shape';

export interface DonutChartSlice {
  /** The slice's name, like "Northline". Must be unique within a chart. */
  label: string;
  /**
   * The slice's amount. Each slice's share is its value divided by the total.
   * Must be zero or greater; a `NaN` or infinite value is left out.
   */
  value: number;
  /**
   * A text color class for the slice, like `text-tally-chart-1`. Use the same
   * class on the slice's `Legend` item so their colors match. Defaults to the
   * chart color tokens in order.
   */
  colorClassName?: string;
}

export interface DonutChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** The slices, drawn clockwise from the top in the order given. */
  data: DonutChartSlice[];
  /**
   * Text alternative that describes the chart, for example
   * `"Share of shipments by carrier in August"`.
   */
  label: string;
  /**
   * Formats the values in the tooltip and announcements, for example
   * `(v) => v.toLocaleString('en-US')`.
   */
  formatValue?: (value: number) => string | number;
  /**
   * The chart's height in pixels. The donut is drawn as a circle this tall,
   * centered in the container's width.
   * @default 240
   */
  height?: number;
}

// A donut has no axes, so the plot fills the whole chart.
const NO_MARGIN: ChartMargin = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Donut chart for the shares of a whole, like each carrier's part of all
 * shipments. Best with a handful of slices; for comparing values or showing change
 * over time, use `BarChart` or `LineChart`.
 *
 * Hovering a slice highlights it and shows a tooltip with its value and share.
 * The chart is also focusable: ArrowLeft and ArrowRight move between slices,
 * wrapping around the ring, Home and End jump to the first and last, and
 * Escape clears it. Screen readers hear `label` as the chart's name, and the
 * active slice is announced, like "Northline: 4,820 (41%)", when it is
 * reached with the keyboard.
 *
 * Slices take the `tally-chart-1` to `tally-chart-4` colors in order, then
 * repeat. Pass `colorClassName` to pick a color, and use the same classes in a
 * `Legend` next to the chart. Other props go to the wrapping `<div>`.
 *
 * @useWhen
 * - You show how a total splits into a handful of parts, like each carrier's
 *   share of all shipments.
 *
 * @avoidWhen
 * - You have a large amount of segments, or segments with similar values. Use
 *   BarChart, where small differences are easier to read.
 * - You show change over time. Use LineChart.
 *
 * @related {@link Legend}
 *
 * @example
 * ```tsx
 * <DonutChart
 *   label="Share of shipments by carrier in August"
 *   data={[
 *     { label: 'Northline', value: 4820 },
 *     { label: 'Coastal Freight', value: 4190 },
 *     { label: 'Summit Express', value: 2730 },
 *   ]}
 *   formatValue={(v) => v.toLocaleString('en-US')}
 * />
 * ```
 */
export function DonutChart({
  data,
  label,
  formatValue,
  height = 240,
  className,
  style,
  ...props
}: DonutChartProps) {
  const { ref, width } = useChartSize(height, NO_MARGIN);

  const slices = data.filter((d) => isDrawable(d.value));

  const slicesTotal = slices.reduce((sum, slice) => {
    return sum + slice.value;
  }, 0);

  const formatSlice = (value: number) =>
    `${formatValue?.(value) ?? value} (${Math.round((value / slicesTotal) * 100)}%)`;

  const {
    activeIndex,
    announcement,
    activateFromPointer,
    clear,
    handleKeyDown,
  } = useChartNavigation({
    count: slices.length,
    describe: (index) => {
      const slice = slices[index];
      if (!slice) return '';
      return `${slice.label}: ${formatSlice(slice.value)}`;
    },
    wrap: true,
  });

  if (slicesTotal <= 0) {
    return (
      <EmptyState className={className}>
        <EmptyState.Title>No data to display</EmptyState.Title>
      </EmptyState>
    );
  }

  const donutRadius = Math.min(width, height) / 2;
  const donutPieGenerator = pie<DonutChartSlice>()
    .sort(null)
    .value((d) => d.value);
  const donutArcGenerator = arc<PieArcDatum<DonutChartSlice>>()
    .innerRadius(donutRadius * 0.6)
    .outerRadius(donutRadius);

  const sliceAngles = donutPieGenerator(slices);
  const activeSlice =
    activeIndex === null ? undefined : sliceAngles[activeIndex];

  // relative to the donut's center
  const [cx, cy] = activeSlice
    ? donutArcGenerator.centroid(activeSlice)
    : [0, 0];

  return (
    <div
      {...props}
      ref={ref}
      className={cn('relative', className)}
      style={{ ...style, height }}
    >
      <svg
        width={width}
        height={height}
        className="block rounded-tally-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tally-ring focus-visible:ring-offset-2"
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onBlur={clear}
      >
        {width > 0 && (
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {sliceAngles.map((slice, i) => {
              const isDimmed = activeIndex !== null && i !== activeIndex;
              return (
                <path
                  key={slice.data.label}
                  d={donutArcGenerator(slice) ?? undefined}
                  className={cn(
                    'fill-current',
                    getChartColor(i, slice.data.colorClassName),
                    isDimmed && 'opacity-40',
                  )}
                  onPointerEnter={() => activateFromPointer(i)}
                  onPointerLeave={clear}
                />
              );
            })}
          </g>
        )}
      </svg>

      {activeSlice && (
        <ChartTooltip
          left={width / 2 + cx}
          top={height / 2 + cy}
          side={cx < 0 ? 'left' : 'right'}
          className="-translate-y-1/2"
        >
          <p className="mb-1 font-medium">{activeSlice.data.label}</p>
          <p className="font-mono tabular-nums">
            {formatSlice(activeSlice.value)}
          </p>
        </ChartTooltip>
      )}

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
