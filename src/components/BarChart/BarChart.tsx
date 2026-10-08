'use client';

import type { HTMLAttributes } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useElementWidth } from '../../hooks/useElementWidth';
import { getLabelStep } from '../../lib/chart';
import { cn, isDrawable } from '../../lib/utils';
import { EmptyState } from '../EmptyState/EmptyState';

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
   * `"Daily views per vehicle over the last 30 days"`.
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

const margin = { top: 16, right: 16, bottom: 32, left: 40 };

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
 * The chart is exposed to assistive tech as an image named by `label`, so
 * describe what it shows. Each bar also has a tooltip for mouse users.
 * With no drawable values it renders an `EmptyState` instead.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[
 *     { label: 'Aug 1', value: 1400 },
 *     { label: 'Aug 2', value: 1520 },
 *   ]}
 *   label="Daily views for Toyota Camry"
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
  const { ref, width } = useElementWidth();

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

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
  const xScale = scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = scaleLinear()
    .domain([0, Math.max(...values.map((d) => d.value))])
    .range([innerHeight, 0])
    .nice(5);

  const yTicks = yScale.ticks(5);

  // Show every nth x label so they never overlap.
  const step = getLabelStep(
    data.map((d) => String(formatLabel?.(d.label) ?? d.label)),
    innerWidth,
  );

  return (
    // The bars use `currentColor`, and CSS color is inherited, so the color
    // class on this wrapper reaches them inside the SVG.
    <div
      {...props}
      ref={ref}
      className={cn('w-full min-w-0 text-tally-primary', className)}
      // The height is set before measuring, so the page doesn't jump when
      // the chart is drawn.
      style={{ ...style, height }}
    >
      <svg
        className="block"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
      >
        {/* Nothing is drawn until the width is known: on the server, and
            before the first measurement. The named, sized frame is enough. */}
        {width > 0 && (
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* y-axis ticks and gridlines */}
            {yTicks.map((tick) => (
              <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                <line x2={innerWidth} className="stroke-tally-border" />
                <text
                  x={-8}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-tally-muted-fg text-xs"
                >
                  {formatValue?.(tick) ?? tick}
                </text>
              </g>
            ))}

            {/* x labels, centered under their bars */}
            {data.map((d, i) =>
              i % step === 0 ? (
                <text
                  key={d.label}
                  x={(xScale(d.label) ?? 0) + xScale.bandwidth() / 2}
                  y={innerHeight + 16}
                  textAnchor="middle"
                  className="fill-tally-muted-fg text-xs"
                >
                  {formatLabel?.(d.label) ?? d.label}
                </text>
              ) : null,
            )}

            {/* bars */}
            {values.map((d) => (
              <rect
                key={d.label}
                className="fill-current"
                style={{ clipPath: barClipPath }}
                x={xScale(d.label)}
                y={yScale(d.value)}
                width={xScale.bandwidth()}
                height={innerHeight - yScale(d.value)}
              >
                <title>{`${formatLabel?.(d.label) ?? d.label}: ${formatValue?.(d.value) ?? d.value}`}</title>
              </rect>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
