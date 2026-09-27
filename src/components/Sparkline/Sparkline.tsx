import { useId } from 'react';
import type { SVGAttributes } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { isDrawable } from '../../lib/utils';
import { EmptyState } from '../EmptyState/EmptyState';

export interface SparklineProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'viewBox'
> {
  /**
   * Values to draw, left to right at evenly spaced positions. A `NaN` or
   * infinite value leaves a gap instead of shifting the points after it.
   */
  data: number[];
  /**
   * Text alternative that describes the trend, for example
   * `"Views trending up over 30 days"`. When provided the chart is exposed to
   * assistive tech as an image with this name. When omitted it is treated as
   * decorative and hidden
   */
  label?: string;
}

const WIDTH = 100;
const HEIGHT = 32;

// Opacity of the area fill at the line, fading to 0 at the baseline.
const AREA_TOP_OPACITY = 0.3;

/**
 * Tiny line chart with a soft area fill that shows the shape of a trend.
 *
 * Points are spaced evenly by index, so use it for regularly spaced values
 * such as daily totals. Size it with `className` (for example `h-8 w-24`) and
 * color it with a text color class, since the line and fill use `currentColor`.
 *
 * @example
 * ```tsx
 * <Sparkline
 *   data={[3, 5, 4, 8, 7, 12]}
 *   label="Views trending up"
 *   className="h-8 w-24 text-tally-success-foreground"
 * />
 * ```
 */
export function Sparkline({ data, label, ...props }: SparklineProps) {
  // Each instance needs its own gradient id. If two sparklines shared one,
  // every `url(#id)` would resolve to the first gradient in the document and
  // they would all take that instance's color.
  const gradientId = useId();

  // Only the drawable values decide the y range. The original array keeps its
  // length so points stay aligned with their position (missing ones leave a gap).
  const values = data.filter(isDrawable);

  if (values.length <= 1) {
    return (
      <EmptyState>
        <EmptyState.Title>
          <p>No data to display</p>
        </EmptyState.Title>
      </EmptyState>
    );
  }

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, WIDTH]);

  const yScale = scaleLinear()
    .domain([Math.min(...values), Math.max(...values)])
    .range([HEIGHT, 0]);

  const chartLine = line<number>()
    .defined(isDrawable)
    .x((_, idx) => xScale(idx))
    .y((d) => yScale(d))
    .curve(curveMonotoneX);

  const chartArea = area<number>()
    .defined(isDrawable)
    .x((_, idx) => xScale(idx))
    .y0(HEIGHT)
    .y1((d) => yScale(d))
    .curve(curveMonotoneX);

  const lineData = chartLine(data);
  const areaData = chartArea(data);

  return (
    <svg
      fill="none"
      stroke="currentColor"
      {...props}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            stopColor="currentColor"
            stopOpacity={AREA_TOP_OPACITY}
          />
          <stop offset="1" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={areaData ?? undefined}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <path d={lineData ?? undefined} />
    </svg>
  );
}
