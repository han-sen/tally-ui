import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BarChart } from './BarChart';

const days = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    label: `Aug ${i + 1}`,
    value: 100 + i * 10,
  }));

// X labels are the only text drawn in the bottom margin (y = 252 + 16).
const xLabelsOf = (container: HTMLElement) =>
  [...container.querySelectorAll('svg text[y="268"]')].map(
    (text) => text.textContent,
  );

const bars = (container: HTMLElement) => [
  ...container.querySelectorAll<SVGRectElement>('svg rect'),
];

describe('BarChart', () => {
  it('is exposed as an image named by its label', () => {
    render(<BarChart data={days(3)} label="Daily views for Camry" />);

    expect(
      screen.getByRole('img', { name: 'Daily views for Camry' }),
    ).toBeInTheDocument();
  });

  it('draws one bar per drawable value', () => {
    const { container } = render(<BarChart data={days(7)} label="Views" />);
    expect(bars(container)).toHaveLength(7);
  });

  it('draws bars in proportion to their values', () => {
    const { container } = render(
      <BarChart
        data={[
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
        ]}
        label="Views"
      />,
    );

    const [a, b] = bars(container);
    const heightA = Number(a?.getAttribute('height'));
    const heightB = Number(b?.getAttribute('height'));
    expect(heightB / heightA).toBeCloseTo(2);
  });

  it('extends the y-axis to a round value above the tallest bar', () => {
    render(
      <BarChart
        data={[
          { label: 'A', value: 500 },
          { label: 'B', value: 1995 },
        ]}
        label="Views"
      />,
    );

    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('leaves an empty slot for a missing value instead of closing the gap', () => {
    const data = days(5);
    data[2] = { label: 'Aug 3', value: Number.NaN };
    const { container } = render(<BarChart data={data} label="Views" />);

    const drawn = bars(container);
    expect(drawn).toHaveLength(4);

    const [x0, x1, x3] = [
      drawn[0],
      drawn[1],
      drawn[2],
    ].map((rect) => Number(rect?.getAttribute('x')));
    const slot = (x1 as number) - (x0 as number);
    // The bar after the gap sits two slots after the bar before it.
    expect((x3 as number) - (x1 as number)).toBeCloseTo(slot * 2);
  });

  it('shows an empty state when nothing is drawable', () => {
    const { container, rerender } = render(<BarChart data={[]} label="Views" />);
    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();

    rerender(
      <BarChart data={[{ label: 'A', value: Number.NaN }]} label="Views" />,
    );
    expect(screen.getByText('No data to display')).toBeInTheDocument();
  });

  it('shows every x label when they fit and thins them when they do not', () => {
    const { container, rerender } = render(
      <BarChart data={days(7)} label="Views" />,
    );
    expect(xLabelsOf(container)).toHaveLength(7);

    rerender(<BarChart data={days(30)} label="Views" />);
    const thinned = xLabelsOf(container);
    expect(thinned.length).toBeLessThan(30);
    expect(thinned[0]).toBe('Aug 1');
  });

  it('applies formatValue to the y-axis ticks and formatLabel to the x labels', () => {
    const { container } = render(
      <BarChart
        data={days(3)}
        label="Views"
        formatValue={(v) => `$${v}`}
        formatLabel={(l) => l.replace('Aug ', 'Day ')}
      />,
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(xLabelsOf(container)).toEqual(['Day 1', 'Day 2', 'Day 3']);
  });

  it('describes each bar in a tooltip using the formatters', () => {
    render(
      <BarChart
        data={[
          { label: 'Aug 1', value: 1500 },
          { label: 'Aug 2', value: 1800 },
        ]}
        label="Views"
        formatValue={(v) => v.toLocaleString('en-US')}
      />,
    );

    expect(screen.getByText('Aug 1: 1,500')).toBeInTheDocument();
  });

  it('does not pass the formatters through to the svg element', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { container } = render(
      <BarChart
        data={days(3)}
        label="Views"
        formatValue={(v) => v}
        formatLabel={(l) => l}
      />,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('svg')).not.toHaveAttribute('formatvalue');
    consoleError.mockRestore();
  });

  it('merges a consumer className over the default color and passes props through', () => {
    render(
      <BarChart
        data={days(3)}
        label="Views"
        className="w-full text-tally-success-foreground"
        data-testid="chart"
      />,
    );

    const chart = screen.getByTestId('chart');
    expect(chart).toHaveClass('w-full');
    expect(chart).toHaveClass('text-tally-success-foreground');
    expect(chart).not.toHaveClass('text-tally-primary');
  });
});
