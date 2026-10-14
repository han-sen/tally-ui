import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { latestObserver, mockElementWidth } from '../../test/resizeObserver';
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

const threeDays = [
  { label: 'Aug 1', value: 1500 },
  { label: 'Aug 2', value: 1800 },
  { label: 'Aug 3', value: 1200 },
];

const renderThreeDays = (data = threeDays) =>
  render(
    <BarChart
      data={data}
      label="Orders"
      formatValue={(v) => v.toLocaleString('en-US')}
    />,
  );

const getChart = () => screen.getByRole('img', { name: 'Orders' });

// jsdom has no layout, so place the SVG at the left edge of the page. At the
// mocked 600px width, three bars are 170px apart with centers at x = 142, 312
// and 482, and the first gap runs from 210 to 244.
function mockChartRect(svg: Element) {
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    width: 600,
  } as DOMRect);
}

const bars = (container: HTMLElement) => [
  ...container.querySelectorAll<SVGRectElement>('svg rect'),
];

describe('BarChart', () => {
  // 600 is the width the chart used to draw at, so the coordinates in these
  // tests are the same before and after it started measuring its container.
  mockElementWidth(600);

  it('is exposed as an image named by its label', () => {
    render(<BarChart data={days(3)} label="Orders per day" />);

    expect(
      screen.getByRole('img', { name: 'Orders per day' }),
    ).toBeInTheDocument();
  });

  it('draws one bar per drawable value', () => {
    const { container } = render(<BarChart data={days(7)} label="Orders" />);
    expect(bars(container)).toHaveLength(7);
  });

  it('draws bars in proportion to their values', () => {
    const { container } = render(
      <BarChart
        data={[
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
        ]}
        label="Orders"
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
        label="Orders"
      />,
    );

    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('leaves an empty slot for a missing value instead of closing the gap', () => {
    const data = days(5);
    data[2] = { label: 'Aug 3', value: Number.NaN };
    const { container } = render(<BarChart data={data} label="Orders" />);

    const drawn = bars(container);
    expect(drawn).toHaveLength(4);

    const [x0, x1, x3] = [drawn[0], drawn[1], drawn[2]].map((rect) =>
      Number(rect?.getAttribute('x')),
    );
    const slot = (x1 as number) - (x0 as number);
    // The bar after the gap sits two slots after the bar before it.
    expect((x3 as number) - (x1 as number)).toBeCloseTo(slot * 2);
  });

  it('shows an empty state when nothing is drawable', () => {
    const { container, rerender } = render(
      <BarChart data={[]} label="Orders" />,
    );
    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();

    rerender(
      <BarChart data={[{ label: 'A', value: Number.NaN }]} label="Orders" />,
    );
    expect(screen.getByText('No data to display')).toBeInTheDocument();
  });

  it('shows every x label when they fit and thins them when they do not', () => {
    const { container, rerender } = render(
      <BarChart data={days(7)} label="Orders" />,
    );
    expect(xLabelsOf(container)).toHaveLength(7);

    rerender(<BarChart data={days(30)} label="Orders" />);
    const thinned = xLabelsOf(container);
    expect(thinned.length).toBeLessThan(30);
    expect(thinned[0]).toBe('Aug 1');
  });

  it('applies formatValue to the y-axis ticks and formatLabel to the x labels', () => {
    const { container } = render(
      <BarChart
        data={days(3)}
        label="Orders"
        formatValue={(v) => `$${v}`}
        formatLabel={(l) => l.replace('Aug ', 'Day ')}
      />,
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(xLabelsOf(container)).toEqual(['Day 1', 'Day 2', 'Day 3']);
  });

  it('shows a tooltip for the bar under the pointer', () => {
    renderThreeDays();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 312 });

    expect(screen.getByText('Aug 2', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('1,800', { selector: 'p' })).toBeInTheDocument();
  });

  it('picks the nearer bar when the pointer is in a gap', () => {
    renderThreeDays();
    const svg = getChart();
    mockChartRect(svg);

    // The gap between the first two bars is split at its middle, 227.
    fireEvent.pointerMove(svg, { clientX: 220 });
    expect(screen.getByText('1,500', { selector: 'p' })).toBeInTheDocument();

    fireEvent.pointerMove(svg, { clientX: 235 });
    expect(screen.getByText('1,800', { selector: 'p' })).toBeInTheDocument();
  });

  it('snaps to the nearest end when the pointer is in a margin', () => {
    renderThreeDays();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 5 });
    expect(screen.getByText('1,500', { selector: 'p' })).toBeInTheDocument();

    fireEvent.pointerMove(svg, { clientX: 595 });
    expect(screen.getByText('1,200', { selector: 'p' })).toBeInTheDocument();
  });

  it('hides the tooltip when the pointer leaves', () => {
    renderThreeDays();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 312 });
    fireEvent.pointerLeave(svg);

    expect(
      screen.queryByText('1,800', { selector: 'p' }),
    ).not.toBeInTheDocument();
  });

  it('does not announce bars reached with the pointer', () => {
    renderThreeDays();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 312 });

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('moves between bars with the arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    renderThreeDays();

    await user.tab();
    expect(getChart()).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent('Aug 1: 1,500');

    await user.keyboard('{End}');
    expect(screen.getByRole('status')).toHaveTextContent('Aug 3: 1,200');

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status')).toHaveTextContent('Aug 2: 1,800');

    await user.keyboard('{Home}');
    expect(screen.getByRole('status')).toHaveTextContent('Aug 1: 1,500');
  });

  it('stops on a missing value and announces it as no data', async () => {
    const user = userEvent.setup();
    renderThreeDays([
      { label: 'Aug 1', value: 1500 },
      { label: 'Aug 2', value: NaN },
      { label: 'Aug 3', value: 1200 },
    ]);

    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(screen.getByRole('status')).toHaveTextContent('Aug 2: no data');
  });

  it('clears the active bar with Escape and on blur', async () => {
    const user = userEvent.setup();
    renderThreeDays();

    await user.tab();
    await user.keyboard('{ArrowRight}{Escape}');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.keyboard('{ArrowRight}');
    await user.tab();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('does not pass the formatters through to the DOM', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { container } = render(
      <BarChart
        data={days(3)}
        label="Orders"
        formatValue={(v) => v}
        formatLabel={(l) => l}
      />,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(container.firstElementChild).not.toHaveAttribute('formatvalue');
    consoleError.mockRestore();
  });

  it('merges a consumer className over the default color and passes props through', () => {
    render(
      <BarChart
        data={days(3)}
        label="Orders"
        className="w-full text-tally-success-fg"
        data-testid="chart"
      />,
    );

    const chart = screen.getByTestId('chart');
    expect(chart).toHaveClass('w-full');
    expect(chart).toHaveClass('text-tally-success-fg');
    expect(chart).not.toHaveClass('text-tally-primary');
  });

  it('draws at the measured width and the given height', () => {
    render(<BarChart data={days(3)} label="Orders" height={160} />);
    const svg = screen.getByRole('img', { name: 'Orders' });

    expect(svg).toHaveAttribute('width', '600');
    expect(svg).toHaveAttribute('height', '160');
    expect(svg).toHaveAttribute('viewBox', '0 0 600 160');
  });

  it('sets the height on the wrapper and keeps the caller style', () => {
    const { container } = render(
      <BarChart
        data={days(3)}
        label="Orders"
        height={160}
        style={{ maxWidth: 800 }}
      />,
    );

    expect(container.firstElementChild).toHaveStyle({
      height: '160px',
      maxWidth: '800px',
    });
  });

  it('draws nothing until it has a width, but stays named', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(0);
    const { container } = render(<BarChart data={days(3)} label="Orders" />);

    expect(screen.getByRole('img', { name: 'Orders' })).toBeInTheDocument();
    expect(bars(container)).toHaveLength(0);
    expect(container.querySelectorAll('text')).toHaveLength(0);
  });

  it('redraws when the container is resized', () => {
    render(<BarChart data={days(3)} label="Orders" />);

    latestObserver().report(400);

    expect(screen.getByRole('img', { name: 'Orders' })).toHaveAttribute(
      'viewBox',
      '0 0 400 300',
    );
  });
});
