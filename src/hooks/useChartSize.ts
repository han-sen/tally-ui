import { useElementWidth } from './useElementWidth';

/** Space around a chart's plot for axis labels, in pixels. */
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * The margin BarChart and LineChart share: room on the left for y tick labels
 * and below for x labels. A chart with no axes, like a donut, passes zeros.
 */
export const CARTESIAN_MARGIN: ChartMargin = {
  top: 16,
  right: 16,
  bottom: 32,
  left: 40,
};

export interface UseChartSizeResult {
  /** Attach to the chart's wrapping `<div>`, the element that gets measured. */
  ref: (element: HTMLDivElement | null) => void;
  /** The whole chart's width in pixels. 0 until measured, and on the server. */
  width: number;
  /** The plot's width: `width` minus the left and right margins, never below 0. */
  innerWidth: number;
  /** The plot's height: `height` minus the top and bottom margins, never below 0. */
  innerHeight: number;
  /** The margin in use, for translating the plot group and placing tooltips. */
  margin: ChartMargin;
}

/**
 * Measures a chart's container and works out the size of the plot inside its
 * margins. The width comes from the container; the height is fixed by the
 * chart's `height` prop.
 *
 * @param height The whole chart's height in pixels.
 * @param margin Space around the plot. Defaults to `CARTESIAN_MARGIN`.
 *
 * @example
 * ```tsx
 * const { ref, width, innerWidth, innerHeight, margin } = useChartSize(height);
 * return (
 *   <div ref={ref} style={{ height }}>
 *     <svg width={width} height={height}>
 *       <g transform={`translate(${margin.left}, ${margin.top})`}>...</g>
 *     </svg>
 *   </div>
 * );
 * ```
 */
export function useChartSize(
  height: number,
  margin: ChartMargin = CARTESIAN_MARGIN,
): UseChartSizeResult {
  const { ref, width } = useElementWidth();

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  return {
    ref,
    width,
    innerWidth,
    innerHeight,
    margin,
  };
}
