import { useId } from 'react';
import type { SVGAttributes } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { cn, isDrawable } from '../../lib/utils';
import { EmptyState } from '../EmptyState/EmptyState';

export interface SparklineProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'viewBox' | 'preserveAspectRatio'
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
const AREA_TOP_OPACITY = 0.15;

// The glow is part of the design system's style, not an option: a thicker,
// blurred copy of the line drawn behind it and shifted
// down. Blur and offset are in viewBox units, which stretch horizontally when
// the chart is wider than its 100x32 box (`preserveAspectRatio="none"`), so the
// x blur is kept small and most of the softness is vertical.
const GLOW_STROKE_WIDTH = 5;
const GLOW_BLUR_X = 0.6;
const GLOW_BLUR_Y = 2;
const GLOW_OFFSET_Y = 2.5;
// Used only when the tokens aren't loaded; --tally-chart-glow-opacity sets it.
const GLOW_OPACITY_FALLBACK = 0.45;

// The glow is clipped to the viewBox so it never spills out of the chart. To
// keep it from being cut off at the edges, the line is inset by how far the
// glow reaches past it: two standard deviations of blur (past which it is
// effectively invisible), shifted by the offset. Upward the stroke's half width
// counts too, since the offset no longer hides it. The stroke width is in
// pixels, which matches viewBox units at the default `h-8` and overestimates at
// taller sizes, so it stays safe. The area fill still reaches the bottom.
const GLOW_SPACE_BOTTOM = GLOW_OFFSET_Y + 2 * GLOW_BLUR_Y;
const GLOW_SPACE_TOP = Math.max(
  0,
  GLOW_STROKE_WIDTH / 2 + 2 * GLOW_BLUR_Y - GLOW_OFFSET_Y,
);

/**
 * Tiny line chart with a soft area fill that shows the shape of a trend.
 *
 * Points are spaced evenly by index, so use it for regularly spaced values
 * such as daily totals. It fills the width of its container by default
 * (`h-8 w-full`); override with `className` (for example `h-16 w-48`) and
 * color it with a text color class, since the line and fill use `currentColor`.
 *
 * The line has a soft glow in its own color, so it looks lifted off the
 * surface. It's part of the library's style rather than a prop: its strength
 * comes from the `--tally-chart-glow-opacity` token, and setting that to `0`
 * turns it off.
 *
 * @example
 * ```tsx
 * <Sparkline
 *   data={[3, 5, 4, 8, 7, 12]}
 *   label="Views trending up"
 *   className="h-8 w-24 text-tally-success-fg"
 * />
 * ```
 */
export function Sparkline({
  data,
  label,
  className,
  ...props
}: SparklineProps) {
  // Each instance needs its own gradient id. If two sparklines shared one,
  // every `url(#id)` would resolve to the first gradient in the document and
  // they would all take that instance's color.
  const gradientId = useId();
  const glowId = `${gradientId}-glow`;

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
    .range([HEIGHT - GLOW_SPACE_BOTTOM, GLOW_SPACE_TOP]);

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
      className={cn('block h-8 w-full overflow-visible', className)}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
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
        {/* The region is the viewBox in user space. The default region is
            based on the line's bounding box, which has no height for flat
            data and would clip the glow away entirely. */}
        <filter
          id={glowId}
          filterUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
        >
          <feGaussianBlur stdDeviation={`${GLOW_BLUR_X} ${GLOW_BLUR_Y}`} />
          <feOffset dy={GLOW_OFFSET_Y} />
        </filter>
      </defs>
      <path
        d={areaData ?? undefined}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <path
        d={lineData ?? undefined}
        strokeWidth={GLOW_STROKE_WIDTH}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${glowId})`}
        style={{
          opacity: `var(--tally-chart-glow-opacity, ${GLOW_OPACITY_FALLBACK})`,
        }}
      />
      <path
        d={lineData ?? undefined}
        className="stroke-2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
