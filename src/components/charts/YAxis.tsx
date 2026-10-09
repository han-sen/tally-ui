import type { ScaleLinear } from 'd3-scale';
import { Y_TICK_COUNT } from '../../lib/chart';

export interface YAxisProps {
  /**
   * The chart's y scale, already given its domain, range, and `.nice()`.
   * Tick positions come from it, so the axis always matches the plotted data.
   */
  scale: ScaleLinear<number, number>;
  /** The plot's inner width. Each gridline spans it from left to right. */
  width: number;
  /**
   * Formats the tick labels, for example `(v) => v.toLocaleString('en-US')`.
   * Pass the chart's own `formatValue` through so the axis and tooltip match.
   */
  formatValue?: (value: number) => string | number;
}

/**
 * Y-axis tick labels with a horizontal gridline at each tick, for the
 * cartesian charts (BarChart, LineChart). Internal: not exported from the
 * package.
 *
 * Render it inside the chart's plot group, the `<g>` already translated by
 * the margins, so `0, 0` is the plot's top-left corner. Labels sit in the left
 * margin, right-aligned against the plot.
 *
 * @example
 * ```tsx
 * <g transform={`translate(${margin.left}, ${margin.top})`}>
 *   <YAxis scale={yScale} width={innerWidth} formatValue={formatValue} />
 *   {...bars or lines}
 * </g>
 * ```
 */
export function YAxis({ scale, width, formatValue }: YAxisProps) {
  const ticks = scale.ticks(Y_TICK_COUNT);

  return ticks.map((tick) => (
    <g key={tick} transform={`translate(0, ${scale(tick)})`}>
      <line x2={width} className="stroke-tally-border" />
      <text
        x={-8}
        textAnchor="end"
        dominantBaseline="middle"
        className="fill-tally-muted-fg text-xs"
      >
        {formatValue?.(tick) ?? tick}
      </text>
    </g>
  ));
}
