'use client';

import type { HTMLAttributes, PointerEvent } from 'react';
import { scaleBand } from 'd3-scale';
import { useChartSize } from '../../hooks/useChartSize';
import {
  EMPTY_DATA_MESSAGE,
  getCartesianTooltipPosition,
  getValueScale,
} from '../../lib/chart';
import { cn, isDrawable } from '../../lib/utils';
import { EmptyState } from '../EmptyState/EmptyState';
import { XAxis } from '../charts/XAxis';
import { ChartTooltip } from '../charts/ChartTooltip';
import { YAxis } from '../charts/YAxis';
import { useChartNavigation } from '../../hooks/useChartNavigation';

export interface BarChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Bars to draw, left to right in the order given, one slot per item.
   * Labels must be unique and values are assumed to be zero or greater.
   * A `NaN` or infinite value leaves an empty slot instead of shifting the
   * bars after it.
   */
  data: { label: string; value: number }[];
  /**
   * Text alternative that describes the chart, for example
   * `"Orders per day over the last 30 days"`.
   */
  label: string;
  /**
   * Formats the y-axis tick labels and the value in each bar's tooltip, for
   * example `(v) => v.toLocaleString('en-US')`. Return a string to control the
   * number of decimals.
   */
  formatValue?: (value: number) => string | number;
  /**
   * Formats the x-axis labels and the label in each bar's tooltip, for example
   * `(label) => label.replace('Aug ', '')`.
   */
  formatLabel?: (label: string) => string | number;
  /**
   * The chart's height in pixels. The width always fills the container, but
   * the height comes from this prop, not from `className` (an `h-64` class
   * won't size the chart).
   * @default 300
   */
  height?: number;
}

// Radius of each bar's top corners, in pixels. SVG's `rx` rounds all four
// corners, so the bars are clipped with CSS instead, which rounds only the top
// and shrinks the radius on bars too short to fit it.
const BAR_RADIUS = 4;
const barClipPath = `inset(0 round ${BAR_RADIUS}px ${BAR_RADIUS}px 0 0)`;

/**
 * Vertical bar chart with a y-axis, gridlines, and thinned x labels.
 *
 * The chart fills the width of its container and redraws as it resizes, so
 * text stays the same size and x labels thin out when space runs short. Set
 * the height with `height`. Color the bars with a text color class in
 * `className`, since they use `currentColor`. Other props go to the wrapping
 * `<div>`.
 *
 * Hovering highlights the nearest bar and shows a tooltip with its label and
 * value. The chart is also focusable: ArrowLeft and ArrowRight move between
 * bars (stopping at the ends), Home and End jump to the first and last, and
 * Escape clears it. Screen readers hear `label` as the chart's name, so
 * describe what it shows, and the active bar is announced, like
 * "Aug 12: 1,602", when it is reached with the keyboard. A missing value is
 * still a stop, announced as "no data". With no drawable values it renders an
 * `EmptyState` instead.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[
 *     { label: 'Aug 1', value: 1400 },
 *     { label: 'Aug 2', value: 1520 },
 *   ]}
 *   label="Orders per day in August"
 *   formatValue={(v) => v.toLocaleString('en-US')}
 *   height={240}
 *   className="max-w-2xl text-tally-primary"
 * />
 * ```
 */
export function BarChart({
  data,
  label,
  className,
  style,
  formatLabel,
  formatValue,
  height = 300,
  ...props
}: BarChartProps) {
  // The scale uses the raw labels, since they're unique. The axis shows the
  // formatted ones.
  const labels = data.map((d) => d.label);
  const formattedLabels = labels.map((l) => String(formatLabel?.(l) ?? l));
  const formatBarValue = (d: number | undefined) => {
    if (isDrawable(d)) {
      return formatValue?.(d) ?? d;
    }
    return EMPTY_DATA_MESSAGE;
  };

  const {
    activeIndex,
    announcement,
    activateFromPointer,
    clear,
    handleKeyDown,
  } = useChartNavigation({
    count: data.length,
    describe: (index) =>
      `${formattedLabels[index]}: ${formatBarValue(data[index]?.value)}`,
  });

  const { ref, width, innerWidth, innerHeight, margin } = useChartSize(height);

  const values = data.filter((d) => isDrawable(d.value));

  if (values.length === 0) {
    return (
      <EmptyState className={className}>
        <EmptyState.Title>No data to display</EmptyState.Title>
      </EmptyState>
    );
  }

  // Every label gets a slot, including ones whose value is missing, so a
  // missing day shows as an empty gap instead of the bars closing up around it.
  const xScale = scaleBand().domain(labels).range([0, innerWidth]).padding(0.2);

  const yScale = getValueScale(
    values.map((d) => d.value),
    innerHeight,
  );

  // Each bar's label, tooltip, and pointer target line up on its center.
  const bandCenter = (index: number) =>
    (xScale(labels[index] ?? '') ?? 0) + xScale.bandwidth() / 2;

  const activeX = activeIndex === null ? 0 : bandCenter(activeIndex);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    // Work out which bar the pointer is over. Scales turn data into pixels, and
    // this needs the reverse: pixels back to a bar. A band scale has no built-in
    // way to do that, so measure how many bar spacings (`step`) the pointer is
    // from the first bar's center, and round to the nearest bar.
    const rect = event.currentTarget.getBoundingClientRect();
    const plotX = event.clientX - rect.left - margin.left;
    const index = Math.round((plotX - bandCenter(0)) / xScale.step());

    activateFromPointer(index);
  };

  return (
    // The bars use `currentColor`, and CSS color is inherited, so the color
    // class on this wrapper reaches them inside the SVG.
    <div
      {...props}
      ref={ref}
      className={cn('relative w-full min-w-0 text-tally-primary', className)}
      // The height is set before measuring, so the page doesn't jump when
      // the chart is drawn.
      style={{ ...style, height }}
    >
      <svg
        className="block rounded-tally-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tally-ring focus-visible:ring-offset-2"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={clear}
        onBlur={clear}
      >
        {/* Nothing is drawn until the width is known: on the server, and
            before the first measurement. The named, sized frame is enough. */}
        {width > 0 && (
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* y-axis ticks and gridlines */}
            <YAxis
              scale={yScale}
              width={innerWidth}
              formatValue={formatValue}
            />

            {/* x labels, centered under their bars */}
            <XAxis
              labels={formattedLabels}
              getX={bandCenter}
              width={innerWidth}
              height={innerHeight}
            />

            {/* bars */}
            {data.map((d, i) => {
              if (!isDrawable(d.value)) return null;

              const isDimmed = activeIndex !== null && i !== activeIndex;
              return (
                <rect
                  key={d.label}
                  className={cn('fill-current', isDimmed && 'opacity-40')}
                  style={{ clipPath: barClipPath }}
                  x={xScale(d.label)}
                  y={yScale(d.value)}
                  width={xScale.bandwidth()}
                  height={innerHeight - yScale(d.value)}
                />
              );
            })}
          </g>
        )}
      </svg>

      {activeIndex !== null && (
        <ChartTooltip
          {...getCartesianTooltipPosition(activeX, innerWidth, margin)}
        >
          <p className="mb-1 font-medium">{formattedLabels[activeIndex]}</p>
          <p className="font-mono tabular-nums">
            {formatBarValue(data[activeIndex]?.value)}
          </p>
        </ChartTooltip>
      )}

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
