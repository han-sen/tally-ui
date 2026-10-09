import { getLabelStep } from '../../lib/chart';

// The first and last points sit on the edges of the plot, so a centered label
// there would hang half outside it (the right margin is too narrow to hold
// it). Anchor those labels to their inner side instead.
function edgeAnchor(index: number, count: number): 'start' | 'middle' | 'end' {
  if (count === 1) return 'middle';
  if (index === 0) return 'start';
  if (index === count - 1) return 'end';
  return 'middle';
}

export interface XAxisProps {
  /**
   * The labels to draw, left to right, already formatted with the chart's
   * `formatLabel`. Some are skipped when they would overlap.
   */
  labels: string[];
  /** The x position of the label at `index`, in plot units. */
  getX: (index: number) => number;
  /** The plot's inner width. Decides how many labels fit without overlap. */
  width: number;
  /** The plot's inner height. Labels sit just below it, in the bottom margin. */
  height: number;
  /**
   * Anchors the first label's start and the last label's end to the plot's
   * edges, instead of centering them. Use it when labels sit on the edges of
   * the plot, like a line chart's first and last points, where a centered
   * label would hang outside. Leave it off when labels are centered in bands.
   * @default false
   */
  edgeAnchored?: boolean;
}

/**
 * X-axis labels for the cartesian charts (BarChart, LineChart), thinned so
 * they never overlap. Internal: not exported from the package.
 *
 * Render it inside the chart's plot group, the `<g>` already translated by
 * the margins, so `0, 0` is the plot's top-left corner.
 *
 * @example
 * ```tsx
 * <XAxis
 *   labels={formattedXLabels}
 *   getX={(i) => xScale(i)}
 *   width={innerWidth}
 *   height={innerHeight}
 *   edgeAnchored
 * />
 * ```
 */
export function XAxis({
  labels,
  getX,
  width,
  height,
  edgeAnchored = false,
}: XAxisProps) {
  // Show every nth label so they never overlap.
  const step = getLabelStep(labels, width);

  return labels.map((label, index) =>
    index % step === 0 ? (
      <text
        key={index}
        x={getX(index)}
        y={height + 16}
        textAnchor={edgeAnchored ? edgeAnchor(index, labels.length) : 'middle'}
        className="fill-tally-muted-fg text-xs"
      >
        {label}
      </text>
    ) : null,
  );
}
