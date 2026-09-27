import type { SVGAttributes } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { cn, isDrawable } from '../../lib/utils';
import { EmptyState } from '../EmptyState/EmptyState';

export interface BarChartProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'viewBox'
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
}

const WIDTH = 600;
const HEIGHT = 300;
const margin = { top: 16, right: 16, bottom: 32, left: 40 };

const innerWidth = WIDTH - margin.left - margin.right;
const innerHeight = HEIGHT - margin.top - margin.bottom;

// Rough width of one character at text-xs (12px) and the space left between
// labels, both in drawing units. Used to decide how many x labels fit.
const CHAR_WIDTH = 6.5;
const LABEL_GAP = 12;

/**
 * Vertical bar chart with a y-axis, gridlines, and thinned x labels.
 *
 * Size it with `className` (for example `w-full max-w-2xl`) and color the bars
 * with a text color class, since they use `currentColor`. It draws inside a
 * fixed 600 by 300 coordinate space, so text scales with the chart.
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
 *   className="w-full max-w-2xl text-primary"
 * />
 * ```
 */
export function BarChart({
  data,
  label,
  className,
  formatLabel,
  formatValue,
  ...props
}: BarChartProps) {
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

  // Show every nth x label so they never overlap: work out how many labels
  // fit across the chart, then space them out to match the number of bars.
  const longestLabel = Math.max(
    ...data.map((d) => String(formatLabel?.(d.label) ?? d.label).length),
  );
  const maxLabels = Math.floor(
    innerWidth / (longestLabel * CHAR_WIDTH + LABEL_GAP),
  );
  const step = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <svg
      {...props}
      className={cn('text-primary', className)}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
    >
      {/* wrapper that incorporates margin settings */}
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* create y-axis */}
        {yTicks.map((tick) => (
          <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
            <line x2={innerWidth} className="stroke-border" /> {/* gridline */}
            <text
              x={-8}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
            >
              {formatValue?.(tick) ?? tick}
            </text>
          </g>
        ))}

        {/** create x-axis */}
        {data.map((d, i) =>
          i % step === 0 ? (
            <text
              key={d.label}
              x={(xScale(d.label) ?? 0) + xScale.bandwidth() / 2} // center under the bar
              y={innerHeight + 16}
              textAnchor="middle"
              className="fill-muted-foreground text-xs"
            >
              {formatLabel?.(d.label) ?? d.label}
            </text>
          ) : null,
        )}

        {/** create bars */}
        {values.map((d) => (
          <rect
            key={d.label}
            className="fill-current"
            x={xScale(d.label)}
            y={yScale(d.value)}
            width={xScale.bandwidth()}
            height={innerHeight - yScale(d.value)}
          >
            <title>{`${formatLabel?.(d.label) ?? d.label}: ${formatValue?.(d.value) ?? d.value}`}</title>
          </rect>
        ))}
      </g>
    </svg>
  );
}
