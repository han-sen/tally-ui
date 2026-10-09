'use client';

import type { HTMLAttributes, KeyboardEvent, PointerEvent } from 'react';
import { useState } from 'react';
import { getValueScale } from '../../lib/chart';
import { getNextIndex, type NavigationMove } from '../../lib/navigation';
import { cn, isDrawable } from '../../lib/utils';
import { scaleLinear } from 'd3-scale';
import { EmptyState } from '../EmptyState/EmptyState';
import { line, curveMonotoneX } from 'd3-shape';
import { useElementWidth } from '../../hooks/useElementWidth';
import { XAxis } from '../charts/XAxis';
import { YAxis } from '../charts/YAxis';

export interface LineChartSeries {
  /**
   * The series name, like "Toyota Camry". Shown in the tooltip and read in
   * announcements. Must be unique within a chart.
   */
  name: string;
  /**
   * One value per entry in `xLabels`, in the same order. A `NaN` or infinite
   * value leaves a gap in the line instead of shifting the points after it.
   */
  values: number[];
  /**
   * A text color class for the line, like `text-tally-chart-1`. Use the same
   * class on the series' `Legend` item so their colors match. Defaults to the
   * chart color tokens in order.
   */
  colorClassName?: string;
}

export interface LineChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The positions along the x-axis, left to right, usually dates. Every
   * series' `values[i]` is its value at `xLabels[i]`.
   */
  xLabels: string[];
  /** The lines to draw, one per series. */
  series: LineChartSeries[];
  /**
   * Text alternative that describes the chart, for example
   * `"Daily views for three sedans over the last 30 days"`.
   */
  label: string;
  /**
   * Formats the y-axis tick labels and the values in the tooltip, for example
   * `(v) => v.toLocaleString('en-US')`.
   */
  formatValue?: (value: number) => string | number;
  /**
   * Formats the x-axis labels and the tooltip heading, for example
   * `(label) => label.replace('Aug ', '')`.
   */
  formatLabel?: (label: string) => string | number;
  /**
   * Draws a circle on every drawable point. When off, circles appear only on
   * isolated points (no drawable value on either side), which would otherwise
   * be invisible. Best for short series, since dense ones get crowded.
   * @default false
   */
  showPoints?: boolean;
  /**
   * The chart's height in pixels. The width always fills the container, but
   * the height comes from this prop, not from `className` (an `h-64` class
   * won't size the chart).
   * @default 300
   */
  height?: number;
}

const margin = { top: 16, right: 16, bottom: 32, left: 40 };

// Default series colors, in order. Tailwind only generates classes it finds
// written out in full, so these can't be built as `text-tally-chart-${n}`.
const DEFAULT_COLORS = [
  'text-tally-chart-1',
  'text-tally-chart-2',
  'text-tally-chart-3',
  'text-tally-chart-4',
];

// A time series stops at its ends rather than wrapping from the last day back
// to the first.
const KEY_MOVES: Partial<Record<string, NavigationMove>> = {
  ArrowRight: 'next',
  ArrowLeft: 'previous',
  Home: 'first',
  End: 'last',
};

