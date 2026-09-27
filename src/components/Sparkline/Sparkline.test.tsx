import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Sparkline } from './Sparkline';

// The first path is the gradient area, the second is the line.
const linePathOf = (container: HTMLElement) =>
  container.querySelectorAll('svg path')[1]?.getAttribute('d') ?? '';

describe('Sparkline', () => {
  it('draws an area and a line inside a fixed coordinate space', () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 7, 12]} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 32');

    const paths = container.querySelectorAll('svg path');
    expect(paths).toHaveLength(2);
    for (const path of paths) {
      expect(path.getAttribute('d')).toBeTruthy();
    }
  });

  it.each([[[]], [[5]], [[Number.NaN, Number.NaN, 3]]])(
    'draws no chart when fewer than two values are drawable (%j)',
    (data) => {
      const { container } = render(<Sparkline data={data} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    },
  );

  it('leaves a gap for a missing value and keeps later points in place', () => {
    const { container } = render(<Sparkline data={[3, 5, Number.NaN, 8, 7]} />);

    const d = linePathOf(container);
    expect(d.match(/M/g)).toHaveLength(2);
    expect(d).not.toContain('NaN');
  });

  it('draws flat data as a horizontal line at mid height', () => {
    const { container } = render(<Sparkline data={[5, 5, 5]} />);

    const d = linePathOf(container);
    expect(d.startsWith('M0,16')).toBe(true);
    expect(d).not.toContain('NaN');
  });

  it('keeps zero values instead of dropping them', () => {
    const { container } = render(<Sparkline data={[0, 4, 0, 6]} />);

    expect(linePathOf(container).startsWith('M0,32')).toBe(true);
  });

  it('is exposed as a named image when a label is given', () => {
    render(<Sparkline data={[3, 5, 4, 8]} label="Views trending up" />);

    expect(
      screen.getByRole('img', { name: 'Views trending up' }),
    ).toBeInTheDocument();
  });

  it('is hidden from assistive tech when no label is given', () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8]} />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('gives each instance its own gradient so colors do not mix', () => {
    const { container } = render(
      <>
        <Sparkline data={[3, 5, 4, 8]} />
        <Sparkline data={[8, 4, 5, 3]} />
      </>,
    );

    const ids = [...container.querySelectorAll('linearGradient')].map(
      (gradient) => gradient.id,
    );
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);

    const fills = [...container.querySelectorAll('svg')].map((svg) =>
      svg.querySelector('path')?.getAttribute('fill'),
    );
    expect(fills).toEqual(ids.map((id) => `url(#${id})`));
  });

  it('merges className and passes other props through', () => {
    render(
      <Sparkline
        data={[3, 5, 4, 8]}
        className="h-8 w-24 text-primary"
        data-testid="sparkline"
      />,
    );

    const svg = screen.getByTestId('sparkline');
    expect(svg).toHaveClass('h-8');
    expect(svg).toHaveClass('text-primary');
  });
});
