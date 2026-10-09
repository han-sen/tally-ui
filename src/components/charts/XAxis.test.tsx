import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { XAxis, type XAxisProps } from './XAxis';

const days = (count: number) =>
  Array.from({ length: count }, (_, i) => `Aug ${i + 1}`);

// XAxis draws SVG elements, which only render correctly inside an `<svg>`.
// Labels are 50 units apart unless a test passes its own getX.
const renderAxis = (props: Partial<XAxisProps> = {}) =>
  render(
    <svg>
      <XAxis
        labels={days(3)}
        getX={(i) => i * 50}
        width={544}
        height={200}
        {...props}
      />
    </svg>,
  );

const texts = (container: HTMLElement) => [
  ...container.querySelectorAll('text'),
];

const anchors = (container: HTMLElement) =>
  texts(container).map((text) => text.getAttribute('text-anchor'));

describe('XAxis', () => {
  it('renders every label when they all fit', () => {
    const { container } = renderAxis();

    expect(texts(container).map((text) => text.textContent)).toEqual([
      'Aug 1',
      'Aug 2',
      'Aug 3',
    ]);
  });

  it('skips labels when they would overlap', () => {
    // 30 labels across 544 units fit every third one (see getLabelStep).
    const { container } = renderAxis({ labels: days(30) });
    const shown = texts(container).map((text) => text.textContent);

    expect(shown).toHaveLength(10);
    expect(shown.slice(0, 3)).toEqual(['Aug 1', 'Aug 4', 'Aug 7']);
  });

  it('places each label at getX and just below the plot', () => {
    const { container } = renderAxis({ getX: (i) => 10 + i * 100 });

    expect(texts(container).map((text) => text.getAttribute('x'))).toEqual([
      '10',
      '110',
      '210',
    ]);
    for (const text of texts(container)) {
      expect(text).toHaveAttribute('y', '216');
    }
  });

  it('centers every label by default', () => {
    const { container } = renderAxis();

    expect(anchors(container)).toEqual(['middle', 'middle', 'middle']);
  });

  it('anchors the first and last labels inward when edgeAnchored', () => {
    const { container } = renderAxis({ labels: days(4), edgeAnchored: true });

    expect(anchors(container)).toEqual(['start', 'middle', 'middle', 'end']);
  });

  it('centers a single label even when edgeAnchored', () => {
    const { container } = renderAxis({ labels: days(1), edgeAnchored: true });

    expect(anchors(container)).toEqual(['middle']);
  });
});
