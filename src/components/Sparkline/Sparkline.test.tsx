import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Sparkline } from './Sparkline';

// The paths are the gradient area, the glow, then the line on top.
const linePathOf = (container: HTMLElement) =>
  [...container.querySelectorAll('svg path')].at(-1)?.getAttribute('d') ?? '';

// The line is inset from the top and bottom to leave room for the glow, so it
// runs from y = 25.5 (lowest value) up to y = 4 (highest).
const LINE_BOTTOM = 25.5;
const LINE_MIDDLE = (25.5 + 4) / 2;

describe('Sparkline', () => {
  it('draws an area and a line inside a fixed coordinate space', () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 7, 12]} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 32');

    for (const path of container.querySelectorAll('svg path')) {
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
    expect(d.startsWith(`M0,${LINE_MIDDLE}`)).toBe(true);
    expect(d).not.toContain('NaN');
  });

  it('keeps zero values instead of dropping them', () => {
    const { container } = render(<Sparkline data={[0, 4, 0, 6]} />);

    expect(linePathOf(container).startsWith(`M0,${LINE_BOTTOM}`)).toBe(true);
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
        className="h-8 w-24 text-tally-primary"
        data-testid="sparkline"
      />,
    );

    const svg = screen.getByTestId('sparkline');
    expect(svg).toHaveClass('h-8');
    expect(svg).toHaveClass('text-tally-primary');
  });

  it('defaults to filling the width of its container', () => {
    render(<Sparkline data={[3, 5, 4, 8]} data-testid="sparkline" />);

    const svg = screen.getByTestId('sparkline');
    expect(svg).toHaveClass('w-full');
    expect(svg).toHaveClass('h-8');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
  });

  it('lets a consumer override the default width', () => {
    render(
      <Sparkline
        data={[3, 5, 4, 8]}
        className="w-24"
        data-testid="sparkline"
      />,
    );

    const svg = screen.getByTestId('sparkline');
    expect(svg).toHaveClass('w-24');
    expect(svg).not.toHaveClass('w-full');
  });
});
