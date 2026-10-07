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
