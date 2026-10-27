import { scaleLinear } from 'd3-scale';

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

/** Space between a y tick label and the plot's left edge, in drawing units. */
export const Y_LABEL_GAP = 8;

// Rough width of one character at text-xs (12px) and the space left between
// labels, both in drawing units. Used to decide how many x labels fit.
const CHAR_WIDTH = 6.5;
const LABEL_GAP = 12;

// Rough width of one y label character at text-xs (12px). Wider than
// CHAR_WIDTH because y labels are mostly digits, about 7.6 each in Inter;
// commas and periods are narrow, so whole labels measure at most about 7 per
// character. Overestimating only adds a little space; underestimating clips.
const Y_CHAR_WIDTH = 7;

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

/**
 * How wide the left margin must be to fit the y-axis labels: the longest
 * label's estimated width plus the gap to the plot, and never less than
 * `CARTESIAN_MARGIN.left`.
 *
 * @param labels The y tick labels as they will be displayed (already formatted).
 */
export function getYAxisWidth(labels: string[]): number {
  if (!labels.length) {
    return CARTESIAN_MARGIN.left;
  }
  const longestLabel = Math.max(...labels.map((label) => label.length));
  const labelWidth = longestLabel * Y_CHAR_WIDTH;

  // The label needs its own width plus the gap to the plot, and never less
  // than the default margin.
  return Math.max(CARTESIAN_MARGIN.left, labelWidth + Y_LABEL_GAP);
}

/**
 * The margin for a cartesian chart (BarChart, LineChart): `CARTESIAN_MARGIN`
 * with the left side widened to fit the y tick labels, so large numbers like
 * "12,000" aren't cut off.
 *
 * The ticks depend only on the values, not the chart's size, so this can run
 * before the chart is measured.
 *
 * @param values Every drawable value the chart will plot, across all series.
 * @param formatValue The chart's `formatValue`, so the labels measured match
 *   the labels drawn.
 */
export function getCartesianMargin(
  values: number[],
  formatValue?: (value: number) => string | number,
): ChartMargin {
  // Ticks come from the domain alone, so any height works here.
  const labels = getValueScale(values, 0)
    .ticks(Y_TICK_COUNT)
    .map((tick) => String(formatValue?.(tick) ?? tick));

  return { ...CARTESIAN_MARGIN, left: getYAxisWidth(labels) };
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

export const EMPTY_DATA_MESSAGE = 'no data' as const;

/**
 * Where to put the tooltip for a cartesian chart (BarChart, LineChart): at the
 * active point's x, level with the top of the plot, opening toward the middle
 * so it stays inside the chart near either edge. Spread the result onto
 * `ChartTooltip`.
 *
 * @param x The active point's x position within the plot.
 * @param innerWidth The plot's width.
 * @param margin The chart's margin, to turn plot positions into chart ones.
 */
export function getCartesianTooltipPosition(
  x: number,
  innerWidth: number,
  margin: ChartMargin,
) {
  return {
    left: margin.left + x,
    top: margin.top,
    side: x > innerWidth / 2 ? 'left' : 'right',
  } as const;
}
