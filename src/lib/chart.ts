import { scaleLinear } from 'd3-scale';

// Rough width of one character at text-xs (12px) and the space left between
// labels, both in drawing units. Used to decide how many x labels fit.
const CHAR_WIDTH = 6.5;
const LABEL_GAP = 12;

/**
 * How often to show an x-axis label so labels never overlap: 1 shows every
 * label, 2 every other one, and so on. Works out how many labels of the
 * longest length fit across `width`, then spaces them out to match the number
 * of labels.
 *
 * @param labels The labels as they will be displayed (already formatted).
 * @param width The width available for the axis, in drawing units.
 */
export function getLabelStep(labels: string[], width: number): number {
  if (labels.length === 0) return 1;

  const longestLabel = Math.max(...labels.map((label) => label.length));
  const maxLabels = Math.floor(width / (longestLabel * CHAR_WIDTH + LABEL_GAP));

  return Math.max(1, Math.ceil(labels.length / maxLabels));
}

/**
 * How many y-axis ticks to aim for. Shared by `getValueScale`, which rounds
 * the domain to fit this many, and `YAxis`, which asks the scale for this many
 * ticks, so the top tick lands on the top of the domain.
 */
export const Y_TICK_COUNT = 5;

/**
 * The y scale for a cartesian chart: from 0 at the bottom of the plot up to
 * the largest value at the top, rounded up to a tidy number with `.nice()`.
 * Values are assumed to be zero or greater, and already filtered to drawable
 * numbers.
 *
 * @param values Every value the chart will plot, across all series.
 * @param height The plot's inner height, in drawing units.
 */
export function getValueScale(values: number[], height: number) {
  // The 0 also covers an empty list, where Math.max() alone is -Infinity.
  return scaleLinear()
    .domain([0, Math.max(0, ...values)])
    .range([height, 0])
    .nice(Y_TICK_COUNT);
}

// The chart color classes, in order. Tailwind only generates classes it finds
// written out in full, so these can't be built as `text-tally-chart-${n}`.
const CHART_COLORS = [
  'text-tally-chart-1',
  'text-tally-chart-2',
  'text-tally-chart-3',
  'text-tally-chart-4',
];

/**
 * The text color class for a chart's `index`-th series or slice: `override`
 * when given, otherwise the chart color tokens in order, repeating after the
 * fourth. Elements drawn with `currentColor` pick it up.
 *
 * @param index The series or slice's position, from 0.
 * @param override A color class the consumer chose, like `text-tally-primary`.
 */
export function getChartColor(index: number, override?: string): string {
  return (
    override ??
    CHART_COLORS[index % CHART_COLORS.length] ??
    'text-tally-chart-1'
  );
}
