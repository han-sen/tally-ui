import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { latestObserver, mockElementWidth } from '../../test/resizeObserver';
import { LineChart } from './LineChart';

const xLabels = ['Aug 1', 'Aug 2', 'Aug 3'];

const twoSeries = [
  { name: 'Toyota Camry', values: [1364, 1402, 1388] },
  { name: 'Honda Accord', values: [1210, 1198, 1250] },
];

function renderChart(props: Partial<Parameters<typeof LineChart>[0]> = {}) {
  return render(
    <LineChart
      xLabels={xLabels}
      series={twoSeries}
      label="Daily views for two sedans"
      formatValue={(v) => v.toLocaleString('en-US')}
      {...props}
    />,
  );
}

function getChart() {
  return screen.getByRole('img', { name: 'Daily views for two sedans' });
}

// jsdom has no layout, so place the SVG at the left edge of the page. At the
// mocked 600px width, the plot starts at x = 40 and the three points sit at
// 40, 312 and 584.
function mockChartRect(svg: Element) {
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    width: 600,
  } as DOMRect);
}

describe('LineChart', () => {
  // 600 is the width the chart used to draw at, so the coordinates in these
  // tests are the same before and after it started measuring its container.
  mockElementWidth(600);

  it('is an image named by its label', () => {
    render(
      <LineChart
        xLabels={xLabels}
        series={[{ name: 'Toyota Camry', values: [1, 2, 3] }]}
        label="Daily views for Toyota Camry"
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Daily views for Toyota Camry' }),
    ).toBeInTheDocument();
  });

  // Step 1: static chart
  it('anchors the first and last x labels inside the plot', () => {
    render(
      <LineChart
        xLabels={xLabels}
        series={[{ name: 'Toyota Camry', values: [1, 2, 3] }]}
        label="Daily views for Toyota Camry"
      />,
    );

    expect(screen.getByText('Aug 1')).toHaveAttribute('text-anchor', 'start');
    expect(screen.getByText('Aug 2')).toHaveAttribute('text-anchor', 'middle');
    expect(screen.getByText('Aug 3')).toHaveAttribute('text-anchor', 'end');
  });

  it('draws one line per series', () => {
    const { container } = renderChart();

    expect(container.querySelectorAll('path')).toHaveLength(2);
  });

  it('colors series with the chart tokens in order, repeating after four', () => {
    const { container } = renderChart({
      series: Array.from({ length: 5 }, (_, i) => ({
        name: `Series ${i + 1}`,
        values: [1, 2, 3],
      })),
    });
    const paths = container.querySelectorAll('path');

    expect(paths[0]).toHaveClass('text-tally-chart-1');
    expect(paths[3]).toHaveClass('text-tally-chart-4');
    expect(paths[4]).toHaveClass('text-tally-chart-1');
  });

  it('uses a series colorClassName over the default color', () => {
    const { container } = renderChart({
      series: [
        { name: 'Toyota Camry', values: [1, 2, 3], colorClassName: 'text-x' },
      ],
    });
    const path = container.querySelector('path');

    expect(path).toHaveClass('text-x');
    expect(path).not.toHaveClass('text-tally-chart-1');
  });

  it('leaves a gap for a NaN value', () => {
    const { container } = renderChart({
      xLabels: ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5'],
      series: [{ name: 'Toyota Camry', values: [1, 2, NaN, 4, 5] }],
    });
    const d = container.querySelector('path')?.getAttribute('d') ?? '';

    // Each run of drawable points starts with its own move command.
    expect(d.match(/M/g)).toHaveLength(2);
  });

  it.each([
    ['a single value', ['Aug 1'], [5]],
    ['a value between gaps', xLabels, [NaN, 5, NaN]],
    ['a value at the start before a gap', xLabels, [5, NaN, 7]],
  ])('draws a circle for %s', (_, labels, values) => {
    const { container } = renderChart({
      xLabels: labels,
      series: [{ name: 'Toyota Camry', values }],
    });

    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('draws no circles on a connected line by default', () => {
    const { container } = renderChart();

    expect(container.querySelectorAll('circle')).toHaveLength(0);
  });

  it('draws a circle on every drawable point with showPoints', () => {
    const { container } = renderChart({
      showPoints: true,
      series: [{ name: 'Toyota Camry', values: [1, NaN, 3] }],
    });

    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('scales the y-axis to the largest value across all series', () => {
    renderChart({
      series: [
        { name: 'Toyota Camry', values: [10, 20, 30] },
        { name: 'Honda Accord', values: [40, 90, 60] },
      ],
    });

    // nice(5) rounds the 90 maximum up to the 100 tick.
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('formats y-axis ticks with formatValue', () => {
    renderChart({ formatValue: (v) => `${v / 1000}k` });

    // The 0–1,402 domain rounds to ticks every 500.
    expect(screen.getByText('1k')).toBeInTheDocument();
  });

  it('formats x labels with formatLabel', () => {
    renderChart({ formatLabel: (label) => label.replace('Aug ', '') });

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('Aug 2')).not.toBeInTheDocument();
  });

  it('shows an empty state when no series has a drawable value', () => {
    renderChart({ series: [{ name: 'Toyota Camry', values: [NaN, NaN] }] });

    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('passes other props to the wrapper and merges className', () => {
    const { container } = renderChart({
      className: 'h-64',
      id: 'views-chart',
    });
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveAttribute('id', 'views-chart');
    expect(wrapper).toHaveClass('relative', 'h-64');
  });

  // Sizing
  it('draws at the measured width and the given height', () => {
    renderChart({ height: 160 });
    const svg = getChart();

    expect(svg).toHaveAttribute('width', '600');
    expect(svg).toHaveAttribute('height', '160');
    expect(svg).toHaveAttribute('viewBox', '0 0 600 160');
  });

  it('sets the height on the wrapper and keeps the caller style', () => {
    const { container } = renderChart({
      height: 160,
      style: { maxWidth: 800 },
    });

    expect(container.firstElementChild).toHaveStyle({
      height: '160px',
      maxWidth: '800px',
    });
  });

  it('draws nothing until it has a width, but stays named', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(0);
    const { container } = renderChart();

    expect(getChart()).toBeInTheDocument();
    expect(container.querySelectorAll('path')).toHaveLength(0);
    expect(container.querySelectorAll('text')).toHaveLength(0);
  });

  it('redraws when the container is resized', () => {
    renderChart();

    latestObserver().report(400);

    expect(getChart()).toHaveAttribute('viewBox', '0 0 400 300');
  });

  // Step 2: crosshair and tooltip
  it('shows a crosshair and tooltip for the point under the pointer', () => {
    renderChart();
    const svg = getChart();
    mockChartRect(svg);

    // 300 is just left of the middle point at 312, so it snaps to Aug 2.
    fireEvent.pointerMove(svg, { clientX: 300 });

    expect(screen.getByTestId('crosshair')).toHaveAttribute('x1', '272');
    expect(screen.getByText('1,402')).toBeInTheDocument();
    expect(screen.getByText('1,198')).toBeInTheDocument();
  });

  it('snaps to the nearest end when the pointer is in a margin', () => {
    renderChart();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 5 });

    expect(screen.getByTestId('crosshair')).toHaveAttribute('x1', '0');
  });

  it('hides the tooltip when the pointer leaves', () => {
    renderChart();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 300 });
    fireEvent.pointerLeave(svg);

    expect(screen.queryByTestId('crosshair')).not.toBeInTheDocument();
    expect(screen.queryByText('1,402')).not.toBeInTheDocument();
  });

  it('does not announce points reached with the pointer', () => {
    renderChart();
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 300 });

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('shows "no data" in the tooltip for a missing value', () => {
    renderChart({
      series: [{ name: 'Toyota Camry', values: [1, NaN, 3] }],
    });
    const svg = getChart();
    mockChartRect(svg);

    fireEvent.pointerMove(svg, { clientX: 312 });

    expect(screen.getAllByText(/no data/)).not.toHaveLength(0);
  });

  // Step 3: keyboard and announcements
  it('moves between points with ArrowLeft and ArrowRight, stopping at the ends', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    expect(getChart()).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent(/^Aug 1:/);

    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent(/^Aug 3:/);

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status')).toHaveTextContent(/^Aug 2:/);
  });

  it('jumps to the first and last point with Home and End', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('status')).toHaveTextContent(/^Aug 3:/);

    await user.keyboard('{Home}');
    expect(screen.getByRole('status')).toHaveTextContent(/^Aug 1:/);
  });

  it('clears the active point with Escape and on blur', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{ArrowRight}{Escape}');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.keyboard('{ArrowRight}');
    await user.tab();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('announces the active point in a live region', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Aug 1: Toyota Camry 1,364, Honda Accord 1,210',
    );
  });
});
