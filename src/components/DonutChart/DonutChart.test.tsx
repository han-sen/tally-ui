import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { latestObserver, mockElementWidth } from '../../test/resizeObserver';
import { DonutChart, type DonutChartProps } from './DonutChart';

// 11,740 in total, so the shares are 41%, 36% and 23%.
const carriers = [
  { label: 'Northline', value: 4820 },
  { label: 'Coastal Freight', value: 4190 },
  { label: 'Summit Express', value: 2730 },
];

const renderChart = (props: Partial<DonutChartProps> = {}) =>
  render(
    <DonutChart
      data={carriers}
      label="Share of shipments by carrier"
      formatValue={(v) => v.toLocaleString('en-US')}
      {...props}
    />,
  );

const getChart = () =>
  screen.getByRole('img', { name: 'Share of shipments by carrier' });

const slices = (container: HTMLElement) => [
  ...container.querySelectorAll('path'),
];

const status = () => screen.getByRole('status');

describe('DonutChart', () => {
  mockElementWidth(400);

  // Step 1: static donut
  it('is an image named by its label', () => {
    renderChart();

    expect(getChart()).toBeInTheDocument();
  });

  it('draws one slice per drawable value', () => {
    const { container } = renderChart();

    expect(slices(container)).toHaveLength(3);
  });

  it('leaves out NaN and infinite values', () => {
    const { container } = renderChart({
      data: [
        ...carriers,
        { label: 'Harbor Logistics', value: NaN },
        { label: 'Ridgeway Transport', value: Infinity },
      ],
    });

    expect(slices(container)).toHaveLength(3);
  });

  it('renders an EmptyState when the total is 0', () => {
    renderChart({
      data: [
        { label: 'Northline', value: 0 },
        { label: 'Coastal Freight', value: 0 },
      ],
    });

    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders an EmptyState with no data', () => {
    renderChart({ data: [] });

    expect(screen.getByText('No data to display')).toBeInTheDocument();
  });

  it('draws a circle that fits the smaller of width and height', () => {
    // 400 wide and 100 tall, so the outer radius is 50. The first slice's
    // path starts at the top of the ring.
    const { container } = renderChart({ height: 100 });

    expect(slices(container)[0]).toHaveAttribute(
      'd',
      expect.stringMatching(/^M0,-50A50,50/),
    );
  });

  it('draws nothing until it has a width, then redraws on resize', () => {
    const { container } = renderChart();
    latestObserver().report(0);
    expect(slices(container)).toHaveLength(0);

    latestObserver().report(300);
    expect(slices(container)).toHaveLength(3);
  });

  // Step 2: keyboard and announcements
  it('moves between slices with the arrow keys, wrapping around', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    expect(getChart()).toHaveFocus();

    // With nothing active, ArrowLeft starts from the last slice.
    await user.keyboard('{ArrowLeft}');
    expect(status()).toHaveTextContent(/^Summit Express/);

    await user.keyboard('{ArrowRight}');
    expect(status()).toHaveTextContent(/^Northline/);

    await user.keyboard('{ArrowLeft}');
    expect(status()).toHaveTextContent(/^Summit Express/);
  });

  it('jumps to the first and last slices with Home and End', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{End}');
    expect(status()).toHaveTextContent(/^Summit Express/);

    await user.keyboard('{Home}');
    expect(status()).toHaveTextContent(/^Northline/);
  });

  it('announces the active slice with its value and share', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(status()).toHaveTextContent('Coastal Freight: 4,190 (36%)');
  });

  it('announces the raw value when there is no formatValue', async () => {
    const user = userEvent.setup();
    renderChart({ formatValue: undefined });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(status()).toHaveTextContent('Northline: 4820 (41%)');
  });

  it('clears the active slice with Escape and on blur', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.tab();
    await user.keyboard('{ArrowRight}{Escape}');
    expect(status()).toBeEmptyDOMElement();

    await user.keyboard('{ArrowRight}');
    await user.tab();
    expect(status()).toBeEmptyDOMElement();
  });

  // Steps 3 and 4: pointer and tooltip
  it('shows a tooltip for the slice under the pointer', () => {
    const { container } = renderChart();

    fireEvent.pointerEnter(slices(container)[2]!);

    expect(screen.getByText('Summit Express')).toBeInTheDocument();
    expect(screen.getByText('2,730 (23%)')).toBeInTheDocument();
  });

  it('opens the tooltip away from the center', () => {
    const { container } = renderChart();

    // Northline covers the right of the ring, Coastal Freight the bottom left.
    fireEvent.pointerEnter(slices(container)[0]!);
    expect(container.querySelector('[data-side]')).toHaveAttribute(
      'data-side',
      'right',
    );

    fireEvent.pointerEnter(slices(container)[1]!);
    expect(container.querySelector('[data-side]')).toHaveAttribute(
      'data-side',
      'left',
    );
  });

  it('hides the tooltip when the pointer leaves', () => {
    const { container } = renderChart();
    const slice = slices(container)[2]!;

    fireEvent.pointerEnter(slice);
    fireEvent.pointerLeave(slice);

    expect(screen.queryByText('2,730 (23%)')).not.toBeInTheDocument();
  });

  it('does not announce slices reached with the pointer', () => {
    const { container } = renderChart();

    fireEvent.pointerEnter(slices(container)[0]!);

    expect(status()).toBeEmptyDOMElement();
  });
});