function getSeriesColor(
  series: LineChartSeries,
  index: number,
): string | undefined {
  return series.colorClassName ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/**
 * Line chart for one or more series over the same x positions, with a y-axis,
 * gridlines, and thinned x labels.
 *
 * The chart scales to the width of its container. Hovering shows a crosshair
 * and a tooltip with every series' value at that point. The chart is also
 * focusable: ArrowLeft and ArrowRight move between points (stopping at the
 * ends), Home and End jump to the first and last, and Escape clears it. Screen
 * readers hear `label` as the chart's name, and the active point is announced,
 * like "Aug 12: Toyota Camry 1,602, Honda Accord 1,410", when it is
 * reached with the keyboard.
 *
 * Series take the `tally-chart-1` to `tally-chart-4` colors in order, then
 * repeat. Pass `colorClassName` to pick a color, and use the same classes in a
 * `Legend` next to the chart. Other props go to the wrapping `<div>`.
 *
 * @example
 * ```tsx
 * <LineChart
 *   label="Daily views for two sedans in August"
 *   xLabels={['Aug 1', 'Aug 2', 'Aug 3']}
 *   series={[
 *     { name: 'Toyota Camry', values: [1364, 1402, 1388] },
 *     { name: 'Honda Accord', values: [1210, 1198, NaN] },
 *   ]}
 *   formatValue={(v) => v.toLocaleString('en-US')}
 * />
 * ```
 */
export function LineChart({
  xLabels,
  series,
  label,
  formatValue,
  formatLabel,
  showPoints = false,
  className,
  style,
  height = 300,
  ...props
}: LineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Only keyboard moves are announced. Mousing across the chart
  // would be too noisy for screen readers.
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  const { ref, width } = useElementWidth();

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const hasData = series.some((d) => d.values.some(isDrawable));
  if (!hasData) {
    return (
      <EmptyState className={className}>
        <EmptyState.Title>No data to display</EmptyState.Title>
      </EmptyState>
    );
  }

  const xScale = scaleLinear()
    .domain([0, xLabels.length - 1])
    .range([0, innerWidth]);

  // Every drawable value from every series, so all lines share one y-axis.
  const allValues = series.flatMap((s) => s.values.filter(isDrawable));

  const yScale = getValueScale(allValues, innerHeight);

  const lineGenerator = line<number>()
    .defined(isDrawable)
    .x((_, idx) => xScale(idx))
    .y((d) => yScale(d))
    .curve(curveMonotoneX);

  const formattedXLabels = xLabels.map((x) => String(formatLabel?.(x) ?? x));

  const formatPointValue = (value: number | undefined) =>
    value !== undefined && isDrawable(value)
      ? String(formatValue?.(value) ?? value)
      : 'no data';

  // Prevent undefined tooltip by checking that
  // active index is in range when new labels props are supplied
  const active =
    activeIndex !== null && activeIndex < xLabels.length ? activeIndex : null;
  const activeX = active === null ? 0 : xScale(active);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    // The SVG is drawn at its real size, so one unit is one screen pixel.
    // Only the offset of the SVG on the page needs removing.
    const rect = event.currentTarget.getBoundingClientRect();
    const plotX = event.clientX - rect.left - margin.left;
    const index = Math.round(xScale.invert(plotX));

    setActiveIndex(Math.min(Math.max(index, 0), xLabels.length - 1));
    setIsKeyboardActive(false);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      setActiveIndex(null);
      return;
    }

    const move = KEY_MOVES[event.key];
    if (!move) return;

    event.preventDefault();
    setActiveIndex(getNextIndex(active ?? -1, move, xLabels.length));
    setIsKeyboardActive(true);
  };

  const announcement =
    active === null || !isKeyboardActive
      ? ''
      : `${formattedXLabels[active]}: ${series
          .map((s) => `${s.name} ${formatPointValue(s.values[active])}`)
          .join(', ')}`;

  // Keep the tooltip positioned on the inside of the chart
  const tooltipOnLeft = activeX > innerWidth / 2;

  return (
    <div
      {...props}
      className={cn('relative w-full min-w-0', className)}
      ref={ref}
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
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setActiveIndex(null)}
      >
        {/* Nothing is drawn until the width is known: on the server, and
            before the first measurement. The named, sized frame is enough. */}
        {width > 0 && (
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <YAxis
              scale={yScale}
              width={innerWidth}
              formatValue={formatValue}
            />
            {/* Each label sits under its point; there's no band to center in. */}
            <XAxis
              labels={formattedXLabels}
              getX={(i) => xScale(i)}
              width={innerWidth}
              height={innerHeight}
              edgeAnchored
            />
            {active !== null && (
              <line
                data-testid="crosshair"
                x1={activeX}
                x2={activeX}
                y2={innerHeight}
                className="stroke-tally-muted-fg"
                strokeDasharray="4 4"
              />
            )}
            {series.map((s, idx) => (
              <path
                key={s.name}
                d={lineGenerator(s.values) ?? undefined}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={getSeriesColor(s, idx)}
              />
            ))}
            {series.map((s, seriesIdx) => (
              <g key={s.name} className={getSeriesColor(s, seriesIdx)}>
                {s.values.map((value, i) => {
                  if (!isDrawable(value)) return null;

                  // A point with no drawable neighbor has no segment to sit on,
                  // so d3 draws nothing for it. Always give it a circle.
                  const isIsolated =
                    !isDrawable(s.values[i - 1]) &&
                    !isDrawable(s.values[i + 1]);
                  const isActive = i === active;

                  if (!showPoints && !isIsolated && !isActive) return null;

                  return (
                    <circle
                      key={i}
                      cx={xScale(i)}
                      cy={yScale(value)}
                      r={isActive ? 5 : 3}
                      fill="currentColor"
                      // A surface-colored ring separates the active dot from
                      // the line under it.
                      className={isActive ? 'stroke-tally-surface' : undefined}
                      strokeWidth={isActive ? 2 : undefined}
                    />
                  );
                })}
              </g>
            ))}
          </g>
        )}
      </svg>

      {active !== null && (
        // Hidden from screen readers; the live region below reads the same
        // values.
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute min-w-36 rounded-tally-panel bg-tally-surface px-3 py-2 text-xs text-tally-surface-fg shadow-tally-card',
            tooltipOnLeft ? '-translate-x-full -ml-3' : 'ml-3',
          )}
          style={{
            left: margin.left + activeX,
            top: margin.top,
          }}
        >
          <p className="mb-1 font-medium">{formattedXLabels[active]}</p>
          <ul className="flex flex-col gap-1">
            {series.map((s, idx) => (
              <li key={s.name} className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full bg-current',
                    getSeriesColor(s, idx),
                  )}
                />
                <span className="text-tally-muted-fg">{s.name}</span>
                <span className="ml-auto pl-3 font-mono tabular-nums">
                  {formatPointValue(s.values[active])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
