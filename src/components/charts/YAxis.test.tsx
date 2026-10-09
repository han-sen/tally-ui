import { render } from '@testing-library/react';
import { scaleLinear } from 'd3-scale';
import { describe, it, expect } from 'vitest';

import { YAxis, type YAxisProps } from './YAxis';

// 0 to 100 over a 200-unit plot gives ticks every 20, so each tick sits 40
// units above the one below it.
const scale = scaleLinear().domain([0, 100]).range([200, 0]);

// YAxis draws SVG elements, which only render correctly inside an `<svg>`.
const renderAxis = (props: Partial<YAxisProps> = {}) =>
  render(
    <svg>
      <YAxis scale={scale} width={300} {...props} />
    </svg>,
  );

const tickLabels = (container: HTMLElement) =>
  [...container.querySelectorAll('text')].map((text) => text.textContent);

describe('YAxis', () => {
  it('renders a label for each tick in the scale', () => {
    const { container } = renderAxis();

    expect(tickLabels(container)).toEqual(['0', '20', '40', '60', '80', '100']);
  });

  it('renders a gridline per tick spanning the given width', () => {
    const { container } = renderAxis();
    const lines = [...container.querySelectorAll('line')];

    expect(lines).toHaveLength(6);
    for (const line of lines) {
      expect(line).toHaveAttribute('x2', '300');
    }
  });

  it('formats tick labels with formatValue', () => {
    const { container } = renderAxis({ formatValue: (v) => `${v}%` });

    expect(tickLabels(container)).toEqual([
      '0%',
      '20%',
      '40%',
      '60%',
      '80%',
      '100%',
    ]);
  });

  it('positions each tick at its scaled y value', () => {
    const { container } = renderAxis();
    // Read the y out of each tick's `translate(0, y)`. The scale's math can
    // land a hair off a whole number, so compare with toBeCloseTo.
    const offsets = [...container.querySelectorAll('svg > g')].map((tick) =>
      Number(tick.getAttribute('transform')?.match(/, (.+)\)/)?.[1]),
    );

    expect(offsets).toHaveLength(6);
    [200, 160, 120, 80, 40, 0].forEach((expected, i) => {
      expect(offsets[i]).toBeCloseTo(expected);
    });
  });
});
